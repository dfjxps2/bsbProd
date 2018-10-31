﻿﻿﻿function getRootNode(id, text, fn) {
	var root = new Ext.tree.AsyncTreeNode({
		id : id,
		text : text,
		qtip: text,
		children : [{
			text : 'loading',
			cls : 'x-tree-node-loading',
			leaf : true
		}]
	});
	if (fn != undefined)
		root.on('expand', fn);

	return root;
}

function getCheckedNode(id,text,checked,fn){
	var root = new Ext.tree.AsyncTreeNode({
		id:id,
		text:text,
		checked:checked,
		children:[{
			text:'loading',
			cls: 'x-tree-node-loading',
			leaf:true
		}]
	});

	if(fn!=undefined)
		root.on('expand',fn);

	return root;
}

/**
 * 获取考核全局参数节点
 * @param {} node
 */
function expandPublicParameterTreeNode(node) {
	if (node.firstChild.text == 'loading') {
		Ext.Ajax.request({
			url : pathUrl + '/bscParameter_common.action?method=listParameter&param_type_id=01',
			waitMsg : '正在处理，请稍候......',
			method : 'POST',
			params : {
				key_type : node.id
			},

			callback : function(options, success, response) {
				var json = Ext.util.JSON.decode(response.responseText);
				var tl = json.results;
				if (tl) {
					for (var i = 0; i < tl.length; i++) {
						var cnode = new Ext.tree.AsyncTreeNode({
							id : tl[i].parameter_id,
							text : '[' + tl[i].parameter_id + ']' + tl[i].parameter_name,
							leaf : true
						});
						node.appendChild(cnode);
					}
				} else {
					Ext.MessageBox.alert('错误', json.info);
				}
				node.firstChild.remove();
			},

			failure : function(response, options) {
				Ext.MessageBox.alert('错误', response.responseText);
			},

			success : function(response, options) {
			}
		});
	}
}
/**
 * 获取考核私有参数节点
 * @param {} node
 */
function expandPrivateParameterTreeNode(node) {
	if (node.firstChild.text == 'loading') {
		Ext.Ajax.request({
			url : pathUrl + '/bscParameter_common.action?method=listParameter&param_type_id=02',
			waitMsg : '正在处理，请稍候......',
			method : 'POST',
			params : {
				key_type : node.id
			},

			callback : function(options, success, response) {
				var json = Ext.util.JSON.decode(response.responseText);
				var tl = json.results;
				if (tl) {
					for (var i = 0; i < tl.length; i++) {
						var cnode = new Ext.tree.AsyncTreeNode({
							id : tl[i].parameter_id,
							text : '[' + tl[i].parameter_id + ']' + tl[i].parameter_name,
							leaf : true
						});
						node.appendChild(cnode);
					}
				} else {
					Ext.MessageBox.alert('错误', json.info);
				}
				node.firstChild.remove();
			},

			failure : function(response, options) {
				Ext.MessageBox.alert('错误', response.responseText);
			},

			success : function(response, options) {
			}
		});
	}
}

/**
 * 展开带复选框的产品树
 * @param {} node
 */
function expandBasicMeasureTreeNode(node) {
	if (node.firstChild.text == 'loading') {
		Ext.Ajax.request({
			url : pathUrl + '/selector_getProductTreeNode.action',
			waitMsg : '正在处理，请稍候......',
			method : 'POST',
			params : {
				nodeID : node.id
			},

			callback : function(options, success, response) {
				var json = Ext.util.JSON.decode(response.responseText);
				var tl = json.results;
				if (tl) {
					for (var i = 0; i < tl.length; i++) {
						var cnode = new Ext.tree.AsyncTreeNode({
							id : tl[i].measure_id,
							text : '[' + tl[i].measure_id + ']' + tl[i].measure_name,
							leaf : tl[i].leaf,
							checked : false,
							children : [{
								text : 'loading',
								cls : 'x-tree-node-loading',
								leaf : true
							}]
						});
						cnode.on('expand', expandBasicMeasureTreeNode);
						node.appendChild(cnode);
					}
				} else {
					Ext.MessageBox.alert('错误', json.info);
				}
				node.firstChild.remove();
			},

			failure : function(response, options) {
				Ext.MessageBox.alert('错误', response.responseText);
			},
			success : function(response, options) {
			}
		});
	}
}

/**
 * 展开指标树方法
 * 
 * @param {}
 *            node
 */
function expandMyMeasureTreeNode(node) {
	if (node.firstChild.text == 'loading') {
		var url = pathUrl + '/privateMeasure_common.action';
		var is_private = node.attributes.is_private;
		if(is_private == 'N') {
			url = pathUrl + '/publicMeasure_common.action'
		}
		
		Ext.Ajax.request({
			url : url,
			waitMsg : '正在处理,请稍候......',
			method : 'POST',
			params : {
				method : 'listEngMeasure',
				parent_measure_id : node.id
			},

			callback : function(options, success, response) {
				var json = Ext.util.JSON.decode(response.responseText);
				var tl = json.results;
				var cls='';
				if (tl) {
					for (var i = 0; i < tl.length; i++) {
						if ('00' == tl[i].source_type_id) {
							cls = 'x-tree-node-datasource';
						} else if ('01' == tl[i].source_type_id) {
							cls = 'x-tree-node-compound';
						} else if ('02' == tl[i].source_type_id) {
							cls = 'x-tree-node-external';
						} else {
							cls = '';
						}
						var cnode = new Ext.tree.AsyncTreeNode({
							id : tl[i].measure_id,
							text :(i+1)+'. [' + tl[i].measure_id + ']'
									+ tl[i].measure_name,
							leaf : tl[i].is_leaf == 'Y' ? true : false,
							source_type_id : tl[i].source_type_id,
							is_private : tl[i].is_private,
							obj_cate_id : tl[i].obj_cate_id,
							measure_name : tl[i].measure_name,
							qtip: tl[i].measure_desc,
							cls : cls,
							children : [{
								text : 'loading',
								cls : 'x-tree-node-loading',
								leaf : true
							}]
						});
						cnode.on('expand', expandMyMeasureTreeNode);
						node.appendChild(cnode);
					}
					//添加bsc_public_measure页面搜索
					if (_searchPath && _searchPath.length > 0) {
							var obj_child = node.findChild('id', _searchPath.shift());
							if (obj_child) {
								if (_searchPath.length == 0) {
									obj_child.select();
									if(page == 'bsc_public_measure' || page =='bsc_private_measure'){
										Ext.getCmp('measureTreePanel').fireEvent('click',obj_child);
									}else if(page =='bsc_project_measure' && node.attributes.is_private=='N'){
										Ext.getCmp('baseMeasureTreePanel').fireEvent('click',obj_child);
									}
								} else {
									obj_child.expand();
								}
							} else {
								Ext.Msg.alert('消息', '未找到对象.');
							}
						}
                    //添加完毕
					//添加bsc_project_measure搜索
					if (scd_pub_searchPath && scd_pub_searchPath.length > 0) {
							var obj_child = node.findChild('id', scd_pub_searchPath.shift());
							if (obj_child) {
								if (scd_pub_searchPath.length == 0) {
									obj_child.select();
								} else {
									obj_child.expand();
								}
							} else {
								Ext.Msg.alert('消息', '未找到对象.');
							}
						}
                    //添加完毕
				} else {
					Ext.MessageBox.alert('错误', json.info);
				}
				node.firstChild.remove();
			},

			failure : function(response, options) {
				Ext.MessageBox.alert('错误', response.responseText);
			},

			success : function(response, options) {
			}
		});
	}
	//添加搜索
	else{
		if(node.isLoaded()){
			node.expand();
		}
		//bsc_public_measure页面
        if(_searchPath && _searchPath.length>0){
            var obj_child=node.findChild('id',_searchPath.shift());
            
            if(obj_child){
                if(_searchPath.length==0){
                    obj_child.select();
                    if(page == 'bsc_public_measure' || page =='bsc_private_measure'){
						Ext.getCmp('measureTreePanel').fireEvent('click',obj_child);
					}else if(page =='bsc_project_measure' && node.attributes.is_private=='N'){
						Ext.getCmp('baseMeasureTreePanel').fireEvent('click',obj_child);
					}
                }else{
                    if(obj_child.isLoaded()){//节点加载过则返回true
                        expandMyMeasureTreeNode(obj_child);
                    }else{
                        obj_child.expand(true);
                    }
                }
            }else{
                Ext.Msg.alert('消息','未找到对象.');
            }
        }
        //bsc_project_measure页面
        if(scd_pub_searchPath && scd_pub_searchPath.length>0){
            var obj_child=node.findChild('id',scd_pub_searchPath.shift());
            
            if(obj_child){
                if(scd_pub_searchPath.length==0){
                    obj_child.select();
                }else{
                    if(obj_child.isLoaded()){//节点加载过则返回true
                        expandMyMeasureTreeNode(obj_child);
                    }else{
                        obj_child.expand(true);
                    }
                }
            }else{
                Ext.Msg.alert('消息','未找到对象.');
            }
        }
    }
    //添加完毕
}


/**
 * 展开指标树方法
 * 
 * @param {}
 *            node
 */
function expandSearchMeasureTreeNode(node) {
	path = '';
	
	if (node.firstChild.text == 'loading') {
		var url = pathUrl + '/privateMeasure_common.action';
		var is_private = node.attributes.is_private;
		if(is_private == 'N') {
			url = pathUrl + '/publicMeasure_common.action'
		}
		
		if(obj_cate_id != null) {
					url += "?obj_cate_id="+obj_cate_id;
		}
		
		Ext.Ajax.request({
			url : url,
			waitMsg : '正在处理,请稍候......',
			method : 'POST',
			params : {
				method : 'listEngMeasure',
				parent_measure_id : node.id
			},

			callback : function(options, success, response) {
				var json = Ext.util.JSON.decode(response.responseText);
				var tl = json.results;
				var cls='';
				if (tl) {
					for (var i = 0; i < tl.length; i++) {
						if ('00' == tl[i].source_type_id) {
							cls = 'x-tree-node-datasource';
						} else if ('01' == tl[i].source_type_id) {
							cls = 'x-tree-node-compound';
						} else if ('02' == tl[i].source_type_id) {
							cls = 'x-tree-node-external';
						} else {
							cls = '';
						}
						var cnode = new Ext.tree.AsyncTreeNode({
							id : tl[i].measure_id,
							text :(i+1)+'. [' + tl[i].measure_id + ']'
									+ tl[i].measure_name,
							leaf : tl[i].is_leaf == 'Y' ? true : false,
							source_type_id : tl[i].source_type_id,
							is_private : tl[i].is_private,
							obj_cate_id : tl[i].obj_cate_id,
							measure_name : tl[i].measure_name,
							qtip: tl[i].measure_desc,
							cls : cls,
							children : [{
								text : 'loading',
								cls : 'x-tree-node-loading',
								leaf : true
							}]
						});
						cnode.on('expand', expandSearchMeasureTreeNode);
						node.appendChild(cnode);
					}
					//添加搜索
				    if (node.attributes.is_private == 'N') {
						path = scd_pub_searchPath;
					} else if(node.attributes.is_private == 'Y'){
						path = scd_pri_searchPath;
					}
					if (path && path.length > 0) {
							var obj_child = node.findChild('id', path.shift());
							if (obj_child) {
								if (path.length == 0) {
									obj_child.select();
								} else {
									obj_child.expand();
								}
							} else {
								Ext.Msg.alert('消息', '未找到对象.');
							}
						}
                    //添加完毕
				} else {
					Ext.MessageBox.alert('错误', json.info);
				}
				node.firstChild.remove();
			},

			failure : function(response, options) {
				Ext.MessageBox.alert('错误', response.responseText);
			},

			success : function(response, options) {
			}
		});
	}
	//添加搜索
	else{
		if(node.isLoaded()){
			node.expand();
		}
		if (node.attributes.is_private == 'N') {
			path = scd_pub_searchPath;
		} else if(node.attributes.is_private == 'Y'){
			path = scd_pri_searchPath;
		}
        if(path && path.length>0){
            var obj_child=node.findChild('id',path.shift());
            
            if(obj_child){
                if(path.length==0){
                    obj_child.select();
                }else{
                    if(obj_child.isLoaded()){//节点加载过则返回true
                        expandSearchMeasureTreeNode(obj_child);
                    }else{
                        obj_child.expand(true);
                    }
                }
            }else{
                Ext.Msg.alert('消息','未找到对象.');
            }
        }
    }
    //添加完毕
}

/**
 * 展开指标树方法
 * 
 * @param {}
 *            node
 */
function expandMyMeasureTreeNode2(node) {
	if (node.firstChild.text == 'loading') {
		var url = pathUrl + '/privateMeasure_common.action';
		var is_private = node.attributes.is_private;
		if(is_private == 'N') {
			url = pathUrl + '/publicMeasure_common.action'
		}
		Ext.Ajax.request({
			url : url,
			waitMsg : '正在处理,请稍候......',
			method : 'POST',
			params : {
				method : 'listEngMeasure',
				parent_measure_id : node.id
			},

			callback : function(options, success, response) {
				var json = Ext.util.JSON.decode(response.responseText);
				var tl = json.results;
				var cls;
				if (tl) {
					for (var i = 0; i < tl.length; i++) {
						if ('00' == tl[i].source_type_id) {
							cls = 'x-tree-node-datasource';
						} else if ('01' == tl[i].source_type_id) {
							cls = 'x-tree-node-compound';
						} else if ('02' == tl[i].source_type_id) {
							cls = 'x-tree-node-external';
						} else {
							cls = '';
						}
						var cnode = new Ext.tree.AsyncTreeNode({
							id : tl[i].measure_id,
							text :(i+1) + '.[' + tl[i].measure_id + ']'
									+ tl[i].measure_name,
							leaf : tl[i].is_leaf == 'Y' ? true : false,
							is_private : tl[i].is_private,
							source_type_id : tl[i].source_type_id,
							obj_cate_id : tl[i].obj_cate_id,
							checked : false,
							cls : cls,
							measure_name : tl[i].measure_name,
							qtip: tl[i].measure_desc,
							children : [{
								text : 'loading',
								cls : 'x-tree-node-loading',
								leaf : true
							}]
						});
						cnode.on('expand', expandMyMeasureTreeNode2);
						
						cnode.on("checkchange", function(node, state) {
							if (state) {
								addRelaRecord(node);
							} else {
								deleteRelaRecord(node.id);
							}
						});
						
						node.appendChild(cnode);
						
						if(store.find('measure_id',tl[i].measure_id) != -1) {
							cnode.getUI().toggleCheck(true);
						}
					}
				} else {
					Ext.MessageBox.alert('错误', json.info);
				}
				node.firstChild.remove();
			},

			failure : function(response, options) {
				Ext.MessageBox.alert('错误', response.responseText);
			},

			success : function(response, options) {
			}
		});
	}
}


///**
// * 展开BSC基础指标树方法
// * 
// * @param {}
// *            node
// */
//function expandBaseEngMeasureTreeNode(node) {
//	if (node.firstChild.text == 'loading') {
//		Ext.Ajax.request({
//			url : pathUrl + '/privateMeasure_common.action',
//			waitMsg : '正在处理,请稍候......',
//			method : 'POST',
//			params : {
//				method : 'listBaseEngMeasure',
//				parent_measure_id : node.id
//			},
//
//			callback : function(options, success, response) {
//				var json = Ext.util.JSON.decode(response.responseText);
//				var tl = json.results;
//				if (tl) {
//					for (var i = 0; i < tl.length; i++) {
//						var cnode = new Ext.tree.AsyncTreeNode({
//							id : tl[i].measure_id,
//							text : '[' + tl[i].measure_id + ']'
//									+ tl[i].measure_name,
//							leaf : false,
//							obj_cate_id : tl[i].obj_cate_id,
//							source_type_id : tl[i].source_type_id,
//							measure_name : tl[i].measure_name,
//							qtip: '[' + tl[i].measure_id + ']'
//									+ tl[i].measure_name,
//							children : [{
//								text : 'loading',
//								cls : 'x-tree-node-loading',
//								leaf : true
//							}]
//						});
//						cnode.on('expand', expandEngMeasureTreeNode);
//						node.appendChild(cnode);
//					}
//				} else {
//					Ext.MessageBox.alert('错误', json.info);
//				}
//				node.firstChild.remove();
//			},
//
//			failure : function(response, options) {
//				Ext.MessageBox.alert('错误', response.responseText);
//			},
//
//			success : function(response, options) {
//			}
//		});
//	}
//}
//
///**
// * 展开BSC基础指标树方法
// * 
// * @param {}
// *            node
// */
//function expandBaseEngMeasureTreeNode2(node) {
//	if (node.firstChild.text == 'loading') {
//		Ext.Ajax.request({
//			url : pathUrl + '/privateMeasure_common.action',
//			waitMsg : '正在处理,请稍候......',
//			method : 'POST',
//			params : {
//				method : 'listBaseEngMeasure',
//				parent_measure_id : node.id
//			},
//
//			callback : function(options, success, response) {
//				var json = Ext.util.JSON.decode(response.responseText);
//				var tl = json.results;
//				if (tl) {
//					for (var i = 0; i < tl.length; i++) {
//						var cnode = new Ext.tree.AsyncTreeNode({
//							id : tl[i].measure_id,
//							text : '[' + tl[i].measure_id + ']'
//									+ tl[i].measure_name,
//							leaf : false,
//							checked : false,
//							source_type_id : tl[i].source_type_id,
//							obj_cate_id : tl[i].obj_cate_id,
//							measure_name : tl[i].measure_name,
//							qtip: '[' + tl[i].measure_id + ']'
//									+ tl[i].measure_name,
//							children : [{
//								text : 'loading',
//								cls : 'x-tree-node-loading',
//								leaf : true
//							}]
//						});
//						cnode.on('expand', expandBaseEngMeasureTreeNode2);
//						cnode.on("checkchange", function(node, state) {
//							if (state) {
//								addRelaRecord(node, '1');
//							} else {
//								deleteRelaRecord(node.id);
//							}
//						});
//						
//						node.appendChild(cnode);
//						
//						if(store.find('measure_id',tl[i].measure_id) != -1) {
//							cnode.getUI().toggleCheck(true);
//						}
//					}
//				} else {
//					Ext.MessageBox.alert('错误', json.info);
//				}
//				node.firstChild.remove();
//			},
//
//			failure : function(response, options) {
//				Ext.MessageBox.alert('错误', response.responseText);
//			},
//
//			success : function(response, options) {
//			}
//		});
//	}
//}

/**
 * 维度字段数据源显示树形结构
 * @param {} node
 * selectLinkId:维度链接ID
 */
function expandDimLinkTreeNode(node) {
	if (node.firstChild.text == 'loading' && selectLinkId != '') {
		Ext.Ajax.request({
			url : pathUrl + '/dimLink_expandDimLinkTree.action',
			waitMsg : '正在处理,请稍候......',
			method : 'POST',
			params : {
				parentNodeID : node.id,
				linkId :selectLinkId
			},

			callback : function(options, success, response) {
				var json = Ext.util.JSON.decode(response.responseText);
				var tl = json.results;
				if (tl) {
					for (var i = 0; i < tl.length; i++) {
						var cnode = new Ext.tree.AsyncTreeNode({
							id : tl[i].id,
							text : '[' + tl[i].id + ']' + tl[i].name,
							leaf : tl[i].leaf,
							children : [{
								text : 'loading',
								cls : 'x-tree-node-loading',
								leaf : true
							}]
						});
						if(node.attributes.checked != undefined) {
							cnode.attributes.checked = false;
						}
						cnode.on('expand', expandDimLinkTreeNode);
						node.appendChild(cnode);
						
						if(node.id == cnode.getOwnerTree().getRootNode().id) {
							cnode.expand();						
						}
					}
				} else {
					Ext.MessageBox.alert('错误', json.info);
				}
				node.firstChild.remove();
			},

			failure : function(response, options) {
				Ext.MessageBox.alert('错误', response.responseText);
			},

			success : function(response, options) {
			}
		});
	}
}

/**
 * 考核对象树形显示
 * @param {} node
 */
function expandObjGroupTreeNode(node) {
	if (node.firstChild.text == 'loading') {
		Ext.Ajax.request({
			url : pathUrl + '/bscObjectView_common.action?method=expandObjGroupTree&group_cate_id=00',
			waitMsg : '正在处理,请稍候......',
			method : 'POST',
			params : {
				parentNodeID : node.id,
				obj_cate_id :obj_cate_id
			},

			callback : function(options, success, response) {
				var json = Ext.util.JSON.decode(response.responseText);
				var tl = json.results;
				if (tl) {
					for (var i = 0; i < tl.length; i++) {
						var cnode = new Ext.tree.AsyncTreeNode({
							id : tl[i].id,
							text : tl[i].name,
							leaf : tl[i].leaf,
							children : [{
								text : 'loading',
								cls : 'x-tree-node-loading',
								leaf : true
							}]
						});
						if(node.attributes.checked != undefined) {
							cnode.attributes.checked = false;
						}
						
						cnode.on('expand', expandObjGroupTreeNode);
						node.appendChild(cnode);
						cnode.expand();
						if(node.attributes.checked != undefined) {
							if(relationStore.indexOfId(tl[i].id) != -1) {
								cnode.getUI().toggleCheck(true);
								Ext.getCmp('addGroupView').setDisabled(true);
							}
							cnode.expand(true);
						}
					}
				} else {
					Ext.MessageBox.alert('错误', json.info);
				}
				node.firstChild.remove();
			},

			failure : function(response, options) {
				Ext.MessageBox.alert('错误', response.responseText);
			},

			success : function(response, options) {
			}
		});
	}
}

/**
 * 机构树展开方法
 */
function expandBankTree(node){
	if(node.firstChild.text == 'loading'){
		Ext.Ajax.request({
			url : pathUrl + '/selector_listBankOrganization.action',
			params : {
				bank_org_id : node.id,
				mode : 'DrillDown'
			},
			waitMsg : '正在处理,请稍候...',
			method : 'POST',
			callback : function(options,success,response){
				var json = Ext.util.JSON.decode(response.responseText);
				var tl = json.results;
				if(tl){
					for(var i=0;i<tl.length;i++){
						var cnode = new Ext.tree.AsyncTreeNode({
							id : tl[i].bank_org_id,
							text :"["+ tl[i].bank_org_id+"]"+tl[i].bank_org_name,
							leaf : tl[i].leaf == 'Y'? true : false,
							children : [{
								text : 'loading',
								cls : 'x-tree-node-loading',
								leaf : true
							}]
						});
						cnode.on('expand',expandBankTree);
						node.appendChild(cnode);
					}
				}else{
					Ext.MessageBox.alert('错误',json.info);
				}
				node.firstChild.remove();
			},
			failure : function(response,options){
				Ext.MessageBox.alert('错误',response.responseText);
			},
			success : function(options,response){
			}
		});
	}
}
function convert(val) {
	if (val == '01') {
		return '基础指标';
	} else if (val == '02') {
		return '私有指标';
	} else
		return val;
}
/**
 * 生成添加序号
 * @return {}
 */
function createAddOrder(){
	var cnode = engMeasureTree.getSelectionModel().getSelectedNode().lastChild;
	if (cnode!=null){
		var prev_order = cnode.text.split(".")[0];
		var order = parseInt(prev_order)+1;
		return order+'.';
	}else{
		return '1.';
	}
}