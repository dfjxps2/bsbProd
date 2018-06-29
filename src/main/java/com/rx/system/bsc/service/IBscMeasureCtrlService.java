package com.rx.system.bsc.service;

import java.util.List;
import java.util.Map;

/**
 * 平衡计分卡考核指标维护Service接口
 * @author chenxd
 *
 */
public interface IBscMeasureCtrlService {
	
	/**
	 * 添加bsc考核指标
	 * @param paramMap
	 * @throws Exception
	 */
	public void addBscMeasure(Map<String, Object> paramMap) throws Exception;
	
	
	/**
	 * 编辑bsc考核指标
	 * @param paramMap
	 * @throws Exception
	 */
	public void editBscMeasure(Map<String, Object> paramMap) throws Exception;
	
	/**
	 * 删除bsc考核指标
	 * @param paramMap
	 * @throws Exception
	 */
	public void removeBscMeasure(Map<String, Object> paramMap) throws Exception;
	
	/**
	 * 获取考核指标列表
	 * @param paramMap
	 * @throws Exception
	 */
	public List<Map<String, Object>> listBscMeasure(Map<String, Object> paramMap) throws Exception;
	
	/**
	 * 生成新方案
	 */
	public void createNewProject(Map<String, Object> paramMap) throws Exception;
	
	/**
	 * 设置指标在计分卡内顺序
	 * @param paramMap
	 * @throws Exception
	 */
	public void setMeasureOrder(Map<String, Object> paramMap) throws Exception;
}
