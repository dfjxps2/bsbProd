dhtmlXGridObject.prototype.enableAutoSizeSaving = function(name, cookie_param) {
    this.attachEvent("onResizeEnd", function() {
                this.saveSizeToCookie(name, cookie_param)
            })
};
dhtmlXGridObject.prototype.saveOpenStates = function(name, cookie_param) {
    if (!name)
        name = this.entBox.id;
    var t = [];
    this._h2.forEachChild(0, function(el) {
                if (el.state == "minus")
                    t.push(el.id)
            });
    var str = "gridOpen" + (name || "") + "=" + t.join("|") + (cookie_param ? (";" + cookie_param) : "");
    document.cookie = str
};
dhtmlXGridObject.prototype.loadOpenStates = function(name, cookie_param) {
    var val = this.lG(name, "gridOpen");
    if (!val)
        return;
    val = val.split("|");
    for (var i = 0; i < val.length; i++)
        this.openItem(val[i])
};
dhtmlXGridObject.prototype.enableAutoHiddenColumnsSaving = function(name, cookie_param) {
    this.attachEvent("onColumnHidden", function() {
                this.saveHiddenColumnsToCookie(name, cookie_param)
            })
};
dhtmlXGridObject.prototype.enableSortingSaving = function(name, cookie_param) {
    this.attachEvent("onBeforeSorting", function() {
                var that = this;
                window.setTimeout(function() {
                            that.saveSortingToCookie(name, cookie_param)
                        }, 1);
                return true
            })
};
dhtmlXGridObject.prototype.enableOrderSaving = function(name, cookie_param) {
    this.attachEvent("onAfterCMove", function() {
                this.saveOrderToCookie(name, cookie_param);
                this.saveSizeToCookie(name, cookie_param)
            })
};
dhtmlXGridObject.prototype.enableAutoSaving = function(name, cookie_param) {
    this.enableOrderSaving(name, cookie_param);
    this.enableAutoSizeSaving(name, cookie_param);
    this.enableSortingSaving(name, cookie_param)
};
dhtmlXGridObject.prototype.saveSizeToCookie = function(name, cookie_param) {
    if (this.cellWidthType == 'px')
        var z = this.cellWidthPX.join(",");
    else
        var z = this.cellWidthPC.join(",");
    var z2 = (this.initCellWidth || (new Array)).join(",");
    this.jf(name, cookie_param, 0, z);
    this.jf(name, cookie_param, 1, z2)
};
dhtmlXGridObject.prototype.saveHiddenColumnsToCookie = function(name, cookie_param) {
    var hs = [].concat(this._hrrar || []);
    if (this._fake && this._fake._hrrar)
        for (var i = 0; i < this._fake._cCount; i++)
            hs[i] = this._fake._hrrar[i] ? "1" : "";
    this.jf(name, cookie_param, 4, hs.join(",").replace(/display:none;/g, "1"))
};
dhtmlXGridObject.prototype.loadHiddenColumnsFromCookie = function(name) {
    var z = this.VE(name, 4);
    var ar = (z || "").split(",");
    if (ar.length > this._cCount || !z)
        return;
    for (var i = 0; i < ar.length; i++)
        this.setColumnHidden(i, (ar[i] ? true : false))
};
dhtmlXGridObject.prototype.saveSortingToCookie = function(name, cookie_param) {
    this.jf(name, cookie_param, 2, (this.getSortingState() || []).join(","))
};
dhtmlXGridObject.prototype.loadOrderFromCookie = function(name) {
    var z = this.VE(name, 2);
    z = (z || "").split(",");
    if (z.length > 1 && z[0] < this._cCount) {
        this.sortRows(z[0], null, z[1]);
        this.setSortImgState(true, z[0], z[1])
    }
};
dhtmlXGridObject.prototype.saveOrderToCookie = function(name, cookie_param) {
    if (!this._c_order) {
        this._c_order = [];
        var l = this._cCount;
        for (var i = 0; i < l; i++)
            this._c_order[i] = i
    };
    this.jf(name, cookie_param, 3, ((this._c_order || []).slice(0, this._cCount)).join(","))
};
dhtmlXGridObject.prototype.loadSortingFromCookie = function(name) {
    var z = this.VE(name, 3);
    z = (z || "").split(",");
    if (z.length > 1 && z.length <= this._cCount) {
        for (var i = 0; i < z.length; i++)
            if ((!this._c_order && z[i] != i) || (this._c_order && z[i] != this._c_order[i])) {
                var t = z[i];
                if (this._c_order)
                    for (var j = 0; j < this._c_order.length; j++) {
                        if (this._c_order[j] == z[i]) {
                            t = j;
                            break
                        }
                    };
                this.OP(t * 1, i)
            }
    }
};
dhtmlXGridObject.prototype.loadSizeFromCookie = function(name) {
    var z = this.VE(name, 1);
    if (z)
        this.initCellWidth = z.split(",");
    var z = this.VE(name, 0);
    if ((z) && (z.length)) {
        if (!this._fake && this._hrrar)
            for (var i = 0; i < z.length; i++)
                if (this._hrrar[i])
                    z[i] = 0;
        if (this.cellWidthType == 'px')
            this.cellWidthPX = z.split(",");
        else
            this.cellWidthPC = z.split(",")
    };
    this.setSizes();
    return true
};
dhtmlXGridObject.prototype.clearConfigCookie = function(name) {
    if (!name)
        name = this.entBox.id;
    var str = "gridSettings" + name + "=||||";
    document.cookie = str
};
dhtmlXGridObject.prototype.MU = dhtmlXGridObject.prototype.clearConfigCookie;
dhtmlXGridObject.prototype.jf = function(name, cookie_param, pos, value) {
    if (!name)
        name = this.entBox.id;
    var t = this.lG(name);
    t = (t || "||||").split("|");
    t[pos] = value;
    var str = "gridSettings" + name + "=" + t.join("|") + (cookie_param ? (";" + cookie_param) : "");
    document.cookie = str
};
dhtmlXGridObject.prototype.lG = function(name, surname) {
    if (!name)
        name = this.entBox.id;
    name = (surname || "gridSettings") + name;
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
dhtmlXGridObject.prototype.VE = function(name, pos) {
    return ((this.lG(name) || "||||").split("|"))[pos]
};