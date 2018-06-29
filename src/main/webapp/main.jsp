<%@ page contentType="text/html; charset=utf-8" isELIgnored="false" pageEncoding="utf-8"%>
<%@taglib  prefix="s"  uri="/struts-tags"%>
<html>
  <head>
    <title>首页</title>
	<meta http-equiv="pragma" content="no-cache"/>
	<meta http-equiv="cache-control" content="no-cache"/>
	<meta http-equiv="expires" content="0"/> 
	<!-- ext -->
	<link rel="stylesheet" type="text/css"	href="${pageContext.request.contextPath}/public/scripts/ext3.4.0/resources/css/ext-all.css" />
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/ext3.4.0/adapter/ext/ext-base.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/ext3.4.0/ext-all.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/ext3.4.0/locale/ext-lang-zh_CN.js"></script>
	<!-- ligerUI -->
	<link rel="stylesheet" type="text/css"	href="${pageContext.request.contextPath}/public/css/ligerUI/skins/Aqua/css/ligerui-all.css" />
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/jquery/jquery-1.9.1.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/ligerUI/base.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/ligerUI/ligerTab.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/ligerUI/ligerMenu.js"></script>
	
	<link rel="stylesheet" type="text/css"	href="${pageContext.request.contextPath}/public/css/menu.css" />
	<link rel="stylesheet" type="text/css"	href="${pageContext.request.contextPath}/public/css/main.css" />
	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/public/scripts/dhtmlx/dhtmlxtree.css">
	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/public/scripts/dhtmlx/dhtmlxgrid.css">
	
	
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
	
	<script type="text/javascript">
		var pathUrl = '${pageContext.request.contextPath}';
		var extPath = '${pageContext.request.contextPath}/public/scripts/ext3.4.0';
		Ext.BLANK_IMAGE_URL = extPath + '/resources/images/default/s.gif';
		Ext.form.Field.prototype.msgTarget = 'side';
		var sessionId = "<%=session.getId()%>";
		var currentBankOrgID = "${sessionScope.currentUser.bank_org_id}";
		var rightOrgNumber = "${requestScope.rightOrgNumber}";
		Ext.QuickTips.init();
		var height;
	</script>
	
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/menu.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/main.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/sys/scripts/mainView.js"></script>	
	<script type="text/javascript" src="${pageContext.request.contextPath}/sys/scripts/viewMenu.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/sys/scripts/initPage.js"></script>
	
  </head>
  <body>
  	<div id='main'>
		<div id="north" class="north_layout">
			<iframe src="banner.jsp" class="banner_frame" frameborder="0"></iframe>
		</div> 
		<div id='west'>
			<div id="menu_parent">
				<div class="menu_title_l">
					<div class="menu_title_r">
						<div class="menu_title_c">主菜单</div>
					</div>
				</div>
				<div id="menu">${requestScope.menuCode}</div>
			</div>
		</div>
		<div id='center' class="center_layout">
		</div>
	</div>
	
	<!-- 导航开始
	<div class="nav" id="navigate_layout">
		<div class="movehandle" id="navigate_hanlde" title="移动位置"></div>
		<div id="navlist" class="now">
			<a href="javascript:void(0);" style="color:black;text-decoration:none;">&nbsp;</a>
		</div>
		<div class="box" id="navbox" style="height:483px;opacity:0;overflow:hidden;">
			<div class="cont" style="display:none;">
				<img src="map/functionMap.png" usemap="#MapMap2" alt="快速菜单"/>
				&nbsp; 
				<map id="Map3" name="MapMap2">
					<s:iterator value="#request.userMenuPictMap" >
						<area id="<s:property value='key.menuID' />" shape="rect" coords="<s:property value='key.pictCoord' />" href="javaScript:void(0);" onclick="topage('<s:property value='key.menuID' />')"/>
					</s:iterator>
				</map> 
			</div> 
		</div>
	</div>
	导航结束 -->
	<div id="res_tree" style="width:100%;height: 100%;background-color:white;border:0px;display: none;"></div>
	
	<!-- 变更权限机构Form -->
	<form id="switchOrgForm" name="switchOrgForm" action="${pageContext.request.contextPath}/login_switchPrivateOrg.action" method="POST">
		<input name="special_org_id" />
	</form>
  </body>
</html>
