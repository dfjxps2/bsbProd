package com.rx.system.bsc.dao;

import java.util.List;
import java.util.Map;

/**
 * 平衡计分卡结果Dao接口类
 * @author chenxd
 *
 */
public interface BscResultDao {
	
	/**
	 * 发布平衡计分卡结果
	 * @param paramMap
	 * @throws Exception
	 */
	public void publishBscResult(Map<String, Object> paramMap) throws Exception;
	
	/**
	 * 查询积分结果列表
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> listResult(Map<String, Object> paramMap) throws Exception;
	
	/**
	 * 查询积分结果列表记录总数
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public String listResultCount(Map<String, Object> paramMap) throws Exception;
	
	
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
	
	public List<Map<String, Object>> listSubMeasure(Map<String, Object> paramMap) throws Exception;
	
	//通过指标编号查询指标信息
	public List<Map<String, Object>> listProjectMeasureByIndexId(Map<String, Object> paramMap) throws Exception;

	public String listScoreResultCountByYear(Map<String, Object> paramMap) throws Exception;
	/**
	 * 根据年份查询积分结果列表
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> listScoreResultByYear(Map<String, Object> paramMap) throws Exception;
	/**
	 * 根据年份查询全部积分结果
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> listScoreTotalResultByYear(Map<String, Object> paramMap) throws Exception;
	/**
	 * 根据维度查询全部积分结果
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> listScoreTotalResultByObj(Map<String, Object> paramMap) throws Exception;
	public List<Map<String, Object>> listScoreSubResultByYear(Map<String, Object> paramMap) throws Exception;



	public List<Map<String, Object>> getResultDhtmlYearByParam(Map<String, Object> paramMap) throws Exception;


	/**
	 * 根据维度查询全部积分结果
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> getResultDhtmlOjbectByParam(Map<String, Object> paramMap) throws Exception;




	public String getResultDhtmlYearCountByCondExt(Map<String, Object> paramMap) throws Exception;


	public String getResultDhtmlObjCountByCondExt(Map<String, Object> paramMap) throws Exception;


	public List<Map<String, Object>> getZoneNameByZoneID(Map<String, Object> paramMap) throws Exception;




	public List<Map<String, Object>> getResultDhtmlYearByParamInfo(Map<String, Object> paramMap) throws Exception;


	public List<Map<String, Object>> getResultDhtmlOjbectByParamInfo(Map<String, Object> paramMap) throws Exception;


	public List<Map<String, Object>> getProjectResultMeasure(Map<String,Object> paramMap) throws Exception;

	//通过指标编号查询指标信息
	public List<Map<String, Object>> getProjectResultMeasureByIndexId(Map<String,Object> paramMap) throws Exception;

	public List<Map<String, Object>> getObectNameByObjId(Map<String, Object> paramMap) throws Exception;


	public List<Map<String, Object>> getObectNameByDimId(Map<String, Object> paramMap) throws Exception;



}
