var mask = null;
var path = '';
//多选扩展
function multstr(value, text){
	var val = 'values.'+value, txt = text;
	return '<tpl for="."><div class="x-combo-list-item"><span><input type="checkbox" {[values.check?"checked":""]}  value="{['+val+']}" /></span><span >{'+txt+'}</span></div></tpl>';
}
function multselect(record, index){
	var txt = this.displayField, val = this.valueField;
	if(this.fireEvent('beforeselect', this, record, index) !== false){
		record.set('check',!record.get('check'));
		var str=[];//页面显示的值
		var strvalue=[];//传入后台的值
		this.store.each(function(rc){
			if(rc.get('check')){
				str.push(rc.get(txt));
				strvalue.push(rc.get(val));
			}
		});
		this.setValue(str.join());
		this.code=strvalue.join();
		//this.collapse();
		this.fireEvent('select', this, record, index);
	}
}

// 显示分页条 pageSize-分页大小
function showBbar(pageSize) {
	var obj_bbar = Ext.getCmp('mainpanel').getBottomToolbar();
	obj_bbar.show();
	obj_bbar.pageSize = pageSize;

}
// 初始化分页条 totalCount-数据总数 path-分页条动作地址
function initBbar(totalCount, path) {
	var obj_bbar = Ext.getCmp('mainpanel').getBottomToolbar();
	obj_bbar.initProperties(totalCount, path, true);

}

var menu = [{
	text : '导出(e)',
	tooltip : '导出查询结果',
	iconCls : 'export',
	handler : function() {
		if (monthID == '' || projectID == ''  || dhtmlGrid == null){
			Ext.MessageBox.alert("提示信息","请先查询出需要导出的数据");
			return;
		}
		var title = "";
		if(objCateId=="BM"){
			title = '区属部门方案';
		}else if(objCateId=="CBM"){
			title = '市属部门方案';
		}else {
			title = '统计方案';
		}
		if(dhtmlGrid.serialize().length<=34) {
			Ext.MessageBox.alert("提示信息","无数据");
			return;		
		}
		document.excelForm.month_id.value = monthID;
		document.excelForm.project_id.value = projectID;
		document.excelForm.title.value = title;
		document.excelForm.project_name.value = projectName;
		document.excelForm.month_name.value = monthName;
		document.excelForm.measure_id.value = measure_id;
		document.excelForm.show_id.value = showID;
		document.excelForm.obj_id.value = objID;
		document.excelForm.time_id.value = timID;
		document.excelForm.file_name.value = '方案结果.xls';
		document.excelForm.submit();
		
	}
}]


/**
 * 月份Store
 */
var monthDS = new Ext.data.JsonStore({
	url : pathUrl + '/bscProject_common.action?method=listExecutedMonth',
	root : 'results',
	totalProperty : 'totalCount',
	fields : ['month_id', 'month_name'],
	listeners : {
		load : function(store, records, options) {
			if (store.getCount() > 0) {
				if (monthID == ''){
					if(showID == "1")
						setMOCmp("monthSelector", store.getAt(0));
					else{
						setMOCmp("monthSelector",'');
					}
				}else{
					setMOCmp("monthSelector",monthID);
				}

				p = Ext.getCmp("projectSelector").getValue();
				indexDS.reload({
					params: {month_id : monthID,project_id : p}
				});
			}else{
				setMOCmp("monthSelector",'');
//				Ext.getCmp("indexSelector").setValue('');
			}
		}
	},
	autoLoad : false
});

/**
 * 方案Store
 */
var projectStore = new Ext.data.JsonStore({

	url : pathUrl + '/bscProject_common.action?method=listProject',
	root : 'results',
	fields : ["project_id", "project_name", "project_desc", "cycle_type_id",
			"obj_cate_id", "app_type_id", "view_id",
			"owner_org_id", "create_user", "create_time", "update_user",
			"update_time"],
			
	idProperty : 'project_id',
	listeners : {
		load : function(store, records, options) {
			if (store.getCount() > 0) {
				if (projectID == ''){
					projectID = store.getAt(0).get('project_id');
					cycle_type_id = store.getAt(0).get('cycle_type_id');
				}
				Ext.getCmp("projectSelector").setValue(projectID);
				monthDS.load({
					params: {project_id : projectID}
				});
				objDS.load({
					params: {project_id : projectID}
				});
				indexDS.reload({
					params: {project_id : projectID}
				});
			}
		},
		beforeload : function(store, options) {
			monthDS.removeAll();
			objDS.removeAll();
			store.baseParams = {
				type : 'score',
				is_template : 'N',
//				app_type_id : '00',
				obj_cate_id : objCateId,
				record_status : 'All'
			}
		}
	},
	autoLoad : true
});
/**
 * 显示维度Store
 */
var showDS = new Ext.data.SimpleStore({
	fields : ['show_id', 'show_name'],
	data : [['1', '统计维度'], ['2', '统计年份']],
	/*listeners : {
		load : function(store, records, options) {
			if (store.getCount() > 0) {
				if (showID == ''){
					showID = store.getAt(0).getValue();
				}
				Ext.getCmp("showSelector").setValue(showID);
			}else{
				setMOCmp("objSelector",'');
			}
		}
	}*/
});
/**
 * 统计维度Store
 */
var objDS = new Ext.data.JsonStore({
	url : pathUrl + '/bscProject_common.action?method=listPorjectObj',
	root : 'results',
	totalProperty : 'totalCount',
	fields : ['obj_id', 'obj_name'],
	listeners : {
		load : function(store, records, options) {
			if (store.getCount() > 0) {
				if (objID == ''){
					if(showID == "2")
						setMOCmp("objSelector", store.getAt(0));
					else{
						setMOCmp("objSelector",'');
					}
				}
			}else{
				setMOCmp("objSelector",'');
			}
		}
	},
	autoLoad : false
});
/***-----------------------------------**/


/**
 * 指标名称Store
 */

var indexDS = new Ext.data.Store({
	proxy: new Ext.data.HttpProxy({
		url : pathUrl + '/datasourceconfig_sourceFieldList.action?source_id=index_csum'
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

indexDS.on("load",function(){
	for (var i = 0; i < indexDS.getCount(); i++) {
		var record = indexDS.getAt(i);
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
		comp = new gridSelector({
			id : record.get('link_id'),
			displayFieldName : record.get('label_field'),
			valueFieldName : record.get('id_field'),
			fieldLabel : record.get('column_biz_name'),
			link_id : record.get('link_id'),
			anchor : '100%'
		});
		comp['linkId'] = record.get('link_id');
	
	return comp;
}	

var checkboxSelectionModel = new Ext.grid.CheckboxSelectionModel({
	handleMouseDown : Ext.emptyFn
});

function beforeClose() {
	for (var i = 0; i < indexDS.getCount(); i++) {
		var record = indexDS.getAt(i);
		var id = record.get('link_id');
		var comp = Ext.getCmp(id);
		if(comp != null){
			comp.destroy();
		}
	}
	Ext.getCmp("dimSet").doLayout(true);
}


//表格下拉框
gridSelector = function(obj) {
//	debugger;
	var expanded = false;
	var anchor = obj.anchor?obj.anchor:'91%';
	gridSelector.superclass.constructor.call(this,{
        id: obj.id,
		autoSelect:false,
		mode: 'local',
		triggerAction : "all",
		labelWidth : 50,
		labelAlign : 'right',
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
		header : '指标编号',	
		dataIndex : 'value_field'
	}, {
		id : 'valueField',
		header : '指标名称',	
		dataIndex : 'display_field'
	}]);
	
	
	

	
	var vStore = new Ext.data.JsonStore({
		url : pathUrl + '/bscProject_common.action?method=listExecutedIndex',
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
//        	debugger;
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
            m = getMOCmpVal("monthSelector");
			p = Ext.getCmp("projectSelector").getValue();

        	vStore.load({params: {month_id : m,project_id : p}});
        }
    };
}
Ext.extend(gridSelector,Ext.form.ComboBox);

function getMOCmp(id){
	return Ext.getCmp(id+showID);
}
function getMOCmpVal(id){
	var select = getMOCmp(id);
	if(select.ismult)
		return select.code || '';
	return select.getValue();
}
function setMOCmp(id, val){
	var select = getMOCmp(id);
	if(val === ''){
		select.setValue('');
		if(select.ismult)
			select.code = '';
	}else if(typeof(val) == "string"){
		select.setValue(val);
	}else{
		if(val == null) return;
		var t = val.get(select.displayField), v = val.get(select.valueField);
		if(select.ismult){
			select.code = v;
			select.setValue(t);
		}else{
			select.setValue(v);
		}
	}
}
/***-----------------------------------**/
Ext.namespace("Ext.ux.form");
var p,m;

Ext.onReady(function() {
	var viewport = new Ext.Viewport({
		layout : 'border',
		id:"viewport",
		items : [{
			region : 'north',
			frame : true,
			border : false,
			height : 110,
			labelWidth : 33,
//			buttonAlign : 'right',
			layout : {
				type : 'form'
			},	
			bodyStyle : 'padding:15px',
			title : '查询条件',
			items : [
				{
					xtype: 'container',
					layout:'column',
					anchor:'100%',
					items:[
						{
							columnWidth : .35,
							layout : 'form',
							labelWidth : 50,
							labelAlign : 'center',
							border : false,
							items : [{
								xtype : 'combo',
								mode : 'local',
								displayField : 'project_name',
								valueField : 'project_id',
								store : projectStore,
								triggerAction : 'all',
								fieldLabel : '方案',
								name : 'project_id',
								listeners : {
									select : function(combo,record,index){
//							dhtmlGrid.clearAll();
										p = record.get("project_id");
										monthID = '';
										monthDS.load({params: {project_id : p}});
										objID = '';
										objDS.load({params: {project_id : p}});
										measure_id = '';
										indexDS.reload({params: {project_id : p}});
//							projectID = '';
									}
								},
								editable : false,
								id : "projectSelector",
								anchor : '91%'
							}]
						},
						{
							columnWidth : .20,
							layout : 'form',
							labelWidth : 60,
							labelAlign : 'left',
							border : false,
							items : [{
								xtype : 'combo',
								mode : 'local',
								displayField : 'show_name',
								valueField : 'show_id',
								store : showDS,
								editable : false,
								triggerAction : 'all',
								fieldLabel : '显示维度',
								name : 'show_id',
								emptyText : '无数据',
								id : 'showSelector',
								anchor : '91%',
								listeners : {
									render : function(combo) {
										var r = combo.getStore();
										showID = r.getAt(0).get('show_id');
										combo.setValue(showID);
									},
									select : function(combo,record,index){
										showID = combo.getValue();
										if(showID == "1"){
											Ext.getCmp("monthSelector1").show();
											Ext.getCmp("objSelector1").show();
											Ext.getCmp("monthBox2").hide();
											Ext.getCmp("objBox2").hide();
											setMOCmp("monthSelector", monthDS.getAt(0) || '');
										}
										else{
											Ext.getCmp("monthSelector1").hide();
											Ext.getCmp("objSelector1").hide();
											Ext.getCmp("monthBox2").show();
											Ext.getCmp("objBox2").show();
											setMOCmp("objSelector", objDS.getAt(0) || '');
										}

									}
								}
							}]
						},
						{
							columnWidth : .20,
							layout : 'form',
							labelWidth : 60,
							labelAlign : 'left',
							border : false,
							items : [{
								xtype : 'combo',
								mode : 'local',
								displayField : 'month_name',
								valueField : 'month_id',
								store : monthDS,
								editable : false,
								triggerAction : 'all',
								fieldLabel : '统计年份',
								name : 'month_id',
								emptyText : '无数据',
								id : 'monthSelector1',
								anchor : '91%',
								listeners : {
									select : function(combo,record,index){
										measure_id = '';
										m = record.get("month_id");
										indexDS.reload({params: {month_id : m,project_id : p}});
										projectID = '';
									}
								}
							}]
						},
						{
							columnWidth : .20,
							layout : 'form',
							labelWidth : 60,
							labelAlign : 'left',
							border : false,
							items : [{
								xtype : 'combo',
								mode : 'local',
								displayField : 'obj_name',
								valueField : 'obj_id',
								store : objDS,
								editable : false,
								triggerAction : 'all',
								fieldLabel : '统计维度',
								name : 'obj_id',
								emptyText:'请选择...',
								id : 'objSelector1',
								anchor : '91%',
								tpl:multstr('obj_id','obj_name'),
								triggerAction: 'all',
								ismult : true,
								onSelect : multselect,
								listeners : {
									select : function(combo,record,index){
										objID = '';
										projectID = '';
									}
								}
							}]
						},
						{
							columnWidth : .20,
							layout : 'form',
							labelWidth : 60,
							labelAlign : 'left',
							border : false,
							id : "objBox2",
							hidden : true,
							items : [{
								xtype : 'combo',
								mode : 'local',
								displayField : 'obj_name',
								valueField : 'obj_id',
								store : objDS,
								editable : false,
								triggerAction : 'all',
								fieldLabel : '统计维度',
								name : 'obj_id',
								emptyText:'无数据...',
								id : 'objSelector2',
								anchor : '91%',
								listeners : {
									select : function(combo,record,index){
										objID = '';
										projectID = '';
									}
								}
							}]
						},
						{
							columnWidth : .20,
							layout : 'form',
							labelWidth : 60,
							labelAlign : 'left',
							border : false,
							id : "monthBox2",
							hidden : true,
							items : [{
								xtype : 'combo',
								mode : 'local',
								displayField : 'month_name',
								valueField : 'month_id',
								store : monthDS,
								editable : false,
								triggerAction : 'all',
								fieldLabel : '统计年份',
								name : 'month_id',
								emptyText : '请选择...',
								id : 'monthSelector2',
								anchor : '91%',
								tpl:multstr('month_id','month_name'),
								triggerAction: 'all',
								ismult : true,
								onSelect : multselect,
								listeners : {
									select : function(combo,record,index){
										measure_id = '';
										m = record.get("month_id");
										indexDS.reload({params: {month_id : m,project_id : p}});
										projectID = '';
									}
								}
							}]
						}
					]
				},
				{
					xtype: 'container',
					layout:'column',
					anchor:'100%',
					align:'right',
					items:[
						{
							columnWidth : .55,
							anchor : '100%',
							html:'&nbsp;',
						},
						{
							id : 'dimSet',
							columnWidth : .25,
							labelWidth : 60,
//				xtype : 'fieldset',
//				title : '过滤条件(选填项:需要过滤数据时选择)',
							anchor : '100%',
							layout : 'form'
						},
						{
							columnWidth : .15,
							layout : 'form',
							labelWidth : 75,
							labelAlign : 'right',
							border : false,
							items : [{
								xtype : 'button',
								iconCls : 'search',
								width : 48,
								text : '查  询',
								handler : function() {
									toVar();
									queryResult();
								}
							},{
								xtype : 'panel',
								width : 20
							}]
						}
					]
				}
			]
		}, {
			region : 'center',
			layout : 'border',
			items : [{
				region : 'center',
				id : 'mainpanel',
				border : false,
				split : true,
				tbar : menu,
				contentEl : 'center',
				bbar : {
					xtype : 'mypaging',
					displayInfo : true,
					displayMsg : '第{0}-{1}条记录,共{2}条记录',
					emptyMsg : "没有记录",
					beforePageText : '第',
					afterPageText : '页，共{0}页',
					firstText : '第一页',
					prevText : '上一页',
					nextText : '下一页',
					lastText : '最后一页',
					refreshText : '刷新',
					hidden : true
				}
			}]
		}]
	});
	mask = new Ext.LoadMask(Ext.get('center'), {
		msg : "正在加载,请稍后......"
	});
	
	queryResult();
});

function publishResult() {
	if (monthID == '' || projectID == '' )
		return;
	
	var param = "?project_id=" + projectID + "&month_id=" + monthID+"&obj_cate_id="+objCateId;
	Ext.Ajax.request({
		url : pathUrl + '/bscresult_publishResult.action' + param,
		waitMsg : '正在处理,请稍候......',
		method : 'POST',
		timeout : 30000,
		callback : function(options, success, response) {
			var json = Ext.util.JSON.decode(response.responseText);
			Ext.MessageBox.alert("提示信息",json.info);
		},
		failure : function(response, options) {
			Ext.MessageBox.hide();
			Ext.MessageBox.alert(response.responseText);
		},
		success : function(response, options) {
			Ext.MessageBox.hide();
		}
	});
	
}

function queryResult() {
	if(projectID == '')
		return;
	if (monthID == ''){
		Ext.MessageBox.alert("提示信息","请选择统计年份");
		return;
	}


	var param = "?project_id=" + projectID + "&month_id=" + monthID
			+ "&cycle_type_id="+cycle_type_id
			+ "&obj_cate_id=" + objCateId + "&monthName=" + encodeURI(encodeURI(monthName))
			+ "&measure_id=" + measure_id
			+ "&show_id=" + showID
			+ "&obj_id=" + objID
			+ "&time_id=" + timID
			+ "&projectName=" + encodeURI(encodeURI(projectName));
	mask.show();
	path = pathUrl + '/bscresult_scoreDhtmlByCondExt.action' + param;
	Ext.Ajax.request({
		url : pathUrl + '/bscresult_scoreDhtmlCountByCondExt.action' + param,
		waitMsg : '正在处理,请稍候......',
		method : 'POST',
		timeout : 30000,
		callback : function(options, success, response) {
			var json = Ext.util.JSON.decode(response.responseText);
			if (json.success) {
				var infos = json.info.split(",");//用逗号隔开两个数据。第一个数据表示总数；第二个数据表示是否可以发布结果
				var totalCount = parseFloat(infos[0]);
				var canPublish = parseFloat(infos[1]);
					
				load(path);
				initBbar(parseInt(totalCount), path);
				showBbar(30);
			} else {
				Ext.MessageBox.alert(json.info);
			}
		},
		failure : function(response, options) {
			Ext.MessageBox.hide();
			Ext.MessageBox.alert(response.responseText);
		},
		success : function(response, options) {
	
			Ext.MessageBox.hide();
		}
	});

}


function load(path) {
	dhtmlGrid = new dhtmlXGridObject('center');
	dhtmlGrid.setImagePath(pathUrl + "/public/scripts/dhtmlx/imgs/");
	dhtmlGrid.setSkin("bsc");
	dhtmlGrid.init();
	dhtmlGrid.load(path, function() {
		mask.hide();
	});
	dhtmlGrid.enableRowsHover(true, "hover");
	mask.hide();
}

function toVar(){
	showID = Ext.getCmp("showSelector").getValue();
	measure_id=Ext.getCmp("index_type").getValue();
	monthID = Ext.getCmp("monthSelector1").getValue();
	projectID = Ext.getCmp("projectSelector").getValue();
//	measure_id=Ext.getCmp("indexSelector").getValue();
	monthName=Ext.get("monthSelector1").getValue();
	projectName=Ext.get("projectSelector").getValue();
//	indexName=Ext.get("indexSelector").getValue();
	cycle_type_id = projectStore.getById(projectID).get("cycle_type_id");
	objID = getMOCmpVal("objSelector");
	timID = Ext.getCmp("monthSelector2").code || '';
}
