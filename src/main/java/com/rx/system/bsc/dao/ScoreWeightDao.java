package com.rx.system.bsc.dao;

import java.util.List;
import java.util.Map;

/**
 * 权重维护dao
 * @Author: mabo
 * @Date: Jul 9, 2013
 */
public interface ScoreWeightDao {
	//查询方案
	public List<Map<String,Object>> queryProject(Map<String,Object> map) throws Exception;
	
	//查询对象总数
	public String getTotalNum(Map<String,Object> map)throws Exception;
	
	//查询对象
	public List<Map<String,Object>> queryObject(Map<String,Object> map) throws Exception;
	
	//查询指标
	public List<Map<String,Object>> queryMeasure(Map<String,Object> map) throws Exception;
	
	//修改权重  -- 删除
	public void deleteScoreWeight(Map<String,Object> map) throws Exception;
	
	//修改权重  -- 插入
	public void saveScoreWeight(Map<String,Object> map) throws Exception;
	
	//查询参数
	public List<Map<String,Object>> queryParam(Map<String,Object> map) throws Exception;
	
	//修改参数  --删除
	public void deleteParamValue(Map<String,Object> map) throws Exception;
	
	//修改参数  --插入
	public void saveParamValue(Map<String,Object> map) throws Exception;
}
