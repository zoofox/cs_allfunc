var crypto = require('crypto'),
	Session= require('../models/session'),
	 User = require('../models/user');
var loginout = {};
var os=require('os');

loginout.loginget  =function(req,res,next){
	res.render('login', { 
  	title: 'login',
  	success:req.flash('success').toString(),
  	error:req.flash('error').toString(),
  	user:req.session.user 
   });
}
loginout.loginpost=function(req,res,next){
	var md5 = crypto.createHash('md5'),
  	  password = md5.update(req.body.password).digest('hex');
  var name = req.body.name;
  if(name == '' || password == ''){
     res.send({code:1,msg:'用户名密码不能为空'})
       return;
  }
  //弹幕服务器
  // 泡泡服内网10.163.127.238
  var localIp = getIPAdress();

  if(localIp == "10.163.127.238"){ 
      if(name != 'admin'){
        res.send({code:1,msg:'不支持该用户名登录哦'});
        return;
      }
  }  

  User.get(name,function(err,user){
    if(!user){
      req.flash('error','用户不存在！');
       res.send({code:1,msg:'用户不存在！'})
       return;
    //return res.redirect('/login');
    }
    if(user.password != password){
      res.send({code:2,msg:'密码不正确'})
      req.flash('error','密码不正确');
      return;
      // return res.redirect('/login');
    }
    if(user.type !=0){
      if(user.type == 1){ //一个月
        
        if((parseInt(user.time)+2592000000)-parseInt(new Date().getTime())<0){
          req.flash('error','账号已过期！');
          res.send({code:3,msg:'账号已过期！'})
          return;
          // return res.redirect('/login');
        }
      }
    }
    if(name != 'admin'){
      var cpus=os.cpus();
       var cpumodel=cpus[0].model;
       console.log(cpumodel)
        if(user.cpumodel){
          console.log(user.cpumodel)
          if(user.cpumodel != cpumodel){
            res.send({code:3,msg:'检测到账号公用，禁止登陆'});
            return;
          }
        }else{
          loginout.addModel(name,cpumodel,function(err){
            if(err){
              console.log(err)
              res.send({code:4,msg:'初次登陆报错'});
            return;
            }
          })
        }
    }
   
    Session.delSession(name,function(err){
     req.session.user = user;
    console.log('检测会话完成')
    res.send({code:0,msg:'登陆成功'})
      return;
   })
   
  })
}

loginout.addModel = function(name,cpumodel,cb){
  User.updateModel(name,cpumodel,function(err){
    cb(err);
  })
}



loginout.logoutget = function(req,res,next){
	req.session.user = null;
  req.flash('success','登出成功')
  res.redirect('/');
}




function removeLogout(name){
  var localIp = getIPAdress();

  if(localIp == "10.163.125.37"){ //38 的内网地址
    
     superagent.post('http://139.129.211.162:8090/remoteout')
    .type("form")          
          .send({name:name})  
          .end(function(err, pres){
            console.log(pres.text)
            
      })

  }else{ //58
    
  }
  
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

module.exports = loginout;