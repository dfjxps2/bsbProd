/*
 * 用途 ：机构（管理机构、营业机构、其他管理机构）选择选择下拉框 
 * 输入 ：无 
 * 返回 ：无
 */
BankWholeSelector = function() {
	var store = new Ext.data.Store({
		proxy : new Ext.data.HttpProxy({
			url : pathUrl + '/selector_listBankOrganization.action'
		}),
		reader : new Ext.data.JsonReader({
			root : 'results'
		}, [{
			name : 'bankOrgID',
			mapping : 'bank_org_id'
		}, {
			name : 'bankOrgName',
			mapping : 'bank_org_name'
		}]),
		remoteSort : false
	});

	store.on('load', changeSelect);
	store.load();

	BankWholeSelector.superclass.constructor.call(this, {
		layout : 'form',
		border : false,
		items : [{
			xtype : 'combo',
			store : store,
			valueField : 'bankOrgID',
			displayField : 'bankOrgName',
			mode : 'local',
			hiddenName : 'bank_org_id',
			editable : false,
			triggerAction : 'all',
			allowBlank : false,
			fieldLabel : '归属机构',
			name : 'bankWholeSelector',
			id : 'bankWholeSelector',
			anchor : '75%'
		}]
	});

	function changeSelect() {
		if (store.getCount() > 0) {
			var combo = Ext.getCmp('bankWholeSelector');
			var value = store.getAt(0).get('bankOrgID');
			combo.setValue(value);
		}
	}

	this.load = function(m) {
		var combo = Ext.getCmp('bankWholeSelector');
		var bankOrgID = combo.getValue();
		store.load({
			params : {
				bank_org_id : bankOrgID,
				mode : m
			}
		});
	}

	this.initUI = function() {
		var div = Ext.getDom('bankWholeSelector').parentNode;
		var span1 = document.createElement("span");
		span1.style.marginLeft=20;
		
		span1.className = "span_left";
		span1.innerHTML = "<a href='javascript:bankWholeSelector.load(\"DrillUP\")'><img src="+ pathUrl + "/public/images/leftArrow.gif></a>";
		div.appendChild(span1);
		
		var span2 = document.createElement("span");
		span2.style.marginLeft=20;
		
		span2.className = "span_right";
		span2.innerHTML = "<a href='javascript:bankWholeSelector.load(\"DrillDown\")'><img src="+ pathUrl + "/public/images/rightArrow.gif></a>";
		div.appendChild(span2);
	}
}
Ext.extend(BankWholeSelector, Ext.Panel);

/*
用途 ：所属部门（管理机构、营业机构、其他管理机构）选择选择下拉框（数据和BankWholeSelector一样）
输入 ：无
返回 ：无 
*/
OwnerOrgSelector = function(ownerOrgId) {
	var store = new Ext.data.Store({
		proxy : new Ext.data.HttpProxy({
			url : pathUrl + '/selector_listBankOrganization.action'
		}),
		reader : new Ext.data.JsonReader({
			root : 'results'
		}, [{
			name : 'bankOrgID',
			mapping : 'bank_org_id'
		}, {
			name : 'bankOrgName',
			mapping : 'bank_org_name'
		}]),
		remoteSort : false
	});

	store.on('load', changeSelect);
	store.load({params:{bank_org_id:ownerOrgId}});
	
	OwnerOrgSelector.superclass.constructor.call(this, {
		layout : 'form',
		border : false,
		items : [{
			xtype : 'combo',
			store : store,
			valueField : 'bankOrgID',
			displayField : 'bankOrgName',
			mode : 'local',
			hiddenName : 'owner_org_id',
			editable : false,
			triggerAction : 'all',
			allowBlank : false,
			fieldLabel : '归属机构<span style="color:red;font-weight:bold" data-qtip="Required">*</span>',
			name : 'ownerOrgSelector',
			id : 'ownerOrgSelector',
			anchor : '75%'
		}]
	});

	function changeSelect() {
		if (store.getCount() > 0) {
			var combo = Ext.getCmp('ownerOrgSelector');
			var value = store.getAt(0).get('bankOrgID');
			combo.setValue(value);
		}
	}

	this.load = function(m) {
		var combo = Ext.getCmp('ownerOrgSelector');
		var bankOrgID = combo.getValue();
		store.load({
			params : {
				bank_org_id : bankOrgID,
				mode : m
			}
		});
	}

	this.initUI = function() {
		var div = Ext.getDom('owner_org_id').parentNode;
		var span1 = document.createElement("span");
		span1.style.marginLeft=20;
		
		span1.className = "span_left";
		span1.innerHTML = "<a href='javascript:ownerOrgSelector.load(\"DrillUP\")'><img src="+ pathUrl + "/public/images/leftArrow.gif></a>";
		div.appendChild(span1);
		var span2 = document.createElement("span");
		span2.style.marginLeft=20;

		span2.className = "span_right";
		span2.innerHTML = "<a href='javascript:ownerOrgSelector.load(\"DrillDown\")'><img src="+ pathUrl + "/public/images/rightArrow.gif></a>";
		div.appendChild(span2);
	}
}
Ext.extend(OwnerOrgSelector, Ext.Panel);
/*
用途 ：管理机构（管理机构、营业机构、其他管理机构）选择选择下拉框（数据和BankWholeSelector一样）
输入 ：无
返回 ：无 
*/
ManageOrgSelector = function(bankOrgId) {
	var store = new Ext.data.Store({
		proxy : new Ext.data.HttpProxy({
			url : pathUrl + '/selector_listBankOrganization.action'
		}),
		reader : new Ext.data.JsonReader({
			root : 'results'
		}, [{
			name : 'bankOrgID',
			mapping : 'bank_org_id'
		}, {
			name : 'bankOrgName',
			mapping : 'bank_org_name'
		}]),
		remoteSort : false
	});

	store.on('load', changeSelect);
	store.load({params:{bank_org_id:bankOrgId}});

	ManageOrgSelector.superclass.constructor.call(this, {
		layout : 'form',
		border : false,
		items : [{
			xtype : 'combo',
			store : store,
			valueField : 'bankOrgID',
			displayField : 'bankOrgName',
			mode : 'local',
			hiddenName : 'bank_org_id',
			editable : false,
			triggerAction : 'all',
			allowBlank : false,
			fieldLabel : '权限机构<span style="color:red;font-weight:bold" data-qtip="Required">*</span>',
			name : 'manageOrgSelector',
			id : 'manageOrgSelector',
			anchor : '75%'
		}]
	});

	function changeSelect() {
		if (store.getCount() > 0) {
			var combo = Ext.getCmp('manageOrgSelector');
			var value = store.getAt(0).get('bankOrgID');
			combo.setValue(value);
		}
	}

	this.load = function(m) {
		var combo = Ext.getCmp('manageOrgSelector');
		var bankOrgID = combo.getValue();
		store.load({
			params : {
				bank_org_id : bankOrgID,
				mode : m
			}
		});
	}

	this.initUI = function() {
		var div = Ext.getDom('manageOrgSelector').parentNode;
		var span1 = document.createElement("span");
		span1.style.marginLeft=20;
		span1.className = "span_left";
		span1.innerHTML = "<a href='javascript:manageOrgSelector.load(\"DrillUP\")'><img src="+ pathUrl + "/public/images/leftArrow.gif></a>";
		div.appendChild(span1);
		var span2 = document.createElement("span");
		span2.style.marginLeft=20;
		span2.className = "span_right";
		span2.innerHTML = "<a href='javascript:manageOrgSelector.load(\"DrillDown\")'><img src="+ pathUrl + "/public/images/rightArrow.gif></a>";
		div.appendChild(span2);
	}
}
Ext.extend(ManageOrgSelector, Ext.Panel);

// 状态selector
StatusSelector = function() {
	var store = new Ext.data.ArrayStore({
		fields : ['display', 'value'],
		data : [['正常', '00'], ['用户锁定', '01'], ['系统预锁定', '02'], ['系统锁定', '03']]
	});

	StatusSelector.superclass.constructor.call(this, {
		fieldLabel : '状态<span style="color:red;font-weight:bold" data-qtip="Required">*</span>',
		mode : 'local',
		editable : false,
		allowBlank : false,
		blankText : '不能为空',
		store : store,
		triggerAction : 'all',
		displayField : 'display',
		valueField : 'value',
		hiddenName : 'user_status',
		name : 'user_status',
		id : 'statusSelector',
		anchor : '91%'
	});
};
Ext.extend(StatusSelector, Ext.form.ComboBox);

// grid下拉框
GridSelector = function(obj) {
	var random = new Date().getMilliseconds();
	var ds = obj.ds; // 必需
	var width = obj.width ? obj.width : 300;
	var height = obj.height ? obj.height : 200;
	var anchor = obj.anchor ? obj.anchor : '90%';
	var valueField = obj.valueField; // 必需
	this.store = ds;
	obj.id = obj.id ? obj.id : random;
	obj.id = obj.id ? obj.id : 'GridSelector';
	obj.value = obj.value ? obj.value : "";
	this.fieldLabel = obj.fieldLabel; // 必需
	this.hidden = obj.hidden ? obj.hidden : false;
	this.displayField = obj.displayField ? obj.displayField : obj.fieldLabel;
	this.valueField = valueField;
	this.hiddenName = obj.name ? obj.name : valueField;
	this.name = obj.name ? obj.name : valueField;
	this.editable = obj.editable ? obj.editable : false;
	this.allowBlank = obj.allowBlank ? obj.allowBlank : false;
	this.width = obj.labelWidth ? obj.labelWidth : 190;
	this.anchor = anchor;
	ds.load({
		callback : obj.callback
	});
	var grid = {
		xtype : 'grid',
		width : width,
		height : height,
		columns : obj.cm,
		store : ds,
		sm : new Ext.grid.RowSelectionModel({
			singleSelect : true
		}),
		viewConfig : {
			forceFit : true
		},
		listeners : {
			rowclick : function(grid, rowIndex, e) {
				showMenu.hide();
				var record = ds.getAt(rowIndex);
				Ext.getCmp(obj.id).setValue(record.get(valueField));
				if (obj.listeners) {
					var items = obj.itemIDs.split(",");
					for (var i = 0; i < items.length; i++) {
						var info = '';
						record.fields.each(function(c, d) {
							if (record.get(c.name) != '' && c.name != undefined)
								info += ',' + c.name + ':' + "'"
										+ record.get(c.name) + "'";
						});
						var gid = obj.id.substring(0, 4);
						if (info != '') {
							info = info.substring(1);
							info = '{' + info + '}';
						}
						if (Ext.getCmp(items[i])) {
							Ext.getCmp(items[i]).setValue(null);
							Ext.getCmp(items[i]).getStore().reload({
								params : {
									itemID : items[i],
									comboID : record.get(valueField),
									filter : info
								}
							});
						} else if (Ext.getCmp(gid + items[i])) {
							Ext.getCmp(gid + items[i]).setValue(null);
							Ext.getCmp(gid + items[i]).getStore().reload({
								params : {
									itemID : items[i],
									comboID : record.get(valueField),
									filter : info
								}
							});
						}
					}
				}
			}
		},
		tbar : ["关键字：", {
			xtype : 'textfield',
			name : 'keyWord',
			width : 100
		}, {
			xtype : 'button',
			iconCls : 'search',
			handler : function() {
				var keyWord = this.previousSibling().getValue();
				if (obj.searchName) {
					var params = {};
					params[obj.searchName] = keyWord; // 必需
					ds.load({
						params : params,
						callback : obj.callback
					});
				} else
					ds.load({
						params : {
							keyWord : keyWord
						},
						callback : obj.callback
					});
			}
		}]
	};
	if (obj.bbar)
		grid.bbar = {
			xtype : 'paging',
			pageSize : obj.pageSize ? obj.pageSize : 10,
			store : ds,
			displayInfo : true,
			displayMsg : '第{0}-{1}条记录,共{2}条',
			emptyMsg : "没有记录"
		};
	var showMenu = new Ext.menu.Menu({
		items : [grid]
	});

	GridSelector.superclass.constructor.call(this, {
		id : obj.id,
		mode : 'local',
		value : obj.value,
		blankText : '不能为空',
		store : ds,
		triggerAction : 'all'
	});
	this.expand = function() {
		if (this.menu == null) {
			this.menu = showMenu;
		}

		this.menu.show(this.el, "tl-bl?");
	};
};
Ext.extend(GridSelector, Ext.form.ComboBox);

/**
 * 月份选择下拉框
 */
MonthSelector = function(config) {
	
	var an = config.anchor ? config.anchor : '91%';
	var hiddenName = config.hiddenName ? config.hiddenName : 'month_id';
	var id = config.id ? config.id : 'monthId';
	var fieldLabel = config.fieldLabel ? config.fieldLabel : '月份';
	
	var store = new Ext.data.JsonStore({
		storeId : 'safd',
		url : 'selector_listMonth.action',
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
 * 归属条线
 */
BusiLineSelector = function(config){

	var hiddenName = config.hiddenName ? config.hiddenName : 'busi_line_id';
	var fieldLabel = config.fieldLabel ? config.fieldLabel : '归属条线';
	var id = config.id ? config.id : 'busiLineId';
	//var an = config.anchor ? config.anchor : '91%';
	
	var store = new Ext.data.JsonStore({
		storeId : 'busiLineStoreId',
		url : 'selector_listBusiLine.action',
		root : 'results',
		totalProperty : 'totalCount',
		fields : ['busi_line_id','busi_line_name']
	});
	
	store.on('load',changeSelect);
	store.load();
	
	BusiLineSelector.superclass.constructor.call(this,{
		store : store,
		valueField : 'busi_line_id',
		displayField : 'busi_line_name',
		mode : 'local',
		hiddenName : hiddenName,
		editable : false,
		triggerAction :'all',
		allowBlank : false,
		fieldLabel : fieldLabel,
		id : id,
		name : 'busiLineId',
		anchor :  '91%'
	});
	
	function changeSelect(){
		if(store.getCount()>0){
			var combo = Ext.getCmp(id);
			var value = store.getAt(0).get("busi_line_id");
			combo.setValue(value);
			
		}
	}
}
Ext.extend(BusiLineSelector,Ext.form.ComboBox);

/**
 * 职位类型
 */
JobTypeCodeSelector = function(config){
	var hiddenName = config.hiddenName ? config.hiddenName : 'job_type_id';
	var id = config.id ? config.id : 'jobTypeId';
	var fieldLabel = config.fieldLabel ? config.fieldLabel : '职位类型';
	
	var store = new Ext.data.JsonStore({
		id : 'jobTypeCodeStore',
		url : 'selector_listJobTypeCode.action',
		root : 'results',
		totalProperty : 'totalCount',
		fields : ['job_type_id','job_type_desc']
	});
	
	store.on('load',changeSelect);
	store.load();
	
	JobTypeCodeSelector.superclass.constructor.call(this,{
		id : id,
		hiddenName : hiddenName,
		valueField : 'job_type_id',
		displayField : 'job_type_desc',
		store : store,
		fieldLabel : fieldLabel,
		editable : false,
		mode : 'local',
		triggerAction :'all',
		name : 'jobTypeId',
		anchor :  '91%'
	});
	
	function changeSelect(){
		if(store.getCount()>0){
			var combo = Ext.getCmp(id);
			var value = store.getAt(0).get("job_type_id");
			combo.setValue(value);
		}
	}
}
Ext.extend(JobTypeCodeSelector,Ext.form.ComboBox);







