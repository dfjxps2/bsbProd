(function(){
	var SCROLL = {
		$:function (o) {
			var obj = document.getElementById(o);
			if (obj) { return obj;}
			return null;
		}, 
		getStyle:function (o) {
			return o.currentStyle || document.defaultView.getComputedStyle(o, null);
		}, 
		getOffset:function (o) {
			var t = o.offsetTop, h = o.offsetHeight;
			while (o = o.offsetParent) {
				t += o.offsetTop;
			}
			return {top:t, height:h};
		}, 
		bind:function (o, eType, fn) {
			if (o.addEventListener) {
				o.addEventListener(eType, fn, false);
			} else {
				if (o.attachEvent) {
					o.attachEvent("on" + eType, fn);
				} else {
					o["on" + eType] = fn;
				}
			}
		}, 
		stopEvent:function (e) {
			e = e || window.event;
			e.stopPropagation && (e.preventDefault(), e.stopPropagation()) || (e.cancelBubble = true, e.returnValue = false);
		}, 
		setCookie:function (c_name, value, expiredays) {
			var exdate = new Date();
			exdate.setDate(exdate.getDate() + expiredays);
			document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
		}, 
		getCookie:function (c_name) {
			if (document.cookie.length > 0) {
				c_start = document.cookie.indexOf(c_name + "=");
				if (c_start != -1) {
					c_start = c_start + c_name.length + 1;
					c_end = document.cookie.indexOf(";", c_start);
					if (c_end == -1) {
						c_end = document.cookie.length;
					}
					return unescape(document.cookie.substring(c_start, c_end));
				}
			}
			return "";
		},
		Bar:{
			config:{
				arrowUpInterval:null,
				arrowDownInterval:null,
				barMouseDownInterval:null,
				relY:null,
				barPos:null,
				handleMinHeight:15
			},
			init:function(id, arrowUpCss, arrowUpActiveCss, handleCss, handleActiveCss, arrowDownCss, arrowDownActiveCss){
				this.config.id = id;
				this.config.obj = document.getElementById(id);
				
				var ch = SCROLL.getStyle(this.config.obj).height;
				var h  = this.config.obj.style.height;
				if(ch=='auto' && h==''){this.config.uninit = true;alert('未设置高度！');return ;}
				this.config.obj.style.overflow = 'hidden'
				this.setObjCss();  //预先设置父容器的css定位才能让接下来的属性设置起作用
				this.config.obj.innerHTML = "<div id=\"" + id + "Area\" class=\"dumascroll_area\">" + this.config.obj.innerHTML + "</div><div id=\"" + id + "Bar\" class=\"dumascroll_bar\"><div class=\"dumascroll_arrow_up\"></div><div class=\"dumascroll_handle\"></div><div class=\"dumascroll_arrow_down\"></div></div>";
				
				this.config.area = document.getElementById(id + "Area");
				this.config.bar = document.getElementById(id + "Bar");
				
				this.config.arrowUp = this.config.bar.getElementsByTagName("div")[0];
				this.config.arrowUpCss = arrowUpCss;
				this.config.arrowUpActiveCss = arrowUpActiveCss;
				
				this.config.handle = this.config.bar.getElementsByTagName("div")[1];
				this.config.handleCss = handleCss;
				this.config.handleActiveCss = handleActiveCss;
				
				this.config.arrowDown = this.config.bar.getElementsByTagName("div")[2];
				this.config.arrowDownCss = arrowDownCss;
				this.config.arrowDownActiveCss = arrowDownActiveCss;
				
				
				this.config.arrowUpHeight = parseInt(SCROLL.getStyle(this.config.arrowUp).height);
				this.config.arrowDownHeight = parseInt(SCROLL.getStyle(this.config.arrowDown).height);
				this.config.areaScrollHeight = this.config.area.scrollHeight;
				this.config.handleHeight = parseInt(this.config.area.offsetHeight / this.config.area.scrollHeight * (this.config.bar.offsetHeight - this.config.arrowUpHeight - this.config.arrowDownHeight));
				
				if(this.config.areaScrollHeight<=parseInt(ch || h)){this.config.bar.style.display='none';}
			},
			updatePos:function(){
				var ch = SCROLL.getStyle(this.config.obj).height;
				var h  = this.config.obj.style.height;
				this.config.areaScrollHeight = this.config.area.scrollHeight;
				this.config.handleHeight = parseInt(this.config.area.offsetHeight / this.config.area.scrollHeight * (this.config.bar.offsetHeight - this.config.arrowUpHeight - this.config.arrowDownHeight));
				if(this.config.areaScrollHeight<=parseInt(ch)){this.config.bar.style.display='none';}
				else{this.config.bar.style.display='block';}
			},
			setObjCss:function () {
				 //若容器本来就没有设position，则初始化为relative；若容器原来未设置背景色，则初始化为白色；
				SCROLL.getStyle(this.config.obj).position == "static" ? this.config.obj.style.position = "relative" : SCROLL.getStyle(this.config.obj).backgroundColor == "transparent" ? this.config.obj.style.backgroundColor = "#fff" : null; 
			}, 
			sethandle:function () {    
				//当内容超多时设置拖拽条子的最小高度
				this.config.handle.style.top = this.config.arrowUpHeight + "px";
				if (this.config.handleHeight > this.config.handleMinHeight) {
					this.config.handleHeight < this.config.bar.offsetHeight - this.config.arrowUpHeight - this.config.arrowDownHeight ? this.config.handle.style.height = this.config.handleHeight + "px" : this.config.handle.style.display = "none";
				} else {
					this.config.handleHeight = this.config.handleMinHeight;
					this.config.handle.style.height = this.config.handleMinHeight + "px";
				}
			}, 
			setBarPos:function () {    
				//将当前滚动的距离值存入cookie
				this.config.barPos = this.config.area.scrollTop + "";
				//SCROLL.setCookie(this.config.id + "CookieName", this.config.barPos, 1);
			}, 
			getBarPos:function () {
				//this.config.barPos = SCROLL.getCookie(this.config.id + "CookieName");
				if (this.config.barPos != null && this.config.barPos != "") {
					this.config.area.scrollTop = this.config.barPos;
					this.areaScroll();
				}
			}, 
			clearArrowUpInterval:function () {
				clearInterval(this.config.arrowUpInterval);
			}, 
			clearArrowDownInterval:function () {
				clearInterval(this.config.arrowDownInterval);
			}, 
			clearBarMouseDownInterval:function () {
				clearInterval(this.config.barMouseDownInterval);
			}, 
			areaScroll:function () {
				this.config.handle.style.display != "none" ? this.config.handle.style.top = this.config.area.scrollTop / (this.config.area.scrollHeight - this.config.area.offsetHeight) * (this.config.bar.offsetHeight - this.config.handleHeight - this.config.arrowUpHeight - this.config.arrowDownHeight) + this.config.arrowUpHeight + "px" : null;
			}, 
			areakeydown:function (e) {   //支持键盘上下按键
				var that = this.config;
				var bar = this;
				document.onkeydown = function (event) {
					var e = event || window.event, ek = e.keyCode || e.which;
					if (ek == 40) {
						that.area.scrollTop += 25;
					} else {
						if (ek == 38) {
							that.area.scrollTop -= 25;
						}
					}
					if (that.area.scrollTop > 0 && that.area.scrollTop < that.area.scrollHeight - that.area.offsetHeight) {
						SCROLL.stopEvent(e);
					}
					bar.setBarPos();
				};
			}, 
			handleMove:function (e) {
				var e = e || window.event;
				this.config.area.scrollTop = (e.clientY - this.config.relY - this.config.arrowUpHeight) / (this.config.bar.offsetHeight - this.config.handleHeight - this.config.arrowUpHeight - this.config.arrowDownHeight) * (this.config.area.scrollHeight - this.config.area.offsetHeight);
				this.setBarPos();
			}, 
			handleMouseDown:function (e) {
				var that = this.config,bar = this, e = e || window.event;
				that.relY = e.clientY - that.handle.offsetTop;
				that.handle.setCapture ? that.handle.setCapture() : null;
				that.handle.className = that.handleActiveCss;
				document.onmousemove = function (event) {
					bar.handleMove(event);
				};
				document.onmouseup = function () {
					that.handle.className = that.handleCss;
					that.handle.releaseCapture ? that.handle.releaseCapture() : null;
					document.onmousemove = null;
				};
			}, barScroll:function (e) {
				var e = e || window.event, eDir;  //设置滚轮事件,e.wheelDelta与e.detail分别兼容IE、W3C，根据返回值的正负来判断滚动方向
				if (e.wheelDelta) {
					eDir = e.wheelDelta / 120;
				} else {
					if (e.detail) {
						eDir = -e.detail / 3;
					}
				}
				eDir > 0 ? this.config.area.scrollTop -= 80 : this.config.area.scrollTop += 80; //步长设80像素比较接近window滚动条的滚动速度
				if (this.config.area.scrollTop > 0 && this.config.area.scrollTop < this.config.area.scrollHeight - this.config.area.offsetHeight) {
					SCROLL.stopEvent(e);
				}
				this.setBarPos();
			}, 
			barDown:function (e) {
				var e = e || window.event, that = this.config,bar=this; eY = e.clientY, mStep = that.bar.offsetHeight, documentScrollTop = document.documentElement.scrollTop || document.body.scrollTop, hOffset = SCROLL.getOffset(that.handle), bOffset = SCROLL.getOffset(that.bar);
				if (documentScrollTop + eY < hOffset.top) {
					that.barMouseDownInterval = setInterval(function (e) {
						that.area.scrollTop -= that.area.offsetHeight;
						if (that.area.scrollTop <= (eY + documentScrollTop - bOffset.top - that.arrowUpHeight) / (that.bar.offsetHeight - that.arrowUpHeight - that.arrowDownHeight) * that.area.scrollHeight) {
							bar.clearBarMouseDownInterval();
						}
						bar.setBarPos();
					}, 80);
				} else {
					if (documentScrollTop + eY > hOffset.top + hOffset.height) {
						that.barMouseDownInterval = setInterval(function () {
							that.area.scrollTop += that.area.offsetHeight;
							if (that.area.scrollTop >= (eY + documentScrollTop - bOffset.top - that.arrowUpHeight - hOffset.height) / (that.bar.offsetHeight - that.arrowUpHeight - that.arrowDownHeight) * that.area.scrollHeight) {
								bar.clearBarMouseDownInterval();
							}
							bar.setBarPos();
						}, 80);
					}
				}
				SCROLL.stopEvent(e);
			}, 
			arrowUpMouseDown:function (e) {
				var that = this.config,bar = this;
				that.arrowUpInterval = setInterval(function () {
					that.area.scrollTop -= 25;
					bar.setBarPos();
				}, 10);
				that.arrowUp.className = that.arrowUpActiveCss;
				SCROLL.stopEvent(e);
			}, 
			arrowUpMouseUp:function () {
				this.clearArrowUpInterval();
				this.config.arrowUp.className = this.config.arrowUpCss;
			}, 
			arrowUpMouseOut:function () {
				this.clearArrowUpInterval();
				this.config.arrowUp.className = this.config.arrowUpCss;
			}, 
			arrowDownMouseDown:function (e) {
				var that = this.config,bar = this;
				that.arrowDownInterval = setInterval(function () {
					that.area.scrollTop += 25;
					bar.setBarPos();
				}, 10);
				that.arrowDown.className = that.arrowDownActiveCss;
				SCROLL.stopEvent(e);
			}, 
			arrowDownMouseUp:function () {
				this.clearArrowDownInterval();
				this.config.arrowDown.className = this.config.arrowDownCss;
			}, 
			arrowDownMouseOut:function () {
				this.clearArrowDownInterval();
				this.config.arrowDown.className = this.config.arrowDownCss;
			}, 
			run:function () {
				if(this.config.uninit){return;}
				var that = this.config;
				var bar = this;
				this.sethandle();
				this.areaScroll();
				this.getBarPos();
				that.area.onscroll = function () {
					bar.areaScroll();
				};
				that.area.onmouseover = that.bar.onmouseover = function (event) {
					bar.areakeydown(event);
				};
				that.area.onmouseout = that.bar.onmouseout = function () {
					document.onkeydown = null;
				};
				that.handle.onmousedown = function (event) {
					bar.handleMouseDown(event);
				};
				that.bar.onmousedown = function (event) {
					bar.barDown(event);
				};
				that.bar.onmouseup = function () {
					bar.clearBarMouseDownInterval();
				};
				that.bar.onmouseout = function () {
					bar.clearBarMouseDownInterval();
				};
				that.arrowUp.onmousedown = function (event) {
					bar.arrowUpMouseDown(event);
				};
				that.arrowUp.onmouseup = function () {
					bar.arrowUpMouseUp();
				};
				that.arrowUp.onmouseout = function () {
					bar.arrowUpMouseOut();
				};
				that.arrowDown.onmousedown = function (event) {
					bar.arrowDownMouseDown(event);
				};
				that.arrowDown.onmouseup = function () {
					bar.arrowDownMouseUp();
				};
				that.arrowDown.onmouseout = function () {
					bar.arrowDownMouseOut();
				};
				SCROLL.bind(that.obj, "mousewheel", function (event) {
					bar.barScroll(event);
				});
				SCROLL.bind(that.obj, "DOMMouseScroll", function (event) {
					bar.barScroll(event);
				});
			}
		},
		attachBar:function(id){
			SCROLL.Bar.init(id, "dumascroll_arrow_up", "dumascroll_arrow_up_a", "dumascroll_handle", "dumascroll_handle_a", "dumascroll_arrow_down", "dumascroll_arrow_down_a");
			SCROLL.Bar.run();
		}
	};
	window.SCROLL = SCROLL;
})();
