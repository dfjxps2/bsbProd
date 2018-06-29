﻿/*
------------------------------------------------------------------------------
文件名称：parameter.js
说    明：JavaScript脚本，提供kpi考核系数添加、删除方法和参数明细的维护。
版    本：1.0
修改纪录:
------------------------------------------------------------------------------
时间              修改人         说明
2013-06-26      zzm         创建
------------------------------------------------------------------------------

*/
Ext.form.Field.prototype.msgTarget = 'side';
/**
 * 添加考核系数
 * @param {} dataStore
 */
function doAddMeasure(dataStore) {
	var formPanel = new Ext.form.FormPanel({
		baseCls : 'x-plain',
		labelWidth : 90,
		url : '../enteringMeasure_common.action?method=addMeasure',
		items : [{
			xtype : 'textfield',
			fieldLabel : '编号',
			allowBlank : false,
			id : 'measure_id',
			name : 'measure_id',
			anchor : '95%',
			regex : /^[a-zA-Z][a-zA-Z\d_]*$/,
			regexText : '参数代码请以字母开头，不能存在特殊字符和汉字！',
			listeners : {
				blur : function(field) {
					if (field.validate()) {
						Ext.Ajax.request({
							url : pathUrl + '/enteringMeasure_common.action?method=examineID',
							method : 'POST',
							params : {
								measure_id : field.getValue()
							},
							callback : function(options, success, response) {
								var json = Ext.util.JSON.decode(response.responseText);
								if (json.success) {
								} else {
//									Ext.MessageBox.alert('错误', json.info);
									field.markInvalid(json.info);
								}
							}
						});
					}
				}
			}
		}, {
			xtype : 'combo',
			store : objOrg,
			valueField : 'org_id',
			displayField : 'org_name',
			mode : 'local',
			forceSelection : true,
			hiddenName : 'org_id',
			editable : true,
			triggerAction : 'all',
			allowBlank : false,
			fieldLabel : '单位',
			name : 'org_id',
			anchor : '95%',
			listeners:{
		        beforequery : function(e) {
		            var combo = e.combo;
		            combo.collapse();//收起
		            if (!e.forceAll) {//如果不是通过选择，而是文本框录入
		            	var value = e.query;
		                combo.store.clearFilter();
		                combo.store.filterBy(function(record, id) {
		                    var text = record.get(combo.displayField);
		                    // 用自己的过滤规则,如写正则式
		                    return (text.indexOf(value) != -1);
		                });
		                combo.onLoad();//不加第一次会显示不出来
		                combo.expand();
		                return false;
		            }
		            if(!value) {
		                //如果文本框没值，清除过滤器
		                combo.store.clearFilter();
		            }
		        }
		    }
		}, {
			xtype : 'textfield',
			fieldLabel : '信息提供单位',
			allowBlank : false,
			id : 'praise_org',
			name : 'praise_org',
			anchor : '95%'
		}, {
			xtype : 'combo',
			store : new Ext.data.SimpleStore({
				fields : ['retrunValue', 'displayText'],
				data : [['00', '加分项'], ['01', '扣分项']]
			}),
			valueField : 'retrunValue',
			displayField : 'displayText',
			mode : 'local',
			forceSelection : true,
			hiddenName : 'type',
			editable : false,
			triggerAction : 'all',
			allowBlank : false,
			fieldLabel : '类型',
			name : 'type',
			anchor : '95%'
		}, {
			xtype : 'combo',
			store : mouthDS,
			valueField : 'mouth_id',
			displayField : 'mouth_name',
			mode : 'local',
			forceSelection : true,
			hiddenName : 'mouth_id',
			editable : false,
			triggerAction : 'all',
			allowBlank : false,
			fieldLabel : '月份',
			name : 'mouth_id',
			id : 'mouthNameSelector',
			anchor : '95%'
		}, {
			xtype : 'textfield',
			fieldLabel : '分数',
			allowBlank : false,
			id : 'score',
			name : 'score',
			type : 'NUMBER',
			anchor : '95%'
		}, {
			xtype : 'textfield',
			fieldLabel : '备注',
			allowBlank : false,
			id : 'remark',
			name : 'remark',
			anchor : '95%'
		}]
	});

	var window = new Ext.Window({
		title : '添加记录',
		width : 500,
		height : 300,
		layout : 'fit',
		plain : true,
		modal : true,
		bodyStyle : 'padding:10px;',
		buttonAlign : 'center',
		items : formPanel,
		id : 'window',
		buttons : [{
			text : '保存',
			handler : function() {
				if (formPanel.form.isValid()) {
					formPanel.form.submit({
						waitMsg : '正在处理，请稍候。。。。。。',
						failure : function(form, action) {
							Ext.MessageBox.alert('错误', action.result.info);
						},
						success : function(form, action) {
							Ext.MessageBox.alert('确认', '保存完毕！');
							window.destroy();
							dataStore.reload();
						}
					});
				} else {
					Ext.MessageBox.alert('错误', '请填写必输项！');
				}
			}
		}, {
			text : '取消',
			handler : function() {
				window.destroy();
			}
		}]
	});

	window.show();

	objOrg.on("load",function(){
		if(objOrg.getCount() > 0) {
				org_id = objOrg.getAt(0).get('org_id');
				org_name = objOrg.getAt(0).get('org_name');
//			Ext.getCmp("objCateSelector").setValue(obj_cate_id)
		}
	});
	objOrg.load();	
};

/**
 * 双击进行编辑
 * @param {} dataStore
 * @param {} parameter_id
 * @param {} owner_id
 */
function doEditMeasure(dataStore, measure_id,type) {
	var formPanel = new Ext.form.FormPanel({
		baseCls : 'x-plain',
		labelWidth : 90,
		url : '../enteringMeasure_common.action?method=updateMeasure',
		reader : new Ext.data.JsonReader({
			root : 'results'
		}, [{
			name : 'measure_id'
		},{
			name : 'org_id'
		}, {
			name : 'praise_org'
		}, {
			name : 'type'
		}, {
			name : 'mouth_id'
		}, {
			name : 'score'
		}, {
			name : 'remark'
		}]),
		items : [{
			xtype : 'textfield',
			fieldLabel : '编号',
			allowBlank : false,
			readOnly : true,
			id : 'measure_id',
			name : 'measure_id',
			anchor : '95%',
			style : 'background:#F0F0F0;color:#A0A0A0'
		}, {
			xtype : 'combo',
			store : objOrg,
			valueField : 'org_id',
			displayField : 'org_name',
			mode : 'local',
			forceSelection : true,
			hiddenName : 'org_id',
			readOnly : true,
			triggerAction : 'all',
			allowBlank : false,
			fieldLabel : '单位',
			name : 'org_id',
			anchor : '95%',
			style : 'background:#F0F0F0;color:#A0A0A0'
		}, {
			xtype : 'textfield',
			fieldLabel : '信息提供单位',
			allowBlank : false,
			id : 'praise_org',
			name : 'praise_org',
			anchor : '95%'
		}, {
			xtype : 'combo',
			store : new Ext.data.SimpleStore({
				fields : ['retrunValue', 'displayText'],
				data : [['00', '加分项'], ['01', '扣分项']]
			}),
			valueField : 'retrunValue',
			displayField : 'displayText',
			mode : 'local',
			forceSelection : true,
			hiddenName : 'type',
			editable : false,
			triggerAction : 'all',
			allowBlank : false,
			fieldLabel : '数据类型',
			name : 'type',
			anchor : '95%'
		},{
			xtype : 'combo',
			store : mouthDS,
			valueField : 'mouth_id',
			displayField : 'mouth_name',
			mode : 'local',
			forceSelection : true,
			hiddenName : 'mouth_id',
			editable : false,
			triggerAction : 'all',
			allowBlank : false,
			fieldLabel : '月份',
			name : 'mouth_id',
			id : 'mouthNameSelector',
			anchor : '95%'
		}, {
			xtype : 'textfield',
			fieldLabel : '分数',
			allowBlank : false,
			id : 'score',
			name : 'score',
			type : 'NUMBER',
			anchor : '95%'
		}, {
			xtype : 'textfield',
			fieldLabel : '备注',
			allowBlank : false,
			id : 'remark',
			name : 'remark',
			anchor : '95%'
		}]
	});
	
	formPanel.form.load({
		url : '../enteringMeasure_common.action?method=findMeasure',
		params : {
			measure_id : measure_id
		}
	});

	var window = new Ext.Window({
		title : '记录维护',
		width : 500,
		height : 300,
		layout : 'fit',
		plain : true,
		modal : true,
		bodyStyle : 'padding:10px;',
		buttonAlign : 'center',
		items : formPanel,
		id : 'window',
		buttons : [{
			text : '保存',
			handler : function() {
				if (formPanel.form.isValid()) {
					formPanel.form.submit({
						params : {
							measure_id : measure_id
						},
						waitMsg : '正在处理，请稍候。。。。。。',
						failure : function(form, action) {
							Ext.MessageBox.alert('错误', action.result.info);
						},
						success : function(form, action) {
							Ext.MessageBox.alert('确认', '保存完毕！');
							window.destroy();
							dataStore.reload();
							measure_id ='';
						}
					});
				} else {
					Ext.MessageBox.alert('错误', '请填写必输项！');
				}
			}
		}, {
			text : '取消',
			handler : function() {
				window.destroy();
			}
		}]
	});

	window.show();
	
	objOrg.on("load",function(){
		if(objOrg.getCount() > 0) {
				org_id = objOrg.getAt(0).get('org_id');
				org_name = objOrg.getAt(0).get('org_name');
//			Ext.getCmp("objCateSelector").setValue(obj_cate_id)
		}
	});
	objOrg.load();
		
};