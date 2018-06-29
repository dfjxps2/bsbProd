var mask = null;
var dhtmlGrid = null;
Ext.onReady(function() {
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [{
			region : 'center',
			xtype : 'panel',
			id : 'centerPanel',
			contentEl : 'center',
			border : true,
			split : false
		}]
	});
	mask = new Ext.LoadMask(Ext.get('center'), {
		msg : "正在加载,请稍后......"
	});
	queryResult();
});

function queryResult() {
	dhtmlGrid = new dhtmlXGridObject('center');
	dhtmlGrid.setImagePath(pathUrl + "/public/scripts/dhtmlx/imgs/");
	dhtmlGrid.setSkin("bsc");
	dhtmlGrid.init();
	dhtmlGrid.enableRowspan(true);
	dhtmlGrid.enableColSpan(true);

	mask.show();
	var param = "?month_id=" + monthID+"&obj_cate_id="+obj_cate_id+"&width="+$("#centerPanel").width()
	dhtmlGrid.load(pathUrl + '/bsccard_StrategyTable.action' + param,
			function() {
				mask.hide();
			});
	mask.hide();}
