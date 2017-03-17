var express = require('express');
var router = express.Router();

var express = require("express");
var crypto = require('crypto'),
  User = require('../models/user'),
  Cookie= require('../models/cookie'),
	Session= require('../models/session'),
  superagent = require("superagent");
  require('superagent-proxy')(superagent);
  async = require("async");
var loginout = require('./loginout');
var um = require('./user');
var ioFunc = require('./socket');
var io;

var Song = require('./song');
var Xiami = require('./xiami');

var lineCount = 5;//线程数
var cheerio = require("cheerio");
var Reader = require('./read');
//代理
var indexProxy = 0;
var curProxy = '';   //格式：   'http://118.180.15.152:8102'


var proxy = require('./proxy')

var cookie = require('./cookie');


router.prepareSocketIO = function (server,paopaoServer) {

  io = ioFunc.initSocketIo(server);
  Reader.init(io);
  Song.init(io);

  //Song.search('nobody');
  // Xiami.search('nobody');
 
  //Song.getSongFile('http://yinyueshiting.baidu.com/data2/music/42783748/42783748.mp3?xcode=d37108f44de2e3618c3c42cb27c397d9');
  //更新cookie 不定期开启
  //cookie.start();

  //弹幕服务器开启功能
  // proxy.start();
}

/* GET home page. */
router.get('/', function(req, res, next) {

   res.render('home', { 
      title: 'Home',
      success:req.flash('success').toString(),
      error:req.flash('error').toString(),
      user:req.session.user,
      ip:getIPAdress()
      
    });

})
router.get('/login', checkNotLogin);
router.get('/login', function(req, res, next) {
  loginout.loginget(req,res,next);
})
router.post('/login', checkNotLogin);
router.post('/login', function(req, res, next) {
  loginout.loginpost(req,res,next);
	
})


router.post('/remoteout', function(req, res, next) {
  var localIp = getIPAdress();
    Session.get(req.body.name,function(err,docs,islogin){
      res.send('{"ip":'+localIp+'}')      
    })
   
  })


router.get('/heartbeat', function(req,res,next){
  if(!req.session.user){
   res.send('');
  }else{
     //  Session.get(req.session.user.name,function(err,docs,islogin){

     // })
     res.send('ok');
  }
 
});

router.get('/logout', checkLogin);
router.get('/logout', function(req, res, next) {
  loginout.logoutget(req,res,next);
})



router.get('/users', checkLogin);
router.get('/users', function(req, res, next) {
 um.getUsers(req,res,next);
})

router.post('/users/del', checkLogin);
router.post('/users/del', function(req, res, next) {
 um.delUser(req,res,next);
})


router.post('/users/yongjiu', checkLogin);
router.post('/users/yongjiu', function(req, res, next) {
 um.yjUser(req,res,next);
})


router.post('/users/month', checkLogin);
router.post('/users/month', function(req, res, next) {
 um.mUser(req,res,next);
})

//激活功能
router.post('/users/addFunction', checkLogin);
router.post('/users/addFunction', function(req, res, next) {
 um.addFunction(req,res,next);
})

//删除功能
router.post('/users/delFunction', checkLogin);
router.post('/users/delFunction', function(req, res, next) {
 um.delFunction(req,res,next);
})

//激活月功能
router.post('/users/monFunction', checkLogin);
router.post('/users/monFunction', function(req, res, next) {
 um.monFunction(req,res,next);
})

router.post('/users/addDx', checkLogin);
router.post('/users/addDx', function(req, res, next) {
 um.addDx(req,res,next);
})
router.post('/users/delDx', checkLogin);
router.post('/users/delDx', function(req, res, next) {
 um.delDx(req,res,next);
})
router.post('/users/addLt', checkLogin);
router.post('/users/addLt', function(req, res, next) {
 um.addLt(req,res,next);
})
router.post('/users/delLt', checkLogin);
router.post('/users/delLt', function(req, res, next) {
 um.delLt(req,res,next);
})

router.post('/users/addRead', checkLogin);
router.post('/users/addRead', function(req, res, next) {
 um.addRead(req,res,next);
})
router.post('/users/delRead', checkLogin);
router.post('/users/delRead', function(req, res, next) {
 um.delRead(req,res,next);
})

router.post('/users/addDanmu', checkLogin);
router.post('/users/addDanmu', function(req, res, next) {
 um.addDanmu(req,res,next);
})
router.post('/users/delDanmu', checkLogin);
router.post('/users/delDanmu', function(req, res, next) {
 um.delDanmu(req,res,next);
})
router.post('/users/monFunc', checkLogin);
router.post('/users/monFunc', function(req, res, next) {
 um.monFunc(req,res,next);
})


router.post('/users/newpwd', checkLogin);
router.post('/users/newpwd', function(req, res, next) {
 um.pwdUser(req,res,next);
})

router.get('/register', checkLogin);
router.get('/register', function(req, res, next) {
     um.openRegister(req,res,next);
})

router.post('/register', checkLogin);
router.post('/register', function(req, res, next) {
     um.register(req,res,next);
})




function heartbeat(room,cookie,callback,phone,proxy){
   
       superagent.get("http://chushou.tv/room/heartbeat.htm?roomId="+room+"&timestamp="+(new Date().getTime()))           
          .set("Cookie", cookie)   
           .set('User-Agent','Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.75 Safari/537.36')
          .set('Referer','http://chushou.tv/room/'+room+'.htm')
           .proxy(proxy)
           .timeout(3000)
          .end(function(err, pres){
            if(typeof pres == 'undefined'){
              console.log(phone+' fail')
               updateProxy(indexProxy);
            }else{
              if(pres.text.indexOf('html') > -1){
                console.log(phone+' fail')
                 updateProxy(indexProxy);
              }else{
                var hb = JSON.parse(pres.text);
                if(hb.code == 0){
                  console.log('----------'+phone+' heartbeat ok-----------')
                }
              }
              
            }
               setTimeout(function(){
                    callback(null,'ok');
                  },2000)
          })
    // });
     
   
  
}


function checkLogin(req,res,next){
  if(!req.session.user){
    req.flash('error','未登录');
    return res.redirect('/login');
  }
  next();
}

function checkNotLogin(req,res,next){
  if(req.session.user){
    req.flash('error','已登录');
    return res.redirect('back');
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

function soecketnews(msg){
  io.emit('new message',{
      username: '系统消息',
        message: msg
   })
}

module.exports = router;
