var dl=require('../models/proxy');
var superagent = require("superagent");
var cheerio = require("cheerio");
require('superagent-proxy')(superagent);
var proxyIndex = 0;
var cs ={};

cs.login = function(name,pwd,loginCallback){
  cs.getProxy(proxyIndex,function(proxy){
    console.log('get proxy:'+proxy)
    if(!proxy){
    proxyIndex++;
    console.log('获取代理失败，开始再次尝试')
    cs.login(name,pwd,loginCallback);
    }else if(proxy == 1){
      loginCallback('代理暂时不可用，十分钟以后再尝试运行',null)
      cs.login(name,pwd,loginCallback);
    }else{
      superagent.get('http://chushou.tv/live/list.htm')  //首先获取用户cookie以外的cookie内容
         .end(function(err,s){
          if(typeof s =='undefined'){
            loginCallback('网络异常',null)
          }else{
            t = s.header['set-cookie'];
            console.log('first cookie:'+t)
           superagent.post('http://chushou.tv/chushou/login.htm')
            .type("json")
            .set("Content-Type", "application/x-www-form-urlencoded")
            .set('Host','chushou.tv')
            .set('User-Agent','Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.75 Safari/537.36')
            .set('Referer','http://chushou.tv')
            .send({username:name})                                                                                
            .send({password:pwd})
            .set('Cookie',t)
            .timeout(5000)
            .proxy(proxy)
            .end(function(err, res){

                if(err){
                  proxyIndex++;
                  cs.login(name,pwd,loginCallback);
                }else{
                  if(res.text.indexOf('DOCTYPE')>-1){
                    console.log('代理无效，登陆失败')
                    proxyIndex++;
                    cs.login(name,pwd,loginCallback);
                  }
                  else{
                      console.log(res.text);
                      if(JSON.parse(res.text).code == '1100'){
                        loginCallback(name+'账号未在触手注册',null)
                      }else{
                       if(JSON.parse(res.text).code == '1101'){
                        loginCallback(name+'密码错误',null)
                      }else{
                           var cookie = res.header['set-cookie'];
                        cs.getToken(cookie,function(token){
                          if(token){
                            loginCallback(null,token,cookie)
                          }else{
                            loginCallback(name+'的token获取失败，代理地址问题，五分钟后重试',null)
                          }
                        })
                      }
                     
                      }
                    }
                  
                  
                }
             })
          }
           

        })
      
    }
  });
  
  
}
cs.getToken = function(cookie,callback){
   superagent.get("http://chushou.tv/room/18222.htm")
        .set("Cookie", cookie)
        .end(function(err,r){
          var $ = cheerio.load(r.text);
          var token = $('.ztcon').data('token');
          return callback(token)
      })
}
cs.getProxy=function(index,callback){
  dl.getone(index,function(err,docs){
    console.log(docs);
    if(err){
      console.log(err)
      return callback(null);
    }else{
      if(docs){
        if(docs.length ==0){
           proxyIndex = 0;
          console.log('没有代理可用')
          return callback(1);
        }else{
          return callback('http://'+docs.address);
        }
      }else{
        proxyIndex = 0;
        console.log('没有代理可用')
          return callback(1);
      }
      
    }
  })
}

module.exports = cs;