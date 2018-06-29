package com.rx.system.bsc.calc.function.impl;

import com.rx.system.bsc.calc.function.IFunction;

/**
 * 函数格式为：
 * 	ISNULL(p1) 如果p1为null，则返回真，否则为假
 */

public class FuncIsnull implements IFunction {
	
	private final int parameterCount = 1;

	/**
	 * @param paras是一个仅含有一个元素的数组
	 * @return 返回内容为
	 * 			return paras[0] + " is null" ;
	 */
	public String doParse(String[] paras) {			
		return paras[0] + " is null";
	}

	/**
	 * @return 返回函数需要的参数个数
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
