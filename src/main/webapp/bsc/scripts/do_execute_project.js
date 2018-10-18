/**
 * 执行方案
 * @param {} projectID
 * @param {} roleID
 * @param {} monthID
 */
function doExecuteProject(cycleTypeId) {
	/**
	 * 月份Store
	 */
	var cycleDS = new Ext.data.JsonStore({
		url : pathUrl + '/selector_listMonth.action',
		root : 'results',
		totalProperty : 'totalCount',
		fields : ['cycle_id', 'cycle_name']
	});
	cycleDS.on("load", function() {
		if (cycleDS.getCount() > 0) {
			var val = cycleDS.getAt(0).get('cycle_id');
			Ext.getCmp("cycleSelector").setValue(val);
		}
	});
	cycleDS.load({params:{cycle_type : cycleTypeId,projectId:projectId}});
	var cwin = new Ext.Window({
		title : '方案执行',
		width : 400,
		height : 320,
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
				displayField : 'cycle_name',
				valueField : 'cycle_id',
				store : cycleDS,
				editable : false,
				triggerAction : 'all',
				fieldLabel : '周期',
				name : 'cycle_id',
				id : 'cycleSelector',
				anchor : '91%'
			}],
			buttons : [{
				text : '执行',
				id : 'start',
				handler : function() {
					monthID = Ext.getCmp("cycleSelector").getValue();
					
					if(monthID == '') {
						Ext.Msg.alert('提示信息',"请选择考核周期");
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
			height : 160,
			layout : 'form',
			items : [progressBar = new Ext.ProgressBar({
				id : 'progressBar',
				text : ''
			}),{
				split : false,
				border : false,
				anchor : '100%',
				bodyStyle : 'padding : 8px 0px 0px 0px',
				layout : 'fit',
				items : [fieldSet = new Ext.Panel({
					id : 'logPanel',
//					title : '执行详细信息',
					height : '100%',
					autoScorll : true,
					html : ''
				})]
			}]
		})]
	});

	cwin.show();
}

/**
 * 解析执行日志信息
 * @param {} obj
 */
function getLogInfo(obj) {
	var html = '';
	for (var i = 0; i < obj.length; i++) {
		html += obj[i]+'<br/>'
	}
	$("#logPanel").html(html);
}