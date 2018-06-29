<%@ page language="java" import="java.util.*" contentType="text/html; charset=utf-8" pageEncoding="utf-8" isELIgnored="false"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">

<html>
  <head>
  	<meta http-equiv="pragma" content="no-cache"> 
	<meta http-equiv="cache-control" content="no-cache"> 
	<meta http-equiv="expires" content="0"> 
    
    <title>外部指标导入(绩效方案)</title>
    <link rel="stylesheet" type="text/css"	href="${pageContext.request.contextPath}/public/scripts/ext3.4.0/resources/css/ext-all.css" />
	<link rel="stylesheet" type="text/css"	href="${pageContext.request.contextPath}/public/css/icon.css" />
	<link rel="stylesheet" type="text/css"  href="${pageContext.request.contextPath}/public/scripts/dhtmlx/dhtmlxgrid.css">
	<link rel="stylesheet" type="text/css"	href="${pageContext.request.contextPath}/public/css/arrow.css"/>
	
	<%@include file="/skin.jsp" %>
	
    <script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/ext3.4.0/adapter/ext/ext-base.js"></script>
    <script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/ext3.4.0/ext-all.js"></script>
    <script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/ext3.4.0/locale/ext-lang-zh_CN.js"></script>
    <script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/ext3.4.0/ux/RowExpander.js"></script>
    <script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/others/MyPagingToolbar.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/dhtmlx/dhtmlxcommon.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/dhtmlx/dhtmlxgrid.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/dhtmlx/dhtmlxgridcell.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/dhtmlx/ext/dhtmlxgrid_splt.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/dhtmlx/ext/dhtmlxgrid_math.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/dhtmlx/ext/dhtmlxgrid_rowspan.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/dhtmlx/ext/dhtmlxgrid_filter.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/dhtmlx/dhtmlxtree.js"></script>
    
    <script type="text/javascript">
   		var pathUrl = '${pageContext.request.contextPath}';
   		Ext.BLANK_IMAGE_URL =pathUrl+ '/public/scripts/ext3.4.0/resources/images/default/s.gif';
   		Ext.QuickTips.init();
   		var dhtmlGrid = null;
   		
		var params = "" ;
		var filePath = "";
    </script>
    <script type="text/javascript" src="${pageContext.request.contextPath}/bsc/scripts/selector.js"></script>
    <script type="text/javascript" src="${pageContext.request.contextPath}/bsc/scripts/bsc_proj_mea_imp_layout.js"></script>
    <script type="text/javascript" src="${pageContext.request.contextPath}/bsc/scripts/bsc_proj_mea_imp.js"></script>
  </head>
  <body>
  	<form name="excelForm" id="excelForm" method="post" action="${pageContext.request.contextPath}/service/ModelExcelService" target="">
		<input type="hidden" name="tableHeader" value="" />
		<input type="hidden" name="tableColumnAlign" value="" />
		<input type="hidden" name="tableInitCellWidth" value="" />
		<input type="hidden" name="tableData" value="" />
		<input type="hidden" name="tableTitle" value="" />
		<input type="hidden" name="exportHeader" value="" />
		<input type="hidden" name="user_new" value="true"/>
	</form>
	
	<div id="center" style="width:100%;height: 100%;background-color:white;overflow:hidden;border:0px"></div>
  </body>
	<script type="text/javascript">
		function setExcelForm(){
			var xml=dhtmlGrid.serialize();
			if(xml.length<=34){
				Ext.MessageBox.alert('提示','没有要导出的结果对象.');
				return ;
			}
			var aligns="left,left,right";
			var exportHeader = yearId+";"+ yearName +";"+projectId+";"+projectName+";"+cycleId+";"+cycleName+";"+measureId+";"+measureName+";";

			//document.excelForm.tableHeader.value=str;
			document.excelForm.tableColumnAlign.value=aligns;
			//document.excelForm.tableInitCellWidth.value=widths;
			document.excelForm.tableTitle.value='对象指标值导入模板';
			document.excelForm.exportHeader.value=exportHeader;
			document.excelForm.tableData.value=xml;
			document.excelForm.action= pathUrl + '/projMeaImp_exportToExcel.action';
		   	document.excelForm.submit();
		}
	</script>  
</html>
