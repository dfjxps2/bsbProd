package com.rx.system.bsc.calc.function.impl;

import com.rx.system.bsc.calc.function.IFunction;

/**
 * @author chengjie
 * 括号，处理非函数类的括号表达式的特殊函数，比如处理(a+b) / (c+d)
 * 函数格式为：
 * 	(算数表达式或逻辑表达式)
 * 返回结果为待定
 */

public class FuncParenthesis implements IFunction {
	
	private final int parameterCount = 1;

	
	/**
	 * @param paras是一个仅含有一个元素的数组
	 * @return 返回内容为 "(" + paras[0] + ")"
	 */
	public String doParse(String[] paras) {
		String result = "";
		
		if (paras.length > 0){
			for (int i = 0; i < paras.length; i++){
				if (i == 0){
					result = paras[i];
				}
				else{
					result = result + "," + paras[i];
				}
			}
			
			result = "(" + result + ")";
		}		
		
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
