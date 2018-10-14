/*
 * ------------------------------------------------------------------------------
 * 文件名称：bsc_proj_mea_imp_layout.js 
 * 说 明：JavaScript脚本，提供方案中，考核结果直接由外部导入的指标。 
 * 版 本：1.0
 * 修改纪录:
 * ------------------------------------------------------------------------------
 * 时间 			修改人    说明 
 * 2013-07-10 	zzm      创建
 * ------------------------------------------------------------------------------
 * 
 */
var yearId = "",yearName = "", projectId = "",projectName = "", cycleTypeId = "", cycleId = "",cycleName = "", measure_search = "", object_search = "", measureId = "", measureName = "", mask = "", objectValues = "",chSelectIds="";

var proceduredProject = '';

var procedure = false;

var params = "" ;
var filePath = "";
/**
 * 年份下拉框store
 */
var yearStore = new Ext.data.JsonStore({
	url : pathUrl + '/selector_listYear.action',
	root : 'results',
	fields : ['year_id', 'year_name'],
	autoLoad : true,
	listeners : {
		load : function(store, records, options) {
			if (store.getCount() > 0) {
				if (yearId == '') {
					yearId = store.getAt(0).get('year_id');
					yearName = store.getAt(0).get('year_name');
				}
				Ext.getCmp("yearSelector").setValue(yearId)
			}
		}
	}
});
/**
 * 方案下拉框store
 */
var projectStore = new Ext.data.JsonStore({
	url : pathUrl + '/bscProject_common.action?method=listProject',
	root : 'results',
	fields : ["project_id", "project_name", "project_desc", "cycle_type_id",
			"obj_cate_id", "app_type_id", "full_score",
			"score_limit_low", "score_limit_high", "is_template",
			"owner_org_id", "create_user", "create_time", "update_user",
			"update_time","icon"],
	autoLoad : true,
	listeners : {
		beforeload : function(store, options) {
			store.baseParams = {
				is_template : 'N',
				type : 'selector'
			}
		},
		load : function(store, records, options) {
			if (store.getCount() > 0) {
				if (projectId == '') {
					projectId = store.getAt(0).get('project_id');
					projectName = store.getAt(0).get('project_name');
					cycleTypeId = store.getAt(0).get('cycle_type_id');
				}
				Ext.getCmp("projectSelector").setValue(projectId);
				cycleStore.load();
				measure_store.load();
			}
		}
	}
});

/**
 * 周期下拉框store
 */
var cycleStore = new Ext.data.JsonStore({
	url : pathUrl + '/selector_listCycle.action',
	root : 'results',
	fields : ['cycle_id', 'cycle_name'],
	listeners : {
		beforeload : function(store, options) {
			cycleStore.baseParams = {
				cycle_type_id : cycleTypeId
			}
		},
		load : function(store, records, options) {
			if (store.getCount() > 0) {
				if (cycleId == '') {
					cycleId = store.getAt(0).get('cycle_id');
					cycleName = store.getAt(0).get('cycle_name');
				}
				Ext.getCmp("cycleSelector").setValue(cycleId)
			}
		}
	}
});

/**
 * 指标store
 */
var measure_store = new Ext.data.JsonStore({
	url : pathUrl + '/projMeaImp_queryMeasure.action',
	root : 'results',
	fields : ['measure_id', 'measure_name'],
	listeners : {
		beforeload : function() {
			measureId = "";
			measureName ="";
//			params = "project_id=''&measure_id=''&year_id=''&cycle_id=''" ;
//			filePath = pathUrl + '/projMeaImp_dhtml.action?'+params;
//			load(filePath);
			if(dhtmlGrid != null)
				dhtmlGrid.clearAll(false); 
			if(proceduredProject.indexOf(projectId) == -1) {
				proceduredProject += ";"+projectId;
				procedure = true;
			}else 
				procedure = false;
			measure_store.baseParams = {
				project_id : projectId,
				source_type_id : '02',
				measure_search : measure_search,
				procedure :procedure
			}
		}
	}
});
/**
 * 指标ColumnModel
 */
var measure_cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), {
	header : '指标ID',
	dataIndex : 'measure_id'
}, {
	header : '指标名称',
	dataIndex : 'measure_name'
}]);

/**
 * 指标查询按钮
 * @type {}
 */
var measure_tbar = ['->', '搜索:', {
	xtype : 'textfield',
	id : 'specialKey',
	emptyText : '请输入指标ID或名称...',
	listeners : {
		blur : function(field) {
			measure_search = field.getValue();
		},
		specialkey : function(field, e) {
			if (e.getKey() == Ext.EventObject.ENTER) {
				if (projectId == '') {
					Ext.Msg.alert("提示信息", "请先选择方案!");
					return false;
				}
				measure_search = field.getValue();
				measure_store.load();
			}
		}
	}
}, {
	xtype : 'button',
	iconCls : 'search',
	handler : function() {
		if (projectId == '') {
			Ext.Msg.alert("提示信息", "请先选择方案!");
			return false;
		}
		measure_search = Ext.getCmp('specialKey').getValue();
		measure_store.load();
	}
}];

/**
 * 结果指标Grid
 */
var measure_panel = new Ext.grid.GridPanel({
	region : 'west',
	width : 500,
	title : '外部指标列表',
	id : 'measure_panel',
	split : true,
//	collapseMode : 'mini',
	sm : new Ext.grid.RowSelectionModel({
		singleSelect : true,
		listeners : {
			rowselect : function(selectionModel, rowIndex, record) {
				measureId = record.get('measure_id');
				measureName = record.get('measure_name');
				cycleId = Ext.getCmp('cycleSelector').getValue();
				// projMeaImptStore.load();
				params = "project_id=" + projectId + "&measure_id=" + measureId
						+ "&year_id=" + yearId + "&cycle_id=" + cycleId
						+ "&object_search=" + encodeURI(encodeURI(object_search));
				filePath = pathUrl + '/projMeaImp_dhtml.action?' + params;
				load(filePath);
			}
		}
	}),
	cm : measure_cm,
	ds : measure_store,
	tbar : measure_tbar,
	loadMask : true,
	autoScroll : true,
	viewConfig : {
		forceFit : true
	},
	listeners :{
		rowclick : function(grid, rowIndex, e){
			
		}
	}
});

var projMeaImptTbar = [{
	text : '导入指标值',
	tooltip : '导入指标值',
	iconCls : 'importdata',
	handler : function() {
		openUpload();
	}
}, '-', {
	text : '导出模板',
	tooltip : '导出模板',
	iconCls : 'exportdata',
	handler : function() {
		if (measureId == null || measureId == '') {
			Ext.MessageBox.alert('提示','请选择指标在继续进行.');
			return ;
		}
		cycleName = Ext.get('cycleSelector').getValue();
		setExcelForm();
	}
}, '-', {
	text : '保存指标值',
	tooltip : '保存修改结果',
	iconCls : 'save',
	id : 'save',
	disabled : true,
	handler : function() {
		if(objectValues==''){
			Ext.MessageBox.alert('提示','没有要保存的数据.');
			return ;
		}
		save();
	}
}, '-', {
	text : '清除指标值',
	tooltip : '清空结果值',
	iconCls : 'delete',
	id : 'delete',
	disabled : true,
	handler : function() {
		if(chSelectIds==''){
			Ext.MessageBox.alert('提示','没有要保存的数据.');
			return ;
		}
		Ext.MessageBox.confirm("提示信息","确定清除选中对象的指标导入值?",function(btn){
			if(btn == 'yes') {
				deleteValue();			
			}
		});
	}
}, '->', '搜索:', {
	xtype : 'textfield',
	id : 'object_search',
	emptyText : '请输入对象ID或名称...',
	listeners : {
		blur : function(field){
			object_search = field.getValue();
		},
		specialkey : function(field, e) {
			if (e.getKey() == Ext.EventObject.ENTER) {
				if (measureId != null && measureId != '') {
					object_search = field.getValue();
					params = "project_id=" + projectId + "&measure_id="
							+ measureId + "&year_id=" + yearId + "&cycle_id="
							+ cycleId + "&object_search=" + encodeURI(encodeURI(object_search));
					filePath = pathUrl + '/projMeaImp_dhtml.action?' + params;
					load(filePath);
				}
			}
		}
	}
}, {
	xtype : 'button',
	iconCls : 'search',
	handler : function() {
		if (measureId != null && measureId != '') {
			object_search = Ext.getCmp('object_search').getValue();
			params = "project_id=" + projectId + "&measure_id=" + measureId
					+ "&year_id=" + yearId + "&cycle_id=" + cycleId
					+ "&object_search=" + encodeURI(encodeURI(object_search));
			filePath = pathUrl + '/projMeaImp_dhtml.action?' + params;
			load(filePath);
		}
	}
}];

/*var projMeaImptPanel = new Ext.grid.EditorGridPanel({
	region : 'center',
	title : '考核对象列表',
	id : 'projecttarget_panel',
	cm : projMeaImptCm,
	ds : projMeaImptStore,
	tbar : projMeaImptTbar,
	clicksToEdit : 1,
	loadMask : true,
	autoScroll : true,
	viewConfig : {
		forceFit : true
	}
});*/

// 查询面板
var search_panel = new Ext.form.FormPanel({
	region : 'north',
	layout : 'column',
	title : '查询条件',
	frame : true,
	split : false,
	collapsible : true,
	height : 80,
	labelWidth : 33,
	buttonAlign : 'right',
	bodyStyle : {
		padding : '10px'
	},
	items : [{
		columnWidth : .3,
		layout : 'form',
		items : [{
			xtype : 'iconcombo',
			fieldLabel : '方案',
			valueField : 'project_id',
			displayField : 'project_name',
			hiddenName : 'project_id',
			store : projectStore,
			triggerAction : 'all',
			iconClsField : 'icon',
			mode : 'local',
			name : 'project_id',
			id : 'projectSelector',
			anchor : '91%',
			editable : false,
			listeners : {
				select : function(combo, record, index) {
					cycleId = "";
					cycleName = "";
					cycleTypeId = record.get('cycle_type_id')
					cycleStore.load();
//					measure_store.removeAll();
				}
			}
		}]
	},{
		columnWidth : .15,
		layout : 'form',
		items : [{
			xtype : 'combo',
			fieldLabel : '年度',
			valueField : 'year_id',
			displayField : 'year_name',
			hiddenName : 'year_id',
			store : yearStore,
			triggerAction : 'all',
			mode : 'local',
			name : 'year_id',
			id : 'yearSelector',
			anchor : '91%',
			editable : false
		}]
	},  {
		columnWidth : .15,
		layout : 'form',
		items : [{
			xtype : 'combo',
			fieldLabel : '周期',
			valueField : 'cycle_id',
			displayField : 'cycle_name',
			store : cycleStore,
			hiddenName : 'cycle_id',
			triggerAction : 'all',
			mode : 'local',
			name : 'cycle_id',
			id : 'cycleSelector',
			anchor : '91%',
			editable : false
		}]
	},{
		columnWidth : .2,
		layout : 'form',
		items : [{
			xtype : 'button',
			text : '查询',
			iconCls : 'search',
			handler : function() {
				measureId = "";
				measureName = "";
				yearId = Ext.getCmp("yearSelector").getValue();
				yearName = Ext.get('yearSelector').getValue();
				projectId = Ext.getCmp("projectSelector").getValue();
				projectName = Ext.get('projectSelector').getValue();
				measure_store.load();
			}
		}]
	}]
});

Ext.onReady(function() {
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [search_panel, new Ext.Panel({
			region : 'center',
			layout : 'border',
			items : [measure_panel, {
				region : 'center',
				title : '考核对象列表',
				border : true,
				tbar : projMeaImptTbar,
				contentEl : 'center'
			}]
		})]
	});
	
	mask = new Ext.LoadMask(Ext.get('center'), {
		msg : "正在加载,请稍后......"
	});
	
});