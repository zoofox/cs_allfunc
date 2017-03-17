var mongodb = require('./db_pao');

function Chushou(lang){
	this.phone = lang.phone;
	this.password = lang.password;
}

module.exports = Chushou;

Chushou.prototype.save = function(callback){
	var phone = this.phone;
	var password = this.password;
	  var date = new Date();
	 var newLang = {
	 	phone:phone,
	 	password:password,
	 	time:{ date: date, 
	 		year : date.getFullYear(),  
	 	    month : date.getFullYear() + "-" + (date.getMonth() + 1),
	 	    day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),       
	 	    minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())    }
	 }

	 mongodb.open(function(err,db){
	 	if(err){
	 		return callback(err);
	 	}
	 	db.collection('chushou',function(err,collection){
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

Chushou.get = function(name,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}

		db.collection('chushou',function(err,collection){
			if(err){
				mongodb.close();
				callback(err);
			}
			var query = {};
			if(name){
				query.phone = phone;
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

Chushou.del = function(phone,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}

		db.collection('chushou',function(err,collection){

			if(err){
				mongodb.close();
				return callback(err);
			}
			
			collection.remove({phone:phone},function(err,docs){
				if(err){
					console.log(err)
				}
				return callback(null,docs)
			})
		})
	})
}

Chushou.updateCookie= function(phone,cookie,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}

		db.collection('chushou',function(err,collection){

			if(err){
				mongodb.close();
				return callback(err);
			}
			collection.update({phone:phone}, {$set:{cookie:cookie}}, {safe:true}, function(err, result){
				if(err){
					console.log(err)
				}
				return callback(null,result)
             });
			
		})
	})
}

