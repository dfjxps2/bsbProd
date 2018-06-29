<%@ page language="java" pageEncoding="UTF-8" isELIgnored="false"%>
<%@taglib  prefix="s"  uri="/struts-tags"%>
<html>
	<head>
		<meta http-equiv="content-type" content="text/html; charset=UTF-8">
		<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/public/scripts/ext3.4.0/resources/css/ext-all.css" />
		<%@ include file="/skin.jsp"%>
		<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/ext3.4.0/adapter/ext/ext-base.js"></script>
		<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/ext3.4.0/ext-all.js"></script>
		<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/ext3.4.0/locale/ext-lang-zh_CN.js"></script>
		<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/JSClass/FusionCharts.js"></script>
		<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/jquery/jquery-1.9.1.js"></script>
		
		<script type="text/javascript">
			var pathUrl="${pageContext.request.contextPath}";
			var width = ${requestScope.width};
			var height = ${requestScope.height};
			var scoreLineXML = "${requestScope.scoreLineXML}";
			var orderLineXML = "${requestScope.orderLineXML}";
		</script>
	</head>
	<body topmargin="0">
		<div id="center">
			<div id = "div1"></div>
			<div id="div2"></div>
			<div id="div3">
				<table width='100%' align='center' cellpadding='2' cellspacing='0' style='border:1px #cccccc solid;'>
					<s:iterator value="#request.xmlList" status="status" >
						<tr height='5'>
							<td></td>
						</tr>
						<tr>
							<td align="center" style="border-bottom: solid 1px gray">
								<div id="chart<s:property value='#status.index'/>div" align="center">
									FusionGadgets
								</div>
								<script type="text/javascript">
									var myChart<s:property value='#status.index'/> = new FusionCharts(
											"${pageContext.request.contextPath}/public/scripts/Charts/SparkLine.swf", 
											"chart<s:property value='#status.index'/>div",
											"500", 
											"25", 
											"0", 
											"0");
									myChart<s:property value='#status.index'/>.setDataXML("<s:property/>");
									myChart<s:property value='#status.index'/>.render("chart<s:property value='#status.index'/>div");
								</script>
							</td>
						</tr>
					</s:iterator>
				</table>
			</div>
		</div>
	</body>
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/init_chart.js"></script>
</html>