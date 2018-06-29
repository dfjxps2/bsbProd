/*
 * ------------------------------------------------------------------------------
 * 文件名称：bsc_proj_mea_imp.js
 * 说 明：JavaScript脚本，提供方案中，考核结果直接由外部导入的指标方法。 
 * 版 本：1.0
 * 修改纪录:
 * ------------------------------------------------------------------------------
 * 时间 			修改人    说明 
 * 2013-07-10 	zzm      创建
 * 2013-08-07   mabo     修改导入
 * ------------------------------------------------------------------------------
 * 
 */

//上传控件
function openUpload(){
	var fileNameField = new Ext.form.TextField({
		id:'fileName',
		name:'fileName'
	});

	var formPanel = new Ext.form.FormPanel({
		id : 'form_panel',
		hidden : true,
        url: pathUrl+'/projMeaImp_checkImportData.action',        
        items: [fileNameField,                  
        	{
			xtype:'hidden',
			id:'hiddenFile',
			name:'hiddenFile'
		}]
	});
	uploadWin = new Ext.Window({  
   		title: '目标结果导入',  
   		width: 500,  
   		height:150,  
   		layout: 'column',  
   		plain:true,  
   		modal : true,
   		bodyStyle:'padding:20px;',  
   		buttonAlign:'center',  
   		items : [formPanel,
   				formUpload = new Ext.form.FormPanel({
   					columnWidth : .88,
	   				baseCls: 'x-plain',  
		   			labelWidth: 40,  
	   				fileUpload:true,
	   				baseParams : {aa: 'bb'},
	   				url: pathUrl+'/bsc/uploadFile.action',
	   				items: [{
	   					xtype: 'textfield',  
	   					fieldLabel: '文件',
	   					name: 'uploadFile',//对应于uploadFileAction定义的File类型的变量名一致
	   					id:'upload',
	   					inputType: 'file',  
	   					allowBlank: false,  
	   					blankText:'必须选择一个文件进行上传。',
	   					anchor: '95%' 
	     			}]   
	   			}), {
					columnWidth : .12,
					xtype : 'button',
					id : 'button_help',
					text : "帮助",
					iconCls : 'help',
					handler : function() {
						var str = "left=0,screenX=0,top=0,screenY=0,resizable=yes";
						if (window.screen) {
							var ah = (screen.availHeight - 510)/2;
							var aw = (screen.availWidth - 650)/2;
							str += ",height=" + ah;
							str += ",innerHeight=" + ah;
							str += ",width=" + aw;
							str += ",innerWidth=" + aw;
						} else {
							str += ",resizable";
						}
						window.open(pathUrl + "/bsc/pages/import_measureFile_help.html","newwindow","height="+ 510+ ",width="+ 650+ ",top="+ah+",left="+aw+",toolbar=no,menubar=no,resizable=yes,scrollbars=yes,location=no,status=no");
					}
				}
   		],
   		
   		buttons: [{  
   			text: '上传',  
   			handler: function() {
   				var uploadFileVal = Ext.getCmp('upload').getValue();
   				if(uploadFileVal == null || uploadFileVal == ''){
   					Ext.Msg.alert('提示','请选择要上传文件!');
   					return;
   				}
   				var uploadFileExt = uploadFileVal.substring(uploadFileVal.lastIndexOf('.')+1);
   				var fileName = uploadFileVal.substring(uploadFileVal.lastIndexOf('\\')+1);//获取上传的文件名
   				
   				if(uploadFileExt != 'xls'){
   					Ext.Msg.alert('提示','文件格式错误，系统目前只支持excel 2003格式的文件。');
   					return;
   				}
   				if(formUpload.form.isValid()){
   					Ext.MessageBox.show({  
   						title: '请稍后',  
   						msg: '资源上传中...',  
   						progressText: '',  
   						width:300,  
//   						progress:true,  
   						closable:false,  
   						animEl: 'loding'  
   					});  
   					formUpload.getForm().submit({ 
   						params :{fileName:fileName},
             			success: function(form, action){    
                			var fileName=action.result.uploadfileName;
							Ext.getCmp('hiddenFile').setValue(fileName);
                			Ext.get("fileName").dom.value = fileName;  
                			
                			uploadWin.hide();
                			doSave();
             			},         
              			failure: function(form, action){
              				Ext.Msg.alert('失败', '上传失败！');    
              			}  
           			})   
         		}  
        	}  
     	},{     
       		text: '取消',  
       		handler:function(){uploadWin.destroy();}   
        }]   
    });  
	uploadWin.show() ;
}

function doSave() {
	var hiddenFileVal = Ext.getCmp("hiddenFile").getValue();
	var fileExt = hiddenFileVal.substring(hiddenFileVal.lastIndexOf('.') + 1);
	if (fileExt != 'xls') {
		Ext.Msg.show('提示', '文件格式错误，系统目前只支持excel 2003格式的文件。');
		return;
	}
	if (Ext.getDom(Ext.getCmp("form_panel")).form.isValid()) {
		var mask = new Ext.LoadMask(Ext.getBody(), {   
        msg : "正在进行数据校验，请耐心等候。。。"  
	    });
	    mask.show();
		Ext.Ajax.request({
			url : pathUrl+'/projMeaImp_checkImportData.action',  
			params : {
				hiddenFile : Ext.getCmp('hiddenFile').getValue(),
				fileName : Ext.get("fileName").dom.value
			},
			timeout : 300000,
			callback : function(options , request, response){
				var json = Ext.util.JSON.decode(response.responseText);
				mask.hide();
				if(json.success){
					saveImportData(hiddenFileVal);
				}else{
					Ext.MessageBox.hide();
					var failedData = eval(json.info);
					showFailResult(failedData);
					uploadWin.destroy();
				}
			}
		});
	} else {
		Ext.MessageBox.alert('错误', '请正确填写必输项！');
	}
}


// 保存结果
function saveImportData(hiddenFileName) {
	var mask = new Ext.LoadMask(Ext.getBody(), {   
        msg : "数据校验成功，开始保存导入结果，请耐心等候。。。"  
    });
    mask.show();
	Ext.Ajax.request({
		url : pathUrl + '/projMeaImp_saveImportData.action',
		method : 'POST',
		params : {
			hiddenFile:hiddenFileName
		},
		callback : function(options, success, response) {
			var json = Ext.util.JSON.decode(response.responseText);
			if (json.success) {
				mask.hide();
				Ext.MessageBox.hide();
				uploadWin.destroy();
				params = "project_id=" + projectId + "&measure_id=" + measureId
						+ "&year_id=" + yearId + "&cycle_id=" + cycleId
						+ "&object_search=" + encodeURI(encodeURI(object_search));
				filePath = pathUrl + '/projMeaImp_dhtml.action?' + params;
//				load(filePath);
//				Ext.Msg.alert('提示','数据已导入!')
			}else{
				Ext.MessageBox.alert('失败',json.info);
			}
		}
	});
}

//数据校验失败结果
function showFailResult(failedData){   
	var resultDS = new Ext.data.SimpleStore({
        fields: [
           {name: 'line_no'},
           {name: 'failed_reason', type: 'string'}
        ]
    });
    resultDS.loadData(failedData);
	
	var grid = new Ext.grid.GridPanel({
		region:'center',
        store: resultDS,
        columns: [
        	new Ext.grid.RowNumberer(),
            {id:'line_no',header: "Excel行号", width: 80, sortable: true, dataIndex: 'line_no'},
            {id:'failed_reason',header: "失败原因", width: 380, sortable: true,  dataIndex: 'failed_reason'}
        ],
        autoExpandColumn: 'line_no'
    });
    
    var resWin = new Ext.Window({
		title : '下列数据校验失败，请进行修改，重新上传',
		width : 500,
		height : 300,
		plain : true,
		border : false,
		layout : 'border',
		items : [grid],
		buttonAlign:'center',
		buttons: [{ 
			text: '确定',
			handler: function(){
				resWin.destroy();
			}
		}]
	});
	resWin.show();
}

//编辑、删除的ajax方法
function save() {
	Ext.Ajax.request({
		url : pathUrl + '/projMeaImp_save.action?',
		method : 'POST',
		params : {
			project_id : projectId,
			measure_id : measureId,
			year_id : yearId,
			cycle_id : cycleId,
			objectValues : objectValues
		},
		callback : function(options, success, response) {
			var json = Ext.util.JSON.decode(response.responseText);
			if (json.success) {
				objectValues = "";
				Ext.getCmp('save').setDisabled(true);
			} else {
				Ext.Msg.alert('提示', json.info);
			}
		}
	})
};

function deleteValue() {
	Ext.Ajax.request({
		url : pathUrl + '/projMeaImp_delete.action?',
		method : 'POST',
		params : {
			project_id : projectId,
			measure_id : measureId,
			year_id : yearId,
			cycle_id : cycleId,
			object_ids : chSelectIds
		},
		callback : function(options, success, response) {
			var json = Ext.util.JSON.decode(response.responseText);
			if (json.success) {
				chSelectIds = "";
				Ext.Msg.alert('提示', json.info);
				load(filePath);
			} else {
				Ext.Msg.alert('提示', json.info);
			}
		}
	})
};

function load(filePath) {
	mask.show();
	
	Ext.getCmp('save').setDisabled(true);
	Ext.getCmp('delete').setDisabled(true);
	
	dhtmlGrid = new dhtmlXGridObject('center');
	dhtmlGrid.setImagePath(pathUrl + "/public/scripts/dhtmlx/imgs/");
	dhtmlGrid.setSkin("bsc");
//	dhtmlGrid.setColumnHidden(5	,true);
	dhtmlGrid.init();
	dhtmlGrid.enableEditEvents(true,false,true);
	dhtmlGrid.enableEditTabOnly(true);
	dhtmlGrid.enableRowsHover(true, "hover");
	
	dhtmlGrid.attachEvent("onEditCell", function(stage, rId, cInd, nValue, oValue) {
		if (cInd == 0) {//复选框
			if(dhtmlGrid.cells(rId, 0).getValue()==0){
				dhtmlGrid.cells(rId, 0).setValue(1);
				chSelectIds = chSelectIds + dhtmlGrid.cells(rId, 2).getValue()+"@";
			}else{
				dhtmlGrid.cells(rId, 0).setValue(0);
				chSelectIds = replaceAll(chSelectIds, dhtmlGrid.cells(rId, 2).getValue()+"@", "");
			}
			if(chSelectIds!='')
				Ext.getCmp('delete').setDisabled(false);
			else 
				Ext.getCmp('delete').setDisabled(true);
		} else {//编辑框
			if (stage == 0) {
			} else if (stage == 1) {
			} else if (stage == 2) {
				if(isNaN(nValue))
					return false
					
				if (nValue != oValue) {
					var exist = dhtmlGrid.cells(rId, 2).getValue() + "@" + oValue + ";";
					
					objectValues = replaceAll(objectValues, exist, "");
					objectValues = objectValues + dhtmlGrid.cells(rId, 2).getValue() + "@" + formate(nValue) + ";";
					dhtmlGrid.cells(rId, cInd).setValue(formate(nValue)) ;
					
					Ext.getCmp('save').setDisabled(false);
					return true;
				}
			}
		}
	});
	
	dhtmlGrid.load(filePath, function() {
		mask.hide();
	});
	mask.hide();
};

	// 导出模板方法
function exportExcel() {

	var object_ids = '';// 考核对象ID
	var target_amount = '';// 目标任务量
	var gridpanel_length = Ext.getCmp('projecttarget_panel').getSelectionModel().getSelections().length;

	// 查询条件选项
	var year_id = Ext.getCmp('year_code').getValue();
	var project_id = encodeURI(encodeURI(Ext.get('project_code').getValue()));
	var cycle_id = encodeURI(encodeURI(Ext.get('cycle_code').getValue()));
	var measure_record = Ext.getCmp('measure_panel').getSelectionModel().getSelections()[0];
	var measure_id = '';
	if (measure_record != null && measure_record != '') {
		var m_id = measure_record.get('measure_id');
		var measure_name = measure_record.get('measure_name');
		measure_id = encodeURI(encodeURI('[' + m_id + ']' + measure_name));
	}

	if (year_id == '' || year_id == null) {
		Ext.Msg.alert('提示信息', '请选择要生成模板的年度!');
		return false;
	}

	if (project_id == '' || project_id == null) {
		Ext.Msg.alert('提示信息', '请选择要生成模板的方案!');
		return false;
	}

	if (cycle_id == '' || cycle_id == null) {
		Ext.Msg.alert('提示信息', '请选择要生成模板的周期!');
		return false;
	}

	if (gridpanel_length <= 0) {
		Ext.Msg.alert('提示信息', '请选择要生成模板的考核对象数据!');
		return false;
	} else {
		for (var i = 0; i < gridpanel_length - 1; i++) {
			var record = Ext.getCmp('projecttarget_panel').getSelectionModel().getSelections()[i];
			object_ids += record.get('object_id') + ';';
			target_amount += record.get('target_amount') + ';';
		}
		object_ids += Ext.getCmp('projecttarget_panel').getSelectionModel().getSelections()[gridpanel_length - 1].get('object_id');
		target_amount += Ext.getCmp('projecttarget_panel').getSelectionModel().getSelections()[gridpanel_length - 1].get('target_amount');

		var params = '?year_id=' + year_id + '&project_id=' + project_id
				+ '&cycle_id=' + cycle_id + '&measure_id=' + measure_id
				+ '&object_ids=' + object_ids + '&target_amount='
				+ target_amount;
		document.excelForm.action = pathUrl+ "/projectTarget_exportToExcel.action" + params;
		document.excelForm.submit();
	}
};
