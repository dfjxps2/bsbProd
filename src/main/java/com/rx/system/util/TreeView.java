package com.rx.system.util;

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.rx.util.CommonUtil;
import com.rx.util.tree.Tree;
import com.rx.util.tree.TreeNode;
@SuppressWarnings("unchecked")
public class TreeView {
	public static String Drill_Mode_Normal = "Normal";
	public static String Drill_Mode_Down = "Down";
	public static String Drill_Mode_Up = "Up";

	private List fieldList = new ArrayList();
	private List dataList = new ArrayList();
	private List dimensionList = new ArrayList();

	private Tree leftTree = null, topTree = null;
	private Map formatMap = new HashMap();

	private String drillMode = "Normal";
	private DrillMethod drillMethod = null;

	private String leftHref = "";
	private Map columnHref = new HashMap();
	private boolean leftRootVisible = true;
	private boolean topRootVisible = true;
	
	//2012-02-21添加
	private boolean hasCheckbox=false;
	private String checkHref="";
	
	public String getCheckHref() {
		return checkHref;
	}
	
	public void setDimensionList(List dimensionList) {
		this.dimensionList = dimensionList;
	}

	public void setCheckHref(String checkHref) {
		this.checkHref = checkHref;
	}

	public boolean isHasCheckbox() {
		return hasCheckbox;
	}

	public void setHasCheckbox(boolean hasCheckbox) {
		this.hasCheckbox = hasCheckbox;
	}

	public void setColumnHref(int index, String href) {
		columnHref.put(new Integer(index), href);
	}

	public String getLeftHref() {
		return leftHref;
	}

	public void setLeftHref(String leftHref) {
		this.leftHref = leftHref;
	}

	public List getFieldList() {
		return this.fieldList;
	}

	public void setFieldList(List fieldList) {
		for (int i = 0; i < fieldList.size(); i++) {
			Field field = (Field) fieldList.get(i);
			if (field.getFormat().equals(""))
				continue;

			DecimalFormat df = new DecimalFormat(field.getFormat());
			formatMap.put(field.getFormat(), df);
		}
		this.fieldList = fieldList;
	}

	public List getDataList() {
		return this.dataList;
	}

	public void setDataList(List dataList) {
		this.dataList = dataList;
	}

	public void setLeftTree(Tree leftTree) {
		this.leftTree = leftTree;
	}

	public Tree getLeftTree() {
		return this.leftTree;
	}

	public Tree getTopTree() {
		return this.topTree;
	}

	public void setTopTree(Tree topTree) {
		this.topTree = topTree;
	}

	public String getAlign() {
		StringBuffer sb = new StringBuffer();

		// sb.append("[\"left\",");
		sb.append("[");

		if (this.drillMode.equals(Drill_Mode_Normal) && !topRootVisible)
			this.drillMode = TreeView.Drill_Mode_Down;

		if (topTree == null) {
			for (int j = 1; j < fieldList.size(); j++) {
				Field field = (Field) fieldList.get(j);
				if (j == 1)
					sb.append("\"" + field.getAlign() + "\"");
				else
					sb.append(",\"" + field.getAlign() + "\"");
			}
		} else {
			int count = 1;
			if (!drillMode.equals(TreeView.Drill_Mode_Normal)
					|| !topRootVisible)
				count += topTree.getChildren().size();

			for (int i = 0; i < count; i++) {
				if (i > 0)
					sb.append(",");
				for (int j = 2; j < fieldList.size(); j++) {
					Field field = (Field) fieldList.get(j);
					if (j == 2)
						sb.append("\"" + field.getAlign() + "\"");
					else
						sb.append(",\"" + field.getAlign() + "\"");

				}
			}
		}
		sb.append("]");

		return sb.toString();
	}

	public String getAlignNoTree() {
		StringBuffer sb = new StringBuffer();

		// sb.append("[\"left\"");
		sb.append("[");
		for (int j = 0; j < fieldList.size(); j++) {
			Field field = (Field) fieldList.get(j);
			if ("col_".equals(field.getFieldName().substring(0, 4))
					&& !"col_1".equals(field.getFieldName())) {
				if ("col_2".equals(field.getFieldName()))
					sb.append("\"" + field.getAlign() + "\"");
				else
					sb.append(",\"" + field.getAlign() + "\"");
			}
			// if(j==2)
			// sb.append("\""+field.getAlign()+"\"");
			// else
			// sb.append(",\""+field.getAlign()+"\"");
		}
		sb.append("]");

		return sb.toString();
	}

	public String getTitle() {
		StringBuffer sb = new StringBuffer();
		int count = 1;

		sb.append("\"<tr align='center'><td class='td_label2' rowspan="
				+ (fieldList.size() > 3 ? 2 : 1) + ">&nbsp</td>");

		if (this.drillMode.equals(Drill_Mode_Normal) && !topRootVisible)
			this.drillMode = TreeView.Drill_Mode_Down;
		
		if(this.dimensionList != null){
			for (int i = 0; i < dimensionList.size(); i++) {
				Map<String, Object> map = (Map<String, Object>) dimensionList.get(i);
				sb.append("<td class='td_label' colspan='"
						+ (fieldList.size() - 2)
						+ "' nowrap> "
						+ GlobalUtil.getStringValue(map, "head_name")
						+ "</td>");
			}
		}
		
		if (drillMode.equals(Drill_Mode_Normal)) {
			if (topTree.getChildren().size() == 0)
				sb.append("<td class='td_label' colspan='"
						+ (fieldList.size() - 2) + "' nowrap>"
						+ topTree.getRootNode().getNodeName() + "</td>");
			else
				sb.append("<td class='td_label' colspan='"
						+ (fieldList.size() - 2)
						+ "' nowrap><a href=javascript:"
						+ drillMethod.getExpression(new String[] {
								topTree.getRootNode().getNodeID(), "Down" })
						+ ">"
						+ topTree.getRootNode().getNodeName()
						+ " <img src='public/images/tabletree/drill_down.gif' border=0></td>");
		} else {
			if (topRootVisible)
				sb.append("<td class='td_label' colspan='"
						+ (fieldList.size() - 2)
						+ "' nowrap><a href=javascript:"
						+ drillMethod.getExpression(new String[] {
								topTree.getRootNode().getNodeID(), "Up" })
						+ ">"
						+ topTree.getRootNode().getNodeName()
						+ " <img src='public/images/tabletree/drill_up.gif' border=0></td>");
			for (int i = 0; i < topTree.getChildren().size(); i++) {
				Tree subTree = (Tree) topTree.getChildren().get(i);
				if (subTree.getChildren().size() == 0)
					sb.append("<td class='td_label' colspan='"
							+ (fieldList.size() - 2) + "' nowrap>"
							+ subTree.getRootNode().getNodeName() + "</td>");
				else
					sb.append("<td class='td_label' colspan='"
							+ (fieldList.size() - 2)
							+ "' nowrap><a href=javascript:"
							+ drillMethod.getExpression(new String[] {
									subTree.getRootNode().getNodeID(), "Down" })
							+ ">"
							+ subTree.getRootNode().getNodeName()
							+ " <img src='public/images/tabletree/drill_down.gif' border=0></a></td>");
				count++;
			}
		}

		sb.append("</tr>");
		if (fieldList.size() > 3) {
			sb.append("<tr align='center'>");
			for (int i = 0; i < count; i++) {
				for (int j = 2; j < fieldList.size(); j++) {
					Field field = (Field) fieldList.get(j);
					sb.append("<td class='td_label' nowrap width='100'>"
							+ field.getFieldLabel() + "</td>");
				}
			}
			sb.append("</tr>");
		}
		sb.append("\"");

		return sb.toString();
	}

	public String getXML() {
		if (this.drillMode.equals(Drill_Mode_Normal) && !topRootVisible)
			this.drillMode = TreeView.Drill_Mode_Down;

		StringBuffer sb = new StringBuffer();

		sb.append("<root>");
		deal(sb, leftTree, topTree, fieldList, dataList);
		sb.append("</root>");

		return sb.toString();
	}

	/**
	 * 针对左边非数据列项不需要用树结构展示，数据存放在List中
	 * 
	 */
	public String getXMLNoTree() {
		StringBuffer sb = new StringBuffer();
		sb.append("<root>");
		deal(sb, fieldList, dataList);
		sb.append("</root>");
		return sb.toString();
	}

	private void deal(StringBuffer sb, Tree leftTree, Tree topTree,
			List fieldList, List dataList) {
		TreeNode node = leftTree.getRootNode();
		List children = leftTree.getChildren();

		if (leftRootVisible
				|| !leftTree.getRootNode().getNodeID().equals(this.leftTree.getRootNode().getNodeID())){
			if(this.hasCheckbox){
				Map row = getRowValues(node, fieldList, dataList);
				sb.append("<row id=\"" + node.getNodeID() + "\" hascheck=\"true\" checkfun=\""+getCheckFunc(row)+"\" >");
			}else
				sb.append("<row id=\"" + node.getNodeID() + "\">");
		}
			

		sb.append(getDataString(node, topTree, fieldList, dataList));

		if (children.size() > 0) {
			// sb.append(getDataString(node,topTree,fieldList,dataList));
			for (int i = 0; i < children.size(); i++) {
				Tree child = (Tree) children.get(i);
				deal(sb, child, topTree, fieldList, dataList);
			}
		}

		if (leftRootVisible
				|| !leftTree.getRootNode().getNodeID().equals(this.leftTree.getRootNode().getNodeID()))
			sb.append("</row>\n");
	}

	/**
	 * 针对左边非数据列项不需要用树结构展示,数据存放在List中
	 * 
	 */
	private void deal(StringBuffer sb, List fieldList, List dataList) {
		sb.append(getDataString(fieldList, dataList));
	}

	private String getDataString(TreeNode leftNode, Tree topTree,
			List fieldList, List dataList) {
		StringBuffer sb = new StringBuffer();
		Field leftField = (Field) fieldList.get(0);
		if(leftField.getFieldName().equals("bank_org_id"))
			sb.append("<cell text=\"" + leftNode.getNodeName()+"["+leftNode.getNodeID()+"]" + "\" href=\""
					+ getHref(leftNode) + "\"/>");
		else
			sb.append("<cell text=\"" + leftNode.getNodeName()+"\" href=\""
					+ getHref(leftNode) + "\"/>");
		if (topTree == null) {
			Map values = getRowValues(leftNode, fieldList, dataList);
			for (int j = 1; j < fieldList.size(); j++)
				sb.append(getCellString(j, values));
		} else {
			if (drillMode.equals(TreeView.Drill_Mode_Normal)) {
				Map values = getRowValues(leftNode, topTree.getRootNode(), fieldList, dataList);
				for (int i = 2; i < fieldList.size(); i++)
					sb.append((getCellString(i, values)));
			} else {
				if(topRootVisible)
	        	{
		        	Map values=getRowValues(leftNode,topTree.getRootNode(),fieldList,dataList);
		        	for(int i=2;i<fieldList.size();i++)
		        		sb.append((getCellString(i,values)));
	        	}
	        	
		        List topChildren=topTree.getChildren();
		        for(int i=0;i<topChildren.size();i++)
		        {
		        	Tree topChild=(Tree)topChildren.get(i);
		        	TreeNode cNode=topChild.getRootNode();
		        	Map row=getRowValues(leftNode,cNode,fieldList,dataList);
		        	for(int j=2;j<fieldList.size();j++)
		        		sb.append(getCellString(j,row));
		        }
				
			}
		}

		return sb.toString();
	}

	private String getCellString(int fieldIndex, Map values) {
		Field field = (Field) fieldList.get(fieldIndex);
		String format = field.getFormat();

		String string = "";
		if ("".equals(format)) {
			String value = CommonUtil.getStringValue(values.get(field.getFieldName()));
			string = "<cell text=\"" + value + "\" href=\""
					+ getHref(values, fieldIndex) + "\"/>";
		} else {
			DecimalFormat df = (DecimalFormat) formatMap.get(field.getFormat());
			double value = CommonUtil.getDoubleValue(values.get(field.getFieldName()));
			string = "<cell text=\"" + df.format(value) + "\" href=\""
					+ getHref(values, fieldIndex) + "\"/>";
		}

		return string;
	}

	/**
	 * 针对左边非数据列项不需要用树结构展示，数据存放在List中
	 * 
	 */
	private String getDataString(List fieldList, List dataList) {
		StringBuffer sb = new StringBuffer();
		int ran = Integer.parseInt(CommonUtil.getRandomID(8));
		if (dataList.size() > 0) {
			for (int i = 0; i < dataList.size(); i++) {
				Map row = (Map) dataList.get(i);
				Field f = (Field) fieldList.get(0);
				String rowId = CommonUtil.getStringValue(row.get(f.getFieldName()));
				if ("".equals(rowId)) {// rowID 为空的情况,给一个唯一的数值
					rowId = String.valueOf(ran++);
				}
				if(this.hasCheckbox){
						sb.append("<row id=\"" + rowId + "\" hascheck=\"true\" checkfun=\""+getCheckFunc(row)+"\" >");
//						System.out.println("<row id=\"" + rowId + "\" hascheck=\"true\" checkfun=\""+getCheckFunc(row)+"\" >");
//						sb.append("<row id=\"" + rowId + "\">");
				}else
						sb.append("<row id=\"" + rowId + "\">");
				for (int j = 1; j < fieldList.size(); j++) {
					Field field = (Field) fieldList.get(j);
					if ("col_".equals(field.getFieldName().substring(0, 4))) {
						DecimalFormat df = (DecimalFormat) formatMap.get(field.getFormat());
						String format = field.getFormat();

						// 处理数据类型为string
						if ("".equals(format)) {
							String value = CommonUtil.getStringValue(row.get(field.getFieldName().toUpperCase()));
							if ("".equals(value)) {
								value = CommonUtil.getStringValue(row.get(field.getFieldName()));
							}
							sb.append("<cell text=\"" + value + "\" href=\""
									+ getHref(row, j) + "\"/>");
						} else {
							Object fieldValue = row.get(field.getFieldName().toUpperCase());
							if (null == fieldValue) {
								fieldValue = row.get(field.getFieldName());
							}
							double value = CommonUtil.getDoubleValue(fieldValue);
							sb.append("<cell text=\"" + df.format(value)
									+ "\" href=\"" + getHref(row, j) + "\"/>");
						}
					}
				}
				sb.append("</row>\n");
			}

		}
		return sb.toString();
	}

	private Map getRowValues(TreeNode leftNode, TreeNode topNode,
			List fieldList, List dataList) {
		Field leftField = (Field) fieldList.get(0);
		Field topField = (Field) fieldList.get(1);

		for (int i = 0; i < dataList.size(); i++) {
			Map row = (Map) dataList.get(i);
			String leftKey = CommonUtil.getStringValue(row.get(leftField.getFieldName()));
			String topKey = CommonUtil.getStringValue(row.get(topField.getFieldName()));
			if (leftKey.equals(leftNode.getNodeID())
					&& topKey.equals(topNode.getNodeID()))
				return row;
		}

		return new HashMap();
	}

	private Map getRowValues(TreeNode leftNode, List fieldList, List dataList) {
		Field leftField = (Field) fieldList.get(0);

		for (int i = 0; i < dataList.size(); i++) {
			Map row = (Map) dataList.get(i);
			String leftKey = CommonUtil.getStringValue(row.get(leftField.getFieldName()));

			if (leftKey.equals(leftNode.getNodeID()))
				return row;
		}

		return new HashMap();
	}

	// private Map getRowValues(List fieldList,List dataList)
	// {
	// Field leftField=(Field)fieldList.get(0);
	//		
	// for(int i=0;i<dataList.size();i++)
	// {
	// Map row=(Map)dataList.get(i);
	// String
	// leftKey=CommonUtil.getStringValue(row.get(leftField.getFieldName()));
	//			
	// //if(leftKey.equals(leftNode.getNodeID()))
	// return row;
	// }
	//		
	// return new HashMap();
	// }

	public String getDrillMode() {
		return drillMode;
	}

	public void setDrillMode(String drillMode) {
		this.drillMode = drillMode;
	}

	public void setDrillMethod(String methodName, String[] args) {
		drillMethod = new DrillMethod();
		drillMethod.setName(methodName);
		for (int i = 0; i < args.length; i++)
			drillMethod.addArgument(args[i]);
	}

	private String getHref(TreeNode node) {
		String href = new String(leftHref);
		String param = CommonUtil.getParam(href, '[', ']');
		while (!param.equals("")) {
			if (param.equalsIgnoreCase("NodeID"))
				href = CommonUtil.replace(href, '[' + param + ']', node.getNodeID());
			else if (param.equalsIgnoreCase("NodeName"))
				href = CommonUtil.replace(href, '[' + param + ']', node.getNodeName());
			else if (param.equalsIgnoreCase("ParentNodeID"))
				href = CommonUtil.replace(href, '[' + param + ']', node.getParentNodeID());
			else
				href = CommonUtil.replace(href, '[' + param + ']', "");
			param = CommonUtil.getParam(href, '[', ']');
		}

		return href;
	}

	private String getHref(Map rowValues, int columnIndex) {
		String href = (String) columnHref.get(new Integer(columnIndex));
		if (href == null)
			return "";

		href = new String(href);

		String param = CommonUtil.getParam(href, '[', ']');
		while (!param.equals("")) {
			String value = "";
			if (param.startsWith("Value")) {
				String key = CommonUtil.getParam(param, '(', ')');
				value = CommonUtil.getStringValue(rowValues.get(key));
			}
			href = CommonUtil.replace(href, '[' + param + ']', value);
			param = CommonUtil.getParam(href, '[', ']');
		}

		return href;
	}
	
	private String getCheckFunc(Map rowValues) {
		String href = this.checkHref;
		if (href == null)
			return "";

		href = new String(href);

		String param = CommonUtil.getParam(href, '[', ']');
		while (!param.equals("")) {
			String value = "";
			if (param.startsWith("Value")) {
				String key = CommonUtil.getParam(param, '(', ')');
				value = CommonUtil.getStringValue(rowValues.get(key));
			}
			href = CommonUtil.replace(href, '[' + param + ']', value);
			param = CommonUtil.getParam(href, '[', ']');
		}

		return href;
	}
	
//	private String getHref(String value, int columnIndex) {
//		String href = (String) columnHref.get(new Integer(columnIndex));
//		if (href == null)
//			return "";
//
//		href = new String(href);
//
//		String param = CommonUtil.getParam(href, '[', ']');
//		while (!param.equals("")) {
//
//			href = CommonUtil.replace(href, '[' + param + ']', value);
//			param = CommonUtil.getParam(href, '[', ']');
//		}
//
//		return href;
//	}

	public boolean isLeftRootVisible() {
		return leftRootVisible;
	}

	public boolean isTopRootVisible() {
		return topRootVisible;
	}

	public void setLeftRootVisible(boolean leftRootVisible) {
		this.leftRootVisible = leftRootVisible;
	}

	public void setTopRootVisible(boolean topRootVisible) {
		this.topRootVisible = topRootVisible;
	}
}
@SuppressWarnings("unchecked")
class DrillMethod {
	private String name = "";
	private List argList = new ArrayList();

	public void addArgument(String argValue) {
		argList.add(argValue);
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getExpression(String[] prepareArguments) {
		String exp = name + "(";
		for (int i = 0; i < argList.size(); i++) {
			String arg = (String) argList.get(i);
			if (i > 0)
				exp += ",";
			exp += "'" + arg + "'";
		}

		if (prepareArguments != null) {
			for (int i = 0; i < prepareArguments.length; i++) {
				exp += ",'" + prepareArguments[i] + "'";
			}
		}
		return exp + ")";
	}
}