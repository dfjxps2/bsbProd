package com.rx.system.table;

import java.io.File;
import java.util.List;
import java.util.Map;

import org.apache.poi.xssf.streaming.SXSSFWorkbook;

import com.rx.util.tree.Tree;

/**
 * 表格对象接口
 * @author chenxd
 *
 */
public interface ITableTemplate {
	
	/**
	 * 定义左侧树展示方式代码
	 */
	public static final String LEFT_SHOW_TYPE_TREE = "tree";
	public static final String LEFT_SHOW_TYPE_TABLE = "table";
	
	/**
	 * 定义数据格式类型代码
	 */
	public static final String FORMAT_STRING = "0";//字符串
	public static final String FORMAT_INT= "1";//整数
	public static final String FORMAT_DOUBLE = "2";//浮点数
	public static final String FORMAT_PERCENT = "3";//百分数
	public static final String FORMAT_DOUBLE4 = "4";//浮点数(保留4位小数)
	public static final String FORMAT_CDATA = "5";//CDATA 包含有特殊字符的
	
	//设置表格数据
	public void setData(List<Map<String, Object>> dataList);
	
	//设置表格的表头
	public void setHeader(String[] header);
	
	//设置表格标题
	public void setTitle(String title);
	
	//设置左侧树
	public void setLeftTree(Tree leftTree);
	
	//设置左侧树 并指定树在第几列
	public void setLeftTree(Tree leftTree,int i);
	
	//设置左侧树列表 并指定树在第几列
	public void setLeftTreeList(List<Tree> leftTreeList,int i);
	
	//设置左侧树的展示方式
	public void setLeftTreeShowType(final String type);
	
	//设置列宽
	public void setColumnWidth(String width);
	
	//设置列的类型
	public void setColumnType(String type);
	
	//设置列的对齐方式
	public void setColumnAlign(String align);
	
	//设置列的格式类型
	public void setColumnFormatType(String format);
	
	//设置获取数据的Key
	public void setDataMapKey(String[] keys);
	
	//设置分组字段
	public void setGroupFields(String group_fields);
	
	//获取输出字符串
	public String getTableString() throws Exception;
	
	//写入文件
	public void writeToFile(File file) throws Exception;

	//是否过滤空行
	public void isFilterBlank(boolean b) throws Exception;
	
	public void setExcelInfoRow(String[][] excelInfoRow);
	
	//页眉是否一行显示
	public void setInfoInOneRow(boolean b) throws Exception;
	
	//设置钻取链接
	public void addHref(int colIndex,String href);
	
	//设置表头钻取连接
	public void addHeaderHref(int colIndex,String href);
	
	//设置点击JS方法
	public void addClickFun(int colIndex,String href);
	
	//设置是否添加复选框
	public void setUseCheck(boolean useCheck, int index);
	
	//使用序列号
	public void useSerialNumber(boolean b);
	
	//使用序列号
	public void useSerialNumber(boolean b, int i);
	
	//设置ID字段
	public void setIdField(String idField);
	
	/**
	 * [导出文件前]添加用户自定义合并
	 * 	key : startRowInde,startColIndex
	 *  val : rowspan,colspan
	 * @param customerMergeMap
	 */
	public void setCustomerMergeMap(Map<String, String> customerMergeMap);
}
