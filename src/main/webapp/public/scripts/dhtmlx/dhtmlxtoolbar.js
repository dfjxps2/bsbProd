
function dhtmlXToolbarObject(baseId, skin) {
    var main_self = this;
    this.cont = (typeof(baseId) != "object") ? document.getElementById(baseId) : baseId;
    while (this.cont.childNodes.length > 0)
        this.cont.removeChild(this.cont.childNodes[0]);
    this.cont.innerHTML += "<div class='dhxtoolbar_hdrline_ll'></div><div class='dhxtoolbar_hdrline_rr'></div>" + "<div class='dhxtoolbar_hdrline_l'></div><div class='dhxtoolbar_hdrline_r'></div>";
    this.base = document.createElement("DIV");
    this.cont.appendChild(this.base);
    this.setRTL = function(mode) {
        this.rtl = (mode == true ? true : false);
        this.cont.className = "dhx_toolbar_base_" + this.skin + (this.rtl ? " rtl" : "");
        this.base.className = (this.rtl ? "float_right" : "float_left");
        for (var a in this.objPull) {
            var item = this.objPull[a];
            if (item["type"] == "buttonSelect")
                item.polygon.className = "dhx_toolbar_poly_" + this.skin + (this.rtl ? " rtl" : "");
            if (item["type"] == "slider")
                item.label.className = className = "dhx_toolbar_slider_label_" + this.skin + (this.rtl ? " rtl" : "")
        }
    };
    this.setAlign = function(align) {
        this.base.className = (align == "right" ? "float_right" : "float_left")
    };
    this._isIE6 = false;
    if (_isIE)
        this._isIE6 = (window.XMLHttpRequest == null ? true : false);
    this.selectPolygonOffsetTop = 0;
    this.selectPolygonOffsetLeft = 0;
    this.setSkin = function(skin) {
        this.skin = skin;
        if (this.skin == "dhx_skyblue") {
            this.selectPolygonOffsetTop = 1;
            this.selectPolygonOffsetLeft = 1
        };
        this.cont.className = "dhx_toolbar_base_" + this.skin + (this.rtl ? " rtl" : "");
        for (var a in this.objPull) {
            var item = this.objPull[a];
            if (item["type"] == "slider") {
                item.pen._detectLimits();
                item.pen._definePos();
                item.label.className = "dhx_toolbar_slider_label_" + this.skin + (this.rtl ? " rtl" : "")
            };
            if (item["type"] == "buttonSelect") {
                item.polygon.className = "dhx_toolbar_poly_" + this.skin + (this.rtl ? " rtl" : "")
            }
        }
    };
    this.setSkin(skin == null ? "dhx_skyblue" : skin);
    this.objPull = {};
    this.anyUsed = "none";
    this.imagePath = "";
    this.setIconsPath = function(path) {
        this.imagePath = path
    };
    this.setIconPath = this.setIconsPath;
    this._doOnLoad = function() {
    };
    this.loadXML = function(xmlFile, onLoadFunction) {
        if (onLoadFunction != null)
            this._doOnLoad = function() {
                onLoadFunction()
            };
        this.callEvent("onXLS", []);
        this._xmlLoader = new dtmlXMLLoaderObject(this._xmlParser, window);
        this._xmlLoader.loadXML(xmlFile)
    };
    this.loadXMLString = function(xmlString, onLoadFunction) {
        if (onLoadFunction != null) {
            this._doOnLoad = function() {
                onLoadFunction()
            }
        };
        this._xmlLoader = new dtmlXMLLoaderObject(this._xmlParser, window);
        this._xmlLoader.loadXMLString(xmlString)
    };
    this._xmlParser = function() {
        var root = this.getXMLTopNode("toolbar");
        for (var q = 0; q < root.childNodes.length; q++)
            if (root.childNodes[q].tagName == "item")
                main_self._addItemToStorage(root.childNodes[q]);
        main_self.callEvent("onXLE", []);
        main_self._doOnLoad();
        this.destructor()
    };
    this._addItemToStorage = function(itemData, pos) {
        var id = (itemData.getAttribute("id") != null ? itemData.getAttribute("id") : this._genStr(24));
        var type = (itemData.getAttribute("type") != null ? itemData.getAttribute("type") : "");
        if (type != "") {
            if (this["_" + type + "Object"] != null) {
                this.objPull[this.idPrefix + id] = new this["_" + type + "Object"](this, id, itemData);
                this.objPull[this.idPrefix + id]["type"] = type;
                this.setPosition(id, pos)
            }
        }
    };
    this._genStr = function(w) {
        var s = "";
        var z = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        for (var q = 0; q < w; q++) {
            s = s + z.charAt(Math.round(Math.random() * z.length))
        };
        return s
    };
    this.rootTypes = new Array("button", "buttonSelect", "buttonTwoState", "separator", "label", "slider", "text", "buttonInput");
    this.idPrefix = this._genStr(12);
    dhtmlxEventable(this);
    this._getObj = function(obj, tag) {
        var targ = null;
        for (var q = 0; q < obj.childNodes.length; q++) {
            if (obj.childNodes[q].tagName != null) {
                if (String(obj.childNodes[q].tagName).toLowerCase() == String(tag).toLowerCase())
                    targ = obj.childNodes[q]
            }
        };
        return targ
    };
    this._addImgObj = function(obj) {
        var imgObj = document.createElement("IMG");
        if (obj.childNodes.length > 0)
            obj.insertBefore(imgObj, obj.childNodes[0]);
        else
            obj.appendChild(imgObj);
        return imgObj
    };
    this._setItemImage = function(item, url, dis) {
        if (dis == true)
            item.imgEn = url;
        else
            item.imgDis = url;
        if ((!item.state && dis == true) || (item.state && dis == false))
            return;
        var imgObj = this._getObj(item.obj, "img");
        if (imgObj == null)
            imgObj = this._addImgObj(item.obj);
        imgObj.src = this.imagePath + url
    };
    this._clearItemImage = function(item, dis) {
        if (dis == true)
            item.imgEn = "";
        else
            item.imgDis = "";
        if ((!item.state && dis == true) || (item.state && dis == false))
            return;
        var imgObj = this._getObj(item.obj, "img");
        if (imgObj != null)
            imgObj.parentNode.removeChild(imgObj)
    };
    this._setItemText = function(item, text) {
        var txtObj = this._getObj(item.obj, "div");
        if (text == null || text.length == 0) {
            if (txtObj != null)
                txtObj.parentNode.removeChild(txtObj);
            return
        };
        if (txtObj == null) {
            txtObj = document.createElement("DIV");
            item.obj.appendChild(txtObj)
        };
        txtObj.innerHTML = text
    };
    this._getItemText = function(item) {
        var txtObj = this._getObj(item.obj, "div");
        if (txtObj != null)
            return txtObj.innerHTML;
        return ""
    };
    this._enableItem = function(item) {
        if (item.state)
            return;
        item.state = true;
        if (this.objPull[item.id]["type"] == "buttonTwoState" && this.objPull[item.id]["obj"]["pressed"] == true) {
            item.obj.className = "dhx_toolbar_btn pres";
            item.obj.renderAs = "dhx_toolbar_btn over"
        } else {
            item.obj.className = "dhx_toolbar_btn def";
            item.obj.renderAs = item.obj.className
        };
        if (item.arw)
            item.arw.className = String(item.obj.className).replace("btn", "arw");
        var imgObj = this._getObj(item.obj, "img");
        if (item.imgEn != "") {
            if (imgObj == null)
                imgObj = this._addImgObj(item.obj);
            imgObj.src = this.imagePath + item.imgEn
        } else {
            if (imgObj != null)
                imgObj.parentNode.removeChild(imgObj)
        }
    };
    this._disableItem = function(item) {
        if (!item.state)
            return;
        item.state = false;
        item.obj.className = "dhx_toolbar_btn dis";
        item.obj.renderAs = "dhx_toolbar_btn def";
        if (item.arw)
            item.arw.className = String(item.obj.className).replace("btn", "arw");
        var imgObj = this._getObj(item.obj, "img");
        if (item.imgDis != "") {
            if (imgObj == null)
                imgObj = this._addImgObj(item.obj);
            imgObj.src = this.imagePath + item.imgDis
        } else {
            if (imgObj != null)
                imgObj.parentNode.removeChild(imgObj)
        };
        if (item.polygon != null) {
            if (item.polygon.style.display != "none") {
                item.polygon.style.display = "none";
                if (item.polygon._ie6cover)
                    item.polygon._ie6cover.style.display = "none"
            }
        };
        this.anyUsed = "none"
    };
    this.clearAll = function() {
        for (var a in this.objPull)
            this.removeItem(String(a).replace(this.idPrefix, ""))
    };
    this._isWebToolbar = true;
    dhtmlxEvent(document.body, "click", function(e) {
                if (!main_self.base)
                    return;
                main_self.forEachItem(function(itemId) {
                            if (main_self.objPull[main_self.idPrefix + itemId]["type"] == "buttonSelect") {
                                var item = main_self.objPull[main_self.idPrefix + itemId];
                                if (item.polygon.style.display != "none") {
                                    item.obj.renderAs = "dhx_toolbar_btn def";
                                    item.obj.className = item.obj.renderAs;
                                    item.arw.className = String(item.obj.renderAs).replace("btn", "arw");
                                    main_self.anyUsed = "none";
                                    item.polygon.style.display = "none";
                                    if (item.polygon._ie6cover)
                                        item.polygon._ie6cover.style.display = "none"
                                }
                            }
                        })
            });
    return this
};
dhtmlXToolbarObject.prototype.getType = function(itemId) {
    if (this.objPull[this.idPrefix + itemId] == null) {
        return ""
    };
    return this.objPull[this.idPrefix + itemId]["type"]
};
dhtmlXToolbarObject.prototype.getTypeExt = function(itemId) {
    if (this.getType(itemId) != "buttonSelectNode") {
        return ""
    };
    return this.objPull[this.idPrefix + itemId]["typeext"]
};
dhtmlXToolbarObject.prototype.inArray = function(array, value) {
    for (var q = 0; q < array.length; q++) {
        if (array[q] == value)
            return true
    };
    return false
};
dhtmlXToolbarObject.prototype._string2xml = function(xmlString) {
    try {
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(xmlString, "text/xml")
    } catch (e) {
        var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = this.async;
        xmlDoc["loadXM" + "L"](xmlString)
    };
    return (xmlDoc != null ? xmlDoc : null)
};
dhtmlXToolbarObject.prototype._addItem = function(str, pos) {
    var data = this._string2xml(str);
    this._addItemToStorage(data.childNodes[0], pos)
};
dhtmlXToolbarObject.prototype.addButton = function(id, pos, text, imgEnabled, imgDisabled) {
    var itemText = (text != null ? (text.length == 0 ? null : text) : null);
    var str = '<item id="' + id + '" type="button"' + (imgEnabled != null ? ' img="' + imgEnabled + '"' : '') + (imgDisabled != null ? ' imgdis="' + imgDisabled + '"' : '') + (itemText != null ? ' text="' + itemText + '"' : "") + '/>';
    this._addItem(str, pos)
};
dhtmlXToolbarObject.prototype.addText = function(id, pos, text) {
    var str = '<item id="' + id + '" type="text" text="' + text + '"/>';
    this._addItem(str, pos)
};
dhtmlXToolbarObject.prototype.addButtonSelect = function(id, pos, text, opts, imgEnabled, imgDisabled) {
    var itemText = (text != null ? (text.length == 0 ? null : text) : null);
    var str = '<item id="' + id + '" type="buttonSelect"' + (imgEnabled != null ? ' img="' + imgEnabled + '"' : '') + (imgDisabled != null ? ' imgdis="' + imgDisabled + '"' : '') + (itemText != null ? ' text="' + itemText + '"' : "") + '>';
    for (var q = 0; q < opts.length; q++) {
        if (opts[q].id && opts[q].type) {
            if (opts[q].type == "obj") {
                str += '<item type="button" id="' + opts[q].id + '" text="' + opts[q].text + '"' + (opts[q].img != null ? ' img="' + opts[q].img + '"' : '') + '/>'
            } else if (opts[q].type == "sep") {
                str += '<item id="' + opts[q].id + '" type="separator"/>'
            }
        } else {
            if (opts[q][1] == "obj") {
                str += '<item type="button" id="' + opts[q][0] + '" text="' + opts[q][2] + '"' + (opts[q][3] != null ? ' img="' + opts[q][3] + '"' : '') + '/>'
            } else if (opts[q][1] == "sep") {
                str += '<item id="' + opts[q][0] + '" type="separator"/>'
            }
        }
    };
    str += '</item>';
    this._addItem(str, pos)
};
dhtmlXToolbarObject.prototype.addButtonTwoState = function(id, pos, text, imgEnabled, imgDisabled) {
    var itemText = (text != null ? (text.length == 0 ? null : text) : null);
    var str = '<item id="' + id + '" type="buttonTwoState"' + (imgEnabled != null ? ' img="' + imgEnabled + '"' : '') + (imgDisabled != null ? ' imgdis="' + imgDisabled + '"' : '') + (itemText != null ? ' text="' + itemText + '"' : "") + '/>';
    this._addItem(str, pos)
};
dhtmlXToolbarObject.prototype.addSeparator = function(id, pos) {
    var str = '<item id="' + id + '" type="separator"/>';
    this._addItem(str, pos)
};
dhtmlXToolbarObject.prototype.addSlider = function(id, pos, len, valueMin, valueMax, valueNow, textMin, textMax, tip) {
    var itemTextMin = (textMin != null ? (textMin.length == 0 ? null : textMin) : null);
    var itemTextMax = (textMax != null ? (textMax.length == 0 ? null : textMax) : null);
    var str = '<item id="' + id + '" type="slider" length="' + len + '" valueMin="' + valueMin + '" valueMax="' + valueMax + '" valueNow="' + valueNow + '"' + (itemTextMin != null ? ' textMin="' + itemTextMin + '"' : '') + (itemTextMax != null ? ' textMax="' + itemTextMax + '"' : '') + ' toolTip="' + tip + '"/>';
    this._addItem(str, pos)
};
dhtmlXToolbarObject.prototype.addInput = function(id, pos, value, width) {
    var str = '<item id="' + id + '" type="buttonInput" value="' + value + '" width="' + width + '"/>';
    this._addItem(str, pos)
};
dhtmlXToolbarObject.prototype.forEachItem = function(handler) {
    for (var a in this.objPull) {
        if (this.inArray(this.rootTypes, this.objPull[a]["type"])) {
            handler(this.objPull[a]["id"].replace(this.idPrefix, ""))
        }
    }
};
(function() {
    var list = "showItem,hideItem,isVisible,enableItem,disableItem,isEnabled,setItemText,getItemText,setItemToolTip,getItemToolTip,setItemImage,setItemImageDis,clearItemImage,clearItemImageDis,setItemState,getItemState,setItemToolTipTemplate,getItemToolTipTemplate,setValue,getValue,setMinValue,getMinValue,setMaxValue,getMaxValue,setWidth,getWidth".split(",");
    var ret = ["", "", false, "", "", false, "", "", "", "", "", "", "", "", "", false, "", "", "", null, "", [null, null], "", [null, null], "", null];
    var functor = function(name, res) {
        return function(itemId, a, b) {
            itemId = this.idPrefix + itemId;
            if (this.objPull[itemId][name] != null)
                return this.objPull[itemId][name].call(this.objPull[itemId], a, b);
            else
                return res
        }
    };
    for (var i = 0; i < list.length; i++) {
        var name = list[i];
        var res = ret[i];
        dhtmlXToolbarObject.prototype[name] = functor(name, res)
    }
})();
dhtmlXToolbarObject.prototype.setPosition = function(itemId, pos) {
    this._setPosition(itemId, pos)
};
dhtmlXToolbarObject.prototype.getPosition = function(itemId) {
    return this._getPosition(itemId)
};
dhtmlXToolbarObject.prototype._setPosition = function(id, pos) {
    if (this.objPull[this.idPrefix + id] == null)
        return;
    if (isNaN(pos))
        pos = this.base.childNodes.length;
    if (pos < 0)
        pos = 0;
    var item = this.objPull[this.idPrefix + id];
    this.base.removeChild(item.obj);
    if (item.arw)
        this.base.removeChild(item.arw);
    var newPos = this._getIdByPosition(pos, true);
    if (newPos[0] == null) {
        this.base.appendChild(item.obj);
        if (item.arw)
            this.base.appendChild(item.arw)
    } else {
        this.base.insertBefore(item.obj, this.base.childNodes[newPos[1]]);
        if (item.arw)
            this.base.insertBefore(item.arw, this.base.childNodes[newPos[1] + 1])
    }
};
dhtmlXToolbarObject.prototype._getPosition = function(id, retRealPos) {
    if (this.objPull[this.idPrefix + id] == null)
        return null;
    var pos = 0;
    var posFound = false;
    var realPos = 0;
    var realPosFound = false;
    for (var q = 0; q < this.base.childNodes.length; q++) {
        if (!posFound && this.base.childNodes[q]["idd"] != null) {
            if (this.base.childNodes[q]["idd"] == id)
                posFound = true;
            else
                pos++
        };
        if (!realPosFound) {
            if (this.base.childNodes[q]["idd"] == id)
                realPosFound = true;
            else
                realPos++
        }
    };
    pos = (posFound ? pos : null);
    realPos = (realPosFound ? realPos : null);
    return (retRealPos == true ? new Array(pos, realPos) : pos)
};
dhtmlXToolbarObject.prototype._getIdByPosition = function(pos, retRealPos) {
    var id = null;
    var w = 0;
    var realPos = 0;
    for (var q = 0; q < this.base.childNodes.length; q++) {
        if (this.base.childNodes[q]["idd"] != null && id == null) {
            if ((w++) == pos)
                id = this.base.childNodes[q]["idd"]
        };
        if (id == null)
            realPos++
    };
    realPos = (id == null ? null : realPos);
    return (retRealPos == true ? new Array(id, realPos) : id)
};
dhtmlXToolbarObject.prototype.removeItem = function(itemId) {
    if (this.objPull[this.idPrefix + itemId] == null)
        return;
    var t = this.getType(itemId);
    var obj = this.objPull[this.idPrefix + itemId].obj;
    obj.parentNode.removeChild(obj);
    if (this.objPull[this.idPrefix + itemId].arw != null) {
        var arw = this.objPull[this.idPrefix + itemId].arw;
        arw.parentNode.removeChild(arw);
        arw = null
    };
    if (this.objPull[this.idPrefix + itemId].polygon != null) {
        var polygon = this.objPull[this.idPrefix + itemId].polygon;
        polygon.parentNode.removeChild(polygon);
        polygon = null
    };
    if (this.objPull[this.idPrefix + itemId].obj != null) {
        if (this.objPull[this.idPrefix + itemId].obj.label != null) {
            var label = this.objPull[this.idPrefix + itemId].obj.label;
            label.parentNode.removeChild(label);
            label = null
        }
    };
    obj = null;
    delete this.objPull[this.idPrefix + itemId]
};
(function() {
    var list = "addListOption,removeListOption,showListOption,hideListOption,isListOptionVisible,enableListOption,disableListOption,isListOptionEnabled,setListOptionPosition,getListOptionPosition,setListOptionText,getListOptionText,setListOptionToolTip,getListOptionToolTip,setListOptionImage,getListOptionImage,clearListOptionImage,forEachListOption,getAllListOptions,setListOptionSelected,getListOptionSelected".split(",");
    var functor = function(name) {
        return function(parentId, a, b, c, d, e) {
            parentId = this.idPrefix + parentId;
            if (this.objPull[parentId] == null)
                return;
            if (this.objPull[parentId]["type"] != "buttonSelect")
                return;
            return this.objPull[parentId][name].call(this.objPull[parentId], a, b, c, d, e)
        }
    };
    for (var i = 0; i < list.length; i++) {
        var name = list[i];
        dhtmlXToolbarObject.prototype[name] = functor(name)
    }
})();
dhtmlXToolbarObject.prototype._separatorObject = function(that, id, data) {
    this.id = that.idPrefix + id;
    this.obj = document.createElement("DIV");
    this.obj.className = "dhx_toolbar_sep";
    this.obj.idd = String(id);
    this.obj.title = (data.getAttribute("title") != null ? data.getAttribute("title") : "");
    this.obj.onselectstart = function(e) {
        e = e || event;
        e.returnValue = false
    };
    that.base.appendChild(this.obj);
    this.showItem = function() {
        this.obj.style.display = ""
    };
    this.hideItem = function() {
        this.obj.style.display = "none"
    };
    this.isVisible = function() {
        return (this.obj.style.display == "")
    };
    return this
};
dhtmlXToolbarObject.prototype._textObject = function(that, id, data) {
    this.id = that.idPrefix + id;
    this.obj = document.createElement("DIV");
    this.obj.className = "dhx_toolbar_text";
    this.obj.idd = String(id);
    this.obj.title = (data.getAttribute("title") != null ? data.getAttribute("title") : "");
    this.obj.onselectstart = function(e) {
        e = e || event;
        e.returnValue = false
    };
    this.obj.innerHTML = data.getAttribute("text");
    that.base.appendChild(this.obj);
    this.showItem = function() {
        this.obj.style.display = ""
    };
    this.hideItem = function() {
        this.obj.style.display = "none"
    };
    this.isVisible = function() {
        return (this.obj.style.display == "")
    };
    this.setItemText = function(text) {
        this.obj.innerHTML = text
    };
    this.getItemText = function() {
        return this.obj.innerHTML
    };
    this.setWidth = function(width) {
        this.obj.style.width = width + "px"
    };
    return this
};
dhtmlXToolbarObject.prototype._buttonObject = function(that, id, data) {
    this.id = that.idPrefix + id;
    this.state = (data.getAttribute("enabled") != null ? false : true);
    this.imgEn = (data.getAttribute("img") != null ? data.getAttribute("img") : "");
    this.imgDis = (data.getAttribute("imgdis") != null ? data.getAttribute("imgdis") : "");
    this.img = (this.state ? (this.imgEn != "" ? this.imgEn : "") : (this.imgDis != "" ? this.imgDis : ""));
    this.obj = document.createElement("DIV");
    this.obj.className = "dhx_toolbar_btn " + (this.state ? "def" : "dis");
    this.obj.allowClick = false;
    this.obj.renderAs = this.obj.className;
    this.obj.idd = String(id);
    this.obj.title = (data.getAttribute("title") != null ? data.getAttribute("title") : "");
    this.obj.pressed = false;
    this.obj.innerHTML = (this.img != "" ? "<img src='" + that.imagePath + this.img + "'>" : "") + (data.getAttribute("text") != null ? "<div>" + data.getAttribute("text") + "</div>" : "");
    var obj = this;
    this.obj.onselectstart = function(e) {
        e = e || event;
        e.returnValue = false
    };
    this.obj.onmouseover = function() {
        this._doOnMouseOver()
    };
    this.obj.onmouseout = function() {
        this._doOnMouseOut()
    };
    this.obj._doOnMouseOver = function() {
        this.allowClick = true;
        if (obj.state == false)
            return;
        if (that.anyUsed != "none")
            return;
        this.className = "dhx_toolbar_btn over";
        this.renderAs = this.className
    };
    this.obj._doOnMouseOut = function() {
        this.allowClick = false;
        if (obj.state == false)
            return;
        if (that.anyUsed != "none")
            return;
        this.className = "dhx_toolbar_btn def";
        this.renderAs = this.renderAs
    };
    this.obj.onclick = function(e) {
        if (obj.state == false)
            return;
        if (this.allowClick == false)
            return;
        e = e || event;
        that.callEvent("onClick", [this.idd.replace(that.idPrefix, "")])
    };
    this.obj.onmousedown = function(e) {
        if (obj.state == false)
            return;
        if (that.anyUsed != "none")
            return;
        that.anyUsed = this.idd;
        this.className = "dhx_toolbar_btn pres";
        this.pressed = true;
        this.onmouseover = function() {
            this._doOnMouseOver()
        };
        this.onmouseout = function() {
            that.anyUsed = "none";
            this._doOnMouseOut()
        };
        return false
    };
    this.obj.onmouseup = function(e) {
        if (obj.state == false)
            return;
        if (that.anyUsed != "none") {
            if (that.anyUsed != this.idd)
                return
        };
        this._doOnMouseUp()
    };
    this.obj._doOnMouseUp = function() {
        that.anyUsed = "none";
        this.className = this.renderAs;
        this.pressed = false
    };
    this.obj._doOnMouseUpOnceAnywhere = function() {
        this._doOnMouseUp();
        this.onmouseover = function() {
            this._doOnMouseOver()
        };
        this.onmouseout = function() {
            this._doOnMouseOut()
        }
    };
    that.base.appendChild(this.obj);
    this.enableItem = function() {
        that._enableItem(this)
    };
    this.disableItem = function() {
        that._disableItem(this)
    };
    this.isEnabled = function() {
        return this.state
    };
    this.showItem = function() {
        this.obj.style.display = ""
    };
    this.hideItem = function() {
        this.obj.style.display = "none"
    };
    this.isVisible = function() {
        return (this.obj.style.display == "")
    };
    this.setItemText = function(text) {
        that._setItemText(this, text)
    };
    this.getItemText = function() {
        return that._getItemText(this)
    };
    this.setItemImage = function(url) {
        that._setItemImage(this, url, true)
    };
    this.clearItemImage = function() {
        that._clearItemImage(this, true)
    };
    this.setItemImageDis = function(url) {
        that._setItemImage(this, url, false)
    };
    this.clearItemImageDis = function() {
        that._clearItemImage(this, false)
    };
    this.setItemToolTip = function(tip) {
        this.obj.title = tip
    };
    this.getItemToolTip = function() {
        return this.obj.title
    };
    return this
};
dhtmlXToolbarObject.prototype._buttonSelectObject = function(that, id, data) {
    this.id = that.idPrefix + id;
    this.state = (data.getAttribute("enabled") != null ? (data.getAttribute("enabled") == "true" ? true : false) : true);
    this.imgEn = (data.getAttribute("img") != null ? data.getAttribute("img") : "");
    this.imgDis = (data.getAttribute("imgdis") != null ? data.getAttribute("imgdis") : "");
    this.img = (this.state ? (this.imgEn != "" ? this.imgEn : "") : (this.imgDis != "" ? this.imgDis : ""));
    this.obj = document.createElement("DIV");
    this.obj.allowClick = false;
    this.obj.className = "dhx_toolbar_btn def";
    this.obj.renderAs = this.obj.className;
    this.obj.onselectstart = function(e) {
        e = e || event;
        e.returnValue = false
    };
    this.obj.idd = String(id);
    this.obj.title = (data.getAttribute("title") != null ? data.getAttribute("title") : "");
    this.obj.pressed = false;
    this.renderSelect = (data.getAttribute("renderSelect") != null ? (data.getAttribute("renderSelect") == "false" || data.getAttribute("renderSelect") == "disabled" ? false : true) : true);
    this.obj.innerHTML = (this.img != "" ? "<img src='" + that.imagePath + this.img + "'>" : "") + (data.getAttribute("text") != null ? "<div>" + data.getAttribute("text") + "</div>" : "");
    that.base.appendChild(this.obj);
    this.arw = document.createElement("DIV");
    this.arw.className = "dhx_toolbar_arw def";
    this.arw.innerHTML = "<div class='arwimg'>&nbsp;</div>";
    this.arw.title = this.obj.title;
    this.arw.onselectstart = function(e) {
        e = e || event;
        e.returnValue = false
    };
    that.base.appendChild(this.arw);
    var self = this;
    this.obj.onmouseover = function(e) {
        e = e || event;
        if (that.anyUsed != "none")
            return;
        if (!self.state)
            return;
        self.obj.renderAs = "dhx_toolbar_btn over";
        self.obj.className = self.obj.renderAs;
        self.arw.className = String(self.obj.renderAs).replace("btn", "arw")
    };
    this.obj.onmouseout = function() {
        self.obj.allowClick = false;
        if (that.anyUsed != "none")
            return;
        if (!self.state)
            return;
        self.obj.renderAs = "dhx_toolbar_btn def";
        self.obj.className = self.obj.renderAs;
        self.arw.className = String(self.obj.renderAs).replace("btn", "arw")
    };
    this.arw.onmouseover = this.obj.onmouseover;
    this.arw.onmouseout = this.obj.onmouseout;
    this.obj.onclick = function(e) {
        e = e || event;
        if (!self.obj.allowClick)
            return;
        if (!self.state)
            return;
        if (that.anyUsed != "none")
            return;
        that.callEvent("onClick", [self.obj.idd.replace(that.idPrefix, "")])
    };
    this.obj.onmousedown = function(e) {
        e = e || event;
        if (that.anyUsed != "none")
            return;
        if (!self.state)
            return;
        self.obj.allowClick = true;
        self.obj.className = "dhx_toolbar_btn pres";
        self.arw.className = "dhx_toolbar_arw pres"
    };
    this.obj.onmouseup = function(e) {
        e = e || event;
        e.cancelBubble = true;
        if (that.anyUsed != "none")
            return;
        if (!self.state)
            return;
        self.obj.className = self.obj.renderAs;
        self.arw.className = String(self.obj.renderAs).replace("btn", "arw")
    };
    this.arw.onmousedown = function(e) {
        e = e || event;
        if (!self.state)
            return;
        if (that.anyUsed == self.obj.idd) {
            self.obj.className = self.obj.renderAs;
            self.arw.className = String(self.obj.renderAs).replace("btn", "arw");
            that.anyUsed = "none";
            self.polygon.style.display = "none";
            if (self.polygon._ie6cover)
                self.polygon._ie6cover.style.display = "none"
        } else {
            if (that.anyUsed != "none") {
                if (that.objPull[that.idPrefix + that.anyUsed]["type"] == "buttonSelect") {
                    var item = that.objPull[that.idPrefix + that.anyUsed];
                    if (item.polygon.style.display != "none") {
                        item.obj.renderAs = "dhx_toolbar_btn def";
                        item.obj.className = item.obj.renderAs;
                        item.arw.className = String(self.obj.renderAs).replace("btn", "arw");
                        item.polygon.style.display = "none";
                        if (item.polygon._ie6cover)
                            item.polygon._ie6cover.style.display = "none"
                    }
                }
            };
            self.obj.className = "dhx_toolbar_btn over";
            self.arw.className = "dhx_toolbar_arw pres";
            that.anyUsed = self.obj.idd;
            if (that.rtl) {
                self.polygon.style.visibility = "hidden";
                self.polygon.style.display = "";
                self.polygon.style.left = getAbsoluteLeft(self.obj) + self.obj.offsetWidth - self.polygon.offsetWidth + that.selectPolygonOffsetLeft + "px";
                self.polygon.style.left = getAbsoluteLeft(self.obj) + self.obj.offsetWidth - self.polygon.offsetWidth + that.selectPolygonOffsetLeft + "px"
            } else {
                self.polygon.style.left = getAbsoluteLeft(self.obj) + that.selectPolygonOffsetLeft + "px"
            };
            self.polygon.style.top = getAbsoluteTop(self.obj) + self.obj.offsetHeight + that.selectPolygonOffsetTop + "px";
            if (that.rtl) {
                self.polygon.style.visibility = "visible"
            } else {
                self.polygon.style.display = ""
            };
            if (self.polygon._ie6cover) {
                self.polygon._ie6cover.style.left = self.polygon.style.left;
                self.polygon._ie6cover.style.top = self.polygon.style.top;
                self.polygon._ie6cover.style.width = self.polygon.offsetWidth + "px";
                self.polygon._ie6cover.style.height = self.polygon.offsetHeight + "px";
                self.polygon._ie6cover.style.display = ""
            }
        };
        return false
    };
    this.arw.onclick = function(e) {
        e = e || event;
        e.cancelBubble = true
    };
    this.arw.onmouseup = function(e) {
        e = e || event;
        e.cancelBubble = true
    };
    this.obj.iddPrefix = that.idPrefix;
    this._listOptions = {};
    this._separatorButtonSelectObject = function(id, data, pos) {
        this.obj = document.createElement("DIV");
        this.obj.className = "btn_sep";
        this.obj.onselectstart = function(e) {
            e = e || event;
            e.returnValue = false
        };
        if (isNaN(pos)) {
            self.polygon.appendChild(this.obj)
        } else {
            if (pos < 1)
                pos = 1;
            if (pos > self.polygon.childNodes.length) {
                self.polygon.appendChild(this.obj)
            } else {
                self.polygon.insertBefore(this.obj, self.polygon.childNodes[pos - 1])
            }
        };
        self._listOptions[id] = this.obj;
        return this
    };
    this._buttonButtonSelectObject = function(id, data, pos) {
        this.obj = document.createElement("DIV");
        this.obj.en = (data.getAttribute("enabled") == "false" ? false : true);
        this.obj._selected = (data.getAttribute("selected") != null);
        this.obj.className = "btn_item" + (this.obj.en ? (this.obj._selected && self.renderSelect ? " sel" : "") : " dis");
        this.obj.onselectstart = function(e) {
            e = e || event;
            e.returnValue = false
        };
        var itemText = (data.getAttribute("text") != null ? data.getAttribute("text") : null);
        if (itemText == null) {
            var itm = data.getElementsByTagName("itemText");
            itemText = (itm[0] != null ? itm[0].firstChild.nodeValue : "")
        };
        this.obj.innerHTML = (data.getAttribute("img") != null ? "<img src='" + that.imagePath + data.getAttribute("img") + "' border='0'>" : "") + "<span>" + itemText + "</span>";
        this.obj.onmouseover = function(e) {
            if (!this.en)
                return;
            this.className = "btn_item over"
        };
        this.obj.onmouseout = function(e) {
            if (!this.en)
                return;
            this.className = "btn_item" + (this._selected && self.renderSelect ? " sel" : "")
        };
        this.obj.idd = String(id);
        this.obj.onclick = function(e) {
            e = e || event;
            e.cancelBubble = true;
            if (!this.en)
                return;
            self.setListOptionSelected(this.idd.replace(that.idPrefix, ""));
            self.obj.renderAs = "dhx_toolbar_btn def";
            self.obj.className = self.obj.renderAs;
            self.arw.className = String(self.obj.renderAs).replace("btn", "arw");
            self.polygon.style.display = "none";
            if (self.polygon._ie6cover)
                self.polygon._ie6cover.style.display = "none";
            that.anyUsed = "none";
            that.callEvent("onClick", [this.idd.replace(that.idPrefix, "")])
        };
        if (isNaN(pos)) {
            self.polygon.appendChild(this.obj)
        } else {
            if (pos < 1) {
                pos = 1
            };
            if (pos > self.polygon.childNodes.length) {
                self.polygon.appendChild(this.obj)
            } else {
                self.polygon.insertBefore(this.obj, self.polygon.childNodes[pos - 1])
            }
        };
        self._listOptions[id] = this.obj;
        return this
    };
    this.polygon = document.createElement("DIV");
    this.polygon.style.display = "none";
    this.polygon.style.zIndex = 101;
    this.polygon.className = "dhx_toolbar_poly_" + that.skin + (that.rtl ? " rtl" : "");
    this.polygon.onselectstart = function(e) {
        e = e || event;
        e.returnValue = false
    };
    for (var q = 0; q < data.childNodes.length; q++) {
        if (data.childNodes[q].tagName == "item") {
            var id = (data.childNodes[q].getAttribute("id") != null ? data.childNodes[q].getAttribute("id") : that._genStr(24));
            var type = (data.childNodes[q].getAttribute("type") != null ? "_" + data.childNodes[q].getAttribute("type") + "ButtonSelectObject" : that._genStr(24));
            if (this[type] != null) {
                that.objPull[that.idPrefix + id] = new this[type](id, data.childNodes[q]);
                that.objPull[that.idPrefix + id]["type"] = "buttonSelectNode";
                that.objPull[that.idPrefix + id]["typeext"] = (String(type).search("separator") != -1 ? "separator" : "button")
            }
        }
    };
    document.body.appendChild(this.polygon);
    if (that._isIE6) {
        this.polygon._ie6cover = document.createElement("IFRAME");
        this.polygon._ie6cover.frameBorder = 0;
        this.polygon._ie6cover.style.position = "absolute";
        this.polygon._ie6cover.style.border = "none";
        this.polygon._ie6cover.style.backgroundColor = "#000000";
        this.polygon._ie6cover.style.filter = "alpha(opacity=100)";
        this.polygon._ie6cover.style.display = "none";
        this.polygon._ie6cover.setAttribute("src", "javascript:false;");
        document.body.appendChild(this.polygon._ie6cover)
    };
    this.setWidth = function(width) {
        this.obj.style.width = width - this.arw.offsetWidth + "px";
        this.polygon.style.width = this.obj.offsetWidth + this.arw.offsetWidth - 2 + "px"
    };
    this.enableItem = function() {
        that._enableItem(this)
    };
    this.disableItem = function() {
        that._disableItem(this)
    };
    this.isEnabled = function() {
        return this.state
    };
    this.showItem = function() {
        this.obj.style.display = "";
        this.arw.style.display = ""
    };
    this.hideItem = function() {
        this.obj.style.display = "none";
        this.arw.style.display = "none"
    };
    this.isVisible = function() {
        return (this.obj.style.display == "")
    };
    this.setItemText = function(text) {
        that._setItemText(this, text)
    };
    this.getItemText = function() {
        return that._getItemText(this)
    };
    this.setItemImage = function(url) {
        that._setItemImage(this, url, true)
    };
    this.clearItemImage = function() {
        that._clearItemImage(this, true)
    };
    this.setItemImageDis = function(url) {
        that._setItemImage(this, url, false)
    };
    this.clearItemImageDis = function() {
        that._clearItemImage(this, false)
    };
    this.setItemToolTip = function(tip) {
        this.obj.title = tip;
        this.arw.title = tip
    };
    this.getItemToolTip = function() {
        return this.obj.title
    };
    this.addListOption = function(id, pos, type, text, img) {
        if (!(type == "button" || type == "separator"))
            return;
        var str = '<item id="' + id + '" type="' + type + '"' + (type == "button" ? ' text="' + text + '"' + (img != null ? ' img="' + img + '"' : '') : '') + '/>';
        var data = that._string2xml(str);
        that.objPull[that.idPrefix + id] = new this["_" + type + "ButtonSelectObject"](id, data.childNodes[0], pos);
        that.objPull[that.idPrefix + id]["type"] = "buttonSelectNode";
        that.objPull[that.idPrefix + id]["typeext"] = type
    };
    this.removeListOption = function(id) {
        if (that.objPull[that.idPrefix + id] == null)
            return;
        var obj = that.objPull[that.idPrefix + id].obj;
        obj.onmouseover = null;
        obj.onmouseout = null;
        obj.onselectstart = null;
        obj.onclick = null;
        obj.className = null;
        obj.en = null;
        while (obj.childNodes.length > 0)
            obj.removeChild(obj.childNodes[0]);
        obj.parentNode.removeChild(obj);
        obj = null;
        try {
            that.objPull[that.idPrefix + id] = null;
            this._listOptions[id] = null;
            delete that.objPull[that.idPrefix + id];
            delete this._listOptions[id]
        } catch (e) {
        }
    };
    this.showListOption = function(id) {
        id = that.idPrefix + id;
        if (that.objPull[id] == null)
            return;
        that.objPull[id].obj.style.display = ""
    };
    this.hideListOption = function(id) {
        id = that.idPrefix + id;
        if (that.objPull[id] == null)
            return;
        that.objPull[id].obj.style.display = "none"
    };
    this.isListOptionVisible = function(id) {
        id = that.idPrefix + id;
        if (that.objPull[id] == null)
            return;
        return (that.objPull[id].obj.style.display != "none")
    };
    this.enableListOption = function(id) {
        id = that.idPrefix + id;
        if (that.objPull[id] == null)
            return;
        if (that.objPull[id].obj.className == "btn_sep")
            return;
        that.objPull[id].obj.en = true;
        that.objPull[id].obj.className = "btn_item"
    };
    this.disableListOption = function(id) {
        id = that.idPrefix + id;
        if (that.objPull[id] == null)
            return;
        if (that.objPull[id].obj.className == "btn_sep")
            return;
        that.objPull[id].obj.en = false;
        that.objPull[id].obj.className = "btn_item dis"
    };
    this.isListOptionEnabled = function(id) {
        id = that.idPrefix + id;
        if (that.objPull[id] == null)
            return;
        if (that.objPull[id].obj.className == "btn_sep")
            return;
        return that.objPull[id].obj.en
    };
    this.setListOptionPosition = function(id, pos) {
        if (this.getListOptionPosition(id) == pos)
            return;
        id = that.idPrefix + id;
        if (that.objPull[id] == null)
            return;
        if (pos < 1) {
            pos = 1
        };
        this.polygon.removeChild(that.objPull[id].obj);
        if (pos > this.polygon.childNodes.length) {
            this.polygon.appendChild(that.objPull[id].obj)
        } else {
            this.polygon.insertBefore(that.objPull[id].obj, this.polygon.childNodes[pos - 1])
        }
    };
    this.getListOptionPosition = function(id) {
        id = that.idPrefix + id;
        var pos = -1;
        if (that.objPull[id] == null)
            return pos;
        for (var q = 0; q < this.polygon.childNodes.length; q++)
            if (this.polygon.childNodes[q] == that.objPull[id].obj)
                pos = q + 1;
        return pos
    };
    this.setListOptionImage = function(id, img) {
        id = that.idPrefix + id;
        if (that.objPull[id] == null)
            return;
        if (that.objPull[id].obj.className == "btn_sep")
            return;
        var imgObj = null;
        if ((that.objPull[id].obj.childNodes[0].tagName).toLowerCase() == "img") {
            imgObj = that.objPull[id].obj.childNodes[0]
        } else {
            imgObj = document.createElement("IMG");
            imgObj.className = "buttonImage";
            imgObj.border = "0";
            that.objPull[id].obj.insertBefore(imgObj, that.objPull[id].obj.childNodes[0])
        };
        imgObj.src = that.imagePath + img
    };
    this.getListOptionImage = function(id) {
        id = that.idPrefix + id;
        if (that.objPull[id] == null)
            return;
        if (that.objPull[id].obj.className == "btn_sep")
            return;
        var img = null;
        if ((that.objPull[id].obj.childNodes[0].tagName).toLowerCase() == "img") {
            img = that.objPull[id].obj.childNodes[0].src
        };
        return img
    };
    this.clearListOptionImage = function(id) {
        id = that.idPrefix + id;
        if (that.objPull[id] == null)
            return;
        if (that.objPull[id].obj.className == "btn_sep")
            return;
        if ((that.objPull[id].obj.childNodes[0].tagName).toLowerCase() == "img") {
            var imgObj = that.objPull[id].obj.childNodes[0];
            that.objPull[id].obj.removeChild(imgObj);
            imgObj = null
        }
    };
    this.setListOptionText = function(id, text) {
        id = that.idPrefix + id;
        if (that.objPull[id] == null)
            return;
        if (that.objPull[id].obj.className == "btn_sep")
            return;
        var obj = that.objPull[id].obj;
        for (var q = 0; q < obj.childNodes.length; q++)
            if (String(obj.childNodes[q].tagName).toLowerCase() == "span")
                obj.childNodes[q].innerHTML = text
    };
    this.getListOptionText = function(id) {
        var text = "";
        id = that.idPrefix + id;
        if (that.objPull[id] == null)
            return;
        if (that.objPull[id].obj.className == "btn_sep")
            return;
        var obj = that.objPull[id].obj;
        for (var q = 0; q < obj.childNodes.length; q++)
            if (String(obj.childNodes[q].tagName).toLowerCase() == "span")
                text = obj.childNodes[q].innerHTML;
        return text
    };
    this.setListOptionToolTip = function(id, tip) {
        id = that.idPrefix + id;
        if (that.objPull[id] == null)
            return;
        if (that.objPull[id].obj.className == "btn_sep")
            return;
        that.objPull[id].obj.title = tip
    };
    this.getListOptionToolTip = function(id) {
        id = that.idPrefix + id;
        if (that.objPull[id] == null)
            return;
        if (that.objPull[id].obj.className == "btn_sep")
            return;
        return that.objPull[id].obj.title
    };
    this.forEachListOption = function(handler) {
        for (var a in this._listOptions)
            handler(a)
    };
    this.getAllListOptions = function() {
        var listData = new Array();
        for (var a in this._listOptions)
            listData[listData.length] = a;
        return listData
    };
    this.setListOptionSelected = function(id) {
        for (var a in this._listOptions) {
            var item = this._listOptions[a];
            if (a == id) {
                item._selected = true;
                if (item.className == "btn_item")
                    item.className = "btn_item" + (this.renderSelect ? " sel" : "")
            } else {
                item._selected = false;
                if (String(item.className).search("sel") != -1)
                    item.className = "btn_item"
            };
            item = null
        }
    };
    this.getListOptionSelected = function() {
        var id = null;
        for (var a in this._listOptions)
            if (this._listOptions[a]._selected == true)
                id = a;
        return id
    };
    return this
};
dhtmlXToolbarObject.prototype._buttonInputObject = function(that, id, data) {
    this.id = that.idPrefix + id;
    this.obj = document.createElement("DIV");
    this.obj.className = "dhx_toolbar_btn def";
    this.obj.idd = String(id);
    this.obj.w = (data.getAttribute("width") != null ? data.getAttribute("width") : 100);
    this.obj.title = (data.getAttribute("title") != null ? data.getAttribute("title") : "");
    this.obj.innerHTML = "<input class='inp' type='text' style='width:" + this.obj.w + "px;'" + (data.getAttribute("value") != null ? "' value='" + data.getAttribute("value") + "'" : "") + ">";
    var th = that;
    var self = this;
    this.obj.childNodes[0].onkeydown = function(e) {
        e = e || event;
        if (e.keyCode == 13) {
            th.callEvent("onEnter", [self.obj.idd, this.value])
        }
    };
    that.base.appendChild(this.obj);
    this.enableItem = function() {
        this.obj.childNodes[0].disabled = false
    };
    this.disableItem = function() {
        this.obj.childNodes[0].disabled = true
    };
    this.isEnabled = function() {
        return (!this.obj.childNodes[0].disabled)
    };
    this.showItem = function() {
        this.obj.style.display = ""
    };
    this.hideItem = function() {
        this.obj.style.display = "none"
    };
    this.isVisible = function() {
        return (this.obj.style.display != "none")
    };
    this.setValue = function(value) {
        this.obj.childNodes[0].value = value
    };
    this.getValue = function() {
        return this.obj.childNodes[0].value
    };
    this.setWidth = function(width) {
        this.obj.w = width;
        this.obj.childNodes[0].style.width = this.obj.w + "px"
    };
    this.getWidth = function() {
        return this.obj.w
    };
    this.setItemToolTip = function(tip) {
        this.obj.title = tip
    };
    this.getItemToolTip = function() {
        return this.obj.title
    };
    return this
};
dhtmlXToolbarObject.prototype._buttonTwoStateObject = function(that, id, data) {
    this.id = that.idPrefix + id;
    this.state = (data.getAttribute("enabled") != null ? false : true);
    this.imgEn = (data.getAttribute("img") != null ? data.getAttribute("img") : "");
    this.imgDis = (data.getAttribute("imgdis") != null ? data.getAttribute("imgdis") : "");
    this.img = (this.state ? (this.imgEn != "" ? this.imgEn : "") : (this.imgDis != "" ? this.imgDis : ""));
    this.obj = document.createElement("DIV");
    this.obj.pressed = (data.getAttribute("selected") != null);
    this.obj.className = "dhx_toolbar_btn " + (this.obj.pressed ? (this.state ? "pres" : "dis") : (this.state ? "def" : "dis"));
    this.obj.renderAs = this.obj.className;
    this.obj.idd = String(id);
    this.obj.title = (data.getAttribute("title") != null ? data.getAttribute("title") : "");
    if (this.obj.pressed) {
        this.obj.renderAs = "dhx_toolbar_btn over"
    };
    this.obj.innerHTML = (this.img != "" ? "<img src='" + that.imagePath + this.img + "'>" : "") + (data.getAttribute("text") != null ? "<div>" + data.getAttribute("text") + "</div>" : "");
    that.base.appendChild(this.obj);
    var obj = this;
    this.obj.onselectstart = function(e) {
        e = e || event;
        e.returnValue = false
    };
    this.obj.onmouseover = function() {
        this._doOnMouseOver()
    };
    this.obj.onmouseout = function() {
        this._doOnMouseOut()
    };
    this.obj._doOnMouseOver = function() {
        if (obj.state == false)
            return;
        if (that.anyUsed != "none")
            return;
        if (this.pressed)
            return;
        this.className = "dhx_toolbar_btn over";
        this.renderAs = this.className
    };
    this.obj._doOnMouseOut = function() {
        if (obj.state == false)
            return;
        if (that.anyUsed != "none")
            return;
        if (this.pressed)
            return;
        this.className = "dhx_toolbar_btn def";
        this.renderAs = this.className
    };
    this.obj.onmousedown = function(e) {
        if (that.checkEvent("onBeforeStateChange"))
            if (!that.callEvent("onBeforeStateChange", [this.idd.replace(that.idPrefix, ""), this.pressed]))
                return;
        if (obj.state == false)
            return;
        if (that.anyUsed != "none")
            return;
        this.pressed = !this.pressed;
        this.className = (this.pressed ? "dhx_toolbar_btn pres" : this.renderAs);
        that.callEvent("onStateChange", [this.idd.replace(that.idPrefix, ""), this.pressed]);
        return false
    };
    this.setItemState = function(state, callEvent) {
        if (this.obj.pressed != state) {
            if (state == true) {
                this.obj.pressed = true;
                this.obj.className = "dhx_toolbar_btn pres";
                this.obj.renderAs = "dhx_toolbar_btn over"
            } else {
                this.obj.pressed = false;
                this.obj.className = "dhx_toolbar_btn def";
                this.obj.renderAs = this.obj.className
            };
            if (callEvent == true)
                that.callEvent("onStateChange", [this.obj.idd.replace(that.idPrefix, ""), this.obj.pressed])
        }
    };
    this.getItemState = function() {
        return this.obj.pressed
    };
    this.enableItem = function() {
        that._enableItem(this)
    };
    this.disableItem = function() {
        that._disableItem(this)
    };
    this.isEnabled = function() {
        return this.state
    };
    this.showItem = function() {
        this.obj.style.display = ""
    };
    this.hideItem = function() {
        this.obj.style.display = "none"
    };
    this.isVisible = function() {
        return (this.obj.style.display == "")
    };
    this.setItemText = function(text) {
        that._setItemText(this, text)
    };
    this.getItemText = function() {
        return that._getItemText(this)
    };
    this.setItemImage = function(url) {
        that._setItemImage(this, url, true)
    };
    this.clearItemImage = function() {
        that._clearItemImage(this, true)
    };
    this.setItemImageDis = function(url) {
        that._setItemImage(this, url, false)
    };
    this.clearItemImageDis = function() {
        that._clearItemImage(this, false)
    };
    this.setItemToolTip = function(tip) {
        this.obj.title = tip
    };
    this.getItemToolTip = function() {
        return this.obj.title
    };
    return this
};
dhtmlXToolbarObject.prototype._sliderObject = function(that, id, data) {
    this.id = that.idPrefix + id;
    this.state = (data.getAttribute("enabled") != null ? false : true);
    this.obj = document.createElement("DIV");
    this.obj.className = "dhx_toolbar_btn def";
    this.obj.onselectstart = function(e) {
        e = e || event;
        e.returnValue = false
    };
    this.obj.idd = String(id);
    this.obj.len = (data.getAttribute("length") != null ? Number(data.getAttribute("length")) : 50);
    this.obj.innerHTML = "<div>" + (data.getAttribute("textMin") != null ? data.getAttribute("textMin") : "") + "</div>" + "<div class='sl_bg_l'></div>" + "<div class='sl_bg_m' style='width:" + this.obj.len + "px;'></div>" + "<div class='sl_bg_r'></div>" + "<div>" + (data.getAttribute("textMax") != null ? data.getAttribute("textMax") : "") + "</div>";
    that.base.appendChild(this.obj);
    var self = this;
    this.pen = document.createElement("DIV");
    this.pen.className = "sl_pen";
    this.obj.appendChild(this.pen);
    var pen = this.pen;
    this.label = document.createElement("DIV");
    this.label.className = "dhx_toolbar_slider_label_" + that.skin + (that.rtl ? " rtl" : "");
    this.label.style.display = "none";
    this.label.tip = (data.getAttribute("toolTip") != null ? data.getAttribute("toolTip") : "%v");
    document.body.appendChild(this.label);
    var label = this.label;
    this.pen.valueMin = (data.getAttribute("valueMin") != null ? Number(data.getAttribute("valueMin")) : 0);
    this.pen.valueMax = (data.getAttribute("valueMax") != null ? Number(data.getAttribute("valueMax")) : 100);
    if (this.pen.valueMin > this.pen.valueMax)
        this.pen.valueMin = this.pen.valueMax;
    this.pen.valueNow = (data.getAttribute("valueNow") != null ? Number(data.getAttribute("valueNow")) : this.pen.valueMax);
    if (this.pen.valueNow > this.pen.valueMax)
        this.pen.valueNow = this.pen.valueMax;
    if (this.pen.valueNow < this.pen.valueMin)
        this.pen.valueNow = this.pen.valueMin;
    this.pen._detectLimits = function() {
        this.minX = self.obj.childNodes[1].offsetLeft - 4;
        this.maxX = self.obj.childNodes[3].offsetLeft - this.offsetWidth + 1
    };
    this.pen._detectLimits();
    this.pen._definePos = function() {
        this.nowX = Math.round((this.valueNow - this.valueMin) * (this.maxX - this.minX) / (this.valueMax - this.valueMin) + this.minX);
        this.style.left = this.nowX + "px";
        this.newNowX = this.nowX
    };
    this.pen._definePos();
    this.pen.initXY = 0;
    this.pen.allowMove = false;
    this.pen.onmousedown = function(e) {
        if (self.state == false)
            return;
        e = e || event;
        this.initXY = e.clientX;
        this.newValueNow = this.valueNow;
        this.allowMove = true;
        this.className = "sl_pen over";
        if (label.tip != "") {
            label.style.visibility = "hidden";
            label.style.display = "";
            label.innerHTML = label.tip.replace("%v", this.valueNow);
            label.style.left = Math.round(getAbsoluteLeft(this) + this.offsetWidth / 2 - label.offsetWidth / 2) + "px";
            label.style.top = getAbsoluteTop(this) - label.offsetHeight - 3 + "px";
            label.style.visibility = ""
        }
    };
    this.pen._doOnMouseMoveStart = function(e) {
        e = e || event;
        if (!pen.allowMove)
            return;
        var ofst = e.clientX - pen.initXY;
        if (e.clientX < getAbsoluteLeft(pen) + Math.round(pen.offsetWidth / 2) && pen.nowX == pen.minX)
            return;
        if (e.clientX > getAbsoluteLeft(pen) + Math.round(pen.offsetWidth / 2) && pen.nowX == pen.maxX)
            return;
        pen.newNowX = pen.nowX + ofst;
        if (pen.newNowX < pen.minX)
            pen.newNowX = pen.minX;
        if (pen.newNowX > pen.maxX)
            pen.newNowX = pen.maxX;
        pen.nowX = pen.newNowX;
        pen.style.left = pen.nowX + "px";
        pen.initXY = e.clientX;
        pen.newValueNow = Math.round((pen.valueMax - pen.valueMin) * (pen.newNowX - pen.minX) / (pen.maxX - pen.minX) + pen.valueMin);
        if (label.tip != "") {
            label.innerHTML = label.tip.replace(/%v/gi, pen.newValueNow);
            label.style.left = Math.round(getAbsoluteLeft(pen) + pen.offsetWidth / 2 - label.offsetWidth / 2) + "px";
            label.style.top = getAbsoluteTop(pen) - label.offsetHeight - 3 + "px"
        }
    };
    this.pen._doOnMouseMoveEnd = function() {
        if (!pen.allowMove)
            return;
        pen.className = "sl_pen";
        pen.allowMove = false;
        pen.nowX = pen.newNowX;
        pen.valueNow = pen.newValueNow;
        if (label.tip != "")
            label.style.display = "none";
        that.callEvent("onValueChange", [self.obj.idd.replace(that.idPrefix, ""), pen.valueNow])
    };
    if (_isIE) {
        document.body.attachEvent("onmousemove", pen._doOnMouseMoveStart);
        document.body.attachEvent("onmouseup", pen._doOnMouseMoveEnd)
    } else {
        window.addEventListener("mousemove", pen._doOnMouseMoveStart, false);
        window.addEventListener("mouseup", pen._doOnMouseMoveEnd, false)
    };
    this.enableItem = function() {
        if (this.state)
            return;
        this.state = true;
        this.obj.className = "dhx_toolbar_btn def"
    };
    this.disableItem = function() {
        if (!this.state)
            return;
        this.state = false;
        this.obj.className = "dhx_toolbar_btn dis"
    };
    this.isEnabled = function() {
        return this.state
    };
    this.showItem = function() {
        this.obj.style.display = ""
    };
    this.hideItem = function() {
        this.obj.style.display = "none"
    };
    this.isVisible = function() {
        return (this.obj.style.display == "")
    };
    this.setValue = function(value, callEvent) {
        value = Number(value);
        if (value < this.pen.valueMin)
            value = this.pen.valueMin;
        if (value > this.pen.valueMax)
            value = this.pen.valueMax;
        this.pen.valueNow = value;
        this.pen._definePos();
        if (callEvent == true)
            that.callEvent("onValueChange", [this.idd.replace(that.idPrefix, ""), this.pen.valueNow])
    };
    this.getValue = function() {
        return this.pen.valueNow
    };
    this.setMinValue = function(value, label) {
        value = Number(value);
        if (value > this.pen.valueMax)
            return;
        this.obj.childNodes[0].innerHTML = label;
        this.obj.childNodes[0].style.display = (label.length > 0 ? "" : "none");
        this.pen.valueMin = value;
        if (this.pen.valueNow < this.pen.valueMin)
            this.pen.valueNow = this.pen.valueMin;
        this.pen._detectLimits();
        this.pen._definePos()
    };
    this.setMaxValue = function(value, label) {
        value = Number(value);
        if (value < this.pen.valueMin)
            return;
        this.obj.childNodes[4].innerHTML = label;
        this.obj.childNodes[4].style.display = (label.length > 0 ? "" : "none");
        this.pen.valueMax = value;
        if (this.pen.valueNow > this.pen.valueMax)
            this.pen.valueNow = this.pen.valueMax;
        this.pen._detectLimits();
        this.pen._definePos()
    };
    this.getMinValue = function() {
        var label = this.obj.childNodes[0].innerHTML;
        var value = this.pen.valueMin;
        return new Array(value, label)
    };
    this.getMaxValue = function() {
        var label = this.obj.childNodes[4].innerHTML;
        var value = this.pen.valueMax;
        return new Array(value, label)
    };
    this.setItemToolTipTemplate = function(template) {
        this.label.tip = template
    };
    this.getItemToolTipTemplate = function() {
        return this.label.tip
    };
    return this
};
dhtmlXToolbarObject.prototype.unload = function() {
    var obj = this.objPull;
    for (var a in obj) {
        var el = obj[a];
        if (el["type"] == "separator") {
            el.hideItem = null;
            el.isVisible = null;
            el.showItem = null;
            el.obj.onselectstart = null;
            if (el.obj.parentNode)
                el.obj.parentNode.removeChild(el.obj);
            el.obj = null;
            el.tr = null
        };
        if (el["type"] == "button") {
            el.clearItemImage = null;
            el.clearItemImageDis = null;
            el.disableItem = null;
            el.enableItem = null;
            el.getItemText = null;
            el.getItemToolTip = null;
            el.hideItem = null;
            el.isEnabled = null;
            el.isVisible = null;
            el.setItemImage = null;
            el.setItemImageDis = null;
            el.setItemText = null;
            el.setItemToolTip = null;
            el.showItem = null;
            el.obj.onselectstart = null;
            el.obj.onmouseover = null;
            el.obj.onmouseout = null;
            el.obj._doOnMouseOver = null;
            el.obj._doOnMouseOut = null;
            el.obj.onclick = null;
            el.obj.onmousedown = null;
            el.obj.onmouseover = null;
            el.obj.onmouseout = null;
            el.obj.onmouseup = null;
            el.obj._doOnMouseUp = null;
            el.obj._doOnMouseUpOnceAnywhere = null;
            if (el.obj.parentNode)
                el.obj.parentNode.removeChild(el.obj);
            el.obj = null;
            el.tr = null
        };
        if (el["type"] == "text") {
            el.getItemText = null;
            el.hideItem = null;
            el.isVisible = null;
            el.setItemText = null;
            el.setWidth = null;
            el.showItem = null;
            el.obj.onselectstart = null;
            if (el.obj.parentNode)
                el.obj.parentNode.removeChild(el.obj);
            el.obj = null;
            el.tr = null
        };
        if (el["type"] == "buttonSelect") {
            el._buttonButtonSelectObject = null;
            el._separatorButtonSelectObject = null;
            el.addListOption = null;
            el.clearItemImage = null;
            el.clearItemImageDis = null;
            el.clearListOptionImage = null;
            el.disableItem = null;
            el.disableListOption = null;
            el.enableItem = null;
            el.enableListOption = null;
            el.forEachListOption = null;
            el.getAllListOptions = null;
            el.getItemText = null;
            el.getItemToolTip = null;
            el.getListOptionImage = null;
            el.getListOptionPosition = null;
            el.getListOptionSelected = null;
            el.getListOptionText = null;
            el.getListOptionToolTip = null;
            el.hideItem = null;
            el.hideListOption = null;
            el.isEnabled = null;
            el.isListOptionEnabled = null;
            el.isListOptionVisible = null;
            el.isVisible = null;
            el.removeListOption = null;
            el.setItemImage = null;
            el.setItemImageDis = null;
            el.setItemText = null;
            el.setItemToolTip = null;
            el.setListOptionImage = null;
            el.setListOptionPosition = null;
            el.setListOptionSelected = null;
            el.setListOptionText = null;
            el.setListOptionToolTip = null;
            el.setWidth = null;
            el.showItem = null;
            el.showListOption = null;
            for (var k in el._listOptions) {
                var op = el._listOptions[k];
                op.onmouseover = null;
                op.onmouseout = null;
                op.onclick = null;
                op.onselectstart = null;
                if (op.parentNode)
                    op.parentNode.removeChild(op);
                op = null;
                try {
                    el._listOptions[k] = null;
                    delete el._listOptions[k]
                } catch (e) {
                }
            };
            el._listOptions = null;
            if (el.polygon._ie6cover) {
                if (el.polygon._ie6cover.parentNode)
                    el.polygon._ie6cover.parentNode.removeChild(el.polygon._ie6cover);
                el.polygon._ie6cover = null
            };
            if (el.polygon.parentNode)
                el.polygon.parentNode.removeChild(el.polygon);
            el.polygon = null;
            el.obj.onmouseover = null;
            el.obj.onmouseout = null;
            el.obj.onclick = null;
            el.obj.onmousedown = null;
            el.obj.onmouseup = null;
            if (el.obj.parentNode)
                el.obj.parentNode.removeChild(el.obj);
            el.obj = null;
            el.arw.onmouseover = null;
            el.arw.onmouseout = null;
            el.arw.onclick = null;
            el.arw.onmousedown = null;
            el.arw.onmouseup = null;
            if (el.arw.parentNode)
                el.arw.parentNode.removeChild(el.arw);
            el.arw = null
        };
        if (el["type"] == "buttonInput") {
            el.disableItem = null;
            el.enableItem = null;
            el.getItemToolTip = null;
            el.getValue = null;
            el.getWidth = null;
            el.hideItem = null;
            el.isEnabled = null;
            el.isVisible = null;
            el.setItemToolTip = null;
            el.setValue = null;
            el.setWidth = null;
            el.showItem = null;
            el.obj.childNodes[0].onkeydown = null;
            if (el.obj.parentNode)
                el.obj.parentNode.removeChild(el.obj);
            el.obj = null;
            el.tr = null
        };
        if (el["type"] == "buttonTwoState") {
            el.clearItemImage = null;
            el.clearItemImageDis = null;
            el.disableItem = null;
            el.enableItem = null;
            el.getItemState = null;
            el.getItemText = null;
            el.getItemToolTip = null;
            el.hideItem = null;
            el.isEnabled = null;
            el.isVisible = null;
            el.setItemImage = null;
            el.setItemImageDis = null;
            el.setItemState = null;
            el.setItemText = null;
            el.setItemToolTip = null;
            el.showItem = null;
            el.state = null;
            el.obj.onselectstart = null;
            el.obj.onmouseover = null;
            el.obj.onmouseout = null;
            el.obj.onmousedown = null;
            el.obj.onmouseup = null;
            el.obj._doOnMouseOver = null;
            el.obj._doOnMouseOut = null;
            if (el.obj.parentNode)
                el.obj.parentNode.removeChild(el.obj);
            el.obj = null;
            el.tr = null
        };
        if (el["type"] == "slider") {
            el.disableItem = null;
            el.enableItem = null;
            el.getItemToolTipTemplate = null;
            el.getMaxValue = null;
            el.getMinValue = null;
            el.getValue = null;
            el.hideItem = null;
            el.isEnabled = null;
            el.isVisible = null;
            el.setItemToolTipTemplate = null;
            el.setMaxValue = null;
            el.setMinValue = null;
            el.setValue = null;
            el.showItem = null;
            el.obj.onselectstart = null;
            var pen = el.pen;
            if (_isIE) {
                document.body.detachEvent("onmousemove", pen._doOnMouseMoveStart);
                document.body.detachEvent("onmouseup", pen._doOnMouseMoveEnd)
            } else {
                window.removeEventListener("mousemove", pen._doOnMouseMoveStart, false);
                window.removeEventListener("mouseup", pen._doOnMouseMoveEnd, false)
            };
            pen = null;
            el.pen.allowMove = null;
            el.pen.onmousedown = null;
            el.pen._detectLimits = null;
            el.pen._definePos = null;
            el.pen._doOnMouseMoveStart = null;
            el.pen._doOnMouseMoveEnd = null;
            el.pen.valueMin = null;
            el.pen.valueMax = null;
            el.pen.valueNow = null;
            el.label.tip = null;
            if (el.pen.parentNode)
                el.pen.parentNode.removeChild(el.pen);
            el.pen = null;
            if (el.label.parentNode)
                el.label.parentNode.removeChild(el.label);
            el.label = null;
            if (el.obj.parentNode)
                el.obj.parentNode.removeChild(el.obj);
            el.obj = null
        };
        el["id"] = null;
        el["type"] = null;
        el = null;
        try {
            obj[a] = null;
            delete obj[a]
        } catch (e) {
        }
    };
    obj = null;
    this.objPull = null;
    this._hkPool = null;
    this.rootTypes = null;
    this.base.innerHTML = "";
    this.base.className = "";
    this.base = null;
    this.tr = null;
    var list = new Array("showItem", "hideItem", "isVisible", "enableItem", "disableItem", "isEnabled", "setItemText", "getItemText", "setItemToolTip", "getItemToolTip", "setItemImage", "setItemImageDis", "clearItemImage", "clearItemImageDis", "setItemState", "getItemState", "setItemToolTipTemplate", "getItemToolTipTemplate", "setValue", "getValue", "setMinValue", "getMinValue", "setMaxValue", "getMaxValue", "setWidth", "getWidth", "_addItem", "_doOnLoad", "_setLayout", "_string2xml", "_xmlLoader", "getType", "getTypeExt", "inArray", "addButton", "addText", "addButtonSelect", "addButtonTwoState", "addSeparator", "addSlider", "addInput", "forEachItem", "_addItemToStorage", "_buttonInputObject", "_buttonObject", "_buttonSelectObject", "_buttonTwoStateObject", "_genStr", "_getPosition",
            "_separatorObject", "_setPosition", "_sliderObject", "_textObject", "_xmlParser", "addListOption", "attachEvent", "callEvent", "checkEvent", "clearListOptionImage", "detachEvent", "disableListOption", "enableListOption", "eventCatcher", "forEachListOption", "getAllListOptions", "getListOptionImage", "getListOptionPosition", "getListOptionSelected", "getListOptionText", "getListOptionToolTip", "getPosition", "hideListOption", "isListOptionEnabled", "_getIdByPosition", "isListOptionVisible", "loadXML", "loadXMLString", "removeItem", "removeListOption", "setIconPath", "setIconsPath", "setListOptionImage", "setListOptionPosition", "setListOptionSelected", "setListOptionText", "setListOptionToolTip", "setPosition", "showListOption", "dhx_Event");
    for (var q = 0; q < list.length; q++)
        this[list[q]] = null;
    list = null;
    this.cont.innerHTML = "";
    this.cont.className = "";
    this.cont = null;
    this.unload = null
};
(function() {
    dhtmlx.extend_api("dhtmlXToolbarObject", {
                _init : function(obj) {
                    return [obj.parent, obj.skin]
                },
                icon_path : "setIconsPath",
                xml : "loadXML",
                items : "items",
                align : "setAlign",
                rtl : "setRTL",
                skin : "setSkin"
            }, {
                items : function(arr) {
                    for (var i = 0; i < arr.length; i++) {
                        var item = arr[i];
                        if (item.type == "button")
                            this.addButton(item.id, null, item.text, item.img, item.img_disabled);
                        if (item.type == "separator")
                            this.addSeparator(item.id, null);
                        if (item.type == "text")
                            this.addText(item.id, null, item.text);
                        if (item.type == "buttonSelect")
                            this.addButtonSelect(item.id, null, item.text, item.options, item.img, item.img_disabled);
                        if (item.type == "buttonTwoState")
                            this.addButtonTwoState(item.id, null, item.text, item.img, item.img_disabled);
                        if (item.type == "buttonInput")
                            this.addInput(item.id, null, item.text);
                        if (item.type == "slider")
                            this.addSlider(item.id, null, item.length, item.value_min, item.value_max, item.value_now, item.text_min, item.text_max, item.tip_template);
                        if (item.width)
                            this.setWidth(item.id, item.width);
                        if (item.disabled)
                            this.disableItem(item.id);
                        if (item.tooltip)
                            this.setItemToolTip(item.id, item.tooltip);
                        if (item.pressed === true)
                            this.setItemState(item.id, true)
                    }
                }
            })
})();