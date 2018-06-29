package com.rx.system.init;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;

import org.springframework.context.ApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.rx.system.service.impl.DataStore;
/**
 * 系统初始化Servlet
 * 加载常用数据到内存存放
 * @author chenxd
 *
 */
public class InitService extends HttpServlet {

	private static final long serialVersionUID = 1L;

	public void init() throws ServletException {
		ApplicationContext cxt = WebApplicationContextUtils.getRequiredWebApplicationContext(this.getServletConfig().getServletContext());
		DataStore dataStore = (DataStore) cxt.getBean("dataStore");
		
		try {
			dataStore.initCache();
		} catch (Exception e) {
			e.printStackTrace();
		}
		
	}
}
