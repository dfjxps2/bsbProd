package com.rx.system.service;

import java.util.List;

import com.rx.system.domain.SysRole;

/**
 * 系统角色Service接口
 * @author zzm
 *
 */
public interface IRoleService {
	
	//获取角色列表
	public List<SysRole> listRole(SysRole role)throws Exception;
	
	//添加角色
	public void addRole(SysRole role)throws Exception;
	
	//删除角色
	public void removeRole(SysRole role)throws Exception;
				
	//修改角色信息
	public void modifyRoleInfo(SysRole role)throws Exception;
	
	//通过角色ID获取角色信息
	public List<SysRole> getRoleInfoById(String roleID)throws Exception;

	public void modifyRoleResource(String roleID, String[] resourceIDs)throws Exception;

}
