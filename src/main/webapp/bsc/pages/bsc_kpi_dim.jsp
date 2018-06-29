<%@ page language="java" import="java.util.*" contentType="text/html; charset=utf-8" pageEncoding="utf-8" isELIgnored="false"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <title>平衡计分卡考核维度</title>
    
	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/public/scripts/ext3.4.0/resources/css/ext-all.css" />
	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/public/css/icon.css" />
	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/public/scripts/dhtmlx/dhtmlxtree.css">
	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/public/scripts/ext3.4.0/ux/css/Spinner.css">

	<%@ include file="/skin.jsp"%>

	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/ext3.4.0/adapter/ext/ext-base.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/ext3.4.0/ext-all.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/ext3.4.0/locale/ext-lang-zh_CN.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/ext3.4.0/ux/Spinner.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/ext3.4.0/ux/SpinnerField.js"></script>

	<script  src="${pageContext.request.contextPath}/public/scripts/dhtmlx/dhtmlxcommon.js"></script>
	<script  src="${pageContext.request.contextPath}/public/scripts/dhtmlx/dhtmlxtree.js"></script>

  	<script type="text/javascript" src="${pageContext.request.contextPath}/bsc/scripts/bsc_kpi_dim_layout.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/bsc/scripts/bsc_kpi_dim.js"></script>

  </head>
  <body>
  	<div id="north"></div>
  	<div id="center" style="overflow: auto;	height: 100%"></div>
	<script type="text/javascript">
  		var pathUrl = "${pageContext.request.contextPath}";
		var extPath = "${pageContext.request.contextPath}/public/scripts/ext3.4.0";
		Ext.BLANK_IMAGE_URL = extPath + '/resources/images/default/s.gif';
		Ext.QuickTips.init();
		
		var level_id ;
		var child_level_id ;
		var childsAmount = 0 ;
		var levelJson = eval(${request.level});
		
		var editWindow=null,addWindow=null;
		tree=new dhtmlXTreeObject("center","100%","100%","");
		tree.setImagePath("${pageContext.request.contextPath}/public/scripts/dhtmlx/imgs/");
		
		tree.loadXMLString('${requestScope.xml}');
		//tree.setOnDblClickHandler(editNode);
		
		tree.attachEvent("onSelect", function(id){
			childsAmount = tree.hasChildren(id);
			if('root'==id){
				Ext.getCmp("addmenu").setDisabled(true);
				Ext.getCmp("editmenu").setDisabled(true);
				Ext.getCmp("deletemenu").setDisabled(true);
				setAddText('root');
				return ;
			}else {
				Ext.getCmp("addmenu").setDisabled(false);
				Ext.getCmp("editmenu").setDisabled(false);
				Ext.getCmp("deletemenu").setDisabled(tree.hasChildren(id));
				
				level_id = levelJson[id];
				setAddText(level_id);
				child_level_id = parseInt(level_id,10) + 1;
			}
		});
    </script>
  </body>
</html>
