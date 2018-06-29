<%@ page language="java" import="java.util.*" contentType="text/html; charset=utf-8" pageEncoding="utf-8" isELIgnored="false"%>
<html>
  <head>
    <title>数据源配置</title>
    <meta http-equiv="pragma" content="no-cache"> 
	<meta http-equiv="cache-control" content="no-cache"> 
	<meta http-equiv="expires" content="0">
    
	<link rel="stylesheet" type="text/css"	href="${pageContext.request.contextPath}/public/scripts/ext3.4.0/resources/css/ext-all.css" />
	<link rel="stylesheet" type="text/css"	href="${pageContext.request.contextPath}/public/css/icon.css" />
	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/public/scripts/dhtmlx/dhtmlxtree.css"/>
	<link rel="stylesheet" type="text/css"	href="${pageContext.request.contextPath}/public/css/arrow.css" />
	
	<%@ include file="/skin.jsp"%>
	
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/ext3.4.0/adapter/ext/ext-base.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/ext3.4.0/ext-all.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/ext3.4.0/locale/ext-lang-zh_CN.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/ext3.4.0/ux/RowExpander.js"></script>
	
	<script type="text/javascript">
    	var pathUrl = "${pageContext.request.contextPath}";
		var extPath = "${pageContext.request.contextPath}/public/scripts/ext3.4.0";
		Ext.BLANK_IMAGE_URL = extPath + '/resources/images/default/s.gif';
		Ext.QuickTips.init();
		Ext.MessageBox.buttonText.yes = '确定';
		Ext.MessageBox.buttonText.no = '取消';
		var addWindow=null,editWindow=null;
    </script>
	
	<script type="text/javascript" src="${pageContext.request.contextPath}/bsc/scripts/datasource_config_layout.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/bsc/scripts/datasource_config.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/kpi/scripts/selector.js"></script>
		
  </head>
  
  <body>
    
  </body>
</html>
