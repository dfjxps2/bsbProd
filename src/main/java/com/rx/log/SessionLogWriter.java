package com.rx.log;

import java.util.HashMap;
import java.util.Map;

import com.rx.system.domain.SysUser;

public class SessionLogWriter {
	
	private String sessionInvalidTime = "30";//session失效时间(分钟)
	
	private SessionLogWriterDao sessionLogWriterDao = null;
	
	public void addSessionLog(String sessionId, SysUser user,String loginIP) throws Exception {
		if(sessionId.length() > 32) {
			sessionId = sessionId.substring(0, 32);
		}
		Map<String, Object> paramMap = new HashMap<String, Object>();
		paramMap.put("sessionId", sessionId);
		paramMap.put("user_id", user.getUser_id());
		paramMap.put("loginIP", loginIP);
		paramMap.put("owner_id", user.getBank_org_id());
		this.sessionLogWriterDao.addSessionLog(paramMap);
	}
	
	public void logOutLog(String sessionId) throws Exception {
		if(sessionId.length() > 32) {
			sessionId = sessionId.substring(0, 32);
		}
		this.sessionLogWriterDao.writeLogOut(sessionId);
	}
	
	public void sessionDestroyLog(String sessionId) throws Exception {
		if(sessionId.length() > 32) {
			sessionId = sessionId.substring(0, 32);
		}
		Map<String, Object> paramMap = new HashMap<String, Object>();
		paramMap.put("sessionId", sessionId);
		paramMap.put("sessionInvalidTime", sessionInvalidTime);
		this.sessionLogWriterDao.sessionDestroyLog(paramMap);
	}
	
	public void setSessionLogWriterDao(SessionLogWriterDao sessionLogWriterDao) {
		this.sessionLogWriterDao = sessionLogWriterDao;
	}

	public void setSessionInvalidTime(String sessionInvalidTime) {
		this.sessionInvalidTime = sessionInvalidTime;
	}
	
}
