var rqtask = {};
var superagent = require('superagent');
require('superagent-proxy')(superagent);
var cs = require('./cs');
var cookie = require('../models/cookie');
var dl = require('../models/proxy');
var async = require('async');
var threadNum  = 1;
var cookieCount= 0;
var proxyIndex = 0;

var DANMU_ACCOUNT_NUM = 30; //弹幕账号数量
var EACH_PROXY_WITH_ACCOUNT = 4;


var proxyIPArr = [];

rqtask.start = function(paopaoServer){
	cookieCount= 0;
	rqtask.run(paopaoServer);
	setInterval(function(){
		cookieCount= 0;
		rqtask.run(paopaoServer);
	},1*60*1000)
}
rqtask.run = function(paopaoServer){
	paopaoServer = '127.0.0.1';
	cookieCount = 0;
	rqtask.initProxyLib(function(arr){
		console.log(arr)
		rqtask.getRooms(paopaoServer,function(rooms){
			cookie.get(null,function(err,cks){
				for(var i = 0; i < rooms.length; i ++){
					var renqiCount  = parseInt(rooms[i].count);
					var realCount = Math.floor(renqiCount / 100);
					console.log('rc:'+realCount)
					var room  = parseInt(rooms[i].room);
					realCount = 30;
					async.mapLimit(new Array(realCount),threadNum,function(d,callback){
						console.log('cookie index: '+cookieCount)
						var ck = cks[cookieCount];
						var proxy = arr[cookieCount%5]
						// rqtask.sendHB(room,ck.cookie,callback);
						rqtask.sendDM(room,ck.cookie,ck.token,proxy,callback);
					})
				}
			})
			
		});
	})
}

rqtask.getRooms = function(paopaoServer,callback){
	superagent.get('http://'+paopaoServer+':8888/zhushou/renqiItems')
	.end(function(err,res){
		var items = JSON.parse(res.text);
		//console.log(items)
		// var roomsArr = [];
		// if(items.length != 0){
		// 	roomsArr = items.map(function(item){
		// 		return item.room;
		// 	})
		// }
		return callback(items);
	})
}
rqtask.sendDM = function(roomId,ck,token,proxy,callback){
	var nowTime = (new Date()).getTime();
	 console.log(ck)
	 var content = Math.ceil(10*Math.random());
     var nowUrl =  "http://chat.chushou.tv/chat/send.htm?roomId="+1131166+"&content="+content+"&token="+token+"&_=1480398800842&timestamp=" + nowTime;
	    	superagent.get(nowUrl)
		     .set('Cookie',ck)
		     .proxy(proxy)
		     .timeout(3000)
		     .end(function(err,data){
		     	cookieCount++;
		     	if(err){
		     		console.log('timeout')
		     		callback(null)
		     	}else{

			     	if(typeof data == 'undefined'){
			     		
			     		console.log('data undefined')
			     		callback(null)
			     	}else{
			     		try{
			     			if(JSON.parse(data.text).code == 403){
				     			console.log('data 403---------------')
				     		
			     				callback(null)
				     		}else{
				     			console.log(data.text);
					     		setTimeout(function(){
						     		callback(null)
						     	},300)
				     		}

			     		}catch(e){
			     			console.log('parse error');
			     			setTimeout(function(){
						     		callback(null)
						     	},300)
			     		}
			     		
			     		
			     	}
		     	}
		     	
		     	
		     })
	   
     
}

rqtask.sendHB = function(roomId,ck,callback){
	 var nowTime = (new Date()).getTime();
	 console.log(ck)
     var nowUrl =  "http://chushou.tv/room/heartbeat.htm?roomId=" + roomId + "&timestamp=" + nowTime;
     superagent.get(nowUrl)
     .set('Cookie',ck)
     .end(function(err,data){
     	cookieCount++;
     	console.log(data.text);
     		setTimeout(function(){
	     		callback(null)
	     	},300)
     	// rqtask.sendFlashHB(roomId,ck,function(){
     	// 	setTimeout(function(){
	     // 		callback(null)
	     // 	},300)
     	// })

     	
     })
}
//http://chushou.tv/room/flash/heartbeat.htm?_fVersion=171&_timestamp=1480320042076&roomId=40131&_sign=2762017703
rqtask.sendFlashHB = function(roomId,ck,callback){
	var nowTime = (new Date()).getTime();
     var nowUrl =  "http://chushou.tv/room/flash/heartbeat.htm?_fVersion=171&roomId="+roomId+"&_sign=2762017703&timestamp=" + nowTime;
     superagent.get(nowUrl)
     .set('Cookie',ck)
     .end(function(err,data){
     	cookieCount++;
     	console.log(data.text);
     	
     		callback(null)
     	
     })
}

rqtask.initProxyLib = function(callback){
	proxyIPArr = [];
	var ipCount = Math.ceil(DANMU_ACCOUNT_NUM / EACH_PROXY_WITH_ACCOUNT);
	dl.get(null,function(err,docs){
		if(err){
			console.log(err);
			setTimeout(function(){
				rqtask.initProxyLib(callback);
			},3000)
		}else{
			if(docs.length == 0){
				setTimeout(function(){
					rqtask.initProxyLib(callback);
				},3000)
			}else{
				console.log(docs.slice(0,ipCount))
				proxyIPArr = docs.slice(0,ipCount).map(function(doc){
					return 'http://'+doc.address;
				})
				return callback(proxyIPArr);
			}
		}
	})
	
}
module.exports = rqtask;