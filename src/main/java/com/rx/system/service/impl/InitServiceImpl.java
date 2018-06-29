package com.rx.system.service.impl;

import java.util.List;
import java.util.Map;

import com.rx.system.base.BaseService;
import com.rx.system.dao.InitDao;
import com.rx.system.domain.Resource;
import com.rx.system.service.IInitService;
import com.rx.util.tree.TreeStore;
/**
 * 初始页service实现类
 * @author chenxd
 *
 */
public class InitServiceImpl extends BaseService implements IInitService {
	
	private InitDao initDao = null;
	
	/**
	 * 查询最近一年得分趋势
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> listYearSocre(Map<String, Object> paramMap) throws Exception {
		List<Map<String, Object>> list = toLowerMapList(this.initDao.listYearSocre(paramMap));
		setMonthName(list);
		return list;
	}
	
	/**
	 * 查询最近一年排名趋势
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> listYearOrder(Map<String, Object> paramMap) throws Exception {
		List<Map<String, Object>> list = toLowerMapList(this.initDao.listYearOrder(paramMap));
		setMonthName(list);
		return list;
	}
	
	/**
	 * 获取衡量指标趋势
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> listMeasureValue(Map<String, Object> paramMap) throws Exception {
		return toLowerMapList(this.initDao.listMeasureValue(paramMap));
	}
	
	private void setMonthName(List<Map<String, Object>> list) throws Exception {
		for (Map<String, Object> map : list) {
			String label = getStringValue(map, "label");
			label = label.substring(0, 4)+"年"+label.substring(4)+"月";
			map.put("label", label);
		}
	}
	/**
	 * 查询登录用户初始页
	 * @throws Exception 
	 * */
	public String[] queryInitUrl(Map<String,Object> paramMap) throws Exception{
		String[] urls = new String[2];
		List<Map<String, Object>> list = this.toLowerMapList(this.initDao.queryInitUrl(paramMap));
		if(null == list || list.size() != 1){
			return null;
		}
		Map<String,Object> map = list.get(0);
		urls[0] = String.valueOf(map.get("resource_name"));
		urls[1] = String.valueOf(map.get("default_page"));
		return urls;
	}
	
	public TreeStore getCurrentUserResourceList(Map<String,Object> paramMap) throws Exception{
		TreeStore resourceStore = new TreeStore();
		List<Resource> list = this.initDao.getCurrentUserResourceList(paramMap);
		for(Resource re : list){
			resourceStore.addTreeNode(re);
		}
		return resourceStore;
	}
	
	public void updateUserDefaultInitPage(Map<String,Object> paramMap) throws Exception{
		this.initDao.deleteUserInitPage(paramMap);
		this.initDao.addUserInitPage(paramMap);
//		this.initDao.updateUserDefaultInitPage(paramMap);
	}
	
	public void setInitDao(InitDao initDao) {
		this.initDao = initDao;
	}
}
