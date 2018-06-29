package com.rx.system.dao;

import java.util.List;
import java.util.Map;
/**
 * 日志接口Dao
 * @Author: mabo
 * @Date: Oct 8, 2013
 */
public interface LogDao {
	/**
	 * 查询日志列表
	 */
	public List<Map<String,Object>> queryList(Map<String,Object> paramMap) throws Exception;
	/**
	 * 查询日志列表总数
	 */
	public int queryListCount(Map<String,Object> paramMap) throws Exception;
	/**
	 * 查询登陆人操作明细
	 */
	public List<Map<String,Object>> queryDetail(Map<String,Object> paramMap) throws Exception;

}
