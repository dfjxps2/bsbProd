dhtmlXGridObject.prototype.enableHeaderMenu = function() {
    var that = this;
    this.attachEvent("onInit", function() {
                this.hdr.oncontextmenu = function(e) {
                    return that.xN(e || window.event)
                };
                {
                    this.Uj = this.startColResize;
                    this.startColResize = function(e) {
                        if (e.button == 2 || (_isMacOS && e.ctrlKey))
                            return this.xN(e);
                        return this.Uj(e)
                    }
                };
                this.LG = this.obj.onclick;
                this.LN = this.hdr.onclick;
                this.hdr.onclick = function(e) {
                    if (e && (e.button == 2 || (_isMacOS && e.ctrlKey)))
                        return false;
                    that.sH(false);
                    return that.LN.apply(this, arguments)
                };
                this.obj.onclick = function() {
                    that.sH(false);
                    return that.LG.apply(this, arguments)
                }
            });
    dhtmlxEvent(document.body, "click", function() {
                if (that.qN)
                    that.sH(false)
            });
    if (this.hdr.rows.length)
        this.callEvent("onInit", []);
    this.enableHeaderMenu = function() {
    }
};
dhtmlXGridObject.prototype.xN = function(ev) {
    function mouseCoords(ev) {
        if (ev.pageX || ev.pageY) {
            return {
                x : ev.pageX,
                y : ev.pageY
            }
        };
        return {
            x : ev.clientX + document.body.scrollLeft - document.body.clientLeft,
            y : ev.clientY + document.body.scrollTop - document.body.clientTop
        }
    }

    ;
    this.ws();
    var coords = mouseCoords(ev);
    this.sH(true, coords.x, coords.y);
    ev[_isIE ? "srcElement" : "target"].oncontextmenu = function(e) {
        (e || event).cancelBubble = true;
        return false
    };
    ev.cancelBubble = true;
    if (ev.preventDefault)
        ev.preventDefault();
    return false
};
dhtmlXGridObject.prototype.ws = function() {
    if (this.qN)
        return this.qN;
    var d = document.createElement("DIV");
    d.oncontextmenu = function(e) {
        (e || event).cancelBubble = true;
        return false
    };
    d.onclick = function(e) {
        (e || event).cancelBubble = true;
        return true
    };
    d.className = "dhx_header_cmenu";
    d.style.width = d.style.height = "5px";
    d.style.display = "none";
    var a = [];
    var i = 0;
    if (this._fake)
        i = this._fake._cCount;
    var true_ind = i;
    for (var i; i < this.hdr.rows[1].cells.length; i++) {
        var c = this.hdr.rows[1].cells[i];
        if (c.firstChild && c.firstChild.tagName == "DIV")
            var val = c.firstChild.innerHTML;
        else
            var val = c.innerHTML;
        a.push("<div class='dhx_header_cmenu_item'><input type='checkbox' column='" + true_ind + "' len='" + (c.colSpan || 1) + "' checked='true' />" + val + "</div>");
        true_ind += (c.colSpan || 1)
    };
    d.innerHTML = a.join("");
    var that = this;
    var f = function() {
        var c = this.getAttribute("column");
        if (!this.checked && !that._checkLast(c))
            return this.checked = true;
        if (that._realfake)
            that = that._fake;
        for (var i = 0; i < this.getAttribute("len"); i++)
            that.setColumnHidden((c * 1 + i * 1), !this.checked);
        if (this.checked && that.getColWidth(c) == 0)
            that.adjustColumnSize(c)
    };
    for (var i = 0; i < d.childNodes.length; i++)
        d.childNodes[i].firstChild.onclick = f;
    document.body.insertBefore(d, document.body.firstChild);
    this.qN = d;
    d.style.position = "absolute";
    d.style.zIndex = 999;
    d.style.width = 'auto';
    d.style.height = 'auto';
    d.style.display = 'block'
};
dhtmlXGridObject.prototype._checkLast = function(ind) {
    for (var i = 0; i < this._cCount; i++)
        if ((!this._hrrar || !this._hrrar[i]) && (i != ind))
            return true;
    return false
};
dhtmlXGridObject.prototype.Bs = function() {
    for (var i = 0; i < this.qN.childNodes.length; i++) {
        var c = this.qN.childNodes[i].firstChild;
        var col = c.getAttribute("column");
        if (this.isColumnHidden(col) || (this.getColWidth(col) == 0))
            c.checked = false
    }
};
dhtmlXGridObject.prototype.sH = function(mode, x, y) {
    if (mode && this.enableColumnMove) {
        this.qN.parentNode.removeChild(this.qN);
        this.qN = null
    };
    this.ws();
    this.qN.style.display = (mode ? 'block' : 'none');
    if (mode) {
        this.Bs(true);
        this.qN.style.left = x + "px";
        this.qN.style.top = y + "px"
    }
};