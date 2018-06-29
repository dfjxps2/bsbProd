dhtmlXTreeObject.prototype.defineItemForm = function(formId) {
    this.Tm = formId;
    this.enableHighlighting(true);
    this._itemMouseIn = this.Sx;
    this._itemMouseOut = function() {
        return false;
    };
    this.setOnClickHandler(this.Qs);
    this.setOnDblClickHandler(this.Ui);
    this.setOnClickHandler = this.HQ;
    this.setOnDblClickHandler = this.DG;
    dhtmlXTreeObject.prototype._HideShow;
    this.VS = this._HideShow;
    this._HideShow = this.YC;
    this.tP = new Array(false, false, false);
    this.tQ = new Array(false, false, false);
};
dhtmlXTreeObject.prototype.Bk = function(item, DR) {
    if (item.parentObject.id == DR.id)return true;
    if (item.parentObject.id != this.rootId)return this.Bk(item.parentObject, DR);
    return false;
};
dhtmlXTreeObject.prototype.YC = function(itemObject, mode) {
    if ((this.hM) && (this.Bk(this._globalIdStorageFind(this.hM), itemObject)))this.hideItemForm(this.hM);
    this.VS(itemObject, mode);
};
dhtmlXTreeObject.prototype.Sx = function() {
    var that = this.parentNode.parentObject.treeNod;
    var id = this.parentNode.parentObject.id;
    if (id != that.hM) {
        if (that.tQ[2])that.hideItemForm(id, "m");
        if (that.tP[2])that.showItemForm(id, "m");
    }
};
dhtmlXTreeObject.prototype.Qs = function(id, _a, asB, _c, that, flag) {
    that = that || this.treeNod;
    if (id != that.hM) {
        if ((that.yF == id) && (flag)) {
            if (that.tQ[0])that.hideItemForm(id, "c");
            if (that.tP[0])that.showItemForm(id, "c");
            that.yF = null;
        } else {
            that.yF = id;
            window.setTimeout(function() {
                that.Qs(id, 0, 0, 0, that, 1);
            }, 300);
            return;
        }
    }
    if (that.NN)return that.NN(id);
};
dhtmlXTreeObject.prototype.Ui = function(id) {
    this.yF = null;
    if (id != this.hM) {
        if (this.tQ[1])this.hideItemForm(id, "d");
        if (this.tP[1])this.showItemForm(id, "d");
    }
    if (this.pi)return this.pi(id);
};
dhtmlXTreeObject.prototype.HQ = function(func) {
    if (typeof(func) == "function")this.NN = func; else this.NN = eval(func);
};
dhtmlXTreeObject.prototype.DG = function(func) {
    if (typeof(func) == "function")this.pi = func; else this.pi = eval(func);
};
dhtmlXTreeObject.prototype.setFormAppearOn = function(onClick, onDblClick, onMouseOver) {
    this.tP[0] = convertStringToBoolean(onClick);
    this.tP[1] = convertStringToBoolean(onDblClick);
    this.tP[2] = convertStringToBoolean(onMouseOver);
};
dhtmlXTreeObject.prototype.setFormDisappearOn = function(onClick, onDblClick, onMouseOver) {
    this.tQ[0] = convertStringToBoolean(onClick);
    this.tQ[1] = convertStringToBoolean(onDblClick);
    this.tQ[2] = convertStringToBoolean(onMouseOver);
};
dhtmlXTreeObject.prototype.hideItemForm = function(itemID, state) {
    if (this.hM) {
        if (this.Xe)this.Xe(this, itemID, state || "p");
        var form = document.getElementById(this.Tm);
        form.style.display = "none";
        var sNode = this._globalIdStorageFind(this.hM);
        sNode.span.style.position = "";
        this.allTree.appendChild(form);
        this.hM = false;
    }
};
dhtmlXTreeObject.prototype.showItemForm = function(itemID, state) {
    if (this.hM == itemID)return;
    if (this.hM)this.hideItemForm(this.hM);
    var sNode = this._globalIdStorageFind(itemID);
    var flag = true;
    if (this.Xc)flag = this.Xc(this, itemID, state || "p");
    if (flag) {
        this._openItem(sNode.parentObject);
        var form = document.getElementById(this.Tm);
        form.style.display = "block";
        sNode.span.style.position = "relative";
        sNode.span.style.top = "0px";
        sNode.span.style.left = "0px";
        sNode.span.appendChild(form);
        var a1 = getAbsoluteTop(sNode.span.parentNode);
        var a2 = getAbsoluteTop(this.allTree);
        var z = a1 - a2;
        if ((z > (this.allTree.scrollTop + this.allTree.offsetHeight - 90)) || (z < this.allTree.scrollTop))this.allTree.scrollTop = z;
        form.style.position = "absolute";
        form.style.top = "15px";
        var a3 = getAbsoluteLeft(sNode.span.parentNode);
        var a4 = getAbsoluteLeft(this.allTree);
        form.style.left = "-" + (a3 - a4) + "px";
        this.hM = itemID;
    }
};
dhtmlXTreeObject.prototype.setOnFormInitialisation = function(func) {
    if (typeof(func) == "function")this.Xc = func; else this.onXLS = eval(func);
};
dhtmlXTreeObject.prototype.setOnFormDismissal = function(func) {
    if (typeof(func) == "function")this.Xe = func; else this.onXLS = eval(func);
}