package com.rx.system.bsc.calc.function.impl;

import com.rx.system.bsc.calc.function.IFunction;

/**
 * 
 * 函数格式为：
 * 	LOG(n1,n2) 返回以n1为底n2的对数，n1 >0 and not 1 ，n2>0
 */

public class FuncLog implements IFunction {
	
	private final int parameterCount = 2;
	
	/**
	 * @param paras是一个仅含有两个元素的数组
	 * @return 返回内容为
	 * 			"log(" + paras[0] + "," + paras[1] + ")";
	 */
	public String doParse(String[] paras) {
		return "log(" + paras[0] + "," + paras[1] + ")";
	}

	/**
	 * @return 返回函数需要的参数个数
	 * 
	 * */
	public int getParameterCount() {
		return this.parameterCount;
	}

	public String getFunctionDesc() {
		// TODO Auto-generated method stub
		return null;
	}

	public String getFunctionName() {
		// TODO Auto-generated method stub
		return null;
	}

	public String getFunctionType() {
		// TODO Auto-generated method stub
		return null;
	}

}
