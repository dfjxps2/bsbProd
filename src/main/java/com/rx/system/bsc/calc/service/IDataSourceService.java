package com.rx.system.bsc.calc.service;
/**
 * 数据源操作对象
 * @author chenxd
 *
 */
public interface IDataSourceService {
	
	/**
	 * 根据数据源ID获取数据源对象
	 * @param sourceId
	 * @return
	 * @throws Exception
	 */
	public IDataSource getDataSourceById(String sourceId) throws Exception;
	
}
