package com.rx.system.service;

import java.util.List;
import java.util.Map;

import com.rx.util.tree.TreeStore;

/**
 * 初始页Service接口
 * @author chenxd
 *
 */
public interface IInitService {
	
	/**
	 * 查询最近一年得分趋势
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> listYearSocre(Map<String, Object> paramMap) throws Exception;
	
	/**
	 * 查询最近一年排名趋势
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> listYearOrder(Map<String, Object> paramMap) throws Exception;
	
	
	/**
	 * 获取衡量指标趋势
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> listMeasureValue(Map<String, Object> paramMap) throws Exception;
	
	public String[] queryInitUrl(Map<String,Object> paramMap) throws Exception;
	
	public TreeStore getCurrentUserResourceList(Map<String,Object> paramMap) throws Exception;
	
	public void updateUserDefaultInitPage(Map<String,Object> paramMap) throws Exception;
}
