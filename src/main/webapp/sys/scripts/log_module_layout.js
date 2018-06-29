/*
------------------------------------------------------------------------------
文件名称：log_module_layout.js
说    明：JavaScript脚本，模块访问量布局。
版    本：1.0
修改纪录:
------------------------------------------------------------------------------
时间              修改人         说明
2013-10-09      mabo         创建
------------------------------------------------------------------------------
 */
// 年度下拉列表
var year_store = new Ext.data.JsonStore({
			url : pathUrl + '/selector_listYear.action',
			root : 'results',
			fields : ['year_id', 'year_name'],
			autoLoad : true
		});
year_store.on('load', function() {// 添加默认值
		if(year_store.getCount() > 0){
			Ext.getCmp('year_code').setValue(year_store.getAt(0).get('year_id'));
			loadGraph();
		}
})
var centerbar = [/*'->',*/ '请选择年份：', {
		xtype : 'combo',
		fieldLabel : '年度',
		id : 'year_code',
		hiddenName : 'year_id',
		valueField : 'year_id',
		displayField : 'year_name',
		store : year_store,
		listeners : {
			select : function(combo,record,index) {
					loadGraph();
			}
		},
		triggerAction : 'all',
		mode : 'local',
		width : 140
	}]

Ext.onReady(function() {
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [{
			region : 'center',
			id : 'westpanel',
			border : false,
			split : true,
			tbar : centerbar,
			layout : 'border',
			items : [{
				region : 'west',
				width : '50%',
				border : false,
				split : true,
				contentEl : 'chartframe1'
			},{
				region : 'center',
				border : false,
				split : true,
				contentEl : 'chartframe2'
			}]
		}]
	});
})

function loadGraph() {
	var year_id = Ext.getCmp('year_code').getValue();
	if(year_id == '')
		return;
	height = $("#chartframe1").height()-10;
	width = $("#chartframe1").width();
	var param = '?year_id='+year_id;
	document.getElementById("chartframe1").src = pathUrl
			+ '/logModule_logChart.action' + param + "&height=" + height
			+ "&width=" + width + "&location=west";
	document.getElementById("chartframe2").src = pathUrl
	+ '/logModule_logChart.action' + param + "&height=" + height
	+ "&width=" + width+"&location=center";
}
