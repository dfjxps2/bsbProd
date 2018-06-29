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
		String[] header = new String[]{"指标,#cspan,#cspan,时点余额,月均余额,年均余额","第一级,第二级,第三级,#rspan,#rspan,#rspan"};
		String xml = "<?xml version=\"1.0\" encoding=\"utf-8\"?><rows><head><column width=\"120\" type=\"ro\" align=\"center\">指标</column><column width=\"120\" type=\"ro\" align=\"center\">时点余额</column><column width=\"120\" type=\"ro\" align=\"center\">月均余额</column><column width=\"120\" type=\"ro\" align=\"right\">年均余额</column></head><row id=\"root_cust_service\"><cell rspan=\"4\" cspan=\"1\">总揽</cell><cell rspan=\"2\" cspan=\"1\">客户</cell><cell rspan=\"1\" cspan=\"1\">客户服务</cell><cell></cell></row><row id=\"root_cust_vip\"><cell></cell><cell></cell><cell rspan=\"1\" cspan=\"1\">VIP服务</cell><cell></cell></row><row id=\"root_zl_ye\"><cell></cell><cell rspan=\"2\" cspan=\"1\">战略</cell><cell rspan=\"1\" cspan=\"1\">余额</cell><cell></cell></row><row id=\"root_zl_yj\"><cell></cell><cell></cell><cell rspan=\"1\" cspan=\"1\">月均</cell><cell></cell></row></rows>";
		ExcelExporter exporter = new ExcelExporter(new File("C:/a.xls"),xml);
		exporter.setTitle("测试标题");
		exporter.setHeader(header);
		exporter.setTypes("0,0,1,2".split(","));
		exporter.writeWorkBook();
	}
}
