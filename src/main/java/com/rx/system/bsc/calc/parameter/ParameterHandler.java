package com.rx.system.bsc.calc.parameter;

import java.util.List;

import com.rx.system.bsc.calc.Context;

/**
 * 公式参数处理类
 * @author chenxd
 *
 */
public class ParameterHandler {
	
	private Context context = null;//运行环境变量
	
	public ParameterHandler(Context context) {
		this.context = context;
	}
	
	/**
	 * 参数的默认值;<p>被引用的参数作为字段名返回,数据集无主键</p>
	 * @param params
	 * @return
	 */
	public String getParameterSource(List<String> params)
	{
		if (null == params || params.size() == 0)
			return null;
		
		String result	=	"select ";
		
		String tmpID	=	"";
		String tmpExpr	=	"";
		for (int i = 0; i < params.size(); i++) {
			tmpID	=	params.get(i);
			
			tmpExpr	=	(i == 0 ? "" : "," )
				+ "max(case when parameter_id = '"+tmpID+"' then value end) as " + tmpID;
			
			result	=	result + tmpExpr;
		}
		
		result	=	result + " from bsc_parameter";
		
		return result;
	}
	
	/**
	 * @return
	 * 对象对应的参数的值；<p>被引用的参数作为字段名返回，对象ID作为数据集主键
	 * */
	public String getObjParaSource(List<String> params)
	{
		if (null == params || params.size() == 0)
			return null;
		
		String result	=	"select object_id";
		
		String tmpID	=	"";
		String tmpExpr	=	"";
		for (int i = 0; i < params.size(); i++) {
			tmpID	=	params.get(i);
			
			tmpExpr	= ", max(case when parameter_id = '"+tmpID+"' then value end) as " + tmpID;
			
			result	=	result + tmpExpr;
		}
		
		result	=	result + " from bsc_proj_obj_para where project_id='" + this.context.getEnv("projectID")
					+ "' group by object_id";
		
		return result;
	}
	
	/**
	 * @return
	 * 对象对应的参数的值；<p>被引用的参数作为字段名返回，对象ID作为数据集主键
	 * */
	public String getBonusObjParaSource(List<String> params)
	{
		if (null == params || params.size() == 0)
			return null;
		
		String result	=	"select object_id";
		
		String tmpID	=	"";
		String tmpExpr	=	"";
		for (int i = 0; i < params.size(); i++) {
			tmpID	=	params.get(i);
			
			tmpExpr	= ", max(case when parameter_id = '"+tmpID+"' then value end) as " + tmpID;
			
			result	=	result + tmpExpr;
		}
		
		result	=	result + " from bsc_bonus_obj_para where bonus_proj_id='" + this.context.getEnv("bonusProjectID")
					+ "' group by object_id";
		
		return result;
	}
	
}
