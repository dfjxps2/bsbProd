package com.rx.system.bsc.calc.function.impl;

import com.rx.system.bsc.calc.function.IFunction;

/**
 * 函数格式为：
 * 	LESS(n1,n2) 返回n1,n2中较小的一个数值
 */
public class FuncLess implements IFunction {
	private final int parameterCount = 2;
	
	public String doParse(String[] paras) {
		return "case when " + paras[0] + "<" + paras[1] + " then "+ paras[0] +" else "+ paras[1] +" end";
	}

	public int getParameterCount() {
		return this.parameterCount;
	}

	public String getFunctionDesc() {
		return "LESS( , )";
	}

	public String getFunctionName() {
		return "LESS：取较小值";
	}

	public String getFunctionType() {
		return IFunction.FUN_TYPE_NUM;
	}

}
