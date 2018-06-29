/*
------------------------------------------------------------------------------
文件名称：log_instant_layout.js
说    明：JavaScript脚本，日志页面布局。
版    本：1.0
修改纪录:
------------------------------------------------------------------------------
时间              修改人         说明
2013-10-09      mabo         创建
------------------------------------------------------------------------------
 */
Ext.onReady(function(){
	var viewport = new Ext.Viewport({
		layout : 'fit',
		items : [{
			id : 'mainpanel',
			border : false,
			split : true,
			contentEl : 'chartframe'
		}]
	});
	height = $("#chartframe").height()-10;
	width = $("#chartframe").width();
	document.getElementById("chartframe").src = pathUrl
			+ '/logModule_instantChart.action?height=' + height
			+ "&width=" + width ;
})
