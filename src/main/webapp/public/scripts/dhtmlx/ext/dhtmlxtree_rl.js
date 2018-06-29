dhtmlXTreeObject.prototype.enableRTL = function(mode) {
    var z = convertStringToBoolean(mode);
    if (((z) && (!this.Sq)) || ((!z) && (this.Sq))) {
        this.Sq = z;
        this.WT(this.Sq)
    }
};
dhtmlXTreeObject.prototype.WT = function(mode) {
    if (mode) {
        this.allTree.className = this.adT = this.lineArray;
        this.agv = this.minusArray;
        this.adt = this.plusArray;
        this.lineArray = new Array("line2_rtl.gif", "line3_rtl.gif", "line4_rtl.gif", "blank.gif", "blank.gif", "line1_rtl.gif");
        this.minusArray = new Array("minus2_rtl.gif", "minus3_rtl.gif", "minus4_rtl.gif", "minus.gif", "minus5_rtl.gif");
        this.plusArray = new Array("plus2_rtl.gif", "plus3_rtl.gif", "plus4_rtl.gif", "plus.gif", "plus5_rtl.gif");
        this.allTree.className = "containerTableStyleRTL"
    } else {
        this.allTree.className = "containerTableStyle";
        this.lineArray = this.adT;
        this.minusArray = this.agv;
        this.plusArray = this.adt
    };
    if (this.htmlNode.childsCount)
        this._redrawFrom(this, this.htmlNode)
};