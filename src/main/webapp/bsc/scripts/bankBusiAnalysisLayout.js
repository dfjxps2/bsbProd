Ext.onReady(function(){
	
	var toolbar = [{
            text:'查看(V)',
            tooltip:'查看',
            iconCls:'view',
            handler: function(){                                
                view();   
            }
       }
	];
	
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [{
			xtype : 'form',
			region : 'north',
			id : 'formId',
			frame : true,
			height : 80,
			layout : {
				type : 'column'
			},
			bodyStyle : 'padding:15px',
			title : '查询条件',
			items : [{
				columnWidth : .25,
				layout : 'form',
				labelWidth : 75,
				labelAlign : 'left',
				border : false,
				items : [{
					xtype : 'textfield',
					fieldLabel : '机构',
//					readOnly : true,
					allowBlank : false,
					id : 'bank_org_id',
					name : 'bank_org_id',
					value : '8888',
					anchor : '91%'
				}]
			},{
				columnWidth : .25,
				layout : 'form',
				labelWidth : 75,
				labelAlign : 'left',
				border : false,
				items : [{
					xtype : 'textfield',
					fieldLabel : '指标名称',
					id : 'dim_id',
					allowBlank : false,
					name : 'dim_id',
					value : 'root',
//					readOnly : true,
					anchor : '91%'
				}]
			}, {
				columnWidth : .25,
				layout : 'form',
				labelWidth : 75,
				labelAlign : 'left',
				border : false,
				items : [{
					xtype : 'textfield',
					fieldLabel : '其他',
					readOnly : true,
					id : 'others',
					name : 'others',
					readOnly : true,
					anchor : '91%'
				}]
			},{
				columnWidth : .25,
				layout : 'form',
				labelWidth : 75,
				labelAlign : 'left',
				border : false,
				items : [{
					xtype : 'button',
					iconCls : 'search',
					width : 48,
					text : '查询',
					handler : function(){
						//var param='&currency_code='+currencyCode+"&month_id="+monthID+"&unit="+unit+"&group="+group;
		                var bank_org_id=Ext.getCmp('bank_org_id').getValue();
		                var dim_id=Ext.getCmp('dim_id').getValue();
		                var headUrl=pathUrl+'/measureAnalysis_listHeader.action?bank_org_id='+bank_org_id+"&dim_id="+dim_id;
		                var filePath=pathUrl+'/measureAnalysis_listData.action?bank_org_id='+bank_org_id+"&dim_id="+dim_id;
		                var value = Ext.getCmp('formId').form;
		                if(value.isValid()){
		               		queryHeader(headUrl,filePath);
		                }
					}
				}]
			}]
		},{
			region : 'center',
			layout : 'border',
			items : [{
				region:'center',
				contentEl:'grid1',
				frame:false,
				split:true,
				autoScroll:true,
				tbar:toolbar
			}]
		}]
	});	
});

function view() {
window.open(pathUrl+"/measureAnalysis_listView.action","WActivity","width=800,height=600,location=no,resizable=yes,toolbar=no,scrollbars=yes,menubar=no,top=200,left=300");	
}