/*
------------------------------------------------------------------------------
文件名称：log_info_layout.js
说    明：JavaScript脚本，日志页面布局。
版    本：1.0
修改纪录:
------------------------------------------------------------------------------
时间              修改人         说明
2013-10-08      mabo         创建
------------------------------------------------------------------------------
 */
//日志类型
var begin_date,end_date,userKey,path,grid,gridDetail,export_session_id='';
/*
 * 开始日期
 */
begin_dateSelector = function() {
	begin_dateSelector.superclass.constructor.call(this, {
		layout : 'form',
		border : false,
		items : [{
			xtype : 'datefield',
			hiddenName : 'begin_date_id',
			allowBlank : false,
			fieldLabel : '开始日期',
			format : 'Y-m-d',
			name : 'begin_dateId',
			id : 'begin_dateId',
			anchor:'90%',
			value:sysDate
		}]
	});
}
Ext.extend(begin_dateSelector, Ext.Panel);

/*
 * 结束日期
 */
end_dateSelector = function() {
	end_dateSelector.superclass.constructor.call(this, {
		layout : 'form',
		border : false,
		items : [{
			xtype : 'datefield',
			hiddenName : 'end_date_id',
			allowBlank : false,
			fieldLabel : '结束日期',
			format : 'Y-m-d',
			name : 'end_dateId',
			id : 'end_dateId',
			anchor:'90%',
			value:new Date()
		}]
	});
}
Ext.extend(end_dateSelector, Ext.Panel);

var northPanel = new Ext.Panel({
		region : 'north',
		height:	100,
		layout : 'fit',
		border : false,
		split : true,
		items : [{
				xtype : 'form',
				frame : true,
				layout : 'column',
				title : '查询条件',
				bodyStyle : 'padding : 15px',
				items : [{
					columnWidth : 0.2,
					labelWidth : 60,
					layout : 'form',
					border : false,
					items : [begin_dateSelector = new begin_dateSelector()]
				}, {
					columnWidth : 0.2,
					labelWidth : 60,
					layout : 'form',
					border : false,
					items : [end_dateSelector = new end_dateSelector()]
				}, {
					columnWidth : 0.2,
					labelWidth : 60,
					layout : 'form',
					border : false,
					items : [{
						xtype : 'textfield',
						name : 'user_key',
						id : 'user_key',
						fieldLabel : '用户',
						emptyText : '请输入用户ID/名称...',
						anchor : '90%'
					}]
				}, {
					columnWidth : 0.06,
					xtype : 'button',
					id : 'search',
					height : 23,
					text : '查 询',
					iconCls : 'search',
					handler : function() {
						getParamValue();
						path = pathUrl + "/log_queryList.action?userKey="+userKey
							   + "&begin_date="+begin_date+ "&end_date="+end_date;
						doQueryTotalCount(path);
					}
				}]
			}]
	});

var westTbar = ['->',{
	xtype : 'button',
	height : 23,
	text : '导 出',
	iconCls : 'export',
	handler : function() {
		getParamValue();
		document.excelForm.begin_date.value = begin_date;
		document.excelForm.end_date.value = end_date;
		document.excelForm.userKey.value = userKey;
		document.excelForm.file_name.value = '日志结果导出.xls';
		document.excelForm.exportType.value = 'total';
		document.excelForm.submit();
	}
}];

var centerTbar = ['->',{
	xtype : 'button',
	height : 23,
	text : '导 出',
	iconCls : 'export',
	handler : function() {
		if(export_session_id==''||export_session_id==null){
			Ext.Msg.alert('提示','请选择要导出的用户');
			return;
		}
		document.excelForm_user.queryInfo.value = export_session_id;
		document.excelForm_user.file_name.value = '用户详细日志.xls';
		document.excelForm_user.exportType.value = 'detail';
		document.excelForm_user.submit();
	}
}];
	
var mainPanel = new Ext.Panel({
	region : 'center',
	layout : 'border',
	split : true,
	items : [{
			region : 'west',
			xtype : 'panel',
			width : '53%',
//			title : '登陆情况列表',
			contentEl : 'grid',
			border : true,
			split : true,
			tbar : westTbar,
			bbar : pToolBar = new Ext.MyPagingToolbar({
					pageSize : 30,
					displayInfo : true,
					displayMsg : '显示第 {0} 条到 {1} 条记录，一共 {2} 条',
					emptyMsg : "没有记录",
					firstText : '第一页',
					prevText : '上一页',
					nextText : '下一页',
					lastText : '最后一页',
					refreshText : '刷新'
				})
		},{
			region : 'center',
			xtype : 'panel',
			contentEl : 'gridDetail',
//			title : '登陆明细列表',
			border : true,
			tbar : centerTbar
		}]
});
	

Ext.onReady(function(){
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [northPanel,mainPanel]
	});
	queryDetail('');
	document.getElementById('search').fireEvent('onClick');
});

function getParamValue(){
	begin_date = Ext.get('begin_dateId').getValue();
	end_date = Ext.get('end_dateId').getValue();
	userKey = encodeURI(encodeURI(Ext.getCmp('user_key').getValue()));
	if(begin_date==''||end_date==''){
		Ext.Msg.alert('提示','请先选择查询条件!');
		return ;
	}
	if(begin_date>end_date){
		Ext.Msg.alert('提示','结束日期不能小于开始日期!');
		return;
	}
}

function doQueryTotalCount(path){
		Ext.Ajax.request({
			url: pathUrl + '/log_queryListCount.action?userKey='+userKey+ "&begin_date="+begin_date+ "&end_date="+end_date,
			waitMsg:'正在处理，请稍候。。。。。。',
			method: 'POST',
			params: {},
			callback: function (options, success, response) {
				var json=Ext.util.JSON.decode(response.responseText);
				if (json.success==true) { 
					Ext.MessageBox.hide();
					
					totalCount = parseFloat(json.totalCount);
					load(path);
					pToolBar.initProperties(totalCount,path,true);
					pToolBar.onLoad(pToolBar);
				} else {
					Ext.MessageBox.alert(json.info);
					Ext.MessageBox.hide();
				}
			},
			failure:function(response, options){
				Ext.MessageBox.hide();
				Ext.MessageBox.alert(response.responseText);
			},  
			success:function(response, options){
				Ext.MessageBox.hide();
			}                                
		});
	}
			
function load(path){
	grid = new dhtmlXGridObject('grid');
	grid.setImagePath(pathUrl + "/public/scripts/dhtmlx/imgs/");
	grid.init();
	grid.setSkin("bsc");
	grid.enableRowsHover(true, "hover");
	grid.setColumnHidden(1,true);
	grid.load(path, function() {
		hiddenMask();
		var xml = grid.serialize();
		if (xml.length <= 34) {
			return;
		}
	});
	gridDetail.clearAll();
	
	 grid.attachEvent("onRowSelect",function(rowId,cellIndex){
	  export_session_id = rowId;
      queryDetail(rowId);
  	});

};

function queryDetail(rowId){
	gridDetail = new dhtmlXGridObject('gridDetail');
	gridDetail.setImagePath(pathUrl + "/public/scripts/dhtmlx/imgs/");
	gridDetail.init();
	gridDetail.setSkin("bsc");
	gridDetail.enableRowsHover(true, "hover");

	gridDetail.load(pathUrl + '/log_queryDetail.action?queryInfo='+rowId, function() {
		var xml = gridDetail.serialize();
		if (xml.length <= 34) {
			return;
		}
	});
}