var danmu ={};
var async = require('async');
var superagent = require('superagent');
require('superagent-proxy')(superagent);

var DANMU_ACCOUNT_NUM = 50; //用于弹幕的账号数量
var EACH_PROXY_WITH_ACCOUNT = 4; //单个IP的账号数量
var THREAD_NUM =3; //线程数

var cookieCount = 0;

danmu.start = function(room,content,cks,ips){
	var realCks = cks.slice(0,DANMU_ACCOUNT_NUM);
	var realIps = ips.slice(0,Math.ceil(DANMU_ACCOUNT_NUM / EACH_PROXY_WITH_ACCOUNT));
	cookieCount = 0;
	var contentLength = content.length;
	async.mapLimit(new Array(DANMU_ACCOUNT_NUM),THREAD_NUM,function(d,callback){
		console.log('cookie index: '+cookieCount)
		var ck = cks[cookieCount];
		var proxy = realIps[cookieCount % EACH_PROXY_WITH_ACCOUNT] //获取当前COOKIE账号对应的代理地址
		var currentContent = content[Math.floor(Math.random() * contentLength)];
		currentContent = (currentContent == '')?'6666666':currentContent;
		danmu.sendDM(room,currentContent,ck.cookie,ck.token,proxy,callback);
	})
}

danmu.sendDM = function(roomId,content,ck,token,proxy,callback){
	 var nowTime = (new Date()).getTime();
     var nowUrl = 'http://chat.chushou.tv/chat/send.htm?roomId='+roomId+'&_appEnv=1&_appSource=811&_appVersion=2.3.0.7078&_appkey=CSIos&_fromPos=4&_fromView=4&callback=jQuery110208488294710160973_1482930789514&content='+encodeURI(content)+'&token='+token+'&_='+nowTime;
	    	superagent.get(nowUrl)
	    	.set("Content-Type", "text/plain")
		            // .set('Host','chushou.tv')
		            .set('User-Agent','Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.75 Safari/537.36')
		            .set('Referer','http://chushou.tv')
		     .set('Cookie',ck)
		     .proxy(proxy)
		     .timeout(5000)
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
						     	},1500)
				     		}

			     		}catch(e){
			     			console.log('parse error');
			     			setTimeout(function(){
						     		callback(null)
						     	},1500)
			     		}
			     		
			     		
			     	}
		     	}
		     	
		     	
		     })
	   
     
}

module.exports = danmu;