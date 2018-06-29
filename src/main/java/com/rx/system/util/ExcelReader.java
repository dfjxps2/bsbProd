package com.rx.system.util;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import jxl.Cell;
import jxl.Sheet;
import jxl.Workbook;
import jxl.read.biff.BiffException;

/**
 * 工具类
 * 获取Excel中的数据
 * @author chenxd
 *
 */
public class ExcelReader {
	
	private String fileName = null;//文件名
	
	private Workbook workbook = null;
	
	/**
	 * 构造方法  传入文件名
	 */
	public ExcelReader(String fileName) {
		this.fileName = fileName;
	}
	
	
	/**
	 * 获取Excel数据
	 * 默认获取第一张Sheet页,从第0行开始
	 */
	public void getAppointSheetData() {
		this.getAppointSheetData(0);
	}
	
	public void getAppointSheetData(int i) {
		this.getAppointSheetData(i, 0);
	}
	
	public String[][] getAppointSheetData(int i, int start) {
		String[][]  data = null;
		try {
			this.workbook = Workbook.getWorkbook(new File(this.fileName));
			data = this.getSheetDataWithOutBlank(this.workbook, i, start);
		} catch (BiffException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}finally{
			this.workbook.close();
		}
		
		return data;
	}
	
	/**
	 * 获取第i个表单页的数据
	 * @param workbook
	 * @param i	表单页序号
	 * @param start 开始行
	 * @return
	 */
	public String[][] getSheetData(Workbook workbook, int i, int start) {
		Sheet sheet = workbook.getSheet(i);
		int rowNum = sheet.getColumns();
		
		String[][] data = new String[rowNum - start][];
		
		for (int j = start; j < rowNum; j++) {
			data[j] = this.getRow(sheet, j);
		}
		
		return data;
	}
	
	/**
	 * 获取第i个表单页非空行的数据
	 * @param workbook
	 * @param i 表单页序号
	 * @param start 开始行
	 * @return
	 */
	public String[][] getSheetDataWithOutBlank(Workbook workbook, int i, int start) {
		Sheet sheet = workbook.getSheet(i);
		int rowNum = sheet.getColumns();
		
		List<String[]> tempList = new ArrayList<String[]>();//临时
		
		for (int j = start; j < rowNum; j++) {
			Cell[] row = sheet.getRow(j);
			if(row != null && row.length > 0 && !row[0].getContents().toString().trim().equals("")) {
				tempList.add(this.getRow(sheet, j));
			}
		}
		
		String[][] data = new String[tempList.size()][];
		
		for (int j = 0; j < tempList.size(); j++) {
			data[j] = tempList.get(j);
		}
		
		return data;
	}
	
	
	/**
	 * 获取行的单元格数据
	 * @param sheet
	 * @param i
	 * @return
	 */
	protected String[] getRow(Sheet sheet, int i) {
		Cell[] cells = sheet.getRow(i);
		
		String[] values = new String[cells.length];
		
		for (int j = 0; j < cells.length; j++) {
			values[i] = cells[j].getContents();
		}
		
		return values;
	}
	
}
