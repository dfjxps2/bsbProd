package com.rx.system.bsc.service.impl;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.Types;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.rx.system.base.BaseService;
import com.rx.system.bsc.calc.service.IDataSourceService;
import com.rx.system.bsc.dao.DataSourceConfigDao;
import com.rx.system.bsc.service.IDataSourceConfigService;
import com.rx.system.domain.DataSource;

/**
 * 数据源对象操作Service实现类
 * @author chenxd
 *
 */
public class DataSourceConfigServiceImpl extends BaseService implements IDataSourceConfigService,IDataSourceService {

    private DataSourceConfigDao dataSourceConfigDao = null;

    //添加数据源对象
    public void addDataSource(DataSource dataSource) throws Exception {
        this.dataSourceConfigDao.addDataSource(dataSource);
    }

    //编辑数据源对象
    public void editDataSource(DataSource dataSource) throws Exception {
        this.dataSourceConfigDao.editDataSource(dataSource);
    }

    //删除数据源对象
    public void removeDataSource(String sourceId) throws Exception {
        this.dataSourceConfigDao.removeDataSource(sourceId);
        this.dataSourceConfigDao.removeSourceField(sourceId);
    }

    //查询数据源对象
    public List<DataSource> listDataSource(Map<String, Object> paramMap) throws Exception {
        return this.dataSourceConfigDao.listDataSource(paramMap);
    }

    //查询数据源信息
    public DataSource getDataSourceById(String sourceId) throws Exception {
        return this.dataSourceConfigDao.getDataSourceById(sourceId);
    }

    //添加数据源字段
    public void addDataSourceField(Map<String, Object> paramMap) throws Exception {
        this.dataSourceConfigDao.addDataSourceField(paramMap);
    }

    //编辑数据源字段属性
    public void editDataSourceField(Map<String, Object> paramMap) throws Exception {
        this.dataSourceConfigDao.editDataSourceField(paramMap);
    }

    //删除数据源字段记录
    public void deleteDataSourceField(Map<String, Object> paramMap) throws Exception {
        this.dataSourceConfigDao.deleteDataSourceField(paramMap);
    }

    //查询数据源字段
    public List<Map<String, Object>> listDataSourceField(Map<String, Object> paramMap) throws Exception {
        return this.toLowerMapList(this.dataSourceConfigDao.listDataSourceField(paramMap));
    }

    //查询数据源字段 考核对象类型
    public List<Map<String, Object>> queryObjCate() throws Exception {
        return this.dataSourceConfigDao.queryObjCate();
    }

    //查询数据源字段  参数链接 数据
    public List<Map<String, Object>> queryDimLink() throws Exception {
        return this.dataSourceConfigDao.queryDimLink();
    }

    //查询字段 数据
    public List<Map<String, Object>> queryDataType() throws Exception {
        return this.dataSourceConfigDao.queryDataType();
    }

    //查询数据源总数
    public int listDataSourceCount(Map<String, Object> paramMap) throws Exception {
        return this.dataSourceConfigDao.listDataSourceCount(paramMap);
    }

    public DataSourceConfigDao getDataSourceConfigDao() {
        return dataSourceConfigDao;
    }

    public void setDataSourceConfigDao(DataSourceConfigDao dataSourceConfigDao) {
        this.dataSourceConfigDao = dataSourceConfigDao;
    }
    
    /**
     * 根据数据源表达式得到此表达式中涉及的所有--字段名、字段类型、字段数序
     * @throws Exception 
     * */
    public List<Map<String,Object>> getSorExpFields(String sql,String id) throws Exception{
    	if(null == id || "".equals(id)){
    		return null;
    	}
    	//存放结果数据
    	List<Map<String,Object>> fieldList = new ArrayList<Map<String,Object>>();
    	//构造参数得到某数据源已经存在的字段列表
    	Map<String,Object> m = new HashMap<String,Object>();
    	m.put("source_id", id);
    	Connection conn = null;
    	try{
    		conn = super.jdbcManager.getConnection();
	    	List<Map<String, Object>> exFieldList = this.toLowerMapList(this.dataSourceConfigDao.listDataSourceField(m));
	    	m.clear();
	    	for(Map<String, Object> ms : exFieldList){
	    		m.put(String.valueOf(ms.get("column_name")), ms.get("column_name"));
	    	}
	    	
	    	String fieldStr = "";
	    	//调用存储过程
	    	CallableStatement proc = null;
	    	proc = conn.prepareCall("{call usr_bsc_eng.findSQLColumns(?,?) }");
	    	proc.setString(1, sql);
	    	proc.registerOutParameter(2, Types.VARCHAR);
	    	proc.execute();
	    	fieldStr = proc.getString(2);
	    	
	    	if(null != fieldStr && !"".equals(fieldStr)){
	    		String[] fields = fieldStr.split(",");
	    		for(String field : fields){
	    			String[] fi = field.split(":");
	    			if(null != fi && fi.length == 3){
	    				if(m.containsKey(fi[0].toLowerCase())) continue;
	    				Map<String,Object> fieldMap = new HashMap<String,Object>();
	    				fieldMap.put("field_name", fi[0].toLowerCase());
	    				fieldMap.put("field_type", fi[1]);
	    				fieldMap.put("field_order", fi[2]);
	    				fieldList.add(fieldMap);
	    			}else{
	    				return null;
	    			}
	    		}
	    	}
    	}catch(Exception e){
    		throw e;
    	}finally{
    		if(null != conn){
    			conn.close();
    		}
    	}

    	return fieldList;
    }

	public boolean editHasSourceName(Map<String, Object> paramMap)
			throws Exception {
		if (this.dataSourceConfigDao.editHasSourceName(paramMap) > 0)
			return true;
		return false;
	}

	public boolean hasSourceID(Map<String, Object> paramMap) throws Exception {
		if (this.dataSourceConfigDao.hasSourceID(paramMap) > 0)
			return true;
		return false;
	}

	public boolean hasSourceName(Map<String, Object> paramMap) throws Exception {
		if (this.dataSourceConfigDao.hasSourceName(paramMap) > 0)
			return true;
		return false;
	}

}
