package com.rx.system.dao;

import java.util.List;

import com.rx.system.domain.Bank;
import com.rx.system.domain.Product;
import com.rx.system.domain.Resource;

/**
 * 内存仓库Dao
 * @author chenxd
 *
 */
public interface StoreDao {
	
	//获取机构树表
	public List<Bank> getBankList()throws Exception;
	
	//获取菜单树列表
	public List<Resource> getResourceList()throws Exception;
	
	//获取产品树列表
	public List<Product> getMeasureList() throws Exception;
	
	//获取系统时间
	public String getSysDate()throws Exception;
	
	//获取当前月
	public List<String> getCurrentMonth() throws Exception;
	
}
