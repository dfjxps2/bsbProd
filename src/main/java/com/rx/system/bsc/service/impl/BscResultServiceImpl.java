package com.rx.system.bsc.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.rx.system.base.BaseService;
import com.rx.system.bsc.dao.BscResultDao;
import com.rx.system.bsc.service.IBscResultService;
/**
 * 平衡计分卡考核结果Service实现类
 * @author chenxd
 *
 */
public class BscResultServiceImpl extends BaseService implements IBscResultService {
	
	private BscResultDao bscResultDao = null;
	
	public void setBscResultDao(BscResultDao bscResultDao) {
		this.bscResultDao = bscResultDao;
	}
	
	/**
	 * 发布平衡计分卡结果
	 * @param paramMap
	 * @throws Exception
	 */
	public void publishBscResult(Map<String, Object> paramMap) throws Exception {
		this.bscResultDao.publishBscResult(paramMap);
	}
	
	
	/**
	 * 行列转换
	 * @param dataList
	 * @param primaryKeys
	 * @param columnName
	 * @return 
	 * @throws Exception
	 */
	protected List<Map<String, Object>> columnToRow(List<Map<String, Object>> dataList, String[] primaryKeys,String[] columnName) throws Exception {
		List<Map<String, Object>> resultList = new ArrayList<Map<String,Object>>();
		List<Map<String, Object>> groupList = null;
		while((groupList = this.getGroupList(dataList, primaryKeys)).size() > 0) {
			Map<String, Object> entry = new HashMap<String, Object>(groupList.get(0));
			for (Map<String, Object> map : groupList) {
				entry.put(getStringValue(map, columnName[0]), getStringValue(map, columnName[1]));
			}
			resultList.add(entry);
		}
		return resultList;
	}
	
	/**
	 * 获取分组列表
	 * @param dataList
	 * @param groupKeys
	 * @return
	 * @throws Exception
	 */
	private List<Map<String, Object>> getGroupList(List<Map<String, Object>> dataList, String[] groupKeys) throws Exception {
		List<Map<String, Object>> groupList = new ArrayList<Map<String, Object>>();
		if (dataList.size() > 0) {
			
			Map<String, Object> baseMap = dataList.get(0);
			
			for (Map<String, Object> map : dataList) {
				boolean equals = true;
				for (String key : groupKeys) {
					if (!getStringValue(baseMap, key).equals(getStringValue(map, key))) {
						equals = false;
						break;
					}
				}
				if (equals)
					groupList.add(map);
			}
			
		}
		
		for (Map<String, Object> map : groupList) {
			dataList.remove(map);
		}
		return groupList;
	}
	
	
	/**
	 * 获取方案积分前十图形展示数据列表
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> getTopPoint(Map<String, Object> paramMap) throws Exception {
		paramMap.put("top", "true");
		return toLowerMapList(this.bscResultDao.listResult(paramMap));
	}
	
	/**
	 * 图表等级分布查询
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> getLevelList(Map<String, Object> paramMap) throws Exception {
		return toLowerMapList(this.bscResultDao.getLevelList(paramMap));
	}
	
	
	/**
	 * 获取考核对象明细结果
	 * @param paramMap
	 * @throws Exception
	 */
	public List<Map<String, Object>> getBscResultDetail(Map<String, Object> paramMap) throws Exception {
		return toLowerMapList(this.bscResultDao.getBscResultDetail(paramMap));
	}
	
	/**
	 * 查询考核积分维度占比
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> dimRsult(Map<String, Object> paramMap) throws Exception {
		return toLowerMapList(this.bscResultDao.dimRsult(paramMap));
	}
	
	/**
	 * 查询各考核对象的方案得分
	 */
	public List<Map<String, Object>> listScoreResult(
			Map<String, Object> paramMap) throws Exception {
		System.out.println("paramMap===================="+paramMap);
		List<Map<String, Object>> measureList = (List<Map<String, Object>>)paramMap.get("measureList");
		String case_sql = "";
		for (int i = 0; i < measureList.size(); i++) {
			Map<String, Object> map = measureList.get(i);
			String measure_id = getStringValue(map,"measure_id");
			
			case_sql += "sum(case when b.measure_id ='"+measure_id+"' then b.value else 0 end) as col_"+i;
			if(i != measureList.size()-1)
				case_sql += ",";
		}
		paramMap.put("case_sql", case_sql);
		return toLowerMapList(this.bscResultDao.listScoreResult(paramMap));
	}

	/**
	 * 查询各考核对象的方案得分总数
	 */
	public String listScoreResultCount(Map<String, Object> paramMap)
			throws Exception {
		return this.bscResultDao.listScoreResultCount(paramMap);
	}	
	

	public List<Map<String, Object>> listScoreTotalResult(
			Map<String, Object> paramMap) throws Exception {
		List<Map<String, Object>> measureList = (List<Map<String, Object>>)paramMap.get("measureList");
		String case_sql = "";
		for (int i = 0; i < measureList.size(); i++) {
			Map<String, Object> map = measureList.get(i);
			String measure_id = getStringValue(map,"measure_id");
			
			case_sql += "sum(case when b.measure_id ='"+measure_id+"' then b.value else 0 end) as col_"+i;
			if(i != measureList.size()-1)
				case_sql += ",";
		}
		paramMap.put("case_sql", case_sql);
		return toLowerMapList(this.bscResultDao.listScoreTotalResult(paramMap));
	}	

	/**
	 * 图表排名
	 */
	public List<Map<String, Object>> getScoreTopPoint(
			Map<String, Object> paramMap) throws Exception {
		return toLowerMapList(this.bscResultDao.getScoreTopPoint(paramMap));
	}

	/**
	 * 是否可以公布计分卡方案（公布的月份是否是周期期末月份）
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public String canPublish(Map<String, Object> paramMap) throws Exception {
		return this.bscResultDao.canPublish(paramMap);
	}

	
	public List<Map<String, Object>> getCompareDetailProjectScore(Map<String, Object> paramMap)
			throws Exception {
		return this.toLowerMapList(this.bscResultDao.getCompareDetailProjectScore(paramMap));
	}

	public List<Map<String, Object>> listScoreSubResult(
			Map<String, Object> paramMap) throws Exception {
		List<Map<String, Object>> measureList = (List<Map<String, Object>>)paramMap.get("measureList");
		String case_sql = "";
		for (int i = 0; i < measureList.size(); i++) {
			Map<String, Object> map = measureList.get(i);
			String measure_id = getStringValue(map,"measure_id");
			
			case_sql += "sum(case when b.measure_id ='"+measure_id+"' then b.value else 0 end) as col_"+i;
			if(i != measureList.size()-1)
				case_sql += ",";
		}
		paramMap.put("case_sql", case_sql);
		return this.toLowerMapList(bscResultDao.listScoreSubResult(paramMap));
	}

	public List<Map<String, Object>> listProjectMeasure(
			Map<String, Object> paramMap) throws Exception {
		return this.toLowerMapList(bscResultDao.listProjectMeasure(paramMap));
	}

	public List<Map<String, Object>> listSubMeasure(Map<String, Object> paramMap)
			throws Exception {
		return this.toLowerMapList(bscResultDao.listSubMeasure(paramMap));
	}
	
}
