var mask = null;
var path = '';

// 显示分页条 pageSize-分页大小
function showBbar(pageSize) {
	var obj_bbar = Ext.getCmp('mainpanel').getBottomToolbar();
	obj_bbar.show();
	obj_bbar.pageSize = pageSize;
}
// 初始化分页条 totalCount-数据总数 path-分页条动作地址
function initBbar(totalCount, path) {
	var obj_bbar = Ext.getCmp('mainpanel').getBottomToolbar();
	obj_bbar.initProperties(totalCount, path, true);
}

var menu = [{
	text : '导出(e)',
	tooltip : '导出查询结果',
	iconCls : 'export',
	handler : function() {
		if (monthID == '' || projectID == '' || dhtmlGrid == null){
			Ext.MessageBox.alert("提示信息","请先查询出需要导出的数据");
			return;
		}
		var title = "";
		if(objCateId=="BM"){
			title = '区属部门方案';
		}else if(objCateId=="CBM"){
			title = '市属部门方案';
		}else {
			title = '镇街方案';
		}
		if(dhtmlGrid.serialize().length<=34) {
			Ext.MessageBox.alert("提示信息","无数据");
			return;		
		}
		document.excelForm.month_id.value = monthID;
		document.excelForm.project_id.value = projectID;
		document.excelForm.title.value = title;
		document.excelForm.project_name.value = projectName;
		document.excelForm.month_name.value = monthName;
		document.excelForm.file_name.value = '方案结果.xls';
		document.excelForm.submit();
		
	}
}]
/**
 * 月份Store
 */
var monthDS = new Ext.data.JsonStore({
	url : pathUrl + '/bscProject_common.action?method=listExecutedMonth',
	root : 'results',
	totalProperty : 'totalCount',
	fields : ['month_id', 'month_name'],
	listeners : {
		load : function() {
			if (monthDS.getCount() > 0 ) {
				if(monthID != ''){
					Ext.getCmp("monthSelector").setValue(monthID);
				}else{
					monthID = monthDS.getAt(0).get('month_id');
					Ext.getCmp("monthSelector").setValue(monthID);
				}
			}else{
				Ext.getCmp("monthSelector").setValue('');
			}
		}
	},
	autoLoad : false
});

/**
 * 方案Store
 */
var projectStore = new Ext.data.JsonStore({

	url : pathUrl + '/bscProject_common.action?method=listProject',
	root : 'results',
	fields : ["project_id", "project_name", "project_desc", "cycle_type_id",
			"obj_cate_id", "app_type_id", "view_id",
			"owner_org_id", "create_user", "create_time", "update_user",
			"update_time"],
			
	idProperty : 'project_id',
	listeners : {
		load : function(store, records, options) {
			if (store.getCount() > 0) {
				if (projectID == ''){
					projectID = store.getAt(0).get('project_id');
					cycle_type_id = store.getAt(0).get('cycle_type_id');
				}
				Ext.getCmp("projectSelector").setValue(projectID);
				monthDS.load({
					params: {project_id : projectID}
				});
			}
		},
		beforeload : function(store, options) {
			monthDS.removeAll();
			store.baseParams = {
				type : 'score',
				is_template : 'N',
//				app_type_id : '00',
				obj_cate_id : objCateId,
				record_status : 'All'
			}
		}
	},
	autoLoad : true
});

Ext.onReady(function() {
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [{
			region : 'north',
			frame : true,
			border : false,
			height : 80,
			layout : {
				type : 'column'
			},	
			bodyStyle : 'padding:15px',
			title : '查询条件',
			items : [{
				columnWidth : .3,
				layout : 'form',
				labelWidth : 70,
				labelAlign : 'left',
				border : false,
				items : [{
					xtype : 'combo',
					mode : 'local',
					displayField : 'project_name',
					valueField : 'project_id',
					store : projectStore,
					triggerAction : 'all',
					fieldLabel : '方案',
					name : 'project_id',
					listeners : {
						select : function(combo,record,index){
//							dhtmlGrid.clearAll();
							var p = record.get("project_id");
							monthID = '';
							monthDS.load({params: {project_id : p}});
							projectID = '';
						}
					},
					editable : false,
					id : 'projectSelector',
					anchor : '91%'
				}]
			},{
				columnWidth : .15,
				layout : 'form',
				labelWidth : 40,
				labelAlign : 'left',
				border : false,
				items : [{
					xtype : 'combo',
					mode : 'local',
					displayField : 'month_name',
					valueField : 'month_id',
					store : monthDS,
					editable : false,
					triggerAction : 'all',
					fieldLabel : '周期',
					name : 'month_id',
					emptyText : '无数据',
					id : 'monthSelector',
					anchor : '91%',
					listeners : {
						select : function(combo,record,index){
						}
					}
				}]
			},  {
				columnWidth : .25,
				layout : 'table',
				labelWidth : 75,
				labelAlign : 'left',
				border : false,
				items : [{
					xtype : 'button',
					iconCls : 'search',
					width : 48,
					text : '查  询',
					handler : function() {
						monthID = Ext.getCmp("monthSelector").getValue();
						projectID = Ext.getCmp("projectSelector").getValue();
						monthName=Ext.get("monthSelector").getValue();
						projectName=Ext.get("projectSelector").getValue();
						cycle_type_id = projectStore.getById(projectID).get("cycle_type_id");
						queryResult();
					}
				},{
					xtype : 'panel',
					width : 20
				}]
			}]
		}, {
			region : 'center',
			layout : 'border',
			items : [{
				region : 'center',
				id : 'mainpanel',
				border : false,
				split : true,
				tbar : menu,
				contentEl : 'center',
				bbar : {
					xtype : 'mypaging',
					displayInfo : true,
					displayMsg : '第{0}-{1}条记录,共{2}条记录',
					emptyMsg : "没有记录",
					beforePageText : '第',
					afterPageText : '页，共{0}页',
					firstText : '第一页',
					prevText : '上一页',
					nextText : '下一页',
					lastText : '最后一页',
					refreshText : '刷新',
					hidden : true
				}
			}]
		}]
	});
	mask = new Ext.LoadMask(Ext.get('center'), {
		msg : "正在加载,请稍后......"
	});
	
	queryResult();
});

function publishResult() {
	if (monthID == '' || projectID == '' )
		return;
	
	var param = "?project_id=" + projectID + "&month_id=" + monthID+"&obj_cate_id="+objCateId;
	Ext.Ajax.request({
		url : pathUrl + '/bscresult_publishResult.action' + param,
		waitMsg : '正在处理,请稍候......',
		method : 'POST',
		timeout : 30000,
		callback : function(options, success, response) {
			var json = Ext.util.JSON.decode(response.responseText);
			Ext.MessageBox.alert("提示信息",json.info);
		},
		failure : function(response, options) {
			Ext.MessageBox.hide();
			Ext.MessageBox.alert(response.responseText);
		},
		success : function(response, options) {
			Ext.MessageBox.hide();
		}
	});
	
}

function queryResult() {
	if (monthID == '' || projectID == '' )
		return;
	
	var param = "?project_id=" + projectID + "&month_id=" + monthID
			+ "&cycle_type_id="+cycle_type_id
			+ "&obj_cate_id=" + objCateId + "&monthName=" + encodeURI(encodeURI(monthName))
			+ "&projectName=" + encodeURI(encodeURI(projectName));
			
	mask.show();

	path = pathUrl + '/bscresult_scoreDhtml.action' + param;
	Ext.Ajax.request({
		url : pathUrl + '/bscresult_scoreDhtmlCount.action' + param,
		waitMsg : '正在处理,请稍候......',
		method : 'POST',
		timeout : 30000,
		callback : function(options, success, response) {
			var json = Ext.util.JSON.decode(response.responseText);
			if (json.success) {
				var infos = json.info.split(",");//用逗号隔开两个数据。第一个数据表示总数；第二个数据表示是否可以发布结果
				var totalCount = parseFloat(infos[0]);
				var canPublish = parseFloat(infos[1]);
					
				load(path);
				initBbar(parseInt(totalCount), path);
				showBbar(30);
			} else {
				Ext.MessageBox.alert(json.info);
			}
		},
		failure : function(response, options) {
			Ext.MessageBox.hide();
			Ext.MessageBox.alert(response.responseText);
		},
		success : function(response, options) {
			Ext.MessageBox.hide();
		}
	});
}

function load(path) {
	dhtmlGrid = new dhtmlXGridObject('center');
	dhtmlGrid.setImagePath(pathUrl + "/public/scripts/dhtmlx/imgs/");
	dhtmlGrid.setSkin("bsc");
	dhtmlGrid.init();
	dhtmlGrid.load(path, function() {
		mask.hide();
	});
	dhtmlGrid.enableRowsHover(true, "hover");
	mask.hide();
}
