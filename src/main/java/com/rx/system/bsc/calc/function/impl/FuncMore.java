package com.rx.system.bsc.calc.function.impl;

import com.rx.system.bsc.calc.function.IFunction;

/**
 * 函数格式为：
 * 	MORE(n1,n2) 返回n1,n2中较大的一个数值
 */
public class FuncMore implements IFunction {
	private final int parameterCount = 2;
	
	public String doParse(String[] paras) {
		return "case when " + paras[0] + ">" + paras[1] + " then "+ paras[0] +" else "+ paras[1] +" end";
	}

	public int getParameterCount() {
		return this.parameterCount;
	}

	public String getFunctionDesc() {
		return "MORE( , )";
	}

	public String getFunctionName() {
		return "MORE：取较大值";
	}

	public String getFunctionType() {
		return IFunction.FUN_TYPE_NUM;
	}

}
