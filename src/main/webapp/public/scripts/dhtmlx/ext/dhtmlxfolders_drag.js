dhtmlxFolders.prototype.enableContextMenu = function(menu) {
    this._ctmndx = menu
};
dhtmlxFolders.prototype.enableDragAndDrop = function(mode) {
    if (convertStringToBoolean(mode)) {
        this._drager = new dhtmlDragAndDropObject();
        this._drager.addDragLanding(this.cont, this)
    } else
        this._drager = null
};
dhtmlxFolders.prototype._createDragNode = function(htmlObject, e) {
    var id = htmlObject.itemObj.data.id;
    this._dragged = [].concat(this._selectedCol);
    if (!this.matchSelected(null, id)) {
        this.selectItem(id);
        this._dragged = [id]
    };
    if (this._dragged.length > 1) {
        var z = this._idpullCol[this._dragged[1]].item.cloneNode(true);
        var z2 = this._idpullCol[this._dragged[0]].item.cloneNode(true);
        z2.style.left = "10px";
        z2.style.top = "10px";
        z2.className += ' dhx_DnD_drag';
        z.appendChild(z2)
    } else
        var z = htmlObject.cloneNode(true);
    z.className += ' dhx_DnD_drag';
    this._idpullCol[id].parentObject = {
        id : id,
        ex : this,
        treeNod : {
            _nonTrivialNode : this._dragInTree,
            _nonTrivialRow : this._dragInGrid
        }
    };
    htmlObject.parentObject = this._idpullCol[id].parentObject;
    z._exp_id = id;
    return z
};
dhtmlxFolders.prototype._dragInTree = function(tree, tobj, bnod, item) {
    var that = item.ex;
    for (var i = 0; i < that._dragged.length; i++) {
        var id = that._dragged[i];
        if (!tree.callEvent("onDrag", [id, tobj.id, null, this, tree]))
            continue;
        var text = "new item";
        var src = "leaf.gif";
        if (!bnod)
            tree.insertNewItem(tobj.id, id, text, src, src, src);
        else
            tree.insertNewNext(bnod.id, id, text, src, src, src);
        that.deleteItem(id)
    }
};
dhtmlxFolders.prototype._dragInGrid = function(grid, row, mode, item) {
    var that = item.ex;
    for (var i = 0; i < that._dragged.length; i++) {
        var id = that._dragged[i];
        if (!grid.callEvent("onDrag", [id, row, this, tree]))
            continue;
        var text = "new item";
        var src = "leaf.gif";
        if (mode == "sibling")
            grid.addRow(id, [text], grid.getRowIndex(row));
        else
            tree.addRow(id, [text], null, row);
        that.deleteItem(id)
    }
};
dhtmlxFolders.prototype._drag = function(source, from, target, lastLanding) {
    this.hideDnDSelection(true);
    var tid = 0;
    if (target.itemObj)
        tid = target.itemObj.data.id;
    if (source.itemObj && target.itemObj) {
        if (!this.matchSelected(null, target.itemObj.data.id))
            this.getItem(target.itemObj.data.id).setSelectedState(false);
        if (source.itemObj.data.id == target.itemObj.data.id)
            return false;
        if (!this.callEvent("onBeforeDrop", [this._dndPos, this._getAllDragItemsIds(source), target.itemObj.data.id]))
            return false
    };
    var sid = null;
    for (var j = 0; j < from._dragged.length; j++) {
        if (from.mytype == "tree") {
            sid = from._dragged[j].id
        } else if (from.rowsBuffer) {
            sid = from._dragged[j].idd
        } else {
            sid = from._dragged[j]
        };
        if (!this.callEvent("onDrag", [sid, tid, this._dndPos, this, from]))
            return;
        if (from.mytype == "tree") {
            this.addItem(sid, from.getItemText(sid), {
                        id : target._exp_id,
                        mode : this._dndPos
                    });
            from.deleteItem(sid)
        } else if (from.rowsBuffer) {
            this.addItem(sid, from.cells(sid, 0).getValue(), {
                        id : target._exp_id,
                        mode : this._dndPos
                    });
            from.deleteRow(sid)
        } else {
            this.moveItem(sid, this._dndPos, (tid || sid), from)
        }
    };
    from._dragged = null
};
dhtmlxFolders.prototype.hideDnDSelection = function(mode, left, top, dy) {
    if (!this._DnDSel) {
        this._DnDSel = new Array()
    };
    var orientat = this._getCurrentPlacementType();
    if (!this._DnDSel[orientat]) {
        this._DnDSel[orientat] = document.createElement("IMG");
        this._DnDSel[orientat].className = 'dhx_DnD_selector';
        this._DnDSel[orientat].src = this.imgSrc + 'dnd_selector_' + orientat + '.png';
        this._DnDSel[orientat].dragLanding = this;
        this.cont.appendChild(this._DnDSel[orientat])
    };
    if (mode)
        this._DnDSel[orientat].style.display = "none";
    else {
        this._DnDSel[orientat].style.display = "";
        this._DnDSel[orientat].style.top = top + "px";
        this._DnDSel[orientat].style.left = left + "px";
        this._DnDSel[orientat].style.width = "6px";
        this._DnDSel[orientat].style.height = "6px";
        if (orientat == "cells")
            this._DnDSel[orientat].style.height = dy + "px";
        else
            this._DnDSel[orientat].style.width = dy + "px"
    }
};
dhtmlxFolders.prototype._dragIn = function(htmlObject, shtmlObject, x, y) {
    if (htmlObject.tagName == "IMG")
        htmlObject = this._lastDH;
    this._lastDH = htmlObject;
    if (!htmlObject.itemObj)
        return htmlObject;
    if (shtmlObject.itemObj && shtmlObject.itemObj.data.id == htmlObject.itemObj.data.id)
        return false;
    tObjWidth = htmlObject.offsetWidth;
    tObjHeight = htmlObject.offsetHeight;
    tObjTop = getAbsoluteTop(htmlObject);
    tObjLeft = getAbsoluteLeft(htmlObject);
    topCorrector = getAbsoluteTop(this.cont);
    leftCorrector = getAbsoluteLeft(this.cont);
    var ids = shtmlObject.itemObj ? this._getAllDragItemsIds(shtmlObject) : "0";
    if (this._getCurrentPlacementType() == "cells") {
        if (x - tObjLeft < tObjWidth / 4 && this.callEvent("onBeforeDragIn", ["before", ids, htmlObject.itemObj.data.id])) {
            this.hideDnDSelection(false, tObjLeft - leftCorrector, tObjTop - topCorrector, tObjHeight);
            this._dndPos = "before"
        } else if (x - tObjLeft > (tObjWidth / 4) * 3 && this.callEvent("onBeforeDragIn", ["next", ids, htmlObject.itemObj.data.id])) {
            this.hideDnDSelection(false, tObjLeft + tObjWidth - leftCorrector, tObjTop - topCorrector, tObjHeight);
            this._dndPos = "next"
        } else if (this.callEvent("onBeforeDragIn", ["in", ids, htmlObject.itemObj.data.id])) {
            this._dndPos = "in";
            this.hideDnDSelection(true);
            this.getItem(htmlObject.itemObj.data.id).setSelectedState(true)
        }
    } else if (this._getCurrentPlacementType() == "lines") {
        if (y - tObjTop < tObjHeight / 4 && this.callEvent("onBeforeDragIn", ["before", ids, htmlObject.itemObj.data.id])) {
            this.hideDnDSelection(false, tObjLeft - leftCorrector, tObjTop - topCorrector, tObjWidth);
            this._dndPos = "before"
        } else if (y - tObjTop > (tObjHeight / 4) * 3 && this.callEvent("onBeforeDragIn", ["next", ids, htmlObject.itemObj.data.id])) {
            this.hideDnDSelection(false, tObjLeft + tObjWidth - leftCorrector, tObjTop - topCorrector, tObjWidth);
            this._dndPos = "next"
        } else if (this.callEvent("onBeforeDragIn", ["in", ids, htmlObject.itemObj.data.id])) {
            this._dndPos = "in";
            this.hideDnDSelection(true);
            this.getItem(htmlObject.itemObj.data.id).setSelectedState(true)
        }
    };
    return htmlObject
};
dhtmlxFolders.prototype._dragOut = function(htmlObject) {
    this.hideDnDSelection(true);
    if (!htmlObject.itemObj)
        return;
    if (!this.matchSelected(null, htmlObject.itemObj.data.id))
        this.getItem(htmlObject.itemObj.data.id).setSelectedState(false)
};
dhtmlxFolders.prototype._getAllDragItemsIds = function(sHTMLObj) {
    var curItemId = sHTMLObj.itemObj.data.id;
    var selected = this.getSelectedId();
    if (typeof(selected) == "object") {
        for (var i = 0; i < selected.length; i++) {
            if (curItemId == selected[i])
                return selected
        };
        selected[selected.length] = curItemId;
        return selected
    } else if (selected != null) {
        if (selected != curItemId)
            return [selected, curItemId];
        else
            return selected
    } else
        return curItemId
}