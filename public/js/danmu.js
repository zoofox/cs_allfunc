function Danmu(){
		this.cookie = [];
		this.ip = [];
		this.counter = null;
		this.serverAddress = 'http://127.0.0.1:8003';
	}
	Danmu.prototype = {
		init:function(){

			that_dm = this;
			// that_dm.hb();
			that_dm.getCookie();
			that_dm.getIP(function(){});
			this.bind();
		},
		bind:function(){
					
			$('.start-dm').click(function(){
				if($(this).hasClass('nope')){
					return false;
				}
				var room = $.trim($('.room-dm').val());
				var content = $.trim($('.content-dm').val());
				if(room ==''||content==''){
					$('.tip-dm').text('没填写完整');
					return false;
				}
				var realContent = JSON.stringify(content.split('\n'));
				if(isNaN(room)){
					$('.tip-dm').text('房间必须是数字哦');
					return false;
				}
				$('.tip-dm').text('数据检查完毕');
				var ck = JSON.stringify(that_dm.cookie);
				var ip = JSON.stringify(that_dm.ip);
				$('.tip-dm').text('room'+room);
				that_dm.danmuRequest(room,realContent,ck,ip);
				that_dm.startCounter(room,realContent,ck);
				
			})

			$('.end-dm').click(function(){
				if($(this).hasClass('nope')){
					return false;
				}
				clearInterval(that_dm.counter);
				$('.input-dm,.content-dm').removeAttr('disabled');
				$('.start-dm').removeClass('nope');
				$('.end-dm').addClass('nope');
				$('.tip-dm').addClass('sure').text('已停止，缓冲时间15秒左右');
			})
		},
		startCounter:function(room,realContent,ck){
			that_dm.counter = setInterval(function(){
					that_dm.getIP(function(ips){
						that_dm.danmuRequest(room,realContent,ck,JSON.stringify(ips));
					});
			},45*1000)
		}
		,
		getCookie:function(){
			var opts = {
				url:that_dm.serverAddress+'/zhushou/cookie',
				type:'GET',
				cache:false,
				success:function(data){
					that_dm.cookie = data;
				}
			};
			$.ajax(opts)
		},
		getIP:function(callback){
			var opts = {
				url:that_dm.serverAddress+'/zhushou/ip',
				type:'GET',
				cache:false,
				timeout:20000,
				success:function(data){
					that_dm.ip = data;
					callback(data);
				},
				error:function(XMLHttpRequest, textStatus, errorThrown){
					//alert(XMLHttpRequest.status);
						 //alert(XMLHttpRequest.readyState);
						 //alert(textStatus);
					callback(that_dm.ip);
				}
			};
			$.ajax(opts)
		},
		hb:function(){
		//hb
			that_dm.hbrequest();
			setInterval(function(){
				that_dm.hbrequest();
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
		danmuRequest:function(room,content,cookie,ip){
			$('.tip').text('准备发起请求');
			var opts = {
					url:'/zhushou/danmuStart',
					type:'POST',
					timeout:10000,
					data:{
						room:room,
						content:content,
						cookie:cookie,
						ip:ip
					},
					success:function(data){
						if(data.code ==0){
							$('.input-dm,.content-dm').attr('disabled',true)
							$('.start-dm').addClass('nope')
							$('.end-dm').removeClass('nope')
							$('.tip-dm').addClass('sure').text(data.msg);
						}else{
							$('.tip-dm').removeClass('sure').text(data.msg);
						}
					},
					error:function(XMLHttpRequest, textStatus, errorThrown){
						//alert(XMLHttpRequest.status);
						 //alert(XMLHttpRequest.readyState);
						// alert(textStatus);
						clearInterval(that_dm.counter);
						$('.tip-dm').addClass('sure').text('稍后重试..');
						that_dm.danmuRequest(room,realContent,ck,JSON.stringify(that_dm.ip));
						that_dm.startCounter(room,content,cookie);
					}
				};
				$.ajax(opts);
		}
	}