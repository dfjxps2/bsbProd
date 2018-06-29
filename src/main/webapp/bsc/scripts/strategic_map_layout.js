var selectElementId = '';
var category_level = '';
Ext.onReady(function(){
	var tbar = [{
		text : '保存地图(s)',
		tooltip : '保存战略地图',
		iconCls : 'save',
		handler : function(){
			document.getElementById("mapframe").contentWindow.saveMap();
			Ext.getCmp("disableConn").setVisible(true);
			Ext.getCmp("enableConn").setVisible(false);
			Ext.getCmp("lock").setVisible(true);
			Ext.getCmp("unlock").setVisible(false);
			document.getElementById("mapframe").contentWindow.showMask();
		}
	},'-',{
		text : '删除元素(d)',
		tooltip : '删除战略地图中选中元素',
		iconCls : 'delete',
		handler : function() {
			if(selectElementId == '') {
				Ext.MessageBox.alert("提示信息","请选择需要删除的元素");
				return;
			}
			document.getElementById("mapframe").contentWindow.deleteElement(selectElementId);
		}
	},'-',{
		id : 'disableConn',
		text : '禁用连线',
		tooltip : '禁用元素间连接线',
		iconCls : 'forbid',
		handler : function() {
			document.getElementById("mapframe").contentWindow.toggleConn(false);
			Ext.getCmp("disableConn").setVisible(false);
			Ext.getCmp("enableConn").setVisible(true);
		}
	},{
		id : 'enableConn',
		text : '启用连线',
		tooltip : '启用元素间连接线',
		iconCls : 'connect',
		handler : function() {
			document.getElementById("mapframe").contentWindow.toggleConn(true);
			Ext.getCmp("enableConn").setVisible(false);
			Ext.getCmp("disableConn").setVisible(true);
		}
	},'-',{
		id : 'lock',
		text : '锁定位置',
		tooltip : '锁定元素位置,不能拖动',
		iconCls : 'lock',
		handler : function() {
			document.getElementById("mapframe").contentWindow.toggleLock(true);
			Ext.getCmp("lock").setVisible(false);
			Ext.getCmp("unlock").setVisible(true);
		}
	},{
		id : 'unlock',
		text : '取消锁定位置',
		tooltip : '取消元素的锁定,使元素可以拖动',
		iconCls : 'employee',
		handler : function() {
			document.getElementById("mapframe").contentWindow.toggleLock(false);
			Ext.getCmp("lock").setVisible(true);
			Ext.getCmp("unlock").setVisible(false);
		}
	},'-',{
		text : '刷新(s)',
		tooltip : '刷新战略地图',
		iconCls : 'fresh',
		handler : function(){
			height = $("#mapframe").height();
			width = $("#mapframe").width();
			document.getElementById("mapframe").src = pathUrl + '/strategicMap_loadMap.action?height='+height+"&width="+width;
			Ext.getCmp("disableConn").setVisible(true);
			Ext.getCmp("enableConn").setVisible(false);
			Ext.getCmp("lock").setVisible(true);
			Ext.getCmp("unlock").setVisible(false);
		}
	
	}];
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [{
			id : 'centerpanel',
			region : 'center',
			title : '战略地图',
			xtype : 'panel',
			border : true,
			tbar : tbar,
			layout : 'border',
			items : [{
				region : 'center',
				contentEl : 'mapframe',
				border : false,
				split : false
			}]
		},{
			id : 'westpanel',
			region : 'west',
			xtype : 'panel',
			border : true,
			split : true,
			width : 220,
			layout : 'fit',
			title : '战略元素',
			collapsible : true,
			items : [{
				contentEl : 'strategic_tree',
				border : false,
				split : false
			}]
		}]
	});
	Ext.getCmp("enableConn").setVisible(false);
	Ext.getCmp("unlock").setVisible(false);
	height = $("#mapframe").height();
	width = $("#mapframe").width();
	document.getElementById("mapframe").src = pathUrl + '/strategicMap_loadMap.action?height='+height+"&width="+width;
});

