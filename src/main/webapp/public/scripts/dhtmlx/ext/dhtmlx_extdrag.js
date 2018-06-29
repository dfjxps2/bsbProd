function xQ(sid, tid, sgrid, tgrid) {
    if (sgrid.mytype == "tree")
        var nm = "id";
    else
        var nm = "idd";
    var sid = new Array();
    for (var i = 0; i < sgrid._dragged.length; i++)
        sid[sid.length] = sgrid._dragged[i][nm];
    if ((!this.rv) || (this.rv(sid, tid, sgrid, tgrid)))
        return Do();
    return xV()
};
function xV() {
    window.dhtmlDragAndDrop.dragNode.firstChild.rows[0].cells[0].className = "dragAccessD";
    return false
};
function Do() {
    window.dhtmlDragAndDrop.dragNode.firstChild.rows[0].cells[0].className = "dragAccessA";
    return true
};
try {
    if (_isIE)
        document.execCommand("BackgroundImageCache", false, true)
} catch (e) {
};
if (window.dhtmlXGridObject) {
    dhtmlXGridObject.prototype.rowToDragElement = function() {
        var z = this._dragged.length;
        var out = "";
        if (z == 1)
            out = z + " " + (this.ER || "message");
        else
            out = z + " " + (this.yt || "messages");
        return "<table cellspacing='0' cellpadding='0'><tbody><tr><td class='dragAccessD'>&nbsp</td><td class='dragTextCell'>" + out + "</td></tbody><table>"
    };
    dhtmlXGridObject.prototype._init_point_bd = dhtmlXGridObject.prototype._init_point;
    dhtmlXGridObject.prototype._init_point = function() {
        this.attachEvent("onDragIn", xQ);
        if (this._init_point_bd)
            this._init_point_bd()
    };
    dhtmlXGridObject.prototype.setDragText = function(single, plural) {
        this.ER = single;
        if (!plural)
            this.yt = single + "s";
        else
            this.yt = plural
    }
};
if (window.dhtmlXTreeObject) {
    dhtmlXTreeObject.prototype._createDragNode = function(htmlObject, e) {
        if (!this.dADTempOff)
            return null;
        var obj = htmlObject.parentObject;
        if (!this.callEvent("onBeforeDrag", [obj.id]))
            return null;
        if (!obj.i_sel)
            this._selectItem(obj, e);
        this.wb();
        var dragSpan = document.createElement('div');
        var z = this._selected.length;
        var out = "";
        if (z == 1)
            out = z + " " + (this.ER || "message");
        else
            out = z + " " + (this.yt || "messages");
        dragSpan.innerHTML = "<table cellspacing='0' cellpadding='0'><tbody><tr><td class='dragAccessD'>&nbsp</td><td class='dragTextCell'>" + out + "</td></tbody><table>";
        dragSpan.style.position = "absolute";
        dragSpan.className = "dragSpanDiv";
        this._dragged = (new Array()).concat(this._selected);
        return dragSpan
    };
    dhtmlXTreeObject.prototype.setDragText = function(a, b) {
        this.ER = a;
        if (!b)
            this.yt = a + "s";
        else
            this.yt = b
    };
    dhtmlXTreeObject.prototype.Of = xQ;
    dhtmlXTreeObject.prototype.setOnDragIn = function(func) {
        if (typeof(func) == "function")
            this.rv = func;
        else
            this.rv = eval(func)
    }
};
dhtmlDragAndDropObject.prototype._onNotFound = function() {
    xV()
};