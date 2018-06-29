package com.rx.system.domain;

/**
 * BSC考核方案指标
 * @author chenxd
 *
 */
public class BscMeasureCtrl {
	
	private String project_id;
	private String role_id;
	private String measure_id;
	private String dim_id;
	private String result_table;
	private String measure_source_code;
	private String point_formula;
	private String prorate;
	private String calc_desc;
	
	public String getProject_id() {
		return project_id;
	}
	public void setProject_id(String project_id) {
		this.project_id = project_id;
	}
	public String getRole_id() {
		return role_id;
	}
	public void setRole_id(String role_id) {
		this.role_id = role_id;
	}
	public String getMeasure_id() {
		return measure_id;
	}
	public void setMeasure_id(String measure_id) {
		this.measure_id = measure_id;
	}
	public String getDim_id() {
		return dim_id;
	}
	public void setDim_id(String dim_id) {
		this.dim_id = dim_id;
	}
	public String getResult_table() {
		return result_table;
	}
	public void setResult_table(String result_table) {
		this.result_table = result_table;
	}
	public String getMeasure_source_code() {
		return measure_source_code;
	}
	public void setMeasure_source_code(String measure_source_code) {
		this.measure_source_code = measure_source_code;
	}
	public String getPoint_formula() {
		return point_formula;
	}
	public void setPoint_formula(String point_formula) {
		this.point_formula = point_formula;
	}
	public String getProrate() {
		return prorate;
	}
	public void setProrate(String prorate) {
		this.prorate = prorate;
	}
	public String getCalc_desc() {
		return calc_desc;
	}
	public void setCalc_desc(String calc_desc) {
		this.calc_desc = calc_desc;
	}
}
