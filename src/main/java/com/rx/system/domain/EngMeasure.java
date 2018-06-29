package com.rx.system.domain;

import com.rx.util.tree.TreeNode;

/**
 * 指标对象类
 * @author chenxd
 *
 */
public class EngMeasure implements TreeNode{
	private static final long serialVersionUID = 1L;
	private String measure_id;
	private String parent_measure_id;
	private String measure_name;
	private String source_type_id;
	private String formula_expr;
	private String owner_org_id;
	private String source_id;
	private String is_private;
	
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
	public String getSource_type_id() {
		return source_type_id;
	}
	public void setSource_type_id(String source_type_id) {
		this.source_type_id = source_type_id;
	}
	public String getFormula_expr() {
		return formula_expr;
	}
	public void setFormula_expr(String formula_expr) {
		this.formula_expr = formula_expr;
	}
	public String getOwner_org_id() {
		return owner_org_id;
	}
	public void setOwner_org_id(String owner_org_id) {
		this.owner_org_id = owner_org_id;
	}
	public String getSource_id() {
		return source_id;
	}
	public void setSource_id(String source_id) {
		this.source_id = source_id;
	}
	public String getIs_private() {
		return is_private;
	}
	public void setIs_private(String is_private) {
		this.is_private = is_private;
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
