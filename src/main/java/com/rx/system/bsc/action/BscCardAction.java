package com.rx.system.bsc.action;

import java.io.File;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.List;
import java.util.Map;

import org.apache.struts2.ServletActionContext;

import com.rx.framework.jdbc.JdbcManager;
import com.rx.log.annotation.FunDesc;
import com.rx.log.annotation.UseLog;
import com.rx.system.base.BaseDispatchAction;
import com.rx.system.bsc.service.IBscCardService;
import com.rx.system.constant.Constant;
import com.rx.system.service.ISelectorService;
import com.rx.system.table.DhtmlTableTemplate;
import com.rx.system.table.ITableTemplate;
import com.rx.util.tree.TreeStore;

/**
 * 平衡计分卡查询
 * @author chenxd
 *
 */
@SuppressWarnings("serial")
public class BscCardAction extends BaseDispatchAction {
	
	private IBscCardService bscCardService = null;
	private ISelectorService selectorService = null;
	private JdbcManager jdbcManager;
	
	public JdbcManager getJdbcManager() {
		return jdbcManager;
	}

	public void setJdbcManager(JdbcManager jdbcManager) {
		this.jdbcManager = jdbcManager;
	}
	/**
	 * 查询方法
	 * @return
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	@FunDesc(code="BSC_0004")
	@UseLog
	public String query() throws Exception {
		
		try {
			Map<String, Object> paramMap = this.getRequestParam(request);
			paramMap.put("type", "query");
			List<Map<String, Object>> dataList = this.bscCardService.queryCardResult(paramMap);
			
			ITableTemplate template = this.getDetailDhtmlConfig();
			template.setData(dataList);
			String objectID = getStringValue(paramMap, "object_id");
			String monthID = getStringValue(paramMap, "month_id");
			template.addClickFun(5, "showPointFormulaDetail('"+monthID+"','"+objectID+"','[@project_id]','[@measure_id]')");
			
			response.setContentType("text/html;charset=utf-8");
			response.getWriter().print(template.getTableString());
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	@FunDesc(code="BSC_0005")
	@UseLog
	public String queryInfo() throws Exception {
		try {
			Map<String, Object> paramMap = this.getRequestParam(request);
			doJSONResponse(this.bscCardService.queryInfo(paramMap));
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	/**
	 * 导出方法
	 * @return
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	@FunDesc(code="BSC_0006")
	@UseLog
	public String export() throws Exception {
		Connection conn = null;
		try {
			conn = this.jdbcManager.getConnection();
			Map<String, Object> paramMap = this.getRequestParam(request);
			//========获得方案名和月份名==Start==========//
			PreparedStatement pstm = conn.prepareStatement("select" +
														   "	project_name 	" +
														   "from 					" +
														   "	bsc_project_h 	" +
														   "where project_id = '"+paramMap.get("project_id")+"'" +
														   "and   year_id = '"+paramMap.get("year_id")+"'" +
														   "and	  ? between begin_date and end_date");
			pstm.setDate(1, (java.sql.Date)paramMap.get("query_date"));
			ResultSet rs = pstm.executeQuery();
			String projcetName = "";
			if(null != rs && rs.next()){
				projcetName = rs.getString(1);
			}
			String month_id = getStringValue(paramMap, "month_id");
			String month_name = month_id.substring(0, 4)+"年"+month_id.substring(4)+"月";
			//========获得方案名和月份名==End==========//
			paramMap.put("type", "export");
			List<Map<String, Object>> dataList = this.bscCardService.queryCardResult(paramMap);
			
			ITableTemplate template = this.getDetailDhtmlConfig();
			template.setData(dataList);
			
			template.setTitle("计分卡结果明细("+("BM".equals(getStringValue(paramMap, "objectID")) ? "职能部门" : "镇街")+")"); 
			template.setExcelInfoRow(new String[][] {
					{ "方案名称：", projcetName },
					{ "月份：",month_name },
					{ "加权总得分",getStringValue(paramMap, "full_score")}});
			
			String webBasePath = ServletActionContext.getServletContext().getRealPath("/");
			String localFileName = webBasePath + Constant.FILE_DOWNLOAD_DIR + this.getCurrentUser().getUser_id()+".xls";
			template.writeToFile(new File(localFileName));
		} catch (Exception e) {
			e.printStackTrace();
		}finally{
			if(null != conn){
				conn.close();
			}
		}
		return "excelDownload";
	}
	
	/**
	 * 查询公式明细
	 * @return
	 * @throws Exception
	 */
	@FunDesc(code="BSC_0007")
	@UseLog
	public String formulaDetail() throws Exception {
		Map<String, Object> paramMap = getRequestParam(request);
		String type = getStringValue(paramMap, "type");
		try {
			
			String operType = getStringValue(paramMap, "operType");
			String preMeasureIDs = getStringValue(paramMap, "preMeasureIDs");
			
			if("score".equals(getStringValue(paramMap, "type"))) {
				request.setAttribute("preMeasureIDs", "formula");
				paramMap.put("scoreMeasure", getStringValue(paramMap, "measure_id"));
			}else if("back".equals(operType)) {
				
				String[] pArray = preMeasureIDs.split(";");
				
				String mid = pArray[pArray.length-2];
				if("formula".equals(mid)) {
					paramMap.put("type", "score");
					type = "score";
					request.setAttribute("preMeasureIDs", "formula");
					paramMap.put("measure_id", getStringValue(paramMap, "scoreMeasure"));
				}else {
					
					preMeasureIDs = preMeasureIDs.substring(0, preMeasureIDs.length() - pArray[pArray.length - 1].length());
					if(preMeasureIDs.endsWith(";"))
						preMeasureIDs = preMeasureIDs.substring(0, preMeasureIDs.length()-1);
					
					request.setAttribute("preMeasureIDs", preMeasureIDs);
					paramMap.put("measure_id", mid);
				}
			}else {
				preMeasureIDs += ";"+getStringValue(paramMap, "measure_id");
				request.setAttribute("preMeasureIDs", preMeasureIDs);
			}
			
			Map<String, Object> infoMap = this.bscCardService.getFormulaDetail(paramMap);
			
			request.setAttribute("infoMap", infoMap);
			request.setAttribute("paramMap", paramMap);
			request.setAttribute("type", type);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return "detail";
	}
	
	/**
	 * 查询对象状态明细
	 * @return
	 * @throws Exception
	 */
	@FunDesc(code="BSC_0009")
	@UseLog
	public String StrategyDetail() throws Exception {
		
		try {
			Map<String, Object> paramMap = this.getRequestParam(request);
			insertPageParamToMap(paramMap);
			
			paramMap.put("type", "query");
			List<Map<String, Object>> dataList = this.bscCardService.queryOrgStatusDetail(paramMap);
			ITableTemplate template = this.getOrgStatusTemplate("query");
			template.setData(dataList);
			
			response.setContentType("text/html;charset=utf-8");
			response.getWriter().print(template.getTableString());
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	/**
	 * 查询对象状态明细
	 * @return
	 * @throws Exception
	 */
	@FunDesc(code="BSC_0010")
	@UseLog
	public String StrategyDetailObjList() throws Exception {
		
		try {
			Map<String, Object> paramMap = this.getRequestParam(request);
			
			List<Map<String, Object>> dataList = this.bscCardService.queryOrgStatusDetailObjList(paramMap);
			doJSONResponse(dataList);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	/**
	 * 查询对象状态明细
	 * @return
	 * @throws Exception
	 */
	public String StrategyDetailCount() throws Exception {
		
		try {
			Map<String, Object> paramMap = this.getRequestParam(request);
			String totalCount = this.bscCardService.queryOrgStatusDetailCount(paramMap);
			doSuccessInfoResponse(totalCount);
		} catch (Exception e) {
			e.printStackTrace();
			doFailureInfoResponse(e.getMessage());
		}
		return null;
	}
	
	private ITableTemplate getOrgStatusTemplate(String type) throws Exception {
		ITableTemplate template = new DhtmlTableTemplate();
		template.setHeader(new String[] { 
				"考核对象,战略重点,衡量指标,指标状态,目标值,实际完成值,得分"
		});
		template.setColumnAlign("center,center,center,center,right,right,right");
		template.setColumnType("ro,ro,ro,img,ro,ro,ro,ro");
		template.setColumnWidth("180,180,180,80,140,140,140");
		template.setColumnFormatType("0,0,0,0,5,2,2,1");
		template.setDataMapKey(new String[]{"object_name","strategy_name","measure_name","mea_rank_id","tgt_value","act_value","avg_score"});
		template.useSerialNumber(true);
		
		return template;
	}
	
	private String getNoDataRecord(String width) {
		StringBuffer sb = new StringBuffer();
		sb.append("<?xml version=\"1.0\" encoding=\"utf-8\"?><rows><head>");
		sb.append("<column width=\""+width+"\" type=\"ro\" align=\"center\"><![CDATA[没有数据!]]></column>");
		sb.append("</head></rows>");
		return sb.toString();
	}
	
	private ITableTemplate getStrategyStatusTemplate(Map<String, Object> paramMap) throws Exception {
		List<Map<String, Object>> objList = this.bscCardService.queryOrgList(paramMap);
		ITableTemplate template = new DhtmlTableTemplate();
		String columnAlign = "center,center,center,center,center";
		String columnType = "ro,ro,img,ro,img";
		String columnWidth = "90,180,40,180,40";
		String format = "0,0,5,0,5";
		String[] dataKeys = new String[objList.size()];
		String header = "考核维度,绩效重点,状态,考核指标,状态";
		String attrachHeader = "#rspan,#rspan,#rspan,#rspan,#rspan";
		for (int i = 0 ; i < objList.size(); i++) {
			Map<String, Object> map = objList.get(i);
			columnAlign += ",center";
			columnType += ",img";
			format += ",5";
			dataKeys[i] = getStringValue(map, "object_id");
			attrachHeader += ","+getStringValue(map, "object_name");
			if(i == 0){
				header += ",考核对象";
			}else {
				header += ",#cspan";
			}
			columnWidth += ",80";
		}
		
		template.setHeader(new String[] {header,attrachHeader});
		template.setColumnAlign(columnAlign);
		template.setColumnType(columnType);
		template.setColumnWidth(columnWidth);
		template.setColumnFormatType(format);
		template.setDataMapKey(dataKeys);
		
		template.setGroupFields("measure_id,mea_rank_id");
		template.setLeftTreeShowType(ITableTemplate.LEFT_SHOW_TYPE_TABLE);
		template.isFilterBlank(false);
		template.useSerialNumber(true);
		return template;
	}
	
	
	/**
	 * 获取查询配置模板
	 * @return
	 */
	private ITableTemplate getDetailDhtmlConfig() throws Exception{
		ITableTemplate template = new DhtmlTableTemplate();
		template.setHeader(new String[] { "考核维度,绩效重点,状态,考核指标,状态,指标定义,目标值,实际值,指标权重(%),得分" });
		template.setColumnAlign("center,center,center,center,center,center,right,right,right,right");
		template.setColumnType("ro,ro,img,ro,img,ro,ro,ro,ro,ro");
		template.setColumnWidth("90,180,40,180,40,180,90,120,120,80");
		template.setColumnFormatType("0,0,5,0,5,0,2,2,2,2");
		template.setDataMapKey(new String[]{"mea_definition","target_amount","complete_value","rate","score"});
		template.setGroupFields("measure_id,mea_rank_id");
		template.setLeftTreeShowType(ITableTemplate.LEFT_SHOW_TYPE_TABLE);
		template.isFilterBlank(false);
		template.useSerialNumber(true);
		return template;
	}
	
	private void addMeasureToStore(TreeStore store, List<Map<String, Object>> dataList, String type) throws Exception{
			
	}
	
	public void setBscCardService(IBscCardService bscCardService) {
		this.bscCardService = bscCardService;
	}

	public ISelectorService getSelectorService() {
		return selectorService;
	}

	public void setSelectorService(ISelectorService selectorService) {
		this.selectorService = selectorService;
	}
	
	
}
