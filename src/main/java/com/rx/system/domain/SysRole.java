package com.rx.system.domain;


/**
 * 系统角色实体对象
 * @author chenxd
 *
 */
public class SysRole {
	private String role_id;
	private String role_name;
	private String bank_org_id;
	public String getRole_id() {
		return role_id;
	}
	public void setRole_id(String role_id) {
		this.role_id = role_id;
	}
	public String getRole_name() {
		return role_name;
	}
	public void setRole_name(String role_name) {
		this.role_name = role_name;
	}
	public String getBank_org_id() {
		return bank_org_id;
	}
	public void setBank_org_id(String bank_org_id) {
		this.bank_org_id = bank_org_id;
	}
	
}
