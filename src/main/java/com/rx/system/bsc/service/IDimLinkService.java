package com.rx.system.bsc.service;

import java.util.List;
import java.util.Map;

import com.rx.system.domain.DimLink;

/**
 * 数据源分组字段Service接口
 * 
 * @author zzm
 * 
 */
public interface IDimLinkService {

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
	 * 查询分组字段明细列表
	 * 
	 * @param dimLink
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> queryFieldDetail(DimLink dimLink)
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
	 * 查询树形
	 * 
	 * @param paramsMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> queryForDimTree(
			Map<String, String> paramsMap) throws Exception;

	/**
	 * 查询RootName
	 * 
	 * @param paramsMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> findRootName(Map<String, String> paramsMap)
			throws Exception;
	/**
	 * 维护校验
	 */
	public int checkLink(Map<String,Object> paramMap) throws Exception;



	public List<Map<String, Object>> getObjectList(Map<String,Object> paramMap) throws Exception;
}
