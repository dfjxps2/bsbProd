package com.rx.system.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.rx.system.base.BaseService;
import com.rx.system.dao.RoleDao;
import com.rx.system.domain.SysRole;
import com.rx.system.service.IRoleService;
/**
 * 系统角色Service操作实现类
 * @author zzm
 *
 */
public class RoleServiceImpl extends BaseService implements IRoleService {
	
	private RoleDao roleDao = null;
	
	//获取角色列表
	public List<SysRole> listRole(SysRole role)throws Exception {
		return roleDao.listRole(role);
	}
	
	//添加角色
	public void addRole(SysRole role)throws Exception {
		roleDao.addRole(role);
	}

	//删除角色
	public void removeRole(SysRole role)throws Exception {
		roleDao.removeRole(role);//删除角色表
		roleDao.deleteRoleResourceRela(role.getRole_id());////删除角色对应资源
		roleDao.deleteRoleUserRela(role.getRole_id());//删除角色对应用户
	}
	
	//修改角色信息
	public void modifyRoleInfo(SysRole role)throws Exception {
		roleDao.modifyRoleInfo(role);
	}

	//通过角色ID获取角色信息
	public List<SysRole> getRoleInfoById(String roleID)throws Exception {
		return roleDao.getRoleInfoById(roleID);
	}
	
	//修改角色对应菜单
	public void modifyRoleResource(String roleID, String[] resourceIDs)
			throws Exception {
		Map<String, Object> paramMap = new HashMap<String, Object>();
		roleDao.deleteRoleResourceRela(roleID);
		for (int i = 0; i < resourceIDs.length; i++) {
			if(!"".equals(resourceIDs[i])){
				paramMap.put("role_id", roleID);
				paramMap.put("resource_id", resourceIDs[i]);
				roleDao.insertRoleResourceRela(paramMap);
			}
		}		
	}
	
	public void setRoleDao(RoleDao roleDao) {
		this.roleDao = roleDao;
	}
	
}
