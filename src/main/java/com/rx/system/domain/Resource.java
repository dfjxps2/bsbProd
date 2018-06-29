package com.rx.system.domain;

import com.rx.util.tree.TreeNode;
/**
 * 系统菜单实体对象
 * @author chenxd
 * 
 */
public class Resource implements TreeNode {
	private static final long serialVersionUID = 1L;
	private String resource_id;
	private String resource_name;
	private String parent_resource_id;
	private String resource_type;
	private String handler;
	private String icon;
	
	public String getIcon() {
		return icon;
	}

	public void setIcon(String icon) {
		this.icon = icon;
	}

	public String getResource_id() {
		return resource_id;
	}

	public void setResource_id(String resource_id) {
		this.resource_id = resource_id;
	}

	public String getResource_name() {
		return resource_name;
	}

	public void setResource_name(String resource_name) {
		this.resource_name = resource_name;
	}

	public String getParent_resource_id() {
		return parent_resource_id;
	}

	public void setParent_resource_id(String parent_resource_id) {
		this.parent_resource_id = parent_resource_id;
	}

	public String getResource_type() {
		return resource_type;
	}

	public void setResource_type(String resource_type) {
		this.resource_type = resource_type;
	}

	public String getHandler() {
		return handler;
	}

	public void setHandler(String handler) {
		this.handler = handler;
	}

	public String getNodeID() {
		return this.resource_id;
	}

	public String getNodeName() {
		return this.resource_name;
	}

	public String getParentNodeID() {
		return this.parent_resource_id;
	}

}
