package com.rx.system.bsc.calc.function;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

public class FunctionFactory {
	
	public static final String FUNC_EXP			=	"EXP";
	public static final String FUNC_LN			=	"LN";
	public static final String FUNC_LOG			=	"LOG";
	public static final String FUNC_POWER		=	"POWER";
	
	public static final String FUNC_COS			=	"COS";
	public static final String FUNC_ACOS		=	"ACOS";
	public static final String FUNC_SIN			=	"SIN";
	public static final String FUNC_ASIN		=	"ASIN";
	public static final String FUNC_TAN			=	"TAN";
	public static final String FUNC_ATAN		=	"ATAN";

	public static final String FUNC_MOD			=	"MOD";
	public static final String FUNC_DIV			=	"DIV";
	
	public static final String FUNC_MORE		=	"MORE";
	public static final String FUNC_LESS		=	"LESS";
	public static final String FUNC_MIDDLE		=	"MIDDLE";
	
	public static final String FUNC_ABS			=	"ABS";
	public static final String FUNC_ROUND		=	"ROUND";
	public static final String FUNC_TRUNC		=	"TRUNC";
	public static final String FUNC_CEIL		=	"CEIL";
	public static final String FUNC_FLOOR		=	"FLOOR";
	
	public static final String FUNC_IN			=	"VIRTUAL_IN";
	public static final String FUNC_IF			=	"IIF";
	public static final String FUNC_CASE		=	"CASE";
	public static final String FUNC_ISNULL		=	"ISNULL";
	public static final String FUNC_PARENTHESIS	=	"PARENTHESIS";	
	
	private static Map<String, String> functionMap;	
	
	private static List<Map<String, Object>> functionList = null;
	
	private static void initialize()
	{
		if (null == functionMap)
		{
			functionMap	=	new	HashMap<String, String>();
			
			functionMap.put(FunctionFactory.FUNC_EXP, 			"com.rx.system.bsc.calc.function.impl.FuncExp");
			functionMap.put(FunctionFactory.FUNC_LN, 			"com.rx.system.bsc.calc.function.impl.FuncLn");
			functionMap.put(FunctionFactory.FUNC_LOG, 			"com.rx.system.bsc.calc.function.impl.FuncLog");
			functionMap.put(FunctionFactory.FUNC_POWER, 		"com.rx.system.bsc.calc.function.impl.FuncPower");
			
			functionMap.put(FunctionFactory.FUNC_COS, 			"com.rx.system.bsc.calc.function.impl.FuncCos");
			functionMap.put(FunctionFactory.FUNC_ACOS, 			"com.rx.system.bsc.calc.function.impl.FuncAcos");
			functionMap.put(FunctionFactory.FUNC_SIN, 			"com.rx.system.bsc.calc.function.impl.FuncSin");
			functionMap.put(FunctionFactory.FUNC_ASIN, 			"com.rx.system.bsc.calc.function.impl.FuncAsin");
			functionMap.put(FunctionFactory.FUNC_TAN, 			"com.rx.system.bsc.calc.function.impl.FuncTan");
			functionMap.put(FunctionFactory.FUNC_ATAN, 			"com.rx.system.bsc.calc.function.impl.FuncAtan");
			
			functionMap.put(FunctionFactory.FUNC_MOD, 			"com.rx.system.bsc.calc.function.impl.FuncMod");
			functionMap.put(FunctionFactory.FUNC_DIV, 			"com.rx.system.bsc.calc.function.impl.FuncDiv");
			
			functionMap.put(FunctionFactory.FUNC_MORE, 			"com.rx.system.bsc.calc.function.impl.FuncMore");
			functionMap.put(FunctionFactory.FUNC_LESS, 			"com.rx.system.bsc.calc.function.impl.FuncLess");
			functionMap.put(FunctionFactory.FUNC_MIDDLE, 		"com.rx.system.bsc.calc.function.impl.FuncMiddle");
			
			functionMap.put(FunctionFactory.FUNC_ABS, 			"com.rx.system.bsc.calc.function.impl.FuncAbs");			
			functionMap.put(FunctionFactory.FUNC_ROUND,			"com.rx.system.bsc.calc.function.impl.FuncRound");
			functionMap.put(FunctionFactory.FUNC_TRUNC,			"com.rx.system.bsc.calc.function.impl.FuncTrunc");
			functionMap.put(FunctionFactory.FUNC_CEIL, 			"com.rx.system.bsc.calc.function.impl.FuncCeil");
			functionMap.put(FunctionFactory.FUNC_FLOOR,			"com.rx.system.bsc.calc.function.impl.FuncFloor");
			
			functionMap.put(FunctionFactory.FUNC_IN, 			"com.rx.system.bsc.calc.function.impl.FuncIN");
			functionMap.put(FunctionFactory.FUNC_IF, 			"com.rx.system.bsc.calc.function.impl.FuncIF");
			functionMap.put(FunctionFactory.FUNC_CASE, 			"com.rx.system.bsc.calc.function.impl.FuncCase");
			functionMap.put(FunctionFactory.FUNC_ISNULL,		"com.rx.system.bsc.calc.function.impl.FuncIsnull");
			functionMap.put(FunctionFactory.FUNC_PARENTHESIS, 	"com.rx.system.bsc.calc.function.impl.FuncParenthesis");
			
		}		
	}
	
	public static boolean hasFunction(String functionName)
	{
		FunctionFactory.initialize();
		
		return FunctionFactory.functionMap.containsKey(functionName.toUpperCase());
	}
	
	public static List<Map<String, Object>> getFunctionList() throws InstantiationException, IllegalAccessException, ClassNotFoundException {
		if(FunctionFactory.functionMap == null) {
			initialize();
		}
		
		if(functionList == null) {
			functionList = new ArrayList<Map<String,Object>>();
			Iterator<String> keys = FunctionFactory.functionMap.keySet().iterator();
			while(keys.hasNext()) {
				String key = keys.next();
				IFunction function = (IFunction)Class.forName(FunctionFactory.functionMap.get(key)).newInstance();
				Map<String, Object> map = new HashMap<String, Object>();
				if(function.getFunctionName() == null)
					continue;
				map.put("functionType", function.getFunctionType());
				map.put("functionName", function.getFunctionName());
				map.put("functionDesc", function.getFunctionDesc());
				functionList.add(map);
			}
		}
		
		return functionList;
	}
	
	public static IFunction getFunction(String functionName)
	{
		FunctionFactory.initialize();
		
		IFunction function	=	null;
		
		try {
			function = (IFunction) Class.forName(FunctionFactory.functionMap.get(functionName.toUpperCase())).newInstance();
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return function;
	}
}
