<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>

<%
				String path = request.getContextPath();
				String basePath = request.getScheme() + "://"
						+ request.getServerName() + ":" + request.getServerPort()
						+ path + "/";
						
		%>
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<title>HTML</title>
		<link rel="stylesheet" type="text/css" href="css/reset-1.1.min.css" media="all" />
		<link rel="stylesheet" type="text/css" href="css/idangerous.swiper.css" media="all" />
		<link rel="stylesheet" type="text/css" href="css/showpage.css" media="all" />
		<script type="text/javascript" src="js/jquery.min.js"></script>
		<script type="text/javascript">
			function removeElemt () {
					setTimeout(scrollTo,0,0,0); 
					$('#page-wrap').remove();
			}
		</script>
	</head>

	<body onload = 'removeElemt()'>
	<div id="page-wrap">
		<p>请选择下面的动物</p>
	</div>
		<article  class="swiper-container banners-container">
			<ul class="swiper-wrapper">
			<%
			 String kind = (String)request.getSession().getAttribute("kind");
                System.out.println("kind........:"+kind);
				ArrayList<HashMap<String, Object>> list = new ArrayList<HashMap<String, Object>>();
				list = (ArrayList<HashMap<String, Object>>) request.getSession().getAttribute("list");
				HashMap<String, Object> index_m = new HashMap<String, Object>();
				for (int i = 0; i < list.size(); i++) {
					index_m = list.get(i);
					int id = Integer.parseInt(index_m.get("CARD_CHILD_ID").toString());
					 System.out.println("id:"+id);
					String card_name = (String) index_m.get("CARD_NAME");
					 System.out.println("card_name.......:"+card_name);
					String card_is_pay = (String) index_m.get("IS_PAY");
					String card_pic = (String) index_m.get("CARD_PIC");
					String img_path = basePath + "img/fruit/card_child/" + card_pic;
                   out.print(" <li class=\"swiper-slide\"><a href="+basePath+"CardServlet?card="+card_name+"&kind="+kind +" id=\"btnl\"><img src="+img_path+" alt=\"\" /></a></li>");
			 }
			 %>
			<!--

			    <li class="swiper-slide"><a href="1/index.html" id="btnl"><img src="img/study_cs01.png" alt="" /></a></li>
				<li class="swiper-slide"><a href="javascript:void(0)"><img src="img/study_cs03.png" alt="" /></a></li>
				<li class="swiper-slide"><a href="javascript:void(0)"><img src="img/study_cs05.png" alt="" /></a></li>
				<li class="swiper-slide"><a href="javascript:void(0)"><img src="img/study_cs07.png" alt="" /></a></li>
			--></ul>
		 </article>
		    <script src="js/idangerous.swiper-2.0.min.js"></script>
			<script src="js/idangerous.swiper.3dflow-2.0.js"></script>
			<script src="js/appstore.js"></script>
	</body>
</html>
