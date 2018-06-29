package com.rx.system.util;

import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

import org.springframework.context.ApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.rx.log.SessionLogWriter;

/**
 * 系统session监听器
 * @author chenxd
 *
 */
public class SystemSessionListener implements HttpSessionListener {
	
	private static ApplicationContext cxt = null;
	
	/**
	 * 创建session
	 */
	public void sessionCreated(HttpSessionEvent event) {
		//用户登录日志在loginAction中记录
	}
	
	/**
	 * session销毁
	 */
	public void sessionDestroyed(HttpSessionEvent event) {
		HttpSession session = event.getSession();
		SessionLogWriter writer = (SessionLogWriter) this.getBean(session, "sessionLogWriter");
		try {
			writer.sessionDestroyLog(session.getId());
		} catch (Exception e) {
			System.out.println("用户session失效日志记录失败");
			e.printStackTrace();
		}
	}
	
	/**
	 * 获取spring容器中的Bean
	 * @param session
	 * @param name
	 */
	private Object getBean(HttpSession session,String name) {
		if(cxt == null) {
			cxt = WebApplicationContextUtils.getRequiredWebApplicationContext(session.getServletContext());
		}
		return cxt.getBean(name);
	}
}
