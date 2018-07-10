<%@ page contentType="text/html; charset=utf-8" isELIgnored="false" pageEncoding="utf-8"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta http-equiv="pragma" content="no-cache"/>
		<meta http-equiv="cache-control" content="no-cache"/>
		<meta http-equiv="expires" content="0"/> 
		<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/jquery/jquery-1.9.1.js"></script>
		<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/public/css/banner.css" />
		<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/public/css/font-awesome/css/font-awesome.min.css" />
		<script type="text/javascript">
			$(function(){
				$('.container').width(screen.width);
				$('.r_bg').width(screen.width-174-20);
				$('.r_bg_r').width(screen.width-154-20-773);
			});
			var pathUrl = '${pageContext.request.contextPath}';
			//修改用户密码
			function modifyPassword(){
			    new parent.MyModifyWindowUi().show(window.top);
			}
			function logout() {
				$.ajax({
					url : pathUrl + '/login_doLogout.action',
					type : 'POST',
					data : {},
					success : function(data) {
						window.top.location.href = "${pageContext.request.contextPath}";
					}
				});
			}
			function switchOrg(){
				window.top.doSwitchOrg()
			}
		</script>
	</head>
<body>
	<div class="container" style="background-color: #2b5ca9;height:50px;">
		<div class="opt_item mpsws" style="height: 100%;float:left;width:180px;" onclick="modifyPassword()">
			<p style="text-align: center;color:#fff;font-size:20px;margin-top: 11px">指标管理系统</p>
		</div>
		<div class="opt_item mpsws" style="color:#fff;font-size:16px;height: 100%;float: right;width:60px;background-color:#204e97">
		<div id = "log_out" style="width: 20px;height: 20px;margin-top: 19px;margin-left: 25px"></div>
		</div>
		<div class="opt_item mpsws" style="color:#fff;font-size:16px;height: 100%;float: right;width:124px;background-color:#204e97" onclick="modifyPassword()">
			<div id = "up_prd" style="width: 20px;height: 20px;float: left;margin-top: 19px;margin-left: 20px"></div>
			<p style="text-align: left;margin-left: 5px;float: left">修改密码</p>
		</div>	
		<div class="logininfo" style="height: 100%;;float: right">
		<p style="text-align: center">
			当前用户:${currentUser.user_name}&nbsp;&nbsp;
		</p>
		</div>
	</div>
	<script type="text/javascript">
		if(parseInt(window.top.rightOrgNumber) <= 1) {
			document.getElementById("changeOrgSpan").style.display = "none";
		}
	</script>
</body>
</html>
