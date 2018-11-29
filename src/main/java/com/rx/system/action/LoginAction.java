package com.rx.system.action;

import java.security.Principal;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletContext;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import com.rx.system.bsc.synchrodata.CookieUtil;
import org.apache.commons.lang3.StringUtils;
import org.jasig.cas.client.authentication.AttributePrincipal;

import com.rx.log.SessionLogWriter;
import com.rx.log.annotation.FunDesc;
import com.rx.log.annotation.UseLog;
import com.rx.system.base.BaseDispatchAction;
import com.rx.system.bsc.synchrodata.Dom4jUtil;
import com.rx.system.bsc.synchrodata.SynchronizedDataConstants;
import com.rx.system.bsc.synchrodata.WebClient;
import com.rx.system.domain.SysUser;
import com.rx.system.service.IUserService;
import com.rx.system.service.impl.DataStore;

/**
 * 登陆Action
 *
 * @author chenxd
 */
public class LoginAction extends BaseDispatchAction {

	private static final long serialVersionUID = 4339583124527968189L;

	private IUserService userService = null;
	private DataStore store = null;
	private SessionLogWriter logWriter = null;

	/**
	 * Ajax登陆方法
	 *
	 * @return
	 * @throws Exception
	 */
	@FunDesc(code = "SYS_0001")
	@UseLog
	public String doLogin() throws Exception {
		//获取前端登陆参数
		//String user_id = request.getParameter("user_id");
		//String password = request.getParameter("password");
/*		AttributePrincipal principal = (AttributePrincipal) request.getUserPrincipal();
		String user_id = null;
		if (String.valueOf(principal).equals("null")==false) {
			user_id = principal.getName();

		}*/
		String user_id = getCasLoginUsername();
		if(null == user_id || "".equals(user_id)){
			user_id = CookieUtil.getValue(request, SynchronizedDataConstants.CAS_LOGIN_USER);
		}
		System.out.println("------------------user_id---------="+user_id);
		System.out.println("------------------user_id---------="+user_id);
		//CAS
		String password = "1";
		 List<Map<String,Object>> list =  getPortalUser(user_id);
		//JSON返回结果Map
		Map<String, Object> results = new HashMap<String, Object>();
		//同步用户数据
		getUserInfo(list);

		try {
			//根据输入用户名查询用户列表
			SysUser user = userService.findUserById(user_id);
			//判断用户不存在的情况
			//验证密码是否一致
			if (!user.getPassword().equals(password))
				throw new Exception("密码输入错误");

			//登录成功日志记录
			String loginIP = this.getUserIP(request);
			logWriter.addSessionLog(session.getId(), user, loginIP);

			//登陆成功处理
			session.setAttribute("currentUser", user);

			//加载系统时间
			session.setAttribute("sysDate", store.getSysDate());
			session.setAttribute("currentMonth", store.getCurrentMonth());

			doSuccessInfoResponse("登陆成功");
		} catch (Exception e) {
			e.printStackTrace();
			results.put("info", e.getMessage());
			doFailureInfoResponse(e.getMessage());
		}
		return "main";
	}
	private String getCasLoginUsername() {
		String username = request.getRemoteUser();
		if(StringUtils.isNotBlank(username))
			return username;
		Principal pal = request.getUserPrincipal();
		if(pal != null){
			username = pal.getName();
			if(username != null)
				return username;
		}
		Object obj = request.getAttribute("credentials");
		if(obj != null){
			return obj.toString();
		}

		return username;
	}

	
	private String getParamsByReq(HttpServletRequest request, String name) {
		 ServletContext servletContext = request.getSession().getServletContext();
		 String val = servletContext.getInitParameter(name);
	    return val;
	  }


	public List<Map<String,Object>> getPortalUser(String user_id) throws Exception{
		WebClient web = new WebClient();
		Map<String,Object> mp = new HashMap<String, Object>();
		mp.put("arg0",getParamsByReq(request, "thisName"));
		mp.put("arg1",user_id);
		String operationName = SynchronizedDataConstants.GET_ONEUSER_WSDL_OPERATION_NAME;
		String retXml = web.getWsdlResultByCode(mp,operationName); //传入参数名，参数值，方法名
		List<Map<String,Object>> retList = Dom4jUtil.readDom4jXml(retXml);
		return retList;
	}

/*	public List<Map<String,Object>> getPortalUser() throws Exception{
		WebClient web = new WebClient();
		 Map<String,Object> mp = new HashMap<String, Object>();

		 mp.put("arg0",getParamsByReq(request, "thisName"));
		 mp.put("arg1","");
		 mp.put("arg2","");
		 String operationName = SynchronizedDataConstants.GET_BATCHUSER_WSDL_OPERATION_NAME;
		 String retXml = web.getWsdlResultByCode(mp,operationName); //传入参数名，参数值，方法名
		 List<Map<String,Object>> retList = Dom4jUtil.readDom4jXml(retXml);
		 return retList;
	}*/
	
	public void getUserInfo(List<Map<String, Object>> retList) throws Exception{
		 for (int i = 0; i < retList.size(); i++) {
			 if (ifUser((String) retList.get(i).get("user_name"))){
				userService.updataUser(setUser(retList.get(i)));
			 }else {
				userService.addUser(setUser(retList.get(i)));
			}
		}
	}
	
	public boolean ifUser(String user_name) throws Exception{
		List<Map<String, Object>> list = userService.userById();
		for (int j = 0; j < list.size(); j++) {
			if (user_name.equals(list.get(j).get("USER_ID"))) {
				return true;
			}
		}	
		return false;
	}
	
	public boolean ifThisUser(List<Map<String, Object>> list,String user_name) throws Exception{
		for (int j = 0; j < list.size(); j++) {
			if (user_name.equals(list.get(j).get("user_name"))) {
				return true;
			}
		}	
		return false;
		
	}
	
	public SysUser setUser(Map<String, Object> map){
		SysUser user = new SysUser();
		 user.setUser_id((String) map.get("user_name"));
		 user.setPassword("1");
		 user.setUser_name((String) map.get("user_real_name"));
		 user.setBank_org_id("460106");
		 user.setBank_org_name("460106");
		 user.setCert_id("1");
		 user.setGender_code("0");
		 user.setUser_mobile((String) map.get("user_tel"));
		 user.setUser_email("");
		 user.setUser_address("");
		 user.setUser_post("");
		 user.setUser_status("00");
		 user.setBegin_date("");
		 user.setEnd_date("");
		 user.setBusi_line_id("oth");
		 user.setJob_type_id("00");
		 user.setOwner_org_id("");
		 user.setOwner_org_name("");
		 return user;
	}
	
	
	/**
	 * 用户退出
	 *
	 * @return
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	@FunDesc(code = "SYS_0002")
	@UseLog
	public String doLogout() throws Exception {

		Map<String, Object> results = new HashMap<String, Object>();
		try {
			HttpSession session = request.getSession();
			Enumeration<String> e = session.getAttributeNames();
			while (e.hasMoreElements()) {
				String sessionName = e.nextElement();
				session.removeAttribute(sessionName);
			}
			System.out.println("清空session完成");
			//清空Cookie
			Cookie[] cookies = request.getCookies();
			for (int i = 0; i < cookies.length; i++) {
				Cookie cookie = cookies[i];
				cookie.setMaxAge(0);
				cookie.setPath("/");
				response.addCookie(cookie);
			}
			this.logWriter.logOutLog(session.getId());
			session.invalidate();
			doSuccessInfoResponse("退出成功");
		} catch (Exception e) {
			e.printStackTrace();
			results.put("info", e.getMessage());
			doFailureInfoResponse(e.getMessage());
		}

		return null;
	}


	/**
	 * 切换用户机构
	 *
	 * @return
	 * @throws Exception
	 */
	@FunDesc(code = "SYS_0025")
	@UseLog
	public String switchPrivateOrg() throws Exception {
		try {
			//获取参数
			Map<String, Object> paramMap = getRequestParam(request);

			//检验用户是否拥有参数中的机构特殊权限
			if (this.userService.isExistSpecialOrg(paramMap)) {
				//切换用户权限机构    ---获取当前Session中用户
				SysUser user = getCurrentUser();

				//切换用户权限机构    ---设置用户的bank_org_id属性为新的权限机构ID
				user.setBank_org_id(getStringValue(paramMap, "special_org_id"));
				user.setBank_org_name(store.getBankStore().getTreeNode(user.getBank_org_id()).getNodeName());
				System.out.println(user.getBank_org_id());

				//切换用户权限机构    ---清空Session并结束当前用户登录日志记录
				this.logWriter.logOutLog(session.getId());
				session.invalidate();

				//切换用户权限机构    ---将用户信息重新放入session并记录登陆日志
				this.session = request.getSession(true);
				//登陆成功处理
				this.session.setAttribute("currentUser", user);

				//加载系统时间
				this.session.setAttribute("sysDate", store.getSysDate());
				this.session.setAttribute("currentMonth", store.getCurrentMonth());

				String loginIP = this.getUserIP(request);
				logWriter.addSessionLog(session.getId(), user, loginIP);

			} else {
				//用户没有参数中传入的机构特殊权限,抛出异常
				throw new Exception("切换权限机构出错,用户不存在特殊权限机构[" + getStringValue(paramMap, "special_org_id") + "]");
			}

		} catch (Exception e) {
			e.printStackTrace();
			this.logWriter.logOutLog(session.getId());
			return "rlogin";
		}
		return "main";
	}

	/**
	 * 获取用户拥有的权限机构列表
	 *
	 * @return
	 * @throws Exception
	 */
	public String listChangeOrg() throws Exception {
		try {
			doJSONResponse(this.userService.getAllBankOrgIdByUserId(getCurrentUser().getUser_id()));
		} catch (Exception e) {
			e.printStackTrace();
			doFailureInfoResponse(e.getMessage());
		}
		return null;
	}

	/**
	 * 获取用户登录的IP地址
	 *
	 * @param request
	 * @return
	 * @throws Exception
	 */
	private String getUserIP(HttpServletRequest request) throws Exception {
		if (request.getHeader("x-forwarded-for") == null) {
			return request.getRemoteAddr();
		}
		return request.getHeader("x-forwarded-for");
	}


	public void setUserService(IUserService userService) {
		this.userService = userService;
	}

	public void setStore(DataStore store) {
		this.store = store;
	}

	public void setLogWriter(SessionLogWriter logWriter) {
		this.logWriter = logWriter;
	}



}
