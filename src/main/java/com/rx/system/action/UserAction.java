package com.rx.system.action;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.rx.log.annotation.FunDesc;
import com.rx.log.annotation.UseLog;
import com.rx.system.base.BaseDispatchAction;
import com.rx.system.bsc.synchrodata.CookieUtil;
import com.rx.system.bsc.synchrodata.SynchronizedDataConstants;
import com.rx.system.bsc.synchrodata.WebClient;
import com.rx.system.constant.Constant;
import com.rx.system.domain.SysUser;
import com.rx.system.service.IUserService;
import com.rx.util.tree.Tree;
import com.rx.util.tree.TreeNode;
/**
 * 系统用户Action
 * @author chenxd
 *
 */
public class UserAction extends BaseDispatchAction {
	
	private static final long serialVersionUID = 1L;
	
	private IUserService userService = null;
	
	/**
	 * 查询用户列表
	 * @return
	 * @throws Exception
	 */
	@FunDesc(code="SYS_0014")
	@UseLog
	public String list()throws Exception {
		Map<String, Object> paramMap = getRequestParam(request);
		try {
			List<Map<String, Object>> userList = userService.listUsers(insertPageParamToMap(paramMap));
			setTotalCountToRequest(userService.getTotalNum());
			
			doJSONResponse(userList);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	/**
	 * 获取用户详细信息
	 * @return
	 * @throws Exception
	 */
	@FunDesc(code="SYS_0015")
	@UseLog
	public String get()throws Exception{
		String user_id = request.getParameter("user_id");
		try {
			SysUser user = userService.findUserById(user_id);
			List<SysUser> dataList = new ArrayList<SysUser>();
			dataList.add(user);
			doJSONResponse(dataList);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	/**
	 * 添加用户
	 * @return
	 * @throws Exception
	 */
	@FunDesc(code="SYS_0016")
	@UseLog
	public String add()throws Exception {
		SysUser user = getParamObject(SysUser.class);
		try {
			userService.addUser(user);
			doSuccessInfoResponse("添加成功");
		} catch (Exception e) {
			e.printStackTrace();
			doFailureInfoResponse("添加失败:"+e.getMessage());
		}
		return null;
	}
	
	/**
	 * 修改用户信息
	 * @return
	 * @throws Exception
	 */
	@FunDesc(code="SYS_0017")
	@UseLog
	public String edit()throws Exception {
		SysUser user = getParamObject(SysUser.class);
		try {
			userService.modifyUser(request,user);
			doSuccessInfoResponse("修改成功");
		} catch (Exception e) {
			e.printStackTrace();
			doFailureInfoResponse("修改失败:"+e.getMessage());
		}
		return null;
	}
	
	/**
	 * 删除用户记录
	 * @return
	 * @throws Exception
	 */
	@FunDesc(code="SYS_0018")
	@UseLog
	public String delete()throws Exception {
		SysUser user = getParamObject(SysUser.class);
		try {
			userService.removeUser(user.getUser_id());
			doSuccessInfoResponse("删除成功");
		} catch (Exception e) {
			e.printStackTrace();
			doFailureInfoResponse("删除失败:"+e.getMessage());
		}
		return null;
	}
	
	/**
	 * 获取用户角色列表
	 * @return
	 * @throws Exception
	 */
	@FunDesc(code="SYS_0019")
	@UseLog
	public String getRole()throws Exception {
		try {
			Map<String,Object> paramMap = super.getRequestParam(request);
			List<Map<String, Object>> userList = userService.getUserRole(paramMap);
			doJSONResponse(userList);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	/**
	 * 保存用户角色
	 * @return
	 * @throws Exception
	 */
	@FunDesc(code="SYS_0020")
	@UseLog
	public String saveRole()throws Exception {
		SysUser user = getParamObject(SysUser.class);
		String idStr = request.getParameter("role_id");
		idStr = idStr == null ? "" : idStr;
		try {
			userService.saveUserRole(user, idStr.split(","));
			doSuccessInfoResponse("操作成功");
		} catch (Exception e) {
			doFailureInfoResponse("操作失败:"+e.getMessage());
		}
		return null;
	}
	
	public String checkPassword() throws Exception{
		String  check_password = request.getParameter("password");
		SysUser user = (SysUser)session.getAttribute("currentUser");
		user.setPassword(check_password);
		int v = userService.checkPassword(user);
		if(v>0){
			doSuccessInfoResponse("原密码输入正确");
		}else{
			doFailureInfoResponse("原密码输入错误");
		}
		return null;
	}
	
	/**
	 * 修改用户密码
	 * @return
	 * @throws Exception
	 */
	@FunDesc(code="SYS_0021")
	@UseLog
	public String modifyPassword() throws Exception {
		String password = request.getParameter("password");
		try {
			SysUser user=(SysUser)request.getSession().getAttribute("currentUser");
			Map<String, Object> paramMap = new HashMap<String, Object>();
			paramMap.put("password", password);
			paramMap.put("user_id", user.getUser_id());
			userService.modifyPassword(paramMap);
			doSuccessInfoResponse("修改成功");
		} catch (Exception e) {
			e.printStackTrace();
			doFailureInfoResponse("修改失败:"+e.getMessage());
		}
		return null;
	}
	
	/**
	 * 组装特殊授权菜单树
	 * */
	@FunDesc(code="SYS_0023")
	@SuppressWarnings("unchecked")
	public String getResourceTree(){
		String casUserId = CookieUtil.getValue(request,SynchronizedDataConstants.CAS_LOGIN_USER);
		System.out.println("----------------cas--------="+casUserId);
		System.out.println("&&&&&&&&&&&&&&&&&&&&&&&&&&cas--------="+casUserId);
		try {
			Map<String, Object> paramMap = getRequestParam(request);
			paramMap.put("current_user_id", this.getCurrentUser().getUser_id());
			StringBuffer sb = new StringBuffer();
			//获得当前用户的菜单树
			List<Tree> subTreeList = this.userService.getCurrentUserResourceList(paramMap).getTreeListByParentID(Constant.ROOT_RESOURCE_ID);
			//获得待分配用户已经拥有的菜单id列表
			Map<String,String> speciallyResource = this.userService.getSpeciallyResource(paramMap);
			sb.append("<tree id=\"\">");
			sb.append("<item id=\"root\" text=\"资源树\" open=\"1\" im0=\"tree.gif\" im1=\"tree.gif\" im2=\"tree.gif\" call=\"1\" >");
			for (int i = 0; i < subTreeList.size(); i++) {
				Tree childTree = subTreeList.get(i);
				sb.append(dealTree(childTree,speciallyResource));
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
	private String dealTree(Tree tree,Map<String,String> speciallyResource) {
		StringBuffer sb = new StringBuffer();
		TreeNode node = tree.getRootNode();
		if (tree.getChildren().size() == 0)
			sb.append("<item id=\""
				+ node.getNodeID()
				+ "\" text=\""
				+ node.getNodeName()
				+ "\" open=\"1\" im0=\"leaf.gif\" im1=\"leaf.gif\" im2=\"leaf.gif\" call=\"1\" "+(speciallyResource.containsKey(node.getNodeID()) ? "checked=\"1\"" : "")+">");
		else
			sb.append("<item id=\""
				+ node.getNodeID()
				+ "\" text=\""
				+ node.getNodeName()
				+ "\" open=\"1\" im0=\"folderOpen.gif\" im1=\"folderOpen.gif\" im2=\"folderClosed.gif\" call=\"1\" "+(speciallyResource.containsKey(node.getNodeID()) ? "checked=\"1\"" : "")+">");
		
		List<Tree> subTreeList = tree.getChildren();
		for (int i = 0; i < subTreeList.size(); i++) {
			Tree subTree = subTreeList.get(i);
			sb.append(dealTree(subTree,speciallyResource));
		}
		sb.append("</item>");
		return sb.toString();
	}
	
	
	/**
	 * 保存特殊授权
	 * @throws Exception 
	 * */
	public String saveSpeciallyAuthorize() throws Exception{
		try{
			Map<String, Object> paramMap = getRequestParam(request);
			paramMap.put("current_user_id", this.getCurrentUser().getUser_id());
			
			this.userService.saveSpeciallyAuthorize(paramMap);
			this.doSuccessInfoResponse("操作成功!");
		}catch(Exception e){
			e.printStackTrace();
			this.doFailureInfoResponse("操作失败!");
		}
		return null;
	}



	/**
	 * 同步用户数据
	 * @return
	 * @throws Exception
	 */
	@FunDesc(code="SYS_0014")
	@UseLog
	public String synchronizedUserData()throws Exception {
		List<Map<String,Object>> retList = null;
		Map<String, Object> paramMap = new HashMap<String, Object>();
		String propertyStat = request.getParameter("property");
		String operationName = null;
		if(SynchronizedDataConstants.SYNC_USER_PROPERTY.equals(propertyStat)){
			String userID = request.getParameter("userID");
			paramMap.put(SynchronizedDataConstants.GET_ONEUSER_START_PARAM_KEY,SynchronizedDataConstants.SYS_APP_ID);
			paramMap.put(SynchronizedDataConstants.GET_ONEUSER_END_PARAM_KEY,userID);
			operationName = SynchronizedDataConstants.GET_ONEUSER_WSDL_OPERATION_NAME;
			retList = WebClient.getResultByDom4j(paramMap,operationName);
		}else{
			String startDt = request.getParameter("startDt");
			if(null == startDt || "null".equals(startDt) ){
				startDt = "";
			}
			String endDt = request.getParameter("endDt");
			if(null == endDt || "null".equals(endDt) ){
				endDt = "";
			}
			paramMap.put(SynchronizedDataConstants.GET_BATCHUSER_START_PARAM_KEY,SynchronizedDataConstants.SYS_APP_ID);
			paramMap.put(SynchronizedDataConstants.GET_BATCHUSER_MIDDLE_PARAM_KEY,startDt);
			paramMap.put(SynchronizedDataConstants.GET_BATCHUSER_END_PARAM_KEY,endDt);
			operationName =SynchronizedDataConstants.GET_BATCHUSER_WSDL_OPERATION_NAME;
			retList = WebClient.getResultByDom4j(paramMap,operationName);
		}
		if(null == retList || retList.size() ==0){
			doSuccessInfoResponse("没有同步数据,请查询同步接口！");
			return null;
		}
		try {
			userService.synchronizedUserData(retList);
			doSuccessInfoResponse("同步用户成功,同步用户数:"+retList.size());
		} catch (Exception e) {
			e.printStackTrace();
			doFailureInfoResponse("同步用户失败:"+e.getMessage());
		}
		return null;
	}

	public void setUserService(IUserService userService) {
		this.userService = userService;
	}
}
