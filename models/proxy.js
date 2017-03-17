var mongodb = require('./db');
var Handler = require('./dbHandler');
function Dl(lang){
	// this.ip = lang.ip;
	// this.port = lang.port;
	//this.type = lang.type; //HTTP HTTPS 
	this.address = lang.address; //HTTP HTTPS 
}

module.exports = Dl;

Dl.prototype.save = function(callback){
	
	var address = this.address;
	  var date = new Date();
	 var newLang = {
	 	address:address,
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
	 	db.collection('proxy',function(err,collection){
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
	Handler.openAndConnectDB(mongodb,function(err,db){
		if(err){
			return callback(err);
		}

		db.collection('proxy',function(err,collection){
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
	Handler.openAndConnectDB(mongodb,function(err,db){
		if(err){
			return callback(err);
		}

		db.collection('proxy',function(err,collection){
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
	Handler.openAndConnectDB(mongodb,function(err,db){
		if(err){
			return callback(err);
		}

		db.collection('proxy',function(err,collection){
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
	Handler.openAndConnectDB(mongodb,function(err,db){
		if(err){
			return callback(err);
		}

		db.collection('proxy',function(err,collection){

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
	Handler.openAndConnectDB(mongodb,function(err,db){
		if(err){
			return callback(err);
		}

		db.collection('proxy',function(err,collection){
			if(err){
				mongodb.close();
				callback(err);
			}
			collection.remove();
			return callback(null);
		})
	})
}
