var mongodb = require('./db');
var Handler = require('./dbHandler');
function User(user){
	this.name = user.name;
	this.password = user.password;
	this.type = user.type; //0 yongjiu 1 yigeyue
	this.daxie = user.daxie; //答谢机器人
	this.liaotian = user.liaotian; //聊天机器人
	this.read = user.read; //读弹幕
	this.danmu = user.danmu; //弹幕机
	this.song = user.song; //点歌
}
module.exports = User;

User.prototype.save = function(callback){
	var user = {
		name:this.name,
		password:this.password,
		type:this.type,
		daxie:this.daxie,
		liaotian:this.liaotian,
		read:this.read,
		danmu:this.danmu,
		song:this.song,
		time:new Date().getTime()
	};

	Handler.openAndConnectDB(mongodb,function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('usersallfunc',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}

			collection.insert(user,{safe:true},function(err,user){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null,user[0]);//error为0，返回存储后的用户文档
			});

		})
	})
}

User.get = function(name,callback){
	Handler.openAndConnectDB(mongodb,function(err,db){
		if(err){
			return callback(err);
		}

		db.collection('usersallfunc',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}

			collection.findOne({
				name:name
			},function(err,user){
				if(err){
					return callback(err);
				}

				callback(null,user);

			})
		})
	})
}


User.updateModel = function(name,cpumodel,callback){
	Handler.openAndConnectDB(mongodb,function(err,db){
		if(err){
			return callback(err);
		}

		db.collection('usersallfunc',function(err,collection){

			if(err){
				mongodb.close();
				return callback(err);
			}
			collection.update({name:name}, {$set:{cpumodel:cpumodel}}, {safe:true}, function(err, result){
				if(err){
					console.log(err)
				}
				return callback(null,result)
             });
			
		})
	})
}


User.getAll = function(callback){
Handler.openAndConnectDB(mongodb,function(err,db){
		if(err){
			return callback(err);
		}

		db.collection('usersallfunc',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			collection.find().sort({time:1}).toArray(function(err,docs){
				mongodb.close();
				if(err){
					return callback(err);
				}
				return callback(null,docs)
			})
		})
	})
}

User.del = function(name,callback){
Handler.openAndConnectDB(mongodb,function(err,db){
		if(err){
			return callback(err);
		}

		db.collection('usersallfunc',function(err,collection){

			if(err){
				mongodb.close();
				return callback(err);
			}
			
			collection.remove({name:name},function(err,docs){
				if(err){
					console.log(err)
				}
				return callback(null,docs)
			})
		})
	})
}


User.updateType = function(name,type,callback){
	Handler.openAndConnectDB(mongodb,function(err,db){
		if(err){
			return callback(err);
		}

		db.collection('usersallfunc',function(err,collection){

			if(err){
				mongodb.close();
				return callback(err);
			}
			collection.update({name:name}, {$set:{type:type}}, {safe:true}, function(err, result){
				if(err){
					console.log(err)
				}
				return callback(null,result)
             });
			
		})
	})
}



User.updatepwd = function(name,pwd,callback){
	Handler.openAndConnectDB(mongodb,function(err,db){
		if(err){
			return callback(err);
		}

		db.collection('usersallfunc',function(err,collection){

			if(err){
				mongodb.close();
				return callback(err);
			}
			console.log(pwd)
			collection.update({name:name}, {$set:{password:pwd}}, {safe:true}, function(err, result){
				if(err){
					console.log(err)
				}
				console.log(result)
				return callback(null,result)
             });
			
		})
	})
}

User.updateDx = function(name,dx,callback){
	Handler.openAndConnectDB(mongodb,function(err,db){
		if(err){
			return callback(err);
		}

		db.collection('usersallfunc',function(err,collection){

			if(err){
				mongodb.close();
				return callback(err);
			}
			var nowTime = new Date().getTime();
			collection.update({name:name}, {$set:{daxie:dx,dxTime:nowTime}}, {safe:true}, function(err, result){
				if(err){
					console.log(err)
				}
				console.log(result)
				return callback(null,result)
             });
			
		})
	})
}
User.updateSong = function(name,song,callback){
	Handler.openAndConnectDB(mongodb,function(err,db){
		if(err){
			return callback(err);
		}

		db.collection('usersallfunc',function(err,collection){

			if(err){
				mongodb.close();
				return callback(err);
			}
			var nowTime = new Date().getTime();
			collection.update({name:name}, {$set:{song:song,songTime:nowTime}}, {safe:true}, function(err, result){
				if(err){
					console.log(err)
				}
				console.log(result)
				return callback(null,result)
             });
			
		})
	})
}
User.updateLt = function(name,liaotian,callback){
	Handler.openAndConnectDB(mongodb,function(err,db){
		if(err){
			return callback(err);
		}

		db.collection('usersallfunc',function(err,collection){

			if(err){
				mongodb.close();
				return callback(err);
			}
			console.log(liaotian)
			var nowTime = new Date().getTime();
			collection.update({name:name}, {$set:{liaotian:liaotian,ltTime:nowTime}}, {safe:true}, function(err, result){
				if(err){
					console.log(err)
				}
				console.log(result)
				return callback(null,result)
             });
			
		})
	})
}

User.updateRead = function(name,read,callback){
	Handler.openAndConnectDB(mongodb,function(err,db){
		if(err){
			return callback(err);
		}

		db.collection('usersallfunc',function(err,collection){

			if(err){
				mongodb.close();
				return callback(err);
			}
			var nowTime = new Date().getTime();
			collection.update({name:name}, {$set:{read:read,readTime:nowTime}}, {safe:true}, function(err, result){
				if(err){
					console.log(err)
				}
				console.log(result)
				return callback(null,result)
             });
			
		})
	})
}

User.updateDanmu = function(name,danmu,callback){
	Handler.openAndConnectDB(mongodb,function(err,db){
		if(err){
			return callback(err);
		}

		db.collection('usersallfunc',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			var nowTime = new Date().getTime();
			collection.update({name:name}, {$set:{danmu:danmu,danmuTime:nowTime}}, {safe:true}, function(err, result){
				if(err){
					console.log(err)
				}
				console.log(result)
				return callback(null,result)
             });
			
		})
	})
}