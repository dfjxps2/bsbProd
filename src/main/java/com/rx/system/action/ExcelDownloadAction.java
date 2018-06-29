package com.rx.system.action;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;

import org.apache.struts2.ServletActionContext;

import com.rx.system.base.BaseDispatchAction;
import com.rx.system.constant.Constant;
/**
 * Excel文件下载Action
 * 服务器文件名为${user_id}.xls
 * @author chenxd
 *
 */
@SuppressWarnings("serial")
public class ExcelDownloadAction extends BaseDispatchAction {
	private String fileName = null;
	
	public String setParam() throws Exception {
		if(request.getParameter("file_name") != null)
//			this.fileName = new String(request.getParameter("file_name").getBytes("iso-8859-1"),"utf-8");
			this.fileName = request.getParameter("file_name");
		return "success";
	}
	
	public InputStream getDownloadInputStream() throws Exception{
		InputStream in = null;
		try {
			String webBasePath = ServletActionContext.getServletContext().getRealPath("/");
			String filePath = webBasePath + Constant.FILE_DOWNLOAD_DIR + getCurrentUser().getUser_id() + ".xls";
			in = new FileInputStream(new File(filePath));
		} catch (Exception e) {
			e.printStackTrace();
		}
		return in;
	}

	public String getFileName() {
		try {
			return new String(fileName.getBytes(),"iso-8859-1");
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		return "";
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}
}
