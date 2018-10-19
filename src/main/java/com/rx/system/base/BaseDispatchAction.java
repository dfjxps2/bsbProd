package com.rx.system.base;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.beanutils.BeanUtils;
import org.apache.struts2.ServletActionContext;
import org.apache.struts2.interceptor.ServletRequestAware;
import org.apache.struts2.interceptor.ServletResponseAware;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.context.ApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.opensymphony.xwork2.ActionSupport;
import com.rx.log.FunctionLogAdvice;
import com.rx.system.domain.SysUser;
import com.rx.system.util.GlobalUtil;

@SuppressWarnings({ "serial" })
public class BaseDispatchAction extends ActionSupport implements ServletRequestAware,ServletResponseAware {
	public HttpServletRequest request = null;
	public HttpServletResponse response = null;
	public HttpSession session = null;
	public String execute() throws Exception {
		return SUCCESS;
	}
	/**
	 * 获取bean
	 * @param <T>
	 * @param name
	 * @param t
	 * @return
	 */
	@SuppressWarnings("unchecked")
	protected <T> T getBean(String name,Class<T> t){
		 ApplicationContext ctx = WebApplicationContextUtils.getWebApplicationContext(ServletActionContext.getServletContext());
		 return (T) ctx.getBean(name);
	}
	
	protected void doJSONArrayResponse(List<? extends Object> list,boolean isMap) throws Exception{
		response.setContentType("application/json");
		JSONArray array = new JSONArray();
		for (int i = 0; i < list.size(); i++) {
			if(isMap)
				array.put(list.get(i));
			else
				array.put(BeanUtils.describe(list.get(i)));
		}
		response.getWriter().write(array.toString());
	}
	
	protected void doJSONResponse(Object obj) throws Exception{
		response.setContentType("application/json");
		JSONObject json = new JSONObject(obj);
		response.getWriter().write(json.toString());
	}
	protected  void doJSONResponse(String result) throws Exception{
		response.getWriter().write(result);
	}
	/**
	 * 返回执行成功的Json字符串
	 * @param info
	 * @throws Exception
	 */
	protected void doSuccessInfoResponse(String info) throws Exception{
		Map<String, Object> results = new HashMap<String, Object>();
		results.put("success", Boolean.valueOf(true));
		results.put("info", info);
		doJSONResponse(results);
	}
	
	protected void doSuccessInfoResponse(String info,Object obj) throws Exception{
		Map<String, Object> results = new HashMap<String, Object>();
		results.put("success", Boolean.valueOf(true));
		results.put("results", obj);
		results.put("info", info);
		doJSONResponse(results);
	}
	
	/**
	 * 返回执行成功的Json字符串
	 * @param info
	 * @throws Exception
	 */
	protected void doFailureInfoResponse(String info) throws Exception{
		Map<String, Object> results = new HashMap<String, Object>();
		results.put("success", Boolean.valueOf(false));
		results.put("info", info);
		doJSONResponse(results);
	}
	/**
	 *将list以Json形式返回客户端
	 * @param list
	 * @throws Exception 
	 */
	protected void doJSONResponse(List<? extends Object> list) throws Exception{
		Map<String, Object> results = new HashMap<String, Object>();
		Integer total = (Integer) request.getAttribute("total");
		if(total != null){
			results.put("totalCount", total);
		}
		results.put("results", list);
		doJSONResponse(results);
	}
	/**
	 * 将Map以Json形式返回客户端
	 * @param map
	 * @throws Exception
	 */
	protected void doJSONResponse(Map<String, ? extends Object> map)throws Exception{
		response.setContentType("application/json;charset=utf-8");
		JSONObject json = new JSONObject(map);
		response.getWriter().write(json.toString());
	}
	
	/**
	 * 将从前端获取的参数封装到Map
	 * @param request
	 * @return properties 封装属性值的Map对象
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	public Map<String, Object> getRequestParam(HttpServletRequest request)throws Exception{
		Map<String, Object> properties = new HashMap<String, Object>();
		Enumeration<String> enumeration = request.getParameterNames();
		while (enumeration.hasMoreElements()) {
			String paramName = (String) enumeration.nextElement();
			String value = request.getParameter(paramName);
			if(trimToNull(value) == null)
				value = "";
			properties.put(paramName, value);
		}
		//添加查询月首日日期 [历史表查询需用到]
		String month_id = request.getParameter("month_id");
		if(month_id != null && !"".equals(month_id)) {
			if(properties.get("year_id")==null){
				properties.put("year_id", month_id.substring(0, 4));
			}
			month_id = month_id.length()==4?(month_id+"12"):month_id;//判断month_id长度，如果是4位，则周期是年，加上月份
			properties.put("query_date", GlobalUtil.parseSQLDate(month_id+"01", "yyyyMMdd"));
		}
		
		//添加用户信息
		properties.put("login_user_id", this.getCurrentUser().getUser_id());
		properties.put("current_month", this.session.getAttribute("currentMonth"));
		properties.put("owner_id", this.getCurrentUser().getBank_org_id());//权限机构
		properties.put("bank_org_id", this.getCurrentUser().getBank_org_id());//归属机构
		properties.put("RealPath", request.getSession().getServletContext().getRealPath("/"));
		return properties;
	}
	
	public Map<String, Object> getRequestParam()throws Exception {
		return this.getRequestParam(request);
	}
	
	/**
	 * 将request对象中参数封装成对象返回
	 * @param <T>
	 * @param cls
	 * @return
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	protected <T> T getParamObject(Class<T> cls)throws Exception{
		T obj = cls.newInstance();
		Map<String, String[]> paramMap = request.getParameterMap();
		BeanUtils.populate(obj, paramMap);
		return obj;
	}
	
	/**
	 * 获取当前登陆用户
	 * @param request
	 * @return
	 */
	public SysUser getCurrentUser(){
		return (SysUser) session.getAttribute("currentUser");
	}
	
	
	/**
	 * 获取分页对象 start + rowend
	 * @param request
	 * @return PageRange 
	 */
	protected Map<String, Object> insertPageParamToMap(Map<String, Object> paramMap) {
		String start = request.getParameter("start");
		String limit = request.getParameter("limit");
		if(start == null){
			start = "0";
			limit = "30";
		}
		if(!start.equals("0")) {
			start = String.valueOf(Integer.parseInt(start));
		}
		paramMap.put("start", start);
		paramMap.put("endrow", Integer.parseInt(start) + Integer.parseInt(limit));
		return paramMap;
	}
	
	/**
	 * 将分页查询的总记录数设置到Request对象中
	 */
	protected void setTotalCountToRequest(String totalCount) {
		request.setAttribute("total", new Integer(totalCount));
	}
	
	
	/**
	 * 封装调用业务逻辑方法及响应客户端Ajax请求
	 * @param logicBean	业务逻辑Bean
	 * @param methodName	业务逻辑类需要调用的方法
	 * @param params	调用业务逻辑方法时需要传入的参数数组
	 * @param totalMethod 计算总数方法
	 * @category 暂不支持重载
	 */
	@SuppressWarnings("unchecked")
	protected void doResponse(Object logicBean, String methodName, Object[] params, String totalMethod) throws Exception{
		try {
			Method[] methods = logicBean.getClass().getInterfaces()[0].getDeclaredMethods();
			
			boolean needLog = false;
			String code = null;
			//增加common方法日志功能
			if(methodName.split("@").length > 1) {
				needLog = true;
				code = methodName.split("@")[1];
				methodName = methodName.split("@")[0];
				totalMethod = (null == totalMethod ? null : totalMethod.replaceAll("@" + code, ""));
			}
			//查询总记录数
			if(totalMethod != null) {
				for (Method method : methods) {
					if(!totalMethod.equals(method.getName()))
						continue;
					Map<String, Object> paramMap = (Map<String, Object>) params[0];
					paramMap = this.insertPageParamToMap(paramMap);
					Integer totalCount = (Integer) method.invoke(logicBean, paramMap);
					request.setAttribute("total", totalCount);
					break;
				}
			}
			
			boolean executed = false;
			
			for (Method method : methods) {
				if(!methodName.equals(method.getName()))
					continue;
				
				executed = true;
				if(method.getReturnType().toString().indexOf("java.util.List") != -1) {
					List<? extends Object> list = (List<? extends Object>) method.invoke(logicBean, params);
					//返回List
					doJSONResponse(list);
				}else if(method.getReturnType().toString().equals("void")){
					method.invoke(logicBean, params);
					doSuccessInfoResponse("操作成功");
				}else {
					Object obj = method.invoke(logicBean, params);
					
					List<Object> list = new ArrayList<Object>();
					list.add(obj);
					doJSONResponse(list);
				}
				break;
			}
			if(!executed)
				throw new Exception("no such method : "+methodName);
			
			if(needLog) {
				FunctionLogAdvice advice = getBean("funLogAdvice", FunctionLogAdvice.class);
				advice.writeFunctionLog(session.getId(), code);
			}
		} catch (InvocationTargetException e) {
			e.getTargetException().printStackTrace();
			doFailureInfoResponse("操作失败: "+e.getTargetException().getMessage());
		}
	}
	
	/**
	 * 注入HttpServletRequest
	 */
	public void setServletRequest(HttpServletRequest request) {
		this.request = request;
		this.session = request.getSession();
	}
	
	public HttpServletRequest getServletRequest() {
		return this.request;
	}
	
	public void setServletResponse(HttpServletResponse response) {
		this.response = response;
	}
	
	protected String getStringValue(Map<String, Object> paramMap, String key) {
		return GlobalUtil.getStringValue(paramMap, key);
	}
	
	protected String trimToNull(String str) {
		return GlobalUtil.trimToNull(str);
	}
}