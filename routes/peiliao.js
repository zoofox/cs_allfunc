var superagent = require("superagent");
var async = require("async");

var cheerio = require("cheerio");
require('superagent-proxy')(superagent);

var DM_THREAD_NUM = 1;
var bp = '';
var currentDm = '';//防止出现重复内容
var inter = null;
//热词
var hotWords = [
	'主播求露脸','666666666','23333333333','瞬间爆炸','主播，求BGM','吓死宝宝了','我的内心几乎是崩溃的','主播不要逗'
];
//玩手游开触手的回应
var defaultWordsResponse = [
	'报告，有人说脏话，被系统屏蔽了','你被触手屏蔽了，哇咔咔','哎呀，亲爱的主播，有人说脏话被屏蔽了','让你说坏话，被屏蔽了吧，哼','天网恢恢疏而不漏，某人被和谐了','你看你看，他被触手和谐了','山外有山，你的话被当敏感词了，换一条吧，亲','额，注意措辞哦~~你被和谐嘞','有人说脏话，我要报告主播大人','主播这么可爱，你为什么要发敏感词咧','某人发敏感词，我已经偷偷报警','快看，他老被和谐，好惨'
];

var keyarr = [
		'4b2e4db3949c4d7ebfe1805cdf73a3da','7a29af871a9a4f28b2b48e41539a2f49','30396c31d18c4021a7058100b0a7c9fe','432aac0f8dc0444fa7e9b01543705bac','abe69e4f4fdd4225a61398926a3e451f',
		'fa0f72cd48224b77973255b14664965f','85af2abe083c4eb88f9c6671554b8de1','259dce4dfe0e40cdb4430e8042f70e64','87d9202bf2cc4168b305edd345dce9de','4808a8232084419b9f34380a1fc8e798',
		'd0d9d4dc2ead451e8360a87a89a04b1f','d5a25c602bb5494d9f217b6d86d7a6d3','aeacf5a397a04e9aafe4c37da8350f85','715c58733470474481b0ef5621492b2d','4120ee6ee7f243f0a56020791a0af5d2',
		'245a7977e5c84bf68b6cd819bbbb95d8','329de3fedbe547c6a11af75104f64c21','7e8524d2bb8a4c258e1e1c401aa97aad','114240b5921442c3b44c7ac2b6af2f53','e6dffb710b66408a8ec9f647c3cf62ec',
		'a3b72f5245a048abac01871261804ec0','7151b23dcfe04effb5c31aebaab63a8c','f99da22c33ee49cfad1164cb1bc22aff','cce72ddd899a40bb9579b491250ffc71','a873fa612e364807b1b0653d7541e529',
		];

var peiliao={
	start:function(room,token,cookie,uid){
		peiliao.run(room,token,cookie,uid);
		inter = setInterval(function(){
			peiliao.run(room,token,cookie,uid);
		},9000)
		//room=token=cookie=content=level=null;
	},
	stop:function(){
		clearInterval(inter);
		inter=null;
	},
	getRobotUid:function(cookie,callback){
		superagent.get('http://chushou.tv/room/18222.htm')
			.set('Cookie',cookie)
			.end(function(err,res){
				if(err){
					callback(err)
				}else{
					 var $ = cheerio.load(res.text);
					 var uid = $('.cs_user').data('userid');
					callback(null,uid);
				}
			})
	}
	,
	run:function(room,token,cookie,uid){
		
		//http://chat.chushou.tv/chat/get.htm?callback=jQuery110203431987517831805_1481519549210&style=2&roomId=18920&breakpoint=379958637_1481521823644&_=1481519550817
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
							if(item.type == 1&&item.content.indexOf('JSON')==-1&&item.user.uid!=uid){//弹幕
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
								// ganxie.sendDm(room,token,cookie,dms);
								async.mapLimit(dms,DM_THREAD_NUM,function(dm,cb){
									if(dm == '玩手游，开触手！'){
										var tmp = Math.floor(Math.random()*defaultWordsResponse.length);
										var msg = defaultWordsResponse[tmp];
										 peiliao.sendDmTuling(room,token,cookie,msg);
											 setTimeout(function(){
											 	cb(null);
											 },3000)
									}else{
										peiliao.tulingApi(dm,token,function(msg){
											 peiliao.sendDmTuling(room,token,cookie,msg);
											 setTimeout(function(){
											 	cb(null);
											 },3000)
										})
									}
									
								})
								
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
	},
	tulingApi:function(info,userid,cb){
		//1765898853 keepalive 4b2e4db3949c4d7ebfe1805cdf73a3da
		//1765898853 keepalive 7a29af871a9a4f28b2b48e41539a2f49
		//1765898853 keepalive 30396c31d18c4021a7058100b0a7c9fe
		//1765898853 keepalive 432aac0f8dc0444fa7e9b01543705bac
		//1765898853 keepalive APIkey:abe69e4f4fdd4225a61398926a3e451f
		//1729023530 milo APIkey:fa0f72cd48224b77973255b14664965f
		//1729023530 milo APIkey:85af2abe083c4eb88f9c6671554b8de1
		//1729023530 milo APIkey:259dce4dfe0e40cdb4430e8042f70e64
		//1729023530 milo APIkey:87d9202bf2cc4168b305edd345dce9de
		//1729023530 milo APIkey:4808a8232084419b9f34380a1fc8e798
		//2818869238  testtest APIkey:d0d9d4dc2ead451e8360a87a89a04b1f
		//2818869238  testtest APIkey:d5a25c602bb5494d9f217b6d86d7a6d3
		//2818869238  testtest APIkey:aeacf5a397a04e9aafe4c37da8350f85
		//2818869238  testtest APIkey:715c58733470474481b0ef5621492b2d
		//2818869238  testtest APIkey:4120ee6ee7f243f0a56020791a0af5d2
		//2427403944  245a7977e5c84bf68b6cd819bbbb95d8
		//2427403944  329de3fedbe547c6a11af75104f64c21
		//2427403944  7e8524d2bb8a4c258e1e1c401aa97aad
		//2427403944  114240b5921442c3b44c7ac2b6af2f53
		//2427403944  APIkey:e6dffb710b66408a8ec9f647c3cf62ec
		//2949590832  APIkey:a3b72f5245a048abac01871261804ec0
		//2949590832  APIkey:7151b23dcfe04effb5c31aebaab63a8c
		//2949590832  APIkey:f99da22c33ee49cfad1164cb1bc22aff
		//2949590832  APIkey:cce72ddd899a40bb9579b491250ffc71
		//2949590832  APIkey:a873fa612e364807b1b0653d7541e529
		var key = keyarr[Math.floor(Math.random()*keyarr.length)];
		// console.log('key:'+key);
		superagent.post('http://www.tuling123.com/openapi/api')
			.send({key:key,info:info,userid:userid})
			.end(function(err,res){
				if(err){
					callback(null);
				}else{
					var result = JSON.parse(res.text);
					switch(result.code){
						case 100000://文本类
							cb(result.text);break;
						case 200000://链接类
							cb(result.text+result.url);break;
						case 302000://新闻类
							cb(result.list[0].article);break;
						case 308000://菜谱
							cb(result.list[0].info);break;
					}

				}
			})
	},
	sendDmTuling:function(room,token,cookie,msg){
		var now = new Date().getTime();
				if(msg == currentDm){
					msg+='~'
				}
				currentDm = msg;
				msg=null;
				
				if(hotWords.indexOf(currentDm)>-1){
					console.log('')
					var r = Math.floor(Math.random()*20);
					currentDm = (r==1)?'触手的热词，机器人宝宝不回复的哦~':currentDm;
				}
				
				console.log(currentDm);
				superagent.get('http://chat.chushou.tv/chat/send.htm?roomId='+room+'&_appEnv=1&_appSource=811&_appVersion=2.3.0.7078&_appkey=CSIos&_fromPos=4&_fromView=4&callback=jQuery110208488294710160973_1482930789514&content='+encodeURI(currentDm)+'&token='+token+'&_='+now)
					.set("Content-Type", "text/plain")
		            .set('User-Agent','Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.75 Safari/537.36')
		            .set('Referer','http://chushou.tv')
					.set("Cookie", cookie)
			        .end(function(err,r){
			        	console.log(r.text);
			        	now=null;
			      })
	}
	,
	sendDm:function(room,token,cookie,dms){
		//http://chat.chushou.tv/chat/send.htm?callback=jQuery110208193052721568579_1481522571603&roomId=21785&content=123&token=eabb7b92f9012fd5g3309d2b&_=1481522573176
		console.log('发送...');
		
		if(dms.length != 0){
			var counterdm=0;
			async.mapLimit(dms,DM_THREAD_NUM,function(dm,callback){
				var now = new Date().getTime();
				counterdm++;
				console.log(dm)
				if(dm == currentDm){
					dm+='~'
				}
				currentDm = dm;
				dm=null;
				superagent.get('http://chat.chushou.tv/chat/send.htm?roomId='+room+'&content='+encodeURI(currentDm)+'&token='+token+'&_='+now)
					.set("Cookie", cookie)
			        .end(function(err,r){
			        	console.log(r.text);
			        	now=null;
			        	if(counterdm == dms.length){
			        		dms=null;
			        		counterdm=null;
			        	}
			        	setTimeout(function(){
			        		callback(null)
			        	},3000)
			      })
			})
		}
	}
};

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

module.exports = peiliao;