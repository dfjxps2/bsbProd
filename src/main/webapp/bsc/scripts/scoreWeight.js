saveScoreWeight = function (){
	var gridXml = grid.serialize();
	var project_id = Ext.getCmp("project_code").getValue();
	var object_id = Ext.getCmp("object_panel").getSelectionModel().getSelections()[0].get('object_id');
	var measure_search = encodeURI(encodeURI(Ext.getCmp('measure_search').getValue()));

	showMask();
	Ext.Ajax.request({
		waitMsg : '正在处理,请稍候...',
		url : pathUrl + '/scoreWeight_scoreWeightModify.action',
		success : function (result , request){
			hiddenMask();
			
				buildGrid();
				doLoad(filePath);
				Ext.getCmp('save').setDisabled(true);
		},
		failure : function(result,request){
			hiddenMask();
			Ext.Msg.alert('保存信息',result.info||result.responseText);
		},
		method : 'post',
		params : {
			project_id : project_id,
			object_id : object_id,
			gridXml : gridXml,
			measure_search : measure_search
		}
	});
};

function saveParamterValue(){
	var param_grid_xml = param_grid.serialize();
	showMask();
	Ext.Ajax.request({
		waitMsg : '正在处理,请稍候...',
		url : pathUrl + '/scoreWeight_modifyParam.action',
		params : {
			project_id : project_id,
			object_id : object_id,
			param_grid_xml : param_grid_xml,
			param_search : param_search
		},
		success : function(result,request){
			hiddenMask();
			Ext.getCmp('param_save').setDisabled(true);
			queryParamResult();
		},
		failure : function(result,request){
			hiddenMask();
			Ext.Msg.alert('保存信息',result.info||result.responseText);
		},
		method : 'post'
	});
}
