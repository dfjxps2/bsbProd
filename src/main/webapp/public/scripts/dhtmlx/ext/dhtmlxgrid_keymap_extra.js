dhtmlXGridObject.prototype._key_events = {
    k45_0_0 : function() {
        if (!this.editor)
            this.addRow((new Date()).valueOf(), [], this.row.rowIndex)
    },
    k46_0_0 : function() {
        if (!this.editor)
            this.cells4(this.cell).setValue("")
    }
};