package com.rx.system.dao;

import java.util.List;
import java.util.Map;

import com.rx.system.domain.Resource;

/**
 * 初始页Dao接口
 * @author chenxd
 *
 */
public interface InitDao {
	/**
	 * 查询最近一年得分趋势
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> listYearSocre(Map<String, Object> paramMap) throws Exception;
	
	/**
	 * 查询最近一年排名趋势
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> listYearOrder(Map<String, Object> paramMap) throws Exception;
	
	/**
	 * 获取衡量指标趋势
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> listMeasureValue(Map<String, Object> paramMap) throws Exception;
	
	/**
	 * 查询登录用户初始页链接
	 * */
	public List<Map<String, Object>> queryInitUrl(Map<String,Object> paramMap) throws Exception;
	
	
	public List<Resource> getCurrentUserResourceList(Map<String,Object> paramMap) throws Exception;
	
	/**
	 * 2013-10-24增加用户,机构,初始页关系表,此方法弃用
	 * @param paramMap
	 * @throws Exception
	 */
	public void updateUserDefaultInitPage(Map<String,Object> paramMap) throws Exception;
	
	/**
	 * 2013-10-24增加用户,机构,初始页关系表 bsc_user_dft_page
	 * 删除用户初始页
	 * @param paramMap
	 * @throws Exception
	 */
	public void deleteUserInitPage(Map<String, Object> paramMap) throws Exception;
	
	/**
	 * 2013-10-24增加用户,机构,初始页关系表 bsc_user_dft_page
	 * 增加用户初始页
	 * @param paramMap
	 * @throws Exception
	 */
	public void addUserInitPage(Map<String, Object> paramMap) throws Exception;
}
