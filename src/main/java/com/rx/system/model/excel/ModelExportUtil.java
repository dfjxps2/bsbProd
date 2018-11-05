package com.rx.system.model.excel;

import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.Graphics;
import java.awt.Rectangle;
import java.awt.image.BufferedImage;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.swing.JComponent;
import javax.swing.JLabel;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFDataFormat;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.hssf.util.Region;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.Element;


@SuppressWarnings("unchecked")
public class ModelExportUtil {
	/**
	 * 生成EXCEL工作�?
	 * @param tableHeader EXCEL表头字符�?,例如�? 
	 * 产品,余额,#cspan,#cspan,日均,#cspan,#cspan,借记卡发卡量,#cspan,#cspan,借记卡消费额,#cspan,#cspan,贷记卡发卡量,#cspan,#cspan,贷记卡消费额,#cspan,#cspan;
	 * #rspan,上期�?,计划增长比例,本期计划,上期�?,计划增长比例,本期计划,上期�?,计划增长比例,本期计划,上期�?,计划增长比例,本期计划,上期�?,计划增长比例,本期计划,上期�?,计划增长比例,本期计划

	 * @param tableColumnAlign 各列对齐方式,例如�?  
	 * left,right,right,right,right,right,right,right,right,right,right,right,right,right,right,right,right,right,right

	 * @param tableInitCellWidth 各列宽度,例如�?
	 * 178,98,98,98,98,98,98,98,98,98,98,98,98,98,98,98,98,98,98
	 * @param tableData EXCEL数据，XML格式,例如�?
	 * <pre> 
	 * <?xml version="1.0"?>
	 *	<rows>
	 *	<row id='02'><cell>公司客户定期存款</cell><cell>40,000,000</cell><cell></cell><cell></cell><cell>40,000,000</cell><cell>-34.4%</cell><cell>26,250,000</cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell></row>
	 *	<row id='03'><cell>公司客户通知存款</cell><cell>50,000,000</cell><cell></cell><cell></cell><cell>50,000,000</cell><cell>-97.3%</cell><cell>1,341,028</cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell></row>
	 *	<row id='04'><cell>应解汇款及临时存�?</cell><cell>712,053</cell><cell>244.5%</cell><cell>2,453,253</cell><cell>708,677</cell><cell>-77.3%</cell><cell>160,635</cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell></row>
	 *	<row id='05'><cell>保证金（不含承兑保证金）</cell><cell>19,042,050</cell><cell>18.3%</cell><cell>22,523,523</cell><cell>19,041,089</cell><cell>-52.9%</cell><cell>8,973,500</cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell></row>
	 *	<row id='06'><cell>短期信用贷款</cell><cell>0</cell><cell></cell><cell></cell><cell>117,857</cell><cell>129.1%</cell><cell>270,000</cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell></row>
	 *	<row id='07'><cell>短期保证贷款</cell><cell>67,300,000</cell><cell>-47.0%</cell><cell>35,653,576</cell><cell>66,610,714</cell><cell>-100.0%</cell><cell>12,500</cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell></row>
	 *	<row id='08'><cell>短期抵押质押贷款</cell><cell>40,000,000</cell><cell></cell><cell></cell><cell>45,714,286</cell><cell>-20.4%</cell><cell>36,375,000</cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell></row>
	 *	<row id='09'><cell>中长期信用贷�?</cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell></row>
	 *	<row id='10'><cell>中长期保证贷�?</cell><cell>0</cell><cell></cell><cell>312,343</cell><cell>0</cell><cell></cell><cell>36,285</cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell></row>
	 *	<row id='107'><cell>不良�?(�?�?)</cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell></row>
	 *	</rows>
	 * </pre>
	 * @param tableTitle EXCEL标题,例如�?"经营计划填报-产品计划" 
	 * @return
	 */
	public static HSSFWorkbook getWorkBook(String tableHeader,String tableColumnAlign,String tableInitCellWidth,String tableData,String tableTitle,String tableTitleHelp,String flag) {
		try{
			//表格各列对齐方式
			String[] tableColumnAlignArray = tableColumnAlign.split(",");
			//各列宽度
			String[] tableInitCellWidthArray = tableInitCellWidth.split(",");
			//表头字符串数�?
			String[][] tableHeaderArray = getTableHeaderArray(tableHeader,tableColumnAlignArray.length);
			//表格数据
			List dataCellTextList = getDataCellTextList(tableData);
			
			//表头帮助
			String [] tableHelp = new String[1];
			int tbsize=5;
			if(tableTitleHelp == null){
				tableHelp = null;
				tbsize = 1;
			}else{
				tableHelp=tableTitleHelp.split(",");
				
			}
//			int tbsize=3;
			if(tableTitleHelp != null && tableHelp.length>0){
				tbsize=tableHelp.length+1;
			}
			
			//创建新的Excel 工作�?
			HSSFWorkbook workbook = new HSSFWorkbook();
			HSSFSheet sheet = workbook.createSheet();//在Excel工作簿中建一工作表，其名为缺省�??
//			workbook.setSheetName(0, tableTitle,HSSFWorkbook.ENCODING_UTF_16);//设置中文支持
			
			//设置列宽
			for(int i=0;i<tableInitCellWidthArray.length;i++){			
				sheet.setColumnWidth((short)i, (short)(Integer.parseInt(tableInitCellWidthArray[i])*40));
			}
			
			//创建报表主标题行	
			HSSFRow row = sheet.createRow((short)0);		
			int mergedRegionNum=sheet.addMergedRegion(new Region(0,(short)(0),0,(short)(tableColumnAlignArray.length-1)));
			sheet.getMergedRegionAt(mergedRegionNum);//主标题行合并
			HSSFCell cell=row.createCell((short)0);
			
			//报表主标题单元格字体
			HSSFFont font = workbook.createFont();//字体
			//font.setColor(HSSFFont.COLOR_NORMAL);
			font.setFontHeightInPoints((short)14);
			//font.setFontName("黑体");
			font.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
			//font.setItalic(true);
			//font.setStrikeout(false);
			//font.setTypeOffset(HSSFFont.SS_SUB);
			//font.setUnderline(HSSFFont.U_NONE);
			
			//报表主标题单元格样式
			HSSFCellStyle cs = workbook.createCellStyle();
			cs.setFont(font);
			cs.setAlignment(HSSFCellStyle.ALIGN_CENTER);
			//cs.setDataFormat(HSSFDataFormat.getFormat("m/d/yy h:mm"));//设置cell样式为定制的日期格式
			//setBorderStyle(cs);//设置单元格边框样�?
			//cs.setLocked(true);//设置锁定状�??	
			
			cell.setCellStyle(cs);//挷定样式到单元格			
			//单元格类�?
			cell.setCellType(HSSFCell.CELL_TYPE_STRING);
			//设置为中文字�?,应该放在setCellValue方法之前
//			cell.setEncoding(HSSFWorkbook.ENCODING_UTF_16);
			//给单元格赋�??
			cell.setCellValue(tableTitle);
			//cell.setCellValue(new Date());
			
			/*sheet.createRow(1);//创建报表主标题隔�?
			sheet.createRow(2);//创建报表导出信息�?
			sheet.createRow(3);	*/
			for (int i = 0; tableTitleHelp != null && i < tableHelp.length; i++) {
				row =sheet.createRow(i+1);//创建报表主标题隔�?
				int hmergedRegionNum=sheet.addMergedRegion(new Region(i+1,(short)(0),i+1,(short)(tableColumnAlignArray.length-1)));
				sheet.getMergedRegionAt(hmergedRegionNum);//主标题行合并
				
				HSSFCell headerCell2 = row.createCell((short)0);
				HSSFFont headerFont2 = workbook.createFont();								
				headerFont2.setFontHeightInPoints((short)10);
				HSSFCellStyle headerCs2 = workbook.createCellStyle();													
				headerCs2.setFont(headerFont2);//设置字体									
				headerCs2.setAlignment(HSSFCellStyle.ALIGN_LEFT);//水平对齐方式
				headerCs2.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);//垂直对齐方式
				headerCs2.setFillForegroundColor(HSSFColor.GREY_25_PERCENT.index);//设置单元格显示颜�?
				//headerCs2.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
				setBorderStyle(headerCs2);//设置单元格边框样�?
				
				headerCell2.setCellStyle(headerCs2);//挷定样式到单元格	
				headerCell2.setCellType(HSSFCell.CELL_TYPE_STRING);//单元格类�?
//				headerCell2.setEncoding(HSSFWorkbook.ENCODING_UTF_16);//设置为中文字�?,应该放在setCellValue方法之前
				headerCell2.setCellValue(getHelpMap().get(tableHelp[i]).toString());//赋�??		 
				
			}
 
			//生成EXCEL表头单元�?
			for(int i=0;i<tableHeaderArray.length;i++){
				row = sheet.createRow((short)i+tbsize);//创建报表表头�?		
				 
				for(int j=0;j<tableHeaderArray[i].length;j++){
					//创建报表表头单元�?
					HSSFCell headerCell2 = row.createCell((short)j);	
					
					//设置报表表头单元格字�?												
					HSSFFont headerFont2 = workbook.createFont();								
					headerFont2.setFontHeightInPoints((short)10);
					//headerFont2.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
					
					//设置报表表头单元格样�?
					HSSFCellStyle headerCs2 = workbook.createCellStyle();													
					headerCs2.setFont(headerFont2);//设置字体									
					headerCs2.setAlignment(HSSFCellStyle.ALIGN_CENTER);//水平对齐方式
					headerCs2.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);//垂直对齐方式
					headerCs2.setFillForegroundColor(HSSFColor.GREY_25_PERCENT.index);//设置单元格显示颜�?
					headerCs2.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
					setBorderStyle(headerCs2);//设置单元格边框样�?
					
					headerCell2.setCellStyle(headerCs2);//挷定样式到单元格	
					headerCell2.setCellType(HSSFCell.CELL_TYPE_STRING);//单元格类�?
//					headerCell2.setEncoding(HSSFWorkbook.ENCODING_UTF_16);//设置为中文字�?,应该放在setCellValue方法之前
					headerCell2.setCellValue(tableHeaderArray[i][j]);//赋�??		 
				}
				
				//处理报表表头的单元格合并
				//short firstCellNum=sheet.getRow(i+3).getFirstCellNum();//第一个单元格编号
		    	short lastCellNum=sheet.getRow(i+tbsize).getLastCellNum();//�?后一个单元格编号
//		    	int startCellNum = 1;
		    	int endCellNum = 1;
		    	for(int j=0;j<=lastCellNum;j++){
		    		String startCellValue=sheet.getRow(i+tbsize).getCell((short)j).getStringCellValue();//当前单元格的�?
		    		//System.out.println(startCellValue);
		    		String endCellValue=null;
		    		if(j==lastCellNum){
		    			endCellValue=sheet.getRow(i+tbsize).getCell((short)(j)).getStringCellValue();//相邻单元格的�?
		    		}else{
		    			endCellValue=sheet.getRow(i+tbsize).getCell((short)(j+1)).getStringCellValue();//相邻单元格的�?
		    		}
		    		
		    		if("#cspan".equals(endCellValue)&&j<lastCellNum){
		    			endCellNum ++;		    
		    			sheet.getRow(i+tbsize).getCell((short)(j+1)).setCellValue("");
		    		}else{
//		    			mergedRegionNum=sheet.addMergedRegion(new Region(i+tbsize,(short)(startCellNum),i+tbsize,(short)endCellNum));
//						sheet.getMergedRegionAt(mergedRegionNum);
//						startCellNum = j+1;
//						endCellNum = j+1;						
		    		}
		    		if("#rspan".equals(startCellValue)){
//						mergedRegionNum=sheet.addMergedRegion(new Region(i+tbsize-1,(short)j,i+tbsize,(short)j));
//						sheet.getMergedRegionAt(mergedRegionNum);
						sheet.getRow(i+tbsize).getCell((short)j).setCellValue("");
					}
		    		
		    	}
		    	
//		    	mergedRegionNum=sheet.addMergedRegion(new Region(i+tbsize,(short)(startCellNum),i+tbsize,(short)endCellNum));
//				sheet.getMergedRegionAt(mergedRegionNum);
//				处理表头的列合并				
		    	String cols = getCols(tableHeaderArray[i],"#cspan") ;
				if(cols.length() > 0){
				String [] colsArr = cols.split(";") ;
				for(int k=0;k<colsArr.length;k++){
					String [] subColsArr = colsArr[k].split(":") ;
					short fromColumn = (short)(Integer.parseInt(subColsArr[0])-1);
					short toColumn = (short)(Integer.parseInt(subColsArr[1])) ;
					int fromRow = i+tbsize;
					int toRow = i+tbsize;
					
					Region region = new Region();
					region.setColumnFrom(fromColumn) ;
					region.setColumnTo(toColumn) ;
					region.setRowFrom(fromRow) ;
					region.setRowTo(toRow) ;
//					sheet.addMergedRegion(new Region(fromRow,fromColumn,toRow,toColumn));
					sheet.addMergedRegion(region) ;
				 }
				}
				
			}
//			处理表头的行合并
			String rows = getRows(tableHeaderArray,"#rspan") ;
			if(rows.length() > 0){
				String [] rowsArr = rows.split(";") ;
				for(int k=0;k<rowsArr.length ;k++){
					String [] subRowsArr = rowsArr[k].split(":") ;
					short fromColumn = (short)(Integer.parseInt(subRowsArr[2])) ;
					short toColumn = (short)(Integer.parseInt(subRowsArr[2])) ;
					int fromRow = Integer.parseInt(subRowsArr[0]) + tbsize - 1 ;
					int toRow = Integer.parseInt(subRowsArr[1]) + tbsize;
					Region region = new Region();
					region.setColumnFrom(fromColumn) ;
					region.setColumnTo(toColumn) ;
					region.setRowFrom(fromRow) ;
					region.setRowTo(toRow) ;
					sheet.addMergedRegion(region) ;
				}
			}
			
			//生成数据单元�?
			for(int i=0;i<dataCellTextList.size();i++){
				List rowTextList = (List)dataCellTextList.get(i);//获得行数�?
				row = sheet.createRow((short)i+tableHeaderArray.length+tbsize);//创建数据�?
				int rownum=(short)i+tableHeaderArray.length+tbsize;
				 
				List rowspanList=(List)rowTextList.get(rowTextList.size()-2);
				List colspanList=(List)rowTextList.get(rowTextList.size()-1);
				//行合并单元格
				for (int k = 0; k < rowspanList.size(); k++) {
					String rnum=(String)rowspanList.get(k);
					if(rnum!=null&&!rnum.equals("")&&!rnum.equals("null")){
						int innum=Integer.parseInt(rnum);
						mergedRegionNum=sheet.addMergedRegion(new Region(rownum,(short)k,rownum+innum-1,(short)k));
						sheet.getMergedRegionAt(mergedRegionNum);
					}
				}
				//列合并单元格
				for (int k = 0; k < colspanList.size(); k++) {
					String rnum=(String)colspanList.get(k);
					if(rnum!=null&&!rnum.equals("")&&!rnum.equals("null")){
						int innum=Integer.parseInt(rnum);
						mergedRegionNum=sheet.addMergedRegion(new Region(rownum,(short)k,rownum,(short)(k+innum-1)));
						sheet.getMergedRegionAt(mergedRegionNum);
					}
				}
				
				 
				for(int j=0;j<rowTextList.size()-2;j++){	 
					HSSFCell dataCell = row.createCell((short)j);//创建单元�?
					String cellValue=(String)rowTextList.get(j);
					cellValue=cellValue.replaceAll(",", "");
					
					//设置字体
					//HSSFFont dataFont = workbook.createFont();
					//dataFont.setFontHeightInPoints((short) 10);
					//dataFont.setFontName("黑体");
					
					//设置单元格样�?			
					//HSSFCellStyle dataCs = workbook.createCellStyle();
					//HSSFCellStyle dataCs=ExportDataUtil.getDataStyle(workbook, tableColumnAlignArray[j], cellValue, "border", "");
					//dataCs.setFont(dataFont);//设置字体									
					//dataCs.setAlignment(getCellAlign(tableColumnAlignArray[j]));//水平对齐方式
					//dataCs.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);//垂直对齐方式		
					//dataCs.setDataFormat(workbook.createDataFormat().getFormat("#,##0.000000"));  //自定义格式，显示六位小数
					
					//setBorderStyle(dataCs);//设置单元格边框样�?
					
					
					//设置单元格数据格�?
					if(getCellAlign(tableColumnAlignArray[j])==HSSFCellStyle.ALIGN_LEFT||getCellAlign(tableColumnAlignArray[j])==HSSFCellStyle.ALIGN_CENTER){
						HSSFCellStyle dataCs=ModelExportUtil.getDataStyle(workbook, workbook.toString(), "cell000");
						dataCs.setDataFormat(HSSFDataFormat.getBuiltinFormat("@"));
						setBorderStyle(dataCs);//设置单元格边框样�?
						
						dataCell.setCellStyle(dataCs);//挷定样式到单元格
						dataCell.setCellType(HSSFCell.CELL_TYPE_STRING);
//						dataCell.setEncoding(HSSFWorkbook.ENCODING_UTF_16);//设置为中文字�?,应该放在setCellValue方法之前
						dataCell.setCellValue(cellValue);//赋�??	
					}else if(getCellAlign(tableColumnAlignArray[j])==HSSFCellStyle.ALIGN_RIGHT){
						dataCell.setCellType(HSSFCell.CELL_TYPE_NUMERIC);
						
						
						cellValue=StringUtil.isNullString(cellValue)?"0":cellValue;
						double temp=Double.parseDouble(cellValue.replaceAll("%", ""));
						HSSFCellStyle dataCs=null;
						if(cellValue.endsWith("%")){
							dataCs=ModelExportUtil.getDataStyle(workbook, workbook.toString(), "cell100");
							setBorderStyle(dataCs);//设置单元格边框样�?
							
							//dataCs.setDataFormat(HSSFDataFormat.getBuiltinFormat("0.00%"));//百分�?
							dataCell.setCellValue(temp/100);//赋�??	
							dataCell.setCellStyle(dataCs);//挷定样式到单元格
						}else if(cellValue.matches("^(-?\\d+)(\\.\\d+)$")){
							dataCs=ModelExportUtil.getDataStyle(workbook,  workbook.toString(), "cell200");
							setBorderStyle(dataCs);//设置单元格边框样�?
							//dataCs=ExportDataUtil.getDataStyle(workbook, tableColumnAlignArray[j], cellValue, "cell","cell200");
							//dataCs.setDataFormat(HSSFDataFormat.getBuiltinFormat("#,##0.00"));//两位小数
							dataCell.setCellValue(temp);//赋�??	
							dataCell.setCellStyle(dataCs);//挷定样式到单元格
						}else if(cellValue.matches("^-?\\d+$")){
							dataCs=getDataStyle(workbook,  workbook.toString(), "cell300");
							setBorderStyle(dataCs);//设置单元格边框样�?
							
							//dataCs.setDataFormat(HSSFDataFormat.getBuiltinFormat("#,##0"));//整数
							//dataCell.setCellValue(Integer.parseInt(cellValue));//赋�??
							dataCell.setCellValue(Long.parseLong(cellValue));//赋�??
							dataCell.setCellStyle(dataCs);//挷定样式到单元格
						}
						
					}
					//dataCell.setCellStyle(dataCs);//挷定样式到单元格
					//dataCell.setCellType(HSSFCell.CELL_TYPE_STRING);//单元格类�?
					//dataCell.setEncoding(HSSFWorkbook.ENCODING_UTF_16);//设置为中文字�?,应该放在setCellValue方法之前
					//dataCell.setCellValue((String)rowTextList.get(j));//赋�??	
					
				}		
			}
			
			return  workbook;
		}catch(Exception e){
			e.printStackTrace();
			return null;
		}finally{
			HSSFMAP.clear();
		}
	}
	
	public static Map getHelpMap(){
		Map map=new HashMap();
		map.put("help", "说明:");
		map.put("bank1", "1)无需分配的客户记录请在本Excel文件删除");
		map.put("bank2", "2)只可填写表格中的管辖客户经理和生效日期两列，其它列为分配依据指标，请不要作修改。生效日期输入格式为：YYYY-MM-DD （如：2100-12-31）");
		map.put("bank3", "3)在输入空白列之前，请先修改该列单元格格式为文本格式");
		
		return map;
	}
	
	//�?个HSSFWorkbook 公用的样�?
	private static Map HSSFMAP=new HashMap();
	@SuppressWarnings("unused")
	public static HSSFCellStyle getDataStyle(HSSFWorkbook workbook,String key1,String key2){
		HSSFCellStyle dataCs = null;
		Map smap=null;
		if(HSSFMAP.containsKey(key1)){
			return (HSSFCellStyle)((Map)HSSFMAP.get(key1)).get(key2);
		}else{
			dataCs = workbook.createCellStyle();
			smap=new HashMap();
			
			HSSFCellStyle dataCs1=workbook.createCellStyle();
			dataCs1.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);//垂直对齐方式	
			dataCs1.setAlignment(HSSFCellStyle.ALIGN_LEFT);//水平对齐方式
			smap.put("cell000", dataCs1);
			
			HSSFCellStyle dataCs2=workbook.createCellStyle();
			dataCs2.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);//垂直对齐方式	
			dataCs2.setAlignment(HSSFCellStyle.ALIGN_RIGHT);//水平对齐方式
			dataCs2.setDataFormat(HSSFDataFormat.getBuiltinFormat("0.00%"));//百分�?
			smap.put("cell100", dataCs2);
			
			HSSFCellStyle dataCs3=workbook.createCellStyle();
			dataCs3.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);//垂直对齐方式	
			dataCs3.setAlignment(HSSFCellStyle.ALIGN_RIGHT);//水平对齐方式
			dataCs3.setDataFormat(HSSFDataFormat.getBuiltinFormat("#,##0.00"));//两位小数 
			smap.put("cell200", dataCs3);
			
			HSSFCellStyle dataCs4=workbook.createCellStyle();
			dataCs4.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);//垂直对齐方式	
			dataCs4.setAlignment(HSSFCellStyle.ALIGN_RIGHT);//水平对齐方式
			dataCs4.setDataFormat(HSSFDataFormat.getBuiltinFormat("#,##0"));//整数
			smap.put("cell300", dataCs4);
			
			//dataCs5样式---货币格式且水平居左对齐 added by chj@20110831
			HSSFCellStyle dataCs5=workbook.createCellStyle();
			dataCs5.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);//垂直对齐方式	
			dataCs5.setAlignment(HSSFCellStyle.ALIGN_LEFT);//水平对齐方式
			dataCs5.setDataFormat(HSSFDataFormat.getBuiltinFormat("#,##0.00"));//两位小数 
			smap.put("cell400", dataCs5);
			
			HSSFMAP.put(key1, smap);
		} 
		
		//System.out.println(" HSSFMAP:"+HSSFMAP+" work:"+workbook.toString());
		return (HSSFCellStyle)((Map)HSSFMAP.get(key1)).get(key2);
	}

	/**
	 * 解析 xml字符串tableData,生成表格数据
	 * @param tableData
	 * @return
	 */
	private static List getDataCellTextList(String tableData){		
		List dataCellTextList = new ArrayList(); 
		Document doc;
		try {	
			doc = DOM4JUtil.loadDocFromXMLString(tableData);//加裁xml字符串tableData
			Element root = doc.getRootElement();//定位到根节点	
			
			List rowElementList = root.selectNodes("row");//取第�?层的�?有行数据
			for(int i = 0;i < rowElementList.size();i++){//遍历第一层的�?有行数据
				Element rowElement=(Element)rowElementList.get(i);
				//System.out.println(rowElement.asXML());
				List rowCellElementList = rowElement.selectNodes("cell");//解析�?行的单元�?
				//将一行的数据放到rowTextList
				List rowTextList = new ArrayList(); 
				for(int j = 0;j < rowCellElementList.size();j++){
					Element cellElement=(Element)rowCellElementList.get(j);
					//String text = cellElement.attributeValue("text");
					String text = cellElement.getStringValue();
					rowTextList.add(null == text ? "" : text);
				}
				
				//行合并单元格设置
				List rowspanList=new ArrayList();
				for(int k=0;k<rowCellElementList.size();k++){
					Element cellElement=(Element)rowCellElementList.get(k);
					String rows=cellElement.attributeValue("rowspan");
					rowspanList.add(null==rows?"":rows);
				}
				rowTextList.add(rowspanList);
				
				//列合并单元格设置
				List colspanList=new ArrayList();
				for(int k=0;k<rowCellElementList.size();k++){
					Element cellElement=(Element)rowCellElementList.get(k);
					String rows=cellElement.attributeValue("colspan");
					colspanList.add(null==rows?"":rows);
				}
				rowTextList.add(colspanList);
				
				dataCellTextList.add(rowTextList);//将rowTextList存到dataCellTextList
				//该行的下�?级行数据
				//List subRowElementList = rowElement.selectNodes("row");
				getSubRowElementListData(dataCellTextList,rowElement);
			}
			
		} catch (DocumentException e) {
			e.printStackTrace();
		}
		
// 		for(int i = 0;i < dataCellTextList.size();i++){
// 			List rowTextList = (List)dataCellTextList.get(i);
// 			for(int j = 0;j < rowTextList.size();j++){
// 				System.out.print(rowTextList.get(j)+" ");
// 			}
// 			System.out.println("");
// 		}
		
		return dataCellTextList;
	}
	
	/**
	 * 处理下级节点的数�?
	 * @param dataCellTextList
	 * @param rowElement
	 */
	public static void getSubRowElementListData(List dataCellTextList,Element rowElement){
		List subRowElementList = rowElement.selectNodes("row");
		for(int i = 0;i < subRowElementList.size();i++){
			Element subRowElement=(Element)subRowElementList.get(i);
			String path = subRowElement.getPath();//取得当前节点的路�?
			List rowCellElementList = subRowElement.selectNodes("cell");//解析�?行的单元�?
			//将一行的数据放到rowTextList
			List rowTextList = new ArrayList(); 
			for(int j = 0;j < rowCellElementList.size();j++){
				Element cellElement=(Element)rowCellElementList.get(j);
				//String text = cellElement.attributeValue("text");
			 
				String text = cellElement.getStringValue();
				if(j==0){
					//根据节点嵌套的深度来添加缩进
					text = (null == text) ? "" : path.replaceAll("/rows/row/", "").replaceAll("row", "        ").replaceAll("/", "") + text;
					rowTextList.add(text);
				}else{
					rowTextList.add(null == text ? "" : text);
				}
			}
			
			//行合并单元格设置
			List rowspanList=new ArrayList();
			for(int k=0;k<rowCellElementList.size();k++){
				Element cellElement=(Element)rowCellElementList.get(k);
				String rows=cellElement.attributeValue("rowspan");
				rowspanList.add(null==rows?"":rows);
			}
			rowTextList.add(rowspanList);
			
			//列合并单元格设置
			List cospanList=new ArrayList();
			for(int k=0;k<rowCellElementList.size();k++){
				Element cellElement=(Element)rowCellElementList.get(k);
				String rows=cellElement.attributeValue("colspan");
				cospanList.add(null==rows?"":rows);
			}
			rowTextList.add(cospanList);
			
			dataCellTextList.add(rowTextList);//将rowTextList存到dataCellTextList
			getSubRowElementListData(dataCellTextList,subRowElement);//递归调用处理下级行数�?
		}		
	}
	
		
	/**
	 * 获取单元格的对齐样式
	 * @param cellAlign
	 * @return
	 */
	public static short getCellAlign(String cellAlign){
		if("left".equalsIgnoreCase(cellAlign)){
			return HSSFCellStyle.ALIGN_LEFT;
		}else if ("center".equalsIgnoreCase(cellAlign)){
			return HSSFCellStyle.ALIGN_CENTER;
		}else if ("right".equalsIgnoreCase(cellAlign)){
			return HSSFCellStyle.ALIGN_RIGHT;
		}else{
			return HSSFCellStyle.ALIGN_FILL;
		}
	}
	
	/**
	 * 设置单元格的边框样式
	 * @param cellStyle
	 */
	private static void setBorderStyle(HSSFCellStyle cellStyle) {
		cellStyle.setBorderBottom(HSSFCellStyle.BORDER_THIN);
		cellStyle.setBorderLeft(HSSFCellStyle.BORDER_THIN);
		cellStyle.setBorderTop(HSSFCellStyle.BORDER_THIN);
		cellStyle.setBorderRight(HSSFCellStyle.BORDER_THIN);
		cellStyle.setBottomBorderColor(HSSFColor.BLACK.index);
		cellStyle.setLeftBorderColor(HSSFColor.BLACK.index);
		cellStyle.setTopBorderColor(HSSFColor.BLACK.index);
		cellStyle.setRightBorderColor(HSSFColor.BLACK.index);
	}
	
	/**
	 * 把EXCEL工作簿写入到指定的文件路�?
	 * @param book
	 * @param filePath
	 * @throws IOException
	 */
	public static void writeExcelToFile(HSSFWorkbook book,String filePath) throws IOException{
		FileOutputStream fOut = new FileOutputStream(filePath);//新建�?输出文件�?
		book.write(fOut);// 把相应的Excel 工作簿存�?
		fOut.flush();// 操作结束，关闭文�?
		fOut.close();//关闭文件�?
	}
	
	/**
	 * 	使用poi的hssf生成�?个excel文件以后	有一个主类Workbook(相当于一个excel文件)的方�?
	 *	Workbook.write(OutputStream)可以写到response.getOutputStream()里面
	 *	如果事先设置response的contentType为excel和下载的附件名称就可下载excel
	 * @throws IOException 
	 */
	public static void writeExcelToResponse(HSSFWorkbook book,HttpServletRequest request, HttpServletResponse response) throws IOException{
		    if(book!=null)    {        
		    	response.setContentType ("application/ms-excel") ;        
		    	response.setHeader ("Content-Disposition" , "attachment;filename="+new String("导出Excel.xls".getBytes(),"iso-8859-1")) ;        
		    	OutputStream stream = response.getOutputStream();
		    	book.write(response.getOutputStream());  
		    	try {

					book.write(stream);
				} catch (Exception e) {
					
				} finally {
					if (stream != null) {
						try {
							stream.flush();
							stream.close();
						} catch (Exception e) {
							e.printStackTrace();
						}
					}
				}
		    }

	}
	
	public void writeExcelToResponse(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		HSSFWorkbook workbook = (HSSFWorkbook) request.getAttribute("workbook");

		response.setHeader("Content-Disposition", "attachment; filename=" + new String(workbook.getSheetName(0).getBytes(),"iso-8859-1") + ".xls");
		response.setContentType("application/x-download;charset=GB2312");
		OutputStream stream = response.getOutputStream();
		try {

			workbook.write(stream);
		} catch (Exception e) {
			
		} finally {
			if (stream != null) {
				try {
					stream.flush();
					stream.close();
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		}
	}

	
	/**
	 * 生成EXCEL工作�?
	 * @param tableHeader EXCEL表头字符�?,例如�? 
	 * 产品,余额,#cspan,#cspan,日均,#cspan,#cspan,借记卡发卡量,#cspan,#cspan,借记卡消费额,#cspan,#cspan,贷记卡发卡量,#cspan,#cspan,贷记卡消费额,#cspan,#cspan;
	 * #rspan,上期�?,计划增长比例,本期计划,上期�?,计划增长比例,本期计划,上期�?,计划增长比例,本期计划,上期�?,计划增长比例,本期计划,上期�?,计划增长比例,本期计划,上期�?,计划增长比例,本期计划

	 * @param tableColumnAlign 各列对齐方式,例如�?  
	 * left,right,right,right,right,right,right,right,right,right,right,right,right,right,right,right,right,right,right

	 * @param tableInitCellWidth 各列宽度,例如�?
	 * 178,98,98,98,98,98,98,98,98,98,98,98,98,98,98,98,98,98,98
	 * @param tableData EXCEL数据，XML格式,例如�? 
	 * <?xml version="1.0"?>
		<rows>
		<row id='02'><cell>公司客户定期存款</cell><cell>40,000,000</cell><cell></cell><cell></cell><cell>40,000,000</cell><cell>-34.4%</cell><cell>26,250,000</cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell></row>
		<row id='03'><cell>公司客户通知存款</cell><cell>50,000,000</cell><cell></cell><cell></cell><cell>50,000,000</cell><cell>-97.3%</cell><cell>1,341,028</cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell></row>
		<row id='04'><cell>应解汇款及临时存�?</cell><cell>712,053</cell><cell>244.5%</cell><cell>2,453,253</cell><cell>708,677</cell><cell>-77.3%</cell><cell>160,635</cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell></row>
		<row id='05'><cell>保证金（不含承兑保证金）</cell><cell>19,042,050</cell><cell>18.3%</cell><cell>22,523,523</cell><cell>19,041,089</cell><cell>-52.9%</cell><cell>8,973,500</cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell></row>
		<row id='06'><cell>短期信用贷款</cell><cell>0</cell><cell></cell><cell></cell><cell>117,857</cell><cell>129.1%</cell><cell>270,000</cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell></row>
		<row id='07'><cell>短期保证贷款</cell><cell>67,300,000</cell><cell>-47.0%</cell><cell>35,653,576</cell><cell>66,610,714</cell><cell>-100.0%</cell><cell>12,500</cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell></row>
		<row id='08'><cell>短期抵押质押贷款</cell><cell>40,000,000</cell><cell></cell><cell></cell><cell>45,714,286</cell><cell>-20.4%</cell><cell>36,375,000</cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell></row>
		<row id='09'><cell>中长期信用贷�?</cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell></row>
		<row id='10'><cell>中长期保证贷�?</cell><cell>0</cell><cell></cell><cell>312,343</cell><cell>0</cell><cell></cell><cell>36,285</cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell></row>
		<row id='107'><cell>不良�?(�?�?)</cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell><cell>0</cell><cell></cell><cell></cell></row>
		</rows>
	 * @param tableTitle EXCEL标题,例如：经营计划填�?-产品计划 
	 * @param exportHeader 导出信息,例如�? 机构:0201:日期:2009�?3�?6�?:单位:�?
	 * @return
	 */
	public static HSSFWorkbook getWorkBook(String tableHeader,String tableColumnAlign,String tableInitCellWidth,String tableData,String tableTitle,String exportHeader) {
		try{
			//表格各列对齐方式
			String[] tableColumnAlignArray = tableColumnAlign.split(",");
			//各列宽度
			String[] tableInitCellWidthArray = tableInitCellWidth.split(",");
			//表头字符串数�?
			String[][] tableHeaderArray = getTableHeaderArray(tableHeader,tableColumnAlignArray.length);
			//表格数据
			List dataCellTextList = getDataCellTextList(tableData);
			
			//创建新的Excel 工作�?
			HSSFWorkbook workbook = new HSSFWorkbook();
			HSSFSheet sheet = workbook.createSheet();//在Excel工作簿中建一工作表，其名为缺省�??
//			workbook.setSheetName(0, tableTitle,HSSFWorkbook.ENCODING_UTF_16);//设置中文支持
			
			//设置列宽
			for(int i=0;i<tableInitCellWidthArray.length;i++){			
				sheet.setColumnWidth((short)i, (short)(Integer.parseInt(tableInitCellWidthArray[i])*40));
			}
			
			//创建报表主标题行	
			HSSFRow row = sheet.createRow((short)0);		
			int mergedRegionNum=sheet.addMergedRegion(new Region(0,(short)(0),0,(short)(tableColumnAlignArray.length-1)));
			sheet.getMergedRegionAt(mergedRegionNum);//主标题行合并
			HSSFCell cell=row.createCell((short)0);
			
			//报表主标题单元格字体
			HSSFFont font = workbook.createFont();//字体
			//font.setColor(HSSFFont.COLOR_NORMAL);
			font.setFontHeightInPoints((short)14);
			//font.setFontName("黑体");
			font.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
			//font.setItalic(true);
			//font.setStrikeout(false);
			//font.setTypeOffset(HSSFFont.SS_SUB);
			//font.setUnderline(HSSFFont.U_NONE);
			
			//报表主标题单元格样式
			HSSFCellStyle cs = workbook.createCellStyle();
			cs.setFont(font);
			cs.setAlignment(HSSFCellStyle.ALIGN_CENTER);
			//cs.setDataFormat(HSSFDataFormat.getFormat("m/d/yy h:mm"));//设置cell样式为定制的日期格式
			//setBorderStyle(cs);//设置单元格边框样�?
			//cs.setLocked(true);//设置锁定状�??	
			
			cell.setCellStyle(cs);//挷定样式到单元格			
			//单元格类�?
			cell.setCellType(HSSFCell.CELL_TYPE_STRING);
			//设置为中文字�?,应该放在setCellValue方法之前
//			cell.setEncoding(HSSFWorkbook.ENCODING_UTF_16);
			//给单元格赋�??
			cell.setCellValue(tableTitle);
			//cell.setCellValue(new Date());
			
			sheet.createRow(1);//创建报表主标题隔�?
			sheet.createRow(2);//创建报表导出信息�?
			//生成报表导出信息行单元格
			String[] headerTextArray = exportHeader.split(":");
			for(int i=0;i<headerTextArray.length;i++){
				HSSFCell  headerCell= sheet.getRow(2).createCell((short)i);
				//设置字体
				HSSFFont headerFont = workbook.createFont();
				headerFont.setFontHeightInPoints((short) 10);
				
				//设置单元格样�?			
				HSSFCellStyle headerCs = workbook.createCellStyle();
				headerCs.setFont(headerFont);//设置字体									
				headerCs.setAlignment(HSSFCellStyle.ALIGN_CENTER);//水平对齐方式
				headerCs.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);//垂直对齐方式				
				
				headerCell.setCellStyle(headerCs);//挷定样式到单元格
				headerCell.setCellType(HSSFCell.CELL_TYPE_STRING);//单元格类�?
//				headerCell.setEncoding(HSSFWorkbook.ENCODING_UTF_16);//设置为中文字�?,应该放在setCellValue方法之前
				headerCell.setCellValue(i%2==0 ? headerTextArray[i]+"�?" : headerTextArray[i]);//赋�??
			}
			
			//生成EXCEL表头单元�?
			for(int i=0;i<tableHeaderArray.length;i++){
				row = sheet.createRow((short)i+3);//创建报表表头�?			
				for(int j=0;j<tableHeaderArray[i].length;j++){
					//创建报表表头单元�?
					HSSFCell headerCell2 = row.createCell((short)j);	
					
					//设置报表表头单元格字�?												
					HSSFFont headerFont2 = workbook.createFont();								
					headerFont2.setFontHeightInPoints((short)10);
					//headerFont2.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
					
					//设置报表表头单元格样�?
					HSSFCellStyle headerCs2 = workbook.createCellStyle();													
					headerCs2.setFont(headerFont2);//设置字体									
					headerCs2.setAlignment(HSSFCellStyle.ALIGN_CENTER);//水平对齐方式
					headerCs2.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);//垂直对齐方式
					headerCs2.setFillForegroundColor(HSSFColor.GREY_25_PERCENT.index);//设置单元格显示颜�?
					headerCs2.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
					setBorderStyle(headerCs2);//设置单元格边框样�?
					
					headerCell2.setCellStyle(headerCs2);//挷定样式到单元格	
					headerCell2.setCellType(HSSFCell.CELL_TYPE_STRING);//单元格类�?
//					headerCell2.setEncoding(HSSFWorkbook.ENCODING_UTF_16);//设置为中文字�?,应该放在setCellValue方法之前
					headerCell2.setCellValue(tableHeaderArray[i][j]);//赋�??						
				}
				
				//处理报表表头的单元格合并
				//short firstCellNum=sheet.getRow(i+3).getFirstCellNum();//第一个单元格编号
		    	short lastCellNum=sheet.getRow(i+3).getLastCellNum();//�?后一个单元格编号
		    	
		    	int startCellNum = 1;
		    	int endCellNum = 1;
		    	for(int j=0;j<=lastCellNum;j++){
		    		String startCellValue=sheet.getRow(i+3).getCell((short)j).getStringCellValue();//当前单元格的�?
		    		//System.out.println(startCellValue);
		    		String endCellValue=null;
		    		if(j==lastCellNum){
		    			endCellValue=sheet.getRow(i+3).getCell((short)(j)).getStringCellValue();//相邻单元格的�?
		    		}else{
		    			endCellValue=sheet.getRow(i+3).getCell((short)(j+1)).getStringCellValue();//相邻单元格的�?
		    		}
		    		
		    		if("#cspan".equals(endCellValue)&&j<lastCellNum){
		    			endCellNum ++;		    			
		    		}else{
		    			mergedRegionNum=sheet.addMergedRegion(new Region(i+3,(short)(startCellNum),i+3,(short)endCellNum));
						sheet.getMergedRegionAt(mergedRegionNum);
						startCellNum = j+1;
						endCellNum = j+1;						
		    		}
		    		if("#rspan".equals(startCellValue)){
						mergedRegionNum=sheet.addMergedRegion(new Region(i+2,(short)j,i+3,(short)j));
						sheet.getMergedRegionAt(mergedRegionNum);
					}
		    		
		    	}
		    	
		    	mergedRegionNum=sheet.addMergedRegion(new Region(i+3,(short)(startCellNum),i+3,(short)endCellNum));
				sheet.getMergedRegionAt(mergedRegionNum);
				
			}
			
			
			//生成数据单元�?
			for(int i=0;i<dataCellTextList.size();i++){
				List rowTextList = (List)dataCellTextList.get(i);//获得行数�?
				 row = sheet.createRow((short)i+tableHeaderArray.length+3);//创建数据�?				
				for(int j=0;j<rowTextList.size();j++){	 
					HSSFCell dataCell = row.createCell((short)j);//创建单元�?
					String cellValue=(String)rowTextList.get(j);
					cellValue=cellValue.replaceAll(",", "");
					//设置字体
					//HSSFFont dataFont = workbook.createFont();
					//dataFont.setFontHeightInPoints((short) 10);
					//dataFont.setFontName("黑体");
					
					//设置单元格样�?			
					HSSFCellStyle dataCs = workbook.createCellStyle();
					//dataCs.setFont(dataFont);//设置字体									
					dataCs.setAlignment(getCellAlign(tableColumnAlignArray[j]));//水平对齐方式
					dataCs.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);//垂直对齐方式		
					//dataCs.setDataFormat(workbook.createDataFormat().getFormat("#,##0.000000"));  //自定义格式，显示六位小数
					
					setBorderStyle(dataCs);//设置单元格边框样�?
					
					
					if(dataCs.getAlignment()==HSSFCellStyle.ALIGN_LEFT||dataCs.getAlignment()==HSSFCellStyle.ALIGN_CENTER){
						dataCell.setCellStyle(dataCs);//挷定样式到单元格
						dataCell.setCellType(HSSFCell.CELL_TYPE_STRING);
//						dataCell.setEncoding(HSSFWorkbook.ENCODING_UTF_16);//设置为中文字�?,应该放在setCellValue方法之前
						dataCell.setCellValue(cellValue);//赋�??	
					}else if(dataCs.getAlignment()==HSSFCellStyle.ALIGN_RIGHT){
						dataCell.setCellType(HSSFCell.CELL_TYPE_NUMERIC);
						
						cellValue=StringUtil.isNullString(cellValue)?"0":cellValue;
						double temp=Double.parseDouble(cellValue.replaceAll("%", ""));
						
						if(cellValue.endsWith("%")){
							dataCs.setDataFormat(HSSFDataFormat.getBuiltinFormat("0.00%"));//百分�?
							dataCell.setCellValue(temp/100);//赋�??	
						}else if(cellValue.matches("^(-?\\d+)(\\.\\d+)$")){
							dataCs.setDataFormat(HSSFDataFormat.getBuiltinFormat("#,##0.00"));//两位小数
							dataCell.setCellValue(temp);//赋�??	

						}else if(cellValue.matches("^-?\\d+$")){
							dataCs.setDataFormat(HSSFDataFormat.getBuiltinFormat("#,##0"));//整数
							dataCell.setCellValue(Integer.parseInt(cellValue));//赋�??
						}
						
					}
					dataCell.setCellStyle(dataCs);//挷定样式到单元格
					//dataCell.setCellType(HSSFCell.CELL_TYPE_STRING);//单元格类�?
					//dataCell.setEncoding(HSSFWorkbook.ENCODING_UTF_16);//设置为中文字�?,应该放在setCellValue方法之前
					//dataCell.setCellValue((String)rowTextList.get(j));//赋�??	

				}			
			}
			
			return  workbook;
		}catch(Exception e){
			e.printStackTrace();
			return null;
		}
	}
	
	/**
	 * @author chenhongjian 20110831
	 * @param tableHeader
	 * @param tableColumnAlign
	 * @param tableInitCellWidth
	 * @param
	 * @param tableTitle
	 * @param tableTitleHelp
	 * @return
	 */
	public static HSSFWorkbook getWorkBook(String tableHeader,String tableColumnAlign,String tableInitCellWidth,Map sheetData,String tableTitle,String tableTitleHelp) {
		short rowHeight = (short)335;//用于设置数据格行高
		try{
			//表格各列对齐方式
			String[] tableColumnAlignArray = tableColumnAlign.split(",");
			//各列宽度
			String[] tableInitCellWidthArray = tableInitCellWidth.split(",");
			//表头字符串数�?
			String[][] tableHeaderArray = getTableHeaderArray(tableHeader,tableColumnAlignArray.length);
			
			//表头帮助
			String [] tableHelp = new String[1];
			int tbsize=5;
			if(tableTitleHelp == null){
				tableHelp = null;
				tbsize = 1;
			}else{
				tableHelp=tableTitleHelp.split(",");
				
			}
//			int tbsize=3;
			if(tableTitleHelp != null && tableHelp.length>0){
				tbsize=tableHelp.length+1;
			}
			
			//创建新的Excel 工作�?
			HSSFWorkbook workbook = new HSSFWorkbook();
			Set keys = sheetData.keySet();
			Iterator it = keys.iterator();
			int counter = 0;
			while(it.hasNext()){
				String sheetName = (String)it.next();
				HSSFSheet sheet = workbook.createSheet(sheetName);//在Excel工作簿中建一工作表，其名为缺省�??
				sheet.setHorizontallyCenter(true); //设置打印页面为水平居中        
				sheet.setVerticallyCenter(true); // 设置打印页面为垂直居中			
				sheet.getPrintSetup().setLandscape(true);//设置横向打印
				//workbook.setSheetName(counter, tableTitle,HSSFWorkbook.ENCODING_UTF_16);//设置中文支持
//				workbook.setSheetName(counter, sheetName,HSSFWorkbook.ENCODING_UTF_16);//设置中文支持
				//获取表单相应的表格数据
				List dataCellTextList = getDataCellTextList((String)sheetData.get(sheetName));
				
				//设置列宽
				for(int i=0;i<tableInitCellWidthArray.length;i++){			
					sheet.setColumnWidth((short)i, (short)(Integer.parseInt(tableInitCellWidthArray[i])*40));
				}
				//创建报表主标题行	
				HSSFRow row = sheet.createRow((short)0);
				int mergedRegionNum=sheet.addMergedRegion(new Region(0,(short)(0),0,(short)(tableColumnAlignArray.length-1)));
				sheet.getMergedRegionAt(mergedRegionNum);//主标题行合并
				HSSFCell cell=row.createCell((short)0);
				
				//报表主标题单元格字体
				HSSFFont font = workbook.createFont();//字体
				//font.setColor(HSSFFont.COLOR_NORMAL);
				font.setFontHeightInPoints((short)14);
				//font.setFontName("黑体");
				font.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
				//font.setItalic(true);
				//font.setStrikeout(false);
				//font.setTypeOffset(HSSFFont.SS_SUB);
				//font.setUnderline(HSSFFont.U_NONE);
				
				//报表主标题单元格样式
				HSSFCellStyle cs = workbook.createCellStyle();
				cs.setFont(font);
				cs.setAlignment(HSSFCellStyle.ALIGN_CENTER);
				//cs.setDataFormat(HSSFDataFormat.getFormat("m/d/yy h:mm"));//设置cell样式为定制的日期格式
				//setBorderStyle(cs);//设置单元格边框样�?
				//cs.setLocked(true);//设置锁定状�??	
				
				cell.setCellStyle(cs);//挷定样式到单元格			
				//单元格类�?
				cell.setCellType(HSSFCell.CELL_TYPE_STRING);
				//设置为中文字�?,应该放在setCellValue方法之前
//				cell.setEncoding(HSSFWorkbook.ENCODING_UTF_16);
				//给单元格赋�??
				cell.setCellValue(tableTitle);
				//cell.setCellValue(new Date());
				
				/*sheet.createRow(1);//创建报表主标题隔�?
				sheet.createRow(2);//创建报表导出信息�?
				sheet.createRow(3);	*/
				for (int i = 0; tableTitleHelp != null && i < tableHelp.length; i++) {
					row =sheet.createRow(i+1);//创建报表主标题隔�?
					int hmergedRegionNum=sheet.addMergedRegion(new Region(i+1,(short)(0),i+1,(short)(tableColumnAlignArray.length-1)));
					sheet.getMergedRegionAt(hmergedRegionNum);//主标题行合并
					
					HSSFCell headerCell2 = row.createCell((short)0);
					HSSFFont headerFont2 = workbook.createFont();								
					headerFont2.setFontHeightInPoints((short)10);
					HSSFCellStyle headerCs2 = workbook.createCellStyle();													
					headerCs2.setFont(headerFont2);//设置字体									
					headerCs2.setAlignment(HSSFCellStyle.ALIGN_LEFT);//水平对齐方式
					headerCs2.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);//垂直对齐方式
					headerCs2.setFillForegroundColor(HSSFColor.GREY_25_PERCENT.index);//设置单元格显示颜�?
					//headerCs2.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
					setBorderStyle(headerCs2);//设置单元格边框样�?
					
					headerCell2.setCellStyle(headerCs2);//挷定样式到单元格	
					headerCell2.setCellType(HSSFCell.CELL_TYPE_STRING);//单元格类�?
//					headerCell2.setEncoding(HSSFWorkbook.ENCODING_UTF_16);//设置为中文字�?,应该放在setCellValue方法之前
					headerCell2.setCellValue(getHelpMap().get(tableHelp[i]).toString());//赋�??		 
					
				}
	 
				//生成EXCEL表头单元�?
				for(int i=0;i<tableHeaderArray.length;i++){
					row = sheet.createRow((short)i+tbsize);//创建报表表头�?		
					 
					for(int j=0;j<tableHeaderArray[i].length;j++){
						//创建报表表头单元�?
						HSSFCell headerCell2 = row.createCell((short)j);	
						
						//设置报表表头单元格字�?												
						HSSFFont headerFont2 = workbook.createFont();								
						headerFont2.setFontHeightInPoints((short)10);
						//headerFont2.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
						
						//设置报表表头单元格样�?
						HSSFCellStyle headerCs2 = workbook.createCellStyle();													
						headerCs2.setFont(headerFont2);//设置字体									
						headerCs2.setAlignment(HSSFCellStyle.ALIGN_CENTER);//水平对齐方式
						headerCs2.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);//垂直对齐方式
						headerCs2.setFillForegroundColor(HSSFColor.GREY_25_PERCENT.index);//设置单元格显示颜�?
						headerCs2.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
						setBorderStyle(headerCs2);//设置单元格边框样�?
						
						headerCell2.setCellStyle(headerCs2);//挷定样式到单元格	
						headerCell2.setCellType(HSSFCell.CELL_TYPE_STRING);//单元格类�?
//						headerCell2.setEncoding(HSSFWorkbook.ENCODING_UTF_16);//设置为中文字�?,应该放在setCellValue方法之前
						headerCell2.setCellValue(tableHeaderArray[i][j]);//赋�??		 
					}
					
					//处理报表表头的单元格合并
					//short firstCellNum=sheet.getRow(i+3).getFirstCellNum();//第一个单元格编号
			    	short lastCellNum=sheet.getRow(i+tbsize).getLastCellNum();//�?后一个单元格编号
//			    	int startCellNum = 1;
			    	int endCellNum = 1;
			    	for(int j=0;j<=lastCellNum;j++){
			    		String startCellValue=sheet.getRow(i+tbsize).getCell((short)j).getStringCellValue();//当前单元格的�?
			    		//System.out.println(startCellValue);
			    		String endCellValue=null;
			    		if(j==lastCellNum){
			    			endCellValue=sheet.getRow(i+tbsize).getCell((short)(j)).getStringCellValue();//相邻单元格的�?
			    		}else{
			    			endCellValue=sheet.getRow(i+tbsize).getCell((short)(j+1)).getStringCellValue();//相邻单元格的�?
			    		}
			    		
			    		if("#cspan".equals(endCellValue)&&j<lastCellNum){
			    			endCellNum ++;		    
			    			sheet.getRow(i+tbsize).getCell((short)(j+1)).setCellValue("");
			    		}else{
	//		    			mergedRegionNum=sheet.addMergedRegion(new Region(i+tbsize,(short)(startCellNum),i+tbsize,(short)endCellNum));
	//						sheet.getMergedRegionAt(mergedRegionNum);
	//						startCellNum = j+1;
	//						endCellNum = j+1;						
			    		}
			    		if("#rspan".equals(startCellValue)){
	//						mergedRegionNum=sheet.addMergedRegion(new Region(i+tbsize-1,(short)j,i+tbsize,(short)j));
	//						sheet.getMergedRegionAt(mergedRegionNum);
							sheet.getRow(i+tbsize).getCell((short)j).setCellValue("");
						}
			    		
			    	}
			    	
	//		    	mergedRegionNum=sheet.addMergedRegion(new Region(i+tbsize,(short)(startCellNum),i+tbsize,(short)endCellNum));
	//				sheet.getMergedRegionAt(mergedRegionNum);
	//				处理表头的列合并				
			    	String cols = getCols(tableHeaderArray[i],"#cspan") ;
					if(cols.length() > 0){
					String [] colsArr = cols.split(";") ;
					for(int k=0;k<colsArr.length;k++){
						String [] subColsArr = colsArr[k].split(":") ;
						short fromColumn = (short)(Integer.parseInt(subColsArr[0])-1);
						short toColumn = (short)(Integer.parseInt(subColsArr[1])) ;
						int fromRow = i+tbsize;
						int toRow = i+tbsize;
						
						Region region = new Region();
						region.setColumnFrom(fromColumn) ;
						region.setColumnTo(toColumn) ;
						region.setRowFrom(fromRow) ;
						region.setRowTo(toRow) ;
	//					sheet.addMergedRegion(new Region(fromRow,fromColumn,toRow,toColumn));
						sheet.addMergedRegion(region) ;
					 }
					}
					
				}
	//			处理表头的行合并
				String rows = getRows(tableHeaderArray,"#rspan") ;
				if(rows.length() > 0){
					String [] rowsArr = rows.split(";") ;
					for(int k=0;k<rowsArr.length ;k++){
						String [] subRowsArr = rowsArr[k].split(":") ;
						short fromColumn = (short)(Integer.parseInt(subRowsArr[2])) ;
						short toColumn = (short)(Integer.parseInt(subRowsArr[2])) ;
						int fromRow = Integer.parseInt(subRowsArr[0]) + tbsize - 1 ;
						int toRow = Integer.parseInt(subRowsArr[1]) + tbsize;
						Region region = new Region();
						region.setColumnFrom(fromColumn) ;
						region.setColumnTo(toColumn) ;
						region.setRowFrom(fromRow) ;
						region.setRowTo(toRow) ;
						sheet.addMergedRegion(region) ;
					}
				}
				
				//生成数据单元�?
				for(int i=0;i<dataCellTextList.size();i++){
					List rowTextList = (List)dataCellTextList.get(i);//获得行数�?
					row = sheet.createRow((short)i+tableHeaderArray.length+tbsize);//创建数据�?
					int rowSize = 1;//用来存放每行的最大高度需要的行数
					row.setHeight(rowHeight);
					int rownum=(short)i+tableHeaderArray.length+tbsize;
					 
					List rowspanList=(List)rowTextList.get(rowTextList.size()-2);
					List colspanList=(List)rowTextList.get(rowTextList.size()-1);
					//行合并单元格
					for (int k = 0; k < rowspanList.size(); k++) {
						String rnum=(String)rowspanList.get(k);
						if(rnum!=null&&!rnum.equals("")&&!rnum.equals("null")){
							int innum=Integer.parseInt(rnum);
							mergedRegionNum=sheet.addMergedRegion(new Region(rownum,(short)k,rownum+innum-1,(short)k));
							sheet.getMergedRegionAt(mergedRegionNum);
						}
					}
					//列合并单元格
					for (int k = 0; k < colspanList.size(); k++) {
						String rnum=(String)colspanList.get(k);
						if(rnum!=null&&!rnum.equals("")&&!rnum.equals("null")){
							int innum=Integer.parseInt(rnum);
							mergedRegionNum=sheet.addMergedRegion(new Region(rownum,(short)k,rownum,(short)(k+innum-1)));
							sheet.getMergedRegionAt(mergedRegionNum);
						}
					}
					
					HSSFCellStyle dataCs=ModelExportUtil.getDataStyle(workbook, workbook.toString(), "cell000");//不要在循环中创建样式，尽量重用样式，否则会超过单元格样式数(不能超过4000)
					HSSFCellStyle dataCs1=ModelExportUtil.getDataStyle(workbook, workbook.toString(), "cell400");//不要在循环中创建样式，尽量重用样式，否则会超过单元格样式数(不能超过4000)
					HSSFFont datafont = workbook.createFont();
					datafont.setFontHeightInPoints((short)10);
					datafont.setFontName("宋体");//设置为宋体便于获取中文字符打印时所占的像素									
					dataCs.setFont(datafont);
					dataCs1.setFont(datafont);
					dataCs.setWrapText(true);//设置为自动换行 
					dataCs1.setWrapText(true);
					for(int j=0;j<rowTextList.size()-2;j++){
						HSSFCell dataCell = row.createCell((short)j);//创建单元�?
						String cellValue=(String)rowTextList.get(j);
						cellValue=cellValue.replaceAll(",", "");
						int len = pageWidth(cellValue);
						int l = (int)Math.ceil(len/164.0);
						if(l>rowSize){
							rowSize = l;//如果(i,j)单元格数据所占的行数l大于rowSize(初始为1行),则将l赋给rowSize
						}
						row.setHeight((short)(rowHeight*rowSize));
						
						//设置单元格数据格�?
						if(getCellAlign(tableColumnAlignArray[j])==HSSFCellStyle.ALIGN_LEFT||getCellAlign(tableColumnAlignArray[j])==HSSFCellStyle.ALIGN_CENTER){					
							if((i==6&&j==3)||(i==10&&j==1)){//是否是交易金额和注册资金数
								try{
									double temp=Double.parseDouble(cellValue.replaceAll("%", ""));
									
									setBorderStyle(dataCs1);//设置单元格边框样�?
									dataCell.setCellStyle(dataCs1);//挷定样式到单元格
									
									dataCell.setCellValue(temp);//赋�??	
								}catch(NumberFormatException e){//如果不能转换成double型，则以文本格式输出
									dataCs.setDataFormat(HSSFDataFormat.getBuiltinFormat("@"));//设置为文本格式			
									setBorderStyle(dataCs);//设置单元格边框样�?
									
									dataCell.setCellStyle(dataCs);//挷定样式到单元格
									dataCell.setCellType(HSSFCell.CELL_TYPE_STRING);
//									dataCell.setEncoding(HSSFWorkbook.ENCODING_UTF_16);//设置为中文字�?,应该放在setCellValue方法之前
									dataCell.setCellValue(cellValue);//赋�??	
								}
							}else{
								dataCs.setDataFormat(HSSFDataFormat.getBuiltinFormat("@"));//设置为文本格式		
								setBorderStyle(dataCs);//设置单元格边框样�?
								
								dataCell.setCellStyle(dataCs);//挷定样式到单元格
								dataCell.setCellType(HSSFCell.CELL_TYPE_STRING);
//								dataCell.setEncoding(HSSFWorkbook.ENCODING_UTF_16);//设置为中文字�?,应该放在setCellValue方法之前
								dataCell.setCellValue(cellValue);//赋�??	
							}
						}else if(getCellAlign(tableColumnAlignArray[j])==HSSFCellStyle.ALIGN_RIGHT){
							dataCell.setCellType(HSSFCell.CELL_TYPE_NUMERIC);
							
							
							cellValue=StringUtil.isNullString(cellValue)?"0":cellValue;
							double temp=Double.parseDouble(cellValue.replaceAll("%", ""));
							//HSSFCellStyle dataCs=null;
							dataCs=null;
							if(cellValue.endsWith("%")){
								dataCs=ModelExportUtil.getDataStyle(workbook, workbook.toString(), "cell100");
								setBorderStyle(dataCs);//设置单元格边框样�?
								
								//dataCs.setDataFormat(HSSFDataFormat.getBuiltinFormat("0.00%"));//百分�?
								dataCell.setCellValue(temp/100);//赋�??	
								dataCell.setCellStyle(dataCs);//挷定样式到单元格
							}else if(cellValue.matches("^(-?\\d+)(\\.\\d+)$")){
								dataCs=ModelExportUtil.getDataStyle(workbook,  workbook.toString(), "cell200");
								setBorderStyle(dataCs);//设置单元格边框样�?
								//dataCs=ExportDataUtil.getDataStyle(workbook, tableColumnAlignArray[j], cellValue, "cell","cell200");
								//dataCs.setDataFormat(HSSFDataFormat.getBuiltinFormat("#,##0.00"));//两位小数
								dataCell.setCellValue(temp);//赋�??	
								dataCell.setCellStyle(dataCs);//挷定样式到单元格
							}else if(cellValue.matches("^-?\\d+$")){
								dataCs=getDataStyle(workbook,  workbook.toString(), "cell300");
								setBorderStyle(dataCs);//设置单元格边框样�?
								
								//dataCs.setDataFormat(HSSFDataFormat.getBuiltinFormat("#,##0"));//整数
								//dataCell.setCellValue(Integer.parseInt(cellValue));//赋�??
								dataCell.setCellValue(Long.parseLong(cellValue));//赋�??
								dataCell.setCellStyle(dataCs);//挷定样式到单元格
							}
							
						}
						//dataCell.setCellStyle(dataCs);//挷定样式到单元格
						//dataCell.setCellType(HSSFCell.CELL_TYPE_STRING);//单元格类�?
						//dataCell.setEncoding(HSSFWorkbook.ENCODING_UTF_16);//设置为中文字�?,应该放在setCellValue方法之前
						//dataCell.setCellValue((String)rowTextList.get(j));//赋�??
					}
				}
				counter++;
			}
			return  workbook;
		}catch(Exception e){
			e.printStackTrace();
			return null;
		}finally{
			HSSFMAP.clear();
		}
	}
	
	/**
	 * 处理表头的列合并
	 * 解析数组中连续type的每一段的首尾下标
	 * @agrs:表头各行的数组,如String [] arr = {"aa","bb","cc","cols","cols","cols","dd","ee","cols","cols","vv","cols"} ;
	 * @return String:首尾下标以":"相隔",各个起始下标以";"相隔,如:3:5;8:9;11:11"
	 */
	public static String getCols(String [] colsOrRows,String type){
		String returnValue = "" ;
		int index = 0 ;
		 for(int i=0;i<colsOrRows.length;i++){
				if(colsOrRows[i].equals(type)&&(i==0||!colsOrRows[i-1].equals(type))){
					returnValue=returnValue+i+":";
					index=index+1;
				}else if(!colsOrRows[i].equals(type)&&i!=0&&colsOrRows[i-1].equals(type)){
					returnValue=returnValue+(i-1);
					index=index+1;
				}
				if(index==2){
						returnValue=returnValue+";" ;
						index=0;
				}
				if(i==colsOrRows.length-1&&colsOrRows[i].equals(type)){
					returnValue=returnValue+i+";";
				}
				
			}
		 return returnValue;
		}
	
	/**
	 * 处理表头的行合并
	 * @args:表头二维数组,"#rspan"
	 * @return:要合并行的起始下标和行所在的列,其中起始下标和列以":"相隔,
	 * 各个起始下标和列以";"相隔,如:1:2:1;1:2:2;
	 */
	public static String getRows(String [][] rows,String type){
		String returnValue="";
		if(rows[0].length>0){
			for(int i=0;i<rows[0].length;i++){//i代表列
				String [] tempCols = new String[rows.length] ;
				for(int j=0;j<rows.length;j++){
					tempCols[j] = rows[j][i] ;
				}
				int index = 0 ;
				 for(int k=0;k<tempCols.length;k++){
						if(tempCols[k].equals(type)&&(k==0||!tempCols[k-1].equals(type))){
							returnValue=returnValue+k+":";
							index=index+1;
						}else if(!tempCols[k].equals(type)&&k!=0&&tempCols[k-1].equals(type)){
							returnValue=returnValue+(k-1);
							index=index+1;
						}
						if(index==2){
								returnValue=returnValue+":"+i+";" ;
								index=0;
						}
						if(k==tempCols.length-1&&tempCols[k].equals(type)){
							returnValue=returnValue+k+":"+i+";";
						}
						
					}
			}
		}
		
		return returnValue;
	}
	/**
	 * 表头字符�?
	 * @param tableHeader
	 * @param columnNum
	 * @return
	 */
	public static String[][] getTableHeaderArray(String tableHeader,int columnNum){
		String[] tableHeaderArrayTemp=tableHeader.split(";");
		String[][] tableHeaderArray =new String[tableHeaderArrayTemp.length][columnNum];
		for(int i=0;i<tableHeaderArrayTemp.length;i++){
			tableHeaderArray[i]=tableHeaderArrayTemp[i].split(",");
		}
		return tableHeaderArray;
	}
	
	/**
	 * @author chj
	 * @param dataFont
	 * @param cellValue
	 * @return JAVA下取得字符串像素宽度
	 */
	public static int getStringWidth(HSSFFont dataFont,String cellValue){		
		Font fontArial = new Font(dataFont.getFontName(),Font.PLAIN,dataFont.getFontHeightInPoints());//Arial 默认英文字体
		Font fontMSGothic = new Font("MSGothic", Font.PLAIN, dataFont.getFontHeightInPoints());
		JComponent jc = new JLabel(); 
		FontMetrics ArialMetrics = jc.getFontMetrics(fontArial);
		FontMetrics MSGothicMetrics = jc.getFontMetrics(fontMSGothic);
		String temStr = "";
		int totalWidth = 0;
		int chaWidth = 0;
		for(int i=0;i<cellValue.length();i++){
			temStr = cellValue.substring(i,i+1);
			if(temStr.length()==1){			// 判断是否是全角字符，半角使用英文字体，全角使用日文字体进行计算宽度
				chaWidth = ArialMetrics.stringWidth(temStr);
			}else{
				chaWidth = MSGothicMetrics.stringWidth(temStr);
			}
			totalWidth += chaWidth;
		}
		return totalWidth;
	}
	
	/**
	 * @author chj
	 * @param s
	 * @return 给定字符串打印的宽度（像素px）
	 */
	public static int pageWidth(String s){
        Font font=new Font("宋体",Font.PLAIN,10);
        BufferedImage img=new BufferedImage(1,1,BufferedImage.TYPE_INT_ARGB);
        Graphics g=img.getGraphics();
        g.setFont(font);
        FontMetrics fm=g.getFontMetrics();
        Rectangle re=fm.getStringBounds(s,g).getBounds();
//        System.out.println("JAVA中字符串宽度:" + re.width + "px");
//        System.out.println("浏览器中字符串宽度:" + (re.width * 96 / 72) + "px");
        int width = re.width * 96 / 72;
        return width;
	}
	
	/**
	 * @param args
	 */
	public static void main(String[] args) {
		String tableHeader ="";
	}
	
	@SuppressWarnings("unused")
	public static HSSFWorkbook getWorkBook2(String tableHeader,String tableColumnAlign,String tableInitCellWidth,String tableData,String tableTitle,String tableTitleHelp,String exportHeader) {
		try{
			//表格各列对齐方式
			String[] tableColumnAlignArray = tableColumnAlign.split(",");
			//各列宽度
			String[] tableInitCellWidthArray = tableInitCellWidth.split(",");
			//表头字符串数�?
			String[][] tableHeaderArray = getTableHeaderArray(tableHeader,tableColumnAlignArray.length);
			//表格数据
			List dataCellTextList=new ArrayList();
			if(isNotNull(tableData))
				 dataCellTextList = getDataCellTextList(tableData);
			//表头帮助
//			int tbsize=3;
			
			//创建新的Excel 工作�?
			HSSFWorkbook workbook = new HSSFWorkbook();
			HSSFSheet sheet = workbook.createSheet();//在Excel工作簿中建一工作表，其名为缺省�??
//			workbook.setSheetName(0, tableTitle,HSSFWorkbook.ENCODING_UTF_16);//设置中文支持
			
			//设置列宽
			for(int i=0;i<tableInitCellWidthArray.length;i++){			
				sheet.setColumnWidth((short)i, (short)(Integer.parseInt(tableInitCellWidthArray[i])*40));
			}
			
			//创建报表主标题行	
			HSSFRow row = sheet.createRow((short)0);		
			int mergedRegionNum=sheet.addMergedRegion(new Region(0,(short)(0),0,(short)(tableColumnAlignArray.length-1)));
			sheet.getMergedRegionAt(mergedRegionNum);//主标题行合并
			HSSFCell cell=row.createCell((short)0);
			
			//报表主标题单元格字体
			HSSFFont font = workbook.createFont();//字体
			//font.setColor(HSSFFont.COLOR_NORMAL);
			font.setFontHeightInPoints((short)14);
			//font.setFontName("黑体");
			font.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
			//font.setItalic(true);
			//font.setStrikeout(false);
			//font.setTypeOffset(HSSFFont.SS_SUB);
			//font.setUnderline(HSSFFont.U_NONE);
			
			//报表主标题单元格样式
			HSSFCellStyle cs = workbook.createCellStyle();
			cs.setFont(font);
			cs.setAlignment(HSSFCellStyle.ALIGN_CENTER);
			//cs.setDataFormat(HSSFDataFormat.getFormat("m/d/yy h:mm"));//设置cell样式为定制的日期格式
			//setBorderStyle(cs);//设置单元格边框样�?
			//cs.setLocked(true);//设置锁定状�??	
			
			cell.setCellStyle(cs);//挷定样式到单元格			
			//单元格类�?
			cell.setCellType(HSSFCell.CELL_TYPE_STRING);
			//设置为中文字�?,应该放在setCellValue方法之前
//			cell.setEncoding(HSSFWorkbook.ENCODING_UTF_16);
			//给单元格赋�??
			cell.setCellValue(tableTitle);
			//cell.setCellValue(new Date());
			
			/*sheet.createRow(1);//创建报表主标题隔�?
			sheet.createRow(2);//创建报表导出信息�?
			sheet.createRow(3);	*/
			
			/* 表头,帮助,固定部分占用行*/
			int tbsize=1;
			if(isNotNull(tableTitleHelp)){
				//创建表头帮助信息
				createExportFix(tbsize,workbook, sheet, row,tableTitleHelp, tableColumnAlignArray.length);

				tbsize+=tableTitleHelp.split(";").length;
				
				System.out.println("create help...");
			}
						
			//表头固定部分
			if(isNotNull(exportHeader)){
				//创建表头固定部分
				createExportFix(tbsize,workbook, sheet, row, exportHeader, tableColumnAlignArray.length);
				
				tbsize+=exportHeader.split(";").length;
				

				System.out.println("create fix...");
			}
			//固定部分
			//生成空白行数据
			createExportFix(tbsize,workbook, sheet, row, "", tableColumnAlignArray.length);
			tbsize+=1;
			
			//生成EXCEL表头单元�?
			for(int i=0;i<tableHeaderArray.length;i++){
				row = sheet.createRow((short)i+tbsize);//创建报表表头�?		
				 
				for(int j=0;j<tableHeaderArray[i].length;j++){
					//创建报表表头单元�?
					HSSFCell headerCell2 = row.createCell((short)j);	
					
					//设置报表表头单元格字�?												
					HSSFFont headerFont2 = workbook.createFont();								
					headerFont2.setFontHeightInPoints((short)10);
					//headerFont2.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
					
					//设置报表表头单元格样�?
					HSSFCellStyle headerCs2 = workbook.createCellStyle();													
					headerCs2.setFont(headerFont2);//设置字体									
					headerCs2.setAlignment(HSSFCellStyle.ALIGN_CENTER);//水平对齐方式
					headerCs2.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);//垂直对齐方式
					headerCs2.setFillForegroundColor(HSSFColor.GREY_25_PERCENT.index);//设置单元格显示颜�?
					headerCs2.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
					setBorderStyle(headerCs2);//设置单元格边框样�?
					
					headerCell2.setCellStyle(headerCs2);//挷定样式到单元格	
					headerCell2.setCellType(HSSFCell.CELL_TYPE_STRING);//单元格类�?
//					headerCell2.setEncoding(HSSFWorkbook.ENCODING_UTF_16);//设置为中文字�?,应该放在setCellValue方法之前
					headerCell2.setCellValue(tableHeaderArray[i][j]);//赋�??		 
				}
				
				//处理报表表头的单元格合并
				//short firstCellNum=sheet.getRow(i+3).getFirstCellNum();//第一个单元格编号
		    	short lastCellNum=sheet.getRow(i+tbsize).getLastCellNum();//�?后一个单元格编号
				int startCellNum = 1;
		    	int endCellNum = 1;
		    	for(int j=0;j<=lastCellNum;j++){
		    		String startCellValue=sheet.getRow(i+tbsize).getCell((short)j).getStringCellValue();//当前单元格的�?
		    		//System.out.println(startCellValue);
		    		String endCellValue=null;
		    		if(j==lastCellNum){
		    			endCellValue=sheet.getRow(i+tbsize).getCell((short)(j)).getStringCellValue();//相邻单元格的�?
		    		}else{
		    			endCellValue=sheet.getRow(i+tbsize).getCell((short)(j+1)).getStringCellValue();//相邻单元格的�?
		    		}
		    		
		    		if("#cspan".equals(endCellValue)&&j<lastCellNum){
		    			endCellNum ++;		    
		    			sheet.getRow(i+tbsize).getCell((short)(j+1)).setCellValue("");
		    		}else{
//		    			mergedRegionNum=sheet.addMergedRegion(new Region(i+tbsize,(short)(startCellNum),i+tbsize,(short)endCellNum));
//						sheet.getMergedRegionAt(mergedRegionNum);
//						startCellNum = j+1;
//						endCellNum = j+1;						
		    		}
		    		if("#rspan".equals(startCellValue)){
//						mergedRegionNum=sheet.addMergedRegion(new Region(i+tbsize-1,(short)j,i+tbsize,(short)j));
//						sheet.getMergedRegionAt(mergedRegionNum);
						sheet.getRow(i+tbsize).getCell((short)j).setCellValue("");
					}
		    	}
		    	
//		    	mergedRegionNum=sheet.addMergedRegion(new Region(i+tbsize,(short)(startCellNum),i+tbsize,(short)endCellNum));
//				sheet.getMergedRegionAt(mergedRegionNum);
//				处理表头的列合并				
		    	String cols = getCols(tableHeaderArray[i],"#cspan") ;
				if(cols.length() > 0){
				String [] colsArr = cols.split(";") ;
				for(int k=0;k<colsArr.length;k++){
					String [] subColsArr = colsArr[k].split(":") ;
					short fromColumn = (short)(Integer.parseInt(subColsArr[0])-1);
					short toColumn = (short)(Integer.parseInt(subColsArr[1])) ;
					int fromRow = i+tbsize;
					int toRow = i+tbsize;
					
					Region region = new Region();
					region.setColumnFrom(fromColumn) ;
					region.setColumnTo(toColumn) ;
					region.setRowFrom(fromRow) ;
					region.setRowTo(toRow) ;
//					sheet.addMergedRegion(new Region(fromRow,fromColumn,toRow,toColumn));
					sheet.addMergedRegion(region) ;
				 }
				}
			}
//			处理表头的行合并
			String rows = getRows(tableHeaderArray,"#rspan") ;
			if(rows.length() > 0){
				String [] rowsArr = rows.split(";") ;
				for(int k=0;k<rowsArr.length ;k++){
					String [] subRowsArr = rowsArr[k].split(":") ;
					short fromColumn = (short)(Integer.parseInt(subRowsArr[2])) ;
					short toColumn = (short)(Integer.parseInt(subRowsArr[2])) ;
					int fromRow = Integer.parseInt(subRowsArr[0]) + tbsize - 1 ;
					int toRow = Integer.parseInt(subRowsArr[1]) + tbsize;
					Region region = new Region();
					region.setColumnFrom(fromColumn) ;
					region.setColumnTo(toColumn) ;
					region.setRowFrom(fromRow) ;
					region.setRowTo(toRow) ;
					sheet.addMergedRegion(region) ;
				}
			}
			
			//生成数据单元�?
			for(int i=0;i<dataCellTextList.size();i++){
				List rowTextList = (List)dataCellTextList.get(i);//获得行数�?
				row = sheet.createRow((short)i+tableHeaderArray.length+tbsize);//创建数据�?
				int rownum=(short)i+tableHeaderArray.length+tbsize;
				 
				List rowspanList=(List)rowTextList.get(rowTextList.size()-2);
				List colspanList=(List)rowTextList.get(rowTextList.size()-1);
				//行合并单元格
				for (int k = 0; k < rowspanList.size(); k++) {
					String rnum=(String)rowspanList.get(k);
					if(rnum!=null&&!rnum.equals("")&&!rnum.equals("null")){
						int innum=Integer.parseInt(rnum);
						mergedRegionNum=sheet.addMergedRegion(new Region(rownum,(short)k,rownum+innum-1,(short)k));
						sheet.getMergedRegionAt(mergedRegionNum);
					}
				}
				//列合并单元格
				for (int k = 0; k < colspanList.size(); k++) {
					String rnum=(String)colspanList.get(k);
					if(rnum!=null&&!rnum.equals("")&&!rnum.equals("null")){
						int innum=Integer.parseInt(rnum);
						mergedRegionNum=sheet.addMergedRegion(new Region(rownum,(short)k,rownum,(short)(k+innum-1)));
						sheet.getMergedRegionAt(mergedRegionNum);
					}
				}
				
				 
				for(int j=0;j<rowTextList.size()-2;j++){	 
					HSSFCell dataCell = row.createCell((short)j);//创建单元�?
					String cellValue=(String)rowTextList.get(j);
					cellValue=cellValue.replaceAll(",", "");
					
					//设置字体
					//HSSFFont dataFont = workbook.createFont();
					//dataFont.setFontHeightInPoints((short) 10);
					//dataFont.setFontName("黑体");
					
					//设置单元格样�?			
					//HSSFCellStyle dataCs = workbook.createCellStyle();
					//HSSFCellStyle dataCs=ExportDataUtil.getDataStyle(workbook, tableColumnAlignArray[j], cellValue, "border", "");
					//dataCs.setFont(dataFont);//设置字体									
					//dataCs.setAlignment(getCellAlign(tableColumnAlignArray[j]));//水平对齐方式
					//dataCs.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);//垂直对齐方式		
					//dataCs.setDataFormat(workbook.createDataFormat().getFormat("#,##0.000000"));  //自定义格式，显示六位小数
					
					//setBorderStyle(dataCs);//设置单元格边框样�?
					
					
					//设置单元格数据格�?
					if(getCellAlign(tableColumnAlignArray[j])==HSSFCellStyle.ALIGN_LEFT||getCellAlign(tableColumnAlignArray[j])==HSSFCellStyle.ALIGN_CENTER){
						HSSFCellStyle dataCs=ModelExportUtil.getDataStyle(workbook, workbook.toString(), "cell000");
						setBorderStyle(dataCs);//设置单元格边框样�?
						
						dataCell.setCellStyle(dataCs);//挷定样式到单元格
						dataCell.setCellType(HSSFCell.CELL_TYPE_STRING);
//						dataCell.setEncoding(HSSFWorkbook.ENCODING_UTF_16);//设置为中文字�?,应该放在setCellValue方法之前
						dataCell.setCellValue(cellValue);//赋�??	
					}else if(getCellAlign(tableColumnAlignArray[j])==HSSFCellStyle.ALIGN_RIGHT){
						dataCell.setCellType(HSSFCell.CELL_TYPE_NUMERIC);
						
						
						cellValue=StringUtil.isNullString(cellValue)?"0":cellValue;
						double temp=Double.parseDouble(cellValue.replaceAll("%", ""));
						HSSFCellStyle dataCs=null;
						if(cellValue.endsWith("%")){
							dataCs=ModelExportUtil.getDataStyle(workbook, workbook.toString(), "cell100");
							setBorderStyle(dataCs);//设置单元格边框样�?
							
							//dataCs.setDataFormat(HSSFDataFormat.getBuiltinFormat("0.00%"));//百分�?
							dataCell.setCellValue(temp/100);//赋�??	
							dataCell.setCellStyle(dataCs);//挷定样式到单元格
						}else if(cellValue.matches("^(-?\\d+)(\\.\\d+)$")){
							dataCs=ModelExportUtil.getDataStyle(workbook,  workbook.toString(), "cell200");
							setBorderStyle(dataCs);//设置单元格边框样�?
							//dataCs=ExportDataUtil.getDataStyle(workbook, tableColumnAlignArray[j], cellValue, "cell","cell200");
							//dataCs.setDataFormat(HSSFDataFormat.getBuiltinFormat("#,##0.00"));//两位小数
							dataCell.setCellValue(temp);//赋�??	
							dataCell.setCellStyle(dataCs);//挷定样式到单元格
						}else if(cellValue.matches("^-?\\d+$")){
							dataCs=getDataStyle(workbook,  workbook.toString(), "cell300");
							setBorderStyle(dataCs);//设置单元格边框样�?
							
							//dataCs.setDataFormat(HSSFDataFormat.getBuiltinFormat("#,##0"));//整数
							//dataCell.setCellValue(Integer.parseInt(cellValue));//赋�??
							dataCell.setCellValue(Long.parseLong(cellValue));//赋�??
							dataCell.setCellStyle(dataCs);//挷定样式到单元格
						}
						
					}
					//dataCell.setCellStyle(dataCs);//挷定样式到单元格
					//dataCell.setCellType(HSSFCell.CELL_TYPE_STRING);//单元格类�?
					//dataCell.setEncoding(HSSFWorkbook.ENCODING_UTF_16);//设置为中文字�?,应该放在setCellValue方法之前
					//dataCell.setCellValue((String)rowTextList.get(j));//赋�??	
					
				}		
			}
			return  workbook;
		}catch(Exception e){
			e.printStackTrace();
			return null;
		}finally{
			HSSFMAP.clear();
		}
	}
	
	/**
	 * 非空判断
	 */
	private static boolean isNotNull(Object obj){
		return obj!=null&&!obj.equals("");
	}
	/**
	 * 创建表头固定部分
	 * @param workbook
	 * @param sheet
	 * @param row
	 * @param exportFix
	 * @param columnLength
	 */
	private static void createExportFix(int beginIndex,HSSFWorkbook workbook,HSSFSheet sheet,HSSFRow row,String exportFix,int columnLength){
		String []exportFixs=exportFix.split(";");
		
		for (int i = 0; i < exportFixs.length; i++) {
			row =sheet.createRow(i+beginIndex);//创建报表主标题隔�?
			
			int hmergedRegionNum=sheet.addMergedRegion(new Region(i+beginIndex,(short)(0),i+beginIndex,(short)(columnLength-1)));
			sheet.getMergedRegionAt(hmergedRegionNum);//主标题行合并
			
			for (int j = 0; j < columnLength; j++) {
				HSSFCell headerCell2 = row.createCell((short)j);
				HSSFFont headerFont2 = workbook.createFont();								
				headerFont2.setFontHeightInPoints((short)10);
				HSSFCellStyle headerCs2 = workbook.createCellStyle();													
				headerCs2.setFont(headerFont2);//设置字体									
				headerCs2.setAlignment(HSSFCellStyle.ALIGN_LEFT);//水平对齐方式
				headerCs2.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);//垂直对齐方式
				headerCs2.setFillForegroundColor(HSSFColor.GREY_25_PERCENT.index);//设置单元格显示颜�?
				//headerCs2.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
				setBorderStyle(headerCs2);//设置单元格边框样�?
				
				headerCell2.setCellStyle(headerCs2);//挷定样式到单元格	
				headerCell2.setCellType(HSSFCell.CELL_TYPE_STRING);//单元格类�?
//				headerCell2.setEncoding(HSSFWorkbook.ENCODING_UTF_16);//设置为中文字�?,应该放在setCellValue方法之前
				if(j==0)
					headerCell2.setCellValue(exportFixs[i]);//赋�值	
				else
					headerCell2.setCellValue("");//赋�
			}
		}
	}
}
