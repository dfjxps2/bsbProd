

dhtmlXGridObject.prototype.ia = function(z) {
    if (!z.update || z.id == 0)
        return;
    if (this.rowsAr[z.id].JW)
        this.rowsAr[z.id].JW.src = this.imgURL + z.state + ".gif";
    z.update = false
};
dhtmlXGridObject.prototype.doExpand = function(obj) {
    this.editStop();
    var row = obj.parentNode.parentNode.parentNode;
    var r = this._h2.get[row.idd];
    if (!this.callEvent("onOpen", [row.idd, (r.state == "plus" ? -1 : 1)]))
        return;
    if (r.state == "plus")
        this.expandKids(row);
    else if ((r.state == "minus") && (!r.aaZ))
        this.collapseKids(row)
};
function dhtmlxHierarchy() {
    var z = {
        id : 0,
        childs : [],
        level : -1,
        parent : null,
        index : 0,
        state : dhtmlXGridObject.uT
    };
    this.order = [z];
    this.get = {
        "0" : z
    };
    this.aqd = function(a, b) {
        var p = a.parent;
        var z = a.index;
        p.childs[z] = b;
        p.childs[b.index] = a;
        a.index = b.index;
        b.index = z
    };
    this.forEachChildF = function(id, xj, that, funct2) {
        var z = this.get[id];
        for (var i = 0; i < z.childs.length; i++) {
            if (!xj.apply((that || this), [z.childs[i]]))
                continue;
            if (z.childs[i].childs.length)
                this.forEachChildF(z.childs[i].id, xj, that, funct2);
            if (funct2)
                funct2.call((that || this), z.childs[i])
        }
    };
    this.forEachChild = function(id, xj, that) {
        var z = this.get[id];
        for (var i = 0; i < z.childs.length; i++) {
            xj.apply((that || this), [z.childs[i]]);
            if (z.childs[i].childs.length)
                this.forEachChild(z.childs[i].id, xj, that)
        }
    };
    this.JA = function(id, name, val) {
        var z = this.get[id];
        if (z[name] == val)
            return;
        z[name] = val;
        z.update = true
    };
    this.add = function(id, parentId) {
        return this.Oj(id, parentId)
    };
    this.Oj = function(id, parentId, RH, arK) {
        var z = this.get[parentId || 0];
        if (RH)
            var ind = this.get[RH].index + (arK ? 0 : 1);
        else
            var ind = z.childs.length;
        var x = {
            id : id,
            childs : [],
            level : z.level + 1,
            parent : z,
            index : ind,
            state : dhtmlXGridObject.uT
        };
        if (z.state == dhtmlXGridObject.uT)
            this.JA(parentId, "state", (parentId == 0 ? "minus" : "plus"));
        if (RH) {
            for (var i = ind; i < z.childs.length; i++)
                z.childs[i].index++;
            z.childs = z.childs.slice(0, ind).concat([x]).concat(z.childs.slice(ind, z.childs.length))
        } else
            z.childs.push(x);
        this.get[id] = x;
        return x
    };
    this.acA = function(id, parentId, afp) {
        return this.Oj(id, parentId, afp, true)
    };
    this.remove = function(id) {
        var z = this.get[id || 0];
        for (var i = 0; i < z.childs.length; i++)
            this.SS(z.childs[i].id);
        z.childs = [];
        z.parent.childs = z.parent.childs.slice(0, z.index).concat(z.parent.childs.slice(z.index + 1));
        for (var i = z.index; i < z.parent.childs.length; i++)
            z.parent.childs[i].index--;
        delete this.get[id]
    };
    this.SS = function(id) {
        var z = this.get[id || 0];
        for (var i = 0; i < z.childs.length; i++)
            this.SS(z.childs[i].id);
        z.childs = [];
        delete this.get[id]
    };
    return this
};
dhtmlXGridObject.prototype._getOpenLenght = function(id, start) {
    var z = this._h2.get[id].childs;
    start += z.length;
    for (var i = 0; i < z.length; i++)
        if (z[i].childs.length && z[i].state == 'minus')
            start += this._getOpenLenght(z[i].id, 0);
    return start
};
dhtmlXGridObject.prototype.collapseKids = function(uG) {
    var r = this._h2.get[uG.idd];
    if (r.state != "minus")
        return;
    if (!this.callEvent("onOpenStart", [uG.idd, 1]))
        return;
    var start = uG.rowIndex;
    if (start < 0)
        start = this.rowsCol._dhx_find(uG) + 1;
    this._h2.JA(r.id, "state", "plus");
    this.ia(r);
    if (this._srnd || this.pagingOn) {
        this._h2_to_buff();
        this._renderSort()
    } else {
        var len = this._getOpenLenght(this.rowsCol[start - 1].idd, 0);
        for (var i = 0; i < len; i++)
            this.rowsCol[start + i].parentNode.removeChild(this.rowsCol[start + i]);
        this.rowsCol.splice(start, len)
    };
    this.callEvent("onGridReconstructed", []);
    this.setSizes();
    this._h2_to_buff();
    this.callEvent("onOpenEnd", [uG.idd, -1])
};
dhtmlXGridObject.prototype.MI = function(r, start, ind, skip) {
    var alD = [];
    var par = (_isKHTML ? this.obj : this.obj.rows[0].parentNode);
    this._h2_to_buff();
    if (this._srnd || this.pagingOn)
        return this._renderSort();
    var len = this._getOpenLenght(r.id, 0);
    for (var i = 0; i < len; i++) {
        var ra = this.render_row(ind + i);
        if (start)
            start.parentNode.insertBefore(ra, start);
        else
            par.appendChild(ra);
        alD.push(ra)
    };
    this.rowsCol = dhtmlxArray(this.rowsCol.slice(0, ind).concat(alD).concat(this.rowsCol.slice(ind)));
    return r.childs.length + alD.length
};
dhtmlXGridObject.prototype.expandKids = function(uG, sEv) {
    var r = this._h2.get[uG.idd];
    if ((!r.childs.length) && (!r._xml_await))
        return;
    if (r.state != "plus")
        return;
    if (!r.Oo && !sEv)
        if (!this.callEvent("onOpenStart", [r.id, -1]))
            return;
    var start = this.getRowIndex(r.id) + 1;
    if (r.childs.length) {
        r.Oo = false;
        this._h2.JA(r.id, "state", "minus");
        this.ia(r);
        var len = this.MI(r, this.rowsCol[start], start);
        this.callEvent("onGridReconstructed", [])
    } else {
        if (r._xml_await) {
            r.Oo = true;
            if (this.callEvent("onDynXLS", [r.id]))
                this.loadXML(this.Ey + "" + (this.Ey.indexOf("?") != -1 ? "&" : "?") + "id=" + r.id)
        }
    };
    this.setSizes();
    if (!r.Oo)
        this.callEvent("onOpenEnd", [r.id, 1]);
    this._fixAlterCss()
};
dhtmlXGridObject.prototype.Ey = "";
dhtmlXGridObject.prototype.sortTreeRows = function(col, type, order) {
    var amet = "getValue";
    if (this.cells5({
                parentNode : {
                    grid : this
                }
            }, this.getColType(col)).getDate) {
        amet = "getDate";
        type = "str"
    };
    this.forEachRow(function(id) {
                var z = this._h2.get[id];
                if (!z)
                    return;
                var label = this._get_cell_value(z.buff, col, amet);
                if (type == 'int') {
                    z.pK = parseFloat(label);
                    z.pK = isNaN(z.pK) ? -99999999999999 : z.pK
                } else
                    z.pK = label
            });
    var self = this;
    var pos = 1;
    var akh = -1;
    if (order == "des") {
        pos = -1;
        akh = 1
    };
    var xj = null;
    if (type == 'cus')
        xj = function(a, b) {
            return self._customSorts[col](a.pK, b.pK, order, a.id, b.id)
        };
    if (type == 'str')
        xj = function(a, b) {
            return (a.pK < b.pK ? akh : (a.pK == b.pK ? 0 : pos))
        };
    if (type == 'int')
        xj = function(a, b) {
            return (a.pK < b.pK ? akh : (a.pK == b.pK ? 0 : pos))
        };
    if (type == 'date')
        xj = function(a, b) {
            return (Date.parse(new Date(a.pK || "01/01/1900")) - Date.parse(new Date(b.pK || "01/01/1900"))) * pos
        };
    this.ID(xj, 0);
    this._renderSort(0, true);
    this.callEvent("onGridReconstructed", [])
};
dhtmlXGridObject.prototype.ID = function(xj, id) {
    var ar = this._h2.get[id].childs;
    ar.sort(xj);
    for (var i = 0; i < ar.length; i++) {
        if (ar[i].childs.length)
            this.ID(xj, ar[i].id);
        ar[i].index = i
    }
};
dhtmlXGridObject.prototype._renderSort = function(id, mode) {
    this._h2_to_buff();
    var top = this.objBox.scrollTop;
    this._reset_view();
    this.objBox.scrollTop = top
};
dhtmlXGridObject.prototype._fixAlterCssTGR = function() {
    if (!this._realfake)
        this._h2.forEachChild(0, function(x) {
                    if (x.buff.tagName == "TR") {
                        var cs = (x.level % 2) ? this._cssUnEven : this._cssEven;
                        this.rowsAr[x.id].className = (cs + (this._cssSU ? (" " + cs + "_" + x.level) : "")) + " " + (this.rowsAr[x.id]._css || "") + ((this.rowsAr[x.id].className.indexOf("rowselected") != -1) ? " rowselected" : "")
                    }
                }, this)
};
dhtmlXGridObject.prototype.moveRowUDTG = function(id, dir) {
    var x = this._h2.get[id];
    var p = x.parent.childs[x.index + dir];
    if ((!p) || (p.parent != x.parent))
        return;
    var state = [x.state, p.state];
    this.collapseKids(this.rowsAr[x.id]);
    this.collapseKids(this.rowsAr[p.id]);
    var ind = this.rowsCol._dhx_find(this.rowsAr[id]);
    var bInd = this.rowsBuffer._dhx_find(this.rowsAr[id]);
    var nod = this.obj.rows[0].parentNode.removeChild(this.rowsCol[ind]);
    var tar = this.rowsCol[ind + ((dir == 1) ? 2 : dir)];
    if (tar)
        tar.parentNode.insertBefore(nod, tar);
    else
        this.obj.rows[0].parentNode.appendChild(nod);
    this.rowsCol._dhx_swapItems(ind, ind + dir);
    this.rowsBuffer._dhx_swapItems(bInd, bInd + dir);
    this._h2.aqd(p, x);
    if (state[0] == "minus")
        this.expandKids(this.rowsAr[x.id]);
    if (state[1] == "minus")
        this.expandKids(this.rowsAr[p.id]);
    this._fixAlterCss(Math.min(ind, ind + dir))
};
function eXcell_tree(cell) {
    if (cell) {
        this.cell = cell;
        this.grid = this.cell.parentNode.grid
    };
    this.isDisabled = function() {
        return this.grid.ZU
    };
    this.edit = function() {
        if ((this.er) || (this.grid.ZU))
            return;
        this.er = this.cell.parentNode.valTag;
        this.val = this.er.innerHTML;
        this.cell.atag = ((!this.grid.multiLine) && (_isKHTML || _isMacOS || _isFF)) ? "INPUT" : "TEXTAREA";
        this.er.innerHTML = "<" + this.cell.atag + " class='dhx_combo_edit' type='text' style='height:" + (this.cell.offsetHeight - 6) + "px;width:100%;border:0px;margin:0px;padding:0px;padding-top:" + (_isFF ? 1 : 2) + "px;overflow:hidden;'></" + this.cell.atag + ">";
        this.er.childNodes[0].onmousedown = function(e) {
            (e || event).cancelBubble = true
        };
        this.er.childNodes[0].onselectstart = function(e) {
            if (!e)
                e = event;
            e.cancelBubble = true;
            return true
        };
        if (_isFF)
            this.er.style.top = "1px";
        this.er.className += " editable";
        this.er.firstChild.onclick = function(e) {
            (e || event).cancelBubble = true
        };
        this.er.firstChild.value = this.val;
        this.obj = this.er.firstChild;
        this.er.firstChild.style.width = Math.max(0, this.cell.offsetWidth - this.er.offsetLeft) + "px";
        this.er.firstChild.focus()
    };
    this.detach = function() {
        if (!this.er)
            return;
        this.setLabel(this.er.firstChild.value);
        this.er.className = this.er.className.replace("editable", "");
        var z = (this.val != this.er.innerHTML);
        if (_isFF)
            this.er.style.top = "2px";
        this.obj = this.er = null;
        return (z)
    };
    this.getValue = function() {
        return this.getLabel()
    };
    this.setImage = function(url) {
        this.cell.parentNode.JW.nextSibling.src = this.grid.iconURL + url;
        this.grid._h2.get[this.cell.parentNode.idd].image = url
    };
    this.getImage = function() {
        this.grid._h2.get[this.cell.parentNode.idd].image
    };
    this.setLabel = function(val) {
        this.je(val)
    };
    this.getLabel = function(val) {
        return this.cell.parentNode.valTag.innerHTML
    }
};
eXcell_tree.prototype = new eXcell;
eXcell_tree.prototype.je = function(content) {
    this.cell.parentNode.valTag.innerHTML = content;
    this.grid.callEvent("onCellChanged", [this.cell.parentNode.idd, this.cell._cellIndex, content])
};
eXcell_tree.prototype.setValue = function(sg) {
    if (this.cell.parentNode.JW)
        return this.setLabel(sg);
    if ((this.grid._tgc.imgURL == null) || (this.grid._tgc.imgURL != this.grid.imgURL)) {
        var _tgc = {};
        _tgc.amo = "<img src='" + this.grid.imgURL + "blank.gif' align='absmiddle' class='space'>";
        _tgc.abD = "<img src='" + this.grid.imgURL;
        _tgc.imsti = "<img src='" + (this.grid.iconURL || this.grid.imgURL);
        _tgc.ZY = "' align='absmiddle' onclick='this." + (_isKHTML ? "" : "parentNode.") + "parentNode.parentNode.parentNode.parentNode.grid.doExpand(this);event.cancelBubble=true;'>";
        _tgc.plus = _tgc.abD + "plus.gif" + _tgc.ZY;
        _tgc.minus = _tgc.abD + "minus.gif" + _tgc.ZY;
        _tgc.blank = _tgc.abD + "blank.gif" + _tgc.ZY;
        _tgc.start = "<div class='treegrid_cell' style='overflow:hidden;white-space : nowrap;height:" + (_isIE ? 20 : 18) + "px;'>";
        _tgc.akX = "' align='absmiddle' " + (this.grid.Mo ? (" height=\"" + this.grid.Mo + "\"") : "") + (this.grid.Qb ? (" width=\"" + this.grid.Qb + "\"") : "") + " ><span " + (_isFF ? "style='position:relative;top:2px;'" : "") + "id='nodeval'>";
        _tgc.close = "</span></div>";
        this.grid._tgc = _tgc
    };
    var _h2 = this.grid._h2;
    var _tgc = this.grid._tgc;
    var rid = this.cell.parentNode.idd;
    var row = this.grid._h2.get[rid];
    if (this.grid.Ey || this.grid.mI) {
        row.has_kids = (row.has_kids || (this.cell.parentNode._attrs["xmlkids"] && (row.state != "minus")));
        row._xml_await = !!row.has_kids
    };
    row.image = row.image || (this.cell._attrs["image"] || "leaf.gif");
    row.label = sg;
    var html = [_tgc.start];
    for (var i = 0; i < row.level; i++)
        html.push(_tgc.amo);
    if (row.has_kids) {
        html.push(_tgc.plus);
        row.state = "plus"
    } else
        html.push(_tgc.abD + row.state + ".gif" + _tgc.ZY);
    html.push(_tgc.imsti);
    html.push(row.image);
    html.push(_tgc.akX);
    html.push(row.label);
    html.push(_tgc.close);
    this.cell.innerHTML = html.join("");
    this.cell.parentNode.JW = this.cell.childNodes[0].childNodes[row.level];
    this.cell.parentNode.valTag = this.cell.childNodes[0].childNodes[row.level + 2];
    if (_isKHTML)
        this.cell.vAlign = "top";
    if (row.parent.id != 0 && row.parent.state == "plus") {
        this.grid.ia(row.parent, false);
        this.cell.parentNode._skipInsert = true
    };
    this.grid.callEvent("onCellChanged", [rid, this.cell._cellIndex, sg])
};
dhtmlXGridObject.prototype._process_tree_xml = function(xml, top, pid) {
    this._parsing = true;
    var main = false;
    if (!top) {
        this.render_row = this.render_row_tree;
        main = true;
        top = xml.getXMLTopNode(this.xml.top);
        pid = top.getAttribute("parent") || 0;
        if (pid == "0")
            pid = 0;
        if (!this._h2)
            this._h2 = new dhtmlxHierarchy();
        if (this._fake)
            this._fake._h2 = this._h2
    };
    var rows = xml.doXPath(this.xml.row, top);
    this._open = this._open || [];
    for (var i = 0; i < rows.length; i++) {
        var id = rows[i].getAttribute("id");
        if (!id) {
            id = this.uid();
            rows[i].setAttribute("id", id)
        };
        var row = this._h2.add(id, pid);
        row.buff = {
            idd : id,
            data : rows[i],
            _parser : this._process_xml_row,
            _locator : this._get_xml_data
        };
        if (rows[i].getAttribute("open")) {
            row.state = "minus";
            this._open.push(id)
        };
        this.rowsAr[id] = row.buff;
        this._process_tree_xml(xml, rows[i], id)
    };
    if (main) {
        if (!rows.length)
            this._h2.JA(pid, "state", dhtmlXGridObject.uT);
        else if (pid != 0 && !this._srnd)
            this._h2.JA(pid, "state", "minus");
        for (var i = 0; i < this._open.length; i++) {
            var r = this._h2.get[this._open[i]];
            if (!r.childs.length)
                r.state = dhtmlXGridObject.uT
        };
        this.ia(this._h2.get[pid]);
        this._h2_to_buff();
        if (pid != 0 && this._srnd)
            this.openItem(pid);
        else
            this.render_dataset();
        if (this.Ey) {
            for (var i = 0; i < this._open.length; i++) {
                var r = this._h2.get[this._open[i]];
                if (r._xml_await)
                    this.expandKids({
                                idd : r.id
                            })
            }
        };
        this._open = [];
        if (this.mI === false) {
            this.forEachRow(function(id) {
                        this.render_row_tree(0, id)
                    })
        };
        this._parsing = false
    }
};
dhtmlXGridObject.prototype._h2_to_buff = function(top) {
    if (!top) {
        top = this._h2.get[0];
        this.rowsBuffer = new dhtmlxArray()
    };
    for (var i = 0; i < top.childs.length; i++) {
        this.rowsBuffer.push(top.childs[i].buff);
        if (top.childs[i].state == "minus")
            this._h2_to_buff(top.childs[i])
    }
};
dhtmlXGridObject.prototype.render_row_tree = function(ind, id) {
    if (id) {
        var r = this._h2.get[id];
        r = r ? r.buff : r
    } else
        var r = this.rowsBuffer[ind];
    if (!r)
        return -1;
    if (r._parser) {
        if (this.rowsAr[r.idd] && this.rowsAr[r.idd].tagName == "TR")
            return this._h2.get[r.idd].buff = this.rowsBuffer[ind] = this.rowsAr[r.idd];
        var row = this._prepareRow(r.idd);
        this.rowsAr[r.idd] = row;
        if (!id)
            this.rowsBuffer[ind] = row;
        this._h2.get[r.idd].buff = row;
        r._parser.call(this, row, r.data);
        this._postRowProcessing(row);
        return row
    };
    return r
};
dhtmlXGridObject.prototype._removeTrGrRow = function(node, x) {
    if (x) {
        this._h2.forEachChild(x.id, function(x) {
                    this._removeTrGrRow(null, x);
                    delete this.rowsAr[x.id]
                }, this);
        return
    };
    var ind = this.getRowIndex(node.idd);
    var x = this._h2.get[node.idd];
    if (ind != -1 && ind !== this.undefined) {
        var len = 1;
        if (x && x.state == "minus")
            len += this._getOpenLenght(x.id, 0);
        for (var i = 0; i < len; i++)
            if (this.rowsCol[i + ind])
                this.rowsCol[i + ind].parentNode.removeChild(this.rowsCol[i + ind]);
        if (this._fake)
            for (var i = 0; i < len; i++)
                this._fake.rowsCol[i + ind].parentNode.removeChild(this._fake.rowsCol[i + ind]);
        this.rowsCol.splice(ind, len);
        this.rowsBuffer.splice(ind, len)
    };
    if (!x)
        return;
    this._removeTrGrRow(null, x);
    delete this.rowsAr[x.id];
    if (x.parent.childs.length == 1) {
        this._h2.JA(x.parent.id, "state", dhtmlXGridObject.uT);
        this.ia(x.parent)
    };
    this._h2.remove(x.id)
};
dhtmlXGridObject.prototype.openItem = function(rowId) {
    var y = this._h2.get[rowId || 0];
    var x = this.getRowById(rowId || 0);
    if (!x)
        return;
    if (y.parent && y.parent.id != 0)
        this.openItem(y.parent.id);
    this.expandKids(x)
};
dhtmlXGridObject.prototype.FE = dhtmlXGridObject.prototype.addRow;
dhtmlXGridObject.prototype.addRow = function(new_id, text, ind, parent_id, img, child) {
    if (!this._h2)
        return this.FE(new_id, text, ind);
    parent_id = parent_id || 0;
    var Uz = this.cellType._dhx_find("tree");
    if (typeof(text) == "string")
        text = text.split(this.delim);
    var row = this._h2.get[new_id];
    if (!row) {
        if (parent_id == 0)
            ind = this.rowsBuffer.length;
        else {
            ind = this.getRowIndex(parent_id) + 1;
            if (this._h2.get[parent_id].state == "minus")
                ind += this._getOpenLenght(parent_id, 0);
            else
                this._skipInsert = true
        }
    };
    row = row || this._h2.add(new_id, parent_id);
    row.image = img;
    row.has_kids = child;
    return row.buff = this.FE(new_id, text, ind)
};
dhtmlXGridObject.prototype.addRowBefore = function(new_id, text, sibl_id, img, child) {
    var sb = this.rowsAr[sibl_id];
    if (!sb)
        return;
    if (!this._h2)
        return this.addRow(new_id, text, this.getRowIndex(sibl_id));
    var pid = this._h2.get[sibl_id].parent.id;
    var ind = this.getRowIndex(sibl_id);
    if (ind == -1)
        this._skipInsert = true;
    this._h2.acA(new_id, pid, sibl_id);
    return this.addRow(new_id, text, ind, this._h2.get[sibl_id].parent.id, img, child)
};
dhtmlXGridObject.prototype.addRowAfter = function(new_id, text, sibl_id, img, child) {
    var sb = this.rowsAr[sibl_id];
    if (!sb)
        return;
    if (!this._h2)
        return this.addRow(new_id, text, this.getRowIndex(sibl_id) + 1);
    var pid = this._h2.get[sibl_id].parent.id;
    var ind = this.getRowIndex(sibl_id);
    if (ind == -1)
        this._skipInsert = true;
    if (this._h2.get[sibl_id].state == "minus")
        ind += this._getOpenLenght(sibl_id, 0) + 1;
    else
        ind++;
    this._h2.Oj(new_id, pid, sibl_id);
    return this.addRow(new_id, text, ind, pid, img, child)
};
dhtmlXGridObject.prototype.enableSmartXMLParsing = function(mode) {
    this.mI = convertStringToBoolean(mode)
};
dhtmlXGridObject.prototype._copyTreeGridRowContent = function(frRow, from_row_id, to_row_id) {
    var z = this.cellType._dhx_find("tree");
    for (i = 0; i < frRow.cells.length; i++) {
        if (i != z)
            this.cells(to_row_id, i).setValue(this.cells(from_row_id, i).getValue());
        else
            this.cells(to_row_id, i).je(this.cells(from_row_id, i).getValue())
    }
};
dhtmlXGridObject.prototype.closeItem = function(rowId) {
    var x = this.getRowById(rowId);
    if (!x)
        return;
    this.collapseKids(x)
};
dhtmlXGridObject.prototype.deleteChildItems = function(rowId) {
    var z = this._h2.get[rowId];
    if (!z)
        return;
    while (z.childs.length)
        this.deleteRow(z.childs[0].id)
};
dhtmlXGridObject.prototype.getAllSubItems = function(rowId) {
    var str = [];
    var z = this._h2.get[rowId || 0];
    if (z)
        for (var i = 0; i < z.childs.length; i++) {
            str.push(z.childs[i].id);
            if (z.childs[i].childs.length)
                str = str.concat(this.getAllSubItems(z.childs[i].id).split(this.delim))
        };
    return str.join(this.delim)
};
dhtmlXGridObject.prototype.getChildItemIdByIndex = function(rowId, ind) {
    var z = this._h2.get[rowId || 0];
    if (!z)
        return null;
    return (z.childs[ind] ? z.childs[ind].id : null)
};
dhtmlXGridObject.prototype.getItemText = function(rowId) {
    return this.cells(rowId, this.cellType._dhx_find("tree")).getLabel()
};
dhtmlXGridObject.prototype.getOpenState = function(rowId) {
    var z = this._h2.get[rowId || 0];
    if (!z)
        return;
    if (z.state == "minus")
        return true;
    return false
};
dhtmlXGridObject.prototype.getParentId = function(rowId) {
    var z = this._h2.get[rowId || 0];
    if ((!z) || (!z.parent))
        return null;
    return z.parent.id
};
dhtmlXGridObject.prototype.getSubItems = function(rowId) {
    var str = [];
    var z = this._h2.get[rowId || 0];
    if (z)
        for (var i = 0; i < z.childs.length; i++)
            str.push(z.childs[i].id);
    return str.join(this.delim)
};
dhtmlXGridObject.prototype.expandAll = function() {
    this.CG(0);
    this._h2_to_buff();
    this._reset_view();
    this.setSizes();
    this.callEvent("onGridReconstructed", []);
    if (this._redrawLines)
        this._redrawLines()
};
dhtmlXGridObject.prototype.CG = function(z) {
    var x = this._h2.get[z].childs;
    for (var i = 0; i < x.length; i++) {
        if (x[i].childs.length) {
            this._h2.JA(x[i].id, "state", "minus");
            this.ia(x[i]);
            this.CG(x[i].id)
        }
    }
};
dhtmlXGridObject.prototype.collapseAll = function(rowId) {
    this._h2.forEachChild(0, function(z) {
                if (z && z.state == "minus") {
                    z.state = "plus";
                    z.update = true;
                    this.ia(z)
                }
            }, this);
    this._h2_to_buff();
    this._reset_view();
    this.setSizes();
    this.callEvent("onGridReconstructed", []);
    if (this._redrawLines)
        this._redrawLines()
};
dhtmlXGridObject.prototype.hasChildren = function(rowId) {
    var x = this._h2.get[rowId];
    if (x && x.childs.length)
        return x.childs.length;
    if (x._xml_await)
        return -1;
    return 0
};
dhtmlXGridObject.prototype.setItemCloseable = function(rowId, status) {
    var x = this._h2.get[rowId];
    if (!x)
        return;
    x.aaZ = (!convertStringToBoolean(status))
};
dhtmlXGridObject.prototype.setItemText = function(rowId, Zf) {
    return this.cells(rowId, this.cellType._dhx_find("tree")).setLabel(Zf)
};
dhtmlXGridObject.prototype.setItemImage = function(rowId, url) {
    this._h2.get[rowId].image = url;
    this.rowsAr[rowId].JW.nextSibling.src = url
};
dhtmlXGridObject.prototype.getItemImage = function(rowId) {
    this.getRowById(rowId);
    return this._h2.get[rowId].image
};
dhtmlXGridObject.prototype.alT = function(width, height) {
    this.Qb = width;
    this.Mo = height
};
dhtmlXGridObject.prototype.akx = function(row) {
    return this._h2.get[row.idd].image
};
dhtmlXGridObject.prototype.setOnOpenStartHandler = function(func) {
    this.attachEvent("onOpenStart", func)
};
dhtmlXGridObject.prototype.setOnOpenEndHandler = function(func) {
    this.attachEvent("onOpenEnd", func)
};
dhtmlXGridObject.prototype.aer = function(mode) {
    this.ZU = !convertStringToBoolean(mode)
};
dhtmlXGridObject.prototype.getLevel = function(rowId) {
    var z = this._h2.get[rowId || 0];
    if (!z)
        return -1;
    return z.level
};
dhtmlXGridObject.prototype.oj = function(ind, state) {
    for (i in this.rowsAr) {
        if ((this.rowsAr[i]) && (this.rowsAr[i].childNodes))
            this.rowsAr[i].childNodes[ind].style.display = state
    }
};
dhtmlXGridObject.uT = "blank";