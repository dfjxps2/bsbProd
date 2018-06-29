dhtmlXTreeObject.prototype.enableSmartRendering = function() {
    this.enableSmartXMLParsing(true);
    this._srnd = true;
    this.rj = 18;
    var that = this;
    this.allTree.onscroll = function() {
        if (that.aeA)
            return;
        that.aeA = window.setTimeout(function() {
                    that.aeA = null;
                    that.CI()
                }, 300)
    };
    this.attachEvent("onXLE", function() {
                that.CI()
            });
    this.WC()
};
dhtmlXTreeObject.prototype.CI = function() {
    if (!this._idpull[this.rootId].Rb)
        this.zz(this.rootId, true);
    var top = this.allTree.scrollTop;
    var pos = Math.floor(top / this.rj);
    var height = Math.ceil(this.allTree.offsetHeight / this.rj);
    this.TO = true;
    this.Ih(top, this.rj, height, null, false, this.DY);
    this.TO = false
};
dhtmlXTreeObject.prototype.DY = function(a, b) {
    if (!a.span) {
        a.span = -1;
        var z = a.parentObject.htmlNode.childNodes[0].childNodes;
        var count = b * this.rj;
        var x = null;
        for (var i = 1; i < z.length; i++) {
            x = z[i];
            var y = x.nodem ? this.rj : (x.offsetHeight || parseInt(x.childNodes[1].firstChild.style.height));
            count -= y;
            if (count < 0) {
                if (count == -1) {
                    count++;
                    continue
                };
                var h = x.childNodes[1].firstChild;
                h.style.height = (parseInt(h.style.height) - (y - Math.abs(count) + this.rj)) + "px";
                if (Math.abs(count) != y) {
                    var fill = this.FP(count + y, true);
                    x.parentNode.insertBefore(fill, x)
                };
                x.tr = {
                    nextSibling : x
                };
                break
            }
        };
        if (h && h.style.height != "0px" && !x.offsetHeight) {
            var rh = this._hAdI;
            this._hAdI = true
        };
        this._parseItem(a.anr, a.parentObject, null, x);
        if (h && h.style.height != "0px" && !x.offsetHeight) {
            this._hAdI = rh
        };
        if (a.unParsed)
            this._correctPlus(a);
        if (h && h.style.height == "0px")
            x.parentNode.removeChild(x)
    }
};
dhtmlXTreeObject.prototype.aaQ = function(z, skipParsing) {
    if (z.parentObject)
        this._globalIdStorageFind(z.parentObject.id);
    if (!this._idpull[this.rootId].Rb)
        this.zz(this.rootId, true);
    this.DY(z, this._getIndex(z));
    if ((z.unParsed) && (!skipParsing))
        this.tK(z, 0);
    if (!z.zz)
        this.zz(z.id)
};
dhtmlXTreeObject.prototype._getIndex = function(z) {
    for (var a = 0; a < z.parentObject.childsCount; a++)
        if (z.parentObject.childNodes[a] == z)
            return a
};
dhtmlXTreeObject.prototype.zz = function(it, mode) {
    it = this._idpull[it];
    if (it.Rb)
        return;
    var tr = this.FP(this.rj * it.childsCount, mode);
    it.htmlNode.childNodes[0].appendChild(tr);
    it.Rb = true
};
dhtmlXTreeObject.prototype.FP = function(s, mode) {
    var t = document.createElement("TR");
    var b = document.createElement("TD");
    var b2 = document.createElement("TD");
    var z = document.createElement("DIV");
    z.innerHTML = "&nbsp;";
    b.appendChild(z);
    t.appendChild(b2);
    t.appendChild(b);
    if (!mode) {
        t.style.display = "none"
    };
    z.style.height = s + 'px';
    return t
};
dhtmlXTreeObject.prototype.aiV = function(item, mode) {
    if ((!mode) && (item.childsCount))
        return item.childNodes[0];
    if (item == this.htmlNode)
        return -1;
    if ((item.tr) && (item.tr.nextSibling) && (item.tr.nextSibling.nodem))
        return item.tr.nextSibling.nodem;
    return this._getNextNode(item.parentObject, true)
};
dhtmlXTreeObject.prototype.Ih = function(pos, h, l, i, m, f) {
    if (!i) {
        this.aef = pos;
        i = this._idpull[this.rootId]
    };
    for (var j = 0; j < i.childsCount; j++) {
        this.aef -= h;
        if (this.aef <= 0)
            m = true;
        if (m) {
            f.apply(this, [i.childNodes[j], j]);
            l--
        };
        if (l < 0)
            return l;
        if (i.childNodes[j]._open) {
            l = this.Ih(null, h, l, i.childNodes[j], m, f);
            if (l < 0)
                return l
        }
    };
    return l
};
dhtmlXTreeObject.prototype._addItemSRND = function(pid, id, p) {
    var parentObject = this._idpull[pid];
    var Count = parentObject.childsCount;
    var Nodes = parentObject.childNodes;
    Nodes[Count] = new dhtmlXTreeItemObject(id, "", parentObject, this, null, 1);
    itemId = Nodes[Count].id;
    Nodes[Count].anr = p.clone();
    parentObject.childsCount++
};
dhtmlXTreeObject.prototype.WC = function() {
    this._redrawFrom = function() {
    };
    var Yr = dhtmlXTreeItemObject;
    this.WC = function() {
    };
    window.dhtmlXTreeItemObject = function(itemId, itemText, parentObject, treeObject, actionHandler, mode) {
        if (!treeObject._srnd) {
            return Yr.call(this, itemId, itemText, parentObject, treeObject, actionHandler, mode)
        };
        this.htmlNode = "";
        this.acolor = "";
        this.scolor = "";
        this.tr = 0;
        this.childsCount = 0;
        this.tempDOMM = 0;
        this.tempDOMU = 0;
        this.dragSpan = 0;
        this.dragMove = 0;
        this.span = 0;
        this.closeble = 1;
        this.childNodes = new Array();
        this.userData = new cObject();
        this.checkstate = 0;
        this.treeNod = treeObject;
        this.label = itemText;
        this.parentObject = parentObject;
        this.actionHandler = actionHandler;
        this.images = new Array(treeObject.imageArray[0], treeObject.imageArray[1], treeObject.imageArray[2]);
        this.id = treeObject._globalIdStorageAdd(itemId, this);
        if (itemId == treeObject.rootId) {
            if (this.treeNod.checkBoxOff)
                this.htmlNode = this.treeNod._createItem(1, this, mode);
            else
                this.htmlNode = this.treeNod._createItem(0, this, mode);
            this.htmlNode.objBelong = this
        };
        return this
    };
    this.setCheckSR = this.setCheck;
    this.setCheck = function(itemId, state) {
        this._globalIdStorageFind(itemId);
        return this.setCheckSR(itemId, state)
    };
    this.aif = function(id) {
        var p = [];
        while (id != this.rootId) {
            var pid = this.getParentId(id);
            for (var i = 0; i < this._idpull[pid].childsCount; i++)
                if (this._idpull[pid].childNodes[i].id == id) {
                    p.push([pid, i]);
                    break
                };
            id = pid
        };
        p.reverse();
        return p
    };
    this.agU = function(id, p, mask) {
        p = p || [];
        var pos = 0;
        while (true) {
            var i = this._idpull[id];
            if (i.anr && this.sy(i.anr.d, "text", mask))
                this._globalIdStorageFind(i.id);
            var pos = i.childsCount;
            if (!pos)
                break;
            p.push([id, pos - 1]);
            id = i.childNodes[pos - 1].id
        };
        return p
    };
    this.agz = function(p, mask) {
        if (!p.length)
            p.push.apply(p, this.agU(0, null, mask));
        var last = p[p.length - 1];
        if (last[1]) {
            last[1]--;
            var curr = this._idpull[last[0]].childNodes[last[1]];
            this.agU(curr.id, p, mask);
            var last = p[p.length - 1];
            return this._idpull[last[0]].childNodes[last[1]]
        } else {
            p.pop();
            if (!p.length)
                return this.agz(p, mask);
            var last = p[p.length - 1];
            return this._idpull[last[0]].childNodes[last[1]]
        }
    };
    this.agB = function(p, skip) {
        if (!p.length)
            p.push([this.rootId, 0]);
        var last = p[p.length - 1];
        var curr = this._idpull[last[0]].childNodes[last[1]];
        if (curr.childsCount && !skip) {
            p.push([curr.id, 0]);
            return curr.childNodes[0]
        };
        last[1]++;
        var curr = this._idpull[last[0]].childNodes[last[1]];
        if (curr)
            return curr;
        p.pop();
        if (!p.length)
            return this.htmlNode;
        return this.agB(p, true)
    };
    this.Cj = function(searchStr, direction, dK) {
        var searchStr = searchStr.replace(new RegExp("^( )+"), "").replace(new RegExp("( )+$"), "");
        searchStr = new RegExp(searchStr.replace(/([\*\+\\\[\]\(\)]{1})/gi, "\\$1").replace(/ /gi, ".*"), "gi");
        if (!dK) {
            dK = this._selected[0];
            if (!dK)
                dK = this.htmlNode
        };
        var An = dK;
        var p = this.aif(An.id);
        while (dK = (direction ? this.agz(p, searchStr) : this.agB(p))) {
            if (dK.label) {
                if (dK.label.search(searchStr) != -1)
                    return dK
            } else {
                if (dK.anr) {
                    if (dK.anr.get("text").search(searchStr) != -1)
                        return dK;
                    if (this.sy(dK.anr.d, "text", searchStr))
                        this._globalIdStorageFind(dK.id)
                }
            };
            if ((dK.unParsed) && (this.sy(dK.unParsed.d, "text", searchStr)))
                this.tK(dK);
            if (An == dK)
                break
        };
        return null
    };
    this.deleteChildItems = function(id) {
        if (this.rootId == id) {
            this._selected = new Array();
            this._idpull = {};
            this._p = this.aef = this._pullSize = null;
            this.allTree.removeChild(this.htmlNode.htmlNode);
            this.htmlNode = new dhtmlXTreeItemObject(this.rootId, "", 0, this);
            this.htmlNode.htmlNode.childNodes[0].childNodes[0].style.display = "none";
            this.htmlNode.htmlNode.childNodes[0].childNodes[0].childNodes[0].className = "hiddenRow";
            this.allTree.insertBefore(this.htmlNode.htmlNode, this.selectionBar);
            if (_isFF) {
                this.allTree.childNodes[0].width = "100%";
                this.allTree.childNodes[0].style.overflow = "hidden"
            }
        }
    };
    this._HideShow = function(itemObject, mode) {
        if ((this.XMLsource) && (!itemObject.XMLload)) {
            if (mode == 1)
                return;
            itemObject.XMLload = 1;
            this._loadDynXML(itemObject.id);
            return
        };
        if (!itemObject.span)
            this.aaQ(itemObject);
        if (itemObject.unParsed) {
            this.tK(itemObject);
            this.zz(itemObject.id)
        };
        if (itemObject.childsCount == 0)
            return;
        var Nodes = itemObject.htmlNode.childNodes[0].childNodes;
        var Count = Nodes.length;
        if (Count > 1) {
            if (((Nodes[1].style.display != "none") || (mode == 1)) && (mode != 2)) {
                this.allTree.childNodes[0].border = "1";
                this.allTree.childNodes[0].border = "0";
                var nodestyle = "none";
                itemObject._open = false
            } else {
                var nodestyle = "";
                itemObject._open = true
            };
            for (var i = 1; i < Count; i++)
                Nodes[i].style.display = nodestyle;
            this.CI()
        };
        this._correctPlus(itemObject)
    }
};