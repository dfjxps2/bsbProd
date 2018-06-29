var _searchPaths,_searchPath,_searchCount;//公共指标与私有指标主页面搜索方法定义参数
var scd_pub_Paths,scd_pub_searchPath,scd_pub_searchCount;//二级页面公共树参数
var scd_pri_searchPaths,scd_pri_searchPath,scd_pri_searchCount;//二级页面私有树参数
function addSearchToolbar(config){
	var oldToolbar = config.oldToolbar ? config.oldToolbar : '';
	var expandMethod = config.expandMethod ? config.expandMethod : '';
	var treePanelId = config.treePanelId ? config.treePanelId : '';
	var is_private = config.is_private ? config.is_private : '';
	var _toolbar = ['-','搜索: ',
        {
            xtype : 'textfield',
            id : 'textfield'+treePanelId,
            width : '135',
            emptyText : '请输入指标ID或名称...',
            listeners : {
                specialkey : function(field, e) {
                    var str_id=field.getValue();
                    if (e.getKey() == Ext.EventObject.ENTER && str_id) {
                        searchNode(str_id,expandMethod,treePanelId,pathUrl+'/selector_getPath.action',is_private);
                    }
                }
            }
        },'-',{
        xtype : 'button',
        iconCls : 'search',
        handler : function(){
            var str_keyword=Ext.getCmp('textfield'+treePanelId).getValue();
            if(str_keyword){
              	  searchNode(str_keyword,expandMethod,treePanelId,pathUrl+'/selector_getPath.action',is_private);
            }else{
                Ext.getCmp('nextBtn' + treePanelId).setDisabled(true);
                Ext.getCmp('nextBtn' + treePanelId).setText('下一个');
            }
        }
    },'-',{
        xtype : 'button',
        id : 'nextBtn'+treePanelId,
        text : '下一个',
        disabled : true,
        handler : function(){
        	if('measureTreePanel'==treePanelId ){
	            _searchCount+=1;
	            _searchCount=_searchCount==_searchPaths.length?0:_searchCount;
	            _searchPath=_searchPaths[_searchCount].path.split(',');
        	}else if('baseTree'==treePanelId){//二级公共树
            	scd_pub_searchCount+=1;
	            scd_pub_searchCount=scd_pub_searchCount==scd_pub_searchPaths.length?0:scd_pub_searchCount;
	            scd_pub_searchPath=scd_pub_searchPaths[scd_pub_searchCount].path.split(',');
        	}else if('privateTree'==treePanelId){//二级私有树
            	scd_pri_searchCount+=1;
	            scd_pri_searchCount=scd_pri_searchCount==scd_pri_searchPaths.length?0:scd_pri_searchCount;
	            scd_pri_searchPath=scd_pri_searchPaths[scd_pri_searchCount].path.split(',');
        	}else if('baseMeasureTreePanel'==treePanelId ){
        		_searchCount+=1;
	            _searchCount=_searchCount==_searchPaths.length?0:_searchCount;
	            _searchPath=_searchPaths[_searchCount].path.split(',');
        	}
        	expandMethod(Ext.getCmp(treePanelId).getRootNode());
        }
    }];
    oldToolbar.add(_toolbar);
}


function searchNode(keyword , expendMethod , treePanelId , Pathurl , is_private){
	
    Ext.Ajax.request({
        url : Pathurl,
        params : {keyword: keyword , is_private : is_private,obj_cate_id : obj_cate_id,pageindex : pageindex},
        failure : function(response, options) {
            Ext.MessageBox.alert('消息',Ext.util.JSON.decode(response.responseText).info);
		},
		success : function(response, options) {
			var obj_json=Ext.util.JSON.decode(response.responseText),
			    arr_results=obj_json.results
			    int_l=arr_results.length,
			    obj_btn=Ext.getCmp('nextBtn' + treePanelId);
			_searchCount=0;scd_pub_searchCount=scd_pri_searchCount=0;//置0
			if(arr_results){
			    if(int_l>0){
			    	if('measureTreePanel'==treePanelId){
				        _searchPaths=arr_results;
				        _searchPath=arr_results[0].path.split(',');
			    	}else if('baseTree'==treePanelId){
			    		scd_pub_searchPaths=arr_results;
				        scd_pub_searchPath=arr_results[0].path.split(',');
			    	}else if('privateTree'==treePanelId){
			    		scd_pri_searchPaths=arr_results;
				        scd_pri_searchPath=arr_results[0].path.split(',');
			    	}else if('baseMeasureTreePanel'==treePanelId ){
		        		_searchPaths=arr_results;
				        _searchPath=arr_results[0].path.split(',');
		        	}
			        obj_btn.setDisabled(false);
//			        obj_btn.setText('下一个(共'+arr_results.length+'个)');
			        obj_btn.setText('下一个')
			        expendMethod(Ext.getCmp(treePanelId).getRootNode());
			    }else{
			        obj_btn.setDisabled(true);
			        obj_btn.setText('下一个');
			        Ext.Msg.alert('消息','未找到对象.');
			    }
			}else{
			    obj_btn.setDisabled(true);
			    obj_btn.setText('下一个');
			    Ext.MessageBox.alert('消息',obj_json.info);
			}
		}
   });
}