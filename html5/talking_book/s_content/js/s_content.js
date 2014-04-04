$(document).ready(function  () {
				url = location.search;
				//urlID = url.substring()
				urlID = url.substring(url.lastIndexOf("&")+1)
				console.log(urlID);
				//console.log(url)
				ContentAjax(url);
				retrunLink(urlID);
			});
var s_showct = $('#s_showct');
var s_nav = $('#s_nav');
var s_navlist = $('#s_nav li');
//		var html = '';
var index;
for (var i=0; i<s_navlist.length; i++) {
	s_navlist[i].index = i;
		s_navlist[i].onclick = function  (e) {
		
		if(this.className == "n_active"){
			return false;
		}else{
			$('#s_nav li').removeClass('n_active')
			$(this).addClass('n_active')
			s_showct.empty();
			this.index == 0 ? ContentAjax(url):createCmtAjax();
		}
			e.preventDefault()
		}
	}
			//获取简介
function ContentAjax(url){
		$.ajax({
		type: "get",
		url: "/LoveBabyDDXX/AlbumDetailServlet"+url,
		cache:"true",
		beforeSend: function(XMLHttpRequest){
			//ShowLoading();
			$("#s_showct").html("<p>正在加载中....</p>")
		},
		success: function(data, textStatus){
			//console.log(data)
			var datas =data.split("*");
			sContentData = eval(datas[0]);
			var urlData = datas[1]
			sShowContent(sContentData,urlData);
			
		},
		complete: function(XMLHttpRequest, textStatus){
			//HideLoading();
		},
		error: function(){
			alert('服务器连接异常!');
		}
	});	
}			
//创建简介
function sShowContent(sContentData,urlData){
	$("#sc_title").html(sContentData[0].album_name)
	var html='';
	//console.log(sContentData)
		var s_showct = $('#s_showct');
			html='';
			html += "<article id=\"s_content\">";
			html += "<header class=\"s_c_h\">";
			html += "<img src=\""+urlData+""+sContentData[0].album_pic+"\">";
			html += "<div id=\"intro\">"
			html += "<h2>"+sContentData[0].album_name+"</h2>"
			html += "<div>"
			html += "<p>播音:<span>&nbsp;"+sContentData[0].broadcaster+"</span></p>"
			html += "<p>作者:<span>&nbsp;"+sContentData[0].album_author+"</span></p>"
			html += "</div>"
			html += "<div>"
			html += "<p>人气:<span>&nbsp;"+sContentData[0].read_nums+"</span></p>"
			html += "<p>更新日期:<span>&nbsp;"+sContentData[0].modify_time+"</span></p>"
			html += "</div>"
			html += "</div>";
			html += "</header>";
			html += "<p class=\"s_c_c\">"+sContentData[0].album_info+"</p>";
			html += "</article>";
			html += "<footer id=\"s_footer\">";
			html += "<ul>";
			//html += "<li id=\"fx\" class=\"l_h\">";
			//html += "<a href=\"javascript:void(0)\"></a>";
			//html += "</li>";
			html += "<li id=\"list\" class=\"l_h\">";
			html += "<a href=\"s-list/s_list.html?album_id="+sContentData[0].album_id+"&"+sContentData[0].album_name+"&"+urlID+"\">播放列表</a>";
			html += "</li>";
			//html += "<li id=\"jf\" class=\"l_h\">";
			//html += "<a href=\"javascript:void(0)\"><span>100</span>积分</a>";
			//html += "</li>";
			html += "</ul>";
			html += "</footer>";
			s_showct.html(html);
	}

		
				
//获取评论数据 
function createCmtAjax(){
	//console.log("获取评论")
		$.ajax({
			type: "get",
			url: "/LoveBabyDDXX/AlbumCommentServlet"+url,
			cache:"true",
			beforeSend: function(XMLHttpRequest){
				//ShowLoading();
				//$("#s_showct").html("<p>正在加载中....</p>")
			},
			success: function(data, textStatus){
				//console.log(data)
				var commentData = data;
   				var comments =commentData.split("*");            	 
   					commentsData = eval(comments[0]);
   					//console.log(commentsData)			  					
  					createCmt(commentsData);			  												
			},
			complete: function(XMLHttpRequest, textStatus){
				//HideLoading();
			},
			error: function(){
				alert('服务器连接异常!');
			}
		});	
	}
//创建评论
function createCmt(commentsData) {
//console.log("评论显示")
		commentsDatas = commentsData.length;
		html='';
		console.log("执行到这里了创建")
		//$("#s_showct").empty(); //先清空标记中的内容
		html += "<article id=\"s_content\" class=\"iscrollList\">";
		//console.log(html)
		 if(commentsDatas == 0){
   				html += "<p class=\"no_comment\">暂无评论</p>";
   			}else{
   				html += "<ul id=\"cmt_list\">";
				for(var i=0;i<commentsDatas;i++){
					html += "<li>";
					html += "<div><p>"+commentsData[i].user_nick_name+"</p></div>";
					html += "<div>";
					html += "<p class=\"line-h\">"+commentsData[i].comm_content+"</p>";
					html += "<p class=\"time\">"+commentsData[i].comm_time+"</p>";
					html += "</div>";
					html += "</li>";
				}						
			html += "</ul>";
   			}																		
			html += "</article>";
			html += "<footer id=\"s_footer\">";
			html += "<form action =\"\" id=\"cmt_footer\">";
			//html += "<input type=\"text\" name=\" \" id=\"input_text\" placeholder=\"请输入你的评论.....\"/>";
			html +="<textarea id=\"input_text\" placeholder=\"请输入你的评论.....\"/></textarea>"
			//html += "<a href=\"javascript:void(0)\" id=\"subt\" /></a>";
			html += "<input type=\"button\" value=\"\" id=\"subt\"/>"
			html += "</form>";
			html += "</footer>";						
			s_showct.html(html);
			iscroll();
			myScroll.refresh();
			submitContent()						
		}
function submitContent(){
						
		  //点击"发表"按钮事件    	
		var btn = document.getElementById("subt");
		
		btn.onclick = function (){					
			var user_id = urlID.substring(urlID.lastIndexOf("=")+1);
     		var album_id = sContentData[0].album_id;
   	 		var comm_content = $("#input_text").val(); //提交的内容 comm_content  	 		
   	 		var comm_contents = comm_content.trim();
   	 		//alert(comm_contents == "")
   	 		if(comm_contents == ""){
   				alert("请输入评论!")
   			 }else{
   	 		$.ajax(
         	  {
               type: "GET",
               url: "/LoveBabyDDXX/RecordAlbumCommServlet",  //请求增加数据动态页
              // dataType: "josn",
               data: { user_id: user_id, album_id: album_id, comm_content: comm_content },
               success: function(msg) {
            	   createCmtAjax();
                   $("#input_text").val("");
              	 }
          	 });   
   			}			   			
		}
	}
function iscroll(){
	console.log("执行了这里")
	myScroll = new IScroll(".iscrollList");
	document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
}
function retrunLink(urlID){
	console.log(urlID)
	console.log($("#s_header").find("a")[0].href="../sonobook.html?"+urlID)
}