<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String card_child_id = request.getParameter("card_child_id");
String user_id = request.getParameter("user_id");
%>
<!DOCTYPE html>
<html lang="en" id="bb">
	<head>
		<meta charset="utf-8" />
		<title>HTML</title>
		<meta name="viewport" content="target-densitydpi=device-dpi, width=device-width, initial-scale=1, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
		<script src="js/jquery-1.10.1.min.js"></script>
		<link rel="stylesheet" type="text/css" href="css/reset-1.1.min.css" media="all" />
		<link rel="stylesheet" type="text/css" href="css/style.css" media="all" />
		<link rel="stylesheet" type="text/css" href="css/idangerous.swiper.css">
		<link rel="prefetch" href="index.jsp?user_id=<%=user_id %>" />  
		<script type="text/javascript" src="js/spin.js"></script>
		<script type="text/javascript" src="js/showContent2.js"></script>
		<script type="text/javascript" src="js/jquery-audioPlay.js"></script>			
	</head>
	<body>
	<!--  
	<div id="pageBox">
		<div id="progressBox">
	    	<div id="progressBar">0%</div>
	    	<div id="progressText">0%</div>
		</div>
	</div>
	-->
		<div id="page">
		<a href="index.jsp" id="btn1" class="c_btn"><img src="img/back_btn.png" alt="" /></a>
		<a href="javascript:void(0)" id="btn2" class="c_btn"><img id="qieh" src="img/eng_btn.png" alt="" /></a>
		<div id="main">
				<h1 id='c_title'></h1>
				<a href="javascript:void(0);" id="cbtn_forward"><img src="img/left01.png" alt="" /></a>
				<a href="javascript:void(0);" id="cbtn_last"><img src="img/right01.png" alt="" /></a>	
			<!-- 内容显示 -->
			<div id="show_content" class="swiper-container">
				<div id="content" class="swiper-wrapper">	
							
				</div>
				<div class="pagination"></div>
			</div>
		</div>
	</div>
	</body>
	<script src="js/idangerous.swiper-2.1.min.js"></script>
	<script type="text/javascript" src="js/init.js"></script>
</html>
