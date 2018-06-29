package com.rx.system.action;

import java.util.List;

import com.rx.log.annotation.FunDesc;
import com.rx.log.annotation.UseLog;
import com.rx.system.base.BaseDispatchAction;
import com.rx.system.domain.SysRole;
import com.rx.system.service.IRoleService;

/**
 * 系统角色操作Action
 * @author zzm
 *
 */
public class RoleAction extends BaseDispatchAction {

	private static final long serialVersionUID = 1L;

	public IRoleService roleService;
	
	/**
	 * 获取角色列表
	 * @return
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	@FunDesc(code="SYS_0009")
	@UseLog
	public String list() throws Exception {
		SysRole role = getParamObject(SysRole.class);
		try {
			List roleList = roleService.listRole(role);
			doJSONResponse(roleList);
		} catch (RuntimeException e) {
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * 获取角色列表
	 * @return
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	public String listById() throws Exception {
		String role = request.getParameter("role_id");
		try {
			List roleList = roleService.getRoleInfoById(role);
			doJSONResponse(roleList);
		} catch (RuntimeException e) {
			e.printStackTrace();
		}
		return null;
	}
	
	/**
	 * 添加角色
	 * @return
	 * @throws Exception
	 */
	@FunDesc(code="SYS_0010")
	@UseLog
	public String add() throws Exception {
		SysRole role = getParamObject(SysRole.class);
		try {
			roleService.addRole(role);
			doSuccessInfoResponse("添加成功");
		} catch (Exception e) {
			e.printStackTrace();
			doFailureInfoResponse("添加失败:"+e.getMessage());
		}
		return null;
	}
	
	/**
	 * 修改角色
	 * @return
	 * @throws Exception
	 */
	@FunDesc(code="SYS_0011")
	@UseLog
	public String modify() throws Exception {
		SysRole role = getParamObject(SysRole.class);
		try {
			roleService.modifyRoleInfo(role);
			doSuccessInfoResponse("修改成功");
		} catch (Exception e) {
			e.printStackTrace();
			doFailureInfoResponse("修改失败:"+e.getMessage());
		}
		return null;
	}
	
	/**
	 * 删除角色
	 * @return
	 * @throws Exception
	 */
	@FunDesc(code="SYS_0012")
	@UseLog
	public String remove() throws Exception {
		SysRole role = getParamObject(SysRole.class);
		try {
			roleService.removeRole(role);
			doSuccessInfoResponse("删除成功");
		} catch (Exception e) {
			e.printStackTrace();
			doFailureInfoResponse("删除失败:"+e.getMessage());
		}
		return null;
	}

	/**
	 * 修改角色和菜单关系
	 * @return
	 * @throws Exception
	 */
	@FunDesc(code="SYS_0013")
	@UseLog
	public String updateRoleResource() throws Exception {
		SysRole role = new SysRole();
		String roleID = request.getParameter("role_id");
		String resourceIDs = request.getParameter("resource_ids");
		role.setRole_id(roleID);
		try {
			roleService.modifyRoleResource(roleID, resourceIDs.split(","));
			doSuccessInfoResponse("保存成功");
		} catch (Exception e) {
			e.printStackTrace();
			doFailureInfoResponse("保存失败:"+e.getMessage());
		}
		return null;
	}
	public void setRoleService(IRoleService roleService) {
		this.roleService = roleService;
	}
	
}
