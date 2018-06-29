<%@ page language="java" import="java.util.*" contentType="text/html; charset=utf-8" pageEncoding="utf-8" isELIgnored="false"%>
<%
	List dataList = (List)request.getAttribute("dataList");
%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
    <title></title>
    
	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/public/scripts/ext3.4.0/resources/css/ext-all.css" />
	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/public/css/icon.css" />
	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/public/scripts/dhtmlx/dhtmlxgrid.css" />
	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/public/scripts/dhtmlx/skins/dhtmlxgrid_dhx_skyblue.css">	

	<%@ include file="/skin.jsp"%>

	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/ext3.4.0/adapter/ext/ext-base.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/ext3.4.0/ext-all.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/ext3.4.0/locale/ext-lang-zh_CN.js"></script>
	
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/dhtmlx/dhtmlxcommon.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/dhtmlx/dhtmlxgrid.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/dhtmlx/dhtmlxgridcell.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/dhtmlx/ext/dhtmlxgrid_splt.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/dhtmlx/dhtmlxtreegrid.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/dhtmlx/ext/dhtmlxgrid_math.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/dhtmlx/ext/dhtmlxgrid_rowspan.js"></script>	
	
	<script type="text/javascript">
  		var pathUrl = "${pageContext.request.contextPath}";
		var extPath = "${pageContext.request.contextPath}/public/scripts/ext3.4.0";
		Ext.BLANK_IMAGE_URL = extPath + '/resources/images/default/s.gif';
		Ext.QuickTips.init();

		mxBasePath = '${pageContext.request.contextPath}/public/scripts/mxgraph';
    </script>
	<script type="text/javascript" src='${pageContext.request.contextPath}/public/scripts/mxgraph/mxClient.js'></script>
	<script type="text/javascript">
		function TreeNodeShape() { };

		TreeNodeShape.prototype = new mxCylinder();
		TreeNodeShape.prototype.constructor = TreeNodeShape;

		// Defines the length of the upper edge segment.
		TreeNodeShape.prototype.segment = 20;

		// Needs access to the cell state for rendering
		TreeNodeShape.prototype.apply = function(state)
		{
			mxCylinder.prototype.apply.apply(this, arguments);
			this.state = state;
		};
		
		TreeNodeShape.prototype.redrawPath = function(path, x, y, w, h, isForeground)
		{
			var graph = this.state.view.graph;
			var hasChildren = graph.model.getOutgoingEdges(this.state.cell).length > 0;
			
			if (isForeground)
			{
				if (hasChildren)
				{
					// Painting outside of vertex bounds is used here
					path.moveTo(w / 2, h + this.segment);
					path.lineTo(w / 2, h);
					path.end();
				}	
			}
			else
			{
				path.moveTo(0, 0);
				path.lineTo(w, 0);
				path.lineTo(w, h);
				path.lineTo(0, h);
				path.close();
			}
		};
		
		mxCellRenderer.prototype.defaultShapes['treenode'] = TreeNodeShape;

		// Defines a custom perimeter for the nodes in the tree
		mxGraphView.prototype.updateFloatingTerminalPoint = function(edge, start, end, source)
		{
			var pt = null;
			
			if (source)
			{
				pt = new mxPoint(start.x + start.width / 2,
						start.y + start.height + TreeNodeShape.prototype.segment);
			}
			else
			{
				pt = new mxPoint(start.x + start.width / 2, start.y);
			}

			edge.setAbsoluteTerminalPoint(pt, source);
		};
	</script>
	<script type="text/javascript">
		// Program starts here. Creates a sample graph in the
		// DOM node with the specified ID. This function is invoked
		// from the onLoad event handler of the document (see below).
		function main()
		{
			// Checks if browser is supported
			if (!mxClient.isBrowserSupported())
			{
				// Displays an error message if the browser is
				// not supported.
				mxUtils.error('Browser is not supported!', 200, false);
			}
			else
			{
				// Sets the collapse and expand icons. The values below are the default
				// values, but this is how to replace them if you need to.
				mxGraph.prototype.collapsedImage = new mxImage(mxClient.imageBasePath + '/collapsed.gif', 9, 9);
				mxGraph.prototype.expandedImage = new mxImage(mxClient.imageBasePath + '/expanded.gif', 9, 9);
				
				// Workaround for Internet Explorer ignoring certain styles
				var container = document.createElement('div');
				container.style.position = 'absolute';
				container.style.overflow = 'auto';
				container.style.left = '0px';
				container.style.top = '0px';
				container.style.right = '0px';
				container.style.bottom = '0px';
				container.style.background = 'url("${pageContext.request.contextPath}/public/images/grid.gif")';
				
				if (mxClient.IS_IE)
				{
					new mxDivResizer(container);
				}
				
				document.body.appendChild(container);
			
				// Creates the graph inside the given container
				var graph = new mxGraph(container);

				// Set some stylesheet options for the visual appearance
				var style = graph.getStylesheet().getDefaultVertexStyle();
				style[mxConstants.STYLE_SHAPE] = 'treenode';
				style[mxConstants.STYLE_GRADIENTCOLOR] = 'white';
				style[mxConstants.ROUNDED] = true;
				
				style = graph.getStylesheet().getDefaultEdgeStyle();
				style[mxConstants.STYLE_EDGE] = mxEdgeStyle.TopToBottom;
				style[mxConstants.ROUNDED] = true;
				
				// Enables automatic sizing for vertices after editing and
				// panning by using the left mouse button.
				graph.setAutoSizeCells(true);
				graph.setPanning(true);
				graph.panningHandler.useLeftButtonForPanning = true;

				// Stops editing on enter or escape keypress
				var keyHandler = new mxKeyHandler(graph);
				// Enables automatic layout on the graph and installs
				// a tree layout for all groups who's children are
				// being changed, added or removed.
				var layout = new mxCompactTreeLayout(graph, false);
				layout.useBoundingBox = false;
				layout.edgeRouting = false;
				layout.levelDistance = 30;
				layout.nodeDistance = 10;

				var layoutMgr = new mxLayoutManager(graph);
				
				layoutMgr.getLayout = function(cell)
				{
					if (cell.getChildCount() > 0)
					{
						return layout;
					}
				};

				// Disallow any selections
				graph.setCellsSelectable(true);

				graph.setEnabled(true);
				// Defines the condition for showing the folding icon
				graph.isCellFoldable = function(cell)
				{
					return this.model.getOutgoingEdges(cell).length > 0;
				};

				// Defines the position of the folding icon
				graph.cellRenderer.getControlBounds = function(state)
				{
					if (state.control != null)
					{
						var oldScale = state.control.scale;
						var w = state.control.bounds.width / oldScale;
						var h = state.control.bounds.height / oldScale;
						var s = state.view.scale;			

						return new mxRectangle(state.x + state.width / 2 - w / 2 * s,
							state.y + state.height + TreeNodeShape.prototype.segment * s - h / 2 * s,
							w * s, h * s);
					}
					
					return null;
				};

				// Implements the click on a folding icon
				graph.foldCells = function(collapse, recurse, cells)
				{
					this.model.beginUpdate();
					try
					{
						toggleSubtree(this, cells[0], !collapse);
						this.model.setCollapsed(cells[0], collapse);

						// Executes the layout for the new graph since
						// changes to visiblity and collapsed state do
						// not trigger a layout in the current manager.
						layout.execute(graph.getDefaultParent());
					}
					finally
					{
						this.model.endUpdate();
					}
				};
				
				// Gets the default parent for inserting new cells. This
				// is normally the first child of the root (ie. layer 0).
				var parent = graph.getDefaultParent();
								
				// Adds the root vertex of the tree
				graph.getModel().beginUpdate();
				try{
					var w = graph.container.offsetWidth;
					var h= graph.container.offsetHeight;
					//alert(w);
					var v8888 = graph.insertVertex(parent, 'v8888', '总行', 0, 30, 60, 40);
					<%for(int i=0;i<dataList.size();i++){
							Map map = new HashMap();
							map = (Map)dataList.get(i);
							String bankOrgId =(String) map.get("BANK_ORG_ID");
							String bankOrgName =(String) map.get("BANK_ORG_NAME");
							String parentBankOrgId = (String) map.get("PARENT_BANK_ORG_ID");
					%>
								var <%=bankOrgId%> = graph.insertVertex(parent, '<%=bankOrgId%>', '<%=bankOrgName%>', 0, 0, 60, 40);
								graph.insertEdge(parent, null, '', <%=parentBankOrgId%>, <%=bankOrgId%>);
					<%}%>
				} finally {
					graph.getModel().endUpdate();
				}
			}
		};

		// Updates the visible state of a given subtree taking into
		// account the collapsed state of the traversed branches
		function toggleSubtree(graph, cell, show)
		{
			show = (show != null) ? show : true;
			var cells = [];
			
			graph.traverse(cell, true, function(vertex)
			{
				if (vertex != cell)
				{
					cells.push(vertex);
				}

				// Stops recursion if a collapsed cell is seen
				return vertex == cell || !graph.isCellCollapsed(vertex);
			});

			graph.toggleCells(show, cells, true);
		};
	</script>	
</head>
<body onload="main();">
</body>
</html>