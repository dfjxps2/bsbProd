package com.rx.system.domain;


/**
 * 考核方案对象
 * 
 * @author chenxd
 * 
 */
public class Project {

	private String project_id;
	private String project_name;
	private String project_desc;
	private String cycle_type_id;
	private String obj_cate_id;
	private String app_type_id;
	private String view_id;
	private String full_score;
	private String score_limit_low;
	private String score_limit_high;
	private String is_template;
	private String owner_org_id;
	private String create_user;
	private String create_time;
	private String update_user;
	private String update_time;

	public String getProject_id() {
		return project_id;
	}

	public void setProject_id(String project_id) {
		this.project_id = project_id;
	}

	public String getProject_name() {
		return project_name;
	}

	public void setProject_name(String project_name) {
		this.project_name = project_name;
	}

	public String getProject_desc() {
		return project_desc;
	}

	public void setProject_desc(String project_desc) {
		this.project_desc = project_desc;
	}

	public String getCycle_type_id() {
		return cycle_type_id;
	}

	public void setCycle_type_id(String cycle_type_id) {
		this.cycle_type_id = cycle_type_id;
	}

	public String getObj_cate_id() {
		return obj_cate_id;
	}

	public void setObj_cate_id(String obj_cate_id) {
		this.obj_cate_id = obj_cate_id;
	}

	public String getApp_type_id() {
		return app_type_id;
	}

	public void setApp_type_id(String app_type_id) {
		this.app_type_id = app_type_id;
	}

	public String getView_id() {
		return view_id;
	}

	public void setView_id(String view_id) {
		this.view_id = view_id;
	}

	public String getFull_score() {
		return full_score;
	}

	public void setFull_score(String full_score) {
		this.full_score = full_score;
	}

	public String getScore_limit_low() {
		return score_limit_low;
	}

	public void setScore_limit_low(String score_limit_low) {
		this.score_limit_low = score_limit_low;
	}

	public String getScore_limit_high() {
		return score_limit_high;
	}

	public void setScore_limit_high(String score_limit_high) {
		this.score_limit_high = score_limit_high;
	}

	public String getIs_template() {
		return is_template;
	}

	public void setIs_template(String is_template) {
		this.is_template = is_template;
	}

	public String getOwner_org_id() {
		return owner_org_id;
	}

	public void setOwner_org_id(String owner_org_id) {
		this.owner_org_id = owner_org_id;
	}

	public String getCreate_user() {
		return create_user;
	}

	public void setCreate_user(String create_user) {
		this.create_user = create_user;
	}

	public String getCreate_time() {
		return create_time;
	}

	public void setCreate_time(String create_time) {
		this.create_time = create_time;
	}

	public String getUpdate_user() {
		return update_user;
	}

	public void setUpdate_user(String update_user) {
		this.update_user = update_user;
	}

	public String getUpdate_time() {
		return update_time;
	}

	public void setUpdate_time(String update_time) {
		this.update_time = update_time;
	}

}
