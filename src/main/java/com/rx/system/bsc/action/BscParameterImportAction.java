package com.rx.system.bsc.action;

import com.rx.log.annotation.FunDesc;
import com.rx.log.annotation.UseLog;
import com.rx.system.base.BaseDispatchAction;
import com.rx.system.constant.Constant;
import com.rx.system.util.ReadExcelData;

/**
 * 参数导入功能Action
 * @author zzm
 *
 */
@SuppressWarnings("unused")
public class BscParameterImportAction extends BaseDispatchAction {

	private static final long serialVersionUID = 1L;

	@FunDesc(code="BSC_0016")
	@UseLog
	public String execute() throws Exception {
		//文件上传
		String uploadPath = request.getSession().getServletContext().getRealPath("/") + Constant.UPLOAD_DIR;
		String fileName = request.getParameter("hiddenFile");
		try {

			ReadExcelData readExcelData = new ReadExcelData(uploadPath+fileName);
			String[][] data = null;
			data = readExcelData.getModelInSheetData();
			
			if(data.length<7){
				throw new Exception("EXCEL模板内容错误!");
			}
			
			//获取方案，角色，参数等信息
			String obj_cate_id = data[0][0].split(":")[1];
			String parameter_id = data[2][0].split(":")[1];
			
			System.out.println(obj_cate_id+":============:"+parameter_id);
			String ownerID = this.getCurrentUser().getOwner_org_id();
			String[] sqls = new String[data.length-4];
			//获取数据
			String objects = "";
			/*for(int i=7;i<data.length;i++){
				if(!objects.equals(""))
					objects += "','";
				String objectID = data[i][0];
				objects += objectID;
				String value = data[i][1];
				sqls[i-4] = "insert into kpi_param_value(parameter_id,project_id,object_id,value,role_id,owner_id) values "
					+"('"+parameterID+"','"+projectID+"','"+objectID+"','"+value+"','"+roleID+"','"+ownerID+"')";
			}*/
			/*if(sqls.length>0){
				sqls[0] = "delete from kpi_param_value where parameter_id='"+parameterID+"' "
						+"and project_id='"+projectID+"' and role_id='"+roleID+"' "
						+"and object_id in ('"+objects+"') ";
				BeanManager.getJdbcManager().batchUpdate(sqls);
			}*/

			doSuccessInfoResponse("操作成功");
		} catch (Exception e) {
			e.printStackTrace();
			doFailureInfoResponse("导入失败: "+e.getMessage());
		}
		return null;
	}

}
