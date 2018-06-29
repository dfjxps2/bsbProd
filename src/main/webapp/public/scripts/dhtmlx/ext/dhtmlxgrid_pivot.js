dhtmlXGridObject.prototype.ZF = function(cont) {
    if (this.VB) {
        if (this.Rj)
            this.Rj.destructor();
        var c = this.VB.parentNode;
        c.innerHTML = "";
        if (c.parentNode == this.entBox)
            this.entBox.removeChild(c);
        this.Rj = this.VU = this.aac = this.VB = null
    }
};
dhtmlXGridObject.prototype.makePivot = function(cont, details) {
    details = details || {};
    this.ZF();
    if (!cont) {
        var cont = document.createElement("DIV");
        cont.style.cssText = "position:absolute;top:0px;left:0px;background-color:white;";
        cont.style.height = this.entBox.offsetHeight + "px";
        cont.style.width = this.entBox.offsetWidth + "px";
        if (this.entBox.style.position != "absolute")
            this.entBox.style.position = "relative";
        this.entBox.appendChild(cont)
    };
    if (typeof(cont) != "object")
        cont = document.getElementById(cont);
    if (details.Gu)
        this.Rk = details.Gu;
    else {
        this.Rk = [];
        for (var i = 0; i < this.hdr.rows[1].cells.length; i++)
            this.Rk.push(this.hdr.rows[1].cells[i][_isIE ? "innerText" : "textContent"])
    };
    var that = this;
    cont.innerHTML = "<table cellspacing='0' cellpadding='0'><tr><td style='width:160px' align='center'></td><td>&nbsp;&nbsp;&nbsp;</td><td></td></tr></table><div></div>";
    var z1 = this.Tg(this.Rk);
    z1.style.width = "80px";
    z1.onchange = function() {
        if (this.value != -1)
            that._pivotS.value = this.value;
        else
            that._pivotS.value = "";
        that.Si();
        that.Vt()
    };
    var z2 = this.Tg(this.Rk);
    z2.onchange = function() {
        if (this.value != -1)
            that._pivotS.x = this.value;
        else
            that._pivotS.x = "";
        that.Si();
        that.hidePivot()
    };
    var z3 = this.Tg(this.Rk);
    z3.onchange = function() {
        if (this.value != -1)
            that._pivotS.y = this.value;
        else
            that._pivotS.y = "";
        that.Si();
        that.hidePivot()
    };
    var z4 = this.Tg(["Sum", "Min", "Max", "Average", "Count"], -1);
    z4.style.width = "70px";
    z4.onchange = function() {
        if (this.value != -1)
            that._pivotS.action = this.value;
        else
            that._pivotS.action = null;
        that.Vt()
    };
    if (details.readonly)
        z1.disabled = z2.disabled = z3.disabled = z4.disabled = true;
    cont.firstChild.rows[0].cells[0].appendChild(z4);
    cont.firstChild.rows[0].cells[0].appendChild(z1);
    cont.firstChild.rows[0].cells[2].appendChild(z2);
    var gr = cont.childNodes[1];
    gr.style.width = cont.offsetWidth + "px";
    gr.style.height = cont.offsetHeight - 20 + "px";
    gr.style.overflow = "hidden";
    this.VB = gr;
    this.VU = [z1, z2, z3, z4];
    this.aax = this.YJ();
    this.aac = [];
    this._pivotS = {
        action : (details.action || "0"),
        value : (typeof details.value != "undefined" ? (details.value || "0") : null),
        x : (typeof details.x != "undefined" ? (details.x || "0") : null),
        y : (typeof details.y != "undefined" ? (details.y || "0") : null)
    };
    z1.value = this._pivotS.value;
    z2.value = this._pivotS.x;
    z3.value = this._pivotS.y;
    z4.value = this._pivotS.action;
    that.Si();
    this.hidePivot()
};
dhtmlXGridObject.prototype.YJ = function() {
    var z = [];
    for (var i = 0; i < this._cCount; i++) {
        var d = [];
        for (var j = 0; j < this.rowsCol.length; j++) {
            if (this.rowsCol[j]._cntr)
                continue;
            d.push(this.cells2(j, i).getValue())
        };
        z.push(d)
    };
    return z
};
dhtmlXGridObject.prototype.hidePivot = function() {
    if (_isIE)
        this.VU[2].removeNode(true);
    if (this.Rj)
        this.Rj.destructor();
    this.Rj = new dhtmlXGridObject(this.VB);
    this.Rj.attachEvent("onBeforeSelect", function() {
                return false
            });
    if (this._pivotS.x) {
        var l = this.UT(this._pivotS.x);
        var s = [160];
        for (var i = 0; i < l.length; i++)
            s.push(100);
        l = [""].concat(l);
        this.Rj.setHeader(l);
        this.Rj.setInitWidths(s.join(","))
    } else {
        this.Rj.setHeader("");
        this.Rj.setInitWidths("160")
    };
    this.Rj.init();
    this.Rj.setEditable(false);
    this.Rj.setSkin(this.entBox.className.replace("gridbox gridbox_", ""));
    var t = this.Rj.hdr.rows[1].cells[0];
    if (t.firstChild && t.firstChild.tagName == "DIV")
        t = t.firstChild;
    t.appendChild(this.VU[2]);
    this.Rj.setSizes();
    if (this._pivotS.y) {
        var l = this.UT(this._pivotS.y);
        for (var i = 0; i < l.length; i++) {
            this.Rj.addRow(this.Rj.uid(), [l[i]], -1)
        }
    } else {
        this.Rj.addRow(1, "not ready", 1)
    };
    this.Vt()
};
dhtmlXGridObject.prototype._pivot_action_0 = function(a, b, c, av, bv, data) {
    var ret = 0;
    var resA = data[a];
    var resB = data[b];
    var resC = data[c];
    for (var i = resA.length - 1; i >= 0; i--)
        if (resA[i] == av && resB[i] == bv)
            ret += parseFloat(resC[i]);
    return ret
};
dhtmlXGridObject.prototype._pivot_action_1 = function(a, b, c, av, bv, data) {
    ret = 9999999999;
    var resA = data[a];
    var resB = data[b];
    var resC = data[c];
    for (var i = resA.length - 1; i >= 0; i--)
        if (resA[i] == av && resB[i] == bv)
            ret = Math.min(parseFloat(resC[i]), ret);
    if (ret == 9999999999)
        ret = "";
    return ret
};
dhtmlXGridObject.prototype._pivot_action_2 = function(a, b, c, av, bv, data) {
    ret = -9999999999;
    var resA = data[a];
    var resB = data[b];
    var resC = data[c];
    for (var i = resA.length - 1; i >= 0; i--)
        if (resA[i] == av && resB[i] == bv)
            ret = Math.max(parseFloat(resC[i]), ret);
    if (ret == -9999999999)
        ret = "";
    return ret
};
dhtmlXGridObject.prototype._pivot_action_3 = function(a, b, c, av, bv, data) {
    var ret = 0;
    var count = 0;
    var resA = data[a];
    var resB = data[b];
    var resC = data[c];
    for (var i = resA.length - 1; i >= 0; i--)
        if (resA[i] == av && resB[i] == bv) {
            ret += parseFloat(resC[i]);
            count++
        };
    return count ? ret / count : ""
};
dhtmlXGridObject.prototype._pivot_action_4 = function(a, b, c, av, bv, data) {
    var ret = 0;
    var count = 0;
    var resA = data[a];
    var resB = data[b];
    var resC = data[c];
    for (var i = resA.length - 1; i >= 0; i--)
        if (resA[i] == av && resB[i] == bv) {
            ret++
        };
    return ret
};
dhtmlXGridObject.prototype.Vt = function() {
    if (!(this._pivotS.x && this._pivotS.y && this._pivotS.value && this._pivotS.action))
        return;
    var action = this["_pivot_action_" + this._pivotS.action];
    var x = this.UT(this._pivotS.x);
    var y = this.UT(this._pivotS.y);
    for (var i = 0; i < x.length; i++) {
        for (var j = 0; j < y.length; j++) {
            this.Rj.cells2(j, i + 1).setValue(Math.round(action(this._pivotS.x, this._pivotS.y, this._pivotS.value, x[i], y[j], this.aax) * 100) / 100)
        }
    }
};
dhtmlXGridObject.prototype.UT = function(col) {
    if (!this.aac[col]) {
        var t = {};
        var a = [];
        for (var i = this.aax[col].length - 1; i >= 0; i--) {
            t[this.aax[col][i]] = true
        };
        for (var n in t)
            if (t[n] === true)
                a.push(n);
        this.aac[col] = a.sort()
    };
    return this.aac[col]
};
dhtmlXGridObject.prototype.TQ = function(z, list, miss, v) {
    if (!miss) {
        miss = {};
        v = -1
    };
    z.innerHTML = "";
    z.options[z.options.length] = new Option("-select-", -1);
    for (var i = 0; i < list.length; i++) {
        if (miss[i] || list[i] === null)
            continue;
        z.options[z.options.length] = new Option(list[i], i)
    };
    z.value = parseInt(v)
};
dhtmlXGridObject.prototype.Si = function() {
    var s = [];
    var v = [];
    for (var i = 0; i < 3; i++) {
        s.push(this.VU[i]);
        v.push(s[i].value)
    };
    var t = this.Yh;
    var m = {};
    m[v[1]] = m[v[2]] = true;
    this.TQ(s[0], this.Rk, m, v[0]);
    m = {};
    m[v[0]] = m[v[2]] = true;
    this.TQ(s[1], this.Rk, m, v[1]);
    m = {};
    m[v[1]] = m[v[0]] = true;
    this.TQ(s[2], this.Rk, m, v[2]);
    this.Yh = t
};
dhtmlXGridObject.prototype.Tg = function(list, miss) {
    var z = document.createElement("SELECT");
    this.TQ(z, list, miss);
    z.style.cssText = "width:150px;height:20px;font-family:Tahoma;font-size:8pt;font-weight:normal;";
    return z
};