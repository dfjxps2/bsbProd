package com.rx.system.dao;

import java.util.List;

import com.rx.system.domain.Resource;
import com.rx.system.domain.SysUser;

/**
 * 系统菜单Dao接口
 * @author zzm
 *
 */
public interface ResourceDao {
	//通过角色获取对应的菜单
	public List<Resource> getResourceByRoleId(String roleId)throws Exception;
	
	//得到登陆用户的菜单
	public List<Resource> getUserResource(SysUser user)throws Exception;
	
	//添加菜单
	public void addResource(Resource resource)throws Exception;
	
	//删除菜单
	public void removeResource(Resource resource)throws Exception;
	
	//删除菜单与角色对象之间的关系
	public void removeResourceRoleRela(Resource resource)throws Exception;
	
	//修改菜单
	public void updateResource(Resource resource)throws Exception;
	
	//根据菜单ID查询菜单对象
	public List<Resource>  getResourceById(String resourceID)throws Exception;
}
