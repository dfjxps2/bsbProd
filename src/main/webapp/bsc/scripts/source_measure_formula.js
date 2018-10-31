var selectLinkId = '';

/**
 * 数据源Store
 */
var dataSourceDS = new Ext.data.JsonStore({
	url : pathUrl + '/datasourceconfig_list.action',
	root: 'results',
	totalProperty: 'totalCount',
	autoLoad: true,
	fields: ['source_id','source_name','source_expression','obj_cate_id','obj_cate_desc','obj_column']
});
dataSourceDS.on("load",loadDataSource);
function loadDataSource() {
	if(dataSourceDS.getCount() > 0) {
		var record = dataSourceDS.getAt(0);
		var val = record.get('source_id');
		sourceComboBox.setValue(val);
		valueFieldDS.load({
			params : {source_id : val}
		})
	}
}


/**
 * 数据源字段Store
 */
var valueFieldDS = new Ext.data.JsonStore({
    url : pathUrl + '/datasourceconfig_sourceFieldList.action?is_dim_col=N',
    root: 'results',
    fields: ['column_name','mea_fullname','source_id']
});
valueFieldDS.on("load",function(){
//	debugger
	beforeClose();
	if (valueFieldDS.getCount() > 0) {
		var source_id = valueFieldDS.getAt(0).get('source_id');
		dimFieldDS.reload({
			params : {
				source_id : source_id
			}
		});
	}
});

/**
 * 数据源条件Store
 */
var dimFieldDS = new Ext.data.Store({
	proxy: new Ext.data.HttpProxy({
		url : pathUrl + '/datasourceconfig_sourceFieldList.action?is_dim_col=Y'
	}),
	reader: new Ext.data.JsonReader({
		root: 'results',
		id:'column_name'
	},
	[{name: 'column_name'},
	 {name: 'dim_fullname'},
	 {name: 'column_biz_name'},
	 {name: 'link_id'},
	 {name: 'data_type_id'},
	 {name: 'is_tree'},
	 {name: 'label_field'},
	 {name: 'id_field'},
	 {name: 'root_value'},
	 {name: 'parent_id_field'}]),
	remoteSort: false
});

dimFieldDS.on("load",function(){
//	debugger;
	for (var i = 0; i < dimFieldDS.getCount(); i++) {
		var record = dimFieldDS.getAt(i);
		var comp = getComponment(record);
		if(comp != null){
			Ext.getCmp("dimSet").add(comp);
		}
	}
	Ext.getCmp("dimSet").doLayout(true);
});

function getComponment(record) {
	var is_tree = record.get('is_tree');
	var comp = null;
	if(is_tree == 'Y') {
		var root = getCheckedNode(' ',' ',false,expandDimLinkTreeNode);
		comp = new treeSelector({
			id : record.get('link_id'),
			displayFieldName : record.get('label_field'),
			valueFieldName : record.get('id_field'),
			fieldLabel : record.get('column_biz_name'),
			root : root,
			anchor : '100%'
		});
		comp['linkId'] = record.get('link_id');
	}else {
		comp = new gridSelector({
			id : record.get('link_id'),
			displayFieldName : record.get('label_field'),
			valueFieldName : record.get('id_field'),
			fieldLabel : record.get('column_biz_name'),
			link_id : record.get('link_id'),
			anchor : '100%'
		});
		comp['linkId'] = record.get('link_id');
	}
	return comp;
}

var checkboxSelectionModel = new Ext.grid.CheckboxSelectionModel({
	handleMouseDown : Ext.emptyFn
});


/**
 * 基础指标编辑公式方法
 */
function doEditFormula() {
	if (Ext.getCmp('measureTree').getSelectionModel().getSelectedNode() == null) {
		Ext.MessageBox.alert('提示信息', '请选择一个需要编辑公式的节点');
		return;
	}

	var selectID = Ext.getCmp('measureTree').getSelectionModel().getSelectedNode().id;

	if (selectID == 'root')
		return;

	dataSourceDS.load();
		
	var sid = Ext.getCmp('sid').getValue();
	var formula = Ext.getCmp('tf').getValue();
	
	Ext.getCmp('cboSourceID').setValue(sid);
	Ext.getCmp('formula').setValue(formula);
	valueFieldDS.reload({
		params : {
			source_id : sid
		}
	});
	currField = "";
	fwindow.show();
}

var fwindow = new Ext.Window({
	title : '公式设定',
	width : 600,
	height : 450,
	modal : true,
	plain : true,
	border : false,
	buttonAlign : 'center',
	layout : 'border',
	listeners : {
		close : function(){
			beforeClose();
		}
	},
	closable : false,
	items : [tabPanel = new Ext.Panel({
		region : 'west',
		split : true,
		frame : true,
		layout : 'fit',
		width : 295,
		defaults : {
			autoScroll : true
		},
		items : [{
			name : 'object',
			layout : 'border',
			border : false,
			buttonAlign : 'center',
			items : [new Ext.form.FormPanel({
				region : 'center',
				split : true,
				frame : false,
				id : 'sourceFormPanel',
				layout : 'form',
				height: 70,
				minHeight:70,
				maxHeight:70,
				labelWidth : 70,
				border : false,
				bodyStyle : 'padding:5px 5px 5px 5px;',
				items : [
                   {
					xtype : 'fieldset',
					title : '数据源与字段(必填项)',
					anchor : '100%',
					layout : 'form',
					labelWidth : 70,
                    items : [
                        fileNameField = new Ext.form.TextField({
                           id:'dsName',
                           disabled:false,
                           emptyText:"请正确输入数据源名称" ,
                           fieldLabel:"数据源名称",
                           inputType:'text',
                           maxLength:30,
						   width:175,
						   listeners: {
                               specialkey : function(field, e) {
                                   var dsText=field.getValue();
                                   if (e.getKey() == e.ENTER && dsText) {
                                       dataSourceDS.reload({
                                           params: {
                                               source_name: dsText
                                           }
                                       })
                                   }
                               }
							},
                            anchor : '100%'
                       }),
						sourceComboBox = new Ext.form.ComboBox({
						store : dataSourceDS,
						valueField : 'source_id',
						displayField : 'source_name',
						mode : 'local',
						editable : false,
						triggerAction : 'all',
						fieldLabel : '数据源',
						listeners: {
							select : function(combo, record, index){
								valueFieldDS.reload({params : {
									source_id : record.get('source_id')
								}})
							}
						},
						name : 'sourceID',
						id : 'cboSourceID',
						anchor : '100%'
					}), valuleFieldComboBox = new Ext.form.ComboBox({
						store : valueFieldDS,
						valueField : 'column_name',
						displayField : 'mea_fullname',
						mode : 'local',
						editable : false,
						triggerAction : 'all',
						fieldLabel : '度量字段',
						name : 'fieldID',
						id : 'cboValueField',
						anchor : '100%'
					})]
				}, {
					id : 'dimSet',
					xtype : 'fieldset',
					title : '过滤条件(选填项:需要过滤数据时选择)',
					anchor : '100%',
					layout : 'form'
				}]
			})],
			buttons : [{
				text : '插入公式',
				handler : function() {
					var valueField = valuleFieldComboBox.getValue();
					if (valueField == "") {
						Ext.MessageBox.alert('提示', '请选择度量字段!');
						return;
					}
					var condition = "";
					var count = dimFieldDS.getCount();
					
					for (var i = 0; i < count; i++) {
						var record = dimFieldDS.getAt(i);
						var is_tree = record.get('is_tree');
						var fieldID = record.get('column_name');
						var link_id = record.get('link_id');
						var data_type_id = record.get('data_type_id');
						var val = Ext.getCmp(link_id).getRawValue();
						
						if(val == '')
							continue;
							
						if(val.charAt(val.length-1) == ','){
							val = val.substr(0,val.length-1);
						}
						
						var ary = val.split(',');

						if (data_type_id == 'STRING') {
							var ary = val.split(',');
							var temp_ary = new Array();
							for (var j = 0; j < ary.length; j++) {
								if(ary[j] == '')
									continue;
								temp_ary[j] = "'" + ary[j] + "'";
							}
							ary = temp_ary;
						}

						if (ary == null || ary.length == 0)
							continue;

						if (condition != "")
							condition += " && ";

						if(ary.length > 1) {
							condition += fieldID + " in (" + ary + ")";
						}else { 
							condition += fieldID + " = " + ary + "";
						}
					}

					var expression;
					if (condition != "")
						expression = "{" + valueField + "?" + condition + "}";
					else
						expression = "{" + valueField + "}";

					RangeInsert(sourceFormulaTextArea, expression);

					clearDimValues();
				}
			}, {
				text : '清空条件',
				handler : function() {
					clearDimValues();
				}
			}]
		}]
	}), {
		xtype : 'panel',
		region : 'center',
		layout : 'border',
		broder : false,
		items : [formPanel = new Ext.form.FormPanel({
			region : 'center',
			layout : 'fit',
			items : sourceFormulaTextArea = new Ext.form.TextArea({
				id : 'sourceFormulaTextArea',
				name : 'formula_expr',
				border : false,
				height : 360
			})
		})]
	}],
	buttons : [{
		text : '保存',
		handler : function() {
			var measureID = Ext.getCmp('mid').getValue();
			var sourceID = sourceComboBox.getValue();
			var formula = sourceFormulaTextArea.getValue();
			if(sourceID == '') {
				Ext.Msg.alert("提示信息","请选择一个数据源");
				return;
			}
			formPanel.form.submit({
				method : 'POST',
				url : pathUrl+'/publicMeasure_common.action?method=editEngMeasureFormula',
				params : {
					measure_id : measureID,
					source_id : sourceID
				},
				waitMsg : '正在处理,请稍后......',
				success : function(form, action) {
					propertyPanel.form.load({
						url : pathUrl + '/publicMeasure_common.action?method=getEngMeasureById&measure_id='+measureID
					});
//					clearDimValues();
					beforeClose();
					fwindow.hide();
				},
				failure : function(form, action) {
					Ext.Msg.alert("提示信息",action.result.info);
				}
			});
		}
	}, {
		text : '取消',
		handler : function() {
			beforeClose();
			fwindow.hide();
			sourceFormulaTextArea.setValue();
		}
	}]
});

function clearDimValues() {
	for (var i = 0; i < dimFieldDS.getCount(); i++) {
		var record = dimFieldDS.getAt(i);
		var id = record.get('link_id');
		var is_tree = record.get('is_tree');
		var comp = Ext.getCmp(id);
		if(is_tree == 'Y') {
			var array = Ext.getCmp(id+"Tree").getChecked();
			for (var j = 0; j < array.length; j++) {
				var node = array[j];
				node.getUI().toggleCheck(false);
			}
		}else {
			try{
				Ext.getCmp(id+"Grid").getSelectionModel().clearSelections();
			}catch(e){
				console.log("err:clearDimValues...");
			}
		}
		comp.setRawValue('');
	}
}

function beforeClose() {
	for (var i = 0; i < dimFieldDS.getCount(); i++) {
		var record = dimFieldDS.getAt(i);
		var id = record.get('link_id');
		var comp = Ext.getCmp(id);
		if(comp != null){
			comp.destroy();
		}
	}
	Ext.getCmp("dimSet").doLayout(true);
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

/**
 * 设置全选中
 * @param {} treePanel
 */
var checkAllTree = function(treePanel){
    debugger
        var startNode = treePanel.getRootNode();
        var f = function(){

            if(this.getUI().checkbox!=null){
 //           	this.expand();
                 this.attributes.checked= true;
                 this.ui.checkbox.checked= true;
             }
        };
        startNode.cascade(f);
};

//表格下拉框
gridSelector = function(obj) {
	var expanded = false;
	var anchor = obj.anchor?obj.anchor:'91%';
	gridSelector.superclass.constructor.call(this,{
        id: obj.id,
		autoSelect:false,
		mode: 'local',
		triggerAction : "all",
		blankText : '如需过滤数据请选择',
		linkId : obj.link_id,
		editable: false,
		fieldLabel : obj.fieldLabel,
		store: {
		    xtype:'arraystore',
		    fields : [obj.valueFieldName,obj.displayFieldName],
		    data:[['','']]
		},
		anchor : anchor
	});
	
	var checkboxSelectionModel = new Ext.grid.CheckboxSelectionModel({
		handleMouseDown : Ext.emptyFn
	});
	
	var dimValueColumnModel = new Ext.grid.ColumnModel([checkboxSelectionModel, {
		id : 'valueField',
		dataIndex : 'value_field'
	}, {
		dataIndex : 'display_field'
	}]);
	
	var vStore = new Ext.data.JsonStore({
		url : pathUrl + '/dimLink_listExpressionDetail.action?link_id='+obj.link_id,
		root : 'results',
		id : 'value_field',
		fields : ['value_field', 'display_field']
	});
	
	var showMenu = new Ext.menu.Menu({
		items : [new Ext.grid.GridPanel({
			tbar : [{
				text : '全选',
				iconCls : "add",
				handler : function() {
					Ext.getCmp(obj.id+"Grid").getSelectionModel().selectAll();
				}
			}, {
				text : '清空',
				iconCls : "delete",
				handler : function() {
					Ext.getCmp(obj.id+"Grid").getSelectionModel().selectAll();
					Ext.getCmp(obj.id+"Grid").getSelectionModel().deselectRange(0,vStore.getCount());
					Ext.getCmp(obj.id).setRawValue('');
				}
			}],
			id : obj.id + "Grid",
			ds : vStore,
			width : 300,
			height : 280,
			cm : dimValueColumnModel,
			sm : checkboxSelectionModel,
			loadMask : true,
			viewConfig : {
				forceFit : true
			},
			border : true
		})]
	});
	this.expand=function(){
		if(this.menu == null)
			this.menu = showMenu;
        this.menu.show(this.el, "tl-bl?");
        if(!expanded) {
        	expanded = true;
        	Ext.getCmp(obj.id + "Grid").getSelectionModel().on("rowselect",function(sm,index,record){
        		var rowVal = Ext.getCmp(obj.id).getRawValue();
        		if(rowVal.indexOf(record.get('value_field')+",") == -1)
        			rowVal += record.get('value_field')+",";
        		Ext.getCmp(obj.id).setRawValue(rowVal)
        	});
        	Ext.getCmp(obj.id + "Grid").getSelectionModel().on("rowdeselect",function(sm,index,record){
        		var rowVal = Ext.getCmp(obj.id).getRawValue();
        		rowVal = rowVal.replace(record.get('value_field')+",","");
        		Ext.getCmp(obj.id).setRawValue(rowVal)
        	});
        	vStore.load();
        }
    };
}
Ext.extend(gridSelector,Ext.form.ComboBox);

//树形下拉框
treeSelector = function(obj) {
	var expanded = false;
	var anchor = obj.anchor?obj.anchor:'91%';
	treeSelector.superclass.constructor.call(this,{
		tbar : [{
			text : '全选',
			iconCls : "add",
			handler : function() {
				var tt = Ext.getCmp(obj.id + "Tree");
				checkAllTree(tt);
				var nodeArray = tt.getChecked();
				var val = '';
				for (var i = 0; i < nodeArray.length; i++) {
					val += nodeArray[i].id + ",";
				}
				Ext.getCmp(obj.id).setRawValue(val);
			}
		}, {
			text : '清空',
			iconCls : "delete",
			handler : function() {
				unCheckTree(Ext.getCmp(obj.id + "Tree"));
				Ext.getCmp(obj.id).setRawValue('');
			}
		}],
        id: obj.id,
		autoSelect:false,
		blankText : '如需过滤数据请选择',
		mode: 'local',
		triggerAction : "all",
		linkId : obj.link_id,
		editable: false,
		fieldLabel : obj.fieldLabel,
		store: {
		    xtype:'arraystore',
		    fields : [obj.valueFieldName,obj.displayFieldName],
		    data:[['','']]
		},
		anchor : anchor
	});
	var showMenu = new Ext.menu.Menu({
		items : [new Ext.tree.TreePanel({
			tbar : [{
				text : '全选',
				iconCls : "add",
				handler : function(){
					var tt = Ext.getCmp(obj.id+"Tree");
					checkAllTree(tt);
					var nodeArray = tt.getChecked();
					var val = '';
					for (var i = 0; i < nodeArray.length; i++) {
						val += nodeArray[i].id+",";
					}
					Ext.getCmp(obj.id).setRawValue(val);
				}
			},{
				text : '清空',
				iconCls : "delete",
				handler : function(){
					unCheckTree(Ext.getCmp(obj.id+"Tree"));
					Ext.getCmp(obj.id).setRawValue('');
				}
			}],
			loader : new Ext.tree.TreeLoader(),
			lines : false,
			border : false,
			id : obj.id + 'Tree',
			autoScroll : true,
			width : 300,
			height : 280,
			bodyStyle : 'padding:2px;',
			rootVisible : false,
			root : obj.root
		})]
	});
	this.expand=function(){
		if(this.menu == null)
			this.menu = showMenu;
        this.menu.show(this.el, "tl-bl?");
        if(!expanded) {
        	expanded = true;
        	var tt = Ext.getCmp(obj.id+'Tree');
        	tt['linkId'] = Ext.getCmp(obj.id).linkId;
        	rootName(tt);
        }
    };
}
Ext.extend(treeSelector,Ext.form.ComboBox);

function getCheckedNode(id,text,checked,fn){
	var root = new Ext.tree.AsyncTreeNode({
		id:id,
		text:text,
        expanded:true,  //节点展开
		checked:checked,
		children:[{
			text:'loading',
			cls: 'x-tree-node-loading',
			leaf:true
		}]
	});

	if(fn!=undefined)
		root.on('expand',fn);

	return root;
}

/**
 * 通过rootValue查询rootNode的名称
 * @param {} linkId
 */
function rootName(tree) {
	Ext.Ajax.request({
		method : 'POST',
		url : pathUrl + '/dimLink_findRootName.action',
		params : {
			linkId : tree.linkId
		},
		callback : function(options, success, response) {
			var json = Ext.util.JSON.decode(response.responseText);
			if (success) {
				debugger
				var node = getCheckedNode(json.results[0].id, json.results[0].text,false,expandDimLinkTreeNode);
				tree.setRootNode(node);
				node.on('checkchange', function(node, b) {
					var comboId = node.getOwnerTree().id.replace('Tree', '');
					var combo = Ext.getCmp(comboId);
					var rawValue = combo.getRawValue();
					rawValue = rawValue.replace(node.id + ",", '');
					if (b) {
						rawValue += node.id + ",";
					}
					combo.setRawValue(rawValue);
				});
			} else {
			}
		}
	});
}

/**
 * 维度字段数据源显示树形结构
 * @param {} node
 * selectLinkId:维度链接ID
 */
function expandDimLinkTreeNode(node) {
	if (node.firstChild.text == 'loading') {
		Ext.Ajax.request({
			url : pathUrl + '/dimLink_expandDimLinkTree.action',
			waitMsg : '正在处理,请稍候......',
			method : 'POST',
			params : {
				parentNodeID : node.id,
				linkId :node.getOwnerTree().linkId
			},

			callback : function(options, success, response) {
				var json = Ext.util.JSON.decode(response.responseText);
				var tl = json.results;
				if (tl) {
					for (var i = 0; i < tl.length; i++) {
						var cnode = new Ext.tree.AsyncTreeNode({
							id : tl[i].id,
							text : '[' + tl[i].id + ']' + tl[i].name,
							leaf : tl[i].leaf,
							checked : false,
                            expanded:true,  //节点展开
							children : [{
								text : 'loading',
								cls : 'x-tree-node-loading',
								leaf : true
							}]
						});
						cnode.on('expand', expandDimLinkTreeNode);
						cnode.on('checkchange',function(node, b){

//                            getAllChild(node,true);
//                            getALLParent(node,b);
                            var comboId = node.getOwnerTree().id.replace('Tree','');
							var combo = Ext.getCmp(comboId);
							var rawValue = combo.getRawValue();
							rawValue = rawValue.replace(node.id+",",'');
							if(b) {
								rawValue += node.id+",";
							}
							combo.setRawValue(rawValue);
						});
						node.appendChild(cnode);
						
						if(node.id == cnode.getOwnerTree().getRootNode().id) {
							cnode.expand();						
						}
					}
				} else {
//					Ext.MessageBox.alert('错误', json.info);
				}
				node.firstChild.remove();
			},

			failure : function(response, options) {
				Ext.MessageBox.alert('错误', response.responseText);
			},

			success : function(response, options) {
			}
		});
	}
}



//这个方法是选择父节点,自动选中所有的子节点
function getAllChild(node,checked){
	debugger
    checked?node.expand():node.collapse();
    if(node.hasChildNodes()){
        node.eachChild(function(child) {
            child.attributes.checked = checked;
            var cb = child.ui.checkbox;
            if(cb) cb.checked = checked;
            getAllChild(child,checked);
        });
    }
}
//这个方法是选择子节点,自动选中父节点的父节点
function getALLParent(node,checked){
    if(checked){
        node.expand();
        var parentNode = node.parentNode;
        if(parentNode!=undefined){
            parentNode.attributes.checked = checked;
            var cb = parentNode.ui.checkbox;
            if(cb) cb.checked = checked;
            b(parentNode,checked);
        }
    }
}
//这两个方法要在treepanel的checkchange里调用.

