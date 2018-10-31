package com.rx.system.bsc.service;

import java.util.List;
import java.util.Map;

/**
 * 平衡计分卡方案定义Service接口
 * 
 * @author zzm
 * 
 */
public interface IBscProjectService {
	
	public void refreshProjectObjects(String projectID) throws Exception;

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
	public void deleteProject(Map<String, Object> paramMap) throws Exception;
	
	/**
	 * 删除平衡计分卡方案
	 * 
	 * @param paramMap
	 * @throws Exception
	 */
	public void dropProject(Map<String, Object> paramMap) throws Exception;
	
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
	 * 查询方案执行情况
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> listExeInfo(Map<String, Object> paramMap) throws Exception;
	
	public int listExeInfoCount(Map<String, Object> paramMap) throws Exception;
	/**
	 * 查询分配关系
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public boolean hasRelation(Map<String, Object> paramMap) throws Exception;
	
	public boolean getProjectNameById(Map<String,Object> paramMap) throws Exception;
	
	
	/**
	 * 查询平衡计分卡方案（通过方案编号）已执行指标名称列表
	 * 
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> listExecutedIndex(Map<String, Object> paramMap) throws Exception;

	/*
	   查询下拉框
	 */
	public Map<String,String> getDimDataDS(Map<String, Object> paramMap) throws Exception;

	/**
	 * 查询平衡计分卡方案维度
	 *
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> listPorjectObj(Map<String, Object> paramMap) throws Exception;


	/**
	 * 查询地区代码信息
	 *
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> getZoneInfo(Map<String, Object> paramMap) throws Exception;

	/**
	 * 查询项目信息
	 *
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> getProjectInfo(Map<String, Object> paramMap) throws Exception;


	/**
	 * 查询项目时间信息
	 *
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> getProjectMonth(Map<String, Object> paramMap) throws Exception;



	/**
	 * 查询项目维度信息
	 *
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> getPorjectObjInfo(Map<String, Object> paramMap) throws Exception;



	/**
	 * 查询项目指标信息
	 *
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> getProjectIndex(Map<String, Object> paramMap) throws Exception;













}
