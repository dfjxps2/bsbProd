package com.rx.system.bsc.calc.service;

import java.util.List;

/**
 * 考核指标接口
 * @author chenxd
 *
 */
public interface IMeasure {
	
	/**
	 * 结果集为一行记录时的虚拟对象列名
	 * */
	public String OBJ_NAME_SCALE_MEASURE 	= "SCALE_MEA";
	
	/**
	 * 基础指标，即指标数据源为数据库
	 * */
	public String SOURCE_TYPE_DATASOURCE 	= "00";
	
	/**
	 * 复合指标，即指标数据源为公式运算结果
	 * */
	public String SOURCE_TYPE_COMPOUND 		= "01";
	
	/**
	 * 外部指标，即指标数据源为外部导入数据
	 * */
	public String SOURCE_TYPE_EXTERNAL 		= "02";
	
	/**
	 * 目录指标，即指标没有数据源，仅用于分类
	 * */
	public String SOURCE_TYPE_FOLDER 		= "03";
	
	public String getMeasureId();
	public String getMeasureName();
	public String getSourceTypeId();
	public String getResultTypeId();
	public String getSourceId();
	public String getFormula();
	
	/**
	 * @return 获取基础指标的数据源字段，其他指标返回null
	 * */
	public String getDatasourceColumn();
	
	/**
	 * @return 获取基础指标的数据源过滤条件列表，其他指标返回null<br>
	 * 过滤条件的格式为<i><字段名></i>:<i><值1></i>,...,<i><值n></i>
	 * */
	public List<String> getDatasourceFilters();
	
	/**
	 * @return 获取指标公式中引用的参数
	 * */
	public List<String> getParams();
	
	/**
	 * @return 获取指标公式中引用的指标
	 * */
	public List<String> getReferMeasure();
	
}
