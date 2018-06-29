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
function doAddParameter(dataStore) {
	var formPanel = new Ext.form.FormPanel({
		baseCls : 'x-plain',
		labelWidth : 75,
		url : '../bscParameter_common.action?method=addParameter',
		items : [{
			xtype : 'textfield',
			fieldLabel : '参数代码',
			allowBlank : false,
			id : 'parameter_id',
			name : 'parameter_id',
			anchor : '95%',
			regex : /^[a-zA-Z][a-zA-Z\d_]*$/,
			regexText : '参数代码请以字母开头，不能存在特殊字符和汉字！',
			listeners : {
				blur : function(field) {
					if (field.validate()) {
						Ext.Ajax.request({
							url : pathUrl + '/bscParameter_common.action?method=examineID',
							method : 'POST',
							params : {
								parameter_id : field.getValue()
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
			xtype : 'textfield',
			fieldLabel : '参数名称',
			allowBlank : false,
			id : 'parameter_name',
			name : 'parameter_name',
			anchor : '95%'
		}, {
			xtype : 'combo',
			store : new Ext.data.SimpleStore({
				fields : ['retrunValue', 'displayText'],
				data : [['NUMBER', '数值型'], ['DATE', '日期型'], ['STRING', '字符型']]
			}),
			valueField : 'retrunValue',
			displayField : 'displayText',
			mode : 'local',
			forceSelection : true,
			hiddenName : 'data_type_id',
			editable : false,
			triggerAction : 'all',
			allowBlank : false,
			fieldLabel : '数据类型',
			name : 'data_type_id',
			value : 'NUMBER',
			anchor : '95%'
		}, {
			xtype : 'combo',
			store : paramTypeStore,
			valueField : 'param_type_id',
			displayField : 'param_type_desc',
			mode : 'local',
			forceSelection : true,
			hiddenName : 'param_type_id',
			editable : false,
			triggerAction : 'all',
			allowBlank : false,
			fieldLabel : '参数类型',
			name : 'param_type_id',
			id : 'paramTypeSelector',
			anchor : '95%'
		}, {
			xtype : 'numberfield',
			fieldLabel : '默认值',
			allowBlank : false,
			id : 'value',
			name : 'value',
			anchor : '95%'
		}]
	});

	var window = new Ext.Window({
		title : '参数维护',
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

	paramTypeStore.on("load",function(){
		if(paramTypeStore.getCount() > 0) {
			if(paramTypeId == ''){
//				paramTypeStore.removeAt(0);
				paramTypeId = paramTypeStore.getAt(0).get('param_type_id');
			}
			Ext.getCmp("paramTypeSelector").setValue(paramTypeId)
		}
	});
	paramTypeStore.load();	
};

/**
 * 双击进行编辑
 * @param {} dataStore
 * @param {} parameter_id
 * @param {} owner_id
 */
function doEditParameter(dataStore, parameter_id) {
	var formPanel = new Ext.form.FormPanel({
		baseCls : 'x-plain',
		labelWidth : 75,
		url : '../bscParameter_common.action?method=updateParameter',
		reader : new Ext.data.JsonReader({
			root : 'results'
		}, [{
			name : 'parameter_id'
		}, {
			name : 'parameter_name'
		}, {
			name : 'data_type_id'
		}, {
			name : 'value'
		}, {
			name : 'param_type_id'
		}, {
			name : 'owner_org_id'
		}]),
		items : [{
			xtype : 'textfield',
			fieldLabel : '参数代码',
			allowBlank : false,
			readOnly : true,
			id : 'parameter_id',
			name : 'parameter_id',
			anchor : '95%',
			style : 'background:#F0F0F0;color:#A0A0A0'
		}, {
			xtype : 'textfield',
			fieldLabel : '参数名称',
			allowBlank : false,
			id : 'parameter_name',
			name : 'parameter_name',
			anchor : '95%'
		}, {
			xtype : 'combo',
			store : new Ext.data.SimpleStore({
				fields : ['retrunValue', 'displayText'],
				data : [['NUMBER', '数值型'], ['DATE', '日期型'], ['STRING', '字符型']]
			}),
			valueField : 'retrunValue',
			displayField : 'displayText',
			mode : 'local',
			forceSelection : true,
			hiddenName : 'data_type_id',
			editable : false,
			triggerAction : 'all',
			allowBlank : false,
			fieldLabel : '数据类型',
			name : 'data_type_id',
			value : 'NUMBER',
			anchor : '95%'
		}, {
			xtype : 'combo',
			store : paramTypeStore,
			valueField : 'param_type_id',
			displayField : 'param_type_desc',
			mode : 'local',
			forceSelection : true,
			hiddenName : 'param_type_id',
			editable : false,
			triggerAction : 'all',
			allowBlank : false,
			fieldLabel : '参数类型',
			name : 'param_type_id',
			id : 'paramTypeSelector',
			anchor : '95%'
		}, {
			xtype : 'numberfield',
			fieldLabel : '默认值',
			allowBlank : false,
			id : 'value',
			name : 'value',
			anchor : '95%'
		}]
	});

	formPanel.form.load({
		url : '../bscParameter_common.action?method=findParameter',
		params : {
			parameter_id : parameter_id
		}
	});

	var window = new Ext.Window({
		title : '参数维护',
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
							parameter_id : parameter_id
						},
						waitMsg : '正在处理，请稍候。。。。。。',
						failure : function(form, action) {
							Ext.MessageBox.alert('错误', action.result.info);
						},
						success : function(form, action) {
							Ext.MessageBox.alert('确认', '保存完毕！');
							window.destroy();
							dataStore.reload();
							parameter_id ='';
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
	
	
	paramTypeStore.on("load",function(){
		if(paramTypeStore.getCount() > 0) {
			if(paramTypeId == '')
				paramTypeId = paramTypeStore.getAt(0).get('param_type_id');
			Ext.getCmp("paramTypeSelector").setValue(paramTypeId)
		}
	});
	paramTypeStore.load();		
};

/**
 * 删除参数
 * @param {} dataStore
 * @param {} itemDataStore
 * @param {} parameter_id
 * @param {} owner_id
 */
function doDeleteParameter(dataStore, itemDataStore, parameter_id, owner_id) {
	Ext.MessageBox.confirm('Message', '确认删除选中的参数及其明细吗?', function(btn) {
		if (btn == 'yes') {
			Ext.Ajax.request({
				url : '../bscParameter_common.action?method=deleteParameter',
				method : 'POST',
				params : {
					parameter_id : parameter_id
				},
				callback : function(options, success, response) {
					var json = Ext.util.JSON.decode(response.responseText);
					if (json.results[0].success) {
						dataStore.reload();
						itemDataStore.removeAll();
						parameter_id ='';
					} else {
						showFailureDate(parameter_id,eval(json.results[0].info));
					}
				}
			});
		}
	});
}

function doEditBankItem(dataStore) {
	var root = getRootNode('000000', '总行', expandBankTreeNode);
	var treeLoader = new Ext.tree.TreeLoader();

	// define window and show it in desktop
	var window = new Ext.Window({
		title : '参数维护',
		width : 480,
		height : 400,
		border : false,
		layout : 'border',
		id : 'window',
		items : [treePanel = new Ext.tree.TreePanel({
			region : 'center',
			id : 'treePanel',
			loader : treeLoader,
			lines : false,
			frame : false,
			split : true,
			autoScroll : true,
			root : root
		}), formPanel = new Ext.form.FormPanel({
			region : 'south',
			frame : true,
			split : true,
			height : 80,
			labelWidth : 75,
			bodyStyle : 'padding:5px',
			url : '../projectAjaxAction.do?method=saveItem',
			reader : new Ext.data.JsonReader({
				root : 'results'
			}, [{
				name : 'objectID'
			}, {
				name : 'value'
			}]),
			items : [{
				xtype : 'hidden',
				id : 'objectID',
				name : 'objectID'
			}, {
				xtype : 'textfield',
				fieldLabel : '参数取值',
				allowBlank : false,
				name : 'value',
				anchor : '90%'
			}],
			buttons : [{
				text : '保存',
				handler : function() {
					if (formPanel.form.isValid()) {
						formPanel.form.submit({
							params : {
								projectID : projectID,
								parameterID : parameterID
							},
							waitMsg : '正在处理，请稍候。。。。。。',
							failure : function(form, action) {
								Ext.MessageBox.alert('错误', action.result.info);
							},
							success : function(form, action) {
								Ext.MessageBox.alert('确认', '保存完毕！');
								dataStore.reload({
									params : {
										projectID : projectID,
										parameterID : parameterID
									}
								});
							}
						});
					} else {
						Ext.MessageBox.alert('错误', '请填写必输项！');
					}
				}
			}, {
				text : '关闭',
				handler : function() {
					dataStore.reload({
						params : {
							projectID : projectID,
							parameterID : parameterID
						}
					});
					window.hide();
				}
			}]
		})]
	});

	treePanel.on('click', function(node) {
		var bankID = node.id;
		formPanel.form.load({
			url : '../projectAjaxAction.do?method=findItem',
			params : {
				projectID : projectID,
				parameterID : parameterID,
				objectID : bankID
			}
		});
	});

	window.show();
};


//根据角色显示参数明细
function doEditListItemRole(itemDS, typeId, typeDesc) {

	var searchObjectId = '';
	
	var objectSM = new Ext.grid.CheckboxSelectionModel({
		handleMouseDown : Ext.emptyFn
	});
	var objectCM = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(),
			objectSM, {
				id : 'object_id',
				header : '对象代码',
				dataIndex : 'object_id'
			}, {
				header : '对象名称',
				dataIndex : 'object_name'
			}]);

	var objectDS = new Ext.data.Store({
		proxy : new Ext.data.HttpProxy({
			url : pathUrl
					+ '/bscParameter_common.action?method=listObjects&obj_cate_id='
					+ typeId
		}),
		reader : new Ext.data.JsonReader({
			root : 'results',
			totalProperty : 'totalCount',
			id : 'object_id'
		}, [{
			name : 'object_id'
		}, {
			name : 'object_name'
		}])
	});

	objectDS.on('beforeload', function(objectDS) {
		objectDS.baseParams = {
			orgId : Ext.getCmp("bankSelector").getValue(),
			searchObjectId : searchObjectId
		};
	});

	var searchField = new Ext.form.TextField({
		id : "object_name",
		name : "object_name",
		emptyText : '请输入名称或关键字...',
		listeners : {
			specialkey : function(field, e) {
				if (e.getKey() == Ext.EventObject.ENTER) {
					var object = Ext.getCmp("object_name").getValue();
					searchObjectId = object;
					searchObject(object, objectDS);
				}
			}
		}
	});

	var toolbar = [{
		xtype : 'tbtext',
		text : '考核对象:'
	}, searchField, {
		text : "搜索",
		tooltip : "搜索考核对象",
		iconCls : "search",
		handler : function() {
			var objectName = Ext.getCmp("object_name").getValue();
			searchObjectId = objectName;
			searchObject(objectName, objectDS);
		}
	}];

	var addCM = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), {
		id : 'object_id',
		header : '对象代码',
		dataIndex : 'object_id'
	}, {
		header : '对象名称',
		dataIndex : 'object_name'
	}]);

	var localStore = new Ext.data.SimpleStore({
		fields : ["object_id", "object_name"],
		data : []
	});

	var addPanel = new Ext.grid.GridPanel({
		title : "已选定对象",
		region : "center",
		split : true,
		loadMask : true,
		autoExpandColumn : 2,
		ds : localStore,
		cm : addCM,
		autoScroll : true
	});

	var window = new Ext.Window({
		title : '添加对象',
		width : 720,
		height : 450,
		border : false,
		plain : true,
		modal : true,
		layout : 'border',
		id : 'window',
		items : [{
			region : "west",
			layout : "border",
			border : false,
			split : true,
			width : 380,
			items : [new Ext.form.FormPanel({
				region : 'north',
				border : false,
				frame : true,
				split : true,
				labelWidth : 75,
				layout : 'column',
				height : 80,
				bodyStyle : 'padding:5px',
				items : [{
					columnWidth : .85,
					border : false,
					layout : 'form',
					items : [{
						xtype : 'textfield',
						id : 'role_name',
						name : 'role_name',
						fieldLabel : '对象类型',
						value : typeDesc,
						disabled : true,
						readOnly : true,
						anchor : '95%'
					}, bankSelector = new BankSelector({
						width : 162,
						leftClassName : 'span_left2',
						rightClassName : 'span_right2',
						afterStore : objectDS
					})]
				},{
					columnWidth : .15,
					border : false,
					layout : 'form',
					items : [{
						xtype : 'panel',
						border : false,
						height : 28
					},{
						xtype : 'button',
						text : '查询',
						width : 40,
						handler : function() {
							objectDS.load({
								params : {
									start : 0,
									limit : 30
								}
							});
						}
					}]
				}]
			}), gridPanel = new Ext.grid.GridPanel({
				region : 'center',
				frame : false,
				split : true,
				ds : objectDS,
				sm : objectSM,
				cm : objectCM,
				loadMask : true,
				viewConfig : {
					forceFit : true
				},
				tbar : toolbar,
				bbar : new Ext.PagingToolbar({
					pageSize : 30,
					store : objectDS,
					displayInfo : true,
					displayMsg : '显示 {0} - {1} 条,共 {2} 条',
					emptyMsg : "没有记录",
					firstText : '第一页',
					prevText : '上一页',
					nextText : '下一页',
					lastText : '最后一页',
					refreshText : '刷新'
				})
			})]
		}, {
			region : "center",
			layout : "border",
			border : false,
			items : [addPanel,formPanel = new Ext.form.FormPanel({
				region : 'south',
				buttonAlign : 'center',
				frame : true,
				split : true,
				height : 80,
				labelWidth : 75,
				bodyStyle : 'padding:5px',
				url : pathUrl + '/bscParameter_common.action?method=saveItem',
				items : [{
					xtype : 'hidden',
					id : 'object_id',
					name : 'object_id'
				}, {
					xtype : 'numberfield',
					fieldLabel : '参数取值',
					allowBlank : false,
					name : 'value',
					anchor : '90%'
				}],
				buttons : [{
					text : '保存',
					handler : function() {
						if (localStore.getCount() <= 0) {
							Ext.MessageBox.alert('错误', "请选择要设定的对象");
							return;
						} else {
							// 拼接修改ID
							var ids = '';
							for (var i = 0; i < localStore.getCount(); i++) {
								var id = localStore.getAt(i).get('object_id');
								if (ids != '')
									ids += ';';
								ids += id;
							}
						}
						Ext.getCmp("object_id").setValue(ids);

						if (formPanel.form.isValid()) {
							formPanel.form.submit({
								params : {
									parameter_id : parameter_id,
									obj_cate_id : typeId
								},
								waitMsg : '正在处理，请稍候。。。。。。',
								failure : function(form, action) {
									Ext.MessageBox.alert('错误',action.result.info);
								},
								success : function(form, action) {
									Ext.MessageBox.alert('确认', '保存完毕！');
									window.destroy();
									itemDS.reload({
										params : {
											parameter_id : parameter_id,
											obj_cate_id : typeId
										}
									});
								}
							});
						} else {
							Ext.MessageBox.alert('错误', '请填写必输项！');
						}
					}
				}, {
					text : '取消',
					handler : function() {
						itemDS.reload({
							params : {
								parameter_id : parameter_id,
								obj_cate_id : typeId
							}
						});
						window.destroy();
					}
				}]
			})]
		}]
	});

	var Plant = new Ext.data.Record.create([{
		name : "object_id",
		mapping : "object_id",
		type : "string"
	}, {
		name : "object_name",
		mapping : "object_name",
		type : "string"
	}]);

	gridPanel.getSelectionModel().on("rowselect",
			function(sm, rowIndex, record) {
				var object_id = record.get('object_id');
				if (localStore.find("object_id", object_id) != -1) {
					return;
				}
				var plant = new Plant({
					object_id : record.get('object_id'),
					object_name : record.get('object_name')
				});
				localStore.insert(0, plant);
				localStore.sort('object_id','ASC');
			});

	gridPanel.getSelectionModel().on("rowdeselect",function(sm, rowIndex, record) {
		var object_id = record.get('object_id');
		var removeObject = localStore.getAt(localStore.find("object_id", object_id));
		localStore.remove(removeObject);
		localStore.sort('object_id','ASC');
	});
	window.on({
		beforeShow : function (){
			searchObjectId = '';
		}
	});
	window.show();
	bankSelector.on("valuechange",function(){});
	bankSelector.initUI();
};
/**
 * 查询考核对象
 */
function searchObject(object, ds) {
	ds.load({
		params : {
			searchObjectId : object,
			start : 0,
			limit : 30
		}
	});
}

function doDeleteItem(dataStore, id) {
	Ext.MessageBox.confirm('Message', '确认删除选中的参数值吗?', function(btn) {
		if (btn == 'yes') {
			Ext.Ajax.request({
				url : '../bscParameter_common.action?method=deleteItem',
				method : 'POST',
				params : {
					parameter_id : parameter_id,
					object_id : id,
					obj_cate_id : obj_cate_id
				},
				callback : function(options, success, response) {
					var json = Ext.util.JSON.decode(response.responseText);
					if (json.success) {
						Ext.MessageBox.hide();
						dataStore.reload({
							params : {
								parameter_id : parameter_id,
								obj_cate_id : obj_cate_id
							}
						});
					} else {
						Ext.MessageBox.alert('错误', json.info);
					}
				}
			});
		}
	});
}

/**
 * 上传专用 
 */
function openUpload(domId){   
	var uploadWin = new Ext.Window({  
   		title: '资源上传',  
   		width: 400,  
   		height:150,  
   		layout: 'fit',  
   		plain:true,  
   		modal : true,
   		bodyStyle:'padding:5px;',  
   		buttonAlign:'center',  
   		items : [
   			formUpload = new Ext.form.FormPanel({  
   				baseCls: 'x-plain',  
	   			labelWidth: 40,  
   				fileUpload:true,  
   				defaultType: 'textfield',  
   				url: pathUrl+'/bsc/uploadFile.action',
   				items: [{
   					xtype: 'textfield',  
   					fieldLabel: '文件',
   					name: 'uploadFile',  
   					id:'upload',
   					inputType: 'file',  
   					allowBlank: false,  
   					blankText:'必须选择一个文件进行上传。',
   					anchor: '90%' 
     			}]   
   			})
   		],
   		
   		buttons: [{  
   			text: '上传',  
   			handler: function() {  
   				var uploadFileVal = Ext.getCmp('upload').getValue();
   				var uploadFileExt = uploadFileVal.substring(uploadFileVal.lastIndexOf('.')+1);
   				var fileName = uploadFileVal.substring(uploadFileVal.lastIndexOf('\\')+1);

   				if(uploadFileExt != 'xls'){
   					Ext.Msg.alert('提示','文件格式错误，系统目前只支持excel 2003格式的文件。');
   					return;
   				}
   				if(formUpload.form.isValid()){  
   					Ext.MessageBox.show({  
   						title: '请稍后',  
   						msg: '资源上传中...',  
   						progressText: '',  
   						width:300,  
   						progress:true,  
   						closable:false,  
   						animEl: 'loding'  
   					});  
   					formUpload.getForm().submit({
   						params :{fileName:fileName},
             			success: function(form, action){    
                			var fileName=action.result.uploadfileName;
							Ext.getCmp('hiddenFile').setValue(fileName);
                			Ext.get(domId).dom.value = fileName;  
                			Ext.Msg.alert('成功','上传成功！');    
                			uploadWin.destroy();      
             			},         
              			failure: function(form, action){
              				Ext.Msg.alert('失败', '上传失败！');    
              			}  
           			})   
         		}  
        	}  
     	},{
       		text: '取消',  
       		handler:function(){uploadWin.destroy();}   
        }]   
    });  
	uploadWin.show() ;
}

/**
 * 保存结果
 */
function saveImportData(hiddenFileName,win) {
	var mask = new Ext.LoadMask(Ext.getBody(), {   
        msg : "数据校验成功，开始保存导入结果，请耐心等候。。。"  
    });
    mask.show();
	Ext.Ajax.request({
		url : pathUrl + '/bscParameterImportAjax.action',
		method : 'POST',
		params : {
			hiddenFile:hiddenFileName
		},
		callback : function(options, success, response) {
			var json = Ext.util.JSON.decode(response.responseText);
			if (json.success) {
				mask.hide();
				Ext.Msg.show({
					title : '成功',
					msg : '批量导入成功。',
					buttons : Ext.Msg.OK,
					fn : function() {
						win.close();
						itemDS.reload({
							params : {
								project_id : project_id,
								parameter_id : parameter_id,
								role_id : role_id
							}
						});
					},
					animEl : 'elId',
					icon : Ext.MessageBox.INFO
				});
			}else{
				Ext.MessageBox.alert('失败',json.info);
			}
		}
	});
}

/**
 * 数据校验失败结果
 */
function showFailResult(failedData){   
	var resultDS = new Ext.data.SimpleStore({
        fields: [
           {name: 'line_no'},
           {name: 'failed_reason', type: 'string'}
        ]
    });
    resultDS.loadData(failedData);
	
	var grid = new Ext.grid.GridPanel({
		region:'center',
        store: resultDS,
        columns: [
        	new Ext.grid.RowNumberer(),
            {id:'line_no',header: "Excel行号", width: 80, sortable: true, dataIndex: 'line_no'},
            {id:'failed_reason',header: "失败原因", width: 380, sortable: true,  dataIndex: 'failed_reason'}
        ],
        autoExpandColumn: 'line_no'
    });
    
    var resWin = new Ext.Window({
		title : '下列数据校验失败，请进行修改，重新导入',
		width : 500,
		height : 300,
		plain : true,
		border : false,
		layout : 'border',
		items : [grid],
		buttonAlign:'center',
		buttons: [{ 
			text: '确定',
			handler: function(){
				resWin.destroy();
			}
		}]
	});
	resWin.show();
}


BankSelector = function(obj) {
	var b = true;
	var width = obj.width ? obj.width : 132;
	var leftClassName = obj.leftClassName ? obj.leftClassName : 'span_left';
	var rightClassName = obj.rightClassName ? obj.rightClassName : 'span_right';
	
	var store = new Ext.data.Store({
		proxy : new Ext.data.HttpProxy({
			url : pathUrl + '/selector_listBankOrganization.action'
		}),
		reader : new Ext.data.JsonReader({
			root : 'results'
		}, [{
			name : 'bank_org_id'
		}, {
			name : 'bank_org_name'
		}]),
		remoteSort : false
	});

	store.on('load', changeSelect);
	store.load();

	BankSelector.superclass.constructor.call(this, {
		layout : 'form',
		border : false,
		items : [{
			xtype : 'combo',
			store : store,
			valueField : 'bank_org_id',
			displayField : 'bank_org_name',
			mode : 'local',
			hiddenName : 'bank_org_id',
			editable : false,
			triggerAction : 'all',
			allowBlank : false,
			fieldLabel : '机&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;构',
			name : 'bank_org_id',
			id : 'bankSelector',
			width : width
		}]
	});

	function changeSelect() {
		if (store.getCount() > 0) {
			var combo = Ext.getCmp('bankSelector');
			var value = store.getAt(0).get('bank_org_id');
			combo.setValue(value);
			
			if(obj.afterStore && b) {
				obj.afterStore.load();
			}
			b = false;
		}
	}

	this.load = function(m) {
		var combo = Ext.getCmp('bankSelector');
		var bankOrgID = combo.getValue();
		store.load({
			params : {
				bank_org_id : bankOrgID,
				mode : m
			}
		});
	}

	this.initUI = function() {

		var div = Ext.getDom('bank_org_id').parentNode;
		var span1 = document.createElement("span");
		span1.className = leftClassName;
		span1.innerHTML = "<a href='javascript:bankSelector.load(\"DrillUP\")'><img src="+ pathUrl + "/public/images/leftArrow.gif></a>";
		div.appendChild(span1);
		var span2 = document.createElement("span");
		span2.className = rightClassName;
		span2.innerHTML = "<a href='javascript:bankSelector.load(\"DrillDown\")'><img src="+ pathUrl + "/public/images/rightArrow.gif></a>";
		div.appendChild(span2);

	}
}
Ext.extend(BankSelector, Ext.Panel);

/**
 * 输出错误信息
 */
function showFailureDate(parameter_id,failedData){
		
	var resultDs = new Ext.data.SimpleStore({
		fields: [
			{name:'dependId',type:'string'},
			{name:'dependName',type:'string'},
			{name:'dependOwnerBankId',type:'string'},
			{name:'dependOwnerBankName',type:'string'}
			]
	});
	
	resultDs.loadData(failedData);
	
	var grid = new Ext.grid.GridPanel({
		region : 'center',
		store : resultDs,
		columns:[
			new Ext.grid.RowNumberer(),
			{id:'dependId',header:'依赖实体ID',width:180,sortable:true,dataIndex:'dependId'},
			{id:'dependName',header:'依赖实体名称',width:180,sortable:true,dataIndex:'dependName'},
			{id:'dependOwnerBankId',header:'归属机构ID',width:100,sortable:true,dataIndex:'dependOwnerBankId'},
			{id:'dependOwnerBankName',header:'归属机构名称',width:100,sortable:true,dataIndex:'dependOwnerBankName'}
		]
	});
	
	var win = new Ext.Window({
		width:600,
		height:300,
		border:false,
		layout:'border',
		buttonAlign:'center',
		modal:true,
		items:[grid],
		buttons:[{
			text : '确定',
			handler : function(){
				win.destroy();
			}
		}]
	});
	win.setTitle("参数为["+parameter_id+']存在以下依赖关系');
	win.show();
}


