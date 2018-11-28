package com.rx.system.domain;

import java.io.Serializable;

/**
 * 用户实体对象
 * @author chenxd
 *
 */
public class SysUser implements Serializable{
	private static final long serialVersionUID = 6335059669947870693L;

	private String user_id;
	private String password;
	private String user_name;
	private String bank_org_id;
	private String owner_org_id;
	private String cert_id;
	private String gender_code;
	private String user_mobile;
	private String user_email;
	private String user_address;
	private String user_post;
	private String user_status;
	private String begin_date;
	private String end_date;
	private String busi_line_id;
	private String job_type_id;
	private String bank_org_name;
	private String owner_org_name;
	
	
	public String getOwner_org_name() {
		return owner_org_name;
	}
	public void setOwner_org_name(String owner_org_name) {
		this.owner_org_name = owner_org_name;
	}
	public String getBank_org_name() {
		return bank_org_name;
	}
	public void setBank_org_name(String bank_org_name) {
		this.bank_org_name = bank_org_name;
	}
	public String getBusi_line_id() {
		return busi_line_id;
	}
	public void setBusi_line_id(String busi_line_id) {
		this.busi_line_id = busi_line_id;
	}
	public String getJob_type_id() {
		return job_type_id;
	}
	public void setJob_type_id(String job_type_id) {
		this.job_type_id = job_type_id;
	}
	public String getUser_id() {
		return user_id;
	}
	public void setUser_id(String user_id) {
		this.user_id = user_id;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getUser_name() {
		return user_name;
	}
	public void setUser_name(String user_name) {
		this.user_name = user_name;
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
	public String getCert_id() {
		return cert_id;
	}
	public void setCert_id(String cert_id) {
		this.cert_id = cert_id;
	}
	public String getGender_code() {
		return gender_code;
	}
	public void setGender_code(String gender_code) {
		this.gender_code = gender_code;
	}
	public String getUser_mobile() {
		return user_mobile;
	}
	public void setUser_mobile(String user_mobile) {
		this.user_mobile = user_mobile;
	}
	public String getUser_email() {
		return user_email;
	}
	public void setUser_email(String user_email) {
		this.user_email = user_email;
	}
	public String getUser_address() {
		return user_address;
	}
	public void setUser_address(String user_address) {
		this.user_address = user_address;
	}
	public String getUser_post() {
		return user_post;
	}
	public void setUser_post(String user_post) {
		this.user_post = user_post;
	}
	public String getUser_status() {
		return user_status;
	}
	public void setUser_status(String user_status) {
		this.user_status = user_status;
	}
	public String getBegin_date() {
		return begin_date;
	}
	public void setBegin_date(String begin_date) {
		this.begin_date = begin_date;
	}
	public String getEnd_date() {
		return end_date;
	}
	public void setEnd_date(String end_date) {
		this.end_date = end_date;
	}
	
}
