//修改密码窗体
Ext.form.Field.prototype.msgTarget = 'under';
MyModifyWindowUi = Ext.extend(Ext.Window, {
	id : 'modifyWindow',
	title : '修改密码',
	width : 290,
	height : 220,
	modal : true,
	resizable : false,
	buttonAlign : 'center',
	layout : 'fit',
	buttons : [ {
		text : '确定',
		id : 'confrim',
		handler : function() {
		    var obj_form=Ext.getCmp('modifyPasswordForm').getForm();
		    if(obj_form.isValid()){
		        obj_form.submit({
		            url : pathUrl+'/user_modifyPassword.action',
		            success:function(f,action){
		                Ext.getCmp('modifyWindow').close();
		                Ext.Msg.alert('消息',action.result.info);
		            },
		            failure:function(f,action){
		                Ext.Msg.alert('消息',action.result.info);
		            }
		        });
		    }
		}
	}, {
		text : '重置',
		handler : function() {
			Ext.getCmp('modifyPasswordForm').getForm().reset();
		}
	}, {
		text : '取消',
		handler : function() {
			this.ownerCt.ownerCt.close();
		}
	} ],
	initComponent : function() {
		Ext.applyIf(this, {
			items : [{
			    xtype : 'form',
			    id : 'modifyPasswordForm',
			    labelWidth : 60,
			    frame : true,
	            bodyStyle: 'padding:5px 20px',
	            defaultType : 'textfield',
	            defaults : {inputType:'password',allowBlank:false,blankText:'不能为空'},
			    items: [{
			        id : 'old_password',
			        name : 'old_password',
			        fieldLabel : '旧密码',
			        listeners : {
			        	blur : function(field){
			        		if(field.validate()){
			        			var old_passwrod = field.getValue();
			        			Ext.Ajax.request({
			        				url : pathUrl+'/user_checkPassword.action',
			        				params : {password : old_passwrod},
			        				method : 'POST',
			        				callback : function(options,request,response){
			        					var json = Ext.util.JSON.decode(response.responseText);
			        					if(json.success){
			        						Ext.getCmp('confrim').setDisabled(false);
			        					}else{
			        						field.markInvalid(json.info);
			        						Ext.getCmp('confrim').setDisabled(true);
			        					}
			        				}
			        			});
			        		}
			        	}
			        }
			    },{
			        id : 'password',
			        name : 'password',
			        fieldLabel : '新密码'
			    },{
			        name : 'again',
			        fieldLabel : '再次输入',
			        vtype : 'password',  
                    initialPassField : 'password'
			    }]
			}]
		});

		MyModifyWindowUi.superclass.initComponent.call(this);
	}
});
Ext.apply(Ext.form.VTypes,{  
    password:function(val,field){  
        if(field.initialPassField){  
            var pwd = Ext.getCmp(field.initialPassField);  
            return (val == pwd.getValue());  
        }  
        return true;  
    },  
    passwordText:'两次密码不一致'
});  