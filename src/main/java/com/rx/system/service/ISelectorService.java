package com.rx.system.service;

import java.util.List;
import java.util.Map;

public interface ISelectorService {
	
	//查询List
	public List<Map<String, Object>> queryForList(String sql) throws Exception;
	
	//执行Sql
	public void execute(String sql) throws Exception;
}
