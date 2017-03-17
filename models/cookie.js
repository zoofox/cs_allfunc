var mongodb = require('./db_pao');
var Handler = require('./dbHandler');
function Cookie(lang){
	this.phone = lang.phone;
	this.cookie = lang.cookie;
	this.token = lang.token;
}

module.exports = Cookie;

Cookie.prototype.save = function(callback){
	
	var cookie = this.cookie;
	var token = this.token;
	var phone = this.phone;
	
	  var date = new Date();
	 var newLang = {
	 	cookie:cookie,
	 	token:token,
	 	time:{ date: date, 
	 		year : date.getFullYear(),  
	 	    month : date.getFullYear() + "-" + (date.getMonth() + 1),
	 	    day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),       
	 	    minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())    }
	 }

	 Handler.openAndConnectDB(mongodb,function(err,db){
	 	if(err){
	 		return callback(err);
	 	}
	 	db.collection('cookie',function(err,collection){
	 		if(err){
	 			mongodb.close();
	 			return callback(err);
	 		}

	 		collection.save(newLang,{safe:true},function(err,doc){
	 			if(err){
	 				mongodb.close();
	 				return callback(err);
	 			}
	 			return callback(null);
	 		})

	 	})

	 })
}

Cookie.get = function(cookie,callback){
	Handler.openAndConnectDB(mongodb,function(err,db){
		if(err){
			return callback(err);
		}

		db.collection('cookie',function(err,collection){
			if(err){
				mongodb.close();
				callback(err);
			}
			var query = {};
			if(cookie){
				query.lang = cookie;
			}
			collection.find(query).sort({time:1}).toArray(function(err,docs){
				mongodb.close();
				if(err){
					return callback(err);
				}
				return callback(null,docs)
			})
		})
	})
}
