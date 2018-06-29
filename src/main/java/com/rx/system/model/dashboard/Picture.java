package com.rx.system.model.dashboard;

import java.awt.Dimension;
/**
 * 
 * 本类提供面板大小
 */
public class Picture implements Component{
	private int unitWidth=250,unitHeight=250;
	private String title;
	private String style="padding:5px 0px 0px 5px";
	private String picture;
	private int rowSpan=1,colSpan=1;
	
	public Picture()
	{
		
	}
	
	public void setUnitSize(Dimension d)
	{
		this.unitWidth=(int)d.getWidth();
		this.unitHeight=(int)d.getHeight();
	}
	
	/**
	 * 需要更改
	 */
	public String getOutput()
	{
		StringBuffer sb=new StringBuffer();
		
		
		sb.append("{\n");
		sb.append("style:'"+style+"',\n");
		sb.append("width:"+getWidth()+",\n");
		sb.append("height:"+getHeight()+",\n");
		sb.append("title:'"+title+"',\n");
		if(rowSpan>1)
			sb.append("rowspan:"+rowSpan+",\n");
		if(colSpan>1)
			sb.append("colspan:"+colSpan+",\n");
		sb.append("contentEl:'"+picture+"'\n");
		sb.append("}");
		
		return sb.toString();
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getStyle() {
		return style;
	}

	public void setStyle(String style) {
		this.style = style;
	}

	public String getPicture() {
		return picture;
	}

	public void setPicture(String picture) {
		this.picture = picture;
	}

	public int getColSpan() {
		return colSpan;
	}

	public int getRowSpan() {
		return rowSpan;
	}

	public void setColSpan(int colSpan) {
		this.colSpan = colSpan;
	}

	public void setRowSpan(int rowSpan) {
		this.rowSpan = rowSpan;
	}

	public int getHeight() {
		return unitHeight*rowSpan+5*(rowSpan-1);
	}

	public int getWidth() {
		return unitWidth*colSpan+5*(colSpan-1);
	}
}
