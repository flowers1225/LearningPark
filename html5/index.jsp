<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<script>var timestamp=new Date().getTime();console.log('timestamp '+timestamp)</script>
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<title>HTML</title>
		<meta name="viewport" content="target-densitydpi=device-dpi, width=device-width, initial-scale=1, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
		<!--
		<meta name="viewport" content="initial-scale=1, width=device-width, maximum-scale=1, user-scalable=no">
		-->
		<link rel="stylesheet" type="text/css" href="css/reset-1.1.min.css" media="all" />
		<link rel="stylesheet" type="text/css" href="css/style_index.css" media="all" />
		<link rel="stylesheet" href="css/idangerous.swiper.css">
		<script>
			//var a = window.screen.height;
			//var b = window.screen.width;
			//alert('宽'+b+'高'+a);
		</script>
		<script type="text/javascript" src="js/jquery-1.10.1.min.js?time=new Date()"></script>
		<script type="text/javascript" src="js/MsgBox.js?time=new Date()"></script>
		<script type="text/javascript" src="js/spin.js?time=new Date()"></script>		
		<script type="text/javascript" src="js/AjaxContent.js?time=new Date()"></script>
		
	</head>
	<script>var timestamp1=new Date().getTime();console.log('timestamp1 '+timestamp1)</script>
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
		<header id="header"> 
			<a href="#" onclick ="window.location.href = 'device:returnMain()';">返回</a>
			<h1>点读学习</h1>
		</header>
		<nav id="nav">
			<ul>
				<li class="active"><a href="javascript:void(0)">认知卡</a></li>
				<li><a href="talking_book/sonobook.html">有声读物</a></li>
				<li><a href="#" id="fd">互动故事</a></li>
				<li><a href="javascript:void(0)">历史记录</a></li>
			</ul>
		</nav>
		 <section data-role="page" id="content">
			 <header>
				<img src="" alt="" />
				<h2 class="ch_h"></h2>
				<p class="ch_f"><span></span>分</p>
			 </header>
			 <!-- 内容显示-->
			 <script>var timestamp2=new Date().getTime();console.log('timestamp2 '+timestamp2)</script>
			<article>			

	        </article>
		 </section>
		 <script>var timestamp3=new Date().getTime();console.log('timestamp3 '+timestamp3)</script>
		  <!-- 大类显示-->
		<footer id="footer">
		 </footer>
		 <script>var timestamp4=new Date().getTime();console.log('timestamp4 '+timestamp3)</script>
		 
	</div>
	</body>
		<script src="js/idangerous.swiper-2.1.min.js"></script>
		<script src="js/idangerous.swiper.3dflow-2.0.js"></script>
		<script type="text/javascript" src="js/index_init.js"></script>
</html>
 <script>var timestamp5=new Date().getTime();console.log('timestamp5 '+timestamp4)</script>
