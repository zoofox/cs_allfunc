function Song(){
		this.serverAddress = 'http://127.0.0.1:8003';
	}

function orderHandler(val,row,index){
	return '<a href="javascript:;" class="del-song" onclick="delSong('+index+')">删除</a>&nbsp;&nbsp;<a href="javascript:;" class="del-song" onclick="topSong('+index+')">置顶</a>&nbsp;&nbsp;<a href="javascript:;" class="up-song" onclick="upSong('+index+')">上移</a>&nbsp;&nbsp;<a href="javascript:;" class="up-song" onclick="downSong('+index+')">下移</a>';
}
function delSong(index){
	console.log(index)
	 deleteSongFile($('#tt').datagrid('getData').rows[index].songname)
	$('#tt').datagrid('deleteRow',index);
	try{
	$('#tt').datagrid('refreshRow', index);
	}catch(e){

	}
}
function topSong(index){
	if(index !=0){
		 var toup = $('#tt').datagrid('getData').rows[index];
	     var todown = $('#tt').datagrid('getData').rows[0];
	     $('#tt').datagrid('getData').rows[index] = todown;
	     $('#tt').datagrid('getData').rows[0] = toup;
	     $('#tt').datagrid('refreshRow', index);
	     $('#tt').datagrid('refreshRow', 0);
	}
	
}
function upSong(index){
	if(index !=0){
		 var toup = $('#tt').datagrid('getData').rows[index];
	     var todown = $('#tt').datagrid('getData').rows[index-1];
	     $('#tt').datagrid('getData').rows[index] = todown;
	     $('#tt').datagrid('getData').rows[index-1] = toup;
	     $('#tt').datagrid('refreshRow', index);
	     $('#tt').datagrid('refreshRow', index-1);
	}
	
}
function downSong(index){
		var rows = $('#tt').datagrid('getRows').length;
        if (index != rows - 1) {
            var todown = $('#tt').datagrid('getData').rows[index];
            var toup = $('#tt').datagrid('getData').rows[index + 1];
            $('#tt').datagrid('getData').rows[index + 1] = todown;
            $('#tt').datagrid('getData').rows[index] = toup;
            $('#tt').datagrid('refreshRow', index);
            $('#tt').datagrid('refreshRow', index + 1);
        }
	
}

function deleteSongFile(songname){
	var opts = {
			url:'/zhushou/deleteSongFile',
			type:'POST',
			cache:'false',
			data:{
				songname:songname
			},
			success:function(data){
				console.log(data)
			}
		};
		$.ajax(opts)
}
function deleteAllSongFiles(){
	var opts = {
			url:'/zhushou/deleteAllSongFiles',
			type:'POST',
			cache:'false',
			success:function(data){
				console.log(data)
			}
		};
		$.ajax(opts)
}

	Song.prototype = {
		init:function(){
			that_song = this;
			/* 音频播放对象 */
			that_song.singer = document.getElementById('order-audio');
			that_song.receiveDM();
			this.bind();

			
		},
		receiveDM:function(){
			socket.on('new song', function (data) {
				console.log(data);
				$('#tt').datagrid('appendRow',data);
			})
			socket.on('download success', function (data) {
			//$('.tip-song').text(data.songname);
				var dataNow = $('#tt').datagrid('getData');
				$.each(dataNow.rows,(k,v)=>{
					
						if(v.songname == data.songname){
							if($('.isplaying').text() == '--'){ //当前没有歌播放
								
								that_song.singerPlay('http://127.0.0.1:8003/songs/'+data.songname+'.mp3',data.songname,k,v.artistname);
								$('.change-song').removeClass('nope');
								that_song.delsong(0);
							}else{
								$('#tt').datagrid('updateRow',{
						          index: k,
						          row:{
						          	state:'下载完成'
						          }
						        });
							}

						}
						
				})
			})
		},
		singerStart:function(){
			that_song.play();
		}
		,
		singerStop:function(){
			that_song.pause();
		},
		reset:function(){
			try{
				if(that_song.singer != null)
				{
					that_song.singer.pause();
				}
				that_song.singer.src ='';
			}catch(e){
				$('.tip-song').text(e)
			}
			
			
		},
		singerPlay:function(url,songname,index,artistname){
			try{
				$('.isplaying').text(songname+'-'+artistname);
				that_song.reset();
				that_song.singer.src = url;
				that_song.singer.play();

			}catch(e){
				$('.tip-song').text(e)
			}
			
		},
		delsong:function(index){
			
			$('#tt').datagrid('deleteRow',index);
			try{
				$('#tt').datagrid('refreshRow', index);
			}catch(e){

			}
			
		},
		//切歌
		changeSong:function(){
			var dataNow = $('#tt').datagrid('getData').rows;
			console.log(dataNow);
			console.log('-------------------------------------')
			if($('.isplaying').text() != '--'){ //播放完成或者切歌时候删除上一首
				deleteSongFile($('.isplaying').text().split('-')[0]);
			}
			 if(dataNow.length == 0){
			 		that_song.reset();
			 		$('.change-song').addClass('nope');
			 		$('.isplaying').text('--');
			 }else{
			 		console.log(dataNow)
			 		console.log(dataNow)
			 		
			 		that_song.singerPlay('/songs/'+dataNow[0].songname+'.mp3',dataNow[0].songname,0,dataNow[0].artistname);
			 		that_song.delsong(0);
			 } 
		}
		,
		bind:function(){
			$(that_song.singer).bind('ended',function () {
			   that_song.changeSong();
			});
			$('.change-song').click(function(){
				if($(this).hasClass('nope')){return}
				that_song.changeSong();
			})
			$('.startSong').click(function(){
				if($(this).hasClass('nope')){
					return false;
				}
				var room = $.trim($('.room-song').val());
				var phone = $.trim($('.phone-song').val());
				var pwd = $.trim($('.pwd-song').val());
				if(room ==''||phone==''||pwd==''){
					$('.tip-song').text('没填写完整');
					return false;
				}
				if(isNaN(room)){
					$('.tip-song').text('房间必须是数字哦');
					return false;
				}
				$('.tip-song').text('数据检查完毕');
				that_song.songRequest(room,phone,pwd);
				
			})

			$('.endSong').click(function(){
				if($(this).hasClass('nope')){
					return false;
				}
				that_song.stop();
				
			})
		},
		stop:function(){
			var opts = {
				url:'/zhushou/songStop',
				type:'POST',
				cache:'false',
				success:function(data){
					$('.input-song').removeAttr('disabled');
					$('.startSong').removeClass('nope');
					$('.endSong').addClass('nope');
					$('.tip-song').addClass('sure').text('已停止');
					that_song.reset();
					$('.isplaying').text('--');
					deleteAllSongFiles();//删除所有歌曲文件
					$('#tt').datagrid('loadData',{
						total:0,
						rows:[]
					})
				}
			};
			$.ajax(opts)
		}
		,
		songRequest:function(room,phone,pwd){
			$('.tip-song').text('准备发起请求');
			var opts = {
					url:'/zhushou/songStart',
					type:'POST',
					timeout:10000,
					data:{
						room:room,
						phone:phone,
						pwd:pwd
					},
					success:function(data){
						if(data.code ==0){
							$('.input-song').attr('disabled',true)
							$('.startSong').addClass('nope')
							$('.endSong').removeClass('nope')
							$('.tip-song').addClass('sure').text(data.msg);
						}else{
							$('.tip-song').removeClass('sure').text(data.msg);
						}
					},
					error:function(XMLHttpRequest, textStatus, errorThrown){
						clearInterval(that_lt.counter);
						$('.tip-song').addClass('sure').text('请稍后重试...');
					}
				};
				$.ajax(opts);
		}
	}