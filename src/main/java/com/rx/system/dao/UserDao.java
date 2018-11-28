package com.rx.system.dao;

import java.util.List;
import java.util.Map;

import com.rx.system.domain.Resource;
import com.rx.system.domain.SysUser;
import org.apache.ibatis.annotations.Param;

/**
 * 用户操作Dao接口
 * @author chenxd
 *
 */
public interface UserDao {
	
	//通过查询条件,查询出用户列表
	public List<Map<String, Object>> listUsers(Map<String, Object> paramMap)throws Exception;
	
	//通过查询条件,查询出用户列表
	public List<Map<String, Object>> userById()throws Exception;
	
	//查询用户列表数量
	public String getUsersCount(Map<String, Object> paramMap)throws Exception;
	
	//添加用户
	public void addUser(SysUser user)throws Exception;
	
	
	//删除用户
	public void removeUser(String userID)throws Exception;
	
	//删除用户与角色关系
	public void removeUserRoleRela(SysUser user)throws Exception;
	
	//修改用户信息
	public void modifyUser(SysUser user)throws Exception;
	
	//根据用户ID查找用户
	public List<SysUser> findUserById(String userID)throws Exception;
	
	//修改用户密码
	public void modifyPassword(Map<String, Object> paramMap)throws Exception;
	
	//添加用户角色
	public void addUserRole(Map<String, Object> paramMap)throws Exception;
	
	//根据用户ID获取用户角色
	public List<Map<String, Object>> getUserRole(Map<String, Object> paramMap)throws Exception;
	
	//插入用户与角色关系
	public void insertUserRoleRela(Map<String, Object> paramMap)throws Exception;
	
	//校验密码
	public int checkPassword(SysUser user)throws Exception;
	
	//获得待分配用户已经拥有的特殊权限
	public List<Map<String,Object>> getSpeciallyResourceList(Map<String,Object> paramMap) throws Exception;
	
	//获得当前用的菜单列表
	public List<Resource> getCurrentUserResourceList(Map<String,Object> paramMap) throws Exception;
	
	public void deleteSpeciallyAuthorize(Map<String,Object> paramMap) throws Exception;
	
	public void saveSpeciallyAuthorize(Map<String,Object> paramMap) throws Exception;
	
	public int isExistSpecialOrg(Map<String, Object> paramMap) throws Exception;
	
	/**
	 * 查询某用户所有的权限机构
	 * */
	public List<Map<String, Object>> getAllBankOrgIdByUserId(String login_user_id) throws Exception;
	
	/**
	 * 删除用户在某权限机构下的角色
	 * */
	public void deleteRoleByUserIdAndBankOrgId(Map<String, Object> paramMap) throws Exception;
	
	public void deleteInitPage(String userID) throws Exception;


	public void deleteUserDataTemp() throws Exception;

	public void insertBatchUserDataTemp(@Param("retList") List<Map<String, Object>> retList) throws Exception;
	//merge data
	public void mergeUserDataTemp() throws Exception;
	//insert
	public void insertBatchUserRoleRealData() throws Exception;

}
