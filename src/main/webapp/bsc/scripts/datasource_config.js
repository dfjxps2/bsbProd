var hasSourceID = false,hasSourceName = false;
var editHasSourceName = false;
//Ext.form.Field.prototype.msgTarget = 'under';
//数据源维度store
var src_field_ds = new Ext.data.JsonStore({
    url: pathUrl+'/datasourceconfig_queryDimLink.action',
    root: 'results',
    fields: ['link_id','link_name'], 
    autoLoad:true
});

//添加数据源窗口
AddDataSourceWindow = Ext.extend(Ext.Window, {
	title: '添加数据源',
	id: 'addDataSourceWindow',
	split: false,
	modal: true,
	buttonAlign: 'center',
	layout: 'fit',
	listeners: {
		close: function(){
			Ext.getCmp("addDataSourceWindow").destroy();
		}
	},
	initComponent: function(){
		Ext.applyIf(this,{
			width: 500,
			height: 300,
			items: [{
				xtype: 'form',
				id: 'addDataSourceForm',
				layout: 'form',
				bodyStyle: 'padding: 10px',
				url: pathUrl + '/datasourceconfig_add.action',
				border: false,
				split: false,
				items: [{
					xtype: 'textfield',
					name: 'source_id',
					id : 'source_id',
					allowBlank: false,
					fieldLabel: '数据源ID',
					anchor: '95%',
					regex : /^[0-9a-zA-Z_]+$/,
					regexText : '不允许包含特殊字符和汉字!',
					listeners : {
						blur : function(field){
							Ext.Ajax.request({
								url : pathUrl + '/datasourceconfig_hasSourceID.action',
								params : {source_id : Ext.getCmp('source_id').getValue()},
								method : 'POST',
								callback : function(option,success,response){
									var json = Ext.util.JSON.decode(response.responseText);
									if(json.success){
										field.markInvalid(json.info);
										hasSourceID = true;
									}else{
										hasSourceID = false;
									}
									if(!hasSourceID && !hasSourceName){
										Ext.getCmp('addSave').setDisabled(false);
									}else{
										Ext.getCmp('addSave').setDisabled(true);
									}
								}
							});
						}
					}
				},{
					xtype: 'textfield',
					name: 'source_name',
					id : 'source_name',
					allowBlank: false,
					fieldLabel: '数据源名',
					anchor: '95%',
					listeners : {
						blur : function(field){
							Ext.Ajax.request({
								url : pathUrl + '/datasourceconfig_hasSourceName.action',
								params : {source_id : Ext.getCmp('source_id').getValue(),
										  source_name : Ext.getCmp('source_name').getValue()},
								method : 'POST',
								callback : function(option,success,response){
									var json = Ext.util.JSON.decode(response.responseText);
									if(json.success){
										field.markInvalid(json.info);
										hasSourceName = true;
									}else{
										hasSourceName = false;
									}
									if(!hasSourceID && !hasSourceName){
										Ext.getCmp('addSave').setDisabled(false);
									}else{
										Ext.getCmp('addSave').setDisabled(true);
									}
								}
							});
						}
					}
				},{xtype:'combo',
				   fieldLabel:'对象类型',
				   name:'obj_cate_name',
				   hiddenName:'obj_cate_id',
				   valueField:'obj_cate_id',
				   displayField:'obj_cate_desc',
				   store :new Ext.data.JsonStore({
				   		url:pathUrl + '/datasourceconfig_queryObjCate.action',
				   		root:'results',
				   		fields:['obj_cate_id','obj_cate_desc'],
				   		autoLoad:true
				   }),
				   editable : false,
				   triggerAction:'all',
				   mode:'local',
				   anchor:'95%'
				},{xtype:'textfield',
				   fieldLabel:'对象字段名',
				   name:'obj_column',
				   anchor:'95%'
				},{
					xtype: 'textarea',
					name: 'source_expression',
					id: 'source_expression',
					fieldLabel: '数据源表达式',
					allowBlank: false,
					autoScroll: true,
					height: 100,
					emptyText: '请输入数据源SQL',
					anchor: '95%'
				}]
			}],
			buttons: [{
				text: '保存',
				id : 'addSave',
				handler: function(){
					var formPanel = Ext.getCmp("addDataSourceForm");
					if(formPanel.form.isValid()) {
						formPanel.form.submit({
							waitMsg: '正在处理,请稍后......',
							success: function(form,action){
								Ext.Msg.alert("提示信息",action.result.info);
								if(action.result.success){
									Ext.getCmp("addDataSourceWindow").destroy();
									sourceStore.reload();
								}
							},
							failure: function(form,action){
								Ext.Msg.alert("提示信息",action.result.info);
							}
						});
					}else{
						Ext.Msg.alert("提示信息","请输入完整信息");
					}
				}
			},{
				text: '取消',
				handler: function(){
					Ext.getCmp("addDataSourceWindow").destroy();
				}
			}]
		});
		AddDataSourceWindow.superclass.initComponent.call(this);
	}
});


//编辑数据源窗口
EditDataSourceWindow = Ext.extend(Ext.Window, {
	title: '编辑数据源',
	id: 'editDataSourceWindow',
	split: false,
	buttonAlign: 'center',
	modal: true,
	layout: 'fit',
	listeners: {
		close: function(){
			Ext.getCmp("editDataSourceWindow").destroy();
		}
	},
	initComponent: function(){
		
	   //考核对象类型
	   combo_store = new Ext.data.JsonStore({
						url:pathUrl+'/datasourceconfig_queryObjCate.action',
						root:'results',
						fields:['obj_cate_id','obj_cate_desc']
					})
	   combo_store.on('load',function(){
	      var combo=Ext.getCmp('edit_obj_cate_id');
		   combo.setValue(Ext.getCmp('edit_obj_cate_id').getValue());
	   })
	   combo_store.load();
	   
		Ext.applyIf(this,{
			width: 500,
			height: 300,
			items: [{
				xtype: 'form',
				id: 'editDataSourceForm',
				layout: 'form',
				bodyStyle: 'padding: 10px',
				url: pathUrl + '/datasourceconfig_edit.action',
				border: false,
				split: false,
				items: [{
					xtype: 'textfield',
					name: 'source_id',
					id: 'source_id',
					allowBlank: false,
					fieldLabel: '数据源ID',
					readOnly: true,
					anchor: '95%',
					style : 'background : #F0F0F0;color : #A0A0A0'
				},{
					xtype: 'textfield',
					id: 'source_name',
					name: 'source_name',
					allowBlank: false,
					fieldLabel: '数据源名',
					anchor: '95%',
					listeners : {
						blur : function(field){
							Ext.Ajax.request({
								url : pathUrl + '/datasourceconfig_editHasSourceName.action',
								params : {source_id : Ext.getCmp('source_id').getValue(),
										  source_name : Ext.getCmp('source_name').getValue()},
								method : 'POST',
								callback : function(option,success,response){
									var json = Ext.util.JSON.decode(response.responseText);
									if(json.success){
										field.markInvalid(json.info);
										editHasSourceName = true;
									}else{
										editHasSourceName = false;
									}
									if(!editHasSourceName){
										Ext.getCmp('editSave').setDisabled(false);
									}else{
										Ext.getCmp('editSave').setDisabled(true);
									}
								}
							});
						}
					}
				},{
					xtype: 'combo',
					fieldLabel:'对象类型',
					id:'edit_obj_cate_id',
					hiddenName:'obj_cate_id',
					valueField:'obj_cate_id',
					displayField:'obj_cate_desc',
					store: combo_store,
					triggerAction:'all',
					editable : false,
					mode:'local',
					anchor: '95%',
					value:'2222'
				},{xtype:'textfield',
				   fieldLabel:'对象字段名',
				   name:'obj_column',
				   anchor:'95%'
				   },{
					xtype: 'textarea',
					name: 'source_expression',
					id: 'source_expression',
					fieldLabel: '数据源表达式',
					allowBlank: false,
					autoScroll: true,
					height: 100,
					emptyText: '请输入数据源SQL',
					anchor: '95%'
				}]
			}],
			buttons: [{
				text: '保存',
				id : 'editSave',
				handler: function(){
					var formPanel = Ext.getCmp("editDataSourceForm");
					if(formPanel.form.isValid()) {
						formPanel.form.submit({
							waitMsg: '正在处理,请稍后......',
							success: function(form,action){
								Ext.Msg.alert("提示信息",action.result.info);
								if(action.result.success){
									Ext.getCmp("editDataSourceWindow").destroy();
									sourceStore.reload();
								}
							},
							failure: function(form,action){
								Ext.Msg.alert("提示信息",action.result.info);
							}
						});
					}else{
						Ext.Msg.alert("提示信息","请输入完整信息");
					}
				}
			},{
				text: '取消',
				handler: function(){
					Ext.getCmp("editDataSourceWindow").destroy();
				}
			}]
		});
		EditDataSourceWindow.superclass.initComponent.call(this);
	}
});

//删除数据源记录
function deleteSourceRecord(source_id) {
	Ext.Ajax.request({
		method: 'POST',
		url: pathUrl + '/datasourceconfig_delete.action',
		params: {source_id: source_id},
		callback: function (options, success, response) {
			var json=Ext.util.JSON.decode(response.responseText);
			if (success) { 
				sourceStore.reload();
			} else {
				Ext.MessageBox.alert("提示信息",json.info);
			}
		}
	});	
}

//------------------------------------------------数据源字段组件

//添加数据源字段窗口
AddSourceFieldWindow = Ext.extend(Ext.Window, {
	title: '添加数据源字段',
	id: 'addSourceFieldWindow',
	split: false,
	modal: true,
	buttonAlign: 'center',
	layout: 'fit',
	listeners: {
		close: function(){
			Ext.getCmp("addSourceFieldWindow").destroy();
		}
	},
	initComponent: function(){
		Ext.applyIf(this,{
			width: 500,
			height: 300,
			items: [{
				xtype: 'form',
				id: 'addSourceFieldForm',
				layout: 'form',
				bodyStyle: 'padding: 10px',
				url: pathUrl + '/datasourceconfig_sourceFieldAdd.action',
				border: false,
				split: false,
				items: [{
					xtype: 'textfield',
					name: 'source_id',
					readOnly: true,
					allowBlank: false,
					value: selectedSourceId,
					fieldLabel: '数据源ID',
					anchor: '95%',
					hidden : true
				},{
					xtype: 'combo',
					mode : 'local',
					store : sorExpStore,
					displayField : 'field_name',
					valueField : 'field_name',
					triggerAction : 'all',
					hiddenName: 'column_name',
					id	: 'add_column_name',
					editable: false,
					fieldLabel: '字段名称',
					anchor: '95%',
					listeners : {
						select : function(combo,record,index){
							Ext.getCmp("add_field_type").setValue(record.get("field_type"));
							Ext.getCmp("add_field_order").setValue(record.get("field_order"));
						}
					}
				},{
					xtype: 'textfield',
					name: 'column_biz_name',
					allowBlank: false,
					fieldLabel: '字段中文名',
					anchor: '95%'
				},{xtype:'textfield',
				   fieldLabel:'数据类型',
				   name:'data_type_id',
				   id:'add_field_type',
				   readOnly: true,
				   anchor:'95%',
				   style : 'background : #F0F0F0;color : #A0A0A0'
				},{
					xtype: 'textfield',
					name:'column_order_id',
					id	: 'add_field_order',
					readOnly: true,
					fieldLabel:'字段顺序',
					anchor: '95%',
					style : 'background : #F0F0F0;color : #A0A0A0'
				},{xtype:'combo',
			       fieldLabel:'是否维度',
			       id:'add_is_dim_id',
			       hiddenName:'is_dim_col',
				   valueField:'is_dim_col_value',
				   displayField:'is_dim_col_display',
				   store: new Ext.data.SimpleStore({
				   		fields:['is_dim_col_value','is_dim_col_display'],
				   		data:[['Y','是'],['N','否']]
				   }),
				   triggerAction:'all',
				   mode:'local',
				   value : 'N',
				   editable: false,
				   allowBlank:false,
				   anchor:'95%',
				   listeners:{
				   		select: function(){
				   			var combo_value = Ext.getCmp('add_is_dim_id').getValue();
				   			if(combo_value=='Y'){
				   				Ext.getCmp('linkIdSelector').setDisabled(false);
				   				Ext.getCmp('linkIdSelector').allowBlank=false;
				   			}else{
				   				Ext.getCmp('linkIdSelector').allowBlank=true;
				   				Ext.getCmp("linkIdSelector").setValue('');
				   				Ext.getCmp('linkIdSelector').setDisabled(true);
				   			}
				   		}
				   }
				},{
					xtype: 'combo',
					store: src_field_ds,
					displayField: 'link_name',
					valueField: 'link_id',
					editable: false,
					fieldLabel: '维度链接',
					hiddenName: 'link_id',
					mode: 'local',
					id: 'linkIdSelector',
					triggerAction: 'all',
					anchor: '95%'
				}]
			}],
			buttons: [{
				text: '保存',
				handler: function(){
					var formPanel = Ext.getCmp("addSourceFieldForm");
					if(formPanel.form.isValid()) {
						formPanel.form.submit({
							waitMsg: '正在处理,请稍后......',
							success: function(form,action){
								//Ext.Msg.alert("提示信息",action.result.info);
								if(action.result.success){
									Ext.getCmp("addSourceFieldWindow").destroy();
									sourceFieldStore.reload();
								}
							},
							failure: function(form,action){
								Ext.Msg.alert("提示信息",action.result.info);
							}
						});
					}else{
						Ext.Msg.alert("提示信息","请输入完整信息");
					}
				}
			},{
				text: '取消',
				handler: function(){
					Ext.getCmp("addSourceFieldWindow").destroy();
				}
			}]
		});
		AddSourceFieldWindow.superclass.initComponent.call(this);
		Ext.getCmp("linkIdSelector").setDisabled(true);
		src_field_ds.load();
	}
});

//编辑数据源字段窗口
EditSourceFieldWindow = Ext.extend(Ext.Window, {
	title: '修改数据源字段属性',
	id: 'editSourceFieldWindow',
	split: false,
	modal: true,
	buttonAlign: 'center',
	layout: 'fit',
	listeners: {
		close: function(){
			Ext.getCmp("editSourceFieldWindow").destroy();
		}
	},
	initComponent: function(){
		
		//数据源字段：字段类型store
		var dataType_store = new Ext.data.JsonStore({
			url:pathUrl+'/datasourceconfig_queryDataType.action',
			root:'results',
			fields:['data_type_id','data_type_desc']
		})
		dataType_store.on('load',function(){
			var dataType_value = Ext.getCmp('edit_data_type_id');
			dataType_value.setValue(Ext.getCmp('edit_data_type_id').getValue());
		});
		dataType_store.load();
		
		Ext.applyIf(this,{
			width: 500,
			height: 300,
			items: [{
				xtype: 'form',
				id: 'editSourceFieldForm',
				layout: 'form',
				bodyStyle: 'padding: 10px',
				url: pathUrl + '/datasourceconfig_sourceFieldEdit.action',
				border: false,
				split: false,
				items: [{
					xtype: 'textfield',
					name: 'source_id',
					readOnly: true,
					allowBlank: false,
					value: selectedSourceId,
					fieldLabel: '数据源ID',
					anchor: '95%',
					hidden : true
				},{
					xtype: 'textfield',
					name: 'column_name',
					allowBlank: false,
					fieldLabel: '字段名称',
					readOnly:true,
					anchor: '95%',
					style : 'background : #F0F0F0;color : #A0A0A0'
				},{
					xtype: 'textfield',
					name: 'column_biz_name',
					allowBlank: false,
					fieldLabel: '字段中文名',
					anchor: '95%'
				},{xtype:'textfield',
				   fieldLabel:'数据类型',
				   id:'edit_data_type_id',
				   name:'data_type_id',
				   readOnly:true,
				   allowBlank: false,
				   anchor:'95%',
				   style : 'background : #F0F0F0;color : #A0A0A0'
				},{
					xtype:'textfield',
					fieldLabel:'字段顺序',
					name:'column_order_id',
					readOnly:true,
					allowBlank: false,
					anchor:'95%',
					style : 'background : #F0F0F0;color : #A0A0A0'
				},{xtype:'combo',
			       fieldLabel:'是否维度',
			       id:'add_is_dim_id',
			       hiddenName:'is_dim_col',
				   valueField:'is_dim_col_value',
				   displayField:'is_dim_col_display',
				   store: new Ext.data.SimpleStore({
				   		fields:['is_dim_col_value','is_dim_col_display'],
				   		data:[['Y','是'],['N','否']]
				   }),
				   triggerAction:'all',
				   mode:'local',
				   editable: false,
				   anchor:'95%',
				   listeners:{
				   		select: function(){
				   			var combo_value = Ext.getCmp('add_is_dim_id').getValue();
				   			if(combo_value=='Y'){
				   				Ext.getCmp('linkIdSelector').setDisabled(false);
				   				Ext.getCmp('linkIdSelector').allowBlank=false;
				   			}else{
				   				Ext.getCmp("linkIdSelector").setValue('');
				   				Ext.getCmp('linkIdSelector').setDisabled(true);
				   			}
				   		}
				   }
				},{
					xtype: 'combo',
					store: src_field_ds,
					displayField: 'link_name',
					valueField: 'link_id',
					editable: false,
					fieldLabel: '维度链接',
					hiddenName: 'link_id',
					mode: 'local',
					id: 'linkIdSelector',
					triggerAction: 'all',
					anchor: '95%'
				}]
			}],
			buttons: [{
				text: '保存',
				handler: function(){
					var formPanel = Ext.getCmp("editSourceFieldForm");
					if(formPanel.form.isValid()) {
						if(Ext.getCmp("add_is_dim_id").getValue() == 'Y' && Ext.getCmp('linkIdSelector').getValue() == '') {
							Ext.Msg.alert("提示信息","维度字段必须选择一个参数链接");
							Ext.getCmp('linkIdSelector').focus();
							return;
						}
						formPanel.form.submit({
							waitMsg: '正在处理,请稍后......',
							success: function(form,action){
								Ext.Msg.alert("提示信息",action.result.info);
								if(action.result.success){
									Ext.getCmp("editSourceFieldWindow").destroy();
									sourceFieldStore.reload();
								}
							},
							failure: function(form,action){
								Ext.Msg.alert("提示信息",action.result.info);
							}
						});
					}else{
						Ext.Msg.alert("提示信息","请输入完整信息");
					}
				}
			},{
				text: '取消',
				handler: function(){
					Ext.getCmp("editSourceFieldWindow").destroy();
				}
			}]
		});
		EditSourceFieldWindow.superclass.initComponent.call(this);
	}
});

//删除数据源字段记录
function deleteSourceFieldRecord(source_id,column_name) {
	Ext.Ajax.request({
		method: 'POST',
		url: pathUrl + '/datasourceconfig_sourceFieldDelete.action',
		params: {column_name: column_name,source_id: source_id},
		callback: function (options, success, response) {
			var json=Ext.util.JSON.decode(response.responseText);
			if (success) { 
				Ext.MessageBox.alert("提示信息",json.info);
				sourceFieldStore.reload();
			} else {
				Ext.MessageBox.alert("提示信息",json.info);
			}
		}
	});	
}