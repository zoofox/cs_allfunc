//阅读
var superagent = require("superagent");
var inter = null;
var bp = '';

var Reader = {
	io:null,
	API_KEY:'y65adZSD41pA57lWgFy7NIPL',
	SECRET_KEY:'d9f5fb3bd93bdf35e9edfb52e345a3fc'
};

// App ID: 9103140

// API Key: y65adZSD41pA57lWgFy7NIPL

// Secret Key: d9f5fb3bd93bdf35e9edfb52e345a3fc

Reader.init = function(io){
	Reader.io = io;
	Reader.getBaiduToken();
};


Reader.getBaiduToken = function(){
	superagent.get('https://openapi.baidu.com/oauth/2.0/token?grant_type=client_credentials&client_id='+Reader.API_KEY+'&client_secret='+Reader.SECRET_KEY+'&')
	//.send({grant_type:'client_credentials',client_id:Reader.API_KEY,client_secret:Reader.SECRET_KEY})
		.end(function(err,res){
			console.log(res.text);
			var result = JSON.parse(res.text);
			if(!result.error){
				Reader.access_token = result.access_token;
			}else{
				console.log(result.error)
			}
		})
}
Reader.start = function(room){
	Reader.run(room);
		inter = setInterval(function(){
			Reader.run(room);
	},9000)
}

Reader.run = function(room){
	var now = new Date().getTime();
		console.log('bp:'+bp)
		superagent.get('http://chat.chushou.tv/chat/get.htm?style=2&breakpoint='+bp+'&roomId='+room+'&_='+now)
			.end(function(err,res){
				now=null;
				try{
					var result = JSON.parse(res.text);
					var items = result.data.items;
					var dms = [];
					bp = result.data.breakpoint;
					if(items){
						dms = items.map(function(item){
							if(item.type == 1&&item.content.indexOf('JSON')==-1){//弹幕
								return item.content;
							}else{
								return '';
							}
						})
						result=items=null;

						if(dms.length != 0){
							//去重后取前3条
							dms = unique(dms).slice(0,3);
							//开始发
							if(dms.length!=0){
								Reader.sendMsg(dms.join('--------'));
							}else{
								room = token = cookie=dms=null;
							}
							
							
						}else{
							dms=null;
						}
					}else{

					}
				}catch(e){
					console.log(e)
				}
			})
}
Reader.stop = function(){
		clearInterval(inter);
		inter=null;
};

Reader.sendMsg = function(msg){
	Reader.io.emit('new dms',{
     // username: ioname,
      message: msg,
      token:Reader.access_token
   })
}

function unique(arr) {
  var ret = []
  var hash = {}

  for (var i = 0; i < arr.length; i++) {
    var item = arr[i]
    var key = typeof(item) + item
    if (hash[key] !== 1 && item) {
      ret.push(arr[i])
      hash[key] = 1
    }
  }
  hash=arr=null;
  return ret
}

module.exports = Reader;