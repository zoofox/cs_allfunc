var mongodb = require('./db');

function Dl(lang){
	this.ip = lang.ip;
	this.port = lang.port;
	this.type = lang.type; //HTTP HTTPS 
}

module.exports = Dl;

Dl.prototype.save = function(callback){
	var ip = this.ip;
	var port = this.port;
	var type = this.type;
	  var date = new Date();
	 var newLang = {
	 	ip:ip,
	 	port:port,
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
	 	db.collection('daili',function(err,collection){
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

Dl.saveall = function(data,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}

		db.collection('daili',function(err,collection){
			if(err){
				console.log('errrrrr')
				mongodb.close();
				callback(err);
			}
			

			collection.insert(data,function(err,docs){
				//mongodb.close();
				if(err){
					return callback(err)
				}else{
					return callback(null)
				}
			})
		})
	})
}


Dl.get = function(ip,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}

		db.collection('daili',function(err,collection){
			if(err){
				mongodb.close();
				callback(err);
			}
			var query = {};
			if(ip){
				query.ip = ip;
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


Dl.getone = function(index,callback){
	console.log(index)
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}

		db.collection('daili',function(err,collection){
			if(err){
				mongodb.close();
				callback(err);
			}
			collection.find().skip(index).limit(1).toArray(function(err,docs){
				mongodb.close();
				if(err){
					return callback(err);
				}
				if(docs.length == 0){
					return callback(null,null)
				}else{
					
					return callback(null,docs[0])
				}
				
			})
		})
	})
}

Dl.del = function(ip,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}

		db.collection('daili',function(err,collection){

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


Dl.deleteAll = function(callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}

		db.collection('daili',function(err,collection){
			if(err){
				mongodb.close();
				callback(err);
			}
			collection.remove();
			return callback(null);
		})
	})
}
