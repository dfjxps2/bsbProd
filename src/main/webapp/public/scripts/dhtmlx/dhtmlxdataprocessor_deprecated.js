dataProcessor.prototype.setOnAfterUpdate = function(ev) {
    this.attachEvent("onAfterUpdate", ev)
};
dataProcessor.prototype.enableDebug = function(mode) {
};
dataProcessor.prototype.setOnBeforeUpdateHandler = function(func) {
    this.attachEvent("onBeforeDataSending", func)
};