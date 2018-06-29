package com.rx.system.bsc.dao;

import java.util.List;
import java.util.Map;

import com.rx.system.domain.DataSource;

/**
 * 数据源操作Dao接口
 * @author chenxd
 *
 */
public interface DataSourceConfigDao {

    //添加基础数据源
    public void addDataSource(DataSource dataSource) throws Exception;

    //修改数据源信息
    public void editDataSource(DataSource dataSource) throws Exception;

    //删除数据源记录
    public void removeDataSource(String sourceId) throws Exception;

    //删除数据源与字段关系
    public void removeSourceField(String sourceId) throws Exception;

    //获取数据源列表
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
    
    public int hasSourceID(Map<String, Object> paramMap) throws Exception;
    public int hasSourceName(Map<String, Object> paramMap) throws Exception;
    public int editHasSourceName(Map<String, Object> paramMap) throws Exception;
}
