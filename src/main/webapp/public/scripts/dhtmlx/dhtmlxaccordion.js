

function dhtmlXAccordionItem() {
};
function dhtmlXAccordion(baseId, skin) {
    if (!dhtmlXContainer) {
        alert("dhtmlxcontainer.js is missed on the page");
        return
    };
    var that = this;
    this.skin = (skin != null ? skin : "dhx_skyblue");
    if (baseId == document.body) {
        this._isAccFS = true;
        document.body.className += " dhxacc_fullscreened";
        var contObj = document.createElement("DIV");
        contObj.className = "dhxcont_global_layout_area";
        baseId.appendChild(contObj);
        this.cont = new dhtmlXContainer(baseId);
        this.cont.setContent(contObj);
        baseId.adjustContent(baseId, 0);
        this.base = document.createElement("DIV");
        this.base.className = "dhx_acc_base_" + this.skin;
        this.base.style.overflow = "hidden";
        this.base.style.position = "absolute";
        this._adjustToFullScreen = function() {
            this.base.style.left = "2px";
            this.base.style.top = "2px";
            this.base.style.width = parseInt(contObj.childNodes[0].style.width) - 4 + "px";
            this.base.style.height = parseInt(contObj.childNodes[0].style.height) - 4 + "px"
        };
        this._adjustToFullScreen();
        contObj.childNodes[0].appendChild(this.base);
        this._resizeTM = null;
        this._resizeTMTime = 400;
        this._doOnResize = function() {
            window.clearTimeout(that._resizeTM);
            that._resizeTM = window.setTimeout(function() {
                        that._adjustAccordion()
                    }, that._resizeTMTime)
        };
        this._adjustAccordion = function() {
            document.body.adjustContent(document.body, 0);
            this._adjustToFullScreen();
            this.setSizes()
        };
        dhtmlxEvent(window, "resize", this._doOnResize)
    } else {
        this.base = (typeof(baseId) == "string" ? document.getElementById(baseId) : baseId);
        this.base.className = "dhx_acc_base_" + this.skin
    };
    this.w = this.base.offsetWidth;
    this.h = this.base.offsetHeight;
    this.skinParams = {
        "standard" : {
            "cell_height" : 26,
            "cell_space" : 1,
            "content_offset" : 1
        },
        "dhx_blue" : {
            "cell_height" : 24,
            "cell_space" : 1,
            "content_offset" : 1
        },
        "dhx_skyblue" : {
            "cell_height" : 27,
            "cell_space" : -1,
            "content_offset" : -1
        },
        "dhx_black" : {
            "cell_height" : 24,
            "cell_space" : 1,
            "content_offset" : 1
        },
        "aqua_dark" : {
            "cell_height" : 22,
            "cell_space" : 1,
            "content_offset" : 1
        },
        "aqua_orange" : {
            "cell_height" : 22,
            "cell_space" : 1,
            "content_offset" : 1
        },
        "aqua_sky" : {
            "cell_height" : 22,
            "cell_space" : 1,
            "content_offset" : 1
        },
        "clear_blue" : {
            "cell_height" : 24,
            "cell_space" : 1,
            "content_offset" : 1
        },
        "clear_green" : {
            "cell_height" : 24,
            "cell_space" : 1,
            "content_offset" : 1
        },
        "clear_silver" : {
            "cell_height" : 24,
            "cell_space" : 1,
            "content_offset" : 1
        },
        "modern_black" : {
            "cell_height" : 29,
            "cell_space" : 1,
            "content_offset" : 1
        },
        "modern_blue" : {
            "cell_height" : 29,
            "cell_space" : 1,
            "content_offset" : 1
        },
        "modern_red" : {
            "cell_height" : 29,
            "cell_space" : 1,
            "content_offset" : 1
        }
    };
    this.sk = this.skinParams[this.skin];
    this.setSkinParameters = function(cellSpace, contentOffset) {
        if (!isNaN(cellSpace))
            this.sk["cell_space"] = cellSpace;
        if (!isNaN(contentOffset))
            this.sk["content_offset"] = contentOffset;
        this._reopenItem()
    };
    this.setSkin = function(skin) {
        if (!this.skinParams[skin])
            return;
        this.skin = skin;
        this.sk = this.skinParams[this.skin];
        this.base.className = "dhx_acc_base_" + this.skin;
        for (var a in this.idPull)
            this.idPull[a].skin = this.skin;
        this._reopenItem()
    };
    this.idPull = {};
    this.opened = null;
    this.cells = function(itemId) {
        if (this.idPull[itemId] == null) {
            return null
        };
        return this.idPull[itemId]
    };
    this.itemH = 90;
    this.multiMode = false;
    this.enableMultiMode = function() {
        var totalItems = 0;
        for (var a in this.idPull)
            totalItems++;
        if (totalItems == 0) {
            if (!this.userOffset)
                this.skinParams["dhx_skyblue"]["cell_space"] = 3;
            this.multiMode = true
        }
    };
    this.userOffset = false;
    this.setOffset = function(cellOffset, contentOffset) {
        this.userOffset = true;
        if (!isNaN(cellOffset))
            this.skinParams[this.skin]["cell_space"] = cellOffset;
        if (!isNaN(contentOffset))
            this.skinParams[this.skin]["content_offset"] = contentOffset;
        this.setSizes()
    };
    this.imagePath = "";
    this.setIconsPath = function(path) {
        this.imagePath = path
    };
    this.addItem = function(itemId, itemText) {
        var item = document.createElement("DIV");
        item.className = "dhx_acc_item";
        item._isAcc = true;
        item.skin = this.skin;
        this.base.appendChild(item);
        if (this.multiMode)
            item.h = this.itemH;
        var label = document.createElement("DIV");
        label._idd = itemId;
        label.className = "dhx_acc_item_label";
        label.innerHTML = "<span>" + itemText + "</span><div class='dhx_acc_item_label_btmbrd'>&nbsp;</div>" + "<div class='dhx_acc_item_arrow'></div>" + "<div class='dhx_acc_hdr_line_l'></div>" + "<div class='dhx_acc_hdr_line_r'></div>";
        label.onselectstart = function(e) {
            e = e || event;
            e.returnValue = false
        };
        label.onclick = function() {
            if (!that.multiMode && that.idPull[this._idd]._isActive)
                return;
            if (that.multiMode) {
                if (that.idPull[this._idd]._isActive) {
                    if (that.checkEvent("onBeforeActive")) {
                        if (that.callEvent("onBeforeActive", [this._idd, "close"]))
                            that.closeItem(this._idd, "dhx_accord_outer_event")
                    } else {
                        that.closeItem(this._idd, "dhx_accord_outer_event")
                    }
                } else {
                    if (that.checkEvent("onBeforeActive")) {
                        if (that.callEvent("onBeforeActive", [this._idd, "open"]))
                            that.openItem(this._idd, "dhx_accord_outer_event")
                    } else {
                        that.openItem(this._idd, "dhx_accord_outer_event")
                    }
                };
                return
            };
            if (that.checkEvent("onBeforeActive")) {
                if (that.callEvent("onBeforeActive", [this._idd, "open"]))
                    that.openItem(this._idd, "dhx_accord_outer_event")
            } else {
                that.openItem(this._idd, "dhx_accord_outer_event")
            }
        };
        label.onmouseover = function() {
            this.className = "dhx_acc_item_label dhx_acc_item_lavel_hover"
        };
        label.onmouseout = function() {
            this.className = "dhx_acc_item_label"
        };
        item.appendChild(label);
        var contObj = document.createElement("DIV");
        contObj.className = "dhxcont_global_content_area";
        item.appendChild(contObj);
        var cont = new dhtmlXContainer(item);
        cont.setContent(contObj);
        item.adjustContent(item, this.sk["cell_height"] + this.sk["content_offset"]);
        item._id = itemId;
        this.idPull[itemId] = item;
        item.getId = function() {
            return this._id
        };
        item.setText = function(text) {
            that.setText(this._id, text)
        };
        item.getText = function() {
            return that.getText(this._id)
        };
        item.open = function() {
            that.openItem(this._id)
        };
        item.isOpened = function() {
            return that.isActive(this._id)
        };
        item.close = function() {
            that.closeItem(this._id)
        };
        item.setIcon = function(icon) {
            that.setIcon(this._id, icon)
        };
        item.clearIcon = function() {
            that.clearIcon(this._id)
        };
        item.dock = function() {
            that.dockItem(this._id)
        };
        item.undock = function() {
            that.undockItem(this._id)
        };
        item.show = function() {
            that.showItem(this._id)
        };
        item.hide = function() {
            that.hideItem(this._id)
        };
        item.setHeight = function(height) {
            that.setItemHeight(this._id, height)
        };
        item.moveOnTop = function() {
            that.moveOnTop(this._id)
        };
        item._doOnAttachMenu = function() {
            that._reopenItem()
        };
        item._doOnAttachToolbar = function() {
            that._reopenItem()
        };
        item._doOnAttachStatusBar = function() {
            that._reopenItem()
        };
        this.openItem(itemId);
        return item
    };
    this.openItem = function(itemId, callEvent, reOpenItem) {
        if (this._openBuzy)
            return;
        if (this._enableOpenEffect && !reOpenItem) {
            if (this.multiMode && this.idPull[itemId]._isActive)
                return;
            this._openWithEffect(itemId, null, null, null, null, callEvent);
            return
        };
        if (this.multiMode) {
            for (var a in this.idPull) {
                if (this.idPull[a]._isActive || a == itemId) {
                    this.idPull[a].style.height = this.idPull[a].h + "px";
                    this.idPull[a].childNodes[1].style.display = "";
                    this.idPull[a].adjustContent(this.idPull[a], this.sk["cell_height"] + this.sk["content_offset"], null, null, (this.idPull[a] == this._lastVisible() ? 0 : this.sk["cell_space"]));
                    this.idPull[a].updateNestedObjects();
                    this.idPull[a]._isActive = true;
                    this._updateArrows();
                    if (callEvent == "dhx_accord_outer_event" && a == itemId)
                        this.callEvent("onActive", [itemId, true])
                }
            };
            return
        };
        if (itemId) {
            if (this.idPull[itemId]._isActive && !reOpenItem)
                return
        };
        var h = 0;
        for (var a in this.idPull) {
            this.idPull[a].style.height = this.sk["cell_height"] + (this.idPull[a] != this._lastVisible() && a != itemId ? this.sk["cell_space"] : 0) + "px";
            if (a != itemId) {
                this.idPull[a].childNodes[1].style.display = "none";
                this.idPull[a]._isActive = false;
                h += this.idPull[a].offsetHeight
            }
        };
        h = this.base.offsetHeight - h;
        if (itemId) {
            this.idPull[itemId].style.height = h + "px";
            this.idPull[itemId].childNodes[1].style.display = "";
            this.idPull[itemId].adjustContent(this.idPull[itemId], this.sk["cell_height"] + this.sk["content_offset"], null, null, (this.idPull[itemId] == this._lastVisible() ? 0 : this.sk["cell_space"]));
            this.idPull[itemId].updateNestedObjects();
            this.idPull[itemId]._isActive = true;
            if (callEvent == "dhx_accord_outer_event")
                this.callEvent("onActive", [itemId, true])
        };
        this._updateArrows();
        return
    };
    this._lastVisible = function() {
        var item = null;
        for (var q = this.base.childNodes.length - 1; q >= 0; q--)
            if (!this.base.childNodes[q]._isHidden && !item)
                item = this.base.childNodes[q];
        return item
    };
    this.closeItem = function(itemId, callEvent) {
        if (this.idPull[itemId] == null)
            return;
        if (!this.idPull[itemId]._isActive)
            return;
        if (this._openBuzy)
            return;
        if (this._enableOpenEffect) {
            this._openWithEffect(this.multiMode ? itemId : null, null, null, null, null, callEvent);
            return
        };
        this.idPull[itemId].style.height = this.sk["cell_height"] + (this.idPull[itemId] != this._lastVisible() ? this.sk["cell_space"] : 0) + "px";
        this.idPull[itemId].childNodes[1].style.display = "none";
        this.idPull[itemId]._isActive = false;
        if (callEvent == "dhx_accord_outer_event")
            this.callEvent("onActive", [itemId, false]);
        this._updateArrows()
    };
    this._updateArrows = function() {
        for (var a in this.idPull) {
            var label = this.idPull[a].childNodes[0];
            var arrow = null;
            for (var q = 0; q < label.childNodes.length; q++) {
                if (String(label.childNodes[q].className).search("dhx_acc_item_arrow") != -1)
                    arrow = label.childNodes[q]
            };
            if (arrow != null) {
                arrow.className = "dhx_acc_item_arrow " + (this.idPull[a]._isActive ? "item_opened" : "item_closed");
                arrow = null
            }
        }
    };
    this.setText = function(itemId, itemText, moveLabel) {
        if (that.idPull[itemId] == null)
            return;
        var label = that.idPull[itemId].childNodes[0];
        var tObj = null;
        for (var q = 0; q < label.childNodes.length; q++) {
            if (label.childNodes[q].tagName != null) {
                if (String(label.childNodes[q].tagName).toLowerCase() == "span")
                    tObj = label.childNodes[q]
            }
        };
        if (!isNaN(moveLabel)) {
            tObj.style.paddingLeft = moveLabel + "px"
        } else {
            tObj.innerHTML = itemText
        }
    };
    this.getText = function(itemId) {
        if (that.idPull[itemId] == null)
            return;
        var label = that.idPull[itemId].childNodes[0];
        var tObj = null;
        for (var q = 0; q < label.childNodes.length; q++) {
            if (label.childNodes[q].tagName != null) {
                if (String(label.childNodes[q].tagName).toLowerCase() == "span")
                    tObj = label.childNodes[q]
            }
        };
        return tObj.innerHTML
    };
    this._initWindows = function(id) {
        if (!window.dhtmlXWindows)
            return;
        if (!this.dhxWins) {
            this.dhxWins = new dhtmlXWindows();
            this.dhxWins.setSkin(this.skin);
            this.dhxWins.setImagePath(this.imagePath);
            this.dhxWinsIdPrefix = "";
            if (!id)
                return
        };
        var idd = this.dhxWinsIdPrefix + id;
        if (!this.dhxWins.window(idd)) {
            var self = this;
            var w1 = this.dhxWins.createWindow(idd, 20, 20, 320, 200);
            w1.setText(this.getText(id));
            w1.button("close").hide();
            w1.attachEvent("onClose", function(win) {
                        win.hide()
                    });
            w1.addUserButton("dock", 99, "Dock", "dock");
            w1.button("dock").attachEvent("onClick", function(win) {
                        self.cells(id).dock()
                    })
        } else {
            this.dhxWins.window(idd).show()
        }
    };
    this.dockWindow = function(itemId) {
        if (!this.idPull[itemId]._isUnDocked)
            return;
        if (!this.dhxWins)
            return;
        if (!this.dhxWins.window(this.dhxWinsIdPrefix + itemId))
            return;
        this.dhxWins.window(this.dhxWinsIdPrefix + itemId).moveContentTo(this.idPull[itemId]);
        this.dhxWins.window(this.dhxWinsIdPrefix + itemId).close();
        this.idPull[itemId]._isUnDocked = false;
        this.showItem(itemId);
        this.callEvent("onDock", [itemId])
    };
    this.undockWindow = function(itemId) {
        if (this.idPull[itemId]._isUnDocked)
            return;
        this._initWindows(itemId);
        this.idPull[itemId].moveContentTo(this.dhxWins.window(this.dhxWinsIdPrefix + itemId));
        this.idPull[itemId]._isUnDocked = true;
        this.hideItem(itemId);
        this.callEvent("onUnDock", [itemId])
    };
    this.setSizes = function() {
        this._reopenItem()
    };
    this.showItem = function(itemId) {
        if (this.idPull[itemId] == null)
            return;
        if (!this.idPull[itemId]._isHidden)
            return;
        if (this.idPull[itemId]._isUnDocked) {
            this.dockItem(itemId);
            return
        };
        this.idPull[itemId].className = "dhx_acc_item";
        this.idPull[itemId]._isHidden = false;
        this._reopenItem()
    };
    this.hideItem = function(itemId) {
        if (this.idPull[itemId] == null)
            return;
        if (this.idPull[itemId]._isHidden)
            return;
        this.closeItem(itemId);
        this.idPull[itemId].className = "dhx_acc_item_hidden";
        this.idPull[itemId]._isHidden = true;
        this._reopenItem()
    };
    this._reopenItem = function() {
        var toOpen = null;
        for (var a in this.idPull)
            if (this.idPull[a]._isActive && !this.idPull[a]._isHidden)
                toOpen = a;
        this.openItem(toOpen, null, true)
    };
    this.forEachItem = function(handler) {
        for (var a in this.idPull)
            handler(this.idPull[a])
    };
    this._enableOpenEffect = false;
    this._openStep = 10;
    this._openStepIncrement = 5;
    this._openStepTimeout = 10;
    this._openBuzy = false;
    this.setEffect = function(state) {
        this._enableOpenEffect = (state == true ? true : false)
    };
    this._openWithEffect = function(toOpen, toClose, minH, maxH, step, callEvent) {
        if (this.multiMode) {
            if (!step) {
                this._openBuzy = true;
                step = this._openStep;
                if (this.idPull[toOpen]._isActive) {
                    toClose = toOpen;
                    toOpen = null;
                    minH = this.sk["cell_height"] + (this.idPull[toClose] != this._lastVisible() ? this.sk["cell_space"] : 0);
                    this.idPull[toClose].childNodes[1].style.display = ""
                } else {
                    maxH = this.idPull[toOpen].h;
                    this.idPull[toOpen].childNodes[1].style.display = ""
                }
            };
            var stopOpen = false;
            if (toOpen) {
                var newH = parseInt(this.idPull[toOpen].style.height) + step;
                if (newH > maxH) {
                    newH = maxH;
                    stopOpen = true
                };
                this.idPull[toOpen].style.height = newH + "px"
            };
            if (toClose) {
                var newH = parseInt(this.idPull[toClose].style.height) - step;
                if (newH < minH) {
                    newH = minH;
                    stopOpen = true
                };
                this.idPull[toClose].style.height = newH + "px"
            };
            step += this._openStepIncrement;
            if (stopOpen) {
                if (toOpen) {
                    this.idPull[toOpen].adjustContent(this.idPull[toOpen], this.sk["cell_height"] + this.sk["content_offset"], null, null, (this.idPull[toOpen] == this._lastVisible() ? 0 : this.sk["cell_space"]));
                    this.idPull[toOpen].updateNestedObjects();
                    this.idPull[toOpen]._isActive = true
                };
                if (toClose) {
                    this.idPull[toClose].childNodes[1].style.display = "none";
                    this.idPull[toClose]._isActive = false
                };
                this._updateArrows();
                this._openBuzy = false;
                if (toOpen && callEvent == "dhx_accord_outer_event")
                    this.callEvent("onActive", [toOpen, true]);
                if (toClose && callEvent == "dhx_accord_outer_event")
                    this.callEvent("onActive", [toClose, false])
            } else {
                var that = this;
                window.setTimeout(function() {
                            that._openWithEffect(toOpen, toClose, minH, maxH, step, callEvent)
                        }, this._openStepTimeout)
            };
            return
        };
        if (!step) {
            this._openBuzy = true;
            step = this._openStep;
            if (toOpen)
                this.idPull[toOpen].childNodes[1].style.display = ""
        };
        if (!toClose || !minH || !maxH) {
            minH = 0;
            maxH = 0;
            for (var a in this.idPull) {
                var th = this.sk["cell_height"] + (this.idPull[a] != this._lastVisible() && a != toOpen ? this.sk["cell_space"] : 0);
                if (this.idPull[a]._isActive && toOpen != a) {
                    toClose = a;
                    minH = th
                };
                if (a != toOpen)
                    maxH += th
            };
            maxH = this.base.offsetHeight - maxH
        };
        var stopOpen = false;
        if (toOpen) {
            var ha = parseInt(this.idPull[toOpen].style.height) + step;
            if (ha > maxH)
                stopOpen = true
        };
        if (toClose) {
            var hb = parseInt(this.idPull[toClose].style.height) - step;
            if (hb < minH)
                stopOpen = true
        };
        step += this._openStepIncrement;
        if (stopOpen) {
            ha = maxH;
            hb = minH
        };
        if (toClose)
            this.idPull[toClose].style.height = hb + "px";
        if (toOpen)
            this.idPull[toOpen].style.height = ha + "px";
        if (stopOpen) {
            if (toClose) {
                this.idPull[toClose].childNodes[1].style.display = "none";
                this.idPull[toClose]._isActive = false
            };
            if (toOpen) {
                this.idPull[toOpen].adjustContent(this.idPull[toOpen], this.sk["cell_height"] + this.sk["content_offset"], null, null, (this.idPull[toOpen] == this._lastVisible() ? 0 : this.sk["cell_space"]));
                this.idPull[toOpen].updateNestedObjects();
                this.idPull[toOpen]._isActive = true
            };
            this._updateArrows();
            this._openBuzy = false;
            if (callEvent == "dhx_accord_outer_event" && toOpen)
                this.callEvent("onActive", [toOpen, true])
        } else {
            var that = this;
            window.setTimeout(function() {
                        that._openWithEffect(toOpen, toClose, minH, maxH, step, callEvent)
                    }, this._openStepTimeout)
        }
    };
    this.setActive = function(itemId) {
        this.openItem(itemId)
    };
    this.isActive = function(itemId) {
        if (String(dhxAccord.idPull[itemId]._content.className).search("dhx_acc_item_content_opened") != -1)
            return true;
        return false
    };
    this.dockItem = function(itemId) {
        this.dockWindow(itemId)
    };
    this.undockItem = function(itemId) {
        this.undockWindow(itemId)
    };
    this.setItemHeight = function(itemId, height) {
        if (!this.multiMode)
            return;
        if (isNaN(height))
            return;
        this.idPull[itemId].h = height;
        this._reopenItem()
    };
    this.setIcon = function(itemId, icon) {
        if (this.idPull[itemId] == null)
            return;
        var label = this.idPull[itemId].childNodes[0];
        var iconObj = null;
        for (var q = 0; q < label.childNodes.length; q++) {
            if (label.childNodes[q].className == "dhx_acc_item_icon")
                iconObj = label.childNodes[q]
        };
        if (iconObj == null) {
            iconObj = document.createElement("IMG");
            iconObj.className = "dhx_acc_item_icon";
            label.insertBefore(iconObj, label.childNodes[0]);
            this.setText(itemId, null, 20)
        };
        iconObj.src = this.imagePath + icon
    };
    this.clearIcon = function(itemId) {
        if (this.idPull[itemId] == null)
            return;
        var label = this.idPull[itemId].childNodes[0];
        var iconObj = null;
        for (var q = 0; q < label.childNodes.length; q++) {
            if (label.childNodes[q].className == "dhx_acc_item_icon")
                iconObj = label.childNodes[q]
        };
        if (iconObj != null) {
            label.removeChild(iconObj);
            iconObj = null;
            this.setText(itemId, null, 0)
        }
    };
    this.moveOnTop = function(itemId) {
        if (!this.idPull[itemId])
            return;
        if (this.base.childNodes.length <= 1)
            return;
        this.base.insertBefore(this.idPull[itemId], this.base.childNodes[0]);
        this.setSizes()
    };
    this.removeItem = function(itemId) {
        var item = this.idPull[itemId];
        var label = item.childNodes[0];
        label.onclick = null;
        label.onmouseover = null;
        label.onmouseout = null;
        label.onselectstart = null;
        label._idd = null;
        label.className = "";
        while (label.childNodes.length > 0)
            label.removeChild(label.childNodes[0]);
        if (label.parentNode)
            label.parentNode.removeChild(label);
        label = null;
        item._dhxContDestruct();
        while (item.childNodes.length > 0)
            item.removeChild(item.childNodes[0]);
        item._dhxContDestruct = null;
        item._doOnAttachMenu = null;
        item._doOnAttachToolbar = null;
        item._doOnAttachStatusBar = null;
        item.clearIcon = null;
        item.close = null;
        item.dock = null;
        item.getId = null;
        item.getText = null;
        item.hide = null;
        item.isOpened = null;
        item.open = null;
        item.setHeight = null;
        item.setIcon = null;
        item.setText = null;
        item.show = null;
        item.undock = null;
        if (item.parentNode)
            item.parentNode.removeChild(item);
        item = null;
        this.idPull[itemId] = null;
        try {
            delete this.idPull[itemId]
        } catch (e) {
        }
    };
    this.unload = function() {
        for (var a in this.skinParams) {
            this.skinParams[a] = null;
            try {
                delete this.skinParams[a]
            } catch (e) {
            }
        };
        this.skinParams = null;
        for (var a in this.idPull)
            this.removeItem(a);
        this.idPull = null;
        this.sk = null;
        this._initWindows = null;
        this._lastVisible = null;
        this._reopenItem = null;
        this._updateArrows = null;
        this.addItem = null;
        this.attachEvent = null;
        this.callEvent = null;
        this.cells = null;
        this.checkEvent = null;
        this.clearIcon = null;
        this.closeItem = null;
        this.detachEvent = null;
        this.dockItem = null;
        this.dockWindow = null;
        this.enableMultiMode = null;
        this.eventCatcher = null;
        this.forEachItem = null;
        this.getText = null;
        this.h = null;
        this.hideItem = null;
        this.imagePath = null;
        this.isActive = null;
        this.itemH = null;
        this.multiMode = null;
        this.openItem = null;
        this.removeItem = null;
        this.setActive = null;
        this.setEffect = null;
        this.setIcon = null;
        this.setIconsPath = null;
        this.setItemHeight = null;
        this.setOffset = null;
        this.setSizes = null;
        this.setSkin = null;
        this.setSkinParameters = null;
        this.setText = null;
        this.showItem = null;
        this.skin = null;
        this.w = null;
        this.undockItem = null;
        this.undockWindow = null;
        this.undockWindowunload = null;
        this.unload = null;
        this.userOffset = null;
        if (this._isAccFS == true) {
            if (_isIE) {
                window.detachEvent("onresize", this._doOnResize)
            } else {
                window.removeEventListener("resize", this._doOnResize, false)
            };
            this._isAccFS = null;
            this._doOnResize = null;
            this._adjustAccordion = null;
            this._adjustToFullScreen = null;
            this._resizeTM = null;
            this._resizeTMTime = null;
            document.body.className = String(document.body.className).replace("dhxacc_fullscreened", "");
            this.cont.obj._dhxContDestruct();
            if (this.cont.dhxcont.parentNode)
                this.cont.dhxcont.parentNode.removeChild(this.cont.dhxcont);
            this.cont.dhxcont = null;
            this.cont.setContent = null;
            this.cont = null
        };
        if (this.dhxWins) {
            this.dhxWins.unload();
            this.dhxWins = null
        };
        this.base.className = "";
        this.base = null;
        for (var a in this)
            try {
                delete this[a]
            } catch (e) {
            }
    };
    this._initWindows();
    dhtmlxEventable(this);
    return this
};
(function() {
    dhtmlx.extend_api("dhtmlXAccordion", {
                _init : function(obj) {
                    return [obj.parent, obj.skin]
                },
                icon_path : "setIconsPath",
                items : "_items",
                effect : "setEffect",
                multi_mode : "enableMultiMode"
            }, {
                _items : function(arr) {
                    var toOpen = [];
                    var toClose = [];
                    for (var i = 0; i < arr.length; i++) {
                        var item = arr[i];
                        this.addItem(item.id, item.text);
                        if (item.img)
                            this.cells(item.id).setIcon(item.img);
                        if (item.height)
                            this.cells(item.id).setHeight(item.height);
                        if (item.open === true)
                            toOpen[toOpen.length] = item.id;
                        if (item.open === false)
                            toClose[toClose.length] = item.id
                    };
                    for (var q = 0; q < toOpen.length; q++)
                        this.cells(toOpen[q]).open();
                    for (var q = 0; q < toClose.length; q++)
                        this.cells(toClose[q]).close()
                }
            })
})();