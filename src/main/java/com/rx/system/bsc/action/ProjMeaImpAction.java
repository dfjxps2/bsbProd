package com.rx.system.bsc.action;

import java.io.OutputStream;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;

import com.rx.log.annotation.FunDesc;
import com.rx.log.annotation.UseLog;
import com.rx.system.base.BaseDispatchAction;
import com.rx.system.bsc.calc.service.IMeasureService;
import com.rx.system.bsc.service.IProjMeaImpService;
import com.rx.system.constant.Constant;
import com.rx.system.model.excel.ExportDataUtil;
import com.rx.system.table.DhtmlTableTemplate;
import com.rx.system.table.ITableTemplate;
import com.rx.system.util.GlobalUtil;
/**
 * 计分卡考核结果直接由外部导入的指标Action
 * 
 * @author zzm
 * 
 */
@SuppressWarnings("serial")
public class ProjMeaImpAction extends BaseDispatchAction {
	
	IMeasureService bscMeasureService = null;
	
	IProjMeaImpService projMeaImpService;
	
	public void setProjMeaImpService(IProjMeaImpService projMeaImpService) {
		this.projMeaImpService = projMeaImpService;
	}

	/**
	 * 返回DHtml表格结果数据
	 * @return
	 * @throws Exception
	 */
	@FunDesc(code="BSC_0055")
	@UseLog
	public String dhtml() throws Exception {
		Map<String, Object> paramMap = this.getRequestParam(request);
		String object_search = (String)paramMap.get("object_search");
		if(object_search != null){
			object_search = URLDecoder.decode(object_search.trim(), "UTF-8");
			paramMap.put("object_search", object_search);
		}
		try {
			List<Map<String, Object>> dataList = this.projMeaImpService.list(paramMap);
			ITableTemplate template = new DhtmlTableTemplate();
			template.setHeader(new String[]{"序号,考核对象ID,考核对象名称,img:[../scripts/page_edit.png]指标值"});
			template.setColumnAlign("center,left,left,right");
			template.setColumnType("ro,ro,ro,ed");
			template.setColumnWidth("40,190,190,190");
			template.setColumnFormatType("0,0,0,2");
			template.setDataMapKey(new String[]{"rownum","object_id","object_name","value"});
			template.setData(dataList);
			template.setUseCheck(true, 0);
			
			response.setContentType("text/html;charset=utf-8");
			response.getWriter().print(template.getTableString());
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * 保存修改
	 * @return
	 * @throws Exception
	 */
	@FunDesc(code="BSC_0056")
	@UseLog
	public String save() throws Exception{
        Map<String, Object> paramsMap = this.getRequestParam(request);
        try {
        	
        	this.projMeaImpService.save(paramsMap);
            doSuccessInfoResponse("保存成功.");
        }
        catch (Exception e) {
            e.printStackTrace();
            doFailureInfoResponse("保存失败:"+e.getMessage());
        }
        return null;
	}
	
	/**
	 * 删除选中对象值
	 * @return
	 * @throws Exception
	 */
	@FunDesc(code="BSC_0057")
	@UseLog
	public String delete() throws Exception{
        Map<String, Object> paramsMap = this.getRequestParam(request);
        try {
        	
        	this.projMeaImpService.delete(paramsMap);
            doSuccessInfoResponse("清理成功.");
        }
        catch (Exception e) {
            e.printStackTrace();
            doFailureInfoResponse("清理失败:"+e.getMessage());
        }
        
        return null;
	}
	
	/**
	 * 将数据写到Excel中
	 * @throws Exception
	 */
	@FunDesc(code="BSC_0058")
	@UseLog
	public void exportToExcel() throws Exception {
		String tableData = request.getParameter("tableData");
		String tableColumnAlign = request.getParameter("tableColumnAlign");
		String tableTitle = request.getParameter("tableTitle");
		String exportHeader = request.getParameter("exportHeader");
		String filePath = request.getSession().getServletContext().getRealPath("/") + "template//proj_ext_mea_obj_val_tmpl.xls";

		try {

			String[] infos = exportHeader.split(";");
			// 生成excel
			HSSFWorkbook workbook = ExportDataUtil.writToSheet(filePath, tableData, tableColumnAlign, infos, 2);
			response.setContentType("application/ms-excel");
			response.setHeader("Content-Disposition", "attachment; filename=" + new String(tableTitle.getBytes(), "iso-8859-1") + ".xls");
			OutputStream stream = response.getOutputStream();
			try {
				workbook.write(stream);
			} catch (Exception e) {
				e.printStackTrace();
			} finally {
				if (stream != null) {
					try {
						stream.flush();
						stream.close();
					} catch (Exception e) {
						e.printStackTrace();
					}
				}
			}
		} catch (Exception e) {
			System.out.print("方案目标导出模版异常:");
			e.printStackTrace();
		}
	}
   
   /**
	 * 检验Excel数据
	 * 
	 * @return
	 * @throws Exception
	 */
	public String checkImportData() throws Exception {
		String fileName = request.getParameter("hiddenFile");// 文件名
		String uploadPath = request.getSession().getServletContext().getRealPath("/") + Constant.UPLOAD_DIR;// 文件的存放路径
		String fullFileName = uploadPath + fileName;// 完整路径

		try {
			Map<String, Object> m = this.getRequestParam(request);
			m.put("fullFileName", fullFileName);

			List<Map<String, Object>> errorList = this.projMeaImpService.checkImportData(m);
			if (errorList.size() > 0) {
				StringBuffer failedData = new StringBuffer("[");
				for (int i = 0; i < errorList.size(); i++) {
					Map<String, Object> map = errorList.get(i);
					if (i == errorList.size() - 1) {
						failedData.append("[" + map.get("line_no") + ",'" + map.get("failed_reason") + "']");
					} else {
						failedData.append("[" + map.get("line_no") + ",'" + map.get("failed_reason") + "'],");
					}
				}
				failedData.append("]");
				throw new Exception(failedData.toString());
			}

			doSuccessInfoResponse("校验成功.");
		} catch (Exception e) {
			e.printStackTrace();
			doFailureInfoResponse("校验失败:" + e.getMessage());
		}
		return null;
	}   
   
	/**
	 * 导入结果值
	 * 
	 * @throws Exception
	 */
	@FunDesc(code="BSC_0059")
	@UseLog
	public void saveImportData() throws Exception {
		String fileName = request.getParameter("hiddenFile");// 文件名
		String uploadPath = request.getSession().getServletContext().getRealPath("/") + Constant.UPLOAD_DIR;//文件的存放路径
		String fullFileName = uploadPath + fileName;//完整路径

		Map<String, Object> paramMap = new HashMap<String, Object>();

		paramMap.put("fileName", fullFileName);
		try {
			this.projMeaImpService.saveImportData(paramMap);
			doSuccessInfoResponse("导入成功.");
		} catch (Exception e) {
			e.printStackTrace();
			doFailureInfoResponse("导入失败.");
		}
	}
	
	//指标查询
    public void queryMeasure() throws Exception {

        //页面条件:根据方案id来显示其相应的指标
        Map<String, Object> map = this.getRequestParam(request);

        try {
        	if("true".equals(getStringValue(map, "procedure"))) {
        		this.bscMeasureService.getMeasureByProjectId(getStringValue(map, "project_id"));
        	}
            List<Map<String, Object>> list = this.projMeaImpService.queryMeasure(map);
            doJSONResponse(GlobalUtil.lowercaseListMapKey(list));
        }
        catch (Exception e) {
            System.out.print("指标查询的异常:");
            e.printStackTrace();
        }
    }
    
	public void setBscMeasureService(IMeasureService bscMeasureService) {
		this.bscMeasureService = bscMeasureService;
	}
}
