dhtmlXGridObject.prototype.Ib = function() {
    if (!this._groups)
        return;
    this._dndProblematic = false;
    delete this._groups;
    delete this.tH;
    if (this._fake)
        this._mirror_rowsCol();
    this.forEachRow(function(id) {
                this.rowsAr[id].style.display = ''
            });
    this._reset_view();
    this.callEvent("onGridReconstructed", []);
    this.callEvent("onUnGroup", [])
};
dhtmlXGridObject.prototype._mirror_rowsCol = function() {
    this._fake._groups = this._groups;
    this._fake.tH = this.tH;
    this.rowsBuffer = dhtmlxArray();
    for (var i = 0; i < this.rowsCol.length; i++)
        if (!this.rowsCol[i]._cntr)
            this.rowsBuffer.push(this.rowsCol[i]);
    this._fake.rowsBuffer = dhtmlxArray();
    for (var i = 0; i < this._fake.rowsCol.length; i++)
        if (!this._fake.rowsCol[i]._cntr)
            this._fake.rowsBuffer.push(this._fake.rowsCol[i])
};
dhtmlXGridObject.prototype.groupBy = function(ind, mask) {
    if (this._groups)
        this.Ib();
    this._dndProblematic = true;
    this._groups = {};
    if (!mask) {
        mask = ["#title"];
        for (var i = 1; i < this._cCount; i++)
            mask.push("#cspan")
    };
    this._gmask = document.createElement("TR");
    var ltd, rindex = 0;
    for (var i = 0; i < mask.length; i++) {
        if (mask[i] == "#cspan")
            ltd.colSpan = (parseInt(ltd.colSpan) || 1) + 1;
        else {
            ltd = document.createElement("TD");
            ltd._cellIndex = i;
            if (this._hrrar[i])
                ltd.style.display = "none";
            ltd.className = "group_row";
            ltd.innerHTML = "&nbsp;";
            if (mask[i] == "#title")
                this._gmask._title = rindex;
            else
                ltd.align = this.cellAlign[i] || "left";
            this._gmask.appendChild(ltd);
            if (mask[i].indexOf("#stat") == 0) {
                this._gmask._math = true;
                ltd._counter = [this["_g_" + mask[i].replace("#", "")], i, rindex]
            };
            rindex++
        }
    };
    for (var a in this._groups)
        this._groups[a] = this.undefined;
    this.tH = ind;
    if (this._fake && !this._realfake) {
        this._fake._groups = [];
        this._fake.tH = this.tH
    };
    this._nextRow = function(ind, dir) {
        var r = this.rowsCol[ind + dir];
        if (r && (r.style.display == "none" || r._cntr))
            return this._nextRow(ind + dir, dir);
        return r
    };
    if (!this.vE) {
        this._key_events = dhtmlXHeir({}, this._key_events);
        this._key_events.k38_0_0 = function() {
            if (this.editor && this.editor.combo)
                this.editor.shiftPrev();
            else {
                var rowInd = this.row.rowIndex;
                if (!rowInd)
                    return;
                var nrow = this._nextRow(rowInd - 1, -1);
                if (nrow)
                    this.selectCell(nrow, this.cell._cellIndex, true)
            }
        };
        this._key_events.k13_1_0 = this._key_events.k13_0_1 = function() {
        };
        this._key_events.k40_0_0 = function() {
            if (this.editor && this.editor.combo)
                this.editor.shiftNext();
            else {
                var rowInd = this.row.rowIndex;
                if (!rowInd)
                    return;
                var nrow = this._nextRow(rowInd - 1, 1);
                if (nrow)
                    this.selectCell(nrow, this.cell._cellIndex, true)
            }
        };
        this.attachEvent("onFilterStart", function() {
                    if (this._groups)
                        this._groups = this.undefined;
                    return true
                });
        this.attachEvent("onFilterEnd", function() {
                    if (typeof this.tH != "undefined")
                        this.groupBy(this.tH)
                });
        this.sortRows_bg = this.sortRows;
        this.sortRows = function(ind, type, dir) {
            if (typeof(this._groups) == "undefined")
                return this.sortRows_bg.apply(this, arguments);
            this.callEvent("onBeforeSorting", [ind, (type || "str"), (dir || "asc")])
        };
        this.attachEvent("onBeforeSorting", function(ind, type, dir) {
                    if (typeof(this._groups) == "undefined")
                        return true;
                    if (ind == this.tH)
                        this.Er(ind, type, dir);
                    else
                        this.EZ(ind, type, dir);
                    this.setSortImgState(true, ind, dir);
                    if (this._fake) {
                        this._mirror_rowsCol();
                        this._fake._groups = [];
                        this._fake._reset_view()
                    };
                    this.setSortImgState(true, ind, dir);
                    this.callEvent("onAfterSorting", [ind, type, dir]);
                    return false
                });
        this.attachEvent("onClearAll", function() {
                    this.Ib()
                });
        this.attachEvent("onBeforeRowDeleted", function(id) {
                    if (!this._groups)
                        return true;
                    if (!this.rowsAr[id])
                        return true;
                    var val = this.cells(id, this.tH).getValue();
                    if (val === "")
                        val = " ";
                    var z = this._groups[val];
                    this.Cc(z);
                    return true
                });
        this.attachEvent("onCheckbox", function(id, index, value) {
                    this.callEvent("onEditCell", [2, id, index, (value ? 1 : 0), (value ? 0 : 1)])
                });
        this.attachEvent("onXLE", this.updateGroups);
        this.attachEvent("onColumnHidden", this.hideGroupColumn);
        this.attachEvent("onEditCell", function(stage, id, ind, val, oldval) {
                    if (!this._groups)
                        return true;
                    if (stage == 2 && val != oldval && ind == this.tH) {
                        if (oldval === "")
                            oldval = " ";
                        this.Cc(this._groups[oldval]);
                        var r = this.rowsAr[id];
                        var i = this.rowsCol._dhx_find(r);
                        var ni = this.Bp(val);
                        var n = this.rowsCol[ni];
                        if (r == n)
                            n = n.nextSibling;
                        var p = r.parentNode;
                        var o = r.rowIndex;
                        p.removeChild(r);
                        if (n)
                            p.insertBefore(r, n);
                        else
                            p.appendChild(r);
                        this.rowsCol._dhx_insertAt(ni, r);
                        if (ni < i)
                            i++;
                        this.rowsCol._dhx_removeAt(i, r);
                        this._fixAlterCss()
                    } else if (stage == 2 && val != oldval) {
                        this.updateGroups();
                        this.qP(this._groups[this.cells(id, this.tH).getValue()])
                    };
                    return true
                });
        this.vE = true
    };
    this.Cu();
    if (this._hrrar)
        for (var i = 0; i < this._hrrar.length; i++)
            if (this._hrrar[i])
                this.hideGroupColumn(i, true);
    this.callEvent("onGroup", []);
    if (this._ahgr || this._awdth)
        this.setSizes()
};
dhtmlXGridObject.prototype.EZ = function(col, type, order) {
    var b = this.xe();
    b.reverse();
    for (var i = 0; i < b.length; i++) {
        var c = b[i]._cntr.qA;
        var a = {};
        for (var j = 0; j < c.length; j++)
            a[c[j].idd] = this.cells3(c[j], col).getValue();
        this._sortCore(col, type, order, a, c)
    };
    this.wY(b);
    this.setSizes();
    this.callEvent("onGridReconstructed", [])
};
dhtmlXGridObject.prototype.Er = function(col, type, order) {
    var b = this.xe();
    var a = [];
    for (var i = 0; i < b.length; i++) {
        b[i].idd = "_sort_" + i;
        a["_sort_" + i] = b[i]._cntr.text
    };
    this._sortCore(col, type, order, a, b);
    this.wY(b);
    this.callEvent("onGridReconstructed", []);
    this.setSizes()
};
dhtmlXGridObject.prototype.Bp = function(val, hidden, skip) {
    if (val === "")
        val = " ";
    if (!this._groups[val]) {
        this._groups[val] = {
            text : val,
            row : this.xW(),
            count : 0,
            state : hidden ? "plus" : "minus"
        }
    };
    var z = this._groups[val];
    z.row._cntr = z;
    var ind = this.rowsCol._dhx_find(z.row) + z.count + 1;
    z.count++;
    if (!skip) {
        this.qP(z);
        this.updateGroups()
    };
    return ind
};
dhtmlXGridObject.prototype.Cc = function(z) {
    if (!z)
        return;
    z.count--;
    if (z.count == 0) {
        z.row.parentNode.removeChild(z.row);
        this.rowsCol._dhx_removeAt(this.rowsCol._dhx_find(z.row));
        delete this._groups[z.text]
    } else
        this.qP(z);
    if (this._fake && !this._realfake)
        this._fake.Cc(this._fake._groups[z.text]);
    this.updateGroups();
    return true
};
dhtmlXGridObject.prototype.BB = dhtmlXGridObject.prototype._insertRowAt;
dhtmlXGridObject.prototype._insertRowAt = function(r, ind, skip) {
    if (typeof(this._groups) != "undefined") {
        if (this._realfake)
            var val = this._fake._bfs_cells(r.idd, this.tH).getValue();
        else if (this.Hg)
            var val = this.Hg(r, this.tH).getValue();
        else
            var val = this.cells3(r, this.tH).getValue();
        if (!val)
            val = " ";
        ind = this.Bp(val, r.style.display == "none")
    };
    var res = this.BB(r, ind, skip);
    if (typeof(this._groups) != "undefined") {
        this.expandGroup(val);
        this.qP(this._groups[val]);
        this.updateGroups()
    };
    return res
};
dhtmlXGridObject.prototype.qP = function(z) {
    if (this._fake && !this._realfake)
        return z.row.firstChild.innerHTML = "&nbsp;";
    var html = "<img style='margin-bottom:-4px' src='" + this.imgURL + z.state + ".gif'> ";
    if (this.yW)
        html += this.yW(z.text, z.count);
    else
        html += z.text + " ( " + z.count + " ) ";
    z.row.childNodes[this._gmask._title].innerHTML = html
};
dhtmlXGridObject.prototype.xW = function(skip) {
    var r = this._gmask.cloneNode(true);
    for (var i = 0; i < r.childNodes.length; i++)
        r.childNodes[i]._cellIndex = this._gmask.childNodes[i]._cellIndex;
    var that = this;
    r.onclick = function(e) {
        if (that._fake && that._realfake)
            that._fake.collapseGroup(that._fake._groups[this._cntr.text].row);
        else
            that.collapseGroup(this);
        (e || event).cancelBubble = "true"
    };
    r.ondblclick = function(e) {
        (e || event).cancelBubble = "true"
    };
    if (!skip) {
        if (_isKHTML)
            this.obj.appendChild(r);
        else
            this.obj.firstChild.appendChild(r);
        this.rowsCol.push(r)
    };
    return r
};
dhtmlXGridObject.prototype.xe = function() {
    var b = [];
    this.uw = this.obj.parentNode;
    this.uw.removeChild(this.obj);
    var a = [];
    for (var i = this.rowsCol.length - 1; i >= 0; i--) {
        if (this.rowsCol[i]._cntr) {
            this.rowsCol[i]._cntr.qA = a;
            a = [];
            b.push(this.rowsCol[i])
        } else
            a.push(this.rowsCol[i]);
        this.rowsCol[i].parentNode.removeChild(this.rowsCol[i])
    };
    return b
};
dhtmlXGridObject.prototype.wY = function(b) {
    this.rowsCol = new dhtmlxArray(0);
    for (var i = 0; i < b.length; i++) {
        var gr = b[i]._cntr;
        this.obj.firstChild.appendChild(gr.row);
        this.rowsCol.push(gr.row);
        gr.row.idd = null;
        for (var j = 0; j < gr.qA.length; j++) {
            this.obj.firstChild.appendChild(gr.qA[j]);
            this.rowsCol.push(gr.qA[j])
        };
        delete gr.qA
    };
    this.uw.appendChild(this.obj)
};
dhtmlXGridObject.prototype.Cu = function(b) {
    if (!this.getRowsNum())
        return;
    var b = [];
    this.uw = this.obj.parentNode;
    this.uw.removeChild(this.obj);
    var a = [];
    var mlen = this.rowsCol.length;
    for (var i = 0; i < mlen; i++) {
        var val = this.cells4(this.rowsCol[i].childNodes[this.tH]).getValue();
        if (!val)
            val = " ";
        if (!this._groups[val]) {
            this._groups[val] = {
                text : val,
                row : this.xW(true),
                count : 0,
                state : "minus"
            };
            var z = this._groups[val];
            z.row._cntr = z;
            this._groups[val].qA = [];
            b.push(z.row)
        };
        this._groups[val].count++;
        this._groups[val].qA.push(this.rowsCol[i]);
        this.rowsCol[i].parentNode.removeChild(this.rowsCol[i])
    };
    for (var i = 0; i < b.length; i++)
        this.qP(b[i]._cntr);
    this.wY(b);
    if (this._fake && !this._realfake) {
        this._mirror_rowsCol();
        this._fake._groups = [];
        this._fake._reset_view()
    };
    this.callEvent("onGridReconstructed", []);
    this.updateGroups()
};
dhtmlXGridObject.prototype.collapseGroup = function(row) {
    var z = row._cntr;
    if (this._fake && !this._realfake) {
        z.state = this._fake._groups[row._cntr.text].row._cntr.state;
        this._fake.collapseGroup(this._fake._groups[row._cntr.text].row)
    };
    var ind = this.rowsCol._dhx_find(z.row) + 1;
    z.state = z.state == "minus" ? "plus" : "minus";
    var st = z.state == "plus" ? "none" : "";
    while (this.rowsCol[ind] && !this.rowsCol[ind]._cntr) {
        this.rowsCol[ind].style.display = st;
        ind++
    };
    this.qP(z);
    this.callEvent("onGroupStateChanged", [z.text, (z.state == "minus")]);
    this.setSizes()
};
dhtmlXGridObject.prototype.expandGroup = function(val) {
    if (this._groups[val].state == "plus")
        this.collapseGroup(this._groups[val].row)
};
dhtmlXGridObject.prototype.Nu = function(val) {
    if (this._groups[val].state == "minus")
        this.collapseGroup(this._groups[val].row)
};
dhtmlXGridObject.prototype.expandAllGroups = function() {
    for (var i in this._groups)
        if (this._groups[i] && this._groups[i].state == "plus")
            this.collapseGroup(this._groups[i].row)
};
dhtmlXGridObject.prototype.collapseAllGroups = function() {
    for (var i in this._groups)
        if (this._groups[i] && this._groups[i].state == "minus")
            this.collapseGroup(this._groups[i].row)
};
dhtmlXGridObject.prototype.hideGroupColumn = function(ind, state) {
    var rind = -1;
    var row = this._gmask.childNodes;
    for (var i = 0; i < row.length; i++)
        if (row[i]._cellIndex == ind) {
            rind = i;
            break
        };
    if (rind == -1)
        return;
    for (var a in this._groups)
        this._groups[a].row.childNodes[rind].style.display = state ? "none" : ""
};
dhtmlXGridObject.prototype.groupStat = function(name, ind, math) {
    math = this["_g_" + (math || "stat_total")];
    var summ = 0;
    var index = 0;
    this.forEachRowInGroup(name, function(id) {
                summ = math(summ, this.cells(id, ind).getValue() * 1, index);
                index++
            });
    return summ
};
dhtmlXGridObject.prototype.forEachRowInGroup = function(name, code) {
    var row = this._groups[name].row.nextSibling;
    if (row) {
        while (row && !row._cntr) {
            code.call(this, row.idd);
            row = row.nextSibling
        }
    } else {
        var cs = this._groups[name].qA;
        if (cs)
            for (var i = 0; i < cs.length; i++)
                code.call(this, cs[i].idd)
    }
};
dhtmlXGridObject.prototype.updateGroups = function() {
    if (!this._gmask || !this._gmask._math || this._parsing)
        return;
    var r = this._gmask.childNodes;
    for (var i = 0; i < r.length; i++)
        if (r[i]._counter)
            this._b_processing.apply(this, r[i]._counter)
};
dhtmlXGridObject.prototype._b_processing = function(a, ind, rind) {
    var c = 0, j = 0;
    if (!this._ecache[this.cellType[ind]])
        this.cells5({
                    parentNode : {
                        grid : this
                    }
                }, this.cellType[ind]);
    for (var i = this.rowsCol.length - 1; i >= 0; i--) {
        if (!this.rowsCol[i]._cntr) {
            c = a(c, this.cells3(this.rowsCol[i], ind).getValue() * 1, j);
            j++
        } else {
            this.cells5(this.rowsCol[i].childNodes[rind], this.cellType[ind]).setValue(c);
            j = c = 0
        }
    }
};
dhtmlXGridObject.prototype._g_stat_total = function(c, n, i) {
    return c + n
};
dhtmlXGridObject.prototype._g_stat_min = function(c, n, i) {
    if (!i)
        c = Infinity;
    return Math.min(c, n)
};
dhtmlXGridObject.prototype._g_stat_max = function(c, n, i) {
    if (!i)
        c = -Infinity;
    return Math.max(c, n)
};
dhtmlXGridObject.prototype._g_stat_average = function(c, n, i) {
    return (c * i + n) / (i + 1)
};
dhtmlXGridObject.prototype._g_stat_count = function(c, n, i) {
    return c++
};