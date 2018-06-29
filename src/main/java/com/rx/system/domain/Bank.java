package com.rx.system.domain;

import java.io.Serializable;

import com.rx.util.tree.TreeNode;
/**
 * 机构实体对象
 * @author chenxd
 *
 */
public class Bank implements TreeNode,Serializable {
	private static final long serialVersionUID = 1L;
	
	private String bank_org_id;
	private String bank_org_name;
	private String parent_bank_org_id;
	private String bank_type_code;
	private String leaf;
	
	public String getNodeID() {
		return bank_org_id;
	}
	public String getNodeName() {
		return bank_org_name;
	}
	public String getParentNodeID() {
		return parent_bank_org_id;
	}
	public String getBank_org_id() {
		return bank_org_id;
	}
	public String getBank_org_name() {
		return bank_org_name;
	}
	public String getParent_bank_org_id() {
		return parent_bank_org_id;
	}
	public String getBank_type_code() {
		return bank_type_code;
	}
	public void setBank_org_id(String bank_org_id) {
		this.bank_org_id = bank_org_id;
	}
	public void setBank_org_name(String bank_org_name) {
		this.bank_org_name = bank_org_name;
	}
	public void setParent_bank_org_id(String parent_bank_org_id) {
		this.parent_bank_org_id = parent_bank_org_id;
	}
	public void setBank_type_code(String bank_type_code) {
		this.bank_type_code = bank_type_code;
	}
	public String getLeaf() {
		return leaf;
	}
	public void setLeaf(String leaf) {
		this.leaf = leaf;
	}

}
