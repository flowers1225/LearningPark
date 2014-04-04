
$(window).load(function() { 
	var url = location.search;	
	var urlID = url.substring(url.lastIndexOf("&")+1)
	AjaxShowContent(url);
	handoverImgs(url)
	//removeElemt();
	urlLink(urlID);
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
})		
 function urlLink(urlID){
  	$("#btn1")[0].href="index.jsp?"+urlID;
  	//console.log($("#btn"))
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
