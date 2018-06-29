package com.rx.system.domain;
/**
 * 数据源分组字段对象
 * @author chenxd
 *
 */
public class FieldLink {
	
	private String link_id;
	private String source_type;
	private String source_expression;
	private String value_field;
	private String display_field;
	
	public String getLink_id() {
		return link_id;
	}
	public void setLink_id(String link_id) {
		this.link_id = link_id;
	}
	public String getSource_type() {
		return source_type;
	}
	public void setSource_type(String source_type) {
		this.source_type = source_type;
	}
	public String getSource_expression() {
		return source_expression;
	}
	public void setSource_expression(String source_expression) {
		this.source_expression = source_expression;
	}
	public String getValue_field() {
		return value_field;
	}
	public void setValue_field(String value_field) {
		this.value_field = value_field;
	}
	public String getDisplay_field() {
		return display_field;
	}
	public void setDisplay_field(String display_field) {
		this.display_field = display_field;
	}
}
