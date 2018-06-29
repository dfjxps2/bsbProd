package com.rx.system.table;

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.rx.system.util.GlobalUtil;
import com.rx.util.CommonUtil;
import com.rx.util.tree.Tree;
/**
 * 表格模板抽象类
 * @author chenxd
 *
 */
public abstract class AbstractTableTemplate implements ITableTemplate {
	
	protected List<Map<String, Object>> dataList = null;//数据对象列表
	
	protected String[] header = null;//表头对象 
	
	protected String title = null;//表格标题
	
	protected String leftTreeShowType = "tree";//左侧树展示方式
	
	protected Tree leftTree = null;//左侧树
	
	protected List<Tree> leftTreeList = null; //左侧树列表 [即为隐藏根节点]
	
	protected int leftTreeIndex = 0;//左侧树的列数
	
	protected String[] widths = null;//列宽数组
	
	protected String[] types = null;//列的类型数组
	
	protected String[] format = null;//列的格式类型数组
	
	protected String[] aligns = null;//列对齐方式数组
	
	protected String[] data_keys = null;//Map中取数据的key
	
	protected String[] group_fields = null;//分组字段数组
	
	protected boolean filter_blank = false;//默认不过滤空行
	
	protected boolean infoInOneRow = true;//页眉信息是否一行显示
	
	protected String[][] excelInfoRow = null;//Excel导出行信息
	
	protected Map<Integer, String> hrefHeaderMap = new HashMap<Integer, String>();//链接Map 
	
	protected Map<Integer, String> hrefMap = new HashMap<Integer, String>();//链接Map 
	
	protected boolean useCheck = false;//添加复选框
	protected int checkbox_index = 0;
	
	protected boolean add_serial = false;//是否添加序列号
	protected int serial_number = 0;//序号列
	
	protected boolean href_drill = true;//超链接是否钻取
	
	protected String idField = null;//id字段
	
	protected Map<String, String> customerMergeMap = null;
	
	//获取输出字符串
	public String getTableString() {
		StringBuffer sb = new StringBuffer();
		
		this.init(sb);
		
		this.writeTitle(sb);
		
		this.writeHeader(sb);
		
		this.writeData(sb);
		
		this.end(sb);
		
		return sb.toString();
	}
	
	//初始化字符串
	protected abstract void init(StringBuffer sb);
	
	//写标题
	protected abstract void writeTitle(StringBuffer sb);
	
	//写表头
	protected abstract void writeHeader(StringBuffer sb);
	
	//写数据
	protected abstract void writeData(StringBuffer sb);
	
	//结束字符串
	protected abstract void end(StringBuffer sb);
	
	//设置表格数据
	public void setData(List<Map<String, Object>> dataList) {
		this.dataList = dataList;
	}
	
	//设置表格的表头
	public void setHeader(String[] header) {
		this.header = header;
	}
	
	//设置表格标题
	public void setTitle(String title) {
		this.title = title;
	}
	
	//设置左侧树
	public void setLeftTree(Tree leftTree) {
		this.leftTree = leftTree;
		this.leftTreeIndex = 0;
	}
	
	//设置左侧树 并指定树在第几列
	public void setLeftTree(Tree leftTree,int i) {
		this.leftTree = leftTree;
		this.leftTreeIndex = i;
	}
	
	//设置左侧树列表 并指定树在第几列
	public void setLeftTreeList(List<Tree> leftTreeList,int i) {
		this.leftTreeList = leftTreeList;
		this.leftTreeIndex = i;
	}
	
	//设置左侧树的展示方式
	public void setLeftTreeShowType(final String type) {
		this.leftTreeShowType = type;
	}
	
	//设置列宽
	public void setColumnWidth(String width) {
		this.widths = width.split(",");
	}
	
	//设置列的类型
	public void setColumnType(String type) {
		this.types = type.split(",");
	}
	
	//设置列的对齐方式
	public void setColumnAlign(String align) {
		this.aligns = align.split(",");
	}
	
	//设置获取数据的Key
	public void setDataMapKey(String[] keys) {
		this.data_keys = keys;
	}
	
	//设置列的格式类型
	public void setColumnFormatType(String format) {
		this.format = format.split(",");
	}
	
	//设置分组字段
	public void setGroupFields(String group_fields) {
		this.group_fields = group_fields.split(",");
	}
	
	//是否过滤空行
	public void isFilterBlank(boolean b) throws Exception {
		this.filter_blank = b;
	}
	//设置导出行信息
	public void setExcelInfoRow(String[][] excelInfoRow) {
		this.excelInfoRow = excelInfoRow;
	}
	
	//设置页眉是否一行显示
	public void setInfoInOneRow(boolean b) throws Exception {
		this.infoInOneRow = b;
	}
	
	//设置钻取链接
	public void addHref(int colIndex,String href) {
		this.hrefMap.put(colIndex, href);
	}
	
	//设置表头钻取连接
	public void addHeaderHref(int colIndex,String href){
		this.hrefHeaderMap.put(colIndex, href);
	}
	
	//设置ID字段
	public void setIdField(String idField) {
		this.idField = idField;
	}
	
	public void setCustomerMergeMap(Map<String, String> customerMergeMap) {
		this.customerMergeMap = customerMergeMap;
	}

	public void addClickFun(int colIndex,String href) {
		this.hrefMap.put(colIndex, href);
		this.href_drill = false;
	}
	
	public void setUseCheck(boolean useCheck, int index) {
		this.useCheck = useCheck;
		this.checkbox_index = index;
	}
	
	public void useSerialNumber(boolean b) {
		this.useSerialNumber(b,0);
	}
	
	public void useSerialNumber(boolean b, int i) {
		this.add_serial = b;
		this.serial_number = i;
	}
	
	protected String getStringValue(Map<String, Object> map,String key) {
		return GlobalUtil.getStringValue(map, key);
	}
	
	/**
	 * 格式化数据
	 * @param str
	 * @param type
	 * @return
	 */
	protected String getFormatString(String str,String type) {
		str = str.trim();
		if(type.equals(ITableTemplate.FORMAT_STRING))
			return str.trim();
		else if (type.equals(ITableTemplate.FORMAT_CDATA))
			return "<![CDATA[" + str.trim() + "]]>";
		String formatPartten = "";
		boolean percent = false;
		if(type.equals(ITableTemplate.FORMAT_INT)) {
			if(GlobalUtil.trimToNull(str) == null)
				return "0";
			return String.valueOf((int)new Double(str).doubleValue());
		}else if(type.equals(ITableTemplate.FORMAT_DOUBLE)) {
			if(GlobalUtil.trimToNull(str) == null)
				return "0.00";
			formatPartten = "#,##0.00";
		}else if(type.equals(ITableTemplate.FORMAT_DOUBLE4)) {
			if(GlobalUtil.trimToNull(str) == null)
				return "0.0000";
			formatPartten = "#,##0.0000";
		}else if(type.equals(ITableTemplate.FORMAT_PERCENT)) {
			if(GlobalUtil.trimToNull(str) == null)
				return "0%";
			formatPartten = "0.00";
			percent = true;
		}else {
			return str;
		}
			
		DecimalFormat format = new DecimalFormat(formatPartten);
		if(percent)
			return format.format(Double.parseDouble(str)*100)+"%";
		else 
			return format.format(Double.parseDouble(str));
	}
	
	/**
	 * 获取行的ID
	 * @param map
	 * @return
	 */
	protected String getRowId(Map<String, Object> map) {
		String id = "";
		if(this.group_fields != null) {
			for (int i = 0; i < this.group_fields.length; i++) {
				id += "_" + getStringValue(map, this.group_fields[i]);
			}
//			if(this.leftTree != null && this.leftTreeIndex > this.group_fields.length)
//				id += "_" + getStringValue(map, this.data_keys[this.leftTreeIndex]);
		} else if(this.leftTree != null) {
			for (int i = 0; i < this.leftTreeIndex + 1; i++) {
				id += "_" + getStringValue(map, this.data_keys[i]);
			}
		} else if(this.idField != null){
			return getStringValue(map, this.idField);
		}else {
			return CommonUtil.getRandomID(18);
		}
		
		return id.replaceFirst("_", "");
	}
	
	/**
	 * 获取分组列表
	 * @return
	 */
	protected List<Map<String, Object>> getGroupList() {
		
		if(this.dataList.size() == 0)
			return null;
		
		//取第一条数据的Group
		Map<String, Object> firstMap = this.dataList.get(0);
		
		String[] values = null;
		String[] keyArray = null;
		
		if(this.group_fields == null) {
			values = new String[this.leftTreeIndex];
			keyArray = this.data_keys;
		} else {
			values = new String[this.group_fields.length - 1];
			keyArray = new String[this.group_fields.length - 1];
			for (int i = 0; i < keyArray.length; i++) {
				keyArray[i] = this.group_fields[i];
			}
		}
		
		for (int i = 0; i < keyArray.length; i++) {
			values[i] = getStringValue(firstMap, keyArray[i]);
		}
		
		//创建返回对象
		List<Map<String, Object>> groupList = new ArrayList<Map<String,Object>>();
		
		
		//循环筛选出符合比较数据的记录
		for (int i = 0; i < this.dataList.size(); i++) {
			Map<String, Object> map = this.dataList.get(i);
			boolean equals = true;
			
			for (int j = 0; j < values.length; j++) {
				if(!getStringValue(map, keyArray[j]).equals(values[j])) {
					equals = false;
					break;
				}
			}
			
			if(equals) {
				groupList.add(map);
			}
			
		}
		
		return groupList;
	}
	
	/**
	 * 根据值获取Map从List中
	 * @param col_index
	 * @param value
	 * @return
	 */
	protected Map<String, Object> getMapFromList(List<Map<String, Object>> list, int col_index, String value) {
		for (int i = 0; i < list.size(); i++) {
			Map<String, Object> map = list.get(i);
			if(value.equals(getStringValue(map, this.data_keys[col_index])))
				return map;
		}
		return null;
	}
	
	/**
	 * 根据值获取Map从List中
	 * @param col_index
	 * @param value
	 * @return
	 */
	protected Map<String, Object> getMapFromList(List<Map<String, Object>> list, String[] groupIds, String[] values) {
		for (int i = 0; i < list.size(); i++) {
			Map<String, Object> map = list.get(i);
			
			boolean b = true;
			
			for (int j = 0; j < groupIds.length; j++) {
				String v = values[values.length - groupIds.length + j];
				String gv = getStringValue(map, groupIds[j]);
				if(!v.equals(gv)) {
					b = false;
					break;
				}
			}
			
			if(b)
				return map;
		}
		return null;
	}
	
	/**
	 * 获取树的最大深度
	 * @param tree
	 * @return
	 */
	@SuppressWarnings("unchecked")
	protected int getTreeMaxDeep(Tree tree) {
		int deep = 1;
		List<Tree> children = tree.getChildren();
		
		for (int j = 0; j < children.size(); j++) {
			int temp = this.getTreeMaxDeep(children.get(j));
			if(deep < temp)
				deep = temp;
		}
		
		if(children.size() > 0)
			deep += 1;
		
		return deep;
	}
	
	/**
	 * 获取树的叶子节点个数
	 * @param tree
	 * @return
	 */
	@SuppressWarnings("unchecked")
	protected int getLeefNodeCount(Tree tree) {
		
		List<Tree> children = tree.getChildren();
		
		if(children.size() == 0)
			return 1;
		
		int leefCount = 0;
		for (int j = 0; j < children.size(); j++) {
			Tree child = children.get(j);
			leefCount += this.getLeefNodeCount(child);
		}
		
		return leefCount;
	}
}
