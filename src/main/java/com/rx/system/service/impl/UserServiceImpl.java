package com.rx.system.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.transaction.annotation.Transactional;

import com.rx.system.base.BaseService;
import com.rx.system.dao.RoleDao;
import com.rx.system.dao.UserDao;
import com.rx.system.domain.Resource;
import com.rx.system.domain.SysUser;
import com.rx.system.service.IUserService;
import com.rx.system.util.GlobalUtil;
import com.rx.util.tree.TreeStore;

public class UserServiceImpl extends BaseService implements IUserService {
	
	private static String totalNum = "0";
	
	private UserDao userDao = null;//用户数据库查询接口
//	private RoleDao roleDao = null;//用户数据库查询接口
	
	//通过查询条件,查询出用户列表
	public List<Map<String, Object>> listUsers(Map<String, Object> paramMap)throws Exception{
		if("0".equals(getStringValue(paramMap, "start"))){
			totalNum = userDao.getUsersCount(paramMap);
		}
		return toLowerMapList(userDao.listUsers(paramMap));
	}
	
	//通过查询条件,查询出用户列表
		public List<Map<String, Object>> userById()throws Exception{
			return userDao.userById();
		}
	
	//添加用户
	public void addUser(SysUser user)throws Exception{
		List<SysUser> userList = userDao.findUserById(user.getUser_id());
		if(userList != null && userList.size()>0){
			throw new Exception("用户ID为【"+user.getUser_id()+"】的用户已存在。");
		}
		userDao.addUser(user);
		Map<String, Object> paramMap = new HashMap<String, Object>();
		paramMap.put("user_id",user.getUser_id());
		paramMap.put("role_id","Excutive");
		userDao.addUserRole(paramMap);
	}
	
	//删除用户(删除用户、删除用户角色、删除用户特殊授权)
	public void removeUser(String userID)throws Exception{
		userDao.removeUser(userID);
		SysUser user = new SysUser();
		user.setUser_id(userID);
		userDao.removeUserRoleRela(user);
		Map<String,Object> map = new HashMap<String,Object>();
		map.put("user_id", userID);
		userDao.deleteSpeciallyAuthorize(map);
		userDao.deleteInitPage(userID);
	}
	
	//通过查询条件,查询出用户列表
	public void updataUser(SysUser user)throws Exception{
		userDao.modifyUser(user);
	}
	
	//修改用户信息
	@Transactional
	public void modifyUser(HttpServletRequest request,SysUser user)throws Exception{
		String oldOwnerOrgId = request.getParameter("oldOwerOrgId");
		String oldBankOrgId = request.getParameter("oldBankOrgId");
		if(null == oldOwnerOrgId || "".equals(oldOwnerOrgId) || null == oldBankOrgId || "".equals(oldBankOrgId)){
			throw new Exception("参数获取失败！");
		}
		//归属机构发生变化则权限机构与归属机构保持一致
		if(!oldOwnerOrgId.equals(user.getOwner_org_id())){
			user.setBank_org_id(user.getOwner_org_id());
			user.setBank_org_name(user.getOwner_org_name());
		}
		//权限机构发生变化则删除原来权限机构下用户角色
		if(!oldBankOrgId.equals(user.getBank_org_id())){
			Map<String,Object> map = new HashMap<String,Object>();
			map.put("user_id", user.getUser_id());
			map.put("bank_id", oldBankOrgId);
			this.userDao.deleteRoleByUserIdAndBankOrgId(map);
		}
		userDao.modifyUser(user);
	}
	
	//根据用户ID查找用户
	public SysUser findUserById(String userID)throws Exception{
		List<SysUser> userList = userDao.findUserById(userID);
		return userList.size()> 0 ? userList.get(0) : null;
	}
	
	//修改用户密码
	public void modifyPassword(Map<String, Object> paramMap)throws Exception{
		userDao.modifyPassword(paramMap);
	}
	
//	//添加用户角色
//	public void addUserRole(String user_id, String role_ids)throws Exception{
//		Map<String, Object> paramMap = new HashMap<String, Object>();
//		paramMap.put("user_id", user_id);
//		
//		String[] roleIdArray = role_ids.split(",");//角色ID数组
//		//循环添加所有角色
//		if(GlobalUtil.isNotNull(role_ids) && roleIdArray.length>0) {
//			
//			userDao.removeUserRoleRela(user_id);//删除用户和角色的关系
//			
//			//添加新关系
//			for (String role_id : roleIdArray) {
//				paramMap.put("role_id", role_id);
//				userDao.addUserRole(paramMap);
//			}
//		}
//	}
	
	//根据用户ID获取用户角色
	public List<Map<String, Object>> getUserRole(Map<String, Object> paramMap)throws Exception{
		return toLowerMapList(userDao.getUserRole(paramMap));
	}
	
	//保存用户角色
	public void saveUserRole(SysUser user,String[] idArray)throws Exception {
		//删除用户与角色关系
		userDao.removeUserRoleRela(user);
		
		//插入用户与角色关系
		Map<String, Object> paramMap = new HashMap<String, Object>();
		paramMap.put("user_id", user.getUser_id());
		if(idArray != null && idArray.length > 0){
			for (int i = 0; i < idArray.length; i++) {
				if(GlobalUtil.trimToNull(idArray[i]) == null)
					continue;
				paramMap.put("role_id", idArray[i]);
				userDao.insertUserRoleRela(paramMap);
			}
		}
	}
	public int checkPassword(SysUser user) throws Exception {
		
		return userDao.checkPassword(user);
	}
	
	//获得当前用的菜单列表
	public TreeStore getCurrentUserResourceList(Map<String,Object> paramMap) throws Exception{
		TreeStore resourceStore = new TreeStore();
		List<Resource> list = this.userDao.getCurrentUserResourceList(paramMap);
		for(Resource re : list){
			resourceStore.addTreeNode(re);
		}
		return resourceStore;
	}
	
	//获得待分配用户已经拥有的特殊权限
	public Map<String,String> getSpeciallyResource(Map<String,Object> paramMap) throws Exception{
		Map<String,String> reMap = new HashMap<String,String>();
		List<Map<String,Object>> rList = this.toLowerMapList(this.userDao.getSpeciallyResourceList(paramMap));
		if(null != rList){
			for(Map<String,Object> map : rList){
				if(null != map.get("resource_id") && !"".equals(map.get("resource_id")) ){
					reMap.put(String.valueOf(map.get("resource_id")), String.valueOf(map.get("resource_id")));
				}
			}
		}
		return reMap;
	}
	
	public void saveSpeciallyAuthorize(Map<String,Object> paramMap) throws Exception {
		//先删除
		this.userDao.deleteSpeciallyAuthorize(paramMap);
		//后增加
		String resource = (String)paramMap.get("resource");
		if(null != resource && !"".equals(resource)){
			String[] r_ids = resource.split(";");
			for(String r_id : r_ids){
				paramMap.put("resource_id", r_id);
				this.userDao.saveSpeciallyAuthorize(paramMap);
			}
		}
	}
	
	/**
	 * 判断用户是否存在特殊权限机构ID
	 * @param paramMap：
	 * 			key: user_id 用户ID
	 * 			key: special_org_id 权限机构ID
	 * @return boolean
	 * @throws Exception
	 */
	public boolean isExistSpecialOrg(Map<String, Object> paramMap) throws Exception{
		int i = userDao.isExistSpecialOrg(paramMap);
		if(i >= 1){
			return true;
		}else{
			return false;
		}
	}
	
	/**
	 * 查询某用户所有的权限机构
	 * */
	public List<Map<String, Object>> getAllBankOrgIdByUserId(String login_user_id) throws Exception{
		return this.toLowerMapList(this.userDao.getAllBankOrgIdByUserId(login_user_id));
	}
	
	/**
	 * 删除用户在某权限机构下的角色
	 * */
	public void deleteRoleByUserIdAndBankOrgId(Map<String, Object> paramMap) throws Exception{
		
	}

	/**
	 * 同步用户数据
	 *   step0:delete data temp
	 *   stet1:insert data temp
	 *   step2:merge data
	 * @param retList
	 * @throws Exception
	 */
	@Override
	@Transactional
	public void synchronizedUserData(List<Map<String, Object>> retList) throws Exception {
		//删除临时用户表数据
		this.userDao.deleteUserDataTemp();
		this.userDao.insertBatchUserDataTemp(retList);
		//merge data
		this.userDao.mergeUserDataTemp();
		//insert UserRoleReal
		this.userDao.insertBatchUserRoleRealData();

	}


	public void insertBatchUserDataTemp(List<Map<String, Object>> retList) throws Exception{
		int listSize = retList.size();
		int toIndex = 10000;
		int keyToken = 0;
		for(int i = 0;i<retList.size();i+=toIndex){
			if(i+toIndex>listSize){        //作用为toIndex最后没有900条数据则剩余几条newList中就装几条
				toIndex=listSize-i;
			}
			List dataList = retList.subList(i,i+toIndex);
			insertBatchUserDataTemp(dataList);
			keyToken++;
		}


	}



	public void setUserDao(UserDao userDao) {
		this.userDao = userDao;
	}


	public String getTotalNum() {
		return totalNum;
	}

}
