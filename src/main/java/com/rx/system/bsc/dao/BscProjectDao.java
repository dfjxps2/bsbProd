package com.rx.system.bsc.dao;

import java.util.List;
import java.util.Map;

/**
 * 平衡计分卡方案定义Dao
 * 
 * @author zzm
 * 
 */
public interface BscProjectDao {
	
	public int getProjectCountByName(Map<String, Object> paramMap) throws Exception;
	
	/**
	 * 查询方案已经发布的月份个数
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public int getPublishedCount(Map<String, Object> paramMap) throws Exception;
	
	/**
	 * 查询平衡计分卡方案定义列表
	 * 
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> listProject(Map<String, Object> paramMap) throws Exception;
	
	/**
	 * 查询平衡计分卡方案已执行月份列表
	 * 
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> listExecutedMonth(Map<String, Object> paramMap) throws Exception;

	/**
	 * 添加平衡计分卡方案
	 * 
	 * @param paramMap
	 * @throws Exception
	 */
	public void addProject(Map<String, Object> paramMap) throws Exception;

	/**
	 * 编辑平衡计分卡方案
	 * 
	 * @param paramMap
	 * @throws Exception
	 */
	public void editProject(Map<String, Object> paramMap) throws Exception;

	/**
	 * 删除平衡计分卡方案
	 * 
	 * @param paramMap
	 * @throws Exception
	 */
	public void updateProjectStatus(Map<String, Object> paramMap) throws Exception;
	
	/**
	 * 复制方案
	 * 
	 * @param paramMap
	 * @throws Exception
	 */
	public void copyProject(Map<String, Object> paramMap) throws Exception;

	/**
	 * 方案下达
	 * 
	 * @param paramMap
	 * @throws Exception
	 */
	public void doPublish(Map<String, Object> paramMap) throws Exception;

	/**
	 * 通过级别ID 和方案Id查询 级别是否存在
	 * 
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> checkExist(Map<String, Object> paramMap)
			throws Exception;
	
	/**
	 * 查询方案执行情况
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> listExeInfo(Map<String, Object> paramMap) throws Exception;
	
	public int listExeInfoCount(Map<String, Object> paramMap) throws Exception;

	public int hasRelation(Map<String, Object> paramMap) throws Exception;

}
