BankSelector = function(obj) {
	
	var width = obj.width ? obj.width : 132;
	var leftClassName = obj.leftClassName ? obj.leftClassName : 'span_left';
	var rightClassName = obj.rightClassName ? obj.rightClassName : 'span_right';
	
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
			width : width
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
		span1.className = leftClassName;
		span1.innerHTML = "<a href='javascript:bankSelector.load(\"DrillUP\")'><img src="+ pathUrl + "/public/images/leftArrow.gif></a>";
		div.appendChild(span1);
		var span2 = document.createElement("span");
		span2.className = rightClassName;
		span2.innerHTML = "<a href='javascript:bankSelector.load(\"DrillDown\")'><img src="+ pathUrl + "/public/images/rightArrow.gif></a>";
		div.appendChild(span2);

	}
}
Ext.extend(BankSelector, Ext.Panel);

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
 * 带图标的下拉框
 * @param {} config
 */
Ext.form.IconCombo=function(config) {
    Ext.form.IconCombo.superclass.constructor.call(this, config);
    this.tpl = config.tpl ||
      '<tpl for="."><div class="x-combo-list-item" height=10px;>'
    + '<table><tbody><tr class="x-combo-list-row">'
    + '<td>'
    + '<div class="{'+this.iconClsField +'} x-icon-combo-icon"></div></td>'
    + '<td>{'+this.displayField+'}</td>'
    + '</tr></tbody></table>'
    + '</div></tpl>';
 	this.on({
	    render:{scope:this,fn:function() {
	        var wrap=this.el.up('div.x-form-field-wrap');
	        this.wrap.applyStyles({position:'relative'});
	        this.el.addClass('x-icon-combo-input');
	        this.flag=Ext.DomHelper.append(wrap,{tag:'div',style:'position:absolute'});
	    }
	}
});
}
Ext.extend(Ext.form.IconCombo,Ext.form.ComboBox, {
    setIconCls: function() {
        var rec = this.store.query(this.valueField, this.getValue()).itemAt(0);
        if(rec) {
        	if(this.flag){
            	this.flag.className = 'x-icon-combo-icon ' + rec.get(this.iconClsField);
            }
        }
    },
    setValue: function(value) {
        Ext.form.IconCombo.superclass.setValue.call(this,value);
        this.setIconCls();
    }
});
Ext.reg('iconcombo',Ext.form.IconCombo);

/**
 * 全部替换
 * @param {} str
 * @param {} str1
 * @param {} str2
 * @return {}
 */
function replaceAll(str, str1, str2) {
	while (str.indexOf(str1) >= 0)
		str = str.replace(str1, str2);
	return str;
}

/**
 * 格式化数据
 * @param {} v
 * @return {}
 */
function formate(v) {
	v = (Math.round((v - 0) * 100)) / 100;
	v = (v == Math.floor(v)) ? v + ".00" : ((v * 10 == Math.floor(v * 10)) ? v
			+ "0" : v);
	v = String(v);
	var ps = v.split('.');
	var whole = ps[0];
	var sub = ps[1] ? '.' + ps[1] : '.00';
	var r = /(\d+)(\d{3})/;
	while (r.test(whole)) {
		whole = whole.replace(r, '$1' + ',' + '$2');
	}
	v = whole + sub;
	if (v.charAt(0) == '-') {
		return v.substr(1);
	}
	return v;
}

//生成18位ID
function getNewVersionId(){
	var id = "";
	for (var index = 0; index < 18; index++) {
		id += Math.floor(Math.random()*10);
	}
	return id;
}

function showJSON(json) {
	var mm = '';
	for (var p in json) {
		mm += "@" + p + ":" + json[p];
	}
	alert(mm)
}