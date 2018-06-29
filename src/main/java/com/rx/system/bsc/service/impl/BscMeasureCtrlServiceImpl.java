package com.rx.system.bsc.service.impl;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import com.rx.system.base.BaseService;
import com.rx.system.bsc.dao.BscCtrlMeasureDao;
import com.rx.system.bsc.service.IBscMeasureCtrlService;
/**
 * 平衡计分卡考核指标维护Service实现类
 * @author chenxd
 *
 */
public class BscMeasureCtrlServiceImpl extends BaseService implements IBscMeasureCtrlService {
	
	private BscCtrlMeasureDao bscCtrlMeasureDao = null;
	
	/**
	 * 添加bsc考核指标
	 * @param paramMap
	 * @throws Exception
	 */
	public void addBscMeasure(Map<String, Object> paramMap) throws Exception {
		String project_id = getStringValue(paramMap, "project_id");
		
		this.bscCtrlMeasureDao.addBscMeasure(paramMap);
		
		//维护方案与指标的关系
		refreshProjectAllMeasure(project_id);
	}
	
	
	/**
	 * 编辑bsc考核指标
	 * @param paramMap
	 * @throws Exception
	 */
	public void editBscMeasure(Map<String, Object> paramMap) throws Exception {
		String project_id = getStringValue(paramMap, "project_id");
		
		this.bscCtrlMeasureDao.editBscMeasure(paramMap);
		
		//维护方案与指标的关系
		refreshProjectAllMeasure(project_id);
	}
	
	/**
	 * 删除bsc考核指标
	 * @param paramMap
	 * @throws Exception
	 */
	public void removeBscMeasure(Map<String, Object> paramMap) throws Exception {
		this.bscCtrlMeasureDao.removeBscMeasure(paramMap);
	}
		
	/**
	 * 获取考核指标列表
	 * @param paramMap
	 * @throws Exception
	 */
	public List<Map<String, Object>> listBscMeasure(Map<String, Object> paramMap) throws Exception {
		List<Map<String, Object>> dataList = toLowerMapList(this.bscCtrlMeasureDao.listBscMeasure(paramMap));
		String flag = getStringValue(paramMap, "export_flag");
		if(!"Y".equals(flag)){
			String img = "<img src=\"img/04.png\" />";
			for (Map<String, Object> map : dataList) {
				String isAddon = getStringValue(map, "is_addon_score");
				if("Y".equals(isAddon)) {
					map.put("mea_definition", getStringValue(map, "mea_definition")+img);
//					System.out.println(getStringValue(map, "mea_definition"));
				}
			}
		}
		return dataList;
	}
	
	public void setBscCtrlMeasureDao(BscCtrlMeasureDao bscCtrlMeasureDao) {
		this.bscCtrlMeasureDao = bscCtrlMeasureDao;
	}
	
	/**
	 * 生成新方案
	 */
	public void createNewProject(Map<String, Object> paramMap) throws Exception {
		String checked = paramMap.get("checked").toString();
		String[] measure_ids = checked.split(",");
		for (int i = 0; i < measure_ids.length; i++) {
			measure_ids[i] = measure_ids[i].replace(measure_ids[i],
					measure_ids[i].substring(measure_ids[i].lastIndexOf("@") + 1));
			
		}
		paramMap.put("measure_ids", measure_ids);	
		this.jdbcManager.execute(" call usr_bsc_eng.copyProject('"
						+ paramMap.get("old_project_id") + "','"
						+ paramMap.get("new_project_id") + "','"
						+ paramMap.get("new_project_name") + "','"
						+ paramMap.get("owner_id") + "')");
		this.bscCtrlMeasureDao.deleteSpareMea(paramMap);
		this.bscCtrlMeasureDao.deleteSpareMeaPara(paramMap);
	}
	
	/**
	 * 设置指标在计分卡内顺序
	 * @param paramMap
	 * @throws Exception
	 */
	public void setMeasureOrder(Map<String, Object> paramMap) throws Exception {
		String params = getStringValue(paramMap, "params");
		if(params == null || "".equals(params))
			return;
		
		String[] records = params.replaceFirst(";", "").split(";");
		for (String record : records) {
			paramMap.put("measure_id", record.split(",")[0]);
			paramMap.put("mea_order_id", record.split(",")[1]);
			this.bscCtrlMeasureDao.setMeasureOrder(paramMap);
		}
	}
	
	private void refreshProjectAllMeasure(String projectID) throws SQLException{
		Connection conn = null;
		CallableStatement statement = null;
		try {
			conn = this.jdbcManager.getConnection();
			statement = conn.prepareCall("{call usr_bsc_eng.findProjectAllMeasure(?) }");
			statement.setString(1, projectID);
			statement.execute();
		} catch (Exception e) {
			e.printStackTrace();
		}finally{
			if(conn != null)
				conn.close();
		}
	}
}
