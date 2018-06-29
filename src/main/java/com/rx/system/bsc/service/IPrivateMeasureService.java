package com.rx.system.bsc.service;

import java.util.List;
import java.util.Map;

/**
 * 指标维护Service接口
 * @author chenxd
 *
 */
public interface IPrivateMeasureService {
	
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
	public Map<String,Object> deleteEngMeasure(Map<String, Object> paramMap) throws Exception;
	
	/**
	 * 获取基础指标列表
	 * @param measure
	 * @throws Exception
	 */
	public List<Map<String, Object>> listBaseEngMeasure(Map<String, Object> paramMap) throws Exception;
	
	/**
	 * 获取私有指标列表
	 * @param measure
	 * @throws Exception
	 */
	public List<Map<String, Object>> listEngMeasure(Map<String, Object> paramMap) throws Exception;

	/**
	 * 通过Id查询指标
	 * @param paramMap
	 * @return
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
	
}
