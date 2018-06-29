package com.rx.system.bsc.action;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.beanutils.BeanUtils;

import com.rx.system.base.BaseDispatchAction;
import com.rx.system.bsc.calc.function.FunctionFactory;
import com.rx.system.bsc.service.IParameterService;
import com.rx.system.bsc.service.IPublicMeasureService;
import com.rx.system.util.GlobalUtil;
/**
 * 私有指标维护Action
 * @author chenxd
 *
 */
@SuppressWarnings("serial")
public class PublicMeasureAction extends BaseDispatchAction {
	
	private IPublicMeasureService publicMeasureService = null;
	private IParameterService parameterService = null;
	
	// 存放Action和Service方法映射
	private static Map<String, Object> serviceMethodMapping = new HashMap<String, Object>();

	static {
		serviceMethodMapping.put("addEngMeasure", "addEngMeasure@BSC_0131");
		serviceMethodMapping.put("editEngMeasure", "editEngMeasure@BSC_0132");
		serviceMethodMapping.put("deleteEngMeasure", "deleteEngMeasure@BSC_0133");
		serviceMethodMapping.put("listBaseEngMeasure", "listBaseEngMeasure@BSC_0134");
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
			this.doResponse(this.publicMeasureService, serviceMethod,new Object[] { paramMap }, null);
		}

		return null;
	}
	
	/**
	 * 查询公式和参数
	 * @return
	 * @throws Exception
	 */
	public String getFunctionAndParam() throws Exception {
		try {
			Map<String, Object> paramMap = this.getRequestParam(request);
			List<Map<String, Object>> dataList = FunctionFactory.getFunctionList();
			dataList.addAll(describeList(this.parameterService.listParameter(paramMap)));
			doJSONResponse(dataList);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	@SuppressWarnings("unchecked")
	private List<Map<String, Object>> describeList(List<? extends Object> list) throws Exception {
		List<Map<String, Object>> dataList = new ArrayList<Map<String,Object>>();
		for (Object obj : list) {
			dataList.add(BeanUtils.describe(obj));
		}
		return dataList;
	}
	
	
	public String checkMeasure() throws Exception{
		Map<String,Object> paramMap = this.getRequestParam(request);
		int v = publicMeasureService.checkMeasure(paramMap);
		if(v>0){
			doFailureInfoResponse("ID为["+paramMap.get("measure_id")+"]的指标已存在!");
		}else{
			doSuccessInfoResponse("校验指标ID不存在,为有效ID");
		}
		return null;
	}
	public String checkHasChilren() throws Exception{
		Map<String,Object> paramMap = this.getRequestParam(request);
		try {
			int v = publicMeasureService.getSubNodeCount(paramMap);
			if(v>0)
				doSuccessInfoResponse("该指标存在下级指标,不能删除.请先删除下级指标后再试!");
			else
				doFailureInfoResponse("该指标不存在下级指标");
		} catch (RuntimeException e) {
			doFailureInfoResponse("操作失败");
			e.printStackTrace();
		}
		return null;
	}
	
	public void setPublicMeasureService(IPublicMeasureService publicMeasureService) {
		this.publicMeasureService = publicMeasureService;
	}

	public void setParameterService(IParameterService parameterService) {
		this.parameterService = parameterService;
	}
}
