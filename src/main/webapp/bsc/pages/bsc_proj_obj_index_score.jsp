<%@ page language="java" import="java.util.*" contentType="text/html; charset=utf-8" pageEncoding="utf-8" isELIgnored="false"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
	    <title>方案指标</title>
	    <meta http-equiv="pragma" content="no-cache"> 
		<meta http-equiv="cache-control" content="no-cache"> 
		<meta http-equiv="expires" content="0"> 
	    
		<link rel="stylesheet" type="text/css"	href="${pageContext.request.contextPath}/public/scripts/ext3.4.0/resources/css/ext-all.css" />
		<link rel="stylesheet" type="text/css"	href="${pageContext.request.contextPath}/public/css/icon.css" />
		<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/public/scripts/dhtmlx/dhtmlxgrid.css">
		<link rel="stylesheet" type="text/css"	href="${pageContext.request.contextPath}/public/css/arrow.css" />
		<link rel="stylesheet" type="text/css"	href="${pageContext.request.contextPath}/public/scripts/ext3.4.0/resources/css/ext-patch.css" />
		<link rel="stylesheet" type="text/css"	href="${pageContext.request.contextPath}/public/css/multiselect.css" />
		<style>
			.hover {
				background-color: #dfffe4;
				}
			.x-panel-noborder .x-panel-header-noborder{
				border-bottom: solid 1px #e2dbcb;
			}	
		</style>
		<%@ include file="/skin.jsp"%>
		<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/ext3.4.0/adapter/ext/ext-base.js"></script> 
		
		<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/ext3.4.0/ext-all.js"></script>
		<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/ext3.4.0/locale/ext-lang-zh_CN.js"></script> 
		<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/others/MyPagingToolbar.js"></script>
		<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/dhtmlx/dhtmlxcommon.js"></script>
		<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/dhtmlx/dhtmlxgrid.js"></script>
		<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/dhtmlx/dhtmlxgridcell.js"></script>
		<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/dhtmlx/ext/dhtmlxgrid_splt.js"></script>
		<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/dhtmlx/ext/dhtmlxgrid_math.js"></script>
		<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/dhtmlx/ext/dhtmlxgrid_rowspan.js"></script>
		<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/dhtmlx/ext/dhtmlxgrid_filter.js"></script>
		<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/jquery/jquery-1.9.1.js"></script>
		<script type="text/javascript" src="${pageContext.request.contextPath}/bsc/scripts/Selection.js"></script>
		
		<script type="text/javascript">
	    	var pathUrl = "${pageContext.request.contextPath}";
			var extPath = "${pageContext.request.contextPath}/public/scripts/ext3.4.0";
			Ext.BLANK_IMAGE_URL = extPath + '/resources/images/default/s.gif';
			Ext.QuickTips.init();
			var height,width;
			
			var totalCount = 0;
			var dhtmlGrid = null;
			var monthID = '${param.month_id}',projectID = '${param.project_id}',measure_id = '${param.measure_id}',
				monthName='${param.monthName}',projectName='${param.projectName}',
				cycle_type_id = '${param.cycle_type_id}';
			var objCateId = '${param.objCateId}';
	    </script>
		<script type="text/javascript" src="${pageContext.request.contextPath}/bsc/scripts/bsc_proj_obj_index_score_layout.js"></script>
	</head>
  
  	<body>
	  	<!-- 导出Excel文件Form -->
	  	<form id="excelForm" name="excelForm" action="bscresult_exportScoreByCond.action" method="post" target="">
	  		<input type="hidden" name="project_id" />
	  		<input type="hidden" name="role_id" />
	  		<input type="hidden" name="month_id" />
	  		<input type="hidden" name="file_name" />
	  		<input type="hidden" name="title" />
	  		<input type="hidden" name="objCateId" />
	  		<input type="hidden" name="project_name" />
			<input type="hidden" name="month_name" />
			<input type="hidden" name="measure_id"/>
	  	</form>
	    <div id="center" style="width:100%;height: 100%;background-color:white;overflow:hidden;border:0px"></div>
  	</body>
</html>
