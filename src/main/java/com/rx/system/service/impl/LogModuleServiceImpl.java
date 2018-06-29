package com.rx.system.service.impl;

import java.util.List;
import java.util.Map;

import com.rx.system.base.BaseService;
import com.rx.system.dao.LogModuleDao;
import com.rx.system.service.ILogModuleService;

public class LogModuleServiceImpl extends BaseService implements
		ILogModuleService {
	private LogModuleDao logModuleDao;
	public void setLogModuleDao(LogModuleDao logModuleDao) {
		this.logModuleDao = logModuleDao;
	}


	public List<Map<String, Object>> queryModuleInfo(
			Map<String, Object> paramMap) throws Exception {
		return toLowerMapList(this.logModuleDao.queryModuleInfo(paramMap));
	}


	public List<Map<String, Object>> queryInstant(Map<String, Object> paramMap)
			throws Exception {
		return toLowerMapList(this.logModuleDao.queryInstant(paramMap));
	}

}
