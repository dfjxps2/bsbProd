/*
------------------------------------------------------------------------------
文件名称：roleListLayout.js
说    明：JavaScript脚本，角色维护页面布局。
版    本：1.0
修改纪录:
------------------------------------------------------------------------------
时间              修改人         说明
2013-03-09      zzm         创建
------------------------------------------------------------------------------
 */
Ext.onReady(function() {
	var store = new Ext.data.Store({
		proxy : new Ext.data.HttpProxy({
			url : pathUrl + '/role_list.action?bank_org_id='+bank_org_id
		}),
		reader : new Ext.data.JsonReader({
			root : 'results'
		}, [{
			name : 'role_id'
		}, {
			name : 'role_name'
		}])
	});
	var menubar = [{
		text : '添加(a)',
		tooltip : '添加角色',
		iconCls : 'add',
		handler : function() {
			addRole(store);
		}
	}, '-', {
		text : '修改(e)',
		tooltip : '修改角色',
		iconCls : 'edit',
		handler : function() {
			var g = Ext.getCmp("gridPanel");
			if (g.getSelectionModel().getSelections().length == 0) {
				Ext.MessageBox.alert("提示信息", "请选择一条记录");
				return;
			}
			editRole(g.getSelectionModel().getSelections()[0].get("role_id"), store);
		}
	}, '-', {
		text : '删除(s)',
		tooltip : '删除角色',
		iconCls : 'delete',
		handler : function() {
			var g = Ext.getCmp("gridPanel");
			if (g.getSelectionModel().getSelections().length == 0) {
				Ext.MessageBox.alert("提示信息", "请选择一条记录");
				return;
			}
			Ext.MessageBox.confirm("确认信息", "是否删除该角色?", function(btn) {
				if (btn == 'yes')
					removeRole(g.getSelectionModel().getSelections()[0].get("role_id"), store);
			});
		}
	}];
	var viewport = new Ext.Viewport({
		layout : 'fit',
		items : [{
			xtype : 'panel',
			layout : 'border',
			border : false,
			items : [{
				xtype : 'grid',
				id : 'gridPanel',
				region : 'west',
				width : 240,
				title : '角色列表',
				style : 'padding:4px 4px 4px 0px;',
				tbar : menubar,
				split : true,
				frame : false,
				autoScroll : true,
				viewConfig : {
					forceFit : true
				},
				ds : store,
				cm : new Ext.grid.ColumnModel([
//					{
//					header : '角色ID',
//					dataIndex : 'role_id',
//					align : 'center'
//				}, 
					{
					header : '角色名',
					dataIndex : 'role_name',
					align : 'center'
				}])
			}, {
				xtype : 'panel',
				region : 'center',
				style : 'padding:4px 0px 4px 4px;',
				layout : 'border',
				border : false,
				items : [{
					xtype : 'panel',
					region : 'center',
					contentEl : 'center',
					border : false,
					frame : false,
					split : false,
					resizeEl : 'center-iframe'
				}]
			}]
		}]
	});
	store.load();
	Ext.getCmp("gridPanel").getSelectionModel().on("rowselect",
			function(sm, index, record) {
				doSelectRole(record.get('role_id'));
			});
});
