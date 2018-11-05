package com.rx.system.model.excel.service;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


public class ModelExportToExcelService extends HttpServlet {

	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		/*response.setContentType("text/html;charset=UTF-8");
		//System.out.println(request.getCharacterEncoding());
		//页面取�??
        String tableHeader=request.getParameter("tableHeader");
        String tableColumnAlign=request.getParameter("tableColumnAlign");
        String tableInitCellWidth=request.getParameter("tableInitCellWidth");
        String tableData=request.getParameter("tableData");
        String tableTitle=request.getParameter("tableTitle");
        String tableTitleHelp=request.getParameter("tableTitleHelp");
        
        String useNew = request.getParameter("user_new");
        
        String exportHeader=request.getParameter("exportHeader"); 
        if(exportHeader!=null&&exportHeader.length()>0)
        	exportHeader=exportHeader.substring(0,exportHeader.lastIndexOf(";"));
        //tableHeader=StringUtil.unescape2(tableHeader);
        //tableData=StringUtil.unescape2(tableData);
        //tableTitle=StringUtil.unescape2(tableTitle);
        //exportHeader=StringUtil.unescape2(exportHeader);
        //tableData=new String(tableData.getBytes("GBK"),"UTF-8");
        
        //System.out.println(tableHeader);
        //System.out.println(tableData);
        //System.out.println(tableTitle);
        //System.out.println(exportHeader);
        
        HSSFWorkbook workbook = null;
        if("true".equals(useNew))
        	workbook = ModelExportUtil.getWorkBook2(tableHeader, tableColumnAlign,tableInitCellWidth, tableData,tableTitle,tableTitleHelp,exportHeader);
        else
        	workbook = ModelExportUtil.getWorkBook(tableHeader, tableColumnAlign,tableInitCellWidth, tableData,tableTitle,tableTitleHelp,"");
        response.setContentType ("application/ms-excel") ;
        //response.setContentType("application/x-download;charset=GBK");
        response.setHeader("Content-Disposition", "attachment; filename=" + new String(tableTitle.getBytes(),"iso-8859-1") + ".xls");
		
		OutputStream stream = response.getOutputStream();
		try {

			workbook.write(stream);
		} catch (Exception e) {
			e.printStackTrace();
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
*/
	}

	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doPost(request,response);
	}

	/**
	 * Constructor of the object.
	 */
	public ModelExportToExcelService() {
		super();
	}

	/**
	 * Destruction of the servlet. <br>
	 */
	public void destroy() {
		super.destroy(); 
		// Put your code here
	}
}
