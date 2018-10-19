package com.rx.system.bsc.service.impl;

import java.util.HashMap;
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

		//插入统计方案维度表数据
		this.addProjectStatOjbect(paramMap);

		//插入统计方案周期表数据
		this.addProjectStatCycle(paramMap);
		
		this.refreshProjectObjects((String)paramMap.get("project_id")); //刷新方案下的对象
	}


	/*
		统计方案维度表
		"Family_Type_Cd" -> "01,02,"
	 */
	public void addProjectStatOjbect(Map<String, Object> paramMap) throws Exception {
		String objKey = paramMap.get("obj_link_id").toString();
		paramMap = this.getSourceExpressionByLinkID(paramMap);
		String sourceExpress = paramMap.get("sourceExp").toString();
		String  project_id = paramMap.get("project_id").toString();
		String  id_field = paramMap.get("id_field").toString();
		String  label_field = paramMap.get("label_field").toString();
		String statObj = paramMap.get(objKey).toString();
		StringBuffer sb  = new StringBuffer ();
		if(null != statObj && !"".equals(statObj)){
			String objVal = getStringById(statObj);
			String sourceExp = sourceExpress.concat(" WHERE ").concat(paramMap.get("id_field").toString());
			String table = sourceExp.concat(" IN ("+objVal+")");
			paramMap.put("table",table);
			sb.append(" SELECT  '"+project_id+"' , "+id_field+", "+label_field+" ");
			sb.append(" FROM ( "+table+") ");
		}else{
			sb.append(" SELECT  '"+project_id+"' , "+id_field+", "+label_field+" ");
			sb.append(" FROM ( "+sourceExpress+") ");
		}
		String sql  = sb.toString();
		paramMap.put("sql",sql);

		//统计方案维度表
		this.bscProjectDao.addProjectStatOjbect(paramMap);
	}

	/*
	  通過 link_id查詢数据源表达式
	 */
	public Map<String, Object>  getSourceExpressionByLinkID(Map<String, Object> paramMap) throws Exception{
		String objKey = paramMap.get("obj_link_id").toString();
		List<Map<String, Object>> linkList = this.bscProjectDao.getSourceExpressionByLinkID(objKey);
		Map<String, Object> dataMap = linkList.get(0);
		paramMap.put("label_field",dataMap.get("LABEL_FIELD"));
		paramMap.put("id_field",dataMap.get("ID_FIELD"));
		paramMap.put("sourceExp",dataMap.get("SOURCE_EXPRESSION"));
		return paramMap;
	}


      /*
		统计方案周期表
		 "stat_cycle_cd" -> "2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,"
	 */

	public void addProjectStatCycle(Map<String, Object> paramMap) throws Exception {
		String statCyc = paramMap.get("stat_cycle_cd").toString();
		String  project_id = paramMap.get("project_id").toString();
		StringBuffer sb  = new StringBuffer();
		if(null != statCyc && !"".equals(statCyc)){
			String cycles = getStringById(statCyc);
			sb.append(" SELECT STAT_CYCLE_CD AS cycle_id,STAT_CYCLE_DESC AS cycle_name ");
			sb.append(" FROM BSC_STAT_CYCLE_YEAR ");
			sb.append(" WHERE STAT_CYCLE_CD IN ("+cycles+") ");
		}else{
			sb.append(" SELECT STAT_CYCLE_CD AS cycle_id,STAT_CYCLE_DESC AS cycle_name ");
			sb.append(" FROM BSC_STAT_CYCLE_YEAR ");
		}
		String subQuery = sb.toString();
		String sql=" SELECT  '"+project_id+"' , a.cycle_id, a.cycle_name  FROM ( "+subQuery+") a ";
		paramMap.put("sql",sql);
		//统计方案周期表
		this.bscProjectDao.addProjectStatCycle(paramMap);
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
		//删除统计方案维度表
		this.bscProjectDao.removeProjectStatOjbect(paramMap);
		//删除统计方案周期表
		this.bscProjectDao.removeProjectStatCycle(paramMap);
		//插入统计方案维度表数据
		this.addProjectStatOjbect(paramMap);
		//插入统计方案周期表数据
		this.addProjectStatCycle(paramMap);
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
		//删除统计方案维度表
		this.bscProjectDao.removeProjectStatOjbect(paramMap);
		//删除统计方案周期表
		this.bscProjectDao.removeProjectStatCycle(paramMap);
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
		//复制统计方案维度表数据
		bscProjectDao.copyProjectStatOjbect(paramMap);
		//复制统计方案周期表数据
		bscProjectDao.copyProjectStatCycle(paramMap);
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

	/*
	   查询下拉框值
	 */
	@Override
	public Map<String, String> getDimDataDS(Map<String, Object> paramMap) throws Exception {
		String projectId = paramMap.get("project_id").toString();
        Map<String,String> dataMap  = new HashMap<String, String>();
		List<Map<String, Object>> cycDataList = this.bscProjectDao.getDimCycDataDS(projectId);
		String cycDatas = getStringByOjbect(cycDataList);
		List<Map<String, Object>> objDataList = this.bscProjectDao.getDimObjDataDS(projectId);
		String objDatas = getStringByOjbect(objDataList);
		dataMap.put("cycs",cycDatas);
		dataMap.put("objs",objDatas);
		return dataMap;
	}



	public static String getStringById(String id){
		String [] ids = id.split(",");
		String meaId = "";
		for(String str :ids){
			meaId += "'"+str+"'".concat(",");
		}
		meaId = meaId.lastIndexOf(",")>-1?meaId.substring(0,meaId.length() - 1):meaId;
		return meaId;
	}

	public  String getStringByOjbect(List<Map<String, Object>> dataList){
		String ids = "";
		for(Map<String, Object> mp :dataList){
			ids += getStringValue(mp, "KEY").concat(".");
		}
		ids = ids.lastIndexOf(".")>-1?ids.substring(0,ids.length() - 1):ids;
		return ids;
	}


}
