<%@ page language="java" import="java.util.*" contentType="text/html; charset=utf-8" pageEncoding="utf-8" isELIgnored="false"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <title>方案指标</title>
    
	<link rel="stylesheet" type="text/css"	href="${pageContext.request.contextPath}/public/scripts/ext3.4.0/resources/css/ext-all.css" />
	<link rel="stylesheet" type="text/css"	href="${pageContext.request.contextPath}/public/css/icon.css" />
	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/public/scripts/dhtmlx/dhtmlxtree.css">
	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/public/scripts/dhtmlx/dhtmlxgrid.css">
	<link rel="stylesheet" type="text/css"	href="${pageContext.request.contextPath}/public/css/arrow.css" />
	
	<%@ include file="/skin.jsp"%>
	
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
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/dhtmlx/ext/dhtmlxgrid_mcol.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/dhtmlx/dhtmlxtree.js"></script>
	
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/jquery/jquery-1.9.1.js"></script>
	
	<script type="text/javascript">
    	var pathUrl = "${pageContext.request.contextPath}";
		var extPath = "${pageContext.request.contextPath}/public/scripts/ext3.4.0";
		Ext.BLANK_IMAGE_URL = extPath + '/resources/images/default/s.gif';
		Ext.QuickTips.init();
		var parentNodeIds = "${requestScope.parentNodeID}";
		var dhtmlGrid = null;
		var projectID="${param.project_id}",parameterID="",roleID="",published="",monthID = "",cycleTypeID = "",fullScore = "",obj_cate_id = null;
		var initProject = "${requestScope.initProject}";
		var userOrg = "${sessionScope.currentUser.bank_org_id}";
    </script>
    <script type="text/javascript" src="${pageContext.request.contextPath}/bsc/scripts/selector.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/bsc/scripts/tree_search.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/bsc/scripts/progress.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/bsc/scripts/ListPanel.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/bsc/scripts/Selection.js"></script>		
	<script type="text/javascript" src="${pageContext.request.contextPath}/bsc/scripts/AsyncTree.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/bsc/scripts/bsc_project_measure.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/bsc/scripts/bsc_project_measure_layout.js"></script>
	
  </head>
  
  <body>
  	<!-- 导出计划值Form -->
  	<form id="templateForm" name="templateForm" action="bscmeasure_exportPlanTemplate.action" method="POST" target="">
  		<input type="hidden" name="project_id" />
  		<input type="hidden" name="role_id" />
  		<input type="hidden" name="month_id" />
  	</form>
  	
  	<!-- 导出Excel文件Form -->
  	<form id="excelForm" name="excelForm" action="bscmeasure_exportExcel.action" method="post" target="">
  		<input type="hidden" name="project_id" />
  		<input type="hidden" name="project_name" />
  		<input type="hidden" name="role_id" />
  		<input type="hidden" name="file_name" />
  		<input type="hidden" name="export_flag" />
  	</form>
  	
    <div id="measure_table" style="width:100%;height: 100%;background-color:white;overflow:hidden;border:0px"></div>
    <script type="text/javascript">
    	var checkedDimId = '',bscMeasure = '';
	</script>
  </body>
</html>
