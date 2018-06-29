<%@ page language="java" import="java.util.*" contentType="text/html; charset=utf-8" pageEncoding="utf-8" isELIgnored="false"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
    <title>计分卡计分公式</title>
    
	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/public/scripts/ext3.4.0/resources/css/ext-all.css" />
	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/public/css/icon.css" />
	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/public/scripts/dhtmlx/dhtmlxgrid.css" />
	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/public/scripts/dhtmlx/skins/dhtmlxgrid_dhx_skyblue.css">	

	<%@ include file="/skin.jsp"%>

	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/ext3.4.0/adapter/ext/ext-base.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/ext3.4.0/ext-all.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/ext3.4.0/locale/ext-lang-zh_CN.js"></script>
	
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/dhtmlx/dhtmlxcommon.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/dhtmlx/dhtmlxgrid.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/dhtmlx/dhtmlxgridcell.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/dhtmlx/ext/dhtmlxgrid_splt.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/dhtmlx/dhtmlxtreegrid.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/dhtmlx/ext/dhtmlxgrid_math.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/dhtmlx/ext/dhtmlxgrid_rowspan.js"></script>	
	
	<script type="text/javascript">
  		var pathUrl = "${pageContext.request.contextPath}";
		var extPath = "${pageContext.request.contextPath}/public/scripts/ext3.4.0";
		Ext.BLANK_IMAGE_URL = extPath + '/resources/images/default/s.gif';
		Ext.QuickTips.init();
		
		var header = '';
		var attachHeader = '';
		var initWidths = '';
		var colAlign = '';
		var colTypes = '';
    </script>

	<script type="text/javascript" src="${pageContext.request.contextPath}/kpi/scripts/Selection.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/bsc/scripts/AsyncTree.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/bsc/scripts/bankBusiAnalysisLayout.js"></script>
</head>
<body onload="">
<div id="grid1" width="100%" height="100%" style="background-color:white;overflow:hidden;border:0px"></div>

</body>
<script>
	var grid1;
	var mask = new Ext.LoadMask(Ext.getBody(),{ msg : "Please wait..."   });
	function queryHeader(headUrl,filePath){
		showMask();
		Ext.Ajax.request({
			url:headUrl,
			method: 'POST',
			timeout: 180000,
			failure:function(response, options){
				Ext.MessageBox.hide();
				Ext.MessageBox.alert('错误',response.responseText);
			},  
			success:function(response, options){
				var json=Ext.util.JSON.decode(response.responseText);
				if (json.success) { //success will be true if the request succeeded
					Ext.MessageBox.hide();
					
					header = json.header;
					attachHeader = json.attachHeader;
					initWidths = json.initWidths;
					colAlign = json.colAlign;
					colTypes = json.colTypes;
					load(filePath);
				} else {
					Ext.MessageBox.alert('错误',json.info);
					Ext.MessageBox.hide();
				}
			}
		});
	}
	
	function load(filePath){
		grid1 = new dhtmlXGridObject("grid1");
		grid1.setImagePath("/public/scripts/dhtmlx/imgs/");
		grid1.setHeader(header);
		grid1.attachHeader(attachHeader);
		grid1.setInitWidths(initWidths);
		grid1.setColAlign(colAlign);
		grid1.setColTypes(colTypes);
		grid1.setSkin("xp");//xp, mt, gray, light, clear, modern, sb_dark
		grid1.enableRowspan();
		grid1.splitAt(3);
		
		grid1.init();
		displayGrid(filePath);
	}
	
	function displayGrid(filePath)
	{
		grid1.loadXML(filePath,hiddenMask);
	}
	
	function showMask()
	{
		mask.show();
	}
	
	function hiddenMask()
	{
		mask.hide();
	}
	
	function exportGridData(){
		if(grid1==null){
			Ext.Msg.alert("查询提示","请设置查询条件，点击查询！");
		}else{
			var xml='';
			try{
				xml = grid1.Aa();
			}catch(e){
				Ext.MessageBox.alert('错误提示','数据有异常无法导出【'+e.name+':'+e.message+'】');
				return;
			}
			
			if(xml.length<45)
				return;
				
			//生成表头字符串
			var str=header;
			if(attachHeader!=null&&attachHeader!=''){
				str+=";"+attachHeader;
			}
		 
			document.excelForm.tableTitle.value="自定义查询";
			document.excelForm.tableHeader.value=str;
			document.excelForm.tableColumnAlign.value=grid1.cellAlign;
			document.excelForm.tableInitCellWidth.value=grid1.initCellWidth;
			document.excelForm.tableData.value=xml;
	    	document.excelForm.submit();
	    }
	}
</script>
</html>