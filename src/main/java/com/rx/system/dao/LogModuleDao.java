package com.rx.system.dao;

import java.util.List;
import java.util.Map;
/**
 * 模块日志Dao
 * @Author: mabo
 * @Date: Oct 9, 2013
 */
public interface LogModuleDao {

	/**
	 * 查询系统各个模块访问情况
	 */
	public List<Map<String,Object>> queryModuleInfo(Map<String,Object> paramMap) throws Exception;
	
	/**
	 *  实时曲线图数据查询
	 */
	public List<Map<String,Object>> queryInstant(Map<String,Object> paramMap) throws Exception;
}
