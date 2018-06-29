dhtmlXGridObject.prototype.post = function(url, post, call, type) {
    this.callEvent("onXLS", [this]);
    if (arguments.length == 3 && typeof call != "function") {
        type = call;
        call = null
    };
    type = type || "xml";
    post = post || "";
    if (!this.xmlFileUrl)
        this.xmlFileUrl = url;
    this._data_type = type;
    this.xmlLoader.onloadAction = function(that, b, c, d, xml) {
        xml = that["_process_" + type](xml);
        if (!that._contextCallTimer)
            that.callEvent("onXLE", [that, 0, 0, xml]);
        if (call) {
            call();
            call = null
        }
    };
    this.xmlLoader.loadXML(url, true, post)
}