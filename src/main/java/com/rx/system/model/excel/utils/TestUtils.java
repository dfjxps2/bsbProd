package com.rx.system.model.excel.utils;

import java.io.FileOutputStream;
import java.io.IOException;

import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellUtil;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

public class TestUtils {
    //每次往Excel写几条数据
    public static final int ROW_ACCESS_WINDOW_SIZE = 5000;
    public static void main(String [] args){
        try {
        	 createExcel2();
        } catch (Exception e) {
            e.printStackTrace();
        }

    }






        public static void createExcel2() throws IOException {
            XSSFWorkbook workbook1 = new XSSFWorkbook();
            SXSSFWorkbook sxssfWorkbook = new SXSSFWorkbook(workbook1, 100);
            Sheet first = sxssfWorkbook.createSheet();
            for (int i = 0; i < 1000; i++) {
                Row row = first.createRow(i);
                for (int j = 0; j < 600; j++) {
                    if(i == 0) {
                        // 首行
                        row.createCell(j).setCellValue("column" + j);
                    } else {
                        // 数据
                        if (j == 0) {
                            CellUtil.createCell(row, j, String.valueOf(i));
                        } else
                            CellUtil.createCell(row, j, String.valueOf(Math.random()));
                    }
                }
            }


        FileOutputStream out = new FileOutputStream("d:/x1.xlsx");
 //   FileOutputStream out = new FileOutputStream("D://workbook.xlsx");
            sxssfWorkbook.write(out);
            out.close();
    }



    public void createExcel()  throws Exception{
        Workbook workbook = new SXSSFWorkbook(1000);//最重要的就是使用SXSSFWorkbook，表示流的方式进行操作
        Sheet sheet = workbook.createSheet();
        CellStyle cellStyle = workbook.createCellStyle();
        // 居中
        cellStyle.setAlignment(CellStyle.ALIGN_CENTER);
        // 居中
        cellStyle.setAlignment(CellStyle.VERTICAL_CENTER);
        int rows = 5000;
        int cols = 2000;
        for(int row = 0;row < rows;row++) {
            Row writeRow = sheet.createRow(row);
            for(int col = 0;col < cols;col++) {
                org.apache.poi.ss.usermodel.Cell cell = writeRow.createCell(col);

                cell.setCellStyle(cellStyle);
                cell.setCellValue(row + "-" + col);
            }
        }

        FileOutputStream stream = new FileOutputStream("d:/x.xlsx");
        workbook.write(stream);//最终写入文件
        stream.close();
    }
}
