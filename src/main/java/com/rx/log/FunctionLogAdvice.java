package com.rx.log;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.aspectj.lang.JoinPoint;

import com.rx.log.annotation.FunDesc;
/**
 * 方法访问日志记录通知类
 * @author chenxd
 *
 */
public class FunctionLogAdvice{
	
	@SuppressWarnings("unused")
	private SessionLogWriterDao sessionLogWriterDao = null;
	
	public void writeLog(JoinPoint jp) throws Exception{
		try {
			FunDesc funDesc = jp.getTarget().getClass().getDeclaredMethod(jp.getSignature().getName()).getAnnotation(FunDesc.class);
			HttpServletRequest request = (HttpServletRequest) jp.getTarget().getClass().getSuperclass().getDeclaredMethod("getServletRequest").invoke(jp.getThis());
			String functionCode = funDesc.code();
			this.writeFunctionLog(request.getSession().getId(), functionCode);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public void writeFunctionLog(String sessionId, String functionCode) throws Exception {
		if(sessionId.length() > 32) {
			sessionId = sessionId.substring(0, 32);
		}
		Map<String, Object> paramMap = new HashMap<String, Object>();
		paramMap.put("sessionId", sessionId);
		paramMap.put("functionCode", functionCode);
		//this.sessionLogWriterDao.addFunctionLog(paramMap);
	}

	public void setSessionLogWriterDao(SessionLogWriterDao sessionLogWriterDao) {
		this.sessionLogWriterDao = sessionLogWriterDao;
	}
}
