package com.rx.system.service.impl;

import java.util.List;

import com.rx.system.base.BaseService;
import com.rx.system.dao.ResourceDao;
import com.rx.system.domain.Resource;
import com.rx.system.domain.SysUser;
import com.rx.system.service.IResourceService;
/**
 * 系统菜单Service实现类
 * @author zzm
 *
 */
public class ResourceServiceImpl extends BaseService implements IResourceService {
	
	private ResourceDao resourceDao = null;
	private DataStore dataStore = null;
	
	//通过角色获取对应的菜单
	public List<Resource> getResourceByRoleId(String roleId)throws Exception {
		return resourceDao.getResourceByRoleId(roleId);
	}
	
	//得到登陆用户的菜单
	public List<Resource> getUserResource(SysUser user)throws Exception {
		return resourceDao.getUserResource(user);
	}
	
	//添加菜单
	public void addResource(Resource resource)throws Exception {
		if(resourceDao.getResourceById(resource.getResource_id()).size()>0){
			throw new Exception("资源代码为【"+resource.getResource_id()+"】已经被使用,请重新输入");
		}
		resourceDao.addResource(resource);
	}
	
	//删除菜单 联动删除菜单和角色关系
	public void removeResource(Resource resource)throws Exception {
		@SuppressWarnings("rawtypes")
		List treeList = dataStore.getResourceStore().getTreeListByParentID(resource.getResource_id());
		if(treeList != null && treeList.size()>0){
			throw new Exception("资源代码为【"+resource.getResource_id()+"】的菜单下有子菜单，请先删除子菜单。");
		}
		resourceDao.removeResource(resource);//删除菜单表
		resourceDao.removeResourceRoleRela(resource);//删除菜单与角色关系表
		dataStore.reloadResourceStore();
	}
	
	//修改菜单
	public void updateResource(Resource resource)throws Exception {
		resourceDao.updateResource(resource);
	}
	
	//根据菜单ID查询菜单对象
	public List<Resource>  getResourceById(String resourceID)throws Exception {
		return resourceDao.getResourceById(resourceID);
	}

	public void setResourceDao(ResourceDao resourceDao) {
		this.resourceDao = resourceDao;
	}

	public void setDataStore(DataStore dataStore) {
		this.dataStore = dataStore;
	}
}
