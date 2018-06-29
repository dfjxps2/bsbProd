package com.rx.system.bsc.calc.function.impl;

import com.rx.system.bsc.calc.function.IFunction;

/**
 * 
 * 函数格式为：
 * 	POWER(n1,n2) 返回n1的n2次方
 */

public class FuncPower implements IFunction {
	
	private final int parameterCount = 2;
	
	/**
	 * @param paras是一个仅含有两个元素的数组
	 * @return 返回内容为
	 * 			"power(" + paras[0] + "," + paras[1] + ")";
	 */
	public String doParse(String[] paras) {
		return "power(" + paras[0] + "," + paras[1] + ")";
	}

	/**
	 * @return 返回函数需要的参数个数
	 * 
	 * */
	public int getParameterCount() {
		return this.parameterCount;
	}

	public String getFunctionDesc() {
		return "POWER(底数, 指数)";
	}

	public String getFunctionName() {
		return "POWER:求幂值";
	}

	public String getFunctionType() {
		return IFunction.FUN_TYPE_NUM;
	}

}
