
// 导出图片后调用的回调函数
function FC_Exported(objRtn) {
	if (objRtn.statusCode == "1") {
		alert("The chart with DOM Id "
				+ objRtn.DOMId
				+ " was successfully saved   on server. The file can be accessed from "
				+ objRtn.fileName);
	} else {
		alert("The chart with DOM Id "
				+ objRtn.DOMId
				+ " could not be saved on server.   There was an error. Description : "
				+ objRtn.statusMessage);
	}
}
// 导出图片调用的方法
function startExport() {
	var chart = getChartFromId("myFusionExport"); // 生成的FusionCharts图表本身的标识
	// if (chart.hasRendered()==true){
	if (chart.hasRendered()) {
		chart.exportChart();
	} else {
		alert("Please wait for the chart to finish rendering, before you can   invoke exporting");
	}
}

function showFusionCharts() {

	var xmlData = "<chart palette='2' caption='按地市统计报表-不达标数' xAxisName='地市'  yAxisName='' showToolTip='0' showValues='1'  formatNumberScale='0' rotateNames='0' decimals='0'  useRoundEdges='1' exportEnabled='1' exportAtClient='0'  exportAction='save' exportFileName='weeksnotsucced'  exportDialogMessage='正在导出，请稍候...'  "
			+ "exportHandler='http://13.239.8.171:8080/bsbbsc/chart_export/FCExporter.jsp'  exportShowMenuItem='1'>"
			+ "<set name='Jan' value='462' color='AFD8F8' />"
			+ "<set name='Feb' value='857' color='F6BD0F' />"
			+ "<set name='Mar' value='671' color='8BBA00' />" + "</chart>";
	var chart = new FusionCharts(pathUrl+"/public/scripts/Charts/Column3D.swf", "myFusionExport", "450", "280", "0", "0");
	chart.setDataXML(xmlData);
	chart.render("myFusion"); // 放置图表的DIV的ID
}
