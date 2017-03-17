var mongodb = require('./db_admin');
var Handler = require('./dbHandler');

function Session(user){
	this.name = user.name;
	this.password = user.password;
	this.email = user.email;
}
module.exports = Session;

Session.delSession = function(name,callback){
	Handler.openAndConnectDB(mongodb,function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('sessions',function(err,collection){

			if(err){
				mongodb.close();
				return callback(err);
			}
			var reg = new RegExp(name);
			collection.find({'session':reg}).toArray(function(err,docs){
				console.log(docs)
				docs.forEach(function(doc){
					Session.del(db,doc._id,function(){})
				})
				return callback(null)
			})
			
		})
	})
	// mongodb.open(function(err,db){
	// 	if(err){
	// 		return callback(err);
	// 	}

	// 	db.collection('sessions',function(err,collection){

	// 		if(err){
	// 			mongodb.close();
	// 			return callback(err);
	// 		}
	// 		var reg = new RegExp(name);
	// 		collection.find({'session':reg}).toArray(function(err,docs){
	// 			console.log(docs)
	// 			docs.forEach(function(doc){
	// 				Session.del(doc._id,function(){})
	// 			})
	// 			return callback(null)
	// 		})
			
	// 	})
	// })
}

Session.del = function(db,id,callback){
	// Handler.openAndConnectDB(mongodb,function(err,db){
	// 	if(err){
	// 		console.log('1')
	// 		return callback(err);
	// 	}
		db.collection('sessions',function(err,collection){

			if(err){
				console.log('2')
				mongodb.close();
				return callback(err);
			}
			
			collection.remove({_id:id},function(err,docs){
				if(err){
					console.log('3')
					console.log(err)
				}
				console.log('delete')
			})
		})
	// })
	// mongodb.open(function(err,db){
	// 	if(err){
	// 		return callback(err);
	// 	}

	// 	db.collection('sessions',function(err,collection){

	// 		if(err){
	// 			mongodb.close();
	// 			return callback(err);
	// 		}
			
	// 		collection.remove({_id:id},function(err,docs){
	// 			if(err){
	// 				console.log(err)
	// 			}
	// 			console.log('delete')
	// 		})
	// 	})
	// })
}