package com.rx.system.bsc.calc.service;

/**
 * 数据源接口
 * @author chenxd
 *
 */
public interface IDataSource {
	
	/**
	 * 获取数据源对象列名称
	 * @return
	 * @throws Exception
	 */
	public String getObjColumnName();
	
	/**
	 * 获取数据源表达式
	 * @return
	 */
	public String getExpression();
	
}
