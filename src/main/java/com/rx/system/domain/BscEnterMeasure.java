package com.rx.system.domain;

import java.util.Date;

public class BscEnterMeasure {

	private String measure_id;
	private String org_id;
	private String praise_org;
	private String type;
	private String remark;
	private Date sys_time;
	private String mouth_id;
	private Integer score;
	
	public String getMeasure_id() {
		return measure_id;
	}
	public void setMeasure_id(String measure_id) {
		this.measure_id = measure_id;
	}
	public String getOrg_id() {
		return org_id;
	}
	public void setOrg_id(String org_id) {
		this.org_id = org_id;
	}
	public String getPraise_org() {
		return praise_org;
	}
	public void setPraise_org(String praise_org) {
		this.praise_org = praise_org;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getRemark() {
		return remark;
	}
	public void setRemark(String remark) {
		this.remark = remark;
	}
	public Date getSys_time() {
		return sys_time;
	}
	public void setSys_time(Date sys_time) {
		this.sys_time = sys_time;
	}
	public String getMouth_id() {
		return mouth_id;
	}
	public void setMouth_id(String mouth_id) {
		this.mouth_id = mouth_id;
	}
	public Integer getScore() {
		return score;
	}
	public void setScore(Integer score) {
		this.score = score;
	}
	
	
}
