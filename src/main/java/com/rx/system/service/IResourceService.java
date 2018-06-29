package com.rx.system.service;

import java.util.List;

import com.rx.system.domain.Resource;
import com.rx.system.domain.SysUser;

/**
 * 系统菜单Service接口
 * @author zzm
 *
 */
public interface IResourceService {
	//通过角色获取对应的菜单
	public List<Resource> getResourceByRoleId(String roleId)throws Exception;
	
	//得到登陆用户的菜单
	public List<Resource> getUserResource(SysUser user)throws Exception;
	
	//添加菜单
	public void addResource(Resource resource)throws Exception;
	
	//删除菜单
	public void removeResource(Resource resource)throws Exception;
	
	//修改菜单
	public void updateResource(Resource resource)throws Exception;
	
	//根据菜单ID查询菜单对象
	public List<Resource>  getResourceById(String resourceID)throws Exception;
}
