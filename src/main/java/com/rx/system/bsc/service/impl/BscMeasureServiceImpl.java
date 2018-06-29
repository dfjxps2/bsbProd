package com.rx.system.bsc.service.impl;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.util.List;
import java.util.Map;

import com.rx.system.base.BaseService;
import com.rx.system.bsc.calc.service.IMeasure;
import com.rx.system.bsc.calc.service.IMeasureService;
import com.rx.system.bsc.dao.BscMeasureDao;
/**
 * 平衡计分卡考核指标Service接口
 * 用于考核时查询计算所需信息
 * @author chenxd
 *
 */
public class BscMeasureServiceImpl extends BaseService implements IMeasureService {
	
	private BscMeasureDao bscMeasureDao = null;

	/**
	 * 根据方案ID获取所有需要计算的指标
	 */
	public List<IMeasure> getMeasureByProjectId(String projectId)throws Exception {
		CallableStatement statement = null;
		Connection conn = null;
		try {
			conn = this.jdbcManager.getConnection();
			statement = conn.prepareCall("{call usr_bsc_eng.findProjectAllMeasure(?) }");
			statement.setString(1, projectId);
			statement.execute();
		} catch (Exception e) {
			e.printStackTrace();
		}finally{
			if(conn != null)
				conn.close();
		}
		
		return this.bscMeasureDao.getMeasureByProjectId(projectId);
	}
		
	/**
	 * 获取指标计算依赖的指标
	 */
	public List<IMeasure> getRelaMeasure(String measureId) throws Exception {
		return this.bscMeasureDao.getRelaMeasure(measureId);
	}
	
	/**
	 * 获取方案所有衡量指标
	 * @param projectId
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> getProjectMeasure(String projectId) throws Exception {
		return toLowerMapList(this.bscMeasureDao.getProjectMeasure(projectId));
	}
	
	public void setBscMeasureDao(BscMeasureDao bscMeasureDao) {
		this.bscMeasureDao = bscMeasureDao;
	}
}
