package com.rx.system.bsc.calc.function.impl;

import com.rx.system.bsc.calc.function.IFunction;

/**
 * 函数格式为：
 * 	MOD(n1,n2) 返回n1除n2的余数，如果n2=0则返回n1的值
 */

public class FuncMod implements IFunction {

	private final int parameterCount = 2;
	
	/**
	 * @param paras是一个仅含有两个元素的数组
	 * @return 返回内容为
	 * 			"mod(" + paras[0] + "," + paras[1] + ")"
	 */
	public String doParse(String[] paras) {
		String result = "mod(" + paras[0] + "," + paras[1] + ")";
		return result;
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
