/*
------------------------------------------------------------------------------
文件名称：roleList.js
说    明：JavaScript脚本，提供菜单添加、编辑、查看、删除方法。
版    本：1.0
修改纪录:
------------------------------------------------------------------------------
时间              修改人         说明
2013-03-09      zzm         创建
------------------------------------------------------------------------------

*/

/*
用途 ：添加角色
*/
function addRole(store) {
	if (addWindow != null || editWindow != null)
		return;
	addWindow = new Ext.Window({
		title : '添加角色',
		layout : 'fit',
		border : false,
		split : false,
		modal : true,
		width : 340,
		height : 120,
		buttonAlign : 'center',
		items : [{
			xtype : 'form',
			id : 'addFormPanel',
			layout : 'form',
			url : pathUrl + '/role_add.action',
			border : false,
			bodyStyle : 'padding:5px,5px,5px,15px;',
			split : false,
			labelWidth : 60,
			frame : true,
			items : [{
				xtype : 'textfield',
				name : 'bank_org_id',
				value : bank_org_id,
				anchor : '91%',
				hidden : true
			}, {
				xtype : 'textfield',
				name : 'role_name',
				allowBlank : false,
				fieldLabel : '角色名',
				anchor : '91%'
			}]
		}],
		buttons : [{
			text : '添加',
			handler : function() {
				var formPanel = Ext.getCmp("addFormPanel");
				if (formPanel.form.isValid()) {
					formPanel.form.submit({
						waitMsg : '正在处理,请稍候......',
						failure : function(form, action) {
							Ext.MessageBox.alert('错误', action.result.info);
						},
						success : function(form, action) {
							store.reload();
							addWindow.destroy();
							addWindow = null;
						}
					});
				} else {
					Ext.Msg.alert("提示信息", "请填写必输项");
				}
			}
		}, {
			text : '取消',
			handler : function() {
				addWindow.destroy();
				addWindow = null;
			}
		}]
	});
	addWindow.on("close", function() {
		addWindow.destroy();
		addWindow = null;
	});
	addWindow.show();
}

/*
用途 ：修改角色
*/
function editRole(roleID, store) {
	if (addWindow != null || editWindow != null)
		return;
	editWindow = new Ext.Window({
		title : '修改角色',
		layout : 'fit',
		border : false,
		split : false,
		modal : true,
		width : 340,
		height : 120,
		buttonAlign : 'center',
		items : [{
			xtype : 'form',
			id : 'editFormPanel',
			border : false,
			bodyStyle : 'padding:5px,5px,5px,15px;',
			split : false,
			labelWidth : 60,
			layout : 'form',
			url : pathUrl + '/role_modify.action',
			reader : new Ext.data.JsonReader({
				root : 'results'
			}, [{
				name : 'role_id'
			}, {
				name : 'role_name'
			}]),
			border : false,
			split : false,
			frame : true,
			items : [{
				xtype : 'textfield',
				name : 'role_id',
				readOnly : true,
				anchor : '91%',
				hidden : true
			}, {
				xtype : 'textfield',
				name : 'role_name',
				allowBlank : false,
				fieldLabel : '角色名',
				anchor : '91%'
			}]
		}],
		buttons : [{
			text : '确定',
			handler : function() {
				var formPanel = Ext.getCmp("editFormPanel");
				if (formPanel.form.isValid()) {
					formPanel.form.submit({
						waitMsg : '正在处理,请稍候......',
						failure : function(form, action) {
							Ext.MessageBox.alert('提示信息', action.result.info);
						},
						success : function(form, action) {
							Ext.MessageBox.alert('提示信息', action.result.info);
							store.reload();
							editWindow.destroy();
							editWindow = null;
						}
					});
				} else {
					Ext.Msg.alert("提示信息", "请填写必输项");
				}
			}
		}, {
			text : '取消',
			handler : function() {
				editWindow.destroy();
				editWindow = null;
			}
		}]
	});
	var p = Ext.getCmp("editFormPanel");
	p.form.load({
		url : pathUrl + '/role_listById.action',
		params : {
			role_id : roleID
		}
	});
	editWindow.on("close", function() {
		editWindow.destroy();
		editWindow = null;
	});
	editWindow.show();
}

/*
用途 ：删除角色
*/
function removeRole(id, store) {
	if (editWindow != null || addWindow != null)
		return;
	Ext.Ajax.request({
		url : pathUrl + '/role_remove.action',
		params : {
			role_id : id
		},
		method : 'POST',
		callback : function(options, success, response) {
			var json = Ext.util.JSON.decode(response.responseText);
			if (json.success) {
				Ext.MessageBox.alert('提示信息', json.info);
				store.reload();
				doSelectRole("");
			} else {
				Ext.MessageBox.alert('提示信息', json.info);
			}
		}
	});

}

/*
用途 ：角色、菜单跳转
*/
function doSelectRole(roleID) {
	document.roleTreeForm.action = pathUrl
			+ "/resource_checkResource.action?role_id=" + roleID;
	document.roleTreeForm.submit();
}