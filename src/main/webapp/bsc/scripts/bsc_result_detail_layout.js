var mask = null;
var dhtmlGrid = null;
Ext.onReady(function() {
	var menu = [{
		text : '导出(e)',
		tooltip : '导出查询结果',
		iconCls : 'export',
		handler : function() {
			if (monthID == '' || projectID == '' || roleID == '' || objectID == '')
				return;
			document.excelForm.month_id.value = monthID;
			document.excelForm.project_id.value = projectID;
			document.excelForm.role_id.value = roleID;
			document.excelForm.object_id.value = objectID;
			document.excelForm.file_name.value = '方案结果明细';
			document.excelForm.submit();
		}
	},'-',{
		text : '返回(b)',
		tooltip : '返回积分结果页面',
		iconCls : 'cancel',
		handler : function() {
			goback();
		}
	}]
	var viewport = new Ext.Viewport({
		split : true,
		title : '考核结果明细',
		layout : 'border',
		items : [{
			region : 'center',
			xtype : 'panel',
			id : 'tablePanel',
			contentEl : 'measure_table',
			tbar : menu,
			border : true,
			split : false
		}, {
			region : 'south',
			height : 300,
			border : false,
			contentEl : 'chartframe'
		}]
	});
	
	mask = new Ext.LoadMask(Ext.get('measure_table'), {
		msg : "正在加载,请稍后......"
	});
	
	height = $("#chartframe").height();
	width = $("#chartframe").width();
	
	dhtmlGrid = new dhtmlXGridObject('measure_table');
	dhtmlGrid.setImagePath(pathUrl + "/public/scripts/dhtmlx/imgs/");
	dhtmlGrid.setSkin("bsc");
	dhtmlGrid.init();
	dhtmlGrid.enableRowspan();
	mask.show();
	var param = "?role_id=" + roleID + "&project_id=" + projectID + "&month_id=" + monthID+"&object_id="+objectID;
	dhtmlGrid.load(pathUrl + '/bscresult_dhtmlDetail.action' + param, function() {
		mask.hide();
	});
	
	document.getElementById("chartframe").src = pathUrl + '/bscresult_detailChart.action'+param+"&height="+height+"&width="+width;
});

function goback() {
	window.location = 'bsc_result.jsp?month_id='+monthID+'&project_id='+projectID+"&role_id="+roleID;
}