<%@ page language="java" import="java.util.*" contentType="text/html; charset=utf-8" pageEncoding="utf-8" isELIgnored="false"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <title>指标公式图形展示</title>
   	<meta http-equiv="pragma" content="no-cache"> 
	<meta http-equiv="cache-control" content="no-cache"> 
	<meta http-equiv="expires" content="0"> 
    
	<link rel="stylesheet" type="text/css"	href="${pageContext.request.contextPath}/public/scripts/ext3.4.0/resources/css/ext-all.css" />
	<link rel="stylesheet" type="text/css"	href="${pageContext.request.contextPath}/public/css/icon.css" />
	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/public/scripts/dhtmlx/grid/dhtmlxgrid.css">
	<link rel="stylesheet" type="text/css"	href="${pageContext.request.contextPath}/public/css/arrow.css" />
	
	<%@ include file="/skin.jsp"%>
	
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/ext3.4.0/adapter/ext/ext-base.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/ext3.4.0/ext-all.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/ext3.4.0/locale/ext-lang-zh_CN.js"></script>
	<script type="text/javascript" src='${pageContext.request.contextPath}/public/scripts/mxgraph/mxClient.js'></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/jquery/jquery-1.9.1.js"></script>
	
	<script type="text/javascript">
		var pathUrl='${pageContext.request.contextPath}';
		var extPath = "${pageContext.request.contextPath}/public/scripts/ext3.4.0";
		Ext.BLANK_IMAGE_URL = extPath + '/resources/images/default/s.gif';
		Ext.QuickTips.init();
		mxBasePath = '${pageContext.request.contextPath}/public/scripts/mxgraph/';
    </script>
  </head>
  <body onload="main()" style="height:100%;">
  </body>
  <script type="text/javascript">
		function main(){
			if (!mxClient.isBrowserSupported()){
				mxUtils.error('Browser is not supported!', 200, false);
			}else{
				var container = document.createElement('div');
               container.style.height ="100%";
               container.style.left = '24px';
               container.style.minHeight =(document.body.clientHeight-24)+"px";
               container.style.maxHeight = "none";   
               container.style.minWidth =document.body.clientWidth+"px";
               container.style.maxWidth = "none";
				//container.style.background = 'url("'+mxBasePath+'/images/grid.gif")';
				if (mxClient.IS_GC || mxClient.IS_SF){
			    	container.style.background = '-webkit-gradient(linear, 0% 0%, 0% 100%, from(#FFFFFF), to(#E7E7E7))';
			    }else if (mxClient.IS_NS){
			    	container.style.background = '-moz-linear-gradient(top, #FFFFFF, #E7E7E7)';  
			    }else if (mxClient.IS_IE){
			    	container.style.filter = 'progid:DXImageTransform.Microsoft.Gradient(StartColorStr=\'#abc88b\', EndColorStr=\'#FFFFFF\', GradientType=0)';
			    }

				//隐藏右键菜单
				//mxEvent.disableContextMenu(container);
				
				if (mxClient.IS_IE)
				{
					new mxDivResizer(container);
				}
		
				document.body.appendChild(container);
		   		 
	   			var graph = createGraph(container);
	   			
				//设置tooltip显示值为describe属性
				graph.getTooltipForCell = function(cell){
				  	if (cell != null&&!cell.edge)
					{
					   return cell.value;
					}
				}
				
	   			var xml = '${requestScope.graphXML}';
	   			var doc = mxUtils.parseXml(xml);
				var codec = new mxCodec(doc);
				codec.decode(doc.documentElement, graph.getModel());
				
				//高亮显示框
			 	var highlight = new mxCellTracker(graph, null, function(me)
				{
					var cell = me.getCell();
					if (cell != null)
					  {
					     if(!cell.edge && cell.canselect=='true')
					     	return cell ;
					  }
					return null;
				});
				
				if(doc!=null){
		 			graph.addListener(mxEvent.CLICK, function(sender, evt) {
					  var e = evt.getProperty('event'); // mouse event
					  var cel = evt.getProperty('cell');
					  if (cel != null)
					  {
					     	
					     if(cel.canselect == 'true') {
						     window.parent.selectId = cel.id;
						     window.parent.category_level = cel.parent_level;
					     	graph.setSelectionCell(cel);
					     }
					  }
					}); 
				}

			}
			
		};

		function createGraph(container){
			var graph = new mxGraph(container);
			graph.setTooltips(true);
			graph.setEnabled(false);
			
			//graph.isCellFoldable = function(cell, collapse){
				//return false;
			//};
			
			// Creates the default style for vertices
			// Creates the stylesheet for the process display
			var style = graph.getStylesheet().getDefaultVertexStyle();
			style[mxConstants.STYLE_FONTSIZE] = '12';
			style[mxConstants.STYLE_FONTCOLOR] = 'black';
			style[mxConstants.STYLE_STROKECOLOR] = 'black';
			style[mxConstants.STYLE_FILLCOLOR] = '#d3d7d4';
			style[mxConstants.STYLE_GRADIENTCOLOR] = '#f6f5ec';
			style[mxConstants.STYLE_GRADIENT_DIRECTION] = mxConstants.DIRECTION_SOUTH;
			style[mxConstants.STYLE_ROUNDED] = true;
			style[mxConstants.STYLE_SHADOW] = true;
			style[mxConstants.STYLE_FONTSTYLE] = 1;
			
			style = graph.getStylesheet().getDefaultEdgeStyle();
			style[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector;
			style[mxConstants.STYLE_STROKECOLOR] = 'black';
			style[mxConstants.STYLE_ROUNDED] = true;

			style = [];
			style = graph.getStylesheet().getDefaultEdgeStyle();
			style[mxConstants.STYLE_ROUNDED] = true;
			style[mxConstants.STYLE_STROKEWIDTH] = 3;
			style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_CONNECTOR;
			style[mxConstants.STYLE_STROKECOLOR] = '#102b6a';
			style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
			style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
			style[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector;
			//style[mxConstants.STYLE_ENDARROW] = mxConstants.ARROW_OVAL;
			style[mxConstants.STYLE_FONTSIZE] = '10';
			style[mxConstants.STYLE_EXIT_X] = 0.5; // center
			style[mxConstants.STYLE_EXIT_Y] = 0; // top
			style[mxConstants.STYLE_EXIT_PERIMETER] = 0; // disabled
			style[mxConstants.STYLE_ENTRY_X] = 0.5; // center
			style[mxConstants.STYLE_ENTRY_Y] = 0.9; // bottom
			style[mxConstants.STYLE_ENTRY_PERIMETER] = 0; // disabled
			graph.getStylesheet().putDefaultEdgeStyle(style);
			
			style = [];
			style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_CLOUD;
			style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
			style[mxConstants.STYLE_STROKECOLOR] = 'red';
			style[mxConstants.STYLE_FONTCOLOR] = '#f15a22';
			style[mxConstants.STYLE_FILLCOLOR] = '#E0E0DF';
			style[mxConstants.STYLE_GRADIENTCOLOR] = 'white';
			style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
			style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_CENTER;
			style[mxConstants.STYLE_STARTSIZE] = 24;
			style[mxConstants.STYLE_FONTSIZE] = '12';
			style[mxConstants.STYLE_FONTSTYLE] = 1;
			style[mxConstants.STYLE_HORIZONTAL] = false;
			graph.getStylesheet().putCellStyle('line', style);
			
			style = [];
			style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
			style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
			style[mxConstants.STYLE_FONTSIZE] = '13';
			style[mxConstants.STYLE_FONTCOLOR] = 'white';
			style[mxConstants.STYLE_STROKECOLOR] = '#ffe600';
			style[mxConstants.STYLE_FILLCOLOR] = '#aa2116';
			style[mxConstants.STYLE_GRADIENTCOLOR] = '#ef4136';
			style[mxConstants.STYLE_GRADIENT_DIRECTION] = mxConstants.DIRECTION_EAST;
			style[mxConstants.STYLE_ROUNDED] = true;
			style[mxConstants.STYLE_SHADOW] = true;
			style[mxConstants.STYLE_FONTSTYLE] = 1;
			
			style[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector;
			style[mxConstants.STYLE_ROUNDED] = true;
			graph.getStylesheet().putCellStyle('step', style);
			
			style = [];
			style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_ELLIPSE;
			style[mxConstants.STYLE_PERIMETER] = mxPerimeter.EllipsePerimeter;
			style[mxConstants.STYLE_STROKECOLOR] = 'gray';
			style[mxConstants.STYLE_FONTCOLOR] = 'gray';
			style[mxConstants.STYLE_FILLCOLOR] = '#A0C88F';
			style[mxConstants.STYLE_GRADIENTCOLOR] = 'white';
			style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
			style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
			style[mxConstants.STYLE_FONTSIZE] = '14';
			graph.getStylesheet().putCellStyle('start', style);
			
			style = mxUtils.clone(style);
			style[mxConstants.STYLE_FILLCOLOR] = '#DACCBC';
			style[mxConstants.STYLE_STROKECOLOR] = '#AF7F73';
			style[mxConstants.STYLE_STROKEWIDTH] = 3;
			graph.getStylesheet().putCellStyle('end', style);
			
			return graph;
		};

		//添加运算指标
		function addMeasure(str){}

		//添加运算符
		function addCalcSign(){}

		//添加函数
		function addFunc(){}
	</script>
</html>
