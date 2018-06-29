package com.rx.system.bsc.calc;

import java.util.HashMap;

/**
 * 环境变量容器 存放考核所需的上下文执行环境
 * @author chenxd
 *
 */
@SuppressWarnings("serial")
public class Context extends HashMap<String, String> {
	
	public Context() {
		super();
	}
	
	public Context(Context copyContext) {
		super(copyContext);
	}
	
	public void setEnv(String key,String value) {
		this.put(key, value);
	}
	
	public String getEnv(String key) {
		String obj = this.get(key);
		if(obj == null)
			return "";
		return obj;
	} 
	
}
