//获取中文
function AjaxShowContent(url){
	$.ajax({
		type: "get",
		url: "/LoveBabyDDXX/CardServlet"+url,
		//cache:"true",
		beforeSend: function(XMLHttpRequest){
			Spin();
	},
		success: function(data, textStatus){
			//console.log(data)
			var datas =data.split("*");
			var title =  eval(datas[0])
			var contentChData = eval(datas[1]);
			var urlData = datas[2];
			 showContent(contentChData,urlData,title);
			
		},
		complete: function(XMLHttpRequest, textStatus){
			$(".spinner").remove();
		},
		error: function(){
			alert('服务器连接异常!');
		}
	});
}
//获取英文
function AjaxShowEgContent(url){
	$.ajax({
		type: "get",
		url: "/LoveBabyDDXX/CardEnServlet"+url,
		//cache:"true",
		beforeSend: function(XMLHttpRequest){
			//ShowLoading();
			Spin();
			//$("#content").html("<p>正在加载中....</p>")
	},
		success: function(data, textStatus){
			//console.log(data)
			var datas =data.split("*");
			var contentEgData = eval(datas[0]);
			var urlData = datas[1];
			 showContent(contentEgData,urlData);
			
		},
		complete: function(XMLHttpRequest, textStatus){
			//HideLoading();
			$(".spinner").remove();
		},
		error: function(){
			alert('服务器连接异常!');
		}
	});
}
function showContent(contentData,urlData,title){
	var partition = getNewArray(contentData,8);	
	var partitions = partition.length;
	var strHTML = "";
	var aa = [];
	if (title){
		$("#c_title").html("<img src="+urlData+title[0].title_pic+">");	
	}	
	for(i=0;i<partitions;i++){
		strHTML += "<div class=\"c_content swiper-slide\"><ul>";
		for(j=0;j<partition[i].length;j++){
			if(partition[i][j].card_file_ch){
				audioSrc = urlData+partition[i][j].card_file_ch;
				aa.push(audioSrc)
				strHTML += "<li><img src="+urlData+partition[i][j].card_pic_c+"><div class=\"hv\"></div></li>";	
			}else{
				audioSrc = urlData+partition[i][j].card_file_eg;
				aa.push(audioSrc)
				strHTML += "<li><img src="+urlData+partition[i][j].card_pic_e+"><div class=\"hv\"></div></li>";	
			}				
		}
		strHTML += "</ul></div>"
	}
	$("#content").html(strHTML);
	$("#show_content").hide();	
	
	Swipers();
	$("#show_content").fadeTo('slow',1);
	playAudios(aa);
}


//分页
function getNewArray(myArray,size){  
  var len=parseInt(myArray.length/size);  
  var remain=myArray.length%size;  
  var my_array=[],count=1,sot=remain>0?len+1:len;   
  for ( var f = 1; f <=sot; f++) {  
    var start=size*(f-1);  
    var end=(f>len)?((f-1)*size+remain):f*size;  
    var mylocates=myArray.slice(start,end);  
    my_array.push(mylocates);  
  }  
 return my_array;  
}  

//滑动
function Swipers(){
	var mySwiper = new Swiper('.swiper-container',{
    pagination: '.pagination',
    paginationClickable: true
  	});
  $('#cbtn_forward').on('click', function(e){
    e.preventDefault();
    mySwiper.swipePrev();
  });
  $('#cbtn_last').on('click', function(e){
    e.preventDefault();
    mySwiper.swipeNext();
	});
}
//音乐播放
function playAudios(audioSrcs){
	if($('audio')){
		$('audio').remove()
	};
	console.log("准备音乐")
	//console.log(audioSrcs)
	var list = $("#content").find("li");
	var lists = list.length;
	for (i=0;i<lists;i++){
		list[i].setAttribute('id','s'+i);
		$('#s'+i).audioPlay({
			name: 'play'+i,
			urlMp3: audioSrcs[i],
			//urlWav: 'audio/fruit/'+aa[i]+'.wav',
			clone: true
		})
	}
}
//切换
function handoverImgs(url){
	var url = url;
	var c_btnimg = $('.c_btn').find("img");
	var btn = ["c_button01.png","eng_btn.png"];
	var site = c_btnimg[1].src;
	var img_ec = false;
	  $('#btn2').on('click', function(e){
	 if (img_ec == false ) {
	 	AjaxShowEgContent(url);
	 	site = "img/"+btn[0];
		img_ec = true;
	 }else {		
		AjaxShowContent(url);
		site = "img/"+btn[1];
		img_ec = false;
	 }
	  c_btnimg[1].setAttribute("src",site);	
		e.preventDefault();
	  })	           
}

function Spin() {  
	var opts = {    
		  lines: 12, // 菊花瓣的数目    
		  length: 7, // 菊花瓣的长度    
		  width: 4, // 菊花瓣的宽度    
		  radius: 10, // 菊花中心的半径    
		  corners: 1, // 菊花瓣的圆滑度(0--1)    
		  rotate: 0, // 让菊花旋转的角度    
		  color: '#000', // 菊花的颜色    
		  speed: 1.6, // 菊花旋转的速度    
		  trail: 58, // 菊花旋转时的余辉    
		  shadow: false, // 是否需要菊花的阴影    
		  hwaccel: false, // 是否需要菊花高速旋转(硬件加速)    
		  className: 'spinner', // 菊花的classname    
		  zIndex: 2e9, // 菊花的z-index值    
		  top: 'auto', // 菊花相对定位的top    
		  left: 'auto', // 菊花相对定位的left    
		  position: 'relative'  
		};    
		var target = document.getElementById('show_content');  //top和left使用auto，使得菊花定位于bb的正中心  
		var spinner = new Spinner(opts).spin(target);    

}
