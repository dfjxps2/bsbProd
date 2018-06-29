package com.rx.system.service.impl;

import java.util.List;

import com.rx.system.base.BaseCacheService;
import com.rx.system.dao.StoreDao;
import com.rx.system.domain.Bank;
import com.rx.system.domain.Resource;
import com.rx.util.tree.TreeStore;

/**
 * 内存仓库Service实现类
 * @author chenxd
 *
 */
public class DataStore extends BaseCacheService{
	
	private StoreDao storeDao = null;
	
	private final String bank_cache_key = "bank_cache_key";
	private final String resource_cache_key = "resource_cache_key";
	
	public void initCache() throws Exception {
		this.getBankStore();
		this.getResourceStore();
	}
	
	//加载机构树
	public TreeStore getBankStore() throws Exception{
		TreeStore bankStore = super.getCacheObject(this.bank_cache_key, TreeStore.class);
		if(bankStore == null) {
			bankStore = new TreeStore();
			List<Bank> bankList = storeDao.getBankList();
			for (Bank b : bankList) {
				bankStore.addTreeNode(b);
			}
			super.addToCache(this.bank_cache_key, bankStore);
		}
		return bankStore;
	}
	
	public void reloadBankStore()throws Exception {
		super.expireCache(this.bank_cache_key);
		this.getBankStore();
	}
	
	//加载菜单树
	public TreeStore getResourceStore()throws Exception{
		TreeStore resourceStore = super.getCacheObject(this.resource_cache_key, TreeStore.class);
		if(resourceStore == null) {
			resourceStore = new TreeStore();
			List<Resource> resourceList = storeDao.getResourceList();
			for (Resource r : resourceList) {
				resourceStore.addTreeNode(r);
			}
			super.addToCache(this.resource_cache_key, resourceStore);
		}
		return resourceStore;
	}
	
	public void reloadResourceStore()throws Exception {
		super.expireCache(this.resource_cache_key);
		this.getResourceStore();
	}

	//获取系统时间
	public String getSysDate()throws Exception{
		return storeDao.getSysDate();
	}
	
	//获取当前对象
	public String getCurrentMonth()throws Exception{
		List<String> monthList = storeDao.getCurrentMonth(); 
		if(monthList.size() == 0)
			return null;
		return monthList.get(0);
	}

	public void setStoreDao(StoreDao storeDao) {
		this.storeDao = storeDao;
	}
}
