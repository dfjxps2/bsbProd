Ext.ns('Ext.plugins.ComboBoxQuery');
Ext.plugins.ComboBoxQuery = function (config) {
    Ext.apply(this, config);
};
Ext.extend(Ext.plugins.ComboBoxQuery, Ext.util.Observable, {
    minChars: 1,
    init: function (combo) {
        this.combo = combo;
        this.combo.on('beforequery',function(qe){
            var cmb = qe.combo;
            var q = qe.query;
            var forceAll = qe.forceAll;
            if (forceAll === true || (forceAll == undefined && cmb.mode == 'remote') || (q.length >= this.minChars)) {
                if (cmb.lastQuery !== q) {
                    cmb.lastQuery = q;
                    if (cmb.mode == 'local') {
                        cmb.selectedIndex = -1;
                        if (forceAll||q==="") {
                            cmb.store.clearFilter();
                        } else {
                            // 检索的正则
                            var regExp = new RegExp(".*" + q + ".*", "i");
                            // 执行检索
                            cmb.store.filterBy(function(record, id) {
                                // 得到每个record的项目名称值
                                var text = record.get(combo.displayField);
                                return regExp.test(text);
                            });
                        }
                        cmb.onLoad();
                    } else if (cmb.forceQueryInLocal){
                        if(cmb.store.getCount()>0){
                            this.isRemoteStoreLoaded = true;
                        } else if(!this.isRemoteStoreLoaded){
                            cmb.store.load();
                            this.isRemoteStoreLoaded = true;
                        }
                        cmb.selectedIndex = -1;
                        if(q==="")
                            cmb.store.clearFilter();
                        else{
                            var regExp = new RegExp(".*" + q + ".*", "i");
                            // 执行检索
                            cmb.store.filterBy(function(record, id) {
                                // 得到每个record的项目名称值
                                var text = record.get(combo.displayField);
                                return regExp.test(text);
                            });
                        }
                        cmb.expand();
                        cmb.restrictHeight();
                    } else {
                        cmb.store.baseParams[this.queryParam] = q;
                        cmb.store.load({
                            params: cmb.getParams(q)
                        });
                        cmb.expand();
                        cmb.restrictHeight();
                    }
                } else {
                    cmb.selectedIndex = -1;
                    cmb.onLoad();
                }
            }
            return false;
        });
        //解决当combobox的store提前加载后，再点击输入框不能自动弹出下拉框的问题
        this.combo.on('focus', function(cmb){
            if(!cmb.list){
                cmb.initList();
            }
            if(!cmb.isExpanded()) {
                cmb.expand();
                cmb.restrictHeight();
            }
        });
    }
});