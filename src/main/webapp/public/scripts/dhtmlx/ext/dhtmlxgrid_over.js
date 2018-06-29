dhtmlXGridObject.prototype.Mu = function(func) {
    var self = this;
    dhtmlxEvent(this.hdr, "mousemove", function(e) {
                e = e || window.event;
                var el = e.target || e.srcElement;
                if (el.tagName != "TD")
                    el = self.getFirstParentOfType(el, "TD");
                if (el && (typeof(el._cellIndex) != "undefined"))
                    func(el.parentNode.rowIndex, el._cellIndex)
            })
};
dhtmlXGridObject.prototype.Ox = function(func) {
    var self = this;
    dhtmlxEvent(this.obj, "mousemove", function(e) {
                e = e || window.event;
                var el = e.target || e.srcElement;
                if (el.tagName != "TD")
                    el = self.getFirstParentOfType(el, "TD");
                if (el && (typeof(el._cellIndex) != "undefined"))
                    func(el.parentNode.rowIndex, el._cellIndex)
            })
};