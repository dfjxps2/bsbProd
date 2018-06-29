var selectLinkId = '', isTree = '', tree = '', rootValue = '';
var expander = new Ext.grid.RowExpander({
	tpl : new Ext.Template('<br><p><b>维度查询语句:</b> {source_expression}</p><br>')
});

// 数据源维度store
var src_dim_ds = new Ext.data.JsonStore({
	url : pathUrl + '/dimLink_list.action',
	root : 'results',
	totalProperty : 'totalCount',
	fields : ['link_id', 'link_name', 'source_expression', 'is_tree',
			'id_field', 'label_field', 'parent_id_field', 'root_value'],
	autoLoad : true
});

// 数据源维度column
var src_dim_cm = [expander, {
	header : '维度ID',
	dataIndex : 'link_id'
}, {
	header : '维度名称',
	dataIndex : 'link_name'
}, {
	header : '标签字段',
	dataIndex : 'label_field'
}, {
	header : '值字段',
	dataIndex : 'id_field'
}, {
	header : '是否树形',
	dataIndex : 'is_tree',
	hidden : true
}];

// 数据源维度明细store
var dim_data_ds = new Ext.data.JsonStore({
	url : pathUrl + '/dimLink_listExpressionDetail.action',
	root : 'results',
	fields : ['value_field', 'display_field']
});

// 数据源维度明细column
var field_data_cm = [{
	header : '标签字段',
	dataIndex : 'display_field',
	align : 'center'
}, {
	header : '值字段',
	dataIndex : 'value_field',
	align : 'center'
}];

Ext.onReady(function() {

	var myview = new MyViewportUi();
	
	onRowSelect();
	
	src_dim_ds.on("beforeload", function() {
		dim_data_ds.removeAll();
		Ext.getCmp('dimLinkDetailTreePanel').setVisible(false);
	});
	
	//处理从数据源配置传递的参数
	if(null != link_id_in_dataconfig && '' != link_id_in_dataconfig){
		src_dim_ds.on("load",afterLoad);
	}
});

MyViewportUi = Ext.extend(Ext.Viewport, {
	layout : 'border',
	initComponent : function() {
		Ext.applyIf(this, {
			items : [{
				xtype : 'grid',
				region : 'center',
				id : 'dimLinkGrid',
				title : '数据源维度',
				columns : src_dim_cm,
				plugins : expander,
				store : src_dim_ds,
				loadMask : true,
				split : true,
				sm : new Ext.grid.RowSelectionModel({
					singleSelect : true
				}),
				flex : 1,
				viewConfig : {
					forceFit : true
				},
				tbar : [{
					xtype : 'button',
					text : '添加',
					iconCls : 'add',
					handler : function() {
						var addWindow = new AddWindow();
						addWindow.show();
					}
				}, '-', {
					xtype : 'button',
					text : '编辑',
					iconCls : 'edit',
					handler : function() {
						var array = Ext.getCmp("dimLinkGrid").getSelectionModel().getSelections();
						if (array.length == 0) {
							Ext.Msg.alert("提示信息", "请选择需要修改的记录");
						} else {
							var editWindow = new EditWindow();
							Ext.getCmp("editdimLinkForm").getForm().loadRecord(Ext.getCmp("dimLinkGrid").getSelectionModel().getSelected());
							var isTree = Ext.getCmp("dimLinkGrid").getSelectionModel().getSelections()[0].get('is_tree');
							
							judgeTree(isTree);

							editWindow.show();
						}
					}
				}, '-', {
					xtype : 'button',
					text : '删除',
					iconCls : 'delete',
					handler : function() {
						var array = Ext.getCmp("dimLinkGrid").getSelectionModel().getSelections();
						if (array.length == 0) {
							Ext.Msg.alert("提示信息", "请选择需要删除的记录");
						} else {
							var link_id = array[0].get('link_id');
							Ext.MessageBox.confirm('确认信息', '是否确认删除选中的数据源维度记录?',
									function(btn) {
										if (btn == 'yes')
											deleteDimLink(link_id);
									});
						}
					}
				}, '->', '搜索：', {
					xtype : 'textfield',
					id : 'searchKey',
					emptyText : '请输入维度ID或维度名...',
					listeners : {
						specialkey : function(field, e) {
							if (e.getKey() == Ext.EventObject.ENTER) {
								src_dim_ds.load({
									params : {
										searchKey : Ext.getCmp("searchKey").getValue()
									}
								})
							}
						}
					},
					width : 150
				}, {
					xtype : 'button',
					iconCls : 'search',
					handler : function() {
						src_dim_ds.load({
							params : {
								searchKey : Ext.getCmp("searchKey").getValue()
							}
						})
					}
				}]
			}, panel = new Ext.Panel({
				region : 'east',
				title : '维度明细',
				width : 420,
				split : true,
				layout : 'fit',
				autoScroll : true,
				items : [{
					xtype : 'grid',
					id : 'dimLinkDetailGrid',
					columns : field_data_cm,
					store : dim_data_ds,
					loadMask : true,
					sm : new Ext.grid.RowSelectionModel({
						singleSelect : true
					}),
					flex : 1,
					autoHeight: true,
					autoScroll : true,
					border : false,
					frame : false,
					viewConfig : {
						forceFit : true
					}
				}, tree = new Ext.tree.TreePanel({
					id : 'dimLinkDetailTreePanel',
					animate : true,
					border : false,
					loader : new Ext.tree.TreeLoader(),
					lines : false,
					autoScroll : true,
					frame : false,
					bodyStyle : 'padding:5px 5px',
					root : getRootNode('', '', expandDimLinkTreeNode),
					rootVisible : false
				})]
			})]
		});

		MyViewportUi.superclass.initComponent.call(this);

		Ext.getCmp('dimLinkDetailTreePanel').setVisible(false);
	}
});


afterLoad = function(){
	for(var i=0;i<src_dim_ds.getCount();i++){
		if(link_id_in_dataconfig == src_dim_ds.getAt(i).get("link_id")){
			Ext.getCmp("dimLinkGrid").getSelectionModel().selectRow(i);
			break;
		}else{
			continue;
		}
	}
}
