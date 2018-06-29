package com.rx.system.bsc.service.impl;

import java.util.List;
import java.util.Map;

import com.rx.system.base.BaseService;
import com.rx.system.bsc.dao.ScoreWeightDao;
import com.rx.system.bsc.service.IScoreWeightService;

public class ScoreWeightServiceImpl extends BaseService implements IScoreWeightService {
	
	private static String totalNum = "0";
	
	private ScoreWeightDao scoreWeightDao = null;

	public void setScoreWeightDao(ScoreWeightDao scoreWeightDao) {
		this.scoreWeightDao = scoreWeightDao;
	}

	public List<Map<String, Object>> queryObject(Map<String, Object> map)
			throws Exception {
		totalNum = this.scoreWeightDao.getTotalNum(map);
		return this.scoreWeightDao.queryObject(map);
	}

	public List<Map<String, Object>> queryProject(Map<String, Object> map)
			throws Exception {
		
		return this.scoreWeightDao.queryProject(map);
	}

	public List<Map<String, Object>> queryMeasure(Map<String, Object> map)
			throws Exception {
		
		return this.scoreWeightDao.queryMeasure(map);
	}

	public void scoreWeightModify(Map<String, Object> map) throws Exception {
		this.scoreWeightDao.deleteScoreWeight(map);
		this.scoreWeightDao.saveScoreWeight(map);
		
	}

	public void modifyParam(Map<String, Object> map) throws Exception {
		this.scoreWeightDao.deleteParamValue(map);
		this.scoreWeightDao.saveParamValue(map);
		
	}

	public List<Map<String, Object>> queryParam(Map<String, Object> map)
			throws Exception {
		// TODO Auto-generated method stub
		return toLowerMapList(this.scoreWeightDao.queryParam(map));
	}

	public String getTotalNum() throws Exception {
		// TODO Auto-generated method stub
		return totalNum;
	}

}
