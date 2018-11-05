package com.rx.system.bsc.action;

import static com.rx.system.util.CommonUtil.getCurrentDateString;

import java.awt.Dimension;
import java.io.File;
import java.io.OutputStream;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.apache.struts2.ServletActionContext;

import com.rx.framework.jdbc.JdbcManager;
import com.rx.log.annotation.FunDesc;
import com.rx.log.annotation.UseLog;
import com.rx.system.base.BaseDispatchAction;
import com.rx.system.bsc.service.IBscResultService;
import com.rx.system.constant.Constant;
import com.rx.system.fusionchart.DashBord;
import com.rx.system.fusionchart.FusionChart;
import com.rx.system.fusionchart.IChart;
import com.rx.system.fusionchart.TargetLine;
import com.rx.system.model.excel.utils.ExcelField;
import com.rx.system.model.excel.utils.ExcelUtil;
import com.rx.system.service.ISelectorService;
import com.rx.system.table.DhtmlTableTemplate;
import com.rx.system.table.ITableTemplate;

/**
 * 平衡计分卡考核结果Action
 * @author chenxd
 *
 */
@SuppressWarnings("serial")
public class BscResultAction extends BaseDispatchAction {

	public static final int ROW_ACCESS_WINDOW_SIZE = 100;
	
	private IBscResultService bscResultService = null;
	private ISelectorService selectorService = null;
	
	private JdbcManager jdbcManager;
	
	public JdbcManager getJdbcManager() {
		return jdbcManager;
	}

	public void setJdbcManager(JdbcManager jdbcManager) {
		this.jdbcManager = jdbcManager;
	}

	/**
	 * 根据结果数据展示为fushionchart图形
	 * @return
	 * @throws Exception
	 */
	@FunDesc(code="BSC_0019")
	@UseLog
	public String chart() throws Exception {
		Map<String, Object> paramMap = getRequestParam(request);
		try {
			DashBord bord = new DashBord();
			int width = Integer.parseInt(getStringValue(paramMap, "width"));
			int height = Integer.parseInt(getStringValue(paramMap, "height"));
			bord.setDimension(new Dimension(width,height));
			//积分前十对象图标
			FusionChart topColumnChart = new FusionChart();
			List<Map<String, Object>> topList = this.bscResultService. getTopPoint(paramMap);
			topColumnChart.setDataSet(topList);
			topColumnChart.setLabelName("object_name");
			topColumnChart.setValueKey("value");
			topColumnChart.setChartType(IChart.CHART_TYPE_COLUMN3D);
			TargetLine lineB = new TargetLine("2.5","合格值","009933");
			TargetLine lineA = new TargetLine("8","优秀值","009933");
			topColumnChart.addTargetLine(lineA);
			topColumnChart.addTargetLine(lineB);
			
			
			bord.add("积分排名", topColumnChart);
			
			FusionChart test = new FusionChart();
			test.setDataSet(topList);
			test.setLabelName("object_name");
			test.setValueKey("value");
			test.setChartType(IChart.CHART_TYPE_BAR2D);
			bord.add("等级分布", test);
			
			request.setAttribute("dashbord", bord);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return "showchart";
	}
	
	/**
	 * 发布结果
	 * @return
	 * @throws Exception
	 */
	@FunDesc(code="BSC_0020")
	@UseLog
	public String publishResult() throws Exception {
		try {
			Map<String, Object> paramMap = getRequestParam(request);
			String canPublish = this.bscResultService.canPublish(paramMap);
			if(Integer.parseInt(canPublish) == 1){
				doFailureInfoResponse("该方案在所选月份已经发布!");
				return null;
			}else if(Integer.parseInt(canPublish) == 2){
				doFailureInfoResponse("所选月份并非该方案周期的期末月份，不允许发布!");
				return null;	
			}
			
			this.bscResultService.publishBscResult(paramMap);
			doSuccessInfoResponse("数据公布成功");
		} catch (Exception e) {
			e.printStackTrace();
			doFailureInfoResponse(e.getMessage());
		}
		return null;
	}
	
	//------------------------------------------ 考核对象结果明细方法 ------------------------------------------------------
	
	/**
	 * 查询考核结果对象明细 
	 */
	@FunDesc(code="BSC_0021")
	@UseLog
	public String dhtmlDetail() throws Exception {
		Map<String, Object> paramMap = this.getRequestParam(request);
		try {
			List<Map<String, Object>> dataList = this.bscResultService.getBscResultDetail(paramMap);
			
			ITableTemplate template = this.getDetailDhtmlConfig();
			
			template.setData(dataList);
			
			response.setContentType("text/html;charset=utf-8");
			response.getWriter().print(template.getTableString());
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	/**
	 * 返回考核结果对象明细图形 
	 * @return
	 * @throws Exception
	 */
	public String detailChart() throws Exception {
		return "showchart";
	}
	
	/**
	 * 获取查询配置模板
	 * @return
	 */
	private ITableTemplate getDetailDhtmlConfig() throws Exception{
		ITableTemplate template = new DhtmlTableTemplate();
		template.setHeader(new String[]{"考核维度,#cspan,#cspan,考核指标,指标定义,指标权重(%),计划值,实际值,得分"});
		template.setColumnAlign("center,center,center,center,center,right,right,right,right");
		template.setColumnType("ro,ro,ro,ro,ro,ro,ro,ro,ro");
		template.setColumnWidth("80,80,200,160,160,80,80,80,80");
		template.setColumnFormatType("0,0,0,0,0,2,2,2,2");
		template.setDataMapKey(new String[]{"calc_desc","prorate","plan_value","measure_value","measure_point"});
		template.setGroupFields("dim_id,measure_id");
		template.setLeftTreeShowType(ITableTemplate.LEFT_SHOW_TYPE_TABLE);
		template.isFilterBlank(true);
		
		return template;
	}

	
//***********************************************************************
	/**
	 * 返回DHtml表格结果数据
	 * @return
	 * @throws Exception
	 */
	@FunDesc(code="BSC_0023")
	@UseLog
	public String scoreDhtml() throws Exception {
		Map<String, Object> paramMap = this.getRequestParam(request);
		try {
			this.insertPageParamToMap(paramMap);//插入分页信息
			//方案所有的指标
			List<Map<String, Object>> measureList = this.bscResultService.listProjectMeasure(paramMap);
			paramMap.put("measureList", measureList);
			List<Map<String, Object>> dataList = this.bscResultService.listScoreResult(paramMap);
			ITableTemplate template = new DhtmlTableTemplate();
			
			String[] mapKey = new String[measureList.size()+1];
			String header = "考核对象,";
			String columnAlign = "left,";
			String columnType = "ro,";
			String columnWidth = "260,";
			String formatType = "0,";
			mapKey[0] = "object_name";
			for (int i = 0; i < measureList.size(); i++) {
				Map<String,Object> map = measureList.get(i);
				mapKey[i+1] = "col_"+i;
				header += getStringValue(map, "mea_definition");
				columnAlign += "right";columnType += "ro";columnWidth += "120";formatType += "2";
				if(i != measureList.size()-1){
					header += ",";columnAlign += ",";columnType += ",";columnWidth += ",";formatType += ",";
				}
				paramMap.put("measure_id", getStringValue(map, "measure_id"));
				List<Map<String, Object>> subMeasureList = this.bscResultService.listSubMeasure(paramMap);
				if(subMeasureList.size()>0){
					String param = "project_id=" + getStringValue(paramMap, "project_id") + 
							"&month_id=" + getStringValue(paramMap, "month_id") + 
							"&measure_id=" + getStringValue(map, "measure_id") +
							"&cycle_type_id=" + getStringValue(paramMap, "cycle_type_id") + 
							"&obj_cate_id=" + getStringValue(paramMap, "obj_cate_id") + 
							"&monthName=" + URLDecoder.decode(getStringValue(paramMap, "monthName"), "utf-8") + 
							"&projectName=" + URLDecoder.decode(getStringValue(paramMap, "projectName"), "utf-8");
					template.addHeaderHref(i+1, "bsc_proj_result_detail.jsp?"+param);
				}
			}
			template.setHeader(new String[]{header});
			template.setColumnAlign(columnAlign);
			template.setColumnType(columnType);
			template.setColumnWidth(columnWidth);
			template.setColumnFormatType(formatType);
			template.setDataMapKey(mapKey);
			template.setData(dataList);
			template.useSerialNumber(true);
//			template.setUseCheck(true, 0);
			
			response.setContentType("text/html;charset=utf-8");
			response.getWriter().print(template.getTableString());
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	
	public static String getStringById(String id){
		String [] ids = id.split(",");
		String meaId = "";
		if(ids.length >0){
			for(String str :ids){
				meaId += "'"+str.trim()+"'".concat(",");
			}
		}else{
			meaId ="'"+id+"'";
		}

		meaId = meaId.lastIndexOf(",")>-1?meaId.substring(0,meaId.length() - 1):meaId;
		return meaId;
	}


	public  String getStringByList(List<Map<String, Object>> measureList){
		String ids = "";
		String str = "";
		for(Map<String, Object> mp :measureList){
			str = getStringValue(mp, "measure_id");
			ids += "'"+str+"'".concat(",");
		}
		ids = ids.lastIndexOf(",")>-1?ids.substring(0,ids.length() - 1):ids;

		return ids;
	}
	
	public  String getStringById(List<Map<String, Object>> measureList){
		String ids = "";
		for(Map<String, Object> mp :measureList){
			ids += getStringValue(mp, "measure_id").concat(".");
		}
		ids = ids.lastIndexOf(".")>-1?ids.substring(0,ids.length() - 1):ids;
		
		return ids;
	}


	/**
	 * 返回DHtml表格结果数据
	 * @return
	 * @throws Exception
	 */
	@FunDesc(code="BSC_0023")
	@UseLog
	public String scoreDhtmlByCond() throws Exception {
		Map<String, Object> paramMap = this.getRequestParam(request);
		List<Map<String, Object>> measureList = null;
		try {
			this.insertPageParamToMap(paramMap);//插入分页信息
			//方案所有的指标
			String meaId = null;
			String measureId = paramMap.get("measure_id").toString();
			if(null != measureId && !"".equals(measureId)){
				meaId = getStringById(measureId);
				paramMap.put("meaId", meaId);
				measureList = this.bscResultService.listProjectMeasureByIndexId(paramMap);
			}else{
				measureList = this.bscResultService.listProjectMeasure(paramMap);
			}
			paramMap.put("measureList", measureList);
			String ids = this.getStringById(measureList);
			List<Map<String, Object>> dataList = this.bscResultService.listScoreResult(paramMap);
			ITableTemplate template = new DhtmlTableTemplate();
			String[] mapKey = new String[measureList.size()+1];
			String header = "维度名称,";
			String columnAlign = "left,";
			String columnType = "ro,";
			String columnWidth = "260,";
			String formatType = "0,";
			mapKey[0] = "object_name";
			for (int i = 0; i < measureList.size(); i++) {
				Map<String,Object> map = measureList.get(i);
				mapKey[i+1] = "col_"+i;
				header += getStringValue(map, "mea_definition");
				columnAlign += "right";columnType += "ro";columnWidth += "120";formatType += "2";
				if(i != measureList.size()-1){
					header += ",";columnAlign += ",";columnType += ",";columnWidth += ",";formatType += ",";
				}
				paramMap.put("measure_id", getStringValue(map, "measure_id"));

				List<Map<String, Object>> subMeasureList = this.bscResultService.listSubMeasure(paramMap);
				if(subMeasureList.size()>0){

					String param = "project_id=" + getStringValue(paramMap, "project_id") +
							"&month_id=" + getStringValue(paramMap, "month_id") +
							"&measure_id=" + getStringValue(map, "measure_id") +
							"&ids=" + ids +
							"&cycle_type_id=" + getStringValue(paramMap, "cycle_type_id") +
							"&obj_cate_id=" + getStringValue(paramMap, "obj_cate_id") +
							"&monthName=" + URLDecoder.decode(getStringValue(paramMap, "monthName"), "utf-8") +
							"&projectName=" + URLDecoder.decode(getStringValue(paramMap, "projectName"), "utf-8");
					template.addHeaderHref(i+1, "bsc_proj_result_index_detail.jsp?"+param);
				}
			}
			template.setHeader(new String[]{header});
			template.setColumnAlign(columnAlign);
			template.setColumnType(columnType);
			template.setColumnWidth(columnWidth);
			template.setColumnFormatType(formatType);
			template.setDataMapKey(mapKey);
			template.setData(dataList);
			template.useSerialNumber(true);
//			template.setUseCheck(true, 0);

			response.setContentType("text/html;charset=utf-8");
			response.getWriter().print(template.getTableString());
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}



	/**
	 * 返回DHtml表格结果数据总数
	 * @return
	 * @throws Exception
	 */
	public String scoreDhtmlCountByCond() throws Exception {
		Map<String, Object> paramMap = this.getRequestParam(request);
		try {
			String totalCount = this.bscResultService.listScoreResultCount(paramMap);
			String canPublish = this.bscResultService.canPublish(paramMap);
			doSuccessInfoResponse(totalCount + "," + canPublish);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}



	@FunDesc(code="BSC_0024")
	@UseLog
	public String exportScoreByCond() throws Exception {
		List<Map<String, Object>> measureList = null;
		Map<String, Object> paramMap = this.getRequestParam(request);
		try {
			String projcetName = getStringValue(paramMap, "project_name");
			String month_id = getStringValue(paramMap, "month_id");
			String month_name = month_id.substring(0, 4)+"年"+month_id.substring(4)+"月";
			//方案所有的指标
			String meaId = null;
			String measureId = paramMap.get("measure_id").toString();
			if(null != measureId && !"".equals(measureId)){
				 meaId = getStringById(measureId);
				 paramMap.put("meaId", meaId);
				 measureList = this.bscResultService.listProjectMeasureByIndexId(paramMap);
			}else{
				 measureList = this.bscResultService.listProjectMeasure(paramMap);
			}
			paramMap.put("measureList", measureList);
			List<Map<String, Object>> dataList = this.bscResultService.listScoreTotalResult(paramMap);
			ITableTemplate template = new DhtmlTableTemplate();
			
			String[] mapKey = new String[measureList.size()+1];
			String header = "维度名称,";
			String columnAlign = "left,";
			String columnType = "ro,";
			String columnWidth = "260,";
			String formatType = "0,";
			mapKey[0] = "object_name";
			for (int i = 0; i < measureList.size(); i++) {
				Map<String,Object> map = measureList.get(i);
				mapKey[i+1] = "col_"+i;
				header += getStringValue(map, "mea_definition");
				columnAlign += "right";columnType += "ro";columnWidth += "120";formatType += "2";
				if(i != measureList.size()-1){
					header += ",";columnAlign += ",";columnType += ",";columnWidth += ",";formatType += ",";
				}
			}
			
			template.setHeader(new String[]{header});
			template.setColumnAlign(columnAlign);
			template.setColumnType(columnType);
			template.setColumnWidth(columnWidth);
			template.setColumnFormatType(formatType);
			template.setDataMapKey(mapKey);
			template.setData(dataList);
			
			template.setTitle(paramMap.get("title").toString()); 
			String []titiles = header.split(HEADER_SPLIT);
			template.setExcelInfoRow(new String[][] {
					{ "方案名称：", projcetName },
					{ "月份：", month_name },
					{ "指标名称：", titiles[1] }
					
			});
			
			String webBasePath = ServletActionContext.getServletContext().getRealPath("/");
			String localFileName = webBasePath + Constant.FILE_DOWNLOAD_DIR + this.getCurrentUser().getUser_id()+".xls";
			template.writeToFile(new File(localFileName));
			return "excelDownload";
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}	
	
	/**
	 * 钻取查询下级指标明细
	 * @return
	 * @throws Exception
	 */
	public String scoreDhtmlSub() throws Exception {
		Map<String, Object> paramMap = this.getRequestParam(request);
		try {
			
			this.insertPageParamToMap(paramMap);//插入分页信息
			//方案所有的指标
			List<Map<String, Object>> measureList = this.bscResultService.listSubMeasure(paramMap);
			paramMap.put("measureList", measureList);
			List<Map<String, Object>> dataList = this.bscResultService.listScoreSubResult(paramMap);
			ITableTemplate template = new DhtmlTableTemplate();
			
			String[] mapKey = new String[measureList.size()+1];
			String meaFlag = paramMap.get("title").toString();
			String header = "考核对象,";
			if(MEASURE_FLAG.equals(meaFlag)){
				 header = "维度名称,";
			}
			String columnAlign = "left,";
			String columnType = "ro,";
			String columnWidth = "260,";
			String formatType = "0,";
			mapKey[0] = "object_name";
			for (int i = 0; i < measureList.size(); i++) {
				Map<String,Object> map = measureList.get(i);
				mapKey[i+1] = "col_"+i;
				header += getStringValue(map, "mea_definition");
				columnAlign += "right";columnType += "ro";columnWidth += "120";formatType += "2";
				if(i != measureList.size()-1){
					header += ",";columnAlign += ",";columnType += ",";columnWidth += ",";formatType += ",";
				}
				paramMap.put("measure_id", getStringValue(map, "measure_id"));
				List<Map<String, Object>> subMeasureList = this.bscResultService.listSubMeasure(paramMap);
				if(subMeasureList.size()>0){
					String param = "project_id=" + getStringValue(paramMap, "project_id") + 
							"&month_id=" + getStringValue(paramMap, "month_id") + 
							"&measure_id=" + getStringValue(map, "measure_id") +
							"&cycle_type_id=" + getStringValue(paramMap, "cycle_type_id") + 
							"&obj_cate_id=" + getStringValue(paramMap, "obj_cate_id") + 
							"&monthName=" + URLDecoder.decode(getStringValue(paramMap, "monthName"), "utf-8") + 
							"&projectName=" + URLDecoder.decode(getStringValue(paramMap, "projectName"), "utf-8");
					template.addHeaderHref(i+1, "bsc_proj_result_detail.jsp?"+param);
				}
			}
			
			template.setHeader(new String[]{header});
			template.setColumnAlign(columnAlign);
			template.setColumnType(columnType);
			template.setColumnWidth(columnWidth);
			template.setColumnFormatType(formatType);
			template.setDataMapKey(mapKey);
			template.setData(dataList);
			template.useSerialNumber(true);
//			template.setUseCheck(true, 0);
			
			response.setContentType("text/html;charset=utf-8");
			response.getWriter().print(template.getTableString());
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	/**
	 * 返回DHtml表格结果数据总数
	 * @return
	 * @throws Exception
	 */
	public String scoreDhtmlCount() throws Exception {
		Map<String, Object> paramMap = this.getRequestParam(request);
		try {
			String totalCount = this.bscResultService.listScoreResultCount(paramMap);
			String canPublish = this.bscResultService.canPublish(paramMap);
			doSuccessInfoResponse(totalCount + "," + canPublish);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	@FunDesc(code="BSC_0024")
	@UseLog
	public String exportScore() throws Exception {
		Map<String, Object> paramMap = this.getRequestParam(request);
		try {
			String projcetName = getStringValue(paramMap, "project_name");
			String month_id = getStringValue(paramMap, "month_id");
			String month_name = month_id.substring(0, 4)+"年"+month_id.substring(4)+"月";
			//方案所有的指标
			List<Map<String, Object>> measureList = this.bscResultService.listProjectMeasure(paramMap);
			paramMap.put("measureList", measureList);
			List<Map<String, Object>> dataList = this.bscResultService.listScoreTotalResult(paramMap);
			ITableTemplate template = new DhtmlTableTemplate();
			
			String[] mapKey = new String[measureList.size()+1];
			String header = "考核对象,";
			String columnAlign = "left,";
			String columnType = "ro,";
			String columnWidth = "260,";
			String formatType = "0,";
			mapKey[0] = "object_name";
			for (int i = 0; i < measureList.size(); i++) {
				Map<String,Object> map = measureList.get(i);
				mapKey[i+1] = "col_"+i;
				header += getStringValue(map, "mea_definition");
				columnAlign += "right";columnType += "ro";columnWidth += "120";formatType += "2";
				if(i != measureList.size()-1){
					header += ",";columnAlign += ",";columnType += ",";columnWidth += ",";formatType += ",";
				}
			}
			template.setHeader(new String[]{header});
			template.setColumnAlign(columnAlign);
			template.setColumnType(columnType);
			template.setColumnWidth(columnWidth);
			template.setColumnFormatType(formatType);
			template.setDataMapKey(mapKey);
			template.setData(dataList);
			
			template.setTitle(paramMap.get("title").toString()); 
			template.setExcelInfoRow(new String[][] {
					{ "方案名称：", projcetName },
					{ "月份：", month_name } });
			
			String webBasePath = ServletActionContext.getServletContext().getRealPath("/");
			String localFileName = webBasePath + Constant.FILE_DOWNLOAD_DIR + this.getCurrentUser().getUser_id()+".xls";
			template.writeToFile(new File(localFileName));
			return "excelDownload";
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	
	
	public String exportScoreSub() throws Exception {
		Map<String, Object> paramMap = this.getRequestParam(request);
		try {
			String projcetName = getStringValue(paramMap, "project_name");
			String month_id = getStringValue(paramMap, "month_id");
			String month_name = month_id.substring(0, 4)+"年"+month_id.substring(4)+"月";
			//方案所有的指标
			List<Map<String, Object>> measureList = this.bscResultService.listSubMeasure(paramMap);
			paramMap.put("measureList", measureList);
			List<Map<String, Object>> dataList = this.bscResultService.listScoreSubResult(paramMap);
			ITableTemplate template = new DhtmlTableTemplate();
			
			String[] mapKey = new String[measureList.size()+1];

			String meaFlag = paramMap.get("title").toString();
			String header = "考核对象,";
			if(MEASURE_FLAG.equals(meaFlag)){
				 header = "维度名称,";
			}
			String columnAlign = "left,";
			String columnType = "ro,";
			String columnWidth = "260,";
			String formatType = "0,";
			mapKey[0] = "object_name";
			for (int i = 0; i < measureList.size(); i++) {
				Map<String,Object> map = measureList.get(i);
				mapKey[i+1] = "col_"+i;
				header += getStringValue(map, "mea_definition");
				columnAlign += "right";columnType += "ro";columnWidth += "120";formatType += "2";
				if(i != measureList.size()-1){
					header += ",";columnAlign += ",";columnType += ",";columnWidth += ",";formatType += ",";
				}
			}
			template.setHeader(new String[]{header});
			template.setColumnAlign(columnAlign);
			template.setColumnType(columnType);
			template.setColumnWidth(columnWidth);
			template.setColumnFormatType(formatType);
			template.setDataMapKey(mapKey);
			template.setData(dataList);
			
			template.setTitle(paramMap.get("title").toString()); 
			template.setExcelInfoRow(new String[][] {
					{ "方案名称：", projcetName },
					{ "月份：", month_name } });
			
			String webBasePath = ServletActionContext.getServletContext().getRealPath("/");
			String localFileName = webBasePath + Constant.FILE_DOWNLOAD_DIR + this.getCurrentUser().getUser_id()+".xls";
			template.writeToFile(new File(localFileName));
			return "excelDownload";
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}	
	
	@FunDesc(code="BSC_0025")
	@UseLog
	public String scoreChart() throws Exception {
		Map<String, Object> paramMap = getRequestParam(request);
		try {
			DashBord bord = new DashBord();
			int width = Integer.parseInt(getStringValue(paramMap, "width"));
			int height = Integer.parseInt(getStringValue(paramMap, "height"));
			bord.setDimension(new Dimension(width,height));
			//积分前十对象图标
			FusionChart topColumnChart = new FusionChart();
			List<Map<String, Object>> topList = this.bscResultService.getScoreTopPoint(paramMap);
			topColumnChart.setDataSet(topList);
			topColumnChart.setLabelName("object_name");
			topColumnChart.setValueKey("score");
			topColumnChart.setChartType(IChart.CHART_TYPE_LINE);
			topColumnChart.setShowLabels(false);
			topColumnChart.setShowValues(false);
			topColumnChart.setChartBottomMargin("30");
			topColumnChart.setLineColor("#f47920");
			topColumnChart.setLineThickness("2");
			bord.add("得分分布", topColumnChart);
			
			
			List<Map<String, Object>> levelCountList = this.bscResultService.getLevelList(paramMap);
			FusionChart level = new FusionChart();
			level.setDataSet(levelCountList);
			level.setLabelName("level_id");
			level.setValueKey("level_count");
			level.setChartType(IChart.CHART_TYPE_PIE3D);
			bord.add("等级分布", level);
			
			request.setAttribute("dashbord", bord);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return "showchart";
	}

	/**
	 * 返回DHtml表格结果数据
	 * @return
	 *
	 * 统计年份 -》  统计年份（单） -》统计维度（多）-》指标（多）
	 *
	 * 统计维度-》统计维度（单）-》 统计年份（多）-》指标（多）
	 * @throws Exception
	 */
	@FunDesc(code="BSC_0023")
	@UseLog
	public String scoreDhtmlByCondExt() throws Exception {
		Map<String, Object> paramMap = this.getRequestParam(request);
		String show_id = getStringValue(paramMap, "show_id");
		List<Map<String, Object>> measureList;
		List<Map<String, Object>> dataList;
		try {
			this.insertPageParamToMap(paramMap);//插入分页信息
			//是否过滤维度
			String oId = null;
			String objId = getStringValue(paramMap, "obj_id");
			if(null != objId && !"".equals(objId)){
				oId = getStringById(objId);
				paramMap.put("oId", oId);
			}
			//是否过滤时间
			String tId = null;
			String timId = getStringValue(paramMap, "time_id");
			if(null != timId && !"".equals(timId)){
				tId = getStringById(timId);
				paramMap.put("tId", tId);
			}
			//方案所有的指标  1, 多统计维度；2, 多统计年份
			String meaId = null;
			String measureId = paramMap.get("measure_id").toString();
			if(null != measureId && !"".equals(measureId)){
				meaId = getStringById(measureId);
				paramMap.put("meaId", meaId);
				measureList = this.bscResultService.listProjectMeasureByIndexId(paramMap);
			}else{
				measureList = this.bscResultService.listProjectMeasure(paramMap);
			}
			paramMap.put("measureList", measureList);

			String ids = this.getStringById(measureList);
			//2统计年份 -》  统计年份（单） -》统计维度（多）-》指标（多）
			//1统计维度-》统计维度（单）-》 统计年份（多）-》指标（多）
			if(show_id.equals("1")){
				dataList = this.bscResultService.listScoreResultByYear(paramMap);
			}else{
				dataList = this.bscResultService.listScoreResult(paramMap);
			}

			ITableTemplate template = new DhtmlTableTemplate();
			String[] mapKey = new String[measureList.size()+2];
			String header = "维度名称,年份,";
			String columnAlign = "center,center,";
			String columnType = "ro,ro,";
			String columnWidth = "150,140,";
			String formatType = "0,0,";
			mapKey[0] = "object_name";
			mapKey[1] = "month_name";
			if(show_id.equals("2")){
				header = "年份,维度名称,";
				columnWidth = "140,150,";
				mapKey[0] = "month_name";
				mapKey[1] = "object_name";
			}
			for (int i = 0; i < measureList.size(); i++) {
				Map<String,Object> map = measureList.get(i);
				mapKey[i+2] = "col_"+i;
				header += getStringValue(map, "mea_definition");
				columnAlign += "center";columnType += "ro";columnWidth += "120";formatType += "2";
				if(i != measureList.size()-1){
					header += ",";columnAlign += ",";columnType += ",";columnWidth += ",";formatType += ",";
				}
				paramMap.put("measure_id", getStringValue(map, "measure_id"));

				List<Map<String, Object>> subMeasureList = this.bscResultService.listSubMeasure(paramMap);
				if(subMeasureList.size()>0){

					String param = "project_id=" + getStringValue(paramMap, "project_id") +
							"&month_id=" + getStringValue(paramMap, "month_id") +
							"&measure_id=" + getStringValue(map, "measure_id") +
							"&ids=" + ids +
							"&cycle_type_id=" + getStringValue(paramMap, "cycle_type_id") +
							"&obj_cate_id=" + getStringValue(paramMap, "obj_cate_id") +
							"&obj_id=" + getStringValue(paramMap, "obj_id").replace(",",".") +
							"&show_id=" + getStringValue(paramMap, "show_id") +
							"&time_id=" + getStringValue(paramMap, "time_id").replace(",",".") +
							"&monthName=" + URLDecoder.decode(getStringValue(paramMap, "monthName"), "utf-8") +
							"&projectName=" + URLDecoder.decode(getStringValue(paramMap, "projectName"), "utf-8");
					template.addHeaderHref(i+2, "bsc_proj_obj_index_score_ext_detail.jsp?"+param);
				}
			}
			template.setHeader(new String[]{header});
			template.setColumnAlign(columnAlign);
			template.setColumnType(columnType);
			template.setColumnWidth(columnWidth);
			template.setColumnFormatType(formatType);
			template.setDataMapKey(mapKey);
			template.setData(dataList);
			template.useSerialNumber(true);
//			template.setUseCheck(true, 0);

			response.setContentType("text/html;charset=utf-8");
			response.getWriter().print(template.getTableString());
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;

	}

	/**
	 * 返回DHtml表格结果数据总数
	 * @return
	 * @throws Exception
	 */
	public String scoreDhtmlCountByCondExt() throws Exception {
		Map<String, Object> paramMap = this.getRequestParam(request);
		try {
			String totalCount = this.bscResultService.listScoreResultCountExt(paramMap);
			doSuccessInfoResponse(totalCount + ",0");
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	@FunDesc(code="BSC_0024")
	@UseLog
	public String exportScoreByCondExt() throws Exception {
		List<Map<String, Object>> measureList = null;

		Map<String, Object> paramMap = this.getRequestParam(request);
		String show_id = getStringValue(paramMap, "show_id");
		try {
			String projcetName = getStringValue(paramMap, "project_name");
			String month_id = getStringValue(paramMap, "month_id");
			String month_name = "";
			if(null !=month_id && !"".equals(month_id)){
				month_name = month_id.substring(0, 4)+"年"+month_id.substring(4)+"月";
			}

			//是否过滤维度
			String oId = null;
			String objId = getStringValue(paramMap, "obj_id");
			if(null != objId && !"".equals(objId)){
				oId = getStringById(objId);
				paramMap.put("oId", oId);

			}

			//是否过滤时间
			String tId = null;
			String timId = getStringValue(paramMap, "time_id");
			if(null != timId && !"".equals(timId)){
				tId = getStringById(timId);
				paramMap.put("tId", tId);
			}
			//方案所有的指标
			String meaId = null;
			String measureId = paramMap.get("measure_id").toString();
			if(null != measureId && !"".equals(measureId)){
				meaId = getStringById(measureId);
				paramMap.put("meaId", meaId);
				measureList = this.bscResultService.listProjectMeasureByIndexId(paramMap);
			}else{
				measureList = this.bscResultService.listProjectMeasure(paramMap);
			}
			paramMap.put("measureList", measureList);
			//2统计年份 -》  统计年份（单） -》统计维度（多）-》指标（多）
			//1统计维度-》统计维度（单）-》 统计年份（多）-》指标（多）
			List<Map<String, Object>> dataList = null;
			if(show_id.equals("2")){
				dataList = this.bscResultService.listScoreTotalResultByObj(paramMap);
//				dataList = this.bscResultService.listScoreResultByYear(paramMap);
			}else{
//				dataList = this.bscResultService.listScoreTotalResultByObj(paramMap);
				dataList = this.bscResultService.listScoreTotalResultByYear(paramMap);
			}


			ITableTemplate template = new DhtmlTableTemplate();

			String[] mapKey = new String[measureList.size()+2];
			String header = "维度名称,年份,";
			String columnAlign = "center,center,";
			String columnType = "ro,ro,";
			String columnWidth = "150,140,";
			String formatType = "0,0,";
			mapKey[0] = "object_name";
			mapKey[1] = "month_name";
			if(show_id.equals("2")){
				header = "年份,维度名称,";
				columnWidth = "140,150,";
				mapKey[0] = "month_name";
				mapKey[1] = "object_name";
			}
			for (int i = 0; i < measureList.size(); i++) {
				Map<String,Object> map = measureList.get(i);
				mapKey[i+2] = "col_"+i;
				header += getStringValue(map, "mea_definition");
				columnAlign += "center";columnType += "ro";columnWidth += "120";formatType += "2";
				if(i != measureList.size()-1){
					header += ",";columnAlign += ",";columnType += ",";columnWidth += ",";formatType += ",";
				}
			}

			template.setHeader(new String[]{header});
			template.setColumnAlign(columnAlign);
			template.setColumnType(columnType);
			template.setColumnWidth(columnWidth);
			template.setColumnFormatType(formatType);
			template.setDataMapKey(mapKey);
			template.setData(dataList);
			template.setTitle(paramMap.get("title").toString());
			String []titiles = header.split(HEADER_SPLIT);
			String objName = "";
			if(show_id.equals("2")){
				template.setExcelInfoRow(new String[][] {
						{ "方案名称：", projcetName },
						{ "统计年份：", month_name }
//						{ "指标名称：", titiles[1] }

				});
			}else{
				List<Map<String, Object>> objectList  = this.bscResultService.getObectNameByObjId(paramMap);
				if(null !=objectList && objectList.size()>0){
					Map<String, Object> mp = objectList.get(0);
					objName = mp.get("obj_name").toString();
				}
				template.setExcelInfoRow(new String[][] {
						{ "方案名称：", projcetName },
						{ "统计维度：", objName }
//						{ "指标名称：", titiles[1] }

				});
			}

			String webBasePath = ServletActionContext.getServletContext().getRealPath("/");
			String localFileName = webBasePath + Constant.FILE_DOWNLOAD_DIR + this.getCurrentUser().getUser_id()+".xls";
			template.writeToFile(new File(localFileName));
			return "excelDownload";
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	public String exportScoreSubExt() throws Exception {
		Map<String, Object> paramMap = this.getRequestParam(request);
		try {
			String projcetName = getStringValue(paramMap, "project_name");
			String month_id = getStringValue(paramMap, "month_id");
			String month_name = month_id.substring(0, 4)+"年"+month_id.substring(4)+"月";
			String show_id = getStringValue(paramMap, "show_id");
			//方案所有的指标
			List<Map<String, Object>> measureList = this.bscResultService.listSubMeasure(paramMap);
			paramMap.put("measureList", measureList);
			List<Map<String, Object>> dataList = this.bscResultService.listScoreSubResultExt(paramMap);
			ITableTemplate template = new DhtmlTableTemplate();

			String[] mapKey = new String[measureList.size()+1];

			String meaFlag = paramMap.get("title").toString();
			String header = "考核对象,";
			if(MEASURE_FLAG.equals(meaFlag)){
				header = "维度名称,";
			}
			String columnAlign = "left,";
			String columnType = "ro,";
			String columnWidth = "260,";
			String formatType = "0,";
			mapKey[0] = "object_name";
			if(show_id.equals("2")){
				header = "年份,";
				columnWidth = "200,";
				mapKey[0] = "month_name";
			}
			for (int i = 0; i < measureList.size(); i++) {
				Map<String,Object> map = measureList.get(i);
				mapKey[i+1] = "col_"+i;
				header += getStringValue(map, "mea_definition");
				columnAlign += "right";columnType += "ro";columnWidth += "120";formatType += "2";
				if(i != measureList.size()-1){
					header += ",";columnAlign += ",";columnType += ",";columnWidth += ",";formatType += ",";
				}
			}
			template.setHeader(new String[]{header});
			template.setColumnAlign(columnAlign);
			template.setColumnType(columnType);
			template.setColumnWidth(columnWidth);
			template.setColumnFormatType(formatType);
			template.setDataMapKey(mapKey);
			template.setData(dataList);

			template.setTitle(paramMap.get("title").toString());
			template.setExcelInfoRow(new String[][] {
					{ "方案名称：", projcetName },
					{ "月份：", month_name } });

			String webBasePath = ServletActionContext.getServletContext().getRealPath("/");
			String localFileName = webBasePath + Constant.FILE_DOWNLOAD_DIR + this.getCurrentUser().getUser_id()+".xls";
			template.writeToFile(new File(localFileName));
			return "excelDownload";
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	/**
	 * 钻取查询下级指标明细
	 * @return
	 * @throws Exception
	 */
	public String scoreDhtmlSubExt() throws Exception {
		Map<String, Object> paramMap = this.getRequestParam(request);
		try {
			this.insertPageParamToMap(paramMap);//插入分页信息
			String show_id = getStringValue(paramMap, "show_id");
			//方案所有的指标
			List<Map<String, Object>> measureList = this.bscResultService.listSubMeasure(paramMap);
			paramMap.put("measureList", measureList);
			List<Map<String, Object>> dataList = this.bscResultService.listScoreSubResultExt(paramMap);
			ITableTemplate template = new DhtmlTableTemplate();

			String[] mapKey = new String[measureList.size()+1];
			String meaFlag = paramMap.get("title").toString();
			String header = "考核对象,";
			if(MEASURE_FLAG.equals(meaFlag)){
				header = "维度名称,";
			}
			String columnAlign = "left,";
			String columnType = "ro,";
			String columnWidth = "260,";
			String formatType = "0,";
			mapKey[0] = "object_name";
			if(show_id.equals("2")){
				header = "年份,";
				columnWidth = "200,";
				mapKey[0] = "month_name";
			}
			for (int i = 0; i < measureList.size(); i++) {
				Map<String,Object> map = measureList.get(i);
				mapKey[i+1] = "col_"+i;
				header += getStringValue(map, "mea_definition");
				columnAlign += "right";columnType += "ro";columnWidth += "120";formatType += "2";
				if(i != measureList.size()-1){
					header += ",";columnAlign += ",";columnType += ",";columnWidth += ",";formatType += ",";
				}
				paramMap.put("measure_id", getStringValue(map, "measure_id"));
				List<Map<String, Object>> subMeasureList = this.bscResultService.listSubMeasure(paramMap);
				if(subMeasureList.size()>0){
					String param = "project_id=" + getStringValue(paramMap, "project_id") +
							"&month_id=" + getStringValue(paramMap, "month_id") +
							"&measure_id=" + getStringValue(map, "measure_id") +
							"&cycle_type_id=" + getStringValue(paramMap, "cycle_type_id") +
							"&obj_cate_id=" + getStringValue(paramMap, "obj_cate_id") +
							"&show_id=" + getStringValue(paramMap, "show_id") +
							"&obj_id=" + getStringValue(paramMap, "obj_id") +
							"&time_id=" + getStringValue(paramMap, "time_id") +
							"&monthName=" + URLDecoder.decode(getStringValue(paramMap, "monthName"), "utf-8") +
							"&projectName=" + URLDecoder.decode(getStringValue(paramMap, "projectName"), "utf-8");
					template.addHeaderHref(i+1, "bsc_proj_obj_index_score_ext_detail.jsp?"+param);
				}
			}

			template.setHeader(new String[]{header});
			template.setColumnAlign(columnAlign);
			template.setColumnType(columnType);
			template.setColumnWidth(columnWidth);
			template.setColumnFormatType(formatType);
			template.setDataMapKey(mapKey);
			template.setData(dataList);
			template.useSerialNumber(true);
//			template.setUseCheck(true, 0);

			response.setContentType("text/html;charset=utf-8");
			response.getWriter().print(template.getTableString());
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}



	/**
	 * 返回DHtml表格结果数据
	 * @return
	 * 增加地区代码
	 *
	 * 统计年份 -》  统计年份（单） -》统计维度（多）-》指标（多）
	 *
	 * 统计维度-》统计维度（单）-》 统计年份（多）-》指标（多）
	 * @throws Exception
	 */
	@FunDesc(code="BSC_0023")
	@UseLog
	public String getResultDhtmlByCondExt() throws Exception {
		Map<String, Object> paramMap = this.getRequestParam(request);
		String show_id = getStringValue(paramMap, "show_id");
		List<Map<String, Object>> measureList;
		List<Map<String, Object>> dataList;
		try {
			this.insertPageParamToMap(paramMap);//插入分页信息
			//地区代码
			String zId = "";
			String zoneId = getStringValue(paramMap, "zone_id");
			if(null != zoneId && !"".equals(zoneId)){
				zId = getStringById(zoneId);
			}
			paramMap.put("zId", zId);
			//是否过滤维度
			String oId = "";
			String objId = getStringValue(paramMap, "obj_id");
			if(null != objId && !"".equals(objId)){
				oId = getStringById(objId);
			}
			paramMap.put("oId", oId);
			//是否过滤时间
			String tId = "";
			String timId = getStringValue(paramMap, "time_id");
			if(null != timId && !"".equals(timId)){
				tId = getStringById(timId);
			}
			paramMap.put("tId", tId);
			//方案所有的指标  1, 多统计维度；2, 多统计年份
			String meaId = "";
			String measureId = paramMap.get("measure_id").toString();
			if(null != measureId && !"".equals(measureId)){
				meaId = getStringById(measureId);
				paramMap.put("meaId", meaId);
//				measureList = this.bscResultService.getProjectResultMeasureByIndexId(paramMap);
				measureList = this.bscResultService.listProjectMeasureByIndexId(paramMap);
			}else{
				measureList = this.bscResultService.getProjectResultMeasure(paramMap);
//				measureList = this.bscResultService.listProjectMeasure(paramMap);
			}
			paramMap.put("measureList", measureList);

			String ids = this.getStringByList(measureList);
			paramMap.put("ids", ids);
			//增加地区代码： 2统计年份 -》  统计年份（单） -》统计维度（多）-》指标（多）
			//增加地区代码： 1统计维度-》统计维度（单）-》 统计年份（多）-》指标（多）
			if(show_id.equals("1")){
				dataList = this.bscResultService.getResultDhtmlYearByParam(paramMap);
			}else{
				dataList = this.bscResultService.getResultDhtmlOjbectByParam(paramMap);
			}

			ITableTemplate template = new DhtmlTableTemplate();
			String[] mapKey = new String[measureList.size()+3];
			String header = "地区名称,维度名称,年份,";
			String columnAlign = "center,center,center,";
			String columnType = "ro,ro,ro,";
			String columnWidth = "260,150,140,";
			String formatType = "0,0,0,";
			mapKey[0] = "zone_cd_desc";
			mapKey[1] = "object_name";
			mapKey[2] = "month_name";
			if(show_id.equals("2")){
				header = "地区名称,年份,维度名称,";
				columnWidth = "200,140,150,";
				mapKey[0] = "zone_cd_desc";
				mapKey[1] = "month_name";
				mapKey[2] = "object_name";
			}
			for (int i = 0; i < measureList.size(); i++) {
				Map<String,Object> map = measureList.get(i);
				mapKey[i+3] = "col_"+i;
				header += getStringValue(map, "mea_definition");
				columnAlign += "left";columnType += "ro";columnWidth += "120";formatType += "2";
				if(i != measureList.size()-1){
					header += ",";columnAlign += ",";columnType += ",";columnWidth += ",";formatType += ",";
				}
				paramMap.put("measure_id", getStringValue(map, "measure_id"));

				/*List<Map<String, Object>> subMeasureList = this.bscResultService.listSubMeasure(paramMap);
				if(subMeasureList.size()>0){

					String param = "project_id=" + getStringValue(paramMap, "project_id") +
							"&month_id=" + getStringValue(paramMap, "month_id") +
							"&measure_id=" + getStringValue(map, "measure_id") +
							"&ids=" + ids +
							"&cycle_type_id=" + getStringValue(paramMap, "cycle_type_id") +
							"&obj_cate_id=" + getStringValue(paramMap, "obj_cate_id") +
							"&obj_id=" + getStringValue(paramMap, "obj_id").replace(",",".") +
							"&show_id=" + getStringValue(paramMap, "show_id") +
							"&time_id=" + getStringValue(paramMap, "time_id").replace(",",".") +
							"&monthName=" + URLDecoder.decode(getStringValue(paramMap, "monthName"), "utf-8") +
							"&projectName=" + URLDecoder.decode(getStringValue(paramMap, "projectName"), "utf-8");
					template.addHeaderHref(i+3, "bsc_proj_obj_index_score_ext_detail.jsp?"+param);
				}*/
			}
			template.setHeader(new String[]{header});
			template.setColumnAlign(columnAlign);
			template.setColumnType(columnType);
			template.setColumnWidth(columnWidth);
			template.setColumnFormatType(formatType);
			template.setDataMapKey(mapKey);
			template.setData(dataList);
			template.useSerialNumber(true);
//			template.setUseCheck(true, 0);

			response.setContentType("text/html;charset=utf-8");
			response.getWriter().print(template.getTableString());
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;

	}

	/**
	 * 返回DHtml表格结果数据总数
	 * @return
	 * @throws Exception
	 */
	public String getResultDhtmlCountByCondExt() throws Exception {
		Map<String, Object> paramMap = this.getRequestParam(request);
		try {
			String zId = "";
			String zoneId = getStringValue(paramMap, "zone_id");
			if(null != zoneId && !"".equals(zoneId)){
				zId = getStringById(zoneId);
			}
			paramMap.put("zId", zId);
			//是否过滤维度
			String oId = "";
			String objId = getStringValue(paramMap, "obj_id");
			if(null != objId && !"".equals(objId)){
				oId = getStringById(objId);
			}
			paramMap.put("oId", oId);
			//是否过滤时间
			String tId = "";
			String timId = getStringValue(paramMap, "time_id");
			if(null != timId && !"".equals(timId)){
				tId = getStringById(timId);
			}
			paramMap.put("tId", tId);
			String totalCount = this.bscResultService.getResultDhtmlCountByCondExt(paramMap);
			doSuccessInfoResponse(totalCount + ",0");
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	@FunDesc(code="BSC_0024")
	@UseLog
	public String exportResultDhtmlByCondExt() throws Exception {
		List<Map<String, Object>> measureList = null;
		Map<String, Object> paramMap = this.getRequestParam(request);
		String show_id = getStringValue(paramMap, "show_id");
		String month_name = "";
		try {
			String projcetName = getStringValue(paramMap, "project_name");
			String month_id = getStringValue(paramMap, "month_id");
			if(month_id !=null && !"".equals(month_id)){
				 month_name = month_id.substring(0, 4)+"年";
			}

			//地区代码
			String zId = "";
			String zoneId = getStringValue(paramMap, "zone_id");
			if(null != zoneId && !"".equals(zoneId)){
				zId = getStringById(zoneId);
			}
			paramMap.put("zId", zId);
			List<Map<String, Object>>  zoneList = this.bscResultService.getZoneNameByZoneID(paramMap);
			String zoneNm = getStringById(zoneList);

			//是否过滤维度
			String oId = "";
			String objId = getStringValue(paramMap, "obj_id");
			if(null != objId && !"".equals(objId)){
				oId = getStringById(objId);
			}
			paramMap.put("oId", oId);
			//是否过滤时间
			String tId = "";
			String timId = getStringValue(paramMap, "time_id");
			if(null != timId && !"".equals(timId)){
				tId = getStringById(timId);

			}
			paramMap.put("tId", tId);
			//方案所有的指标
			String meaId = null;
			String measureId = paramMap.get("measure_id").toString();
			if(null != measureId && !"".equals(measureId)){
				meaId = getStringById(measureId);
				paramMap.put("meaId", meaId);
				measureList = this.bscResultService.listProjectMeasureByIndexId(paramMap);
			}else{
				measureList = this.bscResultService.getProjectResultMeasure(paramMap);
			}
			paramMap.put("measureList", measureList);

			String ids = this.getStringByList(measureList);
			paramMap.put("ids", ids);
			List<Map<String, Object>> dataList = null;
			//增加地区代码： 2统计年份 -》  统计年份（单） -》统计维度（多）-》指标（多）
			//增加地区代码： 1统计维度-》统计维度（单）-》 统计年份（多）-》指标（多）
			if(SHOW_FLAG.equals(show_id)){
				dataList = this.bscResultService.getResultDhtmlYearByParamInfo(paramMap);
			}else{
				dataList = this.bscResultService.getResultDhtmlOjbectByParamInfo(paramMap);
			}
			ITableTemplate template = new DhtmlTableTemplate();
			String[] mapKey = new String[measureList.size()+3];
			String header = "地区名称,维度名称,年份,";
			String columnAlign = "center,center,center,";
			String columnType = "ro,ro,ro,";
			String columnWidth = "260,150,140,";
			String formatType = "0,0,0,";
			mapKey[0] = "zone_cd_desc";
			mapKey[1] = "object_name";
			mapKey[2] = "month_name";
			if(show_id.equals("2")){
				header = "地区名称,年份,维度名称,";
				columnWidth = "200,140,150,";
				mapKey[0] = "zone_cd_desc";
				mapKey[1] = "month_name";
				mapKey[2] = "object_name";
			}
			for (int i = 0; i < measureList.size(); i++) {
				Map<String,Object> map = measureList.get(i);
				mapKey[i+3] = "col_"+i;
				header += getStringValue(map, "mea_definition");
				columnAlign += "center";columnType += "ro";columnWidth += "120";formatType += "2";
				if(i != measureList.size()-1){
					header += ",";columnAlign += ",";columnType += ",";columnWidth += ",";formatType += ",";
				}
			}

			template.setHeader(new String[]{header});
			template.setColumnAlign(columnAlign);
			template.setColumnType(columnType);
			template.setColumnWidth(columnWidth);
			template.setColumnFormatType(formatType);
			template.setDataMapKey(mapKey);
			template.setData(dataList);

			template.setTitle(paramMap.get("title").toString());
			String []titiles = header.split(HEADER_SPLIT);

			/**
			 * 1统计维度-》统计维度（单）-》 统计年份（多）-》指标（多）
			 * 	2统计年份 -》  统计年份（单） -》统计维度（多）-》指标（多）
			 * 			showID
			 * 			年份单选monthSelector1   多monthSelector2（monthBox2）
			 * 			统计维度单选 objSelector2 （objBox2）      多objSelector1
			 */

			String objName = "";
			if(show_id.equals("2")){
				template.setExcelInfoRow(new String[][] {
						{ "方案名称：", projcetName },
						{ "统计年份：", month_name }
				});
			}else{
				List<Map<String, Object>> objectList  = this.bscResultService.getObectNameByDimId(paramMap);
				if(null !=objectList && objectList.size()>0){
					Map<String, Object> mp = objectList.get(0);
					objName = mp.get("dim_cd_desc").toString();
				}
				template.setExcelInfoRow(new String[][] {
						{ "方案名称：", projcetName },
						{ "统计维度：", objName }
				});
			}
			String webBasePath = ServletActionContext.getServletContext().getRealPath("/");

			if(measureList.size() < 250){
				String localFileName = webBasePath + Constant.FILE_DOWNLOAD_DIR + this.getCurrentUser().getUser_id()+".xls";
				template.writeToFile(new File(localFileName));
			}else{
				String exportHeader = "";
				if(show_id.equals("2")){
					exportHeader = "方案名称:"+projcetName+",统计年份:"+month_name;
				}else{
					exportHeader = "方案名称:"+projcetName+",统计维度:"+objName;
				}
				String [] titles  = header.split(",");			
				List<ExcelField>  excelFields = getExcelFields(show_id,titles);

				String title= projcetName;
				SXSSFWorkbook wb = new SXSSFWorkbook(ROW_ACCESS_WINDOW_SIZE);
				ExcelUtil excelUtil = new ExcelUtil(wb,excelFields,title,exportHeader);
				int startNum = 0;
				excelUtil.exportXLSX(wb,dataList,startNum);
				String fileName = projcetName+".xlsx";
				response.reset();

				response.setContentType("application/x-download");
				response.setCharacterEncoding("UTF-8");
				fileName = new String(fileName.getBytes(),"iso-8859-1");
				response.setHeader("Content-Disposition", "attachment; filename=" + fileName);
				OutputStream out = response.getOutputStream();
				try {				
					wb.write(out);
				} catch (Exception e) {
					e.printStackTrace();
				} finally {				
					if (out != null) {
						try {
							out.flush();
							out.close();
						} catch (Exception e) {
							e.printStackTrace();
						}
					}
					wb.dispose();
				}
			}
			return "excelDownload";
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	
    private List<ExcelField> getExcelFields(String showID,String [] titles) {   			
        List<ExcelField> excelFields = new ArrayList();          
        if(SHOW_FLAG.equals(showID)){
        	   excelFields.add(new ExcelField("地区名称", "zone_cd_desc"));
               excelFields.add(new ExcelField("维度名称", "object_name"));
               excelFields.add(new ExcelField("年份", "month_name"));
        }else{
        	  excelFields.add(new ExcelField("地区名称", "zone_cd_desc")); 
              excelFields.add(new ExcelField("年份", "month_name"));
              excelFields.add(new ExcelField("维度名称", "object_name"));
        }       
        int j = 3;
        String k = "";
        for(int i=3;i<titles.length;i++){
        	 j = i-3;
        	 k = String.valueOf(j);
        	 excelFields.add(new ExcelField(titles[i], "col_"+k));
        }   
        return excelFields;
    }

	public void setBscResultService(IBscResultService bscResultService) {
		this.bscResultService = bscResultService;
	}

	public ISelectorService getSelectorService() {
		return selectorService;
	}

	public void setSelectorService(ISelectorService selectorService) {
		this.selectorService = selectorService;
	}
	
	
	private final static String HEADER_SPLIT = "维度名称,";
	
	
	private final static String  MEASURE_FLAG ="1";
	
	private final static String  SHOW_FLAG ="1";


	
}
