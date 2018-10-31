package com.rx.system.bsc.action;

import java.util.HashMap;
import java.util.Map;

import com.rx.system.base.BaseDispatchAction;
import com.rx.system.bsc.service.IBscProjectService;
import com.rx.system.util.GlobalUtil;
/**
 * 平衡计分卡方案定义Action
 * @author zzm
 *
 */
@SuppressWarnings("serial")
public class BscProjectAction extends BaseDispatchAction {
	
	private IBscProjectService bscProjectService = null;
	
	// 存放Action和Service方法映射
	private static Map<String, Object> serviceMethodMapping = new HashMap<String, Object>();

	static {
		serviceMethodMapping.put("listProject", "listProject");
		serviceMethodMapping.put("listExecutedMonth", "listExecutedMonth");
		serviceMethodMapping.put("addProject", "addProject@BSC_0103");
		serviceMethodMapping.put("editProject", "editProject@BSC_0104");
		serviceMethodMapping.put("deleteProject", "deleteProject@BSC_0105");
		serviceMethodMapping.put("doPublish", "doPublish@BSC_0106");
		serviceMethodMapping.put("doMaintainView", "doMaintainView");
		serviceMethodMapping.put("listViewGroup", "listViewGroup");
		serviceMethodMapping.put("dropProject", "dropProject@BSC_0135");
		serviceMethodMapping.put("editMaintainGroup", "editMaintainGroup");
		serviceMethodMapping.put("copyProject", "copyProject@BSC_0111");
		serviceMethodMapping.put("listExeInfo", "listExeInfo@BSC_0112");
		serviceMethodMapping.put("listExecutedIndex", "listExecutedIndex");
		serviceMethodMapping.put("listPorjectObj", "listPorjectObj");
		serviceMethodMapping.put("getZoneInfo", "getZoneInfo");
		serviceMethodMapping.put("getProjectInfo", "getProjectInfo");
		serviceMethodMapping.put("getProjectMonth", "getProjectMonth");
		serviceMethodMapping.put("getPorjectObjInfo", "getPorjectObjInfo");
		serviceMethodMapping.put("getProjectIndex", "getProjectIndex");


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
			this.doResponse(this.bscProjectService, serviceMethod,new Object[] { paramMap }, serviceMethod+"Count");
		}

		return null;
	}
	
	public String hasRelation() throws Exception{
		Map<String, Object> paramMap = this.getRequestParam(request);
		if(this.bscProjectService.hasRelation(paramMap))
			doSuccessInfoResponse("存在分配关系");
		else
			doFailureInfoResponse("无分配关系");
		return null;
	}
	
	public String checkNameExist() throws Exception{
		Map<String,Object>	paramMap = this.getRequestParam(request);
		try {
			if(this.bscProjectService.getProjectNameById(paramMap))
				doSuccessInfoResponse("方案名[" + paramMap.get("project_name")
						+ "]已存在,请重新输入");
			else
				doFailureInfoResponse("该方案名可用");
		} catch (RuntimeException e) {
			e.printStackTrace();
			doFailureInfoResponse("校验失败");
		}
		return null;
	}


	/*
	   查询下拉框值

	 */

	public String setDimDataDS() throws Exception{
		Map<String,Object>	paramMap = this.getRequestParam(request);
		try {
			Map<String,String> daMap = this.bscProjectService.getDimDataDS(paramMap);
			doJSONResponse(daMap);
		} catch (RuntimeException e) {
			e.printStackTrace();
			doFailureInfoResponse("查询下拉框值失败");
		}
		return null;
	}


	public void setBscProjectService(IBscProjectService bscProjectService) {
		this.bscProjectService = bscProjectService;
	}

}
