package com.rx.system.bsc.service.impl;

import java.util.List;
import java.util.Map;

import com.rx.system.base.BaseService;
import com.rx.system.bsc.dao.ProjectAnalyseDao;
import com.rx.system.bsc.service.IProjectAnalyseService;

/**
 * 方案分析Service实现类
 * @author chenxd
 *
 */
public class ProjectAnalyseServiceImple extends BaseService implements IProjectAnalyseService {
	
	private ProjectAnalyseDao projectAnalyseDao = null;
	
	/**
	 * 查询方案历史得分列表
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> projectScoreLine(Map<String, Object> paramMap) throws Exception {
		List<Map<String, Object>> dataList = toLowerMapList(this.projectAnalyseDao.projectScoreLine(paramMap));
		return dataList;
	}
	
	/**
	 * 查询指标分析列表
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> measureList(Map<String, Object> paramMap) throws Exception {
		return toLowerMapList(this.projectAnalyseDao.measureList(paramMap));
	}
	
	/**
	 * 查询指标得分
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> measureScoreList(Map<String, Object> paramMap) throws Exception {
		return toLowerMapList(this.projectAnalyseDao.measureScoreList(paramMap));
	}
	
	/**
	 * 查询指标完成值
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> measureValueList(Map<String, Object> paramMap) throws Exception{
		return toLowerMapList(this.projectAnalyseDao.measureValueList(paramMap));
	}
	
	/**
	 * 查询月份
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> listMonth(Map<String, Object> paramMap) throws Exception {
		List<Map<String, Object>> list = toLowerMapList(this.projectAnalyseDao.listMonth(paramMap));
		for (Map<String, Object> map : list) {
			String monthName = getStringValue(map, "month_name");
			map.put("month_label", monthName.substring(0, 4)+"-"+monthName.substring(4));
		}
		return list;
	}
	
	public void setProjectAnalyseDao(ProjectAnalyseDao projectAnalyseDao) {
		this.projectAnalyseDao = projectAnalyseDao;
	}
}
