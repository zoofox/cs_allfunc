
  var FADE_TIME = 150; // ms
  var TYPING_TIMER_LENGTH = 400; // ms
  var COLORS = [
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
  ];
  var cuser = $('form').data('username')
  // Initialize variables
  var $window = $(window);
  var $usernameInput = $('.usernameInput'); // Input for username
  var $messages = $('.messages'); // Messages area
  var $inputMessage = $('.inputMessage'); // Input message input box

  var $loginPage = $('.login.page'); // The login page
  var $chatPage = $('.chat.page'); // The chatroom page

  // Prompt for setting a username
  var username;
  var connected = false;
  var typing = false;
  var lastTypingTime;
  var $currentInput = $usernameInput.focus();

  var socket = io();


  function addParticipantsMessage (data) {
    // var message = '';
    // if (data.numUsers === 1) {
    //   message += "当前 1 人在线";
    // } else {
    //   message += "当前有 " + data.numUsers + " 人在线";
    // }
    // log(message);
     
  }

  // Sets the client's username
  function setUsername (name) {
    // username = cleanInput($usernameInput.val().trim());
    username = name;
    // console.log('add user:'+username)
    // If the username is valid
    if (username) {
      $loginPage.fadeOut();
      $chatPage.show();
      $loginPage.off('click');
      $currentInput = $inputMessage.focus();
    //  console.log('add user:'+username)
      // Tell the server your username
      socket.emit('add user', username);
    }
  }

  // Sends a chat message
  function sendMessage () {
    var message = $inputMessage.val();
    // Prevent markup from being injected into the message
    message = cleanInput(message);
    // if there is a non-empty message and a socket connection
    if (message && connected) {
      $inputMessage.val('');
      addChatMessage({
        username: username,
        message: message
      });
      // tell server to execute 'new message' and send along one parameter
      socket.emit('new message', message);
    }
  }

  // Log a message
  function log (message, options) {
    var $el = $('<li>').addClass('log').text(message);
    addMessageElement($el, options);
  }

  // Adds the visual chat message to the message list
  function addChatMessage (data, options) {
    // Don't fade the message in if there is an 'X was typing'
   
    if(data.username == username || data.username =='系统消息'){ //只能看到自己消息和系统消息
          var $typingMessages = getTypingMessages(data);
          options = options || {};
          if ($typingMessages.length !== 0) {
            options.fade = false;
            $typingMessages.remove();
          }

          var $usernameDiv = $('<span class="username"/>')
            .text(data.username)
            .css('color', getUsernameColor(data.username));
          var $messageBodyDiv = $('<span class="messageBody">')
            .text(data.message);

          var typingClass = data.typing ? 'typing' : '';
          var $messageDiv = $('<li class="message"/>')
            .data('username', data.username)
            .addClass(typingClass)
            .append($usernameDiv, $messageBodyDiv);

          //addMessageElement($messageDiv, options);  阅读机器人隐藏
   }

  }

  // Adds the visual chat typing message
  function addChatTyping (data) {
    data.typing = true;
    data.message = 'is typing';
    addChatMessage(data);
  }

  // Removes the visual chat typing message
  function removeChatTyping (data) {
    getTypingMessages(data).fadeOut(function () {
      $(this).remove();
    });
  }

  // Adds a message element to the messages and scrolls to the bottom
  // el - The element to add as a message
  // options.fade - If the element should fade-in (default = true)
  // options.prepend - If the element should prepend
  //   all other messages (default = false)
  function addMessageElement (el, options) {
    var $el = $(el);

    // Setup default options
    if (!options) {
      options = {};
    }
    if (typeof options.fade === 'undefined') {
      options.fade = true;
    }
    if (typeof options.prepend === 'undefined') {
      options.prepend = false;
    }

    // Apply options
    if (options.fade) {
      $el.hide().fadeIn(FADE_TIME);
    }
    if (options.prepend) {
      $messages.prepend($el);
    } else {
      $messages.append($el);
    }
    // $messages[0].scrollTop = $messages[0].scrollHeight; 阅读机器人隐藏
  }

  // Prevents input from having injected markup
  function cleanInput (input) {
    return $('<div/>').text(input).text();
  }

  // Updates the typing event
  function updateTyping () {
    if (connected) {
      if (!typing) {
        typing = true;
        socket.emit('typing');
      }
      lastTypingTime = (new Date()).getTime();

      setTimeout(function () {
        var typingTimer = (new Date()).getTime();
        var timeDiff = typingTimer - lastTypingTime;
        if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
          socket.emit('stop typing');
          typing = false;
        }
      }, TYPING_TIMER_LENGTH);
    }
  }

  // Gets the 'X is typing' messages of a user
  function getTypingMessages (data) {
    return $('.typing.message').filter(function (i) {
      return $(this).data('username') === data.username;
    });
  }

  // Gets the color of a username through our hash function
  function getUsernameColor (username) {
    // Compute hash code
    var hash = 7;
    for (var i = 0; i < username.length; i++) {
       hash = username.charCodeAt(i) + (hash << 5) - hash;
    }
    // Calculate color
    var index = Math.abs(hash % COLORS.length);
    return COLORS[index];
  }

function getRoomsStr(rooms){
  var str = '';
  for(var i =0; i <rooms.length;i++){
    str+= rooms[i].room+',';
  }
 
  return str;
}

  $inputMessage.on('input', function() {
    updateTyping();
  });

  // Click events

  // Focus input when clicking anywhere on login page
  $loginPage.click(function () {
    $currentInput.focus();
  });

  // Focus input when clicking on the message input's border
  $inputMessage.click(function () {
    $inputMessage.focus();
  });

  // Socket events

  // Whenever the server emits 'login', log the login message
  socket.on('login', function (data) {
    connected = true;
    // Display the welcome message
    var message = "欢迎使用AUTO";
    log(message, {
      prepend: true
    });
    // addParticipantsMessage(data);
    // addChatMessage({
    //     username: "系统消息",
    //     message: "欢迎使用^_^"
    //   });
  });

  // Whenever the server emits 'new message', update the chat body
  socket.on('new message', function (data) {
    addChatMessage(data);
  });

  socket.on('new rooms', function (data) {

    if($('form').data('switcher') == 1){
      var checkboxs = $('input[type="checkbox"]');
      var defineLevel = [];
      var resultRooms = [];

      checkboxs.each(function(idx,check){
          if($(this).is(':checked')){
            defineLevel.push($(this).data('level'));
          }
      })

      if(defineLevel.length != 0){
        $.each(data.rooms,function(idx,room){
          if(defineLevel.indexOf(room.level) >-1){
              if(!isNaN(parseInt($('.level'+room.level).val()))){
                 if(room.watcher < parseInt($('.level'+room.level).val())){
                  resultRooms.push(room)
                }
              }
            
          }
        })
        if(resultRooms.length !=0){
                  addChatMessage({
                  username: "系统消息",
                  message: "检测到符合你设定条件的房间："+getRoomsStr(resultRooms)
                });
                var autoRooms = new Auto();
                autoRooms.rooms = resultRooms;
                autoRooms.doFateRequest(autoRooms.rooms,2);
        }

      }
      }

    
  });

  // Whenever the server emits 'user joined', log it in the chat body
  socket.on('user joined', function (data) {
    // log(data.username + ' 加入');
    addParticipantsMessage(data);
  });

  // Whenever the server emits 'user left', log it in the chat body
  socket.on('user left', function (data) {
    // log(data.username + ' left');
    addParticipantsMessage(data);
    removeChatTyping(data);
  });

  // Whenever the server emits 'typing', show the typing message
  socket.on('typing', function (data) {
    addChatTyping(data);
  });

  // Whenever the server emits 'stop typing', kill the typing message
  socket.on('stop typing', function (data) {
    removeChatTyping(data);
  });

