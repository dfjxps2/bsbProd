
var viewport = new Ext.Viewport({
	border : false,
	layout : 'border',
	items : [{
		region : 'center',
		border : false,
		items : [{
			title : '我的年度总分趋势图',
			region : 'north',
			height : height / 2,
			contentEl : 'div1'
		}, {
			title : '我的年度排名趋势图',
			region : 'center',
			contentEl : 'div2'
		}]
	},{
		title : '衡量指标完成值情况',
		region : 'east',
		width : width/2,
		contentEl : 'div3'
	}]
})

var scoreLineChart = new FusionCharts(pathUrl+'/public/scripts/Charts/Line.swf','scoreLineChart',""+(width/2), ""+(height/2),"0","0");
scoreLineChart.setDataXML(scoreLineXML);
scoreLineChart.render("div1");

var orderLineChart = new FusionCharts(pathUrl+'/public/scripts/Charts/Line.swf','orderLineChart',""+(width/2), ""+(height/2),"0","0");
orderLineChart.setDataXML(orderLineXML);
orderLineChart.render("div2");
	
