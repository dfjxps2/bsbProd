package com.rx.system.domain;
/**
 * 指标计算控制对象
 * @author chenxd
 *
 */
public class CtrlMeasure {
	
	private String project_id;
	private String role_id;
	private String measure_id;
	private String result_table;
	private String measure_source_code;
	private String measure_node_type;
	
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
	public String getMeasure_node_type() {
		return measure_node_type;
	}
	public void setMeasure_node_type(String measure_node_type) {
		this.measure_node_type = measure_node_type;
	}
}
