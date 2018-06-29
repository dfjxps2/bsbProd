package com.rx.system.bsc.action;

import java.util.List;
import java.util.Map;

import com.rx.log.annotation.FunDesc;
import com.rx.log.annotation.UseLog;
import com.rx.system.base.BaseDispatchAction;
import com.rx.system.bsc.service.IDataSourceConfigService;
import com.rx.system.domain.DataSource;
import com.rx.system.util.GlobalUtil;

/**
 * bsc_datasource:数据源配置
 * <b>Date:</b>Jun 26, 2013<br>
 * @author wangfl
 * @version $Revision$
 */
@SuppressWarnings("serial")
public class DataSourceConfigAction extends BaseDispatchAction {

    private IDataSourceConfigService dataSourceConfigService = null;

    /**
     * 添加数据源
     * @return
     * @throws Exception
     */
    @FunDesc(code="BSC_0026")
	@UseLog
    public String add() throws Exception {
        try {
            DataSource dataSource = this.getParamObject(DataSource.class);
            this.dataSourceConfigService.addDataSource(dataSource);
            doSuccessInfoResponse("添加成功");
        }
        catch (Exception e) {
            e.printStackTrace();
            doFailureInfoResponse("添加失败：" + e.getMessage());
        }
        return null;
    }

    /**
     * 编辑数据源属性
     * @return
     * @throws Exception
     */
    @FunDesc(code="BSC_0027")
	@UseLog
    public String edit() throws Exception {
        try {
            DataSource dataSource = this.getParamObject(DataSource.class);
            this.dataSourceConfigService.editDataSource(dataSource);
            doSuccessInfoResponse("修改成功");
        }
        catch (Exception e) {
            e.printStackTrace();
            doFailureInfoResponse("修改失败：" + e.getMessage());
        }
        return null;
    }

    /**
     * 删除数据源记录
     * @return
     * @throws Exception
     */
    @FunDesc(code="BSC_0028")
	@UseLog
    public String delete() throws Exception {
        try {
            String sourceId = request.getParameter("source_id");
            this.dataSourceConfigService.removeDataSource(sourceId);
            doSuccessInfoResponse("删除成功");
        }
        catch (Exception e) {
            e.printStackTrace();
            doFailureInfoResponse("删除失败：" + e.getMessage());
        }
        return null;
    }

    /**
     * 查询数据源记录
     * @return
     * @throws Exception
     */
    @FunDesc(code="BSC_0029")
	@UseLog
    public String list() throws Exception {
        Map<String, Object> paramMap = this.getRequestParam(request);
        this.insertPageParamToMap(paramMap);
        try {
            List<DataSource> sourceList = this.dataSourceConfigService.listDataSource(paramMap);
            //Integer total = this.dataSourceConfigService.listDataSourceCount(paramMap);
            //request.setAttribute("total", total);
            doJSONResponse(sourceList);
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 添加数据源字段
     * @return
     * @throws Exception
     */
    @FunDesc(code="BSC_0030")
	@UseLog
    public String sourceFieldAdd() throws Exception {
        try {
            Map<String, Object> paramMap = this.getRequestParam(request);
            if (request.getParameter("link_id") == null)
                paramMap.put("link_id", "");
            this.dataSourceConfigService.addDataSourceField(paramMap);
            doSuccessInfoResponse("添加成功");
        }
        catch (Exception e) {
            e.printStackTrace();
            doFailureInfoResponse("添加失败：" + e.getMessage());
        }
        return null;
    }

    /**
     * 编辑数据源字段属性
     * @return
     * @throws Exception
     */
    @FunDesc(code="BSC_0031")
	@UseLog
    public String sourceFieldEdit() throws Exception {
        try {
            Map<String, Object> paramMap = this.getRequestParam(request);
            if (request.getParameter("link_id") == null)
                paramMap.put("link_id", "");
            this.dataSourceConfigService.editDataSourceField(paramMap);
            doSuccessInfoResponse("修改成功");
        }
        catch (Exception e) {
            e.printStackTrace();
            doFailureInfoResponse("修改失败：" + e.getMessage());
        }
        return null;
    }

    /**
     * 删除数据源字段记录
     * @return
     * @throws Exception
     */
    @FunDesc(code="BSC_0032")
	@UseLog
    public String sourceFieldDelete() throws Exception {
        try {
            this.dataSourceConfigService.deleteDataSourceField(this.getRequestParam(request));
            doSuccessInfoResponse("删除成功");
        }
        catch (Exception e) {
            e.printStackTrace();
            doFailureInfoResponse("删除失败：" + e.getMessage());
        }
        return null;
    }

    /**
     * 查询数据源字段记录
     * @return
     * @throws Exception
     */
    @FunDesc(code="BSC_0033")
	@UseLog
    public String sourceFieldList() throws Exception {
        Map<String, Object> paramMap = this.getRequestParam(request);
        try {
        	List<Map<String,Object>> paramList = this.dataSourceConfigService.listDataSourceField(paramMap);
        	for(Map<String,Object> m : paramList){
        		m.put("mea_fullname", "[" + m.get("column_name") + "] " + m.get("column_biz_name"));
        		m.put("dim_fullname", "[" + m.get("column_name") + "] " + m.get("column_biz_name"));
        		
        		//判断是否加密功能id
        		String rid = "BSC20_10_05";
        		if("0".equals(session.getAttribute("isDirect"))){
        			rid = GlobalUtil.encryptValStr(session.getId(), "BSC20_10_05");
        		}
        		if(null != request.getParameter("type") && "dataConfig".equals(request.getParameter("type"))){
            		if(null != m.get("link_id") && !"".equals(m.get("link_id")))
        			m.put("link_name_in_dataconfig", "<a href=\"javascript:void(0);\" onclick = \"gotoPage('"+rid+"','/bsc/pages/bsc_dim_link.jsp?link_id=" + m.get("link_id") + "')\">" + m.get("link_name") + "</a>");
            	}
        	}
            doJSONResponse(paramList);
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public IDataSourceConfigService getDataSourceConfigService() {
        return dataSourceConfigService;
    }

    public void setDataSourceConfigService(IDataSourceConfigService dataSourceConfigService) {
        this.dataSourceConfigService = dataSourceConfigService;
    }

    /**
     * 
     * 查询考核对象类型 数据
     * 
     * @throws Exception
     * @author: wangfl
     */
    public void queryObjCate() throws Exception {
        try {
            List<Map<String, Object>> list = this.dataSourceConfigService.queryObjCate();
            doJSONResponse(GlobalUtil.lowercaseListMapKey(list));
        }
        catch (Exception e) {
            e.printStackTrace();
        }

    }

    /**
     * 
     * 参数链接 数据
     * 
     * @throws Exception
     * @author: wangfl
     */
    public void queryDimLink() throws Exception {
        try {
            List<Map<String, Object>> list = this.dataSourceConfigService.queryDimLink();
            doJSONResponse(GlobalUtil.lowercaseListMapKey(list));
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 
     * 查询字段 数据
     * 
     * @throws Exception
     * @author: wangfl
     */
    public void queryDataType() throws Exception {
        try {
            List<Map<String, Object>> list = this.dataSourceConfigService.queryDataType();
            doJSONResponse(GlobalUtil.lowercaseListMapKey(list));
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    /**
     * 根据数据源表达式得到此表达式中涉及的所有--字段名、字段类型、字段数序
     * */
    public void getSorExpFields(){
    	String exp = request.getParameter("source_exp");
    	String id = request.getParameter("source_id");
    	if(null != exp && !"".equals(exp)){
			try {
				List<Map<String, Object>> list = this.dataSourceConfigService.getSorExpFields(exp,id);
				doJSONResponse(list);
			} catch (Exception e) {
				e.printStackTrace();
			}
    	}
    }
    
    /**
     * 校验添加时ID是否存在
     * @return
     * @throws Exception
     */
    public String hasSourceID() throws Exception{
		Map<String, Object> paramMap = this.getRequestParam(request);
		if(this.dataSourceConfigService.hasSourceID(paramMap))
			doSuccessInfoResponse("存在该数据源ID");
		else
			doFailureInfoResponse("不存在该数据源ID");
		return null;
	}
    
    public String hasSourceName() throws Exception{
		Map<String, Object> paramMap = this.getRequestParam(request);
		if(this.dataSourceConfigService.hasSourceName(paramMap))
			doSuccessInfoResponse("存在该数据源名称");
		else
			doFailureInfoResponse("不存在该数据源名称");
		return null;
	}
    
    public String editHasSourceName() throws Exception{
		Map<String, Object> paramMap = this.getRequestParam(request);
		if(this.dataSourceConfigService.editHasSourceName(paramMap))
			doSuccessInfoResponse("存在该数据源名称");
		else
			doFailureInfoResponse("不存在该数据源名称");
		return null;
	}
}
