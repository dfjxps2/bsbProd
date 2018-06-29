package com.rx.system.bsc.calc.function.impl;

import com.rx.system.bsc.calc.function.IFunction;

/**
 * 函数格式为：
 * 	TRUNC(n1,n2) 返回截尾到n2位小数的n1的值，如果n2为负值，就截尾在小数点左边相应的位上
 */

public class FuncTrunc implements IFunction {
	
	private final int parameterCount = 2;

	/**
	 * @param paras是一个仅含有两个元素的数组
	 * @return 返回内容为
	 * 			return "trunc(" + paras[0] + "," + paras[1] + ")";
	 */
	public String doParse(String[] paras) {			
		return "trunc(" + paras[0] + "," + paras[1] + ")";
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
