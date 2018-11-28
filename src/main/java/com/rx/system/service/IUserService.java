package com.rx.system.service;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.rx.system.domain.SysUser;
import com.rx.util.tree.TreeStore;

/**
 * 系统用户操作Service接口
 * @author chenxd
 *
 */
public interface IUserService {
	
	//通过查询条件,查询出用户列表
	public List<Map<String, Object>> listUsers(Map<String, Object> paramMap)throws Exception;
	
	//通过查询条件,查询出用户列表
	public List<Map<String, Object>> userById()throws Exception;
	
	//获取查询出用户列表的总数
	public String getTotalNum();
	
	//添加用户
	public void addUser(SysUser user)throws Exception;
	
	//删除用户
	public void removeUser(String userID)throws Exception;
	
	//修改用户信息
	public void updataUser(SysUser user)throws Exception;
	
	//修改用户信息
	public void modifyUser(HttpServletRequest request,SysUser user)throws Exception;
	
	//根据用户ID查找用户
	public SysUser findUserById(String userID)throws Exception;
	
	//修改用户密码
	public void modifyPassword(Map<String, Object> paramMap)throws Exception;
	
//	//添加用户角色
//	public void addUserRole(String user_id, String role_ids)throws Exception;
	
	//根据用户ID获取用户角色
	public List<Map<String, Object>> getUserRole(Map<String, Object> paramMap)throws Exception;
	
	//保存用户角色
	public void saveUserRole(SysUser user,String[] idArray)throws Exception;
	
	//校验密码
	public int checkPassword(SysUser user)throws Exception;
	
	//获得当前用户的菜单列表
	public TreeStore getCurrentUserResourceList(Map<String,Object> paramMap) throws Exception;
	
	//获得待分配用户已经拥有的特殊权限
	public Map<String,String> getSpeciallyResource(Map<String,Object> paramMap) throws Exception;
	
	public void saveSpeciallyAuthorize(Map<String,Object> paramMap) throws Exception ;
	
	/**
	 * 判断用户是否存在特殊权限机构ID
	 * @param paramMap：
	 * 			key: login_user_id 登陆用户ID
	 * 			key: special_org_id 权限机构ID
	 * @return boolean
	 * @throws Exception
	 */
	public boolean isExistSpecialOrg(Map<String, Object> paramMap) throws Exception;
	
	/**
	 * 查询某用户所有的权限机构
	 * */
	public List<Map<String, Object>> getAllBankOrgIdByUserId(String login_user_id) throws Exception;
	
	/**
	 * 删除某用户在某权限机构下的角色
	 * */
	public void deleteRoleByUserIdAndBankOrgId(Map<String, Object> paramMap) throws Exception;


	/**
	 *
		同步用户数据
	 */
	public void synchronizedUserData(List<Map<String,Object>> retList) throws Exception;
	
}
