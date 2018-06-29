var mMenu = new Ext.Toolbar();
var menus = new Array();
var listenerAdded = false;
/**
 * 指标运算依赖指标列表
 */
var store = new Ext.data.JsonStore({
	url : pathUrl + '/privateMeasure_common.action?method=listMeasureCalcDepend',
	root : 'results',
	fields : ['measure_id','measure_name','is_private','obj_cate_id']
});

store.on("load",function(){
	for (var i = 0; i < store.getCount(); i++) {
		var r = store.getAt(i);
		var node = baseTree.getNodeById(r.get("measure_id"));
		if(!node && ntype == 'private')
			node = privateTree.getNodeById(r.get("measure_id"));
		if(node)
			node.getUI().toggleCheck(true);
	}
});

var cm = new Ext.grid.ColumnModel([
		{header : '指标ID', dataIndex : 'measure_id'},
		{header : '指标名', dataIndex : 'measure_name'},
		{header : '指标类型', dataIndex : 'is_private', renderer : function(val){
			if(val == 'N')
				return '<font color="green">公有指标</font>';
			else if(val == 'Y')
				return '<font color="red">私有指标</font>';
			return val;
		}},
		{header : '考核对象类型', dataIndex : 'obj_cate_id' , renderer : function(val){
			if(val == 'BM')
				return '区属部门';
			else if(val == 'CBM')
				return '市属部门';
			else if(val == 'ZJ')
				return '镇街';
				
			return val;
		}},
		{header : '操作', dataIndex : 'measure_id' , width : 40, renderer : function(val){
			return "<a href='javascript:void(0)' onclick=deleteRelaRecord('"+val+"')>删除</a>";
		}}
	]);
	
	var gridPanel = new Ext.grid.GridPanel({
		id : 'gridPanel',
		region : 'center',
		title : '运算依赖节点[指标的值是由下列指标计算得出]',
		border : true,
		cm : cm,
		sm : new Ext.grid.RowSelectionModel(),
		ds : store,
		autoScorll : true,
		region : 'center',
		loadMask : true,
		viewConfig : {forceFit : true}
	});
	
	var pub_rn = getRootNode('root', '公共指标树', expandMyMeasureTreeNode2);
	var pri_rn = getRootNode('root', '私有指标树', expandMyMeasureTreeNode2);
	pub_rn.attributes.is_private = 'N';
	pri_rn.attributes.is_private = 'Y';
	
	var privateTree = null;
	
	var second_public_treeMenu = new Ext.Toolbar();
	var second_private_treeMenu = new Ext.Toolbar();
	
	//添加公有树形索引
	addSearchToolbar({
		oldToolbar : second_public_treeMenu,
		expandMethod : expandMyMeasureTreeNode2,
		treePanelId : 'baseTree',
		is_private : 'N'
	});
	
	//添加私有树形索引
	addSearchToolbar({
		oldToolbar : second_private_treeMenu,
		expandMethod : expandMyMeasureTreeNode2,
		treePanelId : 'privateTree',
		is_private : 'Y'
	});
	
	var tabPanel = new Ext.TabPanel({
		tabPosition : 'bottom',
		activeTab : 0,
		border : false,
		defaults : {
			autoScroll : true
		},
		listeners : {
			tabchange : function() {
				if (tabPanel.getActiveTab() == privateTree) {
					privateTree.getRootNode().expand();
				}
		}
		},
		items : [baseTree = new Ext.tree.TreePanel({
			title : '公共指标树',
			id : 'baseTree',
			animate : true,
			frame : false,
			border : false,
			loader : new Ext.tree.TreeLoader(),
			lines : false,
			listeners : {},
			bodyStyle : 'padding:5px 5px',
			autoScroll : true,
			root : pub_rn,
			rootVisible : true,
			tbar : second_public_treeMenu
		})]
	});
	
	if(ntype == 'private') {
	
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
			tbar : second_private_treeMenu
		}));
	}
	
	var measureTreePanel = new Ext.Panel({
		title : '指标树',
		layout : 'fit',
		width : 320,
		region : 'west',
		split : false,
		items : [tabPanel]
	});
	
/**
 * 指标运算关系面板定义
 */
var selectExeMeaPanel = new Ext.Panel({
	id : 'card-0',
	layout : 'border',
	items : [{
		region : 'north',
		height : 60,
		html : '<p>运算指标说明:</p>'
	},measureTreePanel,gridPanel]
});

var cardNav = function(incr){
    var layout = Ext.getCmp('card-wizard-panel').getLayout();
    var i = layout.activeItem.id.split('card-')[1];
    
    var next = parseInt(i) + incr;
    if(next == 1) {
    	formulaTextArea.focus();
    	mMenu.removeAll(true);
    	if(store.getCount() > 0)
	    	mMenu.add({
				id : 'measureMenu',
				xtype : 'buttongroup',
				title : '运算指标',
				columns : 4,
				defaults : {
					scale : 'small'
				}
			});
    	for (var i = 0; i < store.getCount(); i++) {
    		var r = store.getAt(i);
    		Ext.getCmp("measureMenu").add({
    			id : r.get('measure_id'),
				text : r.get('measure_name'),
				iconCls : 'open',
				handler : function(){
					RangeInsert(formulaTextArea, "[@"+this.id+"]");
				}
			});
    	}
    }
    	
	formulaPanel.doLayout(true);
    layout.setActiveItem(next);
    Ext.getCmp('card-prev').setDisabled(next == 0);
    Ext.getCmp('card-next').setVisible(next!=1);
    Ext.getCmp('saveFormula').setVisible(next==1);
};


/**
 * 指标公式编辑选项
 */
var formulaMenu = new Ext.Toolbar({
	items : [{
		xtype : 'buttongroup',
		title : '操作',
		columns : 4,
		defaults : {
			scale : 'small'
		},
		items : [{
			text : '清空',
			tooltip : '清空表达式内容',
			iconCls : 'stack',
			handler : function() {
				formulaTextArea.setValue('');
			}
		}, {
			text : '还原',
			tooltip : '清空表达式内容',
			iconCls : 'stack',
			handler : function() {
				formulaTextArea.setValue(Ext.getCmp("formula_expr").getValue());
			}
		}]
	},{
		xtype : 'buttongroup',
		title : '逻辑运算符',
		columns : 5,
		defaults : {
			scale : 'small'
		},
		items : [{
			id : '&&',
			text : '与(&&)',
			tooltip : '逻辑运算符(与)',
			iconCls : 'open',
			handler : function() {
				RangeInsert(formulaTextArea, this.id);
			}
		}, {
			id : '||',
			text : '或(||)',
			tooltip : '逻辑运算符(或)',
			iconCls : 'open',
			handler : function() {
				RangeInsert(formulaTextArea, this.id);
			}
		},{
			id : '!',
			text : '非(!)',
			tooltip : '逻辑运算符(非)',
			iconCls : 'open',
			handler : function() {
				RangeInsert(formulaTextArea, this.id);
			}
		}]
	},{
		id : 'functionBtn',
		xtype : 'buttongroup',
		title : '函数',
		columns : 2,
		defaults : {
			scale : 'small'
		}
	},{
		id : 'paramBtn',
		xtype : 'buttongroup',
		title : '参数',
		columns : 2,
		defaults : {
			scale : 'small'
		}
	},'->',{
		text : '帮助',
		iconCls : 'add',
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
			window.open(pathUrl+ "/bsc/pages/formula_help.htm","newwindow","height="+ah+",width="+aw+",top=0,left=0,toolbar=no,menubar=no,resizable=yes,scrollbars=yes,location=no,status=no");
		}
	}]
});

Ext.Ajax.request({
	url : pathUrl + '/publicMeasure_getFunctionAndParam.action',
	method : 'POST',
	callback : function(options, success, response) {
		var json = Ext.util.JSON.decode(response.responseText);
		var rs = json.results;
		
		var numFunctionArray = new Array();
		var logicFunctionArray = new Array();
		var publiParamArray = new Array();
		var privateParamArray = new Array();
		
		var p1 = 0,p2 = 0,p3 = 0,p4 = 0;
		
		if (rs.length > 0) {
			for(var i=0; i < rs.length; i++) {
				if(rs[i].functionName){
					//函数
					var f = {
						id : rs[i].functionDesc,
						text : rs[i].functionName,
						iconCls : 'open',
						handler : function() {
							RangeInsert(formulaTextArea, this.id);
						}
					};
					if(rs[i].functionType == 'NUMBER'){
						numFunctionArray[p1] = f;
						p1++;
					}else {
						logicFunctionArray[p2] = f;
						p2++;
					}
				}else if(rs[i].parameter_id) {
					//参数
					var o = {
						id : rs[i].parameter_id,
						text : rs[i].parameter_name,
						iconCls : 'open',
						handler : function() {
							RangeInsert(formulaTextArea, '[$'+this.id+']');
						}
					};
					if(rs[i].param_type_id == '01') {
						publiParamArray[p3] = o;
						p3++;
					}else{
						privateParamArray[p4] = o;
						p4++;
					}
				}
			}
			
			if(numFunctionArray.length > 0) {
				Ext.getCmp("functionBtn").add({
					text : '数值函数',
					id : 'fun_num',
					iconAlign : 'left',
					arrowAlign : 'left',
					iconCls : 'open',
					menu : numFunctionArray
				});
			}
			if(logicFunctionArray.length > 0) {
				Ext.getCmp("functionBtn").add({
					id : 'fun_logic',
					text : '逻辑函数',
					iconAlign : 'left',
					arrowAlign : 'left',
					iconCls : 'open',
					menu : logicFunctionArray
				});
			}
			if(publiParamArray.length > 0) {
				Ext.getCmp("paramBtn").add({
					text : '全局参数',
					id : 'publicParam',
					iconAlign : 'left',
					iconCls : 'open',
					menu : publiParamArray
				});
			}
			
			if(privateParamArray.length > 0) {
				Ext.getCmp("paramBtn").add({
					id : 'privateParam',
					text : '私有参数',
					iconAlign : 'left',
					iconCls : 'open',
					menu : privateParamArray
				});
			}
		} else {
			Ext.MessageBox.alert('错误', json.info);
		}
	}
});

var formulaPanel = new Ext.Panel({
	region : 'center',
	layout : 'border',
	tbar : mMenu,
	items : [{
		region : 'center',
		title : '指标编辑区',
		layout : 'fit',
		split : true,
		border : false,
		items : [formulaTextArea = new Ext.form.TextArea({
			id : 'formulaTextArea',
			name : 'formula',
			border : false
		})]
	}, {
		region : 'east',
		width : 320,
		title : '指标描述区',
		split : true,
		border : false,
		layout : 'fit',
		items : [formuDescTextArea = new Ext.form.TextArea({
			id : 'formulaDescTextArea',
			name : 'formula_desc',
			border : false,
			readOnly : true
		})]
	}]
});

var formulaDescPanel = new Ext.Panel({
	region : 'north',
	height : 80,
	bbar : formulaMenu,
	html : '<p>公式编辑说明：</p>'
})

/**
 * 编辑公式窗口
 */
var editFormulaWin = new Ext.Window({
	width : 750,
	height : 480,
	layout : 'fit',
	title : '编辑考核指标',
	listeners : {
		beforeclose : function() {
			resetEditFormulaWin();
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
		bbar : ['->',{
			text : '取消',
			iconCls : 'cross',
			handler : function() {
				resetEditFormulaWin();
				editFormulaWin.hide();
			}
		}, '-', {
			id : 'card-prev',
			text : '&laquo; 上一步',
			handler : cardNav.createDelegate(this, [-1]),
			disabled : true
		}, '-', {
			id : 'card-next',
			text : '下一步 &raquo;',
			handler : cardNav.createDelegate(this, [1])
		},{
			text : '保存',
			iconCls : 'save',
			id : 'saveFormula',
			handler : function() {
				var relaMeasureId = '';
				for (var i = 0; i < store.getCount(); i++) {
					var r = store.getAt(i);
					relaMeasureId += ","+r.get("measure_id");
				}
				var formula_desc = formuDescTextArea.getValue();
				if(formula_desc == '')
					formula_desc = getFormulaDesc(formulaTextArea.getValue())
				Ext.Ajax.request({
					url : pathUrl + '/privateMeasure_common.action?method=editEngMeasureFormula',
					method : 'POST',
					params : {
						relaMeasureId : relaMeasureId,
						measure_id : selectNodeId,
						formula_expr : formulaTextArea.getValue(),
						formula_desc : formula_desc
					},

					callback : function(options, success, response) {
						var json = Ext.util.JSON.decode(response.responseText);
						if (json.success) {
							propertyPanel.form.load({
									url : pathUrl + '/privateMeasure_common.action?method=getEngMeasureById&measure_id='+selectNodeId
								});
							resetEditFormulaWin();
						} else {
							Ext.MessageBox.alert('提示信息', json.info);
						}
					}
				});
			}
		}],
		items : [selectExeMeaPanel,{
			id : 'card-1',
			layout : 'border',
			items : [formulaDescPanel,formulaPanel]
		}]
	}]
});

function resetEditFormulaWin(){
	editFormulaWin.hide();
	Ext.getCmp('card-wizard-panel').getLayout().setActiveItem(0);
	Ext.getCmp("saveFormula").setVisible(false);
	Ext.getCmp("card-next").setVisible(true);
	formulaTextArea.setValue("");
	Ext.getCmp("card-prev").setDisabled(true);
	tabPanel.setActiveTab(1);
	unCheckTree(baseTree);
	if(ntype == 'private')
		unCheckTree(privateTree);
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
			
			sourceComboBox.setValue(sid);
			sourceFormulaTextArea.setValue(formula);
			valueFieldDS.reload({ 
				params : {
					source_id : sid
				}
			});
			currField = "";
			fwindow.show();
		}else {
			//聚合指标
			store.load({params : {measure_id : selectNode.id}});
			formulaTextArea.setValue(Ext.getCmp("formula_expr").getValue());
			formuDescTextArea.setValue(Ext.getCmp("load_formula_desc").getValue());
			
			Ext.getCmp('card-next').setVisible(true);
    		Ext.getCmp('saveFormula').setVisible(false);
			editFormulaWin.show();
			
			baseTree.getRootNode().expand();
			
			if(!listenerAdded) {
				document.getElementById("formulaTextArea").attachEvent("onpropertychange",descFunction);
				document.getElementById("formulaDescTextArea").style.background = '#cde6c7';
				listenerAdded = true;
			}
		}
}

var Plant = new Ext.data.Record.create([{
	name : "measure_id",
	mapping : "measure_id",
	type : "string"
}, {
	name : "measure_name",
	mapping : "measure_name",
	type : "string"
}, {
	name : "is_private",
	mapping : "is_private",
	type : "string"
}, {
	name : "obj_cate_id",
	mapping : "obj_cate_id",
	type : "string"
}]);

function addRelaRecord(node) {
	if(node.id == selectNodeId) {
		Ext.Msg.alert("提示信息","运算公式不能依赖自己!");
		node.getUI().toggleCheck(false);
		return;
	}
	
	if(store.find("measure_id",node.id) != -1)
		return;
	var plant = new Plant({
		measure_id : node.id,
		measure_name : node.attributes.measure_name,
		is_private : node.attributes.is_private,
		obj_cate_id : node.attributes.obj_cate_id
	});
	store.insert(store.getCount(), plant);
}

function deleteRelaRecord(measure_id) {
	var index = store.find("measure_id",measure_id);
	if(index != -1) {
		store.removeAt(index);
		var node = baseTree.getNodeById(measure_id);
		if(!node && ntype == 'private')
			node = privateTree.getNodeById(measure_id);
			
		if(node)
			node.getUI().toggleCheck(false);
	}
}

/**
 * 设置全不选中
 * @param {} treePanel
 */
var unCheckTree = function(treePanel){
        var startNode = treePanel.getRootNode();
        var f = function(){
             if(this.getUI().checkbox!=null){              
                 this.attributes.checked= false;
                 this.ui.checkbox.checked= false;
             }
        };
        startNode.cascade(f);
};

function getFormulaDesc(formula_expression) {
	for(var i=0;i<store.getCount();i++) {
		var r = store.getAt(i);
		var measure_id = r.get('measure_id');
		var measure_name = r.get('measure_name');
		formula_expression = replaceAll(formula_expression,measure_id,measure_name);
	}
	return formula_expression;
}

function descFunction(o) {
	if (o.propertyName == 'value') {
		formuDescTextArea.setValue(getFormulaDesc(formulaTextArea.getValue()));
	}
}

/**
 * 全部替换
 * 
 * @param {}
 *            str
 * @param {}
 *            str1
 * @param {}
 *            str2
 * @return {}
 */
function replaceAll(str, str1, str2) {
	while (str.indexOf(str1) >= 0)
		str = str.replace(str1, str2);
	return str;
}