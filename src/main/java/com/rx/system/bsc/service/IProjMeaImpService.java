package com.rx.system.bsc.service;

import java.util.List;
import java.util.Map;

/**
 * 考核结果直接由外部导入的指标Service接口
 * 
 * @author zzm
 * 
 */
public interface IProjMeaImpService {
	
	/**
	 * 外部导入指标显示列表
	 * @param paramsMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> list(Map<String, Object> paramsMap) throws Exception;

	/**
	 * 保存修改记录
	 * @param paramsMap
	 * @throws Exception
	 */
	public void save(Map<String, Object> paramsMap) throws Exception;

	/**
	 * 清楚记录
	 * @param paramsMap
	 * @throws Exception
	 */
	public void delete(Map<String, Object> paramsMap) throws Exception;

	/**
	 * 校验导入数据
	 * @param m
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> checkImportData(Map<String, Object> m) throws Exception;

	/**
	 * 导入数据
	 * @param paramMap
	 * @throws Exception
	 */
	public void saveImportData(Map<String, Object> paramMap) throws Exception;
	
	//指标查询
    public List<Map<String, Object>> queryMeasure(Map<String, Object> map) throws Exception;
}
