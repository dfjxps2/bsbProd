Ext.namespace('Ext.ux');
Ext.ux.ImageButton = function(cfg) {
	Ext.ux.ImageButton.superclass.constructor.call(this, cfg);
};
Ext.extend(Ext.ux.ImageButton, Ext.Button, {
	onRender : function(ct, position) {
		this.disabledImgPath = this.disabledImgPath || this.imgPath;
		var tplHTML = '<div><img src="{imgPath}" mce_src="{imgPath}" border="0" width="{imgWidth}" height="{imgHeight}" alt="{tooltip}" style="cursor: {cursor};" mce_style="cursor: {cursor};"/> {imgText:htmlEncode}<br/><br/></div>';
		var tpl = new Ext.Template(tplHTML);
		var btn, targs = {
			imgPath : this.disabled ? this.disabledImgPath : this.imgPath,
			imgWidth : this.imgWidth || "",
			imgHeight : this.imgHeight || "",
			imgText : this.text || "",
			cursor : this.disabled ? "default" : "pointer",
			tooltip : this.tooltip || ""
		};
		btn = tpl.append(ct, targs, true);
		btn.on("click", this.onClick, this);
		if (this.cls) {
			btn.addClass(this.cls);
		}
		this.el = btn;
		if (this.hidden) {
			this.hide();
		}
	},
	disable : function(newImgPath) {
		var replaceImgPath = newImgPath || this.disabledImgPath;
		if (replaceImgPath)
			this.el.dom.firstChild.src = replaceImgPath;
		this.disabled = true;
	},
	enable : function(newImgPath) {
		var replaceImgPath = newImgPath || this.imgPath;
		if (replaceImgPath)
			this.el.dom.firstChild.src = replaceImgPath;
		this.disabled = false;
	}
});
Ext.reg('imagebutton', Ext.ux.ImageButton);