package com.rx.system.bsc.action;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.struts2.ServletActionContext;

import com.rx.log.annotation.FunDesc;
import com.rx.log.annotation.UseLog;
import com.rx.system.base.BaseDispatchAction;
import com.rx.system.bsc.service.IBscMeasureCtrlService;
import com.rx.system.constant.Constant;
import com.rx.system.table.DhtmlTableTemplate;
import com.rx.system.table.ITableTemplate;
import com.rx.system.util.GlobalUtil;
/**
 * 平衡计分卡方案指标维护Action
 * @author chenxd
 *
 */
@SuppressWarnings("serial")
public class BscCtrlMeasureAction extends BaseDispatchAction {
	
	private IBscMeasureCtrlService bscMeasureCtrlService = null;
	// 存放Action和Service方法映射
	private static Map<String, Object> serviceMethodMapping = new HashMap<String, Object>();

	static {
		serviceMethodMapping.put("addBscMeasure", "addBscMeasure@BSC_0073");
		serviceMethodMapping.put("editBscMeasure", "editBscMeasure@BSC_0074");
		serviceMethodMapping.put("removeBscMeasure", "removeBscMeasure@BSC_0075");
		serviceMethodMapping.put("setBscMeasureProrate", "setBscMeasureProrate@BSC_0076");
		serviceMethodMapping.put("createNewProject", "createNewProject@BSC_0077");
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
			this.doResponse(this.bscMeasureCtrlService, serviceMethod,new Object[] { paramMap }, null);
		}

		return null;
	}
	
	/**
	 * 导出考核方案
	 * @return
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	@FunDesc(code="BSC_0011")
	@UseLog
	public String exportExcel() throws Exception {
		Map<String, Object> paramMap = this.getRequestParam(request);
		try {
			boolean isAbstract = Boolean.valueOf(getStringValue(paramMap, "isAbstract"));
			String flag = getStringValue(paramMap, "export_flag");
			
			List<Map<String, Object>> dataList = this.bscMeasureCtrlService.listBscMeasure(paramMap);
			
			ITableTemplate template = this.getDhtmlConfig(isAbstract,flag);
			template.setData(dataList);
			
			template.setTitle("平衡计分卡考核方案");
			template.setExcelInfoRow(new String[][]{
					{"方案名称：",getStringValue(paramMap, "project_name")}
			});
			
			//写入到Excel文件
			String webBasePath = ServletActionContext.getServletContext().getRealPath("/");
			String localFileName = webBasePath + Constant.FILE_DOWNLOAD_DIR + this.getCurrentUser().getUser_id()+".xls";
			template.writeToFile(new File(localFileName));
		} catch (Exception e) {
			e.printStackTrace();
		}
		return "excelDownload";
	}
	
	/**
	 * 返回考核指标Dhtml表达式
	 * @return
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	@FunDesc(code="BSC_0012")
	@UseLog
	public String listBscMeasure() throws Exception {
		Map<String, Object> paramMap = this.getRequestParam(request);
		try {
			boolean isTemplate = Boolean.valueOf(getStringValue(paramMap, "isTemplate"));
			String flag = getStringValue(paramMap, "export_flag");
			
			List<Map<String, Object>> dataList = this.bscMeasureCtrlService.listBscMeasure(paramMap);
			
			ITableTemplate template = this.getDhtmlConfig(isTemplate,flag);
			
			template.setData(dataList);
			
			response.setContentType("text/html;charset=utf-8");
			response.getWriter().print(template.getTableString());
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	/**
	 * 获取查询配置模板
	 * 增加数据公式列，只为编辑时可以显示该信息
	 * @return
	 */
	private ITableTemplate getDhtmlConfig(boolean isTemplate,String flag) throws Exception{
		ITableTemplate template = new DhtmlTableTemplate();
		template.setHeader(new String[]{"指标定义,指标代码,指标名称,数据公式,计分方式描述"});
		
		template.setColumnAlign("left,left,left,left,left");
		template.setColumnType("ro,ro,ro,ro,ro");
		template.setColumnWidth("200,150,200,420,420");
		template.setColumnFormatType("0,0,5,5,5");
		template.setDataMapKey(new String[]{"mea_definition","measure_id","measure_name","mea_formula","mea_formula_desc"});
		template.setLeftTreeShowType(ITableTemplate.LEFT_SHOW_TYPE_TABLE);
		template.isFilterBlank(true);
		template.useSerialNumber(true);
		
		return template;
	}
	
	/**
	 * 设置指标在计分卡内的顺序
	 * @throws Exception
	 */
	@FunDesc(code="BSC_0013")
	@UseLog
	public String setMeasureOrder()throws Exception {
		try {
			Map<String, Object> paramMap = getRequestParam(request);
			this.bscMeasureCtrlService.setMeasureOrder(paramMap);
			doSuccessInfoResponse("操作成功");
		} catch (Exception e) {
			e.printStackTrace();
			doFailureInfoResponse(e.getMessage());
		}
		return null;
	}
	
	public void setBscMeasureCtrlService(IBscMeasureCtrlService bscMeasureCtrlService) {
		this.bscMeasureCtrlService = bscMeasureCtrlService;
	}
	
}
