package com.rx.system.service;

import java.util.List;
import java.util.Map;

public interface ILogModuleService {

	/**
	 * 查询系统各个模块访问情况
	 */
	public List<Map<String,Object>> queryModuleInfo(Map<String,Object> paramMap) throws Exception;
	/**
	 *  实时曲线图数据查询
	 */
	public List<Map<String,Object>> queryInstant(Map<String,Object> paramMap) throws Exception;
}
