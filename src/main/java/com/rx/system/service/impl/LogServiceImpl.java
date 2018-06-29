package com.rx.system.service.impl;

import java.util.List;
import java.util.Map;

import com.rx.system.base.BaseService;
import com.rx.system.dao.LogDao;
import com.rx.system.service.ILogService;
/**
 * 日志查询接口实现类
 * @Author: mabo
 * @Date: Oct 8, 2013
 */
public class LogServiceImpl extends BaseService implements ILogService {
	
	private LogDao logDao;
	public void setLogDao(LogDao logDao) {
		this.logDao = logDao;
	}

	public List<Map<String, Object>> queryList(Map<String, Object> paramMap)
			throws Exception {
		return toLowerMapList(logDao.queryList(paramMap));
	}

	public int queryListCount(Map<String, Object> paramMap) throws Exception {
		return logDao.queryListCount(paramMap);
	}

	public List<Map<String, Object>> queryDetail(Map<String, Object> paramMap)
			throws Exception {
		paramMap.put("session_id", "".equals(paramMap.get("queryInfo"))?"":paramMap.get("queryInfo").toString().split("_")[0]);
		paramMap.put("begin_time", "".equals(paramMap.get("queryInfo"))?"":paramMap.get("queryInfo").toString().split("_")[1]);
		return toLowerMapList(logDao.queryDetail(paramMap));
	}
}
