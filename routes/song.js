
var superagent = require("superagent");
var inter = null;
var fs = require("fs");
var bp = '';

var orderSongTime = 0; //上一次点歌时间
var ORDER_INTERVAL = 5*1000;//每次点歌时间间隔
var currentDm = '';//防止出现重复内容

var Song = {
	io:null
};

Song.init = function(io){
	Song.io = io;
};

Song.start = function(room,token,cookie){
	orderSongTime = new Date().getTime();
	Song.run(room,token,cookie);
	inter = setInterval(function(){
			Song.run(room,token,cookie);
	},1500)
}

Song.run = function(room,token,cookie){
	var now = new Date().getTime();
		console.log('bp:'+bp)
		superagent.get('http://chat.chushou.tv/chat/get.htm?style=2&breakpoint='+bp+'&roomId='+room+'&_='+now)
			.end(function(err,res){
				now=null;
				try{
					var result = JSON.parse(res.text);
					var items = result.data.items;
					var dms = [];
					bp = result.data.breakpoint;
					if(items){
						items.map(function(item){
							if(item.type == 1&&item.content.indexOf('JSON')==-1){//弹幕
								if(item.content.indexOf('点歌，') == 0){
									var songname = item.content.split('点歌，')[1];
									if(songname){
										var nowTime = new Date().getTime();
										if(orderSongTime + ORDER_INTERVAL > nowTime){
											console.log('5秒内只能点歌一次哦');
											Song.sendDm(room,token,cookie,'5秒内只能点歌一次哦');
										}else{
											orderSongTime = nowTime;
											Song.search(songname,room,token,cookie,item.user.nickname);
										}
									}
								}
								
							}else{
								return '';
							}
						})
						result=items=null;
					}else{

					}
				}catch(e){
					console.log(e)
				}
			})
}
Song.stop = function(){
		clearInterval(inter);
		inter=null;
};

Song.sendMsg = function(ordername,songname,artistname,url){
	Song.io.emit('new song',{
     // username: ioname,
      //message: msg,
      ordername:ordername,
      songname:songname,
      artistname:artistname,
      url:url,
      state:'下载中..'
   })
}

Song.downloadMsg = function(songname){
	Song.io.emit('download success',{
      songname:songname
   })
}


Song.search = (songname,room,token,cookie,ordername)=>{
		var url = 'http://tingapi.ting.baidu.com/v1/restserver/ting?format=json&calback=&from=webapp_music&method=baidu.ting.search.catalogSug&query='+encodeURI(songname);
		superagent.get(url)
			.end(function(err,res){
				var result = JSON.parse(res.text);
				if(result.error_code == 22001){
					console.log('没有搜到');
					Song.sendDm(room,token,cookie,'没有搜到'+songname+'这首歌吖');
				}else{
					console.log(result.song[0].songid);
					console.log(result.song[0].artistname);
					console.log('获取到id');
					Song.getMp3Url(result.song[0].songid,room,token,cookie,songname,ordername,result.song[0].artistname);
				}
			})
}
Song.getMp3Url = function(songid,room,token,cookie,songname,ordername,artistname){
	var url = 'http://tingapi.ting.baidu.com/v1/restserver/ting?format=json&calback=&from=webapp_music&method=baidu.ting.song.play&songid='+songid;
		superagent.get(url)
			.end(function(err,res){
				var result = JSON.parse(res.text);
				if(result.error_code == 22000){
					Song.sendMsg(ordername,songname,artistname,result.bitrate.file_link);
					console.log('获取到地址，准备下载');
					Song.sendDm(room,token,cookie,songname+'：点播成功，已进入待播放列表了哦');
					Song.getSongFile(result.bitrate.file_link,songname);
				}else{
					console.log('没有搜到')
					Song.sendDm(room,token,cookie,'没有搜到'+songname+'这首歌吖');
				}
			})
}

Song.getSongFile = function(url,songname){
	// Song.downloadMsg(process.cwd())
	//app路径在第一层allfunc下
	var musicType = url.split('?')[0].slice(-3);
	superagent.get(url)
			.pipe(fs.createWriteStream(process.cwd()+'/allfunc/public/songs/'+songname+'.'+musicType)).on('close', function(){
				Song.downloadMsg(songname)
			}); 
}

Song.deleteSongFile = function(songname,cb){
	fs.unlink(process.cwd()+'/allfunc/public/songs/'+songname+'.mp3',function(){
	// fs.unlink('../public/songs/'+songname+'.mp3',function(){
		cb();
	})
}

Song.deleteAllSongFiles = function(path,cb){
	var files = [];

    if( fs.existsSync(path) ) {
        files = fs.readdirSync(path);
        files.forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        cb();
       // fs.rmdirSync(path);
    }
}


Song.sendDm = function(room,token,cookie,msg){
		var now = new Date().getTime();
				if(msg == currentDm){
					msg+='~'
				}
				currentDm = msg;
				msg=null;
				
				console.log(currentDm);
				superagent.get('http://chat.chushou.tv/chat/send.htm?roomId='+room+'&_appEnv=1&_appSource=811&_appVersion=2.3.0.7078&_appkey=CSIos&_fromPos=4&_fromView=4&callback=jQuery110208488294710160973_1482930789514&content='+encodeURI(currentDm)+'&token='+token+'&_='+now)
					.set("Content-Type", "text/plain")
		            .set('User-Agent','Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.75 Safari/537.36')
		            .set('Referer','http://chushou.tv')
					.set("Cookie", cookie)
			        .end(function(err,r){
			        	console.log(r.text);
			        	now=null;
			      })
	}


function unique(arr) {
  var ret = []
  var hash = {}

  for (var i = 0; i < arr.length; i++) {
    var item = arr[i]
    var key = typeof(item) + item
    if (hash[key] !== 1 && item) {
      ret.push(arr[i])
      hash[key] = 1
    }
  }
  hash=arr=null;
  return ret
}

module.exports = Song;