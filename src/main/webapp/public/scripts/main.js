MainFrameUI = Ext.extend(Ext.Viewport,{
	layout : 'border',
	initComponent : function(){
	new Ext.applyIf(this,{
			items: [{
				xtype : 'panel',
				region : 'north',
				height : 54,
				hideCollapseTool : true,
				contentEl : 'north'
			},{
					id : 'centerDiv',
					region : 'center',
					contentEl : 'center',
					autoScroll : false
				},{
				region : 'west',
				xtype : 'panel',
				width : 200,
				layout : 'border',
				height: '100%',
				collapsible : true,
				border : false,
				split : true,
				collapseMode : 'mini',
//				title: '菜单',
				hideCollapseTool : true,
				bodyStyle : 'padding:0px,0px,0px,0px;',
				contentEl : 'west',
				frame : false,
				items : [{
					region : 'center',
					contentEl : 'menu_parent',
					width : '100%',
					bodyStyle : 'padding:0px,0px,0px,0px',
					split: false,
					border : false
				}]
			}]
		});
		MainFrameUI.superclass.initComponent.call(this);
	}
});

var tabManager = null;
$(function() {
	var mainFrame = new MainFrameUI();
	height = $("#centerDiv").height()-30;
	GetMenuID();
	menuFix();

	$("#center").ligerTab();
	tabManager = $("#center").ligerGetTabManager();
	tabManager.addTabItem({
		tabid : 'init',
		text : '初始页',
		height : height,
		showClose : false,
		url : pathUrl + '/bsc/init_defaultPage.action'
	});
	var h = $('#menu_parent').height();
	$('#menu').height(h-34).css('overflow-y','auto');
	////导航可移动
	var obj = document.getElementById('navigate_hanlde');
	if(obj){
	obj.onmousedown = function(e){var e = e|| event;_D = true,_X = e.offsetX,_Y = e.offsetY;};
	obj.onmouseup=function(){_D = false;}; 
	obj.onmouseout = function(){_D = false;};
	obj.onmousemove=function(e){var e = e||event;if(_D){var o = document.getElementById('navigate_layout');o.style.left = (e.clientX-parseInt(_X))+'px';o.style.top = (e.clientY-parseInt(_Y))+'px';}};
	}
	
	$("a:contains('初始页')").html("初始页<span id='setInitPage' style='color:blue'>[设置]</span>");
	$("#setInitPage").click(setInitPage);
});


//添加Tab页面
addPage = function(id,title,url){
	if(url.indexOf(".jsp") == -1 && url.indexOf(".action") == -1){
		url += 'skip.action?rid='+id;
	}
	tabManager.addTabItem({
		tabid : id,
		text : title,
		height : height,
		changeHeightOnResize : true,
		showClose : true,
		url : pathUrl + url
	});
}

//打开多个Tab面板
addArrayPage = function(array){
	var exist = tabManager.isTabItemExist(array[0][0])
	if(exist){
		tabManager.selectTabItem(array[0][0]);
		return;
	}
	
	if(tabManager.getTabidList().length>10){
		Ext.Msg.show({
			title:'提示信息',
			msg:'打开窗口太多，容易导致浏览器崩溃，请先关闭部分页面!',
			buttons:Ext.MessageBox.OK,
			icon:Ext.MessageBox.WARNING
		});
		return ;
	}
	
	for(var i=0;i<array.length;i++){
		addPage(array[i][0],array[i][1],array[i][2])
	}
	tabManager.selectTabItem(array[0][0]);
}

function gotoPage(id,title,url){
	
	var exist = tabManager.isTabItemExist(id);
	if(exist){
		tabManager.selectTabItem(id);
		return;
	}
	
	if(tabManager.getTabidList().length>10){
		Ext.Msg.show({
			title:'提示信息',
			msg:'打开窗口太多，容易导致浏览器崩溃,请先关闭部分页面!',
			buttons:Ext.MessageBox.OK,
			icon:Ext.MessageBox.WARNING
		});
		return ;
	}

	addPage(id,title,url);
	tabManager.selectTabItem(id);
}
