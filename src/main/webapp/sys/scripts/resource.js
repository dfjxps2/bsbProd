/*
------------------------------------------------------------------------------
文件名称：resource.js
说    明：JavaScript脚本，提供菜单添加、编辑、查看、删除方法。
版    本：1.0
修改纪录:
------------------------------------------------------------------------------
时间              修改人         说明
2013-03-09      zzm         创建
------------------------------------------------------------------------------

*/

/*
用途 ：添加菜单
输入 ：tree:菜单树; id:父节点id
返回 ： 
*/
function doAddResource(rootID) {
	var addWindow = new Ext.Window({
		title : '资源维护',
		width : 368,
		height : 218,
		minWidth : 368,
		minHeight : 218,
		plain : true,
		modal : true,
		bodyStyle : 'padding:10px;',
		layout : 'fit',
		buttonAlign : 'center',
		items : [{
			xtype : 'form',
			id : 'updatePanel',
			baseCls : 'x-plain',
			labelWidth : 75,
			url : 'resource_add.action',
			items : [{
				xtype : 'textfield',
				fieldLabel : '资源代码',
				allowBlank : false,
				name : 'resource_id',
				anchor : '100%'
			}, {
				xtype : 'textfield',
				fieldLabel : '资源名称',
				allowBlank : false,
				id : "resource_name",
				name : 'resource_name',
				anchor : '100%'
			}, {
				xtype : 'hidden',
				name : 'parent_resource_id',
				value : rootID,
				anchor : '100%'
			}, {
				xtype : 'combo',
				store : new Ext.data.SimpleStore({
					fields : ["retrunValue", "displayText"],
					data : [['normal', '普通节点'], ['tab', '分页节点']]
				}),
				valueField : "retrunValue",
				displayField : "displayText",
				mode : 'local',
				editable : false,
				forceSelection : true,
				hiddenName : 'resource_type',
				triggerAction : 'all',
				allowBlank : false,
				fieldLabel : '节点类型',
				name : 'resource_type',
				anchor : '100%'
			}, {
				xtype : 'textfield',
				fieldLabel : '节点动作',
				name : 'handler',
				anchor : '100%'
			}]
		}],
		buttons : [{
			text : '保存',
			handler : function() {
				var formPanel = Ext.getCmp("updatePanel");
				if (formPanel.form.isValid()) {
					formPanel.form.submit({
						waitMsg : '正在处理,请稍候......',
						failure : function(form, action) {
							Ext.MessageBox.alert('提示信息', action.result.info);
						},
						success : function(form, action) {
							addWindow.destroy();
							tree.insertNewItem(rootID,action.result.resourceID,action.result.resourceName, 0, 0, 0, 0,'SELECT');
							Ext.MessageBox.alert('提示信息', '保存完毕');
						}
					});
				} else {
					Ext.MessageBox.alert('提示信息', '请填写必输项');
				}
			}
		}, {
			text : '取消',
			handler : function() {
				addWindow.destroy();
			}
		}]
	});
	addWindow.on("close", function() {
		addWindow.destroy();
	});
	addWindow.show();
}

function editNode(id) {
	if (id == 'root')
		return;
	doEditResource(tree, id);
}

/*
 * 用途 ：编辑菜单 
 * 输入 ：tree:菜单树; id:节点id 
 * 返回 ：
 */
function doEditResource(tree, id) {
	var editWindow = new Ext.Window({
		title : '资源维护',
		width : 368,
		height : 218,
		minWidth : 368,
		minHeight : 218,
		plain : true,
		modal : true,
		bodyStyle : 'padding:10px;',
		layout : 'fit',
		buttonAlign : 'center',
		items : [{
			xtype : 'form',
			id : 'updatePanel',
			baseCls : 'x-plain',
			labelWidth : 75,
			url : 'resource_update.action',
			reader : new Ext.data.JsonReader({
				root : 'results'
			}, [{
				name : 'resource_id'
			}, {
				name : 'resource_name'
			}, {
				name : 'parent_resource_id'
			}, {
				name : 'handler'
			}, {
				name : 'resource_type'
			}]),
			items : [{
				xtype : 'textfield',
				fieldLabel : '资源代码',
				readOnly : true,
				allowBlank : false,
				name : 'resource_id',
				anchor : '100%'
			}, {
				xtype : 'textfield',
				fieldLabel : '资源名称',
				allowBlank : false,
				id : "resource_name",
				name : 'resource_name',
				anchor : '100%'
			}, {
				xtype : 'hidden',
				name : 'parent_resource_id',
				anchor : '100%'
			}, {
				xtype : 'combo',
				store : new Ext.data.SimpleStore({
					fields : ["retrunValue", "displayText"],
					data : [['normal', '普通节点'], ['tab', '分页节点']]
				}),
				valueField : "retrunValue",
				displayField : "displayText",
				mode : 'local',
				forceSelection : true,
				hiddenName : 'resource_type',
				triggerAction : 'all',
				allowBlank : false,
				fieldLabel : '节点类型',
				name : 'resource_type',
				anchor : '100%'
			}, {
				xtype : 'textfield',
				fieldLabel : '节点动作',
				name : 'handler',
				anchor : '100%'
			}]
		}],
		buttons : [{
			text : '保存',
			handler : function() {
				var formPanel = Ext.getCmp("updatePanel");
				if (formPanel.form.isValid()) {
					formPanel.form.submit({
						waitMsg : '正在处理,请稍候......',
						failure : function(form, action) {
							Ext.MessageBox.alert('提示信息', action.result.info);
						},
						success : function(form, action) {
							var rname = Ext.getCmp("resource_name").getValue();
							editWindow.destroy();
							tree.setItemText(id, rname);
							Ext.MessageBox.alert('提示信息', '保存完毕');
						}
					});
				} else {
					Ext.MessageBox.alert('提示信息', '请填写必输项');
				}
			}
		}, {
			text : '取消',
			handler : function() {
				editWindow.destroy();
			}
		}]
	});
	var p = Ext.getCmp("updatePanel");
	p.form.load({
		url : 'resource_findById.action',
		params : {
			resource_id : id
		}
	});
	editWindow.on("close", function() {
		editWindow.destroy();
	});
	editWindow.show();
}

/*
 * 用途 ： 删除菜单 
 * 输入 ： tree:菜单树; id:节点id 
 * 返回 ： null
 */
function doDeleteResource(tree, id) {
	Ext.Ajax.request({
		url : pathUrl + '/resource_remove.action',
		params : {
			resource_id : id
		},
		method : 'POST',
		callback : function(options, success, response) {
			var json = Ext.util.JSON.decode(response.responseText);
			if (json.success) {
				tree.deleteItem(id);
			} else {
				Ext.MessageBox.alert('提示信息', json.info);
			}
		}
	});

}

/*
用途 ： 重新加载菜单
输入 ： null
返回 ： 菜单树所需的XML字符串
*/
function reloadResource() {
	Ext.Ajax.request({
		url : pathUrl + '/resource_reload.action',
		params : {
			resource_id : id
		},
		method : 'POST',
		callback : function(options, success, response) {
			var json = Ext.util.JSON.decode(response.responseText);
			if (json.success) {
				location.reload();
			} else {
				Ext.MessageBox.alert('提示信息', json.info);
			}
		}
	});
}