var defaultClientWidth = document.body.clientWidth; 
var defaultClientHeight = document.body.clientHeight;
var mask = new Ext.LoadMask(Ext.getBody(), {
			msg : "正在保存,请稍后......"
});
function showMask() {
	mask.show();
}
function main() {
	if (!mxClient.isBrowserSupported()) {
		mxUtils.error('Browser is not supported!', 200, false);
	} else {
		var container = document.createElement('div');
		container.style.height = "100%";
		container.style.left = '24px';
		container.style.minHeight = document.body.clientHeight + "px";
		container.style.maxHeight = "none";
		container.style.minWidth = document.body.clientWidth + "px";
		container.style.maxWidth = "none";
		if (mxClient.IS_GC || mxClient.IS_SF) {
			container.style.background = '-webkit-gradient(linear, 0% 0%, 0% 100%, from(#FFFFFF), to(#E7E7E7))';
		} else if (mxClient.IS_NS) {
			container.style.background = '-moz-linear-gradient(top, #FFFFFF, #E7E7E7)';
		} else if (mxClient.IS_IE) {
			container.style.filter = 'progid:DXImageTransform.Microsoft.Gradient(StartColorStr=\'#FFFFFF\', EndColorStr=\'#FFFFFF\', GradientType=0)';
		}

		document.body.appendChild(container);

		graph = createGraph(container);
		graph.setResizeContainer(true);
		graph.minimumContainerSize = new mxRectangle(0, 0,document.body.clientWidth,document.body.clientHeight);
		graph.setBorder(9);

		// 设置tooltip显示值为describe属性
		graph.getTooltipForCell = function(cell) {
			if (cell != null && !cell.edge) {
				return cell.value;
			}
		}

		var doc = mxUtils.parseXml(xml);
		var codec = new mxCodec(doc);
		codec.decode(doc.documentElement, graph.getModel());

		// 高亮显示框
		var highlight = new mxCellTracker(graph, null, function(me) {
			var cell = me.getCell();
			if (cell != null) {
				if (!cell.edge && cell.isConnectable())
					return cell;
			}
			return null;
		});

		if (doc != null) {
			graph.addListener(mxEvent.CLICK, function(sender, evt) {
				var e = evt.getProperty('event'); // mouse event
				var cel = evt.getProperty('cell');
				if (cel != null) {
					window.parent.selectElementId = cel.id;
					graph.setSelectionCell(cel);
				}else {
					window.parent.selectElementId = "";
				}
			});
		}
		initBackGround();
		initOverlay();
	}

};

function initOverlay() {
	graph.getModel().beginUpdate();
	try {
		var parent = graph.getDefaultParent();
		var array = graph.getChildCells(parent);
		for(var i=0; i <array.length; i++) {
			var cell = array[i];
			if(!cell.edge && cell.id.length > 1)
				addOverlays(cell,pathUrl+'/bsc/img/'+cell.id+".png",cell.value)
		}
	} finally {
		graph.getModel().endUpdate();
	}
}

/**
 * 添加图形元素
 * @param {} parent 父类
 * @param {} id	
 * @param {} value 
 * @param {} x x坐标
 * @param {} y y坐标
 * @param {} width 长度
 * @param {} height 宽度
 * @param {} style 样式
 * @param {} relative 是否相对定位 默认为false
 */
function addVecter(id,value, x, y, width, height, style, relative,isload) {
	graph.getModel().beginUpdate();
	try {
		var parent = graph.getDefaultParent();
		var cell = graph.insertVertex(parent, id, value, x, y, width, height, style, relative);
		if(!isload){
			addOverlays(cell,pathUrl+'/bsc/img/'+id+".png",value)
		}
	} finally {
		graph.getModel().endUpdate();
	}
}

function addOverlays(cell,imgUrl,desc) {
	var overlay = new mxCellOverlay(new mxImage(imgUrl, 26, 26),desc);
	overlay.cursor = 'hand';
	overlay.offset = new mxPoint(4, 10);
	overlay.align = mxConstants.ALIGN_LEFT;
	overlay.verticalAlign = mxConstants.ALIGN_TOP;
	graph.addCellOverlay(cell, overlay);
	
};

/**
 * 初始化背景框
 * @param {} ids
 * @param {} values
 */
function initBackGround() {
	if(xml != '')
		return;
	
	var bgIds = window.parent.bgIds.split(";");
	var bgValues = window.parent.bgValues.split(";");
	
	var x = 10;
	var y = 10;
	var width = this.defaultClientWidth - 40;
	var height = (this.defaultClientHeight/bgIds.length) - 25;
	for(var i=0; i < bgIds.length; i++) {
		addVecter(bgIds[i],splitStringLine(bgValues[i]),x,y,width,height,("bg"+i),false,true);
		graph.getModel().getCell(bgIds[i]).setConnectable(false);
		y = y + height + 25; 
	}
}

function splitStringLine(s) {
	var ns = "";
	for(var i=0; i<s.length; i++) {
		ns += s.charAt(i);
		if(i != s.length+1)
			ns += "\n";
	}
	return ns;
}

/**
 * 添加连接线
 * @param {} parent
 * @param {} id
 * @param {} value
 * @param {} source
 * @param {} target
 * @param {} style
 */
function addEdge(value,sourceId,targetId) {
	var parent = graph.getDefaultParent();
	graph.getModel().beginUpdate();
	try {
		var source = graph.getModel().getCell(sourceId);
		var target = graph.getModel().getCell(targetId);
		var edge = graph.insertEdge(parent, null, value, source, target);
	} finally {
		graph.getModel().endUpdate();
	}
}

/**
 * 删除元素
 * @param {} id
 */
function deleteElement(id) {
	graph.getModel().beginUpdate();
	try {
		var cell = graph.getModel().getCell(id);
		if(!cell.isConnectable())
			return;
		if(cell != null){
			var array = graph.getModel().getEdges(cell,true,true,true);
			for(var i = 0; i < array.length; i++){
				graph.getModel().remove(array[i]);
			}
			graph.getModel().remove(cell);
		}
		window.parent.selectElementId = "";
	} finally {
		graph.getModel().endUpdate();
	}
}

/**
 * 启用或禁用元素连线
 * @param {} b
 */
function toggleConn(b) {
	graph.setConnectable(b);
}

var disableMove = false;
/**
 * 禁用或启用元素锁定
 * @param {} b
 */
function toggleLock(b) {
//	graph.setEnabled(b);
	disableMove = b;
}

/**
 * 保存战略地图
 */
function saveMap() {
	var encoder = new mxCodec();
	var node = encoder.encode(graph.getModel());
	document.mapForm.graphXML.value = mxUtils.getPrettyXml(node);
	document.mapForm.submit();
};

function createGraph(container) {
	var graph = new mxGraph(container);
	graph.setMultigraph(false);
	graph.setConnectable(true);
	graph.setCellsEditable(false);
	
	//辅助线
	mxGraphHandler.prototype.guidesEnabled = true;
	mxConstants.GUIDE_COLOR = '#FF0000';
	mxConstants.GUIDE_STROKEWIDTH = 1;
	mxEdgeHandler.prototype.snapToTerminals = true;
	mxRectangleShape.prototype.crisp = true;
	
	mxGraph.prototype.edgeLabelsMovable = false;
	mxGraph.prototype.edgeLabelsMovable = false;
	
	mxGraph.prototype.isCellMovable = function(cell) {
		if(cell.edge || disableMove) {
			return false;		
		}
		return true;
	}
	
	new mxRubberband(graph);
	var cellLabelChanged = graph.cellLabelChanged;
	graph.cellLabelChanged = function(cell, newValue, autoSize) {
		autoSize = true;
		cellLabelChanged.apply(this, arguments);
	};
	
	mxConnectionHandlerInsertEdge = mxConnectionHandler.prototype.connect;
	mxConnectionHandler.prototype.connect = function(source,target,evt,dropTarget) {
		if(dropTarget == null)
			return false;
		return mxConnectionHandlerInsertEdge.apply(this, arguments);
	};
	
	// 默认形状样式
	var style = graph.getStylesheet().getDefaultVertexStyle();
	style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_ELLIPSE;
	//style[mxConstants.STYLE_STROKECOLOR] = '#ffe600';
	style[mxConstants.STYLE_ROUNDED] = true;
	style[mxConstants.STYLE_SHADOW] = true;
	style[mxConstants.STYLE_FONTCOLOR] = 'black';
	style[mxConstants.STYLE_FONTSIZE] = '13';
	style[mxConstants.STYLE_SPACING] = 4;
	//style[mxConstants.STYLE_FONTSTYLE] = 1;
	style[mxConstants.STYLE_FILLCOLOR] = 'white';
	style[mxConstants.STYLE_GRADIENTCOLOR] = 'white';
	style[mxConstants.STYLE_GRADIENT_DIRECTION] = mxConstants.DIRECTION_SOUTH;
	graph.getStylesheet().putDefaultVertexStyle(style);
	
	//大的战略背景框样式
	style = [];
	style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_LABEL;
	style[mxConstants.STYLE_STROKECOLOR] = '#102b6a';
	style[mxConstants.STYLE_ROUNDED] = false;
	style[mxConstants.STYLE_SHADOW] = true;
	style[mxConstants.STYLE_FILLCOLOR] = '#4e72b8';
	style[mxConstants.STYLE_FONTSTYLE] = 1;
	style[mxConstants.STYLE_FONTCOLOR] = '#11264f';
	style[mxConstants.STYLE_GRADIENTCOLOR] = 'white';
	style[mxConstants.STYLE_FONTSIZE] = '16';
	style[mxConstants.STYLE_SPACING_LEFT] = 4;
	style[mxConstants.STYLE_LABEL_PADDING] = 4;
	style[mxConstants.LABEL_HANDLE_SIZE] = 14;
	style[mxConstants.STYLE_GRADIENT_DIRECTION] = mxConstants.DIRECTION_SOUTH;
	style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_LEFT;
	style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
//	style[mxConstants.STYLE_HORIZONTAL] = false;
	graph.getStylesheet().putCellStyle('bg0', style);
	
	var style1 = graph.getStylesheet().getCellStyle('bg0');
	style1[mxConstants.STYLE_FILLCOLOR] = '#a3cf62';
	graph.getStylesheet().putCellStyle('bg1', style1);
	
	var style2 = graph.getStylesheet().getCellStyle('bg0');
	style2[mxConstants.STYLE_FILLCOLOR] = '#dec674';
	graph.getStylesheet().putCellStyle('bg2', style2);
	
	var style3 = graph.getStylesheet().getCellStyle('bg0');
	style3[mxConstants.STYLE_FILLCOLOR] = '#e0861a';
	graph.getStylesheet().putCellStyle('bg3', style3);
	
	
	// 默认连接线样式
	style = graph.getStylesheet().getDefaultEdgeStyle();
	style[mxConstants.STYLE_STROKECOLOR] = '#2b4490';
	style[mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = 'white';
	style[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector;
	style[mxConstants.STYLE_ROUNDED] = true;
	style[mxConstants.STYLE_FONTCOLOR] = 'black';
	style[mxConstants.STYLE_FONTSIZE] = '10';
	style[mxConstants.STYLE_STROKEWIDTH] = 2;

	return graph;
};