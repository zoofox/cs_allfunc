//存入数据库
var express = require('express');
var router = express.Router();
var cookie = require('../models/cookie');
var dl = require('../models/proxy');
var superagent = require('superagent');

var danmu = require('./danmu');
var ganxie = require('./ganxie');
var peiliao = require('./peiliao');
var Reader = require('./read');
var Song = require('./song');
var ipCount = 10; //每次最多返回10个IP


var User = require('../models/user');

/* GET home page. */
router.get('/', checkLogin);
router.get('/', function(req, res, next) {
    res.render('zhushou', { 
      title: '助手' ,
      success:req.flash('success').toString(),
      error:'',
      user:req.session.user,
       ip:getIPAdress()
    })
})
/* GET home page. */
router.get('/danmu', checkLogin);
router.get('/danmu', function(req, res, next) {
    res.render('danmu', { 
      title: '弹幕     作者QQ 1765898853' ,
      success:req.flash('success').toString(),
      error:'',
      user:req.session.user,
       ip:getIPAdress()
    })
})

/* GET home page. */
router.get('/ganxie', checkLogin);
router.get('/ganxie', function(req, res, next) {
  //获取最新user信息
  User.get(req.session.user.name,function(err,user){
    if(!user){
      req.flash('error','用户不存在！');
      return res.redirect('/logout');
    }else{
       res.render('ganxie', { 
        title: '直播助手     作者QQ 1765898853' ,
        success:req.flash('success').toString(),
        error:'',
        user:user,
        ip:getIPAdress()
      })
    }
  })
   
})


/* GET home page. */
router.get('/cookie', function(req, res, next) {
  cookie.get(null,function(err,cks){
    if(err){
      res.send({"code":1,"msg":err});
    }else{
      res.send(cks);
    }
  })

})
router.get('/ip', function(req, res, next) {
  proxyIPArr = [];
  dl.get(null,function(err,docs){
    if(err){
      console.log(err);
      
    }else{
      if(docs.length == 0){
        setTimeout(function(){
          
        },3000)
      }else{
        proxyIPArr = docs.slice(0,ipCount).map(function(doc){
          return 'http://'+doc.address;
        })
        res.send(proxyIPArr)
      }
    }
  })

})

router.post('/danmuStart',checkLogin);
router.post('/danmuStart',function(req,res,next){
  var room = req.body.room;
  var content = JSON.parse(req.body.content);
  var cks = JSON.parse(req.body.cookie);
  console.log(req.body.ip)
  var ips = JSON.parse(req.body.ip);

  if(room=='' || content.length == 0){
    res.send({"code":1,"msg":"不可以为空哦"});
  }else{
    danmu.start(room,content,cks,ips);
    res.send({"code":0,"msg":"正在运行"});
      
      
  }
})

router.post('/ganxieStart',checkLogin);
router.post('/ganxieStart',function(req,res,next){
  var room = req.body.room;
  var phone = req.body.phone;
  var pwd = req.body.pwd;

  var content = JSON.parse(req.body.content);
  var level = JSON.parse(req.body.level);

  if(room=='' || content.length == 0){
    res.send({"code":1,"msg":"不可以为空哦"});
  }else{
    // res.send({"code":0,"msg":"正在运行"});
    //room='5216206';
      ganxie.login(phone,pwd,function(err,token,cookie){
        if(err){
           res.send({"code":1,"msg":err});
        }else{
          // ganxie.getRoomPage(room,cookie,function(newcookie){
             // ganxie.getRobotUid(cookie,function(err,uid){
             //     if(err){
             //        res.send({"code":1,"msg":'获取uid失败，请重新开始'});
             //      }else{
             //        // var fateCk="gr_cs1_b9d0054a-eee9-4401-abb2-59bb290204a4=\"milo\"; Version=1; Domain=.chushou.tv; Max-Age=1296000; Expires=Fri, 23-Dec-2017 03:15:08 GMT; Path=/; HttpOnly";
             //        // var n_ck = [];
             //        // n_ck[0] = cookie;
             //        // n_ck[1] = fateCk.replace('milo','uid%3A'+uid);
             //             var a=Math.floor(Math.random()*20);
             //            var now = new Date().getTime();
             //        //     console.log('uid:'+uid)
             //        //     console.log(typeof n_ck)
             //        //     ganxie.getRoomPage(room,n_ck,function(newcookie){
             //        //       })

             //            superagent.get('http://chat.chushou.tv/chat/send.htm?roomId='+room+'&_appEnv=1&_appSource=811&_appVersion=2.3.0.7078&_appkey=CSIos&_fromPos=4&_fromView=4&callback=jQuery110208488294710160973_1482930789514&content='+a+'&token='+token+'&_='+now)
             //            .set("Content-Type", "text/plain")
             //                  .set('Host','chat.chushou.tv')
             //                  .set('User-Agent','Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.75 Safari/537.36')
             //                  .set('Referer','http://chushou.tv/room/'+room+'.htm')
             //            .set("Cookie", cookie)
             //                .end(function(err,r){
                            
             //                  console.log(r.text);
                             
             //              })
             //                res.send({"code":0,"msg":"正在运行"});
             //      }
             // })

         
          // })
          ganxie.start(room,token,cookie,content,level);
           res.send({"code":0,"msg":"正在运行"});
          
        }
      });
      
  }
})

router.post('/ganxieStop',checkLogin);
router.post('/ganxieStop',function(req,res,next){
   ganxie.stop();
   res.send({"code":0,"msg":"已经停止"});
})


router.post('/peiliaoStart',checkLogin);
router.post('/peiliaoStart',function(req,res,next){
  var room = req.body.room;
  var phone = req.body.phone;
  var pwd = req.body.pwd;


  if(room==''){
    res.send({"code":1,"msg":"不可以为空哦"});
  }else{
    // res.send({"code":0,"msg":"正在运行"});
      ganxie.login(phone,pwd,function(err,token,cookie){
        if(err){
           res.send({"code":1,"msg":err});
        }else{
            peiliao.getRobotUid(cookie,function(err,uid){
              if(err){
                res.send({"code":1,"msg":'获取uid失败，请重新开始'});
              }else{
                peiliao.start(room,token,cookie,uid);
                 res.send({"code":0,"msg":"正在运行"});
              }
              
            })
          
        }
      });
      
  }
})
router.post('/peiliaoStop',checkLogin);
router.post('/peiliaoStop',function(req,res,next){
   peiliao.stop();
   res.send({"code":0,"msg":"已经停止"});
})


router.post('/readStart',checkLogin);
router.post('/readStart',function(req,res,next){
  var room = req.body.room;
  if(room==''){
    res.send({"code":1,"msg":"不可以为空哦"});
  }else{
     Reader.start(room);
    res.send({"code":0,"msg":"正在运行"});
  }
})

router.post('/readStop',checkLogin);
router.post('/readStop',function(req,res,next){
   Reader.stop();
   res.send({"code":0,"msg":"已经停止"});
})


router.post('/songStart',checkLogin);
router.post('/songStart',function(req,res,next){
   var room = req.body.room;
  var phone = req.body.phone;
  var pwd = req.body.pwd;


  if(room==''){
    res.send({"code":1,"msg":"不可以为空哦"});
  }else{
    // res.send({"code":0,"msg":"正在运行"});
      ganxie.login(phone,pwd,function(err,token,cookie){
        if(err){
           res.send({"code":1,"msg":err});
        }else{
          Song.start(room,token,cookie);
          res.send({"code":0,"msg":"正在运行"});        
        }
      });
      
  }
})

router.post('/songStop',checkLogin);
router.post('/songStop',function(req,res,next){
   Song.stop();
   res.send({"code":0,"msg":"已经停止"});
})

router.post('/deleteSongFile',checkLogin);
router.post('/deleteSongFile',function(req,res,next){
   Song.deleteSongFile(req.body.songname,function(){
     res.send({"code":0,"msg":""});
   })
  
})

router.post('/deleteAllSongFiles',checkLogin);
router.post('/deleteAllSongFiles',function(req,res,next){
  // var path = '../public/songs/';
  //web app路径差异
  var path = process.cwd()+'/allfunc/public/songs/';
   Song.deleteAllSongFiles(path,function(){
    res.send({"code":0,"msg":""});
   })
    
  
})



function checkLogin(req,res,next){
  if(!req.session.user){
    req.flash('error','未登录');
    return res.redirect('/login');
  }
  next();
}
//get local ip address
function getIPAdress(){  
    var interfaces = require('os').networkInterfaces();  
    for(var devName in interfaces){  
          var iface = interfaces[devName];  
          for(var i=0;i<iface.length;i++){  
               var alias = iface[i];  
               if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){  
                     return alias.address;  
               }  
          }  
    }  
} 

module.exports = router;