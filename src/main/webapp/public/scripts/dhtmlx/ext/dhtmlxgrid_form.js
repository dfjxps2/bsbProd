dhtmlXGridObject.prototype.xD = dhtmlXGridObject.prototype.attachHeader;
dhtmlXGridObject.prototype.attachHeader = function() {
    this.xD.apply(this, arguments);
    if (this._realfake)
        return true;
    this.CC();
    if (typeof(this.sY) == "undefined")
        this.submitOnlyChanged(true);
    if (typeof(this.DO) == "undefined")
        this.submitAddedRows(true);
    var that = this;
    this.xc = [];
    this.vb = [];
    this.attachEvent("onRowAdded", function(id) {
                that.xc.push(id);
                that.forEachCell(id, function(a) {
                            a.cell.wasChanged = true
                        });
                return true
            });
    this.attachEvent("onBeforeRowDeleted", function(id) {
                that.vb.push(id);
                return true
            });
    this.attachHeader = this.xD
};
dhtmlXGridObject.prototype.CC = function() {
    this.parentForm = this.we();
    if (this.parentForm === false) {
        return false
    };
    if (this.zI)
        return;
    this.formInputs = new Array();
    var self = this;
    dhtmlxEvent(this.parentForm, 'submit', function() {
                if (self.entBox)
                    self.ym()
            });
    this.zI = true
};
dhtmlXGridObject.prototype.ym = function() {
    this.vr();
    if (!this.callEvent("onBeforeFormSubmit", []))
        return false
};
dhtmlXGridObject.prototype.submitOnlyChanged = function(mode) {
    this.sY = convertStringToBoolean(mode)
};
dhtmlXGridObject.prototype.submitColumns = function(names) {
    if (typeof names == "string")
        names = names.split(this.delim);
    this._submit_cols = names
};
dhtmlXGridObject.prototype.setFieldName = function(mask) {
    mask = mask.replace(/\{GRID_ID\}/g, "'+a1+'");
    mask = mask.replace(/\{ROW_ID\}/g, "'+a2+'");
    mask = mask.replace(/\{ROW_INDEX\}/g, "'+this.getRowIndex(a2)+'");
    mask = mask.replace(/\{COLUMN_INDEX\}/g, "'+a3+'");
    mask = mask.replace(/\{COLUMN_ID\}/g, "'+this.getColumnId(a3)+'");
    this._input_mask = Function("a1", "a2", "a3", "return '" + mask + "';")
};
dhtmlXGridObject.prototype.submitSerialization = function(mode) {
    this.FormSubmitSerialization = convertStringToBoolean(mode)
};
dhtmlXGridObject.prototype.submitAddedRows = function(mode) {
    this.DO = convertStringToBoolean(mode)
};
dhtmlXGridObject.prototype.submitOnlySelected = function(mode) {
    this.wN = convertStringToBoolean(mode)
};
dhtmlXGridObject.prototype.submitOnlyRowID = function(mode) {
    this.yg = convertStringToBoolean(mode)
};
dhtmlXGridObject.prototype.createFormInput = function(name, value) {
    var input = document.createElement('input');
    input.type = 'hidden';
    if (this._input_mask)
        input.name = this._input_mask.apply(this, name);
    else
        input.name = ((this.globalBox || this.entBox).id || 'dhtmlXGrid') + '_' + name;
    input.value = value;
    this.parentForm.appendChild(input);
    this.formInputs.push(input)
};
dhtmlXGridObject.prototype.createFormInputRow = function(r) {
    var id = (this.globalBox || this.entBox).id;
    for (var j = 0; j < this._cCount; j++) {
        var Ft = this.cells3(r, j);
        if (((!this.sY) || Ft.wasChanged()) && (!this._submit_cols || this._submit_cols[j]))
            this.createFormInput(this._input_mask ? [id, r.idd, j] : (r.idd + '_' + j), Ft.getValue())
    }
};
dhtmlXGridObject.prototype.vr = function() {
    if (this.parentForm == false) {
        return false
    };
    for (var i = 0; i < this.formInputs.length; i++) {
        this.parentForm.removeChild(this.formInputs[i])
    };
    this.formInputs = new Array();
    if (this.FormSubmitSerialization) {
        this.createFormInput("serialized", this.serialize())
    } else if (this.wN) {
        if (this.yg)
            this.createFormInput("selected", this.getSelectedId());
        else
            for (var i = 0; i < this.selectedRows.length; i++)
                this.createFormInputRow(this.selectedRows[i])
    } else {
        if (this.DO) {
            if (this.xc.length)
                this.createFormInput("rowsadded", this.xc.join(","));
            if (this.vb.length)
                this.createFormInput("rowsdeleted", this.vb.join(","))
        };
        this.forEachRow(function(id) {
                    this.getRowById(id);
                    this.createFormInputRow(this.rowsAr[id])
                })
    }
};
dhtmlXGridObject.prototype.we = function() {
    var parentForm = false;
    var parent = this.entBox;
    while (parent && parent.tagName && parent != document.body) {
        if (parent.tagName.toLowerCase() == 'form') {
            parentForm = parent;
            break
        } else {
            parent = parent.parentNode
        }
    };
    return parentForm
};