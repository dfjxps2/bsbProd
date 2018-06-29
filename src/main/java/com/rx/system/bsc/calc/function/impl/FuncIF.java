package com.rx.system.bsc.calc.function.impl;

import com.rx.system.bsc.calc.function.IFunction;

/**
 * 
 * 函数格式为：
 * 	IIF(真假表达式, 值1, 值2)
 * 如果表达式为真，返回值1，否则返回值2
 */

public class FuncIF implements IFunction {
	
	private final int parameterCount = 3;
	
	/**
	 * @param paras是一个仅含有三个元素的数组
	 * @return 返回内容为
	 * 			"case when " + paras[0] + " then " + paras[1] + " else " + paras[2] + " end"
	 */
	public String doParse(String[] paras) {
		return "case when " + paras[0] + " then " + paras[1] + " else " + paras[2] + " end";
	}

	/**
	 * @return 返回函数需要的参数个数
	 * 
	 * */
	public int getParameterCount() {
		return this.parameterCount;
	}

	public String getFunctionDesc() {
		return "IIF(条件表达式, 条件为真的数值, 条件为假的数值)";
	}

	public String getFunctionName() {
		return "IIF：单条件取值";
	}

	public String getFunctionType() {
		return IFunction.FUN_TYPE_LOGIC;
	}

}
