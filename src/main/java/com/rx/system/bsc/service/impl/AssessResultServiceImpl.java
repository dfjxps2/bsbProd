package com.rx.system.bsc.service.impl;

import java.util.List;
import java.util.Map;

import com.rx.system.base.BaseService;
import com.rx.system.bsc.dao.AssessResultDao;
import com.rx.system.bsc.service.IAssessResultService;
import com.rx.system.util.GlobalUtil;
import com.rx.util.CommonUtil;
/**
 * 评级结果serviceImpl
 * @Author: mabo
 * @Date: Jul 17, 2013
 */
public class AssessResultServiceImpl extends BaseService implements IAssessResultService {

	private AssessResultDao assessResultDao;
	public List<Map<String, Object>> listProject(Map<String, Object> map)
			throws Exception {
		
		return toLowerMapList(this.assessResultDao.listProject(map));
	}

	public List<Map<String, Object>> listResults(Map<String, Object> map)
			throws Exception {
		return this.assessResultDao.listResults(map);
	}

	public void setAssessResultDao(AssessResultDao assessResultDao) {
		this.assessResultDao = assessResultDao;
	}
	
	public String getStringValue(Map<String,Object> map,String key){
		return CommonUtil.getStringValue(map.get(key));
	}

	public void modifyAssessRank(Map<String, Object> map) throws Exception {
		String info = getStringValue(map, "info");
		if(GlobalUtil.trimToNull(info) != null) {
			String[] rows = info.split(";");
			for (String row : rows) {
				if(GlobalUtil.trimToNull(row) == null)
					continue;
				String[] record = (row+" ").split("@");
				String[] idInfo = record[0].split(":");
				
				map.put("new_rank_id", record[1]);
				map.put("new_rank_reason", record[2].trim());
				map.put("project_id", idInfo[2]);
				map.put("object_id", idInfo[0]);
				map.put("month_id", idInfo[1]);
				this.assessResultDao.modifyAssessRank(map);
			}
		}
	}
	
	/**
	 * 对象列表分页总数
	 * */
	public int listResultsCount(Map<String, Object> map) throws Exception{
		return this.assessResultDao.listResultsCount(map);
	}

	public List<Map<String, Object>> queryRsltStat(Map<String, Object> map)
			throws Exception {
		
		return toLowerMapList(this.assessResultDao.queryRsltStat(map));
	}
	
}
