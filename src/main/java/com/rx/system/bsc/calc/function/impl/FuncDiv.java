package com.rx.system.bsc.calc.function.impl;

import com.rx.system.bsc.calc.function.IFunction;

/**
 * 函数格式为：
 * 	DIV(n1,n2) 返回n1除n2的商，如果n2=0则返回0
 */

public class FuncDiv implements IFunction {
	private final int parameterCount = 2;
	
	/**
	 * @param paras是一个仅含有两个元素的数组
	 * @return 返回内容为
	 * 			"case when " + paras[1] + " = 0 then 0 else " + paras[0] + "/"+ paras[1] + " end"
	 */
	public String doParse(String[] paras) {
		return "case when " + paras[1] + " = 0 then 0 else " + paras[0] + "/"+ paras[1] + " end";
	}

	/**
	 * @return 返回函数需要的参数个数
	 * */
	public int getParameterCount() {
		return this.parameterCount;
	}

	public String getFunctionDesc() {
		return "DIV(被除数, 除数)";
	}

	public String getFunctionName() {
		return "DIV：除法(除数可为0)";
	}

	public String getFunctionType() {
		return IFunction.FUN_TYPE_NUM;
	}

}
