package com.rx.system.filter;

import java.io.IOException;
import java.util.List;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.context.ApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.rx.system.domain.Resource;
import com.rx.system.domain.SysUser;
import com.rx.system.service.IResourceService;
import com.rx.system.service.IUserService;
import com.rx.system.util.GlobalUtil;
import com.rx.util.tree.Tree;
import com.rx.util.tree.TreeNode;
import com.rx.util.tree.TreeStore;

/**
 * 首页过滤器
 * 用户访问首页[main.jsp]时向request对象注入用户菜单信息以及网站导航图信息
 * @author chenxd
 *
 */
public class MainPageFilter implements Filter {
	
	private ApplicationContext cxt = null;
	private IResourceService resourceService = null;
	private IUserService userService = null;
	private boolean encrypyMenu = false;
	
	public void init(FilterConfig config) throws ServletException {
		if(config.getInitParameter("encrypyMenu") != null)
			this.encrypyMenu = Boolean.valueOf(config.getInitParameter("encrypyMenu")).booleanValue();
	}
	
	public void destroy() {

	}

	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
		HttpServletRequest req = (HttpServletRequest) request;
		HttpSession session = req.getSession();
		SysUser user = (SysUser) session.getAttribute("currentUser");
		if(user == null)
			throw new ServletException("用户未登陆");
		
		try {
			//获取登陆用户菜单
			List<Resource> userResourceList = getResourceService(session).getUserResource(user);
			
			//加载用户菜单
			req.setAttribute("menuCode", getUserMenu(userResourceList, session.getId()));
			
			//加入用户存在的权限机构数量
			req.setAttribute("rightOrgNumber", getUserService(session).getAllBankOrgIdByUserId(user.getUser_id()).size());
		} catch (Exception e) {
			//session.invalidate();
			e.printStackTrace();
			throw new ServletException(e.getMessage());
		}
		
		chain.doFilter(request, response);
		return;
	}
	
	//获取用户登录菜单
	@SuppressWarnings("unchecked")
	private String getUserMenu(List<Resource> userResourceList, String encryptBaseKey)throws Exception {
		StringBuffer menu = new StringBuffer();
		menu.append("<ul id='nav'>");
		
		TreeStore userResourceStore = new TreeStore();
		for (Resource resource : userResourceList) {
			userResourceStore.addTreeNode(resource);
		}
		
		getTreeCode(userResourceStore.getTreeListByParentID("root"), menu, 0, encryptBaseKey);
		
		menu.append("</ul>");
		
		return menu.toString();
	}
	
	//返回树形菜单代码
	@SuppressWarnings("unchecked")
	private void getTreeCode(List<Tree> treeList,StringBuffer sb, int level, String baseKey) {	
		for (int i = 0 ; i < treeList.size() ; i++) {
			Tree tree = treeList.get(i);
			TreeNode root = tree.getRootNode();
			sb.append("<li class=\"level"+level+"\">");
			sb.append("<a");
			if(tree.getChildren().size() > 0){
				sb.append(" class=\"haschildren"+level+"\"");
			}
			sb.append(" id=\"m_"+root.getNodeID()+"\" href=\"javascript:void(0)\""+getMenuAction(root,level, baseKey)+">");
			String img = "";
			if (level<1) {
				/*sb.append("<div class = \"img img"+i+"\"></div>");	*/
				img = "img"+i;
			}
			sb.append("<p class = \"a"+level+"\"><i class=\""+img+"\"></i>&emsp;").append(root.getNodeName()).append("</p></a>");
			
			if(tree.getChildren().size() > 0)
				sb.append("<ul id=\""+root.getNodeID()+"\" class=\"collapsed\">");
			
			getTreeCode(tree.getChildren(), sb, (level+1), baseKey);
			
			if(tree.getChildren().size() > 0)
				sb.append("</ul>");
			
			sb.append("</li>");
			/*if(i==treeList.size()-1){
				sb.append("<li class=\"last_level"+level+"\"></li>");
			}*/
		}
	}
	
	//获取菜单动作代码
	private String getMenuAction(TreeNode node, int level, String baseKey){
		Resource resource = (Resource) node;
		if(GlobalUtil.trimToNull(resource.getHandler()) != null){
			//包含链接动作节点
			
			String rid = resource.getResource_id();
			String rurl = resource.getHandler();
			if(this.encrypyMenu) {
				rid = GlobalUtil.encryptValStr(baseKey, resource.getResource_id());
				String[] strs = rurl.split("/");
				rurl = "/";
				for(int i = 0;i < strs.length-1;i++){
					if(null == strs[i] || "".equals(strs[i])){
						continue;
					}else{
						rurl = rurl + strs[i] + "/";
					}
				}
			}
			
			return " onclick=\"gotoPage('"+rid+"','"+resource.getResource_name()+"','"+rurl+"')\"";
		}else{
			if(level == 0)
				return " onclick=\"DoMenu('"+resource.getResource_id()+"')\"";
			return " onclick=\"DoSecMenu('"+resource.getResource_id()+"')\"";
		}
	}
	
	/**
	 * 获取spring容器中的IResourceService
	 * @param session
	 */
	private IResourceService getResourceService(HttpSession session) {
		if(this.resourceService == null){
			cxt = WebApplicationContextUtils.getRequiredWebApplicationContext(session.getServletContext());
			this.resourceService = (IResourceService) cxt.getBean("resourceService");
		}
		return this.resourceService;
	}
	
	/**
	 * 获取spring容器中的IResourceService
	 * @param session
	 */
	private IUserService getUserService(HttpSession session) {
		if(this.userService == null){
			cxt = WebApplicationContextUtils.getRequiredWebApplicationContext(session.getServletContext());
			this.userService = (IUserService) cxt.getBean("userService");
		}
		return this.userService;
	}
	
}
