<%@ page language="java" import="java.util.*,com.rx.system.domain.SysUser" contentType="text/html; charset=utf-8" pageEncoding="utf-8" isELIgnored="false"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <title>方案分析</title>
    <meta http-equiv="pragma" content="no-cache"> 
	<meta http-equiv="cache-control" content="no-cache"> 
	<meta http-equiv="expires" content="0">
	
	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/public/scripts/ext3.4.0/resources/css/ext-all.css"/>
		<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/public/css/icon.css"/> 
		<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/public/css/arrow.css"/>
		<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/public/css/morris.css"/>
		<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/public/scripts/dhtmlx/dhtmlxgrid.css">
		<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/public/scripts/dhtmlx/dhtmlxtree.css">
		
		<%@include file="/skin.jsp" %>
		
		<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/ext3.4.0/adapter/ext/ext-base.js"></script>
		<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/ext3.4.0/ext-all.js"></script>
		<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/ext3.4.0/locale/ext-lang-zh_CN.js"></script>
		
		<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/dhtmlx/dhtmlxcommon.js"></script>
		<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/dhtmlx/dhtmlxgrid.js"></script>
		<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/dhtmlx/dhtmlxgridcell.js"></script>
		<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/dhtmlx/ext/dhtmlxgrid_splt.js"></script>
		<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/dhtmlx/ext/dhtmlxgrid_math.js"></script>
		<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/dhtmlx/ext/dhtmlxgrid_rowspan.js"></script>
		<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/dhtmlx/ext/dhtmlxgrid_filter.js"></script>
		<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/dhtmlx/ext/dhtmlxgrid_srnd.js"></script>
		
		<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/jquery/jquery-1.9.1.js"></script>
		
		<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/morris/morris.js"></script>
		<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/morris/raphael-min.js"></script>
	<script type="text/javascript">
		
		var pathUrl = '${pageContext.request.contextPath}';
   		Ext.BLANK_IMAGE_URL =pathUrl+ '/public/scripts/ext3.4.0/resources/images/default/s.gif';
   		Ext.QuickTips.init();
		
		var dhtmlGrid = null;
		var project_id = '${param.project_id}';
		var month_id = '${param.month_id}';
		var object_id = '${param.object_id}';
		var prev_page = '${param.prev_page}';
		var objCateId = '${param.objCateId}';
    </script>
	
			
  	<script type="text/javascript" src="${pageContext.request.contextPath}/bsc/scripts/bsc_project_analyse_layout.js"></script>
  </head>
  <body>
  	<div id="graph" width="100%" height="100%" style="background-color:white;overflow:auto;border:0px">
  		<iframe id="graph_frame" width="100%" height="100%" style="background-color:white;overflow:auto;border:0px;" frameborder="0"></iframe>
  	</div>
  	<div id="measure_list" width="100%" height="100%" style="background-color:white;overflow:auto;border:0px"></div>
  	<div id="measure_his" width="100%" height="100%" style="background-color:white;overflow:auto;border:0px;">
  		<iframe id="measure_his_frame" width="100%" height="100%" style="background-color:white;overflow:auto;border:0px;" frameborder="0"></iframe>
  	</div>
  </body>
</html>
