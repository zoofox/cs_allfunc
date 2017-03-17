var superagent = require("superagent");
var async = require("async");
var cs = require("./cs");
var cheerio = require("cheerio");
require('superagent-proxy')(superagent);

var DM_THREAD_NUM = 1;
var bp = '';
var currentDm = '';//防止出现重复内容
var inter = null;
// var giftArr = {1:'泡泡',3:'海螺',5:'海星',6:'海马',24:'海豚',7:'珍珠',14:'美人鱼'};
var giftArr = {1:'圣诞贺卡',3:'圣诞袜',5:'圣诞帽',6:'圣诞树',24:'小雪人',7:'驯鹿',14:'圣诞老人'};

var ganxie = {
	//get token
	login:function(phone,pwd,loginCallback){
		 superagent.get('http://chushou.tv/live/list.htm')  //首先获取用户cookie以外的cookie内容
         .end(function(err,s){
          if(typeof s =='undefined'){
            loginCallback('网络异常',null)
          }else{
            t = s.header['set-cookie'];
           superagent.post('http://chushou.tv/chushou/login.htm')
            .type("json")
            .set("Content-Type", "application/x-www-form-urlencoded")
            .set('Host','chushou.tv')
            .set('User-Agent','Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.75 Safari/537.36')
            .set('Referer','http://chushou.tv')
            .send({username:phone})                                                                                
            .send({password:pwd})
            .set('Cookie',t)
            .timeout(5000)
            .end(function(err, res){

                if(err){
                	 console.log('超时')
                  ganxie.login(phone,pwd,loginCallback);
                }else{
                  if(res.text.indexOf('DOCTYPE')>-1){
                    ganxie.login(phone,pwd,loginCallback);
                  }
                  else{
                      console.log(res.text);
                      if(JSON.parse(res.text).code == '1100'){
                        loginCallback(name+'账号未在触手注册',null)
                      }else{
                       if(JSON.parse(res.text).code == '1101'){
                        loginCallback(name+'密码错误',null)
                      }else{
                      	if(JSON.parse(res.text).code == '1102'){
                        loginCallback(name+'账号不允许登陆，建议切换账号',null)
                      	}else{
                      		   var cookie = res.header['set-cookie'];
		                        cs.getToken(cookie,function(token){
		                          if(token){
		                            loginCallback(null,token,cookie)
		                          }else{
		                            loginCallback(name+'的token获取失败，代理地址问题，稍后分钟后重试',null)
		                          }
		                        })
                      	}
                        
                      }
                     
                      }
                    }
                  
                  
                }
             })
          }
           

        })
	},
	start:function(room,token,cookie,content,level){
		ganxie.stop();
		ganxie.run(room,token,cookie,content,level);
		inter = setInterval(function(){
			ganxie.run(room,token,cookie,content,level);
		},9000)
		//room=token=cookie=content=level=null;
	},
	stop:function(){
		clearInterval(inter);
		inter=null;
	}
	,
	run:function(room,token,cookie,content,level){
		console.log(new Date().toLocaleString()+',内存占用：'+process.memoryUsage().heapUsed/(1000*1000)+'MB')
		//http://chat.chushou.tv/chat/get.htm?callback=jQuery110203431987517831805_1481519549210&style=2&roomId=18920&breakpoint=379958637_1481521823644&_=1481519550817
		var now = new Date().getTime();
		// console.log('bp:'+bp)
		superagent.get('http://chat.chushou.tv/chat/get.htm?style=2&breakpoint='+bp+'&roomId='+room+'&_='+now)
			.end(function(err,res){
				now=null;
				try{
					var result = JSON.parse(res.text);
					// console.log(result);
					var items = result.data.items;
					var dms = [];
					bp = result.data.breakpoint;
					if(items){
						dms = items.map(function(item){
							if(item.type == 3){//礼物
								var giftId = item.metaInfo.gift.id;
								var nickname = item.user.nickname;
								if(nickname.indexOf('JSON') > -1){
										 nickname =JSON.parse(nickname.slice(8,-3)).content; 
								}
								if(level.indexOf(giftId) > -1){
									var randomContent = content[Math.floor(Math.random()*content.length)];
									return randomContent.replace('送礼人',nickname).replace('礼物',giftArr[giftId]);
								}else{
									return '';
								}
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
								ganxie.sendDm(room,token,cookie,dms);
							}
							
							room = token = cookie=dms=null;
						}else{
							room = token = cookie=dms=null;
						}
					}else{
						result=items=null;
						room = token = cookie=dms=null;
					}
				}catch(e){
					console.log(e)
				}
			})
	},
	sendDm:function(room,token,cookie,dms){
		//http://chat.chushou.tv/chat/send.htm?callback=jQuery110208193052721568579_1481522571603&roomId=21785&content=123&token=eabb7b92f9012fd5g3309d2b&_=1481522573176
		console.log('发送...');
		
		if(dms.length != 0){
			var counterdm=0;
			async.mapLimit(dms,DM_THREAD_NUM,function(dm,callback){
				var now = new Date().getTime();
				counterdm++;
				
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
		}else{
			room = token = cookie=dms=null;
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


ganxie.login('15558351463','xl320724',function(err,token,cookie){
        if(err){
           // res.send({"code":1,"msg":err});
           console.log(err)
        }else{
        var room = '18634101';
        var content = ['谢谢送礼人的礼物，么么','谢谢送礼人的礼物，主播爱你，么么','哎呦，谢谢土豪送礼人的礼物','谢谢送礼人的礼物，你是不是看上主播了','腻害了，谢谢送礼人的礼物','谢谢送礼人的礼物，擎天水柱就靠你啦','啦啦啦，送礼人又掏腰包送礼物啦','谢谢送礼人的礼物，抱抱','哈哈，谢谢送礼人的礼物，爱你哟','么么哒，送礼人'];
        var level = [1,3,5,6,24,7,14];

          ganxie.start(room,token,cookie,content,level);
          // res.send({"code":0,"msg":"正在运行"});
          console.log('正在运行')
        }
 });

module.exports = ganxie;