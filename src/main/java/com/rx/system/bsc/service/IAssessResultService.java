package com.rx.system.bsc.service;

import java.util.List;
import java.util.Map;
/**
 * 评定结果service
 * @Author: mabo
 * @Date: Jul 17, 2013
 */
public interface IAssessResultService {

	/**
	 * 方案列表
	 */
	List<Map<String,Object>> listProject(Map<String,Object> map) throws Exception;
	
	/**
	 * 结果列表
	 */
	List<Map<String,Object>> listResults(Map<String,Object> map) throws Exception;
	
	/**
	 * 修改评级等级
	 * @param map
	 * @throws Exception
	 */
	void modifyAssessRank(Map<String,Object> map) throws Exception;
	
	/**
	 * 等级查询
	 * @param map
	 * @return
	 * @throws Exception
	 */
	List<Map<String,Object>> queryRsltStat(Map<String,Object> map) throws Exception;
	/**
	 * 对象列表分页总数
	 * */
	public int listResultsCount(Map<String, Object> map) throws Exception;
}
