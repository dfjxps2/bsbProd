dhtmlXTreeObject.prototype.sortTree = function(nodeId, order, all_levels) {
    var sNode = this._globalIdStorageFind(nodeId);
    if (!sNode)
        return false;
    this._reorderBranch(sNode, (order.toString().toLowerCase() == "asc"), convertStringToBoolean(all_levels))
};
dhtmlXTreeObject.prototype.setCustomSortFunction = function(func) {
    this.GD = func
};
dhtmlXTreeObject.prototype._reorderBranch = function(node, order, all_levels) {
    var m = [];
    var count = node.childsCount;
    if (!count)
        return;
    var parent = node.childNodes[0].tr.parentNode;
    for (var i = 0; i < count; i++) {
        m[i] = node.childNodes[i];
        parent.removeChild(m[i].tr)
    };
    var self = this;
    if (order == 1)
        if (this.GD)
            m.sort(function(a, b) {
                        return self.GD(a.id, b.id)
                    });
        else
            m.sort(function(a, b) {
                        return ((a.span.innerHTML.toUpperCase() > b.span.innerHTML.toUpperCase()) ? 1 : ((a.span.innerHTML.toUpperCase() == b.span.innerHTML.toUpperCase()) ? 0 : -1))
                    });
    else if (this.GD)
        m.sort(function(a, b) {
                    return self.GD(b.id, a.id)
                });
    else
        m.sort(function(a, b) {
                    return ((a.span.innerHTML.toUpperCase() < b.span.innerHTML.toUpperCase()) ? 1 : ((a.span.innerHTML.toUpperCase() == b.span.innerHTML.toUpperCase()) ? 0 : -1))
                });
    for (var i = 0; i < count; i++) {
        parent.appendChild(m[i].tr);
        node.childNodes[i] = m[i];
        if ((all_levels) && (m[i].unParsed))
            m[i].unParsed.set("order", order ? 1 : -1);
        else if ((all_levels) && (m[i].childsCount))
            this._reorderBranch(m[i], order, all_levels)
    };
    for (var i = 0; i < count; i++) {
        this._correctPlus(m[i]);
        this._correctLine(m[i])
    }
};
dhtmlXTreeObject.prototype.aeQ = function(node) {
    var NY = node.getAttribute("order");
    if (NY == "none")
        return;
    var order = (NY == 1);
    var count = node.childNodes.length;
    if (!count)
        return;
    var m = new Array();
    var j = 0;
    for (var i = 0; i < count; i++)
        if (node.childNodes[i].nodeType == 1) {
            m[j] = node.childNodes[i];
            j++
        };
    for (var i = count - 1; i != 0; i--)
        node.removeChild(node.childNodes[i]);
    if (order)
        m.sort(function(a, b) {
                    return ((a.getAttribute("text") > b.getAttribute("text")) ? 1 : ((a.getAttribute("text") == b.getAttribute("text")) ? 0 : -1))
                });
    else
        m.sort(function(a, b) {
                    return ((a.getAttribute("text") < b.getAttribute("text")) ? 1 : ((a.getAttribute("text") == b.getAttribute("text")) ? 0 : -1))
                });
    for (var i = 0; i < j; i++) {
        m[i].setAttribute("order", NY);
        node.appendChild(m[i])
    };
    node.setAttribute("order", "none")
};