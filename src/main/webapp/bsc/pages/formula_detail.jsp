<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8" isELIgnored="false"%>
<%@taglib  prefix="s"  uri="/struts-tags"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>公式明细</title>
<style type="text/css">
<!--
table {
	border-collapse:collapse;
}

.Font_Body {
	font-family: Arial, "宋体",;
	font-size: 12px;
	font-style: normal;
	line-height: normal;
	font-variant: normal;
	text-transform: none;
	color: #000000;
	text-decoration: none;
}

.Font_Heading_1 {
	font-size: 16px;
	font-weight:bold;
	background-color:#bfab9b;
	height:32px;
	text-align:center;
}

.Font_Heading_2{
	font-size:14px;
	font-weight:bold;
	background-color:#bfab9b;
	height:30px;
	text-align:center;
}

.Font_Item_Title{
	font-size:14px;
	font-weight:bold;
	background-color:#d5c8bd;
	text-align:left;
	padding-left:5px;
	height:22px;
	
}
.Font_Item_Title2{
	font-size:14px;
	font-weight:bold;
	background-color:#d5c8bd;
	text-align:center;
	padding-left:5px;
	height:22px;
	
}

.Font_Item_context{
	text-align:left;
	padding-left:5px;
	height:22px;
}
.Font_Item_context_num{
	text-align:right;
	padding-right:5px;
}

.P_1{
	text-indent:21px;
}

.P_2{
	text-indent:60px;
}
.float_div{
	position : absolute;
	cursor : hand;
}
-->
</style>
<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/jquery/jquery-1.9.1.js"></script>

<script type="text/javascript">
	var pathUrl = "${pageContext.request.contextPath}";
	var type = "<s:property value='#request.type' />";
	var month_id = "${requestScope.paramMap.month_id}";
	var object_id = "${requestScope.paramMap.object_id}";
	var project_id = "${requestScope.paramMap.project_id}";
	var cycle_type = "${requestScope.paramMap.cycle_type}";
	var preMeasureIDs = "${requestScope.preMeasureIDs}";
	var scoreMeasure = "${requestScope.paramMap.scoreMeasure}";
	var url = pathUrl + "/bsc/pages/bsccard_formulaDetail.action?month_id="+month_id+"&object_id="+object_id+"&cycle_type="+cycle_type+"&project_id="+project_id
	url += "&preMeasureIDs="+preMeasureIDs;
	url += "&scoreMeasure="+scoreMeasure;
	var url2 = url; 
	url2 += "&operType=back";
	$(function(){
		if('score' == type) {
			$("#score_div").show();
		}else {
			$("#measure_div").show();
		}
		$("a").each(function(){
			var measure_id = "";
			/*if($(this).attr("id") == 'back')
				url += "&operType=back";
			else*/
			measure_id = $(this).attr("href");
			$(this).attr("href",url+"&measure_id="+measure_id)
		});
		
		loadFloatDivPosition();
		
		$(".float_div").bind({
			mouseover : function(){
				$(this).find("img").attr("src","../img/prev_fml_2.png");
			},
			mouseout : function(){
				$(this).find("img").attr("src","../img/prev_fml_1.png");
			}
		});
		$(".float_div").find("img").bind("click",function(){
			window.location.href = url2;
		});
		
		//窗口大小变化时触发
		$(window).resize(function(){
			loadFloatDivPosition();
		});
	});
	
	//确定“返回”箭头图标的位置(图片本身宽度45)
	function loadFloatDivPosition(){
		var fh = $("#detailTable").height();
		if($("#measure_div").css("display") != "none"){
			fh += $("#measure_div").height();
		}
		if($("#score_div").css("display") != "none"){
			fh += $("#score_div").height();
		}
		var contentLeft = $(window).width() - (($(window).width() - $("#detailTable").width())/2 + $("#detailTable").width());
		$(".float_div").width(0);
		$(".float_div").css("left",contentLeft > 75 ? contentLeft-75 : (contentLeft > 45 ? contentLeft-45 : 0));
		$(".float_div").css("top",fh/2);
	}
</script>

</head>
<body class="Font_Body" style="text-align: center">
<br />
<!-- 
<s:if test="#request.paramMap.type == null">
	<div id="oper" style="text-align: right;padding-right: 20px"><a id="back" href="${requestScope.paramMap.measure_id}">返回</a></div>	
</s:if>
 -->
<s:if test="#request.paramMap.type == null">
	<div class="float_div">
		<img src="../img/prev_fml_1.png"/> 
	</div>
</s:if>


<div id="score_div" style="display:none;">
	<table width="600" border="1" bordercolor="#000000" cellpadding="0" cellspacing="0" align="center">
	  <tr>
	    <td class="Font_Heading_1" colspan="4">衡量指标信息</td>
	  </tr>
	  <tr>
	    <td class="Font_Item_Title" width="15%">指标ID</td>
		<td width="30%" class="Font_Item_context"><s:property value="#request.infoMap.measureID"/></td>
		<td rowspan="2" class="Font_Item_Title" width="15%" valign="middle"">指标描述</td>
		<td rowspan="2" valign="middle"" class="Font_Item_context"><s:property value="#request.infoMap.measureDesc"/></td>
	  </tr>
	  <tr>
	    <td class="Font_Item_Title">指标名称</td>
		<td class="Font_Item_context"><s:property value="#request.infoMap.measureName"/></td>
	  </tr>
	  <!-- 
	  <tr>
	    <td class="Font_Item_Title">指标类型</td>
		<td class="Font_Item_context"><s:property value="#request.infoMap.measureType"/></td>
	  </tr>
	   -->
	  <tr>
	  	<td class="Font_Item_Title">完成值</td>
		<td class="Font_Item_context"><s:property value="#request.infoMap.completeValue"/></td>
		<td class="Font_Item_Title">目标值</td>		
		<td class="Font_Item_context"><s:property value="#request.infoMap.targetValue"/></td>
	  </tr>
	</table>
</div>
<div id="measure_div" style="display:none;">
	<table width="600" border="1" bordercolor="#000000" cellpadding="0" cellspacing="0" align="center">
	  <tr>
	    <td class="Font_Heading_1" colspan="4">指标概要</td>
	  </tr>
	  <tr>
	    <td class="Font_Item_Title" width="80">指标ID</td>
		<td width="150" class="Font_Item_context"><s:property value="#request.infoMap.measureID"/></td>
		<td rowspan="3" class="Font_Item_Title" width="80" valign="middle"">指标描述</td>
		<td rowspan="3" valign="middle"" class="Font_Item_context"><s:property value="#request.infoMap.measureDesc"/></td>
	  </tr>
	  <tr>
	    <td class="Font_Item_Title">指标名称</td>
		<td class="Font_Item_context"><s:property value="#request.infoMap.measureName"/></td>
	  </tr>
	  <tr>
	    <td class="Font_Item_Title">指标类型</td>
		<td class="Font_Item_context"><s:property value="#request.infoMap.measureType"/></td>
	  </tr>
	</table>
</div>

<br />
<table width="600" border="1" bordercolor="#000000" cellpadding="0" cellspacing="0" align="center" id="detailTable">
	<tr>
		<td class="Font_Heading_1" colspan="4">公式明细</td>
	</tr>
	<tr>
		<td class="Font_Item_Title" width="15%">指标公式</td>
		<td colspan="3" align="center" width="85%"><s:property value="#request.infoMap.measureFormula"/></td>
	</tr>
	<tr>
		<td class="Font_Item_Title" >公式描述</td>
		<td colspan="3" align="center"><s:property value="#request.infoMap.measureFormulaDesc"/></td>
	</tr>
	<tr>
		<td class="Font_Item_Title" >公式运算</td>
		<td colspan="3" align="center"><s:property value="#request.infoMap.measureFormulaCalc"/> <span style="font-weight: bold;font-size: 14px;">=</span> <s:property value="#request.infoMap.measureValue"/></td>
	</tr>
	<tr>
		<td rowspan="99" class="Font_Item_Title" >公式因子</td>
		<td colspan="3" class="Font_Heading_2">下级指标</td>
	</tr>
	
	<!--===========指标内容开始===============-->
	<s:if test="#request.infoMap.subMeasureList.size() == 0">
		<tr>
			<td class="Font_Item_context" colspan="3" style="text-align: center;">无数据!</td>
		</tr>
	</s:if>
	<s:else>
		<tr>
			<td class="Font_Item_Title2" width="100">指标ID</td>
			<td class="Font_Item_Title2" width="250" >指标名称</td>
			<td class="Font_Item_Title2" width="100">指标值</td>
		</tr>
		<s:iterator value="#request.infoMap.subMeasureList">
			<tr>
				<td class="Font_Item_context">
					<s:if test="source_type_id == '00' or source_type_id == '02'">
						[@<s:property value="measure_id"/>]
					</s:if>
					<s:else>
						<a href="<s:property value="measure_id"/>">
							[@<s:property value="measure_id"/>]
						</a>					
					</s:else>
				</td>
				<td align="center"><s:property value="measure_name"/></td>
				<td class="Font_Item_context_num"><s:property value="score"/></td>
			</tr>
		</s:iterator>	
	</s:else>
	
	
	<tr>
		<td colspan="3" class="Font_Heading_2">下级参数</td>
	</tr>
	<!--===========参数内容开始===============-->
	<s:if test="#request.infoMap.paramList.size() == 0">
		<tr>
			<td class="Font_Item_context" colspan="3" style="text-align: center;">无数据!</td>
		</tr>
	</s:if>
	<s:else>
		<tr>
			<td class="Font_Item_Title2"  >参数ID</td>
			<td class="Font_Item_Title2"  >参数名称</td>
			<td class="Font_Item_Title2"  >参数值</td>
		</tr>
		<s:iterator value="#request.infoMap.paramList">
			<tr>
				<td class="Font_Item_context">[$<s:property value="parameter_id"/>]</td>
				<td align="center"><s:property value="parameter_name"/></td>
				<td class="Font_Item_context_num"><s:property value="value"/></td>
			</tr>
		</s:iterator>	
	</s:else>

</table>

</body>
</html>

