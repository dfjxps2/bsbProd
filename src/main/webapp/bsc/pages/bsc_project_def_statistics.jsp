<%@ page language="java" import="java.util.*,com.rx.system.domain.SysUser,com.rx.system.util.GlobalUtil" contentType="text/html; charset=utf-8" pageEncoding="utf-8" isELIgnored="false"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<%
	SysUser user = (SysUser) session.getAttribute("currentUser");
	String rid = "0".equals(session.getAttribute("isDirect")) ? GlobalUtil.encryptValStr(session.getId(), "BSC30_05_10") : "BSC30_05_10";
 %>
<html>
  <head>
    <title>方案定义</title>
    <meta http-equiv="pragma" content="no-cache"> 
	<meta http-equiv="cache-control" content="no-cache"> 
	<meta http-equiv="expires" content="0">
	
	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/public/scripts/ext3.4.0/resources/css/ext-all.css" />
	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/public/css/icon.css" />
	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/public/scripts/dhtmlx/dhtmlxtree.css">

	<%@ include file="/skin.jsp"%>
	<style>
	.readOnlyColor{
		background : #F0F0F0;
	}
	
	</style>

	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/ext3.4.0/adapter/ext/ext-base.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/ext3.4.0/ext-all.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/ext3.4.0/locale/ext-lang-zh_CN.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/ext3.4.0/ux/RowExpander.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/jquery/jquery-1.9.1.js"></script>
	<script type="text/javascript">
  		var pathUrl = "${pageContext.request.contextPath}";
		var extPath = "${pageContext.request.contextPath}/public/scripts/ext3.4.0";
		Ext.BLANK_IMAGE_URL = extPath + '/resources/images/default/s.gif';
		Ext.QuickTips.init();
		
		var ownerOrgId = '${sessionScope.currentUser.bank_org_id}';
		var rid = '<%=rid%>';
    </script>
	
	<script type="text/javascript" src="${pageContext.request.contextPath}/kpi/scripts/selection.js"></script>		
  	<script type="text/javascript" src="${pageContext.request.contextPath}/bsc/scripts/bsc_project_def_layout_statistics.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/bsc/scripts/bsc_project_def_statistics.js"></script>

  </head>
  <body>
  </body>
</html>
