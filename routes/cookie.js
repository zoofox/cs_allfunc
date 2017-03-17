var Cs  =require('../models/chushou');
var cs = require('./cs');
var Ck = require('../models/cookie');
var superagent = require('superagent');
var async = require('async');
var Cookie = {};

var threadNum = 1;
var successCount = 0;


Cookie.start = function(){
  Cs.get(null,function(err,docs){
    console.log(docs.length)
    var counter = 0;
    async.mapLimit(docs.slice(0,100),threadNum,function(doc,callback){
      counter++;
      console.log(counter)
      cs.login(doc.phone,doc.password,function(err,token,cookie){
       
        if(err){
          console.log(doc.phone+': fail')
        }else{
           callback(null)
          console.log(doc.phone+': success')
           var ck =  new Ck({
             cookie:cookie,
             token:token,
             phone:doc.phone
            });
           ck.save(function(err){
             if(err){
               console.log(err)
             }else{console.log('save success')}
            })
        }
      })
      // Cookie.getCookie(doc.phone,doc.password);
      // setTimeout(function(){
      //  callback(null);
      // },2000)
    })
    
    
  })
}
























// Cookie.start = function(){
// 	Cs.get(null,function(err,docs){
// 		console.log(docs.length)
// 		var counter = 0;
// 		async.mapLimit(docs.slice(0,5),threadNum,function(doc,callback){
// 			counter++;
// 			console.log(counter)
// 			Cookie.getFirst(function(t){
// 				// console.log(t)
// 				setTimeout(function(){
// 					callback(null);
// 				},2000)
// 			})
// 			// Cookie.getCookie(doc.phone,doc.password);
// 			// setTimeout(function(){
// 			// 	callback(null);
// 			// },2000)
// 		})
		
		
// 	})
// }
// Cookie.getFirst = function(callback){
// 	superagent.get('http://chushou.tv/live/list.htm')  //首先获取用户cookie以外的cookie内容
//          .end(function(err,s){
//           if(typeof s =='undefined'){
//             Cookie.getFirst();
//           }else{
//             t = s.header['set-cookie'];
//             console.log('first cookie:'+t)
//            var ck =  new Ck({
//             	cookie:t,
//             	name:'',
//             	regerer:''
//             });
//            ck.save(function(err){
//            	if(err){
//            		console.log(err)
//            	}else{console.log('save success')}
//             })
//             return callback(t);
//           }
//       	})
// }
// Cookie.getCookie = function(phone,pwd){
// 	Cookie.getFirst(function(t){
// 		 superagent.post('http://chushou.tv/chushou/login.htm')
//             .type("json")
//             .set("Content-Type", "application/x-www-form-urlencoded")
//             .set('Host','chushou.tv')
//             .set('User-Agent','Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.75 Safari/537.36')
//             .set('Referer','http://chushou.tv')
//             .send({username:phone})                                                                                
//             .send({password:pwd})
//             .set('Cookie',t)
//             .timeout(5000)
//             .end(function(err, res){
//             	if(err){
//             		console.log(err)
//                  console.log(phone+' 超时了');
//                   //Cookie.getCookie(phone,pwd);
//                 }else{
//                   if(res.text.indexOf('DOCTYPE')>-1){
//                    console.log(phone+'  503------------');
//                    Cookie.getCookie(phone,pwd);
//                   }
//                   else{
//                       // console.log(res.text);
//                       if(JSON.parse(res.text).code == '1100'){
//                         console.log(phone+'账号未在触手注册');
//                       }else{
//                        if(JSON.parse(res.text).code == '1101'){
//                        	console.log(phone+'密码错误');
//                       }else{
//                            var cookie = res.header['set-cookie'];
//                            Cs.updateCookie(phone,cookie,function(err){
//                            	if(err){
//                            		console.log(err);
//                            	}else{
                           		
//                            		successCount++;
//                            		console.log(phone+ ' cookie保存成功，成功：'+successCount);

//                            	}
//                            })
//                       }
                     
//                       }
//                     }
                  
                  
//                 }
//             })
// 	})
// }



module.exports = Cookie;