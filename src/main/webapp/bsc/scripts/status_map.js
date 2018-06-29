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
			container.style.filter = 'progid:DXImageTransform.Microsoft.Gradient(StartColorStr=\'#f2eada\', EndColorStr=\'#FFFFFF\', GradientType=0)';
		}

		document.body.appendChild(container);

		graph = createGraph(container);
		graph.setResizeContainer(false);
		graph.minimumContainerSize = new mxRectangle(0, 0,document.body.clientWidth,document.body.clientHeight);
		graph.setBorder(9);

		// 设置tooltip显示值为describe属性
		graph.getTooltipForCell = function(cell) {
//			if (cell != null && !cell.edge) {
//				return cell.value;
//			}
		}

		var doc = mxUtils.parseXml(xml);
		var codec = new mxCodec(doc);
		codec.decode(doc.documentElement, graph.getModel());

		// 高亮显示框
//		var highlight = new mxCellTracker(graph, null, function(me) {
//			var cell = me.getCell();
//			if (cell != null) {
//				if (!cell.edge && cell.isConnectable())
//					return cell;
//			}
//			return null;
//		});

		if (doc != null) {
			graph.addListener(mxEvent.CLICK, function(sender, evt) {
				var e = evt.getProperty('event'); // mouse event
				var cel = evt.getProperty('cell');
			});
		}
		initOverlay();
		initStrategicStatus();
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
				addIDOverlays(cell,pathUrl+'/bsc/img/'+cell.id+".png",'['+cell.id+']:'+cell.value)
		}
	} finally {
		graph.getModel().endUpdate();
	}
}

function addIDOverlays(cell,imgUrl,desc) {
	var overlay = new mxCellOverlay(new mxImage(imgUrl, 26, 26),desc);
	overlay.cursor = 'hand';
	overlay.offset = new mxPoint(4, 10);
	overlay.align = mxConstants.ALIGN_LEFT;
	overlay.verticalAlign = mxConstants.ALIGN_TOP;
	graph.addCellOverlay(cell, overlay);
	
};

function initStrategicStatus() {
	graph.getModel().beginUpdate();
	try {
		if(strategicIds != '') {
			var idArray = strategicIds.split(";");
			var statusArray = strategicStatus.split(";");
			var statusDescArray = statusDesc.split(";");
			var comparedArray = strategicCompared.split(";");
			for(var i=0; i<idArray.length; i++) {
				var cell = graph.getModel().getCell(idArray[i]);
				if(cell == null || idArray[i].length <= 1)
					continue;
				var imgUrl = 'bsc/img/'+statusArray[i]+'.png';
				this.addOverlays(cell,imgUrl,statusDescArray[i]);
				
				var desc = '';
				if('score_down' ==  comparedArray[i])
					desc = '比上季下降'
				else
					desc = '比上季上升'
				var compareImgUrl = 'bsc/img/'+comparedArray[i]+'.png';
				this.addComparedOverlays(cell,compareImgUrl,desc);
			}	
		}
	} finally {
		graph.getModel().endUpdate();
	}
}

function addOverlays(cell,imgUrl,desc) {
	var overlay = new mxCellOverlay(new mxImage(imgUrl, 18, 18),desc);
	overlay.cursor = 'hand';
	overlay.offset = new mxPoint(-5, 9);
	overlay.align = mxConstants.ALIGN_RIGHT;
	overlay.verticalAlign = mxConstants.ALIGN_TOP;
//	overlay.addListener(mxEvent.CLICK, mxUtils.bind(this, function(sender,evt) {
//		alert(cell.id);
//	}));
	graph.addCellOverlay(cell, overlay);
	
};

function addComparedOverlays(cell,compared,desc){
	
	var coverlay = new mxCellOverlay(new mxImage(compared,18,18),desc);
	coverlay.cursor = 'hand';
	coverlay.offset = new mxPoint(-5,-6);
	coverlay.align = mxConstants.ALIGN_RIGHT;
	coverlay.verticalAlign = mxConstants.ALIGN_BOTTOM;
	graph.addCellOverlay(cell,coverlay);
}

function createGraph(container) {
	var graph = new mxGraph(container);
	graph.setEnabled(false);
	graph.setTooltips(true);
	graph.setMultigraph(false);
	graph.setConnectable(false);
	graph.setCellsEditable(false);
	
	mxGraph.prototype.edgeLabelsMovable = false;
	mxGraph.prototype.edgeLabelsMovable = false;
	
	mxGraph.prototype.isCellMovable = function(cell) {
		return false;
	}
	
	//new mxRubberband(graph);
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
	style[mxConstants.STYLE_STROKECOLOR] = '#102b6a';
	style[mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = 'white';
	style[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector;
	style[mxConstants.STYLE_ROUNDED] = true;
	style[mxConstants.STYLE_FONTCOLOR] = 'black';
	style[mxConstants.STYLE_FONTSIZE] = '10';
	style[mxConstants.STYLE_STROKEWIDTH] = 2;

	return graph;
};