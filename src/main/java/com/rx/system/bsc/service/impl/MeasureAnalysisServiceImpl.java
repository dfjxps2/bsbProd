package com.rx.system.bsc.service.impl;

import java.util.List;
import java.util.Map;

import com.rx.system.base.BaseService;
import com.rx.system.bsc.dao.MeasureAnalysisDao;
import com.rx.system.bsc.service.IMeasureAnalysisService;

@SuppressWarnings("unchecked")
public class MeasureAnalysisServiceImpl extends BaseService implements IMeasureAnalysisService {

	private MeasureAnalysisDao measureAnalysisDao ;

	public void setMeasureAnalysisDao(MeasureAnalysisDao measureAnalysisDao) {
		this.measureAnalysisDao = measureAnalysisDao;
	}
	
	public List listHeader(Map paramsMap) throws Exception {
		return measureAnalysisDao.listHeader(paramsMap);
	}

	public List listData(Map<String, String> paramsMap) throws Exception {
		return measureAnalysisDao.listData(paramsMap);
	}

	public List listSubData(Map<String, String> paramsMap) throws Exception {
		return measureAnalysisDao.listSubData(paramsMap);
	}

	public List listView(Map<String, String> paramsMap) throws Exception {
		return measureAnalysisDao.listView(paramsMap);
	}

}
