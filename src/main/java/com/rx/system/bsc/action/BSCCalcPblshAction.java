package com.rx.system.bsc.action;

import java.util.HashMap;
import java.util.Map;

import com.rx.system.base.BaseDispatchAction;
import com.rx.system.bsc.service.IBSCCalcPblshService;
import com.rx.system.util.GlobalUtil;

public class BSCCalcPblshAction extends BaseDispatchAction {
	private static final long serialVersionUID = 1L;

	private IBSCCalcPblshService bSCCalcPblshService = null;
	public void setBSCCalcPblshService(IBSCCalcPblshService bscCalcPblshService) {
		this.bSCCalcPblshService = bscCalcPblshService;
	}
	private static Map<String,Object> serviceMethodMapping = new HashMap<String,Object>();
	
	static {
		serviceMethodMapping.put("listProject", "listProject@BSC_0072");
		
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
			this.doResponse(this.bSCCalcPblshService, serviceMethod,new Object[] { paramMap }, null);
		}

		return null;
	}



	
}
