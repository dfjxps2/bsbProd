package com.rx.system.bsc.service;

import java.util.List;
import java.util.Map;

import com.rx.system.domain.DataSource;

/**
 * 数据源对象操作Service接口
 * @author chenxd
 *
 */
public interface IDataSourceConfigService {

    //添加数据源对象
    public void addDataSource(DataSource dataSource) throws Exception;

    //编辑数据源对象
    public void editDataSource(DataSource dataSource) throws Exception;

    //删除数据源对象
    public void removeDataSource(String sourceId) throws Exception;

    //查询数据源对象
    public List<DataSource> listDataSource(Map<String, Object> paramMap) throws Exception;

    //查询数据源信息
    public DataSource getDataSourceById(String sourceId) throws Exception;

    //添加数据源字段
    public void addDataSourceField(Map<String, Object> paramMap) throws Exception;

    //编辑数据源字段属性
    public void editDataSourceField(Map<String, Object> paramMap) throws Exception;

    //删除数据源字段记录
    public void deleteDataSourceField(Map<String, Object> paramMap) throws Exception;

    //查询数据源字段
    public List<Map<String, Object>> listDataSourceField(Map<String, Object> paramMap) throws Exception;

    //查询考核对象类型
    public List<Map<String, Object>> queryObjCate() throws Exception;

    //查询参数链接 数据
    public List<Map<String, Object>> queryDimLink() throws Exception;

    //查询字段 数据
    public List<Map<String, Object>> queryDataType() throws Exception;

    //查询数据源总数
    public int listDataSourceCount(Map<String, Object> paramMap) throws Exception;
    
    /**
     * 根据数据源表达式得到此表达式中涉及的所有--字段名、字段类型、字段数序
     * */
    public List<Map<String,Object>> getSorExpFields(String sql,String id) throws Exception;
    
    public boolean hasSourceID(Map<String, Object> paramMap) throws Exception;
    public boolean hasSourceName(Map<String, Object> paramMap) throws Exception;
    public boolean editHasSourceName(Map<String, Object> paramMap) throws Exception;
}
