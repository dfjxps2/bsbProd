/*
------------------------------------------------------------------------------
文件名称：resourceLayout.js
说    明：JavaScript脚本,BSC考核维度维护页面布局。
版    本：1.0
修改纪录:
------------------------------------------------------------------------------
时间              修改人         说明
2013-03-09      zzm         创建
------------------------------------------------------------------------------
 */
Ext.onReady(function() {
	var topMenu = [{
		id : 'addmenu',
		text : '添加(a)',
		tooltip : '添加新战略元素',
		iconCls : 'add',
		disabled : true,
		handler : function() {
			var id = tree.getSelectedItemId();
			if (id == '') {
				Ext.MessageBox.alert('提示信息', '请选择一个节点,继续进行');
				return;
			}
			if(level_id=='2'){
				Ext.MessageBox.alert('提示信息', '所选节点已是最下级节点，不可继续添加子节点');
				return;
			}
			doAddResource(id);
		}
	}, '-', {
		id : 'editmenu',
		text : '编辑(e)',
		tooltip : '编辑战略',
		disabled : true,
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
		id : 'deletemenu',
		text : '删除(d)',
		tooltip : '删除战略',
		disabled : true,
		iconCls : 'delete',
		handler : function() {
			var id = tree.getSelectedItemId();
			if (id == '') {
				Ext.MessageBox.alert('提示信息', '请选择要删除的战略元素.');
				return;
			}
			if (id == 'root')
				return;
			if(childsAmount!=0){
				Ext.Msg.alert("提示信息","不是最下级节点,不能进行删除");
				return ;
			}
			Ext.MessageBox.confirm("确认信息", "是否删除该战略?", function(btn) {
				if (btn == 'yes')
					doDeleteResource(tree, id);
			});
		}
	}, '-', {
		text : '刷新(r)',
		tooltip : '重新加载战略树',
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

function setAddText(levelId) {
	var text = ""
	if(levelId == 'root') {
		text = "添加战略维度(a)";
	}else if(levelId == '0') {
		text = "添加战略举措(a)";
		Ext.getCmp("deletemenu").setDisabled(true);
		Ext.getCmp("editmenu").setDisabled(true);
	}else if(levelId == '1') {
		text = "添加战略重点(a)";
	}else if(levelId == '2') {
		text = "添加(a)";
	}
	Ext.getCmp("addmenu").setText(text);
	Ext.getCmp("addmenu").setDisabled(levelId == '2' || levelId == 'root' || levelId == '1')
}