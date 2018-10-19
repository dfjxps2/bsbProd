package com.rx.system.bsc.dao;

import java.util.List;
import java.util.Map;

import com.rx.system.domain.DimLink;

/**
 * 数据源分组字段Dao接口
 * 
 * @author zzm
 * 
 */
public interface DimLinkDao {

	/**
	 * 添加分组字段链接
	 * 
	 * @param dimLink
	 * @throws Exception
	 */
	public void addDimLink(DimLink dimLink) throws Exception;

	/**
	 * 删除分组字段链接
	 * 
	 * @param link_id
	 * @throws Exception
	 */
	public void deleteDimLink(String link_id) throws Exception;

	/**
	 * 编辑分组字段对象
	 * 
	 * @param dimLink
	 * @throws Exception
	 */
	public void editDimLink(DimLink dimLink) throws Exception;

	/**
	 * 查询分组字段对象
	 * 
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public List<DimLink> queryDimLinkList(Map<String, Object> paramMap)
			throws Exception;

	/**
	 * 查询分组字段对象个数
	 * 
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public String queryDimLinkListCount(Map<String, Object> paramMap)
			throws Exception;
	
	/**
	 * 维护校验
	 */
	public int checkLink(Map<String,Object> paramMap) throws Exception;

	public List<Map<String, Object>> getObjectList(Map<String,Object> paramMap) throws Exception;
}
