if (window.dhtmlxHierarchy) {
    function eXcell_tree_property(cell) {
        if (cell) {
            this.cell = cell;
            this.grid = this.cell.parentNode.grid
        };
        this.isDisabled = function() {
            return true
        };
        this.getValue = function() {
            return this.cell.parentNode.valTag.innerHTML
        }
    }

    ;
    eXcell_tree_property.prototype = new eXcell_tree;
    eXcell_tree.prototype.setValue = function(sg) {
        if (this.cell.parentNode.JW)
            return this.setLabel(sg);
        if ((this.grid._tgc.imgURL == null) || (this.grid._tgc.imgURL != this.grid.imgURL)) {
            var _tgc = {};
            _tgc.abD = "<img src='" + this.grid.imgURL;
            _tgc.imsti = "<img src='" + (this.grid.iconURL || this.grid.imgURL);
            _tgc.ZY = "' align='absmiddle' onclick='this." + (_isKHTML ? "" : "parentNode.") + "parentNode.parentNode.parentNode.parentNode.grid.doExpand(this);event.cancelBubble=true;' class='property_image'>";
            _tgc.plus = _tgc.abD + "plus.gif" + _tgc.ZY;
            _tgc.minus = _tgc.abD + "minus.gif" + _tgc.ZY;
            _tgc.blank = _tgc.abD + "blank.gif" + _tgc.ZY;
            _tgc.start = "<div style=' overflow:hidden;white-space : nowrap;height:" + (_isIE ? 20 : 19) + "px;'>";
            _tgc.akX = "<span " + (_isFF ? "style='position:relative;top:2px;'" : "") + "id='nodeval'>";
            _tgc.close = "</span><div class='property_space'></div></div>";
            this.grid._tgc = _tgc
        };
        var _h2 = this.grid._h2;
        var _tgc = this.grid._tgc;
        var rid = this.cell.parentNode.idd;
        var row = this.grid._h2.get[rid];
        if (this.grid.Ey || this.grid.mI) {
            row.has_kids = (row.has_kids || (this.cell.parentNode._attrs["xmlkids"] && (row.state != "minus")));
            row._xml_await = !!row.has_kids
        };
        row.image = row.image || (this.cell._attrs["image"] || "leaf.gif");
        row.label = sg;
        var html = [_tgc.start];
        if (row.has_kids) {
            html.push(_tgc.plus);
            row.state = "plus"
        } else
            html.push(_tgc.abD + row.state + ".gif" + _tgc.ZY + _tgc.akX);
        html.push(row.label);
        html.push(_tgc.close);
        this.cell.innerHTML = html.join("");
        this.cell.style.paddingLeft = "0px";
        this.cell.parentNode.JW = this.cell.childNodes[0].childNodes[0];
        this.cell.parentNode.valTag = this.cell.childNodes[0].childNodes[1];
        if (row.childs.length) {
            this.cell.parentNode.style.backgroundColor = '#D4D0C8';
            this.cell.nextSibling.style.borderLeft = "1px solid #D4D0C8"
        };
        if (_isKHTML)
            this.cell.vAlign = "top";
        if (row.parent.id != 0 && row.parent.state == "plus") {
            this.grid.ia(row.parent, false);
            this.cell.parentNode._skipInsert = true
        };
        this.grid.callEvent("onCellChanged", [rid, this.cell._cellIndex, sg])
    }
};
function eXcell_list(cell) {
    if (cell) {
        this.cell = cell;
        this.grid = this.cell.parentNode.grid
    };
    this.edit = function() {
        this.cell.innerHTML = "<select style='width:100%;' ></select>";
        this.obj = this.cell.firstChild;
        this.obj.onclick = function(e) {
            (e || event).cancelBubble = true
        };
        this.obj.onmousedown = function(e) {
            (e || event).cancelBubble = true
        };
        this.obj.onkeydown = function(e) {
            var ev = (e || event);
            if (ev.keyCode == 9 || ev.keyCode == 13) {
                globalActiveDHTMLGridObject.entBox.focus();
                globalActiveDHTMLGridObject.doKey({
                            keyCode : ev.keyCode,
                            shiftKey : ev.shiftKey,
                            srcElement : "0"
                        });
                return false
            };
            ev.cancelBubble = true
        };
        var self = this;
        this.obj.onchange = function() {
            self.grid.editStop();
            self = null
        };
        var opt = this.getAttribute("values").split(",");
        for (var i = 0; i < opt.length; i++)
            this.obj.options[i] = new Option(opt[i], opt[i]);
        this.obj.value = this.cell._val;
        this.obj.focus()
    };
    this.getValue = function() {
        return this.cell._val
    };
    this.detach = function() {
        var val = this.obj.value;
        var sel = this.obj.selectedIndex;
        this.setValue(sel == -1 ? "" : this.obj.options[sel].value);
        return val != this.getValue()
    }
};
eXcell_list.prototype = new eXcell;
eXcell_list.prototype.setValue = function(val) {
    this.cell._val = val;
    if (!val || val.toString()._dhx_trim() == "") {
        this.cell._clearCell = true;
        this.setCValue("&nbsp", "")
    } else {
        this.cell._clearCell = false;
        this.setCValue(this.grid._aplNF(val, this.cell._cellIndex))
    }
};
function dhtmlXPropertyGrid(cont) {
    var t = new dhtmlXGridObject(cont);
    t.setHeader("Name,Value");
    t.setColAlign("left,left");
    if (window.dhtmlxHierarchy) {
        t.setColTypes("tree_property,closeble");
        t.isTreeGrid = function() {
            return true
        };
        t.enableSmartXMLParsing(false)
    } else
        t.setColTypes("closeble,closeble");
    t.setColSorting("_createSelf,_createSelf");
    t.setInitWidths("*,*");
    t.setNoHeader(true);
    t.setSkin("property");
    t.i18n.validation_error = "Value is incorrect";
    t.attachEvent("onRowSelect", function(id, ind) {
                if (!this.editor) {
                    mygrid.selectCell(mygrid.getRowIndex(id), 1);
                    mygrid.editCell()
                }
            });
    t.attachEvent("onBeforeSelect", function(id) {
                if (this._h2 && this._h2.get[id].childs.length)
                    return false;
                if (this._block_selection)
                    return false;
                return true
            });
    t.attachEvent("onRowCreated", function(id, row) {
                if (!this._h2 || !this._h2.get[id].childs.length) {
                    row.childNodes[1].style.backgroundColor = "white"
                }
            });
    t.attachEvent("onEditCell", function(stage, id, ind, nv, ov) {
                if (stage == 1 && this.editor && this.editor.obj && this.editor.obj.select)
                    this.editor.obj.select();
                if (stage == 2 && ov != nv) {
                    var val = mygrid.cells(id, 1).getAttribute("validate");
                    var result = true;
                    switch (val) {
                        case "int" :
                            result = (parseFloat(nv) == nv);
                            break
                    };
                    if (result) {
                        this._block_selection = false;
                        this.callEvent("onPropertyChanged", [mygrid.cells(id, 0).getValue(), nv, ov])
                    } else {
                        alert(this.i18n.validation_error);
                        this._block_selection = true;
                        var self = this;
                        window.setTimeout(function() {
                                    self.selectCell(id, ind);
                                    self.editCell()
                                }, 1)
                    }
                };
                return true
            });
    t._key_events.k13_0_0 = t._key_events.k9_0_0 = t._key_events.k40_0_0;
    t.getProperties = function() {
        this.editStop(true);
        var data = {};
        this.forEachRow(function(id) {
                    data[this.cells(id, 0).getValue()] = this.cells(id, 1).getValue()
                });
        return data
    };
    t.setProperties = function(data) {
        this.editStop();
        this.forEachRow(function(id) {
                    var t = this.cells(id, 0).getValue();
                    if (typeof data[t] != "undefined")
                        this.cells(id, 1).setValue(data[t])
                });
        this.callEvent("onPropertyChanged", [])
    };
    return t
}