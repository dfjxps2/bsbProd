package com.rx.system.mxgraph;

import java.util.HashMap;
import java.util.Map;

import com.rx.system.util.GlobalUtil;
import com.rx.util.tree.TreeNode;

/**
 * MXGraph图形对象类
 * @author chenxd
 *
 */
public class MXCell {
	
	private String id = null;

	private String parent = null;

	private String value = null;

	private String vertex = null;

	private String edge = null;

	private String source = null;

	private String target = null;
	
	private String shape = "";
	
	private String describe=null;

	private MXGeometry mxg;
	
	private int maxLength = 10;
	
	private Map<String, String> customerPropertiMap = null; //用户定义属性
	
	/**
	 * 构造连接线对象
	 * @param source
	 * @param target
	 */
	public MXCell(MXCell source, MXCell target) {
		this.setId(source.getId() + "@" + target.getId());
		this.source = source.getId();
		this.target = target.getId();
		this.parent = "root";
		this.edge = "1";
	}
	
	/**
	 * 图形对象
	 */
	public MXCell(Map<String, Object> map) {
		this.id = getStringValue(map, "id");
		this.value = getText(getStringValue(map, "value"),this.maxLength);
		this.parent = "root";
		this.vertex = "1";
		this.shape = "sylinder;";
	}
	
	/**
	 * 图形对象
	 */
	public MXCell(TreeNode node) {
		this.id = node.getNodeID();
		this.value = getText(node.getNodeName(),this.maxLength);
		this.parent = "root";
		this.vertex = "1";
		this.shape = "sylinder;";
	}
	
	/**
	 * 返回XML字符串
	 * @return
	 */
	public String getXML() {
		StringBuffer sb = new StringBuffer();

		sb.append("<mxCell id=\"" + this.getId() + "\" value=\""
				+ (this.getValue() == null ? "" : this.getValue())
				+ "\" vertex=\""
				+ (this.getVertex() == null ? "" : this.getVertex())
				+ "\" edge=\"" + (this.getEdge() == null ? "" : this.getEdge())
				+ "\" parent=\"" + this.getParent() + "\" source=\""
				+ (this.getSource() == null ? "" : this.getSource())
				+ "\" target=\""
				+ (this.getTarget() == null ? "" : this.getTarget()) + "\" "
				+ " describe=\""+this.getDescribe()+"\" "
				);
		
		if(this.customerPropertiMap != null && !this.customerPropertiMap.isEmpty())
			for (String key : this.customerPropertiMap.keySet()) {
				String value = this.customerPropertiMap.get(key);
				sb.append(" "+ key + "=\""+value+"\" ");
			}
		
		sb.append("style=\""+(this.getVertex() == null ? "" : this.shape +"\""));
		
		sb.append(">");

		if (this.getEdge() != null && this.getEdge().equals("1")) {
			double[][] ss = mxg.getPoints();
			if (ss != null && ss.length > 0) {
				sb.append("<mxGeometry relative=\"1\" as=\"geometry\">");
				sb.append("<Array as=\"points\">");
				for (int j = 0; j < ss.length; j++) {
					sb.append("<mxPoint x=\"" + ss[j][0] + "\" y=\"" + ss[j][1]
							+ "\" />");
				}
				sb.append("</Array>");
				sb.append("</mxGeometry>");
			} else {
				sb.append("<mxGeometry relative=\"1\" as=\"geometry\"/>");
			}
		} else {
			sb.append("<mxGeometry x=\"" + mxg.getX() + "\" y=\"" + mxg.getY()
					+ "\" width=\"" + mxg.getWidth() + "\" height=\""
					+ mxg.getHeight() + "\" as=\"geometry\" />");

		}
		sb.append("</mxCell>");
		return sb.toString();
	}
	
	public void addProperty(String key,String value) {
		if(this.customerPropertiMap == null)
			this.customerPropertiMap = new HashMap<String, String>();
		this.customerPropertiMap.put(key, value);
	}
	
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getParent() {
		return parent;
	}

	public void setParent(String parent) {
		this.parent = parent;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public String getVertex() {
		return vertex;
	}

	public void setVertex(String vertex) {
		this.vertex = vertex;
	}

	public String getEdge() {
		return edge;
	}

	public void setEdge(String edge) {
		this.edge = edge;
	}

	public String getSource() {
		return source;
	}

	public void setSource(String source) {
		this.source = source;
	}

	public String getTarget() {
		return target;
	}

	public void setTarget(String target) {
		this.target = target;
	}
	
	public String getShape() {
		return shape;
	}

	public void setShape(String shape) {
		this.shape = shape;
	}
	
	public String getDescribe() {
		return describe;
	}

	public void setDescribe(String describe) {
		this.describe = describe;
	}

	public MXGeometry getMxg() {
		return mxg;
	}

	public void setMxg(MXGeometry mxg) {
		this.mxg = mxg;
	}
	
	private String getStringValue(Map<String, Object> paramMap, String key) {
		return GlobalUtil.getStringValue(paramMap, key);
	}
	
	private String getText(String value, int maxLength) {
        if(value.length() < maxLength)
        	return value;
        String tmp = "";
        while(value.length() > maxLength) {
        	tmp += value.substring(0, maxLength)+"&#xa;";
        	value = value.substring(maxLength);
        }
        tmp += value;
        return tmp;
    }
}
