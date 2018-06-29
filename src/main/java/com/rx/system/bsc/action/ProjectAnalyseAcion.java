package com.rx.system.bsc.action;

import java.awt.Dimension;
import java.util.List;
import java.util.Map;

import com.rx.log.annotation.FunDesc;
import com.rx.log.annotation.UseLog;
import com.rx.system.base.BaseDispatchAction;
import com.rx.system.bsc.service.IProjectAnalyseService;
import com.rx.system.fusionchart.DashBord;
import com.rx.system.fusionchart.FusionChart;
import com.rx.system.fusionchart.IChart;
import com.rx.system.table.DhtmlTableTemplate;
import com.rx.system.table.ITableTemplate;

/**
 * 方案分析Action
 * @author chenxd
 *
 */
@SuppressWarnings("serial")
public class ProjectAnalyseAcion extends BaseDispatchAction {
	
	private IProjectAnalyseService projectAnalyseService = null;
	
	/**
	 * 查询方案积分历史
	 * @return
	 * @throws Exception
	 */
	@FunDesc(code="BSC_0041")
	@UseLog
	public String scoreLine() throws Exception {
		try {
			Map<String, Object> paramMap = getRequestParam(request);
			List<Map<String, Object>> scoreLine = this.projectAnalyseService.projectScoreLine(paramMap);
			
			DashBord bord = new DashBord();
			int width = Integer.parseInt(getStringValue(paramMap, "width"));
			int height = Integer.parseInt(getStringValue(paramMap, "height"));
			bord.setDimension(new Dimension(width,height));
			
			FusionChart chart = new FusionChart();
			chart.setDataSet(scoreLine);
			chart.setLabelName("month_label");
			chart.setValueKey("score");
			chart.setChartType(IChart.CHART_TYPE_LINE);
			chart.setCanvasPadding("20");
			bord.add("", chart);
			
			request.setAttribute("dashbord", bord);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return "showchart";
	}
	
	/**
	 * 指标列表
	 * @return
	 * @throws Exception
	 */
	@FunDesc(code="BSC_0042")
	@UseLog
	public String measureList() throws Exception{
		try {
			Map<String, Object> paramMap = getRequestParam(request);
			ITableTemplate template = this.getTemplate();
			List<Map<String, Object>> dataList = this.projectAnalyseService.measureList(paramMap);
			template.setData(dataList);
			
			response.setContentType("text/html;charset=utf-8");
			response.getWriter().write(template.getTableString());
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	/**
	 * 指标图形
	 * @return
	 * @throws Exception
	 */
	@FunDesc(code="BSC_0043")
	@UseLog
	public String measureChart() throws Exception{
		try {
			Map<String, Object> paramMap = getRequestParam(request);
			paramMap.put("year_id", getStringValue(paramMap, "month_id").substring(0, 4));
			List<Map<String, Object>> scoreList = this.projectAnalyseService.measureScoreList(paramMap);
			List<Map<String, Object>> valueList = this.projectAnalyseService.measureValueList(paramMap);
			List<Map<String, Object>> labelList = this.projectAnalyseService.listMonth(paramMap);
			
			DashBord bord = new DashBord();
			int width = Integer.parseInt(getStringValue(paramMap, "width"));
			int height = Integer.parseInt(getStringValue(paramMap, "height"));
			bord.setDimension(new Dimension(width,height));
			
			String xml = this.getCombinationChart(labelList, scoreList, valueList);
			FusionChart chart = new FusionChart(xml);
			chart.setChartType(IChart.CHART_TYPE_MSCOMBIDY2D);
			
			bord.add("", chart);
			
			request.setAttribute("dashbord", bord);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return "showchart";
	}
	
	private String getCombinationChart(List<Map<String, Object>> labelList,List<Map<String, Object>> scoreList,List<Map<String, Object>> valueList) throws Exception {
		StringBuffer sb = new StringBuffer();
		sb.append("<chart palette='2'  showValues='1' divLineDecimalPrecision='1' PYAxisName='得分' SYAxisName='完成值' ");
		sb.append("formatNumberScale='0' divLineDecimalPrecision='1' limitsDecimalPrecision='1' labelDisplay='Rotate' slantLabels='1'>");
		sb.append("<categories>");
		for (Map<String, Object> label : labelList) {
			sb.append("<category label='"+getStringValue(label, "month_label")+"' />");
		}
		sb.append("</categories>");
		
		sb.append("<dataset parentYAxis='P' seriesName='得分' renderAs='Line'>");
		for (Map<String, Object> label : labelList) {
			String mid = getStringValue(label, "month_name");
			String value = "0";
			for (int i = 0; i < scoreList.size(); i++) {
				Map<String, Object> map = scoreList.get(i);
				if(mid.equals(getStringValue(map, "month_id"))){
					value = getStringValue(map, "score");
					break;
				}
			}
			sb.append("<set value='"+value+"' />");
		}
		sb.append("</dataset>");
		
		sb.append("<dataset parentYAxis='S' seriesName='完成值' renderAs='Column'>");
		for (Map<String, Object> label : labelList) {
			String mid = getStringValue(label, "month_name");
			String value = "0";
			for (int i = 0; i < valueList.size(); i++) {
				Map<String, Object> map = valueList.get(i);
				if(mid.equals(getStringValue(map, "month_id"))){
					value = getStringValue(map, "value");
					break;
				}
			}
			sb.append("<set value='"+value+"' />");
		}
		sb.append("</dataset>");
		sb.append("</chart>");
		
		return sb.toString();
	}
	
	
	private ITableTemplate getTemplate() {
		ITableTemplate template = new DhtmlTableTemplate();
		template.setHeader(new String[]{"衡量指标,指标得分,方案最高分,方案最低分,指标排名"});
		template.setColumnAlign("center,right,right,right,right");
		template.setColumnType("ro,ro,ro,ro,ro");
		template.setColumnWidth("220,90,90,90,80");
		template.setColumnFormatType("0,2,2,2,1");
		template.setDataMapKey(new String[]{"measure","score","highest_score","lowest_score","serial"});
		template.setIdField("measure_id");
		
		return template;
	}
	
	
	public void setProjectAnalyseService(IProjectAnalyseService projectAnalyseService) {
		this.projectAnalyseService = projectAnalyseService;
	}
}
