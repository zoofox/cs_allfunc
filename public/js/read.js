function Read(){
		this.serverAddress = 'http://127.0.0.1:8001';
	}
	Read.prototype = {
		init:function(){
			that_read = this;
			that_read.cuid = encodeURIComponent($('.form-read').data('username'));
			setUsername(that_read.cuid);
			//that_read.hb();
			that_read.spd = 5;//语速
			that_read.level = [];//声音类型
			that_read.vcn='xiaoyan';
			that_read.currentDms = [];
			that_read.receiveDM();
			this.bind();
		},
		receiveDM:function(){
			socket.on('new dms', function (data) {
				var dms = data.message.split('--------');
				console.log(dms);
				var token = data.token;
				if(dms.length != 0){
					that_read.currentDms = dms;
					that_read.read(dms[0],0,token);
				}
			 })
		},
		read:function(dm,index,token){
			console.log(dm)
			//   http://tsn.baidu.com/text2audio?tex=***&lan=zh&cuid=***&ctp=1&tok=***
			if(that_read.level.length ==0){
				var level = 0;
			}else{
				var level = that_read.level[Math.floor(Math.random()*2)];
			}

			if(typeof dm != 'undefined'){
				if(index != that_read.currentDms.length){
					//百度
					// $('#baidu').attr('src','http://tsn.baidu.com/text2audio?tex='+dm+'&lan=zh&cuid='+that_read.cuid+'&ctp=1&tok='+token+'&spd='+that_read.spd+'&per='+level)
					//科大讯飞
					play(dm,that_read.vcn,that_read.spd);
					setTimeout(function(){
						++index;
						if(index !=  that_read.currentDms.length){
							that_read.read(that_read.currentDms[index],index,token);
						}
						
					},2000)
				}
			}
			
		}
		,
		bind:function(){
					
			$('.startRead').click(function(){
				if($(this).hasClass('nope')){
					return false;
				}
				var room = $.trim($('.room-read').val());
				var spd = $.trim($('.spd').val());
				var vcn = $('#testSelect option:selected').data('vcn');
				
				if(room ==''||spd==''){
					$('.tip-read').text('没填写完整');
					return false;
				}
				
				if(isNaN(room) || isNaN(spd)){
					$('.tip-read').text('房间和语速必须是数字哦');
					return false;
				}
				that_read.vcn = vcn;
				that_read.spd = spd;
				that_read.readRequest(room);
				
			})

			$('.endRead').click(function(){
				if($(this).hasClass('nope')){
					return false;
				}
				that_read.stop();
				
			})
		},
		stop:function(){
			var opts = {
				url:'/zhushou/readStop',
				type:'POST',
				cache:'false',
				success:function(data){
					$('.input-read').removeAttr('disabled');
					$('.startRead').removeClass('nope');
					$('.endRead').addClass('nope');
					$('.tip-read').addClass('sure').text('已停止，缓冲时间5秒左右');
				}
			};
			$.ajax(opts)
		},
		hb:function(){
		//hb
			that_read.hbrequest();
			setInterval(function(){
				that_read.hbrequest();
			},30000)
		}
		,
		hbrequest:function(){
			var opts = {
					url:'/heartbeat',
					type:'GET',
					success:function(data){
						if(data != 'ok'){
				          top.location.href="/logout";
				        }
					}

				};
				$.ajax(opts);
		}
		,
		readRequest:function(room){
			$('.tip-read').text('准备发起请求');
			var opts = {
					url:'/zhushou/readStart',
					type:'POST',
					timeout:10000,
					data:{
						room:room
					},
					success:function(data){
						if(data.code ==0){
							$('.input-read').attr('disabled',true)
							$('.startRead').addClass('nope')
							$('.endRead').removeClass('nope')
							$('.tip-read').addClass('sure').text(data.msg);
						}else{
							$('.tip-read').removeClass('sure').text(data.msg);
						}
					},
					error:function(XMLHttpRequest, textStatus, errorThrown){
						//alert(XMLHttpRequest.status);
						 //alert(XMLHttpRequest.readyState);
						// alert(textStatus);
						
						$('.tip-read').addClass('sure').text('正在调整...请重试');
					}
				};
				$.ajax(opts);
		}
	}