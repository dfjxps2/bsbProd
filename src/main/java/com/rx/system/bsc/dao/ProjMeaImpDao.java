package com.rx.system.bsc.dao;

import java.util.List;
import java.util.Map;

/**
 * 考核结果直接由外部导入的指标Dao
 * 
 * @author zzm
 * 
 */
public interface ProjMeaImpDao {

	/**
	 * 外部导入指标显示列表
	 * 
	 * @param paramsMap
	 * @return
	 * @throws Exception
	 */
	List<Map<String, Object>> list(Map<String, Object> paramsMap)
			throws Exception;

	/**
	 * 删除记录
	 * @param paramsMap
	 * @throws Exception
	 */
	void delete(Map<String, Object> paramsMap) throws Exception;

	/**
	 * 插入记录
	 * @param paramsMap
	 * @throws Exception
	 */
	void save(Map<String, Object> paramsMap) throws Exception;

	/**
	 * 校验导入对象是否有效
	 * @param param
	 * @return
	 * @throws Exception
	 */
	
	//指标查询
    public List<Map<String, Object>> queryMeasure(Map<String, Object> map) throws Exception;
    
    //校验方案project_id是否有效
    public int projectIsValid(Map<String, Object> map) throws Exception;

    //校验周期cycle_id是否有效
    public int cycleIsValid(Map<String, Object> map) throws Exception;

    //校验指标measure_id是否有效
    public int measureIsValid(Map<String, Object> map) throws Exception;

    //校验考核对象object_id是否有效
    public List<Map<String,Object>> objectIsValid(Map<String, Object> map) throws Exception;

}
