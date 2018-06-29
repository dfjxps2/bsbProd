package com.rx.system.bsc.action;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.rx.log.annotation.FunDesc;
import com.rx.log.annotation.UseLog;
import com.rx.system.base.BaseDispatchAction;
import com.rx.system.bsc.service.IMeasureAnalysisService;

/**
 * 
 * @author zzm
 *
 */
@SuppressWarnings("unchecked")
public class MeasureAnalysisAjax extends BaseDispatchAction {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private IMeasureAnalysisService measureAnalysisService;
	
	public String listHeader() throws Exception {
		
		String bank_org_id = request.getParameter("bank_org_id");
		Map<String, Object> results = new HashMap<String, Object>();
		
		String  header = "维度,战略目标,#cspan";
		String attachHeader = "#rspan,编号,名称";
		String initWidths = "150,120,120";
		String colAlign = "center,center,left";
		String colTypes = "ro,ro,ro";
		
		Map<String, String> paramsMap = new HashMap<String, String>();
		paramsMap.put("bankOrgId", bank_org_id);
		
		List headerList = new ArrayList();
		try {
			headerList = measureAnalysisService.listHeader(paramsMap);
			
			for (int i = 0; i < headerList.size(); i++) {
				Map map = (Map)headerList.get(i);
				header = header + ","+map.get("BANK_ORG_NAME");
				attachHeader =attachHeader + ",#rspan";
				initWidths =initWidths + ",100";
				colAlign =colAlign + ",center";
				colTypes =colTypes + ",img";
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

		System.out.println(colAlign);
		results.put("header", header);
		results.put("attachHeader", attachHeader);
		results.put("initWidths", initWidths);
		results.put("colAlign", colAlign);
		results.put("colTypes", colTypes);
		results.put("success", true);
		
		doJSONResponse(results);
		
		return null;
	}

	@FunDesc(code="BSC_0040")
	@UseLog
	public String listData() throws Exception {
		response.setContentType("text/html;charset=UTF-8");
		
		String bank_org_id = request.getParameter("bank_org_id");
		String dim_id = request.getParameter("dim_id");
		Map<String, String> paramsMap = new HashMap<String, String>();
		paramsMap.put("bankOrgId", bank_org_id);
		paramsMap.put("dimId", dim_id);
		
		StringBuffer sb=new StringBuffer();
		sb.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
		sb.append("<rows>");
		try{
			List bankList = measureAnalysisService.listHeader(paramsMap);
			
			List list = (List)measureAnalysisService.listData(paramsMap);
			
			for(int i=0;i<list.size();i++){
				Map<String, Object> row = (Map)list.get(i) ;
				String dimId = (String)row.get("DIM_ID");
				String parentDimId = row.get("PARENT_DIM_ID").toString();
				String dimName = row.get("DIM_NAME").toString();
				paramsMap.put("dimId", dimId);
				List subList = measureAnalysisService.listSubData(paramsMap);
				
				for(int j=0;j<subList.size();j++){
					Map map = (Map)subList.get(j) ;
					if(j==0){
						sb.append("<row id=\""+dimId+","+parentDimId+"\">");
						sb.append("<cell rowspan=\""+subList.size()+"\">"+dimName+"</cell>");
						sb.append("<cell>"+getStringValue(map,"DIM_ID")+"</cell>");
						sb.append("<cell>"+getStringValue(map,"DIM_NAME")+"</cell>");
						for (int k = 0; k < bankList.size(); k++) {
							sb.append("<cell>../../public/images/icons/add.gif^ssss</cell>");
						}
						sb.append("</row>") ;
					}else{
						sb.append("<row id=\""+getStringValue(map,"DIM_ID")+","+getStringValue(map,"PARENT_DIM_ID")+"\">");
						sb.append("<cell></cell>");
						sb.append("<cell>"+getStringValue(map,"DIM_ID")+"</cell>");
						sb.append("<cell>"+getStringValue(map,"DIM_NAME")+"</cell>");
						for (int k = 0; k < bankList.size(); k++) {
							sb.append("<cell>../../public/images/icons/add.gif^ssss</cell>");
						}
						sb.append("</row>") ;
					}
				}
			}
		}catch(Exception ex){
			ex.printStackTrace() ;
			sb.append("<row id=\"err\"><cell>"+ex.getMessage()+"</cell></row>");
		}
		sb.append("</rows>");
		
		response.getOutputStream().print(sb.toString());
		return null;
	}
	
	@SuppressWarnings("unused")
	public String listView() throws Exception{
		
		String bank_org_id = request.getParameter("bank_org_id");
		
		Map<String, Object> result = new HashMap<String, Object>();
		Map<String, String> paramsMap = new HashMap<String, String>();
		paramsMap.put("bankOrgId", "8888");
		try {
			List list = (List)measureAnalysisService.listView(paramsMap);
			
			request.setAttribute("dataList", list);
			doSuccessInfoResponse("成功");
		} catch (RuntimeException e) {
			doFailureInfoResponse("查询失败！");
			e.printStackTrace();
		}

		return "Success";
	}
	
	public void setMeasureAnalysisService(
			IMeasureAnalysisService measureAnalysisService) {
		this.measureAnalysisService = measureAnalysisService;
	}
	
}
