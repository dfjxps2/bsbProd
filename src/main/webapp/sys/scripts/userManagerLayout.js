Ext.onReady(function() {
	var topmenu = [{
		text : "添加(a)",
		tooltip : "添加系统用户",
		iconCls : 'add',
		handler : function() {
			addUser(store);
		}
	}, '-', {
		text : "编辑(e)",
		tooltip : "编辑用户",
		iconCls : 'edit',
		handler : function() {
			var g = Ext.getCmp("gridPanel");
			if (g.getSelectionModel().getSelections().length == 0) {
				Ext.MessageBox.alert("提示信息", "请选择要编辑的记录");
				return;
			}
			var ownerOrgId = g.getSelectionModel().getSelections()[0].get("owner_org_id");
			var bankOrgId = g.getSelectionModel().getSelections()[0].get("bank_org_id");
			var userId = g.getSelectionModel().getSelections()[0].get("user_id");
			modifyUser(ownerOrgId, bankOrgId, userId, store);
		}
	}, '-', {
		text : "删除(d)",
		tooltip : "删除用户",
		iconCls : 'delete',
		handler : function() {
			var g = Ext.getCmp("gridPanel");
			if (g.getSelectionModel().getSelections().length == 0) {
				Ext.MessageBox.alert("提示信息", "请选择要删除的记录");
				return;
			}
			Ext.MessageBox.confirm("确认信息", "是否删除该用户及其权限?", function(btn) {
				if (btn == 'yes')
					deleteUser(g.getSelectionModel().getSelections()[0].get("user_id"), store)
			});
		}
	}, '-', {
		text : "分配角色(g)",
		tooltip : "为用户分配角色",
		iconCls : 'dispatch',
		handler : function() {
			addUserRole();
		}
	},'-',{
		text : "特殊授权(g)",
		tooltip : "为用户指定特殊权限",
		iconCls : 'spec_auth',
		handler : function() {
			speciallyAuthorize();//特殊授权
		}
	}];

	var store = new Ext.data.JsonStore({
		url : pathUrl + '/sys/user_list.action',
		root : 'results',
		totalProperty : 'totalCount',
		fields : ['user_id', 'user_name', 'bank_org_id', 'bank_org_name', 'owner_org_id', 'owner_org_name']
	});

	store.on("beforeload", function() {
		var bankOrgID = Ext.getCmp("bankWholeSelector").getValue();
		var userID = Ext.getCmp("user_id").getValue();
		var userName = Ext.getCmp("user_name").getValue();
		store.baseParams = {
			bankOrgID : bankOrgID,
			user_id : userID,
			user_name : userName
		}
	});

	//批量同步
    function synchronizedUser(stat) {
        if (stat == 'one' ){
            var userID = Ext.getCmp("user_id").getValue();
            if(userID ==null || userID =='' ||userID.length == 0){
				Ext.MessageBox.alert("提示信息", "请输入要同步用户ID");
				return;
			}
		}

        var param = "?property="+stat+"&userID=" + userID ;
        Ext.Ajax.request({
            url : pathUrl + '/sys/user_synchronizedUserData.action' + param,
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
                store.load({
                    params : {
                        start : 0,
                        limit : 30
                    }
                });
            }
        });

    }

	var viewport = new Ext.Viewport({
		layout : 'fit',
		items : [{
			xtype : 'panel',
			layout : 'border',
			border : false,
			items : [{
				xtype : 'form',
				height : 70,
				style : 'padding:4px 4px 4px 2px;',
				frame : true,
				layout : 'column',
				title : '查询条件',
				region : 'north',
				items : [{
					columnWidth : 0.25,
					layout : 'form',
					labelWidth : 60,
					border : false,
					items : [bankWholeSelector = new BankWholeSelector()]
				}, {
					columnWidth : 0.25,
					labelWidth : 60,
					layout : 'form',
					border : false,
					items : [{
						xtype : 'textfield',
						name : 'user_id',
						id : 'user_id',
						fieldLabel : '用户ID',
						emptyText : '请输入用户ID...',
						anchor : '91%'
					}]
				}, {
					columnWidth : 0.25,
					labelWidth : 60,
					layout : 'form',
					border : false,
					items : [{
						xtype : 'textfield',
						name : 'user_name',
						id : 'user_name',
						fieldLabel : '用户名',
						emptyText : '请输入用户名...',
						anchor : '91%'
					}]
				}, {
					columnWidth : 0.06,
					xtype : 'button',
					height : 23,
					text : '查询',
					handler : function() {
						store.load({
							params : {
								start : 0,
								limit : 30
							}
						});
					}
				},
				{
					columnWidth : 0.06,
					xtype : 'button',
					height : 23,
					text : '批量同步用户',
					handler : function() {
                        //synchronizedUser('batch');
                        syncUser(store);
					}
				},
				{
					columnWidth : 0.06,
					xtype : 'button',
					height : 23,
					text : '同步单个用户',
					handler : function() {
                        synchronizedUser('one')
					}
				}
				]
			}, {
				xtype : 'grid',
				id : 'gridPanel',
				title : '用户列表',
				region : 'center',
				style : 'padding:0px 4px 4px 4px;',
				border : false,
				sm : new Ext.grid.RowSelectionModel({
					singleSelect : true
				}),
				tbar : topmenu,
				cm : new Ext.grid.ColumnModel([{
					xtype : 'gridcolumn',
					dataIndex : 'user_id',
					align : 'center',
					header : '用户ID',
					sortable : true
				}, {
					xtype : 'gridcolumn',
					dataIndex : 'user_name',
					align : 'center',
					header : '用户名'
				}, {
					xtype : 'gridcolumn',
					dataIndex : 'bank_org_name',
					align : 'center',
					header : '权限机构'
				}, {
					xtype : 'gridcolumn',
					dataIndex : 'bank_org_id',
					align : 'center',
					hidden : true,
					header : '权限机构'
				}, {
					xtype : 'gridcolumn',
					dataIndex : 'owner_org_name',
					align : 'center',
					header : '归属机构'
				}, {
					xtype : 'gridcolumn',
					dataIndex : 'owner_org_id',
					hidden : true,
					header : '归属机构'
				}]),
				autoScroll : true,
				split : true,
				frame : false,
				ds : store,
				loadMask : true,
				viewConfig : {
					forceFit : true
				},
				bbar : new Ext.PagingToolbar({
					pageSize : 30,
					store : store,
					displayInfo : true,
					displayMsg : '第{0}-{1}条记录,共{2}条记录',
					emptyMsg : "没有记录"
				})
			}]
		}]
	})

	bankWholeSelector.initUI();
	Ext.getCmp("gridPanel").on("dblclick", function() {
		var g = Ext.getCmp("gridPanel");
		var ownerOrgId = g.getSelectionModel().getSelections()[0].get("owner_org_id");
		var bankOrgId = g.getSelectionModel().getSelections()[0].get("bank_org_id");
		var userId = g.getSelectionModel().getSelections()[0].get("user_id");
		modifyUser(ownerOrgId, bankOrgId, userId, store);
	});
});

