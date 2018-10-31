package com.rx.system.bsc.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.rx.system.base.BaseService;
import com.rx.system.bsc.dao.DimLinkDao;
import com.rx.system.bsc.service.IDimLinkService;
import com.rx.system.domain.DimLink;

/**
 * 数据源分组字段Service实现类
 * 
 * @author zzm
 * 
 */
@SuppressWarnings("unchecked")
public class DimLinkServiceImpl extends BaseService implements IDimLinkService {

	private DimLinkDao dimLinkDao = null;

	/**
	 * 注入DimLinkDao
	 * 
	 * @param dimLinkDao
	 */
	public void setDimLinkDao(DimLinkDao dimLinkDao) {
		this.dimLinkDao = dimLinkDao;
	}

	/**
	 * 添加分组字段链接
	 */
	public void addDimLink(DimLink dimLink) throws Exception {
		this.dimLinkDao.addDimLink(dimLink);
	}

	/**
	 * 删除分组字段链接
	 */
	public void deleteDimLink(String link_id) throws Exception {
		this.dimLinkDao.deleteDimLink(link_id);
	}

	/**
	 * 编辑分组字段对象
	 */
	public void editDimLink(DimLink dimLink) throws Exception {
		this.dimLinkDao.editDimLink(dimLink);
	}

	/**
	 * 查询分组字段对象
	 */
	public List<DimLink> queryDimLinkList(Map<String, Object> paramMap)
			throws Exception {
		return this.dimLinkDao.queryDimLinkList(paramMap);
	}

	/**
	 * 查询分组字段对象个数
	 */
	public String queryDimLinkListCount(Map<String, Object> paramMap)
			throws Exception {
		return this.dimLinkDao.queryDimLinkListCount(paramMap);
	}

	/**
	 * 查询分组字段明细列表
	 */
	public List<Map<String, Object>> queryFieldDetail(DimLink dimLink)
			throws Exception {
		List<Map<String, Object>> list = this.jdbcManager.queryForList(dimLink.getSource_expression());
		for (int i = 0; i < list.size(); i++) {
			Map<String, Object> map = list.get(i);
			map.put("display_field", getStringValue(map, dimLink.getLabel_field()));
			map.put("value_field", getStringValue(map, dimLink.getId_field()));
		}
		return list;
	}

	/**
	 * 显示树形查询
	 */
	public List<Map<String, Object>> queryForDimTree(Map paramsMap)
			throws Exception {
		String rootValue = (String) paramsMap.get("nodeId");
		String linkId = (String) paramsMap.get("linkId");

		List<Map<String, Object>> list = this.jdbcManager
				.queryForList("select * from bsc_dim_link where link_id = '"
						+ linkId + "'");
		if(null == list || list.size() == 0){
			return null;
		}
		Map map = (Map) list.get(0);
		String sourceExpression = (String) map.get("source_expression");
		String parentIdField = (String) map.get("parent_id_field");
		String idField = (String) map.get("id_field");
		String labelField = (String) map.get("label_field");
		String sql = "";
		if (sourceExpression.indexOf("where") == -1) {
			sql = sourceExpression + " " + " where " + parentIdField + " = '"
					+ rootValue + "' order by " + idField;
		}
		else {
			sql = sourceExpression + " " + " and " + parentIdField + " = '"
					+ rootValue + "' order by " + idField;
		}

		List dimlist = jdbcManager.queryForList(sql);
		List resultList = new ArrayList();
		for (int i = 0; i < dimlist.size(); i++) {
			Map p = (Map) dimlist.get(i);
			Map newMap = new HashMap();
			newMap.put("id", p.get(idField));
			newMap.put("name", p.get(labelField));
			resultList.add(newMap);
		}
		return this.toLowerMapList(resultList);
	}

	/**
	 * 查询rootName
	 */
	public List<Map<String, Object>> findRootName(Map<String, String> paramsMap)
			throws Exception {
		String linkId = (String) paramsMap.get("linkId");

		List<Map<String, Object>> list = this.jdbcManager
				.queryForList("select * from bsc_dim_link where link_id = '"
						+ linkId + "'");
		if(null == list || list.size() == 0){
			return null;
		}
		
		Map map = (Map) list.get(0);
		String sourceExpression = (String) map.get("source_expression");
		String parent_id_field = (String) map.get("parent_id_field");
		String labelField = (String) map.get("label_field");
		String rootValue = (String) map.get("root_value");

		String sql = "";
		if (sourceExpression.indexOf("where") == -1) {
			sql = sourceExpression + " " + " where " + parent_id_field + " = '"
					+ rootValue + "' ";
		}
		else {
			sql = sourceExpression + " " + " and " + parent_id_field + " = '"
					+ rootValue + "'";
		}

		List dimlist = jdbcManager.queryForList(sql);
		List resultList = new ArrayList();
		for (int i = 0; i < dimlist.size(); i++) {
			Map p = (Map) dimlist.get(i);
			Map newMap = new HashMap();
			newMap.put("id", p.get(parent_id_field));
			newMap.put("text", p.get(labelField));
			resultList.add(newMap);
		}

		return this.toLowerMapList(resultList);
	}

	public int checkLink(Map<String, Object> paramMap) throws Exception {
		
		return this.dimLinkDao.checkLink(paramMap);
	}

	@Override
	public List<Map<String, Object>> getObjectList(Map<String, Object> paramMap) throws Exception {
		return	this.toLowerMapList(this.dimLinkDao.getObjectList(paramMap));
	}

}
