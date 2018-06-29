package com.rx.system.domain;

import java.util.ArrayList;
import java.util.List;

import com.rx.system.bsc.calc.parse.StringUtil;
import com.rx.system.bsc.calc.service.IMeasure;
import com.rx.system.util.CommonUtil;

/**
 * 平衡计分卡指标
 * @author chenxd
 *
 */
public class BscMeasure implements IMeasure{
	
	private String measure_id;
	private String parent_measure_id;
	private String measure_name;
	private String measure_desc;
	private String source_type_id;
	private String source_id;
	private String formula_expr;
	private String result_type_id;
	private String obj_cate_id;
	private String is_private;
	private String owner_org_id;
	
	private String parseFilters(String cond) throws Exception
	{
		if (cond == null || "".equals(cond.trim()))
			return null;
		
		//给原始表达式转码，防止出现文本字符串里包含=、in而导致的截串错误
		String src = StringUtil.encodeInnerString(cond.trim());
		
		String col		=	"";
		String val		=	"";
		String filter 	=	"";
		
		int operPosition = src.indexOf("=");
		
		//以等号分隔
		if (operPosition > 0){
			col	=	StringUtil.decodeInnerString(src.substring(0, operPosition)).trim();
			val	=	StringUtil.decodeInnerString(src.substring(operPosition+1)).trim();
			filter = col + ":" + StringUtil.deClosure(val, "'");
		}else{
			//否则，判断是否是以in分隔
			operPosition = src.indexOf(" in ");
			if (operPosition > 0){
				col	=	StringUtil.decodeInnerString(src.substring(0, operPosition)).trim();
				val	=	StringUtil.decodeInnerString(src.substring(operPosition+4)).trim();
				
				//去掉括号，然后分解各个过滤条件值
				String[] filterVals = StringUtil.deClosure(val,"(",")").split(",");
				String	newVal		= "";
				
				for (int i = 0; i < filterVals.length; i++) 
				{
					if(i==0){
						newVal = StringUtil.deClosure(filterVals[i].trim(),"'");
					}else{
						newVal = newVal + "," + StringUtil.deClosure(filterVals[i].trim(),"'");
					}
				}
				
				filter = col + ":" + newVal;
			}
		}
		
		return filter;
	}
	
	public List<String> getParams() {
		String formula = new String(this.formula_expr);
		List<String> params = new ArrayList<String>();
		String param = "";
		while(!(param = CommonUtil.getParam(formula, "[$", "]")).equals("")) {
			if(!params.contains(param))
				params.add(param);
			formula = CommonUtil.replace(formula, "[$"+param, "]");
		}
		return params;
	}
	
	public List<String> getReferMeasure() {
		String formula = new String(this.formula_expr);
		List<String> referMeasures = new ArrayList<String>();
		String referMeasure = "";
		while(!(referMeasure = CommonUtil.getParam(formula, "[@", "]")).equals("")) {
			if(!referMeasures.contains(referMeasure))
				referMeasures.add(referMeasure);
			formula = CommonUtil.replace(formula, "[@"+referMeasure+"]", "");
		}
		return referMeasures;
	}
	
	public String getFormula() {
		return this.formula_expr;
	}
	public String getMeasureId() {
		return this.measure_id;
	}
	public String getMeasureName() {
		return this.measure_name;
	}
	public String getSourceId() {
		return this.source_id;
	}
	public String getSourceTypeId() {
		return this.source_type_id;
	}
	public String getResultTypeId() {
		return this.result_type_id;
	}
	
	public String getMeasure_id() {
		return measure_id;
	}
	public void setMeasure_id(String measure_id) {
		this.measure_id = measure_id;
	}
	public String getParent_measure_id() {
		return parent_measure_id;
	}
	public void setParent_measure_id(String parent_measure_id) {
		this.parent_measure_id = parent_measure_id;
	}
	public String getMeasure_name() {
		return measure_name;
	}
	public void setMeasure_name(String measure_name) {
		this.measure_name = measure_name;
	}
	public String getMeasure_desc() {
		return measure_desc;
	}
	public void setMeasure_desc(String measure_desc) {
		this.measure_desc = measure_desc;
	}
	public String getSource_type_id() {
		return source_type_id;
	}
	public void setSource_type_id(String source_type_id) {
		this.source_type_id = source_type_id;
	}
	public String getSource_id() {
		return source_id;
	}
	public void setSource_id(String source_id) {
		this.source_id = source_id;
	}
	public String getFormula_expr() {
		return formula_expr;
	}
	public void setFormula_expr(String formula_expr) {
		this.formula_expr = formula_expr;
	}
	public String getResult_type_id() {
		return result_type_id;
	}
	public void setResult_type_id(String result_type_id) {
		this.result_type_id = result_type_id;
	}
	public String getObj_cate_id() {
		return obj_cate_id;
	}
	public void setObj_cate_id(String obj_cate_id) {
		this.obj_cate_id = obj_cate_id;
	}
	public String getIs_private() {
		return is_private;
	}
	public void setIs_private(String is_private) {
		this.is_private = is_private;
	}
	public String getOwner_org_id() {
		return owner_org_id;
	}
	public void setOwner_org_id(String owner_org_id) {
		this.owner_org_id = owner_org_id;
	}

	public String getDatasourceColumn() {
		if (IMeasure.SOURCE_TYPE_DATASOURCE != this.source_type_id){
			return null;
		}
		
		String formularExpr = this.formula_expr.replaceAll("\\{", "").replaceAll("\\}", "");
		
		//字段分隔符位置
		int colDelPosition	=	formularExpr.indexOf("?");

		if (colDelPosition >= 0){
			//存在过滤条件即截串；如果没有配置数据源字段，则返回空值
			return formularExpr.substring(0, colDelPosition).trim();
		}else{
			//没有过滤条件，直接返回
			return formularExpr.trim();
		}
	}

	public List<String> getDatasourceFilters() {
		if (IMeasure.SOURCE_TYPE_DATASOURCE != this.source_type_id) {
			return null;
		}
		
		List<String> 	filters	=	new ArrayList<String>();	
		String 			srcExpr	= 	this.formula_expr.replaceAll("\\{", "").replaceAll("\\}", "");
		
		//字段分隔符位置
		int colDelPosition	=	srcExpr.indexOf("?");
		
		if (colDelPosition >= 0){
			//存在过滤条件即截串；如果没有配置数据源字段，则返回空值
			srcExpr	=	srcExpr.substring(colDelPosition+1).trim();
			String[] conds	= srcExpr.split("&&");

			for (int i = 0; i < conds.length; i++) {
				String filter = "";
				
				try{
					filter = this.parseFilters(conds[i].trim());
				}
				catch(Exception e){
					e.printStackTrace();
				}
				
				if (filter != null && !"".equals(filter)){
					filters.add(filter);
				}
			}
		}
		
		return filters;
	}

	public static void main(String [] args)
	{
		BscMeasure bm = new BscMeasure();
		bm.source_type_id = IMeasure.SOURCE_TYPE_DATASOURCE;
		
		bm.formula_expr = "{ y_gross_profit ? currency_code in ('01', '98') &&" +
				" cvt_currency_id = '00' && product_id in ('ALLSAVING','LOAN')}";
		
		System.out.println(bm.getDatasourceColumn());
		List<String> df = bm.getDatasourceFilters();		
		
		for (int i = 0; i < df.size(); i++){
			System.out.println(df.get(i));
		}
	}
}
