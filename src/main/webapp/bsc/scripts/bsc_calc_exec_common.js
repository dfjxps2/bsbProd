/*
 * ------------------------------------------------------------------------------
 * 文件名称：bsc_calculate_publish.js 说 明：JavaScript脚本，提供积分方案测算与发布的维护。 版 本：1.0
 * 修改纪录:
 * ------------------------------------------------------------------------------
 * 时间            修改人    说明
 *               mabo      创建
 * ------------------------------------------------------------------------------
 * 
 */
 /**
 * 发布、撤回方案
 * @param {} appTypeId：发布状态
 */
function doPublish(appTypeId) {
	Ext.Msg.wait('正在处理,请稍候...','提示信息');
	Ext.Ajax.request({
		method : 'POST',
		url : pathUrl + '/bscProject_common.action?method=doPublish',
		params : {
			project_id : projectId,
			app_type_id : appTypeId
		},
		callback : function(options, success, response) {
			var json = Ext.util.JSON.decode(response.responseText);
			if (success) {
				Ext.MessageBox.alert("提示信息", json.info);
				projectStore.reload();
				projectId = '';
			} else {
				Ext.MessageBox.alert("提示信息", json.info);
			}
		}
	});
}



 /**
 * 考核周期 00：月 01：季 02：年
 */
function cycleType(val) {
	if (val == '00')
		return '月';
	else if (val == '01')
		return '季'
	else if (val == '02')
		return '年'
	else
		return val
};

 /**
 * 考核对象类型 ZJ：镇街 BM：区属部门 CBM：市属部门
 */
function objCate(val) {
	if (val == 'ZJ')
		return '镇街';
	else if (val == 'BM')
		return '区属部门'
	else if (val == 'CBM')
		return '市属部门'
	else
		return val
};

 /**
 * 方案应用类型 00：发布方案 01：测算方案
 */
function appTypeId(val) {
	if (val == '00')
		return '<span style="color:green;">已发布</span>';
	else if (val == '01')
		return '<span style="color:red;">未发布</span>';
	else
		return val
};

 /**
 * 方案应用类型 Y：是 N：否
 */
/*function isTemplate(val) {
	if (val == 'Y')
		return '方案模板';
	else if (val == 'N')
		return '应用方案'
	else
		return val
};*/