package com.rx.system.fusionchart;

import java.awt.Dimension;
import java.util.ArrayList;
import java.util.List;

/**
 * 根据fusionchart图形生成页面Ext代码
 * @author chenxd
 *
 */
public class DashBord {
	
	private int columns = 1;//设置列数
	private boolean autoScroll = true;//滚动条
	private List<IChart> chartList = new ArrayList<IChart>();
	private List<String> titleList = new ArrayList<String>();
	
	private Dimension dimension = null;
	
	private String componentStyle="padding:0px 0px 0px 0px";
	private List<Integer> componentRowSpan = new ArrayList<Integer>();
	private List<Integer> componentColSpan = new ArrayList<Integer>();
	
	public String getOutput() {
		
		StringBuffer sb = new StringBuffer();
		sb.append("var viewport = new Ext.Viewport({");
		sb.append("layout : 'border',");
		sb.append("items : [{");
		sb.append("region : 'center',");
		sb.append("el : 'center',");
		sb.append("layout : 'table',");
		sb.append("layoutConfig : {columns: "+this.columns+"},");
		sb.append("autoScorll : "+this.autoScroll+",");
		sb.append("items : [");
		for (int i=0; i < this.titleList.size(); i++) {
			String title = this.titleList.get(i);
			if(i > 0)
				sb.append(",");
			sb.append("{");
			sb.append("title : '").append(title).append("',");
			sb.append("contentEl : '").append("div"+i).append("',");
			sb.append("width : ").append(this.componentColSpan.get(i).intValue() * this.getComponentWidth()).append(",");
			sb.append("height : ").append(this.componentRowSpan.get(i).intValue() * this.getComponentHeight()).append(",");
			if(this.componentRowSpan.get(i).intValue() > 1)
				sb.append("rowspan:"+this.componentRowSpan.get(i).intValue()+",");
			if(this.componentColSpan.get(i).intValue() > 1)
				sb.append("colspan:"+this.componentColSpan.get(i).intValue()+",");
			sb.append("bodyStyle :' " + this.componentStyle).append("'");
			sb.append("}");
		}
		sb.append("]");
		sb.append("}]");
		sb.append("})");
		return sb.toString();
	}
	
	public void addChart(String title, IChart chart, Integer rowspan, Integer colspan) {
		this.titleList.add(title);
		this.chartList.add(chart);
		this.componentRowSpan.add(rowspan);
		this.componentColSpan.add(colspan);
	}
	public void add(String title, IChart chart) {
		this.addChart(title, chart, 1, 1);
	}
	
	public List<IChart> getCharts(){
		for(int i=0; i<this.chartList.size(); i++) {
			IChart chart = this.chartList.get(i);
			chart.setRange(this.componentColSpan.get(i).intValue() * this.getComponentWidth() - 5, this.componentRowSpan.get(i).intValue() * this.getComponentHeight() - 15);
		}
		return this.chartList;
	}
	
	//获得每一列的宽度
	public void setDimension(Dimension dimension) {
		this.dimension = dimension;
	}

	public int getComponentWidth() {
//		int colCount = 0;
//		for (Integer colspan : this.componentColSpan) {
//			colCount += colspan.intValue();
//		}
		return (int) (this.dimension.getWidth()/this.columns);
	}
	//获取每一列的高度
	public int getComponentHeight() {
		int rowCount = 0;
		for (Integer rowspan : this.componentRowSpan) {
			rowCount += rowspan.intValue();
		}
		
		if(rowCount % this.columns != 0)
			rowCount = rowCount / this.columns + 1;
		else
			rowCount = rowCount / this.columns;
		
		return (int)(this.dimension.getHeight()/rowCount);
	}

	public void setColumns(int columns) {
		this.columns = columns;
	}
}
