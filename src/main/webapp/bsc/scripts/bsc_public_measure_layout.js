var selectNodeId = '';
var selectNode = null;
var engMeasureTree ;
var sourceTypeId = "";

Ext.onReady(function() {
	var treeMenu = new Ext.Toolbar([{
		id : 'add_menu',
		text : '添加(a)',
		tooltip : '添加指标',
		iconCls : 'add',
		handler : function() {
			if (engMeasureTree.getSelectionModel().getSelectedNode() == null) {
				Ext.MessageBox.alert('提示信息', '请选择一个新增指标的父节点');
				return;
			}
			if(engMeasureTree.getSelectionModel().getSelectedNode().attributes.source_type_id != '03'
				&& engMeasureTree.getSelectionModel().getSelectedNode().id !='root'){
				Ext.Msg.alert('提示信息','只能在分类目录下添加指标!');
				return;
			}
			var addWindow = new AddWindow();
			addWindow.show();
		}
	}, '-', {
		id : 'edit_menu',
		text : '编辑(e)',
		tooltip : '编辑指标',
		iconCls : 'edit',
		handler : function() {
		if (engMeasureTree.getSelectionModel().getSelectedNode() == null) {
			Ext.MessageBox.alert('提示信息', '请选择需要编辑的指标节点');
			return;
		}
		if (engMeasureTree.getSelectionModel().getSelectedNode().id == 'root')
			return;
			doEdit();
		}
	}, '-', {
		id : 'delete_menu',
		text : '删除(d)',
		tooltip : '删除指标',
		iconCls : 'delete',
		handler : function() {
			if (engMeasureTree.getSelectionModel().getSelectedNode() == null) {
				Ext.MessageBox.alert('提示信息', '请选择要删除的指标!');
				return;
			}
			if (engMeasureTree.getSelectionModel().getSelectedNode().id == 'root')
				return;

			doDeleteMeasure(engMeasureTree.getSelectionModel().getSelectedNode());
		}
	}]);
	//添加树形索引
	addSearchToolbar({
		oldToolbar : treeMenu,
		expandMethod : expandMyMeasureTreeNode,
		treePanelId : 'measureTreePanel',
		is_private : 'N'
	});
	
	var rnode = getRootNode('root', '公共指标树', expandMyMeasureTreeNode);
	rnode.attributes.is_private = 'N';
	
	engMeasureTree = new Ext.tree.TreePanel({
		region : 'center',
		title : '公共指标树',
		id : 'measureTreePanel',
		tbar : treeMenu,
		animate : true,
		frame : false,
		border : true,
		loader : new Ext.tree.TreeLoader(),
		lines : false,
		listeners : {
			click : function(node) {
				propertyPanel.form.reset();
				selectNode = node;
				selectNodeId = node.id;
				if (!node || node.id == 'root'){
					selectNode = null;
					selectNodeId = '';
					return;
				};
				
				propertyPanel.form.load({
					url : pathUrl + '/publicMeasure_common.action?method=getEngMeasureById&measure_id='+node.id+'&is_private=N'
				});
			}
		},
		bodyStyle : 'padding:5px 5px',
		autoScroll : true,
		root : rnode,
		rootVisible : true
	});	
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [engMeasureTree, propertyPanel = new Ext.form.FormPanel({
				region : 'east',
				width : '320',
				title : '指标属性',
				bodyStyle : 'padding: 5px 5px,5px 12px',
				labelWidth : 95,
				labelAlign : 'top',
				layout : 'form',
				split : true,
				frame : true,
				reader : new Ext.data.JsonReader({
					root : 'results'
				},[
					{name : 'measure_id'},
					{name : 'source_id'},
					{name : 'measure_name'},
					{name : 'source_type_desc'},
					{name : 'obj_cate_desc'},
					{name : 'formula_expr'},
					{name : 'formula_desc'},
					{name : 'measure_desc'},
					{name : 'obj_cate_id'}
				]),
				items : [{
					xtype : 'hidden',
					name : 'obj_cate_id',
					id : 'obj_cate_id'
				},{
					xtype : 'hidden',
					name : 'formula_desc',
					id : 'load_formula_desc'
				},{
					xtype : 'hidden',
					name : 'source_id',
					id : 'sid',
					readOnly : true,
					anchor : '95%'
				},{
					xtype : 'textfield',
					name : 'measure_id',
					id : 'mid',
					fieldLabel : '指标ID',
					readOnly : true,
					anchor : '95%'
				},{
					xtype : 'textfield',
					name : 'measure_name',
					fieldLabel : '指标名',
					readOnly : true,
					anchor : '95%'
				}, {
					xtype : 'textfield',
					name : 'source_type_desc',
					fieldLabel : '指标类型',
					readOnly : true,
					anchor : '95%'
				}, {
					xtype : 'textfield',
					name : 'obj_cate_desc',
					fieldLabel : '考核对象类型',
					readOnly : true,
					anchor : '95%'
				}, {
					xtype : 'textfield',
					id : 'formula_expr',
					name : 'formula_expr',
					fieldLabel : '指标公式',
					readOnly : true,
					anchor : '89%'
				}, {
					xtype : 'textarea',
					name : 'measure_desc',
					fieldLabel : '指标描述',
					readOnly : true,
					anchor : '95%'
				}]
			})]
	});
	
	var div=Ext.getDom('formula_expr').parentNode;
	var span=document.createElement("span");
	span.style.border="1px solid #B5B8C8";
	span.style.padding="1px 1px 1px 1px";
	span.style.verticalAlign="MIDDLE";
	span.innerHTML="<a href='javascript:doEditFormula()'><img src=\"../../public/images/icons/change.png\"></a>";
	div.appendChild(span);
	
	engMeasureTree.getRootNode().expand();
});

/**
 * 数据源类型下拉框
 */
SourceTypeSelector=function(){
	var template = new Ext.XTemplate(
   	'<tpl for="."><div style="border-top: solid 1px gray;width:100%;" class="x-combo-list-item">' 
   	+ '<p>{displayText}</p>' 
   	+ "<p><font size=2 color='green'>说明:{descript}</font></p>"
   	+ '</div></tpl>');
	var store = new Ext.data.SimpleStore({
		fields: ["retrunValue", "displayText","descript"],
		data: [
			['03','分类目录','作为指标分类的目录,不能配置公式和参与计算'],
			['00','基础指标','指标的值从数据库表中查询得出'],
			['01','复合指标','指标的值经过其他指标加工得出'],
			['02','外部指标','指标的值需要从外部Excel导入']
		]
	});
	
	SourceTypeSelector.superclass.constructor.call(this,{
		store: store,
		valueField :'retrunValue',
		displayField:'displayText',
		mode: 'local',
		hiddenName:'source_type_id',
		editable: false,
		tpl : template,
		triggerAction: 'all',
		allowBlank:false,
		fieldLabel:'指标类型',
		name: 'source_type_id',
		value: '03',
		id:'sourceTypeId',
	    anchor:'95%'
	});

}
Ext.extend(SourceTypeSelector, Ext.form.ComboBox);

/**
 * 考核对象类型下拉框
 */
ObjCateSelector=function(){
	var store = new Ext.data.SimpleStore({
		fields: ["retrunValue", "displayText"],
		data: [['BM','区属部门'],['CBM','市属部门'],['ZJ','镇街']]
	});
	 
	ObjCateSelector.superclass.constructor.call(this,{
		store: store,
		valueField :'retrunValue',
		displayField:'displayText',
		mode: 'local',
		hiddenName:'obj_cate_id',
		editable: false,
		triggerAction: 'all',
		allowBlank:false,
		fieldLabel:'考核对象类型',
		name: 'obj_cate_id',
		value: 'BM',
		id:'objCateId',
	    anchor:'95%'
	});

}
Ext.extend(ObjCateSelector, Ext.form.ComboBox);

function activeMenu(b) {
	Ext.getCmp("add_menu").setDisabled(!b);
	Ext.getCmp("edit_menu").setDisabled(!b);
	Ext.getCmp("delete_menu").setDisabled(!b);
}