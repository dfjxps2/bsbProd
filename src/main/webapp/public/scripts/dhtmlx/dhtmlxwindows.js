

function dhtmlXWindowsSngl() {
};
function dhtmlXWindowsBtn() {
};
function dhtmlXWindows() {
    if (!dhtmlXContainer) {
        alert("dhtmlxcontainer.js is missed on the page");
        return
    };
    this.engine = "dhx";
    var engineFunc = "_" + this.engine + "_Engine";
    if (!this[engineFunc]) {
        alert("No dhtmlxWindows engine was found.");
        return
    } else {
        this[engineFunc]()
    };
    var that = this;
    this.pathPrefix = "dhxwins_";
    this.imagePath = dhtmlx.image_path || "codebase/imgs/";
    this.setImagePath = function(path) {
        this.imagePath = path
    };
    this.skin = "dhx_skyblue";
    this.skinParams = {
        "standard" : {
            "header_height" : 32,
            "border_left_width" : 6,
            "border_right_width" : 7,
            "border_bottom_height" : 6
        },
        "aqua_dark" : {
            "header_height" : 31,
            "border_left_width" : 3,
            "border_right_width" : 3,
            "border_bottom_height" : 3
        },
        "aqua_orange" : {
            "header_height" : 31,
            "border_left_width" : 3,
            "border_right_width" : 3,
            "border_bottom_height" : 3
        },
        "aqua_sky" : {
            "header_height" : 31,
            "border_left_width" : 3,
            "border_right_width" : 3,
            "border_bottom_height" : 3
        },
        "clear_blue" : {
            "header_height" : 32,
            "border_left_width" : 6,
            "border_right_width" : 6,
            "border_bottom_height" : 6
        },
        "clear_green" : {
            "header_height" : 32,
            "border_left_width" : 6,
            "border_right_width" : 6,
            "border_bottom_height" : 6
        },
        "clear_silver" : {
            "header_height" : 32,
            "border_left_width" : 6,
            "border_right_width" : 6,
            "border_bottom_height" : 6
        },
        "glassy_blue" : {
            "header_height" : 26,
            "border_left_width" : 4,
            "border_right_width" : 4,
            "border_bottom_height" : 4
        },
        "glassy_blue_light" : {
            "header_height" : 26,
            "border_left_width" : 3,
            "border_right_width" : 3,
            "border_bottom_height" : 3
        },
        "glassy_caramel" : {
            "header_height" : 26,
            "border_left_width" : 4,
            "border_right_width" : 4,
            "border_bottom_height" : 4
        },
        "glassy_greenapple" : {
            "header_height" : 26,
            "border_left_width" : 4,
            "border_right_width" : 4,
            "border_bottom_height" : 4
        },
        "glassy_rainy" : {
            "header_height" : 26,
            "border_left_width" : 4,
            "border_right_width" : 4,
            "border_bottom_height" : 4
        },
        "glassy_raspberries" : {
            "header_height" : 26,
            "border_left_width" : 4,
            "border_right_width" : 4,
            "border_bottom_height" : 4
        },
        "glassy_yellow" : {
            "header_height" : 26,
            "border_left_width" : 4,
            "border_right_width" : 4,
            "border_bottom_height" : 4
        },
        "modern_black" : {
            "header_height" : 39,
            "border_left_width" : 2,
            "border_right_width" : 2,
            "border_bottom_height" : 2
        },
        "modern_blue" : {
            "header_height" : 39,
            "border_left_width" : 2,
            "border_right_width" : 2,
            "border_bottom_height" : 2
        },
        "modern_red" : {
            "header_height" : 39,
            "border_left_width" : 2,
            "border_right_width" : 2,
            "border_bottom_height" : 2
        },
        "web" : {
            "header_height" : 21,
            "border_left_width" : 2,
            "border_right_width" : 2,
            "border_bottom_height" : 2
        },
        "vista_blue" : {
            "header_height" : 28,
            "border_left_width" : 8,
            "border_right_width" : 8,
            "border_bottom_height" : 8
        },
        "dhx_black" : {
            "header_height" : 21,
            "border_left_width" : 2,
            "border_right_width" : 2,
            "border_bottom_height" : 2
        },
        "dhx_blue" : {
            "header_height" : 21,
            "border_left_width" : 2,
            "border_right_width" : 2,
            "border_bottom_height" : 2
        },
        "dhx_skyblue" : {
            "header_height" : 21,
            "border_left_width" : 2,
            "border_right_width" : 2,
            "border_bottom_height" : 2
        }
    };
    this.setSkin = function(skin) {
        this.skin = skin;
        this._engineRedrawSkin()
    };
    this.isWindow = function(id) {
        var t = (this.wins[id] != null);
        return t
    };
    this.findByText = function(text) {
        var wins = new Array();
        for (var a in this.wins) {
            if (this.wins[a].getText().search(text, "gi") >= 0) {
                wins[wins.length] = this.wins[a]
            }
        };
        return wins
    };
    this.window = function(id) {
        var win = null;
        if (this.wins[id] != null) {
            win = this.wins[id]
        };
        return win
    };
    this.forEachWindow = function(handler) {
        for (var a in this.wins) {
            handler(this.wins[a])
        }
    };
    this.getBottommostWindow = function() {
        var bottommost = this.getTopmostWindow();
        for (var a in this.wins) {
            if (this.wins[a].zi < bottommost.zi) {
                bottommost = this.wins[a]
            }
        };
        return (bottommost.zi != 0 ? bottommost : null)
    };
    this.getTopmostWindow = function(visibleOnly) {
        var topmost = {
            "zi" : 0
        };
        for (var a in this.wins) {
            if (this.wins[a].zi > topmost.zi) {
                if (visibleOnly == true && !this._isWindowHidden(this.wins[a])) {
                    topmost = this.wins[a]
                };
                if (visibleOnly != true) {
                    topmost = this.wins[a]
                }
            }
        };
        return (topmost.zi != 0 ? topmost : null)
    };
    this.wins = {};
    for (var a in this.wins)
        delete this.wins[a];
    this.autoViewport = true;
    this._createViewport = function() {
        this.vp = document.body;
        this.vp._css = (String(this.vp.className).length > 0 ? this.vp.className : "");
        this.vp.className += " dhtmlx_skin_" + this.skin;
        this.modalCoverI = document.createElement("IFRAME");
        this.modalCoverI.frameBorder = "0";
        this.modalCoverI.className = "dhx_modal_cover_ifr";
        this.modalCoverI.setAttribute("src", "javascript:false;");
        this.modalCoverI.style.display = "none";
        this.modalCoverI.style.zIndex = 0;
        this.vp.appendChild(this.modalCoverI);
        this.modalCoverD = document.createElement("DIV");
        this.modalCoverD.className = "dhx_modal_cover_dv";
        this.modalCoverD.style.display = "none";
        this.modalCoverD.style.zIndex = 0;
        this.vp.appendChild(this.modalCoverD);
        this._vpcover = document.createElement("DIV");
        this._vpcover.className = "dhx_content_vp_cover";
        this._vpcover.style.display = "none";
        this.vp.appendChild(this._vpcover);
        this._carcass = document.createElement("DIV");
        this._carcass.className = "dhx_carcass_resmove";
        this._carcass.style.display = "none";
        if (_isIE) {
            this._carcass.innerHTML = "<iframe border=0 frameborder=0 style='filter: alpha(opacity=0);width: 100%;height:100%;position: absolute;top: 0px;left: 0px;width: 100%;height: 100%;'></iframe><div style='position: absolute;top: 0px;left: 0px;width: 100%;height: 100%;'></div>";
            this._carcass.childNodes[0].setAttribute("src", "javascript:false;")
        };
        this._carcass.onselectstart = function(e) {
            e = e || event;
            e.returnValue = false
        };
        this.vp.appendChild(this._carcass)
    };
    this._autoResizeViewport = function() {
        for (var a in this.wins) {
            if (this.wins[a]._isFullScreened) {
                this.wins[a]._content.style.width = document.body.offsetWidth - (_isIE ? 4 : 0) + "px";
                if (document.body.offsetHeight == 0) {
                    if (window.innerHeight) {
                        this.wins[a]._content.style.height = window.innerHeight + "px"
                    } else {
                        this.wins[a]._content.style.height = document.body.scrollHeight + "px"
                    }
                } else {
                    this.wins[a]._content.style.height = document.body.offsetHeight - (_isIE ? 4 : 0) + "px"
                };
                if (this.wins[a].layout != null && _isOpera) {
                    this.wins[a].layout._fixCellsContentOpera950()
                };
                this.wins[a].updateNestedObjects()
            };
            if (this.wins[a]._isMaximized && this.wins[a].style.display != "none") {
                this._restoreWindow(this.wins[a]);
                this._maximizeWindow(this.wins[a])
            }
        };
        if (this.vp == document.body)
            return;
        if (this.autoViewport == false)
            return;
        this.vp.style.width = (_isIE ? document.body.offsetWidth - 4 : window.innerWidth) + "px";
        this.vp.style.height = (_isIE ? document.body.offsetHeight - 4 : window.innerHeight) + "px";
        for (var a in this.wins) {
            var win = this.wins[a];
            var overX = false;
            var overY = false;
            if (win.x > this.vp.offsetWidth - 10) {
                win.x = this.vp.offsetWidth - 10;
                overX = true
            };
            var skinParams = (win._skinParams != null ? win._skinParams : this.skinParams[this.skin]);
            if (win.y + skinParams["header_height"] > this.vp.offsetHeight) {
                win.y = this.vp.offsetHeight - skinParams["header_height"];
                overY = true
            };
            if (overX || overY) {
                this._engineRedrawWindowPos(win)
            }
        }
    };
    this.enableAutoViewport = function(state) {
        if (this.vp != document.body)
            return;
        this.autoViewport = state;
        if (state == false) {
            document.body.className = this.vp._css;
            this.vp = document.createElement("DIV");
            this.vp.autocreated = true;
            this.vp.className = "dhtmlx_winviewport dhtmlx_skin_" + this.skin;
            this.vp.style.left = "0px";
            this.vp.style.top = "0px";
            document.body.appendChild(this.vp);
            this.vp.ax = 0;
            this.vp.ay = 0;
            this._autoResizeViewport();
            this.vp.appendChild(this.modalCoverI);
            this.vp.appendChild(this.modalCoverD);
            this.vp.appendChild(this._carcass)
        }
    };
    this.attachViewportTo = function(objId) {
        if (this.autoViewport == false) {
            if (this.vp != document.body) {
                this.vp.parentNode.removeChild(this.vp)
            };
            this.vp = document.getElementById(objId);
            this.vp.autocreated = false;
            this.vp.className += " dhtmlx_skin_" + this.skin;
            this.vp.style.position = "relative";
            this.vp.style.overflow = "hidden";
            this.vp.ax = 0;
            this.vp.ay = 0;
            this.vp.appendChild(this.modalCoverI);
            this.vp.appendChild(this.modalCoverD);
            this.vp.appendChild(this._carcass)
        }
    };
    this.setViewport = function(x, y, width, height, parentObj) {
        if (this.autoViewport == false) {
            this.vp.style.left = x + "px";
            this.vp.style.top = y + "px";
            this.vp.style.width = width + "px";
            this.vp.style.height = height + "px";
            if (parentObj != null) {
                parentObj.appendChild(this.vp)
            };
            this.vp.ax = getAbsoluteLeft(this.vp);
            this.vp.ay = getAbsoluteTop(this.vp)
        }
    };
    this._effects = {
        "move" : false,
        "resize" : false
    };
    this.setEffect = function(efName, efValue) {
        if ((this._effects[efName] != null) && (typeof(efValue) == "boolean")) {
            this._effects[efName] = efValue
        }
    };
    this.getEffect = function(efName) {
        return this._effects[efName]
    };
    this.createWindow = function(id, x, y, width, height) {
        var win = document.createElement("DIV");
        win.className = "dhtmlx_window_inactive";
        for (var a in this.wins) {
            this.wins[a].zi += this.zIndexStep;
            this.wins[a].style.zIndex = this.wins[a].zi
        };
        win.zi = this.zIndexStep;
        win.style.zIndex = win.zi;
        win.active = false;
        win._isWindow = true;
        win.isWindow = true;
        win.w = width;
        win.h = height;
        win.x = x;
        win.y = y;
        this._engineFixWindowPosInViewport(win);
        win._isModal = false;
        win._allowResize = true;
        win.maxW = "auto";
        win.maxH = "auto";
        win.minW = 200;
        win.minH = 140;
        win.iconsPresent = true;
        win.icons = new Array(this.imagePath + this.pathPrefix + this.skin + "/active/icon_normal.gif", this.imagePath + this.pathPrefix + this.skin + "/inactive/icon_normal.gif");
        win._allowMove = true;
        win._allowMoveGlobal = true;
        win._allowResizeGlobal = true;
        win._keepInViewport = false;
        var skin = this.skinParams[this.skin];
        win.idd = id;
        this.vp.appendChild(win);
        this._engineSetWindowBody(win);
        this._engineRedrawWindowPos(win);
        this._engineRedrawWindowSize(win);
        this._engineUpdateWindowIcon(win, win.icons[0]);
        this._engineDiableOnSelectInWindow(win, true);
        this.wins[id] = win;
        dhtmlxEventable(win);
        this._engineGetWindowHeader(win).onmousedown = function(e) {
            var w = that.wins[this.idd];
            w.bringToTop();
            if (that._engineGetWindowHeaderState(w))
                return;
            e = e || event;
            if (!that._engineCheckHeaderMouseDown(w, e)) {
                return
            };
            if (!w._allowMove || !w._allowMoveGlobal) {
                return
            };
            w.oldMoveX = w.x;
            w.oldMoveY = w.y;
            w.moveOffsetX = w.x - e.clientX;
            w.moveOffsetY = w.y - e.clientY;
            that.movingWin = w;
            if (that._effects["move"] == false) {
                that._carcass.x = that.movingWin.x;
                that._carcass.y = that.movingWin.y;
                that._carcass.w = parseInt(that.movingWin.style.width) + (_isIE ? 0 : -2);
                that._carcass.h = parseInt(that.movingWin.style.height) + (_isIE ? 0 : -2);
                that._carcass.style.left = that._carcass.x + "px";
                that._carcass.style.top = that._carcass.y + "px";
                that._carcass.style.width = that._carcass.w + "px";
                that._carcass.style.height = that._carcass.h + "px";
                that._carcass.style.zIndex = that._getTopZIndex(true) + 1;
                that._carcass._keepInViewport = win._keepInViewport
            };
            that._blockSwitcher(true);
            that._vpcover.style.zIndex = that.movingWin.style.zIndex - 1;
            that._vpcover.style.display = "";
            e.returnValue = false;
            e.cancelBubble = true;
            w = null;
            return false
        };
        this._engineGetWindowHeader(win).ondblclick = function(e) {
            var w = that.wins[this.idd];
            if (!that._engineCheckHeaderMouseDown(w, e || event)) {
                return
            };
            if (w._allowResizeGlobal && !w._isParked) {
                if (w._isMaximized == true) {
                    that._restoreWindow(w)
                } else {
                    that._maximizeWindow(w)
                }
            }
        };
        win.setText = function(text) {
            that._engineGetWindowLabel(this).innerHTML = text
        };
        win.getText = function() {
            return that._engineGetWindowLabel(this).innerHTML
        };
        win.getId = function() {
            return this.idd
        };
        win.show = function() {
            that._showWindow(this)
        };
        win.hide = function() {
            that._hideWindow(this)
        };
        win.minimize = function() {
            that._restoreWindow(this)
        };
        win.maximize = function() {
            that._maximizeWindow(this)
        };
        win.close = function() {
            that._closeWindow(this)
        };
        win.park = function() {
            if (this._isParkedAllowed) {
                that._parkWindow(this)
            }
        };
        win.stick = function() {
            that._stickWindow(this)
        };
        win.unstick = function() {
            that._unstickWindow(this)
        };
        win.isSticked = function() {
            return this._isSticked
        };
        win.setIcon = function(iconEnabled, iconDisabled) {
            that._setWindowIcon(win, iconEnabled, iconDisabled)
        };
        win.getIcon = function() {
            return that._getWindowIcon(this)
        };
        win.clearIcon = function() {
            that._clearWindowIcons(this)
        };
        win.restoreIcon = function() {
            that._restoreWindowIcons(this)
        };
        win.keepInViewport = function(state) {
            this._keepInViewport = state
        };
        win.setModal = function(state) {
            if (state == true) {
                if (that.modalWin != null || that.modalWin == this)
                    return;
                that._setWindowModal(this, true)
            } else {
                if (that.modalWin != this)
                    return;
                that._setWindowModal(this, false)
            }
        };
        win.isModal = function() {
            return this._isModal
        };
        win.isHidden = function() {
            return that._isWindowHidden(this)
        };
        win.isMaximized = function() {
            return this._isMaximized
        };
        win.isParked = function() {
            return this._isParked
        };
        win.allowPark = function() {
            that._allowParking(this)
        };
        win.denyPark = function() {
            that._denyParking(this)
        };
        win.isParkable = function() {
            return this._isParkedAllowed
        };
        win.allowResize = function() {
            that._allowReszieGlob(this)
        };
        win.denyResize = function() {
            that._denyResize(this)
        };
        win.isResizable = function() {
            return this._allowResizeGlobal
        };
        win.allowMove = function() {
            if (!this._isMaximized) {
                this._allowMove = true
            };
            this._allowMoveGlobal = true
        };
        win.denyMove = function() {
            this._allowMoveGlobal = false
        };
        win.isMovable = function() {
            return this._allowMoveGlobal
        };
        win.bringToTop = function() {
            that._bringOnTop(this);
            that._makeActive(this)
        };
        win.bringToBottom = function() {
            that._bringOnBottom(this)
        };
        win.isOnTop = function() {
            return that._isWindowOnTop(this)
        };
        win.isOnBottom = function() {
            return that._isWindowOnBottom(this)
        };
        win.setPosition = function(x, y) {
            this.x = x;
            this.y = y;
            that._engineFixWindowPosInViewport(this);
            that._engineRedrawWindowPos(this)
        };
        win.getPosition = function() {
            return new Array(this.x, this.y)
        };
        win.setDimension = function(width, height) {
            if (width != null) {
                this.w = width
            };
            if (height != null) {
                this.h = height
            };
            that._fixWindowDimensionInViewport(this);
            that._engineFixWindowPosInViewport(this);
            that._engineRedrawWindowSize(this);
            this.updateNestedObjects()
        };
        win.getDimension = function() {
            return new Array(this.w, this.h)
        };
        win.setMaxDimension = function(maxWidth, maxHeight) {
            this.minW = "auto";
            this.minH = "auto";
            that._engineRedrawWindowSize(this)
        };
        win.getMaxDimension = function() {
            return new Array(this.maxW, this.maxH)
        };
        win.setMinDimension = function(minWidth, minHeight) {
            if (minWidth != null) {
                this.minW = minWidth
            };
            if (minHeight != null) {
                this.minH = minHeight
            };
            that._fixWindowDimensionInViewport(this);
            that._engineRedrawWindowPos(this)
        };
        win.getMinDimension = function() {
            return new Array(this.minW, this.minH)
        };
        win._adjustToContent = function(cw, ch) {
            that._engineAdjustWindowToContent(this, cw, ch)
        };
        win._doOnAttachMenu = function() {
            that._engineRedrawWindowSize(this);
            this.updateNestedObjects()
        };
        win._doOnAttachToolbar = function() {
            that._engineRedrawWindowSize(this);
            this.updateNestedObjects()
        };
        win._doOnAttachStatusBar = function() {
            that._engineRedrawWindowSize(this);
            this.updateNestedObjects()
        };
        win._doOnAttachURL = function(addIFrameEvents) {
            if (!addIFrameEvents) {
                that.callEvent("onContentLoaded", [this]);
                return
            };
            if (_isIE) {
                var w = this;
                var f = this._frame;
                f.onreadystatechange = function(a) {
                    if (f.readyState == "complete") {
                        try {
                            f.contentWindow.document.body.onmousedown = function() {
                                try {
                                    w.bringToTop()
                                } catch (e) {
                                }
                            }
                        } catch (e) {
                        };
                        try {
                            that.callEvent("onContentLoaded", [w])
                        } catch (e) {
                        }
                    }
                }
            } else {
                var w = this;
                var f = this._frame;
                f.onload = function() {
                    try {
                        f.contentWindow.onmousedown = function() {
                            try {
                                w.bringToTop()
                            } catch (e) {
                            }
                        }
                    } catch (e) {
                    };
                    that.callEvent("onContentLoaded", [w])
                }
            }
        };
        win.addUserButton = function(id, pos, title, label) {
            var userBtn = that._addUserButton(this, id, pos, title, label);
            return userBtn
        };
        win.removeUserButton = function(id) {
            if (!((id == "minmax1") || (id == "minmax2") || (id == "park") || (id == "close") || (id == "stick") || (id == "unstick") || (id == "help"))) {
                if (btn != null) {
                    that._removeUserButton(this, id)
                }
            }
        };
        win.progressOn = function() {
            that._engineSwitchWindowProgress(this, true)
        };
        win.progressOff = function() {
            that._engineSwitchWindowProgress(this, false)
        };
        win.setToFullScreen = function(state) {
            that._setWindowToFullScreen(this, state)
        };
        win.showHeader = function() {
            that._engineSwitchWindowHeader(this, true)
        };
        win.hideHeader = function() {
            that._engineSwitchWindowHeader(this, false)
        };
        win.progressOff();
        win.canStartResize = false;
        win.onmousemove = function(e) {
            e = e || event;
            var targetObj = e.target || e.srcElement;
            if ((!this._allowResize) || (this._allowResizeGlobal == false)) {
                targetObj.style.cursor = "";
                this.canStartResize = false;
                this.style.cursor = "";
                return false
            };
            if (that.resizingWin != null)
                return;
            if (that.movingWin != null)
                return;
            if (this._isParked)
                return;
            var px = (_isIE || _isOpera ? e.offsetX : e.layerX);
            var py = (_isIE || _isOpera ? e.offsetY : e.layerY);
            var resDir = that._engineAllowWindowResize(win, targetObj, px, py);
            if (resDir == null) {
                this.canStartResize = false;
                this.style.cursor = "";
                return
            };
            that.resizingDirs = resDir;
            switch (that.resizingDirs) {
                case "border_left" :
                    targetObj.style.cursor = "w-resize";
                    this.resizeOffsetX = this.x - e.clientX;
                    break;
                case "border_right" :
                    targetObj.style.cursor = "e-resize";
                    this.resizeOffsetXW = this.x + this.w - e.clientX;
                    break;
                case "border_top" :
                    targetObj.style.cursor = "n-resize";
                    this.resizeOffsetY = this.y - e.clientY;
                    break;
                case "border_bottom" :
                    targetObj.style.cursor = "n-resize";
                    this.resizeOffsetYH = this.y + this.h - e.clientY;
                    break;
                case "corner_left" :
                    targetObj.style.cursor = "sw-resize";
                    this.resizeOffsetX = this.x - e.clientX;
                    this.resizeOffsetYH = this.y + this.h - e.clientY;
                    break;
                case "corner_up_left" :
                    targetObj.style.cursor = "nw-resize";
                    this.resizeOffsetY = this.y - e.clientY;
                    this.resizeOffsetX = this.x - e.clientX;
                    break;
                case "corner_right" :
                    targetObj.style.cursor = "nw-resize";
                    this.resizeOffsetXW = this.x + this.w - e.clientX;
                    this.resizeOffsetYH = this.y + this.h - e.clientY;
                    break;
                case "corner_up_right" :
                    targetObj.style.cursor = "sw-resize";
                    this.resizeOffsetY = this.y - e.clientY;
                    this.resizeOffsetXW = this.x + this.w - e.clientX;
                    break
            };
            this.canStartResize = true;
            this.style.cursor = targetObj.style.cursor;
            return false
        };
        win.onmousedown = function(e) {
            that._makeActive(this);
            that._bringOnTop(this);
            if (this.canStartResize) {
                that._blockSwitcher(true);
                that.resizingWin = this;
                if (!that._effects["resize"]) {
                    that._carcass.x = that.resizingWin.x;
                    that._carcass.y = that.resizingWin.y;
                    that._carcass.w = that.resizingWin.w + (_isIE ? 0 : -2);
                    that._carcass.h = that.resizingWin.h + (_isIE ? 0 : -2);
                    that._carcass.style.left = that._carcass.x + "px";
                    that._carcass.style.top = that._carcass.y + "px";
                    that._carcass.style.width = that._carcass.w + "px";
                    that._carcass.style.height = that._carcass.h + "px";
                    that._carcass.style.zIndex = that._getTopZIndex(true) + 1;
                    that._carcass.style.cursor = this.style.cursor;
                    that._carcass._keepInViewport = this._keepInViewport;
                    that._carcass.style.display = ""
                };
                that._vpcover.style.zIndex = that.resizingWin.style.zIndex - 1;
                that._vpcover.style.display = "";
                if (this.layout) {
                    this.callEvent("_onBeforeTryResize", [this])
                };
                e = e || event;
                e.returnValue = false;
                e.cancelBubble = true;
                return false
            }
        };
        this._addDefaultButtons(win);
        win.button = function(id) {
            var b = null;
            if (this.btns[id] != null) {
                b = this.btns[id]
            };
            return b
        };
        win.center = function() {
            that._centerWindow(this, false)
        };
        win.centerOnScreen = function() {
            that._centerWindow(this, true)
        };
        win._attachContent("empty", null);
        win._redraw = function() {
            that._engineRedrawWindowSize(this)
        };
        win.bringToTop();
        this._engineRedrawWindowSize(win);
        return this.wins[id]
    };
    this.zIndexStep = 50;
    this._getTopZIndex = function(ignoreSticked) {
        var topZIndex = 0;
        for (var a in this.wins) {
            if (ignoreSticked == true) {
                if (this.wins[a].zi > topZIndex) {
                    topZIndex = this.wins[a].zi
                }
            } else {
                if (this.wins[a].zi > topZIndex && !this.wins[a]._isSticked) {
                    topZIndex = this.wins[a].zi
                }
            }
        };
        return topZIndex
    };
    this.movingWin = null;
    this._moveWindow = function(e) {
        if (this.movingWin != null) {
            if (!this.movingWin._allowMove || !this.movingWin._allowMoveGlobal) {
                return
            };
            if (this._effects["move"] == true) {
                if (this._engineGetWindowHeader(this.movingWin).style.cursor != "move") {
                    this._engineGetWindowHeader(this.movingWin).style.cursor = "move"
                };
                this.movingWin.oldMoveX = this.movingWin.x;
                this.movingWin.oldMoveY = this.movingWin.y;
                this.movingWin.x = e.clientX + this.movingWin.moveOffsetX;
                this.movingWin.y = e.clientY + this.movingWin.moveOffsetY;
                this._engineFixWindowPosInViewport(this.movingWin);
                this._engineRedrawWindowPos(this.movingWin)
            } else {
                if (this._carcass.style.display != "") {
                    this._carcass.style.display = ""
                };
                if (this._carcass.style.cursor != "move") {
                    this._carcass.style.cursor = "move"
                };
                if (this._engineGetWindowHeader(this.movingWin).style.cursor != "move") {
                    this._engineGetWindowHeader(this.movingWin).style.cursor = "move"
                };
                this._carcass.x = e.clientX + this.movingWin.moveOffsetX;
                this._carcass.y = e.clientY + this.movingWin.moveOffsetY;
                this._engineFixWindowPosInViewport(this._carcass);
                this._carcass.style.left = this._carcass.x + "px";
                this._carcass.style.top = this._carcass.y + "px"
            }
        };
        if (this.resizingWin != null) {
            if (!this.resizingWin._allowResize) {
                return
            };
            if (this.resizingDirs == "border_left" || this.resizingDirs == "corner_left" || this.resizingDirs == "corner_up_left") {
                if (this._effects["resize"]) {
                    var ofs = e.clientX + this.resizingWin.resizeOffsetX;
                    var sign = (ofs > this.resizingWin.x ? -1 : 1);
                    newW = this.resizingWin.w + Math.abs(ofs - this.resizingWin.x) * sign;
                    if ((newW < this.resizingWin.minW) && (sign < 0)) {
                        this.resizingWin.x = this.resizingWin.x + this.resizingWin.w - this.resizingWin.minW;
                        this.resizingWin.w = this.resizingWin.minW
                    } else {
                        this.resizingWin.w = newW;
                        this.resizingWin.x = ofs
                    };
                    this._engineRedrawWindowPos(this.resizingWin);
                    this._engineRedrawWindowSize(this.resizingWin)
                } else {
                    var ofs = e.clientX + this.resizingWin.resizeOffsetX;
                    var sign = (ofs > this._carcass.x ? -1 : 1);
                    newW = this._carcass.w + Math.abs(ofs - this._carcass.x) * sign;
                    if ((newW < this.resizingWin.minW) && (sign < 0)) {
                        this._carcass.x = this._carcass.x + this._carcass.w - this.resizingWin.minW;
                        this._carcass.w = this.resizingWin.minW
                    } else {
                        this._carcass.w = newW;
                        this._carcass.x = ofs
                    };
                    this._carcass.style.left = this._carcass.x + "px";
                    this._carcass.style.width = this._carcass.w + "px"
                }
            };
            if (this.resizingDirs == "border_right" || this.resizingDirs == "corner_right" || this.resizingDirs == "corner_up_right") {
                if (this._effects["resize"]) {
                    var ofs = e.clientX - (this.resizingWin.x + this.resizingWin.w) + this.resizingWin.resizeOffsetXW;
                    newW = this.resizingWin.w + ofs;
                    if (newW < this.resizingWin.minW) {
                        newW = this.resizingWin.minW
                    };
                    this.resizingWin.w = newW;
                    this._engineRedrawWindowPos(this.resizingWin);
                    this._engineRedrawWindowSize(this.resizingWin)
                } else {
                    var ofs = e.clientX - (this._carcass.x + this._carcass.w) + this.resizingWin.resizeOffsetXW;
                    newW = this._carcass.w + ofs;
                    if (newW < this.resizingWin.minW) {
                        newW = this.resizingWin.minW
                    };
                    this._carcass.w = newW;
                    this._carcass.style.width = this._carcass.w + "px"
                }
            };
            if (this.resizingDirs == "border_bottom" || this.resizingDirs == "corner_left" || this.resizingDirs == "corner_right") {
                if (this._effects["resize"]) {
                    var ofs = e.clientY - (this.resizingWin.y + this.resizingWin.h) + this.resizingWin.resizeOffsetYH;
                    newH = this.resizingWin.h + ofs;
                    if (newH < this.resizingWin.minH) {
                        newH = this.resizingWin.minH
                    };
                    this.resizingWin.h = newH;
                    this._engineRedrawWindowPos(this.resizingWin);
                    this._engineRedrawWindowSize(this.resizingWin)
                } else {
                    var ofs = e.clientY - (this._carcass.y + this._carcass.h) + this.resizingWin.resizeOffsetYH;
                    newH = this._carcass.h + ofs;
                    if (newH < this.resizingWin.minH) {
                        newH = this.resizingWin.minH
                    };
                    this._carcass.h = newH;
                    this._carcass.style.height = this._carcass.h + "px"
                }
            };
            if (this.resizingDirs == "border_top" || this.resizingDirs == "corner_up_right" || this.resizingDirs == "corner_up_left") {
                if (this._effects["resize"]) {
                } else {
                    var ofs = e.clientY + this.resizingWin.resizeOffsetY;
                    var sign = (ofs > this.resizingWin.y ? -1 : 1);
                    newH = this.resizingWin.h + Math.abs(ofs - this.resizingWin.y) * sign;
                    if ((newH < this.resizingWin.minH) && (sign < 0)) {
                        this._carcass.y = this._carcass.y + this._carcass.h - this.resizingWin.minH;
                        this._carcass.h = this.resizingWin.minH
                    } else {
                        this._carcass.h = newH + (_isIE ? 0 : -2);
                        this._carcass.y = ofs
                    };
                    this._carcass.style.top = this._carcass.y + "px";
                    this._carcass.style.height = this._carcass.h + "px"
                }
            }
        }
    };
    this._stopMove = function() {
        if (this.movingWin != null) {
            if (this._effects["move"]) {
                var win = this.movingWin;
                this.movingWin = null;
                this._blockSwitcher(false);
                this._engineGetWindowHeader(win).style.cursor = "";
                if (_isFF) {
                    win.h++;
                    that._engineRedrawWindowPos(win);
                    win.h--;
                    that._engineRedrawWindowPos(win)
                }
            } else {
                this._carcass.style.cursor = "";
                this._carcass.style.display = "none";
                var win = this.movingWin;
                this._engineGetWindowHeader(win).style.cursor = "";
                this.movingWin = null;
                this._blockSwitcher(false);
                win.setPosition(parseInt(this._carcass.style.left), parseInt(this._carcass.style.top))
            };
            this._vpcover.style.display = "none";
            if (!(win.oldMoveX == win.x && win.oldMoveY == win.y)) {
                if (win.checkEvent("onMoveFinish")) {
                    win.callEvent("onMoveFinish", [win])
                } else {
                    this.callEvent("onMoveFinish", [win])
                }
            }
        };
        if (this.resizingWin != null) {
            var win = this.resizingWin;
            this.resizingWin = null;
            this._blockSwitcher(false);
            if (!this._effects["resize"]) {
                this._carcass.style.display = "none";
                win.setPosition(this._carcass.x, this._carcass.y);
                win.setDimension(this._carcass.w + (_isIE ? 0 : 2), this._carcass.h + (_isIE ? 0 : 2))
            } else {
                win.updateNestedObjects()
            };
            if (win.layout) {
                win.layout.callEvent("onResize", [])
            };
            this._vpcover.style.display = "none";
            if (win.checkEvent("onResizeFinish")) {
                win.callEvent("onResizeFinish", [win])
            } else {
                this.callEvent("onResizeFinish", [win])
            }
        }
    };
    this._fixWindowDimensionInViewport = function(win) {
        if (win.w < win.minW) {
            win.w = win.minW
        };
        if (win._isParked)
            return;
        if (win.h < win.minH) {
            win.h = win.minH
        }
    };
    this._bringOnTop = function(win) {
        var cZIndex = win.zi;
        var topZIndex = this._getTopZIndex(win._isSticked);
        for (var a in this.wins) {
            if (this.wins[a] != win) {
                if (win._isSticked || (!win._isSticked && !this.wins[a]._isSticked)) {
                    if (this.wins[a].zi > cZIndex) {
                        this.wins[a].zi = this.wins[a].zi - this.zIndexStep;
                        this.wins[a].style.zIndex = this.wins[a].zi
                    }
                }
            }
        };
        win.zi = topZIndex;
        win.style.zIndex = win.zi
    };
    this._makeActive = function(win, ignoreFocusEvent) {
        for (var a in this.wins) {
            if (this.wins[a] == win) {
                var needEvent = false;
                if (this.wins[a].className != "dhtmlx_window_active" && !ignoreFocusEvent) {
                    needEvent = true
                };
                this.wins[a].className = "dhtmlx_window_active";
                this._engineUpdateWindowIcon(this.wins[a], this.wins[a].icons[0]);
                if (needEvent == true) {
                    if (win.checkEvent("onFocus")) {
                        win.callEvent("onFocus", [win])
                    } else {
                        this.callEvent("onFocus", [win])
                    }
                }
            } else {
                this.wins[a].className = "dhtmlx_window_inactive";
                this._engineUpdateWindowIcon(this.wins[a], this.wins[a].icons[1])
            }
        }
    };
    this._getActive = function() {
        var win = null;
        for (var a in this.wins) {
            if (this.wins[a].className == "dhtmlx_window_active") {
                win = this.wins[a]
            }
        };
        return win
    };
    this._centerWindow = function(win, onScreen) {
        if (win._isMaximized == true) {
            return
        };
        if (win._isParked == true) {
            return
        };
        if (onScreen == true) {
            var vpw = (_isIE ? document.body.offsetWidth : window.innerWidth);
            var vph = (_isIE ? document.body.offsetHeight : window.innerHeight)
        } else {
            var vpw = (this.vp == document.body ? document.body.offsetWidth : (Number(parseInt(this.vp.style.width)) && String(this.vp.style.width).search("%") == -1 ? parseInt(this.vp.style.width) : this.vp.offsetWidth));
            var vph = (this.vp == document.body ? document.body.offsetHeight : (Number(parseInt(this.vp.style.height)) && String(this.vp.style.height).search("%") == -1 ? parseInt(this.vp.style.height) : this.vp.offsetHeight))
        };
        var newX = Math.round((vpw / 2) - (win.w / 2));
        var newY = Math.round((vph / 2) - (win.h / 2));
        win.x = newX;
        win.y = newY;
        this._engineFixWindowPosInViewport(win);
        this._engineRedrawWindowPos(win)
    };
    this._addDefaultButtons = function(win) {
        var btnStick = this._engineGetWindowButton(win, "stick");
        btnStick.title = "Stick";
        btnStick.isVisible = false;
        btnStick.style.display = "none";
        btnStick._isEnabled = true;
        btnStick.isPressed = false;
        btnStick.label = "stick";
        btnStick._doOnClick = function() {
            this.isPressed = true;
            that._stickWindow(win)
        };
        var btnSticked = this._engineGetWindowButton(win, "sticked");
        btnSticked.title = "Unstick";
        btnSticked.isVisible = false;
        btnSticked.style.display = "none";
        btnSticked._isEnabled = true;
        btnSticked.isPressed = false;
        btnSticked.label = "sticked";
        btnSticked._doOnClick = function() {
            this.isPressed = false;
            that._unstickWindow(win)
        };
        var btnHelp = this._engineGetWindowButton(win, "help");
        btnHelp.title = "Help";
        btnHelp.isVisible = false;
        btnHelp.style.display = "none";
        btnHelp._isEnabled = true;
        btnHelp.isPressed = false;
        btnHelp.label = "help";
        btnHelp._doOnClick = function() {
            that._needHelp(win)
        };
        var btnPark = this._engineGetWindowButton(win, "park");
        btnPark.titleIfParked = "Park Down";
        btnPark.titleIfNotParked = "Park Up";
        btnPark.title = btnPark.titleIfNotParked;
        btnPark.isVisible = true;
        btnPark._isEnabled = true;
        btnPark.isPressed = false;
        btnPark.label = "park";
        btnPark._doOnClick = function() {
            that._parkWindow(win)
        };
        var btnMinMax1 = this._engineGetWindowButton(win, "minmax1");
        btnMinMax1.title = "Maximize";
        btnMinMax1.isVisible = true;
        btnMinMax1._isEnabled = true;
        btnMinMax1.isPressed = false;
        btnMinMax1.label = "minmax1";
        btnMinMax1._doOnClick = function() {
            that._maximizeWindow(win)
        };
        var btnMinMax2 = this._engineGetWindowButton(win, "minmax2");
        btnMinMax2.title = "Restore";
        btnMinMax2.isVisible = false;
        btnMinMax2.style.display = "none";
        btnMinMax2._isEnabled = true;
        btnMinMax2.isPressed = false;
        btnMinMax2.label = "minmax2";
        btnMinMax2._doOnClick = function() {
            that._restoreWindow(win)
        };
        var btnClose = this._engineGetWindowButton(win, "close");
        btnClose.title = "Close";
        btnClose.isVisible = true;
        btnClose._isEnabled = true;
        btnClose.isPressed = false;
        btnClose.label = "close";
        btnClose._doOnClick = function() {
            that._closeWindow(win)
        };
        var btnDock = this._engineGetWindowButton(win, "dock");
        btnDock.title = "Dock";
        btnDock.style.display = "none";
        btnDock.isVisible = false;
        btnDock._isEnabled = true;
        btnDock.isPressed = false;
        btnDock.label = "dock";
        btnDock._doOnClick = function() {
        };
        win._isSticked = false;
        win._isParked = false;
        win._isParkedAllowed = true;
        win._isMaximized = false;
        win._isDocked = false;
        win.btns = {};
        win.btns["stick"] = btnStick;
        win.btns["sticked"] = btnSticked;
        win.btns["help"] = btnHelp;
        win.btns["park"] = btnPark;
        win.btns["minmax1"] = btnMinMax1;
        win.btns["minmax2"] = btnMinMax2;
        win.btns["close"] = btnClose;
        win.btns["dock"] = btnDock;
        for (var a in win.btns) {
            this._attachEventsOnButton(win, win.btns[a])
        }
    };
    this._attachEventsOnButton = function(win, btn) {
        btn.onmouseover = function() {
            if (this._isEnabled) {
                this.className = "dhtmlx_wins_btns_button dhtmlx_button_" + this.label + "_over_" + (this.isPressed ? "pressed" : "default")
            } else {
                this.className = "dhtmlx_wins_btns_button dhtmlx_button_" + this.label + "_disabled"
            }
        };
        btn.onmouseout = function() {
            if (this._isEnabled) {
                this.isPressed = false;
                this.className = "dhtmlx_wins_btns_button dhtmlx_button_" + this.label + "_default"
            } else {
                this.className = "dhtmlx_wins_btns_button dhtmlx_button_" + this.label + "_disabled"
            }
        };
        btn.onmousedown = function() {
            if (this._isEnabled) {
                this.isPressed = true;
                this.className = "dhtmlx_wins_btns_button dhtmlx_button_" + this.label + "_over_pressed"
            } else {
                this.className = "dhtmlx_wins_btns_button dhtmlx_button_" + this.label + "_disabled"
            }
        };
        btn.onmouseup = function() {
            if (this._isEnabled) {
                var wasPressed = this.isPressed;
                this.isPressed = false;
                this.className = "dhtmlx_wins_btns_button dhtmlx_button_" + this.label + "_over_default";
                if (wasPressed) {
                    if (this.checkEvent("onClick")) {
                        this.callEvent("onClick", [win, this])
                    } else {
                        this._doOnClick()
                    }
                }
            } else {
                this.className = "dhtmlx_wins_btns_button dhtmlx_button_" + this.label + "_disabled"
            }
        };
        btn.show = function() {
            that._showButton(win, this.label)
        };
        btn.hide = function() {
            that._hideButton(win, this.label)
        };
        btn.enable = function() {
            that._enableButton(win, this.label)
        };
        btn.disable = function() {
            that._disableButton(win, this.label)
        };
        btn.isEnabled = function() {
            return this._isEnabled
        };
        btn.isHidden = function() {
            return (!this.isVisible)
        };
        dhtmlxEventable(btn)
    };
    this._parkWindow = function(win) {
        if (!win._isParkedAllowed)
            return;
        if (this.enableParkEffect && win.parkBusy)
            return;
        if (win._isParked) {
            if (this.enableParkEffect) {
                win.parkBusy = true;
                this._doParkDown(win)
            } else {
                win.h = win.lastParkH;
                this._engineRedrawWindowSize(win);
                this._engineDoOnWindowParkDown(win);
                win.updateNestedObjects();
                win.btns["park"].title = win.btns["park"].titleIfNotParked;
                if (win._allowResizeGlobal == true) {
                    this._enableButton(win, "minmax1");
                    this._enableButton(win, "minmax2")
                };
                win._isParked = false;
                if (win.checkEvent("onParkDown")) {
                    win.callEvent("onParkDown", [win])
                } else {
                    this.callEvent("onParkDown", [win])
                }
            }
        } else {
            if (this.enableParkEffect) {
                win.lastParkH = (String(win.h).search(/\%$/) == -1 ? win.h : win.offsetHeight);
                if (win._allowResizeGlobal == true) {
                    this._disableButton(win, "minmax1");
                    this._disableButton(win, "minmax2")
                };
                if (this.enableParkEffect) {
                    win.parkBusy = true;
                    this._doParkUp(win)
                } else {
                    var skinParams = (win._skinParams != null ? win._skinParams : this.skinParams[this.skin]);
                    win.h = skinParams["header_height"] + skinParams["border_bottom_height"];
                    win.btns["park"].title = win.btns["park"].titleIfParked
                }
            } else {
                win.lastParkH = (String(win.h).search(/\%$/) == -1 ? win.h : win.offsetHeight);
                win.h = this._engineGetWindowParkedHeight(win);
                this._engineRedrawWindowSize(win);
                this._engineDoOnWindowParkUp(win);
                win.btns["park"].title = win.btns["park"].titleIfParked;
                win._isParked = true;
                if (win.checkEvent("onParkUp")) {
                    win.callEvent("onParkUp", [win])
                } else {
                    this.callEvent("onParkUp", [win])
                }
            }
        }
    };
    this._allowParking = function(win) {
        win._isParkedAllowed = true;
        this._enableButton(win, "park")
    };
    this._denyParking = function(win) {
        win._isParkedAllowed = false;
        this._disableButton(win, "park")
    };
    this.enableParkEffect = false;
    this.parkStartSpeed = 80;
    this.parkSpeed = this.parkStartSpeed;
    this.parkTM = null;
    this.parkTMTime = 5;
    this._doParkUp = function(win) {
        if (String(win.h).search(/\%$/) != -1) {
            win.h = win.offsetHeight
        };
        win.h -= this.parkSpeed;
        var hh = this._engineGetWindowParkedHeight(win);
        if (win.h <= hh) {
            win.h = hh;
            this._engineGetWindowButton(win, "park").title = this._engineGetWindowButton(win, "park").titleIfParked;
            win._isParked = true;
            win.parkBusy = false;
            this._engineRedrawWindowSize(win);
            this._engineDoOnWindowParkUp(win);
            if (win.checkEvent("onParkUp")) {
                win.callEvent("onParkUp", [win])
            } else {
                this.callEvent("onParkUp", [win])
            }
        } else {
            this._engineRedrawWindowSize(win);
            this.parkTM = window.setTimeout(function() {
                        that._doParkUp(win)
                    }, this.parkTMTime)
        }
    };
    this._doParkDown = function(win) {
        win.h += this.parkSpeed;
        if (win.h >= win.lastParkH) {
            win.h = win.lastParkH;
            this._engineGetWindowButton(win, "park").title = this._engineGetWindowButton(win, "park").titleIfNotParked;
            if (win._allowResizeGlobal == true) {
                this._enableButton(win, "minmax1");
                this._enableButton(win, "minmax2")
            };
            win._isParked = false;
            win.parkBusy = false;
            this._engineRedrawWindowSize(win);
            win.updateNestedObjects();
            this._engineDoOnWindowParkDown(win);
            if (win.checkEvent("onParkDown")) {
                win.callEvent("onParkDown", [win])
            } else {
                this.callEvent("onParkDown", [win])
            }
        } else {
            this._engineRedrawWindowSize(win);
            this.parkTM = window.setTimeout(function() {
                        that._doParkDown(win)
                    }, this.parkTMTime)
        }
    };
    this._enableButton = function(win, btn) {
        var button = this._engineGetWindowButton(win, btn);
        if (!button)
            return;
        button._isEnabled = true;
        button.className = "dhtmlx_wins_btns_button dhtmlx_button_" + button.label + "_default"
    };
    this._disableButton = function(win, btn) {
        var button = this._engineGetWindowButton(win, btn);
        if (!button)
            return;
        button._isEnabled = false;
        button.className = "dhtmlx_wins_btns_button dhtmlx_button_" + win.btns[btn].label + "_disabled"
    };
    this._allowReszieGlob = function(win) {
        win._allowResizeGlobal = true;
        this._enableButton(win, "minmax1");
        this._enableButton(win, "minmax2")
    };
    this._denyResize = function(win) {
        win._allowResizeGlobal = false;
        this._disableButton(win, "minmax1");
        this._disableButton(win, "minmax2")
    };
    this._maximizeWindow = function(win) {
        if (win._allowResizeGlobal == false) {
            return
        };
        win.lastMaximizeX = win.x;
        win.lastMaximizeY = win.y;
        win.lastMaximizeW = win.w;
        win.lastMaximizeH = win.h;
        win.x = 0;
        win.y = 0;
        win._isMaximized = true;
        win._allowMove = false;
        win._allowResize = false;
        win.w = (win.maxW == "auto" ? (this.vp == document.body ? "100%" : (this.vp.style.width != "" && String(this.vp.style.width).search("%") == -1 ? parseInt(this.vp.style.width) : this.vp.offsetWidth)) : win.maxW);
        win.h = (win.maxH == "auto" ? (this.vp == document.body ? "100%" : (this.vp.style.height != "" && String(this.vp.style.width).search("%") == -1 ? parseInt(this.vp.style.height) : this.vp.offsetHeight)) : win.maxH);
        this._hideButton(win, "minmax1");
        this._showButton(win, "minmax2");
        this._engineRedrawWindowPos(win);
        this._engineRedrawWindowSize(win);
        win.updateNestedObjects();
        if (win.checkEvent("onMaximize")) {
            win.callEvent("onMaximize", [win])
        } else {
            this.callEvent("onMaximize", [win])
        }
    };
    this._restoreWindow = function(win) {
        if (win._allowResizeGlobal == false) {
            return
        };
        if (win.layout) {
            win.layout._defineWindowMinDimension(win)
        };
        win.x = win.lastMaximizeX;
        win.y = win.lastMaximizeY;
        win.w = win.lastMaximizeW;
        win.h = win.lastMaximizeH;
        win._isMaximized = false;
        win._allowMove = win._allowMoveGlobal;
        win._allowResize = true;
        this._fixWindowDimensionInViewport(win);
        this._hideButton(win, "minmax2");
        this._showButton(win, "minmax1");
        this._engineRedrawWindowPos(win);
        this._engineRedrawWindowSize(win);
        win.updateNestedObjects();
        if (win.checkEvent("onMinimize")) {
            win.callEvent("onMinimize", [win])
        } else {
            this.callEvent("onMinimize", [win])
        }
    };
    this._showButton = function(win, btn) {
        var button = this._engineGetWindowButton(win, btn);
        if (!button)
            return;
        button.isVisible = true;
        button.style.display = "";
        this._engineRedrawWindowTitle(win)
    };
    this._hideButton = function(win, btn) {
        var button = this._engineGetWindowButton(win, btn);
        if (!button)
            return;
        button.isVisible = false;
        button.style.display = "none";
        this._engineRedrawWindowTitle(win)
    };
    this._showWindow = function(win) {
        win.style.display = "";
        if (win.checkEvent("onShow")) {
            win.callEvent("onShow", [win])
        } else {
            this.callEvent("onShow", [win])
        };
        var w = this._getActive();
        if (w == null) {
            this._bringOnTop(win);
            this._makeActive(win)
        } else if (this._isWindowHidden(w)) {
            this._bringOnTop(win);
            this._makeActive(win)
        }
    };
    this._hideWindow = function(win) {
        win.style.display = "none";
        if (win.checkEvent("onHide")) {
            win.callEvent("onHide", [win])
        } else {
            this.callEvent("onHide", [win])
        };
        var w = this.getTopmostWindow(true);
        if (w != null) {
            this._bringOnTop(w);
            this._makeActive(w)
        }
    };
    this._isWindowHidden = function(win) {
        var isHidden = (win.style.display == "none");
        return isHidden
    };
    this._closeWindow = function(win) {
        if (this._focusFixIE) {
            this._focusFixIE.style.top = (this.vp == document.body ? 0 : getAbsoluteTop(this.vp)) + "px";
            this._focusFixIE.focus()
        };
        if (win.checkEvent("onClose")) {
            if (!win.callEvent("onClose", [win]))
                return
        } else {
            if (!this.callEvent("onClose", [win]))
                return
        };
        this._removeWindowGlobal(win);
        var latest = {
            "zi" : 0
        };
        for (var a in this.wins) {
            if (this.wins[a].zi > latest.zi) {
                latest = this.wins[a]
            }
        };
        if (latest != null) {
            this._makeActive(latest)
        }
    };
    this._needHelp = function(win) {
        if (win.checkEvent("onHelp")) {
            win.callEvent("onHelp", [win])
        } else {
            this.callEvent("onHelp", [win])
        }
    };
    this._setWindowIcon = function(win, iconEnabled, iconDisabled) {
        win.iconsPresent = true;
        win.icons[0] = this.imagePath + iconEnabled;
        win.icons[1] = this.imagePath + iconDisabled;
        this._engineUpdateWindowIcon(win, win.icons[win.isOnTop() ? 0 : 1])
    };
    this._getWindowIcon = function(win) {
        if (win.iconsPresent) {
            return new Array(win.icons[0], win.icons[1])
        } else {
            return new Array(null, null)
        }
    };
    this._clearWindowIcons = function(win) {
        win.iconsPresent = false;
        win.icons[0] = this.imagePath + this.pathPrefix + this.skin + "/active/icon_blank.gif";
        win.icons[1] = this.imagePath + this.pathPrefix + this.skin + "/inactive/icon_blank.gif";
        this._engineUpdateWindowIcon(win, win.icons[win.isOnTop() ? 0 : 1])
    };
    this._restoreWindowIcons = function(win) {
        win.iconsPresent = true;
        win.icons[0] = this.imagePath + this.pathPrefix + this.skin + "/active/icon_normal.gif";
        win.icons[1] = this.imagePath + this.pathPrefix + this.skin + "/inactive/icon_normal.gif";
        this._engineUpdateWindowIcon(win, win.icons[win.className == "dhtmlx_window_active" ? 0 : 1])
    };
    this._attachWindowContentTo = function(win, obj, w, h) {
        var data = this._engineGetWindowContent(win).parentNode;
        data.parentNode.removeChild(data);
        win.hide();
        data.style.left = "0px";
        data.style.top = "0px";
        data.style.width = (w != null ? w : obj.offsetWidth) + "px";
        data.style.height = (h != null ? h : obj.offsetHeight) + "px";
        data.style.position = "relative";
        obj.appendChild(data);
        this._engineGetWindowContent(win).style.width = data.style.width;
        this._engineGetWindowContent(win).style.height = data.style.height
    };
    this._setWindowToFullScreen = function(win, state) {
        if (state == true) {
            var data = win._content;
            data.parentNode.removeChild(data);
            win.hide();
            win._isFullScreened = true;
            data.style.left = "0px";
            data.style.top = "0px";
            data.style.width = document.body.offsetWidth - (_isIE ? 4 : 0) + "px";
            if (document.body.offsetHeight == 0) {
                if (window.innerHeight) {
                    data.style.height = window.innerHeight + "px"
                } else {
                    data.style.height = document.body.scrollHeight + "px"
                }
            } else {
                data.style.height = document.body.offsetHeight - (_isIE ? 4 : 0) + "px"
            };
            data.style.position = "absolute";
            document.body.appendChild(data)
        } else if (state == false) {
            var data = win.childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1];
            var base = win._content;
            document.body.removeChild(base);
            data.appendChild(base);
            win._isFullScreened = false;
            win.setDimension(win.w, win.h);
            win.show();
            win.bringToTop();
            win.center()
        };
        win.updateNestedObjects()
    };
    this._isWindowOnTop = function(win) {
        var state = (this.getTopmostWindow() == win);
        return state
    };
    this._bringOnBottom = function(win) {
        for (var a in this.wins) {
            if (this.wins[a].zi < win.zi) {
                this.wins[a].zi += this.zIndexStep;
                this.wins[a].style.zIndex = this.wins[a].zi
            }
        };
        win.zi = 50;
        win.style.zIndex = win.zi;
        this._makeActive(this.getTopmostWindow())
    };
    this._isWindowOnBottom = function(win) {
        var state = true;
        for (var a in this.wins) {
            if (this.wins[a] != win) {
                state = state && (this.wins[a].zi > win.zi)
            }
        };
        return state
    };
    this._stickWindow = function(win) {
        win._isSticked = true;
        this._hideButton(win, "stick");
        this._showButton(win, "sticked");
        this._bringOnTop(win)
    };
    this._unstickWindow = function(win) {
        win._isSticked = false;
        this._hideButton(win, "sticked");
        this._showButton(win, "stick");
        this._bringOnTopAnyStickedWindows()
    };
    this._addUserButton = function(win, id, pos, title) {
        var userButton = this._engineAddUserButton(win, id, pos);
        userButton.title = title;
        userButton.isVisible = true;
        userButton._isEnabled = true;
        userButton.isPressed = false;
        userButton.label = id;
        win.btns[id] = userButton;
        userButton._doOnClick = function() {
        };
        this._attachEventsOnButton(win, userButton)
    };
    this._removeUserButton = function(win, buttonId) {
        this._removeButtonGlobal(win, buttonId)
    };
    this._blockSwitcher = function(state) {
        for (var a in this.wins) {
            if (state == true) {
                this.wins[a].showCoverBlocker()
            } else {
                this.wins[a].hideCoverBlocker()
            }
        }
    };
    this.resizingWin = null;
    this.modalWin = null;
    this.resizingDirs = "none";
    if (_isIE) {
        this._focusFixIE = document.createElement("INPUT");
        this._focusFixIE.className = "dhx_windows_ieonclosefocusfix";
        document.body.appendChild(this._focusFixIE)
    };
    this._createViewport();
    this._doOnMouseUp = function() {
        if (that != null)
            that._stopMove()
    };
    this._doOnMoseMove = function(e) {
        e = e || event;
        if (that != null)
            that._moveWindow(e)
    };
    this._resizeTM = null;
    this._resizeTMTime = 200;
    this._doOnResize = function() {
        window.clearTimeout(that._resizeTM);
        that._resizeTM = window.setTimeout(function() {
                    that._autoResizeViewport()
                }, that._resizeTMTime)
    };
    this._doOnUnload = function() {
        that.unload()
    };
    this._doOnSelectStart = function(e) {
        e = e || event;
        if (that.movingWin != null || that.resizingWin != null)
            e.returnValue = false
    };
    if (_isIE) {
        document.body.attachEvent("onselectstart", this._doOnSelectStart)
    };
    dhtmlxEvent(window, "resize", this._doOnResize);
    dhtmlxEvent(document.body, "unload", this._doOnUnload);
    dhtmlxEvent(document.body, "mouseup", this._doOnMouseUp);
    dhtmlxEvent(this.vp, "mousemove", this._doOnMoseMove);
    dhtmlxEvent(this.vp, "mouseup", this._doOnMouseUp);
    this._setWindowModal = function(win, state) {
        if (state == true) {
            this._makeActive(win);
            this._bringOnTop(win);
            this.modalWin = win;
            win._isModal = true;
            this.modalCoverI.style.zIndex = win.zi - 2;
            this.modalCoverI.style.display = "";
            this.modalCoverD.style.zIndex = win.zi - 2;
            this.modalCoverD.style.display = ""
        } else {
            this.modalWin = null;
            win._isModal = false;
            this.modalCoverI.style.zIndex = 0;
            this.modalCoverI.style.display = "none";
            this.modalCoverD.style.zIndex = 0;
            this.modalCoverD.style.display = "none"
        }
    };
    this._bringOnTopAnyStickedWindows = function() {
        var wins = new Array();
        for (var a in this.wins) {
            if (this.wins[a]._isSticked) {
                wins[wins.length] = this.wins[a]
            }
        };
        for (var q = 0; q < wins.length; q++) {
            this._bringOnTop(wins[q])
        };
        if (wins.length == 0) {
            for (var a in this.wins) {
                if (this.wins[a].className == "dhtmlx_window_active") {
                    this._bringOnTop(this.wins[a])
                }
            }
        }
    };
    this.unload = function() {
        this._clearAll()
    };
    this._removeButtonGlobal = function(win, buttonId) {
        if (!win.btns[buttonId])
            return;
        var btn = win.btns[buttonId];
        btn.title = null;
        btn.isVisible = null;
        btn._isEnabled = null;
        btn.isPressed = null;
        btn.label = null;
        btn._doOnClick = null;
        btn.attachEvent = null;
        btn.callEvent = null;
        btn.checkEvent = null;
        btn.detachEvent = null;
        btn.disable = null;
        btn.enable = null;
        btn.eventCatcher = null;
        btn.hide = null;
        btn.isEnabled = null;
        btn.isHidden = null;
        btn.show = null;
        btn.onmousedown = null;
        btn.onmouseout = null;
        btn.onmouseover = null;
        btn.onmouseup = null;
        if (btn.parentNode)
            btn.parentNode.removeChild(btn);
        btn = null;
        win.btns[buttonId] = null
    };
    this._removeWindowGlobal = function(win) {
        if (this.modalWin == win)
            this._setWindowModal(win, false);
        var idd = win.idd;
        if (win._frame) {
            if (_isIE) {
                win._frame.onreadystatechange = null;
                win._frame.contentWindow.document.body.onmousedown = null;
                win._frame.onload = null
            } else {
                win._frame.contentWindow.onmousedown = null;
                win._frame.onload = null
            }
        };
        win.coverBlocker().onselectstart = null;
        win._dhxContDestruct();
        this._engineDiableOnSelectInWindow(win, false);
        this._engineGetWindowHeader(win).onmousedown = null;
        this._engineGetWindowHeader(win).ondblclick = null;
        this.movingWin = null;
        this.resizingWin = null;
        for (var a in win.btns)
            this._removeButtonGlobal(win, a);
        win.btns = null;
        win._adjustToContent = null;
        win._doOnAttachMenu = null;
        win._doOnAttachStatusBar = null;
        win._doOnAttachToolbar = null;
        win._doOnAttachURL = null;
        win._redraw = null;
        win.addUserButton = null;
        win.allowMove = null;
        win.allowPark = null;
        win.allowResize = null;
        win.attachEvent = null;
        win.bringToBottom = null;
        win.bringToTop = null;
        win.callEvent = null;
        win.center = null;
        win.centerOnScreen = null;
        win.checkEvent = null;
        win.clearIcon = null;
        win.close = null;
        win.denyMove = null;
        win.denyPark = null;
        win.denyResize = null;
        win.detachEvent = null;
        win.eventCatcher = null;
        win.getDimension = null;
        win.getIcon = null;
        win.getId = null;
        win.getMaxDimension = null;
        win.getMinDimension = null;
        win.getPosition = null;
        win.getText = null;
        win.hide = null;
        win.hideHeader = null;
        win.isHidden = null;
        win.isMaximized = null;
        win.isModal = null;
        win.isMovable = null;
        win.isOnBottom = null;
        win.isOnTop = null;
        win.isParkable = null;
        win.isParked = null;
        win.isResizable = null;
        win.isSticked = null;
        win.keepInViewport = null;
        win.maximize = null;
        win.minimize = null;
        win.park = null;
        win.progressOff = null;
        win.progressOn = null;
        win.removeUserButton = null;
        win.restoreIcon = null;
        win.setDimension = null;
        win.setIcon = null;
        win.setMaxDimension = null;
        win.setMinDimension = null;
        win.setModal = null;
        win.setPosition = null;
        win.setText = null;
        win.setToFullScreen = null;
        win.show = null;
        win.showHeader = null;
        win.stick = null;
        win.unstick = null;
        win.onmousemove = null;
        win.onmousedown = null;
        win.icons = null;
        win.button = null;
        win._dhxContDestruct = null;
        win.dhxContGlobal.obj = null;
        win.dhxContGlobal.setContent = null;
        win.dhxContGlobal.dhxcont = null;
        win.dhxContGlobal = null;
        if (win._frame) {
            while (win._frame.childNodes.length > 0)
                win._frame.removeChild(win._frame.childNodes[0]);
            win._frame = null
        };
        this._parseNestedForEvents(win);
        win._content = null;
        win.innerHTML = "";
        win.parentNode.removeChild(win);
        win = null;
        this.wins[idd] = null;
        delete this.wins[idd];
        idd = null
    };
    this._removeEvents = function(obj) {
        obj.onmouseover = null;
        obj.onmouseout = null;
        obj.onmousemove = null;
        obj.onclick = null;
        obj.ondblclick = null;
        obj.onmouseenter = null;
        obj.onmouseleave = null;
        obj.onmouseup = null;
        obj.onmousewheel = null;
        obj.onmousedown = null;
        obj.onselectstart = null;
        obj.onfocus = null;
        obj.style.display = ""
    };
    this._parseNestedForEvents = function(obj) {
        this._removeEvents(obj);
        for (var q = 0; q < obj.childNodes.length; q++) {
            if (obj.childNodes[q].tagName != null) {
                this._parseNestedForEvents(obj.childNodes[q])
            }
        }
    };
    this._clearAll = function() {
        this._clearDocumentEvents();
        for (var a in this.wins)
            this._removeWindowGlobal(this.wins[a]);
        this.wins = null;
        this._parseNestedForEvents(this._carcass);
        while (this._carcass.childNodes.length > 0)
            this._carcass.removeChild(this._carcass.childNodes[0]);
        this._carcass.onselectstart = null;
        this._carcass.parentNode.removeChild(this._carcass);
        this._carcass = null;
        this._parseNestedForEvents(this._vpcover);
        this._vpcover.parentNode.removeChild(this._vpcover);
        this._vpcover = null;
        this._parseNestedForEvents(this.modalCoverD);
        this.modalCoverD.parentNode.removeChild(this.modalCoverD);
        this.modalCoverD = null;
        this._parseNestedForEvents(this.modalCoverI);
        this.modalCoverI.parentNode.removeChild(this.modalCoverI);
        this.modalCoverI = null;
        if (this.vp.autocreated == true)
            this.vp.parentNode.removeChild(this.vp);
        this.vp = null;
        for (var a in this.skinParams) {
            delete this.skinParams[a]
        };
        this.skinParams = null;
        this._effects = null;
        this._engineSkinParams = null;
        wins = null;
        this._addDefaultButtons = null;
        this._addUserButton = null;
        this._allowParking = null;
        this._allowReszieGlob = null;
        this._attachEventsOnButton = null;
        this._attachWindowContentTo = null;
        this._autoResizeViewport = null;
        this._blockSwitcher = null;
        this._bringOnBottom = null;
        this._bringOnTop = null;
        this._bringOnTopAnyStickedWindows = null;
        this._centerWindow = null;
        this._clearAll = null;
        this._clearDocumentEvents = null;
        this._clearWindowIcons = null;
        this._closeWindow = null;
        this._createViewport = null;
        this._denyParking = null;
        this._denyResize = null;
        this._dhx_Engine = null;
        this._disableButton = null;
        this._doOnMoseMove = null;
        this._doOnMouseUp = null;
        this._doOnResize = null;
        this._doOnSelectStart = null;
        this._doOnUnload = null;
        this._doParkDown = null;
        this._doParkUp = null;
        this._enableButton = null;
        this._engineAddUserButton = null;
        this._engineAdjustWindowToContent = null;
        this._engineAllowWindowResize = null;
        this._engineCheckHeaderMouseDown = null;
        this._engineDiableOnSelectInWindow = null;
        this._engineDoOnWindowParkDown = null;
        this._engineDoOnWindowParkUp = null;
        this._engineFixWindowPosInViewport = null;
        this._engineGetWindowButton = null;
        this._engineGetWindowContent = null;
        this._engineGetWindowHeader = null;
        this._engineGetWindowHeaderState = null;
        this._engineGetWindowLabel = null;
        this._engineGetWindowParkedHeight = null;
        this._engineRedrawSkin = null;
        this._engineRedrawWindowPos = null;
        this._engineRedrawWindowSize = null;
        this._engineRedrawWindowTitle = null;
        this._engineSetWindowBody = null;
        this._engineSwitchWindowHeader = null;
        this._engineSwitchWindowProgress = null;
        this._engineUpdateWindowIcon = null;
        this._fixWindowDimensionInViewport = null;
        this._genStr = null;
        this._getActive = null;
        this._getTopZIndex = null;
        this._getWindowIcon = null;
        this._hideButton = null;
        this._hideWindow = null;
        this._isWindowHidden = null;
        this._isWindowOnBottom = null;
        this._isWindowOnTop = null;
        this._makeActive = null;
        this._maximizeWindow = null;
        this._moveWindow = null;
        this._needHelp = null;
        this._parkWindow = null;
        this._parseNestedForEvents = null;
        this._removeButtonGlobal = null;
        this._removeEvents = null;
        this._removeUserButton = null;
        this._removeWindowGlobal = null;
        this._restoreWindow = null;
        this._restoreWindowIcons = null;
        this._setWindowIcon = null;
        this._setWindowModal = null;
        this._setWindowToFullScreen = null;
        this._showButton = null;
        this._showWindow = null;
        this._stickWindow = null;
        this._stopMove = null;
        this._unstickWindow = null;
        this.attachEvent = null;
        this.attachViewportTo = null;
        this.callEvent = null;
        this.checkEvent = null;
        this.createWindow = null;
        this.detachEvent = null;
        this.enableAutoViewport = null;
        this.eventCatcher = null;
        this.findByText = null;
        this.forEachWindow = null;
        this.getBottommostWindow = null;
        this.getEffect = null;
        this.getTopmostWindow = null;
        this.isWindow = null;
        this.setEffect = null;
        this.setImagePath = null;
        this.setSkin = null;
        this.setViewport = null;
        this.unload = null;
        this.window = null;
        that = null
    };
    this._clearDocumentEvents = function() {
        if (_isIE) {
            window.detachEvent("onresize", this._doOnResize);
            document.body.detachEvent("onselectstart", this._doOnSelectStart);
            document.body.detachEvent("onmouseup", this._doOnMouseUp);
            document.body.detachEvent("onunload", this._doOnUnload);
            this.vp.detachEvent("onmousemove", this._doOnMoseMove);
            this.vp.detachEvent("onmouseup", this._doOnMouseUp)
        } else {
            window.removeEventListener("resize", this._doOnResize, false);
            document.body.removeEventListener("mouseup", this._doOnMouseUp, false);
            document.body.removeEventListener("unload", this._doOnUnload, false);
            this.vp.removeEventListener("mousemove", this._doOnMoseMove, false);
            this.vp.removeEventListener("mouseup", this._doOnMouseUp, false)
        }
    };
    if (this._enableStatusBar != null) {
        this._enableStatusBar()
    };
    if (this._enableWebMenu != null) {
        this._enableWebMenu()
    };
    if (this._enableWebToolbar != null) {
        this._enableWebToolbar()
    };
    this._genStr = function(w) {
        var s = "";
        var z = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        for (var q = 0; q < w; q++) {
            s = s + z.charAt(Math.round(Math.random() * z.length))
        };
        return s
    };
    dhtmlxEventable(this);
    return this
};
dhtmlXWindows.prototype._dhx_Engine = function() {
    this._engineEnabled = true;
    this._engineName = "dhx";
    this._engineSkinParams = {
        "dhx_blue" : {
            "hh" : 21,
            "lbw" : 2,
            "rbw" : 2,
            "lch" : 2,
            "lcw" : 14,
            "rch" : 14,
            "rcw" : 14,
            "bbh" : 2,
            "mnh" : 23,
            "tbh" : 25,
            "sbh" : 20
        },
        "dhx_black" : {
            "hh" : 21,
            "lbw" : 2,
            "rbw" : 2,
            "lch" : 2,
            "lcw" : 14,
            "rch" : 14,
            "rcw" : 14,
            "bbh" : 2,
            "mnh" : 23,
            "tbh" : 25,
            "sbh" : 20
        },
        "dhx_skyblue" : {
            "hh" : 29,
            "lbw" : 2,
            "rbw" : 2,
            "lch" : 2,
            "lcw" : 14,
            "rch" : 14,
            "rcw" : 14,
            "bbh" : 2,
            "mnh" : 23,
            "tbh" : 25,
            "sbh" : 20
        }
    };
    this._engineSetWindowBody = function(win) {
        win.innerHTML = "<div iswin='1' class='dhtmlx_wins_body_outer'>" + (_isIE ? "<iframe frameborder='0' class='dhtmlx_wins_ie6_cover_fix' onload='this.contentWindow.document.body.style.overflow=\"hidden\";'></iframe>" : "") + "<div class='dhtmlx_wins_icon'></div>" + "<div class='dhtmlx_wins_progress'></div>" + "<div class='dhtmlx_wins_title'>dhtmlxWindow</div>" + "<div class='dhtmlx_wins_btns'>" + "<div class='dhtmlx_wins_btns_button dhtmlx_button_dock_default'></div>" + "<div class='dhtmlx_wins_btns_button dhtmlx_button_close_default'></div>" + "<div class='dhtmlx_wins_btns_button dhtmlx_button_minmax1_default'></div>" + "<div class='dhtmlx_wins_btns_button dhtmlx_button_minmax2_default'></div>" + "<div class='dhtmlx_wins_btns_button dhtmlx_button_park_default'></div>"
                + "<div class='dhtmlx_wins_btns_button dhtmlx_button_help_default'></div>" + "<div class='dhtmlx_wins_btns_button dhtmlx_button_stick_default'></div>" + "<div class='dhtmlx_wins_btns_button dhtmlx_button_sticked_default'></div>" + "</div>" + "<div class='dhtmlx_wins_body_inner'></div>" + "<div winResT='yes' class='dhtmlx_wins_resizer_t' style='display:none;'></div>" + "<div winResL='yes' class='dhtmlx_wins_resizer_l'></div>" + "<div winResR='yes' class='dhtmlx_wins_resizer_r'></div>" + "<div winResB='yes' class='dhtmlx_wins_resizer_b'></div>" + "<div class='white_line'></div>" + "<div class='white_line2'></div>" + "</div>";
        win.dhxContGlobal = new dhtmlXContainer(win);
        if (this.skin == "dhx_skyblue") {
            win.dhxContGlobal.obj._offsetWidth = -10;
            win.dhxContGlobal.obj._offsetHeight = -5;
            win.dhxContGlobal.obj._offsetLeft = 5
        };
        win.skin = this.skin;
        win.dhxContGlobal.setContent(win.childNodes[0].childNodes[(_isIE ? 5 : 4)]);
        win.coverBlocker().onselectstart = function(e) {
            e = e || event;
            e.returnValue = false;
            e.cancelBubble = true
        }
    };
    this._engineDiableOnSelectInWindow = function(win, state) {
        var data = new Array();
        data[0] = win.childNodes[0].childNodes[(_isIE ? 1 : 0)];
        data[1] = win.childNodes[0].childNodes[(_isIE ? 2 : 1)];
        data[2] = win.childNodes[0].childNodes[(_isIE ? 3 : 2)];
        data[3] = win.childNodes[0].childNodes[(_isIE ? 4 : 3)];
        data[4] = win.childNodes[0].childNodes[(_isIE ? 6 : 5)];
        data[5] = win.childNodes[0].childNodes[(_isIE ? 7 : 6)];
        data[6] = win.childNodes[0].childNodes[(_isIE ? 8 : 7)];
        data[7] = win.childNodes[0].childNodes[(_isIE ? 9 : 8)];
        for (var q = 0; q < data.length; q++) {
            data[q].onselectstart = (state ? function(e) {
                e = e || event;
                e.returnValue = false;
                return false
            } : null)
        }
    };
    this._engineGetWindowHeader = function(win) {
        win.childNodes[0].idd = win.idd;
        return win.childNodes[0]
    };
    this._engineRedrawWindowSize = function(win) {
        win.style.width = (String(win.w).search("%") == -1 ? win.w + "px" : win.w);
        win.style.height = (String(win.h).search("%") == -1 ? win.h + "px" : win.h);
        var body = win.childNodes[0];
        body.style.width = win.clientWidth + "px";
        body.style.height = win.clientHeight + "px";
        if (body.offsetWidth > win.clientWidth) {
            body.style.width = win.clientWidth * 2 - body.offsetWidth + "px"
        };
        if (body.offsetHeight > win.clientHeight) {
            var px = win.clientHeight * 2 - body.offsetHeight;
            if (px < 0)
                px = 0;
            body.style.height = px + "px"
        };
        var hh = (win._noHeader == true ? win._hdrSize : this._engineSkinParams[this.skin]["hh"]);
        this._engineRedrawWindowTitle(win);
        win.adjustContent(body, hh)
    };
    this._engineRedrawWindowPos = function(win) {
        if (win._isFullScreened)
            return;
        win.style.left = win.x + "px";
        win.style.top = win.y + "px"
    };
    this._engineFixWindowPosInViewport = function(win) {
        var hh = (win._noHeader == true ? win._hdrSize : this._engineSkinParams[this.skin]["hh"]);
        if (win._keepInViewport) {
            if (win.x < 0) {
                win.x = 0
            };
            if (win.x + win.w > this.vp.offsetWidth) {
                win.x = this.vp.offsetWidth - win.w
            };
            if (win.y + win.h > this.vp.offsetHeight) {
                win.y = this.vp.offsetHeight - win.h
            };
            if (win.y < 0) {
                win.y = 0
            }
        } else {
            if (win.y + hh > this.vp.offsetHeight) {
                win.y = this.vp.offsetHeight - hh
            };
            if (win.y < 0) {
                win.y = 0
            };
            if (win.x + win.w - 10 < 0) {
                win.x = 10 - win.w
            };
            if (win.x > this.vp.offsetWidth - 10) {
                win.x = this.vp.offsetWidth - 10
            }
        }
    };
    this._engineCheckHeaderMouseDown = function(win, ev) {
        var x = (_isIE || _isOpera ? ev.offsetX : ev.layerX);
        var y = (_isIE || _isOpera ? ev.offsetY : ev.layerY);
        var obj = ev.target || ev.srcElement;
        var hh = (win._noHeader == true ? win._hdrSize : this._engineSkinParams[this.skin]["hh"]);
        if (y <= hh && (obj == win.childNodes[0] || obj == win.childNodes[0].childNodes[(_isIE ? 1 : 0)] || obj == win.childNodes[0].childNodes[(_isIE ? 3 : 2)] || obj == win.childNodes[0].childNodes[(_isIE ? 4 : 3)]))
            return true;
        return false
    };
    this._engineGetWindowContent = function(win) {
        alert("_engineGetWindowContent")
    };
    this._engineGetWindowButton = function(win, buttonName) {
        var buttonObj = null;
        var buttonStyle = "dhtmlx_button_" + String(buttonName).toLowerCase() + "_";
        for (var q = 0; q < win.childNodes[0].childNodes[(_isIE ? 4 : 3)].childNodes.length; q++) {
            var buttonTemp = win.childNodes[0].childNodes[(_isIE ? 4 : 3)].childNodes[q];
            if (String(buttonTemp.className).search(buttonStyle) != -1) {
                buttonObj = buttonTemp
            }
        };
        return buttonObj
    };
    this._engineAddUserButton = function(win, buttonName, buttonPos) {
        if (isNaN(buttonPos))
            buttonPos = 0;
        var button = document.createElement("DIV");
        button.className = "dhtmlx_wins_btns_button dhtmlx_button_" + buttonName + "_default";
        var buttonPoly = win.childNodes[0].childNodes[(_isIE ? 4 : 3)];
        buttonPos = buttonPoly.childNodes.length - buttonPos;
        if (buttonPos < 0)
            buttonPos = 0;
        if (buttonPos >= buttonPoly.childNodes.length) {
            buttonPoly.appendChild(button)
        } else {
            buttonPoly.insertBefore(button, buttonPoly.childNodes[buttonPos])
        };
        this._engineRedrawWindowTitle(win);
        return button
    };
    this._engineGetWindowParkedHeight = function(win) {
        return this._engineSkinParams[this.skin]["hh"] + 1
    };
    this._engineDoOnWindowParkDown = function(win) {
        win.childNodes[0].childNodes[(_isIE ? 6 : 5)].style.display = (win._noHeader == true ? "" : "none");
        win.childNodes[0].childNodes[(_isIE ? 7 : 6)].style.display = "";
        win.childNodes[0].childNodes[(_isIE ? 8 : 7)].style.display = "";
        win.childNodes[0].childNodes[(_isIE ? 9 : 8)].style.display = ""
    };
    this._engineDoOnWindowParkUp = function(win) {
        win.childNodes[0].childNodes[(_isIE ? 6 : 5)].style.display = "none";
        win.childNodes[0].childNodes[(_isIE ? 7 : 6)].style.display = "none";
        win.childNodes[0].childNodes[(_isIE ? 8 : 7)].style.display = "none";
        win.childNodes[0].childNodes[(_isIE ? 9 : 8)].style.display = "none"
    };
    this._engineUpdateWindowIcon = function(win, icon) {
        win.childNodes[0].childNodes[(_isIE ? 1 : 0)].style.backgroundImage = "url('" + icon + "')"
    };
    this._engineAllowWindowResize = function(win, targetObj, mouseX, mouseY) {
        var sk = this._engineSkinParams[this.skin];
        var hh = (win._noHeader == true ? win._hdrSize : this._engineSkinParams[this.skin]["hh"]);
        if (targetObj.getAttribute("winResL") != null) {
            if (targetObj.getAttribute("winResL") == "yes") {
                if (mouseY >= hh) {
                    if (mouseY >= win.h - sk["lch"])
                        return "corner_left";
                    if (mouseY <= sk["lch"] && win._noHeader == true)
                        return "corner_up_left";
                    return "border_left"
                }
            }
        };
        if (targetObj.getAttribute("winResR") != null) {
            if (targetObj.getAttribute("winResR") == "yes") {
                if (mouseY >= hh) {
                    if (mouseY >= win.h - sk["rch"])
                        return "corner_right";
                    if (mouseY <= sk["rch"] && win._noHeader == true)
                        return "corner_up_right";
                    return "border_right"
                }
            }
        };
        if (targetObj.getAttribute("winResT") != null) {
            if (targetObj.getAttribute("winResT") == "yes" && win._noHeader == true) {
                if (mouseX <= sk["lcw"])
                    return "corner_up_left";
                if (mouseX >= win.w - sk["rcw"])
                    return "corner_up_right";
                return "border_top"
            }
        };
        if (targetObj.getAttribute("winResB") != null) {
            if (targetObj.getAttribute("winResB") == "yes") {
                if (mouseX <= sk["lcw"])
                    return "corner_left";
                if (mouseX >= win.w - sk["rcw"])
                    return "corner_right";
                return "border_bottom"
            }
        };
        return null
    };
    this._engineAdjustWindowToContent = function(win, w, h) {
        var newW = w + win.w - win.dhxcont.clientWidth;
        var newH = h + win.h - win.dhxcont.clientHeight;
        win.setDimension(newW, newH)
    };
    this._engineRedrawSkin = function() {
        this.vp.className = "dhtmlx_winviewport dhtmlx_skin_" + this.skin;
        for (var a in this.wins) {
            if (this.skin == "dhx_skyblue") {
                this.wins[a].dhxContGlobal.obj._offsetWidth = -2;
                this.wins[a].dhxContGlobal.obj._offsetHeight = (this.wins[a]._noHeader ? -2 : -1);
                this.wins[a].dhxContGlobal.obj._offsetLeft = 1;
                this.wins[a].dhxContGlobal.obj._offsetTop = (this.wins[a]._noHeader ? 1 : null)
            } else {
                this.wins[a].dhxContGlobal.obj._offsetWidth = null;
                this.wins[a].dhxContGlobal.obj._offsetHeight = null;
                this.wins[a].dhxContGlobal.obj._offsetLeft = null;
                this.wins[a].dhxContGlobal.obj._offsetTop = null
            };
            this.wins[a].skin = this.skin;
            this._restoreWindowIcons(this.wins[a]);
            this._engineRedrawWindowSize(this.wins[a])
        }
    };
    this._engineSwitchWindowProgress = function(win, state) {
        if (state == true) {
            win.childNodes[0].childNodes[(_isIE ? 1 : 0)].style.display = "none";
            win.childNodes[0].childNodes[(_isIE ? 2 : 1)].style.display = ""
        } else {
            win.childNodes[0].childNodes[(_isIE ? 2 : 1)].style.display = "none";
            win.childNodes[0].childNodes[(_isIE ? 1 : 0)].style.display = ""
        }
    };
    this._engineSwitchWindowHeader = function(win, state) {
        win._noHeader = (state == true ? false : true);
        win._hdrSize = 0;
        win.childNodes[0].childNodes[(_isIE ? 5 : 4)].className = "dhtmlx_wins_body_inner" + (win._noHeader ? " dhtmlx_wins_no_header" : "");
        win.childNodes[0].childNodes[(_isIE ? 6 : 5)].style.display = (win._noHeader ? "" : "none");
        win.childNodes[0].childNodes[(_isIE ? 1 : 0)].style.display = (win._noHeader ? "none" : "");
        if (win._noHeader && this.skin == "dhx_skyblue") {
            win.dhxContGlobal.obj._offsetHeight = -2;
            win.dhxContGlobal.obj._offsetTop = 1
        } else {
            win.dhxContGlobal.obj._offsetHeight = -1;
            win.dhxContGlobal.obj._offsetTop = null
        };
        this._engineRedrawWindowSize(win)
    };
    this._engineGetWindowHeaderState = function(win) {
        return (win._noHeader ? true : false)
    };
    this._engineGetWindowLabel = function(win) {
        return win.childNodes[0].childNodes[(_isIE ? 3 : 2)]
    };
    this._engineRedrawWindowTitle = function(win) {
        if (win._noHeader !== true) {
            var p1 = win.childNodes[0].childNodes[(_isIE ? 3 : 2)].offsetLeft;
            var p2 = win.childNodes[0].childNodes[(_isIE ? 4 : 3)].offsetWidth;
            var newW = win.offsetWidth - p1 - p2 - 16;
            if (newW < 0) {
                newW = "100%"
            } else {
                newW += "px"
            };
            win.childNodes[0].childNodes[(_isIE ? 3 : 2)].style.width = newW
        }
    }
};
(function() {
    dhtmlx.extend_api("dhtmlXWindows", {
                _init : function(obj) {
                    return []
                },
                _patch : function(obj) {
                    obj.old_createWindow = obj.createWindow;
                    obj.createWindow = function(obj) {
                        if (arguments.length > 1)
                            return this.old_createWindow.apply(this, arguments);
                        var res = this.old_createWindow(obj.id, obj.x, obj.y, obj.width, obj.height);
                        res.allowMoveA = function(mode) {
                            if (mode)
                                this.allowMove();
                            else
                                this.denyMove()
                        };
                        res.allowParkA = function(mode) {
                            if (mode)
                                this.allowPark();
                            else
                                this.denyPark()
                        };
                        res.allowResizeA = function(mode) {
                            if (mode)
                                this.allowResize();
                            else
                                this.denyResize()
                        };
                        for (var a in obj) {
                            if (map[a])
                                res[map[a]](obj[a]);
                            else if (a.indexOf("on") == 0) {
                                res.attachEvent(a, obj[a])
                            }
                        };
                        return res
                    }
                },
                animation : "setEffect",
                image_path : "setImagePath",
                skin : "setSkin",
                viewport : "_viewport",
                wins : "_wins"
            }, {
                _viewport : function(data) {
                    if (data.object) {
                        this.enableAutoViewport(false);
                        this.attachViewportTo(data.object)
                    } else {
                        this.enableAutoViewport(false);
                        this.setViewport(data.left, data.top, data.width, data.height, data.parent)
                    }
                },
                _wins : function(arr) {
                    for (var q = 0; q < arr.length; q++) {
                        var win = arr[q];
                        this.createWindow(win.id, win.left, win.top, win.width, win.height);
                        if (win.text)
                            this.window(win.id).setText(win.text);
                        if (win.keep_in_viewport)
                            this.window(win.id).keepInViewport(true);
                        if (win.deny_resize)
                            this.window(win.id).denyResize();
                        if (win.deny_park)
                            this.window(win.id).denyPark();
                        if (win.deny_move)
                            this.window(win.id).denyMove()
                    }
                }
            });
    var map = {
        move : "allowMoveA",
        park : "allowParkA",
        resize : "allowResizeA",
        center : "center",
        modal : "setModal",
        caption : "setText",
        header : "showHeader"
    }
})();