package com.rx.system.filter;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang3.StringUtils;
import org.jasig.cas.client.authentication.AttributePrincipal;

import com.rx.log.SessionLogWriter;
import com.rx.system.bsc.synchrodata.Dom4jUtil;
import com.rx.system.bsc.synchrodata.SynchronizedDataConstants;
import com.rx.system.bsc.synchrodata.WebClient;
import com.rx.system.domain.SysUser;
import com.rx.system.service.IUserService;
import com.rx.system.service.impl.DataStore;

public class SessionValidFilter implements Filter {
	private DataStore store = null;
	private IUserService userService;
	private SessionLogWriter logWriter = null;
	public HttpSession session = null;
	public void setStore(DataStore store) {
		this.store = store;
	}

	public void init(FilterConfig config) throws ServletException {
		
	}
	
	
	public void doFilter(ServletRequest servletRequest, ServletResponse response,FilterChain chain) throws IOException, ServletException {

		HttpServletRequest req = (HttpServletRequest) servletRequest;
		HttpSession session = req.getSession(false);
		String userURI = null == req.getRequestURI() ? "" : req.getRequestURI();
		String contextPath = req.getContextPath();
		boolean canAnonymousAccess = (userURI.equalsIgnoreCase(contextPath))
				|| (userURI.equalsIgnoreCase(contextPath + "/"))
				|| (userURI.equalsIgnoreCase(contextPath + "/login_doLogin.action"))
				|| (userURI.equalsIgnoreCase(contextPath+ "/login.jsp"));
		if(canAnonymousAccess) {
			chain.doFilter(req, response);
		}else if(session == null || session.getAttribute("currentUser") == null) {
			((HttpServletResponse)response).sendRedirect(req.getContextPath()+"/login_doLogin.action");
			return;
		}else{
			chain.doFilter(req, response);
		}
	}
	

	
	public void destroy() {

	}
	
	public final static String RETURN_LOGIN ="http://10.10.10.42:8080/portal";
}
