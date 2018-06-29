package com.rx.system.fusionchart;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.rx.system.util.CommonUtil;

/**
 * fusionchart对象类的父类
 * 封装一些公用属性
 * @author chenxd
 *
 */
public class FusionChart implements IChart{
	/**
	 * 功能特性参数
	 */
	protected boolean showNames = true;//是否显示横向坐标轴(x轴)标签名称
	protected boolean showValues = true;//是否在图表显示对应的数据值
	
	/**
	 * 图表标题和轴名称
	 */
	protected String caption = ""; //图表主标题
	protected String subCaption = ""; //图表副标题
	protected String xAxisName = ""; //横向坐标轴(x轴)名称
	protected String yAxisName = ""; //纵向坐标轴(y轴)名称
	
	/**
	 * 图表和画布的样式
	 */
	protected String bgColor = "AFEEEE,999999,dbdada,f9f8f8,FFFFFF"; //图表背景色
	protected String bgAlpha = "50"; //图表背景透明度
	protected String bgRatio = "0,100"; //图表背景渐变比例
	protected String bgAngle = "360"; 
	protected String startingAngle = "70"; 
	protected String shadowAlpha = "20"; //投影透明度,[0-100]
	protected String showLegend = "1"; //是否显示系列名,默认为1(True)
	
	protected String toolTipBgColor = "FCB541";
	protected String baseFontSize = "12";
	protected String baseFontColor = "333333";
	protected String plotfillAlpha = "100";
	
	protected boolean showLabels = true;
	protected String palette = "2";
	protected int decimals = 2;//保留小数
	protected boolean formatNumberScale = false; //是否格式化数字,自动的给你的数字加上K（千）或M（百万）;若取0,则不加K或M
	
	protected boolean showBorder = false;
	protected boolean enableSmartLabels = true;
	protected boolean enableRotation = false;
	
	protected String numberPrefix = ""; //数据前缀
	
	protected List<String> seriesNames = new ArrayList<String>(); //用于比较图时的label标签
	
	protected String labelName = "label";//数据项名映射
	protected String valueKey = "value";//数据项值映射
	
	protected String chartType = "";
	
	protected String drillLink = null;//钻取链接
	
	protected String labelDisplay = null;
	protected String slantLabels = null;
	
	protected int width = 250,height = 250;
	
	protected String customXml = null;
	
	protected List<TargetLine> lineList = new ArrayList<TargetLine>();
	
	protected String chartBottomMargin = null;
	protected String chartTopMargin = null;
	protected String chartRightMargin = null;
	protected String chartLeftMargin = null;
	
	protected String lineColor = null;
	protected String lineThickness = null;
	
	protected String canvasPadding = null;
	
	protected boolean showNullValue = true;
	
	public FusionChart() {}
	
	public FusionChart(String customXml) {
		this.customXml = customXml;
	}
	
	/**
	 * 数据源
	 */
	List<List<Map<String, Object>>> dataSetList = new ArrayList<List<Map<String,Object>>>();
	
	/**
	 * 设置显示的数据列表
	 * @param dataList
	 */
	public void setDataSet(List<Map<String, Object>> dataList) {
		this.dataSetList.clear();
		this.dataSetList.add(dataList);
	}
	
	/**
	 * 添加显示的数据列表
	 * @param dataList
	 */
	public void addDataSet(List<Map<String, Object>> dataList) {
		dataSetList.add(dataList);
	}
	
	/**
	 * 添加显示的数据列表 同时设置比较的标签名
	 * @param dataList
	 */
	public void addDataSet(String seriesName, List<Map<String, Object>> dataList) {
		seriesNames.add(seriesName);
		this.addDataSet(dataList);
	}
	
	public String getXml() {
		
		if(this.customXml != null)
			return this.customXml;
		
		StringBuffer sb = new StringBuffer();
		this.appendChartSatrtElement(sb);
		
		if(this.seriesNames.size() > 0) {
			this.appendCategroy(sb);
			this.appendData(sb);
		}else
			this.appendSingleData(sb);
		
		if(this.lineList.size() > 0)
			this.appendTargetLine(sb);
		
		this.appendChartEndElement(sb);
		
		return sb.toString();
	}
	
	/**
	 * 写chart开始标签
	 * @param sb
	 */
	protected void appendChartSatrtElement(StringBuffer sb) {
		sb.append("<chart ");
		sb.append(" palette='").append(this.palette).append("'");
		sb.append(" decimals='").append(this.decimals).append("'");
		sb.append(" formatNumberScale='").append(this.formatNumberScale ? "1" : "0").append("'");
		sb.append(" enableSmartLabels='").append(this.enableSmartLabels ? "1" : "0").append("'");
		sb.append(" showLabels='").append(this.showLabels ? "1" : "0").append("'");
		sb.append(" showValues='").append(this.showValues ? "1" : "0").append("'");
		if(this.chartRightMargin != null)
			sb.append(" chartRightMargin='").append(this.chartRightMargin).append("'");
		if(this.chartLeftMargin != null)
			sb.append(" chartLeftMargin='").append(this.chartLeftMargin).append("'");
		if(this.chartTopMargin != null)
			sb.append(" chartTopMargin='").append(this.chartTopMargin).append("'");
		if(this.chartBottomMargin != null)
			sb.append(" chartBottomMargin='").append(this.chartBottomMargin).append("'");
		
		if(lineColor != null) {
			sb.append(" lineColor='").append(this.lineColor).append("'");
		}
		if(labelDisplay != null) {
			sb.append(" labelDisplay='").append(this.labelDisplay).append("'");
		}
		if(slantLabels != null) {
			sb.append(" slantLabels='").append(this.slantLabels).append("'");
		}
		if(lineThickness != null) {
			sb.append(" lineThickness='").append(this.lineThickness).append("'");
		}
		if(canvasPadding != null) {
			sb.append(" canvasPadding='").append(this.canvasPadding).append("'");
		}
//		sb.append(" enableRotation='").append(this.enableRotation ? "1" : "0").append("'");
//		sb.append(" showBorder='").append(this.showBorder ? "1" : "0").append("'");
//		sb.append(" bgColor='").append(this.bgColor).append("'");
//		sb.append(" bgColor='CCCCCC,FFFFFF'");
//		sb.append(" baseFontColor='"+this.baseFontColor+"'");
//		sb.append(" plotfillAlpha='"+this.plotfillAlpha+"'");
//		sb.append(" bgAlpha='").append(this.bgAlpha).append("'");
//		sb.append(" bgRatio='").append(this.bgRatio).append("'"); 
//		sb.append(" bgAngle='").append(this.bgAngle).append("'");
//		sb.append(" startingAngle='").append(this.startingAngle).append("'");
//		sb.append(" caption='").append(this.caption).append("'");
//		sb.append(" subCaption='").append(this.subCaption).append("'");
//		sb.append(" toolTipBgColor='").append(this.toolTipBgColor).append("'");
//		sb.append(" baseFontSize='").append(this.baseFontSize).append("'");
		sb.append(">");
//		sb.append("<chart palette='2'  showValues='0' decimals='0' formatNumberScale='0' useRoundEdges='1'>");
//		sb.append("<chart decimals='2' bgColor='999999,dbdada,f9f8f8,FFFFFF' bgAlpha='50' toolTipBgColor='FCB541' baseFontSize='12' showPercentageValues='1' showLabels='0' showValues='1' chartLeftMargin='0' chartRightMargin='0'>");
//		sb.append("<chart palette='2' showValues='0' decimals='0' formatNumberScale='0' useRoundEdges='1'>");
	}
	
	/**
	 * 写chart结束标签
	 * @param sb
	 */
	protected void appendChartEndElement(StringBuffer sb) {
		sb.append("</chart>");
	}
	
	/**
	 * 写X轴标签
	 * @param sb
	 */
	protected void appendCategroy(StringBuffer sb) {
		List<Map<String, Object>> dataList = this.dataSetList.get(0);
		sb.append("<categories>");
		for (Map<String, Object> map : dataList) {
			sb.append("<category label='"+getStringValue(map, this.labelName)+"' />");
		}
		sb.append("</categories>");
	}
	
	/**
	 * 写数据[多个]
	 * @param sb
	 */
	protected void appendData(StringBuffer sb) {
		for (int i=0; i < this.dataSetList.size(); i++) {
			List<Map<String, Object>> dataList = this.dataSetList.get(i);
			if(this.seriesNames.size() > i)
				sb.append("<dataset seriesName='"+this.seriesNames.get(i)+"'>");
			else
				sb.append("<dataset>");
			for (Map<String, Object> map : dataList) {
				this.appendSet(map, sb);
			}
			sb.append("</dataset>");
		}
	}
	
	/**
	 * 写数据
	 * @param sb
	 */
	protected void appendSingleData(StringBuffer sb) {
		List<Map<String, Object>> dataList = this.dataSetList.get(0);
		for (int i = 0; i < dataList.size(); i++) {
			Map<String, Object> map = dataList.get(i);
			if(!this.showNullValue && map.get(this.valueKey) == null)
				sb.append("<set label='"+getStringValue(map, this.labelName)+"' />");
			else
				sb.append("<set label='"+getStringValue(map, this.labelName)+"' value='"+getStringValue(map, this.valueKey)+"' />");
		}
	}
	
	/**
	 * 写数据列
	 * @param map
	 * @return 
	 */
	protected void appendSet(Map<String, Object> map,StringBuffer sb) {
		sb.append("<set value='"+getStringValue(map, this.valueKey)+"' ");
		if(this.drillLink != null) {
			String link = new String(this.drillLink);
			String param = "";
			while(!(param = CommonUtil.getParam(link, "[@", "]")).equals("")) {
				String value = getStringValue(map, param);
				link = CommonUtil.replace(link, "[@"+param+"]", value);
			}
			sb.append("link='"+link+"' ");
		}
		sb.append(" />");
	}
	
	/**
	 * 添加目标线
	 * @param sb
	 */
	protected void appendTargetLine(StringBuffer sb) {
		sb.append("<trendLines>");
		for (TargetLine line : this.lineList) {
			sb.append(line.toString());
		}
		sb.append("</trendLines>");
	}
	
	public void setLineColor(String lineColor) {
		this.lineColor = lineColor;
	}

	public void setLineThickness(String lineThickness) {
		this.lineThickness = lineThickness;
	}
	public void setCanvasPadding(String canvasPadding) {
		this.canvasPadding = canvasPadding;
	}

	public boolean isShowNames() {
		return showNames;
	}
	public void setShowNames(boolean showNames) {
		this.showNames = showNames;
	}
	public boolean isShowValues() {
		return showValues;
	}
	public void setShowValues(boolean showValues) {
		this.showValues = showValues;
	}
	public String getCaption() {
		return caption;
	}
	public void setCaption(String caption) {
		this.caption = caption;
	}
	public String getSubCaption() {
		return subCaption;
	}
	public void setSubCaption(String subCaption) {
		this.subCaption = subCaption;
	}
	public String getXAxisName() {
		return xAxisName;
	}
	public void setXAxisName(String axisName) {
		xAxisName = axisName;
	}
	public String getYAxisName() {
		return yAxisName;
	}
	public void setYAxisName(String axisName) {
		yAxisName = axisName;
	}
	public String getBgColor() {
		return bgColor;
	}
	public void setBgColor(String bgColor) {
		this.bgColor = bgColor;
	}
	public String getBgAlpha() {
		return bgAlpha;
	}
	public void setBgAlpha(String bgAlpha) {
		this.bgAlpha = bgAlpha;
	}
	public String getBgRatio() {
		return bgRatio;
	}
	public void setBgRatio(String bgRatio) {
		this.bgRatio = bgRatio;
	}
	public String getBgAngle() {
		return bgAngle;
	}
	public void setBgAngle(String bgAngle) {
		this.bgAngle = bgAngle;
	}
	public String getShadowAlpha() {
		return shadowAlpha;
	}
	public void setShadowAlpha(String shadowAlpha) {
		this.shadowAlpha = shadowAlpha;
	}
	public String getShowLegend() {
		return showLegend;
	}
	public void setShowLegend(String showLegend) {
		this.showLegend = showLegend;
	}
	
	public void setStartingAngle(String startingAngle) {
		this.startingAngle = startingAngle;
	}

	public void setPalette(String palette) {
		this.palette = palette;
	}

	public void setDecimals(int decimals) {
		this.decimals = decimals;
	}

	public void setFormatNumberScale(boolean formatNumberScale) {
		this.formatNumberScale = formatNumberScale;
	}

	public void setShowBorder(boolean showBorder) {
		this.showBorder = showBorder;
	}

	public void setEnableSmartLabels(boolean enableSmartLabels) {
		this.enableSmartLabels = enableSmartLabels;
	}

	public void setEnableRotation(boolean enableRotation) {
		this.enableRotation = enableRotation;
	}

	public void setNumberPrefix(String numberPrefix) {
		this.numberPrefix = numberPrefix;
	}

	public void setSeriesNames(List<String> seriesNames) {
		this.seriesNames = seriesNames;
	}

	public void setLabelName(String labelName) {
		this.labelName = labelName;
	}

	public void setValueKey(String valueKey) {
		this.valueKey = valueKey;
	}

	public void setDataSetList(List<List<Map<String, Object>>> dataSetList) {
		this.dataSetList = dataSetList;
	}
	
	public String getChartType() {
		return chartType;
	}

	public void setChartType(String chartType) {
		this.chartType = chartType;
	}
	public void setSlantLabels(String slantLabels) {
		this.slantLabels = slantLabels;
	}

	public void setRange(int width, int height) {
		this.width = width;
		this.height = height;
	}
	
	public void setLabelDisplay(String labelDisplay) {
		this.labelDisplay = labelDisplay;
	}
	public void setShowNullValue(boolean showNullValue) {
		this.showNullValue = showNullValue;
	}

	//获取图形的长度
	public int getWidth() {
		return this.width;
	}
	
	//获取图形的高度
	public int getHeight() {
		return this.height;
	}
	
	//添加目标线
	public void addTargetLine(TargetLine line) {
		this.lineList.add(line);
	}
	
	public void setChartBottomMargin(String chartBottomMargin) {
		this.chartBottomMargin = chartBottomMargin;
	}

	public void setChartTopMargin(String chartTopMargin) {
		this.chartTopMargin = chartTopMargin;
	}

	public void setChartRightMargin(String chartRightMargin) {
		this.chartRightMargin = chartRightMargin;
	}

	public void setChartLeftMargin(String chartLeftMargin) {
		this.chartLeftMargin = chartLeftMargin;
	}

	public void setShowLabels(boolean showLabels) {
		this.showLabels = showLabels;
	}

	protected String getStringValue(Map<String, Object> paramMap, String key) {
		Object value = paramMap.get(key);
		if(value == null)
			value = "";
		return value.toString().trim();
	}
}
