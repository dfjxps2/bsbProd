package com.rx.system.bsc.service;

import java.util.List;
import java.util.Map;

/**
 * 平衡计分卡结果查看Service接口
 * @author chenxd
 *
 */
@Deprecated
public interface IBscCardService {
	
	/**
	 * 查询机构平衡计分卡考核结果
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> queryOrgCardResult(Map<String, Object> paramMap) throws Exception;
	
	/**
	 * 查询机构平衡计分卡考核结果----机构列表
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> queryOrgList(Map<String, Object> paramMap) throws Exception;
	
	/**
	 * 查询机构平衡计分卡对象结果明细
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> queryOrgStatusDetail(Map<String, Object> paramMap) throws Exception;
	
	/**
	 * 查询机构平衡计分卡对象结果明细---对象列表
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> queryOrgStatusDetailObjList(Map<String, Object> paramMap) throws Exception;
	
	/**
	 * 查询机构平衡计分卡对象结果明细记录数
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public String queryOrgStatusDetailCount(Map<String, Object> paramMap) throws Exception;
	
	/**
	 * 查询对象平衡计分卡考核结果
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> queryCardResult(Map<String, Object> paramMap) throws Exception;
	
	/**
	 * 查询指标公式的明细值
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public Map<String, Object> getFormulaDetail(Map<String, Object> paramMap) throws Exception;
	
	/**
	 * 查询对象计分卡结果信息
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> queryInfo(Map<String, Object> paramMap) throws Exception;
	
}
