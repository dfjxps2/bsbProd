var month_id = '';
var obj_type = '';
var iframeUrl = '';


Ext.onReady(function(){
//	var tbar = ['->',"月份：",monthSelector = new MonthSelector()];
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [{
//			title : '条件选择',
			region : 'north',
			height : 40,
			border : false,
			split : true,
			contentEl : 'oper'
		},{
			id : 'centerpanel',
			region : 'center',
//			title : '战略地图',
			xtype : 'panel',
			border : false,
			split : true,
//			tbar : tbar,
			layout : 'border',
			items : [{
				region : 'center',
				contentEl : 'mapframe',
				border : false,
				split : false
			}]
		}]
	});
	
	$("#monthSelector").change(function(){
		load();
	});
	
	$("#typeSelector").change(function(){
		load();
	});
	
	$("#objSelector").change(function(){
		var object_id = $("#objSelector").val();
		iframeUrl = getUrl(level,month_id,obj_type)+"&object_id="+object_id;
		$("#mapframe").attr('src',iframeUrl);
	});
	
	$.ajax({
		type : 'POST',
		cache : false,
		async : false,
		dataType : 'json',
		url : pathUrl + '/strategicMap_listMonth.action',
		success : function(json) {
			$.each(json.results, function(i, n) {
				$("#monthSelector").append("<option value='" + n.month_id + "'>" + n.month_name+ "</option>");
				load();
//				if(i==1)
			});
		}
	});
});

function load() {
	month_id = $("#monthSelector").val();
	obj_type = $("#typeSelector").val();
	if(level == 3) {
		$.ajax({
			type : 'POST',
			cache : false,
			async : false,
			dataType : 'json',
			url : pathUrl + '/bsccard_StrategyDetailObjList.action?month_id='+month_id+'&obj_cate_id='+obj_type,
			success : function(json) {
				$("#obj_filter_div").show();
				$("#objSelector").empty();
				$("#objSelector").append("<option value='all'>全部</option>");
				$.each(json.results, function(i, n) {
					$("#objSelector").append("<option value='" + n.object_id + "'>" + n.object_name+ "</option>");
				});
			}
		});
	}else {
		$("#obj_filter_div").hide();
		$("#objSelector").empty();
	}
	iframeUrl = getUrl(level,month_id,obj_type);
	$("#mapframe").attr('src',iframeUrl);
	
//	$("#mapframe").append("<div>pppppppppppp</div>");
}

function goNext() {
	if(level == 2){
		$(".goNext").find("img").attr("alt","已经最后一步了");
	}
	if(level == 3){
		return;
	}
	$(".goPrev").find("img").attr("alt","上一步");
	level++;
	load()
}

function goPrev(){
	if(level == 2){
		$(".goPrev").find("img").attr("alt","已经第一步了");
	}
	if(level == 1){
		return;
	}
	$(".goNext").find("img").attr("alt","下一步");
	level--;
	load();
}

function getUrl(i,mid,obj_type) {
	if(i == 1) {
		return pathUrl + '/strategicMap_loadMap.action?status=true&month_id='+mid+'&obj_cate_id='+obj_type
	}else if(i == 2) {
		return pathUrl + '/bsc/pages/org_measure_status.jsp?month_id='+mid+'&obj_cate_id='+obj_type
	}else if(i == 3)
		return pathUrl + '/bsc/pages/org_status_detail.jsp?month_id='+mid+'&obj_cate_id='+obj_type
	i == level;
	return iframeUrl;
}

///**
// * 月份选择下拉框
// */
//MonthSelector = function() {
//	var store = new Ext.data.JsonStore({
//		url : pathUrl + '/selector_listMonth.action',
//		root : 'results',
//		totalProperty : 'totalCount',
//		fields : ['month_id', 'month_name']
//	});
//	
//	store.on('load', changeSelect);
//	store.load();
//
//	MonthSelector.superclass.constructor.call(this, {
//		store : store,
//		valueField : 'month_id',
//		displayField : 'month_name',
//		mode : 'local',
//		hiddenName : 'month_id',
//		editable : false,
//		triggerAction : 'all',
//		allowBlank : false,
//		listeners : {
//			select : function(combo,record,index) {
//				document.getElementById("mapframe").src = pathUrl + '/strategicMap_loadMap.action?status=true&month_id='+record.get('month_id');
//			}
//		},
//		name : 'month_id',
//		id : 'monthSelector',
//		width : 160
//	});
//
//	function changeSelect() {
//		if (store.getCount() > 0) {
//			var combo = Ext.getCmp('monthSelector');
//			var value = store.getAt(0).get('month_id');
//			combo.setValue(value);
//			document.getElementById("mapframe").src = pathUrl + '/strategicMap_loadMap.action?status=true&month_id='+value;
//		}
//	}
//}
//Ext.extend(MonthSelector, Ext.form.ComboBox);