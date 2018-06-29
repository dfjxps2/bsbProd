package com.rx.system.action;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.rx.log.annotation.FunDesc;
import com.rx.log.annotation.UseLog;
import com.rx.system.base.BaseDispatchAction;
import com.rx.system.constant.Constant;
import com.rx.system.domain.SysUser;
import com.rx.system.service.IInitService;
import com.rx.util.tree.Tree;
import com.rx.util.tree.TreeNode;

/**
 * 初始页Action
 * @author chenxd
 *
 */
@SuppressWarnings("serial")
public class InitAction extends BaseDispatchAction {
	
	private IInitService initService = null;
	
	/**
	 * 返回默认页面
	 * @return
	 * @throws Exception
	 */
	@FunDesc(code="SYS_0022")
	public String defaultPage() throws Exception{
		try {
			Map<String, Object> paramMap = getRequestParam(request);
			SysUser user = this.getCurrentUser();
			paramMap.put("user_id", user.getUser_id());
			
			String[] urls = this.initService.queryInitUrl(paramMap);
			if(null != urls && urls.length == 2){
				request.setAttribute("initUrl", request.getContextPath() + urls[1]);
				request.setAttribute("urlName", urls[0]);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return "initPage";
	}
	
	/**
	 * 获取图形
	 * @return
	 * @throws Exception
	 */
	public String chart() throws Exception {
		try {
			Map<String, Object> paramMap = getRequestParam(request);
			paramMap.put("year_id", getStringValue(paramMap, "month_id").substring(0, 4));
//			paramMap.put("object_id", getCurrentUser().getUser_id());
			paramMap.put("object_id", "0700");
			
			request.setAttribute("width", getStringValue(paramMap, "width"));
			request.setAttribute("height", getStringValue(paramMap, "height"));
			
			List<Map<String, Object>> scoreList = this.initService.listYearSocre(paramMap);//积分趋势图
			request.setAttribute("scoreLineXML", getLineXml(scoreList));
			
			List<Map<String, Object>> orderList = this.initService.listYearOrder(paramMap);//排名趋势图
			request.setAttribute("orderLineXML", getLineXml(orderList));
			
			List<Map<String, Object>>  measureList = this.initService.listMeasureValue(paramMap);//指标完成值趋势图
			List<String> xmlList = new ArrayList<String>();
			while(measureList.size() > 0){
				Map<String, Object> baseMap = measureList.get(0);
				List<Map<String, Object>> measureGroupList = this.getGroupList(measureList, baseMap, new String[]{"measure_id"});
				if(measureGroupList.size() > 0) {
					String name = getStringValue(measureGroupList.get(0), "measure_name");
					xmlList.add(this.getSparkChartXml(name, measureGroupList));
				}
			}
			request.setAttribute("xmlList", xmlList);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return "init_chart";
	}
	
	/**
	 * 获取趋势图
	 * @param list
	 * @return
	 * @throws Exception
	 */
	private String getLineXml(List<Map<String, Object>> list) throws Exception {
		StringBuffer sb = new StringBuffer();
		sb.append("<chart ");
//		sb.append("xAxisName='月份' yAxisName='得分' ");
		sb.append("showValues='1' alternateHGridColor='FCB541' alternateHGridAlpha='20' ");
		sb.append("divLineColor='FCB541' divLineAlpha='50' canvasBorderColor='666666' ");
		sb.append("formatNumberScale='0' decimals='2' formatNumber='0' chartRightMargin='30' chartBottomMargin='30' ");
		sb.append("baseFontColor='666666' lineColor='FCB541'>");
		for (Map<String, Object> map : list) {
			String label = getStringValue(map, "label");
			String value = getStringValue(map, "val");
			sb.append("<set label='"+label+"' value='"+value+"' />");
		}
		sb.append("</chart>");
		return sb.toString();
	}
	
	private String getSparkChartXml(String name,List<Map<String, Object>> list) throws Exception {
		StringBuffer sb = new StringBuffer();
		sb.append("<chart caption='"+name+"' palette='1' canvasLeftMargin='300' formatNumberScale='0' decimals='2' formatNumber='1' showHighLowValue='0'>");
		sb.append("<dataset>");
		for (Map<String, Object> map : list) {
			sb.append("<set value='"+getStringValue(map, "val")+"' />");
		}
		sb.append("</dataset>");
		sb.append("</chart>");
		return sb.toString();
	}
	
	/**
	 * 从List中过滤出同给定Map中的字段值一致的记录
	 * @param list
	 * @param map
	 * @param keys
	 * @return
	 */
	private List<Map<String, Object>> getGroupList(List<Map<String, Object>> list,Map<String, Object> map,String[] keys) {
		List<Map<String, Object>> groupList = new ArrayList<Map<String,Object>>();
		
		for (int i = 0; i < list.size(); i++) {
			Map<String, Object> m = list.get(i);
			boolean b = true;
			for (int j = 0; j < keys.length; j++) {
				if(getStringValue(m, keys[j]).equals(getStringValue(map, keys[j])))
					continue;
				b = false;
				break;
			}
			if(b) {
				groupList.add(m);
				list.remove(m);
				i--;
			}
		}
		return groupList;
	}
	
	/**
	 * 设置初始页：获得当前用户登录菜单组成菜单树
	 * */
	@FunDesc(code="SYS_0023")
	@SuppressWarnings("unchecked")
	public String getResourceTree(){
		try {
			Map<String, Object> paramMap = getRequestParam(request);
			SysUser user = this.getCurrentUser();
			paramMap.put("user_id", user.getUser_id());
			StringBuffer sb = new StringBuffer();
			List<Tree> subTreeList = this.initService.getCurrentUserResourceList(paramMap).getTreeListByParentID(Constant.ROOT_RESOURCE_ID);
			sb.append("<tree id=\"\">");
			sb.append("<item id=\"root\" text=\"资源树\" open=\"1\" im0=\"tree.gif\" im1=\"tree.gif\" im2=\"tree.gif\" call=\"1\" >");
			for (int i = 0; i < subTreeList.size(); i++) {
				Tree childTree = subTreeList.get(i);
				sb.append(dealTree(childTree));
			}
			sb.append("</item>");
			sb.append("</tree>");
			super.doSuccessInfoResponse(sb.toString());
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	@SuppressWarnings("unchecked")
	private String dealTree(Tree tree) {
		StringBuffer sb = new StringBuffer();
		TreeNode node = tree.getRootNode();
		if (tree.getChildren().size() == 0)
			sb.append("<item id=\""
				+ node.getNodeID()
				+ "\" text=\""
				+ node.getNodeName()
				+ "\" open=\"1\" im0=\"leaf.gif\" im1=\"leaf.gif\" im2=\"leaf.gif\" call=\"1\" >");
		else
			sb.append("<item id=\"P"
				+ node.getNodeID()
				+ "\" text=\""
				+ node.getNodeName()
				+ "\" open=\"1\" im0=\"folderOpen.gif\" im1=\"folderOpen.gif\" im2=\"folderClosed.gif\" call=\"1\" >");
		List<Tree> subTreeList = tree.getChildren();
		for (int i = 0; i < subTreeList.size(); i++) {
			Tree subTree = subTreeList.get(i);
			sb.append(dealTree(subTree));
		}
		sb.append("</item>");
		return sb.toString();
	}
	
	@FunDesc(code="SYS_0024")
	@UseLog
	public String updateUserDefaultInitPage(){
		try {
			Map<String, Object> paramMap = getRequestParam(request);
			if(!"".equals(getStringValue(paramMap, "default_page"))){
				SysUser user = this.getCurrentUser();
				paramMap.put("user_id", user.getUser_id());
				this.initService.updateUserDefaultInitPage(paramMap);
			}
			this.doSuccessInfoResponse("操作成功");
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	public void setInitService(IInitService initService) {
		this.initService = initService;
	}

}
