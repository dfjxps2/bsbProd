/*
 * ------------------------------------------------------------------------------
 * 文件名称：bsc_calc_exec_common_layout.js 说 明：JavaScript脚本，提供积分方案测算与发布的维护。 版 本：1.0
 * 修改纪录:
 * ------------------------------------------------------------------------------
 * 时间            修改人    说明
 *               mabo      创建
 * ------------------------------------------------------------------------------
 * 
 */
var projectId = '';
var cycleTypeId = '';
var objCateId = '';
var appTypeId = '';
var projectGrid_bar = null;
/**
 * 方案定义Store
 */
var projectStore = new Ext.data.JsonStore({
	url : pathUrl + '/bscCalcPblsh_common.action?method=listProject',
	root : 'results',
	fields : ["project_id", "project_name", "project_desc", "cycle_type_id",
			"obj_cate_id", "app_type_id", "view_id", "full_score",
			"score_limit_low", "score_limit_high", "is_template",
			"owner_org_id", "create_user", "create_time", "update_user",
			"update_time"]
});
projectStore.on('beforeload',function(){
			Ext.getCmp("execute").setDisabled(true);
//			Ext.getCmp("publish").setDisabled(true);
//			Ext.getCmp("callback").setDisabled(true);
			projectStore.baseParams = {
				is_template : 'N'
			}
	});

var exeInfoStore = new Ext.data.JsonStore({
	url : pathUrl + '/bscProject_common.action?method=listExeInfo',
	totalProperty : 'totalCount',
	root : 'results',
	fields : ["project_id", "month_id", "month_name", "is_execute",
			"is_cycle_end_mth", "is_published"]
});

exeInfoStore.on("beforeload", function() {
	exeInfoStore.baseParams = {
		project_id : projectId
	}
});

var expander = new Ext.grid.RowExpander({
	tpl : new Ext.Template('<table><tr><td width=\"70px\" align=\"left\">分数上限：</td><td width=\"50px\" align=\"left\">{score_limit_high}</td></tr>'
					+ '<tr><td width=\"70px\" align=\"left\">分数下限：</td><td width=\"50px\" align=\"left\">{score_limit_low}</td></tr>'
					+ '</table>')
});
	
Ext.onReady(function(){

	
	var csm = new Ext.grid.RowSelectionModel({
		singleSelect : true
	});
	var projectCM = new Ext.grid.ColumnModel([expander, {
		header : '方案ID',
		dataIndex : 'project_id',
		hidden : true
	}, {
		header : '方案名称',
		width : 200,
		dataIndex : 'project_name'
	}, {
		header : '周期',
		width : 80,
		align : 'center',
		dataIndex : 'cycle_type_id',
		renderer : cycleType
	}, {
		header : '对象类型',
		dataIndex : 'obj_cate_id',
		renderer : objCate
	}, {
		header : '是否发布',
		dataIndex : 'app_type_id',
		renderer : appTypeId
	}, {
		header : '归属机构ID',
		dataIndex : 'owner_org_id',
		hidden : true
	}]);
	
	
	//执行撤回
	var projectExecutebar = [{
		text : '执行(e)',
		id : 'execute',
		toolTip : '执行方案',
		iconCls : 'technology',
		disabled : true,
		handler : function() {
			if (projectId == '') {
				Ext.MessageBox.alert("提示信息", "请选择需要发布的方案");
				return;
			}
			doExecuteProject(cycleTypeId);
		}
	}, /**'-',{
		text : '发布(p)',
		id : 'publish',
		toolTip : '发布方案',
		iconCls : 'publish',
		disabled : true,
		handler : function() {
			Ext.MessageBox.confirm('提示','确认要发布吗?',function(btn,text){
				if(btn == 'yes'){
						if (projectId == '') {
						Ext.MessageBox.alert("提示信息", "请选择需要发布的方案");
						return;
			}
			doPublish("00");
				}
			});
		}
	},'-', {
		text : '撤回(r)',
		id : 'callback',
		disabled : true,
		toolTip : '发布方案',
		iconCls : 'revoke',
		handler : function() {
			Ext.Msg.confirm('提示','确认要撤回?',function(btn){
			if(btn == 'yes'){
			if (projectId == '') {
				Ext.MessageBox.alert("提示信息", "请选择需要撤回的方案");
				return;
			}
			doPublish("01");
			}
			});
		}
	},*/ '->', '搜索:', {
		xtype : 'textfield',
		id : 'searchKey',
		emptyText : '请输入方案名称...',
		width : 150,
		listeners : {
			specialkey : function(field, e) {
				if (e.getKey() == Ext.EventObject.ENTER) {
					projectStore.load({
						params : {
							searchKey : Ext.getCmp("searchKey").getValue()
						}
					})
				}
			}
		}
	}, {
		xtype : 'button',
		iconCls : 'search',
		handler : function() {
			projectStore.load({
				params : {
					searchKey : Ext.getCmp("searchKey").getValue()
				}
			})
		}
	}];
	
	//设置不同的tbar	
	projectGrid_bar = projectExecutebar
	
	var projectGrid = new Ext.grid.GridPanel({
		title : '方案列表',
		id : 'projectGrid',
		ds : projectStore,
		loadMask : true,
		cm : projectCM,
		sm : csm,
		plugins: expander,
		region : 'center',
		autoScorll : true,
		width : 700,
		split : true,
		viewConfig : {
			forceFit : true
		},
		tbar : projectGrid_bar
	});
	
	
	var exeInfoCM = new Ext.grid.ColumnModel([{
		header : '方案ID',
		dataIndex : 'project_id',
		align : 'center',
		hidden : true
	}, {
		header : '月份',
		align : 'center',
		dataIndex : 'month_name'
	}, {
		header : '结果已公布',
		dataIndex : 'is_published',
		align : 'center',
		renderer : function(val){
			if(val == 'Y')
				return "<font color='green'>是</font>";
			else if(val == 'N')
				return "<font color='red'>否</font>";
			return val;
		}
	}]);
	
	var exeInfoGrid = new Ext.grid.GridPanel({
		title : '已执行月份',
		id : 'exeInfoGrid',
		ds : exeInfoStore,
		loadMask : true,
		cm : exeInfoCM,
		sm : new Ext.grid.RowSelectionModel({singleSelect : true}),
		region : 'east',
		width : 380,
		autoScorll : true,
		split : true,
		viewConfig : {
			forceFit : true
		},
		bbar : new Ext.PagingToolbar({
			pageSize : 15,
			store : exeInfoStore,
			displayInfo : true,
			displayMsg : '第{0}-{1}条记录,共{2}条记录',
			emptyMsg : "没有记录"
		})
	});
	
	
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [projectGrid,exeInfoGrid]
	});
	projectStore.load();
	projectGrid.getSelectionModel().on('rowselect', function(sm, index, r) {
		if (projectGrid.getSelectionModel().getSelections().length != 1) {
			projectId = '';
		} else {
			var orgId = projectGrid.getSelectionModel().getSelections()[0].get('owner_org_id');
			var typeId = projectGrid.getSelectionModel().getSelections()[0].get('app_type_id');

			projectId = projectGrid.getSelectionModel().getSelections()[0].get('project_id');
			projectID = projectId;
			projectName = projectGrid.getSelectionModel().getSelections()[0].get('project_name');
			fullScore = projectGrid.getSelectionModel().getSelections()[0].get('full_score');
			cycleTypeId = projectGrid.getSelectionModel().getSelections()[0].get('cycle_type_id');
			cycleTypeID = cycleTypeId;
			published = projectGrid.getSelectionModel().getSelections()[0].get('app_type_id');
			
			var b = (published == '00');
			Ext.getCmp("execute").setDisabled(false);
//			Ext.getCmp("publish").setDisabled(b);
//			Ext.getCmp("callback").setDisabled(!b);
			
			projectId = projectGrid.getSelectionModel().getSelections()[0].get('project_id');
			exeInfoStore.load({params : {start:0,limit:15}});
		}
	});
	
});


