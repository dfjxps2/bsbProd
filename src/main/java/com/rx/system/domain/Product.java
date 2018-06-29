package com.rx.system.domain;

import com.rx.util.tree.TreeNode;

/**
 * 产品对象
 * 对应数据库表dmd_measure
 * @author chenxd
 *
 */
public class Product implements TreeNode{
	private static final long serialVersionUID = 1L;
	private String measure_id;
	private String measure_level_nbr;
	private String measure_name;
	private String parent_measure_id;
	private String measure_property;
	private String measure_tree_code;
	
	public String getMeasure_id() {
		return measure_id;
	}
	public void setMeasure_id(String measure_id) {
		this.measure_id = measure_id;
	}
	public String getMeasure_level_nbr() {
		return measure_level_nbr;
	}
	public void setMeasure_level_nbr(String measure_level_nbr) {
		this.measure_level_nbr = measure_level_nbr;
	}
	public String getMeasure_name() {
		return measure_name;
	}
	public void setMeasure_name(String measure_name) {
		this.measure_name = measure_name;
	}
	public String getParent_measure_id() {
		return parent_measure_id;
	}
	public void setParent_measure_id(String parent_measure_id) {
		this.parent_measure_id = parent_measure_id;
	}
	public String getMeasure_property() {
		return measure_property;
	}
	public void setMeasure_property(String measure_property) {
		this.measure_property = measure_property;
	}
	public String getMeasure_tree_code() {
		return measure_tree_code;
	}
	public void setMeasure_tree_code(String measure_tree_code) {
		this.measure_tree_code = measure_tree_code;
	}
	public String getNodeID() {
		return this.measure_id;
	}
	public String getNodeName() {
		return this.measure_name;
	}
	public String getParentNodeID() {
		return this.parent_measure_id;
	}
}
