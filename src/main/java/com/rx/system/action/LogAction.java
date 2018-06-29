package com.rx.system.action;

import java.io.File;
import java.net.URLDecoder;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.struts2.ServletActionContext;

import com.rx.system.base.BaseDispatchAction;
import com.rx.system.constant.Constant;
import com.rx.system.service.ILogService;
import com.rx.system.table.DhtmlTableTemplate;
import com.rx.system.table.ITableTemplate;
import com.rx.system.util.GlobalUtil;

public class LogAction extends BaseDispatchAction{

	private static final long serialVersionUID = 1L;
	
	private ILogService logService;
	
	public void setLogService(ILogService logService) {
		this.logService = logService;
	}

	/**
	 * 查询日志列表 
	 * @return
	 * @throws Exception
	 */
	public String queryList() throws Exception{
		
		
		Map<String, Object> map = this.getRequestParam(request);
		map.put("end_date",getNextMonth(map.get("end_date").toString(),"yyyy-MM-dd"));
		String userKey = map.get("userKey").toString();
		if(userKey!=null && userKey!=""){
			userKey = URLDecoder.decode(userKey,"utf-8");
			map.put("userKey", userKey);
		}
		insertPageParamToMap(map);
		try {
			List<Map<String, Object>> dataList = this.logService.queryList(map);
			ITableTemplate template = this.getDhtmlConfig();
			template.setData(dataList);
			template.useSerialNumber(true);
			response.setContentType("text/html;charset=utf-8");
			
			response.getWriter().print(template.getTableString());
		} catch (RuntimeException e) {
			e.printStackTrace();
			doFailureInfoResponse(e.getMessage());
		}
		return null;
	}
	
	/**
	 * 查询总数
	 * @return
	 * @throws Exception
	 */
	public String queryListCount() throws Exception{
		Map<String,Object> paramMap = getRequestParam(request);
		paramMap.put("end_date",getNextMonth(paramMap.get("end_date").toString(),"yyyy-MM-dd"));
		String userKey = paramMap.get("userKey").toString();
		if(userKey!=null && userKey!=""){
			userKey = URLDecoder.decode(userKey,"utf-8");
			paramMap.put("userKey", userKey);
		}
		Map<String,Object> map = new HashMap<String,Object> ();
		try {
			map.put("totalCount", this.logService.queryListCount(paramMap));
			map.put("success", Boolean.valueOf("true"));
			doJSONResponse(map);
		} catch (RuntimeException e) {
			e.printStackTrace();
			doFailureInfoResponse("查询总数失败:"+e.getMessage());
		}
		return null;
	}
	
	/**
	 * 根据登陆人sessionId查询其所作的操作
	 * @return
	 * @throws Exception
	 */
	public String queryDetail() throws Exception{
		Map<String,Object> paramMap = getRequestParam(request);
		try {
			List<Map<String, Object>> dataList = this.logService.queryDetail(paramMap);
			ITableTemplate template = this.getDetailDhtmlConfig();
			template.setData(dataList);
			template.useSerialNumber(true);
			response.setContentType("text/html;charset=utf-8");
			
			response.getWriter().print(template.getTableString());
		} catch (RuntimeException e) {
			e.printStackTrace();
			doFailureInfoResponse(e.getMessage());
		}
		return null;
	}
	
	/**
	 * 获取查询配置模板
	 * 
	 * @return
	 */
	private ITableTemplate getDhtmlConfig() throws Exception {
		ITableTemplate template = new DhtmlTableTemplate();
		template.setHeader(new String[] { "session_id,登录人,登陆时间,注销时间,登陆IP" });
		template.setColumnAlign("left,left,center,center,center");
		template.setColumnType("ro,ro,ro,ro,ro");
		template.setColumnWidth("150,160,150,150,110");
		template.setColumnFormatType("0,0,0,0,0");
		template.setDataMapKey(new String[] { "session_id","user_name","begin_time","end_time","login_ip"});
		template.setGroupFields("session_id,begin_time,login_ip");

		return template;
	}
	/**
	 * 获取日志明细查询配置模板
	 * 
	 * @return
	 */
	private ITableTemplate getDetailDhtmlConfig() throws Exception {
		ITableTemplate template = new DhtmlTableTemplate();
		template.setHeader(new String[] { "操作时间,操作内容" });
		template.setColumnAlign("center,left");
		template.setColumnType("ro,ro");
		template.setColumnWidth("200,251");
		template.setColumnFormatType("0,0");
		template.setDataMapKey(new String[] {"oper_time","function_name"});
		template.setGroupFields("oper_time"+GlobalUtil.getRandomID(10));

		return template;
	}
	
	/**
	 * 导出
	 * @return
	 * @throws Exception
	 */
	public String export() throws Exception {
		Map<String, Object> paramMap = this.getRequestParam(request);
		this.insertPageParamToMap(paramMap);
		paramMap.put("isExport", true);
		ITableTemplate template = null;
		List<Map<String, Object>> dataList = null;
		String fileTitle = paramMap.get("file_name").toString();
		fileTitle = fileTitle.substring(0, fileTitle.lastIndexOf("."));
		try {
			if("total".equals(paramMap.get("exportType").toString())){
				template = getDhtmlConfig();
				dataList = this.logService.queryList(paramMap);
				template.setExcelInfoRow(new String[][] {
						{ "开始日期：", paramMap.get("begin_date").toString() },
						{ "结束日期：", paramMap.get("end_date").toString() } });
			}else{
				template = getDetailDhtmlConfig();
				dataList = this.logService.queryDetail(paramMap);
				String loginUser = "";
				if(dataList.size()>0){
					loginUser = dataList.get(0).get("user_name").toString();
				}
				template.setExcelInfoRow(new String[][] {
						{ "登陆人：",  loginUser},
						{ "登陆时间",	paramMap.get("queryInfo").toString().split("_")[1] },
						{ "登陆IP：", paramMap.get("queryInfo").toString().split("_")[2] } });
				template.setInfoInOneRow(false);
			}
			
			template.setTitle(fileTitle);
			template.setData(dataList);
			String webBasePath = ServletActionContext.getServletContext()
					.getRealPath("/");
			String localFileName = webBasePath + Constant.FILE_DOWNLOAD_DIR
					+ this.getCurrentUser().getUser_id() + ".xls";
			template.writeToFile(new File(localFileName));

		} catch (Exception e) {
			e.printStackTrace();
		}
		return "excelDownload";
	}
	
	private String getNextMonth(String monthStr, String format) {
		SimpleDateFormat sdf = new SimpleDateFormat(format);//格式化对象
		Date date = null;
		try {
			date = sdf.parse(monthStr);
		} catch (ParseException e) {
			e.printStackTrace();
		}

		Calendar calendar = Calendar.getInstance();//日历对象
		calendar.setTime(date);//设置当前日期
		calendar.add(Calendar.DAY_OF_MONTH, 1);//月份加1

		return sdf.format(calendar.getTime());
	}
}
