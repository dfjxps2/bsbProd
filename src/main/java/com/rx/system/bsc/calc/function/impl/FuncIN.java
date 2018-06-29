package com.rx.system.bsc.calc.function.impl;

import com.rx.system.bsc.calc.function.IFunction;

/**
 * 该函数为虚拟函数，用于处理SQL中如a in (1,2,3)格式的表达式，函数格式为：
 * 	(a1,a2,...,an)
 * 函数仅返回(a1,a2,...,an)
 */

public class FuncIN implements IFunction {

	private final int parameterCount = IFunction.PARAMETER_COUNT_DEPENDED;

	/**
	 * @param paras是一个或多个元素的数组
	 * @return 返回内容为
	 * 			"(paras[0],paras[1],...,paras[n-1])"
	 */
	
	public String doParse(String[] paras) {
		String result = "";
		if (paras.length > 0){
			for (int i = 0; i < paras.length; i++)
			{
				result = result + paras[i] + (i<paras.length-1 ? "," : "");
			}
			result = "(" + result + ")";
		}
		else {
			result = "('')";
		}
		return result;
	}

	public String getFunctionDesc() {
		return "(值1,值2,...,值n)";
	}

	public String getFunctionName() {
		return "虚拟多值函数";
	}

	public String getFunctionType() {
		return IFunction.FUN_TYPE_LOGIC;
	}

	/**
	 * @return 返回函数需要的参数个数
	 * 
	 * */
	public int getParameterCount() {
		return this.parameterCount;
	}

}
