package com.rx.system.bsc.action;

import java.util.HashMap;
import java.util.Map;

import com.rx.system.base.BaseDispatchAction;
import com.rx.system.bsc.service.IPrivateMeasureService;
import com.rx.system.util.GlobalUtil;
/**
 * 私有指标维护Action
 * @author chenxd
 *
 */
@SuppressWarnings("serial")
public class PrivateMeasureAction extends BaseDispatchAction {
	
	private IPrivateMeasureService privateMeasureService = null;
	
	// 存放Action和Service方法映射
	private static Map<String, Object> serviceMethodMapping = new HashMap<String, Object>();

	static {
		serviceMethodMapping.put("addEngMeasure", "addEngMeasure@BSC_0122");
		serviceMethodMapping.put("editEngMeasure", "editEngMeasure@BSC_0123");
		serviceMethodMapping.put("deleteEngMeasure", "deleteEngMeasure@BSC_0124");
		serviceMethodMapping.put("listBaseEngMeasure", "listBaseEngMeasure@BSC_0125");
		serviceMethodMapping.put("listEngMeasure", "listEngMeasure@BSC_0126");
		serviceMethodMapping.put("getEngMeasureById", "getEngMeasureById");
		serviceMethodMapping.put("listMeasureCalcDepend", "listMeasureCalcDepend@BSC_0127");
		serviceMethodMapping.put("addDependMeasure", "addDependMeasure@BSC_0128");
		serviceMethodMapping.put("removeDependMeasure", "removeDependMeasure@BSC_0129");
		serviceMethodMapping.put("editEngMeasureFormula", "editEngMeasureFormula@BSC_0130");
	}
	
	/**
	 * 增删改查通用方法
	 * 
	 * @throws Exception
	 */
	public String common() throws Exception {
		Map<String, Object> paramMap = this.getRequestParam(request);
		String methodName = GlobalUtil.getStringValue(paramMap, "method");

		String serviceMethod = GlobalUtil.getStringValue(serviceMethodMapping,methodName);
		if (GlobalUtil.trimToNull(serviceMethod) != null) {
			this.doResponse(this.privateMeasureService, serviceMethod,new Object[] { paramMap }, null);
		}

		return null;
	}

	public void setPrivateMeasureService(IPrivateMeasureService privateMeasureService) {
		this.privateMeasureService = privateMeasureService;
	}
	
}
