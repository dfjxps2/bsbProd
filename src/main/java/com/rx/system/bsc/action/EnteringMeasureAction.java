package com.rx.system.bsc.action;

import java.util.HashMap;
import java.util.Map;

import com.rx.system.base.BaseDispatchAction;
import com.rx.system.bsc.service.IEnteringMeasureService;

/**
 * 考核参数Action
 * @author zzm
 *
 */
@SuppressWarnings("serial")
public class EnteringMeasureAction extends BaseDispatchAction {
	
	private IEnteringMeasureService enteringMeasureService = null;
	
	//方法映射Map
	private static Map<String, Object> methodMapping = new HashMap<String, Object>();
	
	static{
		methodMapping.put("listMeasure", "listMeasure@BSC_0113");
		methodMapping.put("addMeasure", "addMeasure@BSC_0114");
		methodMapping.put("findMeasure", "getMeasureById");
		methodMapping.put("updateMeasure", "updateMeasure@BSC_0115");
		methodMapping.put("examineID", "examineID");
	}
	
	/**
	 * 增删改查等可抽象通用方法
	 * @return
	 * @throws Exception
	 */
	public String common() throws Exception {
		String method = trimToNull(request.getParameter("method"));
		String serviceName = getStringValue(methodMapping, method);
		
		if(method != null && trimToNull(serviceName) != null) {
			//执行逻辑方法并响应
			this.doResponse(this.enteringMeasureService, serviceName, new Object[]{this.getRequestParam(request)} , serviceName + "TotalCount");
		}
		
		return null;
	}

	public void setEnteringMeasureService(IEnteringMeasureService enteringMeasureService) {
		this.enteringMeasureService = enteringMeasureService;
	}
	
}
