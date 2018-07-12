/**
 * 公式面板JS
 */
var listenerAdded = false;
var privateTree_lis;//验证privateTree是否刷新
var snd_pu_menu = new Ext.Toolbar();
var snd_pr_menu = new Ext.Toolbar();
//添加公有树形索引
addSearchToolbar({
	oldToolbar : snd_pu_menu,
	expandMethod : expandSearchMeasureTreeNode,
	treePanelId : 'baseTree',
	is_private : 'N'
});
//添加私有树形索引
addSearchToolbar({
	oldToolbar : snd_pr_menu,
	expandMethod : expandSearchMeasureTreeNode,
	treePanelId : 'privateTree',
	is_private : 'Y'
});
//公共指标树
var pub_rn = getRootNode('root', '公共指标', expandSearchMeasureTreeNode);
pub_rn.attributes.is_private = 'N';
var publicTree = new Ext.tree.TreePanel({
	title : '公共指标树',
	id : 'baseTree',
	animate : true,
	frame : false,
	border : false,
	loader : new Ext.tree.TreeLoader(),
	lines : false,
	bodyStyle : 'padding:5px 5px',
	autoScroll : true,
	root : pub_rn,
	rootVisible : true,
	tbar : snd_pu_menu
})

var tabPanel = new Ext.TabPanel({
	region : 'west',
	width : 280,
	tabPosition : 'bottom',
	activeTab : 0,
	border : false,
	defaults : {
		autoScroll : true
	},
	listeners : {
		tabchange : function(t) {
			if (t.getActiveTab().id == "baseTree"){
				if(obj_cate_id != Ext.getCmp('obj_cate_id').getValue()){
					obj_cate_id = Ext.getCmp('obj_cate_id').getValue();
					reloadTree();
				}else
					Ext.getCmp("baseTree").getRootNode().expand();
			}
			else if (t.getActiveTab().id == "privateTree"){
				if(privateTree_lis == Ext.getCmp('obj_cate_id').getValue()){
					Ext.getCmp("privateTree").getRootNode().expand();
				}else{
					obj_cate_id = Ext.getCmp('obj_cate_id').getValue();
					privateTree_lis = obj_cate_id;
					privateTree.removeAll();
					var pr_node = getRootNode('root', '私有指标', expandSearchMeasureTreeNode);
					pr_node.attributes.is_private = 'Y';
					privateTree.setRootNode(pr_node);
					pr_node.expand();
				}
			}	
			else if (t.getActiveTab().id == "paramTreePanel") {
				Ext.getCmp("paramTree").getRootNode().findChild('id', "Default").expand();
				Ext.getCmp("paramTree").getRootNode().findChild('id',"ObjectID").expand();
			}
		}
	},
	items : [publicTree]
});

if (ntype == 'private') {
	var pri_rn = getRootNode('root', '私有指标', expandSearchMeasureTreeNode);
	pri_rn.attributes.is_private = 'Y';
	tabPanel.add(privateTree = new Ext.tree.TreePanel({
		title : '私有指标树',
		id : 'privateTree',
		animate : true,
		frame : false,
		border : false,
		loader : new Ext.tree.TreeLoader(),
		lines : false,
		bodyStyle : 'padding:5px 5px',
		autoScroll : true,
		root : pri_rn,
		rootVisible : true,
		tbar : snd_pr_menu
	}));
	
	privateTree.on('dblclick', function(node, e) {
		if (node.id == 'root')
			return;
		if(node.id == selectNodeId) {
			Ext.MessageBox.alert("提示信息","指标计算不能引用自己");
			return;
		}
		if(node.attributes.source_type_id != '03'){
			RangeInsert(formulaTextArea, "[@" + node.id + "]");
		}
	});
}

tabPanel.add({
	title : '参数',
	layout : 'border',
	id : 'paramTreePanel',
	items : parameterListPanel = new ListPanel({
		id : 'paramTree'
	})
});

parameterListPanel.on('dblclick', function(node, e) {
	RangeInsert(formulaTextArea, "[$" + node.id + "]");
});
publicTree.on('dblclick', function(node, e) {
	if(node.id == 'root')
		return;
	if(node.id == selectNodeId) {
			Ext.MessageBox.alert("提示信息","指标计算不能引用自己");
			return;
		}
		
	if(node.attributes.source_type_id != '03'){
		RangeInsert(formulaTextArea, "[@" + node.id + "]");
	}
});

parameterListPanel.addCategoryNode('Default', '全局参数', expandPublicParameterTreeNode);
parameterListPanel.addCategoryNode('ObjectID', '私有参数', expandPrivateParameterTreeNode);

//计算面板
var calcPanel = new Ext.form.FormPanel({
	region : 'center',
	layout : 'form',
	labelAlign : 'top',
	labelWidth : 75,
	bodyStyle : 'padding : 5px',
	buttonAlign : 'center',
	items : [formulaDescTextArea = new Ext.form.TextArea({
		fieldLabel : '<img src="../img/information.gif" width=18 height=18 />公式注解',
		readOnly : true,
		id : 'formulaDesc',
		name : 'formulaDesc',
		border : false,
		height : 60,
		anchor : '99%'
	}),{
		xtype : 'panel',
		height : 85,
		items : [formulaTextArea = new Ext.form.TextArea({
				id : 'formula9',
				name : 'formula',
				border : false,
				width : '100%',
				height : 60,
				anchor : '99%'
				})],
		tbar : [{
			iconCls : 'bsc_formula'
		},{
			xtype : 'label',
			text : '公式：'
		},'->',{
			text : '清空',
			iconCls : 'bsc_truncate',
			handler : function() {
				formulaTextArea.setValue('');
			}
		},'-',{
			text : '还原',
			iconCls : 'bsc_revoke',
			handler : function() {
				formulaTextArea.setValue(Ext.getCmp("formula_expr").getValue());
			}
		},'-',{
			text : '帮助',
			iconCls : 'help',
			handler : function() {
				var str = "left=0,screenX=0,top=0,screenY=0,resizable=yes";
				if (window.screen) {
					var ah = screen.availHeight - 35;
					var aw = screen.availWidth - 10;
					str += ",height=" + ah;
					str += ",innerHeight=" + ah;
					str += ",width=" + aw;
					str += ",innerWidth=" + aw;
				} else {
					str += ",resizable";
				}
				window.open(pathUrl + "/bsc/pages/formula_help.htm","newwindow","height="+ ah+ ",width="+ aw+ ",top=0,left=0,toolbar=no,menubar=no,resizable=yes,scrollbars=yes,location=no,status=no");
			}
		}]
	}, {
		xtype : 'panel',
		layout : 'column',
		bodyStyle : 'padding: 8px,0px,0px,0px',
		border : false,
		items : [{
			columnWidth : .29,
			xtype : 'fieldset',
			bodyStyle : 'padding: 0px,5px,2px,5px',
			autoHeight : true,
			layout : 'table',
			title : '数学函数',
			layoutConfig : {columns : 3},
			items : [{
				layout : 'fit',
				border : false,
				colspan : 3,
				bodyStyle : 'padding : 3px,2px,3px,2px',
				width : 120,
				height : 28,
				items : [{
					xtype : 'button',
					text : 'ABS ：绝对值',
					handler : function() {
						RangeInsert(formulaTextArea, "ABS()");
					}
				}]
			},{
				layout : 'fit',
				border : false,
				colspan : 3,
				bodyStyle : 'padding : 3px,2px,3px,2px',
				width : 120,
				height : 28,
				items : [{
					xtype : 'button',
					text : 'DIV ：安全除法',
					handler : function() {
						RangeInsert(formulaTextArea, "DIV( , )");
					}
				}]
			},{
				layout : 'fit',
				border : false,
				colspan : 3,
				bodyStyle : 'padding : 3px,2px,3px,2px',
				width : 120,
				height : 28,
				items : [{
					xtype : 'button',
					text : 'LESS ：较小值',
					handler : function() {
						RangeInsert(formulaTextArea, "LESS( , )");
					}
				}]
			},{
				layout : 'fit',
				border : false,
				colspan : 3,
				bodyStyle : 'padding : 3px,2px,3px,2px',
				width : 120,
				height : 28,
				items : [{
					xtype : 'button',
					text : 'MIDDLE ：中间值',
					handler : function() {
						RangeInsert(formulaTextArea, "MIDDLE( , , )");
					}
				}]
			},{
				layout : 'fit',
				border : false,
				colspan : 3,
				bodyStyle : 'padding : 3px,2px,3px,2px',
				width : 120,
				height : 28,
				items : [{
					xtype : 'button',
					text : 'MORE ：较大值',
					handler : function() {
						RangeInsert(formulaTextArea, "MORE( , )");
					}
				}]
			},{
				layout : 'fit',
				border : false,
				colspan : 3,
				bodyStyle : 'padding : 3px,2px,3px,2px',
				width : 120,
				height : 28,
				items : [{
					xtype : 'button',
					text : 'POWER ：幂值',
					handler : function() {
						RangeInsert(formulaTextArea, "POWER( , )");
					}
				}]
			}]
		},{
			columnWidth : .03,
			border : false,
			xtype : 'panel'
		},{
			columnWidth : .29,
			xtype : 'fieldset',
			bodyStyle : 'padding: 0px,5px,2px,5px',
			autoHeight : true,
			layout : 'table',
			title : '条件表达',
			layoutConfig : {columns : 3},
			items : [{
				layout : 'fit',
				border : false,
				width : 40,
				height : 28,
				bodyStyle : 'padding : 3px,2px,3px,2px',
				items : [{
					xtype : 'button',
					text : "&nbsp;<&nbsp;",
					handler : function() {
						RangeInsert(formulaTextArea, "<");
					}
				}]
			},{
				layout : 'fit',
				border : false,
				bodyStyle : 'padding : 3px,2px,3px,2px',
				width : 40,
				height : 28,
				items : [{
					xtype : 'button',
					text : '<=',
					handler : function() {
						RangeInsert(formulaTextArea, this.text);
					}
				}]
			},{
				layout : 'fit',
				border : false,
				bodyStyle : 'padding : 3px,2px,3px,2px',
				width : 40,
				height : 28,
				items : [{
					xtype : 'button',
					text : 'and',
					handler : function() {
						RangeInsert(formulaTextArea, this.text);
					}
				}]
			},{
				layout : 'fit',
				border : false,
				width : 40,
				height : 28,
				bodyStyle : 'padding : 3px,2px,3px,2px',
				items : [{
					xtype : 'button',
					text : "&nbsp;>&nbsp;",
					handler : function() {
						RangeInsert(formulaTextArea, ">");
					}
				}]
			},{
				layout : 'fit',
				border : false,
				bodyStyle : 'padding : 3px,2px,3px,2px',
				width : 40,
				height : 28,
				items : [{
					xtype : 'button',
					text : '>=',
					handler : function() {
						RangeInsert(formulaTextArea, this.text);
					}
				}]
			},{
				layout : 'fit',
				border : false,
				bodyStyle : 'padding : 3px,2px,3px,2px',
				width : 40,
				height : 28,
				items : [{
					xtype : 'button',
					text : 'or',
					handler : function() {
						RangeInsert(formulaTextArea, this.text);
					}
				}]
			},{
				layout : 'fit',
				border : false,
				width : 40,
				height : 28,
				bodyStyle : 'padding : 3px,2px,3px,2px',
				items : [{
					xtype : 'button',
					text : "=",
					handler : function() {
						RangeInsert(formulaTextArea, this.text);
					}
				}]
			},{
				layout : 'fit',
				border : false,
				bodyStyle : 'padding : 3px,2px,3px,2px',
				width : 40,
				height : 28,
				items : [{
					xtype : 'button',
					text : '!=',
					handler : function() {
						RangeInsert(formulaTextArea, this.text);
					}
				}]
			},{
				layout : 'fit',
				border : false,
				bodyStyle : 'padding : 3px,2px,3px,2px',
				width : 40,
				height : 28,
				items : [{
					xtype : 'button',
					text : 'not',
					handler : function() {
						RangeInsert(formulaTextArea, this.text);
					}
				}]
			},{
				layout : 'fit',
				border : false,
				colspan : 3,
				bodyStyle : 'padding : 3px,2px,3px,2px',
				width : 120,
				height : 28,
				items : [{
					xtype : 'button',
					text : 'in',
					handler : function() {
						RangeInsert(formulaTextArea, this.text);
					}
				}]
			},{
				layout : 'fit',
				border : false,
				colspan : 3,
				bodyStyle : 'padding : 3px,2px,3px,2px',
				width : 120,
				height : 28,
				items : [{
					xtype : 'button',
					text : 'IIF ：单条件取值',
					handler : function() {
						RangeInsert(formulaTextArea, "IIF(条件表达式, 表达式为真的值, 表达式为假的值)");
					}
				}]
			},{
				layout : 'fit',
				border : false,
				colspan : 3,
				bodyStyle : 'padding : 3px,2px,3px,2px',
				width : 120,
				height : 28,
				items : [{
					xtype : 'button',
					text : 'CASE ：多条件取值',
					handler : function() {
						RangeInsert(formulaTextArea, "CASE(条件表达式1, 值1, 表达式2,值2,...,默认值)");
					}
				}]
			}]
		},{
			columnWidth : .03,
			border : false,
			xtype : 'panel'
		},{
			columnWidth : .36,
			xtype : 'fieldset',
			bodyStyle : 'padding: 0px,5px,2px,5px',
			autoHeight : true,
			layout : 'table',
			layoutConfig : {columns : 4},
			title : '数学运算',
			items : [{
				layout : 'fit',
				border : false,
				bodyStyle : 'padding : 3px,2px,3px,2px',
				width : 40,
				height : 28,
				items : [{
					xtype : 'button',
					text : '7',
					handler : function() {
						RangeInsert(formulaTextArea, this.text);
					}
				}]
			},{
				layout : 'fit',
				border : false,
				bodyStyle : 'padding : 3px,2px,3px,2px',
				width : 40,
				height : 28,
				items : [{
					xtype : 'button',
					text : '8',
					handler : function() {
						RangeInsert(formulaTextArea, this.text);
					}
				}]
			},{
				layout : 'fit',
				border : false,
				bodyStyle : 'padding : 3px,2px,3px,2px',
				width : 40,
				height : 28,
				items : [{
					xtype : 'button',
					text : '9',
					handler : function() {
						RangeInsert(formulaTextArea, this.text);
					}
				}]
			},{
				layout : 'fit',
				border : false,
				bodyStyle : 'padding : 3px,2px,3px,2px',
				width : 40,
				height : 28,
				items : [{
					xtype : 'button',
					text : '/',
					handler : function() {
						RangeInsert(formulaTextArea, this.text);
					}
				}]
			},{
				layout : 'fit',
				border : false,
				bodyStyle : 'padding : 3px,2px,3px,2px',
				width : 40,
				height : 28,
				items : [{
					xtype : 'button',
					text : '4',
					handler : function() {
						RangeInsert(formulaTextArea, this.text);
					}
				}]
			},{
				layout : 'fit',
				border : false,
				bodyStyle : 'padding : 3px,2px,3px,2px',
				width : 40,
				height : 28,
				items : [{
					xtype : 'button',
					text : '5',
					handler : function() {
						RangeInsert(formulaTextArea, this.text);
					}
				}]
			},{
				layout : 'fit',
				border : false,
				bodyStyle : 'padding : 3px,2px,3px,2px',
				width : 40,
				height : 28,
				items : [{
					xtype : 'button',
					text : '6',
					handler : function() {
						RangeInsert(formulaTextArea, this.text);
					}
				}]
			},{
				layout : 'fit',
				border : false,
				bodyStyle : 'padding : 3px,2px,3px,2px',
				width : 40,
				height : 28,
				items : [{
					xtype : 'button',
					text : '*',
					handler : function() {
						RangeInsert(formulaTextArea, this.text);
					}
				}]
			},{
				layout : 'fit',
				border : false,
				bodyStyle : 'padding : 3px,2px,3px,2px',
				width : 40,
				height : 28,
				items : [{
					xtype : 'button',
					text : '1',
					handler : function() {
						RangeInsert(formulaTextArea, this.text);
					}
				}]
			},{
				layout : 'fit',
				border : false,
				bodyStyle : 'padding : 3px,2px,3px,2px',
				width : 40,
				height : 28,
				items : [{
					xtype : 'button',
					text : '2',
					handler : function() {
						RangeInsert(formulaTextArea, this.text);
					}
				}]
			},{
				layout : 'fit',
				border : false,
				bodyStyle : 'padding : 3px,2px,3px,2px',
				width : 40,
				height : 28,
				items : [{
					xtype : 'button',
					text : '3',
					handler : function() {
						RangeInsert(formulaTextArea, this.text);
					}
				}]
			},{
				layout : 'fit',
				border : false,
				bodyStyle : 'padding : 3px,2px,3px,2px',
				width : 40,
				height : 28,
				items : [{
					xtype : 'button',
					text : '-',
					handler : function() {
						RangeInsert(formulaTextArea, this.text);
					}
				}]
			},{
				layout : 'fit',
				border : false,
				bodyStyle : 'padding : 3px,2px,3px,2px',
				width : 80,
				colspan: 2,
				height : 28,
				items : [{
					xtype : 'button',
					text : '0',
					handler : function() {
						RangeInsert(formulaTextArea, this.text);
					}
				}]
			},{
				layout : 'fit',
				border : false,
				bodyStyle : 'padding : 3px,2px,3px,2px',
				width : 40,
				height : 28,
				items : [{
					xtype : 'button',
					text : '.',
					handler : function() {
						RangeInsert(formulaTextArea, this.text);
					}
				}]
			},{
				layout : 'fit',
				border : false,
				bodyStyle : 'padding : 3px,2px,3px,2px',
				width : 40,
				height : 28,
				items : [{
					xtype : 'button',
					text : '+',
					handler : function() {
						RangeInsert(formulaTextArea, this.text);
					}
				}]
			},{
				layout : 'fit',
				border : false,
				bodyStyle : 'padding : 3px,2px,3px,2px',
				width : 158,
				colspan: 4,
				height : 28,
				items : [{
					xtype : 'button',
					text : '括号()',
					handler : function() {
						RangeInsert(formulaTextArea, "()");
					}
				}]
			}]
		}]
	}]
});


var formulaConfigWindow = new Ext.Window({
	width : 770,
	height : 490,
	border : false,
	listeners : {
		beforeclose : function() {
			hideWindow();
			return false;
		}
	},
	title : '公式配置',
	layout : 'border',
	modal : true,
	items : [tabPanel,calcPanel],
	bbar : ['->', {
			text : '取消',
			iconCls : 'cross',
			handler : function() {
				hideWindow();
			}
		},'-',{
			text : '保存',
			iconCls : 'save',
			handler : function() {
				Ext.Ajax.request({
					url : pathUrl + '/privateMeasure_common.action?method=editEngMeasureFormula',
					method : 'POST',
					params : {
						measure_id : selectNodeId,
						formula_expr : formulaTextArea.getValue()
					},
					callback : function(options, success, response) {
						var json = Ext.util.JSON.decode(response.responseText);
						if (json.success) {
							propertyPanel.form.load({
								url : pathUrl+ '/privateMeasure_common.action?method=getEngMeasureById&measure_id='+ selectNodeId
							});
							hideWindow();
						} else {
							Ext.MessageBox.alert('提示信息', json.info);
						}
					}
				});
			}
		}
	]
	
});

function hideWindow() {
	pageindex = '1';
	formulaTextArea.setValue('');
	formulaDescTextArea.setValue('');
	formulaConfigWindow.hide();
}

/**
 * 编辑私有指标公式
 */
function doEditFormula(){
		if(selectNode == null) {
			Ext.Msg.alert("提示信息","请选择一个指标再编辑公式");
			return;
		}
		if(selectNode.attributes.source_type_id == '02') {
			Ext.Msg.alert("提示信息","外部导入指标不需编辑公式.可到[指标值导入]中导入具体值");
			return;
		}else if(selectNode.attributes.source_type_id == '03') {
			Ext.Msg.alert("提示信息","分类目录指标不能配置公式");
			return;
		}else if(selectNode.attributes.source_type_id == '00') {
			//数据源指标
			var sid = Ext.getCmp('sid').getValue();
			var formula = Ext.getCmp('formula_expr').getValue();
//			Ext.Msg.alert("",sid);
			sourceComboBox.setValue(sid);
			sourceFormulaTextArea.setValue(formula);
			valueFieldDS.reload({ 
				params : {
					source_id : sid
				}
			});
//			currField = "";
			fwindow.show();
		}else {
			//聚合指标
			pageindex = '2';
			privateTree_lis = obj_cate_id;
			tabPanel.setActiveTab(publicTree);
			
			formulaTextArea.setValue(Ext.getCmp("formula_expr").getValue());
			formulaDescTextArea.setValue(Ext.getCmp("load_formula_desc").getValue());
			formulaConfigWindow.show();
			
			if(!listenerAdded) {
				document.getElementById("formulaDesc").style.background = '#cde6c7';
				listenerAdded = true;
			}else {
				if(obj_cate_id != Ext.getCmp('obj_cate_id').getValue()){
					obj_cate_id = Ext.getCmp('obj_cate_id').getValue();
					reloadTree();
				}
			}
		}
}

function reloadTree(){
	publicTree.removeAll();
	var pu_node = getRootNode('root', '公共指标', expandSearchMeasureTreeNode);
//	if(ntype == 'public'){
		pu_node.attributes.is_private = 'N';
//	}else if(ntype == 'private'){
//		pu_node.attributes.is_private = 'Y';
//	}
	
	publicTree.setRootNode(pu_node);
	pu_node.expand();
}
