/*BankSelector = function() {//被下拉机构树替代
	var store = new Ext.data.Store({
		proxy : new Ext.data.HttpProxy({
			url : pathUrl + '/selector_listBankOrganization.action'
		}),
		reader : new Ext.data.JsonReader({
			root : 'results'
		}, [{
			name : 'bank_org_id'
		}, {
			name : 'bank_org_name'
		}]),
		remoteSort : false
	});

	store.on('load', changeSelect);
	store.load();

	BankSelector.superclass.constructor.call(this, {
		layout : 'form',
		border : false,
		items : [{
			xtype : 'combo',
			store : store,
			valueField : 'bank_org_id',
			displayField : 'bank_org_name',
			mode : 'local',
			hiddenName : 'bank_org_id',
			editable : false,
			triggerAction : 'all',
			allowBlank : false,
			fieldLabel : '机构',
			name : 'bank_org_id',
			id : 'bankSelector',
			width : 132
		}]
	});

	function changeSelect() {
		if (store.getCount() > 0) {
			var combo = Ext.getCmp('bankSelector');
			var value = store.getAt(0).get('bank_org_id');
			combo.setValue(value);
		}
	}

	this.load = function(m) {
		var combo = Ext.getCmp('bankSelector');
		var bankOrgID = combo.getValue();
		store.load({
			params : {
				bank_org_id : bankOrgID,
				mode : m
			}
		});
	}

	this.initUI = function() {

		var div = Ext.getDom('bank_org_id').parentNode;
		var span1 = document.createElement("span");
		span1.className = "span_left";
		span1.innerHTML = "<a href='javascript:bankSelector.load(\"DrillUP\")'><img src="+ pathUrl + "/public/images/leftArrow.gif></a>";
		div.appendChild(span1);
		var span2 = document.createElement("span");
		span2.className = "span_right";
		span2.innerHTML = "<a href='javascript:bankSelector.load(\"DrillDown\")'><img src="+ pathUrl + "/public/images/rightArrow.gif></a>";
		div.appendChild(span2);

	}
}
Ext.extend(BankSelector, Ext.Panel);*/

/**
 * 月份选择下拉框
 */
MonthSelector = function(config) {
	
	var an = config.anchor ? config.anchor : '91%';
	var hiddenName = config.hiddenName ? config.hiddenName : 'month_id';
	var id = config.id ? config.id : 'monthId';
	var fieldLabel = config.fieldLabel ? config.fieldLabel : '月份';
	
	var store = new Ext.data.JsonStore({
		url : pathUrl + '/selector_listMonth.action',
		root : 'results',
		totalProperty : 'totalCount',
		fields : ['month_id', 'month_name']
	});

	store.on('load', changeSelect);
	store.load();

	MonthSelector.superclass.constructor.call(this, {
		store : store,
		valueField : 'month_id',
		displayField : 'month_name',
		mode : 'local',
		hiddenName : hiddenName,
		editable : false,
		triggerAction : 'all',
		allowBlank : false,
		fieldLabel : fieldLabel,
		name : 'month_id',
		id : id,
		anchor : an
	});

	function changeSelect() {
		if (store.getCount() > 0) {
			var combo = Ext.getCmp('monthId');
			var value = store.getAt(0).get('month_id');
			combo.setValue(value);
		}
	}
}
Ext.extend(MonthSelector, Ext.form.ComboBox);

/**
 * 方案 add by mabo at 2013-04-27
 * @param {} index
 */
EpmProject=function(){
//   if(index==null)
//        index="";
//   
   var store = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
           url: pathUrl + '/project_common.action?method=listProject'
        }),
        
        reader: new Ext.data.JsonReader({
            root: 'results',
            totalProperty: 'totalCount',
            id: 'project_id'
        }, [
            {name: 'project_id'},
            {name: 'project_name'},
            {name: 'published'}
        ])
    });
    store.on('load',changeSelect);
    store.load();

    EpmProject.superclass.constructor.call(this,{
         store: store,
         valueField :'project_id',
         displayField:'project_name',
         mode: 'local',
         hiddenName:'project_id',
         editable: false,
         triggerAction: 'all',
         allowBlank:false,
         fieldLabel:'方案',
         name: 'projectSelector',
         id: 'projectSelector',
         anchor:'79%'
   });
   
   function changeSelect()
    {
        if(store.getCount()>0)
        {
            var combo=Ext.getCmp('projectSelector');
            var value=store.getAt(0).get('project_id');
            combo.setValue(value);
        }
    }
}
Ext.extend(EpmProject, Ext.form.ComboBox);

/**
 * 机构树下拉框
 */
var MyCombo=function(changeFun){
    MyCombo.superclass.constructor.call(this,{
        id: 'myCombo',
		autoSelect:true,
		mode: 'local',
		triggerAction : "all",
		editable: false,
		value : '['+bank_org_id+']'+bank_org_name,
		fieldLabel : '机构',
		store: {
		    xtype:'arraystore',
		    fields : ['bank_org_id','bank_org_name'],
		    data:[['','']]
		}
	});
	this.expand=function(){
		if(!is_expand){
        this.menu = new Ext.menu.Menu({
            items : [{xtype: 'treepanel',
                border: false,
                id : 'comboTree',
                autoScroll: true,
                width: 400,
                height: 300,
                bodyStyle: 'padding:2px;',
                rootVisible: true,
                root :getRootNode(bank_org_id, "["+bank_org_id+"]"+bank_org_name, expandBankTree),
                
                listeners: {
                    click: function(node){
                    	var comboStore = Ext.getCmp('myCombo').getStore();
                    	comboStore.removeAll();
                    	comboStore.insert(0,new Ext.data.Record({bank_org_id:node.id,bank_org_name:node.text}));
						Ext.getCmp('myCombo').setValue(node.text);
						this.ownerCt.hide();
						if(null != changeFun){
							changeFun(node.id);
						}
                    },
                    load : function(node){
                    	is_expand = true;
                    }
                }
            }]
        });
        this.menu.show(this.el, "tl-bl?");
        Ext.getCmp('comboTree').getRootNode().expand();
	}else{
		this.menu.show(this.el, "tl-bl?");
	}
    };
}
Ext.extend(MyCombo,Ext.form.ComboBox);

