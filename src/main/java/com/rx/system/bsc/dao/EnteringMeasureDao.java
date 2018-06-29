package com.rx.system.bsc.dao;

import java.util.List;
import java.util.Map;

import com.rx.system.domain.BscEnterMeasure;

/**
 * 考核参数Dao接口
 * @author zzm
 *
 */
public interface EnteringMeasureDao {
    
	//根据参数param_id ,owner_id获取参数对象
	public List<BscEnterMeasure> getMeasureById(Map<String, Object> paramMap);

	//查询参数列表
	public List<BscEnterMeasure> listMeasure(Map<String, Object> paramMap);

	//添加考核参数add by zzm
	public void addMeasure(Map<String, Object> paramMap);

	//通过id修改考核参数
	public void updateMeasure(Map<String, Object> paramMap);
	
	
}
