package com.rx.system.base;

import net.sf.ehcache.Cache;
import net.sf.ehcache.Element;

import org.apache.log4j.Logger;

/**
 * 支持缓存的Service抽象类
 * @author chenxd 2013-12-3
 *
 */
public abstract class BaseCacheService extends BaseService {
	
	private static final Logger logger = Logger.getLogger(BaseCacheService.class);
	
	private Cache cache = null;
	
	/**
	 * 将对象添加到缓存容器
	 * @param key
	 * @param obj
	 */
	protected final void addToCache(String key, Object obj) {
		logger.info("缓存对象---> key = " +key);
		Element element = new Element(key, obj);
		this.cache.put(element);
	}
	
	/**
	 * 手动清除缓存
	 * @param key 缓存的key
	 */
	protected final void expireCache(String key) {
		logger.info("清除缓存对象---> key = " +key);
		this.cache.remove(key);
	}
	
	/**
	 * 从缓存中获取对象
	 * @param key
	 * @return
	 */
	protected final Object getCacheObject(String key) {
		return this.cache.get(key);
	}
	
	/**
	 * 从缓存中获取对象
	 * @param key
	 * @return
	 */
	@SuppressWarnings("unchecked")
	protected final <T> T getCacheObject(String key, Class<T> cls) {
		T value = null;
		if(this.cache.get(key) != null) {
			value = (T) this.cache.get(key).getObjectValue();
		}
		return value;
	}
	
	public void setCache(Cache cache) {
		this.cache = cache;
	}
}
