package com.rx.system.bsc.action;

import java.net.URLDecoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import com.rx.log.annotation.FunDesc;
import com.rx.log.annotation.UseLog;
import com.rx.system.base.BaseDispatchAction;
import com.rx.system.bsc.service.IScoreWeightService;
import com.rx.system.table.DhtmlTableTemplate;
import com.rx.system.table.ITableTemplate;
import com.rx.system.util.GlobalUtil;
import com.rx.util.CommonUtil;
import com.rx.util.XML;
/**
 * 权重维护action
 * @Author: mabo
 * @Date: Jul 9, 2013
 */
public class ScoreWeightAction extends BaseDispatchAction {

	private static final long serialVersionUID = 1L;
	
	private IScoreWeightService scoreWeightService = null;

	public void setScoreWeightService(IScoreWeightService scoreWeightService) {
		this.scoreWeightService = scoreWeightService;
	}
	
	//方案查询
	public void queryProject() throws Exception{
		Map<String,Object> map = this.getRequestParam(request);
		
		try {
			List<Map<String,Object>> list = this.scoreWeightService.queryProject(map);
			doJSONResponse(GlobalUtil.lowercaseListMapKey(list));
		} catch (RuntimeException e) {
			System.out.println("方案查询错误");
			e.printStackTrace();
		}
	}
	
	//对象查询
	public void queryObject() throws Exception{
		Map<String,Object> map = this.getRequestParam(request);
		
		try {
			insertPageParamToMap(map);
			List<Map<String,Object>> list = this.scoreWeightService.queryObject(map);
			setTotalCountToRequest(scoreWeightService.getTotalNum());
			doJSONResponse(GlobalUtil.lowercaseListMapKey(list));
		} catch (RuntimeException e) {
			System.out.println("对象查询错误");
			e.printStackTrace();
		}
	}
	
	//指标查询
	public void queryMeasure() throws Exception{
		
		Map<String,Object> map = this.getRequestParam(request);
		
		if(map.keySet().contains("measure_search")){
			String newStr = URLDecoder.decode((String)map.get("measure_search"),"utf-8");
			map.put("measure_search", newStr);
		}
		
		StringBuffer sb = new StringBuffer();
		sb.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
		sb.append("<rows>");
		
		try {
			List<Map<String,Object>> list = this.scoreWeightService.queryMeasure(map);
			for(int i=0;i<list.size();i++){
				Map<String,Object> row = (Map<String,Object>)list.get(i);
				String measureId = getStringValue(row,"MEASURE_ID");
				String projectId = getStringValue(row,"PROJECT_ID");
				String objectId = getStringValue(row,"OBJECT_ID");
				sb.append("<row id=\""+measureId+projectId+objectId+"\">");
				sb.append("<cell>" + (i+1) + "</cell>");
				sb.append("<cell>"+measureId+"</cell>");
				sb.append("<cell>"+getStringValue(row,"MEA_DEFINITION")+"</cell>");
				sb.append("<cell>"+CommonUtil.format(getStringValue(row, "DFT_SCR_WGHT_RATE"), "#,##0.00")+"</cell>");
				sb.append("<cell>"+CommonUtil.format(getStringValue(row, "SCORE_WEIGHT_RATE"), "#,##0.00")+"</cell>");
				sb.append("<cell>"+CommonUtil.format(getStringValue(row, "SCORE_TOTAL"), "#,##0.00")+"</cell>");

				sb.append("</row>");
			}
		} catch (Exception e) {
			System.out.println("指标查询错误+xml生成错误");
			e.printStackTrace();
			sb.append("<row id=\"err\"><cell>" + e.getMessage() + "</cell></row>");
		}
		sb.append("</rows>");
		
		response.setContentType("text/html;charset=utf-8");
		response.getWriter().print(sb.toString());
	}
	
	//保存新权重
	@FunDesc(code="BSC_0065")
	@UseLog
	public void scoreWeightModify() throws Exception{
		Map<String,Object> map = this.getRequestParam(request);		
		String newStr = URLDecoder.decode((String)map.get("measure_search"),"utf-8");
		map.put("measure_search", newStr);
		
		String gridXml = (String)map.get("gridXml");
		String object_id = (String)map.get("object_id");
		String project_id = (String)map.get("project_id");
		
		Map<String,Object> paramMap = new HashMap<String,Object>();
		paramMap.put("object_id", object_id);
		paramMap.put("project_id", project_id);
		
		try {
			List<Map<String,Object>> list = this.scoreWeightService.queryMeasure(map);
			
			Node root = XML.builde(gridXml);
			NodeList rowList = XML.findNodeList(root, "row");
			for(int i=0;i<rowList.getLength();i++){
				Node node = rowList.item(i);
				NodeList nodeList = XML.findNodeList(node, "cell");
				String measure_id = XML.getNodeText(nodeList.item(1));
				double newScore = Double.parseDouble(XML.getNodeText(nodeList.item(4)));
				
				if(newScore != CommonUtil.getDoubleValue(getStringValue(list.get(i),"SCORE_WEIGHT_RATE"))){
					paramMap.put("measure_id", measure_id);
					paramMap.put("score_weight_rate", newScore);
					this.scoreWeightService.scoreWeightModify(paramMap);
				}else{
					continue;
				}
			}
		} catch (Exception e) {
			System.out.println("保存出现错误");
			e.printStackTrace();
		}
		
	}
	
	//参数查询
	@FunDesc(code="BSC_0066")
	public void queryParam() throws Exception{
		
		Map<String,Object> map = this.getRequestParam(request);
		
		if(map.keySet().contains("param_search")){
			String newStr = URLDecoder.decode((String)map.get("param_search"),"utf-8");
			map.put("param_search", newStr);
		}
		
		try {
			List<Map<String,Object>> dataList = this.scoreWeightService.queryParam(map);
			ITableTemplate tableTemplate = this.getDetailDhtmlConfig();
			tableTemplate.setData(dataList);
			tableTemplate.useSerialNumber(true);
			
			response.setContentType("text/html;charset=utf-8");
			response.getWriter().print(tableTemplate.getTableString());
		} catch (RuntimeException e) {
			e.printStackTrace();
		}
	}
	
	//修改参数值
	@FunDesc(code="BSC_0067")
	@UseLog
	public void modifyParam() throws Exception{
		Map<String,Object> map = this.getRequestParam(request);		
		
		String newStr = URLDecoder.decode(URLDecoder.decode((String)map.get("param_search"),"utf-8"),"utf-8");
		map.put("param_search", newStr);
		
		String gridXml = (String)map.get("param_grid_xml");
		String object_id = (String)map.get("object_id");
		String project_id = (String)map.get("project_id");
		
		Map<String,Object> paramMap = new HashMap<String,Object>();
		paramMap.put("object_id", object_id);
		paramMap.put("project_id", project_id);
		
		try {
			List<Map<String,Object>> list = this.scoreWeightService.queryParam(map);
			
			Node root = XML.builde(gridXml);
			NodeList rowList = XML.findNodeList(root, "row");
			for(int i=0;i<rowList.getLength();i++){
				Node node = rowList.item(i);
				NodeList nodeList = XML.findNodeList(node, "cell");
				String param_id = XML.getNodeText(nodeList.item(1));
				double newValue = Double.parseDouble(XML.getNodeText(nodeList.item(4)));
				double oldValue = CommonUtil.getDoubleValue(getStringValue(list.get(i),"adj_value"));
				if(newValue != oldValue){
					paramMap.put("parameter_id", param_id);
					paramMap.put("value", newValue);
					this.scoreWeightService.modifyParam(paramMap);
				}else{
					continue;
				}
			}
		} catch (Exception e) {
			System.out.println("保存出现错误");
			e.printStackTrace();
		}
		
	}
	
	/**
	 * 获取查询配置模板
	 * 
	 * @return
	 */
	private ITableTemplate getDetailDhtmlConfig() throws Exception {
		String context = request.getContextPath();
		ITableTemplate template = new DhtmlTableTemplate();
		template.setHeader(new String[] { "参数ID,参数名称,参数默认值,img:["+context+"/bsc/scripts/page_edit.png]参数调整值" });
		template.setColumnAlign("center,center,right,right");
		template.setColumnType("ro,ro,ro,ed");
		template.setColumnWidth("150,180,150,150");
		template.setColumnFormatType("0,0,2,2");
		template.setDataMapKey(new String[] { "parameter_id","parameter_name","dft_value","adj_value"});
		template.setGroupFields("parameter_id");

		return template;
	}
	
	public String getStringValue(Map<String,Object> map,String key){
		return CommonUtil.getStringValue(map.get(key));
	}
}
