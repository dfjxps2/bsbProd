package com.rx.system.bsc.service;

import java.util.Map;


import java.util.List;

/**
 * 平衡积分卡考核结果查询Service接口
 * @author chenxd
 *
 */
public interface IBscResultService {
	
	/**
	 * 发布平衡计分卡结果
	 * @param paramMap
	 * @throws Exception
	 */
	public void publishBscResult(Map<String, Object> paramMap) throws Exception;
	
	
	/**
	 * 获取方案积分前十图形展示数据列表
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> getTopPoint(Map<String, Object> paramMap) throws Exception;
	
	/**
	 * 获取考核对象明细结果
	 * @param paramMap
	 * @throws Exception
	 */
	public List<Map<String, Object>> getBscResultDetail(Map<String, Object> paramMap) throws Exception;
	
	/**
	 * 查询考核积分维度占比
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> dimRsult(Map<String, Object> paramMap) throws Exception;

	/**
	 * 查询各考核对象的方案得分
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> listScoreResult(
			Map<String, Object> paramMap) throws Exception;
	
	public List<Map<String, Object>> listScoreSubResult(
			Map<String, Object> paramMap) throws Exception;

	/**
	 * 查询各考核对象的方案得分总数
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public String listScoreResultCount(Map<String, Object> paramMap) throws Exception;

	public List<Map<String, Object>> listScoreTotalResult(
			Map<String, Object> paramMap) throws Exception;

	/**
	 * 图表排名查询
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> getScoreTopPoint(Map<String, Object> paramMap) throws Exception;
	
	/**
	 * 图表等级分布查询
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> getLevelList(Map<String, Object> paramMap) throws Exception;
	
	/**
	 * 是否可以公布计分卡方案（公布的月份是否是周期期末月份）
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public String canPublish(Map<String, Object> paramMap) throws Exception;
	
	/**
	 * 详细计分卡结构中对比12个周期的积分卡结果
	 * */
	public List<Map<String,Object>> getCompareDetailProjectScore(Map<String, Object> paramMap) throws Exception;
	
	public List<Map<String, Object>> listProjectMeasure(Map<String,Object> paramMap) throws Exception;
	
	public List<Map<String, Object>> listSubMeasure(Map<String,Object> paramMap) throws Exception;
}
