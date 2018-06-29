package com.rx.system.bsc.dao;

import java.util.List;
import java.util.Map;

import com.rx.system.domain.BscOwnObjPara;
import com.rx.system.domain.BscParameter;

/**
 * 考核参数Dao接口
 * @author zzm
 *
 */
public interface ParameterDao {
	
	//查询参数列表
	public List<BscParameter> listParameter(Map<String, Object> paramMap) throws Exception;
	
	//添加考核参数add by zzm
	public void addParameter(Map<String, Object> paramMap) throws Exception;
	
	//根据参数param_id ,owner_id获取参数对象
	public List<BscParameter> getParameterById(Map<String, Object> paramMap) throws Exception;

	//通过id修改考核参数
	public void updateParameter(Map<String, Object> paramMap) throws Exception;
	
	//通过id删除考核参数
	public void deleteParameter(Map<String, Object> paramMap) throws Exception;

	//通过project_id,parameter_id,role_id查询考核参数明细列表
	public List<BscOwnObjPara> listItems(Map<String, Object> paramMap) throws Exception;

	//查找所有考核对象列表
	public List<BscOwnObjPara> listObjects(Map<String, Object> paramMap) throws Exception;

	//查找所有考核对象列表总条数
	public int listObjectsTotalCount(Map<String, Object> paramMap) throws Exception;
	
	//通过project_id,parameter_id,role_id删除明细
	public void deleteItem(Map<String, Object> paramMap);

	//保存考核参数明细列表
	public void saveItem(Map<String, Object> paramMap);

	//通过parameter_id删除items
	public void deleteItemByParamId(Map<String, Object> paramMap);
}
