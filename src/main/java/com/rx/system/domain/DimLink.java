package com.rx.system.domain;

import com.rx.util.tree.TreeNode;

/**
 * 数据源分组字段对象
 * @author chenxd
 *
 */
public class DimLink implements TreeNode{
	
	private static final long serialVersionUID = 1L;
	private String link_id;
	private String link_name;
	private String source_expression;
	private String is_tree;
	private String id_field;
	private String parent_id_field;
	private String label_field;
	private String root_value;
	
	public String getLink_id() {
		return link_id;
	}
	public void setLink_id(String link_id) {
		this.link_id = link_id;
	}
	public String getLink_name() {
		return link_name;
	}
	public void setLink_name(String link_name) {
		this.link_name = link_name;
	}
	public String getSource_expression() {
		return source_expression;
	}
	public void setSource_expression(String source_expression) {
		this.source_expression = source_expression;
	}
	public String getIs_tree() {
		return is_tree;
	}
	public void setIs_tree(String is_tree) {
		this.is_tree = is_tree;
	}
	public String getId_field() {
		return id_field;
	}
	public void setId_field(String id_field) {
		this.id_field = id_field;
	}
	public String getParent_id_field() {
		return parent_id_field;
	}
	public void setParent_id_field(String parent_id_field) {
		this.parent_id_field = parent_id_field;
	}
	public String getLabel_field() {
		return label_field;
	}
	public void setLabel_field(String label_field) {
		this.label_field = label_field;
	}
	public String getRoot_value() {
		return root_value;
	}
	public void setRoot_value(String root_value) {
		this.root_value = root_value;
	}
	
	public String getNodeID() {
		return this.link_id;
	}
	public String getNodeName() {
		return this.link_name;
	}
	public String getParentNodeID() {
		return this.parent_id_field;
	}
	
}
