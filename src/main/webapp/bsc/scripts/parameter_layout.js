/*
 * ------------------------------------------------------------------------------
 * 文件名称：parameterLayout.js 说 明：JavaScript脚本，提供kpi考核系数添加、删除方法和参数明细的维护。 版 本：1.0
 * 修改纪录:
 * ------------------------------------------------------------------------------
 * 时间 修改人 说明 2013-06-26 zzm 创建
 * ------------------------------------------------------------------------------
 * 
 */
/**
 * 考核对象类型Store
 */
var objCateDS = new Ext.data.JsonStore({
	url : pathUrl + '/selector_listobjCate.action',
	root : 'results',
	totalProperty : 'totalCount',
	fields : ['obj_cate_id', 'obj_cate_desc']
});
objCateDS.on("load",function(){
	if(objCateDS.getCount() > 0) {
		if(obj_cate_id == ''){
			obj_cate_id = objCateDS.getAt(0).get('obj_cate_id');
			obj_cate_desc = objCateDS.getAt(0).get('obj_cate_desc');
		}
//		Ext.getCmp("objCateSelector").setValue(obj_cate_id)
	}
});
objCateDS.load();

/**
 * 参数类型store
 */
var paramTypeStore = new Ext.data.JsonStore({
	url : pathUrl + '/selector_listParamType.action',
	root : 'results',
	totalProperty : 'totalCount',
	fields : ['param_type_id', 'param_type_desc']
});

Ext.onReady(function() {

	var parameterCM = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), {
		id : 'parameter_id',
		header : "参数代码",
		dataIndex : 'parameter_id'
	}, {
		header : "参数名称",
		dataIndex : 'parameter_name'
	}, {
		header : "数据类型",
		dataIndex : 'data_type_id',
		renderer : function(v) {
			if (v == 'NUMBER') {
				v = '数值型';
			} else if (v == 'DATE') {
				v = '日期型';
			} else if (v == 'STRING') {
				v = '字符型';
			} else {
				v = '';
			}
			return v;
		}
	}, {
		header : "默认值",
		dataIndex : 'value'/*,
		renderer : function(val) {
			var v = valueFormat(val);
			return v;
		}*/
	}, {
		header : "参数类型",
		dataIndex : 'param_type_id',
		renderer : function(v) {
			if (v == '01') {
				v = "<font color='red'>全局参数</font>";
			} else if (v == '02') {
				v = "<font color='green'>私有参数</font>";
			} else {
				v = '其他';
			}
			return v;
		}
	}, {
		header : "机构ID",
		dataIndex : 'owner_org_id',
		hidden : true
	}]);

	var parameterDS = new Ext.data.Store({
		proxy : new Ext.data.HttpProxy({
			url : pathUrl + '/bscParameter_common.action?method=listParameter'
		}),
		reader : new Ext.data.JsonReader({
			root : 'results',
			totalProperty : 'totalCount',
			id : 'parameter_id'
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
		}])
	});
	parameterDS.load();

	var parameterMB = [{
		text : '添加(a)',
		tooltip : '添加参数',
		iconCls : 'add',
		handler : function() {
			doAddParameter(parameterDS);
		}
	}, '-', {
		text : '编辑(e)',
		id : 'editProject',
		tooltip : '编辑参数',
		iconCls : 'edit',
		handler : function() {
			if (parameterGP.getSelectionModel().getSelections().length == 0) {
				Ext.MessageBox.alert('错误', '请选择一条记录，继续进行！');
				return;
			}
			doEditParameter(parameterDS, parameter_id);
		}
	}, '-', {
		text : '删除(s)',
		id : 'deleteProject',
		tooltip : '删除参数',
		iconCls : 'delete',
		handler : function() {
			if (parameterGP.getSelectionModel().getSelections().length == 0) {
				Ext.MessageBox.alert('错误', '请选择一条记录，继续进行！');
				return;
			}
			var bankOrgId = parameterGP.getSelectionModel().getSelections()[0].get('owner_org_id');
			var typeId = parameterGP.getSelectionModel().getSelections()[0].get('param_type_id');
			/*if(bankOrgId != ownerOrgId){
				Ext.MessageBox.alert('错误', '请选择一条记录，继续进行！');
				return;
			}*/
			parameter_id = parameterGP.getSelectionModel().getSelections()[0].get('parameter_id');
			doDeleteParameter(parameterDS, itemDS, parameter_id);
		}
	}];

	var checkModel = new Ext.grid.CheckboxSelectionModel({
		handleMouseDown : Ext.emptyFn
	});

	var itemCM = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(),
			checkModel, {
				id : 'object_id',
				header : "对象代码",
				dataIndex : 'object_id'
			}, {
				header : "对象名称",
				dataIndex : 'object_name'
			}, {
				header : "参数代码",
				dataIndex : 'parameter_id',
				hidden : true
			}, {
				header : "参数值",
				dataIndex : 'value'/*,
				renderer : function(val) {
//					var v = valueFormat(val);
//					return v;
				}*/
			}]);

	itemDS = new Ext.data.Store({
		proxy : new Ext.data.HttpProxy({
			url : pathUrl + '/bscParameter_common.action?method=listItems'
		}),
		reader : new Ext.data.JsonReader({
			root : 'results',
			totalProperty : 'totalCount',
			id : 'object_id'
		}, [{
			name : 'object_id'
		}, {
			name : 'object_name'
		}, {
			name : 'parameter_id'
		}, {
			name : 'value'
		}])
	});

	var itemMB = [{
		text : '添加对象(a)',
		tooltip : '添加对象参数明细',
		iconCls : 'add',
		handler : function() {
			if (parameter_id == '') {
				Ext.MessageBox.alert('提示信息', '请选择需要维护的参数，继续进行！');
				return;
			}
			var typeId= Ext.getCmp('objCateSelector').getValue();
			var typeDesc= Ext.get('objCateSelector').getValue();
			doEditListItemRole(itemDS, typeId, typeDesc);
		}
	}, '-', {
		text : '删除(s)',
		tooltip : '删除参数',
		iconCls : 'delete',
		handler : function() {
			if (itemGP.getSelectionModel().getSelections().length == 0) {
				Ext.MessageBox.alert('提示信息', '请选择一条记录，继续进行！');
				return;
			}
			if (obj_cate_id == '') {
				Ext.MessageBox.alert('提示信息', '请选择考核对象角色，继续进行！');
				return;
			}
			var id = '';
			for (var i = 0; i < itemGP.getSelectionModel().getSelections().length; i++) {
				if (id != '')
					id += ";";
				id += itemGP.getSelectionModel().getSelections()[i].get('object_id');
			}
			doDeleteItem(itemDS, id);
		}
	}/*, '-', {
		text : "导出模板(e)",
		tooltip : "导出参数明细模板",
		iconCls : "exportdata",
		handler : function() {
			if (parameter_id == '') {
				Ext.MessageBox.alert('提示信息', '请选择一个[参数]，继续进行！');
				return;
			}
			setExcelForm(obj_cate_id, obj_cate_desc,parameter_id, parameter_name);
		}
	}, '-', {
		text : "导入模板(i)",
		tooltip : "导入参数明细",
		iconCls : "importdata",
		handler : function() {
			doImportExcelData();
		}
	}*/, '->','请选择对象类型:', {
		xtype : 'combo',
		mode : 'local',
		displayField : 'obj_cate_desc',
		valueField : 'obj_cate_id',
		store : objCateDS,
		editable : false,
		triggerAction : 'all',
		fieldLabel : '考核对象类型',
		name : 'obj_cate_id',
		id : 'objCateSelector',
		anchor : '80%',
		listeners : {
			select  :function(combo, record, index ) {
				obj_cate_id = record.get('obj_cate_id');
				obj_cate_desc = record.get('obj_cate_desc');
				if(parameter_id ==''||parameter_id == null){
					return ;
				}else{
					itemDS.reload({
						params : {
							parameter_id : parameter_id,
							obj_cate_id : obj_cate_id
						}
					});
				}	
			}
		}
	}];

	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [parameterGP = new Ext.grid.GridPanel({
			region : 'center',
			title : '参数列表',
			frame : false,
			split : true,
			ds : parameterDS,
			cm : parameterCM,
			viewConfig : {
				forceFit : true
			},
			loadMask : true,
			tbar : parameterMB
		})/*, itemGP = new Ext.grid.GridPanel({
			region : 'east',
			title : '对象参数明细',
			frame : false,
			split : true,
			ds : itemDS,
			cm : itemCM,
			sm : checkModel,
			viewConfig : {
				forceFit : true
			},
			tbar : itemMB,
			loadMask : true,
			width : 600
		})*/]
	});

/*	parameterGP.on('mouseover', function(e) {
		var index = parameterGP.getView().findRowIndex(e.getTarget());
		if (index !== false) {
			var rowEl = Ext.get(e.getTarget());
			rowEl.set({
				'ext:qtip' : '<span style="color:red;">提示：双击可以可以进行编辑。</span>'
			}, false);
		}
	});*/

    parameterGP.getSelectionModel().on('rowselect', function(sm, index, record) {
//    	var objId = Ext.getCmp('objCateSelector').getValue();
    	parameter_id = record.get('parameter_id');
    	parameter_name = record.get('parameter_name');
    	
    	var bankOrgId = record.get('owner_org_id');
    	if(ownerOrgId!=bankOrgId){
    		Ext.getCmp('deleteProject').setDisabled(true);
    		Ext.getCmp('editProject').setDisabled(true);
    	}	
    	/*itemDS.reload({
			params : {
				parameter_id : parameter_id,
				obj_cate_id : objId
			}
		});*/
	});
    
/*	parameterGP.on('rowdblclick', function(gridPanel, rowIndex, e) {
		var parameter_id = parameterDS.data.items[rowIndex].get('parameter_id');
		doEditParameter(parameterDS, parameter_id);
	});*/
});