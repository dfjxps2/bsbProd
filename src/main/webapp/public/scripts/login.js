
$(function () {
	var L = {};
	L.IE = function () {
		$(".container").width(screen.width - 2);
		$(".button").click(L.LA);
		$("#password").keypress(function () {if (event.keyCode == 13) {L.LA();}});
		$("#username").focus();
	};
	L.LA = function () {
		var p = A();
		if (p) {
			$('.loadding').show();
			$.ajax({url:pathUrl + "/login_doLogin.action", data:p, type:"POST", success:function (d) {
				if (d.success) {
					window.top.location.href = pathUrl + "/main.jsp";
				} else {
					$('.loadding').hide();
					$(".info").html("\u7528\u6237\u540d\u6216\u5bc6\u7801\u9519\u8bef\uff01");
				}
			}, error:function () {
				$('.loadding').hide();
				$(".info").html("\u767b\u5f55\u5f02\u5e38\uff01");
			}});
		}
		function A() {
			var n = $.trim($("#username").val());
			if (!n) {
				$(".info").html("\u5e10\u53f7\u4e0d\u80fd\u4e3a\u7a7a\uff01");
				return false;
			}
			var p = $.trim($("#password").val());
			if (!p) {
				$(".info").html("\u5bc6\u7801\u4e0d\u80fd\u4e3a\u7a7a\uff01");
				return false;
			}
			return {user_id:n,password:p};
		}
	};
	L.IE();
});

