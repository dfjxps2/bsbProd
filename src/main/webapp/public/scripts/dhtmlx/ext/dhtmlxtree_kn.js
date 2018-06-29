dhtmlXTreeObject.prototype.enableKeyboardNavigation = function(mode) {
    this._enblkbrd = convertStringToBoolean(mode);
    if (this._enblkbrd) {
        if (_isFF) {
            var z = window.getComputedStyle(this.parentObject, null)["position"];
            if ((z != "absolute") && (z != "relative"))
                this.parentObject.style.position = "relative"
        };
        this.GV = [["up", 38], ["down", 40], ["open", 39], ["close", 37], ["call", 13], ["edit", 113]];
        var self = this;
        var z = document.createElement("INPUT");
        z.className = "a_dhx_hidden_input";
        z.autocomplete = "off";
        if (window._KHTMLrv)
            z.style.color = "white";
        this.parentObject.appendChild(z);
        this.parentObject.onkeydown = function(e) {
            if (self.callEvent("onKeyPress", [(e || window.event).keyCode, (e || window.event)]))
                return self._onKeyDown(e || window.event)
        };
        this.parentObject.onclick = function(e) {
            if (_isFF)
                z.select();
            if (window._KHTMLrv || _isOpera)
                z.focus()
        }
    } else
        this.parentObject.onkeydown = null
};
dhtmlXTreeObject.prototype._onKeyDown = function(e) {
    var self = this;
    for (var i = 0; i < this.GV.length; i++)
        if (this.GV[i][1] == e.keyCode) {
            this["_onkey_" + this.GV[i][0]].apply(this, [this.getSelectedItemId()]);
            if (e.preventDefault)
                e.preventDefault();
            (e || event).cancelBubble = true;
            return false
        };
    if (this.Mv) {
        return this.Ni(e)
    };
    return true
};
dhtmlXTreeObject.prototype._onkey_up = function(id) {
    var temp = this._globalIdStorageFind(id);
    if (!temp)
        return;
    var next = this.IO(temp);
    if (next.id == this.rootId)
        return;
    this.focusItem(next.id);
    this.selectItem(next.id, false)
};
dhtmlXTreeObject.prototype._onkey_down = function(id) {
    var temp = this._globalIdStorageFind(id);
    if (!temp)
        return;
    var next = this.xH(temp);
    if (next.id == this.rootId)
        return;
    this.focusItem(next.id);
    this.selectItem(next.id, false)
};
dhtmlXTreeObject.prototype._onkey_open = function(id) {
    this.openItem(id)
};
dhtmlXTreeObject.prototype._onkey_close = function(id) {
    this.closeItem(id)
};
dhtmlXTreeObject.prototype._onkey_call = function(id) {
    if (this.stopEdit) {
        this.stopEdit();
        this.parentObject.lastChild.focus();
        this.parentObject.lastChild.focus();
        this.selectItem(id, true)
    } else
        this.selectItem(this.getSelectedItemId(), true)
};
dhtmlXTreeObject.prototype._onkey_edit = function(id) {
    if (this.editItem)
        this.editItem(id)
};
dhtmlXTreeObject.prototype.xH = function(item, mode) {
    if ((!mode) && (this._getOpenState(item) > 0))
        return item.childNodes[0];
    if ((item.tr) && (item.tr.nextSibling) && (item.tr.nextSibling.nodem))
        return item.tr.nextSibling.nodem;
    if (item.parentObject)
        return this.xH(item.parentObject, 1);
    return item
};
dhtmlXTreeObject.prototype.IO = function(item) {
    if ((item.tr) && (item.tr.previousSibling) && (item.tr.previousSibling.nodem))
        return this.Bd(item.tr.previousSibling.nodem);
    if (item.parentObject)
        return item.parentObject;
    else
        return item
};
dhtmlXTreeObject.prototype.Bd = function(item) {
    if (this._getOpenState(item) > 0)
        return this.Bd(item.childNodes[item.childsCount - 1]);
    else
        return item
};
dhtmlXTreeObject.prototype.Ni = function(e) {
    if (e.keyCode == 8) {
        this.pG = '';
        return true
    };
    var key = String.fromCharCode(e.keyCode).toUpperCase();
    if (key.match(/[A-Z,a-z,0-9\ ]/)) {
        this.pG += key;
        this.pV = true;
        if (!(this.getSelectedItemText() || "").match(RegExp('^' + this.pG, "i"))) {
            this.findItem('^' + this.pG, 0)
        };
        this.pV = false;
        if (e.preventDefault)
            e.preventDefault();
        (e || event).cancelBubble = true;
        return false
    };
    return true
};
dhtmlXTreeObject.prototype.assignKeys = function(keys) {
    this.GV = keys
};
dhtmlXTreeObject.prototype.enableKeySearch = function(mode) {
    this.Mv = convertStringToBoolean(mode);
    if (!this.Mv)
        return;
    this.pG = '';
    var self = this;
    this.ZS = this._markItem;
    this._markItem = function(node) {
        if (!self.pV)
            self.pG = '';
        self.ZS(node)
    }
};