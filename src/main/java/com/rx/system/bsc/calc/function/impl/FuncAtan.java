package com.rx.system.bsc.calc.function.impl;

import com.rx.system.bsc.calc.function.IFunction;

/**
 * 
 * 函数格式为：
 * 	ATAN(n)反正切函数, n between -∞ and ∞，返回值between pi/2 and -pi/2
 */

public class FuncAtan implements IFunction {
	
	private final int parameterCount = 1;
	
	/**
	 * @param paras是一个仅含有一个元素的数组
	 * @return 返回内容为
	 * 			"atan(" + paras[0] + ")"
	 */
	public String doParse(String[] paras) {
		return "atan(" + paras[0] + ")";
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
