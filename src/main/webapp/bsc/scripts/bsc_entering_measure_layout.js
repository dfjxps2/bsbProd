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
var objOrg = new Ext.data.JsonStore({
	url : pathUrl + '/selector_listOrg.action',
	root : 'results',
	totalProperty : 'totalCount',
	fields : ['org_id', 'org_name']
});
objOrg.on("load",function(){
	if(objOrg.getCount() > 0) {
			org_id = objOrg.getAt(0).get('org_id');
			org_name = objOrg.getAt(0).get('org_name');
//		Ext.getCmp("objCateSelector").setValue(obj_cate_id)
	}
});
objOrg.load();

/**
 * 月份Store
 */
var mouthDS = new Ext.data.JsonStore({
	url : pathUrl + '/selector_listMonths.action',
	root : 'results',
	totalProperty : 'totalCount',
	fields : ['mouth_id', 'mouth_name']
});
mouthDS.on("load",function(){
	if(mouthDS.getCount() > 0) {
			mouth_id = mouthDS.getAt(0).get('mouth_id');
			mouth_name = mouthDS.getAt(0).get('mouth_name');
	}
});
mouthDS.load();

Ext.onReady(function() {

	var parameterCM = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), {
		id : 'measure_id',
		header : "编号",
		dataIndex : 'measure_id'
	}, {
		header : "单位",
		dataIndex : 'org_id',
		renderer : function(v){
			 for(var i=0;i<objOrg.getCount();i++){
				 if(v==objOrg.getAt(i).get('org_id')){
					v=objOrg.getAt(i).get('org_name');
				 }
			 }
			 return v;
		}
	}, {
		header : "信息提供单位",
		dataIndex : 'praise_org'
	}, {
		header : "类型",
		dataIndex : 'type',
		renderer : function(v) {
			if (v == '00') {
				v = "加分项";
			} else if (v == '01') {
				v = "减分项";
			} else {
				v = '其他';
			}
			return v;
		}
	}, {
		header : "月份",
		dataIndex : 'mouth_id',
		renderer : function(v) {
			v = v.substr(0, 4) + "年" + v.substr(4,2) + "月"
			return v;
		}
	}, {
		header : "分数",
		dataIndex : 'score'
	}, {
		header : "备注",
		dataIndex : 'remark'
	}]);

	var parameterDS = new Ext.data.Store({
		proxy : new Ext.data.HttpProxy({
			url : pathUrl + '/enteringMeasure_common.action?method=listMeasure'
		}),
		reader : new Ext.data.JsonReader({
			root : 'results',
			totalProperty : 'totalCount',
			id : 'measure_id'
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
		}])
	});
	parameterDS.load();

	var parameterMB = [{
		text : '添加(a)',
		tooltip : '添加记录',
		iconCls : 'add',
		handler : function() {
			doAddMeasure(parameterDS);
		}
	}, '-', {
		text : '编辑(e)',
		id : 'editProject',
		tooltip : '编辑记录',
		iconCls : 'edit',
		handler : function() {
			if (parameterGP.getSelectionModel().getSelections().length == 0) {
				Ext.MessageBox.alert('错误', '请选择一条记录，继续进行！');
				return;
			}
			var measure_id = parameterGP.getSelectionModel().getSelections()[0].get('measure_id');
			var type = parameterGP.getSelectionModel().getSelections()[0].get('type');
			doEditMeasure(parameterDS, measure_id,type);
		}
	}];

	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [parameterGP = new Ext.grid.GridPanel({
			region : 'center',
			title : '加分/扣分项列表',
			frame : false,
			split : true,
			ds : parameterDS,
			cm : parameterCM,
			viewConfig : {
				forceFit : true
			},
			loadMask : true,
			tbar : parameterMB
		})]
	});
    
});