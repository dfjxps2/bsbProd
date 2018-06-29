package com.rx.system.model.dashboard;

import java.awt.Dimension;
import java.util.ArrayList;
import java.util.List;
@SuppressWarnings("unchecked")
public class Dashboard {
	private int columns = 4;
	private Dimension unitSize;
	private List list = new ArrayList();
	private boolean scroll=false;
	public void setUnitSize(Dimension d) {
		this.unitSize = d;
	}

	public void addComponent(Component component) {
		component.setUnitSize(unitSize);
		list.add(component);
	}

	public String getOutput() throws Exception {
		StringBuffer sb = new StringBuffer();

		//sb
		//		.append("Ext.state.Manager.setProvider(new Ext.state.CookieProvider());");
		sb.append("var viewport = new Ext.Viewport({");
		sb.append("layout: 'border',\n");
		// sb.append("width:"+getWidth()+",");
		// sb.append("height:"+getHeight()+",");
		sb.append("items:[{\n");
		sb.append("region:'center',\n");
		sb.append("el:'center',\n");
		if(scroll)
			sb.append("autoScroll:true,");
		sb.append("layout: 'table',\n");
		sb.append("layoutConfig: { columns:" + columns + " },\n");
		sb.append("items:[\n");
		for (int i = 0; i < list.size(); i++) {
			if (i > 0)
				sb.append(",");
			Component c = (Component) list.get(i);
			sb.append(c.getOutput());
		}
		sb.append("]\n");

		sb.append("}]\n");
		sb.append("});");
		return sb.toString();
	}

	public int getColumns() {
		return columns;
	}

	public void setColumns(int columns) {
		this.columns = columns;
	}

	public List getComponents() {
		return list;
	}

	public int getWidth() {
		return (int) unitSize.getWidth() * columns + 5 * (columns + 1);
	}

	public int getHeight() {
		return (int) unitSize.getHeight() * 2 + 15;
	}

	public void setScroll(boolean scroll) {
		this.scroll = scroll;
	}
}
