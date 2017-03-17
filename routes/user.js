var User = require('../models/user');
var user={};
var crypto = require('crypto');
user.getUsers = function(req,res,next){
	 if(req.session.user.name=="admin"){
    User.getAll(function(err,docs){
      res.render('user', { 
        title: 'users',
        success:req.flash('success').toString(),
        error:req.flash('error').toString(),
        users:docs,
        user:req.session.user,
        ip:getIPAdress()

     });
    })

  }
}
user.delUser = function(req,res,next){
	if(req.session.user.name=="admin"){
  User.get(req.body.name,function(err,user){
    if(!user){
      req.flash('error','用户不存在！');
      return res.redirect('/users');
    }
    
    User.del(req.body.name,function(err,docs){
      req.flash('success','删除成功');
      res.send({"code":0})
    })
   
  })
 }
}

user.yjUser = function(req,res,next){
	 if(req.session.user.name=="admin"){
  User.get(req.body.name,function(err,user){
    if(!user){
      req.flash('error','用户不存在！');
      return res.redirect('/users');
    }
    //update 0 yongjiu  1 month
    User.updateType(req.body.name,0,function(err,docs){
      req.flash('success','成功');
      res.send({"code":0})
    })
   
  })
 }
}

user.mUser = function(req,res,next){
	console.log('in')
 if(req.session.user.name=="admin"){
  User.get(req.body.name,function(err,user){
    if(!user){
      req.flash('error','用户不存在！');
      return res.redirect('/users');
    }
    //update 0 yongjiu  1 month
    User.updateType(req.body.name,1,function(err,docs){
      req.flash('success','成功');
      res.send({"code":0})
    })
   
  })
 }
}

//0 答谢 1 聊天 2 语音 3 弹幕机 4 点歌
user.addFunction = function(req,res,next){
  console.log('inadd')
 if(req.session.user.name=="admin"){
  User.get(req.body.name,function(err,user){
    if(!user){
      req.flash('error','用户不存在！');
      return res.redirect('/users');
    }
    var type = req.body.type;
    console.log(type+'----')
    if(type == 0){
       User.updateDx(req.body.name,1,function(err,docs){
          req.flash('success','成功');
          res.send({"code":0})
     })
    }else  if(type == 1){
      User.updateLt(req.body.name,1,function(err,docs){
      req.flash('success','成功');
      res.send({"code":0})
    })
    }else if(type == 2){
       User.updateRead(req.body.name,1,function(err,docs){
        req.flash('success','成功');
        res.send({"code":0})
      })
     }else if(type == 3){
       User.updateDanmu(req.body.name,1,function(err,docs){
        req.flash('success','成功');
        res.send({"code":0})
      })
     }else if(type == 4){
       User.updateSong(req.body.name,1,function(err,docs){
        req.flash('success','成功');
        res.send({"code":0})
      })
     }
  })
 }
}

//0 答谢 1 聊天 2 语音 3 弹幕机 4 点歌
user.delFunction = function(req,res,next){
  console.log('inadd')
 if(req.session.user.name=="admin"){
  User.get(req.body.name,function(err,user){
    if(!user){
      req.flash('error','用户不存在！');
      return res.redirect('/users');
    }
    var type = req.body.type;
    console.log(type+'----')
    if(type == 0){
       User.updateDx(req.body.name,0,function(err,docs){
          req.flash('success','成功');
          res.send({"code":0})
     })
    }else  if(type == 1){
      User.updateLt(req.body.name,0,function(err,docs){
      req.flash('success','成功');
      res.send({"code":0})
    })
    }else if(type == 2){
       User.updateRead(req.body.name,0,function(err,docs){
        req.flash('success','成功');
        res.send({"code":0})
      })
     }else if(type == 3){
       User.updateDanmu(req.body.name,0,function(err,docs){
        req.flash('success','成功');
        res.send({"code":0})
      })
     }else if(type == 4){
       User.updateSong(req.body.name,0,function(err,docs){
        req.flash('success','成功');
        res.send({"code":0})
      })
     }
  })
 }
}

//0 答谢 1 聊天 2 语音 3 弹幕机 4 点歌
user.monFunction = function(req,res,next){
  console.log('inadd')
 if(req.session.user.name=="admin"){
  User.get(req.body.name,function(err,user){
    if(!user){
      req.flash('error','用户不存在！');
      return res.redirect('/users');
    }
    var type = req.body.type;
    console.log(type+'----')
    if(type == 0){
       User.updateDx(req.body.name,2,function(err,docs){
          req.flash('success','成功');
          res.send({"code":0})
     })
    }else  if(type == 1){
      User.updateLt(req.body.name,2,function(err,docs){
      req.flash('success','成功');
      res.send({"code":0})
    })
    }else if(type == 2){
       User.updateRead(req.body.name,2,function(err,docs){
        req.flash('success','成功');
        res.send({"code":0})
      })
     }else if(type == 3){
       User.updateDanmu(req.body.name,2,function(err,docs){
        req.flash('success','成功');
        res.send({"code":0})
      })
     }else if(type == 4){
       User.updateSong(req.body.name,2,function(err,docs){
        req.flash('success','成功');
        res.send({"code":0})
      })
     }
  })
 }
}




user.addDx = function(req,res,next){
  console.log('in')
 if(req.session.user.name=="admin"){
  User.get(req.body.name,function(err,user){
    if(!user){
      req.flash('error','用户不存在！');
      return res.redirect('/users');
    }
    //update 0 yongjiu  1 month
    User.updateDx(req.body.name,1,function(err,docs){
      req.flash('success','成功');
      res.send({"code":0})
    })
   
  })
 }
}

user.delDx = function(req,res,next){
  console.log('in')
 if(req.session.user.name=="admin"){
  User.get(req.body.name,function(err,user){
    if(!user){
      req.flash('error','用户不存在！');
      return res.redirect('/users');
    }
    //update 0 yongjiu  1 month
    User.updateDx(req.body.name,0,function(err,docs){
      req.flash('success','成功');
      res.send({"code":0})
    })
   
  })
 }
}

user.addLt = function(req,res,next){
  console.log('in')
 if(req.session.user.name=="admin"){
  User.get(req.body.name,function(err,user){
    if(!user){
      req.flash('error','用户不存在！');
      return res.redirect('/users');
    }
    //update 0 yongjiu  1 month
    User.updateLt(req.body.name,1,function(err,docs){
      req.flash('success','成功');
      res.send({"code":0})
    })
   
  })
 }
}

user.delLt = function(req,res,next){
  console.log('in')
 if(req.session.user.name=="admin"){
  User.get(req.body.name,function(err,user){
    if(!user){
      req.flash('error','用户不存在！');
      return res.redirect('/users');
    }
    //update 0 yongjiu  1 month
    User.updateLt(req.body.name,0,function(err,docs){
      req.flash('success','成功');
      res.send({"code":0})
    })
   
  })
 }
}

user.addRead = function(req,res,next){
  console.log('in')
 if(req.session.user.name=="admin"){
  User.get(req.body.name,function(err,user){
    if(!user){
      req.flash('error','用户不存在！');
      return res.redirect('/users');
    }
    //update 0 yongjiu  1 month
    User.updateRead(req.body.name,1,function(err,docs){
      req.flash('success','成功');
      res.send({"code":0})
    })
   
  })
 }
}

user.delRead = function(req,res,next){
  console.log('in')
 if(req.session.user.name=="admin"){
  User.get(req.body.name,function(err,user){
    if(!user){
      req.flash('error','用户不存在！');
      return res.redirect('/users');
    }
    //update 0 yongjiu  1 month
    User.updateRead(req.body.name,0,function(err,docs){
      req.flash('success','成功');
      res.send({"code":0})
    })
   
  })
 }
}

user.addDanmu = function(req,res,next){
  console.log('in')
 if(req.session.user.name=="admin"){
  User.get(req.body.name,function(err,user){
    if(!user){
      req.flash('error','用户不存在！');
      return res.redirect('/users');
    }
    //update 0 yongjiu  1 month
    User.updateDanmu(req.body.name,1,function(err,docs){
      req.flash('success','成功');
      res.send({"code":0})
    })
   
  })
 }
}

user.delDanmu = function(req,res,next){
  console.log('in')
 if(req.session.user.name=="admin"){
  User.get(req.body.name,function(err,user){
    if(!user){
      req.flash('error','用户不存在！');
      return res.redirect('/users');
    }
    //update 0 yongjiu  1 month
    User.updateDanmu(req.body.name,0,function(err,docs){
      req.flash('success','成功');
      res.send({"code":0})
    })
   
  })
 }
}

user.monFunc = function(req,res,next){
  console.log('in')
 if(req.session.user.name=="admin"){
  User.get(req.body.name,function(err,user){
    if(!user){
      req.flash('error','用户不存在！');
      return res.redirect('/users');
    }
    console.log(req.body.type)
    var type = req.body.type;
    if(type == 0){
       User.updateDx(req.body.name,2,function(err,docs){
          req.flash('success','成功');
          res.send({"code":0})
        })
     }else{
      if(type == 1){
          User.updateLt(req.body.name,2,function(err,docs){
          req.flash('success','成功');
          res.send({"code":0})
        })
        }else if(type == 2){
           User.updateRead(req.body.name,2,function(err,docs){
            req.flash('success','成功');
            res.send({"code":0})
          })
         }else if(type == 3){
           User.updateDanmu(req.body.name,2,function(err,docs){
            req.flash('success','成功');
            res.send({"code":0})
          })
         }
     }
  })
 }
}


user.pwdUser = function(req,res,next){
	console.log('in')
 if(req.session.user.name=="admin"){
  User.get(req.body.name,function(err,user){
    if(!user){
      req.flash('error','用户不存在！');
      return res.redirect('/users');
    }

     var md5 = crypto.createHash('md5'),
    password = md5.update(req.body.newpwd).digest('hex');
    //update 0 yongjiu  1 month
    User.updatepwd(req.body.name,password,function(err,docs){
      req.flash('success','成功');
      res.send({"code":0})
    })
   
  })
 }
}

user.openRegister = function(req,res,next){
  if(req.session.user.name=="admin"){
    res.render('register', { 
      title: 'register',
      success:req.flash('success').toString(),
      error:req.flash('error').toString(),
      user:req.session.user 
     });
  }
}

user.register = function(req,res,next){
	 if(req.session.user.name=="admin"){
    var name = req.body.name,
    password = req.body.password;
    type = req.body.type;
  

    var md5 = crypto.createHash('md5'),
    password = md5.update(req.body.password).digest('hex');

    var newUser = new User({
      name:name,
      password:password,
      type:req.body.type,
      daxie:0,  //0 未激活 1 永久 2 一月
      liaotian:0,
      read:0,
      danmu:0, 
      song:0 
    });
    User.get(newUser.name,function(err,user){
      if(err){
        req.flash('error',err);
        return res.redirect('/');
      }
      if(user){
        req.flash('error','用户已存在~');
        return res.redirect('/register');
      }
      newUser.save(function(err,user){
        if(err){
          req.flash('error',err);
          return res.redirect('/register');
        }
        //req.session.user = newUser;
        req.flash('success','注册成功');
        res.redirect('/register');
      })
    })
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
module.exports = user;