<%@ page language="java" import="java.util.*" contentType="text/html; charset=utf-8" pageEncoding="utf-8" isELIgnored="false"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<meta http-equiv="pragma" content ="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		
		<title>权重维护</title>
		<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/public/scripts/ext3.4.0/resources/css/ext-all.css"/>
		<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/public/css/icon.css"/> 
		<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/public/css/arrow.css"/>
		<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/public/scripts/dhtmlx/dhtmlxgrid.css">
		<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/public/scripts/dhtmlx/dhtmlxtree.css">
		
		<%@include file="/skin.jsp" %>
		
		<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/ext3.4.0/adapter/ext/ext-base.js"></script>
		<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/ext3.4.0/ext-all.js"></script>
		<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/ext3.4.0/locale/ext-lang-zh_CN.js"></script>
		<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/ext3.4.0/ux/RowExpander.js"></script>
		
		<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/dhtmlx/dhtmlxcommon.js"></script>
		<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/dhtmlx/dhtmlxgrid.js"></script>
		<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/dhtmlx/dhtmlxgridcell.js"></script>
		<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/dhtmlx/ext/dhtmlxgrid_splt.js"></script>
		<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/dhtmlx/ext/dhtmlxgrid_math.js"></script>
		<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/dhtmlx/ext/dhtmlxgrid_rowspan.js"></script>
		<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/dhtmlx/ext/dhtmlxgrid_filter.js"></script>
		<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/dhtmlx/ext/dhtmlxgrid_srnd.js"></script>
		<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/dhtmlx/dhtmlxtree.js"></script>
		
		<script type="text/javascript">
   		var pathUrl = '${pageContext.request.contextPath}';
   		Ext.BLANK_IMAGE_URL =pathUrl+ '/public/scripts/ext3.4.0/resources/images/default/s.gif';
   		Ext.QuickTips.init();
   		
   		var grid = null , param_grid=null;
   		var filePath = '',param_filePath='';
   		

    </script>
	  	<script type="text/javascript" src="${pageContext.request.contextPath}/bsc/scripts/selector.js"></script>
		<script type="text/javascript" src="${pageContext.request.contextPath}/bsc/scripts/scoreWeightLayout.js"></script>
	    <script type="text/javascript" src="${pageContext.request.contextPath}/bsc/scripts/scoreWeight.js"></script>
	</head>
	<body>
		<div id="grid" width="100%" height="100%" style="background-color:white;overflow:auto;border:0px"></div>
		<div id="param_grid" width="100%" height="100%" style="background-color:white;overflow:auto;border:0px"></div>
		<script type="text/javascript">
			var mask = new Ext.LoadMask(Ext.getBody(),{
					msg : 'Please Wait... '
			});
			
			function showMask(){
				mask.show();
			};
			
			function hiddenMask(){
				mask.hide();
			}
			
			buildGrid();
			
			function buildGrid(){
				grid = new dhtmlXGridObject("grid");
				grid.setImagePath("${pageContext.request.contextPath}/public/scripts/dhtmlx/imgs/");
				
				grid.setHeader("序号,指标ID,考核指标定义,默认得分权重(%),img:[${pageContext.request.contextPath}/bsc/scripts/page_edit.png]调整得分权重(%),");
				grid.setInitWidths("40,150,180,150,150,50");
				grid.setColAlign("center,center,center,right,right,right");
				grid.setColTypes("ro,ro,ro,ro,ed,ro");
				
				grid.init();
				grid.setSkin("bsc");
				
				grid.attachEvent("onEditCell",doOnCellEdit);
				
				/*grid.loadXML(filePath,function(){
					if(grid.serialize()<35){
						
					}else{
						Ext.getCmp("score_total").setValue(grid.cellByIndex(0,5).getValue());
						}
				});*/
				grid.enableEditEvents(true, false, false); //设置单击编辑
				grid.enableEditTabOnly(true);
				grid.setColumnHidden(5,true);
				grid.enableRowsHover(true, "hover");
				
				
			}
			
			function doLoad(filePath){
				grid.loadXML(filePath, function() {
					if (grid.serialize() < 35) {

					} else {
						Ext.getCmp("score_total").setValue(grid.cellByIndex(0,5).getValue());
					}
				});
			}
			
			function doOnCellEdit(stage,rId,cInd,nValue,oValue){
				if(stage==0){//修改前
						
				}else if(stage==1){//修改中
				
				}else if(stage==2){//修改后
					if(isNaN(nValue) || nValue=="" || nValue<=0 || nValue>100)
					   return false ;
					 
					   grid.cells(rId,cInd).setValue(formate(nValue));
					   var new_score_total = '';
					   if(oValue==null || oValue==''){
					  	 new_score_total = parseFloat(Ext.getCmp("score_total").getValue())+ parseFloat(nValue);
					  	}else{
					  	 new_score_total = parseFloat(Ext.getCmp("score_total").getValue()) - parseFloat(oValue) + parseFloat(nValue);
					   }
					   if(new_score_total>100){
					   		Ext.Msg.alert('提示','指标权重合计不能超过100分!');
					   		return false;
					   }else{
					   		 Ext.getCmp("score_total").setValue(formate(new_score_total));
					   }
					   if(nValue != oValue){
					   		Ext.getCmp('save').setDisabled(false);
					   }
					return true;
				}
			}
			
		</script>
		
	</body>
</html>