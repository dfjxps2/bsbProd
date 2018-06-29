/**
 * 权重维护页面布局文件  
 */
var param_search='',object_id='',project_id='',object_search='',measure_search='';

var flag = true;

Ext.onReady(function(){
	//方案下拉框
	var project_store = new Ext.data.JsonStore({
		url : pathUrl + "/scoreWeight_queryProject.action",
		root : 'results',
		fields : ['project_id','project_name','icon'],
		autoLoad : true
	});
	project_store.on('load',function(){
		Ext.getCmp("project_code").setValue(project_store.getAt(0).get("project_id"));
		project_id = Ext.getCmp("project_code").getValue();
		
		//添加监听方法
		object_search = Ext.getCmp("specialKey").getValue();
		object_store.load({
			params : {
				project_id : project_id,
				object_search : object_search
			}
		});
	});
	
	var object_store = new Ext.data.JsonStore({
		url : pathUrl + "/scoreWeight_queryObject.action",
		root : 'results',
		totalProperty : 'totalCount',
		fields : ['object_id','object_name'],
		listeners : {
			load : function(){
				object_store.baseParams = {
					project_id : project_id,
					object_search : object_search
				}
			}
		}
	});
	
	var object_tbar = ['方案：',{
		xtype : 'iconcombo',
		store : project_store,
		id : 'project_code',
		name : 'project_id',
		width : 185,
		iconClsField : 'icon',
		hiddenName : 'project_id',
		valueField : 'project_id',
		displayField : 'project_name',
		triggerAction : 'all',
		model : 'local',
		listeners : {
					select : function(){
						project_id = Ext.getCmp("project_code").getValue();
						object_search = Ext.getCmp("specialKey").getValue();
						object_store.load({
							params : {
								project_id : project_id,
								object_search : object_search
							}
						});
						buildGrid();
					}
				}
	},'->','搜索：',{
		xtype : 'textfield',
		id : 'specialKey',
		emptyText : '请输入对象ID或名称...',
		width : 120,
		listeners : {
			specialKey : function(field , e){
				if(e.getKey() == Ext.EventObject.ENTER){
					project_id = Ext.getCmp("project_code").getValue();
					if(project_id == ''){
						Ext.Msg.alert("提示信息",'请先选择方案!');
						return false;
					}
					object_search = Ext.getCmp("specialKey").getValue();
					object_store.load({
						params : {
							project_id : project_id,
							object_search : object_search
						}
					});
				}
			}
		}
	},{
		xtype : 'button',
		iconCls : 'search',
		handler : function () {
				project_id = Ext.getCmp("project_code").getValue();
				if(project_id == ''){
					Ext.Msg.alert("提示信息",'请先选择方案!');
					return false;
				}
				object_search = Ext.getCmp("specialKey").getValue();
				object_store.load({
					params : {
						project_id : project_id,
						object_search : object_search
					}
				});
	}
	}];
	
	var object_cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(),{
		header : '考核对象ID',
		dataIndex : 'object_id'
	},{
		header : '考核对象名称',
		dataIndex : 'object_name'
	}]);
	
	var object_panel = new Ext.grid.GridPanel({
		region : 'center',
		title : '对象列表',
		id : 'object_panel',
		split : true,
		collapseMode : 'mini',
		sm : new Ext.grid.RowSelectionModel({
				singleSelect : true
		}),
		cm : object_cm,
		ds : object_store,
		loadMask : true,
		autoScroll : true,
		viewConfig : {
			forceFit : true
		},
		tbar : object_tbar,
		bbar : new Ext.PagingToolbar({
			pageSize : 30,
			displayInfo : true,
			store : object_store,
			displayMsg : '显示第{0}条到{1}条记录,一共{2}条',
			emptyMsg : '没有记录',
			firstText : '第一页',
			prevText : '上一页',
			nextText : '下一页',
			lastText : '最后一页',
			refreshText : '刷新'
		})
	});

	
	Ext.getCmp("object_panel").getSelectionModel().on('rowselect',
		function(mode,rowIndex,record){
			object_id = record.get('object_id');
			project_id = Ext.getCmp('project_code').getValue();
			param_search = encodeURI(encodeURI(Ext.getCmp('param_search').getValue()));
			queryParamResult();
		});

	var param_tbar = [{
		id : 'param_tbar',
		text : '保存(s)',
		tooltip : '保存修改结果', 
		iconCls : 'save',
		id : 'param_save',
		disabled : true,
		handler : function(){
			if(Ext.getCmp("object_panel").getSelectionModel().getSelections().length ==0){
				Ext.Msg.alert('提示','请选择对象后继续进行!');
				return false;
			}
			saveParamterValue();
		}
	},'->','搜索：',{
		xtype : 'textfield',
		id : 'param_search',
		emptyText : '请输入参数ID或名称...',
		listeners : {
			specialKey : function(field , e){
				if(e.getKey() == Ext.EventObject.ENTER){
					param_search = encodeURI(encodeURI(Ext.getCmp('param_search').getValue()));
					var object_record = Ext.getCmp('object_panel').getSelectionModel().getSelections()[0];
					if(object_record !=null && object_record != ''){
						object_id = object_record.get("object_id");
					}else{
							Ext.Msg.alert("提示信息",'请先选择对象!');
						return false;
					}
					
					//重新加载param_grid
					queryParamResult();
				}
			}
		}
	},{
		xtype : 'button',
		iconCls : 'search',
		handler : function () {
			param_search = encodeURI(encodeURI(Ext.getCmp('param_search').getValue()));
			project_id = Ext.getCmp('project_code').getValue();
			var object_record = Ext.getCmp('object_panel').getSelectionModel().getSelections()[0];
			if(object_record !=null && object_record != ''){
				object_id = object_record.get("object_id");
			}else{
				Ext.Msg.alert("提示信息",'请先选择对象!');
				return false;
			}
			
			//重新加载param_grid
			queryParamResult();
		}
	},{//加此按钮是为了解决Ext.tabPanel初始化不显示数据问题
		xtype : 'button',
		iconCls : 'search',
		id : 'p_button',
		hidden : true,
		handler : function () {
			param_search = encodeURI(encodeURI(Ext.getCmp('param_search').getValue()));
			project_id = Ext.getCmp('project_code').getValue();
			var object_record = Ext.getCmp('object_panel').getSelectionModel().getSelections()[0];
			if(object_record !=null && object_record != ''){
				object_id = object_record.get("object_id");
			}else{
				if(flag != false)
				Ext.Msg.alert("提示信息",'请先选择对象!');
				return false;
			}
			
			//重新加载param_grid
			queryParamResult();
		}
	}];
	
	var westPanel = new Ext.Panel({
		region : 'west',
		width:430,
		layout : 'border',
		border : false,
		split : true,
		items : [object_panel]
	});
	
	var viewport = new Ext.Viewport({
		layout : 'border',
		split : false,
		frame : false,
		items : [westPanel,mainPanel = new Ext.TabPanel({
			region : 'center',
			frame :false,
			split : true,
			animate : true,
			activeTab: 0,
			listeners : {
				tabchange : function(tab,panel){
					if(!flag){
						document.getElementById("p_button").fireEvent("onclick");
						flag = true;
					}
				}
			},
			border : false,
			items : [{
				title : '<span><b>参数列表</b></span>',
				collapsible : false,
				contentEl : 'param_grid',
				frame : false,
				split : true,
				id : 'param_panel',
				autoScroll : true,
				tbar : param_tbar
			}]
		})]
	});
	queryParamResult();
	flag = false;
});

function queryParamResult(){
	param_filePath = pathUrl + "/scoreWeight_queryParam.action?object_id="+object_id
							   + "&project_id="+project_id+ "&param_search="+param_search;
	mask.show();
	param_grid = new dhtmlXGridObject('param_grid');
	param_grid.setImagePath(pathUrl + "/public/scripts/dhtmlx/imgs/");
	

	param_grid.init();
	param_grid.setSkin("bsc");
	param_grid.enableEditEvents(true, false, false); //设置单击编辑
	param_grid.enableEditTabOnly(true);
	param_grid.enableRowsHover(true, "hover");
	
	param_grid.attachEvent("onEditCell",doOnParamCellEdit);
	
	param_grid.load(param_filePath, function() {
		mask.hide();
		var xml = param_grid.serialize();
		
		if (xml.length <= 34) {
			
			return;
		}
	});
};

function doOnParamCellEdit(stage, rId, cInd, nValue, oValue) {
	if (stage == 0) {//修改前

	} else if (stage == 1) {//修改中

	} else if (stage == 2) {//修改后
		if (isNaN(nValue) || nValue == "")
			return false;

		param_grid.cells(rId, cInd).setValue(formate(nValue));
		if (nValue != oValue) {
			Ext.getCmp('param_save').setDisabled(false);
		}
		return true;

	}
}
