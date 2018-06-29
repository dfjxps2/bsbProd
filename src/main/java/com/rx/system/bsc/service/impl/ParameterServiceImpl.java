package com.rx.system.bsc.service.impl;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.Types;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.rx.system.base.BaseService;
import com.rx.system.bsc.dao.ParameterDao;
import com.rx.system.bsc.service.IParameterService;
import com.rx.system.constant.Constant;
import com.rx.system.domain.BscOwnObjPara;
import com.rx.system.domain.BscParameter;
import com.rx.system.util.ReadExcelData;

/**
 * 考核参数Service实现类
 * @author chenxd
 *
 */
public class ParameterServiceImpl extends BaseService implements IParameterService{
	
	private ParameterDao bscParameterDao = null;

	public void setBscParameterDao(ParameterDao bscParameterDao) {
		this.bscParameterDao = bscParameterDao;
	}
	
	//根据参数param_id ,owner_id获取参数对象
	public List<BscParameter> getParameterById(Map<String, Object> paramMap) throws Exception {
		return this.bscParameterDao.getParameterById(paramMap);
	}
	
	//查询考核参数列表
	public List<BscParameter> listParameter(Map<String, Object> paramMap) throws Exception {
		return this.bscParameterDao.listParameter(paramMap);
	}

	//添加考核参数add by zzm
	public void addParameter(Map<String, Object> paramMap) throws Exception {
		List<BscParameter> list =bscParameterDao.getParameterById(paramMap);
		
		if(list.size()>0){
			throw new Exception("参数ID为["+paramMap.get("parameter_id")+"]的参数已存在.");
		}
		this.bscParameterDao.addParameter(paramMap);
	}

	//通过id修改考核参数
	public void updateParameter(Map<String, Object> paramMap) throws Exception {
		this.bscParameterDao.updateParameter(paramMap);
	}

	//通过id删除考核参数
	public Map<String,Object> deleteParameter(Map<String, Object> paramMap) throws Exception {
		
		Map<String,Object> resultMap = new HashMap<String,Object>();
		CallableStatement statement = null;
		Connection conn = null;
		String result = "";
		try{
			conn = this.jdbcManager.getConnection();
			statement = conn.prepareCall("{call usr_bsc_eng.findParameterRelationship(?,?,',',';')}");
			
			statement.setString(1, paramMap.get("parameter_id").toString());
			statement.registerOutParameter(2, Types.VARCHAR);
			statement.execute();
			result = statement.getString(2);
			if(result!=null){
				throw new Exception(result);
			}
		}catch(Exception e ){
//			e.printStackTrace();
			String info = this.parsetoString(e.getMessage());
			resultMap.put("info", info);
			resultMap.put("success", Boolean.valueOf(false));
			return resultMap;
		}finally{
			if(statement!=null)
				statement.close();
			if(conn!=null && !conn.isClosed())
				conn.close();
		}
		this.bscParameterDao.deleteParameter(paramMap);
		resultMap.put("success", Boolean.valueOf(true));
		return resultMap;
	}
	
	//保存考核参数明细列表
	public void saveItem(Map<String, Object> paramMap) throws Exception {
		String ids = paramMap.get("object_id").toString();
		String[] objectIds = ids.split(";");
		paramMap.put("objectIds", objectIds);
		
		bscParameterDao.deleteItem(paramMap) ;
		
		String object_id = "";
		for (int i = 0; i < objectIds.length; i++) {
			object_id = objectIds[i];
			paramMap.put("object_id", object_id);
			bscParameterDao.saveItem(paramMap);
		}

	}

	//通过itemIds删除itmes
	public void deleteItem (Map<String, Object> paramMap) throws Exception{
		String ids = paramMap.get("object_id").toString();
		String[] objectIds = ids.split(";");
		paramMap.put("objectIds", objectIds);
		
		bscParameterDao.deleteItem(paramMap) ;
	}
	
	//通过project_id,parameter_id,role_id查询考核参数明细列表
	public List<BscOwnObjPara> listItems(Map<String, Object> paramMap)
			throws Exception {
		return bscParameterDao.listItems(paramMap);
	}
	
	//查找所有考核对象列表
	public List<BscOwnObjPara> listObjects(Map<String, Object> paramMap)
			throws Exception {
		return bscParameterDao.listObjects(paramMap);
	}
	
	//查找所有考核对象列表总条数
	public int listObjectsTotalCount(Map<String, Object> paramMap) throws Exception {
		return bscParameterDao.listObjectsTotalCount(paramMap);
	}
	
	//校验导入参数
	public void checkImportData(Map<String, Object> paramMap) throws Exception {
//		String uploadPath = request.getSession().getServletContext().getRealPath("/") + Constant.UPLOAD_DIR;
		String fullFileName=paramMap.get("hiddenFile").toString();
		String uploadPath=paramMap.get("RealPath")+ Constant.UPLOAD_DIR;
		
		List<Map<String,Object>> resList = new ArrayList<Map<String, Object>>();
		
		ReadExcelData red = new ReadExcelData(uploadPath+fullFileName);
		String[][] excelData = red.getAppointSheetData();
		int dataLength = excelData.length;
		
		for (int i = 7; i < dataLength; i++) {
			// 记录行号
			int lineNo = i + 1;
			// 读数据
			String objectId = "";
			String value = "";
			try {
				objectId = excelData[i][0] == null ? "" : excelData[i][0].trim();
				value = excelData[i][1] == null ? "" : excelData[i][1].trim();
			} catch (Exception e) {

			}
			// 验证
			try {
				if ("".equals(objectId)) {
					throw new Exception("对象代码为空！");
				}
				if ("".equals(value)) {
					throw new Exception("参数值为空！");
				}
				try {
					Double.parseDouble(value);
				} catch (NumberFormatException e) {
					throw new Exception("参数值只能为数字类型数据！");
				}
			} catch (Exception e) {
				e.printStackTrace();
				Map<String, Object> resMap = new HashMap<String, Object>();
				resMap.put("failed_reason", e.getMessage());
				resMap.put("line_no", lineNo);
				resList.add(resMap);
			}
		}
		
		if(resList.size()>0){
			StringBuffer failedData = new StringBuffer("[");
			for(int i=0;i<resList.size();i++){
				Map<String, Object>  map = resList.get(i);
				if(i == resList.size()-1){
					failedData.append("[" + map.get("line_no") + ",'" + map.get("failed_reason") + "']");
				}else{
					failedData.append("[" + map.get("line_no") + ",'" + map.get("failed_reason") + "'],");
				}
			}
			failedData.append("]");
			throw new Exception(failedData.toString());
		}
		
	}

	public void importData(Map<String, Object> paramMap) throws Exception {
	}

	public void examineID(Map<String, Object> paramMap) throws Exception {
		List<BscParameter> list = bscParameterDao.getParameterById(paramMap);

		if (list.size() > 0) {
			throw new Exception("参数ID为[" + paramMap.get("parameter_id") + "]的参数已存在.");
		}
	}
	
}
