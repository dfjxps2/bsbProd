package com.rx.system.action;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.rx.log.annotation.FunDesc;
import com.rx.log.annotation.UseLog;
import com.rx.system.base.BaseDispatchAction;
import com.rx.system.constant.Constant;
import com.rx.system.domain.Resource;
import com.rx.system.domain.SysRole;
import com.rx.system.service.IResourceService;
import com.rx.system.service.impl.DataStore;
import com.rx.util.tree.Tree;
import com.rx.util.tree.TreeNode;
import com.rx.util.tree.TreeStore;

/**
 * 系统菜单的增删改查
 * @author zzm
 *
 */
public class ResourceAction extends BaseDispatchAction {

	private static final long serialVersionUID = 1L;

	private IResourceService resourceService ;

	public DataStore store;
	
	/**
	 * 返回页面展示菜单树所需的XML字符串
	 * @return
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	@FunDesc(code="SYS_0003")
	public String tree() throws Exception {
		StringBuffer sb = new StringBuffer();
		List<Tree> subTreeList = store.getResourceStore().getTreeListByParentID(Constant.ROOT_RESOURCE_ID);
		sb.append("<tree id=\"\">");
		sb.append("<item id=\"root\" text=\"资源树\" open=\"1\" im0=\"tree.gif\" im1=\"tree.gif\" im2=\"tree.gif\" call=\"1\" >");
		for (int i = 0; i < subTreeList.size(); i++) {
			Tree childTree = subTreeList.get(i);
			sb.append(dealTree(childTree));
		}
		sb.append("</item>");
		sb.append("</tree>");
		
		request.setAttribute("xml", sb.toString());
		return "ShowResource";
	}
	
	/**
	 * 返回展示树形节点及其子节点的XML字符串
	 * @param childTree	需要展示的树
	 * @param tree
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public String dealTree(Tree tree) {
		StringBuffer sb = new StringBuffer();
		TreeNode node = tree.getRootNode();
		if (tree.getChildren().size() == 0)
			sb.append("<item id=\""
				+ node.getNodeID()
				+ "\" text=\""
				+ node.getNodeName()
				+ "\" open=\"1\" im0=\"leaf.gif\" im1=\"leaf.gif\" im2=\"leaf.gif\" call=\"1\" >");
		else
			sb.append("<item id=\""
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

	/**
	 * 根据角色ID,返回页面展示菜单树所需的XML字符串
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	@FunDesc(code="SYS_0004")
	public String checkResource() throws Exception {
		StringBuffer sb = new StringBuffer();

		SysRole role = getParamObject(SysRole.class);
		List<Resource> resourceList = resourceService.getResourceByRoleId(role.getRole_id());
		List<Resource> ownerResourceList = this.resourceService.getUserResource(getCurrentUser());
		List<Tree> subTreeList = null;
		TreeStore store = new TreeStore();
		for (Resource resource : ownerResourceList) {
			store.addTreeNode(resource);
		}
//		if(role.getRole_id() == null || "".equals(role.getRole_id()))
//		subTreeList = DataStore.getResourceStore().getTreeListByParentID(Constant.ROOT_RESOURCE_ID);
		subTreeList = store.getTreeListByParentID(Constant.ROOT_RESOURCE_ID);
		
		sb.append("<tree id=\"\">");
		sb.append("<item id=\"root\" text=\"资源树\" open=\"1\" im0=\"tree.gif\" im1=\"tree.gif\" im2=\"tree.gif\" call=\"1\" >");
			for (int i = 0; i < subTreeList.size(); i++) {
				Tree childTree = subTreeList.get(i);
				sb.append(dealTree(childTree,resourceList));
			}
		sb.append("</item>");
		sb.append("</tree>");
		request.setAttribute("xml", sb.toString());
		request.setAttribute("selectRoleID", role.getRole_id());
		return "ShowCheckResource";
	}
	
	/**
	 * 返回展示树形节点及其子节点的XML字符串
	 * @param childTree	需要展示的树
	 * @return	XML字符串
	 */
	@SuppressWarnings("unchecked")
	public String dealTree(Tree tree,List<Resource> resourceList){
		StringBuffer sb = new StringBuffer();
		TreeNode node = tree.getRootNode();
		if(tree.getChildren().size()==0)
			sb.append("<item id=\""+node.getNodeID()
				+"\" text=\""+node.getNodeName()
				+"\" open=\"1\" im0=\"leaf.gif\" im1=\"leaf.gif\" im2=\"leaf.gif\" call=\"1\"");
		else
			sb.append("<item id=\""+node.getNodeID()
					+"\" text=\""+node.getNodeName()
					+"\" open=\"1\" im0=\"folderOpen.gif\" im1=\"folderOpen.gif\" im2=\"folderClosed.gif\" call=\"1\" ");
		if(isExist(node, resourceList))
			sb.append(" checked=\"1\" ");
		sb.append(">");
		List<Tree> subTreeList = tree.getChildren();
		for (int i = 0; i < subTreeList.size(); i++) {
			Tree subTree = subTreeList.get(i);
			sb.append(dealTree(subTree,resourceList));
		}
		sb.append("</item>");
		return sb.toString();
	}
	
	/**
	 * 添加菜单
	 * @return
	 * @throws Exception
	 */
	@FunDesc(code="SYS_0005")
	@UseLog
	public String add() throws Exception {
		Resource resource = getParamObject(Resource.class);
		try {
			resourceService.addResource(resource);
			Map<String, String> results = new HashMap<String, String>();
			results.put("success", "true");
			results.put("resourceID", resource.getResource_id());
			results.put("resourceName", resource.getResource_name());
			doJSONResponse(results);
		} catch (Exception e) {
			e.printStackTrace();
			doFailureInfoResponse("添加失败:" + e.getMessage());
		}
		return null;
	}

	/**
	 * 删除菜单
	 * @return
	 * @throws Exception
	 */
	@FunDesc(code="SYS_0006")
	@UseLog
	public String remove() throws Exception {
		Resource resource = getParamObject(Resource.class);
		try {
			resourceService.removeResource(resource);
			doSuccessInfoResponse(" 删除成功");
		} catch (Exception e) {
			doFailureInfoResponse("删除失败:"+e.getMessage());
		}
		return null;
	}

	/**
	 * 通过菜单ID查询菜单信息
	 * @return
	 * @throws Exception
	 */
	public String findById() throws Exception {
		String resource_id = request.getParameter("resource_id");
		try {
			List<Resource> list = resourceService.getResourceById(resource_id);
			doJSONResponse(list);
		} catch (Exception e) {
			e.printStackTrace();
			doFailureInfoResponse(e.getMessage());
		}
		return null;
	}
	
	/**
	 * 修改菜单
	 * @return
	 * @throws Exception
	 */
	@FunDesc(code="SYS_0007")
	@UseLog
	public String update()throws Exception {
		Resource resource = getParamObject(Resource.class);
		try {
			resourceService.updateResource(resource);
			doSuccessInfoResponse("修改成功");
		} catch (Exception e) {
			e.printStackTrace();
			doFailureInfoResponse("修改失败:"+e.getMessage());
		}
		return null;
	}
	
	/**
	 * 重新加载菜单到内存
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	@FunDesc(code="SYS_0008")
	@UseLog
	public String reload() throws Exception {
		store.reloadResourceStore();
		doSuccessInfoResponse("加载成功");
		return null;
	}
	
	/**
	 * 判断用户是否拥有该菜单
	 * @param node
	 * @param resourceList
	 * @return
	 */
	public boolean isExist(TreeNode node,List<Resource> resourceList){
		for (Object obj : resourceList) {
			if(node.getNodeID().equals(((Resource)obj).getNodeID()))
				return true;
		}
		return false;
	}
	
	public void setResourceService(IResourceService resourceService) {
		this.resourceService = resourceService;
	}

	public void setStore(DataStore store) {
		this.store = store;
	}
}
