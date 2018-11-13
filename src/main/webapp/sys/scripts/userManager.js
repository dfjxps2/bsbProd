
var is_expand = false;
var dhtml = '';
var special_user_id = '';
var special_user_name = '';

function addUser(store){
	if(addWindow != null || editWindow != null)
		return;
	addWindow = new Ext.Window({
		layout: 'fit',
		title: '添加用户',
		width: 640,
		height: 310,
		border: false,
		modal : true,
		buttonAlign: 'center',
		items: [{
		    xtype: 'form',
		    frame: true,
		    bodyStyle: 'padding:5px',
		    border: false,
		    method: 'POST',
		    url: pathUrl + '/user_add.action',
		    id: 'addFormPanel',
		    layout: 'column',
		    items: [{
		            xtype: 'panel',
		            border: false,
		            layout: 'form',
		            labelWidth: 70,
		            labelAlign: 'left',
		            columnWidth: 0.5,
		            items: [{
		                    xtype: 'textfield',
		                    name: 'user_id',
		                    id : 'add_user_id',
		                    fieldLabel: '用户ID<span style="color:red;font-weight:bold" data-qtip="Required">*</span>',
		                    allowBlank: false,
		                    anchor: '91%'
		                },{
		                   	xtype: 'textfield',
		                    name: 'user_name',
		                    id : 'add_user_name',
		                    fieldLabel: '用户名<span style="color:red;font-weight:bold" data-qtip="Required">*</span>',
		                    allowBlank: false,
		                    anchor: '91%'
	                	},ownerOrgSelector = new OwnerOrgSelector(''), 
	                	  busiLineSelector = new BusiLineSelector({fieldLabel:'归属条线<span style="color:red;font-weight:bold" data-qtip="Required">*</span>'}),
	                	{
		                    xtype : 'combo',
							store : new Ext.data.SimpleStore({
		                    	fields : ["retrunValue", "displayText"],
		                    	data : [['2','男'],['1','女'],['0','不明']]
		                    }),
		                    valueField : "retrunValue",
							displayField : "displayText",
		                    mode : 'local',
		                    editable : false,
		                    forceSelection : true,
		                    hiddenName : 'gender_code',
							triggerAction : 'all',
							allowBlank : false,
							fieldLabel : '性别<span style="color:red;font-weight:bold" data-qtip="Required">*</span>',
		                    name: 'gender_code',
		                    id : 'add_gender_code',
							anchor : '91%'
	                	},{
		                    xtype: 'textfield',
		                    name: 'user_mobile',
		                    id : 'add_user_mobile',
		                    fieldLabel: '手机',
		                    regex : /^(\d{11})$|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$/,
		                    regexText :'匹配格式:11位手机号码 ,(3-4位区号)-(7-8位直播号码)-(1-4位分机号),7-8位直播号码',
		                    anchor: '91%'
	                	},{
		                    xtype: 'textfield',
		                    name: 'user_post',
		                    id : 'add_user_post',
		                    regex : /^[1-9]{1}(\d{5})$/,
		                    regexText :'邮编格式不正确',
		                    fieldLabel: '邮编',
		                    anchor: '91%'
	                	},{
	                		xtype: 'datefield',
		                    name: 'begin_date',
		                    format: 'Y-m-d',
		                    id : 'add_begin_date',
		                    fieldLabel: '开始时间',
		                    anchor: '91%'
		             	}]
		        },{
		            xtype: 'panel',
		            border: false,
		            layout: 'form',
		            labelWidth: 70,
		            labelAlign: 'left',
		            columnWidth: 0.5,
		            items: [{
		                    xtype: 'textfield',
		                    inputType: 'password',
		                    name: 'password',
		                    id : 'add_password',
		                    fieldLabel: '密码<span style="color:red;font-weight:bold" data-qtip="Required">*</span>',
		                    allowBlank: false,
		                    anchor: '91%'
		                },{
		                    xtype: 'textfield',
		                    name: 'cert_id',
		                    id : 'add_cert_id',
		                    fieldLabel: '身份证号<span style="color:red;font-weight:bold" data-qtip="Required">*</span>',
		                    regex : /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
		                    regexText :'身份证号格式不正确,请检查',
		                    allowBlank: false,
		                    anchor: '91%'
	                	},manageOrgSelector = new ManageOrgSelector('')
	                	,jobTypeCodeSelector = new JobTypeCodeSelector({fieldLabel:'职位类型<span style="color:red;font-weight:bold" data-qtip="Required">*</span>'}),
	                	 statusSelector = new StatusSelector(),
	                	{
		                    xtype: 'textfield',
		                    name: 'user_address',
		                    id : 'add_user_address',
		                    fieldLabel: '地址',
		                    anchor: '91%'
	                	},
	                	{
		                    xtype: 'textfield',
		                    name: 'user_email',
		                    id : 'add_user_email',
		                    regex : /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
		                    regexText :'Email格式不正确,请检查',
		                    fieldLabel: 'Email',
		                    anchor: '91%'
	                	},
	                	{
		                    xtype: 'datefield',
		                    name: 'end_date',
		                    id : 'add_end_date',
		                    format: 'Y-m-d',
		                    fieldLabel: '结束时间',
		                    anchor: '91%'
                	}]
	        }]
		}],
		buttons: [{
			text: '添加',
			handler: function(){
				var formPanel = Ext.getCmp("addFormPanel");
				if(formPanel.form.isValid()){
					formPanel.form.submit({      
			            waitMsg:'正在处理,请稍候......',         
			            timeout:30000,
			            failure: function(form, action) {
						    Ext.MessageBox.alert('错误', action.result.info);
						},
						success: function(form, action) {
						    addWindow.destroy();
							addWindow = null;
							store.reload();
						}
			        });					
				}else{
					Ext.Msg.alert("提示信息","请输入必填项");
				}
			}
		},{
			text: '取消',
			handler: function(){
				addWindow.destroy();
				addWindow = null;
			}
		}]
	});
	addWindow.on("close",function(){
		addWindow.destroy();
		addWindow = null;
	});
	addWindow.show();
	ownerOrgSelector.initUI();
	manageOrgSelector.initUI();	
}



/**
 * 同步用户
 */
function syncUser(store) {
    var syncUserPanel = new Ext.FormPanel({
        frame: true,
        url: pathUrl + '/sys/user_synchronizedUserData.action?property=batch',
        layout: 'form',
        border: false,
        split: false,
        labelAlign: 'left',
        bodyStyle: 'padding: 5px',
        labelWidth: 80,
        items: [{
            xtype: 'datefield',
            name: 'startDt',
            format: 'Y-m-d',
            id: 'startDt',
            fieldLabel: '开始时间',
            anchor: '91%'
        }, {
            xtype: 'datefield',
            name: 'endDt',
            id: 'endDt',
            format: 'Y-m-d',
            fieldLabel: '结束时间',
            anchor: '91%'
        }]
    });

    var syncUserWindow = new Ext.Window({
        title: '用户批量同步',
        width: 300,
        height: 180,
        id: 'syncUserWindow',
        layout: 'fit',
        modal: true,
        borer: false,
        listeners: {
            close: function () {
                Ext.getCmp("syncUserWindow").destroy();
            }
        },
        buttonAlign: 'center',
        items: [syncUserPanel],
        buttons: [{
            text: '确定',
            id: 'syncUser',
            handler: function () {
                if (syncUserPanel.form.isValid()) {
                    var st = Ext.getCmp("startDt").value;
                    var et = Ext.getCmp("endDt").value;
                    syncUserPanel.form.submit({
                        params : {
                            startDt : st,
                            endDt : et,
                        },
                        waitMsg: '正在处理,请稍后......',
                        success: function (form, action) {
                            if (action.result.success) {
                                Ext.getCmp("syncUserWindow").destroy();
                                store.reload();
                                Ext.Msg.alert("提示信息", action.result.info);
                            }
                        },
                        failure: function (form, action) {
                            Ext.Msg.alert("提示信息", action.result.info);
                        }
                    });
                } else {
                    Ext.Msg.alert('提示信息', '请输入完整信息');
                }
            }
        }, {
            text: '取消',
            handler: function () {
                Ext.getCmp("syncUserWindow").destroy();
            }
        }]
    });

    syncUserWindow.show();
}


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



function modifyUser(ownerOrgId, bankOrgId, userId, store){
	var oldParam = "?oldOwerOrgId="+ownerOrgId+"&oldBankOrgId="+bankOrgId;
	if(addWindow != null || editWindow != null)
		return;
	editWindow = new Ext.Window({
		layout: 'fit',
		title: '编辑用户',
		width: 640,
		height: 310,
		border: false,
		modal : true,
		buttonAlign: 'center',
		items: [{
		    xtype: 'form',
		    frame: true,
		    bodyStyle: 'padding:5px',
		    border: false,
		    method: 'POST',
		    url: pathUrl + '/user_edit.action'+oldParam,
		    id: 'editFormPanel',
		    reader: new Ext.data.JsonReader({
					root: 'results'
				}, [
					{name: 'user_id'},
					{name: 'password'},
					{name: 'user_name'},
					{name: 'bank_org_id'},
					{name: 'owner_org_id'},
					{name: 'cert_id'},
					{name: 'gender_code'},
					{name: 'user_mobile'},
					{name: 'user_email'},
					{name: 'user_address'},
					{name: 'user_post'},
					{name: 'user_status'},
					{name: 'begin_date'},
					{name: 'end_date'},
					{name: 'busiLineId',mapping : 'busi_line_id'},
					{name: 'jobTypeId',mapping : 'job_type_id'}
				]
	        ),
		    layout: 'column',
		    items: [{
		            xtype: 'panel',
		            border: false,
		            layout: 'form',
		            labelWidth: 70,
		            labelAlign: 'left',
		            columnWidth: 0.5,
		            items: [{
		                    xtype: 'textfield',
		                    name: 'user_id',
		                    id : 'edit_user_id',
		                    fieldLabel: '用户ID<span style="color:red;font-weight:bold" data-qtip="Required">*</span>',
		                    allowBlank: false,
		                    readOnly: true,
		                    anchor: '91%'
		                },{
		                   	xtype: 'textfield',
		                    name: 'user_name',
		                    id : 'edit_user_name',
		                    fieldLabel: '用户名<span style="color:red;font-weight:bold" data-qtip="Required">*</span>',
		                    allowBlank: false,
		                    anchor: '91%'
	                	},ownerOrgSelector = new OwnerOrgSelector(ownerOrgId),
	                	 busiLineSelector = new BusiLineSelector({fieldLabel:'归属条线<span style="color:red;font-weight:bold" data-qtip="Required">*</span>'}),
	                	 {
		                    xtype : 'combo',
							store : new Ext.data.SimpleStore({
		                    	fields : ["retrunValue", "displayText"],
		                    	data : [['1','女'],['2','男'],['0','其他']]
		                    }),
		                    valueField : "retrunValue",
							displayField : "displayText",
		                    mode : 'local',
		                    editable : false,
		                    forceSelection : true,
		                    hiddenName : 'gender_code',
							triggerAction : 'all',
							allowBlank : false,
							fieldLabel : '性别<span style="color:red;font-weight:bold" data-qtip="Required">*</span>',
		                    name: 'gender_code',
		                    id : 'add_gender_code',
							anchor : '91%'
	                	},{
		                    xtype: 'textfield',
		                    name: 'user_mobile',
		                    id : 'edit_user_mobile',
		                    fieldLabel: '手机',
		                    regex : /^(\d{11})$|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$/,
		                    regexText :'匹配格式:11位手机号码 ,(3-4位区号)-(7-8位直播号码)-(1-4位分机号),7-8位直播号码',
		                    anchor: '91%'
	                	},{
		                    xtype: 'textfield',
		                    name: 'user_post',
		                    id : 'edit_user_post',
		                    fieldLabel: '邮编',
		                    regex : /^[1-9]{1}(\d{5})$/,
		                    regexText :'邮编格式不正确',
		                    anchor: '91%'
	                	},{
	                		xtype: 'datefield',
		                    name: 'begin_date',
		                    format: 'Y-m-d',
		                    id : 'begin_date',
		                    fieldLabel: '开始时间',
		                    anchor: '91%'
		             	}]
		        },{
		            xtype: 'panel',
		            border: false,
		            layout: 'form',
		            labelWidth: 70,
		            labelAlign: 'left',
		            columnWidth: 0.5,
		            items: [{
		                    xtype: 'textfield',
		                    inputType: 'password',
		                    name: 'password',
		                    id : 'edit_password',
		                    fieldLabel: '密码<span style="color:red;font-weight:bold" data-qtip="Required">*</span>',
		                    allowBlank: false,
		                    anchor: '91%'
		                },{
		                    xtype: 'textfield',
		                    name: 'cert_id',
		                    id : 'edit_cert_id',
		                    fieldLabel: '身份证号<span style="color:red;font-weight:bold" data-qtip="Required">*</span>',
		                    regex : /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
		                    regexText :'身份证号格式不正确,请检查',
		                    allowBlank: false,
		                    anchor: '91%'
	                	},manageOrgSelector = new ManageOrgSelector(bankOrgId),
	                	  jobTypeCodeSelector = new JobTypeCodeSelector({fieldLabel:'职位类型<span style="color:red;font-weight:bold" data-qtip="Required">*</span>'}),
	                	  statusSelector = new StatusSelector(),
	                	{
		                    xtype: 'textfield',
		                    name: 'user_address',
		                    id : 'edit_user_address',
		                    fieldLabel: '地址',
		                    anchor: '91%'
	                	},
	                	{
		                    xtype: 'textfield',
		                    name: 'user_email',
		                    id : 'edit_user_email',
		                    fieldLabel: 'Email',
		                    regex : /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
		                    regexText :'Email格式不正确,请检查',
		                    anchor: '91%'
	                	},
	                	{
		                    xtype: 'datefield',
		                    name: 'end_date',
		                    id : 'end_date',
		                    format: 'Y-m-d',
		                    fieldLabel: '结束时间',
		                    anchor: '91%'
                	}]
	        }]
		}],
		buttons: [{
			text: '确定',
			handler: function(){
				var formPanel = Ext.getCmp("editFormPanel");
				if(formPanel.form.isValid()){
					formPanel.form.submit({      
			            waitMsg:'正在处理,请稍候......',         
			            timeout:30000,
			            failure: function(form, action) {
						    Ext.MessageBox.alert('错误', action.result.info);
						},
						success: function(form, action) {
						    editWindow.destroy();
							editWindow = null;
							store.reload();
						}
			        });					
				}else{
					Ext.Msg.alert("提示信息","请输入必填项");
				}
			}
		},{
			text: '取消',
			handler: function(){
				editWindow.destroy();
				editWindow = null;
			}
		}]
	});
	var p = Ext.getCmp("editFormPanel");
	p.form.load({url: pathUrl + '/user_get.action',params:{user_id:userId}});
	editWindow.on("close",function(){
		editWindow.destroy();
		editWindow = null;
	});
	editWindow.show();
	ownerOrgSelector.initUI();
	manageOrgSelector.initUI();	
}

function deleteUser(userID,store){
	if(editWindow != null || addWindow != null)
		return;
	Ext.Ajax.request({
		url: pathUrl + '/user_delete.action',
		params: {user_id:userID},
		method: 'POST',
		callback: function (options, success, response) {
			var json=Ext.util.JSON.decode(response.responseText);
			if (json.success) {
				store.reload();
			} else {
				Ext.MessageBox.alert('错误',json.info);
			}
		}
	});
		
}

var rolesSelectionModel = new Ext.grid.CheckboxSelectionModel({
	handleMouseDown : Ext.emptyFn,
	renderer:function(v,c,r){
        if(r.get("bank_org_id") != bank_org_id){
            return " ";//不显示checkbox
        }else{
           return  '<div class="x-grid3-row-checker"></div>';//显示checkbox
        }
    }
});
	
var roleInfo_ds=new Ext.data.JsonStore({
			url : pathUrl + '/user_getRole.action',
			root : 'results',
			fields : ['role_id','role_name','bank_org_id','bank_org_name', 'checked']
		});
var roleInfo_cm=[rolesSelectionModel,
    {header:'角色ID',dataIndex:'role_id',hidden:true},
    {header:'角色名称',dataIndex:'role_name'},
    {header:'权限机构',dataIndex:'bank_org_name'}
];

var user_id;
var user_name;
function addUserRole(){
	var record=Ext.getCmp("gridPanel").getSelectionModel().getSelected();
	if(record==null){
			Ext.MessageBox.alert('提示信息', '请选择一个用户！');
			return ;
	}
	user_id=record.get('user_id');
	user_name=record.get('user_name');
	var rolewin=new UserRolesWindowUI();
	rolewin.setTitle('用户角色分配—正在为 <span style="color:red;"> '+user_name+' </span>分配角色');
	rolewin.on('close',function(){rolewin.destroy();});
	rolewin.show();
	roleInfo_ds.load({
		params : {
            user_id:user_id,
            bank_id : bank_org_id
		},
		callback : function(r,options,success){
			if(success){
				doSelect(r);
			}
		}
	});
}

//选中已经分配的角色
function doSelect(records) {
		for (var i = 0; i < records.length; i++) {
			if(records[i].get('checked') == '1'){
				var index =roleInfo_ds.indexOf(records[i]); 
				Ext.getCmp('selectGridPanel').getSelectionModel().selectRow(index,true);
			}
		}
}

UserRolesWindowUI = Ext.extend(Ext.Window, {
    height: 380,
    width: 400,
    id:'userRolesWin',
    title: '用户角色分配',
    buttonAlign:'center',
    modal : true,
    initComponent: function() {
        Ext.applyIf(this, {
            items: [
                {
                    xtype: 'grid',
                    height: 367,
                    viewConfig : {
                         forceFit : true
                    },
                    id:'selectGridPanel',
                    sm:rolesSelectionModel,
                    columns:roleInfo_cm,
                    store:roleInfo_ds
                }
            ],
            buttons: [{
			text: '保存',
			handler: function(){
				var selections=Ext.getCmp('selectGridPanel').getSelectionModel().getSelections();
				var roleIds='';
				for(var i=0;i<selections.length;i++){
					if(selections[i].get('bank_org_id') == bank_org_id){
						roleIds +=','+selections[i].get('role_id');
					}
				}
				if(roleIds !=''){
					roleIds=roleIds.substring(1);
				}
				Ext.Ajax.request({
					url : pathUrl + '/user_saveRole.action',
					waitMsg:'正在处理,请稍候......',         
					timeout:30000,
					params: {role_id:roleIds,user_id:user_id,bank_org_id:bank_org_id},
					method: 'POST',
					callback: function (options, success, response) {
						var json=Ext.util.JSON.decode(response.responseText);
						if (json.success) {
							Ext.MessageBox.alert("提示信息","分配成功");
							Ext.getCmp("userRolesWin").destroy();
						//	Ext.MessageBox.alert('添加成功',json.info);
						} else {
							Ext.MessageBox.alert('错误',json.info);
						}
					}
				});
			}
            },
            {
			text: '取消',
			handler: function(){
				Ext.getCmp("userRolesWin").destroy();
			}
            }
            ]
        });

        UserRolesWindowUI.superclass.initComponent.call(this);
    }
});


Ext.onReady(function() {
	//机构变化选择重新加载菜单树
	var myComboChangeFun = function(bank_id){
		setResTree(special_user_id,bank_id);
	}
	
	//权限机构panel
	var formPanel = new Ext.form.FormPanel({
		frame : true,
		region : 'north',
		split : true,
		height : 50,
		bodyStyle : 'padding : 5px',
		layout: 'column',
		buttonAlign: 'center',
		items : [{
			xtype : 'panel',
			border : false,
			columnWidth : .4,
			labelWidth : 40,
			bodyStyle : 'padding : 0px 0px 0px 5px',
			layout : 'form',
			items : [bankSelector = new MyCombo(myComboChangeFun)]
		}]
	});
	
	//菜单树
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
	
	//弹出窗口
	var specialWindow = new Ext.Window({
		title : '',
		id : 'addWindow',
		width : 640,
		height : 500,
		layout : 'border',
		plain : true,
		modal : true,
		bodyStyle : 'padding:10px;',
		buttonAlign : 'center',
		listeners : {
			beforehide: function(){
				is_expand = false;
			},
			beforeclose : function(){
				specialWindow.hide();
				return false;
			}
		},
		items : [formPanel,resTreePanel],
		buttons : [{
			text : '保存',
			handler : function() {
				var bank_id = Ext.getCmp('myCombo').getStore().getAt(0).get('bank_org_id');
				var resource = "";
				var allNode = tree.getAllChecked();
				var nodes = allNode.split(",");
				//=======获得所有选择的功能菜单，包括处于半选状态的父节点菜单======Start==
				for(var i=0;i<nodes.length;i++){
					if(isExistNode(resource,nodes[i])){
						continue;
					}else{
						resource += nodes[i] + ";";
					}

					var Presource = getCheckResource("",nodes[i]).split(";");
					for(var j=0;j<Presource.length;j++){
						if(isExistNode(resource,Presource[j])){
							continue;
						}else{
							resource += Presource[j] + ";";
						}
					}
				}
				//=======获得所有选择的功能菜单，包括处于半选状态的父节点菜单=====End===
				//=======保存特殊授权=====Start===
				Ext.Ajax.request({
					url : pathUrl + '/user_saveSpeciallyAuthorize.action?user_id='+special_user_id+'&bank_id='+bank_id+'&resource='+resource,
					method : 'POST',
					timeout : 30000,
					callback : function(options, success, response) {
						var json = Ext.util.JSON.decode(response.responseText);
						if (json.success){
							Ext.MessageBox.alert('提示信息', "保存成功!");
							specialWindow.hide();
						}else{
							Ext.MessageBox.alert('提示信息', "保存失败!");
						}
					}
				});
			}
		}, {
			text : '取消',
			handler : function() {
				specialWindow.hide();
			}
		}]
	});
});

//得到所有选择的菜单节点；如果选择的节点存在除root外的父节点则将其父节点一起保存
var getCheckResource = function(resource,id){
	var pId = tree.getParentId(id);
	if("root" != pId){
		resource += pId + ";";
		return getCheckResource(resource,pId);
	}else{
		return resource;
	}
}
//判断id是否已经存在于resource中
var isExistNode = function(resource,id){
	var rs = resource.split(";");
	for(var i=0;i<rs.length;i++){
		if(id == rs[i]){
			return true;
		}
	}
	return false;
}

//加载菜单树
var setResTree = function(user_id,bank_id){
	Ext.Ajax.request({
		url : pathUrl + '/user_getResourceTree.action?user_id='+user_id+'&bank_id='+bank_id,
		method : 'POST',
		timeout : 30000,
		callback : function(options, success, response) {
			var json = Ext.util.JSON.decode(response.responseText);
			if (json.success){
				$("#res_tree").empty();
				tree=new dhtmlXTreeObject("res_tree","100%","100%","");
				tree.setImagePath(pathUrl + "/public/scripts/dhtmlx/imgs/");
				tree.enableCheckBoxes(1);
				tree.attachEvent("onCheck",function(id,state){
					if(tree.hasChildren(id) > 0){
						checkChildren(tree,id,state)
					}
					checkParent(tree,id,state);
				});
				tree.loadXMLString(json.info);
				tree.disableCheckbox('root',true);
			}else{
				Ext.MessageBox.alert('提示信息', "加载用户菜单树失败!");
			}
		}
	});
}

//如果选择节点为子节点则将父节点变成半选中状态
/**
 * 递归调用
 * 选择的节点为子节点，分两种情况：
 * 1、反选。判断该节点的直接父节点下所有孩子节点是否存在选中状态节点，
 * 			如果存在则只修改父节点为半选样式（不改变父节点的选择状态），
 * 			如果不存在则反选父节点
 * 2、选中。判断该节点的直接父节点下所有孩子节点是否存在反选状态节点，
 * 			如果存在则判断父节点是否已经处于选中状态，处于选中状态则不做修改，否则将父节点改成半选样式
 * 			如果不存在则将父节点置选中状态
 * */
var checkParent = function(tree,id,state){
	var pId = tree.getParentId(id);
	var flag = true;
	if("root" != pId){
		if(state == 0){	//反选
			for(var i=0;i<tree.hasChildren(pId);i++){
				if(1 == tree.isItemChecked(tree.getChildItemIdByIndex(pId,i))){
					var sNode = tree._globalIdStorageFind(pId, 0, 1);
					sNode.htmlNode.childNodes[0].childNodes[0].childNodes[1].childNodes[0].src = tree.imPath + 'iconInterCheck.gif';
					flag = false;
					break;					
				}
			}
			flag ? tree.setCheck(pId,state) : '';
		}else{//选择
			for(var i=0;i<tree.hasChildren(pId);i++){
				if(0 == tree.isItemChecked(tree.getChildItemIdByIndex(pId,i))){
					if(0 == tree.isItemChecked(pId)){//节点未选中则置半选状态，否则不变
						var sNode = tree._globalIdStorageFind(pId, 0, 1);
						sNode.htmlNode.childNodes[0].childNodes[0].childNodes[1].childNodes[0].src = tree.imPath + 'iconInterCheck.gif';
					}
					flag = false;
					break;					
				}
			}
			flag ? tree.setCheck(pId,state) : '';
		}
		checkParent(tree,pId,state);
	}else{
		return ;
	}
} 

//如果选择节点为父节点则选择下面所有子节点
var checkChildren = function(tree,id,state){
	if(tree.hasChildren(id) > 0){
		for(var i=0;i<tree.hasChildren(id);i++){
				tree.setCheck(tree.getChildItemIdByIndex(id,i),state);
				checkChildren(tree,tree.getChildItemIdByIndex(id,i),state);
		}
	}else{
		return ;
	}
}

//特殊授权
function speciallyAuthorize() {
    var record = Ext.getCmp("gridPanel").getSelectionModel().getSelected();
    if (record == null) {
        Ext.MessageBox.alert('提示信息', '请选择一个用户！');
        return;
    }
    special_user_id = record.get('user_id');
    special_user_name = record.get('user_name');

    //弹出框之前机构定位总是当前用户机构
    var comboStore = Ext.getCmp('myCombo').getStore();
    comboStore.removeAll();
    comboStore.insert(0, new Ext.data.Record({bank_org_id: bank_org_id, bank_org_name: bank_org_name}));
    Ext.getCmp('myCombo').setValue("[" + bank_org_id + "]" + bank_org_name);
    //加载特殊授权的菜单树
    setResTree(special_user_id, bank_org_id);

    Ext.getCmp('addWindow').show();
    Ext.getCmp('addWindow').setTitle('为 <span style="color:red;"> ' + special_user_name + ' </span>分配特殊授权');
	}