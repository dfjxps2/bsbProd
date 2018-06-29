

document.write("<link rel='stylesheet' type='text/css' href='" + _css_prefix + "excells/dhtmlxgrid_calc.css'></link>");
function eXcell_calck(cell) {
    try {
        this.cell = cell;
        this.grid = this.cell.parentNode.grid
    } catch (er) {
    };
    this.edit = function() {
        this.val = this.getValue();
        var arPos = this.grid.getPosition(this.cell);
        this.obj = new calcX(arPos[0], arPos[1] + this.cell.offsetHeight, this, this.val)
    };
    this.getValue = function() {
        return this.grid._aplNFb(this.cell.innerHTML.toString()._dhx_trim(), this.cell._cellIndex)
    };
    this.detach = function() {
        if (this.obj) {
            this.setValue(this.obj.uy.value);
            this.obj.IA()
        };
        this.obj = null;
        return this.val != this.getValue()
    }
};
eXcell_calck.prototype = new eXcell;
eXcell_calck.prototype.setValue = function(val) {
    if (!val || val.toString()._dhx_trim() == "")
        val = "0";
    this.setCValue(this.grid._aplNF(val, this.cell._cellIndex), val)
};
function calcX(left, top, uk, val) {
    this.top = top || 0;
    this.left = left || 0;
    this.uk = uk || null;
    this.operandA = 0;
    this.operandB = 0;
    this.operatorA = "";
    this.state = 0;
    this.uj = 0;
    this.DD = function() {
        return (eval(this.operandA + "*1" + this.operatorA + this.operandB + "*1"))
    };
    this.yx = function(str) {
        return ((str.search(/[^1234567890]/gi) == -1) ? (true) : (false))
    };
    this.wU = function(str) {
        return ((str.search(/[^\+\*\-\/]/gi) == -1) ? (true) : (false))
    };
    this.onCalcKey = function(e) {
        that = this.Lp;
        var z = this.innerHTML;
        var qj = that.uy;
        if (((that.state == 0) || (that.state == 2)) && (that.yx(z)))
            if (qj.value != "0")
                qj.value += z;
            else
                qj.value = z;
        if ((((that.state == 0) || (that.state == 2)) && (z == '.')) && (that.uj == 0)) {
            that.uj = 1;
            qj.value += z
        };
        if ((z == "dhtmlXTreeObject")) {
            qj.value = 0;
            that.uj = 0;
            that.state = 0
        };
        if ((that.state == 0) && (that.wU(z))) {
            that.operatorA = z;
            that.operandA = qj.value;
            that.state = 1
        };
        if ((that.state == 2) && (that.wU(z))) {
            that.operandB = qj.value;
            qj.value = that.DD();
            that.operatorA = z;
            that.operandA = qj.value;
            that.state = 1
        };
        if ((that.state == 2) && (z == "=")) {
            that.operandB = qj.value;
            qj.value = that.DD();
            that.operatorA = z;
            that.operandA = qj.value;
            that.state = 3
        };
        if ((that.state == 1) && (that.yx(z))) {
            qj.value = z;
            that.state = 2;
            that.uj = 0
        };
        if ((that.state == 3) && (that.yx(z))) {
            qj.value = z;
            that.state = 0
        };
        if ((that.state == 3) && (that.wU(z))) {
            that.operatorA = z;
            that.operandA = qj.value;
            that.state = 1
        };
        if (z == "e") {
            qj.value = Math.E;
            if (that.state == 1)
                that.state = 2;
            that.uj = 0
        };
        if (z == "p") {
            qj.value = Math.PI;
            if (that.state == 1)
                that.state = 2;
            that.uj = 0
        };
        if (z == "Off")
            that.ab.parentNode.removeChild(that.ab);
        if (e || event)
            (e || event).cancelBubble = true
    };
    this.IF = function() {
        that = this.Lp;
        if (that.state == 2) {
            var qj = that.uy;
            that.operandB = qj.value;
            qj.value = that.DD();
            that.operatorA = z;
            that.operandA = qj.value;
            that.state = 3
        };
        var z = that.uy.value;
        that.ab.parentNode.removeChild(that.ab);
        that.uk.grid.editStop(false)
    };
    this.IA = function() {
        if (this.ab.parentNode)
            this.ab.parentNode.removeChild(this.ab)
    };
    this.Nc = function() {
        this.className = "calcPressed"
    };
    this.Mf = function() {
        this.className = "calcButton"
    };
    this.Jj = function() {
        var table = this.ab.childNodes[0];
        if ((!table) || (table.tagName != "TABLE"))
            return;
        for (i = 1; i < table.childNodes[0].childNodes.length; i++)
            for (j = 0; j < table.childNodes[0].childNodes[i].childNodes.length; j++) {
                table.childNodes[0].childNodes[i].childNodes[j].onclick = this.onCalcKey;
                table.childNodes[0].childNodes[i].childNodes[j].onmousedown = this.Nc;
                table.childNodes[0].childNodes[i].childNodes[j].onmouseout = this.Mf;
                table.childNodes[0].childNodes[i].childNodes[j].onmouseup = this.Mf;
                table.childNodes[0].childNodes[i].childNodes[j].Lp = this
            };
        this.uy = this.ab.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0];
        if (this.uk) {
            this.ab.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].onclick = this.IF;
            this.ab.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].Lp = this
        } else
            this.ab.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].innerHTML = ""
    };
    this.Lw = function() {
        var div = document.createElement("div");
        div.className = "calcTable";
        div.style.position = "absolute";
        div.style.top = this.top + "px";
        div.style.left = this.left + "px";
        div.innerHTML = "<table cellspacing='0' id='calc_01' class='calcTable'><tr><td colspan='4'><table cellpadding='1' cellspacing='0' width='100%'><tr><td width='100%' style='overflow:hidden;'><input style='width:100%' class='calcInput' value='0' align='right' readonly='true' style='text-align:right'></td><td class='calkSubmit'>=</td></tr></table></td></tr><tr><td class='calcButton' width='25%'>Off</td><td class='calcButton' width='25%'>p</td><td class='calcButton' width='25%'>e</td><td class='calcButton' width='25%'>/</td></tr><tr><td class='calcButton'>7</td><td class='calcButton'>8</td><td class='calcButton'>9</td><td class='calcButton'>*</td></tr><tr><td class='calcButton'>4</td><td class='calcButton'>5</td><td class='calcButton'>6</td><td class='calcButton'>+</td></tr><tr><td class='calcButton'>1</td><td class='calcButton'>2</td><td class='calcButton'>3</td><td class='calcButton'>-</td></tr><tr><td class='calcButton'>0</td><td class='calcButton'>.</td><td class='calcButton'>dhtmlXTreeObject</td><td class='calcButton'>=</td></tr></table>";
        div.onclick = function(e) {
            (e || event).cancelBubble = true
        };
        document.body.appendChild(div);
        this.ab = div
    };
    this.Lw();
    this.Jj();
    if (val) {
        var qj = this.uy;
        qj.value = val * 1;
        this.operandA = val * 1;
        this.state = 3
    };
    return this
};