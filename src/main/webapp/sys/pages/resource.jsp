<%@ page language="java" import="java.util.*" contentType="text/html; charset=utf-8" pageEncoding="utf-8" isELIgnored="false"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <title>系统菜单</title>
    <meta http-equiv="pragma" content="no-cache">
    <meta http-equiv="cache-control" content="no-cache">
    
	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/public/scripts/ext3.4.0/resources/css/ext-all.css" />
	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/public/css/icon.css" />
	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/public/scripts/dhtmlx/dhtmlxtree.css">

	<%@ include file="/skin.jsp"%>

	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/ext3.4.0/adapter/ext/ext-base.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/ext3.4.0/ext-all.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/ext3.4.0/locale/ext-lang-zh_CN.js"></script>

	<script  src="${pageContext.request.contextPath}/public/scripts/dhtmlx/dhtmlxcommon.js"></script>
	<script  src="${pageContext.request.contextPath}/public/scripts/dhtmlx/dhtmlxtree.js"></script>

  	<script type="text/javascript" src="${pageContext.request.contextPath}/sys/scripts/resourceLayout.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/sys/scripts/resource.js"></script>

  </head>
  <body>
  	<div id="north"></div>
  	<div id="center" style="overflow: auto;	height: 100%"></div>
	<script type="text/javascript">
  		var pathUrl = "${pageContext.request.contextPath}";
		var extPath = "${pageContext.request.contextPath}/public/scripts/ext3.4.0";
		Ext.BLANK_IMAGE_URL = extPath + '/resources/images/default/s.gif';
		Ext.QuickTips.init();
		tree=new dhtmlXTreeObject("center","100%","100%","");
		tree.setImagePath("${pageContext.request.contextPath}/public/scripts/dhtmlx/imgs/");
		tree.loadXMLString('${requestScope.xml}');
		tree.setOnDblClickHandler(editNode);
    </script>
  </body>
</html>
