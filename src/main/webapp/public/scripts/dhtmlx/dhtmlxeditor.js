

function dhtmlXEditor(base, skin) {
    var that = this;
    this.skin = (skin || dhtmlx.skin || "dhx_skyblue");
    this.iconsPath = dhtmlx.image_path || "../../codebase/imgs/";
    if (typeof(base) == "string")
        base = document.getElementById(base);
    this.base = base;
    while (this.base.childNodes.length > 0)
        this.base.removeChild(this.base.childNodes[0]);
    this._isToolbar = (this.initDhtmlxToolbar != null && window.dhtmlXToolbarObject != null ? true : false);
    if (!this._isToolbar) {
        this.tbData = "<div class='dhxeditor_" + this.skin + "_btns'>" + "<a href='javascript:void(0);' onclick='return false;' nomousedown='return false;'><div cmd='applyBold' class='dhxeditor_" + this.skin + "_tbbtn btn_bold'></div></a>" + "<a href='javascript:void(0);' onclick='return false;' nomousedown='return false;'><div cmd='applyItalic' class='dhxeditor_" + this.skin + "_tbbtn btn_italic'></div></a>" + "<a href='javascript:void(0);' onclick='return false;' nomousedown='return false;'><div cmd='applyUnderscore' class='dhxeditor_" + this.skin + "_tbbtn btn_underline'></div></a>" + "<a href='javascript:void(0);' onclick='return false;' nomousedown='return false;'><div cmd='clearFormatting' class='dhxeditor_" + this.skin + "_tbbtn btn_clearformat'></div></a>"
                + "<div class='verline_l'></div><div class='verline_r'></div>" + "</div>"
    } else {
        this.tbData = ""
    };
    var pos = (_isIE ? this.base.currentStyle["position"] : window.getComputedStyle(this.base, null).getPropertyValue("position"));
    if (!(pos == "relative" || pos == "absolute"))
        this.base.style.position = "relative";
    this.base.innerHTML = this.tbData + "<div style='position:absolute;width: 100%;overflow: hidden;'></div>";
    var dhxCont = new dhtmlXContainerLite(this.base);
    dhxCont.setContent(this.base.childNodes[(this._isToolbar ? 0 : 1)]);
    var ofs = (this._isToolbar ? 0 : this.base.childNodes[0].offsetHeight);
    this.base.adjustContent(this.base, ofs);
    this.editor = document.createElement("IFRAME");
    this.editor.className = "dhxeditor_mainiframe_" + this.skin;
    this.editor.frameBorder = 0;
    if (_isOpera)
        this.editor.scrolling = "yes";
    this.base.attachObject(this.editor);
    this.edWin = this.editor.contentWindow;
    this.edDoc = this.edWin.document;
    this._prepareContent = function(saveContent) {
        var storedContent = "";
        if (saveContent === true && this.getContent != null)
            storedContent = this.getContent();
        var content = this.edDoc;
        content.open("text/html", "replace");
        if (_isOpera) {
            content.write("<html><head><style> html, body {overflow:auto;padding:0px;padding-left:1px !important;height:100%;margin:0px;font-family:Tahoma;font-size:10pt;background-color:#ffffff};</style></head><body contenteditable='true'></body></html>")
        } else {
            if (window._KHTMLrv) {
                content.write("<html><head><style> html {overflow-x: auto;overflow-y: auto};body {overflow: auto;overflow-y: scroll};html,body {padding:0px;padding-left:1px !important;height:100%;margin:0px;font-family:Tahoma;font-size:10pt;background-color:#ffffff};</style></head><body contenteditable='true'></body></html>")
            } else {
                content.write("<html><head><style> html,body {overflow-x: auto;overflow-y: scroll;padding:0px;padding-left:1px !important;height:100%;margin:0px;font-family:Tahoma;font-size:10pt;background-color:#ffffff};</style></head><body contenteditable='true'></body></html>")
            }
        };
        content.close();
        this.edDoc.designMode = 'On';
        if (_isFF)
            try {
                this.edDoc.execCommand("useCSS", false, true)
            } catch (e) {
            };
        if (saveContent === true && this.setContent != null)
            this.setContent(storedContent)
    };
    this._prepareContent();
    this.setIconsPath = function() {
    };
    this.init = function() {
    };
    this.setSizes = function() {
        var ofs = (this._isToolbar ? 0 : this.base.childNodes[0].offsetHeight);
        this.base.adjustContent(this.base, ofs)
    };
    this._resizeTM = null;
    this._resizeTMTime = 100;
    this._doOnResize = function() {
        window.clearTimeout(that._resizeTM);
        that._resizeTM = window.setTimeout(function() {
                    if (that.setSizes)
                        that.setSizes()
                }, that._resizeTMTime)
    };
    this._doOnUnload = function() {
        window.detachEvent("onresize", this._doOnResize);
        window.removeEventListener("resize", this._doOnResize, false)
    };
    dhtmlxEvent(window, "resize", this._doOnResize);
    this.base.childNodes[0].onselectstart = function(e) {
        e = e || event;
        e.cancelBubble = true;
        e.returnValue = false;
        if (e.preventDefault)
            e.preventDefault();
        return false
    };
    for (var q = 0; q < this.base.childNodes[0].childNodes.length - 2; q++) {
        this.base.childNodes[0].childNodes[q].childNodes[0].onmousedown = function(e) {
            that[this.getAttribute("cmd")]();
            return false
        };
        this.base.childNodes[0].childNodes[q].childNodes[0].onclick = function(e) {
            return false
        }
    };
    this.runCommand = function(name, param) {
        if (arguments.length < 2)
            param = null;
        this.edDoc.execCommand(name, false, param);
        if (_isIE)
            this.edWin.focus()
    };
    this.applyBold = function() {
        this.runCommand("Bold")
    };
    this.applyItalic = function() {
        this.runCommand("Italic")
    };
    this.applyUnderscore = function() {
        this.runCommand("Underline")
    };
    this.clearFormatting = function() {
        this.runCommand("RemoveFormat")
    };
    if (this._isToolbar)
        this.initDhtmlxToolbar();
    dhtmlxEventable(this);
    dhtmlxEvent(this.edDoc, "click", function(e) {
                var ev = e || window.event;
                var el = ev.target || ev.srcElement;
                that.showInfo(el)
            });
    if (_isOpera) {
        dhtmlxEvent(this.edDoc, "mousedown", function(e) {
                    var ev = e || window.event;
                    var el = ev.target || ev.srcElement;
                    that.showInfo(el)
                })
    };
    dhtmlxEvent(this.edDoc, "keyup", function(e) {
                var ev = e || window.event;
                var key = ev.keyCode;
                var el = ev.target || ev.srcElement;
                if ((key == 37) || (key == 38) || (key == 39) || (key == 40) || (key == 13))
                    that.showInfo(el)
            });
    var that = this;
    this.attachEvent("onFocusChanged", function(state) {
                if (that._doOnFocusChanged)
                    that._doOnFocusChanged(state)
            });
    this.showInfo = function(el) {
        var el = (this.getSelectionBounds().root) ? this.getSelectionBounds().root : el;
        if (!el)
            return;
        try {
            if (this.edWin.getComputedStyle) {
                var st = this.edWin.getComputedStyle(el, null);
                var fw = ((st.getPropertyValue("font-weight") == 401) ? 700 : st.getPropertyValue("font-weight"));
                this.style = {
                    fontStyle : st.getPropertyValue("font-style"),
                    fontSize : st.getPropertyValue("font-size"),
                    textDecoration : st.getPropertyValue("text-decoration"),
                    fontWeight : fw,
                    fontFamily : st.getPropertyValue("font-family"),
                    textAlign : st.getPropertyValue("text-align")
                };
                if (window._KHTMLrv) {
                    this.style.fontStyle = st.getPropertyValue("font-style");
                    this.style.vAlign = st.getPropertyValue("vertical-align");
                    this.style.del = this.isStyleProperty(el, "span", "textDecoration", "line-through");
                    this.style.u = this.isStyleProperty(el, "span", "textDecoration", "underline")
                }
            } else {
                var st = el.currentStyle;
                this.style = {
                    fontStyle : st.fontStyle,
                    fontSize : st.fontSize,
                    textDecoration : st.textDecoration,
                    fontWeight : st.fontWeight,
                    fontFamily : st.fontFamily,
                    textAlign : st.textAlign
                }
            };
            this.setStyleProperty(el, "h1");
            this.setStyleProperty(el, "h2");
            this.setStyleProperty(el, "h3");
            this.setStyleProperty(el, "h4");
            if (!window._KHTMLrv) {
                this.setStyleProperty(el, "del");
                this.setStyleProperty(el, "sub");
                this.setStyleProperty(el, "sup");
                this.setStyleProperty(el, "u")
            };
            this.callEvent("onFocusChanged", [this.style, st])
        } catch (e) {
            return null
        }
    };
    this.getSelectionBounds = function() {
        var range, root, start, end;
        if (this.edWin.getSelection) {
            var selection = this.edWin.getSelection();
            range = selection.getRangeAt(selection.rangeCount - 1);
            start = range.startContainer;
            end = range.endContainer;
            root = range.commonAncestorContainer;
            if (start.nodeName == "#text")
                root = root.parentNode;
            if (start.nodeName == "#text")
                start = start.parentNode;
            if (start.nodeName.toLowerCase() == "body")
                start = start.firstChild;
            if (end.nodeName == "#text")
                end = end.parentNode;
            if (end.nodeName.toLowerCase() == "body")
                end = end.lastChild;
            if (start == end)
                root = start;
            return {
                root : root,
                start : start,
                end : end
            }
        } else if (this.edWin.document.selection) {
            range = this.edDoc.selection.createRange();
            if (!range.duplicate)
                return null;
            root = range.parentElement();
            var r1 = range.duplicate();
            var r2 = range.duplicate();
            r1.collapse(true);
            r2.moveToElementText(r1.parentElement());
            r2.setEndPoint("EndToStart", r1);
            start = r1.parentElement();
            r1 = range.duplicate();
            r2 = range.duplicate();
            r2.collapse(false);
            r1.moveToElementText(r2.parentElement());
            r1.setEndPoint("StartToEnd", r2);
            end = r2.parentElement();
            if (start.nodeName.toLowerCase() == "body")
                start = start.firstChild;
            if (end.nodeName.toLowerCase() == "body")
                end = end.lastChild;
            if (start == end)
                root = start;
            return {
                root : root,
                start : start,
                end : end
            }
        };
        return null
    };
    this.getContent = function() {
        if (!this.edDoc.body)
            return "";
        else {
            if (_isFF) {
                return this.edDoc.body.innerHTML.replace(/<br>$/, "")
            };
            return this.edDoc.body.innerHTML
        }
    };
    this.setContent = function(str) {
        if (this.edDoc.body) {
            this.edDoc.body.innerHTML = str;
            this.callEvent("onContentSet", []);
            if (_isFF) {
                this.runCommand('InsertHTML', ' ')
            }
        } else {
            var that = this;
            dhtmlxEvent(this.edWin, "load", function(e) {
                        that.setContent(str)
                    })
        }
    }
};
function dhtmlXContainerLite(obj) {
    var that = this;
    this.obj = obj;
    this.dhxcont = null;
    this.setContent = function(data) {
        this.dhxcont = data;
        this.dhxcont.innerHTML = "<div id='dhxMainCont' style='position: relative;left: 0px;top: 0px;overflow: hidden;'></div>" + "<div id='dhxContBlocker' class='dhxcont_content_blocker' style='display: none;'></div>";
        this.dhxcont.mainCont = this.dhxcont.childNodes[0];
        this.obj.dhxcont = this.dhxcont
    };
    this.obj._genStr = function(w) {
        var s = "";
        var z = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        for (var q = 0; q < w; q++) {
            s = s + z.charAt(Math.round(Math.random() * z.length))
        };
        return s
    };
    this.obj.adjustContent = function(parentObj, offsetTop, marginTop, notCalcWidth, offsetBottom) {
        this.dhxcont.style.left = (this._offsetLeft || 0) + "px";
        this.dhxcont.style.top = (this._offsetTop || 0) + offsetTop + "px";
        var cw = parentObj.clientWidth + (this._offsetWidth || 0);
        if (notCalcWidth !== true)
            this.dhxcont.style.width = Math.max(0, cw) + "px";
        if (notCalcWidth !== true)
            if (this.dhxcont.offsetWidth > cw)
                this.dhxcont.style.width = Math.max(0, cw * 2 - this.dhxcont.offsetWidth) + "px";
        var ch = parentObj.clientHeight + (this._offsetHeight || 0);
        this.dhxcont.style.height = Math.max(0, ch - offsetTop) + (marginTop != null ? marginTop : 0) + "px";
        if (this.dhxcont.offsetHeight > ch - offsetTop)
            this.dhxcont.style.height = Math.max(0, (ch - offsetTop) * 2 - this.dhxcont.offsetHeight) + "px";
        if (offsetBottom)
            if (!isNaN(offsetBottom))
                this.dhxcont.style.height = Math.max(0, parseInt(this.dhxcont.style.height) - offsetBottom) + "px";
        if (this._minDataSizeH != null) {
            if (parseInt(this.dhxcont.style.height) < this._minDataSizeH)
                this.dhxcont.style.height = this._minDataSizeH + "px"
        };
        if (this._minDataSizeW != null) {
            if (parseInt(this.dhxcont.style.width) < this._minDataSizeW)
                this.dhxcont.style.width = this._minDataSizeW + "px"
        };
        if (notCalcWidth !== true) {
            this.dhxcont.mainCont.style.width = this.dhxcont.clientWidth + "px";
            if (this.dhxcont.mainCont.offsetWidth > this.dhxcont.clientWidth)
                this.dhxcont.mainCont.style.width = Math.max(0, this.dhxcont.clientWidth * 2 - this.dhxcont.mainCont.offsetWidth) + "px"
        };
        var menuOffset = (this.menu != null ? (!this.menuHidden ? this.menuHeight : 0) : 0);
        var toolbarOffset = (this.toolbar != null ? (!this.toolbarHidden ? this.toolbarHeight : 0) : 0);
        var statusOffset = (this.sb != null ? (!this.sbHidden ? this.sbHeight : 0) : 0);
        this.dhxcont.mainCont.style.height = this.dhxcont.clientHeight + "px";
        if (this.dhxcont.mainCont.offsetHeight > this.dhxcont.clientHeight)
            this.dhxcont.mainCont.style.height = Math.max(0, this.dhxcont.clientHeight * 2 - this.dhxcont.mainCont.offsetHeight) + "px";
        this.dhxcont.mainCont.style.height = Math.max(0, parseInt(this.dhxcont.mainCont.style.height) - menuOffset - toolbarOffset - statusOffset) + "px"
    };
    this.obj.attachToolbar = function() {
        var toolbarObj = document.createElement("DIV");
        toolbarObj.style.position = "relative";
        toolbarObj.style.overflow = "hidden";
        toolbarObj.id = "dhxtoolbar_" + this._genStr(12);
        this.dhxcont.insertBefore(toolbarObj, this.dhxcont.childNodes[(this.menu != null ? 1 : 0)]);
        this.toolbar = new dhtmlXToolbarObject(toolbarObj.id, this.skin);
        this.toolbarHeight = toolbarObj.offsetHeight + (this._isLayout && this.skin == "dhx_skyblue" ? 2 : 0);
        this.toolbarId = toolbarObj.id;
        if (this._doOnAttachToolbar)
            this._doOnAttachToolbar("init");
        this.adjust();
        return this.toolbar
    };
    this.obj.attachObject = function(obj, autoSize) {
        if (typeof(obj) == "string")
            obj = document.getElementById(obj);
        if (autoSize) {
            obj.style.visibility = "hidden";
            obj.style.display = "";
            var objW = obj.offsetWidth;
            var objH = obj.offsetHeight
        };
        this._attachContent("obj", obj);
        if (autoSize && this._isWindow) {
            obj.style.visibility = "visible";
            this._adjustToContent(objW, objH)
        }
    };
    this.obj.adjust = function() {
        if (this.skin == "dhx_skyblue") {
            if (this.toolbar) {
                if (this._isWindow || this._isLayout) {
                    document.getElementById(this.toolbarId).style.height = "29px";
                    this.toolbarHeight = document.getElementById(this.toolbarId).offsetHeight;
                    if (this._doOnAttachToolbar)
                        this._doOnAttachToolbar("show")
                };
                if (this._isCell) {
                    document.getElementById(this.toolbarId).className += " in_layoutcell"
                };
                if (this._isAcc) {
                    document.getElementById(this.toolbarId).className += " in_acccell"
                }
            }
        }
    };
    this.obj._attachContent = function(type, obj, append) {
        while (that.dhxcont.mainCont.childNodes.length > 0) {
            that.dhxcont.mainCont.removeChild(that.dhxcont.mainCont.childNodes[0])
        };
        if (type == "obj") {
            if (this._isWindow && obj.cmp == null && this.skin == "dhx_skyblue") {
                this.dhxcont.mainCont.style.border = "#a4bed4 1px solid";
                this.dhxcont.mainCont.style.backgroundColor = "#FFFFFF";
                this._redraw()
            };
            that.dhxcont._frame = null;
            that.dhxcont.mainCont.appendChild(obj);
            that.dhxcont.mainCont.style.overflow = (append === true ? "auto" : "hidden");
            obj.style.display = ""
        }
    };
    this.obj._dhxContDestruct = function() {
        this._genStr = null;
        this.moveContentTo = null;
        this.adjustContent = null;
        this.attachToolbar = null;
        while (this.dhxcont.mainCont.childNodes.length > 0)
            this.dhxcont.mainCont.removeChild(this.dhxcont.mainCont.childNodes[0]);
        this.dhxcont.mainCont.innerHTML = "";
        this.dhxcont.mainCont = null;
        try {
            delete this.dhxcont["mainCont"]
        } catch (e) {
        };
        while (this.dhxcont.childNodes.length > 0)
            this.dhxcont.removeChild(this.dhxcont.childNodes[0]);
        this.dhxcont.innerHTML = "";
        this.dhxcont = null;
        try {
            delete this["dhxcont"]
        } catch (e) {
        }
    }
};
(function() {
    dhtmlx.extend_api("dhtmlXEditor", {
                _init : function(obj) {
                    return [obj.parent, obj.skin]
                },
                content : "setContent"
            }, {})
})();