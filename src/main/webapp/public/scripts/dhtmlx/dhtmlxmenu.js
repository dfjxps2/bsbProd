

function dhtmlXMenuObject(baseId, skin) {
    var main_self = this;
    this.addBaseIdAsContextZone = null;
    this.isDhtmlxMenuObject = true;
    this._unloaded = false;
    this.skin = (skin != null ? skin : "dhx_skyblue");
    this.imagePath = "";
    this._isIE6 = false;
    if (_isIE) {
        this._isIE6 = (window.XMLHttpRequest == null ? true : false)
    };
    if (baseId == null) {
        this.base = document.body
    } else {
        if (document.getElementById(baseId) != null) {
            this.base = document.getElementById(baseId);
            while (this.base.childNodes.length > 0) {
                this.base.removeChild(this.base.childNodes[0])
            };
            this.base.className += " dhtmlxMenu_" + this.skin + "_Middle dir_left";
            this.base._autoSkinUpdate = true;
            this.addBaseIdAsContextZone = baseId;
            this.base.onselectstart = function(e) {
                e = e || event;
                e.returnValue = false;
                return false
            };
            this.base.oncontextmenu = function(e) {
                e = e || event;
                e.returnValue = false;
                return false
            }
        } else {
            this.base = document.body
        }
    };
    this.topId = "dhxWebMenuTopId";
    if (!this.extendedModule) {
        var t = function() {
            alert("dhtmlxmenu_ext.js required")
        };
        var extMethods = new Array("setItemEnabled", "setItemDisabled", "isItemEnabled", "_changeItemState", "getItemText", "setItemText", "loadFromHTML", "hideItem", "showItem", "isItemHidden", "_changeItemVisible", "setUserData", "getUserData", "setOpenMode", "setWebModeTimeout", "enableDynamicLoading", "_updateLoaderIcon", "getItemImage", "setItemImage", "clearItemImage", "setAutoShowMode", "setAutoHideMode", "setContextMenuHideAllMode", "getContextMenuHideAllMode", "setVisibleArea", "setTooltip", "getTooltip", "setHotKey", "getHotKey", "setItemSelected", "setTopText", "setRTL", "setAlign", "setHref", "clearHref", "getCircuit", "_clearAllSelectedSubItemsInPolygon", "_checkArrowsState", "_addUpArrow", "_addDownArrow", "_removeUpArrow", "_removeDownArrow", "_isArrowExists",
                "_doScrollUp", "_doScrollDown", "_countPolygonItems", "setOverflowHeight", "_getRadioImgObj", "_setRadioState", "_radioOnClickHandler", "getRadioChecked", "setRadioChecked", "addRadioButton", "_getCheckboxState", "_setCheckboxState", "_readLevel", "_updateCheckboxImage", "_checkboxOnClickHandler", "setCheckboxState", "getCheckboxState", "addCheckbox", "serialize");
        for (var q = 0; q < extMethods.length; q++)
            this[extMethods[q]] = t;
        extMethods = null
    };
    this.fixedPosition = false;
    this.menuSelected = -1;
    this.menuLastClicked = -1;
    this.idPrefix = "";
    this.itemTagName = "item";
    this.itemTextTagName = "itemtext";
    this.userDataTagName = "userdata";
    this.itemTipTagName = "tooltip";
    this.itemHotKeyTagName = "hotkey";
    this.itemHrefTagName = "href";
    this.dirTopLevel = "bottom";
    this.dirSubLevel = "right";
    this.menuX1 = null;
    this.menuX2 = null;
    this.menuY1 = null;
    this.menuY2 = null;
    this.menuMode = "web";
    this.menuTimeoutMsec = 400;
    this.menuTimeoutHandler = null;
    this.idPull = {};
    this.itemPull = {};
    this.userData = {};
    this.radio = {};
    this._rtl = false;
    this._align = "left";
    this.menuTouched = false;
    this.zIndInit = 1200;
    this.zInd = this.zIndInit;
    this.zIndStep = 50;
    this.menuModeTopLevelTimeout = true;
    this.menuModeTopLevelTimeoutTime = 200;
    this.topLevelItemPaddingIconExists = 27;
    this.topLevelItemPaddingIconNotExists = 6;
    this._topLevelBottomMargin = 1;
    this._topLevelRightMargin = 0;
    this._topLevelOffsetLeft = 1;
    this._arrowFFFix = (_isIE ? (document.compatMode == "BackCompat" ? 0 : -4) : -4);
    this.setSkin = function(skin) {
        var oldSkin = this.skin;
        this.skin = skin;
        switch (this.skin) {
            case "standard" :
                this._topLevelBottomMargin = 1;
                this._topLevelOffsetLeft = 0;
                this._arrowFFFix = (_isIE ? (document.compatMode == "BackCompat" ? 0 : (this._isIE6 ? -5 : -4)) : -4);
                break;
            case "clear_blue" :
            case "clear_green" :
            case "clear_silver" :
                this._topLevelBottomMargin = 3;
                this._topLevelOffsetLeft = 0;
                this._arrowFFFix = (_isIE ? (document.compatMode == "BackCompat" ? 0 : -4) : -4);
                break;
            case "aqua_orange" :
            case "aqua_sky" :
            case "aqua_dark" :
                this._topLevelBottomMargin = 1;
                this._topLevelOffsetLeft = 0;
                this._arrowFFFix = (_isIE ? (document.compatMode == "BackCompat" ? 0 : -2) : -2);
                break;
            case "modern_blue" :
            case "modern_red" :
            case "modern_black" :
                this._topLevelBottomMargin = 3;
                this._topLevelOffsetLeft = 0;
                this._arrowFFFix = (_isIE ? (document.compatMode == "BackCompat" ? 0 : -2) : -2);
                break;
            case "glassy_blue" :
                this._topLevelBottomMargin = 0;
                this._topLevelOffsetLeft = 0;
                this._arrowFFFix = (_isIE ? (document.compatMode == "BackCompat" ? 0 : -4) : -4);
                break;
            case "dhx_black" :
            case "dhx_blue" :
            case "dhx_skyblue" :
                this._topLevelBottomMargin = 2;
                this._topLevelRightMargin = 1;
                this._topLevelOffsetLeft = 1;
                this._arrowFFFix = (_isIE ? (document.compatMode == "BackCompat" ? 0 : -4) : -4);
                break
        };
        if (this.base._autoSkinUpdate) {
            this.base.className = this.base.className.replace("dhtmlxMenu_" + oldSkin + "_Middle", "") + " dhtmlxMenu_" + this.skin + "_Middle"
        };
        for (var a in this.idPull) {
            this.idPull[a].className = String(this.idPull[a].className).replace(oldSkin, this.skin)
        }
    };
    this.setSkin(this.skin);
    this.dLoad = false;
    this.dLoadUrl = "";
    this.dLoadSign = "?";
    this.loaderIcon = false;
    this.limit = 0;
    this._scrollUpTM = null;
    this._scrollUpTMTime = 20;
    this._scrollUpTMStep = 3;
    this._scrollDownTM = null;
    this._scrollDownTMTime = 20;
    this._scrollDownTMStep = 3;
    this.context = false;
    this.contextZones = {};
    this.contextMenuZoneId = false;
    this.contextAutoShow = true;
    this.contextAutoHide = true;
    this.contextHideAllMode = true;
    this.sxDacProc = null;
    this.dacSpeed = 10;
    this.dacCycles = [];
    for (var q = 0; q < 10; q++) {
        this.dacCycles[q] = q
    };
    this.dacSpeedIE = 10;
    this.dacCyclesIE = [];
    for (var q = 0; q < 10; q++) {
        this.dacCyclesIE[q] = q
    };
    this._enableDacSupport = function(dac) {
        this.sxDacProc = dac
    };
    this._selectedSubItems = new Array();
    this._openedPolygons = new Array();
    this._addSubItemToSelected = function(item, polygon) {
        var t = true;
        for (var q = 0; q < this._selectedSubItems.length; q++) {
            if ((this._selectedSubItems[q][0] == item) && (this._selectedSubItems[q][1] == polygon)) {
                t = false
            }
        };
        if (t == true) {
            this._selectedSubItems.push(new Array(item, polygon))
        };
        return t
    };
    this._removeSubItemFromSelected = function(item, polygon) {
        var m = new Array();
        var t = false;
        for (var q = 0; q < this._selectedSubItems.length; q++) {
            if ((this._selectedSubItems[q][0] == item) && (this._selectedSubItems[q][1] == polygon)) {
                t = true
            } else {
                m[m.length] = this._selectedSubItems[q]
            }
        };
        if (t == true) {
            this._selectedSubItems = m
        };
        return t
    };
    this._getSubItemToDeselectByPolygon = function(polygon) {
        var m = new Array();
        for (var q = 0; q < this._selectedSubItems.length; q++) {
            if (this._selectedSubItems[q][1] == polygon) {
                m[m.length] = this._selectedSubItems[q][0];
                m = m.concat(this._getSubItemToDeselectByPolygon(this._selectedSubItems[q][0]));
                var t = true;
                for (var w = 0; w < this._openedPolygons.length; w++) {
                    if (this._openedPolygons[w] == this._selectedSubItems[q][0]) {
                        t = false
                    }
                };
                if (t == true) {
                    this._openedPolygons[this._openedPolygons.length] = this._selectedSubItems[q][0]
                };
                this._selectedSubItems[q][0] = -1;
                this._selectedSubItems[q][1] = -1
            }
        };
        return m
    };
    this._hidePolygon = function(id) {
        if (this.idPull["polygon_" + id] != null) {
            if ((this.sxDacProc != null) && (this.idPull["sxDac_" + id] != null)) {
                this.idPull["sxDac_" + id]._hide()
            } else {
                if (this.idPull["polygon_" + id].style.display == "none")
                    return;
                this.idPull["polygon_" + id].style.display = "none";
                if (this.idPull["arrowup_" + id] != null) {
                    this.idPull["arrowup_" + id].style.display = "none"
                };
                if (this.idPull["arrowdown_" + id] != null) {
                    this.idPull["arrowdown_" + id].style.display = "none"
                };
                this._updateItemComplexState(id, true, false);
                if (this._isIE6) {
                    if (this.idPull["polygon_" + id + "_ie6cover"] != null) {
                        this.idPull["polygon_" + id + "_ie6cover"].style.display = "none"
                    }
                };
                id = String(id).replace(this.idPrefix, "");
                if (id == this.topId)
                    id = null;
                this.callEvent("onHide", [id])
            }
        }
    };
    this._showPolygon = function(id, openType) {
        var itemCount = this._countVisiblePolygonItems(id);
        if (itemCount == 0)
            return;
        var pId = "polygon_" + id;
        if ((this.idPull[pId] != null) && (this.idPull[id] != null)) {
            if (this.menuModeTopLevelTimeout && this.menuMode == "web" && !this.context) {
                if (!this.idPull[id]._mouseOver && openType == this.dirTopLevel)
                    return
            };
            if (!this.fixedPosition)
                this._autoDetectVisibleArea();
            var arrUpH = 0;
            var arrDownH = 0;
            var arrowUp = null;
            var arrowDown = null;
            if (this.limit > 0 && this.limit < itemCount) {
                var auId = "arrowup_" + id;
                var adId = "arrowdown_" + id;
                if (this.idPull["arrowup_" + id] == null)
                    this._addUpArrow(String(id).replace(this.idPrefix, ""));
                if (this.idPull["arrowdown_" + id] == null)
                    this._addDownArrow(String(id).replace(this.idPrefix, ""));
                arrowUp = this.idPull["arrowup_" + id];
                arrowUp.style.visibility = "hidden";
                arrowUp.style.display = "";
                arrowUp.style.zIndex = this.zInd;
                arrUpH = arrowUp.offsetHeight;
                arrowDown = this.idPull["arrowdown_" + id];
                arrowDown.style.visibility = "hidden";
                arrowDown.style.display = "";
                arrowDown.style.zIndex = this.zInd;
                arrDownH = arrowDown.offsetHeight
            };
            this.idPull[pId].style.visibility = "hidden";
            this.idPull[pId].style.left = "0px";
            this.idPull[pId].style.top = "0px";
            this.idPull[pId].style.display = "";
            this.idPull[pId].style.zIndex = this.zInd;
            if (this.limit > 0) {
                if (this.limit < itemCount) {
                    this.idPull[pId].style.height = this.idPull[pId].childNodes[0].offsetHeight * this.limit + "px";
                    this.idPull[pId].scrollTop = 0
                } else {
                    this.idPull[pId].style.height = ""
                }
            };
            this.zInd += this.zIndStep;
            if (this.itemPull[id] != null) {
                var parPoly = "polygon_" + this.itemPull[id]["parent"]
            } else if (this.context) {
                var parPoly = this.idPull[this.idPrefix + this.topId]
            };
            var srcX = (this.idPull[id].tagName != null ? getAbsoluteLeft(this.idPull[id]) : this.idPull[id][0]);
            var srcY = (this.idPull[id].tagName != null ? getAbsoluteTop(this.idPull[id]) : this.idPull[id][1]);
            var srcW = (this.idPull[id].tagName != null ? this.idPull[id].offsetWidth : 0);
            var srcH = (this.idPull[id].tagName != null ? this.idPull[id].offsetHeight + arrUpH + arrDownH : 0);
            var x = 0;
            var y = 0;
            var w = this.idPull[pId].offsetWidth;
            var h = this.idPull[pId].offsetHeight;
            if (openType == "bottom") {
                if (this._rtl) {
                    x = srcX + (srcW != null ? srcW : 0) - w
                } else {
                    if (this._align == "right") {
                        x = srcX + srcW - w
                    } else {
                        x = srcX - 1 + (openType == this.dirTopLevel ? this._topLevelRightMargin : 0)
                    }
                };
                y = srcY - 1 + srcH - arrUpH - arrDownH + this._topLevelBottomMargin
            };
            if (openType == "right") {
                x = srcX + srcW - 1;
                y = srcY + 2
            };
            if (openType == "left") {
                x = srcX - this.idPull[pId].offsetWidth + 2;
                y = srcY + 2
            };
            if (openType == "top") {
                x = srcX - 1;
                y = srcY - h + 2
            };
            if (this.fixedPosition) {
                var mx = 65536;
                var my = 65536
            } else {
                var mx = (this.menuX2 != null ? this.menuX2 : 0);
                var my = (this.menuY2 != null ? this.menuY2 : 0);
                if (mx == 0) {
                    if (window.innerWidth) {
                        mx = window.innerWidth;
                        my = window.innerHeight
                    } else {
                        mx = document.body.offsetWidth;
                        my = document.body.scrollHeight
                    }
                }
            };
            if (x + w > mx && !this._rtl) {
                x = srcX - w + 2
            };
            if (x < this.menuX1 && this._rtl) {
                x = srcX + srcW - 2
            };
            if (x < 0) {
                x = 0
            };
            if (y + h > my && this.menuY2 != null) {
                y = srcY + srcH - h + 2;
                if (this.itemPull[id] != null && !this.context) {
                    if (this.itemPull[id]["parent"] == this.idPrefix + this.topId)
                        y = y - this.base.offsetHeight
                }
            };
            this.idPull[pId].style.left = x + "px";
            this.idPull[pId].style.top = y + arrUpH + "px";
            if ((this.sxDacProc != null) && (this.idPull["sxDac_" + id] != null)) {
                this.idPull["sxDac_" + id]._show()
            } else {
                this.idPull[pId].style.visibility = "";
                if (this.limit > 0 && this.limit < itemCount) {
                    arrowUp.style.left = x + "px";
                    arrowUp.style.top = y + "px";
                    arrowUp.style.width = w + this._arrowFFFix + "px";
                    arrowUp.style.visibility = "";
                    arrowDown.style.left = x + "px";
                    arrowDown.style.top = y + arrUpH + h + "px";
                    arrowDown.style.width = w + this._arrowFFFix + "px";
                    arrowDown.style.visibility = "";
                    this._checkArrowsState(id)
                };
                if (this._isIE6) {
                    var pIdIE6 = pId + "_ie6cover";
                    if (this.idPull[pIdIE6] == null) {
                        var ifr = document.createElement("IFRAME");
                        ifr.className = "dhtmlxMenu_IE6CoverFix_" + this.skin;
                        ifr.frameBorder = 0;
                        ifr.setAttribute("src", "javascript:false;");
                        document.body.insertBefore(ifr, document.body.firstChild);
                        this.idPull[pIdIE6] = ifr
                    };
                    this.idPull[pIdIE6].style.left = this.idPull[pId].style.left;
                    this.idPull[pIdIE6].style.top = this.idPull[pId].style.top;
                    this.idPull[pIdIE6].style.width = this.idPull[pId].offsetWidth + "px";
                    this.idPull[pIdIE6].style.height = this.idPull[pId].offsetHeight + "px";
                    this.idPull[pIdIE6].style.zIndex = this.idPull[pId].style.zIndex - 1;
                    this.idPull[pIdIE6].style.display = ""
                };
                id = String(id).replace(this.idPrefix, "");
                if (id == this.topId)
                    id = null;
                this.callEvent("onShow", [id])
            }
        }
    };
    this._redistribSubLevelSelection = function(id, parentId) {
        while (this._openedPolygons.length > 0) {
            this._openedPolygons.pop()
        };
        var i = this._getSubItemToDeselectByPolygon(parentId);
        this._removeSubItemFromSelected(-1, -1);
        for (var q = 0; q < i.length; q++) {
            if ((this.idPull[i[q]] != null) && (i[q] != id)) {
                if (this.itemPull[i[q]]["state"] == "enabled") {
                    this.idPull[i[q]].className = "dhtmlxMenu_" + this.skin + "_SubLevelArea_Item_Normal"
                }
            }
        };
        for (var q = 0; q < this._openedPolygons.length; q++) {
            if (this._openedPolygons[q] != parentId) {
                this._hidePolygon(this._openedPolygons[q])
            }
        };
        if (this.itemPull[id]["state"] == "enabled") {
            this.idPull[id].className = "dhtmlxMenu_" + this.skin + "_SubLevelArea_Item_Selected";
            if (this.itemPull[id]["complex"] && this.dLoad && (this.itemPull[id]["loaded"] == "no")) {
                if (this.loaderIcon == true) {
                    this._updateLoaderIcon(id, true)
                };
                var xmlLoader = new dtmlXMLLoaderObject(this._xmlParser, window);
                this.itemPull[id]["loaded"] = "get";
                this.callEvent("onXLS", []);
                xmlLoader.loadXML(this.dLoadUrl + this.dLoadSign + "action=loadMenu&parentId=" + id.replace(this.idPrefix, "") + "&etc=" + new Date().getTime())
            };
            if (this.itemPull[id]["complex"] || (this.dLoad && (this.itemPull[id]["loaded"] == "yes"))) {
                if ((this.itemPull[id]["complex"]) && (this.idPull["polygon_" + id] != null)) {
                    this._updateItemComplexState(id, true, true);
                    this._showPolygon(id, this.dirSubLevel)
                }
            };
            this._addSubItemToSelected(id, parentId);
            this.menuSelected = id
        }
    };
    this._doOnClick = function(id, type, casState) {
        this.menuLastClicked = id;
        if (this.itemPull[this.idPrefix + id]["href_link"] != null) {
            var form = document.createElement("FORM");
            form.action = this.itemPull[this.idPrefix + id]["href_link"];
            if (this.itemPull[this.idPrefix + id]["href_target"] != null) {
                form.target = this.itemPull[this.idPrefix + id]["href_target"]
            };
            form.style.display = "none";
            document.body.appendChild(form);
            form.submit();
            if (form != null) {
                document.body.removeChild(form);
                form = null
            };
            return
        };
        if (type.charAt(0) == "c")
            return;
        if (type.charAt(1) == "d")
            return;
        if (type.charAt(2) == "s")
            return;
        if (this.checkEvent("onClick")) {
            this._clearAndHide();
            if (this._isContextMenuVisible() && this.contextAutoHide)
                this._hideContextMenu();
            this.callEvent("onClick", [id, this.contextMenuZoneId, casState])
        } else {
            if ((type.charAt(1) == "d") || (this.menuMode == "win" && type.charAt(2) == "t"))
                return;
            this._clearAndHide();
            if (this._isContextMenuVisible() && this.contextAutoHide)
                this._hideContextMenu()
        }
    };
    this._doOnTouchMenu = function(id) {
        if (this.menuTouched == false) {
            this.menuTouched = true;
            if (this.checkEvent("onTouch")) {
                this.callEvent("onTouch", [id])
            }
        }
    };
    this._searchMenuNode = function(node, menu) {
        var m = new Array();
        for (var q = 0; q < menu.length; q++) {
            if (typeof(menu[q]) == "object") {
                if (menu[q].length == 5) {
                    if (typeof(menu[q][0]) != "object") {
                        if ((menu[q][0].replace(this.idPrefix, "") == node) && (q == 0)) {
                            m = menu
                        }
                    }
                };
                var j = this._searchMenuNode(node, menu[q]);
                if (j.length > 0) {
                    m = j
                }
            }
        };
        return m
    };
    this._getMenuNodes = function(node) {
        var m = new Array;
        for (var a in this.itemPull) {
            if (this.itemPull[a]["parent"] == node) {
                m[m.length] = a
            }
        };
        return m
    };
    this._genStr = function(w) {
        var s = "";
        var z = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        for (var q = 0; q < w; q++) {
            s = s + z.charAt(Math.round(Math.random() * z.length))
        };
        return s
    };
    this.getItemType = function(id) {
        id = this.idPrefix + id;
        if (this.itemPull[id] == null) {
            return null
        };
        return this.itemPull[id]["type"]
    };
    this.forEachItem = function(handler) {
        for (var a in this.itemPull) {
            handler(String(a).replace(this.idPrefix, ""))
        }
    };
    this._clearAndHide = function() {
        main_self.menuSelected = -1;
        main_self.menuLastClicked = -1;
        while (main_self._openedPolygons.length > 0) {
            main_self._openedPolygons.pop()
        };
        for (var q = 0; q < main_self._selectedSubItems.length; q++) {
            var id = main_self._selectedSubItems[q][0];
            if (main_self.idPull[id] != null) {
                if (main_self.itemPull[id]["state"] == "enabled") {
                    if (main_self.idPull[id].className == "dhtmlxMenu_" + main_self.skin + "_SubLevelArea_Item_Selected") {
                        main_self.idPull[id].className = "dhtmlxMenu_" + main_self.skin + "_SubLevelArea_Item_Normal"
                    };
                    if (main_self.idPull[id].className == "dhtmlxMenu_" + main_self.skin + "_TopLevel_Item_Selected") {
                        if (main_self.itemPull[id]["cssNormal"] != null) {
                            main_self.idPull[id].className = main_self.itemPull[id]["cssNormal"]
                        } else {
                            main_self.idPull[id].className = "dhtmlxMenu_" + main_self.skin + "_TopLevel_Item_Normal"
                        }
                    }
                }
            };
            main_self._hidePolygon(id)
        };
        main_self.menuTouched = false;
        if (main_self.context) {
            if (main_self.contextHideAllMode) {
                main_self._hidePolygon(main_self.idPrefix + main_self.topId);
                main_self.zInd = main_self.zIndInit
            } else {
                main_self.zInd = main_self.zIndInit + main_self.zIndStep
            }
        }
    };
    this._doOnLoad = function() {
    };
    this.loadXML = function(xmlFile, onLoadFunction) {
        if (onLoadFunction)
            this._doOnLoad = function() {
                onLoadFunction()
            };
        this.callEvent("onXLS", []);
        this._xmlLoader.loadXML(xmlFile)
    };
    this.loadXMLString = function(xmlString, onLoadFunction) {
        if (onLoadFunction)
            this._doOnLoad = function() {
                onLoadFunction()
            };
        this._xmlLoader.loadXMLString(xmlString)
    };
    this._buildMenu = function(t, parentId) {
        var u = 0;
        for (var q = 0; q < t.childNodes.length; q++) {
            if (t.childNodes[q].tagName == this.itemTagName) {
                var r = t.childNodes[q];
                var item = {};
                item["id"] = this.idPrefix + (r.getAttribute("id") || this._genStr(24));
                item["title"] = r.getAttribute("text") || "";
                item["imgen"] = r.getAttribute("img") || "";
                item["imgdis"] = r.getAttribute("imgdis") || "";
                item["tip"] = "";
                item["hotkey"] = "";
                if (r.getAttribute("cssNormal") != null) {
                    item["cssNormal"] = r.getAttribute("cssNormal")
                };
                item["type"] = r.getAttribute("type") || "item";
                if (item["type"] == "checkbox") {
                    item["checked"] = (r.getAttribute("checked") != null);
                    item["imgen"] = "chbx_" + (item["checked"] ? "1" : "0");
                    item["imgdis"] = "chbxdis_" + (item["checked"] ? "1" : "0")
                };
                if (item["type"] == "radio") {
                    item["checked"] = (r.getAttribute("checked") != null);
                    item["imgen"] = "rdbt_" + (item["checked"] ? "1" : "0");
                    item["imgdis"] = "rdbtdis_" + (item["checked"] ? "1" : "0");
                    item["group"] = r.getAttribute("group") || this._genStr(24);
                    if (this.radio[item["group"]] == null) {
                        this.radio[item["group"]] = new Array()
                    };
                    this.radio[item["group"]][this.radio[item["group"]].length] = item["id"]
                };
                item["state"] = (r.getAttribute("enabled") != null || r.getAttribute("disabled") != null ? (r.getAttribute("enabled") == "false" || r.getAttribute("disabled") == "true" ? "disabled" : "enabled") : "enabled");
                item["parent"] = (parentId != null ? parentId : this.idPrefix + this.topId);
                item["complex"] = (this.dLoad ? (r.getAttribute("complex") != null ? true : false) : (this._buildMenu(r, item["id"]) > 0));
                if (this.dLoad && item["complex"]) {
                    item["loaded"] = "no"
                };
                this.itemPull[item["id"]] = item;
                for (var w = 0; w < r.childNodes.length; w++) {
                    var tagNm = r.childNodes[w].tagName;
                    if (tagNm != null) {
                        tagNm = tagNm.toLowerCase()
                    };
                    if (tagNm == this.userDataTagName) {
                        var d = r.childNodes[w];
                        if (d.getAttribute("name") != null) {
                            this.userData[item["id"] + "_" + d.getAttribute("name")] = (d.firstChild.nodeValue != null ? d.firstChild.nodeValue : "")
                        }
                    };
                    if (tagNm == this.itemTextTagName) {
                        item["title"] = r.childNodes[w].firstChild.nodeValue
                    };
                    if (tagNm == this.itemTipTagName) {
                        item["tip"] = r.childNodes[w].firstChild.nodeValue
                    };
                    if (tagNm == this.itemHotKeyTagName) {
                        item["hotkey"] = r.childNodes[w].firstChild.nodeValue
                    };
                    if (tagNm == this.itemHrefTagName && item["type"] == "item") {
                        item["href_link"] = r.childNodes[w].firstChild.nodeValue;
                        if (r.childNodes[w].getAttribute("target") != null) {
                            item["href_target"] = r.childNodes[w].getAttribute("target")
                        }
                    }
                };
                u++
            }
        };
        return u
    };
    this._xmlParser = function() {
        if (main_self.dLoad) {
            var t = this.getXMLTopNode("menu");
            parentId = (t.getAttribute("parentId") != null ? t.getAttribute("parentId") : null);
            if (parentId == null) {
                main_self._buildMenu(t, null);
                main_self._initTopLevelMenu()
            } else {
                main_self._buildMenu(t, main_self.idPrefix + parentId);
                main_self._addSubMenuPolygon(main_self.idPrefix + parentId, main_self.idPrefix + parentId);
                if (main_self.menuSelected == main_self.idPrefix + parentId) {
                    var pId = main_self.idPrefix + parentId;
                    var isTop = main_self.itemPull[main_self.idPrefix + parentId]["parent"] == main_self.idPrefix + main_self.topId;
                    var level = ((isTop && (!main_self.context)) ? main_self.dirTopLevel : main_self.dirSubLevel);
                    var isShow = false;
                    if (isTop && main_self.menuModeTopLevelTimeout && main_self.menuMode == "web" && !main_self.context) {
                        var item = main_self.idPull[main_self.idPrefix + parentId];
                        if (item._mouseOver == true) {
                            var delay = main_self.menuModeTopLevelTimeoutTime - (new Date().getTime() - item._dynLoadTM);
                            if (delay > 1) {
                                item._menuOpenTM = window.setTimeout(function() {
                                            main_self._showPolygon(pId, level)
                                        }, delay);
                                isShow = true
                            }
                        }
                    };
                    if (!isShow) {
                        main_self._showPolygon(pId, level)
                    }
                };
                main_self.itemPull[main_self.idPrefix + parentId]["loaded"] = "yes";
                if (main_self.loaderIcon == true) {
                    main_self._updateLoaderIcon(main_self.idPrefix + parentId, false)
                }
            };
            this.destructor();
            main_self.callEvent("onXLE", [])
        } else {
            var t = this.getXMLTopNode("menu");
            main_self._buildMenu(t, null);
            main_self.init();
            if (!main_self.context)
                main_self._redistribTopLevelPositions();
            main_self.callEvent("onXLE", []);
            main_self._doOnLoad()
        }
    };
    this._xmlLoader = new dtmlXMLLoaderObject(this._xmlParser, window);
    this._showSubLevelItem = function(id, back) {
        if (document.getElementById("arrow_" + this.idPrefix + id) != null) {
            document.getElementById("arrow_" + this.idPrefix + id).style.display = (back ? "none" : "")
        };
        if (document.getElementById("image_" + this.idPrefix + id) != null) {
            document.getElementById("image_" + this.idPrefix + id).style.display = (back ? "none" : "")
        };
        if (document.getElementById(this.idPrefix + id) != null) {
            document.getElementById(this.idPrefix + id).style.display = (back ? "" : "none")
        }
    };
    this._hideSubLevelItem = function(id) {
        this._showSubLevelItem(id, true)
    };
    this.idPrefix = this._genStr(12);
    dhtmlxEvent(document.body, "click", function(e) {
                if (main_self._unloaded)
                    return;
                if (main_self.context) {
                    e = e || event;
                    if (!_isOpera) {
                        if (main_self.contextAutoHide)
                            main_self._hideContextMenu()
                    } else {
                        if (main_self.contextAutoHide && !e.ctrlKey)
                            main_self._hideContextMenu()
                    }
                } else {
                    main_self._clearAndHide()
                }
            });
    dhtmlxEvent(document.body, "contextmenu", function(e) {
                if (main_self._unloaded)
                    return;
                e = e || event;
                var t = (e.srcElement || e.target).className;
                if (t.search("dhtmlxMenu") != -1 && t.search("SubLevelArea") != -1)
                    return;
                var toHide = true;
                var testZone = e.target || e.srcElement;
                if (testZone.id != null) {
                    if (main_self.isContextZone(testZone.id)) {
                        toHide = false
                    }
                };
                if (toHide)
                    main_self.hideContextMenu()
            });
    this._UID = this._genStr(32);
    dhtmlxMenuObjectLiveInstances[this._UID] = this;
    dhtmlxEventable(this);
    return this
};
dhtmlXMenuObject.prototype.init = function() {
    if (this._isInited == true) {
        return
    };
    if (this.dLoad) {
        this.callEvent("onXLS", []);
        this._xmlLoader.loadXML(this.dLoadUrl + this.dLoadSign + "action=loadMenu&etc=" + new Date().getTime())
    } else {
        this._initTopLevelMenu();
        this._isInited = true
    }
};
dhtmlXMenuObject.prototype._countVisiblePolygonItems = function(id) {
    var count = 0;
    for (var a in this.itemPull) {
        var par = this.itemPull[a]["parent"];
        var tp = this.itemPull[a]["type"];
        if (this.idPull[a] != null) {
            if (par == id && (tp == "item" || tp == "radio" || tp == "checkbox") && this.idPull[a].style.display != "none") {
                count++
            }
        }
    };
    return count
};
dhtmlXMenuObject.prototype._redefineComplexState = function(id) {
    if (this.idPrefix + this.topId == id) {
        return
    };
    if ((this.idPull["polygon_" + id] != null) && (this.idPull[id] != null)) {
        var u = this._countVisiblePolygonItems(id);
        if ((u > 0) && (!this.itemPull[id]["complex"])) {
            this._updateItemComplexState(id, true, false)
        };
        if ((u == 0) && (this.itemPull[id]["complex"])) {
            this._updateItemComplexState(id, false, false)
        }
    }
};
dhtmlXMenuObject.prototype._updateItemComplexState = function(id, state, over) {
    if ((!this.context) && (this._getItemLevelType(id.replace(this.idPrefix, "")) == "TopLevel")) {
        this.itemPull[id]["complex"] = state;
        return
    };
    if ((this.idPull[id] == null) || (this.itemPull[id] == null)) {
        return
    };
    this.itemPull[id]["complex"] = state;
    var arrowObj = null;
    if (id == this.idPrefix + this.topId) {
        return
    };
    for (var q = 0; q < this.idPull[id].childNodes.length; q++) {
        var node = this.idPull[id].childNodes[q];
        if (node.id != null) {
            if (node.id == "arrow_" + id) {
                arrowObj = node
            }
        }
    };
    if (this.itemPull[id]["complex"]) {
        if (arrowObj == null) {
            arrowObj = document.createElement("DIV");
            var arw = "arrow" + (this._rtl ? "r" : "l") + "_" + (this.itemPull[id]["state"] == "enabled" ? "en" : "dis");
            arrowObj.className = "dhtmlxMenu_SubLevelArea_Item_Arrow " + arw;
            arrowObj.id = "arrow_" + id;
            this.idPull[id].appendChild(arrowObj)
        };
        if (this.dLoad && (this.itemPull[id]["loaded"] == "get") && this.loaderIcon) {
            if (arrowObj.className != "dhtmlxMenu_SubLevelArea_Item_Arrow_Loading")
                arrowObj.className = "dhtmlxMenu_SubLevelArea_Item_Arrow_Loading"
        } else {
            var genName = "arrow" + (this._rtl ? "r" : "l") + "_" + (this.itemPull[id]["state"] == "enabled" ? (over ? "over" : "en") : "dis");
            arrowObj.className = "dhtmlxMenu_SubLevelArea_Item_Arrow " + genName
        };
        return
    };
    if ((!this.itemPull[id]["complex"]) && (arrowObj != null)) {
        this.idPull[id].removeChild(arrowObj);
        if (this.itemPull[id]["hotkey_backup"] != null && this.setHotKey) {
            this.setHotKey(id.replace(this.idPrefix, ""), this.itemPull[id]["hotkey_backup"])
        }
    }
};
dhtmlXMenuObject.prototype._getItemLevelType = function(id) {
    return (this.itemPull[this.idPrefix + id]["parent"] == this.idPrefix + this.topId ? "TopLevel" : "SubLevelArea")
};
dhtmlXMenuObject.prototype._redistribTopLevelPositions = function() {
    if (this.context)
        return;
    var w = this._topLevelOffsetLeft;
    if (this._align == "left") {
        for (var q = 0; q < this.base.childNodes.length; q++) {
            if (this.base.childNodes[q].tagName == "DIV") {
                if (String(this.base.childNodes[q].className).search("TopLevel_Text") == -1) {
                    if (!this._rtl) {
                        this.base.childNodes[q].style.right = "";
                        this.base.childNodes[q].style.left = w + "px"
                    } else {
                        this.base.childNodes[q].style.left = "";
                        this.base.childNodes[q].style.right = w + "px"
                    };
                    w += this.base.childNodes[q].offsetWidth;
                    if (this.skin == "dhx_skyblue" && String(this.base.childNodes[q].className).search("Separator") == -1)
                        w += 2
                }
            }
        }
    } else {
        for (var q = this.base.childNodes.length - 1; q >= 0; q--) {
            if (String(this.base.childNodes[q].className).search("TopLevel_Text") == -1) {
                this.base.childNodes[q].style.left = "";
                this.base.childNodes[q].style.right = w + "px";
                w += this.base.childNodes[q].offsetWidth
            }
        }
    }
};
dhtmlXMenuObject.prototype._redistribTopLevelSelection = function(id, parent) {
    var i = this._getSubItemToDeselectByPolygon("parent");
    this._removeSubItemFromSelected(-1, -1);
    for (var q = 0; q < i.length; q++) {
        if (i[q] != id) {
            this._hidePolygon(i[q])
        };
        if ((this.idPull[i[q]] != null) && (i[q] != id)) {
            this.idPull[i[q]].className = this.idPull[i[q]].className.replace(/Selected/g, "Normal")
        }
    };
    if (this.itemPull[this.idPrefix + id]["state"] == "enabled") {
        this.idPull[this.idPrefix + id].className = "dhtmlxMenu_" + this.skin + "_TopLevel_Item_Selected";
        this._addSubItemToSelected(this.idPrefix + id, "parent");
        this.menuSelected = (this.menuMode == "win" ? (this.menuSelected != -1 ? id : this.menuSelected) : id);
        if ((this.itemPull[this.idPrefix + id]["complex"]) && (this.menuSelected != -1)) {
            this._showPolygon(this.idPrefix + id, this.dirTopLevel)
        }
    }
};
dhtmlXMenuObject.prototype._initTopLevelMenu = function() {
    this.dirTopLevel = "bottom";
    this.dirSubLevel = (this._rtl ? "left" : "right");
    if (this.context) {
        this.idPull[this.idPrefix + this.topId] = new Array(0, 0);
        this._addSubMenuPolygon(this.idPrefix + this.topId, this.idPrefix + this.topId);
        this._attachEvents()
    } else {
        var m = this._getMenuNodes(this.idPrefix + this.topId);
        for (var q = 0; q < m.length; q++) {
            if (this.itemPull[m[q]]["type"] == "item")
                this._renderToplevelItem(m[q], null);
            if (this.itemPull[m[q]]["type"] == "separator")
                this._renderSeparator(m[q], null)
        }
    }
};
dhtmlXMenuObject.prototype._attachEvents = function() {
    var main_self = this;
    dhtmlxEvent(document.body, "click", function(e) {
                if (main_self._unloaded)
                    return;
                e = e || event;
                if (_isOpera && e.ctrlKey == true)
                    return;
                if (main_self._isContextMenuVisible() && main_self.contextAutoHide)
                    main_self._hideContextMenu()
            })
};
dhtmlXMenuObject.prototype._renderToplevelItem = function(id, pos) {
    var main_self = this;
    var m = document.createElement("DIV");
    m.id = id;
    if (this.itemPull[id]["state"] == "enabled" && this.itemPull[id]["cssNormal"] != null) {
        m.className = this.itemPull[id]["cssNormal"]
    } else {
        m.className = "dhtmlxMenu_" + this.skin + "_TopLevel_Item_" + (this.itemPull[id]["state"] == "enabled" ? "Normal" : "Disabled")
    };
    m.innerHTML = this.itemPull[id]["title"];
    if (this.itemPull[id]["tip"].length > 0) {
        m.title = this.itemPull[id]["tip"]
    };
    if ((this.itemPull[id]["imgen"] != "") || (this.itemPull[id]["imgdis"] != "")) {
        var imgTop = this.itemPull[id][(this.itemPull[id]["state"] == "enabled") ? "imgen" : "imgdis"];
        if (imgTop) {
            var imgTop = "<img id='image_" + id + "' src='" + this.imagePath + imgTop + "' class='dhtmlxMenu_TopLevel_Item_Icon_" + (this._rtl ? "right" : "left") + "' border='0'>";
            m.innerHTML = imgTop + m.innerHTML;
            m.style.paddingLeft = this.topLevelItemPaddingIconExists + "px"
        }
    };
    m.onselectstart = function(e) {
        e = e || event;
        e.returnValue = false;
        return false
    };
    m.oncontextmenu = function(e) {
        e = e || event;
        e.returnValue = false;
        return false
    };
    if (!this._rtl) {
        var w = 0;
        for (var q = 0; q < this.base.childNodes.length; q++) {
            if (String(this.base.childNodes[q].className).search("TopLevel_Text") == -1) {
                if (!isNaN(this.base.childNodes[q].offsetWidth)) {
                    w = w + this.base.childNodes[q].offsetWidth
                }
            }
        };
        m.style.left = w + "px"
    };
    if (pos != null) {
        pos++;
        if (pos < 0) {
            pos = 0
        };
        if (pos > this.base.childNodes.length - 1) {
            pos = null
        }
    };
    if (pos != null) {
        this.base.insertBefore(m, this.base.childNodes[pos]);
        this._redistribTopLevelPositions()
    } else {
        this.base.appendChild(m);
        if (this._rtl) {
            this._redistribTopLevelPositions()
        }
    };
    this.idPull[m.id] = m;
    if (this.itemPull[id]["complex"] && (!this.dLoad)) {
        this._addSubMenuPolygon(this.itemPull[id]["id"], this.itemPull[id]["id"])
    };
    m.onmouseover = function() {
        if (main_self.menuMode == "web") {
            window.clearTimeout(main_self.menuTimeoutHandler)
        };
        var i = main_self._getSubItemToDeselectByPolygon("parent");
        main_self._removeSubItemFromSelected(-1, -1);
        for (var q = 0; q < i.length; q++) {
            if (i[q] != this.id) {
                main_self._hidePolygon(i[q])
            };
            if ((main_self.idPull[i[q]] != null) && (i[q] != this.id)) {
                if (main_self.itemPull[i[q]]["cssNormal"] != null) {
                    main_self.idPull[i[q]].className = main_self.itemPull[i[q]]["cssNormal"]
                } else {
                    main_self.idPull[i[q]].className = main_self.idPull[i[q]].className.replace(/Selected/g, "Normal")
                }
            }
        };
        if (main_self.itemPull[this.id]["state"] == "enabled") {
            this.className = "dhtmlxMenu_" + main_self.skin + "_TopLevel_Item_Selected";
            main_self._addSubItemToSelected(this.id, "parent");
            main_self.menuSelected = (main_self.menuMode == "win" ? (main_self.menuSelected != -1 ? this.id : main_self.menuSelected) : this.id);
            if (main_self.dLoad && (main_self.itemPull[this.id]["loaded"] == "no")) {
                if (main_self.menuModeTopLevelTimeout && main_self.menuMode == "web" && !main_self.context) {
                    this._mouseOver = true;
                    this._dynLoadTM = new Date().getTime()
                };
                var xmlLoader = new dtmlXMLLoaderObject(main_self._xmlParser, window);
                main_self.itemPull[this.id]["loaded"] = "get";
                main_self.callEvent("onXLS", []);
                xmlLoader.loadXML(main_self.dLoadUrl + main_self.dLoadSign + "action=loadMenu&parentId=" + this.id.replace(main_self.idPrefix, "") + "&etc=" + new Date().getTime())
            };
            if ((!main_self.dLoad) || (main_self.dLoad && (main_self.itemPull[this.id]["loaded"] == "yes"))) {
                if ((main_self.itemPull[this.id]["complex"]) && (main_self.menuSelected != -1)) {
                    if (main_self.menuModeTopLevelTimeout && main_self.menuMode == "web" && !main_self.context) {
                        this._mouseOver = true;
                        var showItemId = this.id;
                        this._menuOpenTM = window.setTimeout(function() {
                                    main_self._showPolygon(showItemId, main_self.dirTopLevel)
                                }, main_self.menuModeTopLevelTimeoutTime)
                    } else {
                        main_self._showPolygon(this.id, main_self.dirTopLevel)
                    }
                }
            }
        };
        main_self._doOnTouchMenu(this.id.replace(main_self.idPrefix, ""))
    };
    m.onmouseout = function() {
        if (!((main_self.itemPull[this.id]["complex"]) && (main_self.menuSelected != -1)) && (main_self.itemPull[this.id]["state"] == "enabled")) {
            if (main_self.itemPull[this.id]["cssNormal"] != null) {
                m.className = main_self.itemPull[this.id]["cssNormal"]
            } else {
                m.className = "dhtmlxMenu_" + main_self.skin + "_TopLevel_Item_Normal"
            }
        };
        if (main_self.menuMode == "web") {
            window.clearTimeout(main_self.menuTimeoutHandler);
            main_self.menuTimeoutHandler = window.setTimeout(function() {
                        main_self._clearAndHide()
                    }, main_self.menuTimeoutMsec, "JavaScript")
        };
        if (main_self.menuModeTopLevelTimeout && main_self.menuMode == "web" && !main_self.context) {
            this._mouseOver = false;
            window.clearTimeout(this._menuOpenTM)
        }
    };
    m.onclick = function(e) {
        if (main_self.menuMode == "web") {
            window.clearTimeout(main_self.menuTimeoutHandler)
        };
        if (main_self.menuMode != "web" && main_self.itemPull[this.id]["state"] == "disabled") {
            return
        };
        e = e || event;
        e.cancelBubble = true;
        e.returnValue = false;
        if (main_self.menuMode == "win") {
            if (main_self.itemPull[this.id]["complex"]) {
                if (main_self.menuSelected == this.id) {
                    main_self.menuSelected = -1;
                    var s = false
                } else {
                    main_self.menuSelected = this.id;
                    var s = true
                };
                if (s) {
                    main_self._showPolygon(this.id, main_self.dirTopLevel)
                } else {
                    main_self._hidePolygon(this.id)
                }
            }
        };
        var tc = (main_self.itemPull[this.id]["complex"] ? "c" : "-");
        var td = (main_self.itemPull[this.id]["state"] != "enabled" ? "d" : "-");
        var cas = {
            "ctrl" : e.ctrlKey,
            "alt" : e.altKey,
            "shift" : e.shiftKey
        };
        main_self._doOnClick(this.id.replace(main_self.idPrefix, ""), tc + td + "t", cas);
        return false
    }
};
dhtmlXMenuObject.prototype.setImagePath = function() {
};
dhtmlXMenuObject.prototype.setIconsPath = function(path) {
    this.imagePath = path
};
dhtmlXMenuObject.prototype.setIconPath = dhtmlXMenuObject.prototype.setIconsPath;
dhtmlXMenuObject.prototype._updateItemImage = function(id, levelType) {
    var imgObj = null;
    for (var q = 0; q < this.idPull[this.idPrefix + id].childNodes.length; q++) {
        var node = this.idPull[this.idPrefix + id].childNodes[q];
        if (node.id != null) {
            if (node.id == "image_" + this.idPrefix + id) {
                imgObj = node
            }
        }
    };
    if (this.itemPull[this.idPrefix + id]["type"] == "radio") {
        var imgSrc = this.itemPull[this.idPrefix + id][(this.itemPull[this.idPrefix + id]["state"] == "enabled" ? "imgen" : "imgdis")]
    } else {
        var imgSrc = this.itemPull[this.idPrefix + id][(this.itemPull[this.idPrefix + id]["state"] == "enabled" ? "imgen" : "imgdis")]
    };
    if (imgSrc.length > 0) {
        if (imgObj != null) {
            var tp = this.itemPull[this.idPrefix + id]["type"];
            if (tp == "checkbox" || tp == "radio") {
                imgObj.className = "dhtmlxMenu_SubLevelArea_Item_Icon " + imgSrc
            } else {
                if (String(imgObj.className).search("dhtmlxMenu_TopLevel_Item_Icon") === 0) {
                    imgObj.src = this.imagePath + imgSrc
                } else {
                    imgObj.style.backgroundImage = "url('" + this.imagePath + imgSrc + "')"
                }
            }
        } else {
            if (levelType == "TopLevel") {
                var newImgObj = document.createElement("IMG");
                newImgObj.className = "dhtmlxMenu_" + levelType + "_Item_Icon_" + (this._rtl ? "right" : "left");
                newImgObj.src = this.imagePath + imgSrc;
                newImgObj.border = "0";
                newImgObj.id = "image_" + this.idPrefix + id;
                this.idPull[this.idPrefix + id].appendChild(newImgObj);
                this.idPull[this.idPrefix + id].style.paddingLeft = (this._rtl ? this.topLevelItemPaddingIconNotExists : this.topLevelItemPaddingIconExists) + "px";
                this.idPull[this.idPrefix + id].style.paddingRight = (this._rtl ? this.topLevelItemPaddingIconExists : this.topLevelItemPaddingIconNotExists) + "px"
            } else {
                var newImgObj = document.createElement("DIV");
                newImgObj.className = "dhtmlxMenu_" + levelType + "_Item_Icon";
                newImgObj.style.backgroundImage = "url('" + this.imagePath + imgSrc + "')";
                newImgObj.id = "image_" + this.idPrefix + id;
                this.idPull[this.idPrefix + id].appendChild(newImgObj)
            }
        }
    } else {
        if (imgObj != null) {
            this.idPull[this.idPrefix + id].removeChild(imgObj);
            if (levelType == "TopLevel") {
                this.idPull[this.idPrefix + id].style.paddingLeft = this.topLevelItemPaddingIconNotExists + "px";
                this.idPull[this.idPrefix + id].style.paddingRight = this.topLevelItemPaddingIconNotExists + "px"
            }
        }
    }
};
dhtmlXMenuObject.prototype.removeItem = function(id) {
    id = this.idPrefix + id;
    if (this.itemPull[id] == null) {
        return
    };
    var parentId = this.itemPull[id]["parent"];
    if (this.itemPull[id]["type"] == "separator") {
        this.idPull["separator_" + id].parentNode.removeChild(this.idPull["separator_" + id]);
        delete this.idPull["separator_" + id];
        delete this.itemPull[id]
    } else {
        if (this.itemPull[id]["complex"]) {
            var items = this._getAllParents(id);
            items[items.length] = id;
            var polygons = new Array();
            for (var q = 0; q < items.length; q++) {
                if (this.itemPull[items[q]]["type"] == "separator") {
                    this.removeItem(items[q].replace(this.idPrefix, ""))
                } else {
                    if (this.itemPull[items[q]]["complex"]) {
                        polygons[polygons.length] = items[q]
                    };
                    this.idPull[items[q]].parentNode.removeChild(this.idPull[items[q]]);
                    delete this.idPull[items[q]];
                    delete this.itemPull[items[q]]
                }
            };
            for (var q = 0; q < polygons.length; q++) {
                this.idPull["polygon_" + polygons[q]].parentNode.removeChild(this.idPull["polygon_" + polygons[q]]);
                if (this._isIE6) {
                    var pId = "polygon_" + polygons[q] + "_ie6cover";
                    if (this.idPull[pId] != null) {
                        document.body.removeChild(this.idPull[pId]);
                        delete this.idPull[pId]
                    }
                };
                delete this.idPull["polygon_" + polygons[q]];
                delete this.itemPull[polygons[q]]
            };
            if (!this.context) {
                this._redistribTopLevelPositions()
            }
        } else {
            this.idPull[id].parentNode.removeChild(this.idPull[id]);
            delete this.idPull[id];
            delete this.itemPull[id]
        }
    };
    if (this.idPull["polygon_" + parentId] != null) {
        if (this.idPull["polygon_" + parentId].childNodes.length == 0) {
            document.body.removeChild(this.idPull["polygon_" + parentId]);
            if (this._isIE6) {
                var pId = "polygon_" + parentId + "_ie6cover";
                if (this.idPull[pId] != null) {
                    document.body.removeChild(this.idPull[pId]);
                    delete this.idPull[pId]
                }
            };
            delete this.idPull["polygon_" + parentId];
            this._updateItemComplexState(parentId, false, false)
        }
    }
};
dhtmlXMenuObject.prototype._getAllParents = function(id) {
    var parents = new Array();
    for (var a in this.itemPull) {
        if (this.itemPull[a]["parent"] == id) {
            parents[parents.length] = this.itemPull[a]["id"];
            if (this.itemPull[a]["complex"]) {
                var t = this._getAllParents(this.itemPull[a]["id"]);
                for (var q = 0; q < t.length; q++) {
                    parents[parents.length] = t[q]
                }
            }
        }
    };
    return parents
};
dhtmlXMenuObject.prototype.renderAsContextMenu = function() {
    this.context = true;
    if (this.base._autoSkinUpdate == true) {
        this.base.className = this.base.className.replace("dhtmlxMenu_" + this.skin + "_Middle", "");
        this.base._autoSkinUpdate = false
    };
    if (this.addBaseIdAsContextZone != null) {
        this.addContextZone(this.addBaseIdAsContextZone)
    }
};
dhtmlXMenuObject.prototype.addContextZone = function(zoneId) {
    var zone = document.getElementById(zoneId);
    var zoneExists = false;
    for (var a in this.contextZones) {
        zoneExists = zoneExists || (a == zoneId) || (this.contextZones[a] == zone)
    };
    if (zoneExists == true)
        return false;
    this.contextZones[zoneId] = zone;
    var main_self = this;
    if (_isOpera) {
        zone.attachEvent("mouseup", function(e) {
                    for (var q in dhtmlxMenuObjectLiveInstances) {
                        if (q != main_self._UID) {
                            if (dhtmlxMenuObjectLiveInstances[q].context) {
                                dhtmlxMenuObjectLiveInstances[q]._hideContextMenu()
                            }
                        }
                    };
                    e.cancelBubble = true;
                    e.returnValue = false;
                    if (e.button == 0 && e.ctrlKey == true) {
                        main_self._doOnContextBeforeCall(e, this)
                    };
                    return false
                })
    } else {
        if (zone.oncontextmenu != null) {
            zone._oldContextMenuHandler = zone.oncontextmenu
        };
        zone.oncontextmenu = function(e) {
            for (var q in dhtmlxMenuObjectLiveInstances) {
                if (q != main_self._UID) {
                    if (dhtmlxMenuObjectLiveInstances[q].context) {
                        dhtmlxMenuObjectLiveInstances[q]._hideContextMenu()
                    }
                }
            };
            e = e || event;
            e.cancelBubble = true;
            e.returnValue = false;
            main_self._doOnContextBeforeCall(e, this);
            return false
        }
    }
};
dhtmlXMenuObject.prototype.removeContextZone = function(zoneId) {
    if (!this.isContextZone(zoneId))
        return false;
    var zone = this.contextZones[zoneId];
    if (_isOpera) {
        zone.onmouseup = null
    } else {
        zone.oncontextmenu = (zone._oldContextMenuHandler != null ? zone._oldContextMenuHandler : null)
    };
    delete this.contextZones[zoneId];
    return true
};
dhtmlXMenuObject.prototype.isContextZone = function(zoneId) {
    var isZone = false;
    if (this.contextZones[zoneId] != null) {
        if (this.contextZones[zoneId] == document.getElementById(zoneId))
            isZone = true
    };
    return isZone
};
dhtmlXMenuObject.prototype._isContextMenuVisible = function() {
    if (this.idPull["polygon_" + this.idPrefix + this.topId] == null)
        return false;
    return (this.idPull["polygon_" + this.idPrefix + this.topId].style.display == "")
};
dhtmlXMenuObject.prototype._showContextMenu = function(x, y, zoneId) {
    if (this.idPull["polygon_" + this.idPrefix + this.topId] == null)
        return false;
    window.clearTimeout(this.menuTimeoutHandler);
    this.idPull[this.idPrefix + this.topId] = new Array(x, y);
    this._showPolygon(this.idPrefix + this.topId, "bottom");
    this.callEvent("onContextMenu", [zoneId])
};
dhtmlXMenuObject.prototype._hideContextMenu = function() {
    if (this.idPull["polygon_" + this.idPrefix + this.topId] == null)
        return false;
    this._clearAndHide();
    this._hidePolygon(this.idPrefix + this.topId);
    this.zInd = this.zIndInit
};
dhtmlXMenuObject.prototype._doOnContextBeforeCall = function(e, cZone) {
    this.contextMenuZoneId = cZone.id;
    this._clearAndHide();
    this._hideContextMenu();
    var p = (e.srcElement || e.target);
    var px = (_isIE || _isOpera || _KHTMLrv ? e.offsetX : e.layerX);
    var py = (_isIE || _isOpera || _KHTMLrv ? e.offsetY : e.layerY);
    var mx = getAbsoluteLeft(p) + px;
    var my = getAbsoluteTop(p) + py;
    if (this.checkEvent("onBeforeContextMenu")) {
        if (this.callEvent("onBeforeContextMenu", [cZone.id])) {
            if (this.contextAutoShow) {
                this._showContextMenu(mx, my);
                this.callEvent("onAfterContextMenu", [cZone.id])
            }
        }
    } else {
        if (this.contextAutoShow) {
            this._showContextMenu(mx, my);
            this.callEvent("onAfterContextMenu", [cZone.id])
        }
    }
};
dhtmlXMenuObject.prototype.showContextMenu = function(x, y) {
    this._showContextMenu(x, y, false)
};
dhtmlXMenuObject.prototype.hideContextMenu = function() {
    this._hideContextMenu()
};
dhtmlXMenuObject.prototype._autoDetectVisibleArea = function() {
    if (this._isVisibleArea)
        return;
    this.menuX1 = document.body.scrollLeft;
    this.menuX2 = this.menuX1 + (window.innerWidth || document.body.clientWidth);
    this.menuY1 = Math.max((_isIE ? document.documentElement : document.getElementsByTagName("html")[0]).scrollTop, document.body.scrollTop);
    this.menuY2 = this.menuY1 + (_isIE ? Math.max(document.documentElement.clientHeight || 0, document.documentElement.offsetHeight || 0, document.body.clientHeight || 0) : window.innerHeight)
};
dhtmlXMenuObject.prototype.getItemPosition = function(id) {
    id = this.idPrefix + id;
    var pos = -1;
    if (this.itemPull[id] == null) {
        return pos
    };
    var parent = this.itemPull[id]["parent"];
    var obj = (this.idPull["polygon_" + parent] != null ? this.idPull["polygon_" + parent] : this.base);
    for (var q = 0; q < obj.childNodes.length; q++) {
        if (obj.childNodes[q] == this.idPull["separator_" + id] || obj.childNodes[q] == this.idPull[id]) {
            pos = q
        }
    };
    return pos
};
dhtmlXMenuObject.prototype.setItemPosition = function(id, pos) {
    id = this.idPrefix + id;
    if (this.idPull[id] == null) {
        return
    };
    var isOnTopLevel = (this.itemPull[id]["parent"] == this.idPrefix + this.topId);
    var itemData = this.idPull[id];
    var itemPos = this.getItemPosition(id.replace(this.idPrefix, ""));
    var parent = this.itemPull[id]["parent"];
    var obj = (this.idPull["polygon_" + parent] != null ? this.idPull["polygon_" + parent] : this.base);
    obj.removeChild(obj.childNodes[itemPos]);
    if (pos < 0) {
        pos = 0
    };
    if (isOnTopLevel && pos < 1) {
        pos = 1
    };
    if (pos < obj.childNodes.length) {
        obj.insertBefore(itemData, obj.childNodes[pos])
    } else {
        obj.appendChild(itemData)
    };
    if (isOnTopLevel) {
        this._redistribTopLevelPositions()
    }
};
dhtmlXMenuObject.prototype.getParentId = function(id) {
    id = this.idPrefix + id;
    if (this.itemPull[id] == null) {
        return null
    };
    return ((this.itemPull[id]["parent"] != null ? this.itemPull[id]["parent"] : this.topId).replace(this.idPrefix, ""))
};
dhtmlXMenuObject.prototype.addNewSibling = function(nextToId, itemId, itemText, disabled, imgEnabled, imgDisabled) {
    var id = this.idPrefix + (itemId != null ? itemId : this._genStr(24));
    var parentId = this.idPrefix + (nextToId != null ? this.getParentId(nextToId) : this.topId);
    this._addItemIntoGlobalStrorage(id, parentId, itemText, "item", disabled, imgEnabled, imgDisabled);
    if ((parentId == this.idPrefix + this.topId) && (!this.context)) {
        this._renderToplevelItem(id, this.getItemPosition(nextToId));
        this._redistribTopLevelPositions()
    } else {
        this._renderSublevelItem(id, this.getItemPosition(nextToId))
    }
};
dhtmlXMenuObject.prototype.addNewChild = function(parentId, pos, itemId, itemText, disabled, imgEnabled, imgDisabled) {
    if (parentId == null) {
        if (this.context) {
            parentId = this.topId
        } else {
            this.addNewSibling(parentId, itemId, itemText, disabled, imgEnabled, imgDisabled);
            if (pos != null)
                this.setItemPosition(itemId, pos);
            return
        }
    };
    itemId = this.idPrefix + (itemId != null ? itemId : this._genStr(24));
    if (this.setHotKey)
        this.setHotKey(parentId, "");
    parentId = this.idPrefix + parentId;
    this._addItemIntoGlobalStrorage(itemId, parentId, itemText, "item", disabled, imgEnabled, imgDisabled);
    if (this.idPull["polygon_" + parentId] == null) {
        this._renderSublevelPolygon(parentId, parentId)
    };
    this._renderSublevelItem(itemId, pos - 1);
    this._redefineComplexState(parentId)
};
dhtmlXMenuObject.prototype._addItemIntoGlobalStrorage = function(itemId, itemParentId, itemText, itemType, disabled, img, imgDis) {
    var item = {
        id : itemId,
        title : itemText,
        imgen : (img != null ? img : ""),
        imgdis : (imgDis != null ? imgDis : ""),
        type : itemType,
        state : (disabled == true ? "disabled" : "enabled"),
        parent : itemParentId,
        complex : false,
        hotkey : "",
        tip : ""
    };
    this.itemPull[item.id] = item
};
dhtmlXMenuObject.prototype._addSubMenuPolygon = function(id, parentId) {
    var s = this._renderSublevelPolygon(id, parentId);
    var j = this._getMenuNodes(parentId);
    for (q = 0; q < j.length; q++) {
        if (this.itemPull[j[q]]["type"] == "separator") {
            this._renderSeparator(j[q], null)
        } else {
            this._renderSublevelItem(j[q], null)
        }
    };
    if (id == parentId) {
        var level = "topLevel"
    } else {
        var level = "subLevel"
    };
    for (var q = 0; q < j.length; q++) {
        if (this.itemPull[j[q]]["complex"]) {
            this._addSubMenuPolygon(id, this.itemPull[j[q]]["id"])
        }
    }
};
dhtmlXMenuObject.prototype._renderSublevelPolygon = function(id, parentId) {
    var s = document.createElement("DIV");
    s.className = "dhtmlxMenu_" + this.skin + "_SubLevelArea_Polygon_" + (this._rtl ? "right" : "left");
    s.oncontextmenu = function(e) {
        e = e || event;
        e.returnValue = false;
        e.canceBubble = true;
        return false
    };
    s.id = "polygon_" + parentId;
    s.onclick = function(e) {
        e = e || event;
        e.cancelBubble = true
    };
    s.style.display = "none";
    document.body.insertBefore(s, document.body.firstChild);
    this.idPull[s.id] = s;
    if (this.sxDacProc != null) {
        this.idPull["sxDac_" + parentId] = new this.sxDacProc(s, s.className);
        if (_isIE) {
            this.idPull["sxDac_" + parentId]._setSpeed(this.dacSpeedIE);
            this.idPull["sxDac_" + parentId]._setCustomCycle(this.dacCyclesIE)
        } else {
            this.idPull["sxDac_" + parentId]._setSpeed(this.dacSpeed);
            this.idPull["sxDac_" + parentId]._setCustomCycle(this.dacCycles)
        }
    };
    return s
};
dhtmlXMenuObject.prototype._renderSublevelItem = function(id, pos) {
    var main_self = this;
    var k = document.createElement("DIV");
    if (this.itemPull[id]["state"] == "enabled") {
        k.className = "dhtmlxMenu_" + this.skin + "_SubLevelArea_Item_Normal";
        var arw = "arrow" + (this._rtl ? "r" : "l") + "_en";
        j_icon = this.itemPull[id]["imgen"]
    } else {
        k.className = "dhtmlxMenu_" + this.skin + "_SubLevelArea_Item_Disabled";
        var arw = "arrow" + (this._rtl ? "r" : "l") + "_dis";
        j_icon = this.itemPull[id]["imgdis"]
    };
    if (this.itemPull[id]["complex"]) {
        var j_nodes = "<div class='dhtmlxMenu_SubLevelArea_Item_Arrow " + arw + "' id='arrow_" + this.itemPull[id]["id"] + "'>"
    } else {
        var j_nodes = ""
    };
    if (j_icon.length > 0) {
        var tp = this.itemPull[id]["type"];
        if (tp == "checkbox" || tp == "radio")
            j_icon = "<div id='image_" + this.itemPull[id]["id"] + "' class='dhtmlxMenu_SubLevelArea_Item_Icon " + j_icon + "'></div>";
        if (!(tp == "checkbox" || tp == "radio"))
            j_icon = "<div id='image_" + this.itemPull[id]["id"] + "' class='dhtmlxMenu_SubLevelArea_Item_Icon' style='background-image:url(\"" + this.imagePath + j_icon + "\");'></div>"
    };
    k.innerHTML = j_icon + this.itemPull[id]["title"] + j_nodes;
    if (this.itemPull[id]["hotkey"].length > 0 && !this.itemPull[id]["complex"]) {
        var p = "";
        k.innerHTML += "<div class='dhtmlxMenu_SubLevelArea_Item_HotKey'>" + this.itemPull[id]["hotkey"] + "</div>"
    };
    k.id = this.itemPull[id]["id"];
    k.parent = this.itemPull[id]["parent"];
    if (this.itemPull[id]["tip"].length > 0) {
        k.title = this.itemPull[id]["tip"]
    };
    k.onselectstart = function(e) {
        e = e || event;
        e.returnValue = false
    };
    k.onmouseover = function() {
        if (main_self.menuMode == "web") {
            window.clearTimeout(main_self.menuTimeoutHandler)
        };
        main_self._redistribSubLevelSelection(this.id, this.parent)
    };
    if (main_self.menuMode == "web") {
        k.onmouseout = function() {
            window.clearTimeout(main_self.menuTimeoutHandler);
            main_self.menuTimeoutHandler = window.setTimeout(function() {
                        main_self._clearAndHide()
                    }, main_self.menuTimeoutMsec, "JavaScript")
        }
    };
    k.onclick = function(e) {
        if (!main_self.checkEvent("onClick") && main_self.itemPull[this.id]["complex"]) {
            return
        };
        e = e || event;
        e.cancelBubble = true;
        e.returnValue = false;
        tc = (main_self.itemPull[this.id]["complex"] ? "c" : "-");
        td = (main_self.itemPull[this.id]["state"] == "enabled" ? "-" : "d");
        var cas = {
            "ctrl" : e.ctrlKey,
            "alt" : e.altKey,
            "shift" : e.shiftKey
        };
        switch (main_self.itemPull[this.id]["type"]) {
            case "checkbox" :
                main_self._checkboxOnClickHandler(this.id.replace(main_self.idPrefix, ""), tc + td + "n", cas);
                break;
            case "radio" :
                main_self._radioOnClickHandler(this.id.replace(main_self.idPrefix, ""), tc + td + "n", cas);
                break;
            case "item" :
                main_self._doOnClick(this.id.replace(main_self.idPrefix, ""), tc + td + "n", cas);
                break
        };
        return false
    };
    var polygon = this.idPull["polygon_" + this.itemPull[id]["parent"]];
    if (pos != null) {
        pos++;
        if (pos < 0) {
            pos = 0
        };
        if (pos > polygon.childNodes.length - 1) {
            pos = null
        }
    };
    if (pos != null) {
        polygon.insertBefore(k, polygon.childNodes[pos])
    } else {
        polygon.appendChild(k)
    };
    this.idPull[k.id] = k
};
dhtmlXMenuObject.prototype._renderSeparator = function(id, pos) {
    var level = (this.context ? "SubLevelArea" : (this.itemPull[id]["parent"] == this.idPrefix + this.topId ? "TopLevel" : "SubLevelArea"));
    if (level == "topLevel" && this.context)
        return;
    var main_self = this;
    var k = document.createElement("DIV");
    k.id = "separator_" + id;
    k.className = "dhtmlxMenu_" + this.skin + "_" + level + "_Separator";
    k.onselectstart = function(e) {
        e = e || event;
        e.returnValue = false
    };
    k.onclick = function(e) {
        e = e || event;
        e.cancelBubble = true;
        var cas = {
            "ctrl" : e.ctrlKey,
            "alt" : e.altKey,
            "shift" : e.shiftKey
        };
        main_self._doOnClick(this.id.replace("separator_" + main_self.idPrefix, ""), "--s", cas)
    };
    if (level == "TopLevel") {
        if (pos != null) {
            pos++;
            if (pos < 0) {
                pos = 0
            };
            if (this.base.childNodes[pos] != null) {
                this.base.insertBefore(k, this.base.childNodes[pos])
            } else {
                this.base.appendChild(k)
            };
            this._redistribTopLevelPositions()
        } else {
            var last = this.base.childNodes[this.base.childNodes.length - 1];
            if (String(last).search("TopLevel_Text") == -1) {
                this.base.appendChild(k)
            } else {
                this.base.insertBefore(k, last)
            }
        }
    } else {
        var polygon = this.idPull["polygon_" + this.itemPull[id]["parent"]];
        if (pos != null) {
            pos++;
            if (pos < 0) {
                pos = 0
            };
            if (pos > polygon.childNodes.length - 1) {
                pos = null
            }
        };
        if (pos != null) {
            polygon.insertBefore(k, polygon.childNodes[pos])
        } else {
            polygon.appendChild(k)
        }
    };
    this.idPull[k.id] = k
};
dhtmlXMenuObject.prototype.addNewSeparator = function(nextToId, itemId) {
    itemId = this.idPrefix + (itemId != null ? itemId : this._genStr(24));
    var parentId = this.idPrefix + this.getParentId(nextToId);
    this._addItemIntoGlobalStrorage(itemId, parentId, "", "separator", false, "", "");
    this._renderSeparator(itemId, this.getItemPosition(nextToId))
};
dhtmlXMenuObject.prototype.hide = function() {
    this._clearAndHide()
};
dhtmlXMenuObject.prototype.clearAll = function() {
    for (var a in this.itemPull) {
        if (this.itemPull[a]["parent"] == this.idPrefix + this.topId) {
            this.removeItem(String(a).replace(this.idPrefix, ""))
        }
    };
    this._isInited = false
};
dhtmlXMenuObject.prototype.unload = function() {
    var obj = this.idPull;
    for (var a in obj) {
        var el = obj[a];
        el.onmouseover = null;
        el.onmouseout = null;
        el.onclick = null;
        el.onselectstart = null;
        el.oncontextmenu = null;
        if (el.parentNode)
            el.parentNode.removeChild(el);
        el = null;
        obj[a] = null;
        try {
            delete obj[a]
        } catch (e) {
        }
    };
    this.idPull = null;
    for (var a in this.itemPull)
        this.itemPull[a] = null;
    this.itemPull = null;
    if (this.base != null) {
        this.base.className = "";
        this.base.oncontextmenu = null;
        this.base.onselectstart = null;
        this.base = null
    };
    this.setSkin = null;
    var basicMethods = new Array("_enableDacSupport", "_selectedSubItems", "_openedPolygons", "_addSubItemToSelected", "_removeSubItemFromSelected", "_getSubItemToDeselectByPolygon", "_hidePolygon", "_showPolygon", "_redistribSubLevelSelection", "_doOnClick", "_doOnTouchMenu", "_searchMenuNode", "_getMenuNodes", "_genStr", "getItemType", "forEachItem", "_clearAndHide", "_doOnLoad", "loadXML", "loadXMLString", "_buildMenu", "_xmlParser", "_xmlLoader", "_showSubLevelItem", "_hideSubLevelItem", "init", "_countVisiblePolygonItems", "_redefineComplexState", "_updateItemComplexState", "_getItemLevelType", "_redistribTopLevelPositions", "_redistribTopLevelSelection", "_initTopLevelMenu", "hide", "_attachEvents", "_renderToplevelItem", "setImagePath", "setIconsPath", "setIconPath",
            "_updateItemImage", "removeItem", "_getAllParents", "renderAsContextMenu", "addContextZone", "removeContextZone", "isContextZone", "_isContextMenuVisible", "_showContextMenu", "_doOnContextBeforeCall", "showContextMenu", "hideContextMenu", "_autoDetectVisibleArea", "getItemPosition", "setItemPosition", "getParentId", "addNewSibling", "addNewChild", "_addItemIntoGlobalStrorage", "_addSubMenuPolygon", "_renderSublevelPolygon", "_renderSublevelItem", "clearAll", "_renderSeparator", "addNewSeparator", "attachEvent", "callEvent", "checkEvent", "eventCatcher", "detachEvent", "dhx_Event", "unload", "_hideContextMenu", "items", "radio", "dacCycles", "dacCyclesIE");
    for (var q = 0; q < basicMethods.length; q++)
        this[basicMethods[q]] = null;
    basicMethods = null;
    var extMethods = new Array("setItemEnabled", "setItemDisabled", "isItemEnabled", "_changeItemState", "getItemText", "setItemText", "loadFromHTML", "hideItem", "showItem", "isItemHidden", "_changeItemVisible", "setUserData", "getUserData", "setOpenMode", "setWebModeTimeout", "enableDynamicLoading", "_updateLoaderIcon", "getItemImage", "setItemImage", "clearItemImage", "setAutoShowMode", "setAutoHideMode", "setContextMenuHideAllMode", "getContextMenuHideAllMode", "setVisibleArea", "setTooltip", "getTooltip", "setHotKey", "getHotKey", "setItemSelected", "setTopText", "setRTL", "setAlign", "setHref", "clearHref", "getCircuit", "_clearAllSelectedSubItemsInPolygon", "_checkArrowsState", "contextZones", "_addUpArrow", "_addDownArrow", "_removeUpArrow", "_removeDownArrow", "_isArrowExists",
            "_doScrollUp", "_doScrollDown", "_countPolygonItems", "setOverflowHeight", "_getRadioImgObj", "_setRadioState", "_radioOnClickHandler", "userData", "getRadioChecked", "setRadioChecked", "addRadioButton", "_getCheckboxState", "_setCheckboxState", "_readLevel", "_updateCheckboxImage", "_checkboxOnClickHandler", "setCheckboxState", "getCheckboxState", "addCheckbox", "serialize");
    for (var q = 0; q < extMethods.length; q++)
        this[extMethods[q]] = null;
    extMethods = null;
    this.extendedModule = null;
    this._unloaded = true;
    dhtmlxMenuObjectLiveInstances[this._UID] = null;
    this._UID = null
};
var dhtmlxMenuObjectLiveInstances = {};
(function() {
    dhtmlx.extend_api("dhtmlXMenuObject", {
                _init : function(obj) {
                    return [obj.parent, obj.skin]
                },
                align : "setAlign",
                top_text : "setTopText",
                context : "renderAsContextMenu",
                icon_path : "setIconsPath",
                open_mode : "setOpenMode",
                rtl : "setRTL",
                skin : "setSkin",
                dynamic : "enableDynamicLoading",
                xml : "loadXML",
                items : "items",
                overflow : "setOverflowHeight"
            }, {
                items : function(arr, parent) {
                    var pos = 100000;
                    var lastItemId = null;
                    for (var i = 0; i < arr.length; i++) {
                        var item = arr[i];
                        if (item.type == "separator") {
                            this.addNewSeparator(lastItemId, pos, item.id);
                            lastItemId = item.id
                        } else {
                            this.addNewChild(parent, pos, item.id, item.text, item.disabled, item.img, item.img_disabled);
                            lastItemId = item.id;
                            if (item.items)
                                this.items(item.items, item.id)
                        }
                    }
                }
            })
})();