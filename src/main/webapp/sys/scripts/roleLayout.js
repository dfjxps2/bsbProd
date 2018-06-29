/*
------------------------------------------------------------------------------
文件名称：roleLayout.js
说    明：JavaScript脚本，提供菜单添加、编辑、查看、删除方法。
版    本：1.0
修改纪录:
------------------------------------------------------------------------------
时间              修改人         说明
2013-03-09      zzm         创建
------------------------------------------------------------------------------

*/

/*
用途 ：角色、菜单维护界面
*/
Ext.onReady(function() {
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [{
			xtype : 'panel',
			region : 'north',
			contentEl : 'north',
			tbar : [{
				text : '保存(s)',
				tooltip : '保存角色与菜单对应关系',
				iconCls : 'save',
				handler : function() {
					var resources = tree.getAllChecked();
					if (selectRoleID == '') {
						alert("请选择一条角色记录");
						return;
					}
					Ext.Ajax.request({
						url : pathUrl + '/role_updateRoleResource.action',
						params : {
							role_id : selectRoleID,
							resource_ids : resources
						},
						method : 'POST',
						callback : function(options, success, response) {
							var json = Ext.util.JSON.decode(response.responseText);
							if (json.success) {
								Ext.MessageBox.alert('提示信息', json.info);
							} else {
								Ext.MessageBox.alert('提示信息', json.info);
							}
						}
					});
				}
			}],
			border : false
		}, {
			xtype : 'panel',
			region : 'center',
			contentEl : 'center',
			border : false
		}]
	});
});
