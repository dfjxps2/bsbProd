package com.rx.system.bsc.service;

import java.util.List;
import java.util.Map;

/**
 * 方案分析Service接口
 * @author chenxd
 *
 */
public interface IProjectAnalyseService {
	
	/**
	 * 查询方案历史得分列表
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> projectScoreLine(Map<String, Object> paramMap) throws Exception;
	
	/**
	 * 查询指标分析列表
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> measureList(Map<String, Object> paramMap) throws Exception;
	
	/**
	 * 查询指标得分
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> measureScoreList(Map<String, Object> paramMap) throws Exception;
	/**
	 * 查询指标完成值
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> measureValueList(Map<String, Object> paramMap) throws Exception;
	
	/**
	 * 查询月份
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> listMonth(Map<String, Object> paramMap) throws Exception;
	
}
