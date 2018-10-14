package com.rx.system.bsc.service.impl;

import java.util.List;
import java.util.Map;

import com.rx.system.base.BaseService;
import com.rx.system.bsc.dao.BscProjectDao;
import com.rx.system.bsc.service.IBscProjectService;
import com.rx.system.util.CommonUtil;
import com.rx.system.util.GlobalUtil;

/**
 * 平衡计分卡方案定义Service实现类
 * @author zzm
 *
 */
public class BscProjectServiceImpl extends BaseService implements IBscProjectService {
	
	private BscProjectDao bscProjectDao = null;
	
	/**
	 * 根据方案ID和方案的对象维度，刷新方案所属的对象列表
	 * @param projectID
	 * @return
	 * @throws Exception
	 */
	public void refreshProjectObjects(String projectID) throws Exception{
		String sql = "select a.id_field,a.label_field,a.source_expression as src_sql from bsc_dim_link a, bsc_project b" +
				" where a.link_id = b.obj_link_id and b.project_id = '"+ projectID +"'";

		@SuppressWarnings("unchecked")
		List<Map<String, Object>> objDimLinkList = this.jdbcManager.queryForList(sql);
		
		
		Map<String, Object> map = GlobalUtil.lowercaseMapKey(objDimLinkList.get(0));
		
		String idField 		= (String) map.get("id_field");
		String labelField 	= (String) map.get("label_field");
		String src_sql 		= (String) map.get("src_sql");
		
		
		StringBuilder command = new StringBuilder();
		command.append("insert into bsc_proj_obj(");
		command.append("project_id,");
		command.append("object_id,");
		command.append("object_name");
		command.append(")select");
		command.append("'"+ projectID +"',");
		command.append(idField + ",");
		command.append(labelField);
		command.append(" from (" + src_sql + ") s");
		
		this.jdbcManager.execute("delete from bsc_proj_obj where project_id = '" + projectID + "'");
		this.jdbcManager.execute(command.toString());
	}
	
	/**
	 * 查询平衡计分卡方案定义列表
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> listProject(Map<String, Object> paramMap) throws Exception {
		return toLowerMapList(this.bscProjectDao.listProject(paramMap));
	}
	
	/**
	 * 查询平衡计分卡方案已执行月份列表
	 * 
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> listExecutedMonth(Map<String, Object> paramMap) throws Exception {
		List<Map<String, Object>> dataList = toLowerMapList(this.bscProjectDao.listExecutedMonth(paramMap));
		for (Map<String, Object> map : dataList) {
			String month_id = getStringValue(map, "month_id");
			String month_name = "";
			if(month_id.length()==4){
				month_name = month_id+"年";
			}else {
				month_name = month_id.substring(0, 4)+"年"+month_id.substring(4)+"月";
			}
			map.put("month_name", month_name);
		}
		return dataList;
	}
	
	/**
	 * 添加平衡计分卡方案
	 * @param paramMap
	 * @throws Exception
	 */
	public void addProject(Map<String, Object> paramMap) throws Exception {
		paramMap.put("project_id", CommonUtil.getRandomID(18));
		
		if(this.bscProjectDao.getProjectCountByName(paramMap) > 0)
			throw new Exception("机构下存在同名方案,请修改方案名称!");
		
		this.bscProjectDao.addProject(paramMap);
		
		this.refreshProjectObjects((String)paramMap.get("project_id")); //刷新方案下的对象
	}
	
	/**
	 * 编辑平衡计分卡方案
	 * @param paramMap
	 * @throws Exception
	 */
	public void editProject(Map<String, Object> paramMap) throws Exception {
		if(this.bscProjectDao.getProjectCountByName(paramMap) > 0)
			throw new Exception("机构下存在同名方案,请修改方案名称!");
		
		this.bscProjectDao.editProject(paramMap);
		this.refreshProjectObjects((String)paramMap.get("project_id")); //刷新方案下的对象
	}
		
	/**
	 * 停用平衡计分卡方案
	 * @param paramMap
	 * @throws Exception
	 */
	public void deleteProject(Map<String, Object> paramMap) throws Exception {
		this.bscProjectDao.updateProjectStatus(paramMap);//删除平衡计分卡方案
	}
	
	/**
	 * 删除平衡计分卡方案
	 * @param paramMap
	 * @throws Exception
	 */
	public void dropProject(Map<String, Object> paramMap) throws Exception {
		if(this.bscProjectDao.getPublishedCount(paramMap) > 0)
			throw new Exception("方案存在已经发布的结果数据,不能删除!");
		//通过存储过程 删除与方案关联的所有数据
		this.jdbcManager.execute(" call usr_bsc_eng.dropProjectCascade('"+ paramMap.get("project_id") +"')");
	}

	/**
	 * 方案下达
	 * @param paramMap
	 * @throws Exception
	 */
	public void doPublish(Map<String, Object> paramMap) throws Exception {
		this.bscProjectDao.doPublish(paramMap);
	}
	
	public void setBscProjectDao(BscProjectDao bscProjectDao) {
		this.bscProjectDao = bscProjectDao;
	}

	public void copyProject(Map<String, Object> paramMap) throws Exception {
		paramMap.put("new_project_id", CommonUtil.getRandomID(18));
		
		this.jdbcManager.execute(" call usr_bsc_eng.copyProject('"+paramMap.get("old_project_id")+"','"+paramMap.get("new_project_id")+"','"+paramMap.get("new_project_name")+"','"+paramMap.get("owner_id")+"')");
	}
	
	/**
	 * 查询方案执行情况
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> listExeInfo(Map<String, Object> paramMap) throws Exception {
		List<Map<String, Object>> list = toLowerMapList(this.bscProjectDao.listExeInfo(paramMap));
		for (Map<String, Object> map : list) {
			String month_id = getStringValue(map, "month_id");
			String month_name = month_id.substring(0, 4)+"年"+month_id.substring(4)+"月";
			map.put("month_name", month_name);
		}
		return list;
	}
	
	public int listExeInfoCount(Map<String, Object> paramMap) throws Exception {
		return this.bscProjectDao.listExeInfoCount(paramMap);
	}
	/**
	 * 查询分配关系
	 */
	public boolean hasRelation(Map<String, Object> paramMap) throws Exception {
		if(this.bscProjectDao.hasRelation(paramMap)>0)
			return true;
		return false;
	}

	public boolean getProjectNameById(Map<String, Object> paramMap)
			throws Exception {
		return this.bscProjectDao.getProjectCountByName(paramMap)>0?true:false;
	}
	
	/*
	 * 查询平衡计分卡方案（通过方案编号）已执行指标名称列表
	 * (non-Javadoc)
	 * @see com.rx.system.bsc.service.IBscProjectService#listExecutedIndex(java.util.Map)
	 */
	@Override
	public List<Map<String, Object>> listExecutedIndex(
			Map<String, Object> paramMap) throws Exception {
		List<Map<String, Object>> dataList = toLowerMapList(this.bscProjectDao.listExecutedIndex(paramMap));
		return dataList;
	}

}
