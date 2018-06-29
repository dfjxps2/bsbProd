/*
------------------------------------------------------------------------------
文件名称：resource.js
说    明：JavaScript脚本，提供维度添加、编辑、查看、删除方法。
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
Ext.form.Field.prototype.msgTarget = 'under';
var idExist = false,nameExist = false;
function doAddResource(rootID) {
	if (editWindow != null || addWindow != null)
		return;
	addWindow = new Ext.Window({
		title : '添加新战略元素',
		width : 368,
		height : 230,
		plain : true,
		modal : true,
		bodyStyle : 'padding:10px;',
		layout : 'fit',
		buttonAlign : 'center',
		items : [{
			xtype : 'form',
			id : 'addPanel',
			baseCls : 'x-plain',
			labelWidth : 75,
			url : pathUrl + '/bscdim_common.action?method=addBscKpiDim',
			reader : new Ext.data.JsonReader({
				root : 'results'},
				[{
					name : 'strategy_id'
				}]),
			items : [{
				xtype : 'textfield',
				fieldLabel : '战略代码',
				allowBlank : false,
				name : 'strategy_id',
				id : 'strategy_id',
				anchor : '100%',
				listeners : {
					blur : function() {
						var field = Ext.getCmp("strategy_id");
						if (field.validate()) {
							Ext.Ajax.request({

								url : pathUrl + '/bscdim_common.action?method=checkExist',
								params : {
									strategy_id : Ext.getCmp('strategy_id').getValue()
								},
								method : 'POST',
								callback : function(options,request,response){
									var json = Ext.util.JSON.decode(response.responseText);
									if(json.success){
										idExist = false;
									}else{
										idExist = true;
										field.markInvalid(json.info);
									}
									if(idExist || nameExist){
										Ext.getCmp('save').setDisabled(true);
									}else{
										Ext.getCmp('save').setDisabled(false);
									}
								}
							})
						}
					}
				}
			}, {
				xtype : 'textfield',
				fieldLabel : '战略名称',
				allowBlank : false,
				id : "strategy_name",
				name : 'strategy_name',
				anchor : '100%',
				listeners : {
					blur : function() {
						var field = Ext.getCmp("strategy_name");
						if (field.validate()) {
							Ext.Ajax.request({

								url : pathUrl + '/bscdim_common.action?method=checkExist',
								params : {
									strategy_name : Ext.getCmp('strategy_name').getValue()
								},
								method : 'POST',
								callback : function(options,request,response){
									var json = Ext.util.JSON.decode(response.responseText);
									if(json.success){
										nameExist = false;
									}else{
										nameExist = true;
										field.markInvalid(json.info);
									}
									if(idExist || nameExist){
										Ext.getCmp('save').setDisabled(true);
									}else{
										Ext.getCmp('save').setDisabled(false);
									}
								}
							})
						}
					}
				}
			}, {
				xtype : 'spinnerfield',
				fieldLabel : '排序序号',
				allowBlank : false,
				minValue: 0,
            	maxValue: 20,
				id : "inner_order_id",
				name : 'inner_order_id',
				anchor : '100%'
			}, {
				xtype : 'hidden',
				name : 'parent_strategy_id',
				value : rootID,
				anchor : '100%'
			}, {
				xtype : 'hidden',
				name : 'level_id',
				value : child_level_id,
				anchor : '100%'
			}]
		}],
		buttons : [{
			text : '保存',
			id : 'save',
			handler : function() {
				var formPanel = Ext.getCmp("addPanel");
				var strategy_id = Ext.getCmp("strategy_id").getValue();
				var strategy_name = Ext.getCmp("strategy_name").getValue();
				if (formPanel.form.isValid()) {
					formPanel.form.submit({
						waitMsg : '正在处理,请稍候......',
						failure : function(form, action) {
							Ext.MessageBox.alert('提示信息', action.result.info);
						},
						success : function(form, action) {
							tree.insertNewItem(rootID,strategy_id,'['+strategy_id+']'+strategy_name, 0, 0, 0, 0,'SELECT');
							addWindow.destroy();
							addWindow = null;
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
				addWindow = null;
			}
		}]
	});
	Ext.getCmp('addPanel').form.load({
		url : pathUrl + '/bscdim_common.action?method=getDftStrategyId',
		params : {
			parent_strategy_id : rootID,
			child_level_id : child_level_id
		}
	});
	addWindow.on("close", function() {
		addWindow.destroy();
		addWindow = null;
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
	if (editWindow != null || addWindow != null)
		return
	editWindow = new Ext.Window({
		title : '编辑战略元素',
		width : 368,
		height : 180,
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
			url : pathUrl + '/bscdim_common.action?method=editBscKpiDim',
			reader : new Ext.data.JsonReader({
				root : 'results'
			}, [{
				name : 'strategy_id'
			}, {
				name : 'strategy_name'
			}, {
				name : 'parent_strategy_id'
			}, {
				name : 'inner_order_id'
			}]),
			items : [{
				xtype : 'textfield',
				fieldLabel : '战略代码',
				readOnly : true,
				allowBlank : false,
				name : 'strategy_id',
				id : 'strategy_id',
				style :'background : #f0f0f0;color : #a0a0a0',
				anchor : '100%'
			}, {
				xtype : 'textfield',
				fieldLabel : '战略名称',
				allowBlank : false,
				id : "strategy_name",
				name : 'strategy_name',
				anchor : '100%',
				listeners : {
					blur : function(field){
						Ext.Ajax.request({
						 url : pathUrl + "/bscdim_checkEditNameOnly.action",
						 params : { strategy_name : Ext.getCmp('strategy_name').getValue(),
						 			strategy_id : Ext.getCmp('strategy_id').getValue()},
						 method : 'POST',
						 callback : function(option,success,response){
						 	var json = Ext.util.JSON.decode(response.responseText);
						 	if(!json.success){
						 		Ext.getCmp('editSave').setDisabled(false);
						 	}else{
						 		field.markInvalid(json.info);
						 		Ext.getCmp('editSave').setDisabled(true);
						 	}
						 }
						});
					}
				}
			},{
				xtype : 'spinnerfield',
				fieldLabel : '排序序号',
				allowBlank : false,
				minValue: 0,
            	maxValue: 20,
				id : "inner_order_id",
				name : 'inner_order_id',
				anchor : '100%'
			}, {
				xtype : 'hidden',
				name : 'parent_strategy_id',
				anchor : '100%'
			}]
		}],
		buttons : [{
			text : '保存',
			id : 'editSave',
			handler : function() {
				var formPanel = Ext.getCmp("updatePanel");
				if (formPanel.form.isValid()) {
					formPanel.form.submit({
						waitMsg : '正在处理,请稍候......',
						failure : function(form, action) {
							Ext.MessageBox.alert('提示信息', action.result.info);
						},
						success : function(form, action) {
							var rname = Ext.getCmp("strategy_name").getValue();
							tree.setItemText(id, '['+id+']'+rname);
//							Ext.MessageBox.alert('提示信息', '保存完毕');
							editWindow.destroy();
							editWindow = null;
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
				editWindow = null;
			}
		}]
	});
	var p = Ext.getCmp("updatePanel");
	p.form.load({
		url : pathUrl + '/bscdim_common.action?method=getBscKpiDimById',
		params : {
			strategy_id : id
		}
	});
	editWindow.on("close", function() {
		editWindow.destroy();
		editWindow = null;
	});
	editWindow.show();
}

/*
 * 用途 ： 删除菜单 
 * 输入 ： tree:菜单树; id:节点id 
 * 返回 ： null
 */
function doDeleteResource(tree, id) {
	if (editWindow != null || addWindow != null)
		return;
	Ext.Ajax.request({
		url : pathUrl + '/bscdim_common.action?method=removeBscKpiDim',
		params : {
			strategy_id : id
		},
		method : 'POST',
		callback : function(options, success, response) {
			var json = Ext.util.JSON.decode(response.responseText);
			if (json.results[0].success) {
				tree.deleteItem(id);
			} else {
				showFailureData(id,eval(json.results[0].info));
			}
		}
	});

}

/*
用途 ： 重新加载维度
输入 ： null
返回 ： 菜单树所需的XML字符串
*/
function reloadResource() {location.reload();}

/**
 *显示错误信息
*/
function showFailureData(id,data){
	var failureStore = new Ext.data.SimpleStore({
		fields:[
		{name:'dependId',type:'string'},
		{name:'dependName',type:'string'},
		{name:'dependOwnerBankId',type:'string'},
		{name:'dependOwnerBankName',type:'string'}
		]
	})
	failureStore.loadData(data);
	
	var gridPanel = new Ext.grid.GridPanel({
		region:'center',
		store:failureStore,
		columns:[
		new Ext.grid.RowNumberer(),
		{id:'dependId',header:'依赖实体ID',sortable:true,width:280,dataIndex:'dependId'},
		{id:'dependName',header:'依赖实体名称',sortable:true,width:280,dataIndex:'dependName'},
		{id:'dependOwnerBankId',header:'归属机构ID',sortable:true,width:100,dataIndex:'dependOwnerBankId'},
		{id:'dependOwnerBankName',header:'归属机构名称',sortable:true,width:100,dataIndex:'dependOwnerBankName'}
		]
		
	})
	
	var win = new Ext.Window({
		width: 800,
		height:300,
		layout:'border',
		buttonAlign:'center',
		items:[gridPanel],
		buttons:[{
			text:'确定',
			handler : function(){
				win.destroy();
			}
		}]
	});
	win.setTitle("战略维度["+id+"]存在以下依赖关系");
	win.show();
}



