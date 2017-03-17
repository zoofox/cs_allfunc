var settings = require('../settings');
var username =settings.username;
var pwd =settings.pwd;
var Handler = {};
module.exports = Handler;

//认证打开并连接数据库
Handler.openAndConnectDB = function(handler,cb){
	try{
		handler.open(function(err,db){
		if(err){
			return cb(err);
		}
		 db.authenticate(username,pwd,function(err){
		 	if(err){
		 		return cb(err);
		 	}
		 	return cb(null,db);
		 })

	 })
	}catch(e){
		return cb(e);
	}
}