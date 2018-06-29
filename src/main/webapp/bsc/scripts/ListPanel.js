ListPanel = function(obj) {
	var id = '';
	if(obj.id != undefined)
		id = obj.id;
	else
		id = new Date().getTime();
	
	ListPanel.superclass.constructor.call(this, {
		region : 'center',
		rootVisible : false,
		lines : false,
		id : id,
		autoScroll : true,
		border : false,
		root : new Ext.tree.TreeNode('ListPanel')
	});
};

Ext.extend(ListPanel, Ext.tree.TreePanel, {
	addCategoryNode : function(id, text, fn) {
		var node = new Ext.tree.TreeNode({
			id : id,
			text : text,
			cls : 'category-node',
			leaf : false
		});
		if (fn != undefined) {
			node.appendChild(new Ext.tree.TreeNode({
				text : 'loading',
				cls : 'x-tree-node-loading',
				leaf : true
			}));
			node.on('expand', fn);
		}
		this.root.appendChild(node);
	},

	addLeafNode : function(categoryID, id, text) {
		var p = this.root.findChild('id', categoryID);
		p.appendChild(new Ext.tree.TreeNode({
					id : id,
					text : text,
					leaf : true
				}));
	}
});