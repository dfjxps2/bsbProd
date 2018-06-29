package com.rx.system.bsc.dao;

import java.util.List;
import java.util.Map;

/**
 * BSC测算发布DAO
 * @Author: mabo
 * @Date: Jul 18, 2013
 */
public interface BSCCalcPblshDao {
	/**
	 * 获取方案列表
	 */
	List<Map<String,Object>> listProject(Map<String,Object> map) throws Exception;
}
