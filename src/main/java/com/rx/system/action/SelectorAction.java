package com.rx.system.action;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.beanutils.BeanUtils;

import com.rx.system.base.BaseDispatchAction;
import com.rx.system.domain.Bank;
import com.rx.system.domain.SysUser;
import com.rx.system.service.ISelectorService;
import com.rx.system.service.impl.DataStore;
import com.rx.util.tree.TreeNode;

public class SelectorAction extends BaseDispatchAction {
	
	private static final long serialVersionUID = 1L;
	
	private ISelectorService selectorService = null;
	
	private DataStore dataStore = null;

	/**
	 * 总行部门列表
	 *
	 * @return
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	public String listBankOrganization() throws Exception {
		response.setContentType("text/html;charset=UTF-8");

		SysUser user = (SysUser) request.getSession().getAttribute("currentUser");
		String bankOrgID = request.getParameter("bank_org_id");

		if (null == bankOrgID || "".equals(bankOrgID))
			bankOrgID = user.getBank_org_id();

		String mode = request.getParameter("mode");
		if (mode == null)
			mode = "Normal";

		TreeNode node = dataStore.getBankStore().getTreeNode(bankOrgID);
		List list = new ArrayList();
		if (mode.equalsIgnoreCase("DrillDown")) {

			List nodeList = dataStore.getBankStore().getChildrenNodes(node);
			for (int i = 0; i < nodeList.size(); i++) {
				Bank bank = (Bank) nodeList.get(i);
				Map map = BeanUtils.describe(bank);
				list.add(map);
			}
		} else if (mode.equalsIgnoreCase("DrillUP")) {
			if (bankOrgID.equals(user.getBank_org_id()))
				list.add(BeanUtils.describe(node));
			else {
				TreeNode parent = dataStore.getBankStore().getTreeNode(node.getParentNodeID());
				/*if (parent.getNodeID().equals("8888")) {
					parent = node;
				}*/
				if (parent.getNodeID().equals(user.getBank_org_id())) {
					list.add(BeanUtils.describe(parent));
				} else {
					List siblingList = dataStore.getBankStore().getSiblingNodes(parent);
					for (int i = 0; i < siblingList.size(); i++)
						list.add(BeanUtils.describe(siblingList.get(i)));
				}
			}
		} else if (mode.equalsIgnoreCase("Normal")) {
			list.add(BeanUtils.describe(node));
		}
		doJSONResponse(list);
		return null;
	}
	
	/**
	 * 获取可执行月份列表
	 * @return
	 * @throws Exception
	 */
	public String listMonth() throws Exception {
		String cycleType = this.request.getParameter("cycle_type");
		String projectId = this.request.getParameter("projectId");
		List<Map<String, Object>> dataList = null;
		if("00".equals(cycleType)){
			dataList = this.selectorService.queryForList("select distinct statt_mon cycle_id from h51_st_kpi_csum_m order by cycle_id desc");
			//dataList = this.selectorService.queryForList("select month_id cycle_id from dmd_month order by month_id desc");
			for (int i = 0; i < dataList.size(); i++) {
				Map<String, Object> row = dataList.get(i);
				String cycleID = getStringValue(row, "cycle_id");
				String cycleName = cycleID.substring(0, 4) + "年" + cycleID.substring(4) + "月";
				row.put("cycle_id", cycleID);
				row.put("cycle_name", cycleName);
			}
		}else if("02".equals(cycleType)){
//			dataList = this.selectorService.queryForList("select distinct statt_year cycle_id, statt_year || '年' cycle_name from h51_st_kpi_csum_y m order by statt_year desc ");

			dataList = this.selectorService.queryForList("select cycle_id as cycle_id,cycle_name as cycle_name from bsc_proj_stat_cyc where project_id='"+projectId+"'  order by cycle_id desc");

			//dataList = this.selectorService.queryForList("select distinct year_id cycle_id, year_id || '年' cycle_name from dmd_month m order by year_id desc ");
		}
		
		doJSONResponse(dataList);
		return null;
	}
	
	/**
	 * 考核对象类型
	 * @return
	 * @throws Exception
	 */
	public String listobjCate() throws Exception {
		List<Map<String, Object>> dataList = this.selectorService.queryForList("select * from bsc_obj_cate ");
	
		doJSONResponse(dataList);
		
		return null;
	}
	
	/*对象维度*/
	public String listDimension() throws Exception{
		List<Map<String, Object>> dataList = this.selectorService.queryForList("select * from bsc_dim_link ");
		doJSONResponse(dataList);
		return null;
	}
	
	
	/**
	 * 参数类型
	 * @return
	 * @throws Exception
	 */
	public String listParamType() throws Exception {
		
		SysUser user= (SysUser) session.getAttribute("currentUser");
		String ownerOrgId = user.getOwner_org_id();
		
		String param_type_id = " '00' ";
		if(!"8888".equals(ownerOrgId)){
			param_type_id = param_type_id+"," +" '01' ";
		}
		
		List<Map<String, Object>> dataList = this.selectorService.queryForList("select * from bsc_param_type t where t.param_type_id not in ("+ param_type_id +") order by t.param_type_id ");
		
		doJSONResponse(dataList);
		
		return null;		
	}
	
	/**
	 * 周期类型
	 * @return
	 * @throws Exception
	 */
	public String listProjCycleType() throws Exception {
//		List<Map<String, Object>> dataList = this.selectorService.queryForList("select * from bsc_proj_cycle_type ");
		List<Map<String, Object>> dataList = this.selectorService.queryForList("select * from bsc_proj_cycle_type e where e.cycle_type_id='02'");
		doJSONResponse(dataList);
		return null;
	}

	/**
	 * 周期类型
	 * @return
	 * @throws Exception
	 */
	public String listProjAppTypee() throws Exception {
		List<Map<String, Object>> dataList = this.selectorService.queryForList("select * from bsc_proj_app_type ");
		doJSONResponse(dataList);
		return null;
	}

	/**
	 * 年份查询，共年份下拉框使用
	 * @return
	 * @throws Exception
	 */
	public String listYear() throws Exception {
		List<Map<String, Object>> dataList = this.selectorService.queryForList("select distinct statt_year year_id, statt_year || '年' year_name from h51_st_kpi_csum_y m order by year_id desc ");
		doJSONResponse(dataList);
		return null;
	}	

	/**
	 * 周期下拉框
	 * @return
	 * @throws Exception
	 */
	public String listCycle() throws Exception {
		String cycleType = request.getParameter("cycle_type_id");
		List<Map<String, Object>> dataList = this.selectorService.queryForList("select * from bsc_cycle t where t.cycle_type_id = '"+ cycleType +"' order by t.cycle_id asc");
		doJSONResponse(dataList);
		return null;
	}		
	
	public void setSelectorService(ISelectorService selectorService) {
		this.selectorService = selectorService;
	}
	
	/**
	 * 归属条线下拉框
	 */
	public String listBusiLine() throws Exception {
		List<Map<String,Object>> dataList = this.selectorService.queryForList("select * from dmd_busi_line t ");
		doJSONResponse(dataList);
		return null;
	}
	
	/**
	 * 职位类型下拉框
	 */
	public String listJobTypeCode() throws Exception {
		List<Map<String,Object>> dataList = this.selectorService.queryForList("select * from bsc_emp_job_type t ");
		doJSONResponse(dataList);
		return null;
	}
	
	/**
	 * 镇街和部门下拉框
	 */
	public String listOrg() throws Exception {
		List<Map<String,Object>> dataList = this.selectorService.queryForList("select bank_org_id org_id,bank_org_name org_name from dmd_bank_inter_org t where bank_org_level in (2,3,4)");
		doJSONResponse(dataList);
		return null;
	}
	
	/**
	 * 获取树形结构路径
	 * @return
	 * @throws Exception
	 */
	public String getPath() throws Exception {
		Map<String,Object> map = this.getRequestParam(request);
		String obj_cate_id = map.get("obj_cate_id").toString();
		String pageIndex = map.get("pageindex").toString();
		StringBuffer sb = new StringBuffer();
		sb.append("select  usr_bsc_eng.getMeasureTreePath(measure_id) as path");
		sb.append(" from bsc_measure");
		sb.append(" where (measure_name like '%"+map.get("keyword")+"%' or measure_id like '%"+map.get("keyword")+"%')");
		sb.append("   and is_private = '"+map.get("is_private")+"'");
		if(!"".equals(obj_cate_id) && "2".equals(pageIndex)){
		sb.append("   and obj_cate_id = '"+obj_cate_id+"'");	
		}
		sb.append(" order by global_order_id");
		
		try {
			List<Map<String, Object>> dataList = this.selectorService.queryForList(sb.toString());
			
			doJSONResponse(dataList);
		} catch (Exception e) {
			
			e.printStackTrace();
		}
		
		return null;		
	}

	public void setDataStore(DataStore dataStore) {
		this.dataStore = dataStore;
	}
	
	/**
	 * 获取月份列表
	 * @return
	 * @throws Exception
	 */
	public String listMonths() throws Exception {
		List<Map<String, Object>> dataList = this.selectorService.queryForList("select distinct statt_mon mouth_id from h51_st_kpi_csum_m order by mouth_id desc");
			for (int i = 0; i < dataList.size(); i++) {
				Map<String, Object> row = dataList.get(i);
				String mouthID = getStringValue(row, "mouth_id");
				String mouthName = mouthID.substring(0, 4) + "年" + mouthID.substring(4) + "月";
				row.put("mouth_id", mouthID);
				row.put("mouth_name", mouthName);
			}
			Map<String, Object> map = new HashMap<String, Object>();
			SimpleDateFormat sdf_name = new SimpleDateFormat( "yyyy年MM月");
			SimpleDateFormat sdf_id = new SimpleDateFormat( "yyyyMM");
			map.put("mouth_id", sdf_id.format(new Date()));
			map.put("mouth_name", sdf_name.format(new Date()));
			dataList.add(0, map);
		doJSONResponse(dataList);
		return null;
	}
}
