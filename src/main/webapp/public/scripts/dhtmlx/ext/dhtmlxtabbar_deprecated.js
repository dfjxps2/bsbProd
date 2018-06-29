dhtmlXTabBar.prototype.setOnLoadingEnd = function(func) {
    this.attachEvent("onXLE", func)
};
dhtmlXTabBar.prototype.setOnTabContentLoaded = function(func) {
    this.attachEvent("onTabContentLoaded", func)
};
dhtmlXTabBar.prototype.setOnTabClose = function(func) {
    this.attachEvent("onTabClose", func)
};
dhtmlXTabBar.prototype.setOnSelectHandler = function(func) {
    this.attachEvent("onSelect", func)
}