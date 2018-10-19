package com.rx.system.action;

import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import com.rx.log.SessionLogWriter;
import com.rx.log.annotation.FunDesc;
import com.rx.log.annotation.UseLog;
import com.rx.system.base.BaseDispatchAction;
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
		//CAS
		String user_id = "00000";
		String password = "1";

		//JSON返回结果Map
		Map<String, Object> results = new HashMap<String, Object>();

		try {
			//根据输入用户名查询用户列表
			SysUser user = userService.findUserById(user_id);

			//判断用户不存在的情况
			if (user == null)
				throw new Exception("不存在用户[" + user_id + "]");

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

//		return "main";
		return null;
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
