package com.rx.system.bsc.calc.function.impl;

import com.rx.system.bsc.calc.function.IFunction;

/**
 * 
 * 函数格式为：
 * 	CASE(条件1, 值1 [, ..., 条件n, 值n [,值m] ])
 */

public class FuncCase implements IFunction {
	
	private final int parameterCount = IFunction.PARAMETER_COUNT_DEPENDED;

	/**
	 * @param paras是一个仅含有不定项多个元素的数组
	 * @return 返回内容为<p>
	 * case when 条件1 then 值1 [... when 条件n then 值n [else 值m] ] end
	 */
	public String doParse(String[] paras) {
		String result = "";
		
		int paraCount	=	paras.length;
		
		if (paraCount <= 1){
			result		=	paras.length == 1 ? paras[0] : "";
			return result;
		}
		
		//条件个数
		int caseCount = paraCount / 2;
		
		result = "case";
		
		for(int i = 0; i < caseCount; i++)
		{
			result = result + " when " + paras[2*i] + " then " + paras[2*i + 1];
		}

		//如果参数个数为奇数，说明存在默认值
		if (paraCount%2 == 1){
			result = result + " else " + paras[paraCount-1];
		}
		
		result = result + " end";

		return result;
	}

	/**
	 * @return 返回函数需要的参数个数
	 * 
	 * */
	public int getParameterCount() {
		return this.parameterCount;
	}

	public String getFunctionDesc() {
		return "CASE(条件1,值1,条件2,值2,...,条件N,值N)";
	}

	public String getFunctionName() {
		return "CASE：多条件取值";
	}

	public String getFunctionType() {
		return IFunction.FUN_TYPE_LOGIC;
	}

}
