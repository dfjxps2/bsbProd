package com.rx.system.action;

import java.awt.Dimension;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.rx.system.base.BaseDispatchAction;
import com.rx.system.fusionchart.DashBord;
import com.rx.system.fusionchart.FusionChart;
import com.rx.system.fusionchart.IChart;
import com.rx.system.service.ILogModuleService;
/**
 * 模块日志Action
 * @Author: mabo
 * @Date: Oct 9, 2013
 */
public class LogModuleAction extends BaseDispatchAction {
	private static final long serialVersionUID = 1L;
	private ILogModuleService logModuleService;
	public void setLogModuleService(ILogModuleService logModuleService) {
		this.logModuleService = logModuleService;
	}
	
	/**
	 * 生成模块日志fusionChart图形
	 * @return
	 * @throws Exception
	 */
	public String logChart() throws Exception {
		Map<String, Object> paramMap = getRequestParam(request);
		try {
			DashBord bord = new DashBord();
			int width = Integer.parseInt(getStringValue(paramMap, "width"));
			int height = (int) (Integer.parseInt(getStringValue(paramMap, "height")) * 0.8);
			bord.setDimension(new Dimension(width,height));
			
			FusionChart chart = null;
			List<List<Map<String, Object>>> dataList = new ArrayList<List<Map<String, Object>>>();
			if("west".equals(getStringValue(paramMap, "location"))){
				paramMap.put("module_flag", "BSC");
				List<Map<String, Object>> cardsList = this.logModuleService.queryModuleInfo(paramMap);
				dataList.add(cardsList);
			}else{
				paramMap.put("module_flag", "SYS");
				List<Map<String, Object>> sysList = this.logModuleService.queryModuleInfo(paramMap);
				dataList.add(sysList);
			}
			
			for (int i=0;i<dataList.size();i++) {
				chart = new FusionChart();
				chart.setShowNullValue(false);
				chart.setDataSet(dataList.get(i));
				chart.setLabelName("month_id");
				chart.setValueKey("count");
				chart.setChartType(IChart.CHART_TYPE_LINE);
				chart.setShowLabels(true);
				chart.setShowValues(false);
				chart.setChartRightMargin("40");
				chart.setChartBottomMargin("20");
				chart.setLineColor("#f47920");
				chart.setLineThickness("2");
//				chart.setLabelDisplay("Rotate");
//				chart.setSlantLabels("1");
				
				if("west".equals(getStringValue(paramMap, "location"))){
					switch (i) {
					case 0:
						bord.add("方案模块", chart);
						break;
					default:
						break;
					}
				}else{
					switch (i) {
					case 0:
						bord.add("系统模块", chart);
						break;
					default:
						break;
					}
				}
			}
		request.setAttribute("dashbord", bord);
		
		} catch (Exception e) {
			e.printStackTrace();
		}
		return "showchart";
	}
	
	/**
	 * 生成实时曲线图
	 * @return
	 * @throws Exception
	 */
	public String instantChart() throws Exception{
		Map<String, Object> paramMap = getRequestParam(request);
		try {
			DashBord bord = new DashBord();
			int width = Integer.parseInt(getStringValue(paramMap, "width"));
			int height = Integer.parseInt(getStringValue(paramMap, "height"));
			bord.setDimension(new Dimension(width,height));
			//积分前十对象图标
			FusionChart chart = new FusionChart();
			List<Map<String, Object>> dataList = this.logModuleService.queryInstant(paramMap);
			chart.setDataSet(dataList);
			chart.setLabelName("record_time");
			chart.setValueKey("count");
			chart.setChartType(IChart.CHART_TYPE_LINE);
			chart.setShowLabels(false);
			chart.setShowValues(false);
			chart.setChartRightMargin("40");
			chart.setChartBottomMargin("40");
			chart.setLineColor("#f47920");
			chart.setLineThickness("2");
			bord.add("实时访问趋势图", chart);
			request.setAttribute("dashbord", bord);
		} catch (RuntimeException e) {
			e.printStackTrace();
		}
		return "showchart";
	}
}
