 $('.del').click(function(){
    var name = $(this).parent('td').data('name');
    $.ajax({
      url:'/users/del',
      type:'POST',
      data:{
        name:name
      },
      success:function(data){
        console.log(data)
        if(data.code == 0){
         location.href = location.href;
        }
      }
    })
  })


   $('.yongjiu').click(function(){
    var name = $(this).parent('td').data('name');
    $.ajax({
      url:'/users/yongjiu',
      type:'POST',
      data:{
        name:name
      },
      success:function(data){
        console.log(data)
        if(data.code == 0){
         location.href = location.href;
        }
      }
    })
  })

    $('.month').click(function(){
    var name = $(this).parent('td').data('name');
    $.ajax({
      url:'/users/month',
      type:'POST',
      data:{
        name:name
      },
      success:function(data){
        console.log(data)
        if(data.code == 0){
         location.href = location.href;
        }
      }
    })
  })



      $('.del-dx').click(function(){
      var name = $(this).parent('td').data('name');
      $.ajax({
        url:'/users/delDx',
        type:'POST',
        data:{
          name:name
        },
        success:function(data){
          console.log(data)
          if(data.code == 0){
           alert('删除答谢功能成功')
          }else{
            alert(data)
          }
        }
      })
  })



      $('.del-lt').click(function(){
      var name = $(this).parent('td').data('name');
      $.ajax({
        url:'/users/delLt',
        type:'POST',
        data:{
          name:name
        },
        success:function(data){
          console.log(data)
          if(data.code == 0){
           alert('删除聊天功能成功')
          }else{
            alert(data)
          }
        }
      })
  })


      $('.del-read').click(function(){
      var name = $(this).parent('td').data('name');
      $.ajax({
        url:'/users/delRead',
        type:'POST',
        data:{
          name:name
        },
        success:function(data){
          console.log(data)
          if(data.code == 0){
           alert('删除读弹幕功能成功')
          }else{
            alert(data)
          }
        }
      })
  })



      $('.del-danmu').click(function(){
      var name = $(this).parent('td').data('name');
      $.ajax({
        url:'/users/delDanmu',
        type:'POST',
        data:{
          name:name
        },
        success:function(data){
          console.log(data)
          if(data.code == 0){
           alert('删除弹幕机功能成功')
          }else{
            alert(data)
          }
        }
      })
  })

     $('.pwd').click(function(){
    var name = $(this).parent('td').data('name');
    var newpwd = $(this).siblings('input').val();
    console.log(newpwd)
    $.ajax({
      url:'/users/newpwd',
      type:'POST',
      data:{
        name:name,
        newpwd:newpwd
      },
      success:function(data){
        console.log(data)
        if(data.code == 0){
         location.href = location.href;
        }
      }
    })
  })

 $('.mon').click(function(){
      var name = $(this).parent('td').data('name');
      var type = $(this).data('type');
      var funcName = ['答谢','聊天','语音','弹幕机','点歌'];
      $.ajax({
        url:'/users/monFunc',
        type:'POST',
        data:{
          name:name,
          type:type  //0 答谢 1 聊天 2 语音 3 弹幕机 4 点歌
        },
        success:function(data){
          console.log(data)
          if(data.code == 0){
           alert(name+':'+funcName[type]+'更新为一月成功');
          }else{
            alert(data)
          }
        }
      })
  })

  $('.add-function').click(function(){
     var type = $(this).data('type');
    var funcName = ['答谢','聊天','语音','弹幕机','点歌'];
    var name = $(this).parent('td').data('name');
    $.ajax({
      url:'/users/addFunction',
      type:'POST',
      data:{
        name:name,
        type:type  //0 答谢 1 聊天 2 语音 3 弹幕机 4 点歌
      },
      success:function(data){
        console.log(data)
        if(data.code == 0){
         alert(name+'增加'+funcName[type]+'功能成功')
        }else{
          alert(data)
        }
      }
    })
  })

    $('.del-function').click(function(){
     var type = $(this).data('type');
    var funcName = ['答谢','聊天','语音','弹幕机','点歌'];
    var name = $(this).parent('td').data('name');
    $.ajax({
      url:'/users/delFunction',
      type:'POST',
      data:{
        name:name,
        type:type  //0 答谢 1 聊天 2 语音 3 弹幕机 4 点歌
      },
      success:function(data){
        console.log(data)
        if(data.code == 0){
         alert(name+'删除'+funcName[type]+'功能成功')
        }else{
          alert(data)
        }
      }
    })
  })

  $('.mon-function').click(function(){
     var type = $(this).data('type');
    var funcName = ['答谢','聊天','语音','弹幕机','点歌'];
    var name = $(this).parent('td').data('name');
    $.ajax({
      url:'/users/monFunction',
      type:'POST',
      data:{
        name:name,
        type:type  //0 答谢 1 聊天 2 语音 3 弹幕机 4 点歌
      },
      success:function(data){
        console.log(data)
        if(data.code == 0){
         alert(name+':'+funcName[type]+'更新为一月成功')
        }else{
          alert(data)
        }
      }
    })
  })





