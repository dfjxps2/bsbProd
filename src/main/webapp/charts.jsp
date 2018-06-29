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
		<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/JSClass/FusionCharts.js"></script>
	</head>
	<body topmargin="0">
		<div id="center">
			<div id = "div0"></div>
			<div id = "div1"></div>
			<div id="div2"></div>
			<div id="div3"></div>
			<div id="div4"></div>
			<div id="div5"></div>
			<div id="div6"></div>
			<div id="div7"></div>
			<div id="div8"></div>
			<div id="div9"></div>
			<div id="div10"></div>
		</div>
		<!-- 根据图形数量添加多个div -->
	</body>
	<script type="text/javascript">
		var pathUrl = '${pageContext.request.contextPath}';
		Ext.BLANK_IMAGE_URL  =  pathUrl+'/public/scripts/extjs/resources/images/default/s.gif';
		Ext.QuickTips.init();
		Ext.onReady(function(){
			${requestScope.dashbord.output}
		});
	</script>
	<s:iterator value="#request.dashbord.charts" id="chart" status="status">
		<script type="text/javascript">
			
		   var myChart<s:property value='#status.index'/> = new FusionCharts(
				   "<%=path%>/public/scripts/Charts/<s:property value='#chart.chartType'/>.swf", 
				   "myChart<s:property value='#status.index'/>Id", 
				   "<s:property value='#chart.width'/>", 
				   "<s:property value='#chart.height'/>", 
				   "0", 
				   "0");
		   myChart<s:property value='#status.index'/>.setDataXML("<s:property value='#chart.xml'/>");
		   myChart<s:property value='#status.index'/>.render("div<s:property value='#status.index'/>");
		</script>
	</s:iterator>
</html>