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
		if(monthID == '' || projectID == '' || roleID == '')
			return;
		document.excelForm.month_id.value = monthID;
		document.excelForm.project_id.value = projectID;
		document.excelForm.role_id.value = roleID;
		document.excelForm.file_name.value = '方案结果.xls';
		document.excelForm.submit();
	}
}]
/**
 * 月份Store
 */
var monthDS = new Ext.data.JsonStore({
	url : pathUrl + '/selector_listMonth.action',
	root : 'results',
	totalProperty : 'totalCount',
	fields : ['month_id', 'month_name']
});
monthDS.on("load",function(){
	if(monthDS.getCount() > 0) {
		if(monthID == '')
			monthID = monthDS.getAt(0).get('month_id');
		Ext.getCmp("monthSelector").setValue(monthID)
	}
});
monthDS.load();

/**
 * 角色列表Store
 */
var roleDS = new Ext.data.JsonStore({
	url : pathUrl + '/kpirole_common.action?method=listOrgRoles',
	root : 'results',
	totalProperty : 'totalCount',
	fields : ['role_id', 'role_name']
});
roleDS.on("load",function(){
	if(roleDS.getCount() > 0) {
		if(roleID == '')
			roleID = roleDS.getAt(0).get('role_id');
		Ext.getCmp("roleSelector").setValue(roleID);
	}
});
roleDS.load();

/**
 * 方案Store
 */
var projectDS = new Ext.data.JsonStore({
	url : pathUrl + '/project_common.action?method=listProject',
	root : 'results',
	totalProperty : 'totalCount',
	fields : ['project_id', 'project_name', 'published']
});
projectDS.on("load",function(){
	if(projectDS.getCount() > 0) {
		if(projectID == '')
			projectID = projectDS.getAt(0).get('project_id');
		Ext.getCmp("projectSelector").setValue(projectID)
	}
});

projectDS.load();

Ext.onReady(function() {
	var viewport = new Ext.Viewport({
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
				columnWidth : .25,
				layout : 'form',
				labelWidth : 75,
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
					fieldLabel : '月份',
					name : 'month_id',
					id : 'monthSelector',
					anchor : '91%'
				}]
			}, {
				columnWidth : .25,
				layout : 'form',
				labelWidth : 75,
				labelAlign : 'left',
				border : false,
				items : [{
					xtype : 'combo',
					mode : 'local',
					displayField : 'project_name',
					valueField : 'project_id',
					store : projectDS,
					triggerAction : 'all',
					fieldLabel : '方案',
					name : 'project_id',
					editable : false,
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
					xtype : 'combo',
					mode : 'local',
					displayField : 'role_name',
					valueField : 'role_id',
					store : roleDS,
					editable : false,
					triggerAction : 'all',
					fieldLabel : '考核角色',
					name : 'role_id',
					id : 'roleSelector',
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
					iconCls : 'search',
					width : 48,
					text : '查询',
					handler : function(){
						monthID = Ext.getCmp("monthSelector").getValue();
						projectID = Ext.getCmp("projectSelector").getValue();
						roleID = Ext.getCmp("roleSelector").getValue();
						queryResult();
					}
				}]
			}]
		},{
			region : 'center',
			layout : 'border',
			items : [{
				region : 'center',
				id : 'mainpanel',
				border : true,
				split : false,
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
			},{
				region : 'east',
				width : 610,
				border : false,
				contentEl : 'chartframe'
			}]
		}]
	});
	mask = new Ext.LoadMask(Ext.get('center'), {
		msg : "正在加载,请稍后......"
	});
	height = $("#chartframe").height();
	width = $("#chartframe").width();
	
	queryResult();
});

function queryResult() {
	
	if(monthID == '' || projectID == '' || roleID == '')
		return;
		
	var param = "?role_id="+ roleID + "&project_id=" + projectID + "&month_id=" + monthID;
	
	
	mask.show();
	
	path = pathUrl + '/bscresult_dhtml.action' + param;
	Ext.Ajax.request({
		url : pathUrl + '/bscresult_dhtmlCount.action' + param,
		waitMsg : '正在处理,请稍候......',
		method : 'POST',
		timeout : 30000,
		callback : function(options, success, response) {
			var json = Ext.util.JSON.decode(response.responseText);
			if (json.success) {
				var totalCount = parseFloat(json.info);
				load(path);
				initBbar(parseInt(totalCount),path);
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
	
	document.getElementById("chartframe").src = pathUrl + '/bscresult_chart.action'+param+"&height="+height+"&width="+width;
}

function load(path) {
	dhtmlGrid = new dhtmlXGridObject('center');
	dhtmlGrid.setImagePath(pathUrl + "/public/scripts/dhtmlx/imgs/");
	dhtmlGrid.setSkin("bsc");
	dhtmlGrid.init();
	dhtmlGrid.load(path, function() {
		mask.hide();
	});
	mask.hide();
}