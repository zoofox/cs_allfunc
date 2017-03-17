function Liaotian(){
		this.counter = null;
		this.serverAddress = 'http://127.0.0.1:8889';
	}
	Liaotian.prototype = {
		init:function(){

			that_lt = this;
			// that_lt.hb();
			
			this.bind();
		},
		bind:function(){
					
			$('.startLt').click(function(){
				if($(this).hasClass('nope')){
					return false;
				}
				var room = $.trim($('.room-lt').val());
				var phone = $.trim($('.phone-lt').val());
				var pwd = $.trim($('.pwd-lt').val());

				
				if(room ==''||phone==''||pwd==''){
					$('.tip-lt').text('没填写完整');
					return false;
				}
				
				if(isNaN(room)){
					$('.tip-lt').text('房间必须是数字哦');
					return false;
				}
				$('.tip-lt').text('数据检查完毕');
				$('.tip-lt').text('room'+room);
				that_lt.ltRequest(room,phone,pwd);
				
			})

			$('.endLt').click(function(){
				if($(this).hasClass('nope')){
					return false;
				}
				that_lt.stop();
				
			})
		},
		stop:function(){
			var opts = {
				url:'/zhushou/peiliaoStop',
				type:'POST',
				cache:'false',
				success:function(data){
					$('.input-lt').removeAttr('disabled');
					$('.startLt').removeClass('nope');
					$('.endLt').addClass('nope');
					$('.tip-lt').addClass('sure').text('已停止，缓冲时间5秒左右');
				}
			};
			$.ajax(opts)
		},
		startCounter:function(room,realContent,ck){
			that_lt.counter = setInterval(function(){
					that_lt.getip-lt(function(ips){
						that_lt.danmuRequest(room,realContent,ck,JSON.stringify(ips));
					});
			},45*1000)
		}
		,
		
		hb:function(){
		//hb
			that_lt.hbrequest();
			setInterval(function(){
				that_lt.hbrequest();
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
		ltRequest:function(room,phone,pwd){
			$('.tip-lt').text('准备发起请求');
			var opts = {
					url:'/zhushou/peiliaoStart',
					type:'POST',
					timeout:10000,
					data:{
						room:room,
						phone:phone,
						pwd:pwd
					},
					success:function(data){
						if(data.code ==0){
							$('.input-lt').attr('disabled',true)
							$('.startLt').addClass('nope')
							$('.endLt').removeClass('nope')
							$('.tip-lt').addClass('sure').text(data.msg);
						}else{
							$('.tip-lt').removeClass('sure').text(data.msg);
						}
					},
					error:function(XMLHttpRequest, textStatus, errorThrown){
						//alert(XMLHttpRequest.status);
						 //alert(XMLHttpRequest.readyState);
						// alert(textStatus);
						clearInterval(that_lt.counter);
						$('.tip-lt').addClass('sure').text('请稍后重试...');
					}
				};
				$.ajax(opts);
		}
	}