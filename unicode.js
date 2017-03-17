/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2016-04-11 17:24:59
 * @version $Id$
 */
module.exports = {
 	decode:function(str){
 		if(!str){
 			return "";
 		}
		return unescape(str.replace(/&#x/g,'%u').replace(/;/g,''));
		},
	encode:function(str){
		if(!str){
 			return "";
 		}
		return str.replace(/[^\u0000-\u00FF]/g,function($0){return escape($0).replace(/(%u)(\w{4})/gi,"&#x$2;")});
	}
 };
