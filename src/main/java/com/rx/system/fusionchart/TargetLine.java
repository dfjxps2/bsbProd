package com.rx.system.fusionchart;
/**
 * fusioncharts目标线对象
 * @author chenxd
 *
 */
public class TargetLine {
	
	private String startValue = null;
	private String color = null;
	private String displayvalue = null;
	
	public TargetLine() {}
	public TargetLine(String startValue, String displayvalue, String color) {
		this.startValue = startValue;
		this.displayvalue = displayvalue;
		this.color = color;
	}
	
	public TargetLine(String startValue, String displayvalue) {
		this(startValue, displayvalue, null);
	}	
	public String toString() {
		StringBuffer sb = new StringBuffer();
		sb.append("<line");
		if(this.startValue != null)
			sb.append(" startValue='").append(this.startValue).append("'");
		if(this.color != null)
			sb.append(" color='").append(this.color).append("'");
		if(this.displayvalue != null)
			sb.append(" displayvalue='").append(this.displayvalue).append("'");
		sb.append("/>");
		return sb.toString();
	}
	
	public String getStartValue() {
		return startValue;
	}
	public void setStartValue(String startValue) {
		this.startValue = startValue;
	}
	public String getColor() {
		return color;
	}
	public void setColor(String color) {
		this.color = color;
	}
	public String getDisplayvalue() {
		return displayvalue;
	}
	public void setDisplayvalue(String displayvalue) {
		this.displayvalue = displayvalue;
	}
}
