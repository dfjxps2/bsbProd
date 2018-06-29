package com.rx.system.bsc.action;

import java.io.File;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.commons.io.FileUtils;

import com.rx.system.base.BaseDispatchAction;
import com.rx.system.constant.Constant;
import com.rx.system.domain.SysUser;

/**   
 * @author: zzm
 * @since: 
 * 导入EXCEL的Action类
 */
public class UploadFileAction extends BaseDispatchAction {
	private File uploadFile = null;
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/*
	 * 上传文件
	 */
	public String execute()
			throws Exception {
		response.setContentType("text/html;charset=UTF-8");
		
		System.out.println("------------------bscuploadFile----------------------");
		
		String uploadPath = request.getSession().getServletContext().getRealPath("/") + Constant.UPLOAD_DIR;
		
		String fileName = request.getParameter("fileName");
		String extfile = fileName.substring(fileName.indexOf("."));  //.xls
		
		String data = "";
		String pfileName = "";
		try {
			SysUser user =  getCurrentUser();
			Date d = new Date();
			DateFormat sdf = new SimpleDateFormat("yyyy-MM-dd_HH-mm-ss");
			pfileName = fileName.substring(0, fileName.lastIndexOf(".")) + "_" + user.getOwner_org_id() + "_" + sdf.format(d) + extfile;
						
			FileUtils.copyFile(this.uploadFile, new File(uploadPath + pfileName));

			System.out.println("文件名称："+uploadPath + pfileName);
			data = "{success:true,uploadfileName:'"+pfileName+"'}"; 
		} catch (Exception e) {
			e.printStackTrace();
			data = "{success:false}";
		}		
		System.out.println("------------------uploadFile----------------------end");
		response.getWriter().write(data);
		response.getWriter().flush();
		return null;
	}

	public File getUploadFile() {
		return uploadFile;
	}

	public void setUploadFile(File uploadFile) {
		this.uploadFile = uploadFile;
	}
}
