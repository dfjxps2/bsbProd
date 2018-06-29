package com.rx.system.bsc.service;

import java.util.List;
import java.util.Map;

/**
 * 权重维护service
 * @Author: mabo
 * @Date: Jul 9, 2013
 */
public interface IScoreWeightService {
	//查询方案
	public List<Map<String,Object>> queryProject(Map<String,Object> map) throws Exception;
	
	//查询对象总数
	public String getTotalNum()throws Exception;
	
	//查询对象
	public List<Map<String,Object>> queryObject(Map<String,Object> map) throws Exception;
	
	//查询指标
	public List<Map<String,Object>> queryMeasure(Map<String,Object> map) throws Exception;
	
	//修改权重
	public void scoreWeightModify(Map<String,Object> map) throws Exception;
	
	//查询参数
	public List<Map<String,Object>> queryParam(Map<String,Object> map) throws Exception;
	
	//修改参数
	public void modifyParam(Map<String,Object> map) throws Exception;
}
