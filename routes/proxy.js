var proxy = {}
module.exports = proxy;


var superagent = require('superagent');
require('superagent-proxy')(superagent);
var async = require('async');
var eventproxy = require("eventproxy");
var ep = new eventproxy();
var cheerio = require('cheerio');
var Pm = require('../models/proxy');

var exec = require('child_process').exec; 
var cmdStr = 'free -m';
var rebootStr = 'reboot';



var xiciApiAddress = 'http://api.xicidaili.com/free2016.txt';
var mem1999Address = 'http://ip.memories1999.com/api.php?dh=2340119028466238&sl=1000';
// var kuaiPages = [1,2,3,4,5,6,7,8,9,10];
var kuaiPages = [1,2,3,4,5];
// var kuaiTypes = [1,2,3];
var kuaiTypes = [2,3];
// var kxPages = [1,2,3,4,5,6,7,8,9,10];
var kxPages = [1,2,3,4,5];
var kxTypes = [2,3];
var testProxyAddress = 'http://chushou.tv/captcha/image.htm';


proxy.start = function(){
	proxy.run();
	setInterval(function(){
		proxy.run();
	},3*60*1000)
}

proxy.run = function(){
  //内存保护
  //获取内存
  exec(cmdStr, function(err,stdout,stderr){
    if(err) {
        console.log('get weather api error:'+stderr);
    } else {
        var s = stdout.split('\n')[1].slice(-3)
      console.log(s)
      if(parseInt(s) < 150){
        exec(rebootStr, function(err,stdout,stderr){})
      }
    }
});

  proxy.getXiciApi(function(xicidata){
  	proxy.get1999(function(data1999){

  		proxy.getKuai(function(kuaidata){
  			proxy.getKX(function(kxdata){
  				proxy.get181(function(data181){
  					var lastData = [].concat(xicidata,data1999,kuaidata,kxdata,data181);
  					proxy.test(lastData,function(){
              xicidata = lastData = kuaidata= data1999= kxdata = data181= null;
  					})
  				})
  			})

  		})
    })
	});
}

proxy.getXiciApi = function(callback){
	superagent.get(xiciApiAddress)
		.end(function(err,res){
			var lists = res.text;
			var ipArr = lists.split('\r\n');
			var tmpData = [];

			for(var i = 0; i < ipArr.length;i++){
				tmpData.push({
					address:ipArr[i]
				})
			}
			console.log('xici代理获取完毕,数量：'+tmpData.length)
			return callback(tmpData)
		})
}

proxy.get1999 = function(callback){
  superagent.get(mem1999Address)
    .end(function(err,res){
      var tmpData = [];
      if(typeof res == 'undefined'){
        console.log('1999代理获取失败')
        return callback(tmpData)
      }else{
        var lists = res.text;
        var ipArr = lists.split('\r\n');
        
        for(var i = 0; i < ipArr.length;i++){
          tmpData.push({
            address:ipArr[i]
          })
        }
        console.log('1999代理获取完毕,数量：'+tmpData.length)
        return callback(tmpData)
      }
      
    })
}

proxy.getKuai = function(callback){
	   async.mapLimit(kuaiTypes,1,function(type,callback100){
	     async.mapLimit(kuaiPages,1,function(page,callback200){
          proxy.getKuaiProxy(page,type,function(sre){
	            callback200(null,'ok');
	            if(sre){
	              ep.emit("getKuaiOver",sre);
	            }else{
	            	console.log('获取快代理失败')
	             ep.emit("getKuaiOver",[]);
	            }
            
           })
	          },function(err,result){
	             if(err){
	               console.log(err);
	             }
	          })
	       callback100(null);
	      },function(err,result){
             if(err){
               console.log(err);
             }
          })


		 ep.after('getKuaiOver',kuaiPages.length*kuaiTypes.length,function(ret){
	          var kuaiData = [];
	          console.log('kuai length:'+ret.length)
	          ret.forEach(function(item){
	            kuaiData = kuaiData.concat(item)
	          })
	          console.log('快代理获取完成，数量：'+kuaiData.length)
	          return callback(kuaiData)
	 	 })
}

proxy.getKuaiProxy = function(page,type,callback){
	if(type == 1){
		var url = 'http://www.kuaidaili.com/proxylist/'+page+'/'; //首页
	}else if(type == 2){
		var url = 'http://www.kuaidaili.com/free/inha/'+page+'/';//国内高匿
	}else{
		var url ='http://www.kuaidaili.com/free/outha/'+page+'/';//国外高匿
	}
	// console.log(url)
     superagent.get(url)
          .end(function(err,sss){
            if(typeof sss =='undefined'){
              return callback(null)
            }else{
              var $ = cheerio.load(sss.text);
              var data =[];
               var trs =  $('tbody').find('tr');
               trs.each(function(idx,item){
               
                  var tds = $(item).find('td')
                  var tmp = {
                  	address:$(tds[0]).text()+':'+$(tds[1]).text()
                  }
                  data.push(tmp)
                
                  
               })
               return callback(data);
              }
            

          })
}


proxy.getKX = function(callback){


	   async.mapLimit(kxTypes,1,function(type,callback100){
	     async.mapLimit(kxPages,1,function(page,callback200){
          proxy.getKxProxy(page,type,function(sre){
	            callback200(null,'ok');
	            if(sre){
	              ep.emit("getkxOver",sre);
	            }else{
	              console.log('获取失败')
	               ep.emit("getkxOver",[]);
	            }
            
           })
	          },function(err,result){
	             if(err){
	               console.log(err);
	             }
	          })
	       callback100(null);
	      },function(err,result){
             if(err){
               console.log(err);
             }
          })


		 ep.after('getkxOver',kxPages.length*kxTypes.length,function(ret){
	          var kuaiData = [];
	          ret.forEach(function(item){
	            kuaiData = kuaiData.concat(item)
	          })
	          console.log('开心代理获取完成，数量：'+kuaiData.length)
	          return callback(kuaiData)
	 	 })
}

proxy.getKxProxy = function(page,type,callback){
	if(type == 1){
		var url = 'http://www.kxdaili.com/ipList/'+page+'.html#ip'; //首页
	}else if(type == 2){
		var url = 'http://www.kxdaili.com/dailiip/1/'+page+'.html#ip';//国内高匿
	}else{
		var url ='http://www.kxdaili.com/dailiip/3/'+page+'.html#ip';//国外高匿
	}
     superagent.get(url)
          .end(function(err,sss){
            if(typeof sss =='undefined'){
              return callback(null)
            }else{
              var $ = cheerio.load(sss.text);
              var data =[];
               var trs =  $('table').find('tr');
               trs.each(function(idx,item){
                
                  var tds = $(item).find('td')
                  var tmp = {
                  	address:$(tds[0]).text()+':'+$(tds[1]).text()
                  }
                  data.push(tmp)
               
                  
               })
               return callback(data);
              }
            

          })
}


proxy.get181 = function(callback){
	     superagent.get('http://www.ip181.com/')
          .end(function(err,sss){
            if(typeof sss =='undefined'){
              return callback(null)
            }else{
              var $ = cheerio.load(sss.text);
              var data =[];
               var trs =  $('tbody').find('tr');
               trs.each(function(idx,item){
                if(idx != 0){
                  var tds = $(item).find('td')
                  var tmp = {
                  	address:$(tds[0]).text()+':'+$(tds[1]).text()
                  }
                  data.push(tmp)
                }
                  
               })
               console.log('ip181获取完毕，数量：'+data.length)
               return callback(data);
              }
            

          })
}



proxy.test = function(data,callback){
  console.log('begin test proxy')
  var newData = [];
  var count = 0;

     console.log('待测试代理数量：'+data.length)
     async.mapLimit(data,30,function(doc,callbackAsync){
          superagent.get(testProxyAddress)
          // .set('Host',doc.address)
            .proxy('http://'+doc.address)
          .timeout(3000)
          .end(function(err,res){
            count++;
            if(err){ //超时
              // console.log(err)
              // console.log('timeout')
             // console.log(doc.address+'无效')
            }else{
               if(typeof res == 'undefined'){
                // console.log('res undefined')
               // console.log(doc.address+'无效')
              }else{

                if(typeof res.text == 'undefined'){
                  newData.push(doc);
                   // console.log(doc.address+'有效')
                }
                
              }
            }
           
            if(count == data.length){
              Pm.deleteAll(function(){
                console.log('删除代理成功');
                console.log('剩余可用代理数量：'+newData.length);
                Pm.saveall(newData,function(err){
                  console.log('可用代理保存成功')
                  callback(null)
                })
              })
                
            }
            callbackAsync(null)
          })
       },function(err,result){
        if(err){
          console.log(err);
        }
      })

}