function Daxie(){
		this.cookie = [];
		this.ip = [];
		this.counter = null;
	}
	Daxie.prototype = {
		init:function(){

			that_gx = this;
			// that_gx.hb();
		
			this.bind();
		},
		bind:function(){
					
			$('.startDaxie').click(function(){
				if($(this).hasClass('nope')){
					return false;
				}
				var room = $.trim($('.room-dx').val());
				var phone = $.trim($('.phone-dx').val());
				var pwd = $.trim($('.pwd-dx').val());
				var content = $.trim($('.content-dx').val());

				var checkboxs = $('.check1');
				var defineLevel = [];
				checkboxs.each(function(idx,check){
				    if($(this).is(':checked')){
				      defineLevel.push($(this).data('level'));
				    }
				})
				if(room ==''||content==''||phone==''||pwd==''){
					$('.tip-gx').text('没填写完整');
					return false;
				}
				if(defineLevel.length == 0){
					$('.tip-gx').text('礼物等级需要至少选一个哦');
					return false;
				}
				var realContent = JSON.stringify(content.split('\n'));
				var realLevel = JSON.stringify(defineLevel);
				if(isNaN(room)){
					$('.tip-gx').text('房间必须是数字哦');
					return false;
				}
				$('.tip-gx').text('数据检查完毕');
				// var ck = JSON.stringify(that_gx.cookie);
				//var ip = JSON.stringify(that_gx.ip);
				$('.tip-gx').text('room'+room);
				that_gx.gxRequest(room,realContent,phone,pwd,realLevel);
				
			})

			$('.endDaxie').click(function(){
				if($(this).hasClass('nope')){
					return false;
				}
				that_gx.stop();
				
			})
		},
		stop:function(){
			var opts = {
				url:'/zhushou/ganxieStop',
				type:'POST',
				cache:'false',
				success:function(data){
					$('.input-gx,.content-dx').removeAttr('disabled');
					$('.startDaxie').removeClass('nope');
					$('.endDaxie').addClass('nope');
					$('.tip-gx').addClass('sure').text('已停止，缓冲时间5秒左右');
				}
			};
			$.ajax(opts)
		},
		startCounter:function(room,realContent,ck){
			that_gx.counter = setInterval(function(){
					that_gx.getip-gx(function(ips){
						that_gx.danmuRequest(room,realContent,ck,JSON.stringify(ips));
					});
			},45*1000)
		}
		,
		hb:function(){
		//hb
			that_gx.hbrequest();
			setInterval(function(){
				that_gx.hbrequest();
			},15000)
		}
		,
		hbrequest:function(){
			var opts = {
					url:'/heartbeat',
					type:'GET',
					success:function(data){
						if(data != 'ok'){
						  $('.endDaxie').trigger('click');
				          top.location.href="/logout";
				        }
					}

				};
				$.ajax(opts);
		}
		,
		gxRequest:function(room,content,phone,pwd,level){
			$('.tip-gx').text('准备发起请求');
			var opts = {
					url:'/zhushou/ganxieStart',
					type:'POST',
					timeout:10000,
					data:{
						room:room,
						content:content,
						phone:phone,
						pwd:pwd,
						level:level
					},
					success:function(data){
						if(data.code ==0){
							$('.input-gx,.content-dx').attr('disabled',true)
							$('.startDaxie').addClass('nope')
							$('.endDaxie').removeClass('nope')
							$('.tip-gx').addClass('sure').text(data.msg);
						}else{
							$('.tip-gx').removeClass('sure').text(data.msg);
						}
					},
					error:function(XMLHttpRequest, textStatus, errorThrown){
						//alert(XMLHttpRequest.status);
						 //alert(XMLHttpRequest.readyState);
						// alert(textStatus);
						clearInterval(that_gx.counter);
						$('.tip-gx').addClass('sure').text('正在重新启动机器人');
						that_gx.gxRequest(room,content,phone,pwd,level);
					}
				};
				$.ajax(opts);
		}
	}
