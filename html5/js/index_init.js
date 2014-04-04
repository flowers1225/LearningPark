window.onload  = function() {
		var url = location.search;	
		//console.log(url)
		gainNavContent(url);
		//removeElemt();
		linkHref(url);
		MsgBox();
		/*
		var iNow = 0;
		var timer = setInterval(function(){
	
		if(iNow==100){
			clearInterval(timer);
			$("#pageBox").delay(600).fadeOut("slow");
		}
		else{
			iNow += 1;				
			progressFn(iNow);
		}		
	},30);
	*/
}		
function linkHref(url){
	var navLink = $("nav").find("li").find("a");
	navLink[1].href ="talking_book/sonobook.html"+url;
}
function MsgBox(e){
	$('#fd').click(function(e){
        $(this).msgBox({
          'msgType' :'Alerta',
		  'msgText' : '敬请期待！',
          'buttonOk' : '好'
        });
      });
}
function progressFn(cent){
	
	var oDiv1 = document.getElementById('progressBox');
	var oDiv2 = document.getElementById('progressBar');
	var oDiv3 = document.getElementById('progressText');
	
	var allWidth = parseInt(getStyle(oDiv1,'width'));
	
	oDiv2.innerHTML = cent + '%';
	oDiv3.innerHTML = cent + '%';
	oDiv2.style.clip = 'rect(0px, '+ cent/100 * allWidth +'px, 40px, 0px)';
	
	
	function getStyle(obj,attr){
		if(obj.currentStyle){
			return obj.currentStyle[attr];
		}
		else{
			return getComputedStyle(obj,false)[attr];
		}
	}
}