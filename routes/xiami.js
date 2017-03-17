var superagent = require("superagent");
var crypto = require('crypto');
var xiami = {
	search:(songname)=>{
		var params = {
				app_key:'23669442',
				format:'json',
				key:songname,
				method:'alibaba.music.search.songs.get',
				sign_method:'md5',
				timestamp:new Date().Format('yyyy-MM-dd hh:mm:ss'),
				v:'5.0'
			};
		params = xiami.sign(params);

		superagent.post('http://gw.api.taobao.com/router/rest')
			.send(params)
			.end(function(res,err){
				console.log(res)
				console.log(err)
			})
	},
	sign:(params)=>{
		var secret = 'a5e5893048ebd1046d02eac2a6d59726';
		var param_str = secret;
		for(var k in params){
			param_str = param_str + k + params[k];
		}
		param_str += secret;

		var md5 = crypto.createHash('md5');
  	  	var sign = md5.update(param_str).digest('hex');
  	  	params.sign = sign;
  	  	console.log(sign)
  	  	return params;
		
	}

}

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 例子： 
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}


module.exports = xiami;