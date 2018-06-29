var mask = null;
Ext.onReady(function(){
	
	var tbar = [{
		text : '返回方案(b)',
		tooltip : '返回方案查询页面',
		iconCls : 'cancel',
		handler : function() {
			window.location.href = prev_page+"?month_id="+month_id+"&project_id="+project_id+"&object_id="+object_id+"&objCateId="+objCateId;
		}
	}];
	
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [{
			title : '方案得分趋势图',
			region : 'center',
			split : true,
			border : true,
			tbar : tbar,
			layout : 'border',
			items : [{
				region : 'center',
				contentEl : 'graph',
				border : false,
				split : false
			}]
		},{
			region : 'south',
			layout : 'border',
			border : false,
			split : true,
			height : 340,
			items : [{
				title : '指标比较',
				region : 'west',
				width : 580,
				contentEl : 'measure_list',
				split : true,
				border : true
			},{
				title : '衡量指标(得分/完成值)趋势图',
				region : 'center',
				contentEl : "measure_his",
				split : false,
				border : false
			}]
		}]
	});
	mask = new Ext.LoadMask(Ext.get('measure_list'), {
		msg : "正在加载,请稍后......"
	});
	loadMeasureGird();
});

function loadMeasureGird() {
	var url = pathUrl + '/projectAnalyse_measureList.action?project_id='+project_id+"&month_id="+month_id+"&object_id="+object_id;
	dhtmlGrid = new dhtmlXGridObject('measure_list');
	dhtmlGrid.setImagePath(pathUrl + "/public/scripts/dhtmlx/imgs/");
	dhtmlGrid.setSkin("bsc");
	dhtmlGrid.init();
	dhtmlGrid.attachEvent("onRowSelect", function(id,ind){
		var width = $("#measure_his_frame").width();
		var height = $("#measure_his_frame").height()+10;
		var url = pathUrl + '/projectAnalyse_measureChart.action?project_id='+project_id+"&month_id="+month_id+"&object_id="+object_id;
		url += "&width="+width+"&height="+height+"&measure_id="+id;
		$("#measure_his_frame").attr('src',url)
	});
	dhtmlGrid.load(url, function() {
		mask.hide();
		loadGraph();
		dhtmlGrid.selectRow(0,true);
	});
	
	mask.hide();
}



function loadGraph() {
	var width = $("#graph_frame").width();
	var height = $("#graph_frame").height()+10;
	var url = pathUrl + '/projectAnalyse_scoreLine.action?project_id='+project_id+"&month_id="+month_id+"&object_id="+object_id;
	url += "&width="+width+"&height="+height;
	$("#graph_frame").attr('src',url)
}