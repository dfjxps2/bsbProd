package com.rx.system.domain;

import com.rx.util.tree.TreeNode;

/**
 * bsc考核维度对象
 * @author chenxd
 *
 */
public class BscKpiDim implements TreeNode{
	private static final long serialVersionUID = 1L;
	private String dim_id;
	private String dim_name;
	private String parent_dim_id;
	private String dim_level;
	
	public String getNodeID() {
		return this.dim_id;
	}
	public String getNodeName() {
		return this.dim_name;
	}
	public String getParentNodeID() {
		return this.parent_dim_id;
	}
	public String getDim_id() {
		return dim_id;
	}
	public void setDim_id(String dim_id) {
		this.dim_id = dim_id;
	}
	public String getDim_name() {
		return dim_name;
	}
	public void setDim_name(String dim_name) {
		this.dim_name = dim_name;
	}
	public String getParent_dim_id() {
		return parent_dim_id;
	}
	public void setParent_dim_id(String parent_dim_id) {
		this.parent_dim_id = parent_dim_id;
	}
	public String getDim_level() {
		return dim_level;
	}
	public void setDim_level(String dim_level) {
		this.dim_level = dim_level;
	}
}
