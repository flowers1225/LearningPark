
function gainNavContent(url){
	$.ajax({
		type: "get",
		url: "/LoveBabyDDXX/CardIndexServlet"+url,
		cache:"true",
		beforeSend: function(XMLHttpRequest){
			$("#footer").html("<p>正在加载中....</p>")
	},
		success: function(data, textStatus){
			// console.log(data)
			var datas =data.split("*");
			var urse =  eval(datas[0])
			var sNavData = eval(datas[1]);
			var cCntData =  eval(datas[2]);
			var urlData = datas[3];
			showNavContent(sNavData,urse,urlData,url);
			showKindContent(cCntData,urlData,url);			
		},
		error: function(){
			alert('服务器连接异常!');
		}
	});		
}
//显示导航
function showNavContent(sNavData,urse,urlData,urlID){
	var content = $("#content");
	content.find("img").attr("src",urse[0].user_pic);
	content.find(".ch_h").html(urse[0].user_nick_name);
	content.find(".ch_f").find("span").html(urse[0].user_integral);
	var strHTML= "";
	var sNavDatas = sNavData.length;
	strHTML += "<ul class=\"swiper-wrapper\">"
	for(i=0;i<sNavDatas;i++){
		if(i==0){
			strHTML += "<li class=\"swiper-slide act \" id="+sNavData[i].card_id+"><img src="+urlData+sNavData[i].card_pic_name+"></li>"
		}else{
		strHTML += "<li class=\"swiper-slide \" id="+sNavData[i].card_id+"><img src="+urlData+sNavData[i].card_pic_name+"></li>"	
		}
	}
	strHTML +="</ul>"
	$("#footer").addClass("swiper-container thumbs-cotnainer").html(strHTML);
	var navList = $("#footer").find("li");
	for(j=0;j<sNavDatas;j++){
		navList[j].onclick = function (){
			var ID = this.id;
			if(!$(this).hasClass('act')){
				navList.removeClass("act");
				$(this).addClass(" act");
				gainKindContent(ID,urlID)
			}			
		}
	}
	Slide();
}

//获取小类内容
function gainKindContent(ID,urlID){
	$.ajax({
		type: "get",
		url: "/LoveBabyDDXX/CardChildServlet?card_id="+ID+"&"+urlID.substring(1),
		cache:"true",
		beforeSend: function(XMLHttpRequest){
			$("article").html("<p>正在加载中....</p>")
		},
		success: function(data, textStatus){
			var datas =data.split("*");
			var sKindData = eval(datas[0]);
			var urlData = datas[1];
			showKindContent(sKindData,urlData,urlID);
			
		},
		error: function(){
			alert('服务器连接异常!');
		}
	});	
	
} 
// 显示小类
function showKindContent(sKindData,urlData,urlID){

	var sKindDatas = sKindData.length;
	var CntHTML ="";
	CntHTML += "<ul class=\"swiper-wrapper\">"
	for(i=0;i<sKindDatas;i++){
		if(sKindData[i].pay_count == 0){
			CntHTML += "<li class=\"swiper-slide \" id="+sKindData[i].card_child_id+"><a href=fruit.jsp?card_child_id="+sKindData[i].card_child_id+"&"+urlID.substring(1)+"><img src="+urlData+sKindData[i].card_child_pic+"></a></li>"			
		}else{
			CntHTML += "<li class=\"swiper-slide \" id="+sKindData[i].card_child_id+"><a href=fruit.jsp?card_child_id="+sKindData[i].card_child_id+"&"+urlID.substring(1)+"><img src="+urlData+sKindData[i].card_child_pic+"></a><span class=\"speaker\">"+sKindData[i].pay_count+"积分</span></li>"
		}
	}
	CntHTML +="</ul>"
	$("#content").find("article").addClass("swiper-container banners-container").html(CntHTML);
	$(".banners-container").hide().fadeTo('slow',1);
	Slide();

	var is_pay;
	var lContent = $('#content').find("a");
	for (j=0;j<lContent.length;j++){
		is_pay = sKindData[j].is_pay;
		lContent[j].onclick =function (e){
			var _this =this
			if(is_pay == 4){
				$(this).msgBox({
		          'msgType' :'Alerta',
				  'msgText' : '积分不足，请充值！',
		          'buttonOk' : '好'
		        });
				return false;
			}else if(is_pay == 5){
				$(this).msgBox({
		          'msgType' :'Confirm',
				  'msgText' : '是否确认购买？' ,
		          'buttonOk' : '是' ,
		          'buttonCancel' : '否'
		        },respuesta);
		        return false;
	        function respuesta( respuesta )
			    {
			    	if(respuesta == "true"){location.href = _this.href;}				    	
			    }
			}
		}
	}	

}
//滑动
function Slide(){
	$('.thumbs-cotnainer').each(function(){
		$(this).swiper({
			slidesPerView:'auto',
			offsetPxBefore:25,
			offsetPxAfter:10,
			calculateHeight: true
		})
	})
	$('.banners-container').each(function(){
		$(this).swiper({
			slidesPerView:'auto',
			offsetPxBefore:25,
			offsetPxAfter:10
		})	
	})
}
