//编辑指标时存放权重值
var measure_rate = '';
var measure_type = '';
var measure_cate = '';
var tmp_formula = '';
var dimTreePanel = new Ext.Panel({
	id : 'card-1',
	region : 'center',
	split : true,
	title : '选择战略举措',
	layout : 'fit',
	autoScroll : true,
	items : [{
		xtype : 'panel',
		autoScroll : true,
		contentEl : 'dim_tree',
		border : true,
		split : false
	}]
});

Ext.form.Field.prototype.msgTarget = 'under';

var pri_node = getRootNode('root', '私有指标树', expandMyMeasureTreeNode);
var pub_node = getRootNode('root', '公有指标树', expandMyMeasureTreeNode);
pri_node.attributes.is_private = 'Y';
pub_node.attributes.is_private = 'N';

var pub_tbar = new Ext.Toolbar();
var pageindex = '',page = 'bsc_project_measure';
//添加公有树形索引
addSearchToolbar({
	oldToolbar : pub_tbar,
	expandMethod : expandMyMeasureTreeNode,
	treePanelId : 'baseMeasureTreePanel',
	is_private : 'N'
});

var tabPanel = new Ext.TabPanel({
	region : 'center',
	tabPosition : 'bottom',
	activeTab : 0,
	defaults : {
		autoScroll : true
	},
	listeners: {
		tabchange : function(tab,panel) {
			if(tabPanel.getActiveTab().id == 'baseM')
				baseMeasureTree.getRootNode().expand();
			else if(tabPanel.getActiveTab().id == 'projectM')
				projectMeasureTree.getRootNode().expand();
		}	
	},
	items : [{
		title : '公共指标',
		layout : 'border',
		id : 'baseM',
		items : [baseMeasureTree = new Ext.tree.TreePanel({
			region : 'center',
			id : 'baseMeasureTreePanel',
			frame : false,
			border : false,
			loader : new Ext.tree.TreeLoader(),
			lines : false,
			bodyStyle : 'padding:5px 5px',
			autoScroll : true,
			root : pub_node,
			rootVisible : true,
			tbar : pub_tbar
		})]
	}, {
		title : '私有指标',
		layout : 'border',
		id : 'projectM',
		items : [projectMeasureTree = new Ext.tree.TreePanel({
			region : 'center',
			id : 'projectMeasureTreePanel',
			loader : new Ext.tree.TreeLoader(),
			lines : false,
			border : false,
			bodyStyle : 'padding:5px 5px',
			autoScroll : true,
			root : pri_node,
			rootVisible : true
		})]
	}]
});

baseMeasureTree.on("click",function(node,e){
	infoPanel.form.reset();
	if(node) {
		measure_type = node.attributes.source_type_id;
		measure_cate = node.attributes.obj_cate_id;
		infoPanel.form.load({url: pathUrl + '/publicMeasure_common.action?method=getEngMeasureById', params: {measure_id: node.id,is_private:'N'}});
	}
})
projectMeasureTree.on("click",function(node,e){
	infoPanel.form.reset();
	if(node) {
		measure_type = node.attributes.source_type_id;
		measure_cate = node.attributes.obj_cate_id;
		infoPanel.form.load({url: pathUrl + '/privateMeasure_common.action?method=getEngMeasureById', params: {measure_id: node.id}});
	}
})

var infoPanel = new Ext.form.FormPanel({
	title : '衡量指标',
	layout : 'form',
	region : 'east',
	bodyStyle : 'padding : 15px',
	width : 320,
	labelWidth : 95,
	split : true,
	border : true,
	reader : new Ext.data.JsonReader({
		root : 'results'
	},[
		{name : 'measure_id'},
		{name : 'measure_name'},
		{name : 'formula_expr'}
	]),
	items : [{
		xtype : 'textfield',
		name : 'measure_id',
		id : 'measure_id',
		fieldLabel : '指标ID',
		readOnly : true,
		allowBlank : false,
		anchor : '95%',
		style:'background : #F0F0F0;color : #A0A0A0'
	},{
		xtype : 'textfield',
		name : 'measure_name',
		id : 'measure_name',
		fieldLabel : '指标名',
		readOnly : true,
		anchor : '95%',
		style:'background : #F0F0F0;color : #A0A0A0'
	},{
		xtype : 'textfield',
		name : 'formula_expr',
		id : 'formula_expr',
		fieldLabel : '数据公式',
		readOnly : true,
		style:'background : #F0F0F0;color : #A0A0A0',
		anchor : '95%'
	},{
		xtype : 'textfield',
		name : 'mea_definition',
		id : 'mea_definition',
		allowBlank : false,
		fieldLabel : '指标定义',
		anchor : '95%'
	},{
		xtype : 'hidden',
		name : 'measure_source_code',
		id : 'measure_source_code'
	}]
});

var measurePanel = new Ext.Panel({
	layout : 'border',
	id : 'card-0',
	border : false,
	items : [tabPanel,infoPanel]
});

var activeType = 'add';

var cardNav = function(incr){
    var layout = Ext.getCmp('card-wizard-panel').getLayout();
    var i = layout.activeItem.id.split('card-')[1];
    
    var next = parseInt(i) + incr;
    if(next == 2) {
    	//检查维度选择
    	if(tree.getAllChecked() == '') {
    		Ext.MessageBox.alert("提示信息","请选择一个考核的维度");
    		return;
    	}
    	if(tree.getAllChecked().split(",").length > 1) {
    		Ext.MessageBox.alert("提示信息","只能选择一个考核维度");
    		return;
    	}
    	checkedDimId = tree.getAllChecked();
    }else if(next == 1 ) {
    	if(Ext.getCmp("measure_id").getValue() == '') {
    		Ext.MessageBox.alert("提示信息","请选择一个计分的衡量指标");
    		return;
    	}
    	if(Ext.getCmp("mea_definition").getValue() == '') {
    		Ext.MessageBox.alert("提示信息","请输入衡量指标的定义");
    		Ext.getCmp("mea_definition").focus();
    		return;
    	}
    	if(Ext.getCmp("dft_scr_wght_rate").getValue() == '' && Ext.getCmp("addonSelector").getValue() == 'N') {
    		Ext.MessageBox.alert("提示信息","请输入默认权重");
    		Ext.getCmp("dft_scr_wght_rate").focus();
    		return;
    	}
    	bscMeasure = Ext.getCmp("measure_id").getValue();
    }
    layout.setActiveItem(next);
    Ext.getCmp('card-prev').setDisabled(next==0 );
    Ext.getCmp('card-next').setVisible(next!=2);
    Ext.getCmp('saveCtrlMeasure').setVisible(next==2);
};


var listenerAdded = false;
//公共指标树
var pub_rn = getRootNode('root', '公共指标树', expandMyMeasureTreeNode);
pub_rn.attributes.is_private = 'N';
var pub_rn_tbar = new Ext.Toolbar();
//添加公有树形索引
addSearchToolbar({
	oldToolbar : pub_rn_tbar,
	expandMethod : expandMyMeasureTreeNode,
	treePanelId : 'baseTree',
	is_private : 'N'
});

var publicTree = new Ext.tree.TreePanel({
	title : '公共指标',
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
	tbar : pub_rn_tbar
})

var formulaTabPanel = new Ext.TabPanel({
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
			if (t.getActiveTab().id == "baseTree")
				Ext.getCmp("baseTree").getRootNode().expand();
			else if (t.getActiveTab().id == "privateTree")
				Ext.getCmp("privateTree").getRootNode().expand();
			else if (t.getActiveTab().id == "paramTreePanel") {
				Ext.getCmp("paramTree").getRootNode().findChild('id', "Default").expand();
				Ext.getCmp("paramTree").getRootNode().findChild('id',"ObjectID").expand();
			}
		}
	},
	items : [{
		title : '计分关键字',
		xtype : 'treepanel',
		region : 'center',
		id : 'keyWordTree',
		frame : false,
		border : false,
		loader : new Ext.tree.TreeLoader(),
		lines : false,
		bodyStyle : 'padding:5px 5px',
		autoScroll : true,
		listeners : {
			dblclick : function(node, e) {
				if (node.id == 'root')
					return
				RangeInsert(formulaTextArea, "[#" + node.id + "]");
			}
		},
		root : getKeyWordRoot(),
		rootVisible : false
	},publicTree]
});

var pri_rn = getRootNode('root', '私有指标树', expandMyMeasureTreeNode);
pri_rn.attributes.is_private = 'Y';
formulaTabPanel.add(privateTree = new Ext.tree.TreePanel({
	title : '私有指标',
	id : 'privateTree',
	animate : true,
	frame : false,
	border : false,
	loader : new Ext.tree.TreeLoader(),
	lines : false,
	bodyStyle : 'padding:5px 5px',
	autoScroll : true,
	root : pri_rn,
	rootVisible : true
}));

privateTree.on('dblclick', function(node, e) {
	if (node.id == 'root')
		return;
	RangeInsert(formulaTextArea, "[@" + node.id + "]");
});

formulaTabPanel.add({
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
	RangeInsert(formulaTextArea, "[@" + node.id + "]");
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
		fieldLabel : '<img src="img/information.gif" width=18 height=18 />公式注解',
		readOnly : true,
		id : 'formulaDesc',
		name : 'formulaDesc',
		border : false,
		height : 60,
		anchor : '99%',
		style : 'background : #cde6c7'
	}),{
		xtype : 'panel',
		height : 60,
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
				formulaTextArea.setValue(tmp_formula);
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
	},{
		xtype : 'panel',
		layout : 'column',
		border : false,
		bodyStyle : 'padding: 8px,0px,0px,0px',
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

var addWindow = new Ext.Window({
	width : 770,
	height : 490,
	layout : 'fit',
	title : '添加方案考核指标',
	listeners : {
		beforeclose : function(){
			resetAddWinow();
			return false;
		}
	},
	modal : true,
	items : [{
		xtype : 'panel',
		id : 'card-wizard-panel',
		layout : 'card',
		activeItem : 0,
		bodyStyle : 'padding:0px',
		split : false,
		defaults : {
			border : false
		},
		bbar : ['->', {
			text : '取消',
			iconCls : 'cross',
			handler : function() {
				resetAddWinow();
				addWindow.hide();
			}
		},'-',{
			text : '保存',
			iconCls : 'save',
			id : 'saveCtrlMeasure',
			handler : function() {
				var mea_definition = Ext.getCmp("mea_definition").getValue();
				
				var actionUrl = '';
				if(activeType == 'add')
					actionUrl = pathUrl + '/bscmeasure_common.action?method=addBscMeasure';
				else
					actionUrl = pathUrl + '/bscmeasure_common.action?method=editBscMeasure';
				
				if(measure_type=='03'){
					Ext.MessageBox.alert('提示信息', "方案不能关联文件夹类型的指标!");
					return ;
				}
				
				if(measure_cate != obj_cate_id){
					Ext.MessageBox.alert('提示信息', "方案不能关联【对象类型】不一致的指标!");
					return ;
				}
				
				if(infoPanel.getForm().isValid()){
					Ext.Ajax.request({
						url : actionUrl,
						method : 'POST',
						params : {
							project_id : projectID,
							measure_id : Ext.getCmp("measure_id").getValue(),
							mea_definition : mea_definition
						},

						callback : function(options, success, response) {
							var json = Ext.util.JSON.decode(response.responseText);
							if (json.success) {
								doQueryCtrlInfos();
								resetAddWinow();
							} else {
								Ext.MessageBox.alert('提示信息', json.info);
							}
						}
					});
				}
			}
		}],
		items : [measurePanel]
	}]
});

function resetAddWinow(){
	bscMeasure = '';
	addWindow.hide();
	Ext.getCmp("saveCtrlMeasure").setVisible(false);
	tree.setCheck(checkedDimId,0);
	tabPanel.setActiveTab(1);
	infoPanel.getForm().reset();
	formulaTextArea.setValue('');
	formulaDescTextArea.setValue('');
	//Ext.getCmp("ck_default").setValue(true);
	Ext.getCmp('card-wizard-panel').getLayout().setActiveItem(0);
//	bscFormulaStore.reload();
}

/**
 * 添加方案考核指标
 */
function doAddCtrlInfo() {
	tabPanel.setDisabled(false);
	activeType = 'add';
	addWindow.setTitle( '添加方案考核指标');
	addWindow.show();
	
	var layout = Ext.getCmp('card-wizard-panel').getLayout();
    layout.setActiveItem(0);
	Ext.getCmp("saveCtrlMeasure").setVisible(true);
	tmp_formula = '';
};

/**
 * 修改衡量指标信息
 */
function doEditCtrlInfo(row_id) {
	var array = row_id.split('@');
	var measure_id = dhtmlGrid.cellById(row_id,2).getValue();
	
	//=====指标定义======
	var mea_name = dhtmlGrid.cellById(row_id,3).getValue();
	var mea_define = dhtmlGrid.cellById(row_id,1).getValue();
	var mea_formula = dhtmlGrid.cellById(row_id,5).getValue();
	//=====指标定义======
	
	bscMeasure = measure_id;
	activeType = 'edit';
	addWindow.setTitle('编辑方案考核指标');
	addWindow.show();
	Ext.getCmp("saveCtrlMeasure").setVisible(true);
	
	tree.setCheck(checkedDimId,1);
	var layout = Ext.getCmp('card-wizard-panel').getLayout();
    layout.setActiveItem(0);
    //======显示指标信息========
    Ext.getCmp('measure_id').setValue(measure_id);
    Ext.getCmp('measure_name').setValue(mea_name);
    Ext.getCmp('formula_expr').setValue(mea_formula);
    Ext.getCmp('mea_definition').setValue(mea_define);
    tabPanel.setDisabled(true);
}

/**
 * 删除方案考核指标
 * 
 */
function doDeleteCtrlInfo(id) {
	var array = id.split("@");
	var measure_id = dhtmlGrid.cellById(id,2).getValue();
	Ext.MessageBox.confirm('Message', '确认删除选中的考核指标吗?', function(btn) {
		if (btn == 'yes') {
			Ext.Ajax.request({
				url : pathUrl + '/bscmeasure_common.action?method=removeBscMeasure',
				method : 'POST',
				params : {
					project_id : projectID,
					measure_id : measure_id
				},

				callback : function(options, success, response) {
					var json = Ext.util.JSON.decode(response.responseText);
					if (json.success) {
						doQueryCtrlInfos();
					} else {
						Ext.MessageBox.alert('提示信息', json.info);
					}
				}
			});
		}
	});
}

/**
 * 修改考核指标权重
 * @param {} info
 */
function doAlterProrate(info) {
	Ext.Ajax.request({
		url : pathUrl + '/bscmeasure_common.action?method=setBscMeasureProrate',
		method : 'POST',
		params : {
			project_id : projectID,
			info : info
		},
		callback : function(options, success, response) {
			var json = Ext.util.JSON.decode(response.responseText);
			if (json.success) {
				Ext.getCmp('savemenu').setDisabled(true);
				doQueryCtrlInfos();
			} else {
				Ext.MessageBox.alert('提示信息', json.info);
			}
		}
	});
}

/**
 * 导出Excel方法
 */
function doExportExcel(project_id, role_id, month_id) {
	var project_name = Ext.get('project_id').getValue();
	
	document.excelForm.project_id.value = project_id;
	document.excelForm.project_name.value = project_name;
	document.excelForm.role_id.value = role_id;
//	document.excelForm.month_id.value = month_id;
	document.excelForm.export_flag.value = 'Y';
	document.excelForm.file_name.value = '方案_'+project_name+'.xls';
	document.excelForm.submit();
}

/**
 * 导出计划值模板方法
 */
function doExportTemplate(project_id,role_id,month_id) {
	document.templateForm.project_id.value = project_id;
	document.templateForm.role_id.value = role_id;
	document.templateForm.month_id.value = month_id;
	document.templateForm.submit();
}

/**
 * 执行方案
 * @param {} projectID
 * @param {} roleID
 * @param {} monthID
 */
function doExecuteProject() {
	/**
	 * 月份Store
	 */
	var monthDS = new Ext.data.JsonStore({
		url : pathUrl + '/selector_listMonth.action',
		root : 'results',
		totalProperty : 'totalCount',
		fields : ['month_id', 'month_name']
	});
	monthDS.on("load", function() {
		if (monthDS.getCount() > 0) {
			var val = monthDS.getAt(0).get('month_id');
			Ext.getCmp("monthSelector").setValue(val)
		}
	});
	monthDS.load();
	var cwin = new Ext.Window({
		title : '方案执行',
		width : 400,
		height : 220,
		layout : 'border',
		id : 'projWin',
		plain : true,
		modal : true,
		bodyStyle : 'padding:10px;',
		buttonAlign : 'center',
		border : false,
		items : [new Ext.form.FormPanel({
			region : 'center',
			split : true,
			frame : true,
			labelWidth : 75,
			bodyStyle : 'padding:10px 10px 0px 10px',
			buttonAlign : 'center',
			layout : 'form',
			items : [{
				xtype : 'textfield',
				fieldLabel : '方案名称',
				value : projectName,
				readOnly : true,
				anchor : '91%'
			}, {
				xtype : 'combo',
				mode : 'local',
				displayField : 'month_name',
				valueField : 'month_id',
				store : monthDS,
				editable : false,
				triggerAction : 'all',
				fieldLabel : '月份',
				name : 'month_id',
				id : 'monthSelector',
				anchor : '91%'
			}],
			buttons : [{
				text : '执行',
				id : 'start',
				handler : function() {
					monthID = Ext.getCmp("monthSelector").getValue();
					
					if(monthID == '') {
						Ext.Msg.alert('提示信息',"请选择考核月份");
						return;
					}
					ProgressRunner.run(progressBar);
				}
			}, {
				text : '停止',
				id : 'stop',
				handler : function() {
					doStop();
				}
			}, {
				text : '关闭',
				id : 'close',
				handler : function() {
					cwin.destroy();
				}
			}]
		}), southPanel = new Ext.Panel({
			region : 'south',
			id : 'southPanel',
			frame : true,
			split : true,
			height : 40,
			items : [progressBar = new Ext.ProgressBar({
				id : 'progressBar',
				text : ''
			})]
		})]
	});

	cwin.show();
}

function getKeyWordRoot() {
	var root = new Ext.tree.AsyncTreeNode({
		id : 'nullrootid',
		text : '根节点',
		qtip: '根节点',
		children : [{
			id : 'COMPLETE',
			text : '[COMPLETE]衡量指标完成值',
			leaf : true
		},{
			id : 'TARGET',
			text : '[TARGET]衡量指标目标值',
			leaf : true
		},{
			id : 'FULL_SCORE',
			text : '[FULL_SCORE]方案总分',
			leaf : true
		}]
	});
	return root;
}

function createNewProject(checked){
	var new_project_id = getNewVersionId();
	
	var createWin = new Ext.Window({
		id : 'createWin',
		title : '生成新方案',
		width : 400,
		height : 170,
		layout : 'form',
		modal : true,
		labelWidth : 70,
		border : false,
		bodyStyle : {
			padding : '40px,30px'
		},
		listeners : {
			close : function(){
				Ext.getCmp('createWin').destroy();
			}
		},
		buttonAlign : 'center',
		items : [{
			xtype : 'hidden',
			id : 'new_project_id',
			value : new_project_id
		},{
			xtype : 'textfield',
			id : 'project_create',
			fieldLabel : '新方案名称',
			value : project_name_hidden+'_新方案',
			allowBlank : false,
			anchor : '95%'
		}],
		buttons : [{
			text : '确定',
			handler : function(){
				if(Ext.getCmp('project_create').getValue()==null){
					Ext.Msg.alert('提示','请输入生成新方案的名称');
					return ;
				}
				Ext.Ajax.request({
					url : pathUrl + '/bscmeasure_common.action?method=createNewProject',
					method : 'POST',
					params : {
						checked : checked,
						old_project_id : project_id_hidden,
						new_project_name : Ext.getCmp('project_create').getValue(),
						new_project_id : new_project_id
					},
					callback : function(options,success,response){
						var json = Ext.util.JSON.decode(response.responseText);
						if(success){
							Ext.getCmp('createWin').destroy();
							initProject = new_project_id ;
							projectDS.load();
						}else{
							Ext.MessageBox.alert('提示信息',json.info);
						}
					}
				});
			}
		},{
			text : '取消',
			handler : function(){
				Ext.getCmp('createWin').destroy();
			}
		}]
	});
	
	createWin.show();
}

/**
 * 全部替换
 * @param {} str
 * @param {} str1
 * @param {} str2
 * @return {}
 */
function replaceAll(str, str1, str2) {
	while (str.indexOf(str1) >= 0)
		str = str.replace(str1, str2);
	return str;
}
