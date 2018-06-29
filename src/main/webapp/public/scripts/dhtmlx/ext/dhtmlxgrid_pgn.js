dhtmlXGridObject.prototype.enablePaging = function(fl, zU, xy, parentObj, sG, qn) {
    this._pgn_parentObj = typeof(parentObj) == "string" ? document.getElementById(parentObj) : parentObj;
    this._pgn_recInfoParentObj = typeof(qn) == "string" ? document.getElementById(qn) : qn;
    this.pagingOn = fl;
    this.sG = sG;
    this.rowsBufferOutSize = parseInt(zU);
    this.currentPage = 1;
    this.pagesInGroup = parseInt(xy);
    this._init_pgn_events();
    this.setPagingSkin("default")
};
dhtmlXGridObject.prototype.setXMLAutoLoading = function(filePath, wH) {
    this.xmlFileUrl = filePath;
    this._dpref = wH
};
dhtmlXGridObject.prototype.changePageRelative = function(ind) {
    this.changePage(this.currentPage + ind)
};
dhtmlXGridObject.prototype.changePage = function(ub) {
    if (arguments.length == 0)
        ub = this.currentPage || 0;
    ub = parseInt(ub);
    ub = Math.max(1, Math.min(ub, Math.ceil(this.rowsBuffer.length / this.rowsBufferOutSize)));
    if (!this.callEvent("onBeforePageChanged", [this.currentPage, ub]))
        return;
    this.currentPage = parseInt(ub);
    this._reset_view();
    this._fixAlterCss();
    this.callEvent("onPageChanged", this.getStateOfView())
};
dhtmlXGridObject.prototype.setPagingSkin = function(name) {
    this._pgn_skin = this["_pgn_" + name];
    if (name == "toolbar")
        this._pgn_skin_tlb = arguments[1]
};
dhtmlXGridObject.prototype.setPagingTemplates = function(a, b) {
    this._pgn_templateA = this._pgn_template_compile(a);
    this._pgn_templateB = this._pgn_template_compile(b);
    this._page_skin_update()
};
dhtmlXGridObject.prototype._page_skin_update = function(name) {
    if (!this.pagesInGroup)
        this.pagesInGroup = Math.ceil(Math.min(5, this.rowsBuffer.length / this.rowsBufferOutSize));
    var Cg = Math.ceil(this.rowsBuffer.length / this.rowsBufferOutSize);
    if (Cg && Cg < this.currentPage)
        return this.changePage(Cg);
    if (this.pagingOn && this._pgn_skin)
        this._pgn_skin.apply(this, this.getStateOfView())
};
dhtmlXGridObject.prototype._init_pgn_events = function(name) {
    this.attachEvent("onXLE", this._page_skin_update);
    this.attachEvent("onClearAll", this._page_skin_update);
    this.attachEvent("onPageChanged", this._page_skin_update);
    this.attachEvent("onGridReconstructed", this._page_skin_update);
    this._init_pgn_events = function() {
    }
};
dhtmlXGridObject.prototype._pgn_default = function(page, start, end) {
    if (!this.pagingBlock) {
        this.pagingBlock = document.createElement("DIV");
        this.pagingBlock.className = "pagingBlock";
        this.pq = document.createElement("SPAN");
        this.pq.className = "recordsInfoBlock";
        if (!this._pgn_parentObj)
            return;
        this._pgn_parentObj.appendChild(this.pagingBlock);
        if (this._pgn_recInfoParentObj && this.sG)
            this._pgn_recInfoParentObj.appendChild(this.pq);
        if (!this._pgn_templateA) {
            this._pgn_templateA = this._pgn_template_compile("[prevpages:&lt:&nbsp] [currentpages:,&nbsp] [nextpages:&gt:&nbsp]");
            this._pgn_templateB = this._pgn_template_compile("Results <b>[from]-[to]</b> of <b>[total]</b>")
        }
    };
    var details = this.getStateOfView();
    this.pagingBlock.innerHTML = this._pgn_templateA.apply(this, details);
    this.pq.innerHTML = this._pgn_templateB.apply(this, details);
    this._pgn_template_active(this.pagingBlock);
    this._pgn_template_active(this.pq);
    this.callEvent("onPaging", [])
};
dhtmlXGridObject.prototype._pgn_block = function(sep) {
    var start = Math.floor((this.currentPage - 1) / this.pagesInGroup) * this.pagesInGroup;
    var max = Math.min(Math.ceil(this.rowsBuffer.length / this.rowsBufferOutSize), start + this.pagesInGroup);
    var str = [];
    for (var i = start + 1; i <= max; i++)
        if (i == this.currentPage)
            str.push("<a class='dhx_not_active'><b>" + i + "</b></a>");
        else
            str.push("<a onclick='this.grid.changePage(" + i + ");return false;'>" + i + "</a>");
    return str.join(sep)
};
dhtmlXGridObject.prototype._pgn_link = function(mode, ac, ds) {
    if (mode == "prevpages" || mode == "prev") {
        if (this.currentPage == 1)
            return ds;
        return '<a onclick=\'this.grid.changePageRelative(-1*' + (mode == "prev" ? '1' : 'this.grid.pagesInGroup') + ');return false;\'>' + ac + '</a>'
    };
    if (mode == "nextpages" || mode == "next") {
        if (this.rowsBuffer.length / this.rowsBufferOutSize <= this.currentPage)
            return ds;
        if (this.rowsBuffer.length / (this.rowsBufferOutSize * (mode == "next" ? '1' : this.pagesInGroup)) <= 1)
            return ds;
        return '<a onclick=\'this.grid.changePageRelative(' + (mode == "next" ? '1' : 'this.grid.pagesInGroup') + ');return false;\'>' + ac + '</a>'
    };
    if (mode == "current") {
        var i = this.currentPage + (ac ? parseInt(ac) : 0);
        if (i < 1 || Math.ceil(this.rowsBuffer.length / this.rowsBufferOutSize) < i)
            return ds;
        return '<a ' + (i == this.currentPage ? "class='dhx_active_page_link' " : "") + 'onclick=\'this.grid.changePage(' + i + ');return false;\'>' + i + '</a>'
    };
    return ac
};
dhtmlXGridObject.prototype._pgn_template_active = function(block) {
    var tags = block.getElementsByTagName("A");
    if (tags)
        for (var i = 0; i < tags.length; i++) {
            tags[i].grid = this
        }
};
dhtmlXGridObject.prototype._pgn_template_compile = function(template) {
    template = template.replace(/\[([^\]]*)\]/g, function(a, b) {
                b = b.split(":");
                switch (b[0]) {
                    case "from" :
                        return '"+(arguments[1]*1+(arguments[2]*1?1:0))+"';
                    case "total" :
                        return '"+arguments[3]+"';
                    case "to" :
                        return '"+arguments[2]+"';
                    case "current" :
                    case "prev" :
                    case "next" :
                    case "prevpages" :
                    case "nextpages" :
                        return '"+this._pgn_link(\'' + b[0] + '\',\'' + b[1] + '\',\'' + b[2] + '\')+"';
                    case "currentpages" :
                        return '"+this._pgn_block(\'' + b[1] + '\')+"'
                }
            });
    return new Function('return "' + template + '";')
};
dhtmlXGridObject.prototype.i18n.paging = {
    results : "Results",
    records : "Records from ",
    to : " to ",
    page : "Page ",
    perpage : "rows per page",
    first : "strLength first Page",
    previous : "Previous Page",
    found : "Found records",
    next : "Next Page",
    last : "strLength last Page",
    of : " of ",
    notfound : "No Records Found"
};
dhtmlXGridObject.prototype.setPagingWTMode = function(navButtons, navLabel, pageSelect, perPageSelect) {
    this.rC = [navButtons, navLabel, pageSelect, perPageSelect]
};
dhtmlXGridObject.prototype._pgn_bricks = function(page, start, end) {
    var tmpAr = this.entBox.className.split("_");
    var sfx = "";
    var tmp = tmpAr[tmpAr.length - 1];
    if (tmpAr.length > 1 && (tmp == "light" || tmp == "modern" || tmp == "skyblue"))
        sfx = "_" + tmp;
    this.pagerElAr = new Array();
    this.pagerElAr["pagerCont"] = document.createElement("DIV");
    this.pagerElAr["pagerBord"] = document.createElement("DIV");
    this.pagerElAr["pagerLine"] = document.createElement("DIV");
    this.pagerElAr["pagerBox"] = document.createElement("DIV");
    this.pagerElAr["pagerInfo"] = document.createElement("DIV");
    this.pagerElAr["pagerInfoBox"] = document.createElement("DIV");
    var se = (this.globalBox || this.objBox);
    this.pagerElAr["pagerCont"].style.width = se.clientWidth + "px";
    this.pagerElAr["pagerCont"].style.overflow = "hidden";
    this.pagerElAr["pagerCont"].style.clear = "both";
    this.pagerElAr["pagerBord"].className = "dhx_pbox" + sfx;
    this.pagerElAr["pagerLine"].className = "dhx_pline" + sfx;
    this.pagerElAr["pagerBox"].style.clear = "both";
    this.pagerElAr["pagerInfo"].className = "dhx_pager_info" + sfx;
    this.pagerElAr["pagerCont"].appendChild(this.pagerElAr["pagerBord"]);
    this.pagerElAr["pagerCont"].appendChild(this.pagerElAr["pagerLine"]);
    this.pagerElAr["pagerCont"].appendChild(this.pagerElAr["pagerInfo"]);
    this.pagerElAr["pagerLine"].appendChild(this.pagerElAr["pagerBox"]);
    this.pagerElAr["pagerInfo"].appendChild(this.pagerElAr["pagerInfoBox"]);
    this._pgn_parentObj.innerHTML = "";
    this._pgn_parentObj.appendChild(this.pagerElAr["pagerCont"]);
    if (this.rowsBuffer.length > 0) {
        var lineWidth = 20;
        var lineWidthInc = 22;
        if (page > this.pagesInGroup) {
            var pageCont = document.createElement("DIV");
            var pageBox = document.createElement("DIV");
            pageCont.className = "dhx_page" + sfx;
            pageBox.innerHTML = "&larr;";
            pageCont.appendChild(pageBox);
            this.pagerElAr["pagerBox"].appendChild(pageCont);
            var self = this;
            pageCont.pgnum = (Math.ceil(page / this.pagesInGroup) - 1) * this.pagesInGroup;
            pageCont.onclick = function() {
                self.changePage(this.pgnum)
            };
            lineWidth += lineWidthInc
        };
        for (var i = 1; i <= this.pagesInGroup; i++) {
            var pageCont = document.createElement("DIV");
            var pageBox = document.createElement("DIV");
            pageCont.className = "dhx_page" + sfx;
            pageNumber = ((Math.ceil(page / this.pagesInGroup) - 1) * this.pagesInGroup) + i;
            if (pageNumber > Math.ceil(this.rowsBuffer.length / this.rowsBufferOutSize))
                break;
            pageBox.innerHTML = pageNumber;
            pageCont.appendChild(pageBox);
            if (page == pageNumber) {
                pageCont.className += " dhx_page_active" + sfx;
                pageBox.className = "dhx_page_active" + sfx
            } else {
                var self = this;
                pageCont.pgnum = pageNumber;
                pageCont.onclick = function() {
                    self.changePage(this.pgnum)
                }
            };
            lineWidth += (parseInt(lineWidthInc / 3) * pageNumber.toString().length) + 15;
            pageBox.style.width = (parseInt(lineWidthInc / 3) * pageNumber.toString().length) + 8 + "px";
            this.pagerElAr["pagerBox"].appendChild(pageCont)
        };
        if (Math.ceil(page / this.pagesInGroup) * this.pagesInGroup < Math.ceil(this.rowsBuffer.length / this.rowsBufferOutSize)) {
            var pageCont = document.createElement("DIV");
            var pageBox = document.createElement("DIV");
            pageCont.className = "dhx_page" + sfx;
            pageBox.innerHTML = "&rarr;";
            pageCont.appendChild(pageBox);
            this.pagerElAr["pagerBox"].appendChild(pageCont);
            var self = this;
            pageCont.pgnum = (Math.ceil(page / this.pagesInGroup) * this.pagesInGroup) + 1;
            pageCont.onclick = function() {
                self.changePage(this.pgnum)
            };
            lineWidth += lineWidthInc
        };
        this.pagerElAr["pagerLine"].style.width = lineWidth + "px"
    };
    if (this.rowsBuffer.length > 0 && this.sG)
        this.pagerElAr["pagerInfoBox"].innerHTML = this.i18n.paging.records + (start + 1) + this.i18n.paging.to + end + this.i18n.paging.of + this.rowsBuffer.length;
    else if (this.rowsBuffer.length == 0) {
        this.pagerElAr["pagerLine"].parentNode.removeChild(this.pagerElAr["pagerLine"]);
        this.pagerElAr["pagerInfoBox"].innerHTML = this.i18n.paging.notfound
    };
    this.pagerElAr["pagerBox"].appendChild(document.createElement("SPAN")).innerHTML = "&nbsp;";
    this.pagerElAr["pagerBord"].appendChild(document.createElement("SPAN")).innerHTML = "&nbsp;";
    this.pagerElAr["pagerCont"].appendChild(document.createElement("SPAN")).innerHTML = "&nbsp;";
    this.callEvent("onPaging", [])
};
dhtmlXGridObject.prototype._pgn_toolbar = function(page, start, end) {
    if (!this.bk)
        this.bk = this._pgn_createToolBar();
    var Cg = Math.ceil(this.rowsBuffer.length / this.rowsBufferOutSize);
    if (this.rC[0]) {
        this.bk.enableItem("right");
        this.bk.enableItem("rightabs");
        this.bk.enableItem("left");
        this.bk.enableItem("leftabs");
        if (this.currentPage == Cg) {
            this.bk.disableItem("right");
            this.bk.disableItem("rightabs")
        };
        if (this.currentPage == 1) {
            this.bk.disableItem("left");
            this.bk.disableItem("leftabs")
        }
    };
    if (this.rC[2]) {
        var that = this;
        this.bk.forEachListOption("pages", function(id) {
                    that.bk.removeListOption("pages", id)
                });
        for (var i = 0; i < Cg; i++) {
            this.bk.addListOption('pages', 'pages_' + (i + 1), NaN, "button", this.i18n.paging.page + (i + 1))
        };
        this.bk.setItemText("pages", "<div style='width:100%;text-align:right'>" + this.i18n.paging.page + page + "</div>")
    };
    if (this.rC[1]) {
        if (!this.getRowsNum())
            this.bk.setItemText('results', this.i18n.paging.notfound);
        else
            this.bk.setItemText('results', "<div style='width:100%;text-align:center'>" + this.i18n.paging.records + (start + 1) + this.i18n.paging.to + end + "</div>")
    };
    if (this.rC[3])
        this.bk.setItemText("perpagenum", "<div style='width:100%;text-align:right'>" + this.rowsBufferOutSize.toString() + " " + this.i18n.paging.perpage + "</div>");
    this.callEvent("onPaging", [])
};
dhtmlXGridObject.prototype._pgn_createToolBar = function() {
    this.bk = new dhtmlXToolbarObject(this._pgn_parentObj, (this._pgn_skin_tlb || "dhx_blue"));
    if (!this.rC)
        this.setPagingWTMode(true, true, true, true);
    var self = this;
    this.bk.attachEvent("onClick", function(val) {
                val = val.split("_");
                switch (val[0]) {
                    case "leftabs" :
                        self.changePage(1);
                        break;
                    case "left" :
                        self.changePage(self.currentPage - 1);
                        break;
                    case "rightabs" :
                        self.changePage(99999);
                        break;
                    case "right" :
                        self.changePage(self.currentPage + 1);
                        break;
                    case "perpagenum" :
                        if (val[1] === this.undefined)
                            return;
                        self.rowsBufferOutSize = parseInt(val[1]);
                        self.changePage();
                        self.bk.setItemText("perpagenum", "<div style='width:100%;text-align:right'>" + val[1] + " " + self.i18n.paging.perpage + "</div>");
                        break;
                    case "pages" :
                        if (val[1] === this.undefined)
                            return;
                        self.changePage(val[1]);
                        self.bk.setItemText("pages", "<div style='width:100%;text-align:right'>" + self.i18n.paging.page + val[1] + "</div>");
                        break
                }
            });
    if (this.rC[0]) {
        this.bk.addButton("leftabs", NaN, "", this.imgURL + 'ar_left_abs.gif', this.imgURL + 'ar_left_abs_dis.gif');
        this.bk.setWidth("leftabs", "20");
        this.bk.addButton("left", NaN, "", this.imgURL + 'ar_left.gif', this.imgURL + 'ar_left_dis.gif');
        this.bk.setWidth("left", "20")
    };
    if (this.rC[1]) {
        this.bk.addText("results", NaN, this.i18n.paging.results);
        this.bk.setWidth("results", "150")
    };
    if (this.rC[0]) {
        this.bk.addButton("right", NaN, "", this.imgURL + 'ar_right.gif', this.imgURL + 'ar_right_dis.gif');
        this.bk.setWidth("right", "20");
        this.bk.addButton("rightabs", NaN, "", this.imgURL + 'ar_right_abs.gif', this.imgURL + 'ar_right_abs_dis.gif');
        this.bk.setWidth("rightabs", "20")
    };
    if (this.rC[2]) {
        this.bk.addButtonSelect("pages", NaN, "select page", []);
        this.bk.setWidth("pages", "75")
    };
    if (this.rC[3]) {
        this.bk.addButtonSelect("perpagenum", NaN, "select size", []);
        for (var k = 5; k < 35; k += 5)
            this.bk.addListOption('perpagenum', 'perpagenum_' + k, NaN, "button", k + " " + this.i18n.paging.perpage);
        this.bk.setWidth("perpagenum", "130")
    };
    this.bk.disableItem("results");
    return this.bk
}