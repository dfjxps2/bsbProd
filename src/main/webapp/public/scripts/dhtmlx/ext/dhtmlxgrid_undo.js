dhtmlXGridObject.prototype.enableUndoRedo = function() {
    var self = this;
    var func = function() {
        return self._onEditUndoRedo.apply(self, arguments)
    };
    this.attachEvent("onEditCell", func);
    var func2 = function(a, b, c) {
        return self._onEditUndoRedo.apply(self, [2,a,b,(c ? 1 : 0),(c ? 0 : 1)])
    };
    this.attachEvent("onCheckbox", func2);
    this.uv = true;
    this.pr = [];
    this.pE = -1
};
dhtmlXGridObject.prototype.disableUndoRedo = function() {
    this.uv = false;
    this.pr = [];
    this.pE = -1
};
dhtmlXGridObject.prototype._onEditUndoRedo = function(stage, row_id, qF, new_value, old_value) {
    if (this.uv && stage == 2 && old_value != new_value) {
        if (this.pE !== -1 && this.pE != (this.pr.length - 1)) {
            this.pr = this.pr.slice(0, this.pE + 1)
        } else if (this.pE === -1 && this.pr.length > 0) {
            this.pr = []
        }
        ;
        var obj = {old_value:old_value,new_value:new_value,row_id:row_id,qF:qF};
        this.pr.push(obj);
        this.pE++
    }
    ;
    return true
};
dhtmlXGridObject.prototype.doUndo = function() {
    if (this.pE === -1)return false;
    var obj = this.pr[this.pE--];
    var c = this.cells(obj.row_id, obj.qF);
    if (this.getColType(obj.qF) == "tree")c.setLabel(obj.old_value); else c.setValue(obj.old_value)
};
dhtmlXGridObject.prototype.doRedo = function() {
    if (this.pE == this.pr.length - 1)return false;
    var obj = this.pr[++this.pE];
    this.cells(obj.row_id, obj.qF).setValue(obj.new_value)
};
dhtmlXGridObject.prototype.getRedo = function() {
    if (this.pE == this.pr.length - 1)return[];
    return this.pr.slice(this.pE + 1)
};
dhtmlXGridObject.prototype.getUndo = function() {
    if (this.pE == -1)return[];
    return this.pr.slice(0, this.pE + 1)
};