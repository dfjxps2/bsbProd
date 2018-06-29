package com.rx.system.fusionchart;

/**
 * fusionchart对象接口
 * @author chenxd
 *
 */
public interface IChart {
	/**
	 * 定义图形的类型
	 */
	public static String CHART_TYPE_COLUMN2D = "Column2D";
	public static String CHART_TYPE_COLUMN3D = "Column3D";
	public static String CHART_TYPE_BAR2D = "Bar2D";
	public static String CHART_TYPE_AREA2D = "Area2D";
	public static String CHART_TYPE_PIE2D = "Pie2D";
	public static String CHART_TYPE_PIE3D = "Pie3D";
	public static String CHART_TYPE_LINE = "Line";
	public static String CHART_TYPE_HLINEARGAUGE = "HLinearGauge";
	public static String CHART_TYPE_PYRAMID = "Pyramid";
	
	public static String CHART_TYPE_MSCOLUMN2D = "MSColumn2D";
	public static String CHART_TYPE_MSCOLUMN3D = "MSColumn3D";
	public static String CHART_TYPE_MSBAR2D = "MSBar2D";
	public static String CHART_TYPE_MSBAR3D = "MSBar3D";
	public static String CHART_TYPE_MSCOLUMNLINE3D = "MSColumnLine3D";
	
	public static String CHART_TYPE_MSCOMBIDY2D = "MSCombiDY2D";
	
	
	//获取图形XML字符串
	public String getXml() throws Exception;
	
	//获取图形类型
	public String getChartType();
	
	//设置图形类型
	public void setChartType(String chartType);
	
	//设置图形长和宽
	public void setRange(int width, int height);
	
	//获取图形的长度
	public int getWidth();
	
	//获取图形的高度
	public int getHeight();
	
}
