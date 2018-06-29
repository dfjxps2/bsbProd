package com.rx.log;

import java.util.Map;

/**
 * session登录日志销毁
 * @author chenxd
 *
 */
public interface SessionLogWriterDao {
	
	/**
	 * 更新session登出时间
	 * @param sessionId 更新记录的sessionId
	 * @throws Exception
	 */
	public void writeLogOut(String sessionId) throws Exception;
	
	/**
	 * 更新session超时销毁时间
	 * @param sessionId 更新记录的sessionId
	 * @param sessionInvalidTime 更新记录的sessionId
	 * @throws Exception
	 */
	public void sessionDestroyLog(Map<String, Object> paramMap) throws Exception;
	
	/**
	 * 记录用户登录日志
	 * @param sessionId 当前sessionId
	 * @param user_id: 登录用户id
	 * @param owner_id: 登录用户使用的权限机构号
	 * @param loginIP: 登录用户ip
	 * @throws Exception
	 */
	public void addSessionLog(Map<String, Object> paramMap) throws Exception;
	
	/**
	 * 添加方法操作日志
	 * @param sessionId 当前sessionId
	 * @param functionCode 操作方法的ID
	 * @throws Exception
	 */
	public void addFunctionLog(Map<String, Object> paramMap) throws Exception;
}
