package com.rx.system.bsc.action;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.rx.log.annotation.FunDesc;
import com.rx.log.annotation.UseLog;
import com.rx.system.base.BaseDispatchAction;
import com.rx.system.bsc.service.IDimLinkService;
import com.rx.system.domain.DimLink;

/**
 * 数据源分组字段Action
 * 
 * @author zzm
 * 
 */
@SuppressWarnings("serial")
public class DimLinkAction extends BaseDispatchAction {

	private IDimLinkService dimLinkService = null;

	/**
	 * 注入dimLinkService
	 * 
	 * @param dimLinkService
	 */
	public void setDimLinkService(IDimLinkService dimLinkService) {
		this.dimLinkService = dimLinkService;
	}

	/**
	 * 添加数据源分组字段
	 * 
	 * @return
	 * @throws Exception
	 */
	@FunDesc(code="BSC_0034")
	@UseLog
	public String add() throws Exception {
		DimLink dimLink = this.getParamObject(DimLink.class);
		try {
			if ("N".equals(dimLink.getIs_tree())) {
				dimLink.setParent_id_field("");
				dimLink.setRoot_value("");
			}
			this.dimLinkService.addDimLink(dimLink);
			doSuccessInfoResponse("添加成功");
		} catch (Exception e) {
			e.printStackTrace();
			doFailureInfoResponse("添加失败:" + e.getMessage());
		}
		return null;
	}

	/**
	 * 删除数据源分组字段
	 * 
	 * @return
	 * @throws Exception
	 */
	@FunDesc(code="BSC_0035")
	@UseLog
	public String delete() throws Exception {
		String link_id = request.getParameter("link_id");
		try {
			this.dimLinkService.deleteDimLink(link_id);
			doSuccessInfoResponse("删除成功");
		} catch (Exception e) {
			e.printStackTrace();
			doFailureInfoResponse("删除失败:" + e.getMessage());
		}
		return null;
	}

	/**
	 * 修改数据源分组字段属性
	 * 
	 * @return
	 * @throws Exception
	 */
	@FunDesc(code="BSC_0036")
	@UseLog
	public String edit() throws Exception {
		DimLink dimLink = this.getParamObject(DimLink.class);
		try {
			if ("N".equals(dimLink.getIs_tree())) {
				dimLink.setParent_id_field("");
				dimLink.setRoot_value("");
			}
			this.dimLinkService.editDimLink(dimLink);
			doSuccessInfoResponse("修改成功");
		} catch (Exception e) {
			e.printStackTrace();
			doFailureInfoResponse("修改失败:" + e.getMessage());
		}
		return null;
	}

	/**
	 * 查询分组对象列表
	 * 
	 * @return
	 * @throws Exception
	 */
	@FunDesc(code="BSC_0037")
	@UseLog
	public String list() throws Exception {
		Map<String, Object> paramMap = this.getRequestParam(request);
		insertPageParamToMap(paramMap);
		try {
			this.setTotalCountToRequest(this.dimLinkService.queryDimLinkListCount(paramMap));
			doJSONResponse(this.dimLinkService.queryDimLinkList(paramMap));
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * 查询分组对象表达式明细
	 * 
	 * @return
	 * @throws Exception
	 */
	@FunDesc(code="BSC_0038")
	@UseLog
	public String listExpressionDetail() throws Exception {
		Map<String, Object> paramMap = this.getRequestParam(request);
		this.insertPageParamToMap(paramMap);
		try {
			List<DimLink> dimLinkList = this.dimLinkService.queryDimLinkList(paramMap);
			if (dimLinkList.size() > 0) {
				doJSONResponse(this.dimLinkService.queryFieldDetail(dimLinkList.get(0)));
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * 树形显示查询
	 * 
	 * @return
	 * @throws Exception
	 */
	@FunDesc(code="BSC_0039")
	@UseLog
	public String expandDimLinkTree() throws Exception {
		String nodeId = request.getParameter("parentNodeID");
		String linkId = request.getParameter("linkId");
		Map<String, String> paramsMap = new HashMap<String, String>();

		paramsMap.put("nodeId", nodeId);
		paramsMap.put("linkId", linkId);

		doJSONResponse(this.dimLinkService.queryForDimTree(paramsMap));
		return null;
	}

	/**
	 * 查询rootName
	 * 
	 * @return
	 * @throws Exception
	 */
	public String findRootName() throws Exception {
		String linkId = request.getParameter("linkId");
		Map<String, String> paramsMap = new HashMap<String, String>();

		paramsMap.put("linkId", linkId);

		doJSONResponse(this.dimLinkService.findRootName(paramsMap));
		return null;
	}
	
	/**
	 * 异步校验
	 */
	public String checkLink() throws Exception{
		Map<String,Object> paramMap = this.getRequestParam(request);
		int v = this.dimLinkService.checkLink(paramMap);
		if(v>0){
			doFailureInfoResponse("对不起,维护ID["+paramMap.get("link_id")+"]已存在,请重新输入!");
		}else{
			doSuccessInfoResponse("验证成功,该维护ID可用!");
		}
			
		return null;
	}


	/**
	 * 查询分组对象表达式明细
	 *
	 * @return
	 * @throws Exception
	 */
	@FunDesc(code="BSC_0038")
	@UseLog
	public String getObjectList() throws Exception {
		Map<String, Object> paramMap = this.getRequestParam(request);
		try {
			List<Map<String,Object>> dataList = this.dimLinkService.getObjectList(paramMap);
			doJSONResponse(dataList);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

}
