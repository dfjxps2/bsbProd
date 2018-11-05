package com.rx.system.bsc.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import com.rx.system.base.BaseService;
import com.rx.system.bsc.dao.BscCardDao;
import com.rx.system.bsc.service.IBscCardService;
import com.rx.system.util.CommonUtil;

@Deprecated
public class BscCardServiceImpl extends BaseService implements IBscCardService {
	
	private BscCardDao bscCardDao = null;
	
	/**
	 * 查询机构平衡计分卡考核结果
	 */
	public List<Map<String, Object>> queryOrgCardResult(Map<String, Object> paramMap) throws Exception {
		List<Map<String, Object>> measureStatusList = toLowerMapList(this.bscCardDao.queryOrgMeasureStatus(paramMap));//指标状态列表
		paramMap.put("nopage", "true");
		List<Map<String, Object>> orgStatusList = toLowerMapList(this.bscCardDao.queryOrgStatusDetail(paramMap));//机构指标状态列表
		
		List<Map<String, Object>> objList = this.queryOrgList(paramMap);
		Map<String, String> objMap = this.convertToMap(objList);
		
		String[] filterKeys = new String[]{"strategy_id","measure_id"};
		
		for (Map<String, Object> measureStatus : measureStatusList) {
			List<Map<String, Object>> groupList = this.getGroupList(orgStatusList, measureStatus, filterKeys, objMap);
			for (Map<String, Object> map : groupList) {
				String object_id = getStringValue(map, "object_id");
				String mea_rank_id = getStringValue(map, "mea_rank_id");
				measureStatus.put(object_id, "../img/"+mea_rank_id+".png^"+getStringValue(map, "rank_short_name"));
			}
		}
		
		return measureStatusList;
	}
	
	private Map<String, String> convertToMap(List<Map<String, Object>> list) {
		Map<String, String> map = new HashMap<String, String>();
		for (Map<String, Object> m : list) {
			map.put(getStringValue(m, "object_id"), getStringValue(m, "object_name"));
		}
		return map;
	}
	
	/**
	 * 查询机构平衡计分卡考核结果----机构列表
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> queryOrgList(Map<String, Object> paramMap) throws Exception {
		return toLowerMapList(this.bscCardDao.queryOrgList(paramMap));
	}
	
	/**
	 * 从List中过滤出同给定Map中的字段值一致的记录
	 * @param list
	 * @param map
	 * @param keys
	 * @return
	 */
	private List<Map<String, Object>> getGroupList(List<Map<String, Object>> list,Map<String, Object> map,String[] keys,Map<String, String> objMap) {
		List<Map<String, Object>> groupList = new ArrayList<Map<String,Object>>();
		Map<String, String> oMap = new HashMap<String, String>();
		oMap.putAll(objMap);
		
		for (int i = 0; i < list.size(); i++) {
			Map<String, Object> m = list.get(i);
			boolean b = true;
			for (int j = 0; j < keys.length; j++) {
				if(getStringValue(m, keys[j]).equals(getStringValue(map, keys[j])))
					continue;
				b = false;
				break;
			}
			if(b) {
				groupList.add(m);
				list.remove(m);
				i--;
				oMap.remove(getStringValue(m, "object_id"));
			}
		}
		
		for (Iterator<String> iter = oMap.keySet().iterator(); iter.hasNext();) {
			String key = iter.next();
			Map<String, Object> blankMap = new HashMap<String, Object>();
			blankMap.put("object_id", key);
			blankMap.put("mea_rank_id", "blank");
			blankMap.put("rank_short_name", "无此考核指标");
			groupList.add(blankMap);
		}
		
		return groupList;
	}
	
	/**
	 * 查询机构平衡计分卡对象结果明细
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> queryOrgStatusDetail(Map<String, Object> paramMap) throws Exception {
		List<Map<String, Object>> list = toLowerMapList(this.bscCardDao.queryOrgStatusDetail(paramMap));
		for (Map<String, Object> map : list) {
			String mea_rank_id = getStringValue(map, "mea_rank_id");
			map.put("mea_rank_id", "../img/"+mea_rank_id+".png^"+getStringValue(map, "rank_short_name"));
		}
		return list;
	}
	
	/**
	 * 查询机构平衡计分卡对象结果明细---对象列表
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> queryOrgStatusDetailObjList(Map<String, Object> paramMap) throws Exception {
		return toLowerMapList(this.bscCardDao.queryOrgStatusDetailObjList(paramMap));
	}
	
	/**
	 * 查询机构平衡计分卡对象结果明细记录数
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public String queryOrgStatusDetailCount(Map<String, Object> paramMap) throws Exception {
		return this.bscCardDao.queryOrgStatusDetailCount(paramMap);
	}
	
	
	/**
	 * 查询对象平衡计分卡考核结果
	 */
	public List<Map<String, Object>> queryCardResult(Map<String, Object> paramMap) throws Exception {
		String monthId = getStringValue(paramMap, "month_id");
		String cycleTypeId = getStringValue(paramMap, "cycleTypeId");
		String object_id = getStringValue(paramMap, "object_id");
		paramMap.put("year_id", monthId.substring(0, 4));
		paramMap.put("cycle_id", this.getCycleIdByMonth(cycleTypeId, monthId));
		paramMap.put("object_id", object_id);
		return toLowerMapList(this.bscCardDao.queryCardResult(paramMap));
	}
	
	/**
	 * 查询指标公式的明细值
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public Map<String, Object> getFormulaDetail(Map<String, Object> paramMap) throws Exception {
		Map<String, Object> infoMap = new HashMap<String, Object>();
		String type = getStringValue(paramMap, "type").trim();
		if(type.equals("score")) {
			paramMap.put("type", type);
			String month_id = getStringValue(paramMap, "month_id");
			String cycle_type = getStringValue(paramMap, "cycle_type");
			
			paramMap.put("year_id", month_id.substring(0,4));
			paramMap.put("cycle_id", this.getCycleIdByMonth(cycle_type, month_id));
		}
		
		String formula = "";
		//查询指标基础信息
		List<Map<String, Object>> list = toLowerMapList(this.bscCardDao.getMeasureBaseInfo(paramMap));
		if(list.size() == 0) {
			infoMap.put("measureName", "-");
			infoMap.put("measureType", "-");
			infoMap.put("measureValue", "-");
		}else {
			Map<String, Object> baseInfo = list.get(0);
			infoMap.put("measureID", getStringValue(baseInfo, "measure_id"));
			infoMap.put("measureName", getStringValue(baseInfo, "measure_name"));
			infoMap.put("measureDesc", getStringValue(baseInfo, "measure_desc"));
			infoMap.put("measureType", getStringValue(baseInfo, "source_type_desc"));
			infoMap.put("measureValue", getStringValue(baseInfo, "value"));
			infoMap.put("measureFormula", getStringValue(baseInfo, "formula"));
			infoMap.put("measureFormulaDesc", getStringValue(baseInfo, "formula_desc"));
			
			infoMap.put("completeValue", getStringValue(baseInfo, "complete_value"));
			infoMap.put("targetValue", getStringValue(baseInfo, "target_value"));
			formula = getStringValue(baseInfo, "formula");
		}
		
		//查询下级指标列表和值
		paramMap.put("measureIds", this.getSubMeasureIds(formula).replaceAll(",", "','"));
		list = toLowerMapList(this.bscCardDao.getFormulaDetail(paramMap));
		infoMap.put("subMeasureList", list);
		
		//查询包含参数列表和值
		paramMap.put("paramIds", this.getParamIds(formula).replaceAll(",", "','"));
		List<Map<String, Object>> paramList = toLowerMapList(this.bscCardDao.getParamaValue(paramMap));
		infoMap.put("paramList", paramList);
		
		String desc = this.replaceFormulaCalcExp(formula, list, paramList);
		
		infoMap.put("measureFormulaCalc", desc);
		
		return infoMap;
	}
	private String replaceFormulaCalcExp(String formula,List<Map<String, Object>> subMeasureList,List<Map<String, Object>> paramList) {
		String exp = new String(formula);
		for (Map<String, Object> map : subMeasureList) {
			String measure_id = getStringValue(map, "measure_id");
			String score = getStringValue(map, "score");
			exp = CommonUtil.replace(exp, "[@"+measure_id+"]", score);
		}
		
		for (Map<String, Object> map : paramList) {
			String parameter_id = getStringValue(map, "parameter_id");
			String value = getStringValue(map, "value");
			exp = CommonUtil.replace(exp, "[$"+parameter_id+"]", value);
		}
		return exp;
	}
	
	private String getSubMeasureIds(String formula) {
		String ids = "";
		String measureID = "";
		String f = new String(formula);
		while(!(measureID = CommonUtil.getParam(f, "[@", "]")).equals("")) {
			ids += ","+measureID;
			f = CommonUtil.replace(f, "[@"+measureID+"]", "");
		}
		return ids.replaceFirst(",", "");
	}
	
	private String getParamIds(String formula) {
		String ids = "";
		String paramID = "";
		String f = new String(formula);
		while(!(paramID = CommonUtil.getParam(f, "[$", "]")).equals("")) {
			ids += ","+paramID;
			f = CommonUtil.replace(f, "[$"+paramID+"]", "");
		}
		return ids.replaceFirst(",", "");
	}
	
	/**
	 * 根据周期类型和月份 获取周期ID
	 * @param cycleTypeId
	 * @param monthId
	 * @return
	 */
	protected String getCycleIdByMonth(String cycleTypeId, String monthId) {
		int month = Integer.parseInt(monthId.substring(4));
		String cycleId = "";
		if("00".equals(cycleTypeId)) {
			//月份
			cycleId = String.valueOf(month);
		}else if("01".equals(cycleTypeId)) {
			//季度
			cycleId = String.valueOf(month/3 + (month%3 > 0 ? 1 : 0));
		}else {
			//年份
			cycleId = "1";
		}
		return cycleId;
	}
	
	/**
	 * 查询对象计分卡结果信息
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> queryInfo(Map<String, Object> paramMap) throws Exception {
		return toLowerMapList(this.bscCardDao.queryInfo(paramMap));
	}
	
	public void setBscCardDao(BscCardDao bscCardDao) {
		this.bscCardDao = bscCardDao;
	}
}
