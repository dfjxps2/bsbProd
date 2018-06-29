dhtmlXGridObject.prototype.enableMarkedCells = function(fl) {
    this.markedRowsArr = new dhtmlxArray(0);
    this.markedCellsArr = new Array(0);
    this.lastMarkedRow = null;
    this.lastMarkedColumn = null;
    this.markedCells = true;
    this.lastMarkMethod = 0;
    if (arguments.length > 0) {
        if (!convertStringToBoolean(fl))
            this.markedCells = false
    }
};
dhtmlXGridObject.prototype.doMark = function(el, markMethod) {
    var _rowId = el.parentNode.idd;
    var _cellIndex = el._cellIndex;
    if (!markMethod)
        markMethod = 0;
    if (markMethod == 0) {
        this.unmarkAll()
    } else if (markMethod == 1) {
        if (this.lastMarkedRow) {
            var r_start = Math.min(this.getRowIndex(_rowId), this.getRowIndex(this.lastMarkedRow));
            var r_end = Math.max(this.getRowIndex(_rowId), this.getRowIndex(this.lastMarkedRow));
            var c_start = Math.min(_cellIndex, this.lastMarkedColumn);
            var c_end = Math.max(_cellIndex, this.lastMarkedColumn);
            for (var i = r_start; i < r_end + 1; i++) {
                for (var j = c_start; j < c_end + 1; j++) {
                    this.mark(this.getRowId(i), j, true)
                }
            }
        }
    } else if (markMethod == 2) {
        if (this.markedRowsArr._dhx_find(_rowId) != -1) {
            for (var ci = 0; ci < this.markedCellsArr[_rowId].length; ci++) {
                if (this.markedCellsArr[_rowId][ci] == _cellIndex) {
                    this.mark(_rowId, _cellIndex, false);
                    return true
                }
            }
        }
    };
    if (!this.markedCellsArr[_rowId])
        this.markedCellsArr[_rowId] = new dhtmlxArray(0);
    if (markMethod != 1)
        this.mark(_rowId, _cellIndex);
    this.moveToVisible(this.cells(_rowId, _cellIndex).cell);
    this.lastMarkedRow = _rowId;
    this.lastMarkedColumn = _cellIndex;
    this.lastMarkMethod = markMethod
};
dhtmlXGridObject.prototype.mark = function(rid, cindex, fl) {
    if (arguments.length > 2) {
        if (!convertStringToBoolean(fl)) {
            this.cells(rid, cindex).cell.className = this.cells(rid, cindex).cell.className.replace(/cellselected/g, "");
            if (this.markedRowsArr._dhx_find(rid) != -1) {
                var ci = this.markedCellsArr[rid]._dhx_find(cindex);
                if (ci != -1) {
                    this.markedCellsArr[rid]._dhx_removeAt(ci);
                    if (this.markedCellsArr[rid].length == 0) {
                        this.markedRowsArr._dhx_removeAt(this.markedRowsArr._dhx_find(rid))
                    };
                    this.callEvent("onCellUnMarked", [rid, cindex])
                }
            };
            return true
        }
    };
    this.cells(rid, cindex).cell.className += " cellselected";
    if (this.markedRowsArr._dhx_find(rid) == -1)
        this.markedRowsArr[this.markedRowsArr.length] = rid;
    if (!this.markedCellsArr[rid])
        this.markedCellsArr[rid] = new dhtmlxArray(0);
    if (this.markedCellsArr[rid]._dhx_find(cindex) == -1) {
        this.markedCellsArr[rid][this.markedCellsArr[rid].length] = cindex;
        this.callEvent("onCellMarked", [rid, cindex])
    }
};
dhtmlXGridObject.prototype.unmarkAll = function() {
    if (this.markedRowsArr) {
        for (var ri = 0; ri < this.markedRowsArr.length; ri++) {
            var rid = this.markedRowsArr[ri];
            for (var ci = 0; ci < this.markedCellsArr[rid].length; ci++) {
                this.callEvent("onCellUnMarked", [rid, this.markedCellsArr[rid][ci]]);
                this.cells(rid, this.markedCellsArr[rid][ci]).cell.className = this.cells(rid, this.markedCellsArr[rid][ci]).cell.className.replace(/cellselected/g, "")
            }
        };
        this.markedRowsArr = new dhtmlxArray(0);
        this.markedCellsArr = new Array(0)
    };
    return true
};
dhtmlXGridObject.prototype.getMarked = function() {
    var marked = new Array();
    for (var ri = 0; ri < this.markedRowsArr.length; ri++) {
        var rid = this.markedRowsArr[ri];
        for (var ci = 0; ci < this.markedCellsArr[rid].length; ci++) {
            marked[marked.length] = [rid, this.markedCellsArr[rid][ci]]
        }
    };
    return marked
};