package com.rx.system.util;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import jxl.Workbook;
import jxl.format.Alignment;
import jxl.format.Border;
import jxl.format.BorderLineStyle;
import jxl.format.Colour;
import jxl.format.UnderlineStyle;
import jxl.format.VerticalAlignment;
import jxl.write.Label;
import jxl.write.WritableCellFormat;
import jxl.write.WritableFont;
import jxl.write.WritableSheet;
import jxl.write.WritableWorkbook;

import org.dom4j.Attribute;
import org.dom4j.Document;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.dom4j.XPath;


/**
 * 根据XML获取创建的Excel对象
 * @author chenxd
 *
 */
@SuppressWarnings("unchecked")
public class ExcelExporter {
	
	private String xml = null;//xml字符串
	private File file = null;//文件
	private Document document = null;//文档对象
	
	private int rowNumber = 0;//行号
	private int tabCount = 0; //TAB键个数
	
	private String[] header = null;//表头
	private String[] types = null;//列类型,用于确定单元格格式
	private String title = null;//标题
	
	private Map<String, String> mergeMap = new HashMap<String, String>();//合并单元格Map
	private Map<String, String> customerMergeMap = null;//用户自定义合并信息
	
	private WritableCellFormat titleFormat = null;
	private WritableCellFormat headerFormat = null;
	private WritableCellFormat dataFormat = null;
	private WritableCellFormat stringFormat = null;
	private WritableCellFormat infoFormat = null;
	
	private int[] colWidthArray = null;//列宽数组
	private int column_width = 16;//默认列宽
	private int max_column_width = 50;//最大列宽
	
	private String[][] info = null;//页眉信息
	private boolean infoInOneRow = true;//页眉信息一行展示
	
	private boolean useTab = true;
	
	public ExcelExporter(File file, String xml) {
		this.xml = xml;
		this.file = file;
	}
	
	public ExcelExporter(String fileName, String xml) {
		this.xml = xml;
		this.file = new File(fileName);
	}
	
	
	
	/**
	 * 写Excel对象
	 * @throws Exception
	 */
	public void writeWorkBook() throws Exception{
		
		setFontMap();
		
		this.document = this.getDocument(this.xml);
		
		WritableWorkbook wb = Workbook.createWorkbook(this.file);
		
		WritableSheet sheet = wb.createSheet("sheet1", 0);
		
		this.writeTitle(sheet);
		
		int max_col_length = this.header[0].split(",").length;
		if(this.info != null && (this.info.length*3-1) > max_col_length)
			max_col_length = (this.info.length*3-1);
		
		colWidthArray = new int[max_col_length];
		//设置默认列宽
		for (int i = 0; i < this.colWidthArray.length; i++) {
			colWidthArray[i] = this.column_width;
		}
		
		writeInfoRow(sheet);
		
		if(!infoInOneRow)
			updateInfoRow(sheet);
		
		this.writeHeader(sheet);
		
		this.writeSheetData(sheet, "/rows/row");
		
		//设置最终列宽
		for (int i = 0; i < this.colWidthArray.length; i++) {
			sheet.setColumnView(i, this.colWidthArray[i]);
		}
		
		//合并单元格
		doMergeCell(sheet);
		
		wb.write();
		wb.close();
	}
	
	/**
	 * 写标题
	 * @param sheet
	 * @throws Exception 
	 */
	private void writeTitle(WritableSheet sheet) throws Exception {
		if(this.title == null)
			return;
		
		int rspan = 0;
		if(this.header != null) {
			rspan = this.header[this.header.length - 1].split(",").length;
		}
		Label title = new Label(0,0,this.title,this.titleFormat);
		sheet.addCell(title);
		
		if(infoInOneRow && this.info != null && (this.info.length*3-1) > rspan)
			rspan = (this.info.length*3-1);
		
		sheet.mergeCells(0, 0, rspan - 1, 0);
		
		this.rowNumber++;
	}
	
	/**
	 * 写页眉信息
	 * @param sheet
	 * @throws Exception
	 */
	private void writeInfoRow(WritableSheet sheet) throws Exception {
		if(this.info == null)
			return;
		this.rowNumber++;
		int cellIndex = 0;
		for (int i = 0; i < this.info.length; i++) {
			String[] record = info[i];
			for (int j = 0; j < record.length; j++) {
				Label label = new Label(cellIndex, this.rowNumber, record[j], this.infoFormat);
				sheet.addCell(label);
				updateColumWidth(label);
				cellIndex++;
			}
			cellIndex++;
		}
		this.rowNumber++;
		this.rowNumber++;
	}
	
	/**
	 * 更新页眉信息不在一行显示
	 * @param sheet
	 * @throws Exception
	 */
	private void updateInfoRow(WritableSheet sheet) throws Exception{
		if(this.info == null)
			return;
		this.rowNumber = this.rowNumber-2;
		//清空页眉信息
		for(int i=0;i<(this.info.length*3-1);i++){
			Label label = new Label(i, this.rowNumber, "", this.infoFormat);
			sheet.addCell(label);
		}
		for (int i = 0; i < this.info.length; i++) {
			String[] record = info[i];
			int cellIndex = 0;
			for (int j = 0; j < record.length; j++) {
				Label label = new Label(cellIndex, this.rowNumber, record[j], this.infoFormat);
				sheet.addCell(label);
				updateColumWidth(label);
				cellIndex++;
			}
			this.rowNumber++;
		}
		this.rowNumber++;
	}
	
	/**
	 * 写表单表头
	 * @param sheet
	 * @throws Exception 
	 */
	private void writeHeader(WritableSheet sheet) throws Exception {
		
		String[][] headerData = new String[this.header.length][];
		for (int i = 0; i < this.header.length; i++) {
			headerData[i] = this.header[i].split(",");
		}
		
		List<String> megerList = new ArrayList<String>();
		
		for (int i = 0; i < headerData.length; i++) {
			
			for (int j = 0; j < headerData[i].length; j++) {
				Label label = new Label(j, this.rowNumber, headerData[i][j], this.headerFormat);
				updateColumWidth(label);
				sheet.addCell(label);
				
				//记录合并单元和信息
				int cspan = 1, rspan = 1;
				if(!headerData[i][j].equals("#cspan") && !headerData[i][j].equals("#rspan")) {
					for (int k = j + 1; k < headerData[i].length; k++) {
						if(headerData[i][k].equals("#cspan"))
							cspan++;
						else 
							break;
					}
					
					for (int k = i + 1; k < headerData.length; k++) {
						if(headerData[k][j].equals("#rspan"))
							rspan++;
						else 
							break;
					}
				}
				
				if(cspan > 1 || rspan > 1) {
					megerList.add(this.rowNumber + "," + j + "," + rspan + "," + cspan);
				}
				
			}
			
			this.rowNumber++;
		}
		
		for (String entry : megerList) {
			String[] info = entry.split(",");
			int row_start = Integer.parseInt(info[0]);
			int col_start = Integer.parseInt(info[1]);
			int row_end = row_start + Integer.parseInt(info[2]) - 1;
			int col_end = col_start + Integer.parseInt(info[3]) - 1;
			sheet.mergeCells(col_start, row_start, col_end, row_end);
		}
		
	}
	
	/**
	 * 写表单数据
	 * @param sheet
	 * @param k row的层数
	 * @throws Exception
	 */
	private void writeSheetData(WritableSheet sheet, String path) throws Exception {
		List<Element> elementList = DocumentHelper.createXPath(path).selectNodes(this.document);
		
		for (int i = 0; i < elementList.size(); i++) {
			Element element = elementList.get(i);
			this.writeRowData(sheet, element);
			addTabCount();
			
			String nextLevelPath = "";
			if(path.endsWith("row")) {
				nextLevelPath += path + "[@id='"+ element.attributeValue("id") +"']"; 
			}
			nextLevelPath += "/row";
			
			this.writeSheetData(sheet, nextLevelPath);
			reduceTabCount();
		}
	}
	
	/**
	 * 写行数据
	 * @param sheet
	 * @param obj
	 * @throws Exception
	 */
	private void writeRowData(WritableSheet sheet, Object obj) throws Exception {
		XPath xpath = DocumentHelper.createXPath("cell");
		List<Element> cellList = xpath.selectNodes(obj);
		
		boolean b = true;
		for (int i = 0; i < cellList.size(); i++) {
			Element e = cellList.get(i);
			String text = e.getText();
			if(this.useTab && b && text != null && !text.trim().equals("")) {
				for (int j = 0; j < this.tabCount; j++) {
					text = "    " + text;
				}
				b = false;
			}
			
			Attribute row_span_attr = e.attribute("rowspan");
			Attribute col_span_attr = e.attribute("colspan");
			if(row_span_attr !=  null || col_span_attr != null) {
				int rowspan = Integer.parseInt(row_span_attr.getValue());
				int colspan = Integer.parseInt(col_span_attr.getValue());
				
				if(rowspan > 1 || colspan > 1) {
					this.mergeMap.put(this.rowNumber + "," + i, rowspan + "," +colspan);
				}
			}
			if("".equals(text))
				text = "	";
			Label label = new Label(i, this.rowNumber, text, getFormat(i));
			updateColumWidth(label);
			sheet.addCell(label);
		}
		
		this.rowNumber++;
	}
	
	/**
	 * 合并单元格
	 * @param sheet
	 * @throws Exception
	 */
	private void doMergeCell(WritableSheet sheet) throws Exception {
		
		if(this.customerMergeMap != null) {
			this.mergeMap.putAll(this.customerMergeMap);
		}
		
		Iterator<String> cellPointIter = this.mergeMap.keySet().iterator();
		
		while(cellPointIter.hasNext()) {
			String point = cellPointIter.next();
			int rowIndex = Integer.parseInt(point.split(",")[0]);
			int colIndex = Integer.parseInt(point.split(",")[1]);
			
			String val = this.mergeMap.get(point);
			
			int rspan = Integer.parseInt(val.split(",")[0]);
			int cspan = Integer.parseInt(val.split(",")[1]);
			
			sheet.mergeCells(colIndex, rowIndex, colIndex + cspan - 1, rowIndex + rspan - 1);
		}
	}
	
	/**
	 * 初始化单元格样式Map
	 * @throws Exception 
	 */
	private void setFontMap() throws Exception {
		//标题样式
		WritableFont titleFont = new WritableFont(WritableFont.ARIAL, 18, WritableFont.BOLD, false, UnderlineStyle.NO_UNDERLINE, Colour.BLACK);
		this.titleFormat = new WritableCellFormat(titleFont);
		this.titleFormat.setBackground(Colour.BLUE_GREY);
		this.titleFormat.setAlignment(Alignment.CENTRE);
		this.titleFormat.setBorder(Border.ALL, BorderLineStyle.THIN);
		this.titleFormat.setVerticalAlignment(VerticalAlignment.CENTRE);
		
		//表头样式
		WritableFont headerFont = new WritableFont(WritableFont.ARIAL, 12, WritableFont.NO_BOLD, false, UnderlineStyle.NO_UNDERLINE, Colour.BLACK);
		this.headerFormat = new WritableCellFormat(headerFont);
		this.headerFormat.setBackground(Colour.GRAY_25);
		this.headerFormat.setAlignment(Alignment.CENTRE);
		this.headerFormat.setBorder(Border.ALL, BorderLineStyle.THIN);
		this.headerFormat.setVerticalAlignment(VerticalAlignment.CENTRE);
		
		//数据单元格样式
		WritableFont dataFont = new WritableFont(WritableFont.ARIAL, 11, WritableFont.NO_BOLD, false, UnderlineStyle.NO_UNDERLINE, Colour.BLACK);
		this.dataFormat = new WritableCellFormat(dataFont);
		this.dataFormat.setBackground(Colour.WHITE);
		this.dataFormat.setAlignment(Alignment.RIGHT);
		this.dataFormat.setBorder(Border.ALL, BorderLineStyle.THIN);
		this.dataFormat.setVerticalAlignment(VerticalAlignment.CENTRE);
		
		//字符串单元格样式
		WritableFont strFont = new WritableFont(WritableFont.ARIAL, 11, WritableFont.NO_BOLD, false, UnderlineStyle.NO_UNDERLINE, Colour.BLACK);
		this.stringFormat = new WritableCellFormat(strFont);
		this.stringFormat.setBackground(Colour.WHITE);
		this.stringFormat.setAlignment(Alignment.CENTRE);
		this.stringFormat.setBorder(Border.ALL, BorderLineStyle.THIN);
		this.stringFormat.setVerticalAlignment(VerticalAlignment.CENTRE);
		
		WritableFont infoFont = new WritableFont(WritableFont.ARIAL, 11, WritableFont.NO_BOLD, false, UnderlineStyle.NO_UNDERLINE, Colour.BLACK);
		this.infoFormat = new WritableCellFormat(infoFont);
		this.infoFormat.setBackground(Colour.WHITE);
		this.infoFormat.setAlignment(Alignment.CENTRE);
		this.infoFormat.setBorder(Border.ALL, BorderLineStyle.THIN, Colour.GRAY_25);
		this.infoFormat.setVerticalAlignment(VerticalAlignment.CENTRE);
	}
	
	private WritableCellFormat getFormat(int i) {
		if(this.types == null || this.types[i].equals("0"))
			return this.stringFormat;
		
		return this.dataFormat;
	}
	
	private void updateColumWidth(Label label) {
		int cellIndex = label.getColumn();
		int columnWidth = this.colWidthArray[cellIndex];
		if(columnWidth >= this.max_column_width)
			return;
		int textLength = length(label.getString()) + 4;
		if(textLength > columnWidth) {
			this.colWidthArray[cellIndex] = textLength;
		}
	}
	
	public static int length(String value) {
        int valueLength = 0;
        String chinese = "[\u0391-\uFFE5]";
        /* 获取字段值的长度，如果含中文字符，则每个中文字符长度为2，否则为1 */
        for (int i = 0; i < value.length(); i++) {
            /* 获取一个字符 */
            String temp = value.substring(i, i + 1);
            /* 判断是否为中文字符 */
            if (temp.matches(chinese)) {
                /* 中文字符长度为2 */
                valueLength += 2;
            } else if(!temp.toLowerCase().equals(temp)){
            	//大写字母
            	valueLength += 2;
            }else {
                /* 其他字符长度为1 */
                valueLength += 1;
            }
        }
        return valueLength;
    }
	
	/**
	 * 根据Xml字符串获取文档对象
	 * @param xml
	 * @return
	 * @throws Exception 
	 */
	private Document getDocument(String xml) throws Exception {
		return DocumentHelper.parseText(xml);
	}

	public void setUseTab(boolean useTab) {
		this.useTab = useTab;
	}
	
	private void addTabCount() {
		if(this.useTab)
			this.tabCount++;
	}
	private void reduceTabCount() {
		if(this.useTab)
			this.tabCount--;
	}
	public void setTypes(String[] types) {
		this.types = types;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public void setHeader(String[] header) {
		this.header = header;
	}
	public void setColumn_width(int column_width) {
		this.column_width = column_width;
	}
	public void setInfo(String[][] info) {
		this.info = info;
	}
	public void setMax_column_width(int max_column_width) {
		this.max_column_width = max_column_width;
	}

	public void setInfoInOneRow(boolean infoInOneRow) {
		this.infoInOneRow = infoInOneRow;
	}
	public void setCustomerMergeMap(Map<String, String> customerMergeMap) {
		this.customerMergeMap = customerMergeMap;
	}
	

	public static void main(String[] args) throws Exception {
//		String[] header = new String[]{"指标,#cspan,#cspan,时点余额,月均余额,年均余额","第一级,第二级,第三级,#rspan,#rspan,#rspan"};

		String[] header = new String[]{"地区名称,年份,维度名称,百人拥有移动电话(总量指标)(部),百人拥有移动电话(速度指标)(部),北京地区进出口总值（出口值）(总量指标)(亿美元),北京地区进出口总值（出口值）(速度指标)(亿美元),北京地区进出口总值（进口值）(总量指标)(亿美元),北京地区进出口总值（进口值）(速度指标)(亿美元),北京地区进出口总值(总量指标)(亿美元),北京地区进出口总值(速度指标)(亿美元),城市公共交通客运量(总量指标)(亿人次),城市公共交通客运量(速度指标)(亿人次),城市绿化覆盖率(总量指标)(%),城市绿化覆盖率(速度指标)(%),城镇单位在岗职工工资总额(总量指标)(亿元),城镇单位在岗职工工资总额(速度指标)(亿元),城镇单位在岗职工平均工资(总量指标)(元),城镇单位在岗职工平均工资(速度指标)(元),城镇单位在岗职工人数(总量指标)(万人),城镇单位在岗职工人数(速度指标)(万人),城镇居民人均可支配收入(总量指标)(元),城镇居民人均可支配收入(速度指标)(元),城镇居民人均住房建筑面积(总量指标)(平方米),城镇居民人均住房建筑面积(速度指标)(平方米),城镇居民人均住宅使用面积(总量指标)(平方米),城镇居民人均住宅使用面积(速度指标)(平方米),从业人员年末人数(总量指标)(万人),从业人员年末人数(速度指标)(万人),登记结婚对数(总量指标)(万对),登记结婚对数(速度指标)(万对),地方财政收入(总量指标)(亿元),地方财政收入(速度指标)(亿元),地方财政支出(总量指标)(亿元),地方财政支出(速度指标)(亿元),地区生产总值（第二产业）(总量指标)(亿元),地区生产总值（第二产业）(速度指标)(亿元),地区生产总值（第三产业）(总量指标)(亿元),地区生产总值（第三产业）(速度指标)(亿元),地区生产总值（第一产业）(总量指标)(亿元),地区生产总值（第一产业）(速度指标)(亿元),地区生产总值(总量指标)(亿元),地区生产总值(速度指标)(亿元),房屋销售价格指数(总量指标)(上年=100）（%）,房屋销售价格指数(速度指标)(上年=100）（%）,耕地面积(总量指标)(万公顷),耕地面积(速度指标)(万公顷),工业企业主要经济指标(规模以上)（负债总额）(总量指标)(亿元),工业企业主要经济指标(规模以上)（负债总额）(速度指标)(亿元),工业企业主要经济指标(规模以上)（利润总额）(总量指标)(亿元),工业企业主要经济指标(规模以上)（利润总额）(速度指标)(亿元),工业企业主要经济指标(规模以上)（主营业务收入）(总量指标)(亿元),工业企业主要经济指标(规模以上)（主营业务收入）(速度指标)(亿元),工业企业主要经济指标(规模以上)（资产总计）(总量指标)(亿元),工业企业主要经济指标(规模以上)（资产总计）(速度指标)(亿元),工业生产者出厂价格指数(总量指标)(上年=100）（%）,工业生产者出厂价格指数(速度指标)(上年=100）（%）,工业增加值(现价、规模以上)(总量指标)(亿元),工业增加值(现价、规模以上)(速度指标)(亿元),公共图书馆总藏数(总量指标)(万册、万件),公共图书馆总藏数(速度指标)(万册、万件),公路货物周转量(总量指标)(亿吨公里),公路货物周转量(速度指标)(亿吨公里),固定电话用户(总量指标)(万户),固定电话用户(速度指标)(万户),固定电话主线普及率(总量指标)(线/百人),固定电话主线普及率(速度指标)(线/百人),固定资产投资（房地产开发投资）(总量指标)(亿元),固定资产投资（房地产开发投资）(速度指标)(亿元),固定资产投资（国有单位）(总量指标)(亿元),固定资产投资（国有单位）(速度指标)(亿元),固定资产投资（商品房竣工面积）(总量指标)(万平方米),固定资产投资（商品房竣工面积）(速度指标)(万平方米),固定资产投资（商品房施工面积）(总量指标)(万平方米),固定资产投资（商品房施工面积）(速度指标)(万平方米),固定资产投资价格指数(总量指标)(上年=100）（%）,固定资产投资价格指数(速度指标)(上年=100）（%）,管道货物周转量(总量指标)(亿吨公里),管道货物周转量(速度指标)(亿吨公里),海关进出口总额（出口额）(总量指标)(亿美元),海关进出口总额（出口额）(速度指标)(亿美元),海关进出口总额（进口额）(总量指标)(亿美元),海关进出口总额（进口额）(速度指标)(亿美元),海关进出口总额(总量指标)(亿美元),海关进出口总额(速度指标)(亿美元),货物周转量(总量指标)(亿吨公里),货物周转量(速度指标)(亿吨公里),技术合同成交总额(总量指标)(亿元),技术合同成交总额(速度指标)(亿元),建筑业总产值(总量指标)(亿元),建筑业总产值(速度指标)(亿元),接待入境旅游者人数(总量指标)(万人次),接待入境旅游者人数(速度指标)(万人次),金融机构(含外资)本外币存款余额(总量指标)(亿元),金融机构(含外资)本外币存款余额(速度指标)(亿元),金融机构(含外资)本外币贷款余额(总量指标)(亿元),金融机构(含外资)本外币贷款余额(速度指标)(亿元),金融机构(含外资)储蓄存款余额(总量指标)(亿元),金融机构(含外资)储蓄存款余额(速度指标)(亿元),金融机构(含外资)储蓄定期(总量指标)(亿元),金融机构(含外资)储蓄定期(速度指标)(亿元),金融机构(含外资)储蓄活期(总量指标)(亿元),金融机构(含外资)储蓄活期(速度指标)(亿元),居民燃气用户(总量指标)(万户),居民燃气用户(速度指标)(万户),居民消费价格指数(总量指标)(上年=100）（%）,居民消费价格指数(速度指标)(上年=100）（%）,空气质量二级及好于二级的天数(总量指标)(天),空气质量二级及好于二级的天数(速度指标)(天),离婚对数(总量指标)(万对),离婚对数(速度指标)(万对),旅客周转量(总量指标)(亿人公里),旅客周转量(速度指标)(亿人公里),旅游外汇收入(总量指标)(亿美元),旅游外汇收入(速度指标)(亿美元),民航货物周转量(总量指标)(亿吨公里),民航货物周转量(速度指标)(亿吨公里),能源消费总量(总量指标)(万吨标准煤),能源消费总量(速度指标)(万吨标准煤),年末户籍人口(总量指标)(万人),年末户籍人口(速度指标)(万人),年末全市常住人口（城镇人口）(总量指标)(万人),年末全市常住人口（城镇人口）(速度指标)(万人),年末全市常住人口（男性人口）(总量指标)(万人),年末全市常住人口（男性人口）(速度指标)(万人),年末全市常住人口（女性人口）(总量指标)(万人),年末全市常住人口（女性人口）(速度指标)(万人),年末全市常住人口(总量指标)(万人),年末全市常住人口(速度指标)(万人),年末全市常住人口（乡村人口）(总量指标)(万人),年末全市常住人口（乡村人口）(速度指标)(万人),年末全市移动电话用户(总量指标)(万户),年末全市移动电话用户(速度指标)(万户),年末实有城镇登记失业人员(总量指标)(万人),年末实有城镇登记失业人员(速度指标)(万人),农产品生产价格指数(总量指标)(上年=100）（%）,农产品生产价格指数(速度指标)(上年=100）（%）,农村居民人均可支配收入(总量指标)(元),农村居民人均可支配收入(速度指标)(元),农村居民人均住房面积(总量指标)(平方米),农村居民人均住房面积(速度指标)(平方米),农林牧渔业总产值(现价)(总量指标)(亿元),农林牧渔业总产值(现价)(速度指标)(亿元),轻工业总产值(现价、规模以上)(总量指标)(亿元),轻工业总产值(现价、规模以上)(速度指标)(亿元),全社会房屋竣工面积(总量指标)(万平方米),全社会房屋竣工面积(速度指标)(万平方米),全社会房屋施工面积(总量指标)(万平方米),全社会房屋施工面积(速度指标)(万平方米),全社会固定资产投资(总量指标)(亿元),全社会固定资产投资(速度指标)(亿元),全社会用电量(总量指标)(亿千瓦时),全社会用电量(速度指标)(亿千瓦时),人均地区生产总值(总量指标)(元/人),人均地区生产总值(速度指标)(元/人),人均生产总值(总量指标)(元/人),人均生产总值(速度指标)(元/人),商品零售价格指数(总量指标)(上年=100）（%）,商品零售价格指数(速度指标)(上年=100）（%）,社会消费品零售额（餐饮业）(总量指标)(亿元),社会消费品零售额（餐饮业）(速度指标)(亿元),社会消费品零售额（批发零售贸易业）(总量指标)(亿元),社会消费品零售额（批发零售贸易业）(速度指标)(亿元),社会消费品零售额（批发零售业）(总量指标)(亿元),社会消费品零售额（批发零售业）(速度指标)(亿元),社会消费品零售额（其他）(总量指标)(亿元),社会消费品零售额（其他）(速度指标)(亿元),社会消费品零售额（其他行业）(总量指标)(亿元),社会消费品零售额（其他行业）(速度指标)(亿元),社会消费品零售总额(吃类商品)(总量指标)(亿元),社会消费品零售总额(吃类商品)(速度指标)(亿元),社会消费品零售总额(穿类商品)(总量指标)(亿元),社会消费品零售总额(穿类商品)(速度指标)(亿元),社会消费品零售总额(烧类商品)(总量指标)(亿元),社会消费品零售总额(烧类商品)(速度指标)(亿元),社会消费品零售总额(总量指标)(亿元),社会消费品零售总额(速度指标)(亿元),社会消费品零售总额(用类商品)(总量指标)(亿元),社会消费品零售总额(用类商品)(速度指标)(亿元),施工企业从业人员(总量指标)(万人),施工企业从业人员(速度指标)(万人),施工企业总产值(总量指标)(亿元),施工企业总产值(速度指标)(亿元),实际利用外商直接投资额(总量指标)(亿美元),实际利用外商直接投资额(速度指标)(亿美元),实际使用外资金额(总量指标)(亿美元),实际使用外资金额(速度指标)(亿美元),铁路货物周转量(总量指标)(亿吨公里),铁路货物周转量(速度指标)(亿吨公里),卫生机构病床数(总量指标)(万张),卫生机构病床数(速度指标)(万张),卫生机构个数(总量指标)(个),卫生机构个数(速度指标)(个),卫生技术人员数(总量指标)(万人),卫生技术人员数(速度指标)(万人),污水处理率(总量指标)(%),污水处理率(速度指标)(%),研究与发展经费内部支出(总量指标)(亿元),研究与发展经费内部支出(速度指标)(亿元),研究与发展经费支出(总量指标)(亿元),研究与发展经费支出(速度指标)(亿元),研究与试验发展经费内部支出(总量指标)(亿元),研究与试验发展经费内部支出(速度指标)(亿元),一般公共预算收入(总量指标)(亿元),一般公共预算收入(速度指标)(亿元),一般公共预算支出(总量指标)(亿元),一般公共预算支出(速度指标)(亿元),移动电话普及率(总量指标)(户/百人),移动电话普及率(速度指标)(户/百人),移动电话用户(总量指标)(万户),移动电话用户(速度指标)(万户),用电量(总量指标)(亿千瓦时),用电量(速度指标)(亿千瓦时),邮电业务总量(总量指标)(亿元),邮电业务总量(速度指标)(亿元),原保险保费收入(总量指标)(亿元),原保险保费收入(速度指标)(亿元),原材料、燃料、动力购进价格指数(总量指标)(上年=100）（%）,原材料、燃料、动力购进价格指数(速度指标)(上年=100）（%）,在校学生数(总量指标)(万人),在校学生数(速度指标)(万人),执业医师(总量指标)(万人),执业医师(速度指标)(万人),重工业总产值(现价、规模以上)(总量指标)(亿元),重工业总产值(现价、规模以上)(速度指标)(亿元),主线普及率(总量指标)(线/百人),主线普及率(速度指标)(线/百人),主要农产品产量（粮食）(总量指标)(万吨),主要农产品产量（粮食）(速度指标)(万吨),主要农产品产量（牛奶）(总量指标)(万吨),主要农产品产量（牛奶）(速度指标)(万吨),主要农产品产量（禽蛋）(总量指标)(万吨),主要农产品产量（禽蛋）(速度指标)(万吨),主要农产品产量（肉类）(总量指标)(万吨),主要农产品产量（肉类）(速度指标)(万吨),主要农产品产量（蔬菜）(总量指标)(万吨),主要农产品产量（蔬菜）(速度指标)(万吨),主要农产品产量（蔬菜及食用菌）(总量指标)(万吨),主要农产品产量（蔬菜及食用菌）(速度指标)(万吨),主要农产品产量（鲜蛋）(总量指标)(万吨),主要农产品产量（鲜蛋）(速度指标)(万吨),主要农产品产量（猪牛羊肉）(总量指标)(万吨),主要农产品产量（猪牛羊肉）(速度指标)(万吨),注册护师(士)(总量指标)(万人),注册护师(士)(速度指标)(万人),专利授权量(总量指标)(件),专利授权量(速度指标)(件),专任教师数(总量指标)(万人),专任教师数(速度指标)(万人),专业技术人员(总量指标)(万人),专业技术人员(速度指标)(万人),专业艺术剧团国内演出场次(总量指标)(场),专业艺术剧团国内演出场次(速度指标)(场),自来水销售总量(总量指标)(亿立方米),自来水销售总量(速度指标)(亿立方米),工业生产者购进价格指数(总量指标)(上年=100）（%）,工业生产者购进价格指数(速度指标)(上年=100）（%）,工业总产值(现价、规模以上)(总量指标)(亿元),工业总产值(现价、规模以上)(速度指标)(亿元)"};
//		String xml = "<?xml version=\"1.0\" encoding=\"utf-8\"?><rows><head><column width=\"120\" type=\"ro\" align=\"center\">指标</column><column width=\"120\" type=\"ro\" align=\"center\">时点余额</column><column width=\"120\" type=\"ro\" align=\"center\">月均余额</column><column width=\"120\" type=\"ro\" align=\"right\">年均余额</column></head><row id=\"root_cust_service\"><cell rspan=\"4\" cspan=\"1\">总揽</cell><cell rspan=\"2\" cspan=\"1\">客户</cell><cell rspan=\"1\" cspan=\"1\">客户服务</cell><cell></cell></row><row id=\"root_cust_vip\"><cell></cell><cell></cell><cell rspan=\"1\" cspan=\"1\">VIP服务</cell><cell></cell></row><row id=\"root_zl_ye\"><cell></cell><cell rspan=\"2\" cspan=\"1\">战略</cell><cell rspan=\"1\" cspan=\"1\">余额</cell><cell></cell></row><row id=\"root_zl_yj\"><cell></cell><cell></cell><cell rspan=\"1\" cspan=\"1\">月均</cell><cell></cell></row></rows>";
		String xml = "<?xml version=\"1.0\" encoding=\"utf-8\"?><rows><head><column width=\"200\" type=\"ro\" align=\"center\"><![CDATA[地区名称]]></column><column width=\"140\" type=\"ro\" align=\"center\"><![CDATA[年份]]></column><column width=\"150\" type=\"ro\" align=\"center\"><![CDATA[维度名称]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[百人拥有移动电话(总量指标)(部)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[百人拥有移动电话(速度指标)(部)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[北京地区进出口总值（出口值）(总量指标)(亿美元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[北京地区进出口总值（出口值）(速度指标)(亿美元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[北京地区进出口总值（进口值）(总量指标)(亿美元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[北京地区进出口总值（进口值）(速度指标)(亿美元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[北京地区进出口总值(总量指标)(亿美元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[北京地区进出口总值(速度指标)(亿美元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[城市公共交通客运量(总量指标)(亿人次)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[城市公共交通客运量(速度指标)(亿人次)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[城市绿化覆盖率(总量指标)(%)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[城市绿化覆盖率(速度指标)(%)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[城镇单位在岗职工工资总额(总量指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[城镇单位在岗职工工资总额(速度指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[城镇单位在岗职工平均工资(总量指标)(元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[城镇单位在岗职工平均工资(速度指标)(元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[城镇单位在岗职工人数(总量指标)(万人)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[城镇单位在岗职工人数(速度指标)(万人)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[城镇居民人均可支配收入(总量指标)(元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[城镇居民人均可支配收入(速度指标)(元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[城镇居民人均住房建筑面积(总量指标)(平方米)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[城镇居民人均住房建筑面积(速度指标)(平方米)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[城镇居民人均住宅使用面积(总量指标)(平方米)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[城镇居民人均住宅使用面积(速度指标)(平方米)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[从业人员年末人数(总量指标)(万人)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[从业人员年末人数(速度指标)(万人)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[登记结婚对数(总量指标)(万对)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[登记结婚对数(速度指标)(万对)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[地方财政收入(总量指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[地方财政收入(速度指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[地方财政支出(总量指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[地方财政支出(速度指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[地区生产总值（第二产业）(总量指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[地区生产总值（第二产业）(速度指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[地区生产总值（第三产业）(总量指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[地区生产总值（第三产业）(速度指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[地区生产总值（第一产业）(总量指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[地区生产总值（第一产业）(速度指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[地区生产总值(总量指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[地区生产总值(速度指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[房屋销售价格指数(总量指标)(上年=100）（%）]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[房屋销售价格指数(速度指标)(上年=100）（%）]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[耕地面积(总量指标)(万公顷)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[耕地面积(速度指标)(万公顷)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[工业企业主要经济指标(规模以上)（负债总额）(总量指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[工业企业主要经济指标(规模以上)（负债总额）(速度指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[工业企业主要经济指标(规模以上)（利润总额）(总量指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[工业企业主要经济指标(规模以上)（利润总额）(速度指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[工业企业主要经济指标(规模以上)（主营业务收入）(总量指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[工业企业主要经济指标(规模以上)（主营业务收入）(速度指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[工业企业主要经济指标(规模以上)（资产总计）(总量指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[工业企业主要经济指标(规模以上)（资产总计）(速度指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[工业生产者出厂价格指数(总量指标)(上年=100）（%）]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[工业生产者出厂价格指数(速度指标)(上年=100）（%）]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[工业增加值(现价、规模以上)(总量指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[工业增加值(现价、规模以上)(速度指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[公共图书馆总藏数(总量指标)(万册、万件)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[公共图书馆总藏数(速度指标)(万册、万件)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[公路货物周转量(总量指标)(亿吨公里)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[公路货物周转量(速度指标)(亿吨公里)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[固定电话用户(总量指标)(万户)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[固定电话用户(速度指标)(万户)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[固定电话主线普及率(总量指标)(线/百人)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[固定电话主线普及率(速度指标)(线/百人)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[固定资产投资（房地产开发投资）(总量指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[固定资产投资（房地产开发投资）(速度指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[固定资产投资（国有单位）(总量指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[固定资产投资（国有单位）(速度指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[固定资产投资（商品房竣工面积）(总量指标)(万平方米)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[固定资产投资（商品房竣工面积）(速度指标)(万平方米)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[固定资产投资（商品房施工面积）(总量指标)(万平方米)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[固定资产投资（商品房施工面积）(速度指标)(万平方米)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[固定资产投资价格指数(总量指标)(上年=100）（%）]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[固定资产投资价格指数(速度指标)(上年=100）（%）]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[管道货物周转量(总量指标)(亿吨公里)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[管道货物周转量(速度指标)(亿吨公里)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[海关进出口总额（出口额）(总量指标)(亿美元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[海关进出口总额（出口额）(速度指标)(亿美元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[海关进出口总额（进口额）(总量指标)(亿美元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[海关进出口总额（进口额）(速度指标)(亿美元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[海关进出口总额(总量指标)(亿美元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[海关进出口总额(速度指标)(亿美元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[货物周转量(总量指标)(亿吨公里)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[货物周转量(速度指标)(亿吨公里)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[技术合同成交总额(总量指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[技术合同成交总额(速度指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[建筑业总产值(总量指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[建筑业总产值(速度指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[接待入境旅游者人数(总量指标)(万人次)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[接待入境旅游者人数(速度指标)(万人次)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[金融机构(含外资)本外币存款余额(总量指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[金融机构(含外资)本外币存款余额(速度指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[金融机构(含外资)本外币贷款余额(总量指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[金融机构(含外资)本外币贷款余额(速度指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[金融机构(含外资)储蓄存款余额(总量指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[金融机构(含外资)储蓄存款余额(速度指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[金融机构(含外资)储蓄定期(总量指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[金融机构(含外资)储蓄定期(速度指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[金融机构(含外资)储蓄活期(总量指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[金融机构(含外资)储蓄活期(速度指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[居民燃气用户(总量指标)(万户)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[居民燃气用户(速度指标)(万户)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[居民消费价格指数(总量指标)(上年=100）（%）]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[居民消费价格指数(速度指标)(上年=100）（%）]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[空气质量二级及好于二级的天数(总量指标)(天)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[空气质量二级及好于二级的天数(速度指标)(天)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[离婚对数(总量指标)(万对)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[离婚对数(速度指标)(万对)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[旅客周转量(总量指标)(亿人公里)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[旅客周转量(速度指标)(亿人公里)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[旅游外汇收入(总量指标)(亿美元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[旅游外汇收入(速度指标)(亿美元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[民航货物周转量(总量指标)(亿吨公里)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[民航货物周转量(速度指标)(亿吨公里)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[能源消费总量(总量指标)(万吨标准煤)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[能源消费总量(速度指标)(万吨标准煤)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[年末户籍人口(总量指标)(万人)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[年末户籍人口(速度指标)(万人)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[年末全市常住人口（城镇人口）(总量指标)(万人)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[年末全市常住人口（城镇人口）(速度指标)(万人)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[年末全市常住人口（男性人口）(总量指标)(万人)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[年末全市常住人口（男性人口）(速度指标)(万人)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[年末全市常住人口（女性人口）(总量指标)(万人)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[年末全市常住人口（女性人口）(速度指标)(万人)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[年末全市常住人口(总量指标)(万人)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[年末全市常住人口(速度指标)(万人)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[年末全市常住人口（乡村人口）(总量指标)(万人)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[年末全市常住人口（乡村人口）(速度指标)(万人)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[年末全市移动电话用户(总量指标)(万户)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[年末全市移动电话用户(速度指标)(万户)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[年末实有城镇登记失业人员(总量指标)(万人)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[年末实有城镇登记失业人员(速度指标)(万人)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[农产品生产价格指数(总量指标)(上年=100）（%）]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[农产品生产价格指数(速度指标)(上年=100）（%）]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[农村居民人均可支配收入(总量指标)(元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[农村居民人均可支配收入(速度指标)(元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[农村居民人均住房面积(总量指标)(平方米)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[农村居民人均住房面积(速度指标)(平方米)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[农林牧渔业总产值(现价)(总量指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[农林牧渔业总产值(现价)(速度指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[轻工业总产值(现价、规模以上)(总量指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[轻工业总产值(现价、规模以上)(速度指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[全社会房屋竣工面积(总量指标)(万平方米)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[全社会房屋竣工面积(速度指标)(万平方米)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[全社会房屋施工面积(总量指标)(万平方米)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[全社会房屋施工面积(速度指标)(万平方米)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[全社会固定资产投资(总量指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[全社会固定资产投资(速度指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[全社会用电量(总量指标)(亿千瓦时)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[全社会用电量(速度指标)(亿千瓦时)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[人均地区生产总值(总量指标)(元/人)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[人均地区生产总值(速度指标)(元/人)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[人均生产总值(总量指标)(元/人)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[人均生产总值(速度指标)(元/人)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[商品零售价格指数(总量指标)(上年=100）（%）]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[商品零售价格指数(速度指标)(上年=100）（%）]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[社会消费品零售额（餐饮业）(总量指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[社会消费品零售额（餐饮业）(速度指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[社会消费品零售额（批发零售贸易业）(总量指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[社会消费品零售额（批发零售贸易业）(速度指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[社会消费品零售额（批发零售业）(总量指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[社会消费品零售额（批发零售业）(速度指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[社会消费品零售额（其他）(总量指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[社会消费品零售额（其他）(速度指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[社会消费品零售额（其他行业）(总量指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[社会消费品零售额（其他行业）(速度指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[社会消费品零售总额(吃类商品)(总量指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[社会消费品零售总额(吃类商品)(速度指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[社会消费品零售总额(穿类商品)(总量指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[社会消费品零售总额(穿类商品)(速度指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[社会消费品零售总额(烧类商品)(总量指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[社会消费品零售总额(烧类商品)(速度指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[社会消费品零售总额(总量指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[社会消费品零售总额(速度指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[社会消费品零售总额(用类商品)(总量指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[社会消费品零售总额(用类商品)(速度指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[施工企业从业人员(总量指标)(万人)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[施工企业从业人员(速度指标)(万人)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[施工企业总产值(总量指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[施工企业总产值(速度指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[实际利用外商直接投资额(总量指标)(亿美元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[实际利用外商直接投资额(速度指标)(亿美元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[实际使用外资金额(总量指标)(亿美元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[实际使用外资金额(速度指标)(亿美元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[铁路货物周转量(总量指标)(亿吨公里)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[铁路货物周转量(速度指标)(亿吨公里)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[卫生机构病床数(总量指标)(万张)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[卫生机构病床数(速度指标)(万张)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[卫生机构个数(总量指标)(个)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[卫生机构个数(速度指标)(个)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[卫生技术人员数(总量指标)(万人)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[卫生技术人员数(速度指标)(万人)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[污水处理率(总量指标)(%)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[污水处理率(速度指标)(%)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[研究与发展经费内部支出(总量指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[研究与发展经费内部支出(速度指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[研究与发展经费支出(总量指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[研究与发展经费支出(速度指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[研究与试验发展经费内部支出(总量指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[研究与试验发展经费内部支出(速度指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[一般公共预算收入(总量指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[一般公共预算收入(速度指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[一般公共预算支出(总量指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[一般公共预算支出(速度指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[移动电话普及率(总量指标)(户/百人)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[移动电话普及率(速度指标)(户/百人)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[移动电话用户(总量指标)(万户)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[移动电话用户(速度指标)(万户)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[用电量(总量指标)(亿千瓦时)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[用电量(速度指标)(亿千瓦时)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[邮电业务总量(总量指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[邮电业务总量(速度指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[原保险保费收入(总量指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[原保险保费收入(速度指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[原材料、燃料、动力购进价格指数(总量指标)(上年=100）（%）]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[原材料、燃料、动力购进价格指数(速度指标)(上年=100）（%）]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[在校学生数(总量指标)(万人)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[在校学生数(速度指标)(万人)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[执业医师(总量指标)(万人)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[执业医师(速度指标)(万人)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[重工业总产值(现价、规模以上)(总量指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[重工业总产值(现价、规模以上)(速度指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[主线普及率(总量指标)(线/百人)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[主线普及率(速度指标)(线/百人)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[主要农产品产量（粮食）(总量指标)(万吨)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[主要农产品产量（粮食）(速度指标)(万吨)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[主要农产品产量（牛奶）(总量指标)(万吨)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[主要农产品产量（牛奶）(速度指标)(万吨)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[主要农产品产量（禽蛋）(总量指标)(万吨)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[主要农产品产量（禽蛋）(速度指标)(万吨)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[主要农产品产量（肉类）(总量指标)(万吨)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[主要农产品产量（肉类）(速度指标)(万吨)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[主要农产品产量（蔬菜）(总量指标)(万吨)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[主要农产品产量（蔬菜）(速度指标)(万吨)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[主要农产品产量（蔬菜及食用菌）(总量指标)(万吨)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[主要农产品产量（蔬菜及食用菌）(速度指标)(万吨)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[主要农产品产量（鲜蛋）(总量指标)(万吨)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[主要农产品产量（鲜蛋）(速度指标)(万吨)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[主要农产品产量（猪牛羊肉）(总量指标)(万吨)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[主要农产品产量（猪牛羊肉）(速度指标)(万吨)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[注册护师(士)(总量指标)(万人)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[注册护师(士)(速度指标)(万人)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[专利授权量(总量指标)(件)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[专利授权量(速度指标)(件)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[专任教师数(总量指标)(万人)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[专任教师数(速度指标)(万人)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[专业技术人员(总量指标)(万人)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[专业技术人员(速度指标)(万人)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[专业艺术剧团国内演出场次(总量指标)(场)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[专业艺术剧团国内演出场次(速度指标)(场)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[自来水销售总量(总量指标)(亿立方米)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[自来水销售总量(速度指标)(亿立方米)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[工业生产者购进价格指数(总量指标)(上年=100）（%）]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[工业生产者购进价格指数(速度指标)(上年=100）（%）]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[工业总产值(现价、规模以上)(总量指标)(亿元)]]></column><column width=\"120\" type=\"ro\" align=\"center\"><![CDATA[工业总产值(现价、规模以上)(速度指标)(亿元)]]></column></head><row id=\"154107935862190159\"><cell>[110100000000] 全市</cell><cell>2016年</cell><cell>[all] 全部</cell><cell>0.00</cell><cell>0.00</cell><cell>520.20</cell><cell>0.00</cell><cell>2,303.60</cell><cell>0.00</cell><cell>2,823.80</cell><cell>0.00</cell><cell>73.50</cell><cell>0.00</cell><cell>48.40</cell><cell>0.00</cell><cell>9,005.00</cell><cell>0.00</cell><cell>122,749.00</cell><cell>0.00</cell><cell>733.50</cell><cell>0.00</cell><cell>57,275.00</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>1,220.10</cell><cell>0.00</cell><cell>16.60</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>4,944.40</cell><cell>0.00</cell><cell>20,595.00</cell><cell>0.00</cell><cell>129.80</cell><cell>0.00</cell><cell>25,669.10</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>19,798.10</cell><cell>0.00</cell><cell>1,608.30</cell><cell>0.00</cell><cell>19,747.00</cell><cell>0.00</cell><cell>43,093.70</cell><cell>0.00</cell><cell>98.10</cell><cell>0.00</cell><cell>3,748.70</cell><cell>0.00</cell><cell>6,229.00</cell><cell>0.00</cell><cell>161.30</cell><cell>0.00</cell><cell>694.40</cell><cell>0.00</cell><cell>32.00</cell><cell>0.00</cell><cell>4,045.40</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>99.70</cell><cell>0.00</cell><cell>213.80</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>671.30</cell><cell>0.00</cell><cell>3,940.80</cell><cell>0.00</cell><cell>8,841.20</cell><cell>0.00</cell><cell>416.50</cell><cell>0.00</cell><cell>138,408.90</cell><cell>0.00</cell><cell>63,739.40</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>900.70</cell><cell>0.00</cell><cell>101.40</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>10.60</cell><cell>0.00</cell><cell>1,889.30</cell><cell>0.00</cell><cell>50.70</cell><cell>0.00</cell><cell>67.10</cell><cell>0.00</cell><cell>6,961.70</cell><cell>0.00</cell><cell>1,362.90</cell><cell>0.00</cell><cell>1,879.60</cell><cell>0.00</cell><cell>1,112.70</cell><cell>0.00</cell><cell>1,060.20</cell><cell>0.00</cell><cell>2,172.90</cell><cell>0.00</cell><cell>293.30</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>9.10</cell><cell>0.00</cell><cell>99.70</cell><cell>0.00</cell><cell>22,310.00</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>338.10</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>3,594.00</cell><cell>0.00</cell><cell>22,721.40</cell><cell>0.00</cell><cell>8,461.70</cell><cell>0.00</cell><cell>1,020.30</cell><cell>0.00</cell><cell>118,198.00</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>98.10</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>11,005.10</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>59.20</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>130.30</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>229.00</cell><cell>0.00</cell><cell>11.70</cell><cell>0.00</cell><cell>10,637.00</cell><cell>0.00</cell><cell>26.50</cell><cell>0.00</cell><cell>90.00</cell><cell>0.00</cell><cell>1,484.60</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>5,081.30</cell><cell>0.00</cell><cell>6,406.80</cell><cell>0.00</cell><cell>178.00</cell><cell>0.00</cell><cell>3,868.70</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>1,468.60</cell><cell>0.00</cell><cell>1,839.00</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>373.40</cell><cell>0.00</cell><cell>10.10</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>11.80</cell><cell>0.00</cell><cell>100,578.00</cell><cell>0.00</cell><cell>23.10</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell><cell>10.80</cell><cell>0.00</cell><cell>98.50</cell><cell>0.00</cell><cell>0.00</cell><cell>0.00</cell></row></rows>";

		ExcelExporter exporter = new ExcelExporter(new File("C:/a.xls"),xml);
		exporter.setTitle("统计方案");
		exporter.setHeader(header);

		ArrayList<String> list =new ArrayList<String>();

		String str = "";
		for(int i=0;i<259;i++){
			str = "2,";
			list.add(str);
		//	(types)
		}
		String[] strings = new String[list.size()];
		String[] a =list.toArray(strings);

//		exporter.setTypes("0,0,1,2".split(","));
		exporter.setTypes(a);
		exporter.writeWorkBook();
	}
}
