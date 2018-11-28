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
				//$('.container').width(screen.width);
				$('.r_bg').width(screen.width-174-20);
				$('.r_bg_r').width(screen.width-154-20-773);
			});
			var pathUrl = '${pageContext.request.contextPath}';
			//修改用户密码
			function modifyPassword(){
			    new parent.MyModifyWindowUi().show(window.top);
			}
			function logout() {
				window.close();
				/* $.ajax({
					url : pathUrl + '/login_doLogout.action',
					type : 'POST',
					data : {},
					success : function(data) {
						window.close();
					}
				}); */
			}
			function switchOrg(){
				window.top.doSwitchOrg()
			}
		</script>
		<style>
		
		</style>
	</head>
<body>
	<div class="container">
		<div class="opt_item mpsws" style="height: 100%;line-height:100%;float:left;width:180px;" onclick="modifyPassword()">
			<div id = "logo"></div><p id = "tit">指标管理系统</p>
		</div>
		<div class="opt_item mpsws" style="color:#fff;font-size:14px;height: 100%;float: right;width:100px;">
		<div id = "log_out" onclick = "logout()" style="float: left"></div><p style="float: left;line-height: 26px;margin-left: 12px;">退出</p>
		</div>
		<div class="opt_item mpsws" style="color:#fff;font-size:16px;height: 100%;float: right;padding-right: 44px;" onclick="modifyPassword()">
			<div id = "up_prd" style="width: 20px;height: inherit;float: left;"></div>
			<p style="text-align: left;margin: auto 12px;float: left;font-size:14px;height: 54px;line-height: 54px;">修改密码</p>
		</div>	
		<div class="logininfo" style="height: 100%;line-height: 100%;float: right;padding-right: 44px;">
		<p style="height: 54px;line-height: 54px;margin: auto 5px;">
			当前用户：&nbsp;${currentUser.user_name}
		</p>
		</div>
	</div>
	<script type="text/javascript">
		if(parseInt(window.top.rightOrgNumber) <= 1 && document.getElementById("changeOrgSpan")) {
			document.getElementById("changeOrgSpan").style.display = "none";
		}
	</script>
</body>
</html>
