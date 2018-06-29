package com.rx.system.bsc.dao;

import java.util.List;
import java.util.Map;

/**
 * 平衡计分卡考核指标维护接口
 * @author chenxd
 *
 */
public interface BscCtrlMeasureDao {
	
	/**
	 * 添加bsc考核指标
	 * @param paramMap
	 * @throws Exception
	 */
	public void addBscMeasure(Map<String, Object> paramMap) throws Exception;
	
	
	/**
	 * 编辑bsc考核指标
	 * @param paramMap
	 * @throws Exception
	 */
	public void editBscMeasure(Map<String, Object> paramMap) throws Exception;
	
	/**
	 * 删除bsc考核指标
	 * @param paramMap
	 * @throws Exception
	 */
	public void removeBscMeasure(Map<String, Object> paramMap) throws Exception;
	
	/**
	 * 获取考核指标列表
	 * @param paramMap
	 * @throws Exception
	 */
	public List<Map<String, Object>> listBscMeasure(Map<String, Object> paramMap) throws Exception;
	
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
	 * 根据方案和指标id，删除方案与参数的关系
	 * */
	public void deleteProjectParam(Map<String,String> map) throws Exception;
	
	/**
	 * 增加方案与参数的关系
	 * */
	public void insertProjectParam(Map<String,String> map) throws Exception;
	
	/**
	 * 删除多余Measure
	 */
	public void deleteSpareMea(Map<String,Object> map) throws Exception;
	
	/**
	 * 删除多余Measure_param
	 */
	public void deleteSpareMeaPara(Map<String,Object> map) throws Exception;
	/**
	 * 获取方案所有衡量指标积分公式
	 * @param projectId
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> getProjectMeasure(String projectId) throws Exception;
	
	/**
	 * 设置指标在计分卡内顺序
	 * @param paramMap
	 * @throws Exception
	 */
	public void setMeasureOrder(Map<String, Object> paramMap) throws Exception;
}
