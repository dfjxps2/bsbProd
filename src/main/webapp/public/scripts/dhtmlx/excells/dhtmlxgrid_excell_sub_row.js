

function eXcell_sub_row(cell) {
    if (cell) {
        this.cell = cell;
        this.grid = this.cell.parentNode.grid
    };
    this.getValue = function() {
        return this.grid.getUserData(this.cell.parentNode.idd, "__sub_row")
    };
    this._setState = function(m, v) {
        (v || this.cell).innerHTML = "<img src='" + this.grid.imgURL + m + "' width='18' height='18' />";
        (v || this.cell).firstChild.onclick = this.grid.wJ
    };
    this.open = function() {
        this.cell.firstChild.onclick(null, true)
    };
    this.close = function() {
        this.cell.firstChild.onclick(null, false, true)
    };
    this.setValue = function(val) {
        if (val)
            this.grid.setUserData(this.cell.parentNode.idd, "__sub_row", val);
        this._setState(val ? "plus.gif" : "blanc.gif")
    };
    this.setContent = function(val) {
        if (this.cell.parentNode._expanded) {
            this.cell.parentNode._expanded.innerHTML = val;
            this.grid.TX(this.cell.parentNode._expanded, this.cell, this.cell.parentNode._expanded.scrollHeight)
        } else {
            this.cell.Vy = null;
            this.setValue(val);
            this.cell.SH = null
        }
    };
    this.isDisabled = function() {
        return true
    };
    this.getTitle = function() {
        return this.grid.getUserData(this.cell.parentNode.idd, "__sub_row") ? "click to expand|collapse" : ""
    }
};
eXcell_sub_row.prototype = new eXcell;
function eXcell_sub_row_ajax(cell) {
    this.base = eXcell_sub_row;
    this.base(cell);
    this.setValue = function(val) {
        if (val)
            this.grid.setUserData(this.cell.parentNode.idd, "__sub_row", val);
        this.cell.SH = "ajax";
        this._setState(val ? "plus.gif" : "blanc.gif")
    }
};
eXcell_sub_row_ajax.prototype = new eXcell_sub_row;
function eXcell_sub_row_grid(cell) {
    this.base = eXcell_sub_row;
    this.base(cell);
    this.setValue = function(val) {
        if (val)
            this.grid.setUserData(this.cell.parentNode.idd, "__sub_row", val);
        this.cell.SH = "grid";
        this._setState(val ? "plus.gif" : "blanc.gif")
    };
    this.getSubGrid = function() {
        if (!cell.RF)
            return null;
        return cell.RF
    }
};
eXcell_sub_row_grid.prototype = new eXcell_sub_row;
dhtmlXGridObject.prototype.wJ = function(n, show, hide) {
    var td = this.parentNode;
    var row = td.parentNode;
    var that = row.grid;
    var c = that.getUserData(row.idd, "__sub_row");
    if (!that.gC)
        that.gC = new eXcell_sub_row(td);
    if (!c)
        return;
    if (row._expanded && !show) {
        that.gC._setState("plus.gif", td);
        td.Vy = row._expanded;
        that.objBox.removeChild(row._expanded);
        row._expanded = false;
        row.style.height = (row.oldHeight || 20) + "px";
        td.style.height = (row.oldHeight || 20) + "px";
        if (that._fake)
            that._fake.rowsAr[row.idd].style.height = (row.oldHeight || 20) + "px";
        for (var i = 0; i < row.cells.length; i++) {
            row.cells[i].style.verticalAlign = "middle";
            row.cells[i].style.paddingTop = "0px"
        };
        delete that.qz[row.idd];
        that.qR();
        row._expanded.ctrl = null
    } else if (!row._expanded && !hide) {
        that.gC._setState("minus.gif", td);
        if (td.Vy) {
            var d = td.Vy;
            d.ctrl = td;
            that.objBox.appendChild(d);
            that.TX(d, td, parseInt(d.style.height))
        } else {
            var d = document.createElement("DIV");
            row.oldHeight = td.offsetHeight;
            d.ctrl = td;
            if (td.SH)
                that.YO[td.SH](that, d, td, c);
            else
                d.innerHTML = c;
            d.style.cssText = "position:absolute;left:0px;top:0px;overflow:auto;font-family:Tahoma;font-size:8pt;margin-top:2px;margin-left:4px;";
            d.className = "dhx_sub_row";
            that.objBox.appendChild(d);
            that.TX(d, td)
        };
        if (!that.qz) {
            that.attachEvent("onGridReconstructed", function() {
                        if (this.pagingOn)
                            this._collapsMonolite();
                        else
                            this.qR()
                    });
            that.attachEvent("onResizeEnd", function() {
                        this.qR(true)
                    });
            that.attachEvent("onAfterCMove", function() {
                        this.qR(true)
                    });
            that.attachEvent("onDrop", function() {
                        this.qR(true)
                    });
            that.attachEvent("onBeforePageChanged", function() {
                        this._collapsMonolite();
                        return true
                    });
            that.attachEvent("onGroupStateChanged", function() {
                        this.qR();
                        return true
                    });
            that.attachEvent("onFilterEnd", function() {
                        this._collapsMonolite()
                    });
            that.attachEvent("onUnGroup", function() {
                        this._collapsMonolite()
                    });
            that.attachEvent("onPageChanged", function() {
                        this._collapsMonolite()
                    });
            that.attachEvent("onXLE", function() {
                        this._collapsMonolite()
                    });
            that.attachEvent("onClearAll", function() {
                        for (var i in this.qz) {
                            if (this.qz[i] && this.qz[i].parentNode)
                                this.qz[i].parentNode.removeChild(this.qz[i])
                        };
                        this.qz = []
                    });
            that.attachEvent("onEditCell", function(a, b, c) {
                        if ((a !== 2) && this.qz[b] && this.cellType[c] != "ch" && this.cellType[c] != "ra")
                            this.wJ.apply(this.qz[b].ctrl.firstChild, [0, false, true]);
                        return true
                    });
            that.attachEvent("onCellChanged", function(id, ind) {
                        if (!this.qz[id])
                            return;
                        var c = this.cells(id, ind).cell;
                        c.style.verticalAlign = "top";
                        c.style.paddingTop = "3px"
                    });
            that.qz = []
        };
        that.qz[row.idd] = d;
        that.qR();
        for (var i = 0; i < row.cells.length; i++) {
            row.cells[i].style.verticalAlign = "top";
            row.cells[i].style.paddingTop = "3px"
        };
        if (that._fake) {
            var frow = that._fake.rowsAr[row.idd];
            for (var i = 0; i < frow.cells.length; i++) {
                frow.cells[i].style.verticalAlign = "top";
                frow.cells[i].style.paddingTop = "3px"
            }
        };
        td.style.paddingTop = "1px";
        row._expanded = d
    };
    if (that._ahgr)
        that.setSizes();
    if (that.parentGrid)
        that.callEvent("onGridReconstructed", []);
    that.callEvent("onSubRowOpen", [row.idd, (!!row._expanded)]);
    if (that.parentGrid)
        that.callEvent("onGridReconstructed", []);
    that.callEvent("onSubRowOpen", [row.idd, (!!row._expanded)])
};
dhtmlXGridObject.prototype.YO = {
    "ajax" : function(that, d, td, c) {
        d.innerHTML = "Loading...";
        var xml = new dtmlXMLLoaderObject(function() {
                    d.innerHTML = xml.xmlDoc.responseText;
                    var z = xml.xmlDoc.responseText.match(/<script[^>]*>([^<]+)<\/script>/g);
                    if (z)
                        for (var i = 0; i < z.length; i++)
                            eval(z[i].replace(/<([\/]{0,1})s[^>]*>/g, ""));
                    that.TX(d, td);
                    that.qR();
                    that.setUserData(td.parentNode.idd, "__sub_row", xml.xmlDoc.responseText);
                    td.SH = null;
                    if (that._ahgr)
                        that.setSizes();
                    that.callEvent("onSubAjaxLoad", [td.parentNode.idd, xml.xmlDoc.responseText])
                }, this, true, true);
        xml.loadXML(c)
    },
    "grid" : function(that, d, td, c) {
        td.RF = new dhtmlXGridObject(d);
        if (that.skin_name)
            td.RF.setSkin(that.skin_name);
        td.RF.parentGrid = that;
        td.RF.setImagePath(that.imgURL);
        td.RF.enableAutoHeight(true);
        td.RF.attachEvent("onGridReconstructed", function() {
                    that.TX(d, td, td.RF.objBox.scrollHeight + td.RF.hdr.offsetHeight + (this.ftr ? this.ftr.offsetHeight : 0));
                    that.qR();
                    this.setSizes();
                    if (that.parentGrid)
                        that.callEvent("onGridReconstructed", [])
                });
        if (!that.callEvent("onSubGridCreated", [td.RF, td.parentNode.idd, td._cellIndex, c]))
            return;
        td.RF.loadXML(c, function() {
                    that.TX(d, td, td.RF.objBox.scrollHeight + td.RF.hdr.offsetHeight + (td.RF.ftr ? td.RF.ftr.offsetHeight : 0));
                    td.RF.objBox.style.overflow = "hidden";
                    that.qR();
                    td.SH = null;
                    if (!that.callEvent("onSubGridLoaded", [td.RF, td.parentNode.idd, td._cellIndex, c]))
                        return;
                    if (that._ahgr)
                        that.setSizes()
                })
    }
};
dhtmlXGridObject.prototype.TX = function(d, td, h) {
    var l = td.offsetLeft + td.offsetWidth;
    d.style.left = l + "px";
    d.style.width = Math.max(0, td.parentNode.offsetWidth - l - 4) + "px";
    var h = h || d.scrollHeight;
    d.style.overflow = "hidden";
    d.style.height = h + "px";
    var row = td.parentNode;
    td.parentNode.style.height = (row.oldHeight || 20) + 3 + h * 1 + "px";
    td.style.height = (row.oldHeight || 20) + 3 + h * 1 + "px";
    if (this._fake) {
        var tr = this._fake.rowsAr[td.parentNode.idd];
        tr.style.height = (row.oldHeight || 20) + 3 + h * 1 + "px"
    }
};
dhtmlXGridObject.prototype.qR = function(mode) {
    for (var a in this.qz)
        if (this.qz[a] && this.qz[a].tagName == "DIV")
            if (this.rowsAr[a]) {
                if (this.rowsAr[a].style.display == "none") {
                    this.cells4(this.qz[a].ctrl).close();
                    continue
                };
                this.qz[a].style.top = this.rowsAr[a].offsetTop + (this.rowsAr[a].oldHeight || 20) + "px";
                if (mode) {
                    var l = this.qz[a].ctrl.offsetLeft + this.qz[a].ctrl.offsetWidth;
                    this.qz[a].style.left = l + "px";
                    this.qz[a].style.width = this.rowsAr[a].offsetWidth - l - 4 + "px"
                }
            } else {
                this.qz[a].ctrl = null;
                this.objBox.removeChild(this.qz[a]);
                delete this.qz[a]
            }
};
dhtmlXGridObject.prototype._collapsMonolite = function() {
    for (var a in this.qz)
        if (this.qz[a] && this.qz[a].tagName == "DIV")
            if (this.rowsAr[a])
                this.cells4(this.qz[a].ctrl).close()
};