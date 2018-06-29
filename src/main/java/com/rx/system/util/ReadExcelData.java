/*
 * Created on 2005-4-16
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
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
 * @author Administrator
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
@SuppressWarnings("unchecked")
public class ReadExcelData {
	
	String fileName = null;
	String sheetName = null;
	int sheetIndex;
	Workbook wb = null;
	
	/**
	 * 构造方法 只给出文件名 默认为第一个表单
	 * 
	 * @param fileName
	 */
	public ReadExcelData(String fileName) {
		this.fileName = fileName;
	}

	/**
	 * 构造方法 给出文件名及表单名
	 * 
	 * @param fileName
	 */
	public ReadExcelData(String fileName, String sheetName) {
		this.fileName = fileName;
		this.sheetName = sheetName;
	}

	/**
	 * 构造方法 给出文件名及表单位置
	 * 
	 * @param fileName
	 */
	public ReadExcelData(String fileName, int sheetIndex) {
		this.fileName = fileName;
		this.sheetIndex = sheetIndex;
	}

	/**
	 * 得到指定Excel文件中的所有表单中的数据 返回一个list 
	 * 其中的每一项是一个表单的数据 用二维数组存放
	 * @return
	 */
	public List getAllSheetData(){
		List list = null;
		File file = new File(this.fileName);	
		try {
			
			this.wb = Workbook.getWorkbook(file);
			int sheetNum = wb.getNumberOfSheets();
			list = new ArrayList(sheetNum);
			/**
			Sheet[] sheets = wb.getSheets();
			for(int i = 0; i < sheets.length; i++) {
				String[][] data = null;
				Sheet sheet = sheets[i];
				data = getSheetData(sheet);
				list.add(data);
			}
			**/
			for(int i = 0; i < sheetNum; i++) {
				String[][] data = null;
				Sheet sheet = wb.getSheet(i);
				data = getSheetData(sheet);
				list.add(data);
			}

		} catch (BiffException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		return list;
	}

	/**
	 * 得到单个表单的数据 放在二维数组中返回
	 * 
	 * @param sheet
	 * @return
	 */
	private String[][] getSheetData(Sheet sheet) {
		
		String[][] data = null;
		int rowNum = sheet.getRows();
		data = new String[rowNum][];
		
		for(int i = 0; i < rowNum; i++) {
			Cell[] cells = sheet.getRow(i);
			int cellNum = cells.length;
			data[i] = new String[cellNum];
			for(int j = 0; j < cellNum; j++) {
				Cell cell = cells[j];
				data[i][j] = cell.getContents();
			}
		}
		
		return data;
	}
	/**
	 * 此方法返回Excel中单个表单的数据
	 * 如果没有指定表单名或第几个表单时，则默认为Excel中的第一张表单
	 * 
	 * @return
	 */
	public String[][] getAppointSheetData() {
		return getAppointSheetData(false);
	}
	/**
	 * 
	 * @param flag 是否去空行
	 * @return
	 */
	public String[][] getAppointSheetData(boolean flag) {
		String[][] data = null;
		File file = new File(this.fileName);
		try {
			
			this.wb = Workbook.getWorkbook(file);
			Sheet sheet = null;
			if(this.sheetName == null || "".equals(this.sheetName.trim())) {
				sheet = wb.getSheet(this.sheetIndex);
			} else {
				sheet = wb.getSheet(sheetName);
			}
			if(flag)
				data = getSheetData(sheet,flag);
			else
				data = getSheetData(sheet);
			
		} catch (BiffException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		return data;
	}
	 
	/**
	 * 得到单个表单的数据 放在二维数组中返回
	 * 2012.6.16 龚知杨新增，空行过滤
	 * @param sheet
	 * @param 是否去空行
	 * @return
	 */
	private String[][] getSheetData(Sheet sheet,boolean flag) {
		
		String[][] data = null;
		int rowNum = sheet.getRows();
		
		int len = 0;
		List tempList=new ArrayList();
		for(int i = 0; i < rowNum; i++) {
			Cell[] cells = sheet.getRow(i);
			if(cells.length>0&&cells[0]!=null&&!"".equals(cells[0].getContents().trim())){
				len++;
				tempList.add(getRowArray(cells));
			}
		}
		data = new String[len][];
		
		for(int i = 0; i < len; i++) {
			data[i] = (String[])tempList.get(i);
		}
		
		return data;
	}
	/**
	 * 获取一行cells转换为数组
	 * @param cells
	 * @return
	 */
	public String [] getRowArray(Cell[] cells){
		int cellNum = cells.length;
		String data[]=new  String[cellNum];
		for(int j = 0; j < cellNum; j++) {
			Cell cell = cells[j];
			data[j] = cell.getContents();
		}
		return data;
	}
	
	/**
	 * 此方法返回Excel中单个表单的数据 
	 * 如果没有指定表单名或第几个表单时，则默认为Excel中的第一张表单
	 * 
	 * 模板导出后导入专用
	 * @return
	 */
	public String[][] getModelInSheetData() {
		String[][] data = null;
		File file = new File(this.fileName);
		try {

			this.wb = Workbook.getWorkbook(file);
			Sheet sheet = null;
			if (this.sheetName == null || "".equals(this.sheetName.trim())) {
				sheet = wb.getSheet(this.sheetIndex);
			} else {
				sheet = wb.getSheet(sheetName);
			}
			data=getModelSheetData(sheet);
		} catch (BiffException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}

		return data;
	}
	
	/**
	 * 模板导出后导入中专用
	 * 
	 * 得到单个表单的数据 放在二维数组data中,返回导入行 index；所有数据进数组，不验证null
	 * @param sheet
	 * @return
	 */
	private String[][] getModelSheetData(Sheet sheet,int header) {
		int rowNum = 0;
		int index=0;
		String[][] data = null;
		for (int i = header; i < sheet.getRows(); i++) {
			Cell[] cells = sheet.getRow(i);
			
			if(cells.length<=1)
				continue;
		 
			if(isNullRow(cells)&&index==0){
				index=i;
				continue;
			}else if(isNullRow(cells))
				continue;
			
			rowNum++;
		}
		data = new String[rowNum][];
		
		for (int i = 1, k = 0; i < sheet.getRows(); i++) {
			Cell[] cells = sheet.getRow(i);

			if(isNullRow(cells)||index==i) continue;
		 
			int cellNum = cells.length;
			data[k] = new String[cellNum];
			for (int j = 0; j < cellNum; j++) {
				Cell cell = cells[j];
				data[k][j] = cell.getContents();
			}
			k++;
		}
		//EpmMeasurePlanDAO.beginIndex=index-header;
		return data;
	}
	
	private boolean isNullRow(Cell[] cells){
		for (int i = 0; i < cells.length; i++) {
			if(isNotNull(cells[i].getContents())) return false;
		}
		return true;
	}
	
	private boolean isNotNull(String obj){
		return obj!=null&&!obj.trim().equals("");
	}
	/**
	 * 默认1行表头，返回data[][] 时，去掉表头
	 */
	private String[][] getModelSheetData(Sheet sheet) {
		return getModelSheetData(sheet,1);
	}
}
