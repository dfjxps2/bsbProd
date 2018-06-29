dhtmlXGridObject.prototype.startFastOperations = function() {
    this.yV = ["setSizes", "callEvent", "_fixAlterCss", "cells4", "forEachRow"];
    this.IL = [];
    for (var i = this.yV.length - 1; i >= 0; i--) {
        this.IL[i] = this[this.yV[i]];
        this[this.yV[i]] = function() {
            return true
        }
    };
    this.Zs = [];
    this.cells4 = function(cell) {
        var c = this.Zs[cell._cellIndex];
        if (!c) {
            c = this.Zs[cell._cellIndex] = this.IL[3].apply(this, [cell]);
            c.destructor = function() {
                return true
            };
            c.setCValue = function(val) {
                c.cell.innerHTML = val
            }
        };
        c.cell = cell;
        c.combo = cell._combo || this.combos[cell._cellIndex];
        return c
    }
};
dhtmlXGridObject.prototype.stopFastOperations = function() {
    if (!this.yV)
        return;
    for (var i = this.yV.length - 1; i >= 0; i--) {
        this[this.yV[i]] = this.IL[i]
    };
    this.setSizes();
    this.callEvent("onGridReconstructed", [])
};