$(function(){
	var absArr = []; 
	var resultNum = 0;
	var items = $('.item-name');
	$('.search').focus();
	$('.item-name').each(function(){
		absArr.push($(this).data('abs').toLowerCase());
	})
	$('.search').on('change',function(){
		var tmp_val  = $.trim($(this).val()).toLowerCase();
		if(tmp_val != ''){
			for(var i =0; i < absArr.length;i++){
				if(absArr[i] == tmp_val){
					$('.item-name').eq(i).addClass('yellow');
					getLangweb($('.item-name').eq(i).text());
					$('.search-result').removeClass('hide');
					resultNum++;
				}else{
					$('.item-name').eq(i).removeClass('yellow');
				}
				if(i == absArr.length-1 && resultNum == 0){
					$('.item-name').removeClass('yellow');
					$('.search-result').addClass('hide');
					if(tmp_val == "help"){
						$('.help-block').removeClass('hide');
						$('.result-lang').hide();
					}else if(tmp_val == "helpc"){
						$('.help-block').addClass('hide');
						$(this).val('');
						$('.result-lang').show();
					}else{
						$('.help-tip').show();
						$('.help-block').addClass('hide');
						$('.result-lang').show();
					}

				}
			}
		}else{
			$('.item-name').removeClass('yellow');
			$('.help-block').addClass('hide');
			$('.result-lang').show();
		}
		
		$(this).trigger('focus')
		resultNum = 0;
	})
	
	$('.item-name').on('click',function(){
		$('.item-name').removeClass('yellow');
		$(this).addClass('yellow');
		getLangweb($(this).text());

	});
})


function getLangweb(lang){
	$('.result').empty();
	var content0 = '';//社区
	var content1 = '';//博客
	var content2 = '';//框架应用
	var content3 = '';//资源
	$.get('/langwebinfo?name='+lang,function(data){
		if(data){
			for(var i = 0; i < data.length; i++){
					switch(parseInt(data[i].type)){
						case 0:
							content0 += '<p class="info col-md-2" title='+data[i].title+'><a href='+data[i].url+' target="_blank">'+data[i].name+'</a></p>';
							continue;
						case 1:
							content1 += '<p class="info col-md-2" title='+data[i].title+'><a href='+data[i].url+' target="_blank">'+data[i].name+'</a></p>';
							continue;
						case 2:
							content2 += '<p class="info col-md-2" title='+data[i].title+'><a href='+data[i].url+' target="_blank">'+data[i].name+'</a></p>';
							continue;
						case 3:
							content3 += '<p class="info col-md-2" title='+data[i].title+'><a href='+data[i].url+' target="_blank">'+data[i].name+'</a></p>';
							continue;
					}
					
			}
			content0 = content(content0);
			content1 = content(content1);
			content2 = content(content2);
			content3 = content(content3);
			
			content0= content0+content1+content2+content3;
			$('.result').append(content0);
		}
		
	})
	$('.search-result').show();
	$('.search').val('').focus();
	$('.help-tip').hide();
}

function content(c){
	if(c){
		c =  '<div class="result-lang-inside"> '+c+'</div>';
	}
	return c;
}