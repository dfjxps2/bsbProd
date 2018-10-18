/*
 * ------------------------------------------------------------------------------
 * 文件名称：bsc_project_def_layout.js 说 明：JavaScript脚本，提供积分方案添加、删除方法和方案考核等级的维护。 版 本：1.0
 * 修改纪录:
 * ------------------------------------------------------------------------------
 * 时间            修改人    说明
 *               zzm      创建
 * ------------------------------------------------------------------------------
 * 
 */
var projectId = '', cycleTypeId = '', objCateId = '', appTypeId = '', dimensionId = '';

var showDisabledProject = false;

/**
 * 方案定义Store
 */
var projectStore = new Ext.data.JsonStore({
	url : pathUrl + '/bscProject_common.action?method=listProject',
	root : 'results',
	fields : ["project_id", "project_name", "project_id","project_desc", "cycle_type_id",
			"obj_cate_id",  "obj_link_id","obj_link_name","app_type_id", "view_id", "full_score",
			"score_limit_low", "score_limit_high", "is_template",
			"owner_org_id", "create_user", "create_time", "update_user",
			"update_time","record_status"]
});

projectStore.on('beforeload',function(){
	var record_status = showDisabledProject?'All':''
	projectStore.baseParams = {
		is_template : 'Y',
		record_status: record_status
	}
	Ext.getCmp('copyProject').setDisabled(true);
	Ext.getCmp('editProject').setDisabled(true);
	Ext.getCmp('deleteProject').setDisabled(true);
	Ext.getCmp('gotoEdit').setDisabled(true);
});

/**
 * 考核周期Store
 */
var cycleTypeDS = new Ext.data.JsonStore({
	url : pathUrl + '/selector_listProjCycleType.action',
	root : 'results',
	totalProperty : 'totalCount',
	fields : ['cycle_type_id', 'cycle_type_desc']
});


/**
 * 考核对象类型Store
 */
var objCateDS = new Ext.data.JsonStore({
	url : pathUrl + '/selector_listobjCate.action',
	root : 'results',
	totalProperty : 'totalCount',
	fields : ['obj_cate_id', 'obj_cate_desc']
});

objCateDS.load();

//对象维度
var	dimensionStore=new Ext.data.JsonStore({
	url :pathUrl + '/selector_listDimension.action',
	root : 'results',
	totalProperty : 'totalCount',
	fields : [ 'link_id', 'link_name']

});

dimensionStore.load();


Ext.onReady(function() {
	var csm = new Ext.grid.RowSelectionModel({
		singleSelect : true
	});
	var projectCM = new Ext.grid.ColumnModel([{
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
	},{
		header : '对象维度',
		dataIndex : 'obj_link_name'
		}, {
		header : '是否发布',
		dataIndex : 'app_type_id',
		renderer : appTypeId
	},{
		header : '归属机构ID',
		dataIndex : 'owner_org_id',
		hidden : true
	}]);
	
	var projectbar = [{
		text : '添加(a)',
		tooltip : '添加新方案',
		iconCls : 'add',
		handler : function() {
			addProject();
		}
	}, '-', {
		text : '编辑(e)',
		id : 'editProject',
		disabled : true,
		toolTip : '修改方案属性',
		iconCls : 'edit',
		handler : function() {
			var record = getSelectedRecord("projectGrid");
			if (projectId == '') {
				Ext.MessageBox.alert("提示信息", "请选择一条记录进行编辑");
				return;
			}
			editProject(record);
            var cycleTypeId = cycleType('02');
            Ext.getCmp("cycleTypeSelector").setValue(cycleTypeId);
            cycleDimDS.load();
            beforeObjClose();
            var lk = record.get('obj_link_id');
            objDimDS.reload({params : {
                    link_id : lk
                }});

            setDimDataDS(projectId,lk);

		}
	}, '-', {
		text : '停用(t)',
		id : 'deleteProject',
		toolTip : '停用方案',
		iconCls : 'delete',
		handler : function() {
			if (projectId == '') {
				Ext.MessageBox.alert("提示信息", "请选择需要停用的方案");
				return;
			}
			Ext.MessageBox.confirm('确认信息', '是否确认停用选中方案?',
					function(btn) {
						if (btn == 'yes')
							deleteProject();
					});
		}
	},'-',{
		text : '删除(d)',
		id : 'dropProject',
		toolTip : '删除方案',
		iconCls : 'drop',
		handler : function() {
			if (projectId == '') {
				Ext.MessageBox.alert("提示信息", "请选择需要删除的方案");
				return;
			}
			Ext.MessageBox.confirm('确认信息', '是否确认删除选中方案?',
					function(btn) {
						if (btn == 'yes')
							dropProject();
					});
		}
	},'-', {
		text : '复制',
		id : 'copyProject',
		title : '复制已存在方案',
		iconCls : 'copy',
		handler : function(){
			var record = getSelectedRecord("projectGrid");
			if(projectId == ''){
				Ext.Msg.alert('提示信息','请选择需要复制的方案');
				return;
			}
			copyProject(record);
		}
	},'-',{
		id : 'gotoEdit',
		text : '编辑方案指标',
		iconCls : 'execute',
		handler : function(){
			if(projectGrid.getSelectionModel().getSelections().length == 0) {
				Ext.MessageBox.alert("提示信息","请选择一条方案记录!");
				return;
			}

			url = "/bsc/pages/bsc_project_measure.jsp?project_id="+getSelectedRecord('projectGrid').get('project_id');
			window.parent.tabManager.removeTabItem(rid);
			window.parent.gotoPage(rid,'方案与指标',url);
		}
	}, '-',{
		text : '发布(p)',
		id : 'public',
		disabled : true,
		toolTip : '发布方案',
		iconCls : 'publish',
		handler : function() {
			if (projectId == '') {
				Ext.MessageBox.alert("提示信息", "请选择需要发布的方案");
				return;
			}
			Ext.MessageBox.confirm('提示','确认要发布吗?',function(btn,text){
				if(btn == 'yes'){
					doPublish("00");
				}
			});
		}
	}, '-', {
		text : '撤回(r)',
		id : 'callback',
		toolTip : '撤回方案',
		disabled : true,
		iconCls : 'revoke',
		handler : function() {
			if (projectId == '') {
				Ext.MessageBox.alert("提示信息", "请选择需要撤回的方案");
				return;
			}
			Ext.Msg.confirm('提示', '确认要撤回?', function(btn) {
				if (btn == 'yes') {
					doPublish("01");
				}
			});
		}
	}, '->',{
		xtype : 'checkbox',
		boxLabel : '显示已停用方案 ',
		listeners : {
			'check' : function(cb,ischecked) {
				showDisabledProject = ischecked;
				projectStore.reload();
			}
		}
	},'-', '搜索:', {
		xtype : 'textfield',
		id : 'searchKey',
		emptyText : '请输入方案名...',
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
	
	
	var projectGrid = new Ext.grid.GridPanel({
		title : '方案列表',
		id : 'projectGrid',
		ds : projectStore,
		loadMask : true,
		cm : projectCM,
		sm : csm,
		//region : 'west',
		region : 'center',
		autoScorll : true,
		width : 700,
		split : true,
		viewConfig : {
			forceFit : true
		},
		tbar : projectbar
	});
	
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [projectGrid]
	});
	Ext.getCmp('copyProject').setDisabled(true);
	Ext.getCmp('deleteProject').setDisabled(true);
	
	projectStore.load();
	
	projectGrid.getSelectionModel().on('rowselect', function(sm, index, r) {
		if (projectGrid.getSelectionModel().getSelections().length != 1) {
			projectId = '';
		} else {
			var orgId = projectGrid.getSelectionModel().getSelections()[0].get('owner_org_id');
			var typeId = projectGrid.getSelectionModel().getSelections()[0].get('app_type_id');
			var record_status = projectGrid.getSelectionModel().getSelections()[0].get('record_status');
			Ext.getCmp('copyProject').setDisabled(false);
			Ext.getCmp('gotoEdit').setDisabled(false);
			
			Ext.getCmp('deleteProject').setDisabled(false);
			Ext.getCmp('editProject').setDisabled(false);
			Ext.getCmp('public').setDisabled(false);
			Ext.getCmp('callback').setDisabled(false);
			
			if(record_status == 'I'){
				//已经停用方案 只能删除
				Ext.getCmp('deleteProject').setDisabled(true);
				Ext.getCmp('dropProject').setDisabled(false);
				Ext.getCmp('editProject').setDisabled(true);
				Ext.getCmp('public').setDisabled(true);
				Ext.getCmp('callback').setDisabled(true);
				Ext.getCmp('gotoEdit').setDisabled(true);
				Ext.getCmp('copyProject').setDisabled(true);
			}else if (ownerOrgId != orgId) {
				Ext.getCmp('deleteProject').setDisabled(true);
				Ext.getCmp('dropProject').setDisabled(true);
				Ext.getCmp('editProject').setDisabled(true);
				Ext.getCmp('public').setDisabled(true);
				Ext.getCmp('callback').setDisabled(true);
				Ext.getCmp('gotoEdit').setDisabled(true);

//				Ext.getCmp('addResult').setDisabled(true);
//				Ext.getCmp('editResult').setDisabled(true);
//				Ext.getCmp('deleteResult').setDisabled(true);

			} else {
				if ("00" == typeId) {
					Ext.getCmp('deleteProject').setDisabled(false);
					Ext.getCmp('dropProject').setDisabled(false);
					Ext.getCmp('editProject').setDisabled(true);
					Ext.getCmp('public').setDisabled(true);
					Ext.getCmp('callback').setDisabled(false);

				} else {
					Ext.getCmp('deleteProject').setDisabled(false);
					Ext.getCmp('dropProject').setDisabled(false);
					Ext.getCmp('editProject').setDisabled(false);
					Ext.getCmp('public').setDisabled(false);
					Ext.getCmp('callback').setDisabled(true);
				}
			}
			if(projectGrid.getSelectionModel().getSelections()[0].get('is_template') == 'Y'){
				Ext.getCmp('public').setDisabled(true);
				Ext.getCmp('callback').setDisabled(true);
				if(ownerOrgId != orgId){
					Ext.getCmp('deleteProject').setDisabled(true);
					Ext.getCmp('dropProject').setDisabled(true);
				}
			}
			projectId = projectGrid.getSelectionModel().getSelections()[0].get('project_id');
		}
	});

});

//返回选中的记录
function getSelectedRecord(panelId) {
	var grid = Ext.getCmp(panelId);
	if(!grid)
		return null;
	var array = grid.getSelectionModel().getSelections();
	if(array.length == 0)
		return null;
	return array[0];
}


function setDimDataDS(pid,ki){
    Ext.Ajax.request({
        url : pathUrl + '/bscProject_setDimDataDS.action',
        method : 'POST',
        params:{project_id : pid},
        callback : function(options,success,response){
            var json = Ext.util.JSON.decode(response.responseText);
            var cycs = json.cycs.split('.').join(',');
            var objs = json.objs.split('.').join(',');
            Ext.getCmp("stat_cycle_cd").setValue(cycs);
            Ext.getCmp(ki).setValue(objs);
        }
    });
}