package com.rx.system.util;

public class Field {
	private String fieldName;
	private String fieldLabel;
	private String align = "right";
	private String format = FORMAT_TYPE_DOUBLE;
	public static final String FORMAT_TYPE_INT = "#,##0";
	public static final String FORMAT_TYPE_PERCENT = "#,##0.00%";
	public static final String FORMAT_TYPE_DOUBLE = "#,##0.00";
	public static final String FORMAT_TYPE_DOUBLE_FOUR_DECIMAL = "#,##0.0000";
	public static final String FORMAT_TYPE_STRING = "";
	public static final String FORMAT_TYPE_DEFAULT = FORMAT_TYPE_DOUBLE;

	// private String format="0.00";
	public Field() {

	}

	public Field(String fieldName) {
		this.fieldName = fieldName;
	}

	public String getAlign() {
		return align;
	}

	public String getFieldLabel() {
		return fieldLabel;
	}

	public String getFieldName() {
		return fieldName;
	}

	public void setAlign(String align) {
		this.align = align;
	}

	public void setFieldLabel(String fieldLabel) {
		this.fieldLabel = fieldLabel;
	}

	public void setFieldName(String fieldName) {
		this.fieldName = fieldName;
	}

	public String getFormat() {
		return format;
	}

	public void setFormat(String format) {
		this.format = format;
	}
}
