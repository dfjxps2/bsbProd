dhtmlXGridObject.prototype.setOnRowSelectHandler = function(func, anyClick) {
    this.attachEvent("onRowSelect", func);
    this._chRRS = (!convertStringToBoolean(anyClick));
};
dhtmlXGridObject.prototype.setOnScrollHandler = function(func) {
    this.attachEvent("onScroll", func);
};
dhtmlXGridObject.prototype.setOnEditCellHandler = function(func) {
    this.attachEvent("onEditCell", func);
};
dhtmlXGridObject.prototype.setOnCheckHandler = function(func) {
    this.attachEvent("onCheckbox", func);
};
dhtmlXGridObject.prototype.setOnEnterPressedHandler = function(func) {
    this.attachEvent("onEnter", func);
};
dhtmlXGridObject.prototype.setOnBeforeRowDeletedHandler = function(func) {
    this.attachEvent("onBeforeRowDeleted", func);
};
dhtmlXGridObject.prototype.setOnRowAddedHandler = function(func) {
    this.attachEvent("onRowAdded", func);
};
dhtmlXGridObject.prototype.setOnGridReconstructedHandler = function(func) {
    this.attachEvent("onGridReconstructed", func);
};
dhtmlXGridObject.prototype.setOnResize = function(func) {
    this.attachEvent("onResize", func);
};
dhtmlXGridObject.prototype.setOnBeforeSelect = function(func) {
    this.attachEvent("onBeforeSelect", func);
};
dhtmlXGridObject.prototype.setOnRowCreated = function(func) {
    this.attachEvent("onRowCreated", func);
};
dhtmlXGridObject.prototype.setOnLoadingEnd = function(func) {
    this.attachEvent("onXLE", func);
};
dhtmlXGridObject.prototype.setOnCellChanged = function(func) {
    this.attachEvent("onCellChanged", func);
};
dhtmlXGridObject.prototype.setOnLoadingStart = function(func) {
    this.attachEvent("onXLS", func);
};
dhtmlXGridObject.prototype.setOnColumnSort = function(func) {
    this.attachEvent("onBeforeSorting", func);
};
dhtmlXGridObject.prototype.setOnSelectStateChanged = function(func) {
    this.attachEvent("onSelectStateChanged", func);
};
dhtmlXGridObject.prototype.setOnRowDblClickedHandler = function(func) {
    this.attachEvent("onRowDblClicked", func);
};
dhtmlXGridObject.prototype.setOnHeaderClickHandler = function(func) {
    this.attachEvent("onHeaderClick", func);
};
dhtmlXGridObject.prototype.setOnResizeEnd = function(func) {
    this.attachEvent("onResizeEnd", func);
};
dhtmlXGridObject.prototype.setOnBeforeContextMenu = function(func) {
    this.attachEvent("onBeforeContextMenu", func);
};
dhtmlXGridObject.prototype.setOnRightClick = function(func) {
    this.attachEvent("onRightClick", func);
};
dhtmlXGridObject.prototype.setOnKeyPressed = function(func) {
    this.attachEvent("onKeyPress", func);
};
dhtmlXGridObject.prototype.setDragHandler = function(func) {
    this.attachEvent("onDrag", func);
};
dhtmlXGridObject.prototype.setDropHandler = function(func) {
    this.attachEvent("onDrop", func);
};
dhtmlXGridObject.prototype.setDragInHandler = function(func) {
    this.attachEvent("onDragIn", func);
};
dhtmlXGridObject.prototype.setOnBeforeColumnMove = function(func) {
    this.attachEvent("onBeforeCMove", func);
};
dhtmlXGridObject.prototype.setOnAfterColumnMove = function(func) {
    this.attachEvent("onAfterCMove", func);
};