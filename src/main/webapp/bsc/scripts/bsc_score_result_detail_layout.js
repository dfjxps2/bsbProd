var mask = null;
var dhtmlGrid = null;
Ext.onReady(function() {
	var menu = [{
		text : '导出(e)',
		tooltip : '导出查询结果',
		iconCls : 'export',
		handler : function() {
			if (monthID == '' || projectID == '' || objectID == '')
				return;
			document.excelForm.month_id.value = monthID;
			document.excelForm.project_id.value = projectID;
			document.excelForm.cycleTypeId.value = cycle_type_id;
			document.excelForm.month_name.value = monthName;
			document.excelForm.project_name.value = projectName;
			document.excelForm.object_id.value = objectID;
			document.excelForm.file_name.value = '方案结果明细.xls';
			document.excelForm.full_score.value = full_score;
			document.excelForm.submit();
		}
	},'-',{
		text : '返回(b)',
		tooltip : '返回积分结果页面',
		iconCls : 'cancel',
		handler : function() {
			goback();
//			history.go(-1);
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
			height : 250,
			border : false,
			contentEl : 'chartframe'
		}]
	});
	
	mask = new Ext.LoadMask(Ext.get('measure_table'), {
		msg : "正在加载,请稍后......"
	});
	
	height = $("#chartframe").height();
	width = $("#chartframe").width();
	
	queryResult()
	var param = "?role_id=31888801&project_id="+projectID+"&month_id=" + monthID+"&object_id="+objectID;
	document.getElementById("chartframe").src = pathUrl + '/bscresult_detailChart.action'+param+"&height="+height+"&width="+width;
});

function queryResult() {
	dhtmlGrid = new dhtmlXGridObject('measure_table');
	dhtmlGrid.setImagePath(pathUrl + "/public/scripts/dhtmlx/imgs/");
	dhtmlGrid.setSkin("bsc");
	dhtmlGrid.init();
	dhtmlGrid.enableRowspan(true);
	dhtmlGrid.enableColSpan(true);

	mask.show();
	var param = "?project_id=" + projectID + "&month_id=" + monthID
			+ "&object_id=" + objectID+"&cycleTypeId="+cycle_type_id ;
	dhtmlGrid.load(pathUrl + '/bsccard_query.action' + param, function() {
		mask.hide();
		var xml = dhtmlGrid.serialize();
		if (xml.length <= 34) {
			return;
		}
//		insertTotalRow(dhtmlGrid);
	dhtmlGrid.addRow("total", "加权总得分,,,,,,,,,," + full_score);
	dhtmlGrid.setColspan("total", 0, 10);
	});
	mask.hide();

}
function insertTotalRow(grid) {
	var ids = grid.getAllRowIds(";");
	var idArray = ids.split(";");

	var totalPoint = 0;
	var rate = 0.00;
	for (var i = 0; i < idArray.length; i++) {
		var p = grid.cellById(idArray[i], '10').getValue();
		var r = grid.cellById(idArray[i], '9').getValue();
		totalPoint += parseInt(p);
//		* parseFloat(r);
		rate += parseFloat(r);
	}
	grid.addRow("total", "合计,,,,,,,,," + Math.round(totalPoint));
	grid.setColspan("total", 0, 10);

}
function goback() {
	window.location = 'bsc_proj_obj_score.jsp?month_id=' + monthID
			+ '&project_id=' + projectID + '&objCateId=' + obj_cate_id
			+ '&cycle_type_id='+cycle_type_id;
}

showPointFormulaDetail = function(month_id,objId,pid,mid) {
	var ah = 480;
	var aw =800;
	var top = (window.screen.availHeight - 30 - ah)/2;
	var left = (window.screen.availWidth - 10 - aw)/2;
	var url = pathUrl + "/bsc/pages/bsccard_formulaDetail.action?month_id="+month_id+"&object_id="+objId+"&project_id="+pid+"&measure_id="+mid+"&type=score+&cycle_type="+cycle_type_id;
	window.open(url,"newwindow","height="+ ah+ ",width="+ aw+ ",top="+top+",left="+left+",toolbar=no,menubar=no,resizable=no,scrollbars=yes,location=no,status=no");
}