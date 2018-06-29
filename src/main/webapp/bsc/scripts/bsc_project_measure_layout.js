var isTemplate = false;
var isTopBank = (userOrg=='8888');

var mask = null;

var projectName = '',roleName = '';
var project_id_hidden, project_name_hidden;
var pointLimitArray = new Array();
var canbeSelected = true;
/**
 * 方案Store
 */
var projectDS = new Ext.data.JsonStore({
	url : pathUrl + '/bscProject_common.action?method=listProject',
	root : 'results',
	id : 'project_id',
	totalProperty : 'totalCount',
	fields : ['project_id', 'project_name', 'app_type_id', 'is_template', 'role_id','role_name', 'obj_cate_id', 'cycle_type_id','full_score','icon']
});
projectDS.on("load",function(){
	if(projectDS.getCount() > 0) {
		var record = projectDS.getAt(0);
		
		if(initProject != "") {
			record = projectDS.getById(initProject);
		}
		obj_cate_id = record.get('obj_cate_id');
		if(projectID && projectID!=null){
			Ext.getCmp("projectSelector").setValue(projectID);
		}else{
			var val = record.get('project_id');
			//加载表单
			projectID = record.get('project_id');
			projectName = record.get('project_name');
			Ext.getCmp("projectSelector").setValue(val);
		}
		
		isTemplate = (record.get('is_template') == 'Y');
		cycleTypeID = record.get('cycle_type_id');
		fullScore = record.get('full_score');
		
		var b = record.get("app_type_id")== '00' || (!isTopBank && isTemplate);
		disableEdit(b);
		
		doQueryCtrlInfos();
		Ext.getCmp("savesplit").setVisible(!isTemplate);
		Ext.getCmp("savemenu").setVisible(!isTemplate);
		
	}
});

function disableEdit(b) {
	Ext.getCmp("addMeasure").setDisabled(b);
	Ext.getCmp("editMeasure").setDisabled(b);
	Ext.getCmp("deleteMeasure").setDisabled(b);
	Ext.getCmp("justPoint").setDisabled(!isTopBank && isTemplate);	
}

Ext.onReady(function() {
	/**
	 * 考核指标操作菜单
	 */
	var ctrlMB = [{
		id : 'addMeasure',
		text : '添加(a)',
		tooltip : '添加指标',
		iconCls : 'add',
		handler : function() {
			if(projectID == '') {
				Ext.MessageBox.alert("提示信息","请查询出要添加指标的方案");
				return;
			}
			doAddCtrlInfo();
		}
	},'-',{
		id : 'editMeasure',
		text : '编辑(e)',
		tooltip : '修改衡量指标及计分公式',
		iconCls : 'edit',
		handler : function() {
			if (selectedRowId == '') {
				Ext.MessageBox.alert('提示信息', '请选择需要修改的记录');
				return;
			}
			doEditCtrlInfo(selectedRowId);
		}
	},'-' ,{
		id : 'justPoint',
		text : '调整指标顺序',
		iconCls : 'list',
		handler : function(){
			beginAdjustPoint()
		}
	},{
		id : 'saveJustPoint',
		text : '保存指标顺序',
		iconCls : 'save',
		handler : function(){
			endAdjustPoint();
		}
	},'-', {
		id : 'deleteMeasure',
		text : '删除(s)',
		tooltip : '删除指标',
		iconCls : 'delete',
		handler : function() {
			if (selectedRowId == '') {
				Ext.MessageBox.alert('提示信息', '请选择需要删除的记录');
				return;
			}

			doDeleteCtrlInfo(selectedRowId);
		}
	}, {
		id : 'savesplit',
		xtype : 'tbseparator'
	}, {
		id : 'savemenu',
		text : '保存指标权重(s)',
		tooltip : '保存方案指标的权重',
		iconCls : 'save',
		disabled : true,
		handler : function(){
			if(projectID == '')
				return;
			if(measureProrate == '' && planValue == ''){
				Ext.MessageBox.alert('提示信息', '没有修改任何记录');
				return;
			}
			doAlterProrate(measureProrate);
		}
	}, {
		xtype : 'tbseparator'
	}, {
			text : '导出Excel',
			tooltip : '导出Excel',
			iconCls : 'export',
			handler : function() {
				doExportExcel(projectID,roleID,monthID);
			}
		}];

	var viewport = new Ext.Viewport({
		split : true,
		title : '考核指标',
		layout : 'border',
		items : [{
			region : 'north',
			frame : true,
			height : 80,
			layout : {
				type : 'column'
			},
			bodyStyle : 'padding:15px',
			title : '查询条件',
			items : [{
				columnWidth : .3,
				layout : 'form',
				labelWidth : 75,
				labelAlign : 'left',
				border : false,
				items : [{
					xtype : 'iconcombo',
					mode : 'local',
					displayField : 'project_name',
					valueField : 'project_id',
					iconClsField : 'icon',
					store : projectDS,
					triggerAction : 'all',
					fieldLabel : '方案',
					name : 'project_id',
					editable : false,
//					listeners : {
//						select : function(combo,record,index){
//							
//						}
//					},
					id : 'projectSelector',
					anchor : '91%'
				}]
			},{
				columnWidth : .25,
				layout : 'form',
				labelWidth : 75,
				labelAlign : 'left',
				border : false,
				items : [{
					xtype : 'button',
					id : 'search_button',
					iconCls : 'search',
					width : 48,
					text : '查询',
					handler : function(){
						projectID = Ext.getCmp("projectSelector").getValue();
						projectName = Ext.get("projectSelector").getValue();
						
						var record = projectDS.getById(projectID);
						isTemplate = (record.get('is_template') == 'Y');
						cycleTypeID = record.get('cycle_type_id');
						
						project_id_hidden = projectID,
						project_name_hidden = projectName,
						
						doQueryCtrlInfos();
						
						Ext.getCmp("savesplit").setVisible(!isTemplate);
						Ext.getCmp("savemenu").setVisible(!isTemplate);
						
					}
				}]
			}]
		},{
			region : 'center',
			xtype : 'panel',
			contentEl : 'measure_table',
			tbar : ctrlMB,
			border : true,
			split : false
		}]
	});
	Ext.getCmp("saveJustPoint").setVisible(false);
	
	mask = new Ext.LoadMask(Ext.get('measure_table'), {
		msg : "正在加载,请稍后......"
	});
	
//	roleDS.load();
	projectDS.load({
		params : {
			is_template : 'Y'
		}
	});
	
});

var selectedRowId = '';

var measureProrate = ''; //记录修改的指标权重字符串

function doQueryCtrlInfos() {
	if (projectID == '')
		return;
	
	Ext.getCmp("saveJustPoint").setVisible(false);
	Ext.getCmp("justPoint").setVisible(true);
	
	var record = Ext.getCmp("projectSelector").getStore().getById(projectID);
	obj_cate_id = record.get('obj_cate_id');
	
	var b = record.get("app_type_id")== '00' || (!isTopBank && isTemplate);
	disableEdit(b);
	
	selectedRowId = '';
	measureProrate = '';

	dhtmlGrid = new dhtmlXGridObject('measure_table');
	dhtmlGrid.setImagePath(pathUrl + "/public/scripts/dhtmlx/imgs/");
	dhtmlGrid.enableMultiline(true);
	dhtmlGrid.setSkin("bsc");
	
	dhtmlGrid.attachEvent("onBeforeSelect", function(rowId, index) {
		return canbeSelected;
	});
	
	dhtmlGrid.attachEvent("onRowSelect", function(rowId, index) {
			selectedRowId = rowId;
	});
	
	dhtmlGrid.init();

	dhtmlGrid.enableEditEvents(true, false, false); //设置单击编辑
	dhtmlGrid.enableRowspan();

	mask.show();
	dhtmlGrid.load(pathUrl + '/bscmeasure_listBscMeasure.action?project_id=' + projectID+"&isTemplate="+isTemplate,
			function() {
				mask.hide();
			});
	mask.hide();
}

function beginAdjustPoint() {
	Ext.getCmp("justPoint").setVisible(false);
	Ext.getCmp("saveJustPoint").setVisible(true);
	
	disableEdit(true);
	
	canbeSelected = false;
		
 	dhtmlGrid.insertColumn(1,"调整顺序","ro",80,'na','center','middle');
 	var ids = dhtmlGrid.getAllRowIds(";");
	var idArray = ids.split(";");
	for (var i = 0; i < idArray.length; i++) {
		var cell = dhtmlGrid.cellById(idArray[i],1);
		cell.setValue('<img src=\"../img/point_up.png\" onclick=\"movePoint('+i+',\'up\')\"/>&nbsp;&nbsp;<img src=\"../img/point_down.png\" onclick=\"movePoint('+i+',\'down\')\" />');
	}
}

function endAdjustPoint() {
	canbeSelected = true;
	disableEdit(false);
	var ids = dhtmlGrid.getAllRowIds(";");
	var idArray = ids.split(";");
	var params = '';
	for (var i = 0; i < idArray.length; i++) {
		var ary = idArray[i].split('@');
		var record = dhtmlGrid.cellById(idArray[i],3).getValue()+","+dhtmlGrid.cellById(idArray[i],0).getValue();
		params += ";"+record;
	}
	Ext.Ajax.request({
		url : pathUrl + '/bscmeasure_setMeasureOrder.action',
		method : 'POST',
		params : {
			project_id : projectID,
			params : params
		},

		callback : function(options, success, response) {
			var json = Ext.util.JSON.decode(response.responseText);
			if (json.success) {
				doQueryCtrlInfos();
			} else {
				Ext.getCmp("justPoint").setVisible(false);
				Ext.getCmp("saveJustPoint").setVisible(true);
				Ext.MessageBox.alert('提示信息', json.info);
			}
		}
	});
}

//调整位置方法
function movePoint(rowIndex,direction) {
	var rowid = dhtmlGrid.getRowId(rowIndex)
	var selectIndex = rowIndex;
	if(direction == 'up'){
		for(var i = 0; i < pointLimitArray.length; i++) {
			if(rowIndex == pointLimitArray[i])
				return;
		}
		switchRowContent(rowid,dhtmlGrid.getRowId(rowIndex-1));
		switchRowId(rowIndex,rowid,rowIndex-1,dhtmlGrid.getRowId(rowIndex-1));
		selectIndex = selectIndex - 1;
	}else if(direction == 'down'){
		for(var i = 0; i < pointLimitArray.length; i++) {
			if(rowIndex+1 == pointLimitArray[i])
				return;
		}
		switchRowContent(rowid,dhtmlGrid.getRowId(rowIndex+1));
		switchRowId(rowIndex,rowid,rowIndex+1,dhtmlGrid.getRowId(rowIndex+1));
		selectIndex = selectIndex + 1;
	}
	canbeSelected = true;
	dhtmlGrid.selectRow(selectIndex,false,false,false);
	canbeSelected = false;
}

function switchRowContent(fRowId,sRowId) {
	var i = 1;
	var f_cell = dhtmlGrid.cellById(fRowId,i);
	var s_cell = dhtmlGrid.cellById(sRowId,i);
	while(f_cell != null && s_cell != null){
		var temp = f_cell.getValue();
		f_cell.setValue(s_cell.getValue()); 
		s_cell.setValue(temp);
		i++;
		try{
			f_cell = dhtmlGrid.cellById(fRowId,i);
			s_cell = dhtmlGrid.cellById(sRowId,i);		
		}catch(e){
			break;
		}
	};
}

function switchRowId(fRowIndex,fRowId,sRowIndex,sRowId) {
	var tmpId = new Date().valueOf();
	
	dhtmlGrid.setRowId(fRowIndex,tmpId);
	dhtmlGrid.setRowId(sRowIndex,fRowId);
	dhtmlGrid.setRowId(fRowIndex,sRowId);
}