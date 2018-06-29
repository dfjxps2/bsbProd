package com.rx.system.bsc.service.impl;

import java.util.Date;
import java.util.List;
import java.util.Map;

import com.rx.system.base.BaseService;
import com.rx.system.bsc.dao.EnteringMeasureDao;
import com.rx.system.bsc.service.IEnteringMeasureService;
import com.rx.system.domain.BscEnterMeasure;

/**
 * 考核参数Service实现类
 * @author chenxd
 *
 */
public class EnteringMeasureServiceImpl extends BaseService implements IEnteringMeasureService{
	
	private EnteringMeasureDao enteringMeasureDao = null;

	public void setEnteringMeasureDao(EnteringMeasureDao enteringMeasureDao) {
		this.enteringMeasureDao = enteringMeasureDao;
	}
	
	//根据参数param_id ,owner_id获取参数对象
	public List<BscEnterMeasure> getMeasureById(Map<String, Object> paramMap) throws Exception {
		return this.enteringMeasureDao.getMeasureById(paramMap);
	}
	
	//查询考核参数列表
	public List<BscEnterMeasure> listMeasure(Map<String, Object> paramMap) throws Exception {
		return this.enteringMeasureDao.listMeasure(paramMap);
	}

	//添加考核参数add by zzm
	public void addMeasure(Map<String, Object> paramMap) throws Exception {
		List<BscEnterMeasure> list =enteringMeasureDao.getMeasureById(paramMap);
		
		if(list.size()>0){
			throw new Exception("参数ID为["+paramMap.get("parameter_id")+"]的参数已存在.");
		}
		Date sys_time = new Date();
		paramMap.put("sys_time", sys_time);
		this.enteringMeasureDao.addMeasure(paramMap);
	}

	//通过id修改考核参数
	public void updateMeasure(Map<String, Object> paramMap) throws Exception {
		this.enteringMeasureDao.updateMeasure(paramMap);
	}
	
	public void examineID(Map<String, Object> paramMap) throws Exception {
		List<BscEnterMeasure> list = enteringMeasureDao.getMeasureById(paramMap);

		if (list.size() > 0) {
			throw new Exception("ID为[" + paramMap.get("measure_id") + "]的记录已存在.");
		}
	}
}
