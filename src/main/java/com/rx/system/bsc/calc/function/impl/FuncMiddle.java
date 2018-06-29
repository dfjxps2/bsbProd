package com.rx.system.bsc.calc.function.impl;

import com.rx.system.bsc.calc.function.IFunction;

/**
 * 函数格式为：
 * 	MIDDLE(val,low,high) 返回3个变量中值大小为中间的那个值
 */
public class FuncMiddle implements IFunction {
	private final int parameterCount = 3;
	
	public String doParse(String[] paras) {
		return	"case when " + paras[0] + " between " + paras[1] + " and " + paras[2] + " then " + paras[0] +		                                                                                                
		        	" when " + paras[0] + " between " + paras[2] + " and " + paras[1] + " then " + paras[0] +
					" when " + paras[1] + " between " + paras[0] + " and " + paras[2] + " then " + paras[1] +
					" when " + paras[1] + " between " + paras[2] + " and " + paras[0] + " then " + paras[1] +
		        	" else " + paras[2] + " end";
	}

	public int getParameterCount() {
		return this.parameterCount;
	}

	public String getFunctionDesc() {
		return "MIDDLE( , , )";
	}

	public String getFunctionName() {
		return "MIDDLE：取中间值";
	}

	public String getFunctionType() {
		return IFunction.FUN_TYPE_NUM;
	}

}
