package com.rx.system.bsc.calc.function.impl;

import com.rx.system.bsc.calc.function.IFunction;

/**
 * 
 * 函数格式为：
 * 	CEIL(n) 返回大于或等于n的最小的整数值
 */

public class FuncCeil implements IFunction {
	
	private final int parameterCount = 1;
	
	/**
	 * @param paras是一个仅含有一个元素的数组
	 * @return 返回内容为
	 * 			"ceil(" + paras[0] + ")"
	 */
	public String doParse(String[] paras) {
		return "ceil(" + paras[0] + ")";
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
