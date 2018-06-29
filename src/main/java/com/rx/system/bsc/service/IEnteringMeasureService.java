package com.rx.system.bsc.service;

import java.util.List;
import java.util.Map;

import com.rx.system.domain.BscEnterMeasure;

/**
 * 考核参数Service接口
 * @author zzm
 *
 */
public interface IEnteringMeasureService {
	
	//查询考核参数列表
	public List<BscEnterMeasure> listMeasure(Map<String, Object> paramMap) throws Exception;
	
	//根据参数param_id ,owner_id获取参数对象
	public List<BscEnterMeasure> getMeasureById(Map<String, Object> paramMap) throws Exception;
	
	//添加考核参数add by zzm
	public void addMeasure(Map<String, Object> paramMap) throws Exception;
	
	//通过id修改考核参数
	public void updateMeasure(Map<String, Object> paramMap) throws Exception;
	
	//校验参数ID是否存在
	public void examineID(Map<String, Object> paramMap) throws Exception ;
}
