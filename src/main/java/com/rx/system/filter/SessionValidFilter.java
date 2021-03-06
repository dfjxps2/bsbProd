package com.rx.system.filter;

import com.rx.system.domain.SysUser;
import com.rx.system.service.impl.DataStore;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

public class SessionValidFilter implements Filter {
	private DataStore store = null;
	public void setStore(DataStore store) {
		this.store = store;
	}

	public void init(FilterConfig config) throws ServletException {
	}
	
	public void doFilter(ServletRequest request, ServletResponse response,FilterChain chain) throws IOException, ServletException {
		
		HttpServletRequest req = (HttpServletRequest) request;
		HttpSession session = req.getSession(false);
		
		String userURI = null == req.getRequestURI() ? "" : req.getRequestURI();
		String contextPath = req.getContextPath();
		
		boolean canAnonymousAccess = (userURI.equalsIgnoreCase(contextPath))
		|| (userURI.equalsIgnoreCase(contextPath + "/"))
		|| (userURI.equalsIgnoreCase(contextPath + "/login_doLogin.action"))
		|| (userURI.equalsIgnoreCase(contextPath+ "/login.jsp"));
		
		if(canAnonymousAccess) {
			chain.doFilter(request, response);
			return;
		}
		
		if(session == null || session.getAttribute("currentUser") == null) {
			((HttpServletResponse)response).sendRedirect(req.getContextPath()+"/login_doLogin.action");
			return;
			//((HttpServletResponse)response).sendRedirect(req.getContextPath()+"/login.jsp");
			//return;
		}
		
		chain.doFilter(request, response);
	}
	
	public void destroy() {

	}


}
