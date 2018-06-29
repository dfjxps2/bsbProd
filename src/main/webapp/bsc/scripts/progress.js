var flag=0;//执行状态代码

/**
 * 执行方案方法
 */
function doStart() {
	if (flag = 1) {
		flag = 0;
	}

	Ext.Ajax.request({
		url : pathUrl + '/bscprojectexe_execute.action',
		waitMsg : '正在处理,请稍候......',
		method : 'POST',
		params : {
			projectID : projectID,
			monthID : monthID,
			cycleTypeID : cycleTypeID,
			fullScore : fullScore,
			published : published
		},
		callback : function(options, success, response) {
			var json = Ext.util.JSON.decode(response.responseText);
			if (json.success) {
				Ext.MessageBox.hide();
				setStatus('start');
			} else {
				setStatus('exception');
				Ext.MessageBox.alert('提示信息', json.info);
			}
		},

		failure : function(response, options) {
			clearInterval(listener);
			Ext.MessageBox.hide();
			Ext.MessageBox.alert('提示信息',Ext.util.JSON.decode(response.responseText).info);
		},

		success : function(response, options) {
			Ext.MessageBox.hide();
		}
	});
}

/**
 * 停止方案执行方法
 */
function doStop() {
	flag = 1;

	Ext.Ajax.request({
		url : pathUrl + '/bscprojectexe_stop.action',
		waitMsg : '正在处理,请稍候......',
		method : 'POST',
		params : {},

		callback : function(options, success, response) {
			var json = Ext.util.JSON.decode(response.responseText);
			if (json.success == true) {
				setStatus('stop');
				Ext.getCmp('progressBar').updateText('正在初始化');
			} else {
				setStatus('exception');
				Ext.MessageBox.alert("提示信息", json.info + '');
			}
		},

		failure : function(response, options) {
			clearInterval(listener);
			Ext.MessageBox.hide();
			Ext.MessageBox.alert('提示信息',Ext.util.JSON.decode(response.responseText).info);
		},

		success : function(response, options) {
			Ext.MessageBox.hide();
		}
	});
}

/**
 * 考核执行进度条更新方法
 */
var ProgressRunner = function() {
	var update = function(index, pbar, count, time) {
		pbar.updateProgress(index / count, '已完成 ' + index + ' of ' + count + ' ' + time);
	};

	var reset = function(pbar) {
		$("#logPanel").html('');
		pbar.updateText('正在初始化');
	}

	var over = function(pbar) {
		pbar.updateProgress(1);
		pbar.updateText('计算完成');
	}

	var loop = function(pbar) {
		return function() {
			Ext.Ajax.request({
				url : pathUrl + '/bscprojectexe_queryStatus.action',
				method : 'POST',
				callback : function(options, success, response) {
					var json = Ext.util.JSON.decode(response.responseText);
					if (json.success) {
						var count = json.count;
						var index = json.index;
						var state = json.state;
						var e = json.exception;
						var time = json.time;
						var obj = json.log;
						getLogInfo(obj);
						if (state == 1) {
							update(index, pbar, count, time);
							over(pbar);
							setStatus('stop');
						} else if (state == 2) {
							Ext.MessageBox.alert('提示信息',e);
							setStatus('exception');
							reset(pbar);
						} else
							update(index, pbar, count, time);
					} else {
						Ext.MessageBox.alert('提示信息', json.info);
					}

				},

				failure : function(response, options) {
					clearInterval(listener);
					Ext.MessageBox.hide();
					Ext.MessageBox.alert("提示信息","后台服务错误，请联系管理员");
				},

				success : function(response, options) {
					Ext.MessageBox.hide();
				}
			});
		};
	};

	return {
		run : function(pbar) {
			reset(pbar);
			doStart();
			listener = setInterval(loop(pbar), 1200);
		}
	}
}();

/**
 * 更新执行状态方法 并执行对应语句
 * @param {} status
 */
function setStatus(status) {
	if (status == 'start') {
		//开始状态执行方法
		Ext.getCmp('start').disable();
		Ext.getCmp('stop').enable();
		Ext.getCmp('close').disable();
	} else if (status == 'stop') {
		//停止状态执行方法
		Ext.getCmp('start').enable();
		Ext.getCmp('stop').disable();
		Ext.getCmp('close').enable();
		clearInterval(listener);
		if (flag == 1) {
			//手动停止
			flag = 0;
			return;
		}
		
		if (published == '0') {
			//未发布方案测算
			Ext.Msg.show({
				title : '提示信息',
				msg : '计算完成，点击查看计算结果。',
				buttons : Ext.Msg.OK,
				fn : function() {
					Ext.getCmp('start').disable();
					Ext.getCmp('stop').disable();
					Ext.getCmp('close').enable();
					Ext.getCmp('projWin').close();

					var str = "left=0,screenX=0,top=0,screenY=0,resizable=yes";
					if (window.screen) {
						var ah = screen.availHeight - 35;
						var aw = screen.availWidth - 10;
						str += ",height=" + ah;
						str += ",innerHeight=" + ah;
						str += ",width=" + aw;
						str += ",innerWidth=" + aw;
					} else {
						str += ",resizable";
					}
					window.open(pathUrl
							+ "/kpi/QueryEpmTestResult.jsp?projectID="
							+ projectID + "&month_id=" + dateID + "&roleID="
							+ roleID, "EPM" + dateID, str);

				},
				animEl : 'elId',
				icon : Ext.MessageBox.WARNING
			});
		} else {
			//已发布方案测算
			Ext.Msg.show({
				title : '提示信息',
				msg : '计算完成，请在[方案结果]中查询计算结果',
				buttons : Ext.Msg.OK,
				fn : function() {
//					Ext.getCmp('start').disable();
//					Ext.getCmp('stop').disable();
//					Ext.getCmp('close').enable();
//					Ext.getCmp('projWin').close();
					exeInfoStore.reload();
				},
				animEl : 'elId',
				icon : Ext.MessageBox.WARNING
			});
		}
	} else {
		//未知状态
		Ext.getCmp('start').enable();
		Ext.getCmp('stop').disable();
		Ext.getCmp('close').enable();
		clearInterval(listener);
	}
}
