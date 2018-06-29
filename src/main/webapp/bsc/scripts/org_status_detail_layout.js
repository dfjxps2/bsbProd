var mask = null;
var dhtmlGrid = null;

// 显示分页条 pageSize-分页大小
function showBbar(pageSize) {
	var obj_bbar = Ext.getCmp('centerPanel').getBottomToolbar();
	obj_bbar.show();
	obj_bbar.pageSize = pageSize;
}
// 初始化分页条 totalCount-数据总数 path-分页条动作地址
function initBbar(totalCount, path) {
	var obj_bbar = Ext.getCmp('centerPanel').getBottomToolbar();
	obj_bbar.initProperties(totalCount, path, true);
}

Ext.onReady(function() {
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [{
			region : 'center',
			xtype : 'panel',
			id : 'centerPanel',
			contentEl : 'center',
			border : true,
			split : false,
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

	var param = "?month_id=" + monthID +"&obj_cate_id="+obj_cate_id+ "&width=" + $("#centerPanel").width();
	if(object_id != '')
		param += "&object_id="+object_id;

	mask.show();

	path = pathUrl + '/bsccard_StrategyDetail.action' + param;
	Ext.Ajax.request({
		url : pathUrl + '/bsccard_StrategyDetailCount.action' + param,
		waitMsg : '正在处理,请稍候......',
		method : 'POST',
		timeout : 30000,
		callback : function(options, success, response) {
			var json = Ext.util.JSON.decode(response.responseText);
			if (json.success) {
				var totalCount = parseFloat(json.info);
				load(path);
				initBbar(parseInt(totalCount), path);
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

	mask.hide();
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
