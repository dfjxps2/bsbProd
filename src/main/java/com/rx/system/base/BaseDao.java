package com.rx.system.base;

import static com.rx.system.util.GlobalUtil.lowercaseListMapKey;
import static com.rx.system.util.GlobalUtil.lowercaseMapKey;

import java.lang.reflect.Field;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import org.apache.commons.beanutils.BeanUtils;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.TransactionCallback;
import org.springframework.transaction.support.TransactionTemplate;

import com.rx.system.util.GlobalUtil;
import com.rx.system.util.PageQueryResult;
import com.rx.system.util.PageRange;

@SuppressWarnings({ "unchecked", "deprecation" })
public abstract class BaseDao {
	
	protected JdbcTemplate jdbcTemplate;
	protected TransactionTemplate transactionTemplate;
	
	protected void execute(String sql) throws Exception {
		this.jdbcTemplate.execute(sql);
	}
	/**
	 * 带事物的执行几条sql语句
	 * 
	 * @param sqlArray
	 *            要执行的SQL语句
	 * @throws Exception
	 */
	protected void batchUpdate(final String[] sqlArray) throws Exception {
		if(sqlArray.length>0){
			Object exeRs = transactionTemplate.execute(new TransactionCallback() {
	
				public Object doInTransaction(TransactionStatus status) {
					try {
						BaseDao.this.jdbcTemplate.batchUpdate(sqlArray);
					} catch (Exception e) {
						e.printStackTrace();
						status.setRollbackOnly();
						return e;
					}
					return "success";
				}
			});
			if (!"success".equals(exeRs)) {
				Exception e = (Exception) exeRs;
				throw e;
			}
		}else{
			System.out.println("批量执行sql列表为空.");
		}
	}

	/**
	 * 带事物的执行几条sql语句
	 * 
	 * @param sqlList
	 *            要执行的SQL语句
	 * @throws Exception
	 */
	protected void batchUpdate(final List<String> sqlList) throws Exception {
		String[] sqlArray = new String[sqlList.size()];
		for (int i = 0; i < sqlList.size(); i++) {
			sqlArray[i] = sqlList.get(i);
		}
		batchUpdate(sqlArray);
	}

	/**
	 * 按sql查询结果，查询结果Map key转化成了小写
	 * 
	 * @param sql
	 *            sql语句
	 * @return
	 * @throws Exception
	 */
	protected List<Map<String, Object>> queryForList(String sql)
			throws Exception {
		return lowercaseListMapKey(this.jdbcTemplate.queryForList(sql));
	}
	/**
	 * 返回Map
	 * @param sql
	 * @return
	 */
	protected Map<String, Object> queryForMap(String sql){
		
		List<Map<String, Object>> dataList=this.jdbcTemplate.queryForList(sql);
		
		if(dataList.size()>0)
			return lowercaseMapKey(dataList.get(0));
		
		return new HashMap<String, Object>();
	}

	/**
	 * 按sql查询结果和传入的类型，返回经过类型转换的对象
	 * <br><b>推荐使用 queryForListByClass(String sql, Class cls)</b>
	 * @param sql
	 *            sql语句
	 * @param cls
	 *            需要转换成的类型
	 * @return
	 * @throws Exception
	 */
	protected List<Object> queryForList(String sql, Class cls) throws Exception {
		List<Map<String, Object>> list = lowercaseListMapKey(this.jdbcTemplate
				.queryForList(sql));
		List<Object> objList = new ArrayList<Object>();
		for (int i = 0; i < list.size(); i++) {
			Map<String, Object> map = list.get(i);
			Object obj = cls.newInstance();
			BeanUtils.populate(obj, map);
			objList.add(obj);
		}
		return objList;
	}
	/**
	 * 按sql查询结果和传入的类型，返回经过类型转换的对象
	 * <br> 
	 * 不需要类型转换
	 * @param sql
	 *            sql语句
	 * @param cls
	 *            需要转换成的类型
	 * @return
	 * @throws Exception
	 */
	protected <T> List<T> queryForListByClass(String sql, Class<T> cls) throws Exception {
		List<Map<String, Object>> list = lowercaseListMapKey(this.jdbcTemplate.queryForList(sql));
		List<T> objList = new ArrayList<T>();
		for (int i = 0; i < list.size(); i++) {
			Map<String, Object> map = list.get(i);
			T t = cls.newInstance();
			BeanUtils.populate(t, map);
			objList.add(t);
		}
		return objList;
	}
	/**
	 * 返回一个cls的object对象
	 * @param sql
	 * @param cls
	 * @return
	 * @throws Exception
	 */
	protected <T> T queryForObject(String sql,Class<T> cls)
			throws Exception {
		
		List<Map<String, Object>> list=queryForList(sql);
		
		T obj = cls.newInstance();
		if(list.size()>0){
			Map<String, Object> map=list.get(0);
			BeanUtils.populate(obj, map);
			
			return obj;
		}
		
		return null;
	}
	
	/**
	 * 将dataList转换为用于页面展示的VO对象集合
	 * @param cls
	 * @param mapping
	 * @param sql
	 * @return
	 * @throws Exception
	 */
	protected <T> List<T> populateVO(Class<T> cls, String[][] mapping,String sql)
		throws Exception{
		
		List<Map<String, Object>> dataList=this.jdbcTemplate.queryForList(sql);
		
		return populate(cls, mapping, dataList);
	}
	/**
	 * 将dataList转换为object对象集合
	 * @param cls
	 * @param mapping
	 * @param dataList
	 * @return
	 * @throws Exception
	 */
	protected <T> List<T> populate(Class<T> cls, String[][] mapping,List<Map<String, Object>> dataList)
			throws Exception {
		
		List<T> list = new ArrayList<T>();

		Field[] fields = cls.getDeclaredFields();
		List<String> trimList = new ArrayList<String>();
		for (int j = 0; j < fields.length; ++j) {
			if (fields[j].getType().getName().equals("java.lang.String"))
				trimList.add(fields[j].getName());
		}
		String[] trimArray = new String[trimList.size()];
		trimList.toArray(trimArray);

		for (int i = 0; i < dataList.size(); ++i) {
			Map<String, Object> row = dataList.get(i);

			if (mapping != null) {
				for (int j = 0; j < mapping.length; ++j) {
					row.put(mapping[j][1], row.get(mapping[j][0]));
				}
			}
			for (int j = 0; j < trimArray.length; ++j) {
				Object value = row.get(trimArray[j]);
				if (value == null)
					continue;
				row.put(trimArray[j], value.toString().trim());
			}

			T obj = cls.newInstance();
			BeanUtils.populate(obj, row);

			list.add(obj);
		}
		return list;
	}
	/**
	 *  将map转换为object对象
	 * @param cls
	 * @param mapping
	 * @param map
	 * @return
	 * @throws Exception
	 */
	protected <T> T populate(Class<T> cls, String[][] mapping, Map<String,Object> map)
			throws Exception {
		Field[] fields = cls.getDeclaredFields();
		List<String> trimList = new ArrayList<String>();
		for (int j = 0; j < fields.length; ++j) {
			if (fields[j].getType().getName().equals("java.lang.String"))
				trimList.add(fields[j].getName());
		}
		String[] trimArray = new String[trimList.size()];
		trimList.toArray(trimArray);

		if (mapping != null) {
			for (int j = 0; j < mapping.length; ++j) {
				map.put(mapping[j][1], map.get(mapping[j][0]));
			}
		}
		for (int j = 0; j < trimArray.length; ++j) {
			Object value = map.get(trimArray[j]);
			if (value == null)
				continue;
			map.put(trimArray[j], value.toString().trim());
		}

		T obj = cls.newInstance();
		BeanUtils.populate(obj, map);

		return obj;
	}
	
	/**
	 * informix查询分页
	 * @param sql
	 * @param range
	 * @return
	 * @throws Exception
	 */
	protected PageQueryResult pageQueryInInformixWay(String sql,String countSql, PageRange range) throws Exception {
		PageQueryResult pageResult = new PageQueryResult();
		
		//不支持子查询...
		int fromIndex=GlobalUtil.getIndex(sql, " ",1);//from 位置
		String fromSql=sql.substring(fromIndex);

		int totalCount = jdbcTemplate.queryForInt(countSql);
		pageResult.setTotalCount(totalCount); 
		
		String pageSql = "select skip "+range.getStart()+" first "+range.getLimit()+" "+fromSql;
		pageResult.setData(jdbcTemplate.queryForList(pageSql));
		pageResult.setStart(range.getStart());
		pageResult.setLimit(range.getLimit());
		
		return pageResult;
	}
	
	/**
	 * oracle分页查询 <br />
	 * <b>注意：这种写法只适用于Oracle，其中10g和11g测试过,其他版本在使用前请先测试</b>
	 * 
	 * @param sql
	 *            sql语句
	 * @param range
	 *            start + limit
	 * @return
	 * @throws Exception
	 */
	protected PageQueryResult pageQueryInOracleWay(String sql, PageRange range) throws Exception {
		PageQueryResult pageResult = new PageQueryResult();

		// 查询总记录数
		String totalSql = " select count(*) from (" + sql + ")" ;
		int totalCount = this.jdbcTemplate.queryForInt(totalSql);
		pageResult.setTotalCount(totalCount);

		// 查询分页数据
		String pageSql = " select * from (select rownum as frameworkRownum, t1.* from ("+sql+") t1) "
						+"where frameworkRownum between ? and ?";

		List<Map<String, Object>> dataList = this.jdbcTemplate.query(pageSql, new Object[] { range.getStart() + 1,
				range.getStart() + range.getLimit() }, new RowMapper() {

			public Object mapRow(ResultSet resultSet, int rowNum) throws SQLException {
				Map<String, Object> record = new HashMap<String, Object>();
				ResultSetMetaData metaData = resultSet.getMetaData();
				int columnCount = metaData.getColumnCount();
				for (int i = 0; i < columnCount; i++) {
					String colName = metaData.getColumnName(i + 1);
					if (colName.toLowerCase().equals("frameworkrownum")) {
						continue;
					}
					record.put(colName.toLowerCase(), resultSet.getObject(colName));
				}
				return record;
			}
		});
		pageResult.setData(dataList);
		pageResult.setStart(range.getStart());
		pageResult.setLimit(range.getLimit());
		return pageResult;
	}
	
	/**
	 * 根据对象生成Sql语句,将对象插入数据库
	 * @param tableName	表名
	 * @param bean	需要插入的对象
	 * @throws Exception
	 */
	protected void insertObject(String tableName,Object bean)throws Exception{
		String insertSql = "insert into "+tableName+" (";
		String valueSql = "values(";
		Map<String, Object> map = BeanUtils.describe(bean);
		Iterator<String> iter = map.keySet().iterator();
		while (iter.hasNext()) {
			String key = iter.next();
			if(key.equals("class"))
				continue;
			String value = GlobalUtil.getStringValue(map, key);
			if(GlobalUtil.trimToNull(value) != null){
				insertSql += key+",";
				valueSql += "'"+value+"',";
			}
		}
		if(insertSql.endsWith(","))
			insertSql = insertSql.substring(0, insertSql.lastIndexOf(","));
		
		if(valueSql.endsWith(","))
			valueSql = valueSql.substring(0, valueSql.lastIndexOf(","));
		
		String sql = insertSql+") "+valueSql+")";
		execute(sql);
	}
	
	/**
	 * 根据对象生成Sql语句,将对象插入数据库
	 * @param tableName	表名
	 * @param col_name 需要插入的列名数组
	 * @param bean	需要插入的对象
	 * @throws Exception
	 */
	protected void insertObject(String tableName,String[] col_name,Object bean)throws Exception{
		String insertSql = "insert into "+tableName+" (";
		String valueSql = "values(";
		Map<String, Object> map = BeanUtils.describe(bean);
		
		for (int i = 0; i < col_name.length; i++) {
			insertSql += col_name[i]+",";
			valueSql += "'"+GlobalUtil.getStringValue(map, col_name[i])+"',";
		}
		
		if(insertSql.endsWith(","))
			insertSql = insertSql.substring(0, insertSql.lastIndexOf(","));
		
		if(valueSql.endsWith(","))
			valueSql = valueSql.substring(0, valueSql.lastIndexOf(","));
		
		String sql = insertSql+") "+valueSql+")";
		execute(sql);
	}
	
	/**
	 * 根据对象生成Sql语句,将对象插入数据库
	 * @param tableName	表名
	 * @param col_name 不需要插入的列名数组
	 * @param bean	需要插入的对象
	 * @throws Exception
	 */
	protected void insertObjectWithOutCol(String tableName,String[] col_name,Object bean)throws Exception{
		String insertSql = "insert into "+tableName+" (";
		String valueSql = "values(";
		Map<String, Object> map = BeanUtils.describe(bean);
		for (int i = 0; i < col_name.length; i++) {
			map.remove(col_name[i]);
		}
		Iterator<String> iter = map.keySet().iterator();
		while (iter.hasNext()) {
			String key = iter.next();
			if(key.equals("class"))
				continue;
			String value = GlobalUtil.getStringValue(map, key);
			if(GlobalUtil.trimToNull(value) != null){
				insertSql += key+",";
				valueSql += "'"+value+"',";
			}
		}
		if(insertSql.endsWith(","))
			insertSql = insertSql.substring(0, insertSql.lastIndexOf(","));
		
		if(valueSql.endsWith(","))
			valueSql = valueSql.substring(0, valueSql.lastIndexOf(","));
		
		String sql = insertSql+") "+valueSql+")";
		execute(sql);
	}
	
	/**
	 * 根据对象信息修改更新数据库记录
	 * @param tableName
	 * @param bean
	 * @throws Exception
	 */
	protected void modifyObject(String tableName,String[] primaryKeys,Object bean)throws Exception{
		String updateSql = "update "+tableName+" set ";
		String whereSql = "where ";
		Map<String, Object> map = BeanUtils.describe(bean);
		for (int i = 0; i < primaryKeys.length; i++) {
			String key = primaryKeys[i];
			String value = GlobalUtil.getStringValue(map, key);
			if(i > 0)
				whereSql += "and ";
			whereSql += key+"='"+value+"' ";
			map.remove(key);
		}
		Iterator<String> iter = map.keySet().iterator();
		while (iter.hasNext()) {
			String key = iter.next();
			if(key.equals("class"))
				continue;
			String value = GlobalUtil.getStringValue(map, key);
			if(GlobalUtil.trimToNull(value) == null)
				value = "";
			
			updateSql += ","+key+"='"+value+"' ";
		}
		
		updateSql = updateSql.replaceFirst(",", "");
		
		execute(updateSql+whereSql);
	}
	
	/**
	 * 根据对象信息修改更新数据库记录
	 * @param tableName	表名
	 * @param alterColumn	修改的列名数组
	 * @param bean	实体对象
	 * @throws Exception
	 */
	protected void modifyObject(String tableName,String[] primaryKeys,String[] alterColumn,Object bean)throws Exception{
		String updateSql = "update "+tableName+" set ";
		String whereSql = "where ";
		Map<String, Object> map = BeanUtils.describe(bean);
		for (int i = 0; i < primaryKeys.length; i++) {
			String key = primaryKeys[i];
			String value = GlobalUtil.getStringValue(map, key);
			if(i > 0)
				whereSql += "and ";
			whereSql += key+"='"+value+"' ";
			map.remove(key);
		}
		for (String key : alterColumn) {
			String value = GlobalUtil.getStringValue(map, key);
			if(GlobalUtil.trimToNull(value) == null)
				value = "";
			updateSql += ","+key+"='"+value+"' ";
		}
		
		updateSql = updateSql.replaceFirst(",", "");
		
		execute(updateSql+whereSql);
	}
	
	/**
	 * 根据对象信息修改更新数据库记录	[剔除不需要修改的列]
	 * @param tableName	表名
	 * @param alterColumn	修改的列名数组
	 * @param bean	实体对象
	 * @throws Exception
	 */
	protected void modifyObjectWithOutColumn(String tableName,String[] primaryKeys,String[] noAlterColumn,Object bean)throws Exception{
		String updateSql = "update "+tableName+" set ";
		String whereSql = "where ";
		Map<String, Object> map = BeanUtils.describe(bean);
		for (int i = 0; i < primaryKeys.length; i++) {
			String key = primaryKeys[i];
			String value = GlobalUtil.getStringValue(map, key);
			if(i > 0)
				whereSql += "and ";
			whereSql += key+"='"+value+"' ";
			map.remove(key);
		}
		
		for (String noAlterKey : noAlterColumn) {
			map.remove(noAlterKey);
		}
		
		Iterator<String> iter = map.keySet().iterator();
		while (iter.hasNext()) {
			String key = iter.next();
			if(key.equals("class"))
				continue;
			String value = GlobalUtil.getStringValue(map, key);
			if(GlobalUtil.trimToNull(value) == null)
				value = "";
			
			updateSql += ","+key+"='"+value+"' ";
		}
		
		updateSql = updateSql.replaceFirst(",", "");
		
		execute(updateSql+whereSql);
	}
	
	/**
	 * 查询返回整数的sql如sum()
	 */
	protected int queryForInt(String sql) throws Exception {
		return this.jdbcTemplate.queryForInt(sql);
	}
	
	public void setDataSource(DataSource dataSource) {
		this.jdbcTemplate = new JdbcTemplate(dataSource);
	}

	public JdbcTemplate getJdbcTemplate() {
		return jdbcTemplate;
	}

	public TransactionTemplate getTransactionTemplate() {
		return transactionTemplate;
	}

	public void setTransactionTemplate(TransactionTemplate transactionTemplate) {
		this.transactionTemplate = transactionTemplate;
	}
}
