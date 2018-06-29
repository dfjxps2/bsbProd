dhtmlXTreeObject.prototype._serEnts = [["&", "&amp;"], ["<", "&lt;"], [">", "&gt;"]];
dhtmlXTreeObject.prototype.registerXMLEntity = function(rChar, rEntity) {
    this._serEnts[this._serEnts.length] = [rChar, rEntity, new RegExp(rChar, "g")]
};
dhtmlXTreeObject.prototype.setSerializationLevel = function(userData, QT, Sh, OY, arq) {
    this._xuserData = convertStringToBoolean(userData);
    this._xfullXML = convertStringToBoolean(QT);
    this.aci = arq;
    this._xescapeEntities = convertStringToBoolean(Sh);
    if (convertStringToBoolean(OY)) {
        this.Ss = "<![CDATA[";
        this.St = "]]>"
    } else {
    };
    for (var i = 0; i < this._serEnts.length; i++)
        this._serEnts[i][2] = new RegExp(this._serEnts[i][0], "g")
};
dhtmlXTreeObject.prototype.serializeTree = function() {
    if (this.stopEdit)
        this.stopEdit();
    this.Ss = this.Ss || "";
    this.St = this.St || "";
    var out = '<?xml version="1.0"?>';
    if (this.aci)
        out += "<!DOCTYPE tree SYSTEM \"" + this.aci + "\">";
    out += '<tree id="' + this.rootId + '">';
    if ((this._xuserData) && (this._idpull[this.rootId]._userdatalist)) {
        var names = this._idpull[this.rootId]._userdatalist.split(",");
        for (var i = 0; i < names.length; i++)
            out += "<userdata name=\"" + names[i] + "\">" + this.Ss + this._idpull[this.rootId].userData["t_" + names[i]] + this.St + "</userdata>"
    };
    for (var i = 0; i < this.htmlNode.childsCount; i++)
        out += this.pW(this.htmlNode.childNodes[i]);
    out += "</tree>";
    return out
};
dhtmlXTreeObject.prototype.pW = function(itemNode) {
    if (itemNode.unParsed)
        if (document.all)
            return itemNode.unParsed.d.xml;
        else {
            var xmlSerializer = new XMLSerializer();
            return xmlSerializer.serializeToString(itemNode.unParsed.d)
        };
    var out = "";
    if (this._selected.length)
        var lid = this._selected[0].id;
    else
        lid = "\"";
    var text = itemNode.span.innerHTML;
    if (this._xescapeEntities)
        for (var i = 0; i < this._serEnts.length; i++)
            text = text.replace(this._serEnts[i][2], this._serEnts[i][1]);
    if (!this._xfullXML)
        out = '<item id="' + itemNode.id + '" ' + (this._getOpenState(itemNode) == 1 ? ' open="1" ' : '') + (lid == itemNode.id ? ' select="1"' : '') + ' text="' + text + '"' + (((this.XMLsource) && (itemNode.XMLload == 0)) ? " child=\"1\" " : "") + '>';
    else
        out = '<item id="' + itemNode.id + '" ' + (this._getOpenState(itemNode) == 1 ? ' open="1" ' : '') + (lid == itemNode.id ? ' select="1"' : '') + ' text="' + text + '" im0="' + itemNode.images[0] + '" im1="' + itemNode.images[1] + '" im2="' + itemNode.images[2] + '" ' + (itemNode.acolor ? ('aCol="' + itemNode.acolor + '" ') : '') + (itemNode.scolor ? ('sCol="' + itemNode.scolor + '" ') : '') + (itemNode.checkstate == 1 ? 'checked="1" ' : (itemNode.checkstate == 2 ? 'checked="-1"' : '')) + (itemNode.closeable ? 'closeable="1" ' : '') + '>';
    if ((this._xuserData) && (itemNode._userdatalist)) {
        var names = itemNode._userdatalist.split(",");
        for (var i = 0; i < names.length; i++)
            out += "<userdata name=\"" + names[i] + "\">" + this.Ss + itemNode.userData["t_" + names[i]] + this.St + "</userdata>"
    };
    for (var i = 0; i < itemNode.childsCount; i++)
        out += this.pW(itemNode.childNodes[i]);
    out += "</item>";
    return out
};
dhtmlXTreeObject.prototype.saveSelectedItem = function(name, cookie_param) {
    name = name || "";
    this.jf("treeStateSelected" + name, this.getSelectedItemId(), cookie_param)
};
dhtmlXTreeObject.prototype.restoreSelectedItem = function(name) {
    name = name || "";
    var z = this.lG("treeStateSelected" + name);
    this.selectItem(z, false)
};
dhtmlXTreeObject.prototype.enableAutoSavingSelected = function(mode, abZ) {
    this.Zy = convertStringToBoolean(mode);
    if ((this.Zy) && (!this.MF)) {
        this.MF = this.onRowSelect;
        this.onRowSelect = function(e, htmlObject, mode) {
            if (!htmlObject)
                htmlObject = this;
            htmlObject.parentObject.treeNod.MF(e, htmlObject, mode);
            if (htmlObject.parentObject.treeNod.Zy)
                htmlObject.parentObject.treeNod.saveSelectedItem(htmlObject.parentObject.treeNod.Us)
        }
    };
    this.Us = abZ
};
dhtmlXTreeObject.prototype.saveState = function(name, cookie_param) {
    var z = this._escape(this.serializeTree());
    var OZ = 4000;
    if (z.length > OZ) {
        if (navigator.appName.indexOf("Microsoft") != -1)
            return false;
        this.jf("treeStatex" + name, Math.ceil(z.length / OZ));
        for (var i = 0; i < Math.ceil(z.length / OZ); i++) {
            this.jf("treeStatex" + name + "x" + i, z.substr(i * OZ, OZ), cookie_param)
        }
    } else
        this.jf("treeStatex" + name, z, cookie_param);
    var z = this.lG("treeStatex" + name);
    if (!z) {
        this.jf("treeStatex" + name, "", cookie_param);
        return false
    };
    return true
};
dhtmlXTreeObject.prototype.loadState = function(name) {
    var z = this.lG("treeStatex" + name);
    if (!z)
        return false;
    if (z.length) {
        if (z.toString().length < 4) {
            var z2 = "";
            for (var i = 0; i < z; i++) {
                z2 += this.lG("treeStatex" + name + "x" + i)
            };
            z = z2
        };
        this.loadXMLString((this.utfesc == "utf8") ? decodeURI(z) : unescape(z))
    };
    return true
};
dhtmlXTreeObject.prototype.jf = function(name, value, cookie_param) {
    var str = name + "=" + value + (cookie_param ? (";" + cookie_param) : "");
    document.cookie = str
};
dhtmlXTreeObject.prototype.lG = function(name) {
    var search = name + "=";
    if (document.cookie.length > 0) {
        var offset = document.cookie.indexOf(search);
        if (offset != -1) {
            offset += search.length;
            var end = document.cookie.indexOf(";", offset);
            if (end == -1)
                end = document.cookie.length;
            return document.cookie.substring(offset, end)
        }
    }
};
dhtmlXTreeObject.prototype.saveOpenStates = function(name, cookie_param) {
    var z = [];
    for (var i = 0; i < this.htmlNode.childsCount; i++)
        z = z.concat(this.Ab(this.htmlNode.childNodes[i]));
    z = z.join(this.dlmtr);
    this.jf("treeOpenStatex" + name, z, cookie_param)
};
dhtmlXTreeObject.prototype.loadOpenStates = function(name) {
    for (var i = 0; i < this.htmlNode.childsCount; i++)
        this._xcloseAll(this.htmlNode.childNodes[i]);
    this.allTree.childNodes[0].border = "1";
    this.allTree.childNodes[0].border = "0";
    var z = lG("treeOpenStatex" + name);
    if (z) {
        var arr = z.split(this.dlmtr);
        for (var i = 0; i < arr.length; i++) {
            var UN = this._globalIdStorageFind(arr[i]);
            if (UN) {
                if ((this.XMLsource) && (!UN.XMLload) && (UN.id != this.rootId)) {
                    this.Vg(UN, "loadOpenStates('" + name + "')");
                    return
                } else
                    this.openItem(arr[i])
            }
        }
    };
    this.callEvent("onAllOpenDynamic", [])
};
dhtmlXTreeObject.prototype.Vg = function(node, name) {
    this.QK = name;
    this.rE = this.onXLE;
    this.onXLE = this.LM;
    this.loadXML(this.XMLsource + getUrlSymbol(this.XMLsource) + "id=" + this._escape(node.id))
};
dhtmlXTreeObject.prototype.LM = function(tree) {
    tree.onXLE = tree.rE;
    window.setTimeout(function() {
                eval("tree." + tree.QK)
            }, 100);
    if (tree.onXLE)
        tree.onXLE(tree);
    tree.callEvent("onXLE", [tree])
};
dhtmlXTreeObject.prototype.Ab = function(node) {
    var list = [];
    if (this._getOpenState(node) == 1) {
        list.push(node.id);
        for (var i = 0; i < node.childsCount; i++)
            list = list.concat(this.Ab(node.childNodes[i]))
    };
    return list
};
function jf(name, value) {
    document.cookie = name + '=' + value
};
function lG(name) {
    var search = name + "=";
    if (document.cookie.length > 0) {
        var offset = document.cookie.indexOf(search);
        if (offset != -1) {
            offset += search.length;
            var end = document.cookie.indexOf(";", offset);
            if (end == -1)
                end = document.cookie.length;
            return (document.cookie.substring(offset, end))
        }
    }
};
dhtmlXTreeObject.prototype.openAllItemsDynamic = function(itemId) {
    this.oN = new Array();
    this.oR = null;
    var itemNode = this._globalIdStorageFind(itemId || this.rootId);
    if (itemNode.id != this.rootId && tree.getOpenState(itemNode.id) != 0)
        this.openItem(itemId);
    this.sV(itemNode, 0);
    if (this.oN.length > 0) {
        this.rE = this.onXLE;
        this.onXLE = this.Jk;
        this.Jk(this)
    }
};
dhtmlXTreeObject.prototype.sV = function(itemNode) {
    if ((itemNode.XMLload == 0) || (itemNode.unParsed))
        this.oN.push(itemNode);
    for (var i = 0; i < itemNode.childsCount; i++) {
        if (this._getOpenState(itemNode.childNodes[i]) < 0)
            this._HideShow(itemNode.childNodes[i], 2);
        if (itemNode.childNodes[i].childsCount > 0)
            this.sV(itemNode.childNodes[i]);
        if ((itemNode.childNodes[i].XMLload == 0) || (itemNode.childNodes[i].unParsed))
            this.oN.push(itemNode.childNodes[i])
    }
};
dhtmlXTreeObject.prototype.Jk = function(that) {
    if (that.oR) {
        that._openItem(that.oR);
        that.sV(that.oR);
        that.oR = null
    };
    if (that.oN.length > 0)
        that.oR = that.oN.shift();
    if (that.oR)
        if (that.oR.unParsed)
            that.tK(that.oR);
        else
            window.setTimeout(function() {
                        that._loadDynXML(that.oR.id)
                    }, 100);
    else {
        that.onXLE = that.rE;
        if (that.onXLE)
            that.onXLE(that);
        that.callEvent("onAllOpenDynamic", [that])
    }
};
dhtmlXTreeObject.prototype.openItemsDynamic = function(list, flag) {
    if (this.onXLE == this.JC)
        return;
    this.Zc = convertStringToBoolean(flag);
    this.rE = this.onXLE;
    this.onXLE = this.JC;
    this.oN = list.split(",").reverse();
    this.JC(this)
};
dhtmlXTreeObject.prototype.JC = function(that) {
    if (!that.oN.length) {
        that.onXLE = that.rE;
        if (that.Zc)
            that.selectItem(that.oR, true);
        if ((that.onXLE) && (arguments[1]))
            that.onXLE.apply(that, arguments);
        that.callEvent("onOpenDynamicEnd", []);
        return
    };
    that.oR = that.oN.pop();
    var temp = that._globalIdStorageFind(that.oR);
    if (temp.XMLload === 0)
        that.openItem(that.oR);
    else {
        that.openItem(that.oR);
        that.JC(that)
    }
};