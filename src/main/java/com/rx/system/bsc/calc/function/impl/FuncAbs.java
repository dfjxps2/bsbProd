package com.rx.system.bsc.calc.function.impl;

import com.rx.system.bsc.calc.function.IFunction;

/**
 * 
 * 函数格式为：
 * 	ABS(值1)
 * 返回值1的绝对值
 */

public class FuncAbs implements IFunction {
	
	private final int parameterCount = 1;
	
	/**
	 * @param paras是一个仅含有一个元素的数组
	 * @return 返回内容为
	 * 			"abs(" + paras[0] + ")"
	 */
	public String doParse(String[] paras) {
		return "abs(" + paras[0] + ")";
	}

	/**
	 * @return 返回函数需要的参数个数
	 * 
	 * */
	public int getParameterCount() {
		return this.parameterCount;
	}

	public String getFunctionDesc() {
		return "ABS(数值)";
	}

	public String getFunctionName() {
		return "ABS:取绝对值";
	}

	public String getFunctionType() {
		return IFunction.FUN_TYPE_NUM;
	}

}
