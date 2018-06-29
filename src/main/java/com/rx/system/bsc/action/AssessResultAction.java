package com.rx.system.bsc.action;

import java.net.URLDecoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.rx.log.annotation.FunDesc;
import com.rx.log.annotation.UseLog;
import com.rx.system.base.BaseDispatchAction;
import com.rx.system.bsc.service.IAssessResultService;
import com.rx.system.util.GlobalUtil;
import com.rx.util.CommonUtil;

public class AssessResultAction extends BaseDispatchAction {

	private static final long serialVersionUID = 1L;
	
	private IAssessResultService assessResultService = null;
	// 存放Action和Service方法映射
	private static Map<String, Object> serviceMethodMapping = new HashMap<String, Object>();
	
	static {
		serviceMethodMapping.put("listProject", "listProject");
		serviceMethodMapping.put("modifyAssessRank", "modifyAssessRank");
		
	}
	
	/**
	 * 增删改查通用方法
	 * 
	 * @throws Exception
	 */
	public String common() throws Exception {
		Map<String, Object> paramMap = this.getRequestParam(request);
		String methodName = GlobalUtil.getStringValue(paramMap, "method");

		String serviceMethod = GlobalUtil.getStringValue(serviceMethodMapping,methodName);
		if (GlobalUtil.trimToNull(serviceMethod) != null) {
			this.doResponse(this.assessResultService, serviceMethod,new Object[] { paramMap }, null);
		}

		return null;
	}
	
	/**
	 * 执行系统评级
	 * @return
	 * @throws Exception
	 */
	@FunDesc(code="BSC_0001")
	@UseLog
	public String executeAssess() {
		return null;
	}
	
	/**
	 * 查询评级结果
	 * @return
	 * @throws Exception
	 */
	@FunDesc(code="BSC_0002")
	@UseLog
	public String listResults() throws Exception{
		Map<String, Object> paramMap = this.getRequestParam(request);
		
		this.insertPageParamToMap(paramMap);//插入分页信息
		
		if(paramMap.keySet().contains("results_search") && null != paramMap.get("results_search") && !"".equals((String)paramMap.get("results_search"))){
			String newStr = URLDecoder.decode((String)paramMap.get("results_search"),"utf-8");
			paramMap.put("results_search", newStr);
		}
		
		StringBuffer sb = new StringBuffer();
		sb.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
		sb.append("<rows>");
		try {
			List<Map<String,Object>> list = this.assessResultService.listResults(paramMap);
			for(int i=0;i<list.size();i++){
				Map<String,Object> row = list.get(i);
				String month_id = getStringValue(row,"MONTH_ID");
				String project_id = getStringValue(row,"PROJECT_ID");
				String object_id = getStringValue(row,"OBJECT_ID");
				sb.append("<row id=\""+object_id+":"+month_id+":"+project_id+"\">");
				sb.append("<cell>" + (i+1) + "</cell>");
				sb.append("<cell>["+object_id+"]"+getStringValue(row,"OBJECT_NAME")+"</cell>");
				sb.append("<cell>"+CommonUtil.format(getStringValue(row, "SCORE"), "#,##0.00")+"</cell>");
				sb.append("<cell>"+getStringValue(row,"SYS_PROJ_RANK_ID")+"</cell>");
				sb.append("<cell>"+getStringValue(row,"ADJ_PROJ_RANK_ID")+"</cell>");
				sb.append("<cell>"+getStringValue(row,"ADJ_REASON")+"</cell>");
				
				sb.append("</row>");
			}
		} catch (Exception e) {
			e.printStackTrace();
			sb.append("<row id=\"err\"><cell>" + e.getMessage() + "</cell></row>");
		}
		sb.append("</rows>");
		
		
		response.setContentType("text/html;charset=utf-8");
		response.getWriter().print(sb.toString());
		return null;
	}
	
	/**
	 * 对象结果列表分页中统计总数
	 * */
	public String listResultsCount() throws Exception{
		Map<String, Object> paramMap = this.getRequestParam(request);
		if(paramMap.keySet().contains("results_search") && null != paramMap.get("results_search") && !"".equals((String)paramMap.get("results_search"))){
			String newStr = URLDecoder.decode((String)paramMap.get("results_search"),"utf-8");
			paramMap.put("results_search", newStr);
		}
		int count = this.assessResultService.listResultsCount(paramMap);
		super.doSuccessInfoResponse(String.valueOf(count));
		return null;
	}
	/**
	 * 等级查询
	 * @return
	 * @throws Exception
	 */
	@FunDesc(code="BSC_0003")
	public String queryRsltStat() throws Exception{
		Map<String,Object> map = this.getRequestParam(request);
		
		List<Map<String,Object>> dataList = this.assessResultService.queryRsltStat(map);
		doJSONResponse(dataList);
		return null;
	}
	
	public void setAssessResultService(IAssessResultService assessResultService) {
		this.assessResultService = assessResultService;
	}
	
	
}
