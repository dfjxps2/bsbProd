/**
 * 添加数据源维度窗口
 * @class AddWindow
 * @extends Ext.Window
 */
Ext.form.Field.prototype.msgTarget = 'under';
AddWindow = Ext.extend(Ext.Window, {
	title : '添加维度',
	buttonAlign : 'center',
	id : 'addFieldLinkWindow',
	width : 500,
	height : 400,
	initComponent : function() {
		Ext.applyIf(this, {
			modal : true,
			split : false,
			layout : 'fit',
			listeners : {
				close : function() {
					Ext.getCmp("addFieldLinkWindow").destroy();
				}
			},
			bodyStyle : 'padding: 10px',
			items : [{
				xtype : 'form',
				id : 'addFieldLinkForm',
				layout : 'form',
				labelWidth : 85,
				border : false,
				labelAlign : 'left',
				url : pathUrl + '/dimLink_add.action',
				items : [{
					xtype : 'textfield',
					name : 'link_id',
					id : 'link_id',
					fieldLabel : '维&nbsp;&nbsp;度&nbsp;ID',
					allowBlank : false,
					anchor : '95%',
					regex : /^[0-9a-zA-Z_]+$/,
					regexText : '维度ID不允许包含特殊字符和汉字，请检查！',
					listeners : {
						blur : function(field){
							if(field.getValue()!=null){
								Ext.Ajax.request({
									url : pathUrl + '/dimLink_checkLink.action',
									params : {
										link_id : Ext.getCmp('link_id').getValue()
									},
									callback : function (options,request,response){
										var json = Ext.util.JSON.decode(response.responseText);
										if(json.success){
											Ext.getCmp('save_link').setDisabled(false);
										}else{
											field.markInvalid(json.info);
											Ext.getCmp('save_link').setDisabled(true);
										}
									}
								});
							}
						}
					}
				},{
					xtype : 'textfield',
					name : 'link_name',
					id : 'link_name',
					fieldLabel : '维度名称',
					allowBlank : false,
					anchor : '95%'
				}, {
					xtype : 'textfield',
					name : 'id_field',
					id : 'id_field',
					fieldLabel : 'ID字段名',
					allowBlank : false,
					anchor : '95%'
				},{
					xtype : 'textfield',
					name : 'label_field',
					id : 'label_field',
					fieldLabel : '标签字段',
					allowBlank : false,
					anchor : '95%'
				}, {
					xtype : 'combo',
					store : new Ext.data.SimpleStore({
						fields : ['is_tree', 'is_tree_desc'],
						data : [['Y', '是'], ['N', '否']]
					}),
					displayField : 'is_tree_desc',
					valueField : 'is_tree',
					fieldLabel : '树形显示',
					editable : false,
					hiddenName : 'is_tree',
					mode : 'local',
					allowBlank : false,
					value : 'N',
					listeners : {
						select : function(combo, record, index) {
							judgeTree(record.get('is_tree'));
						}
					},
					triggerAction : 'all',
					anchor : '95%'
				},  {
					xtype : 'textfield',
					name : 'parent_id_field',
					id : 'parent_id_field',
					fieldLabel : '父ID值字段',
					allowBlank : false,
					anchor : '95%'
				}, {
					xtype : 'textfield',
					name : 'root_value',
					id : 'root_value',
					fieldLabel : '根节点ID值',
					allowBlank : false,
					anchor : '95%'
				}, {
					xtype : 'textarea',
					name : 'source_expression',
					id : 'source_expression',
					fieldLabel : 'SQL表达式',
					allowBlank : false,
					autoScroll : true,
					height : 80,
					emptyText : '请输入维度查询SQL',
					anchor : '95%'
				}]
			}],
			buttons : [{
				text : '保存',
				id : 'save_link',
				handler : function() {
					var formPanel = Ext.getCmp("addFieldLinkForm");
					if (formPanel.form.isValid()) {
						formPanel.form.submit({
							waitMsg : '正在处理,请稍后......',
							success : function(form, action) {
//								Ext.Msg.alert("消息", action.result.info);
								if (action.result.success) {
									src_dim_ds.reload();
									Ext.getCmp('addFieldLinkWindow').destroy();
								}
							},
							failure : function(form, action) {
								Ext.Msg.alert("消息", action.result.info);
							}
						})
					} else {
						Ext.Msg.alert("提示信息", "请输入完整信息");
					}
				}
			}, {
				text : '取消',
				handler : function() {
					Ext.getCmp("addFieldLinkWindow").destroy();
				}
			}]
		});
		AddWindow.superclass.initComponent.call(this);

		Ext.getCmp('parent_id_field').setDisabled(true);
		Ext.getCmp('parent_id_field').setVisible(false);
		Ext.getCmp('root_value').setDisabled(true);
		Ext.getCmp('root_value').setVisible(false);
	}
});

/**
 * 修改数据源维度窗口
 * @class EditWindow
 * @extends Ext.Window
 */
EditWindow = Ext.extend(Ext.Window, {
	title : '编辑维度',
	buttonAlign : 'center',
	id : 'editDimLinkWindow',
	width : 500,
	height : 400,
	initComponent : function() {
		Ext.applyIf(this, {
			modal : true,
			split : false,
			layout : 'fit',
			listeners : {
				close : function() {
					Ext.getCmp("editDimLinkWindow").destroy();
				}
			},
			bodyStyle : 'padding: 10px',
			items : [{
				xtype : 'form',
				id : 'editdimLinkForm',
				layout : 'form',
				labelWidth : 85,
				border : false,
				labelAlign : 'left',
				url : pathUrl + '/dimLink_edit.action',
				items : [{
					xtype : 'textfield',
					name : 'link_id',
					id : 'link_id',
					fieldLabel : '维&nbsp;&nbsp;度&nbsp;ID',
					allowBlank : false,
					readOnly : true,
					style : 'background:#F0F0F0;color : #A0A0A0',
					anchor : '95%'
				}, {
					xtype : 'textfield',
					name : 'link_name',
					id : 'link_name',
					fieldLabel : '维度名称',
					allowBlank : false,
					anchor : '95%'
				},{
					xtype : 'textfield',
					name : 'id_field',
					id : 'id_field',
					fieldLabel : 'ID字段名',
					allowBlank : false,
					anchor : '95%'
				}, {
					xtype : 'textfield',
					name : 'label_field',
					id : 'label_field',
					fieldLabel : '标签字段',
					allowBlank : false,
					anchor : '95%'
				},{
					xtype : 'combo',
					store : new Ext.data.SimpleStore({
						fields : ['is_tree', 'is_tree_desc'],
						data : [['Y', '是'], ['N', '否']]
					}),
					displayField : 'is_tree_desc',
					valueField : 'is_tree',
					fieldLabel : '树形显示',
					editable : false,
					hiddenName : 'is_tree',
					mode : 'local',
					allowBlank : false,
					listeners : {
						select : function(combo, record, index) {
							judgeTree(record.get('is_tree'));
						}
					},
					triggerAction : 'all',
					anchor : '95%'
				},  {
					xtype : 'textfield',
					name : 'parent_id_field',
					id : 'parent_id_field',
					fieldLabel : '父ID值字段',
					allowBlank : false,
					anchor : '95%'
				}, {
					xtype : 'textfield',
					name : 'root_value',
					id : 'root_value',
					fieldLabel : '根节点ID值',
					allowBlank : false,
					anchor : '95%'
				}, {
					xtype : 'textarea',
					name : 'source_expression',
					id : 'source_expression',
					fieldLabel : 'SQL表达式',
					allowBlank : false,
					autoScroll : true,
					height : 80,
					emptyText : '请输入维度查询SQL',
					anchor : '95%'
				}]
			}],
			buttons : [{
				text : '保存',
				handler : function() {
					var formPanel = Ext.getCmp("editdimLinkForm");
					if (formPanel.form.isValid()) {
						formPanel.form.submit({
							waitMsg : '正在处理,请稍后......',
							success : function(form, action) {
//								Ext.Msg.alert("消息", action.result.info);
								if (action.result.success) {
									src_dim_ds.reload();
									Ext.getCmp('editDimLinkWindow').destroy();
								}
							},
							failure : function(form, action) {
								Ext.Msg.alert("消息", action.result.info);
							}
						})
					} else {
						Ext.Msg.alert("提示信息", "请输入完整信息");
					}
				}
			}, {
				text : '取消',
				handler : function() {
					Ext.getCmp("editDimLinkWindow").destroy();
				}
			}]
		});
		AddWindow.superclass.initComponent.call(this);
	}
});

/**
 * 删除维度记录
 * @param {} link_id
 */
function deleteDimLink(link_id) {
	Ext.Ajax.request({
		method : 'POST',
		url : pathUrl + '/dimLink_delete.action',
		params : {
			link_id : link_id
		},
		callback : function(options, success, response) {
			var json = Ext.util.JSON.decode(response.responseText);
			if (success) {
//				Ext.MessageBox.alert("提示信息", json.info);
				src_dim_ds.reload();
			} else {
				Ext.MessageBox.alert("提示信息", json.info);
			}
		}
	});
};

/**
 * 当选中dimLinkGrid的时候触发方法
 */
function onRowSelect() {
	Ext.getCmp("dimLinkGrid").getSelectionModel().on("rowselect",
			function(mode, rowIndex, record) {
				dim_data_ds.removeAll();
				selectLinkId = record.get('link_id');
				isTree = record.get('is_tree');
				rootValue = record.get('root_value');
				if (isTree == 'Y') {
					Ext.getCmp('dimLinkDetailTreePanel').setVisible(true);
					Ext.getCmp('dimLinkDetailGrid').setVisible(false);
					tree.removeAll();
					rootName(selectLinkId);
				} else {
					Ext.getCmp('dimLinkDetailTreePanel').setVisible(false);
					Ext.getCmp('dimLinkDetailGrid').setVisible(true);
					
					dim_data_ds.load({
						params : {
							link_id : selectLinkId
						}
					});
				}
			});
}

/**
 * 判断是否是树 来显示或隐藏父类字段和父类值
 * @param {} isTree ： Y:是； N:否
 */
function judgeTree(isTree) {
	if (isTree == 'Y') {
		Ext.getCmp('parent_id_field').setDisabled(false);
		Ext.getCmp('parent_id_field').setVisible(true);

		Ext.getCmp('root_value').setDisabled(false);
		Ext.getCmp('root_value').setVisible(true);
	} else {
		Ext.getCmp('parent_id_field').setDisabled(true);
		Ext.getCmp('parent_id_field').setVisible(false);

		Ext.getCmp('root_value').setDisabled(true);
		Ext.getCmp('root_value').setVisible(false);
	}
};

/**
 * 通过rootValue查询rootNode的名称
 * @param {} linkId
 */
function rootName(linkId) {
	Ext.Ajax.request({
		method : 'POST',
		url : pathUrl + '/dimLink_findRootName.action',
		params : {
			linkId : linkId
		},
		callback : function(options, success, response) {
			var json = Ext.util.JSON.decode(response.responseText);
			var text = "根节点";
			if(json.results.length != 0){
				text = json.results[0].text
			}
			
			if (success) {
				var node = getRootNode(rootValue, text, expandDimLinkTreeNode);
				tree.setRootNode(node);
				node.expand();
			} else {
			}
		}
	});
}