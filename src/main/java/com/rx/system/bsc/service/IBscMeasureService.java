package com.rx.system.bsc.service;

import java.util.List;
import java.util.Map;

import com.rx.system.domain.BscMeasureCtrl;

/**
 * 平衡计分卡考核指标Service接口
 * 用于考核时查询计算所需信息
 * @author chenxd
 *
 */
public interface IBscMeasureService{
	
	/**
	 * 获取平衡计分卡考核指标列表
	 * @param projectId
	 * @param roleId
	 * @return
	 * @throws Exception
	 */
	public List<BscMeasureCtrl> listBscMeasureCtrl(String projectId, String roleId) throws Exception;
	
	/**
	 * 根据指标ID获取KPI考核结果表中的值
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public String getKpiMeasureResult(Map<String, String> paramMap) throws Exception;
	
	/**
	 * 替换平衡计分卡公式中的计划值
	 * @param measure
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public String replacePlanValue(String formula, Map<String, String> paramMap) throws Exception;
	
}
