/*
------------------------------------------------------------------------------
文件名称：resourceLayout.js
说    明：JavaScript脚本，菜单维护页面布局。
版    本：1.0
修改纪录:
------------------------------------------------------------------------------
时间              修改人         说明
2013-03-09      zzm         创建
------------------------------------------------------------------------------
 */
Ext.onReady(function() {
	var topMenu = [{
		text : '添加(a)',
		tooltip : '添加菜单',
		iconCls : 'add',
		handler : function() {
			var id = tree.getSelectedItemId();
			if (id == '') {
				Ext.MessageBox.alert('提示信息', '请选择一个节点,继续进行');
				return;
			}
			doAddResource(id);
		}
	}, '-', {
		text : '编辑(e)',
		tooltip : '编辑菜单',
		iconCls : 'edit',
		handler : function() {
			var id = tree.getSelectedItemId();
			if (id == '') {
				Ext.MessageBox.alert('提示信息', '请选择要编辑的节点.');
				return;
			}
			if (id == 'root')
				return;
			doEditResource(tree, id);
		}
	}, '-', {
		text : '删除(d)',
		tooltip : '删除菜单',
		iconCls : 'delete',
		handler : function() {
			var id = tree.getSelectedItemId();
			if (id == '') {
				Ext.MessageBox.alert('提示信息', '请选择要删除的节点.');
				return;
			}
			if (id == 'root')
				return;

			Ext.MessageBox.confirm("确认信息", "是否删除该菜单?", function(btn) {
				if (btn == 'yes')
					doDeleteResource(tree, id);
			});
		}
	}, '-', {
		text : '重新加载(r)',
		tooltip : '重新加载菜单',
		iconCls : 'fresh',
		handler : function() {
			reloadResource();
		}
	}];
	var viewport = new Ext.Viewport({
		layout : 'fit',
		items : [{
			xtype : 'panel',
			layout : 'border',
			border : false,
			style : 'padding:0px 4px 4px 0px;',
			items : [{
				xtype : 'panel',
				region : 'north',
				contentEl : 'north',
				tbar : topMenu,
				border : false
			}, {
				xtype : 'panel',
				region : 'center',
				contentEl : 'center',
				border : false
			}]
		}]
	});

});