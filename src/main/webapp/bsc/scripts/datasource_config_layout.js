var selectedSourceId = '';//选中数据源ID

//定义store。用于存储某数据源表达式中所有的字段。
var sorExpStore = new Ext.data.JsonStore({
	url : pathUrl + '/datasourceconfig_getSorExpFields.action',
	root: 'results',
	fields: ['field_name','field_type','field_order']
});

//数据源Store
var sourceStore = new Ext.data.JsonStore({
	url : pathUrl + '/datasourceconfig_list.action',
	root: 'results',
	totalProperty: 'totalCount',
	autoLoad: true,
	fields: ['source_id','source_name','source_expression','obj_cate_id','obj_cate_desc','obj_column']
});
sourceStore.on("beforeload", function(){
	selectedSourceId = '';
	sourceFieldStore.removeAll();
	//searchKey = Ext.getCmp("searchKey").getValue();
	//sourceStore.baseParams={searchKey:searchKey}
});

var expander = new Ext.grid.RowExpander({
    tpl : new Ext.Template(
        '<br><p><b>数据源表达式:</b> <font color=\"green\">{source_expression}</font></p><br>'
    )
});

//数据源Grid列
var souceColumn = new Ext.grid.ColumnModel([
	 expander,
	{header: '数据源ID', dataIndex: 'source_id'},
	{header: '数据源名', dataIndex: 'source_name'},
	{header: '考核对象类型ID', dataIndex: 'obj_cate_id',hidden : true},
	{header: '考核对象类型',dataIndex:'obj_cate_desc'},
	{header: '对象维度字段',dataIndex:'obj_column'}
]);

//行选择模式
var sm = new Ext.grid.RowSelectionModel({
	singleSelect: true
});

//菜单
var souceTopbar = [{
	text: '添加(a)',
	toolTip: '添加新的数据源',
	iconCls: 'add',
	handler: function() {
		var addWindow = new AddDataSourceWindow();
		addWindow.show();
	}
},'-',{
	text: '编辑(e)',
	toolTip: '修改的数据源属性',
	iconCls: 'edit',
	handler: function() {
		var record = getSelectedRecord("sourceGridPanel");
		if(record ==null) {
			Ext.MessageBox.alert("提示信息","请选择需要编辑的记录");
			return;
		}
		var editWindow = new EditDataSourceWindow();

		Ext.getCmp("editDataSourceForm").getForm().loadRecord(record);
		editWindow.show();
	}
},'-',{
	text: '删除(d)',
	toolTip: '删除数据源记录',
	iconCls: 'delete',
	handler: function() {
		var record = getSelectedRecord("sourceGridPanel");
		if(record ==null) {
			Ext.MessageBox.alert("提示信息","请选择需要删除的记录");
			return;
		}
		Ext.MessageBox.confirm('确认信息','是否确认删除选中的数据源记录?',function(btn){
			if(btn == 'yes')
	    		deleteSourceRecord(record.get('source_id'));
	    });
	}
},'->','搜索:',{
	xtype: 'textfield',
	id: 'searchKey',
	emptyText : '请输入数据源ID或者名称...',
	width: 150,
	listeners: {
		specialkey: function(field,e) {
			if(e.getKey() == Ext.EventObject.ENTER){
				sourceStore.load({
					params: {searchKey: Ext.getCmp("searchKey").getValue().toUpperCase()
				}})			    	    			
			}
		}
	}},{
	xtype: 'button',
	iconCls: 'search',
	handler: function() {
		sourceStore.load({
			params: {searchKey: Ext.getCmp("searchKey").getValue()
		}})
	}
}];

var sourceGridPanel = new Ext.grid.GridPanel({
	id: 'sourceGridPanel',
	title: '数据源列表',
	region: 'center',
	autoScorll: true,
	split: true,
	ds: sourceStore,
	cm: souceColumn,
	plugins: expander,
	sm: sm,
	loadMask: true,
	tbar: souceTopbar,
	viewConfig: {forceFit: true}/*,
	bbar: new Ext.PagingToolbar({
		pageSize : 30,
		store : sourceStore,
		displayInfo : true,
		displayMsg : '第{0}-{1}条记录,共{2}条记录',
		emptyMsg : "没有记录"
	})*/
});


//数据源字段Store
var sourceFieldStore = new Ext.data.GroupingStore({
	proxy:new Ext.data.HttpProxy({
			url : pathUrl + '/datasourceconfig_sourceFieldList.action?type=dataConfig'
	}),
	reader : new Ext.data.JsonReader({
		root : 'results',
		totalProperty : 'totalCount'
	},[
		{name: 'source_id'},
		{name: 'column_name'},
		{name: 'column_biz_name'},
		{name: 'data_type_id'},
		{name: 'column_order_id'},
		{name: 'is_dim_col'},
		{name: 'link_id'},
		{name:'link_name_in_dataconfig'}
	]),
	sortInfo: {field: 'column_order_id', direction: "ASC"},
    groupField: 'is_dim_col',
    remoteSort :true
})

//数据源字段Column
var sourceFieldCoulumn = new Ext.grid.ColumnModel([
	{header: '数据源ID', dataIndex: 'source_id', hidden: true},
	{header: '字段名称', dataIndex: 'column_name'},
	{header: '字段中文名', dataIndex: 'column_biz_name'},
	{header: '数据类型', dataIndex: 'data_type_id'},
	{header: '字段顺序',dataIndex:'column_order_id'},
	{header: '字段类型', dataIndex: 'is_dim_col',hidden: true,renderer:function(val){
		if(val=='Y'){
			return '维度字段';
		}else if(val=='N'){
			return '度量字段';
		}
		return val;
	}},
	{header:'维度链接',dataIndex:'link_name_in_dataconfig'}
]);

//行选择模式
var field_sm = new Ext.grid.RowSelectionModel({
	singleSelect: true
});

//菜单
var souceFieldTopbar = [{
	text: '添加(a)',
	toolTip: '添加新的数据源字段',
	iconCls: 'add',
	handler: function() {
		var record = getSelectedRecord("sourceGridPanel");
		if(record ==null) {
			Ext.MessageBox.alert("提示信息","请先选择一条数据源记录");
			return;
		}
		//添加数据源字段之前得到所有的表达式中的字段
		sorExpStore.on("beforeload",function(obj){
			obj.baseParams = {
				source_id  : record.get("source_id"),
				source_exp : record.get("source_expression")
			}
		});
		
		sorExpStore.load({
			callback : function(){
				if(sorExpStore.getCount() > 0){
					var addFieldWindow = new AddSourceFieldWindow();
					addFieldWindow.show();
				}else{
					Ext.MessageBox.alert("提示",record.get("source_id") + "数据源的所有字段已全部添加，不存在可以继续添加的字段！");
				}
			}
		});
		
		
	}
},'-',{
	text: '编辑(e)',
	toolTip: '修改的数据源字段属性',
	iconCls: 'edit',
	handler: function() {
		var record = getSelectedRecord("sourceFieldGrid");
		if(record ==null) {
			Ext.MessageBox.alert("提示信息","请选择需要编辑的记录");
			return;
		}
		
		var editFieldWindow = new EditSourceFieldWindow();
		if(record.get('is_dim_col') == 'N') {
			Ext.getCmp("linkIdSelector").setDisabled(true);
		}

		Ext.getCmp("editSourceFieldForm").getForm().loadRecord(record);
		editFieldWindow.show();
	}
},'-',{
	text: '删除(d)',
	toolTip: '删除数据源字段记录',
	iconCls: 'delete',
	handler: function() {
		var record = getSelectedRecord("sourceFieldGrid");
		if(record ==null) {
			Ext.MessageBox.alert("提示信息","请选择需要删除的记录");
			return;
		}
		
		Ext.MessageBox.confirm('确认信息','是否确认删除选中的数据源字段记录?',function(btn){
			if(btn == 'yes')
	    		deleteSourceFieldRecord(record.get('source_id'),record.get('column_name'));
	    });
	}
}];

var sourceFieldGrid = new Ext.grid.GridPanel({
	id: 'sourceFieldGrid',
	title: '数据源字段列表',
	region: 'east',
	autoScorll: true,
	width: 500,
	split: true,
	viewConfig: {forceFit: true},
	view: new Ext.grid.GroupingView({
        forceFit:true,
        groupTextTpl: '{text} ({[values.rs.length]} 条记录)'
    }),
	loadMask: true,
	ds: sourceFieldStore,
	cm: sourceFieldCoulumn,
	sm: field_sm,
	tbar: souceFieldTopbar
});


//返回选中的记录
function getSelectedRecord(panelId) {
	var grid = Ext.getCmp(panelId);
	if(!grid)
		return null;
		
	var array = grid.getSelectionModel().getSelections();
	if(array.length == 0)
		return null;
    
	return array[0];
}

Ext.onReady(function(){

	var myview = new Ext.Viewport({
		layout: 'border',
		items: [sourceGridPanel,sourceFieldGrid]
	});
	Ext.getCmp("sourceGridPanel").getSelectionModel().on("rowselect", function(mode, rowIndex, record){
		selectedSourceId = record.get('source_id');
		sourceFieldStore.load({
			params: {source_id: selectedSourceId}
		});
	})
});


function gotoPage(id,url){
	window.parent.tabManager.removeTabItem(id);
	window.parent.gotoPage(id,'数据源维度',url);
}
