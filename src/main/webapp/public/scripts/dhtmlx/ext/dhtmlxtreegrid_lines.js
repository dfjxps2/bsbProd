dhtmlXGridObject.uT = "line";
dhtmlXGridObject.prototype.ia = function(z, anD) {
    if (anD || !z.update || z.id == 0)
        return;
    this._updateLine(z, this.rowsAr[z.id]);
    z.update = false
};
dhtmlXGridObject.prototype._updateLine = function(z, row) {
    row = row || this.rowsAr[z.id];
    if (!row)
        return;
    var im = row.JW;
    if (!im)
        return;
    if (z.state == "blank")
        return im.src = this.imgURL + "blank.gif";
    var n = 1;
    if (z.index == 0) {
        if (z.level == 0) {
            if ((z.parent.childs.length - 1) > z.index)
                n = 3;
            else
                n = 1
        } else {
            if ((z.parent.childs.length - 1) > z.index)
                n = 3;
            else
                n = 2
        }
    } else if ((z.parent.childs.length - 1) > z.index)
        n = 3;
    else
        n = 2;
    im.src = this.imgURL + z.state + n + ".gif"
};
dhtmlXGridObject.prototype._updateParentLine = function(z, row) {
    row = row || this.rowsAr[z.id];
    if (!row)
        return;
    var im = row.JW;
    if (!im)
        return;
    for (var i = z.level; i > 0; i--) {
        if (z.id == 0)
            break;
        im = im.previousSibling;
        z = z.parent;
        if ((z.parent.childs.length - 1) > z.index)
            im.src = this.imgURL + "line1.gif";
        else
            im.src = this.imgURL + "blank.gif"
    }
};
dhtmlXGridObject.prototype.Wg = dhtmlXGridObject.prototype._renderSort;
dhtmlXGridObject.prototype._renderSort = function() {
    this.Wg.apply(this, arguments);
    this._redrawLines(0)
};
dhtmlXGridObject.prototype._redrawLines = function(id) {
    this._h2.forEachChild((id || 0), function(z) {
                this._updateLine(z);
                this._updateParentLine(z)
            }, this)
};
dhtmlXGridObject.prototype.acm = function() {
    this._tgle = true;
    this.attachEvent("onXLE", function(a, b, id) {
                this._redrawLines(id)
            });
    this.attachEvent("onOpenEnd", function(id) {
                this._redrawLines(id)
            });
    this.attachEvent("onRowAdded", function(id) {
                var z = this._h2.get[id];
                this._updateLine(z);
                this._updateParentLine(z);
                if (z.index < (z.parent.childs.length - 1)) {
                    z = z.parent.childs[z.index + 1];
                    this._updateLine(z);
                    this._updateParentLine(z)
                } else if (z.index != 0) {
                    z = z.parent.childs[z.index - 1];
                    this._updateLine(z);
                    this._updateParentLine(z);
                    if (z.childs.length)
                        this._h2.forEachChild(z.id, function(c_el) {
                                    this._updateParentLine(c_el)
                                }, this)
                }
            });
    this.attachEvent("onOpen", function(id, state) {
                if (state) {
                    var z = this._h2.get[id];
                    for (var i = 0; i < z.childs.length; i++)
                        this._updateParentLine(z.childs[i])
                };
                return true
            });
    this.attachEvent("onBeforeRowDeleted", function(id) {
                var self = this;
                var z = this._h2.get[id];
                var w = null;
                if (z.index != 0)
                    w = z.parent.childs[z.index - 1];
                z = z.parent;
                window.setTimeout(function() {
                            z = this._h2.get[z.id];
                            if (!z)
                                return;
                            self._updateLine(z);
                            self._updateParentLine(z);
                            if (w) {
                                self._updateLine(w);
                                if (w.state == "minus")
                                    self._h2.forEachChild(w.id, function(z) {
                                                self._updateParentLine(z)
                                            }, this)
                            }
                        }, 1);
                return true
            })
};