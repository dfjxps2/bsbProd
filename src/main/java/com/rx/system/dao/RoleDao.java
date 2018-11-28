package com.rx.system.dao;

import java.util.List;
import java.util.Map;

import com.rx.system.domain.SysRole;

/**
 * 系统角色Dao接口
 * @author zzm
 *
 */
public interface RoleDao {
	
	//获取角色列表
	public List<SysRole> listRole(SysRole role)throws Exception;
	
	//添加角色
	public void addRole(SysRole role)throws Exception;
	
	//通过角色ID获取角色信息
	public List<SysRole> getRoleInfoById(String roleID)throws Exception;
	
	//修改角色信息
	public void modifyRoleInfo(SysRole role)throws Exception;

	//删除角色
	public void removeRole(SysRole role)throws Exception;
	
	//添加用户
	public void addUserRole(String user_id,String role_id)throws Exception;
	
	//删除角色对应资源关系
	public void deleteRoleResourceRela(String roleID)throws Exception;
	
	//删除角色对应用户关系
	public void deleteRoleUserRela(String roleID)throws Exception;
	
	//插入角色对应资源
	public void insertRoleResourceRela(Map<String, Object> paramMap)throws Exception;

}
