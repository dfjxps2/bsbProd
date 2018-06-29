package com.rx.system.service.impl;

import java.util.List;
import java.util.Map;

import com.rx.system.base.BaseService;
import com.rx.system.service.ISelectorService;

public class SelectorServiceImpl extends BaseService implements ISelectorService {
	
	//执行Sql
	public void execute(String sql) throws Exception {
		this.jdbcManager.execute(sql);
	}
	
	//查询SQL返回List
	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> queryForList(String sql) throws Exception {
		return this.toLowerMapList(this.jdbcManager.queryForList(sql));
	}

}
