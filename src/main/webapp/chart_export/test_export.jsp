<%@ page language="java" pageEncoding="UTF-8" isELIgnored="false"%>
<%@taglib  prefix="s"  uri="/struts-tags"%>
<% String path = request.getContextPath(); %>
<html>
	<head>
		<meta http-equiv="content-type" content="text/html; charset=UTF-8">
		<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/public/scripts/ext3.4.0/resources/css/ext-all.css" />
		<%@ include file="/skin.jsp"%>
		<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/ext3.4.0/adapter/ext/ext-base.js"></script>
		<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/ext3.4.0/ext-all.js"></script>
		<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/ext3.4.0/locale/ext-lang-zh_CN.js"></script>
		<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/jquery/jquery-1.9.1.js"></script>
		<script type="text/javascript" src="${pageContext.request.contextPath}/chart_export/FusionCharts.js"></script>
		<script type="text/javascript" src="${pageContext.request.contextPath}/chart_export/FusionChartsExportComponent.js"></script>
		<script type="text/javascript">
			var pathUrl = '${pageContext.request.contextPath}';
		</script>
		<script type="text/javascript" src="${pageContext.request.contextPath}/chart_export/test_export.js"></script>
	</head>
	<body topmargin="0">
		<input type='button' value='生成FusionCharts图表' onClick="showFusionCharts();" />   
        <input type='button' value='导出FusionCharts图片' onClick="javascript:startExport();" />   
        <div id="myFusion"></div>   
	</body>
</html>