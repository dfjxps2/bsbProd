var monthId = '';
var projectId = '';
var width,height;

/**
 * 方案Store
 */
var projectDS = new Ext.data.JsonStore({
	url : pathUrl + '/bscProject_common.action?method=listProject',
	root : 'results',
	totalProperty : 'totalCount',
	id : 'project_id',
	fields : ['project_id', 'project_name', 'published', 'is_template',
			'role_id', 'role_name', 'obj_cate_id', 'cycle_type_id',
			'full_score'],
	listeners : {
		beforeload : function(store, options) {
			store.baseParams = {
				is_template : 'N',
				type : 'card',
				object_id : '0700',
				app_type_id :'00'
			}
		},
		load : function(store, records, options) {
			if (projectDS.getCount() > 0) {
				var val = projectDS.getAt(0).get('project_id');
				Ext.getCmp("projectSelector").setValue(val);
				projectId = val;
				queryChart();
			}
		}
	}
});

Ext.onReady(function(){
	var viewport = new Ext.Viewport({
		border : false,
		layout : 'border',
		items : [{
			region : 'center',
			contentEl : 'chartframe',
			autoScroll : false,
			border : false
		},{
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
				columnWidth : .2,
				layout : 'form',
				labelWidth : 40,
				labelAlign : 'left',
				border : false,
				items : monthSelector = new MonthSelector({})
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
			}, {
				columnWidth : .06,
				layout : 'form',
				labelWidth : 75,
				labelAlign : 'left',
				border : false,
				items : [{
					xtype : 'button',
					iconCls : 'search',
					width : 48,
					text : '查 询',
					handler : function() {
						projectId = Ext.getCmp("projectSelector").getValue();
						monthId = monthSelector.getValue();
						queryChart();
					}
				}]
			}]
		}]
	});
	height = $("#chartframe").height();
	width = $("#chartframe").width();
	projectDS.load();
	
});

function queryChart() {
	if(monthId == '' || projectId == '')
		return;
	var url = pathUrl + '/init_chart.action?month_id='+monthId+"&project_id="+projectId+"&height="+height+"&width="+width
	$("#chartframe").attr('src',url);
}

/**
 * 月份选择下拉框
 */
MonthSelector = function(config) {
	
	var an = config.anchor ? config.anchor : '91%';
	var hiddenName = config.hiddenName ? config.hiddenName : 'month_id';
	var id = config.id ? config.id : 'monthId';
	var fieldLabel = config.fieldLabel ? config.fieldLabel : '月份';
	
	var store = new Ext.data.JsonStore({
		url : pathUrl + '/selector_listMonth.action',
		root : 'results',
		totalProperty : 'totalCount',
		fields : ['month_id', 'month_name']
	});

	store.on('load', changeSelect);
	store.load();

	MonthSelector.superclass.constructor.call(this, {
		store : store,
		valueField : 'month_id',
		displayField : 'month_name',
		mode : 'local',
		hiddenName : hiddenName,
		editable : false,
		triggerAction : 'all',
		allowBlank : false,
		fieldLabel : fieldLabel,
		name : 'month_id',
		id : id,
		anchor : an
	});

	function changeSelect() {
		if (store.getCount() > 0) {
			var combo = Ext.getCmp('monthId');
			var value = store.getAt(0).get('month_id');
			combo.setValue(value);
			monthId = value;
			queryChart();
		}
	}
}
Ext.extend(MonthSelector, Ext.form.ComboBox);