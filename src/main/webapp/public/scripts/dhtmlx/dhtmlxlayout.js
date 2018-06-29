

function dhtmlXLayoutPanel() {
};
function dhtmlXLayoutObject(base, view, skin) {
    if (!dhtmlXContainer) {
        alert("dhtmlxcontainer.js is missed on the page");
        return
    };
    var that = this;
    this._autodetectSkin = function() {
        var t = document.createElement("DIV");
        t.className = "dhxlayout_skin_detect";
        if (document.body.childNodes.length > 0)
            document.body.insertBefore(t, document.body.childNodes[0]);
        else
            document.body.appendChild(t);
        var w = t.offsetWidth;
        document.body.removeChild(t);
        t = null;
        if (w == 199)
            return "dhx_skyblue";
        if (w == 299)
            return "dhx_blue";
        if (w == 399)
            return "dhx_black";
        return "dhx_skyblue"
    };
    this.skin = (skin != null ? skin : this._autodetectSkin());
    this.setSkin = function(skin) {
        if (!this.skinParams[skin])
            return;
        this.skin = skin;
        this._CPanelHeight = this.skinParams[this.skin]["cpanel_height"];
        this._collapsedW = this.skinParams[this.skin]["cpanel_collapsed_width"];
        this._collapsedH = this.skinParams[this.skin]["cpanel_collapsed_height"];
        this.tpl.className = "dhtmlxLayoutPolyContainer_" + this.skin;
        this.sizer.className = "dhxLayout_Sizer_" + this.skin;
        if (this.dhxWins)
            this.dhxWins.setSkin(this.skin);
        for (var a in this.polyObj)
            this.polyObj[a].skin = this.skin;
        this.base.skin = this.skin;
        this._fixIcons();
        this.setSizes()
    };
    this._dblClickTM = 200;
    this._mTop = 0;
    this._mBottom = 0;
    if (typeof(base) == "string") {
        base = document.getElementById(base)
    };
    if ((base._isWindow == true || base._isCell) && !this.base) {
        if (base._isCell && base.attachLayout)
            return base.attachLayout(view, skin);
        if (base.isWindow)
            return base.attachLayout(view, skin);
        this.base = base
    };
    if (base == document.body && !this.base) {
        document.body.style.overflow = "hidden"
    };
    if ((typeof(base) == "object" || base == document.body) && !this.base) {
        var contObj = document.createElement("DIV");
        contObj.className = "dhxcont_global_layout_area";
        base.appendChild(contObj);
        base._isLayout = true;
        this.cont = new dhtmlXContainer(base);
        this.cont.setContent(contObj);
        if (base == document.body) {
            if (this.skin == "dhx_skyblue") {
                this.cont.obj._offsetTop = 2;
                this.cont.obj._offsetLeft = 2;
                this.cont.obj._offsetHeight = -4;
                this.cont.obj._offsetWidth = -4
            };
            document.body.className += " dhxlayout_fullscreened"
        };
        base.adjustContent(base, this._mTop, null, null, this._mBottom);
        this.base = document.createElement("DIV");
        this.base.style.overflow = "hidden";
        this.base.style.position = "absolute";
        this.base.style.left = "0px";
        this.base.style.top = "0px";
        this.base.style.width = contObj.childNodes[0].style.width;
        this.base.style.height = contObj.childNodes[0].style.height;
        contObj.childNodes[0].appendChild(this.base);
        if (base == document.body) {
            this._tmTime = null;
            this._doOnResizeStart = function() {
                window.clearTimeout(this._tmTime);
                this._tmTime = window.setTimeout(function() {
                            that._doOnResizeEnd()
                        }, 200)
            };
            this._doOnResizeEnd = function() {
                var dim = this._defineWindowMinDimension(this.base, true);
                document.body.setMinContentSize(dim[1], dim[2]);
                document.body.adjustContent(document.body, 0);
                this.setSizes(false)
            };
            if (_isIE) {
                window.attachEvent("onresize", that._doOnResizeStart)
            } else {
                window.addEventListener("resize", that._doOnResizeStart, false)
            }
        }
    };
    this.items = new Array();
    this.cells = function(id) {
        if (this.polyObj[id] != null) {
            return this.polyObj[id]
        };
        return null
    };
    this.getIdByIndex = function(ind) {
        if (ind < 0)
            return null;
        if (ind >= this.items.length)
            return null;
        return this.items[ind]._idd
    };
    this.getIndexById = function(id) {
        if (this.cells(id) != null)
            return this.cells(id).getIndex();
        return null
    };
    this.imagePath = dhtmlx.image_path || "codebase/imgs/";
    this.setImagePath = function(path) {
        this.imagePath = path
    };
    this.polyObj = {};
    this.sepHor = new Array();
    this.sepVer = new Array();
    this._layoutView = (view != null ? String(view).toUpperCase() : "3E");
    this._minWidth = 40;
    this._minHeight = 40;
    this._CPanelBtnsWidth = 32;
    this.skinParams = {
        "glassy_blue" : {
            "hor_sep_height" : 4,
            "ver_sep_width" : 4,
            "cpanel_height" : 23,
            "cpanel_collapsed_width" : 7,
            "cpanel_collapsed_height" : (_isFF ? 7 : 8)
        },
        "glassy_caramel" : {
            "hor_sep_height" : 4,
            "ver_sep_width" : 4,
            "cpanel_height" : 23,
            "cpanel_collapsed_width" : 7,
            "cpanel_collapsed_height" : (_isFF ? 7 : 8)
        },
        "glassy_greenapple" : {
            "hor_sep_height" : 4,
            "ver_sep_width" : 4,
            "cpanel_height" : 23,
            "cpanel_collapsed_width" : 7,
            "cpanel_collapsed_height" : (_isFF ? 7 : 8)
        },
        "glassy_rainy" : {
            "hor_sep_height" : 4,
            "ver_sep_width" : 4,
            "cpanel_height" : 23,
            "cpanel_collapsed_width" : 7,
            "cpanel_collapsed_height" : (_isFF ? 7 : 8)
        },
        "glassy_raspberries" : {
            "hor_sep_height" : 4,
            "ver_sep_width" : 4,
            "cpanel_height" : 23,
            "cpanel_collapsed_width" : 7,
            "cpanel_collapsed_height" : (_isFF ? 7 : 8)
        },
        "glassy_yellow" : {
            "hor_sep_height" : 4,
            "ver_sep_width" : 4,
            "cpanel_height" : 23,
            "cpanel_collapsed_width" : 7,
            "cpanel_collapsed_height" : (_isFF ? 7 : 8)
        },
        "aqua_dark" : {
            "hor_sep_height" : 5,
            "ver_sep_width" : 5,
            "cpanel_height" : 24,
            "cpanel_collapsed_width" : 18,
            "cpanel_collapsed_height" : 18
        },
        "aqua_orange" : {
            "hor_sep_height" : 5,
            "ver_sep_width" : 5,
            "cpanel_height" : 24,
            "cpanel_collapsed_width" : 18,
            "cpanel_collapsed_height" : 18
        },
        "aqua_sky" : {
            "hor_sep_height" : 5,
            "ver_sep_width" : 5,
            "cpanel_height" : 24,
            "cpanel_collapsed_width" : 18,
            "cpanel_collapsed_height" : 18
        },
        "clear_blue" : {
            "hor_sep_height" : 5,
            "ver_sep_width" : 5,
            "cpanel_height" : 26,
            "cpanel_collapsed_width" : 18,
            "cpanel_collapsed_height" : 18
        },
        "clear_green" : {
            "hor_sep_height" : 5,
            "ver_sep_width" : 5,
            "cpanel_height" : 26,
            "cpanel_collapsed_width" : 18,
            "cpanel_collapsed_height" : 18
        },
        "clear_silver" : {
            "hor_sep_height" : 5,
            "ver_sep_width" : 5,
            "cpanel_height" : 26,
            "cpanel_collapsed_width" : 18,
            "cpanel_collapsed_height" : 18
        },
        "modern_black" : {
            "hor_sep_height" : 5,
            "ver_sep_width" : 5,
            "cpanel_height" : 31,
            "cpanel_collapsed_width" : 18,
            "cpanel_collapsed_height" : 18
        },
        "modern_blue" : {
            "hor_sep_height" : 5,
            "ver_sep_width" : 5,
            "cpanel_height" : 31,
            "cpanel_collapsed_width" : 18,
            "cpanel_collapsed_height" : 18
        },
        "modern_red" : {
            "hor_sep_height" : 5,
            "ver_sep_width" : 5,
            "cpanel_height" : 31,
            "cpanel_collapsed_width" : 18,
            "cpanel_collapsed_height" : 18
        },
        "dhx_black" : {
            "hor_sep_height" : 5,
            "ver_sep_width" : 5,
            "cpanel_height" : 34,
            "cpanel_collapsed_width" : 18,
            "cpanel_collapsed_height" : 18
        },
        "dhx_blue" : {
            "hor_sep_height" : 5,
            "ver_sep_width" : 5,
            "cpanel_height" : 34,
            "cpanel_collapsed_width" : 18,
            "cpanel_collapsed_height" : 18
        },
        "dhx_skyblue" : {
            "hor_sep_height" : 5,
            "ver_sep_width" : 5,
            "cpanel_height" : 26,
            "cpanel_collapsed_width" : 18,
            "cpanel_collapsed_height" : 18
        },
        "standard" : {
            "hor_sep_height" : 5,
            "ver_sep_width" : 5,
            "cpanel_height" : 28,
            "cpanel_collapsed_width" : 20,
            "cpanel_collapsed_height" : (_isFF ? 20 : 22)
        }
    };
    this._CPanelHeight = this.skinParams[this.skin]["cpanel_height"];
    this._collapsedW = this.skinParams[this.skin]["cpanel_collapsed_width"];
    this._collapsedH = this.skinParams[this.skin]["cpanel_collapsed_height"];
    this.tpl = document.createElement("TABLE");
    this.tpl.className = "dhtmlxLayoutPolyContainer_" + this.skin;
    this.tpl.cellSpacing = 0;
    this.tpl.cellPadding = 0;
    var bd = document.createElement("TBODY");
    this.tpl.appendChild(bd);
    this.tpl.border = 0;
    this.tplSizes = {};
    this._effects = {
        "collapse" : false,
        "resize" : false,
        "highlight" : true
    };
    this.sizer = document.createElement("DIV");
    this.sizer.className = "dhxLayout_Sizer_" + this.skin;
    this.sizer.style.display = "none";
    document.body.appendChild(this.sizer);
    this._attachSizer = function(obj) {
        that.sizer.style.left = getAbsoluteLeft(obj) + "px";
        that.sizer.style.top = getAbsoluteTop(obj) + "px";
        that.sizer.style.width = obj.offsetWidth + "px";
        that.sizer.style.height = obj.offsetHeight + "px";
        if (that._sizerML != null)
            that.sizer.style.marginLeft = that._sizerML + "px";
        if (that._sizerMT != null)
            that.sizer.style.marginTop = that._sizerMT + "px";
        that.sizer.style.display = "";
        that.sizer.className = "dhxLayout_Sizer_" + that.skin;
        if (obj._dir != null) {
            that.sizer.className += " " + (obj._dir == "hor" ? "dhxCursorNResize" : "dhxCursorWResize")
        }
    };
    this.listViews = function() {
        var views = new Array();
        for (var a in this.tplData) {
            views[views.length] = a
        };
        return views
    };
    this._init = function() {
        this.obj = document.createElement("DIV");
        this.obj.className = "dhtmlxLayoutObject";
        this.base.appendChild(this.obj);
        this.obj.appendChild(this.tpl);
        this.w = this.obj.offsetWidth;
        this.h = this.obj.offsetHeight;
        this._xmlLoader.loadXMLString(this.tplData[this._layoutView] != null ? this.tplData[this._layoutView] : this.tplData["3E"]);
        this._initWindows()
    };
    this._autoHor = new Array();
    this._autoVer = new Array();
    this._dimension = new Array(320, 200);
    this._rowsRatio = 100;
    this._colsRatio = 100;
    this._xmlParser = function() {
        var tableDataH = new Array();
        var tableDataV = new Array();
        var tableSeps = {};
        var root = this.getXMLTopNode("layout");
        for (var q = 0; q < root.childNodes.length; q++) {
            if (root.childNodes[q].tagName == "row") {
                var row = root.childNodes[q];
                var tr = document.createElement("TR");
                that.tpl.childNodes[0].appendChild(tr);
                for (var w = 0; w < row.childNodes.length; w++) {
                    if (row.childNodes[w].tagName == "cell") {
                        var cell = row.childNodes[w];
                        var td = document.createElement("TD");
                        td._dir = "null";
                        if (cell.getAttribute("obj") != null) {
                            var obj = cell.getAttribute("obj");
                            var wh = String(cell.getAttribute("wh")).split(",");
                            var f = isNaN(wh[0]);
                            var tdW = (isNaN(wh[0]) ? parseInt(that.polyObj[wh[0]].style.width) : 0);
                            for (var q1 = 0; q1 < tableDataH.length; q1++) {
                                for (var w1 = 0; w1 < tableDataH[q1].length; w1++) {
                                    if (tableDataH[q1][w1] == obj) {
                                        if (!f) {
                                            f = true;
                                            var mw = that.base.offsetWidth - tableSeps[obj][0] * that.skinParams[that.skin]["ver_sep_width"];
                                            for (var r = 0; r < tableDataH[q1].length; r++) {
                                                if (!isNaN(tableDataH[q1][r])) {
                                                    mw -= tableDataH[q1][r];
                                                    wh[0] -= 1
                                                }
                                            };
                                            tdW = Math.ceil(mw / wh[0])
                                        };
                                        tableDataH[q1][w1] = tdW
                                    }
                                }
                            };
                            td.style.width = tdW + "px";
                            var f = isNaN(wh[1]);
                            var tdH = (isNaN(wh[1]) ? parseInt(that.polyObj[wh[1]].style.height) : 0);
                            for (var q1 = 0; q1 < tableDataV.length; q1++) {
                                for (var w1 = 0; w1 < tableDataV[q1].length; w1++) {
                                    if (tableDataV[q1][w1] == obj) {
                                        if (!f) {
                                            f = true;
                                            var mh = that.base.offsetHeight - tableSeps[obj][1] * that.skinParams[that.skin]["hor_sep_height"];
                                            for (var r = 0; r < tableDataV.length; r++) {
                                                if (!isNaN(tableDataV[r][w1])) {
                                                    mh -= tableDataV[r][w1];
                                                    wh[1] -= 1
                                                }
                                            };
                                            tdH = Math.ceil(mh / wh[1])
                                        };
                                        tableDataV[q1][w1] = tdH
                                    }
                                }
                            };
                            td.style.height = tdH + "px";
                            td.className = "dhtmlxLayoutSinglePoly";
                            td.innerHTML = "";
                            td._minW = (cell.getAttribute("minWidth") != null ? Number(cell.getAttribute("minWidth")) : that._minWidth);
                            td._minH = (cell.getAttribute("minHeight") != null ? Number(cell.getAttribute("minHeight")) : that._minHeight);
                            td._initCPanel = (cell.getAttribute("cpanel") != null ? (cell.getAttribute("cpanel") == "false" ? false : true) : true);
                            td._resize = cell.getAttribute("resize");
                            var rd = String(cell.getAttribute("neighbors")).split(";");
                            for (var e = 0; e < rd.length; e++) {
                                var p = String(rd[e]).split(",");
                                if (p.length > 1) {
                                    rd[e] = p
                                }
                            };
                            td._rowData = rd;
                            that.polyObj[obj] = td
                        };
                        if (cell.getAttribute("sep") != null) {
                            var sep = cell.getAttribute("sep");
                            if (sep == "hor") {
                                td.className = "dhtmlxLayoutPolySplitterHor";
                                td._dir = "hor";
                                var top = cell.getAttribute("top").split(";");
                                for (var e = 0; e < top.length; e++) {
                                    var p = String(top[e]).split(",");
                                    if (p.length > 1) {
                                        top[e] = p
                                    }
                                };
                                td._top = top;
                                var bottom = cell.getAttribute("bottom").split(";");
                                for (var e = 0; e < bottom.length; e++) {
                                    var p = String(bottom[e]).split(",");
                                    if (p.length > 1) {
                                        bottom[e] = p
                                    }
                                };
                                td._bottom = bottom;
                                that.sepHor[that.sepHor.length] = td
                            } else {
                                td.className = "dhtmlxLayoutPolySplitterVer";
                                td._dir = "ver";
                                var left = cell.getAttribute("left").split(";");
                                for (var e = 0; e < left.length; e++) {
                                    var p = String(left[e]).split(",");
                                    if (p.length > 1) {
                                        left[e] = p
                                    }
                                };
                                td._left = left;
                                var right = cell.getAttribute("right").split(";");
                                for (var e = 0; e < right.length; e++) {
                                    var p = String(right[e]).split(",");
                                    if (p.length > 1) {
                                        right[e] = p
                                    }
                                };
                                td._right = right;
                                that.sepVer[that.sepVer.length] = td
                            };
                            td._dblClick = cell.getAttribute("dblclick");
                            td._isSep = true;
                            td.innerHTML = "&nbsp;"
                        };
                        if (cell.getAttribute("colspan") != null) {
                            td.colSpan = cell.getAttribute("colspan")
                        };
                        if (cell.getAttribute("rowspan") != null) {
                            td.rowSpan = cell.getAttribute("rowspan")
                        };
                        tr.appendChild(td)
                    }
                }
            };
            if (root.childNodes[q].tagName == "autosize") {
                that._autoHor = (root.childNodes[q].getAttribute("hor")).split(";");
                that._autoVer = (root.childNodes[q].getAttribute("ver")).split(";");
                that._totalCols = root.childNodes[q].getAttribute("cols");
                that._totalRows = root.childNodes[q].getAttribute("rows");
                that._dimension[0] = that._totalCols * that._colsRatio;
                that._dimension[1] = that._totalRows * that._rowsRatio
            };
            if (root.childNodes[q].tagName == "table") {
                var data = root.childNodes[q].getAttribute("data");
                var r = String(data).split(";");
                for (var q1 = 0; q1 < r.length; q1++) {
                    tableDataH[q1] = new Array();
                    tableDataV[q1] = new Array();
                    var c = String(r[q1]).split(",");
                    for (var w1 = 0; w1 < c.length; w1++) {
                        tableDataH[q1][w1] = c[w1];
                        tableDataV[q1][w1] = c[w1];
                        if (tableSeps[c[w1]] == null) {
                            tableSeps[c[w1]] = new Array(0, 0)
                        }
                    }
                };
                for (var a in tableSeps) {
                    var f = false;
                    for (var q1 = 0; q1 < tableDataH.length; q1++) {
                        for (var w1 = 0; w1 < tableDataH[q1].length; w1++) {
                            if (tableDataH[q1][w1] == a && !f) {
                                f = true;
                                for (var e1 = 0; e1 < tableDataH[q1].length; e1++) {
                                    if (tableDataH[q1][e1] != a)
                                        tableSeps[a][0]++
                                };
                                for (var e1 = 0; e1 < tableDataH.length; e1++) {
                                    if (tableDataH[e1][w1] != a)
                                        tableSeps[a][1]++
                                }
                            }
                        }
                    }
                }
            }
        };
        tableDataH = null;
        tableDataV = null;
        that._buildSurface();
        this.destructor()
    };
    this._xmlLoader = new dtmlXMLLoaderObject(this._xmlParser, window);
    this.listAutoSizes = function() {
        var hor = this._availAutoSize[this._layoutView + "_hor"];
        var ver = this._availAutoSize[this._layoutView + "_ver"];
        var currentHor = (this._autoHor).join(";");
        var currentVer = (this._autoVer).join(";");
        return new Array(currentHor, currentVer, hor, ver)
    };
    this.setAutoSize = function(hor, ver) {
        if (hor != null) {
            var allow = false;
            var data = this._availAutoSize[this._layoutView + "_hor"];
            for (var q = 0; q < data.length; q++) {
                allow = allow || (data[q] == hor)
            };
            if (allow == true) {
                this._autoHor = hor.split(";")
            }
        };
        if (ver != null) {
            var allow = false;
            var data = this._availAutoSize[this._layoutView + "_ver"];
            for (var q = 0; q < data.length; q++) {
                allow = allow || (data[q] == ver)
            };
            if (allow == true) {
                this._autoVer = ver.split(";")
            }
        }
    };
    this._buildSurface = function() {
        for (var r = 0; r < this.tpl.childNodes[0].childNodes.length; r++) {
            var tr = this.tpl.childNodes[0].childNodes[r];
            for (var c = 0; c < tr.childNodes.length; c++) {
                var td = tr.childNodes[c];
                var that = this;
                if (!td._isSep) {
                    td._isCell = true;
                    td.skin = this.skin;
                    td.getId = function() {
                        return this._idd
                    };
                    td.getIndex = function() {
                        return this._ind
                    };
                    td.showHeader = function() {
                        that.showPanel(this._idd)
                    };
                    td.hideHeader = function() {
                        that.hidePanel(this._idd)
                    };
                    td.isHeaderVisible = function() {
                        return that.isPanelVisible(this._idd)
                    };
                    td.setText = function(text) {
                        that.setText(this._idd, text)
                    };
                    td.getText = function() {
                        return that.getText(this._idd)
                    };
                    td.expand = function() {
                        if (!that._isCollapsed(this._idd))
                            return;
                        that._expand(this._idd, "hide")
                    };
                    td.collapse = function() {
                        if (that._isCollapsed(this._idd))
                            return;
                        that._collapse(this._idd, "hide")
                    };
                    td.isCollapsed = function() {
                        return that._isCollapsed(this._idd)
                    };
                    td.dock = function() {
                        if (!that._isCollapsed(this._idd))
                            return;
                        that._expand(this._idd, "dock");
                        that.dockWindow(this._idd)
                    };
                    td.undock = function() {
                        if (that._isCollapsed(this._idd))
                            return;
                        that.unDockWindow(this._idd);
                        that._collapse(this._idd, "dock")
                    };
                    td.setWidth = function(width) {
                        if (!Number(width))
                            return;
                        that._setWidth(this._idd, width)
                    };
                    td.getWidth = function() {
                        return parseInt(this.style.width)
                    };
                    td.setHeight = function(height) {
                        if (!Number(height))
                            return;
                        that._setHeight(this._idd, height)
                    };
                    td.getHeight = function() {
                        return parseInt(this.style.height)
                    };
                    td.fixSize = function(width, height) {
                        that._fixSize(this._idd, width, height)
                    };
                    td.progressOn = function() {
                        that._progressControl(this._idd, true)
                    };
                    td.progressOff = function() {
                        that._progressControl(this._idd, false)
                    };
                    td._doOnAttachMenu = function() {
                        this.adjustContent(this.childNodes[0], (this._noHeader ? 0 : that.skinParams[that.skin]["cpanel_height"]));
                        this.updateNestedObjects()
                    };
                    td._doOnAttachToolbar = function() {
                        this.adjustContent(this.childNodes[0], (this._noHeader ? 0 : that.skinParams[that.skin]["cpanel_height"]));
                        this.updateNestedObjects()
                    };
                    td._doOnAttachStatusBar = function() {
                        this.adjustContent(this.childNodes[0], (this._noHeader ? 0 : that.skinParams[that.skin]["cpanel_height"]));
                        this.updateNestedObjects()
                    }
                };
                if (td._dir == "ver") {
                    td.onselectstart = function(e) {
                        e = e || event;
                        e.returnValue = false
                    };
                    td.onmousedown = function(e) {
                        e = e || event;
                        if (!this._lastClick) {
                            this._lastClick = new Date().getTime()
                        } else {
                            var t = this._lastClick;
                            this._lastClick = new Date().getTime();
                            if (t + that._dblClickTM >= this._lastClick) {
                                if (that._doOnDoubleClick(this) === true)
                                    return
                            }
                        };
                        var p = that._findDockCellsVer(this);
                        that._resAreaData = new Array();
                        if (p[0] != null && p[1] != null) {
                            if (String(document.body.className).search("dhxCursorWResize") == -1) {
                                document.body.className += " dhxCursorWResize"
                            };
                            that._resObj = this;
                            that._anyExpL = p[0];
                            that._anyExpR = p[1];
                            that._collectResAreaData(p);
                            that._resX = e.clientX;
                            if (that._effects["resize"] == false) {
                                that._attachSizer(this);
                                that.sizer._leftXStart = parseInt(that.sizer.style.left);
                                var objLeft = that.polyObj[that._anyExpL[0]];
                                that._resXMaxWidthLeft = parseInt(objLeft.style.width) - that._minWidth;
                                var objRight = that.polyObj[that._anyExpR[0]];
                                that._resXMaxWidthRight = parseInt(objRight.style.width) - that._minWidth;
                                if (that._alterSizes.length > 0) {
                                    for (var q = 0; q < that._alterSizes.length; q++) {
                                        for (var w = 0; w < that._anyExpL.length; w++) {
                                            if (that._alterSizes[q][0] == that._anyExpL[w]) {
                                                var newVal = that._resXMaxWidthLeft = parseInt(objLeft.style.width) - that._alterSizes[q][1];
                                                if (newVal < that._resXMaxWidthLeft) {
                                                    that._resXMaxWidthLeft = newVal
                                                }
                                            }
                                        };
                                        for (var w = 0; w < that._anyExpR.length; w++) {
                                            if (that._alterSizes[q][0] == that._anyExpR[w]) {
                                                newVal = parseInt(objRight.style.width) - that._alterSizes[q][1];
                                                if (newVal < that._resXMaxWidthRight) {
                                                    that._resXMaxWidthRight = newVal
                                                }
                                            }
                                        }
                                    }
                                };
                                that._resXStart = that._resX
                            };
                            that._resFunc = that._resizeVer;
                            that._showCovers()
                        }
                    };
                    td.onmouseup = function() {
                        if (that._effects["resize"] == true) {
                            that._resizeStop();
                            that._anyExpL = null;
                            that._anyExpR = null
                        }
                    }
                };
                if (td._dir == "hor") {
                    td.onselectstart = function(e) {
                        e = e || event;
                        e.returnValue = false
                    };
                    td.onmousedown = function(e) {
                        e = e || event;
                        if (!this._lastClick) {
                            this._lastClick = new Date().getTime()
                        } else {
                            var t = this._lastClick;
                            this._lastClick = new Date().getTime();
                            if (t + that._dblClickTM >= this._lastClick) {
                                if (that._doOnDoubleClick(this) === true)
                                    return
                            }
                        };
                        var p = that._findDockCellsHor(this);
                        that._resAreaData = new Array();
                        if (p[0] != null && p[1] != null) {
                            if (String(document.body.className).search("dhxCursorNResize") == -1) {
                                document.body.className += " dhxCursorNResize"
                            };
                            that._resObj = this;
                            that._anyExpT = p[0];
                            that._anyExpB = p[1];
                            that._collectResAreaData(p);
                            that._resY = e.clientY;
                            if (that._effects["resize"] == false) {
                                that._attachSizer(this);
                                that.sizer._topYStart = parseInt(that.sizer.style.top);
                                var objTop = that.polyObj[that._anyExpT[0]];
                                that._resYMaxHeightTop = parseInt(objTop.style.height) - that._minHeight;
                                var objBottom = that.polyObj[that._anyExpB[0]];
                                that._resYMaxHeightBottom = parseInt(objBottom.style.height) - that._minHeight;
                                if (that._alterSizes.length > 0) {
                                    for (var q = 0; q < that._alterSizes.length; q++) {
                                        for (var w = 0; w < that._anyExpT.length; w++) {
                                            if (that._alterSizes[q][0] == that._anyExpT[w]) {
                                                var newVal = parseInt(objTop.style.height) - that._alterSizes[q][2] - (objTop.childNodes[0].style.display != "none" ? that.skinParams[that.skin]["cpanel_height"] : 0);
                                                if (newVal < that._resYMaxHeightTop) {
                                                    that._resYMaxHeightTop = newVal
                                                }
                                            }
                                        };
                                        for (var w = 0; w < that._anyExpB.length; w++) {
                                            if (that._alterSizes[q][0] == that._anyExpB[w]) {
                                                var newVal = parseInt(objBottom.style.height) - that._alterSizes[q][2] - (objBottom.childNodes[0].style.display != "none" ? that.skinParams[that.skin]["cpanel_height"] : 0);
                                                if (newVal < that._resYMaxHeightBottom) {
                                                    that._resYMaxHeightBottom = newVal
                                                }
                                            }
                                        }
                                    }
                                };
                                that._resYStart = that._resY
                            };
                            that._resFunc = that._resizeHor;
                            that._showCovers()
                        }
                    };
                    td.onmouseup = function() {
                        if (that._effects["resize"] == true) {
                            that._resizeStop();
                            that._anyExpT = null;
                            that._anyExpB = null
                        }
                    }
                }
            }
        };
        for (var a in this.polyObj) {
            this.polyObj[a]._collapsed = false;
            this.polyObj[a]._idd = a;
            this.polyObj[a]._ind = this.items.length;
            this.items[this.items.length] = this.polyObj[a];
            var nod = document.createElement("DIV");
            nod.style.position = "relative";
            nod.style.left = "0px";
            nod.style.top = "0px";
            nod.style.width = this.polyObj[a].style.width;
            nod.style.height = this.polyObj[a].style.height;
            nod.style.overflow = "hidden";
            this.polyObj[a].appendChild(nod);
            var bar = document.createElement("DIV");
            bar._dockCell = a;
            bar._resize = this.polyObj[a]._resize;
            bar.className = "dhtmlxPolyInfoBar";
            bar.innerHTML = "<div class='dhtmlxInfoBarLabel'>" + a + "</div>" + "<div class='dhtmlxInfoBarButtonsFake'><div class='dhtmlxInfoBarButtonsFake2'></div></div>" + "<div class='dhtmlxInfoButtonDock' title='Dock'></div>" + "<div class='dhtmlxInfoButtonUnDock' style='display: none;' title='UnDock'></div>" + "<div class='dhtmlxInfoButtonShowHide_" + bar._resize + "' title='Collapse'></div>" + "<div class='dhtmlxLineL'></div>" + "<div class='dhtmlxLineR'></div>";
            if (this.polyObj[a]._initCPanel == true) {
                bar._h = this._CPanelHeight;
                bar.style.display = ""
            } else {
                bar._h = 0;
                bar.style.display = "none"
            };
            this.polyObj[a].childNodes[0].appendChild(bar);
            bar.ondblclick = function() {
                that.callEvent("onDblClick", [this._dockCell])
            };
            bar.childNodes[4].onclick = function() {
                var pId = this.parentNode._dockCell;
                if (that._isCollapsed(pId)) {
                    that._expand(pId, "hide")
                } else {
                    that._collapse(pId, "hide")
                }
            };
            for (var r = 0; r < bar.childNodes.length; r++) {
                bar.childNodes[r].onselectstart = function(e) {
                    e = e || event;
                    e.returnValue = false
                }
            };
            var contObj = document.createElement("DIV");
            contObj.className = "dhxcont_global_content_area";
            this.polyObj[a].childNodes[0].appendChild(contObj);
            var cont = new dhtmlXContainer(this.polyObj[a]);
            cont.setContent(contObj);
            this.polyObj[a].adjustContent(this.polyObj[a].childNodes[0], this.skinParams[this.skin]["cpanel_height"])
        };
        this._fixIcons()
    };
    this._resX = null;
    this._resY = null;
    this._resObj = null;
    this._resFunc = null;
    this._anyExpL = null;
    this._anyExpR = null;
    this._anyExpT = null;
    this._anyExpB = null;
    this._expand = function(pId, mode) {
        this._doExpand(this.polyObj[pId]._resize, pId, this.polyObj[pId]._rowData, mode)
    };
    this._collapse = function(pId, mode) {
        if (this._isCollapsed(pId))
            return;
        this.polyObj[pId]._savedW = parseInt(this.polyObj[pId].style.width);
        this.polyObj[pId]._savedH = parseInt(this.polyObj[pId].style.height);
        this._doCollapse(this.polyObj[pId]._resize, pId, this.polyObj[pId]._rowData, mode)
    };
    this._isCollapsed = function(pId) {
        return this.polyObj[pId]._collapsed
    };
    this._checkAlterMinSize = function(data) {
        this._alterSizes = new Array();
        for (var q = 0; q < data.length; q++) {
            for (var w = 0; w < data[q].length; w++) {
                if (this.polyObj[data[q][w]].layout != null) {
                    var dims = this.polyObj[data[q][w]].layout._defineWindowMinDimension(this.polyObj[data[q][w]], true);
                    dims[0] = data[q][w];
                    this._alterSizes[this._alterSizes.length] = dims
                }
            }
        }
    };
    this._findDockCellsVer = function(resObj) {
        var res = new Array(null, null);
        if (resObj == null) {
            return res
        };
        var anyExpL = null;
        for (var q = resObj._left.length - 1; q >= 0; q--) {
            if (anyExpL == null) {
                if (typeof(resObj._left[q]) == "object") {
                    var isBlocked = false;
                    for (var w = 0; w < resObj._left[q].length; w++) {
                        isBlocked = isBlocked || (this.polyObj[resObj._left[q][w]]._isBlockedWidth || false)
                    };
                    if (!isBlocked) {
                        anyExpL = resObj._left[q]
                    }
                } else if (this.polyObj[resObj._left[q]]._collapsed == false) {
                    if (!this.polyObj[resObj._left[q]]._isBlockedWidth) {
                        anyExpL = resObj._left[q]
                    }
                }
            }
        };
        var anyExpR = null;
        for (var q = 0; q < resObj._right.length; q++) {
            if (anyExpR == null) {
                if (typeof(resObj._right[q]) == "object") {
                    var isBlocked = false;
                    for (var w = 0; w < resObj._right[q].length; w++) {
                        isBlocked = isBlocked || (this.polyObj[resObj._right[q][w]]._isBlockedWidth || false)
                    };
                    if (!isBlocked) {
                        anyExpR = resObj._right[q]
                    }
                } else if (this.polyObj[resObj._right[q]]._collapsed == false) {
                    if (!this.polyObj[resObj._right[q]]._isBlockedWidth) {
                        anyExpR = resObj._right[q]
                    }
                }
            }
        };
        if (anyExpL == null || anyExpR == null) {
            return res
        };
        if (typeof(anyExpL) == "string") {
            anyExpL = new Array(anyExpL)
        };
        if (typeof(anyExpR) == "string") {
            anyExpR = new Array(anyExpR)
        };
        res[0] = anyExpL;
        res[1] = anyExpR;
        this._checkAlterMinSize(res);
        this._minWLAlter = 0;
        this._minWRAlter = 0;
        if (this._alterSizes.length > 0 && this._effects["resize"] == true) {
            var objL = new Array();
            var objR = new Array();
            for (var q = 0; q < anyExpL.length; q++) {
                objL[q] = this.polyObj[anyExpL[q]]
            };
            for (var q = 0; q < anyExpR.length; q++) {
                objR[q] = this.polyObj[anyExpR[q]]
            };
            for (var q = 0; q < objL.length; q++) {
                for (var w = 0; w < this._alterSizes.length; w++) {
                    if (this._alterSizes[w][0] == objL[q]._idd && this._minWLAlter < this._alterSizes[w][1]) {
                        this._minWLAlter = this._alterSizes[w][1]
                    }
                }
            };
            for (var q = 0; q < objR.length; q++) {
                for (var w = 0; w < this._alterSizes.length; w++) {
                    if (this._alterSizes[w][0] == objR[q]._idd && this._maxWRAlter < this._alterSizes[w][1]) {
                        this._minWRAlter = this._alterSizes[w][1]
                    }
                }
            }
        };
        return res
    };
    this._findDockCellsHor = function(resObj) {
        var res = new Array(null, null);
        if (resObj == null) {
            return res
        };
        var anyExpT = null;
        for (var q = resObj._top.length - 1; q >= 0; q--) {
            if (anyExpT == null) {
                if (typeof(resObj._top[q]) == "object") {
                    var isBlocked = false;
                    for (var w = 0; w < resObj._top[q].length; w++) {
                        isBlocked = isBlocked || (this.polyObj[resObj._top[q][w]]._isBlockedHeight || false)
                    };
                    if (!isBlocked) {
                        anyExpT = resObj._top[q]
                    }
                } else if (this.polyObj[resObj._top[q]]._collapsed == false) {
                    if (!this.polyObj[resObj._top[q]]._isBlockedHeight) {
                        anyExpT = resObj._top[q]
                    }
                }
            }
        };
        var anyExpB = null;
        for (var q = 0; q < resObj._bottom.length; q++) {
            if (anyExpB == null) {
                if (typeof(resObj._bottom[q]) == "object") {
                    var isBlocked = false;
                    for (var w = 0; w < resObj._bottom[q].length; w++) {
                        isBlocked = isBlocked || (this.polyObj[resObj._bottom[q][w]]._isBlockedHeight || false)
                    };
                    if (!isBlocked) {
                        anyExpB = resObj._bottom[q]
                    }
                } else if (this.polyObj[resObj._bottom[q]]._collapsed == false) {
                    if (!this.polyObj[resObj._bottom[q]]._isBlockedHeight) {
                        anyExpB = resObj._bottom[q]
                    }
                }
            }
        };
        if (anyExpT == null || anyExpB == null) {
            return res
        };
        if (typeof(anyExpT) == "string") {
            anyExpT = new Array(anyExpT)
        };
        if (typeof(anyExpB) == "string") {
            anyExpB = new Array(anyExpB)
        };
        res[0] = anyExpT;
        res[1] = anyExpB;
        this._checkAlterMinSize(res);
        this._minHTAlter = 0;
        this._minHBAlter = 0;
        if (this._alterSizes.length > 0 && this._effects["resize"] == true) {
            var objT = new Array();
            var objB = new Array();
            for (var q = 0; q < anyExpT.length; q++) {
                objT[q] = this.polyObj[anyExpT[q]]
            };
            for (var q = 0; q < anyExpB.length; q++) {
                objB[q] = this.polyObj[anyExpB[q]]
            };
            for (var q = 0; q < objT.length; q++) {
                for (var w = 0; w < this._alterSizes.length; w++) {
                    if (this._alterSizes[w][0] == objT[q]._idd && this._minHTAlter < this._alterSizes[w][2]) {
                        this._minHTAlter = this._alterSizes[w][2]
                    }
                }
            };
            for (var q = 0; q < objB.length; q++) {
                for (var w = 0; w < this._alterSizes.length; w++) {
                    if (this._alterSizes[w][0] == objB[q]._idd && this._minHBAlter < this._alterSizes[w][2]) {
                        this._minHBAlter = this._alterSizes[w][2]
                    }
                }
            }
        };
        return res
    };
    this._resizeVer = function(e) {
        if (this._resObj == null || this._anyExpL == null || this._anyExpR == null)
            return;
        if (this._effects["resize"] == false) {
            this._resX = e.clientX;
            var offsetX = e.clientX - this._resXStart;
            if (-offsetX > this._resXMaxWidthLeft && offsetX < 0) {
                offsetX = -this._resXMaxWidthLeft;
                this._resX = offsetX + this._resXStart
            };
            if (offsetX > this._resXMaxWidthRight && offsetX > 0) {
                offsetX = this._resXMaxWidthRight;
                this._resX = offsetX + this._resXStart
            };
            this.sizer.style.left = this.sizer._leftXStart + offsetX + "px";
            return
        };
        var anyExpL = this._anyExpL;
        var anyExpR = this._anyExpR;
        var newX = e.clientX;
        var offsetX = e.clientX - that._resX;
        var objL = new Array();
        var objR = new Array();
        for (var q = 0; q < anyExpL.length; q++) {
            objL[q] = this.polyObj[anyExpL[q]]
        };
        for (var q = 0; q < anyExpR.length; q++) {
            objR[q] = this.polyObj[anyExpR[q]]
        };
        var wL = parseInt(objL[0].style.width);
        var wR = parseInt(objR[0].style.width);
        if (offsetX < 0) {
            var newWL = wL + offsetX;
            if (newWL > objL[0]._minW && newWL > this._minWLAlter) {
                var newWR = wR + wL - newWL;
                for (var q = 0; q < objL.length; q++)
                    this._setW(objL[q], newWL);
                for (var q = 0; q < objR.length; q++)
                    this._setW(objR[q], newWR);
                this._resX = newX
            }
        } else if (offsetX > 0) {
            var newWR = wR - offsetX;
            if (newWR > objR[0]._minW && newWR > this._minWRAlter) {
                var newWL = wL + wR - newWR;
                for (var q = 0; q < objL.length; q++)
                    this._setW(objL[q], newWL);
                for (var q = 0; q < objR.length; q++)
                    this._setW(objR[q], newWR);
                this._resX = newX
            }
        }
    };
    this._resizeHor = function(e) {
        if (this._resObj == null || this._anyExpT == null || this._anyExpB == null)
            return;
        if (this._effects["resize"] == false) {
            this._resY = e.clientY;
            var offsetY = e.clientY - this._resYStart;
            if (-offsetY > this._resYMaxHeightTop && offsetY < 0) {
                offsetY = -this._resYMaxHeightTop;
                this._resY = offsetY + this._resYStart
            };
            if (offsetY > this._resYMaxHeightBottom && offsetY > 0) {
                offsetY = this._resYMaxHeightBottom;
                this._resY = offsetY + this._resYStart
            };
            this.sizer.style.top = this.sizer._topYStart + offsetY + "px";
            return
        };
        var anyExpT = this._anyExpT;
        var anyExpB = this._anyExpB;
        var newY = e.clientY;
        var offsetY = e.clientY - that._resY;
        var objT = new Array();
        var objB = new Array();
        for (var q = 0; q < anyExpT.length; q++) {
            objT[q] = this.polyObj[anyExpT[q]]
        };
        for (var q = 0; q < anyExpB.length; q++) {
            objB[q] = this.polyObj[anyExpB[q]]
        };
        var hT = parseInt(objT[0].style.height);
        var hB = parseInt(objB[0].style.height);
        if (offsetY < 0) {
            var newHT = hT + offsetY;
            if (newHT > objT[0]._minH + this._minHTAlter) {
                var newHB = hB + hT - newHT;
                for (var q = 0; q < objT.length; q++)
                    this._setH(objT[q], newHT);
                for (var q = 0; q < objB.length; q++)
                    this._setH(objB[q], newHB);
                this._resY = newY
            }
        } else if (offsetY > 0) {
            var newHB = hB - offsetY;
            if (newHB > objB[0]._minH + this._minHBAlter) {
                var newHT = hT + hB - newHB;
                for (var q = 0; q < objT.length; q++)
                    this._setH(objT[q], newHT);
                for (var q = 0; q < objB.length; q++)
                    this._setH(objB[q], newHB);
                this._resY = newY
            }
        }
    };
    this._resizeStop = function() {
        var p = document.body.className;
        if (p.search("dhxCursorWResize") !== -1 || p.search("dhxCursorNResize") !== -1) {
            document.body.className = String(document.body.className).replace(/dhxCursorWResize/g, "").replace(/dhxCursorNResize/g, "")
        };
        if (this._resObj == null)
            return;
        if (this._effects["resize"] == false) {
            this.sizer.style.display = "none";
            if (this._resObj._dir == "hor") {
                var objTop = (typeof(this._anyExpT[0]) == "object" ? this._anyExpT[0][0] : this._anyExpT[0]);
                var offsetY = this._resY - this._resYStart;
                var newH = parseInt(this.polyObj[objTop].style.height) + offsetY;
                this._setHeight(objTop, newH)
            } else {
                var objLeft = (typeof(this._anyExpL[0]) == "object" ? this._anyExpL[0][0] : this._anyExpL[0]);
                var offsetX = this._resX - this._resXStart;
                var newW = parseInt(this.polyObj[objLeft].style.width) + offsetX;
                this._setWidth(objLeft, newW)
            };
            var objs = {};
            var parseData = function(data) {
                for (var a in data) {
                    if (typeof(data[a]) == "object") {
                        parseData(data[a])
                    };
                    objs[data[a]] = true
                }
            };
            parseData(this._anyExpT);
            parseData(this._anyExpB);
            parseData(this._anyExpL);
            parseData(this._anyExpR);
            var ids = new Array();
            for (var a in objs) {
                ids[ids.length] = a
            };
            if (typeof(this._anyExpT) == "object" && this._anyExpT != null) {
                this.updateNestedObjectsArray(this._anyExpT);
                this._anyExpT = null
            };
            if (typeof(this._anyExpB) == "object" && this._anyExpB != null) {
                this.updateNestedObjectsArray(this._anyExpB);
                this._anyExpB = null
            };
            if (typeof(this._anyExpL) == "object" && this._anyExpL != null) {
                this.updateNestedObjectsArray(this._anyExpL);
                this._anyExpL = null
            };
            if (typeof(this._anyExpR) == "object" && this._anyExpR != null) {
                this.updateNestedObjectsArray(this._anyExpR);
                this._anyExpR = null
            };
            this._resObj = null;
            this._resFunc = null;
            this._hideCovers();
            this.callEvent("onPanelResizeFinish", [ids]);
            return
        };
        var poly = new Array();
        if (this._resObj._left != null) {
            for (var q = 0; q < this._resObj._left.length; q++) {
                poly[poly.length] = this._resObj._left[q]
            }
        };
        if (this._resObj._right != null) {
            for (var q = 0; q < this._resObj._right.length; q++) {
                poly[poly.length] = this._resObj._right[q]
            }
        };
        if (this._resObj._top != null) {
            for (var q = 0; q < this._resObj._top.length; q++) {
                poly[poly.length] = this._resObj._top[q]
            }
        };
        if (this._resObj._bottom != null) {
            for (var q = 0; q < this._resObj._bottom.length; q++) {
                poly[poly.length] = this._resObj._bottom[q]
            }
        };
        this._resFunc = null;
        this._resObj = null;
        this._hideCovers();
        var cells = new Array();
        for (var q = 0; q < poly.length; q++) {
            if (typeof(poly[q]) == "object") {
                for (var w = 0; w < poly[q].length; w++) {
                    cells[cells.length] = this.polyObj[poly[q][w]]
                }
            } else {
                cells[cells.length] = this.polyObj[poly[q]]
            }
        };
        for (var q = 0; q < cells.length; q++)
            cells[q].updateNestedObjects();
        this.callEvent("onPanelResizeFinish", [])
    };
    this._showCovers = function() {
        for (var a in this.polyObj) {
            if (this._effects["highlight"] && this._isResizable(a)) {
                this.polyObj[a].showCoverBlocker()
            }
        }
    };
    this._hideCovers = function() {
        for (var a in this.polyObj) {
            this.polyObj[a].hideCoverBlocker()
        }
    };
    this._isResizable = function(pId) {
        var need = false;
        for (var q = 0; q < this._resAreaData.length; q++) {
            need = need || (this._resAreaData[q] == pId)
        };
        return need
    };
    this._collectResAreaData = function(obj) {
        for (var q = 0; q < obj.length; q++) {
            if (typeof(obj[q]) == "string") {
                this._resAreaData[this._resAreaData.length] = obj[q]
            } else if (typeof(obj[q]) == "object") {
                this._collectResAreaData(obj[q])
            }
        }
    };
    this._doOnDoubleClick = function(sep) {
        if (sep._dblClick == null)
            return;
        if (this.polyObj[sep._dblClick] == null)
            return;
        if (this.polyObj[sep._dblClick]._noHeader)
            return;
        var obj = this.polyObj[sep._dblClick];
        if (obj.childNodes[0].style.display == "none")
            return;
        if (obj._collapsed == true) {
            this._doExpand(obj._resize, sep._dblClick, obj._rowData, "hide")
        } else {
            obj._savedW = parseInt(obj.style.width);
            obj._savedH = parseInt(obj.style.height);
            this._doCollapse(obj._resize, sep._dblClick, obj._rowData, "hide")
        };
        return true
    };
    this._doOnSelectStart = function(e) {
        e = e || event;
        if (that._resObj != null)
            e.returnValue = false
    };
    this._doOnMouseMove = function(e) {
        e = e || event;
        if (that._resObj != null && that._resFunc != null)
            that._resFunc(e)
    };
    this._doOnMouseUp = function() {
        that._resizeStop()
    };
    if (_isIE) {
        document.body.attachEvent("onselectstart", that._doOnSelectStart);
        document.body.attachEvent("onmousemove", that._doOnMouseMove);
        document.body.attachEvent("onmouseup", that._doOnMouseUp)
    } else {
        document.body.addEventListener("mousemove", that._doOnMouseMove, false);
        document.body.addEventListener("mouseup", that._doOnMouseUp, false)
    };
    this._doExpand = function(dir, pId, rowData, mode) {
        if (rowData.length <= 1)
            return;
        var ind = -1;
        for (var q = 0; q < rowData.length; q++) {
            if (rowData[q] == pId) {
                ind = q
            }
        };
        if (ind == -1)
            return;
        var anyExp = null;
        for (var q = ind + 1; q < rowData.length; q++) {
            if (anyExp == null) {
                if (typeof(rowData[q]) == "string") {
                    if (this.polyObj[rowData[q]]._collapsed == false) {
                        anyExp = rowData[q]
                    }
                } else {
                    anyExp = rowData[q]
                }
            }
        };
        if (anyExp == null) {
            for (var q = ind - 1; q >= 0; q--) {
                if (anyExp == null) {
                    if (typeof(rowData[q]) == "string") {
                        if (this.polyObj[rowData[q]]._collapsed == false) {
                            anyExp = rowData[q]
                        }
                    } else {
                        anyExp = rowData[q]
                    }
                }
            }
        };
        if (anyExp == null)
            return;
        if (typeof(anyExp) != "object") {
            anyExp = new Array(anyExp)
        };
        if (dir == "hor") {
            var availSpace = parseInt(this.polyObj[anyExp[0]].style.width) - this._minWidth;
            var maxSize = this.polyObj[pId]._savedW;
            if (maxSize > availSpace) {
                maxSize = availSpace
            };
            if (maxSize < this._minWidth)
                return;
            var step = Math.round(maxSize / 3)
        } else {
            var availSpace = parseInt(this.polyObj[anyExp[0]].style.height) - this._minHeight;
            var maxSize = this.polyObj[pId]._savedH;
            if (maxSize > availSpace) {
                maxSize = availSpace
            };
            if (maxSize < this._minHeight)
                return;
            var step = Math.round(maxSize / 3)
        };
        this.polyObj[pId].childNodes[0].childNodes[1].style.display = "";
        this.polyObj[pId].childNodes[0].childNodes[0].className = "dhtmlxPolyInfoBar";
        this.polyObj[pId].childNodes[0].childNodes[0].childNodes[1].style.display = "";
        this.polyObj[pId].childNodes[0].childNodes[0].childNodes[2].style.display = "";
        this.polyObj[pId].childNodes[0].childNodes[0].childNodes[4].style.display = "";
        var obj2 = new Array();
        for (var q = 0; q < anyExp.length; q++) {
            obj2[q] = this.polyObj[anyExp[q]]
        };
        if (this.polyObj[pId].className == "dhtmlxLayoutSinglePolyTabbarCollapsed") {
            this.polyObj[pId].className = "dhtmlxLayoutSinglePolyTabbar"
        };
        this._expandEffect(this.polyObj[pId], obj2, maxSize, mode, (this._effects["collapse"] == true ? step : 1000000), dir)
    };
    this._doCollapse = function(dir, pId, rowData, mode) {
        if (rowData.length <= 1)
            return;
        var ind = -1;
        for (var q = 0; q < rowData.length; q++) {
            if (rowData[q] == pId) {
                ind = q
            }
        };
        if (ind == -1)
            return;
        var anyExp = null;
        for (var q = ind + 1; q < rowData.length; q++) {
            if (anyExp == null) {
                if (typeof(rowData[q]) == "string") {
                    if (this.polyObj[rowData[q]]._collapsed == false) {
                        anyExp = rowData[q]
                    }
                } else {
                    anyExp = rowData[q]
                }
            }
        };
        if (anyExp == null) {
            for (var q = ind - 1; q >= 0; q--) {
                if (anyExp == null) {
                    if (typeof(rowData[q]) == "string") {
                        if (this.polyObj[rowData[q]]._collapsed == false) {
                            anyExp = rowData[q]
                        }
                    } else {
                        anyExp = rowData[q]
                    }
                }
            }
        };
        if (anyExp == null) {
            if (rowData[ind + 1] != null) {
                anyExp = rowData[ind + 1]
            }
        };
        if (anyExp == null) {
            if (ind - 1 >= 0) {
                if (rowData[ind - 1] != null) {
                    anyExp = rowData[ind - 1]
                }
            }
        };
        if (anyExp != null) {
            if (typeof(anyExp) != "object") {
                if (this.polyObj[anyExp]._collapsed == true) {
                    this.polyObj[anyExp].childNodes[0].childNodes[1].style.display = "";
                    this.polyObj[anyExp]._collapsed = false;
                    this.polyObj[anyExp].childNodes[0].childNodes[0].className = "dhtmlxPolyInfoBar";
                    this.polyObj[anyExp].childNodes[0].childNodes[0].childNodes[1].style.display = "";
                    this.polyObj[anyExp].childNodes[0].childNodes[0].childNodes[4].title = "Collapse";
                    this.polyObj[anyExp].childNodes[0].childNodes[0].childNodes[2].style.display = "";
                    this.polyObj[anyExp].childNodes[0].childNodes[0].childNodes[3].style.display = "none";
                    this.polyObj[anyExp].childNodes[0].childNodes[0].childNodes[4].style.display = "";
                    if (this.polyObj[anyExp]._isUnDocked === true) {
                        this.dockWindow(anyExp)
                    };
                    if (this.polyObj[anyExp].className == "dhtmlxLayoutSinglePolyTabbarCollapsed") {
                        this.polyObj[anyExp].className = "dhtmlxLayoutSinglePolyTabbar"
                    };
                    this._fixSplitters();
                    this._fixIcons();
                    this.callEvent("onExpand", [anyExp])
                };
                anyExp = new Array(anyExp)
            };
            var obj2 = new Array();
            for (var q = 0; q < anyExp.length; q++) {
                obj2[q] = this.polyObj[anyExp[q]]
            };
            if (dir == "hor") {
                var step = Math.round(Math.max(this.polyObj[pId].offsetWidth, this.polyObj[anyExp[0]].offsetWidth) / 3)
            } else {
                var step = Math.round(Math.max(this.polyObj[pId].offsetHeight, this.polyObj[anyExp[0]].offsetHeight) / 3)
            };
            this.polyObj[pId].childNodes[0].childNodes[1].style.display = "none";
            this._collapseEffect(this.polyObj[pId], obj2, mode, (this._effects["collapse"] == true ? step : 1000000), dir)
        }
    };
    this.setEffect = function(efName, efValue) {
        if (this._effects[efName] != null && typeof(efValue) == "boolean") {
            this._effects[efName] = efValue
        }
    };
    this.getEffect = function(efName) {
        if (this._effects[efName] != null) {
            return this._effects[efName]
        };
        return null
    };
    this._expandEffect = function(obj, obj2, maxSize, mode, step, dir) {
        if (dir == "hor") {
            var s = parseInt(obj.style.width);
            var s2 = parseInt(obj2[0].style.width)
        } else {
            var s = parseInt(obj.style.height);
            var s2 = parseInt(obj2[0].style.height)
        };
        var newS = s + step;
        if (newS > maxSize) {
            newS = maxSize
        };
        if (dir == "hor") {
            obj.style.width = newS + "px";
            obj.childNodes[0].style.width = obj.style.width
        } else {
            obj.style.height = newS + "px";
            obj.childNodes[0].style.height = obj.style.height
        };
        obj.adjustContent(obj.childNodes[0], (obj._noHeader ? 0 : this.skinParams[this.skin]["cpanel_height"]));
        for (var q = 0; q < obj2.length; q++) {
            if (dir == "hor") {
                obj2[q].style.width = s2 + s - newS + "px";
                obj2[q].childNodes[0].style.width = obj2[q].style.width
            } else {
                obj2[q].style.height = s2 + s - newS + "px";
                obj2[q].childNodes[0].style.height = obj2[q].style.height
            };
            obj2[q].adjustContent(obj2[q].childNodes[0], (obj2[q]._noHeader ? 0 : this.skinParams[this.skin]["cpanel_height"]))
        };
        if (newS != maxSize) {
            window.setTimeout(function() {
                        that._expandEffect(obj, obj2, maxSize, mode, step, dir)
                    }, 4)
        } else {
            obj._collapsed = false;
            for (var q = 0; q < obj2.length; q++) {
                obj2[q].updateNestedObjects()
            };
            this.polyObj[obj._idd].updateNestedObjects();
            this.polyObj[obj._idd].childNodes[0].childNodes[0].childNodes[4].title = "Collapse";
            this._fixSplitters();
            this._fixIcons();
            this.callEvent("onExpand", [obj._idd])
        }
    };
    this._collapseEffect = function(obj, obj2, mode, step, dir) {
        if (dir == "hor") {
            var s = parseInt(obj.style.width);
            var s2 = parseInt(obj2[0].style.width)
        } else {
            var s = parseInt(obj.style.height);
            var s2 = parseInt(obj2[0].style.height)
        };
        var newS = s - step;
        if (dir == "hor") {
            if (newS < this._collapsedW) {
                newS = this._collapsedW
            };
            obj.style.width = newS + "px";
            obj.childNodes[0].style.width = obj.style.width
        } else {
            if (newS < this._collapsedH) {
                newS = this._collapsedH
            };
            obj.style.height = newS + "px";
            obj.childNodes[0].style.height = obj.style.height
        };
        for (var q = 0; q < obj2.length; q++) {
            if (dir == "hor") {
                obj2[q].style.width = s2 + (s - newS) + "px";
                obj2[q].childNodes[0].style.width = obj2[q].style.width
            } else {
                obj2[q].style.height = s2 + (s - newS) + "px";
                obj2[q].childNodes[0].style.height = obj2[q].style.height
            };
            obj2[q].adjustContent(obj2[q].childNodes[0], (obj2[q]._noHeader ? 0 : this.skinParams[this.skin]["cpanel_height"]))
        };
        if ((newS > this._collapsedW && dir == "hor") || (newS > this._collapsedH && dir == "ver")) {
            window.setTimeout(function() {
                        that._collapseEffect(obj, obj2, mode, step, dir)
                    }, 4)
        } else {
            for (var q = 0; q < obj2.length; q++) {
                if (dir == "hor") {
                    obj2[q].style.width = s2 + (s - newS) + "px";
                    obj2[q].childNodes[0].style.width = obj2[q].style.width
                } else {
                    obj2[q].style.height = s2 + (s - newS) + "px";
                    obj2[q].childNodes[0].style.height = obj2[q].style.height
                };
                obj2[q].adjustContent(obj2[q].childNodes[0], (obj2[q]._noHeader ? 0 : this.skinParams[this.skin]["cpanel_height"]))
            };
            obj._collapsed = true;
            if (dir == "hor") {
                obj.childNodes[0].childNodes[0].className = "dhtmlxPolyInfoBarCollapsedVer"
            } else {
                obj.childNodes[0].childNodes[0].className = "dhtmlxPolyInfoBarCollapsedHor"
            };
            for (var q = 0; q < obj2.length; q++) {
                obj2[q].updateNestedObjects()
            };
            if (mode == "hide") {
                obj.childNodes[0].childNodes[0].childNodes[1].style.display = "";
                obj.childNodes[0].childNodes[0].childNodes[2].style.display = "none";
                obj.childNodes[0].childNodes[0].childNodes[3].style.display = "none";
                obj.childNodes[0].childNodes[0].childNodes[4].style.display = ""
            } else {
                obj.childNodes[0].childNodes[0].childNodes[1].style.display = "";
                obj.childNodes[0].childNodes[0].childNodes[2].style.display = "";
                obj.childNodes[0].childNodes[0].childNodes[3].style.display = "none";
                obj.childNodes[0].childNodes[0].childNodes[4].style.display = "none"
            };
            if (obj.className == "dhtmlxLayoutSinglePolyTabbar") {
                obj.className = "dhtmlxLayoutSinglePolyTabbarCollapsed"
            };
            this.polyObj[obj._idd].childNodes[0].childNodes[0].childNodes[4].title = "Expand";
            this._fixSplitters();
            this._fixIcons();
            this.callEvent("onCollapse", [obj._idd])
        }
    };
    this._setW = function(cellObj, w) {
        cellObj.style.width = w + "px";
        cellObj.childNodes[0].style.width = cellObj.style.width;
        cellObj.adjustContent(cellObj.childNodes[0], (cellObj._noHeader ? 0 : this.skinParams[this.skin]["cpanel_height"]))
    };
    this._setH = function(cellObj, h) {
        cellObj.style.height = h + "px";
        cellObj.childNodes[0].style.height = cellObj.style.height;
        cellObj.adjustContent(cellObj.childNodes[0], (cellObj._noHeader ? 0 : this.skinParams[this.skin]["cpanel_height"]))
    };
    this._setWidth = function(pId, width) {
        if (this.polyObj[pId] == null)
            return;
        if (!Number(width))
            return;
        var sep = null;
        for (var q = 0; q < this.sepVer.length; q++) {
            var p = this.sepVer[q]._left;
            if (p[p.length - 1] == pId) {
                sep = new Array(this.sepVer[q], "left")
            } else if (typeof(p[p.length - 1]) == "object") {
                var k = p[p.length - 1];
                for (var e = 0; e < k.length; e++) {
                    if (k[e] == pId) {
                        sep = new Array(this.sepVer[q], "left")
                    }
                }
            };
            var p = this.sepVer[q]._right;
            if (p[0] == pId) {
                sep = new Array(this.sepVer[q], "right")
            } else if (typeof(p[0]) == "object") {
                var k = p[0];
                for (var e = 0; e < k.length; e++) {
                    if (k[e] == pId) {
                        sep = new Array(this.sepVer[q], "right")
                    }
                }
            }
        };
        if (sep != null) {
            var set = this._findDockCellsVer(sep[0]);
            var anyExpL = set[0];
            var anyExpR = set[1];
            if (anyExpL == null || anyExpR == null)
                return;
            var sumSize = parseInt(this.polyObj[anyExpL[0]].style.width) + parseInt(this.polyObj[anyExpR[0]].style.width);
            if (width < this._minWidth) {
                width = this._minWidth
            } else if (width > sumSize - this._minWidth) {
                width = sumSize - this._minWidth
            };
            var width2 = sumSize - width;
            for (var q = 0; q < anyExpL.length; q++) {
                this._setW(this.polyObj[anyExpL[q]], (sep[1] == "left" ? width : width2));
                this.polyObj[anyExpL[q]].updateNestedObjects()
            };
            for (var q = 0; q < anyExpR.length; q++) {
                this._setW(this.polyObj[anyExpR[q]], (sep[1] == "right" ? width : width2));
                this.polyObj[anyExpR[q]].updateNestedObjects()
            }
        }
    };
    this._setHeight = function(pId, height) {
        if (this.polyObj[pId] == null)
            return;
        if (!Number(height))
            return;
        var sep = null;
        for (var q = 0; q < this.sepHor.length; q++) {
            var p = this.sepHor[q]._top;
            if (p[p.length - 1] == pId) {
                sep = new Array(this.sepHor[q], "top")
            } else if (typeof(p[p.length - 1]) == "object") {
                var k = p[p.length - 1];
                for (var e = 0; e < k.length; e++) {
                    if (k[e] == pId) {
                        sep = new Array(this.sepHor[q], "top")
                    }
                }
            };
            var p = this.sepHor[q]._bottom;
            if (p[0] == pId) {
                sep = new Array(this.sepHor[q], "bottom")
            } else if (typeof(p[0]) == "object") {
                var k = p[0];
                for (var e = 0; e < k.length; e++) {
                    if (k[e] == pId) {
                        sep = new Array(this.sepHor[q], "bottom")
                    }
                }
            }
        };
        if (sep != null) {
            var set = this._findDockCellsHor(sep[0]);
            var anyExpT = set[0];
            var anyExpB = set[1];
            if (anyExpT == null || anyExpB == null)
                return;
            var sumSize = parseInt(this.polyObj[anyExpT[0]].style.height) + parseInt(this.polyObj[anyExpB[0]].style.height);
            if (height < this._minHeight) {
                height = this._minHeight
            } else if (height > sumSize - this._minHeight) {
                height = sumSize - this._minHeight
            };
            var height2 = sumSize - height;
            for (var q = 0; q < anyExpT.length; q++) {
                this._setH(this.polyObj[anyExpT[q]], (sep[1] == "top" ? height : height2));
                this.polyObj[anyExpT[q]].updateNestedObjects()
            };
            for (var q = 0; q < anyExpB.length; q++) {
                this._setH(this.polyObj[anyExpB[q]], (sep[1] == "bottom" ? height : height2));
                this.polyObj[anyExpB[q]].updateNestedObjects()
            }
        }
    };
    this.updateNestedObjectsArray = function(obj) {
        for (var q = 0; q < obj.length; q++) {
            if (typeof(obj[q]) == "object") {
                this.updateNestedObjectsArray(obj[q])
            } else {
                this.polyObj[obj[q]].updateNestedObjects()
            }
        }
    };
    this.dockWindow = function(id) {
        if (!this.dhxWins)
            return;
        if (!this.dhxWins.window(this.dhxWinsIdPrefix + id))
            return;
        this.dhxWins.window(this.dhxWinsIdPrefix + id).close();
        this.dhxWins.window(this.dhxWinsIdPrefix + id).moveContentTo(this.polyObj[id]);
        this.polyObj[id]._isUnDocked = false;
        this.callEvent("onDock", [id])
    };
    this.unDockWindow = function(id) {
        this._initWindows(id);
        this.polyObj[id].moveContentTo(this.dhxWins.window(this.dhxWinsIdPrefix + id));
        this.polyObj[id]._isUnDocked = true;
        this.callEvent("onUnDock", [id])
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
            w1.setText(this.polyObj[id].getText());
            w1.button("close").hide();
            w1.attachEvent("onClose", function(win) {
                        win.hide()
                    });
            w1.addUserButton("dock", 99, "Dock", "dock");
            w1.button("dock").attachEvent("onClick", function(win) {
                        self.polyObj[id].dock()
                    });
            w1.dockedCell = this.polyObj[id]
        } else {
            this.dhxWins.window(idd).show()
        }
    };
    this.isPanelVisible = function(pId) {
        return (!this.polyObj[pId]._noHeader)
    };
    this.showPanel = function(pId) {
        if (this.polyObj[pId] == null)
            return;
        if (this.polyObj[pId]._collapsed == true)
            return;
        var bar = this.polyObj[pId].childNodes[0].childNodes[0];
        if (bar._tabbarMode == -2) {
            this.dhxWins.window(bar._win).tabbar._tabZone.style.display = '';
            this.dhxWins.window(bar._win).tabbar.adjustOuterSize();
            return bar._tabbarMode = -1
        };
        if (bar._tabbarMode == -1)
            return;
        bar.style.display = "";
        this.polyObj[pId]._noHeader = false;
        this.polyObj[pId].adjustContent(this.polyObj[pId].childNodes[0], this.skinParams[this.skin]["cpanel_height"]);
        this.polyObj[pId].updateNestedObjects()
    };
    this.hidePanel = function(pId) {
        if (this.polyObj[pId] == null)
            return;
        if (this.polyObj[pId]._collapsed == true)
            return;
        var bar = this.polyObj[pId].childNodes[0].childNodes[0];
        if (typeof bar._tabbarMode == "undefined") {
            bar.style.display = "none"
        } else {
            if (bar._tabbarMode === true) {
                this.polyObj[pId].childNodes[1].style.position = "absolute";
                bar._tabbarMode = -1
            } else if (bar._tabbarMode == -1) {
                this.dhxWins.window(bar._win).tabbar._tabZone.style.display = 'none';
                this.dhxWins.window(bar._win).tabbar.adjustOuterSize();
                bar._tabbarMode = -2
            }
        };
        this.polyObj[pId]._noHeader = true;
        this.polyObj[pId].adjustContent(this.polyObj[pId].childNodes[0], 0);
        this.polyObj[pId].updateNestedObjects()
    };
    this.setText = function(pId, text) {
        this._changeCPanelText(pId, text)
    };
    this.getText = function(pId) {
        return this.polyObj[pId].childNodes[0].childNodes[0].childNodes[0].innerHTML
    };
    this._changeCPanelText = function(pId, text) {
        var layout = that;
        if (layout.polyObj[pId] == null)
            return;
        layout.polyObj[pId].childNodes[0].childNodes[0].childNodes[0].innerHTML = text;
        if (that.dhxWins != null) {
            if (that.dhxWins.window(that.dhxWinsIdPrefix + pId) != null) {
                that.dhxWins.window(that.dhxWinsIdPrefix + pId).setText(text)
            }
        }
    };
    this.forEachItem = function(handler) {
        for (var q = 0; q < this.items.length; q++) {
            handler(this.items[q])
        }
    };
    this._fixPositionInWin = function(w, h) {
        this.base.style.width = w + "px";
        this.base.style.height = h + "px"
    };
    this.attachMenu = function() {
        if (this.base._isWindow) {
            this.menu = this.base._window.attachMenu()
        } else {
            this.cont.obj.skin = this.skin;
            this.menu = this.cont.obj.attachMenu();
            this.cont.obj.adjustContent(this.cont.obj, 0);
            this.setSizes()
        };
        return this.menu
    };
    this.detachMenu = function() {
        if (!this.menu)
            return;
        this.cont.obj.detachMenu();
        this.setSizes();
        this.menu = null
    };
    this.showMenu = function() {
        if (!this.menu)
            return;
        this.cont.obj.showMenu();
        this.setSizes()
    };
    this.hideMenu = function() {
        if (!this.menu)
            return;
        this.cont.obj.hideMenu();
        this.setSizes()
    };
    this.attachToolbar = function() {
        if (this.base._isWindow) {
            this.toolbar = this.base._window.attachToolbar()
        } else {
            this.cont.obj.skin = this.skin;
            this.toolbar = this.cont.obj.attachToolbar();
            this.cont.obj.adjustContent(this.cont.obj, 0);
            this.setSizes()
        };
        return this.toolbar
    };
    this.detachToolbar = function() {
        if (!this.toolbar)
            return;
        this.cont.obj.detachToolbar();
        this.setSizes();
        this.toolbar = null
    };
    this.showToolbar = function() {
        if (!this.toolbar)
            return;
        this.cont.obj.showToolbar();
        this.setSizes()
    };
    this.hideToolbar = function() {
        if (!this.toolbar)
            return;
        this.cont.obj.hideToolbar();
        this.setSizes()
    };
    this.attachStatusBar = function() {
        if (this.base._isWindow) {
            this.statusbar = this.base._window.attachStatusBar()
        } else {
            this.statusbar = this.cont.obj.attachStatusBar();
            this.cont.obj.adjustContent(this.cont.obj, 0);
            this.setSizes()
        };
        return this.statusbar
    };
    this.detachStatusBar = function() {
        if (!this.sb)
            return;
        this.cont.obj.detachStatusBar();
        this.setSizes();
        this.sb = null
    };
    this.showStatusBar = function() {
        if (!this.sb)
            return;
        this.cont.obj.showStatusBar();
        this.setSizes()
    };
    this.hideStatusBar = function() {
        if (!this.sb)
            return;
        this.cont.obj.hideStatusBar();
        this.setSizes()
    };
    this.progressOn = function() {
        this._progressControlGlobal(true)
    };
    this.progressOff = function() {
        this._progressControlGlobal(false)
    };
    this._progressControl = function(id, state) {
        if (this.polyObj[id] == null)
            return;
        if (this.polyObj[id]._progressCover == null) {
            var p1 = document.createElement("DIV");
            p1.className = "dhtmlxLayoutPolyProgress";
            this.polyObj[id].childNodes[0].appendChild(p1);
            var p2 = document.createElement("DIV");
            p2.className = "dhtmlxLayoutPolyProgressBGIMG";
            this.polyObj[id].childNodes[0].appendChild(p2);
            this.polyObj[id]._progressCover = new Array(p1, p2)
        };
        this.polyObj[id]._progressCover[0].style.display = (state == true ? "" : "none");
        this.polyObj[id]._progressCover[1].style.display = this.polyObj[id]._progressCover[0].style.display
    };
    this._progressControlGlobal = function(state) {
        if (this._progressCover == null) {
            var p1 = document.createElement("DIV");
            p1.className = "dhtmlxLayoutPolyProgressGlobal_" + this.skin;
            this.obj.appendChild(p1);
            var p2 = document.createElement("DIV");
            p2.className = "dhtmlxLayoutPolyProgressBGIMGGlobal_" + this.skin;
            this.obj.appendChild(p2);
            this._progressCover = new Array(p1, p2)
        };
        this._progressCover[0].style.display = (state == true ? "" : "none");
        this._progressCover[1].style.display = this._progressCover[0].style.display
    };
    this._fixSize = function(pId, width, height) {
        if (this.polyObj[pId] == null)
            return;
        this.polyObj[pId]._isBlockedWidth = width;
        this.polyObj[pId]._isBlockedHeight = height;
        this._fixSplitters()
    };
    this._fixSplitters = function() {
        for (var q = 0; q < this.sepVer.length; q++) {
            var data = this._findDockCellsVer(this.sepVer[q]);
            if (data[0] == null || data[1] == null) {
                if (this.sepVer[q].className != "dhtmlxLayoutPolySplitterVerInactive") {
                    this.sepVer[q].className = "dhtmlxLayoutPolySplitterVerInactive"
                }
            } else {
                if (this.sepVer[q].className != "dhtmlxLayoutPolySplitterVer") {
                    this.sepVer[q].className = "dhtmlxLayoutPolySplitterVer"
                }
            }
        };
        for (var q = 0; q < this.sepHor.length; q++) {
            var data = this._findDockCellsHor(this.sepHor[q]);
            if (data[0] == null || data[1] == null) {
                if (this.sepHor[q].className != "dhtmlxLayoutPolySplitterHorInactive") {
                    this.sepHor[q].className = "dhtmlxLayoutPolySplitterHorInactive"
                }
            } else {
                if (this.sepHor[q].className != "dhtmlxLayoutPolySplitterHor") {
                    this.sepHor[q].className = "dhtmlxLayoutPolySplitterHor"
                }
            }
        }
    };
    this._fixIcons = function() {
        for (var a in this.polyObj) {
            var data = this.polyObj[a]._rowData;
            var cps = this.polyObj[a]._collapsed;
            var idx = -1;
            for (var q = 0; q < data.length; q++) {
                if (typeof(data[q]) == "object") {
                } else {
                    if (data[q] == a) {
                        idx = q
                    }
                }
            };
            var newIcon = null;
            if (idx != -1) {
                for (var q = idx + 1; q < data.length; q++) {
                    if (typeof(data[q]) == "object") {
                        newIcon = (this.polyObj[a]._resize == "ver" ? (cps ? "b" : "t") : (cps ? "r" : "l"))
                    } else if (this.polyObj[data[q]]._collapsed == false) {
                        newIcon = (this.polyObj[a]._resize == "ver" ? (cps ? "b" : "t") : (cps ? "r" : "l"))
                    }
                };
                if (newIcon == null && idx >= 1) {
                    for (var q = idx - 1; q >= 0; q--) {
                        if (typeof(data[q]) == "object") {
                            newIcon = (this.polyObj[a]._resize == "ver" ? (cps ? "t" : "b") : (cps ? "l" : "r"))
                        } else if (this.polyObj[data[q]]._collapsed == false) {
                            newIcon = (this.polyObj[a]._resize == "ver" ? (cps ? "t" : "b") : (cps ? "l" : "r"))
                        }
                    }
                }
            };
            if (newIcon != null) {
                var dir = this.polyObj[a]._resize;
                this.polyObj[a].childNodes[0].childNodes[0].childNodes[4].className = "dhtmlxInfoButtonShowHide_" + dir + " dhxLayoutButton_" + this.skin + "_" + dir + (this.polyObj[a]._collapsed ? "2" : "1") + newIcon
            }
        }
    };
    this._defineWindowMinDimension = function(win, inLayout) {
        if (inLayout == true) {
            var dim = new Array();
            dim[0] = parseInt(win.style.width);
            dim[1] = parseInt(win.style.height)
        } else {
            var dim = win.getDimension();
            if (dim[0] == "100%") {
                dim[0] = win.offsetWidth
            };
            if (dim[1] == "100%") {
                dim[1] = win.offsetHeight
            }
        };
        var hor = that._getNearestParents("hor");
        var ver = that._getNearestParents("ver");
        if (!inLayout) {
            var resH = new Array();
            var resV = new Array();
            for (var a in hor) {
                resH[resH.length] = a
            };
            for (var a in ver) {
                resV[resV.length] = a
            };
            that._checkAlterMinSize(new Array(resH, resV));
            var hor2 = {};
            var ver2 = {};
            for (var q = 0; q < that._alterSizes.length; q++) {
                var a = that._alterSizes[q][0];
                var w = that._alterSizes[q][1];
                var h = that._alterSizes[q][2];
                if (hor2[a] == null) {
                    hor2[a] = w
                } else {
                    if (w > hor2[a]) {
                        hor2[a] = w
                    }
                };
                if (ver2[a] == null) {
                    ver2[a] = h
                } else {
                    if (h > ver2[a]) {
                        ver2[a] = h
                    }
                }
            };
            for (var a in hor) {
                if (hor2[a] != null) {
                    hor[a] = hor[a] - hor2[a] + that._minWidth
                }
            };
            for (var a in ver) {
                if (ver2[a] != null) {
                    ver[a] = ver[a] - ver2[a] + that._minHeight - (that.polyObj[a].childNodes[0].style.display != "none" ? that.skinParams[that.skin]["cpanel_height"] : 0)
                }
            }
        };
        var minWidth = 65536;
        for (var a in hor) {
            if (hor[a] < minWidth) {
                minWidth = hor[a]
            }
        };
        minWidth = minWidth - that._minWidth;
        minWidth = dim[0] - minWidth;
        if (minWidth < that._dimension[0] && !inLayout) {
            minWidth = that._dimension[0]
        };
        var minHeight = 65536;
        for (var a in ver) {
            if (ver[a] < minHeight) {
                minHeight = ver[a]
            }
        };
        minHeight = minHeight - that._minHeight;
        minHeight = dim[1] - minHeight;
        if (minHeight < that._dimension[1] && !inLayout) {
            minHeight = that._dimension[1]
        };
        if (inLayout == true) {
            return new Array("", minWidth, minHeight)
        } else {
            win.setMinDimension(minWidth, minHeight)
        }
    };
    this._getNearestParents = function(resize) {
        var data = (resize == "hor" ? this._autoHor : this._autoVer);
        var pool = {};
        for (var q = 0; q < data.length; q++) {
            var id = data[q];
            if (this.polyObj[id]._collapsed == true && this.polyObj[id]._resize == resize) {
                var rowData = this.polyObj[id]._rowData;
                var e = -1;
                for (var w = 0; w < rowData.length; w++) {
                    if (typeof(rowData[w]) == "object") {
                        e = w
                    } else {
                        if (rowData[w] == id)
                            e = w
                    }
                };
                var r = e;
                id = null;
                if (e > 0) {
                    for (var w = e - 1; w >= 0; w--) {
                        if (typeof(rowData[w]) == "object") {
                            id = rowData[w]
                        } else {
                            if (this.polyObj[rowData[w]]._collapsed == false && id == null) {
                                id = rowData[w]
                            }
                        }
                    }
                };
                if (id == null) {
                    for (var w = r; w < rowData.length; w++) {
                        if (typeof(rowData[w]) == "object") {
                            id = rowData[w]
                        } else {
                            if (this.polyObj[rowData[w]]._collapsed == false && id == null) {
                                id = rowData[w]
                            }
                        }
                    }
                }
            };
            if (id != null) {
                if (typeof(id) == "string") {
                    id = new Array(id)
                };
                for (var w = 0; w < id.length; w++) {
                    pool[id[w]] = parseInt(resize == "hor" ? this.polyObj[id[w]].style.width : this.polyObj[id[w]].style.height)
                }
            }
        };
        return pool
    };
    this.setSizes = function(skipAdjust) {
        if (this.cont && skipAdjust !== false)
            this.cont.obj.adjustContent(this.cont.obj, this._mTop, null, null, this._mBottom);
        var xw = this.base.offsetParent.offsetWidth - this.base.offsetWidth + (this._baseWFix != null ? this._baseWFix : 0);
        var xh = this.base.offsetParent.offsetHeight - this.base.offsetHeight + (this._baseHFix != null ? this._baseHFix : 0);
        this.base.style.width = parseInt(this.base.style.width) + xw + "px";
        this.base.style.height = parseInt(this.base.style.height) + xh + "px";
        var both = {};
        for (var a in this._getNearestParents("hor")) {
            this.polyObj[a].style.width = Math.max(0, parseInt(this.polyObj[a].style.width) + xw) + "px";
            this.polyObj[a].childNodes[0].style.width = this.polyObj[a].style.width;
            both[a] = 1
        };
        for (var a in this._getNearestParents("ver")) {
            this.polyObj[a].style.height = Math.max(0, parseInt(this.polyObj[a].style.height) + xh) + "px";
            this.polyObj[a].childNodes[0].style.height = this.polyObj[a].style.height;
            both[a] = 1
        };
        for (var a in both) {
            this.polyObj[a].adjustContent(this.polyObj[a].childNodes[0], (this.polyObj[a]._noHeader ? 0 : this.skinParams[this.skin]["cpanel_height"]));
            this.polyObj[a].updateNestedObjects()
        };
        return
    };
    dhtmlxEventable(this);
    this._init()
};
dhtmlXLayoutObject.prototype.unload = function(removeParent) {
    for (var a in this.polyObj) {
        var p = this.polyObj[a];
        p._isCell = null;
        p.skin = null;
        p.getId = null;
        p.getIndex = null;
        p.showHeader = null;
        p.hideHeader = null;
        p.isHeaderVisible = null;
        p.setText = null;
        p.getText = null;
        p.expand = null;
        p.collapse = null;
        p.isCollapsed = null;
        p.dock = null;
        p.undock = null;
        p.setWidth = null;
        p.getWidth = null;
        p.setHeight = null;
        p.getHeight = null;
        p.fixSize = null;
        p.progressOn = null;
        p.progressOff = null;
        p._doOnAttachMenu = null;
        p._doOnAttachToolbar = null;
        p._doOnAttachStatusBar = null;
        p._collapsed = null;
        p._idd = null;
        p._ind = null;
        p._rowData = null;
        p.ondblclick = null;
        var bar = p.childNodes[0].childNodes[0];
        bar.className = "";
        bar._dockCell = null;
        bar._resize = null;
        bar._h = null;
        bar.ondblclick = null;
        bar.childNodes[4].onclick = null;
        for (var r = 0; r < bar.childNodes.length; r++)
            bar.childNodes[r].onselectstart = null;
        while (bar.childNodes.length > 0)
            bar.removeChild(bar.childNodes[0]);
        bar.parentNode.removeChild(bar);
        p._dhxContDestruct();
        p._dhxContDestruct = null;
        p.childNodes[0].removeChild(p.childNodes[0].childNodes[0]);
        p.removeChild(p.childNodes[0]);
        p.parentNode.removeChild(p);
        p = null
    };
    for (var a in this.polyObj)
        this.polyObj[a] = null;
    for (var q = 0; q < this.items.length; q++)
        this.items[q] = null;
    this.polyObj = null;
    this.items = null;
    var t = this.tpl.childNodes[0];
    while (t.childNodes.length > 0) {
        while (t.childNodes[0].childNodes.length > 0) {
            var r = t.childNodes[0].childNodes[0];
            r._top = null;
            r._bottom = null;
            r._left = null;
            r._right = null;
            r._dblClick = null;
            r._isSep = null;
            r._dir = null;
            r.ondblclick = null;
            r.onmousedown = null;
            r.onmouseup = null;
            r.onselectstart = null;
            while (r.childNodes.length > 0)
                r.removeChild(r.childNodes[0]);
            r.parentNode.removeChild(r);
            r = null
        };
        t.removeChild(t.childNodes[0])
    };
    t.parentNode.removeChild(t);
    t = null;
    this.tpl.parentNode.removeChild(this.tpl);
    this.tpl = null;
    for (var a in this.sepHor)
        this.sepHor[a] = null;
    for (var a in this.sepVer)
        this.sepVer[a] = null;
    this.sepHor = null;
    this.sepVer = null;
    this._autoHor = null;
    this._autoVer = null;
    this._availAutoSize = null;
    this._dimension = null;
    this._effects = null;
    this._layoutView = null;
    this._mBottom = null;
    this._mTop = null;
    this._minWidth = null;
    this._minHeight = null;
    this._resFunc = null;
    this._resObj = null;
    this._resX = null;
    this._resY = null;
    this._rowsRatio = null;
    this._totalCols = null;
    this._totalRows = null;
    this._xmlLoader = null;
    this.w = null;
    this.h = null;
    this.imagePath = null;
    this.skin = null;
    this.skinParams = null;
    this.tplData = null;
    this.tplSizes = null;
    if (this.menu)
        this.menu.unload();
    if (this.toolbar)
        this.toolbar.unload();
    if (this.statusbar)
        this.statusbar.unload();
    this.menu = null;
    this.toolbar = null;
    this.statusbar = null;
    if (this.sizer.parentNode)
        this.sizer.parentNode.removeChild(this.sizer);
    this.sizer = null;
    this._alterSizes = null;
    this._attachSizer = null;
    this._buildSurface = null;
    this._changeCPanelText = null;
    this._checkAlterMinSize = null;
    this._collapse = null;
    this._collapseEffect = null;
    this._collectResAreaData = null;
    this._defineWindowMinDimension = null;
    this._doCollapse = null;
    this._doExpand = null;
    this._expand = null;
    this._expandEffect = null;
    this._findDockCellsHor = null;
    this._findDockCellsVer = null;
    this._fixIcons = null;
    this._fixPositionInWin = null;
    this._fixSize = null;
    this._fixSplitters = null;
    this._getNearestParents = null;
    this._hideCovers = null;
    this._init = null;
    this._initWindows = null;
    this._isCollapsed = null;
    this._isResizable = null;
    this._progressControl = null;
    this._progressControlGlobal = null;
    this._resizeHor = null;
    this._resizeStop = null;
    this._resizeVer = null;
    this._resAreaData = null;
    this._setH = null;
    this._setHeight = null;
    this._setW = null;
    this._setWidth = null;
    this._showCovers = null;
    this._xmlParser = null;
    this.attachEvent = null;
    this.attachMenu = null;
    this.attachStatusBar = null;
    this.attachToolbar = null;
    this.callEvent = null;
    this.cells = null;
    this.checkEvent = null;
    this.detachEvent = null;
    this.dockWindow = null;
    this.eventCatcher = null;
    this.forEachItem = null;
    this.getEffect = null;
    this.getIdByIndex = null;
    this.getIndexById = null;
    this.getText = null;
    this.hidePanel = null;
    this.isPanelVisible = null;
    this.listAutoSizes = null;
    this.listViews = null;
    this.progressOff = null;
    this.progressOn = null;
    this.setAutoSize = null;
    this.setEffect = null;
    this.setImagePath = null;
    this.setSizes = null;
    this.setSkin = null;
    this.setText = null;
    this.showPanel = null;
    this.unDockWindow = null;
    this.unload = null;
    this.updateNestedObjectsArray = null;
    if (this.obj) {
        this.obj.parentNode.removeChild(this.obj);
        this.obj = null
    };
    if (this.base) {
        if (this.base == document.body) {
        } else {
            this.base.parentNode.removeChild(this.base);
            this.base = null
        }
    };
    if (this.cont) {
        this.cont.obj._dhxContDestruct();
        this.cont.obj._dhxContDestruct = null;
        if (this.cont.dhxcont.parentNode)
            this.cont.dhxcont.parentNode.removeChild(this.cont.dhxcont);
        this.cont.dhxcont = null;
        this.cont.setContent = null;
        if (this.cont.obj.parentNode && removeParent === true)
            this.cont.obj.parentNode.removeChild(this.cont.obj);
        this.cont.obj = null;
        this.cont = null
    };
    if (this.dhxWins) {
        this.dhxWins.unload();
        this.dhxWins = null
    };
    if (this._doOnResizeStart) {
        if (_isIE) {
            window.detachEvent("onresize", this._doOnResizeStart)
        } else {
            window.removeEventListener("resize", this._doOnResizeStart, false)
        };
        this._doOnResizeStart = null;
        this._doOnResizeEnd = null;
        this._tmTime = null
    };
    if (_isIE) {
        document.body.detachEvent("onselectstart", this._doOnSelectStart);
        document.body.detachEvent("onmousemove", this._doOnMouseMove);
        document.body.detachEvent("onmouseup", this._doOnMouseUp)
    } else {
        document.body.removeEventListener("mousemove", this._doOnMouseMove, false);
        document.body.removeEventListener("mouseup", this._doOnMouseUp, false)
    };
    this._doOnSelectStart = null;
    this._doOnMouseMove = null;
    this._doOnMouseUp = null;
    that = null
};
dhtmlXLayoutObject.prototype.tplData = {
    "1C" : '<layout><autosize hor="a" ver="a" rows="1" cols="1"/><table data="a"/><row><cell obj="a" wh="1,1" resize="ver" neighbors="a"/></row></layout>',
    "2E" : '<layout><autosize hor="a;b" ver="b" rows="2" cols="1"/><table data="a;b"/><row><cell obj="a" wh="1,2" resize="ver" neighbors="a;b"/></row><row sep="true"><cell sep="hor" top="a" bottom="b" dblclick="a"/></row><row><cell obj="b" wh="1,2" resize="ver" neighbors="a;b"/></row></layout>',
    "2U" : '<layout><autosize hor="b" ver="a;b" rows="1" cols="2"/><table data="a,b"/><row><cell obj="a" wh="2,1" resize="hor" neighbors="a;b"/><cell sep="ver" left="a" right="b"/><cell obj="b" wh="2,1" resize="hor" neighbors="a;b"/></row></layout>',
    "3E" : '<layout><autosize hor="a;b;c" ver="c" rows="3" cols="1"/><table data="a;b;c"/><row><cell obj="a" wh="1,3" resize="ver" neighbors="a;b;c"/></row><row sep="yes"><cell sep="hor" top="a" bottom="b;c" dblclick="a"/></row><row><cell obj="b" wh="1,3" resize="ver" neighbors="a;b;c"/></row><row sep="yes"><cell sep="hor" top="a;b" bottom="c" dblclick="b"/></row><row><cell obj="c" wh="1,3" resize="ver" neighbors="a;b;c"/></row></layout>',
    "3W" : '<layout><autosize hor="c" ver="a;b;c" rows="1" cols="3"/><table data="a,b,c"/><row><cell obj="a" wh="3,1" resize="hor" neighbors="a;b;c"/><cell sep="ver" left="a" right="b;c" dblclick="a"/><cell obj="b" wh="3,1" resize="hor" neighbors="a;b;c"/><cell sep="ver" left="a;b" right="c" dblclick="b"/><cell obj="c" wh="3,1" resize="hor" neighbors="a;b;c"/></row></layout>',
    "3J" : '<layout><autosize hor="b" ver="b;c" rows="2" cols="2"/><table data="a,b;c,b"/><row><cell obj="a" wh="2,2" resize="ver" neighbors="a;c"/><cell sep="ver" left="a,c" right="b" dblclick="b" rowspan="3"/><cell obj="b" wh="2,1" resize="hor" neighbors="a,c;b" rowspan="3"/></row><row sep="yes"><cell sep="hor" top="a" bottom="c" dblclick="a"/></row><row><cell obj="c" wh="2,2" resize="ver" neighbors="a;c"/></row></layout>',
    "3T" : '<layout><autosize hor="a;c" ver="b;c" rows="2" cols="2"/><table data="a,a;b,c"/><row><cell obj="a" wh="1,2" resize="ver" neighbors="a;b,c" colspan="3"/></row><row sep="true"><cell sep="hor" top="a" bottom="b,c" dblclick="a" colspan="3"/></row><row><cell obj="b" wh="2,2" resize="hor" neighbors="b;c"/><cell sep="ver" left="b" right="c" dblclick="b"/><cell obj="c" wh="2,2" resize="hor" neighbors="b;c"/></row></layout>',
    "3L" : '<layout><autosize hor="b;c" ver="a;c" rows="2" cols="2"/><table data="a,b;a,c"/><row><cell obj="a" wh="2,1" resize="hor" neighbors="a;b,c" rowspan="3"/><cell sep="ver" left="a" right="b,c" dblclick="a" rowspan="3"/><cell obj="b" wh="2,2" resize="ver" neighbors="b;c"/></row><row sep="true"><cell sep="hor" top="b" dblclick="b" bottom="c"/></row><row><cell obj="c" wh="b,2" resize="ver" neighbors="b;c"/></row></layout>',
    "3U" : '<layout><autosize hor="b;c" ver="c" rows="2" cols="2"/><table data="a,b;c,c"/><row><cell obj="a" wh="2,2" resize="hor" neighbors="a;b"/><cell sep="ver" left="a" right="b" dblclick="a"/><cell obj="b" wh="2,2" resize="hor" neighbors="a;b"/></row><row sep="true"><cell sep="hor" top="a,b" bottom="c" dblclick="c" colspan="3"/></row><row><cell obj="c" wh="1,2" resize="ver" neighbors="a,b;c" colspan="3"/></row></layout>',
    "4H" : '<layout><autosize hor="d" ver="a;c;d" rows="2" cols="3"/><table data="a,b,d;a,c,d"/><row><cell obj="a" wh="3,1" resize="hor" neighbors="a;b,c;d" rowspan="3"/><cell sep="ver" left="a" right="b,c;d" dblclick="a" rowspan="3"/><cell obj="b" wh="3,2" resize="ver" neighbors="b;c"/><cell sep="ver" left="a;b,c" right="d" dblclick="d" rowspan="3"/><cell obj="d" wh="3,1" resize="hor" neighbors="a;b,c;d" rowspan="3"/></row><row sep="true"><cell sep="hor" top="b" dblclick="b" bottom="c"/></row><row><cell obj="c" wh="3,2" resize="ver" neighbors="b;c"/></row></layout>',
    "4I" : '<layout><autosize hor="a;c;d" ver="d" rows="3" cols="2"/><table data="a,a;b,c;d,d"/><row><cell obj="a" wh="1,3" resize="ver" neighbors="a;b,c;d" colspan="3"/></row><row sep="true"><cell sep="hor" top="a" bottom="b,c;d" dblclick="a" colspan="3"/></row><row><cell obj="b" wh="2,3" resize="hor" neighbors="b;c"/><cell sep="ver" left="b" dblclick="b" right="c"/><cell obj="c" wh="2,3" resize="hor" neighbors="b;c"/></row><row sep="true"><cell sep="hor" top="a;b,c" bottom="d" dblclick="d" colspan="3"/></row><row><cell obj="d" wh="1,3" resize="ver" neighbors="a;b,c;d" colspan="3"/></row></layout>',
    "4T" : '<layout><autosize hor="a;d" ver="b;c;d" rows="2" cols="3"/><table data="a,a,a;b,c,d"/><row><cell obj="a" wh="1,2" resize="ver" neighbors="a;b,c,d" colspan="5"/></row><row sep="true"><cell sep="hor" top="a" bottom="b,c,d" dblclick="a" colspan="5"/></row><row><cell obj="b" wh="3,2" resize="hor" neighbors="b;c;d"/><cell sep="ver" left="b" right="c;d" dblclick="b"/><cell obj="c" wh="3,2" resize="hor" neighbors="b;c;d"/><cell sep="ver" left="b;c" right="d" dblclick="c"/><cell obj="d" wh="3,2" resize="hor" neighbors="b;c;d"/></row></layout>',
    "4U" : '<layout><autosize hor="c;d" ver="d" rows="2" cols="3"/><table data="a,b,c;d,d,d"/><row><cell obj="a" wh="3,2" resize="hor" neighbors="a;b;c"/><cell sep="ver" left="a" right="b;c" dblclick="a"/><cell obj="b" wh="3,2" resize="hor" neighbors="a;b;c"/><cell sep="ver" left="a;b" right="c" dblclick="b"/><cell obj="c" wh="3,2" resize="hor" neighbors="a;b;c"/></row><row sep="true"><cell sep="hor" top="a,b,c" bottom="d" dblclick="d" colspan="5"/></row><row><cell obj="d" wh="1,2" resize="ver" neighbors="a,b,c;d" colspan="5"/></row></layout>',
    "5H" : '<layout><autosize hor="b;c;d" ver="a;c;e" rows="3" cols="3"/><table data="a,b,e;a,c,e;a,d,e"/><row><cell obj="a" wh="3,1" resize="hor" neighbors="a;b,c,d" rowspan="5"/><cell sep="ver" left="a" right="b,c,d;e" dblclick="a" rowspan="5"/><cell obj="b" wh="3,3" resize="ver" neighbors="b;c;d"/><cell sep="ver" left="a;b,c,d" right="e" dblclick="e" rowspan="5"/><cell obj="e" wh="3,1" resize="hor" neighbors="b,c,d;e" rowspan="5"/></row><row sep="true"><cell sep="hor" top="b" dblclick="b" bottom="c;d"/></row><row><cell obj="c" wh="3,3" resize="ver" neighbors="b;c;d"/></row><row sep="true"><cell sep="hor" top="b;c" dblclick="c" bottom="d"/></row><row><cell obj="d" wh="3,3" resize="ver" neighbors="b;c;d"/></row></layout>',
    "5I" : '<layout><autosize hor="a;d;e" ver="e" rows="3" cols="3"/><table data="a,a,a;b,c,d;e,e,e"/><row><cell obj="a" wh="1,3" resize="ver" neighbors="a;b,c,d;e" colspan="5"/></row><row sep="match"><cell sep="hor" top="a" bottom="b,c,d;e" dblclick="a" colspan="5"/></row><row><cell obj="b" wh="3,3" resize="hor" neighbors="b;c;d"/><cell sep="ver" left="b" right="c;d" dblclick="b"/><cell obj="c" wh="3,3" resize="hor" neighbors="b;c;d"/><cell sep="ver" left="b;c" right="d" dblclick="c"/><cell obj="d" wh="3,3" resize="hor" neighbors="b;c;d"/></row><row sep="match"><cell sep="hor" top="a;b,c,d" bottom="e" dblclick="e" colspan="5"/></row><row><cell obj="e" wh="1,3" resize="ver" neighbors="a;b,c,d;e" colspan="5"/></row></layout>',
    "6I" : '<layout><autosize hor="a;e;f" ver="f" rows="3" cols="4"/><table data="a,a,a,a;b,c,d,e;f,f,f,f"/><row><cell obj="a" wh="1,3" resize="ver" neighbors="a;b,c,d,e;f" colspan="7"/></row><row sep="true"><cell sep="hor" top="a" bottom="b,c,d,e;f" dblclick="a" colspan="7"/></row><row><cell obj="b" wh="4,3" resize="hor" neighbors="b;c;d;e"/><cell sep="ver" left="b" right="c;d;e" dblclick="b"/><cell obj="c" wh="4,3" resize="hor" neighbors="b;c;d;e"/><cell sep="ver" left="b;c" right="d;e" dblclick="c"/><cell obj="d" wh="4,3" resize="hor" neighbors="b;c;d;e"/><cell sep="ver" left="b;c;d" right="e" dblclick="d"/><cell obj="e" wh="4,3" resize="hor" neighbors="b;c;d;e"/></row><row sep="true"><cell sep="hor" top="a;b,c,d,e" bottom="f" dblclick="f" colspan="7"/></row><row><cell obj="f" wh="1,3" resize="ver" neighbors="a;b,c,d,e;f" colspan="7"/></row></layout>'
};
dhtmlXLayoutObject.prototype._availAutoSize = {
    "1C_hor" : new Array("a"),
    "1C_ver" : new Array("a"),
    "2E_hor" : new Array("a;b"),
    "2E_ver" : new Array("a", "b"),
    "2U_hor" : new Array("a", "b"),
    "2U_ver" : new Array("a;b"),
    "3E_hor" : new Array("a;b;c"),
    "3E_ver" : new Array("a", "b", "c"),
    "3W_hor" : new Array("a", "b", "c"),
    "3W_ver" : new Array("a;b;c"),
    "3J_hor" : new Array("a;c", "b"),
    "3J_ver" : new Array("a;b", "c;b"),
    "3T_hor" : new Array("a;b", "a;c"),
    "3T_ver" : new Array("a", "b;c"),
    "3L_hor" : new Array("a", "b;c"),
    "3L_ver" : new Array("a;b", "a;c"),
    "3U_hor" : new Array("a;c", "b;c"),
    "3U_ver" : new Array("a;b", "c"),
    "4H_hor" : new Array("a", "b;c", "d"),
    "4H_ver" : new Array("a;b;d", "a;c;d"),
    "4I_hor" : new Array("a;b;d", "a;c;d"),
    "4I_ver" : new Array("a", "b;c", "d"),
    "4T_hor" : new Array("a;b", "a;c", "a;d"),
    "4T_ver" : new Array("a", "b;c;d"),
    "4U_hor" : new Array("a;d", "b;d", "c;d"),
    "4U_ver" : new Array("a;b;c", "d"),
    "5H_hor" : new Array("a", "b;c;d", "e"),
    "5H_ver" : new Array("a;b;e", "a;c;e", "a;d;e"),
    "5I_hor" : new Array("a;b;e", "a;c;e", "a;d;e"),
    "5I_ver" : new Array("a", "b;c;d", "e"),
    "6I_hor" : new Array("a;b;f", "a;c;f", "a;d;f", "a;e;f"),
    "6I_ver" : new Array("a", "b;c;d;e", "f")
};
(function() {
    dhtmlx.extend_api("dhtmlXLayoutObject", {
                _init : function(obj) {
                    return [obj.parent, obj.pattern, obj.skin]
                },
                image_path : "setImagePath",
                effect : "_effect",
                cells : "_cells",
                autosize : "_autosize"
            }, {
                _cells : function(arr) {
                    for (var q = 0; q < arr.length; q++) {
                        var data = arr[q];
                        var cell = this.cells(data.id);
                        if (cell) {
                            if (data.height)
                                cell.setHeight(data.height);
                            if (data.width)
                                cell.setWidth(data.width);
                            if (data.text)
                                cell.setText(data.text);
                            if (data.collapse)
                                cell.collapse();
                            if (data.fix_size)
                                cell.fixSize(data.fix_size[0], data.fix_size[1]);
                            if (data.header === false)
                                cell.hideHeader()
                        }
                    }
                },
                _autosize : function(arr) {
                    this.setAutoSize(arr[0], arr[1])
                },
                _effect : function(data) {
                    if (data.collapse)
                        this.setEffect("collapse", data.collapse);
                    if (data.resize)
                        this.setEffect("resize", data.resize);
                    if (data.highlight)
                        this.setEffect("highlight", data.highlight)
                }
            })
})();