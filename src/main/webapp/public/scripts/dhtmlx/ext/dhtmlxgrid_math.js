function eXcell_math(cell) {
    if (cell) {
        this.cell = cell;
        this.grid = this.cell.parentNode.grid
    };
    this.edit = function() {
        this.grid.editor = new eXcell_ed(this.cell);
        this.grid.editor.getValue = function() {
            return this.cell.original
        };
        this.grid.editor.setValue = this.setValue;
        this.grid.editor.edit()
    };
    this.isDisabled = function() {
        return !this.grid.DI
    };
    this.setValue = function(val) {
        val = this.grid._compileSCL(val, this.cell);
        if (this.grid._strangeParams[this.cell._cellIndex])
            this.grid.cells5(this.cell, this.grid._strangeParams[this.cell._cellIndex]).setValue(val);
        else {
            this.setCValue(val);
            this.cell._clearCell = false
        }
    };
    this.getValue = function() {
        if (this.grid._strangeParams[this.cell._cellIndex])
            return this.grid.cells5(this.cell, this.grid._strangeParams[this.cell._cellIndex]).getValue();
        return this.cell.innerHTML
    }
};
eXcell_math.prototype = new eXcell;
dhtmlXGridObject.prototype._init_point_bm = dhtmlXGridObject.prototype._init_point;
dhtmlXGridObject.prototype._init_point = function() {
    this._mat_links = {};
    this._aggregators = [];
    this.attachEvent("onClearAll", function() {
                this._mat_links = {};
                this._aggregators = []
            });
    this.attachEvent("onCellChanged", function(id, ind) {
                if (this._mat_links[id]) {
                    var cell = this._mat_links[id][ind];
                    if (cell) {
                        for (var i = 0; i < cell.length; i++)
                            this.cells5(cell[i]).setValue(this.rO(cell[i]))
                    }
                };
                if (!this._parsing && this._aggregators[ind]) {
                    var pid = this._h2.get[id].parent.id;
                    if (pid != 0) {
                        var ed = this.cells(pid, ind);
                        ed.setValue(this.rO(ed.cell))
                    }
                }
            });
    this.attachEvent("onAfterRowDeleted", function(id, pid) {
                if (pid != 0)
                    if (!this._parsing && this._aggregators.length) {
                        for (var ind = 0; ind < this._aggregators.length; ind++) {
                            if (this._aggregators[ind]) {
                                var ed = this.cells(pid, ind);
                                ed.setValue(this.rO(ed.cell))
                            }
                        }
                    };
                return true
            });
    this.attachEvent("onXLE", function() {
                for (var i = 0; i < this._aggregators.length; i++) {
                    if (this._aggregators[i])
                        this._h2.forEachChild(0, function(el) {
                                    if (el.childs.length != 0) {
                                        var ed = this.cells(el.id, i);
                                        ed.setValue(this.rO(ed.cell))
                                    }
                                }, this)
                }
            });
    this._init_point = this._init_point_bm;
    if (this._init_point)
        this._init_point()
};
dhtmlXGridObject.prototype.enableMathSerialization = function(status) {
    this._mathSerialization = convertStringToBoolean(status)
};
dhtmlXGridObject.prototype.setMathRound = function(Ki) {
    this.FR = Ki;
    this.HO = Math.pow(10, Ki)
};
dhtmlXGridObject.prototype.enableMathEditing = function(status) {
    this.DI = convertStringToBoolean(status)
};
dhtmlXGridObject.prototype.rO = function(cell) {
    if (!cell._code)
        return cell.innerHTML;
    try {
        var agrid = this;
        var z = eval(cell._code)
    } catch (e) {
        return ("#SCL")
    };
    if (this.HO) {
        var pre = Math.abs(z) < 1 ? "0" : "";
        z = Math.round(z * this.HO).toString();
        if (z == 0)
            return 0;
        if (this.FR > 0) {
            var n = z.length - this.FR;
            if (n < 0) {
                z = ("000000000" + z).substring(9 + n);
                n = 0
            };
            return (pre + z.substring(0, n) + "." + z.substring(n, z.length))
        }
    };
    return z
};
dhtmlXGridObject.prototype._countTotal = function(row, cell) {
    var b = 0;
    var z = this._h2.get[row];
    for (var i = 0; i < z.childs.length; i++) {
        if (!z.childs[i].buff)
            return b;
        if (z.childs[i].buff._parser) {
            this._h2.forEachChild(row, function(el) {
                        if (el.childs.length == 0)
                            b += this._get_cell_value(el.buff, cell) * 1
                    }, this);
            return b
        };
        b += this._get_cell_value(z.childs[i].buff, cell) * 1
    };
    return b
};
dhtmlXGridObject.prototype._compileSCL = function(code, cell) {
    if (!code)
        return code;
    code = code.toString();
    if (code.indexOf("=") != 0) {
        this.CL([], cell);
        return code
    };
    cell.original = code;
    var qL = null;
    code = code.replace("=", "");
    if (code.indexOf("sum") != -1) {
        code = code.replace("sum", "(agrid._countTotal('" + cell.parentNode.idd + "'," + cell._cellIndex + "))");
        if (!this._aggregators)
            this._aggregators = [];
        this._aggregators[cell._cellIndex] = "sum";
        cell._code = code;
        return this._parsing ? "" : this.rO(cell)
    };
    if (code.indexOf("[[") != -1) {
        var test = /(\[\[([^\,]*)\,([^\]]*)]\])/g;
        var agrid = this;
        qL = qL || (new Array());
        code = code.replace(test, function($0, $1, $2, $3) {
                    if ($2 == "-")
                        $2 = cell.parentNode.idd;
                    if ($2.indexOf("#") == 0)
                        $2 = agrid.getRowId($2.replace("#", ""));
                    qL[qL.length] = [$2, $3];
                    return "(agrid.cells(\"" + $2 + "\"," + $3 + ").getValue()*1)"
                })
    };
    if (code.indexOf(":") != -1) {
        var test = /:(\w+)/g;
        var agrid = this;
        var id = cell.parentNode.idd;
        qL = qL || (new Array());
        code = code.replace(test, function($0, $1, $2, $3) {
                    qL[qL.length] = [id, agrid.getColIndexById($1)];
                    return '(agrid.cells("' + id + '",agrid.getColIndexById("' + $1 + '")).getValue()*1)'
                })
    } else {
        var test = /c([0-9]+)/g;
        var agrid = this;
        var id = cell.parentNode.idd;
        qL = qL || (new Array());
        code = code.replace(test, function($0, $1, $2, $3) {
                    qL[qL.length] = [id, $1];
                    return "(agrid.cells(\"" + id + "\"," + $1 + ").getValue()*1)"
                })
    };
    this.CL(qL, cell);
    cell._code = code;
    return this.rO(cell)
};
dhtmlXGridObject.prototype.CL = function(ar, cell) {
    if (!ar.length)
        return;
    for (var i = 0; i < ar.length; i++) {
        if (!this._mat_links[ar[i][0]])
            this._mat_links[ar[i][0]] = {};
        var t = this._mat_links[ar[i][0]];
        if (!t[ar[i][1]])
            t[ar[i][1]] = [];
        t[ar[i][1]].push(cell)
    }
};
if (_isKHTML) {
    (function() {
        var wi = String.prototype.replace;
        String.prototype.replace = function(search, replace) {
            if (typeof replace != "function") {
                return wi.apply(this, arguments)
            };
            var str = "" + this;
            var callback = replace;
            if (!(search instanceof RegExp)) {
                var idx = str.indexOf(search);
                return (idx == -1 ? str : wi.apply(str, [search, callback(search, idx, str)]))
            };
            var reg = search;
            var result = [];
            var yS = reg.lastIndex;
            var re;
            while ((re = reg.exec(str)) != null) {
                var idx = re.index;
                var args = re.concat(idx, str);
                result.push(str.slice(yS, idx), callback.apply(null, args).toString());
                if (!reg.global) {
                    yS += RegExp.lastMatch.length;
                    break
                } else {
                    yS = reg.lastIndex
                }
            };
            result.push(str.slice(yS));
            return result.join("")
        }
    })()
};