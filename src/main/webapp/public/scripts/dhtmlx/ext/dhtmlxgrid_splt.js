dhtmlXGridObject.prototype._init_point_bspl = dhtmlXGridObject.prototype._init_point;
dhtmlXGridObject.prototype._init_point = function() {
    if (this._split_later)
        this.splitAt(this._split_later);
    this._init_point = this._init_point_bspl;
    if (this._init_point)
        this._init_point()
};
dhtmlXGridObject.prototype.splitAt = function(ind) {
    if (!this.obj.rows[0])
        return this._split_later = ind;
    ind = parseInt(ind);
    var leftBox = document.createElement("DIV");
    this.entBox.appendChild(leftBox);
    var rightBox = document.createElement("DIV");
    this.entBox.appendChild(rightBox);
    for (var i = this.entBox.childNodes.length - 3; i >= 0; i--)
        rightBox.insertBefore(this.entBox.childNodes[i], rightBox.firstChild);
    this.entBox.style.position = "relative";
    this.globalBox = this.entBox;
    this.entBox = rightBox;
    rightBox.grid = this;
    leftBox.style.cssText += "border:0px solid red !important;";
    rightBox.style.cssText += "border:0px solid red !important;";
    rightBox.style.top = "0px";
    rightBox.style.position = "absolute";
    leftBox.style.position = "absolute";
    leftBox.style.top = "0px";
    leftBox.style.left = "0px";
    leftBox.style.zIndex = 11;
    rightBox.style.height = leftBox.style.height = this.globalBox.clientHeight;
    this._fake = new dhtmlXGridObject(leftBox);
    this.globalBox = this._fake.globalBox = this.globalBox;
    this._fake._fake = this;
    this._fake._realfake = true;
    this.EK = this.cellType._dhx_find("tree");
    this._fake.delim = this.delim;
    this._fake.yW = this.yW;
    this._fake.imgURL = this.imgURL;
    this._fake._customSorts = this._customSorts;
    this._fake.noHeader = this.noHeader;
    this._fake._enbTts = this._enbTts;
    this._fake.clists = this.clists;
    this._fake.fldSort = new Array();
    this._fake.selMultiRows = this.selMultiRows;
    this._fake.multiLine = this.multiLine;
    if (this.multiLine || this._erspan) {
        this.attachEvent("onCellChanged", this.TR);
        var corrector = function() {
            this.forEachRow(function(id) {
                        this.TR(id)
                    })
        };
        this.attachEvent("onXLE", corrector);
        this.attachEvent("onResizeEnd", corrector);
        if (!this._ads_count)
            this.attachEvent("onAfterSorting", corrector);
        this.attachEvent("onDistributedEnd", corrector)
    };
    this._fake.lk = this.lk;
    if (this._h2)
        this._fake._h2 = this._h2;
    this._fake.BF = this.BF;
    var EY = [[], [], [], [], [], [], []];
    var Dz = ["hdrLabels", "initCellWidth", "cellType", "cellAlign", "cellVAlign", "fldSort", "columnColor"];
    var OB = ["setHeader", "setInitWidths", "setColTypes", "setColAlign", "setColVAlign", "setColSorting", "setColumnColor"];
    this._fake.callEvent = function() {
        this._fake._split_event = true;
        if (arguments[0] == "onGridReconstructed")
            this._fake.callEvent.apply(this, arguments);
        return this._fake.callEvent.apply(this._fake, arguments);
        this._fake._split_event = false
    };
    if (this._elmn)
        this._fake.enableLightMouseNavigation(true);
    if (this.Ow || this._cssUnEven)
        this._fake.attachEvent("onGridReconstructed", function() {
                    this._fixAlterCss()
                });
    this._fake._cssEven = this._cssEven;
    this._fake._cssUnEven = this._cssUnEven;
    this._fake._cssSP = this._cssSP;
    this._fake.isEditable = this.isEditable;
    this._fake.ZU = this.ZU;
    if (this._sst)
        this._fake.enableStableSorting(true);
    this._fake._sclE = this._sclE;
    this._fake._dclE = this._dclE;
    this._fake._f2kE = this._f2kE;
    this._fake._maskArr = this._maskArr;
    this._fake._dtmask = this._dtmask;
    this._fake.combos = this.combos;
    var width = 0;
    var m_w = this.globalBox.offsetWidth;
    for (var i = 0; i < ind; i++) {
        for (var j = 0; j < Dz.length; j++) {
            if (this[Dz[j]])
                EY[j][i] = this[Dz[j]][i];
            if (typeof EY[j][i] == "string")
                EY[j][i] = EY[j][i].replace(new RegExp("\\" + this.delim, "g"), "\\" + this.delim)
        };
        if (_isFF)
            EY[1][i] = EY[1][i] * 1 + 2;
        if (this.cellWidthType == "%") {
            EY[1][i] = Math.round(parseInt(this[Dz[1]][i]) * m_w / 100);
            width += EY[1][i]
        } else
            width += parseInt(this[Dz[1]][i]);
        this.setColumnHidden(i, true)
    };
    for (var j = 0; j < Dz.length; j++) {
        var str = EY[j].join(this.delim);
        if (OB[j] != "setHeader") {
            if (str != "")
                this._fake[OB[j]](str)
        } else
            this._fake[OB[j]](str, null, this._hstyles)
    };
    this._fake._strangeParams = this._strangeParams;
    this._fake._drsclmn = this._drsclmn;
    rightBox.style.left = width + "px";
    leftBox.style.width = width + "px";
    rightBox.style.width = Math.max(this.globalBox.offsetWidth - width, 0);
    if (this._ecspn)
        this._fake._ecspn = true;
    this._fake.init();
    if (this.dragAndDropOff)
        this.dragger.addDragLanding(this._fake.entBox, this);
    this._fake.objBox.style.overflow = "hidden";
    this._fake.objBox.style.overflowX = "scroll";
    this._fake._srdh = this._srdh || 20;
    this._fake._srnd = this._srnd;
    function change_td(a, b) {
        b.style.whiteSpace = "";
        var c = b.nextSibling;
        var cp = b.parentNode;
        a.parentNode.insertBefore(b, a);
        if (!c)
            cp.appendChild(a);
        else
            cp.insertBefore(a, c);
        var z = a.style.display;
        a.style.display = b.style.display;
        b.style.display = z
    }

    ;
    function proc_hf(i, rows, mode, frows) {
        var temp_header = (new Array(ind)).join(this.delim);
        var temp_rspan = [];
        if (i == 2)
            for (var k = 0; k < ind; k++) {
                var r = rows[i - 1].cells[rows[i - 1]._childIndexes ? rows[i - 1]._childIndexes[k] : k];
                if (r.rowSpan && r.rowSpan > 1) {
                    temp_rspan[r._cellIndex] = r.rowSpan - 1;
                    frows[i - 1].cells[frows[i - 1]._childIndexes ? frows[i - 1]._childIndexes[k] : k].rowSpan = r.rowSpan;
                    r.rowSpan = 1
                }
            };
        for (i; i < rows.length; i++) {
            this._fake.attachHeader(temp_header, null, mode);
            frows = frows || this._fake.ftr.childNodes[0].rows;
            var max_ind = ind;
            var r_cor = 0;
            for (var j = 0; j < max_ind; j++) {
                if (temp_rspan[j]) {
                    temp_rspan[j] = temp_rspan[j] - 1;
                    if (_isIE || (_isFF && _FFrv >= 1.9) || _isOpera) {
                        var td = document.createElement("TD");
                        if (_isFF)
                            td.style.display = "none";
                        rows[i].insertBefore(td, rows[i].cells[0])
                    };
                    r_cor++;
                    continue
                };
                var a = frows[i].cells[j - r_cor];
                var b = rows[i].cells[j - (_isIE ? 0 : r_cor)];
                var t = b.rowSpan;
                change_td(a, b);
                if (t > 1) {
                    temp_rspan[j] = t - 1;
                    b.rowSpan = t
                };
                if (frows[i].cells[j].colSpan > 1) {
                    rows[i].cells[j].colSpan = frows[i].cells[j].colSpan;
                    max_ind -= frows[i].cells[j].colSpan - 1;
                    for (var k = 1; k < frows[i].cells[j].colSpan; k++)
                        frows[i].removeChild(frows[i].cells[j + 1])
                }
            }
        }
    }

    ;
    if (this.hdr.rows.length > 2)
        proc_hf.call(this, 2, this.hdr.rows, "_aHead", this._fake.hdr.rows);
    if (this.ftr) {
        proc_hf.call(this, 1, this.ftr.childNodes[0].rows, "_aFoot");
        this._fake.ftr.parentNode.style.bottom = (_isFF ? 2 : 1) + "px"
    };
    if (this.saveSizeToCookie) {
        this.saveSizeToCookie = function(name, cookie_param) {
            if (this._realfake)
                return this._fake.saveSizeToCookie.apply(this._fake, arguments);
            if (!name)
                name = this.entBox.id;
            var z = new Array();
            var n = "cellWidthPX";
            for (var i = 0; i < this[n].length; i++)
                if (i < ind)
                    z[i] = this._fake[n][i];
                else
                    z[i] = this[n][i];
            z = z.join(",");
            this.jf(name, cookie_param, 0, z);
            var z = (this.initCellWidth || (new Array)).join(",");
            this.jf(name, cookie_param, 1, z);
            return true
        };
        this.loadSizeFromCookie = function(name) {
            if (!name)
                name = this.entBox.id;
            var z = this.VE(name, 1);
            if (!z)
                return;
            this.initCellWidth = z.split(",");
            var z = this.VE(name, 0);
            var n = "cellWidthPX";
            this.cellWidthType = "px";
            var yQ = 0;
            if ((z) && (z.length)) {
                z = z.split(",");
                for (var i = 0; i < z.length; i++)
                    if (i < ind) {
                        this._fake[n][i] = z[i];
                        yQ += z[i] * 1
                    } else
                        this[n][i] = z[i]
            };
            this._fake.entBox.style.width = yQ + "px";
            this._fake.objBox.style.width = yQ + "px";
            var pa = this.globalBox.childNodes[1];
            pa.style.left = yQ - (_isFF ? 0 : 0) + "px";
            if (this.ftr)
                this.ftr.style.left = yQ - (_isFF ? 0 : 0) + "px";
            pa.style.width = this.globalBox.offsetWidth - yQ + "px";
            this.setSizes();
            return true
        };
        this._fake.Ok = this.Ok
    };
    this.zG = this.setCellTextStyle;
    this.setCellTextStyle = function(row_id, i, styleString) {
        if (i < ind)
            this._fake.setCellTextStyle(row_id, i, styleString);
        this.zG(row_id, i, styleString)
    };
    this.BA = this.setRowTextBold;
    this.setRowTextBold = function(row_id) {
        this.BA(row_id);
        this._fake.setRowTextBold(row_id)
    };
    this.Fu = this.setRowColor;
    this.setRowColor = function(row_id, color) {
        this.Fu(row_id, color);
        this._fake.setRowColor(row_id, color)
    };
    this.DS = this.setRowHidden;
    this.setRowHidden = function(id, state) {
        this.DS(id, state);
        this._fake.setRowHidden(id, state)
    };
    this.zq = this.setRowTextNormal;
    this.setRowTextNormal = function(row_id) {
        this.zq(row_id);
        this._fake.setRowTextNormal(row_id)
    };
    this.getChangedRows = function(and_added) {
        var res = new Array();

        function test(row) {
            for (var j = 0; j < row.childNodes.length; j++)
                if (row.childNodes[j].wasChanged)
                    return res[res.length] = row.idd
        }

        ;
        this.forEachRow(function(id) {
                    var row = this.rowsAr[id];
                    var frow = this._fake.rowsAr[id];
                    if (row.tagName != "TR" || frow.tagName != "TR")
                        return;
                    if (and_added && row._added)
                        res[res.length] = row.idd;
                    else {
                        if (!test(row))
                            test(frow)
                    }
                });
        return res.join(this.delim)
    };
    this.Ay = this.setRowTextStyle;
    this.setRowTextStyle = function(row_id, styleString) {
        this.Ay(row_id, styleString);
        if (this._fake.rowsAr[row_id])
            this._fake.setRowTextStyle(row_id, styleString)
    };
    this.Ma = this.lockRow;
    this.lockRow = function(id, mode) {
        this.Ma(id, mode);
        this._fake.lockRow(id, mode)
    };
    this.getColWidth = function(i) {
        if (i < ind)
            return parseInt(this._fake.cellWidthPX[i]) + ((_isFF) ? 2 : 0);
        else
            return parseInt(this.cellWidthPX[i]) + ((_isFF) ? 2 : 0)
    };
    this.vQ = this._fake.vQ = this.setColWidth;
    this.setColWidth = function(i, value) {
        i = i * 1;
        if (i < ind)
            this._fake.vQ(i, value - ((_isFF) ? 2 : 0));
        else
            this.vQ(i, value - ((_isFF) ? 2 : 0));
        if ((i + 1) <= ind)
            this._fake._correctSplit(Math.min(this._fake.objBox.offsetWidth, this._fake.obj.offsetWidth))
    };
    this.yY = this.adjustColumnSize;
    this.setColumnLabelA = this.setColumnLabel;
    this.setColumnLabel = function(a, b, c, d) {
        var that = this;
        if (a < ind)
            that = this._fake;
        return this.setColumnLabelA.apply(that, [a, b, c, d])
    };
    this.adjustColumnSize = function(LV, c) {
        if (LV < ind) {
            if (_isIE)
                this._fake.obj.style.tableLayout = "";
            this._fake.adjustColumnSize(LV, c);
            if (_isIE)
                this._fake.obj.style.tableLayout = "fixed";
            this._fake._correctSplit()
        } else
            return this.yY(LV, c)
    };
    var zname = "cells";
    this._bfs_cells = this[zname];
    this[zname] = function() {
        if (arguments[1] < ind) {
            return this._fake.cells.apply(this._fake, arguments)
        } else
            return this._bfs_cells.apply(this, arguments)
    };
    this.XI = this.setColumnHidden;
    this.setColumnHidden = function() {
        if (parseInt(arguments[0]) < ind) {
            this._fake.setColumnHidden.apply(this._fake, arguments);
            return this._fake._correctSplit()
        } else
            return this.XI.apply(this, arguments)
    };
    var zname = "cells2";
    this.Hy = this[zname];
    this[zname] = function() {
        if (arguments[1] < ind)
            return this._fake.cells2.apply(this._fake, arguments);
        else
            return this.Hy.apply(this, arguments)
    };
    var zname = "cells3";
    this.Hg = this[zname];
    this[zname] = function(a, b) {
        if (arguments[1] < ind && this._fake.rowsAr[arguments[0].idd]) {
            if (this._fake.rowsAr[a.idd] && this._fake.rowsAr[a.idd].childNodes.length == 0)
                return this.Hg.apply(this, arguments);
            arguments[0] = arguments[0].idd;
            return this._fake.cells.apply(this._fake, arguments)
        } else
            return this.Hg.apply(this, arguments)
    };
    var zname = "changeRowId";
    this.zP = this[zname];
    this[zname] = function() {
        this.zP.apply(this, arguments);
        if (this._fake.rowsAr[arguments[0]])
            this._fake.changeRowId.apply(this._fake, arguments)
    };
    this._fake.getRowById = function(id) {
        var row = this.rowsAr[id];
        if (!row && this._fake.rowsAr[id])
            row = this._fake.getRowById(id);
        if (row) {
            if (row.tagName != "TR") {
                for (var i = 0; i < this.rowsBuffer.length; i++)
                    if (this.rowsBuffer[i] && this.rowsBuffer[i].idd == id)
                        return this.render_row(i);
                if (this._h2)
                    return this.render_row(null, row.idd)
            };
            return row
        };
        return null
    };
    if (this.collapseKids) {
        this._fake["_bfs_collapseKids"] = this.collapseKids;
        this._fake["collapseKids"] = function() {
            return this._fake["collapseKids"].apply(this._fake, [this._fake.rowsAr[arguments[0].idd]])
        };
        this["_bfs_collapseKids"] = this.collapseKids;
        this["collapseKids"] = function() {
            var z = this["_bfs_collapseKids"].apply(this, arguments);
            this._fake.fq();
            if (!this._cssSP)
                this._fake._fixAlterCss()
        };
        this._fake["_bfs_expandKids"] = this.expandKids;
        this._fake["expandKids"] = function() {
            this._fake["expandKids"].apply(this._fake, [this._fake.rowsAr[arguments[0].idd]]);
            if (!this._cssSP)
                this._fake._fixAlterCss()
        };
        this["_bfs_expandAll"] = this.expandAll;
        this["expandAll"] = function() {
            this._bfs_expandAll();
            this._fake.fq();
            if (!this._cssSP)
                this._fake._fixAlterCss()
        };
        this["_bfs_collapseAll"] = this.collapseAll;
        this["collapseAll"] = function() {
            this._bfs_collapseAll();
            this._fake.fq();
            if (!this._cssSP)
                this._fake._fixAlterCss()
        };
        this["_bfs_expandKids"] = this.expandKids;
        this["expandKids"] = function() {
            var z = this["_bfs_expandKids"].apply(this, arguments);
            this._fake.fq();
            if (!this._cssSP)
                this._fake._fixAlterCss()
        };
        this._fake.fq = function() {
            if (this._fake.pagingOn)
                this._fake._renderSort();
            else
                this._renderSort()
        };
        this.ia = function(a) {
            return this._fake.ia(a)
        }
    };
    if (this._elmnh) {
        this.uN = this._fake.uN = this._setRowHover;
        this.tD = this._fake.tD = this._unsetRowHover;
        this._setRowHover = this._fake._setRowHover = function() {
            var that = this.grid;
            that.uN.apply(this, arguments);
            var z = (_isIE ? event.srcElement : arguments[0].target);
            z = that._fake.rowsAr[that.getFirstParentOfType(z, 'TD').parentNode.idd];
            if (z) {
                that._fake.uN.apply(that._fake.obj, [{
                                    target : z.childNodes[0]
                                }, arguments[1]])
            }
        };
        this._unsetRowHover = this._fake._unsetRowHover = function() {
            if (arguments[1])
                var that = this;
            else
                var that = this.grid;
            that.tD.apply(this, arguments);
            that._fake.tD.apply(that._fake.obj, arguments)
        };
        this._fake.enableRowsHover(true, this._hvrCss);
        this.enableRowsHover(false);
        this.enableRowsHover(true, this._fake._hvrCss)
    };
    this.ia = function(z) {
        if (!z.update || z.id == 0)
            return;
        if (this.rowsAr[z.id].JW)
            this.rowsAr[z.id].JW.src = this.imgURL + z.state + ".gif";
        if (this._fake.rowsAr[z.id] && this._fake.rowsAr[z.id].JW)
            this._fake.rowsAr[z.id].JW.src = this.imgURL + z.state + ".gif";
        z.update = false
    };
    this.copy_row = function(row) {
        var x = row.cloneNode(true);
        x._skipInsert = row._skipInsert;
        var r_ind = ind;
        x._attrs = {};
        if (this._ecspn) {
            r_ind = 0;
            for (var i = 0; (i < x.childNodes.length && i < ind); i += (x.childNodes[i].colSpan || 1))
                r_ind++
        };
        while (x.childNodes.length > r_ind)
            x.removeChild(x.childNodes[x.childNodes.length - 1]);
        var zm = r_ind;
        for (var i = 0; i < zm; i++) {
            if (this.dragAndDropOff)
                this.dragger.addDraggableItem(x.childNodes[i], this);
            x.childNodes[i].style.display = (this._fake._hrrar ? (this._fake._hrrar[i] ? "none" : "") : "");
            x.childNodes[i]._cellIndex = i;
            x.childNodes[i].combo_value = arguments[0].childNodes[i].combo_value;
            x.childNodes[i]._clearCell = arguments[0].childNodes[i]._clearCell;
            x.childNodes[i]._cellType = arguments[0].childNodes[i]._cellType;
            x.childNodes[i]._brval = arguments[0].childNodes[i]._brval;
            x.childNodes[i]._attrs = arguments[0].childNodes[i]._attrs;
            x.childNodes[i].chstate = arguments[0].childNodes[i].chstate;
            if (row._attrs['style'])
                x.childNodes[i].style.cssText += ";" + row._attrs['style'];
            if (x.childNodes[i].colSpan > 1)
                this._childIndexes = this._fake._childIndexes
        };
        if (this._h2 && this.EK < ind) {
            var trow = this._h2.get[arguments[0].idd];
            x.JW = x.childNodes[this.EK].childNodes[0].childNodes[trow.level];
            x.valTag = x.childNodes[this.EK].childNodes[0].childNodes[trow.level + 2]
        };
        x.idd = row.idd;
        x.grid = this._fake;
        return x
    };
    var zname = "_insertRowAt";
    this._bfs_insertRowAt = this[zname];
    this[zname] = function() {
        var r = this["_bfs_insertRowAt"].apply(this, arguments);
        arguments[0] = this.copy_row(arguments[0]);
        var r2 = this._fake["_insertRowAt"].apply(this._fake, arguments);
        if (r.Oz) {
            r2.parentNode.removeChild(r2);
            this._fake.rowsCol._dhx_removeAt(this._fake.rowsCol._dhx_find(r2));
            r.Oz = false
        };
        return r
    };
    this._bfs_setSizes = this.setSizes;
    this.setSizes = function() {
        if (this._notresize)
            return;
        this._bfs_setSizes(this, arguments);
        this.sync_headers();
        if (this.sync_scroll() && this._ahgr)
            this.setSizes();
        this._fake.entBox.style.height = this.entBox.style.height;
        this._fake.objBox.style.height = this.objBox.style.height;
        this._fake.hdrBox.style.height = this.hdrBox.style.height;
        this._fake.objBox.scrollTop = this.objBox.scrollTop;
        this._fake.setColumnSizes(this._fake.entBox.clientWidth);
        this.globalBox.style.width = parseInt(this.entBox.style.width) + parseInt(this._fake.entBox.style.width);
        this.globalBox.style.height = this.entBox.style.height
    };
    this.sync_scroll = this._fake.sync_scroll = function(end) {
        var old = this.objBox.style.overflowX;
        if (this.obj.offsetWidth <= this.objBox.offsetWidth) {
            if (!end)
                return this._fake.sync_scroll(true);
            this.objBox.style.overflowX = "hidden";
            this._fake.objBox.style.overflowX = "hidden"
        } else {
            this.objBox.style.overflowX = "scroll";
            this._fake.objBox.style.overflowX = "scroll"
        };
        return old != this.objBox.style.overflowX
    };
    this.sync_headers = this._fake.sync_headers = function() {
        if (this.noHeader || (this._fake.hdr.offsetHeight == this.hdr.offsetHeight))
            return;
        for (var i = 1; i < this.hdr.rows.length; i++) {
            var ha = this.hdr.rows[i].scrollHeight;
            var hb = this._fake.hdr.rows[i].scrollHeight;
            if (ha != hb)
                this._fake.hdr.rows[i].style.height = this.hdr.rows[i].style.height = Math.max(ha, hb) + "px";
            if (window._KHTMLrv)
                this._fake.hdr.rows[i].childNodes[0].style.height = this.hdr.rows[i].childNodes[ind].offsetHeight + "px"
        };
        this._fake.sync_headers
    };
    this._fake._bfs_setSizes = this._fake.setSizes;
    this._fake.setSizes = function() {
        if (this._fake._notresize)
            return;
        this._fake.setSizes()
    };
    var zname = "_doOnScroll";
    this.Ao = this[zname];
    this[zname] = function() {
        this.Ao.apply(this, arguments);
        this._fake.objBox.scrollTop = this.objBox.scrollTop;
        this._fake["_doOnScroll"].apply(this._fake, arguments)
    };
    var zname = "doClick";
    this._bfs_doClick = this[zname];
    this[zname] = function() {
        this["_bfs_doClick"].apply(this, arguments);
        if (arguments[0].tagName == "TD") {
            var fl = (arguments[0]._cellIndex >= ind);
            if (!arguments[0].parentNode.idd)
                return;
            if (!fl)
                arguments[0].className = arguments[0].className.replace(/cellselected/g, "");
            if (!this._fake.rowsAr[arguments[0].parentNode.idd])
                this._fake.render_row(this.getRowIndex(arguments[0].parentNode.idd));
            arguments[0] = this._fake.cells(arguments[0].parentNode.idd, (fl ? 0 : arguments[0]._cellIndex)).cell;
            if (fl)
                this._fake.cell = null;
            this._fake["_bfs_doClick"].apply(this._fake, arguments);
            if (fl)
                this._fake.cell = this.cell;
            else
                this.cell = this._fake.cell;
            if (this._fake.onRowSelectTime)
                clearTimeout(this._fake.onRowSelectTime);
            if (fl) {
                arguments[0].className = arguments[0].className.replace(/cellselected/g, "");
                globalActiveDHTMLGridObject = this;
                this._fake.cell = this.cell
            } else {
                this.objBox.scrollTop = this._fake.objBox.scrollTop
            }
        }
    };
    this._fake._bfs_doClick = this._fake[zname];
    this._fake[zname] = function() {
        this["_bfs_doClick"].apply(this, arguments);
        if (arguments[0].tagName == "TD") {
            var fl = (arguments[0]._cellIndex < ind);
            if (!arguments[0].parentNode.idd)
                return;
            arguments[0] = this._fake._bfs_cells(arguments[0].parentNode.idd, (fl ? ind : arguments[0]._cellIndex)).cell;
            this._fake.cell = null;
            this._fake["_bfs_doClick"].apply(this._fake, arguments);
            this._fake.cell = this.cell;
            if (this._fake.onRowSelectTime)
                clearTimeout(this._fake.onRowSelectTime);
            if (fl) {
                arguments[0].className = arguments[0].className.replace(/cellselected/g, "");
                globalActiveDHTMLGridObject = this;
                this._fake.cell = this.cell;
                this._fake.objBox.scrollTop = this.objBox.scrollTop
            }
        }
    };
    this.clearSelectionA = this.clearSelection;
    this.clearSelection = function(mode) {
        if (mode)
            this._fake.clearSelection();
        this.clearSelectionA()
    };
    this.JD = this.moveRowUp;
    this.moveRowUp = function(row_id) {
        if (!this._h2)
            this._fake.moveRowUp(row_id);
        this.JD(row_id);
        if (this._h2)
            this._fake.fq()
    };
    this.Eu = this.moveRowDown;
    this.moveRowDown = function(row_id) {
        if (!this._h2)
            this._fake.moveRowDown(row_id);
        this.Eu(row_id);
        if (this._h2)
            this._fake.fq()
    };
    this._fake.getUserData = function() {
        return this._fake.getUserData.apply(this._fake, arguments)
    };
    this._fake.setUserData = function() {
        return this._fake.setUserData.apply(this._fake, arguments)
    };
    this.Ap = this.getSortingState;
    this.getSortingState = function() {
        var z = this.Ap();
        if (z.length != 0)
            return z;
        return this._fake.getSortingState()
    };
    this.QU = this._fake.QU = this.setSortImgState;
    this.setSortImgState = function(a, b, c, d) {
        this.QU(a, b, c, d);
        if (b * 1 < ind) {
            this._fake.QU(a, b, c, d);
            this.QU(false)
        } else
            this._fake.QU(false)
    };
    this._fake.FU = this._fake.doColResize;
    this._fake.doColResize = function(ev, el, startW, x, tabW) {
        a = -1;
        var z = 0;
        if (arguments[1]._cellIndex == (ind - 1)) {
            a = this.aaP + (ev.clientX - x);
            if (!this.UG)
                this.UG = arguments[3] + this.objBox.scrollWidth - this.objBox.offsetWidth;
            if (this.objBox.scrollWidth == this.objBox.offsetWidth && (this._fake.alter_split_resize || (ev.clientX - x) > 0)) {
                arguments[3] = (this.UG || arguments[3]);
                z = this.FU.apply(this, arguments)
            } else
                z = this.FU.apply(this, arguments)
        } else {
            if (this.obj.offsetWidth < this.entBox.offsetWidth)
                a = this.obj.offsetWidth;
            z = this.FU.apply(this, arguments)
        };
        this._correctSplit(a);
        this.resized = this._fake.resized = 1;
        return z
    };
    this._fake.changeCursorState = function(ev) {
        var el = ev.target || ev.srcElement;
        if (el.tagName != "TD")
            el = this.getFirstParentOfType(el, "TD");
        if ((el.tagName == "TD") && (this._drsclmn) && (!this._drsclmn[el._cellIndex]))
            return;
        var check = (ev.layerX || 0) + (((!_isIE) && (ev.target.tagName == "DIV")) ? el.offsetLeft : 0);
        var pos = parseInt(this.getPosition(el, this.hdrBox));
        if (((el.offsetWidth - (ev.offsetX || (pos - check) * -1)) < 10) || ((this.entBox.offsetWidth - (ev.offsetX ? (ev.offsetX + el.offsetLeft) : check) + this.objBox.scrollLeft - 0) < 10)) {
            el.style.cursor = "E-resize"
        } else
            el.style.cursor = "default";
        if (_isOpera)
            this.hdrBox.scrollLeft = this.objBox.scrollLeft
    };
    this._fake.Uj = this._fake.startColResize;
    this._fake.startColResize = function(ev) {
        var z = this.Uj(ev);
        this.aaP = this.entBox.offsetWidth;
        this.UG = null;
        if (this.entBox.onmousemove) {
            var m = this.entBox.parentNode;
            if (m.Ic)
                return z;
            m.Ic = m.grid;
            m.grid = this;
            this.entBox.parentNode.onmousemove = this.entBox.onmousemove;
            this.entBox.onmousemove = null
        };
        return z
    };
    this._fake.Dl = this._fake.stopColResize;
    this._fake.stopColResize = function(ev) {
        if (this.entBox.parentNode.onmousemove) {
            var m = this.entBox.parentNode;
            m.grid = m.Ic;
            m.Ic = null;
            this.entBox.onmousemove = this.entBox.parentNode.onmousemove;
            this.entBox.parentNode.onmousemove = null;
            if (this.obj.offsetWidth < this.entBox.offsetWidth)
                this._correctSplit(this.obj.offsetWidth)
        };
        return this.Dl(ev)
    };
    this.xt = this.doKey;
    this._fake.xt = this._fake.doKey;
    this._fake.doKey = this.doKey = function(ev) {
        if (!ev)
            return true;
        if (this._htkebl)
            return true;
        if ((ev.target || ev.srcElement).value !== window.undefined) {
            var zx = (ev.target || ev.srcElement);
            if ((!zx.parentNode) || (zx.parentNode.className.indexOf("editable") == -1))
                return true
        };
        switch (ev.keyCode) {
            case 9 :
                if (!ev.shiftKey) {
                    if (this._realfake) {
                        if ((this.cell) && (this.cell._cellIndex == (ind - 1))) {
                            if (ev.preventDefault)
                                ev.preventDefault();
                            var ind_t = ind;
                            while (this._fake._hrrar && this._fake._hrrar[ind_t])
                                ind_t++;
                            this._fake.selectCell(this.getRowIndex(this.cell.parentNode.idd), ind_t, false, false, true);
                            return false
                        } else
                            var z = this.xt(ev);
                        globalActiveDHTMLGridObject = this;
                        return z
                    } else {
                        if (this.cell) {
                            var ind_t = this.cell._cellIndex + 1;
                            while (this.rowsCol[0].childNodes[ind_t] && this.rowsCol[0].childNodes[ind_t].style.display == "none")
                                ind_t++;
                            if (ind_t == this.rowsCol[0].childNodes.length) {
                                if (ev.preventDefault)
                                    ev.preventDefault();
                                var z = this.rowsBuffer[this.getRowIndex(this.cell.parentNode.idd) + 1];
                                if (z) {
                                    this.showRow(z.idd);
                                    this._fake.selectCell(this._fake.getRowIndex(z.idd), 0, false, false, true)
                                };
                                return false
                            }
                        };
                        return this.xt(ev)
                    }
                } else {
                    if (this._realfake) {
                        if ((this.cell) && (this.cell._cellIndex == 0)) {
                            if (ev.preventDefault)
                                ev.preventDefault();
                            var z = this.rowsBuffer[this.getRowIndex(this.cell.parentNode.idd) - 1];
                            if (z) {
                                this._fake.showRow(z.idd);
                                this._fake.selectCell(this._fake.getRowIndex(z.idd), this._fake._cCount - 1, false, false, true)
                            };
                            return false
                        } else
                            return this.xt(ev)
                    } else {
                        if ((this.cell) && (this.cell._cellIndex == ind)) {
                            if (ev.preventDefault)
                                ev.preventDefault();
                            this._fake.selectCell(this.getRowIndex(this.cell.parentNode.idd), ind - 1, false, false, true);
                            return false
                        } else
                            return this.xt(ev)
                    }
                }
                ;
                break
        };
        return this.xt(ev)
    };
    this.editCellA = this.editCell;
    this.editCell = function() {
        if (!this.cell && this._fake.cell)
            return this._fake.editCell();
        return this.editCellA()
    };
    this.Jw = this.deleteRow;
    this.deleteRow = function(row_id, node) {
        if (this.Jw(row_id, node) === false)
            return false;
        if (this._fake.rowsAr[row_id])
            this._fake.deleteRow(row_id)
    };
    this.KI = this.clearAll;
    this.clearAll = function() {
        this.KI();
        this._fake.clearAll()
    };
    this.attachEvent("onAfterSorting", function(i, b, c) {
                if (i >= ind)
                    this._fake.setSortImgState(false)
            });
    this._fake.sortField = function(a, b, c) {
        this._fake.sortField.call(this._fake, a, b, this._fake.hdr.rows[0].cells[a]);
        if (this.fldSort[a] != "na") {
            var mem = this._fake.getSortingState()[1];
            this._fake.setSortImgState(false);
            this.setSortImgState(true, arguments[0], mem)
        }
    };
    this.vg = this.sortTreeRows;
    this._fake.vg = this._fake.sortTreeRows;
    this.sortTreeRows = this._fake.sortTreeRows = function(col, type, order, ar) {
        if (this._realfake)
            return this._fake.sortTreeRows(col, type, order, ar);
        this.vg(col, type, order, ar);
        this._fake.fq();
        this._fake.QU(false);
        this._fake.fldSorted = null
    };
    this._fake._fillers = [];
    this._fake.rowsBuffer = this.rowsBuffer;
    this.attachEvent("onClearAll", function() {
                this._fake.rowsBuffer = this.rowsBuffer
            });
    this._add_filler_s = this._add_filler;
    this._add_filler = function(a, b, c, e) {
        if (!e) {
            if (!this._fake._fillers)
                this._fake._fillers = [];
            var d;
            if (c) {
                if (c.idd)
                    d = this._fake.rowsAr[c.idd];
                else if (c.nextSibling) {
                    d = {};
                    d.nextSibling = this._fake.rowsAr[c.nextSibling.idd];
                    d.parentNode = d.nextSibling.parentNode
                }
            };
            this._fake._fillers.push(this._fake._add_filler(a, b, d))
        };
        return this._add_filler_s.apply(this, arguments)
    };
    this._add_from_buffer_s = this._add_from_buffer;
    this._add_from_buffer = function() {
        var res = this._add_from_buffer_s.apply(this, arguments);
        if (res != -1) {
            this._fake._add_from_buffer.apply(this._fake, arguments);
            if (this.multiLine)
                this.TR(this.rowsBuffer[arguments[0]].idd)
        };
        return res
    };
    this._fake.render_row = function(ind) {
        var row = this._fake.render_row(ind);
        if (row == -1)
            return -1;
        if (row) {
            return this.rowsAr[row.idd] = this.rowsAr[row.idd] || this._fake.copy_row(row)
        };
        return null
    };
    this._reset_view_s = this._reset_view;
    this._reset_view = function() {
        this._fake._reset_view(true);
        this._fake._fillers = [];
        this._reset_view_s()
    };
    this.moveColumn_s = this.OP;
    this.OP = function(a, b) {
        if (b >= ind)
            return this.moveColumn_s(a, b)
    };
    this.attachEvent("onCellChanged", function(id, i, val) {
                if (this._split_event && i < ind && this.rowsAr[id]) {
                    var cell = this._fake.rowsAr[id];
                    if (!cell)
                        return;
                    if (cell._childIndexes)
                        cell = cell.childNodes[cell._childIndexes[i]];
                    else
                        cell = cell.childNodes[i];
                    this.rowsAr[id].childNodes[i].innerHTML = cell.innerHTML;
                    this.rowsAr[id].childNodes[i]._clearCell = false;
                    this.rowsAr[id].childNodes[i].chstate = cell.chstate
                }
            });
    this._fake.combos = this.combos;
    this.setSizes();
    if (this.rowsBuffer[0])
        this._reset_view();
    this.attachEvent("onXLE", function() {
                this._fake._correctSplit()
            });
    this._fake._correctSplit()
};
dhtmlXGridObject.prototype._correctSplit = function(a) {
    a = a || (this.obj.scrollWidth - this.objBox.scrollLeft);
    if (a > -1) {
        this.entBox.style.width = a + "px";
        this.objBox.style.width = a + "px";
        var outerBorder = (this.globalBox.offsetWidth - this.globalBox.clientWidth) / 2;
        this._fake.entBox.style.left = a + "px";
        this._fake.entBox.style.width = Math.max(0, this.globalBox.offsetWidth - a - (this.quirks ? 0 : 2) * outerBorder) + "px";
        if (_isIE)
            this._fake.hdrBox.style.width = this._fake.objBox.style.width = Math.max(0, this.globalBox.offsetWidth - a) + "px"
    }
};
dhtmlXGridObject.prototype.TR = function(id, ind) {
    if (!this.rowsAr[id] || !this._fake.rowsAr[id])
        return;
    var h = this.rowsAr[id].offsetHeight;
    var h2 = this._fake.rowsAr[id].offsetHeight;
    var max = Math.max(h, h2);
    if (!max)
        return;
    this.rowsAr[id].style.height = this._fake.rowsAr[id].style.height = max + "px";
    if (window._KHTMLrv)
        this.rowsAr[id].childNodes[this._fake._cCount].style.height = this._fake.rowsAr[id].firstChild.style.height = max + "px"
};