package com.rx.system.base;

import java.util.List;
import java.util.Map;

import com.rx.framework.jdbc.JdbcManager;
import com.rx.system.util.GlobalUtil;

/**
 * 抽象Service
 * 包含一些Service通用工具方法
 * @author chenxd
 *
 */
public abstract class BaseService {
	
	protected JdbcManager jdbcManager = null;
	
	/**
	 * 将查询出的Map中的Key转换成小写
	 * @param paramMap
	 * @return
	 */
	protected List<Map<String, Object>> toLowerMapList(List<Map<String, Object>> dataList){
		return GlobalUtil.lowercaseListMapKey(dataList);
	}
	
	/**
	 * 以String类型返回Map中对应的值
	 * @param map
	 * @param key
	 * @return
	 */
	public String getStringValue(Map<String, Object> paramMap,String key){
		return GlobalUtil.getStringValue(paramMap, key);
	}
	
	/**
	 * 得到某序列的nextval
	 * @throws Exception 
	 * */
	@SuppressWarnings("unchecked")
	public String getSeqNextval(String seq) throws Exception{
		String sql = "select "+seq+".nextval seq from dual";
		List<Map<String,Object>> seqList = this.toLowerMapList(this.jdbcManager.queryForList(sql));
		if(null == seqList || seqList.size() != 1){
			throw new Exception("获取序列值错误");
		}
		return String.valueOf(seqList.get(0).get("seq"));
	}

	public void setJdbcManager(JdbcManager jdbcManager) {
		this.jdbcManager = jdbcManager;
	}
	
	/**
	 * 生成simpleData格式数据
	 * @param result
	 * @return
	 */
	protected String parsetoString(String result){
		String info = "[";
		String[] results = result.split(";");
		for(int i=0;i<results.length;i++){
			String[] array = results[i].split(",");
			if(array.length==1){
				info += "['"+array[0]+"','','',''],";
				continue;
			}
			String dependId = array[0];
			String dependName = array[1];
			String dependOwnerBankId = array[2];
			String dependOwnerBankName = array[3];
			
			info += "['"+dependId+"','"+dependName+"','"+dependOwnerBankId+"','"+dependOwnerBankName+"'],";
		}
		info = info.substring(0,info.lastIndexOf(','));
		return info+"]";
	}
	
}
