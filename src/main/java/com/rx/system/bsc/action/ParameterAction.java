package com.rx.system.bsc.action;

import java.util.HashMap;
import java.util.Map;

import com.rx.system.base.BaseDispatchAction;
import com.rx.system.bsc.service.IParameterService;

/**
 * 考核参数Action
 * @author zzm
 *
 */
@SuppressWarnings("serial")
public class ParameterAction extends BaseDispatchAction {
	
	private IParameterService bscParameterService = null;
	
	//方法映射Map
	private static Map<String, Object> methodMapping = new HashMap<String, Object>();
	
	static{
		methodMapping.put("listParameter", "listParameter@BSC_0113");
		methodMapping.put("addParameter", "addParameter@BSC_0114");
		methodMapping.put("findParameter", "getParameterById");
		methodMapping.put("updateParameter", "updateParameter@BSC_0115");
		methodMapping.put("deleteParameter", "deleteParameter@BSC_0116");
		methodMapping.put("listItems", "listItems@BSC_0117");
		methodMapping.put("listObjects", "listObjects@BSC_0118");
		methodMapping.put("saveItem", "saveItem@BSC_0119");
		methodMapping.put("deleteItem", "deleteItem@BSC_0120");
		methodMapping.put("checkImportData", "checkImportData");
		methodMapping.put("importData", "importData");
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
			this.doResponse(this.bscParameterService, serviceName, new Object[]{this.getRequestParam(request)} , serviceName + "TotalCount");
		}
		
		return null;
	}

	public void setBscParameterService(IParameterService bscParameterService) {
		this.bscParameterService = bscParameterService;
	}
	
}
