package com.rx.system.domain;

import com.rx.system.bsc.calc.service.IDataSource;

/**
 * 数据源对象
 * @author chenxd
 *
 */
public class DataSource implements IDataSource {

    private String source_id;

    private String source_name;

    private String source_expression;

    private String source_private_flag;

    private String obj_cate_id;

    private String obj_cate_desc;

    private String obj_column;

	public String getSource_id() {
		return source_id;
	}

	public void setSource_id(String source_id) {
		this.source_id = source_id;
	}

	public String getSource_name() {
		return source_name;
	}

	public void setSource_name(String source_name) {
		this.source_name = source_name;
	}

	public String getSource_expression() {
		return source_expression;
	}

	public void setSource_expression(String source_expression) {
		this.source_expression = source_expression;
	}

	public String getSource_private_flag() {
		return source_private_flag;
	}

	public void setSource_private_flag(String source_private_flag) {
		this.source_private_flag = source_private_flag;
	}

	public String getObj_cate_id() {
		return obj_cate_id;
	}

	public void setObj_cate_id(String obj_cate_id) {
		this.obj_cate_id = obj_cate_id;
	}

	public String getObj_cate_desc() {
		return obj_cate_desc;
	}

	public void setObj_cate_desc(String obj_cate_desc) {
		this.obj_cate_desc = obj_cate_desc;
	}

	public String getObj_column() {
		return obj_column;
	}

	public void setObj_column(String obj_column) {
		this.obj_column = obj_column;
	}

	public String getExpression() {
		return this.source_expression;
	}

	public String getObjColumnName() {
		return this.obj_column;
	}
}
