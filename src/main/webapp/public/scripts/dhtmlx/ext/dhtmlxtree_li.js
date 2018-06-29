dhtmlXTreeObject.prototype.isLocked = function(itemId) {
    if (!this._locker)
        this.Hp();
    return (this._locker[itemId] == true)
};
dhtmlXTreeObject.prototype.Te = function(sNode, state, agD) {
    if (!this._locker)
        this.Hp();
    if (state) {
        if (this._locker[sNode.id] == true)
            return;
        this._locker[sNode.id] = true;
        sNode.apm = sNode.images[0];
        sNode.apq = sNode.images[1];
        sNode.hO = sNode.images[2];
        sNode.images[0] = this.aof;
        sNode.images[1] = this.aog;
        sNode.images[2] = this.aok;
        var z1 = sNode.span.parentNode;
        var z2 = z1.previousSibling;
        this.dragger.removeDraggableItem(z1);
        this.dragger.removeDraggableItem(z2)
    } else {
        if (this._locker[sNode.id] != true)
            return;
        this._locker[sNode.id] = false;
        sNode.images[0] = sNode.apm;
        sNode.images[1] = sNode.apq;
        sNode.images[2] = sNode.hO;
        var z1 = sNode.span.parentNode;
        var z2 = z1.previousSibling;
        this.dragger.addDraggableItem(z1, this);
        this.dragger.addDraggableItem(z2, this)
    };
    if (!agD)
        this._correctPlus(sNode)
};
dhtmlXTreeObject.prototype.lockItem = function(itemId, state) {
    if (!this._locker)
        this.Hp();
    this.RS = false;
    var sNode = this._globalIdStorageFind(itemId);
    this.RS = true;
    this.Te(sNode, convertStringToBoolean(state))
};
dhtmlXTreeObject.prototype.setLockedIcons = function(im0, im1, im2) {
    if (!this._locker)
        this.Hp();
    this.aof = im0;
    this.aog = im1;
    this.aok = im2
};
dhtmlXTreeObject.prototype.Hp = function() {
    this._locker = new Array();
    this.akb = "0";
    this.RS = true;
    this.Fj = this._globalIdStorageFind;
    this._globalIdStorageFind = this.XY;
    if (this.pW) {
        this.Pn = this.pW;
        this.pW = this.Kx;
        this.Ps = this.serializeTree;
        this.serializeTree = this.KE
    };
    this.setLockedIcons(this.imageArray[0], this.imageArray[1], this.imageArray[2])
};
dhtmlXTreeObject.prototype.XY = function(itemId, skipXMLSearch, skipParsing) {
    if (!this.skipLock)
        if ((!skipParsing) && (this.RS == true) && (this._locker[itemId] == true)) {
            return null
        };
    return this.Fj(itemId, skipXMLSearch, skipParsing)
};
dhtmlXTreeObject.prototype.Kx = function(node) {
    if (this._locker[node.id] == true)
        return "";
    return this.Pn(node)
};
dhtmlXTreeObject.prototype.KE = function() {
    var out = this.Ps();
    return out.replace(/<item[^>]+locked\=\"1\"[^>]+\/>/g, "")
};
dhtmlXTreeObject.prototype.Xi = dhtmlXTreeObject.prototype._moveNodeTo;
dhtmlXTreeObject.prototype._moveNodeTo = function(itemObject, targetObject, beforeNode) {
    if ((targetObject.treeNod.isLocked) && (targetObject.treeNod.isLocked(targetObject.id))) {
        return false
    };
    return this.Xi(itemObject, targetObject, beforeNode)
};
dhtmlXTreeObject.prototype.lockTree = function(adw) {
    if (convertStringToBoolean(adw))
        this.YU();
    else if (this.uC) {
        this.uC.parentNode.removeChild(this.uC);
        this.uC = null
    }
};
dhtmlXTreeObject.prototype.YU = function(adw) {
    if (this.uC)
        return;
    this.parentObject.style.overflow = "hidden";
    if (this.parentObject.style.position != 'absolute')
        this.parentObject.style.position = 'relative';
    var div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.left = '0px';
    div.style.top = '0px';
    div.className = 'dhx_tree_opacity';
    div.style.width = this.allTree.offsetWidth + 'px';
    div.style.backgroundColor = '#FFFFFF';
    div.style.height = this.allTree.offsetHeight + 'px';
    this.uC = div;
    this.parentObject.appendChild(this.uC)
};