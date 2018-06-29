package com.rx.system.domain;
/**
 * 客户经理实体对象
 * @author chenxd
 *
 */
public class CustMgr {
	
	private String cust_mgr_id;
	private String pwd;
	private String cust_mgr_name;
	private String bank_org_id;
	private String owner_org_id;
	
	public String getCust_mgr_id() {
		return cust_mgr_id;
	}
	public void setCust_mgr_id(String cust_mgr_id) {
		this.cust_mgr_id = cust_mgr_id;
	}
	public String getPwd() {
		return pwd;
	}
	public void setPwd(String pwd) {
		this.pwd = pwd;
	}
	public String getCust_mgr_name() {
		return cust_mgr_name;
	}
	public void setCust_mgr_name(String cust_mgr_name) {
		this.cust_mgr_name = cust_mgr_name;
	}
	public String getBank_org_id() {
		return bank_org_id;
	}
	public void setBank_org_id(String bank_org_id) {
		this.bank_org_id = bank_org_id;
	}
	public String getOwner_org_id() {
		return owner_org_id;
	}
	public void setOwner_org_id(String owner_org_id) {
		this.owner_org_id = owner_org_id;
	}
}
