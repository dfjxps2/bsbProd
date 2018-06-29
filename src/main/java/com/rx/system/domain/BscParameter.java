package com.rx.system.domain;


/**
 * 考核参数对象
 * @author chenxd
 *
 */
public class BscParameter {
	
	private String parameter_id ;
	private String parameter_name ;
	private String data_type_id ;
	private String value ;
	private String param_type_id ;
	private String owner_org_id ;
	
	public String getParameter_id() {
		return parameter_id;
	}
	public void setParameter_id(String parameter_id) {
		this.parameter_id = parameter_id;
	}
	public String getParameter_name() {
		return parameter_name;
	}
	public void setParameter_name(String parameter_name) {
		this.parameter_name = parameter_name;
	}
	public String getData_type_id() {
		return data_type_id;
	}
	public void setData_type_id(String data_type_id) {
		this.data_type_id = data_type_id;
	}
	public String getValue() {
		return value;
	}
	public void setValue(String value) {
		this.value = value;
	}
	public String getParam_type_id() {
		return param_type_id;
	}
	public void setParam_type_id(String param_type_id) {
		this.param_type_id = param_type_id;
	}
	public String getOwner_org_id() {
		return owner_org_id;
	}
	public void setOwner_org_id(String owner_org_id) {
		this.owner_org_id = owner_org_id;
	}
	
}
