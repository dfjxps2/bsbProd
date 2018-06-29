<%@ page language="java" import="java.util.*" contentType="text/html; charset=utf-8" pageEncoding="utf-8" isELIgnored="false"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <title>日志管理</title>
    <meta http-equiv="pragma" content="no-cache">
    <meta http-equiv="cache-control" content="no-cache">
    
	<link rel="stylesheet" type="text/css"	href="${pageContext.request.contextPath}/public/scripts/ext3.4.0/resources/css/ext-all.css" />
	<link rel="stylesheet" type="text/css"	href="${pageContext.request.contextPath}/public/css/icon.css" />
	<link rel="stylesheet" type="text/css"	href="${pageContext.request.contextPath}/public/css/arrow.css" />
	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/public/scripts/dhtmlx/dhtmlxgrid.css">
	
	<%@ include file="/skin.jsp"%>
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/ext3.4.0/adapter/ext/ext-base.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/ext3.4.0/ext-all.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/ext3.4.0/locale/ext-lang-zh_CN.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/dhtmlx/dhtmlxcommon.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/dhtmlx/dhtmlxgrid.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/dhtmlx/dhtmlxgridcell.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/others/MyPagingToolbar.js"></script>	
	
	<script type="text/javascript">
    	var pathUrl = "${pageContext.request.contextPath}";
		var extPath = "${pageContext.request.contextPath}/public/scripts/ext3.4.0";
		Ext.BLANK_IMAGE_URL = extPath + '/resources/images/default/s.gif';
		Ext.QuickTips.init();
		var sysDate = '${sessionScope.sysDate}';
		
		var mask = new Ext.LoadMask(Ext.getBody(), {
			msg : 'Please Wait... '
		});
		
		function showMask() {
			mask.show();
		};
		
		function hiddenMask() {
			mask.hide();
		}
    </script>
	
	<script type="text/javascript" src="${pageContext.request.contextPath}/sys/scripts/log_info_layout.js"></script>
  </head>
  
  <body>
    <div id="grid" width="100%" height="100%" style="background-color:white;overflow:auto;border:0px"></div>
    <div id="gridDetail" width="100%" height="100%" style="background-color:white;overflow:auto;border:0px"></div>
    <form id="excelForm" name="excelForm" action="log_export.action" method="post" target="">
		<input type="hidden" name="begin_date" />
		<input type="hidden" name="end_date" />
		<input type="hidden" name="userKey" />
		<input type="hidden" name="file_name" />
		<input type="hidden" name="exportType" />
	</form>
	<form id="excelForm_user" name="excelForm_user" action="log_export.action" method="post" target="">
		<input type="hidden" name="queryInfo" />
		<input type="hidden" name="file_name" />
		<input type="hidden" name="exportType" />
	</form>
  </body>
</html>
