var LastLeftID = "";
var lastSecLeftID = "";
function menuFix() {
	 $(".img0").addClass('fa fa-line-chart')
	 $(".img1").addClass('fa fa-paste');
	 $(".img2").addClass('fa fa-list-alt');
	 $(".img3").addClass('fa fa-cog');
	 
	var obj = document.getElementById("nav").getElementsByTagName("li");
	for (var i = 0; i < obj.length; i++) {
		obj[i].onmouseover = function() {
			this.className += (this.className.length > 0 ? " " : "") + "sfhover";
		}

		obj[i].onMouseDown = function() {
			this.className += (this.className.length > 0 ? " " : "") + "sfhover";
		}

		obj[i].onMouseUp = function() {
			this.className += (this.className.length > 0 ? " " : "") + "sfhover";
		}

		obj[i].onmouseout = function() {
			this.className = this.className.replace(new RegExp("( ?|^)sfhover\\b"), "");
		}
	}
}

function DoMenu(emid){
	if ((lastSecLeftID != "") && (emid != lastSecLeftID)) {// 关闭上一个二级Menu
		document.getElementById(lastSecLeftID).className = "collapsed";
		document.getElementById('m_'+lastSecLeftID).className = "haschildren1";
		//$("#"+LastLeftID).parent().children().css("background-image",imgCloseUrl);
	}
		
	if ((LastLeftID != "") && (emid != LastLeftID)) {// 关闭上一个Menu
		document.getElementById(LastLeftID).className = "collapsed";
		$("#"+LastLeftID).parent().children().removeClass('item_focus');
	}

	var obj = document.getElementById(emid);
	obj.className = (obj.className.toLowerCase() == "expanded" ? "collapsed" : "expanded");
	if(obj.className == "expanded"){
		$("#"+emid).parent().children('a').addClass('item_focus');
	}else{
		$("#"+emid).parent().children('a').removeClass('item_focus');
	}
	LastLeftID = emid;
}

//二级菜单操作
function DoSecMenu(emid) {
	var obj = document.getElementById(emid);
	var ico = document.getElementById('m_'+emid);

	ico.className = (ico.className.toLowerCase() == "haschildren1" ? "" : "haschildren1");
	
	obj.className = (obj.className.toLowerCase() == "expanded" ? "collapsed" : "expanded");
	
	
	if ((lastSecLeftID != "") && (emid != lastSecLeftID)) {// 关闭上一个二级Menu
		document.getElementById(lastSecLeftID).className = "collapsed";
		document.getElementById('m_'+lastSecLeftID).className = "haschildren1";
		
		//$("#"+LastLeftID).parent().children().css("background-image",imgCloseUrl);
	}

	lastSecLeftID = emid;
}

function GetMenuID() {
	var MenuID = "";
	
	var _paramStr = new String(window.location.href);

	var _sharpPos = _paramStr.indexOf("#");

	if (_sharpPos >= 0 && _sharpPos < _paramStr.length - 1) {
		_paramStr = _paramStr.substring(_sharpPos + 1, _paramStr.length);
	}else {
		_paramStr = "";
	}
	
	if (_paramStr.length > 0){
		var _paramArr = _paramStr.split("&");
		if (_paramArr.length > 0){
			var _paramKeyVal = _paramArr[0].split("=");
			
			if (_paramKeyVal.length > 0){
				MenuID = _paramKeyVal[1];
			}
		}

		/*
		 * 
		 * if (_paramArr.length>0)
		 *  {
		 * 
		 * var _arr = new Array(_paramArr.length);
		 *  }
		 * 
		 * 
		 * 
		 * //取所有#后面的，菜单只需用到Menu
		 * 
		 * //for (var i = 0; i < _paramArr.length; i++)
		 *  {
		 * 
		 * var _paramKeyVal = _paramArr[i].split('=');
		 * 
		 * 
		 * 
		 * if (_paramKeyVal.length>0)
		 *  {
		 * 
		 * _arr[_paramKeyVal[0]] = _paramKeyVal[1];
		 *  }
		 *  }
		 * 
		 */
	}

	if (MenuID != ""){
		DoMenu(MenuID)
	}

}
