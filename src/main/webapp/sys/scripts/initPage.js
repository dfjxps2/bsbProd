var resCode = "";
var resName = "";
var dhtmlXml = "";
	var resTreePanel = new Ext.Panel({
		id : 'card-1',
		region : 'center',
		split : true,
		title : '可选功能页面',
		autoScroll :true,
		layout : 'fit',
		items : [{
			xtype : 'panel',
			autoScroll :true,
			contentEl : 'res_tree',
			border : true,
			split : false
		}]
	});

	var infoFormPanel  = new Ext.form.FormPanel({
		id:'currentPage',
		region:'north',
		split : true,
		height : 80,
		title : '用户初始页',
		frame : true,
		labelWidth : 85,
		bodyStyle : 'padding:10px 10px 0px 10px',
		layout : 'form',
		items : [{
			xtype : 'textfield',
			id : 'pageInfo',
			fieldLabel : '用户初始页',
			value : '',
			readOnly : true,
			anchor : '91%'
		}]
	});


var addWindow = new Ext.Window({
		width : 640,
		height : 500,
		layout : 'border',
		title : '设置初始页',
		modal : true,
		buttonAlign : 'center',
		listeners : {
			beforeclose : function(){
				addWindow.hide();
				return false;
			}
		},
		items : [infoFormPanel,resTreePanel],
		buttons : [{
			text : '保存',
			handler : function() {
				if(resCode == ''){
					Ext.MessageBox.alert("提示信息","请选择初始页!");
					return ;
				}
	 			Ext.Ajax.request({
					url : pathUrl + '/init_updateUserDefaultInitPage.action?default_page='+resCode,
					waitMsg : '正在处理,请稍候......',
					method : 'POST',
					timeout : 30000,
					failure : function(response, options) {
						Ext.MessageBox.alert("提示信息","保存失败!");
					},
					success : function(response, options) {
						addWindow.hide();
						window.frames[1].location = pathUrl + '/bsc/init_defaultPage.action';
					}
				});
			}
		}, {
			text : '取消',
			handler : function() {
				addWindow.hide();
			}
		}]
	});
	
	
	
$(function(){
	Ext.Ajax.request({
		url : pathUrl + '/init_getResourceTree.action',
		method : 'POST',
		timeout : 30000,
		callback : function(options, success, response) {
			var json = Ext.util.JSON.decode(response.responseText);
			if (json.success) {
				tree=new dhtmlXTreeObject("res_tree","100%","100%","");
				tree.setImagePath(pathUrl + "/public/scripts/dhtmlx/imgs/");
				tree.enableCheckBoxes(1);
				tree.attachEvent("onCheck",function(){
					var allCheckedId = tree.getAllChecked();
					if(allCheckedId.split(",").length > 1) {
						tree.setCheck(resCode,0);
						resCode = tree.getAllChecked();
					}else{
						resCode = allCheckedId;
					}
					Ext.getCmp("pageInfo").setValue(tree.getItemText(resCode));
				});
				tree.loadXMLString(json.info);
				
				if(tree.getAllItemsWithKids() != ''){
					var ids = tree.getAllItemsWithKids().split(",");
					for(var i=0;i<ids.length; i++){
						tree.disableCheckbox(ids[i],true);
					}
				}
			} else {
				Ext.MessageBox.alert('提示信息', "加载用户菜单树失败!");
			}
		}
	});
});


var setInitPage = function(){
	resCode = tree.findItemIdByLabel(resName,0,top);
	var allCheckedIds = tree.getAllChecked().split(",");
	for(var i=0;i<allCheckedIds.length;i++){
		tree.setCheck(allCheckedIds[i],0);
	}
	tree.setCheck(resCode,true);
	
	Ext.getCmp("pageInfo").setValue(resName);
	$("#res_tree").show();
	addWindow.show();
}

var changeOrgDS = new Ext.data.JsonStore({
	url : pathUrl + '/login_listChangeOrg.action',
	root : 'results',
	totalProperty : 'totalCount',
	fields : ['bank_org_id', 'bank_org_name'],
	autoLoad : false
});
changeOrgDS.on("load",function(){
	if(changeOrgDS.getCount() > 0) {
		for (var i = 0; i < changeOrgDS.getCount(); i++) {
			var record = changeOrgDS.getAt(i);
			if(record.get('bank_org_id') == currentBankOrgID)
				Ext.getCmp("changeOrgGrid").getSelectionModel().selectRow(i,false);
		}
	}	
});

var rs = new Ext.grid.CheckboxSelectionModel({
	singleSelect : true
	//handleMouseDown : Ext.emptyFn()
})
var changrOrgHeader = [new Ext.grid.RowNumberer(),rs, {
	header : '机构ID',
	dataIndex : 'bank_org_id'
}, {
	header : '机构名称',
	dataIndex : 'bank_org_name'
}];

function doSwitchOrg() {
	var changeOrgWindow = new Ext.Window({
		title : '切换权限机构',
		width : 400,
		height : 300,
		modal : true,
		border : false,
		buttonAlign : 'center',
		id : 'changeOrgWindow',
		listeners : {
			close : function(){
				Ext.getCmp("changeOrgWindow").destroy();			
			}
		},
		layout : 'fit',
		items : [{
			xtype : 'grid',
			id : 'changeOrgGrid',
			columns : changrOrgHeader,
			store : changeOrgDS,
			loadMask : true,
			split : true,
			sm : rs,
			flex : 1,
			viewConfig : {
				forceFit : true
			}
		}],
		buttons : [{
				text : '确定',
				id : 'save_link',
				handler : function() {
					var grid = Ext.getCmp("changeOrgGrid");
					var sm = grid.getSelectionModel();
					if(sm.getSelections().length < 1) {
						Ext.Msg.alert("提示信息","请选择需要切换到的机构");
						return;
					}
					
					var record = sm.getSelections()[0];
					document.switchOrgForm.special_org_id.value = record.get('bank_org_id');
					Ext.getCmp("changeOrgWindow").destroy();
					document.switchOrgForm.submit();
				}
			}, {
				text : '取消',
				handler : function() {
					Ext.getCmp("changeOrgWindow").destroy();
				}
			}]
	});
	changeOrgWindow.show();
	changeOrgDS.load();
}
