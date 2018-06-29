/**
 * 添加私有指标
 * @class AddWindow
 * @extends Ext.Window
 */
Ext.form.Field.prototype.msgTarget = 'under';
AddWindow = Ext.extend(Ext.Window, {
	title : '添加私有指标',
	width : 460,
	height : 300,
	layout : 'fit',
	plain : true,
	modal : true,
	bodyStyle : 'padding:10px;',
	buttonAlign : 'center',
	id : 'addWindow',
	listeners : {
		close : function() {
			Ext.getCmp("addWindow").destroy();
		}
	},
	initComponent : function() {
		var comp = null;
		if(selectNodeId == 'root' || selectNodeId == '') {
			comp = new ObjCateSelector();
		}else {
			comp = new Ext.Panel({
				layout : 'form',
				border : false,
				split : false,
				anchor : '100%',
				bodyStyle : 'padding : 0px',
				baseCls : 'x-plain',
				labelWidth : 80,
				labelAlign : 'left',
				items : [{
					xtype : 'hidden',
					id :'obj_cate_id_add',
					name : 'obj_cate_id',
					value : selectNode.attributes.obj_cate_id
				},{
					xtype : 'textfield',
					name : 'obj_cate_desc',
					fieldLabel : '考核对象类型',
					readOnly : true,
					value : selectNode.attributes=='BM'?'区属部门':(selectNode.attributes=='CBM'?'市属部门':'镇街'),
					anchor : '95%'
				}]
			})
		}
		Ext.applyIf(this, {
			items : [{
				xtype : 'form',
				id : 'addForm',
				baseCls : 'x-plain',
				border : false,
				labelWidth : 80,
				labelAlign : 'left',
				layout : 'form',
				url : pathUrl
						+ '/privateMeasure_common.action?method=addEngMeasure',
				items : [{
					xtype : 'textfield',
					fieldLabel : '指标代码',
					allowBlank : false,
					id : 'measure_id',
					name : 'measure_id',
					anchor : '95%',
					listeners : {
						blur : function(field){
							if(field.validate()){
								Ext.Ajax.request({
									url : pathUrl + '/publicMeasure_checkMeasure.action',
									params : {measure_id : field.getValue()},
									method : 'POST',
									callback : function(options,request,response){
										var json = Ext.util.JSON.decode(response.responseText);
										if(json.success){
											Ext.getCmp('save_btn').setDisabled(false);
										}else{
											field.markInvalid(json.info);
											Ext.getCmp('save_btn').setDisabled(true);
										}
									}
								});
							}
						}
					}
				}, {
					xtype : 'textfield',
					fieldLabel : '指标名称',
					allowBlank : false,
					id : 'measure_name',
					name : 'measure_name',
					anchor : '95%'
				}, new SourceTypeSelector(), comp,{
					xtype : 'numberfield',
					name : 'inner_level_order',
					fieldLabel : '同级顺序',
					allowBlank : true,
					anchor : '95%'
				}, {
					xtype : 'textarea',
					fieldLabel : '指标描述',
					id : 'measure_desc',
					name : 'measure_desc',
					height : 60,
					anchor : '95%'
				}, {
					xtype : 'hidden',
					id : 'parent_measure_id',
					name : 'parent_measure_id',
					anchor : '95%',
					value : selectNodeId == '' ? 'root' : selectNodeId
				}]
			}],
			buttons : [{
				text : '保存',
				id :'save_btn',
				handler : function() {
					var formPanel = Ext.getCmp("addForm");
					var nodeID = Ext.getCmp("measure_id").getValue();
					var nodeName = Ext.getCmp("measure_name").getValue();
					if (formPanel.form.isValid()) {
						formPanel.form.submit({
							waitMsg : '正在处理,请稍候......',
							failure : function(form, action) {
								Ext.MessageBox.alert('错误', action.result.info);
							},
							success : function(form, action) {
								var objCateId = '';
								if(selectNodeId == 'root' || selectNodeId == '') {
									objCateId = Ext.getCmp("objCateId").getValue();
								}else
									objCateId = Ext.getCmp("obj_cate_id").getValue();
								var node = new Ext.tree.TreeNode({
									id : nodeID,
									text : createAddOrder()+'[' + nodeID + ']' + nodeName,
									source_type_id : Ext.getCmp("sourceTypeId").getValue(),
									obj_cate_id : objCateId,
									leaf : false
								});
								engMeasureTree.getSelectionModel().getSelectedNode().appendChild(node);
								engMeasureTree.getSelectionModel().getSelectedNode().expand();
								Ext.getCmp("addWindow").destroy();
							}
						});
					} else {
						Ext.MessageBox.alert('错误', '请填写必输项！');
					}
				}
			}, {
				text : '取消',
				handler : function() {
					Ext.getCmp("addWindow").destroy();
				}
			}]
		})
		AddWindow.superclass.initComponent.call(this);
	}
});

/**
 * 编辑私有指标
 */
function doEdit() {
	var editWindow = new EditWindow();
	Ext.getCmp("pmid").setValue(selectNode.parentNode.text);
	Ext.getCmp("tpmid").setValue(selectNode.parentNode.id);
	Ext.getCmp("tmid").setValue(selectNode.id);
	Ext.getCmp("editForm").form.load({url: pathUrl + '/privateMeasure_common.action?method=getEngMeasureById',params: {measure_id: selectNode.id}});
	editWindow.show();
}
/**
 * 编辑私有指标
 */
EditWindow = Ext.extend(Ext.Window, {
	title : '编辑私有指标',
	width : 500,
	height : 300,
	layout : 'fit',
	plain : true,
	modal : true,
	bodyStyle : 'padding:10px;',
	buttonAlign : 'center',
	id : 'editWindow',
	listeners : {
		close : function() {
			Ext.getCmp("editWindow").destroy();
		}
	},
	initComponent : function() {
		Ext.applyIf(this, {
			items : [{
				xtype : 'form',
//				region : 'center',
				id : 'editForm',
//				width : 270,
				bodyStyle : 'padding:10px;',
				border : false,
				labelWidth : 80,
				labelAlign : 'left',
				layout : 'form',
				url : pathUrl + '/privateMeasure_common.action?method=editEngMeasure',
				reader : new Ext.data.JsonReader({
					root : 'results'
				}, [{
					name : 'measure_id'
				}, {
					name : 'measure_name'
				}, {
					name : 'measure_desc'
				}, {
					name : 'parent_measure_id'
				}, {
					name : 'obj_cate_id'
				}, {
					name : 'inner_level_order'
				}, {
					name : 'obj_cate_desc'
				}]),
				items : [{
					xtype : 'hidden',
					fieldLabel : '上级节点',
					id : 'pmid',
					name : 'pMeasureID',
					readOnly : true,
					anchor : '95%'
				}, {
					xtype : 'textfield',
					fieldLabel : '指标代码',
					allowBlank : false,
					disabled : true,
					id : 'tmid',
					name : 'new_measure_id',
					anchor : '95%'
				}, {
					xtype : 'textfield',
					fieldLabel : '指标名称',
					allowBlank : false,
					id : 'measure_name',
					name : 'measure_name',
					anchor : '95%'
				}, {
					xtype : 'hidden',
					name : 'obj_cate_id'
				},{
					xtype : 'textfield',
					name : 'obj_cate_desc',
					fieldLabel : '考核对象类型',
					disabled : true,
					readOnly : true,
					anchor : '95%'
				}/**,new ObjCateSelector()*/,{
					xtype : 'numberfield',
					name : 'inner_level_order',
					fieldLabel : '同级顺序',
					allowBlank : true,
					anchor : '95%'
				},{
					xtype : 'textarea',
					fieldLabel : '指标描述',
					id : 'measure_desc',
					name : 'measure_desc',
		            height:60,
					anchor : '95%'
				}, {
					xtype : 'hidden',
					id : 'tpmid',
					name : 'parent_measure_id'
				}, {
					xtype : 'hidden',
					id : 'oldMeasureID',
					name : 'measure_id'
				}, {
					xtype : 'panel',
					baseCls : 'x-plain',
					html : '<div align=left><br>注：若指标代码变动请手工修改相关公式引用.<br></div> '
				}]
			}/**, {
				xtype : 'treepanel',
				id : 'mTree',
				region : 'center',
				frame : false,
				title : '变更上级节点',
				loader : new Ext.tree.TreeLoader(),
				lines : false,
				listeners : {
					click : function(n,e){
						Ext.getCmp('tpmid').setValue(n.id);
					}
				},
				bodyStyle : 'padding:5px 5px',
				autoScroll : true,
				root : getRootNode('root', '私有指标树', expandEngMeasureTreeNode)
			}*/],
			buttons : [{
				text : '保存',
				handler : function() {
					var formPanel = Ext.getCmp("editForm");
					if (formPanel.form.isValid()) {
//						var npid = Ext.getCmp('tpmid').getValue();
						if (false && npid != '' && npid != selectNode.id && npid != selectNode.parentNode.id) {
							Ext.Msg.show({
								title : '提示信息',
								msg : '是否变更指标上级节点为:['+ Ext.getCmp('tpmid').getValue()+ ']',
								buttons : {
									yes : '确定',
									no : '不变更',
									cancel : '取消'
								},
								icon : Ext.MessageBox.QUESTION,
								fn : function(bid) {
									if (bid == 'yes') {
										formPanel.form.submit({
											waitMsg : '正在处理，请稍候......',
											failure : function(form, action) {
												Ext.MessageBox.alert('错误',action.result.info);
											},
											success : function(form, action) {
												engMeasureTree.getRootNode().reload();
												Ext.getCmp("editWindow").destroy();
												propertyPanel.form.reset();
												var selectNodeId = '';
												var selectNode = null;	
											}
										});
									} else if (bid == 'no') {
										Ext.getCmp('tpmid').setValue(selectNode.parentNode.id);
										formPanel.form.submit({
											waitMsg : '正在处理，请稍候......',
											failure : function(form, action) {
												Ext.MessageBox.alert('错误',action.result.info);
											},
											success : function(form, action) {
												var nodeID = Ext.getCmp("tmid").getValue();
												var nodeName = Ext.getCmp("measure_name").getValue();
												engMeasureTree.getSelectionModel().getSelectedNode().setText('[' + nodeID+ ']'+ nodeName);
												propertyPanel.form.load({
													url : pathUrl + '/privateMeasure_common.action?method=getEngMeasureById&measure_id='+nodeID
												});
												Ext.getCmp("editWindow").destroy();
											}
										});
									}
								}
							})
						} else {
							Ext.getCmp('tpmid').setValue(selectNode.parentNode.id);
							formPanel.form.submit({
								waitMsg : '正在处理，请稍候......',
								failure : function(form, action) {
									Ext.MessageBox.alert('错误',action.result.info);
								},
								success : function(form, action) {
									var nodeID = Ext.getCmp("oldMeasureID").getValue();
									var nodeName = Ext.getCmp("measure_name").getValue();
									engMeasureTree.getSelectionModel().getSelectedNode().id = nodeID;

									engMeasureTree.getSelectionModel().getSelectedNode().setText('[' + nodeID + ']'+ nodeName);
									propertyPanel.form.load({
										url : pathUrl + '/privateMeasure_common.action?method=getEngMeasureById&measure_id='+nodeID
									});
									Ext.getCmp("editWindow").destroy();
								}
							});
						}

					} else {
						Ext.MessageBox.alert('错误', '请填写必输项!');
					}
				}
			}, {
				text : '取消',
				handler : function() {
					Ext.getCmp("editWindow").destroy();
				}
			}]
		})
		EditWindow.superclass.initComponent.call(this);
	}
});

//删除方法
function doDeleteMeasure(n) {
	Ext.MessageBox.confirm('确认信息', '您确认要删除该指标吗?', function(btn) {
		if (btn == 'yes') {
			Ext.Ajax.request({
				url : pathUrl + '/privateMeasure_common.action?method=deleteEngMeasure',
				method : 'POST',
				params : {
					measure_id : n.id
				},
				callback : function(options, success, response) {
					var json = Ext.util.JSON.decode(response.responseText);
					if (json.results[0].success) {
						propertyPanel.form.reset();
						n.remove();
					} else {
						if(json.results[0].showType == 'alert')
							Ext.MessageBox.alert("提示信息",json.results[0].info);
						else if(json.results[0].showType == 'panel')
							showFailureData(n.id,eval(json.results[0].info));
					}
				}
			});
		}
	});
}

//添加运算依赖指标
function addDependMeasure(node) {
	var tmpId = selectNodeId;
	Ext.Ajax.request({
		url : pathUrl + '/privateMeasure_common.action?method=addDependMeasure',
		method : 'POST',
		params : {
			parent_measure_id : selectNodeId,
			measure_id : node.id
		},

		callback : function(options, success, response) {
			var json = Ext.util.JSON.decode(response.responseText);
			if (json.success) {
				node.getOwnerTree().getNodeById(tmpId).select();
				store.reload();
			} else {
				Ext.MessageBox.alert('错误', json.info);
			}
		}
	});
}

//删除运算依赖指标
function removeDependMeasure(measure_id,measure_name) {
	var message = '是否确认指标:'+selectNode.attributes.measure_name+'['+selectNode.id+'] 的计算不依赖指标:'+measure_name+'['+measure_id+'],删除后可能需要修改公式的表达式?';
	Ext.MessageBox.confirm("确认信息", message, function(btn) {
		if (btn == 'yes') {
			Ext.Ajax.request({
				url : pathUrl + '/privateMeasure_common.action?method=removeDependMeasure',
				method : 'POST',
				params : {
					parent_measure_id : selectNodeId,
					measure_id : measure_id
				},
				callback : function(options, success, response) {
					var json = Ext.util.JSON.decode(response.responseText);
					if (json.success) {
						store.reload();
					} else {
						Ext.MessageBox.alert('错误', json.info);
					}
				}
			});
		}
	});
}

function showFailureData(id,data){
	
	var failData = new Ext.data.SimpleStore({
		fields:[
		{name:'dependID',type:'string'},
		{name:'dependName',type:'string'},
		{name:'dependOwnerBankID',type:'string'},
		{name:'dependOwnerBankName',type:'string'}
		]
	});
	failData.loadData(data);
	var gridPanel = new Ext.grid.GridPanel({
		region:'center',
		store: failData,
		columns:[
		new Ext.grid.RowNumberer(),
		{id:'dependID',header:'依赖实体ID',sortable:true,width:180,dataIndex:'dependID'},
		{id:'dependName',header:'依赖实体名称',sortable:true,width:180,dataIndex:'dependName'},
		{id:'dependOwnerBankID',header:'归属机构ID',sortable:true,width:100,dataIndex:'dependOwnerBankID'},
		{id:'dependOwnerBankName',header:'归属机构名称',sortable:true,width:100,dataIndex:'dependOwnerBankName'}
		]
	});
	
	var win = new Ext.Window({
		width:600,
		height:300,
		layout:'border',
		items:[gridPanel],
		buttonAlign:'center',
		buttons:[
		{	text:'确定',
			handler : function(){
				win.destroy();
			}
		}
		]
	});
	win.setTitle("指标为["+id+"]存在以下依赖关系");
	win.show();
}
function showJSON(json) {
	var mm = '';
	for (var p in json) {
		mm += "@" + p + ":" + json[p];
	}
	alert(mm)
}

