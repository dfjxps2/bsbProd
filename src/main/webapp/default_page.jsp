<%@ page language="java" contentType="text/html; charset=utf-8" isELIgnored="false"
    pageEncoding="utf-8"%>
<%@taglib  prefix="s"  uri="/struts-tags"%>
<html>
  <head>
    <title>系统默认页</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">

	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/public/scripts/ext3.4.0/resources/css/ext-all.css" />
	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/public/css/icon.css" />
	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/public/scripts/dhtmlx/dhtmlxgrid.css">
	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/public/css/arrow.css" />
	
	<%@ include file="/skin.jsp"%>
	
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/ext3.4.0/adapter/ext/ext-base.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/ext3.4.0/ext-all.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/ext3.4.0/locale/ext-lang-zh_CN.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/jquery/jquery-1.9.1.js"></script>
	<script type="text/javascript">
		var pathUrl="${pageContext.request.contextPath}";
	</script>
	
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/default_page.js"></script>
  </head>
  <body>
  	<iframe id="chartframe" name="chartframe" style="width:100%;height: 100%;background-color:white;overflow:hidden;border:0px;" frameborder="0"></iframe>
  </body>
</html>
