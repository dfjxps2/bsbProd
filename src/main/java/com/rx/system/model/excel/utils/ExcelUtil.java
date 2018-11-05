/*
 * Copyright (c) 2005-2018 , FPX and/or its affiliates. All rights reserved.
 * Use, Copy is subject to authorized license.
 */
package com.rx.system.model.excel.utils;

import java.io.IOException;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

import jxl.format.Alignment;
import jxl.format.Border;
import jxl.format.BorderLineStyle;
import jxl.format.Colour;
import jxl.format.UnderlineStyle;
import jxl.format.VerticalAlignment;
import jxl.write.WritableCellFormat;
import jxl.write.WritableFont;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFDateUtil;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.ss.util.RegionUtil;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;


public class ExcelUtil {
    public static final String Format_DateTime = "yyyy-MM-dd HH:mm:ss";
    public static final int EXCEL_BEGIN_ROW_INDEX = 5;
    private Sheet sheet;
    private String[] headers;
    private String[] properties;
    private CellStyle titleStyle;
    private CellStyle headerTitle;    
    private CellStyle headerStyle;
    private CellStyle cellStyle;
    private final String title;
    private AtomicInteger sheetCount = new AtomicInteger(0);

    /**
     * 通用EXCEL导出
     * 调用前请先调用 initExport(workbook, headList);
     *
     * @param workbook
     * @param centnts  内容
     * @param startRow
     */
    public void exportXLSX(SXSSFWorkbook workbook, List<Map<String, Object>> centnts, int startRow) {

        // 遍历集合数据，产生数据行
        int rowIndex = startRow;
        for (Map<String, Object> obj : centnts) {
            //首or尾行
   /*         synchronized (sheet) {
                if (rowIndex == 0) {
                    //数据内容从 rowIndex=2开始
                    rowIndex += EXCEL_BEGIN_ROW_INDEX;
                } else if ((rowIndex %= 10) == 0) {
                    //如果数据超过了，则在第二页显示
                    sheetCount.addAndGet(1);
                    rowIndex += EXCEL_BEGIN_ROW_INDEX;
//                    initHeaderAndSheet(workbook, headList, title);
                }
            }*/
            rowIndex += EXCEL_BEGIN_ROW_INDEX;

            Row dataRow = sheet.createRow(rowIndex);
            for (int i = 0; i < properties.length; i++) {       	
                org.apache.poi.ss.usermodel.Cell newCell = dataRow.createCell(i);
                Object o = obj.get(properties[i]);
                String cellValue = "";
                if (o == null) {
                    cellValue = "";
                } else if (o instanceof Date) {
                    cellValue = formatDate((Date) o, Format_DateTime);
                }
                //不对浮点数处理
                else if (o instanceof Float || o instanceof Double || o instanceof BigDecimal ){
                	cellValue = format2(new BigDecimal(o.toString()));
                	// cellValue = new BigDecimal(o.toString()).setScale(4, BigDecimal.ROUND_HALF_UP).toString();
                }else {
                    cellValue = o.toString();
                }

                newCell.setCellValue(cellValue);
                newCell.setCellStyle(cellStyle);
            }
            rowIndex++;
        }

    }

    
    public static String format2(BigDecimal bigDecimal) { 
    		DecimalFormat df = new DecimalFormat("0.00");  
    		df.setRoundingMode(RoundingMode.HALF_UP);   
    		return df.format(bigDecimal);
    }


    
    
    /**
     * 设置excel样式，生成第一行Header数据
     *
     * @param workbook
     * @param title    头
     * @param headList 列头 用map无法保证列的顺序，所以改用list
     */
    public ExcelUtil(SXSSFWorkbook workbook, List<ExcelField> headsList, String title,String exportHeader) {
        this.title = title;
        workbook.setCompressTempFiles(true);
        // 头单元格样式       
        titleStyle = workbook.createCellStyle();
        titleStyle.setAlignment(CellStyle.ALIGN_CENTER);
        titleStyle.setFillBackgroundColor(IndexedColors.BLUE_GREY.getIndex());  
        titleStyle.setFillForegroundColor(IndexedColors.BLUE_GREY.getIndex());
        titleStyle.setFillPattern(CellStyle.SOLID_FOREGROUND); 
        Font fontStyle = workbook.createFont(); // 字体样式
        fontStyle.setFontName("宋体"); // 字体
        fontStyle.setFontHeightInPoints((short) 18); // 大小  
        titleStyle.setFont(fontStyle);
        

        //查询条件
        headerTitle = workbook.createCellStyle();
        headerTitle.setBorderBottom(CellStyle.BORDER_THIN);
        headerTitle.setBorderLeft(CellStyle.BORDER_THIN);
        headerTitle.setBorderRight(CellStyle.BORDER_THIN);
        headerTitle.setBorderTop(CellStyle.BORDER_THIN);
        headerTitle.setAlignment(CellStyle.ALIGN_CENTER);

        Font headerTlFont = workbook.createFont();
        headerTlFont.setFontHeightInPoints((short) 12);
        headerTlFont.setFontName("宋体");
        headerTitle.setFont(headerTlFont);
        
        //表头样式
        headerStyle = workbook.createCellStyle();
        headerStyle.setBorderBottom(CellStyle.BORDER_THIN);
        headerStyle.setBorderLeft(CellStyle.BORDER_THIN);
        headerStyle.setBorderRight(CellStyle.BORDER_THIN);
        headerStyle.setBorderTop(CellStyle.BORDER_THIN);
        headerStyle.setAlignment(CellStyle.ALIGN_CENTER);
      
        headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex()); // 前景色
        headerStyle.setFillPattern(CellStyle.SOLID_FOREGROUND); 
        Font headerFont = workbook.createFont();
        headerFont.setFontHeightInPoints((short) 12);
        headerFont.setFontName("宋体");
        headerStyle.setFont(headerFont);
        
        
        // 单元格样式
        cellStyle = workbook.createCellStyle();
        cellStyle.setBorderBottom(CellStyle.BORDER_THIN);
        cellStyle.setBorderLeft(CellStyle.BORDER_THIN);
        cellStyle.setBorderRight(CellStyle.BORDER_THIN);
        cellStyle.setBorderTop(CellStyle.BORDER_THIN);
        cellStyle.setAlignment(CellStyle.ALIGN_CENTER);
        cellStyle.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
        cellStyle.setFillBackgroundColor(HSSFColor.BLUE.index);  
        
        Font cellFont = workbook.createFont();
        cellFont.setFontHeightInPoints((short) 11);
        cellFont.setFontName("宋体");
        cellStyle.setFont(cellFont);

        initHeaderAndSheet(workbook, headsList, title,exportHeader);
    }
    
    


    private void initHeaderAndSheet(SXSSFWorkbook workbook, List<ExcelField> headList, String title ,String exportHeader) {
        // 生成一个(带标题)表格
        sheet = workbook.createSheet(title);
        //设置列宽
        int minBytes = 17;
        int headerSize = headList.size();
        int[] arrColWidth = new int[headerSize];
        // 产生表格标题行,以及设置列宽
        properties = new String[headerSize];
        headers = new String[headerSize];
        int ii = 0;
        int bytes = 0;
        for (ExcelField field : headList) {
            String fieldName = field.getName();
            properties[ii] = field.getValue();
            headers[ii] = fieldName ;
            if(ii == 0){
            	 bytes = fieldName.getBytes().length +17;
            }else{
            	 bytes = fieldName.getBytes().length;
            }
            arrColWidth[ii] = bytes < minBytes ? minBytes : bytes;
            sheet.setColumnWidth(ii, arrColWidth[ii] * 256);
            ii++;
        }

        Row titleRow = sheet.createRow(0);//表头 rowIndex=0
        titleRow.createCell(0).setCellValue(title);
        titleRow.getCell(0).setCellStyle(titleStyle);
        sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, headerSize - 1));   
        String [] condHeaders = exportHeader.split(",");
        String [] projcetNames = condHeaders[0].split(":");
        String [] objNames = condHeaders[1].split(":");
        
        Row condRow = sheet.createRow(2); //列头 rowIndex =1
        condRow.createCell(0).setCellValue(projcetNames[0].concat(":"));
        condRow.getCell(0).setCellStyle(headerTitle);
        sheet.addMergedRegion(new CellRangeAddress(2, 2, 0, 0));
        
        condRow.createCell(1).setCellValue(projcetNames[1]);
        condRow.getCell(1).setCellStyle(headerTitle);
        sheet.addMergedRegion(new CellRangeAddress(2, 2, 1, 2));
        int border = 1;
        RegionUtil.setBorderBottom(border, new CellRangeAddress(2, 2, 1, 2), sheet, workbook);
        RegionUtil.setBorderTop(border, new CellRangeAddress(2, 2, 1, 2), sheet, workbook);
        RegionUtil.setBorderLeft(border, new CellRangeAddress(2, 2, 1, 2), sheet, workbook);
        RegionUtil.setBorderRight(border, new CellRangeAddress(2, 2, 1, 2), sheet, workbook);
        
        
        condRow.createCell(3).setCellValue(objNames[0].concat(":"));
        condRow.getCell(3).setCellStyle(headerTitle);
        sheet.addMergedRegion(new CellRangeAddress(2, 2, 3,3));
        
        condRow.createCell(4).setCellValue(objNames[1]);
        condRow.getCell(4).setCellStyle(headerTitle);
        sheet.addMergedRegion(new CellRangeAddress(2, 2, 4, 4));
        
        
        Row headerRow = sheet.createRow(4); //列头 rowIndex =1
        for (int i = 0; i < headers.length; i++) {
            headerRow.createCell(i).setCellValue(headers[i]);
            headerRow.getCell(i).setCellStyle(headerStyle);

        }
    }

    /**
     * 读取 office 2003 excel 返回你一个你想要的对象列表(仅支持单个sheet)
     *
     * @param file
     * @param beginRowNum 开始读取的行数
     * @author caizq
     * @ 支持字符型与日期型单元格
     * @date 2017/10/27
     * @since v1.0.0
     */
    public static <T> List<T> read2003Excel(MultipartFile file, int beginRowNum, Class clazz)
            throws IOException, IllegalAccessException, InstantiationException, InvocationTargetException {
        HSSFWorkbook hwb = new HSSFWorkbook(file.getInputStream());
        HSSFSheet sheet = hwb.getSheetAt(0);
        T value = null;
        HSSFRow row = null;
        HSSFCell cell = null;
        int counter = 0;
        Field[] fields = clazz.getDeclaredFields();
        Method[] methods = clazz.getDeclaredMethods();
        List<T> list = new LinkedList<T>();
        for (int i = sheet.getFirstRowNum() + beginRowNum; counter < sheet
                .getPhysicalNumberOfRows(); i++) {
            row = sheet.getRow(i);
            if (row == null) {
                break;
            } else {
                counter++;
            }
            T obj = (T) clazz.newInstance();
            for (int j = row.getFirstCellNum(); j < fields.length; j++) {
                cell = row.getCell(j);
                if (cell == null) {
                    continue;
                }

                // 格式化 number String
                DecimalFormat df = new DecimalFormat("0");
                // 字符 格式化数字
                DecimalFormat nf = new DecimalFormat("0.00");
                switch (cell.getCellType()) {
                    case XSSFCell.CELL_TYPE_STRING:
                        setObjProperties(methods, fields[j], obj, cell.getStringCellValue().trim());
                        break;
                    case XSSFCell.CELL_TYPE_NUMERIC:
                        if ("@".equals(cell.getCellStyle().getDataFormatString())) {
                            setObjProperties(methods, fields[j], obj, df.format(cell.getNumericCellValue()));
                        } else if ("General".equals(cell.getCellStyle()
                                .getDataFormatString())) {
                            setObjProperties(methods, fields[j], obj, nf.format(cell.getNumericCellValue()));
                        } else {
                            setObjProperties(methods, fields[j], obj, HSSFDateUtil.getJavaDate(cell
                                    .getNumericCellValue()));
                        }
                        break;
                    //				case XSSFCell.CELL_TYPE_BOOLEAN:
                    //					value = cell.getBooleanCellValue();
                    //					break;
                    //				case XSSFCell.CELL_TYPE_BLANK:
                    //					value = "";
                    //					break;
                    default:
                        setObjProperties(methods, fields[j], obj, cell.toString().trim());
                }
            }
            if (checkObjFieldIsNotNull(obj)) {
                //整行不为空
                list.add(obj);
            }
        }
        return list;
    }

    private static boolean checkObjFieldIsNotNull(Object obj) {
        try {
            for (Field f : obj.getClass().getDeclaredFields()) {
                f.setAccessible(true);
                if (f.get(obj) != null) {
                    //是字符串类型
                    if (f.getType() == String.class && !StringUtils.isEmpty((String) f.get(obj))) {
                        return true;
                    }
                    //非字符串类型
                    else if (!(f.getType() == String.class)) {
                        return true;
                    }
                }

            }
        } catch (IllegalAccessException e) {
            //log.error("checkObjFieldIsNotNull error excel转换失败");
        }
        return false;
    }

    private static void setObjProperties(Method[] methods, Field field, Object obj, Object value)
            throws InvocationTargetException, IllegalAccessException {
        boolean done = false;
        for (int k = 0; k < methods.length; k++) {
            if (methods[k].getName().indexOf("set") == 0) {
                String setMethodName = methods[k].getName().substring(3, methods[k].getName().length());
                if (setMethodName.equalsIgnoreCase(field.getName())) {
                    //调用set方法
                    methods[k].invoke(obj, value);
                    done = true;
                    break;
                }
            }
            if (done) {
                done = true;
                break;
            }
        }
    }


    private static HSSFCellStyle getDateCellStyle(HSSFWorkbook wb) {
        HSSFCellStyle dateStyle = wb.createCellStyle(); // 日期单元格样式
        dateStyle.setAlignment(HSSFCellStyle.ALIGN_LEFT);
        HSSFFont dateFont = wb.createFont(); // 字体样式
        dateFont.setFontName("宋体"); // 字体
        dateFont.setFontHeightInPoints((short) 11); // 大小
        dateStyle.setFont(dateFont);
        return dateStyle;
    }

    public static String formatDate(Date date, String format) {
        String s = "";
        if (date != null) {
            SimpleDateFormat sdf = new SimpleDateFormat(format);
            s = sdf.format(date);
        }

        return s;
    }

    /**
     * 获取指定格式的当前系统日期
     *
     * @param format
     * @return
     */
    public static String getCurrentDate(String format) {
        SimpleDateFormat t = new SimpleDateFormat(format);
        return t.format(new Date());
    }
}
