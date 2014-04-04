window.onload  = function() {
		  var url = location.search;	
		  NavAjax(url);
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
//接收内容导航数据
function NavAjax(url){	
	$.ajax({
		type: "get",
		url: "/LoveBabyDDXX/DDProvideServlet"+url,
		cache:"true",
		beforeSend: function(XMLHttpRequest){
			//ShowLoading();
		},
		success: function(data, textStatus){
			//console.log(data)
			var datas =data.split("*");
			var urse = eval(datas[0]);
			var navData = eval(datas[1]);
			var mContentData = eval(datas[2]);
			var urlData = datas[3]
			showcNav(navData,urlData,urse,url);
			showContent(mContentData,urlData,url);
			
		},
		complete: function(XMLHttpRequest, textStatus){
			//HideLoading();
		},
		error: function(){
			alert('服务器连接异常!');
		}
	});	
}

//导航显示

function showcNav(navData,urlData,urse,urlID){
	var content = $("#content");
	//content.find("img").attr("src",urlData+urse[0].user_pic);
	content.find("img").attr("src",urse[0].user_pic);
	content.find(".ch_h").html(urse[0].user_nick_name);
	content.find(".ch_f").find("span").html(urse[0].user_integral);
	var c_nav = $('#c_nav');
	var nc_list = " ";					
	for (var i=0;i<navData.length;i++){
	 if(navData[i].pro_pic == ""){
		 if (i==0){
		 	nc_list += "<li class=\"m\" id ="+navData[i].pro_id+"><p>"+navData[i].pro_name+"</p></li>"
		 }else{
		 	nc_list += "<li id ="+navData[i].pro_id+"><p>"+navData[i].pro_name+"</p></li>"
		 }					 	
	 }else{
	 	nc_list += "<li id ="+navData[i].pro_id+"><p><img src ="+urlData+""+navData[i].pro_pic+"></p></li>"
	 }	
	} 
	var c_ul ="<ul>"+nc_list+"</ul>"				
	c_nav.append(c_ul);
	clickShow(urlID);
}

//内容显示

function showContent(mContentData,urlDate,urlID){
	//var _urlID = urlID.substring(1)
var partition = getNewArray(mContentData,4);
	//console.log(partition);
	var show_content = $("#show_content article");
	show_content.removeClass();
	show_content.empty();
	var cc_list = " ";
	cc_list += "<ul>"
	for(i=0;i<partition.length;i++){
		
		cc_list += "<li><div class=\"s_content\">"
		for (j=0;j<partition[i].length;j++){
			cc_list +="<a href = \"s_content/s_content.html?album_id="+partition[i][j].album_id+"&"+urlID.substring(1)+"\"><img src = "+urlDate+""+partition[i][j].album_pic+"></a>"
		}
		cc_list += "</div></li>"
	}
	cc_list += "</ul>"
	show_content.append(cc_list);
	if (partition.length > 1){
		$("#show_content article").addClass('swiper-container').find("ul").addClass('swiper-wrapper').find("li").addClass('swiper-slide');
	}
	Slid();
	$("#show_content").hide();
	
	$("#show_content").fadeTo('slow',1);
}

//数组分割

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
function Slid(){
	var mySwiper = new Swiper('.swiper-container',{
   // pagination: '.pagination',
	paginationClickable: false,
	mode: 'vertical'
  });
} 
function clickShow(urlID){
	var liList = $("#c_nav").find('li');
	var liLists = liList.length;
	for(i=0; i<liLists;i++){
		liList[i].onclick = function (){
			if (this.className == 'm'){
				return false
			}else{
				liList.removeClass(' m');
				$(this).addClass(' m');
				var id = this.id;
				ContentAjax(id,urlID);	
			}				
		}
	}
}
function ContentAjax(id,urlID){
	$.ajax({
		type: "get",
		url: "/LoveBabyDDXX/AlbumIndexServlet?pro_id="+id+"&"+urlID.substring(1),
		cache:"true",
		beforeSend: function(XMLHttpRequest){
			Spin();
		},
		success: function(data, textStatus){
			
			//console.log(data)
			var datas =data.split("*");
			var ContentData = eval(datas[0]);
			var urlDate = datas[1]
			if(ContentData == ""){
				var show_content = $("#show_content article");
				show_content.empty();
				show_content.html("<p class=\"no_content\">暂无推荐</p>")
			}else{
				showContent(ContentData,urlDate,urlID);
			}
			
		},
		complete: function(XMLHttpRequest, textStatus){
			$(".spinner").remove();
		},
		error: function(){
			alert('服务器连接异常!');
		}
	});		
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
function linkHref(url){
	var navLink = $("nav").find("li").find("a");
	navLink[0].href ="../index.jsp"+url;
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