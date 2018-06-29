<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8" isELIgnored="false"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <title>BSC测算与发布</title>
    <meta http-equiv="pragma" content="no-cache"> 
	<meta http-equiv="cache-control" content="no-cache"> 
	<meta http-equiv="expires" content="0">
	
	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/public/scripts/ext3.4.0/resources/css/ext-all.css" />
	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/public/css/icon.css" />
	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/public/scripts/dhtmlx/dhtmlxtree.css">

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
		
		var ownerOrgId = '${sessionScope.currentUser.owner_org_id}';
		
		var page = 'calculate';//用于区别tbar与方案列表
		var projectID="",parameterID="",roleID="",published="",monthID = "",cycleTypeID = "",fullScore = "";
    </script>
	
	<script type="text/javascript" src="${pageContext.request.contextPath}/kpi/scripts/selection.js"></script>		
  	<script type="text/javascript" src="${pageContext.request.contextPath}/bsc/scripts/bsc_calc_exec_common_layout.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/bsc/scripts/bsc_calc_exec_common.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/bsc/scripts/do_execute_project.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/bsc/scripts/progress.js"></script>

  </head>
  <body>
  </body>
</html>
