package com.rx.system.bsc.dao;

import java.util.List;
import java.util.Map;

/**
 * 指标维护操作Dao接口
 * @author chenxd
 *
 */
public interface PrivateMeasureDao {
	
	/**
	 * 添加指标
	 * @param paramMap
	 * @throws Exception
	 */
	public void addEngMeasure(Map<String, Object> paramMap) throws Exception;
	
	/**
	 * 编辑指标
	 * @param paramMap
	 * @throws Exception
	 */
	public void editEngMeasure(Map<String, Object> paramMap) throws Exception;
	
	/**
	 * 编辑指标公式
	 * @param paramMap
	 * @throws Exception
	 */
	public void editEngMeasureFormula(Map<String, Object> paramMap) throws Exception;
	
	/**
	 * 删除指标
	 * @param paramMap
	 * @throws Exception
	 */
	public void deleteEngMeasure(Map<String, Object> paramMap) throws Exception;
	
	/**
	 * 查询指标的下级指标个数
	 * 
	 * @param paramMap
	 * @throws Exception
	 */
	public int getSubNodeCount(Map<String, Object> paramMap) throws Exception;
	
	/**
	 * 获取指标列表
	 * @param measure
	 * @throws Exception
	 */
	public List<Map<String, Object>> listEngMeasure(Map<String, Object> paramMap) throws Exception;
	
	/**
	 * 根据指标ID获取指标对象
	 * @param measure
	 * @throws Exception
	 */
	public List<Map<String, Object>> getEngMeasureById(Map<String, Object> paramMap) throws Exception;
	
	/**
	 * 查询指标计算依赖的指标[运算下级指标]
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> listMeasureCalcDepend(Map<String, Object> paramMap) throws Exception;
	
	/**
	 * 添加指标运算依赖的指标
	 * @param paramMap
	 * @throws Exception
	 */
	public void addDependMeasure(Map<String, Object> paramMap) throws Exception;
	
	/**
	 * 删除指标运算依赖的指标
	 * @param paramMap
	 * @throws Exception
	 */
	public void removeDependMeasure(Map<String, Object> paramMap) throws Exception;
	
	/**
	 * 查询指标名
	 * @param measure_id
	 * @return
	 * @throws Exception
	 */
	public String getMeasureName(String measure_id) throws Exception;
	
	/**
	 * 查询参数名
	 * @param measure_id
	 * @return
	 * @throws Exception
	 */
	public String getParamName(String parameter_id) throws Exception;
	
	/**
	 * 删除某指标与参数的关系
	 * */
	public void deleteMeasureParam(String measure_id) throws Exception;
	
	/**
	 * 增加指标与参数的关系
	 * */
	public void insertMeasureParam(Map<String,String> m) throws Exception;
	
}
