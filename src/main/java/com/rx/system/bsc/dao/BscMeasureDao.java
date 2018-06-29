package com.rx.system.bsc.dao;

import java.util.List;
import java.util.Map;

import com.rx.system.bsc.calc.service.IMeasure;

/**
 * 平衡计分卡积分指标操作接口
 * @author chenxd
 *
 */
public interface BscMeasureDao {
	/**
	 * 根据方案ID获取所有需要计算的指标
	 */
	public List<IMeasure> getMeasureByProjectId(String projectId)throws Exception;

	
	/**
	 * 获取指标计算依赖的指标
	 */
	public List<IMeasure> getRelaMeasure(String measureId) throws Exception;
	
	/**
	 * 获取方案所有衡量指标积分公式
	 * @param projectId
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> getProjectMeasure(String projectId) throws Exception;
}
