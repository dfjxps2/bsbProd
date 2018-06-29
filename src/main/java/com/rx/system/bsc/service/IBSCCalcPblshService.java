package com.rx.system.bsc.service;

import java.util.List;
import java.util.Map;

/**
 * BSC测算与发布service
 * @Author: mabo
 * @Date: Jul 18, 2013
 */
public interface IBSCCalcPblshService {
	
	/**
	 * 获取方案列表
	 */
	List<Map<String,Object>> listProject(Map<String,Object> map) throws Exception;

}
