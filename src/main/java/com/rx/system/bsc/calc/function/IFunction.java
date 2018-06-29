package com.rx.system.bsc.calc.function;

public interface IFunction {
	
	public static final String FUN_TYPE_NUM = "NUMBER";//函数类型：数值 
	public static final String FUN_TYPE_LOGIC = "LOGIC";//函数类型：逻辑 
	
	public int PARAMETER_COUNT_DEPENDED	=	-1;
	
	public String doParse(String [] paras);
	
	public int getParameterCount();
	
	public String getFunctionType(); //获取函数类型
	
	public String getFunctionName(); //获取函数名
	
	public String getFunctionDesc(); //获取函数表述
}
