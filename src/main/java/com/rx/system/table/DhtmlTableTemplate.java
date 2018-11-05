package com.rx.system.table;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.rx.system.util.CommonUtil;
import com.rx.system.util.ExcelExporter;
import com.rx.util.tree.Tree;
import com.rx.util.tree.TreeNode;

/**
 * dhtml表格模板实现类
 * @author chenxd
 *
 */
public class DhtmlTableTemplate extends AbstractTableTemplate {
	
	protected int rownum = 1;
	
	/**
	 * 初始化
	 */
	protected void init(StringBuffer sb) {
		
		if(this.aligns == null) {
			this.aligns = new String[this.types.length];
			for (int i = 0; i < this.types.length; i++) {
				this.aligns[i] = "center";
			}
		}
		
		if(this.data_keys == null) {
			this.data_keys = new String[this.types.length];
			for (int i = 0; i < this.types.length; i++) {
				this.data_keys[i] = "col_"+(i+1);
			}
		}
		
		if(this.format == null) {
			this.format = new String[this.aligns.length];
			for (int i = 0; i < this.aligns.length; i++) {
				if(this.aligns[i].equals("right"))
					this.format[i] = ITableTemplate.FORMAT_DOUBLE;
				else
					this.format[i] = ITableTemplate.FORMAT_STRING;
			}
		}
		
		if(this.widths == null) {
			this.widths = new String[this.types.length];
			for (int i = 0; i < this.types.length; i++) {
				this.widths[i] = "120";
			}
		}
		
		sb.append("<?xml version=\"1.0\" encoding=\"utf-8\"?>");
		sb.append("<rows>");
	}
	
	/**
	 * 写标题
	 */
	protected void writeTitle(StringBuffer sb) {
		
	}
	
	/**
	 * 写表头
	 */
	protected void writeHeader(StringBuffer sb) {
		if(this.header != null) {
			sb.append("<head>");
			
			//第一行
			String[] firstRow = this.header[0].split(",");
			for (int j = 0; j < firstRow.length; j++) {
				String herf = this.hrefHeaderMap.get(j);
				if(this.add_serial && this.serial_number == j) {
					sb.append("<column width=\"40\" type=\"ro\" align=\"center\"><![CDATA[序号]]></column>");
				}
				if(this.useCheck && j == this.checkbox_index)
					sb.append("<column width=\"40\" type=\"ch\" align=\"center\">#master_checkbox</column>");
				if(herf!=null){
					sb.append("<column width=\""+ this.widths[j] +"\" type=\""+ this.types[j] +"\" align=\""+ this.aligns[j] +"\">"
							+ "<![CDATA[<a href="+herf+" >" + firstRow[j] + "</a>]]>"
							+ "</column>");
				}else
					sb.append("<column width=\""+ this.widths[j] +"\" type=\""+ this.types[j] +"\" align=\""+ this.aligns[j] +"\"><![CDATA["+ firstRow[j] +"]]></column>");
			}
			
			//多行表头
			if(this.header.length > 1) {
				sb.append("<afterInit>");
				for (int i = 1; i < this.header.length; i++) {
					String row = this.header[i];
					if(this.useCheck || this.add_serial) {
						sb.append("<call command=\"attachHeader\"><param>" );
						String[] col_names = row.split(",");
						for (int m = 0; m < col_names.length; m++) {
							String name = col_names[m];
							if(m != 0)
								sb.append(",");
							if(this.add_serial && m == this.serial_number){
								sb.append("#rspan,");
							}
							if(this.useCheck && this.checkbox_index == m)
								sb.append("#rspan,");
							sb.append(name);
						}
						sb.append("</param></call>");
					}else
						sb.append("<call command=\"attachHeader\"><param>" + row + "</param></call>");
				}
				sb.append("</afterInit>");
			}
			
			sb.append("</head>");
		}
	}
	
	/**
	 * 写数据
	 */
	protected void writeData(StringBuffer sb) {
		if(this.leftTree == null && this.leftTreeList == null) {
			this.writeNomalTable(sb);
		}else {
			if(this.leftTreeShowType.equals(ITableTemplate.LEFT_SHOW_TYPE_TREE))
				this.writeLeftTree(sb);
			else if(this.leftTreeShowType.equals(ITableTemplate.LEFT_SHOW_TYPE_TABLE))
				this.writeLeftTable(sb);
		}
	}
	
	/**
	 * 结束字符串
	 */
	protected void end(StringBuffer sb) {
		sb.append("</rows>");
	}
	
	/**
	 * 写入Excel文件
	 */
	public void writeToFile(File file) throws Exception {
		
		String xml = this.getTableString();
		
		if(this.add_serial) {
			for (int i = 0; i < this.header.length; i++) {
				if(i == 0)
					this.header[i] = "序号,"+this.header[i];
				else
					this.header[i] = "#rspan,"+this.header[i];
			}
			this.aligns = insertValueToArray(this.aligns, "center", this.serial_number);
			this.widths = insertValueToArray(this.widths, "40", this.serial_number);
			this.format = insertValueToArray(this.format, ITableTemplate.FORMAT_STRING, this.serial_number);
		}
		
		ExcelExporter exporter = new ExcelExporter(file, xml);
		exporter.setTitle(this.title);
		exporter.setHeader(this.header);
		exporter.setTypes(this.format);
		exporter.setInfo(this.excelInfoRow);
		
		if(this.leftTree != null && this.leftTreeShowType == ITableTemplate.LEFT_SHOW_TYPE_TABLE)
			exporter.setUseTab(false);
		if(!infoInOneRow)
			exporter.setInfoInOneRow(false);
		
		if(this.customerMergeMap != null) {
			exporter.setCustomerMergeMap(this.customerMergeMap);
		}
		exporter.writeWorkBook();
	}

	
	/**
	 * 写普通表格
	 * @param sb
	 */
	protected void writeNomalTable(StringBuffer sb) {
		for (int i = 0; i < this.dataList.size(); i++) {
			Map<String, Object> map = this.dataList.get(i);
			sb.append("<row id=\""+this.getRowId(map)+"\">");
			for (int j = 0; j < this.data_keys.length; j++) {
				if(this.add_serial==true && this.serial_number == j){
					sb.append("<cell>"+(i+1)+"</cell>");
				}
				if(this.useCheck && this.checkbox_index == j)
					sb.append("<cell></cell>");
				sb.append(this.getCellCode(j, map, this.data_keys[j], this.format[j]));
			}
			sb.append("</row>");
		}
	}
	
	/**
	 * 写左侧树
	 * @param sb
	 */
	protected void writeLeftTree(StringBuffer sb) {
		if(this.leftTreeIndex == 0) {
			//以树节点ID作为ID
			this.writeLeftTreeData(sb, this.dataList, this.leftTree, true);
		}else {
			//组合ID
			List<Map<String, Object>> list = null;
			while((list = this.getGroupList()) != null) {
				this.writeLeftTreeData(sb, list, this.leftTree, true);
				this.dataList.removeAll(list);
			}
		}
	}
	
	
	/**
	 * 写左侧合并表格
	 * @param sb
	 */
	protected void writeLeftTable(StringBuffer sb) {
		if(this.leftTreeList != null) {
			for (Tree tree : this.leftTreeList) {
				//获取树节点节点合并Map
				Map<String, String> nodeAttrMap = new HashMap<String, String>();
				this.addTreeNodeAttrToMap(nodeAttrMap, tree, this.getTreeMaxDeep(tree));
				
				this.writeLeftTableData(sb, tree, nodeAttrMap, new ArrayList<TreeNode>());
			}
		} else if(this.leftTree != null) {
			//获取树节点节点合并Map
			Map<String, String> nodeAttrMap = new HashMap<String, String>();
			this.addTreeNodeAttrToMap(nodeAttrMap, this.leftTree, this.getTreeMaxDeep(this.leftTree));
			
			this.writeLeftTableData(sb, this.leftTree, nodeAttrMap, new ArrayList<TreeNode>());
		}
	}
	
	@SuppressWarnings("unchecked")
	protected void writeLeftTableData(StringBuffer sb, Tree tree, Map<String, String> nodeAttrMap, List<TreeNode> preTreeNodeList) { 
		
		List<Tree> children = tree.getChildren();
		
		if(children.size() == 0) {
			String preIds = "";
			for (int v = 0; v < preTreeNodeList.size(); v++) { 
				preIds += ";" + preTreeNodeList.get(v).getNodeID();
			}
			preIds += ";" + tree.getRootNode().getNodeID();
			
			String[] values = preIds.replaceFirst(";", "").split(";");
			
			Map<String, Object> dataMap = this.getMapFromList(this.dataList, this.group_fields, values);
			if(dataMap == null)
				dataMap = new HashMap<String, Object>();
			
			if(this.filter_blank && dataMap.isEmpty())
				return;
			//叶子节点
			sb.append("<row id=\""+preIds.replaceFirst(";", "").replaceAll(";", "@")+"\">");
			
			for (int i = 0; i < preTreeNodeList.size() + 1; i++) {
				
				if(this.add_serial && this.serial_number == i) {
					sb.append("<cell>"+(rownum++)+"</cell>");
				}
				
				if(this.useCheck && this.checkbox_index == i)
					sb.append("<cell></cell>");
				
				TreeNode node = null;
				
				if(i == preTreeNodeList.size())
					node = tree.getRootNode();
				else
					node = preTreeNodeList.get(i);
				
				String entry = nodeAttrMap.get(node.getParentNodeID() + ";" +node.getNodeID());
				if(entry == null || "".equals(entry)) {
					sb.append("<cell>");
				} else {
					String rowspan = entry.split(",")[0];
					String colspan = entry.split(",")[1];
					if("1".equals(rowspan) && "1".equals(colspan))
						sb.append("<cell>");
					else
						sb.append("<cell rowspan=\""+ rowspan +"\" colspan=\""+ colspan +"\">");
					
					//判断是否添加超链接
					String href = this.hrefMap.get(i);
					if(href != null) {
						href = new String(this.hrefMap.get((i+this.leftTreeIndex)));
						String param = "";
						while(!(param = CommonUtil.getParam(href, "[@", "]")).equals("")) {
							String paramVal = getStringValue(dataMap, param);
							href = CommonUtil.replace(href, "[@"+param+"]", paramVal);
						}
						
						if(this.href_drill)
							sb.append("<![CDATA[<a href="+href+" >" + node.getNodeName() + "</a>]]>");
						else
							sb.append("<![CDATA[<a href=javascript:void(0) onclick="+href+" >" + node.getNodeName() + "</a>]]>");
					}else {
						sb.append(node.getNodeName());
					}
					nodeAttrMap.remove(node.getParentNodeID() + ";" +node.getNodeID());
				}
				
				sb.append("</cell>");
			}
			
			for (int i = 0; i < this.data_keys.length; i++) {
				if(this.useCheck && (this.checkbox_index == i+preTreeNodeList.size()+1))
					sb.append("<cell></cell>");
				sb.append("<cell>");
				String href = this.hrefMap.get((i+this.leftTreeIndex));
				if(href != null) {
					href = new String(this.hrefMap.get((i+this.leftTreeIndex)));
					String param = "";
					while(!(param = CommonUtil.getParam(href, "[@", "]")).equals("")) {
						String paramVal = getStringValue(dataMap, param);
						href = CommonUtil.replace(href, "[@"+param+"]", paramVal);
					}
					if(this.href_drill)
						sb.append("<![CDATA[<a href="+href+" >"+ getFormatString(getStringValue(dataMap, this.data_keys[i]), this.format[i+this.leftTreeIndex]) +"</a>]]>");
					else
						sb.append("<![CDATA[<a href=javascript:void(0) onclick="+href+" >"+ getFormatString(getStringValue(dataMap, this.data_keys[i]), this.format[i+this.leftTreeIndex]) +"</a>]]>");
				}else {
					sb.append(getFormatString(getStringValue(dataMap, this.data_keys[i]), this.format[i+this.leftTreeIndex]));
				}
				sb.append("</cell>");
			}
			sb.append("</row>");
			
		} else {
			
			for (int i = 0; i < children.size(); i++) {
				Tree child = children.get(i);
				List<TreeNode> preList = new ArrayList<TreeNode>();
				preList.addAll(preTreeNodeList);
				preList.add(tree.getRootNode());
				
				this.writeLeftTableData(sb, child, nodeAttrMap, preList);
			}
		}
		
	}
	
	/**
	 * 写左侧树表格数据
	 * @param sb
	 * @param list
	 * @param tree
	 * @param isTop
	 */
	@SuppressWarnings("unchecked")
	protected void writeLeftTreeData(StringBuffer sb, List<Map<String, Object>> list, Tree tree, boolean isTop) {
		TreeNode root = tree.getRootNode();
		
		Map<String, Object> dataMap = this.getMapFromList(list, this.leftTreeIndex, root.getNodeName());
		
		if(dataMap == null)
			return;
		
		sb.append("<row id=\""+this.getRowId(dataMap)+"\">");
		
		//写数据
		for (int i = 0; i < this.data_keys.length; i++) {
			if(i < this.leftTreeIndex && !isTop)
				sb.append("<cell></cell>");
			else
				sb.append(this.getCellCode(i, dataMap, this.data_keys[i], this.format[i]));
		}
		
		List<Tree> children = tree.getChildren();
		for (int i = 0; i < children.size(); i++) {
			Tree child = children.get(i);
			this.writeLeftTreeData(sb, list, child, false);
		}
		
		sb.append("</row>");
	}
	
	/**
	 * 写Cell数据
	 * @param map
	 * @param key
	 * @param type
	 * @return
	 */
	protected String getCellCode(int colIndex, Map<String, Object> map, String key, String type) {
		String href = this.hrefMap.get(colIndex);
		if(href != null) {
			href = new String(this.hrefMap.get(colIndex));
			String param = "";
			while(!(param = CommonUtil.getParam(href, "[@", "]")).equals("")) {
				String paramVal = getStringValue(map, param);
				href = CommonUtil.replace(href, "[@"+param+"]", paramVal);
			}
			if(this.href_drill)
				return "<cell><![CDATA[<a href="+href+" >"+ this.getFormatString(getStringValue(map, key), type) +"</a>]]></cell>";
			else
				return "<cell><![CDATA[<a href=javascript:void(0) onclick="+href+" >"+ this.getFormatString(getStringValue(map, key), type) +"</a>]]></cell>";
		}
		return "<cell>" + this.getFormatString(getStringValue(map, key), type) + "</cell>";
	}
	
	/**
	 * 将树节点的合并信息添加到Map中
	 * @param nodeAttrMap
	 * @param tree
	 */
	@SuppressWarnings("unchecked")
	private void addTreeNodeAttrToMap(Map<String, String> nodeAttrMap, Tree tree, int deep) {
		int rspan = this.getLeefNodeCount(tree);
		int cspan = 1;
		
		List<Tree> children = tree.getChildren();
		if(children.size() == 0) {
			cspan = deep - this.getTreeMaxDeep(tree) + 1; 
		}
		TreeNode node = tree.getRootNode();
		nodeAttrMap.put(node.getParentNodeID()+";"+node.getNodeID(), rspan + "," + cspan);
		
		for (int i = 0; i < children.size(); i++) {
			Tree child = children.get(i);
			this.addTreeNodeAttrToMap(nodeAttrMap, child, deep-1);
		}
	}
	
	private String[] insertValueToArray(String[] array, String value, int index) {
		String[] newArray = new String[array.length+1];
		for (int i = 0; i < newArray.length; i++) {
			if(i < index)
				newArray[i] = array[i];
			else if(i == index)
				newArray[i] = value;
			else
				newArray[i] = array[i-1];
		}
		return newArray;
	}
}
