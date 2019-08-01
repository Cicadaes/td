"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by zhaoxue on 2017/3/28.
 */
var base_component_1 = require("../base.component");
var table_template_1 = require("./table.template");
var table_model_1 = require("./table.model");
var utils_1 = require("../../../../public/scripts/utils");
var $ = require("jquery");
var dataSourceConfig_1 = require("../../../dataSourceConfig");
var path_1 = require("../../../../public/path/path");
var TableComponent = (function (_super) {
    __extends(TableComponent, _super);
    function TableComponent() {
        var _this = _super.call(this) || this;
        _this.chartData = null;
        _this.tableData = null;
        _this.colLength = null;
        _this.body = null;
        _this.datatype = null;
        _this.tablebody = null;
        _this.indicatorRFM = null;
        _this.tableBarFilterRF = null;
        _this.crowdName = null;
        _this.tableBaryearMonth = null;
        _this.tableBarDate = null;
        _this.tableBarbrand = null;
        _this.tableBarchannel = null;
        _this.tableBarfilter = {};
        _this.barTableListData = null;
        _this.crowdCount = 0;
        _this.lifeCycle = "";
        _this.saveChangeObj = {};
        _this.downloadBody = null;
        _this.dataConfig = {};
        var template = new table_template_1.TableTemplate(_this.scopeID, TableComponent);
        //获得模板渲染后的节点
        _this.element = _this.render(template);
        _this.tableData = new table_model_1.TableModel();
        return _this;
    }
    TableComponent.prototype.beforeShow = function () {
    };
    TableComponent.prototype.afterShow = function () {
        this.init();
    };
    TableComponent.prototype.beforeDestory = function () {
    };
    TableComponent.prototype.afterDestory = function () {
    };
    TableComponent.prototype.resize = function () {
    };
    TableComponent.prototype.getconfiginformation = function (event, changeObj) {
        this.dataConfig = changeObj.result;
        if (!this.isEmptyObject(changeObj.result)) {
            this.saveChangeObj = changeObj.result;
            if (changeObj.result.options)
                $.extend(this.tableData.options, changeObj.result.options);
            this.body = this.buildbody(changeObj.result);
            if (changeObj.result.type) {
                this.datatype = changeObj.result.type;
                if (this.datatype == 'tableRFM') {
                    $('div[tableSelect]', "#" + this.scopeID).show();
                    //渲染title
                    if (this.tableData.options.hasSelectLine) {
                        this.renderSelectLine(this.tableData);
                    }
                }
            }
            if (changeObj.result.downloadType) {
                this.downloadBody = dataSourceConfig_1.DataSourceConfig.getConfigByKey(changeObj.result.downloadType);
            }
            if (changeObj.result.readyBuildQuery) {
                this.postChange(this.body);
            }
        }
        else {
            return;
        }
    };
    TableComponent.prototype.downloadData = function () {
        this.downloadBoolean = true;
        this.postChange(this.downloadBody);
        this.downloadBoolean = false;
    };
    TableComponent.prototype.buildbody = function (result) {
        this.body = dataSourceConfig_1.DataSourceConfig.getConfigByKey(result.dscKey);
        this.body["charUUID"] = this.scopeID;
        this.body["requestTitle"] = "table";
        return this.body;
    };
    //处理数据
    TableComponent.prototype.handleData = function (json) {
        if (this.datatype == 'tableRFM') {
            $('#' + this.scopeID).addClass('table-bordered');
            var tablehead = { 'row': '' };
            var tablebody = json.data;
            var row_1 = [];
            var length_1 = tablebody.length;
            this.colLength = 1;
            //获取行,表头
            for (var i = 0; i < length_1; i++) {
                var rowName = tablebody[i]['R'];
                var headname = tablebody[i]['F'];
                if (row_1.indexOf(rowName) < 0)
                    row_1.push(rowName);
                if (!tablehead[headname]) {
                    tablehead[headname] = headname;
                    this.colLength++;
                }
            }
            //排序
            var metric_1 = this.body['metrics'][0]['field'];
            tablebody.sort(function (a, b) {
                return b[metric_1] - a[metric_1];
            });
            //增加排序字段
            tablebody.forEach(function (obj, index) {
                obj['rank'] = (index + 1);
            });
            //table  row
            var tabledata_1 = [];
            var rowlength = row_1.length;
            var _loop_1 = function (j) {
                tabledata_1[j] = {
                    'row': row_1[j]
                };
                tablebody.forEach(function (obj) {
                    if (obj['R'] == row_1[j]) {
                        tabledata_1[j][obj['F']] = obj[metric_1];
                        tabledata_1[j][obj['F'] + 'rank'] = obj['rank'];
                    }
                });
            };
            for (var j = 0; j < rowlength; j++) {
                _loop_1(j);
            }
            this.tablebody = tablebody;
            this.tableData.table_Data['data'] = tabledata_1;
            this.tableData.table_Data['head'] = tablehead;
            this.getbarTableDataList(this.tableData.table_Data);
        }
        else {
            this.tableData.table_Data['head'] = {};
            this.tableData.table_Data['data'] = json.data;
            this.tableData.options['totalPage'] = Math.ceil(json.total / this.tableData.options['pageSize']);
            this.tableData.options['totalNumber'] = json.total;
            //thead
            for (var key in json.data[0]) {
                if (key.split('_').length > 1) {
                    switch (key.split('_')[key.split('_').length - 1]) {
                        case '环比':
                            this.tableData.table_Data['head'][key] = '环比';
                            break;
                        case '占比':
                            this.tableData.table_Data['head'][key] = '占比';
                            break;
                    }
                }
                else {
                    this.tableData.table_Data['head'][key] = key;
                    if (key == "date") {
                        this.tableData.table_Data['head'][key] = "日期";
                    }
                }
            }
        }
    };
    TableComponent.prototype.handleLifeCycleData = function (data) {
        var lifeCycleData = [];
        lifeCycleData = data;
        lifeCycleData = utils_1.Utils.handleLifeCycleMap(lifeCycleData, "客户分类");
        for (var _i = 0, lifeCycleData_1 = lifeCycleData; _i < lifeCycleData_1.length; _i++) {
            var item = lifeCycleData_1[_i];
            for (var key in item) {
                if (key.indexOf("占比") !== -1) {
                    if (item[key].indexOf("%") == -1) {
                        item[key] = item[key] + "%";
                    }
                }
            }
        }
        return lifeCycleData;
    };
    TableComponent.prototype.dataChange = function (data) {
        if (data && data['data'] && data['data'].length > 0) {
            if (this.lifeCycle = "lifeCycle") {
                data.data = this.handleLifeCycleData(data.data);
            }
            data['tabletype'] = "tabletype";
            //处理数据
            this.handleData(data);
            //渲染table
            this.renderTable(this.tableData.table_Data);
            //渲染tablefoot
            if (this.tableData.options.foottype) {
                this.creatTableFooter(this.tableData);
            }
            //设置宽度
            this.setTableWidth(this.tableData.table_Data);
            //绑定事件
            this.eventBindHtml();
            $('.table_pageSize_title').html(this.tableData.options['pageSize'] + '条');
        }
        else {
            $('#' + this.scopeID).find('div[tableContainer]').empty().append('<div class="nodata">暂无数据</div>');
        }
        this.eventBindHtml();
    };
    TableComponent.prototype.getbarTableDataList = function (data) {
        this.barTableListData = { 'filterF': [], 'filterR': [] };
        if (data.head) {
            for (var key in data.head) {
                if (data.head[key].length > 0 && key != 'total')
                    this.barTableListData['filterF'].push(data.head[key]);
            }
        }
        if (data.data && data.data.length > 0) {
            for (var i = 0; i < data.data.length; i++) {
                if (data.data[i]['row'] != 'total')
                    this.barTableListData['filterR'].push(data.data[i]['row']);
            }
        }
        // console.log(this.barTableListData)
    };
    TableComponent.prototype.filterChange = function (event, data) {
        //取过滤器的值
        this.getFilterData($(document));
        this.body = dataSourceConfig_1.DataSourceConfig.mergeBodyByFilter(this.body, data);
        if (this.downloadBody != null) {
            this.downloadBody = dataSourceConfig_1.DataSourceConfig.mergeBodyByFilter(this.downloadBody, data);
        }
        this.postChange(this.body);
    };
    TableComponent.prototype.mergeFilterChange = function (event, target) {
        _super.prototype.onFilterChange.call(this, this, target);
    };
    TableComponent.prototype.styleChange = function (style) {
    };
    TableComponent.prototype.loadData = function () {
    };
    Object.defineProperty(TableComponent.prototype, "data", {
        get: function () {
            return this.chartData;
        },
        enumerable: true,
        configurable: true
    });
    TableComponent.prototype.init = function () {
    };
    TableComponent.prototype.renderSelectLine = function (json) {
        if (this.tableData.tableRFM_indicators) {
            $('.table-selectline-title', "#" + this.scopeID).text(json.tableRFM_indicators[0]['name']);
            var optionList = '<ul>';
            for (var i = 0; i < json.tableRFM_indicators.length; i++) {
                optionList += '<li data-id=' + json.tableRFM_indicators[i]['id'] + '>' + json.tableRFM_indicators[i]['name'] + '</li>';
            }
            optionList += '<ul>';
            $('.table-selectline-list', "#" + this.scopeID).empty().append(optionList);
        }
    };
    TableComponent.prototype.renderTable = function (json) {
        $('div[tableContainer]', "#" + this.scopeID).empty();
        var table = "<table class='table'>";
        var tableHead = json.head;
        this.colLength = 0;
        table += "<thead><tr style='background:#3385ff;'>";
        for (var p in tableHead) {
            table += "<th><span>" + tableHead[p] + "</span>";
            if (this.datatype == '来源分析' && tableHead[p] != '地区') {
                table += '<span class="sortable" code="' + tableHead[p] + '"><i class="triangleUp"></i><i class="triangleDown currentSort"></i></span>';
            }
            this.colLength++;
            table += "</th>";
        }
        table += "</tr></thead><tbody id='bd'>";
        var tbodyData = json.data;
        $.each(tbodyData, function (i, v) {
            //var tData = "";
            var trColor;
            if (i % 2 == 0) {
                trColor = "even";
            }
            else {
                trColor = "odd";
            }
            table += "<tr class='" + trColor + "'>";
            for (var k in tableHead) {
                var className = '';
                if (k == '运营状态') {
                    switch (v[tableHead[k]]) {
                        case 1:
                            className = 'failed';
                            break;
                        case 2:
                            className = 'success';
                            break;
                    }
                    table += "<td><span class='" + className + "'></span>";
                }
                else {
                    var text = v[k] == null ? '-' : (v[k] + '').replace(/\<\=/g, '≤').replace(/\</g, '&lt;');
                    var value = text;
                    if (this.datatype != 'tableRFM') {
                        if (isNaN(Number(text))) {
                            value = text;
                        }
                        else {
                            value = Number(text).toLocaleString();
                        }
                    }
                    else {
                        value = utils_1.Utils.changeNumber(text);
                    }
                    var rankClass = v[k + 'rank'] == null ? '' : 'opacity' + v[k + 'rank'];
                    table += "<td class='" + rankClass + "'><span>" + value + "</span>";
                }
                if (v[k + '_状态']) {
                    table += "<span class='" + v[k + '_状态'] + "'>" + "</span>";
                }
                table += "</td>";
            }
            table += "</tr>";
        });
        table += "</tbody></table>";
        $('div[tableContainer]', "#" + this.scopeID).append(table);
    };
    ;
    //创建tabelfooter
    TableComponent.prototype.creatTableFooter = function (json) {
        switch (json.options.foottype) {
            case "paginate":
                this.renderPaginate(json);
                break;
            case "loadmore":
                this.loadMoreData(json);
                break;
        }
    };
    ;
    //渲染分页
    TableComponent.prototype.renderPaginate = function (json) {
        var pagination = "<div class='table_foot clrfix'>";
        //每页显示
        pagination += "<div class='table_pagePer fl'><span class='fl'>每页显示</span><div class='table_pageSizeBox fl'><div class='table_pageSize'><span class='table_pageSize_title'>10条</span><i class='triangle_icon'></i></div><ul class='table_sizeList hide'>";
        //显示条数列表
        for (var i = 0; i < json.options.pageCount.length; i++) {
            pagination += "<li type='" + i + "'>" + json.options.pageCount[i] + '条' + "</li>";
        }
        pagination += "</ul></div></div>";
        //首页
        pagination += "<div class='table_page fr clrfix'><a href='javascript:;' class='table_first fl'>首页</a><div class='table_pages fl clrfix'>";
        //显示分页
        pagination = this.renderPagelist(json.options, pagination);
        //显示末页
        pagination += "</div><a href='javascript:;' class='table_last fl'>末页</a></div>";
        //插入容器内
        $('div[tableContainer]', "#" + this.scopeID).append(pagination);
    };
    //渲染pagelist
    TableComponent.prototype.renderPagelist = function (opt, pagination) {
        if (opt.totalPage < 10) {
            for (var i = 1; i <= opt.totalPage; i++) {
                var classname = opt.pageNumber == i ? "table_currentPage" : "";
                pagination += '<a href="javascript:;" class="' + classname + '">' + (i) + '</a>';
            }
        }
        else {
            if (opt.pageNumber - opt.count > 1 && opt.pageNumber != 1 && opt.totalPage != opt.count) {
                var home = '1';
                pagination += '<a href="javascript:;">' + home + '</a><span>...</span>';
            }
            var start = (opt.pageNumber - opt.count) <= 1 ? 1 : (opt.pageNumber - opt.count);
            var end = (opt.pageNumber + opt.count) >= opt.totalPage ? opt.totalPage : (opt.pageNumber + opt.count);
            for (; start <= end; start++) {
                if (start <= opt.totalPage && start >= 1) {
                    if (start != opt.pageNumber) {
                        pagination += '<a href="javascript:;">' + start + '</a>';
                    }
                    else {
                        pagination += '<a href="javascript:;" class="table_currentPage">' + start + '</a>';
                    }
                }
            }
            if (opt.pageNumber + opt.count < opt.totalPage && opt.pageNumber >= 1 && opt.totalPage > opt.count) {
                var end_1 = opt.totalPage;
                pagination += '<span>...</span><a href="javascript:;">' + end_1 + '</a>';
            }
        }
        return pagination;
    };
    //设置表格宽度
    TableComponent.prototype.setTableWidth = function (json) {
        var width = $("#" + this.scopeID).find("table").width();
        var tdWidth = width / this.colLength;
        $("#" + this.scopeID).find("td").width(tdWidth);
    };
    //渲染加载更多
    TableComponent.prototype.loadMoreData = function (json) {
        var foot = '<div class="table_foot"><div class="loadmoreBtn"><span>显示更多</span><i></i></div></div>';
        if ($("#" + this.scopeID)[0]["lastChild"]["className"] == "table_foot") {
            return;
        }
        //插入容器内
        $("#" + this.scopeID).append(foot);
    };
    //渲染弹框
    TableComponent.prototype.renderModal = function (json) {
        var html = '<div class="tableModal tableBarModal">' +
            '<div class="tableModalContent tableBarModalContent">' +
            '<div class="tableModalHeader clrfix">' +
            '<span class="fl">另存人群</span>' +
            '<span class="closeModal fr tableBarCancel">×</span>' +
            '</div>' +
            '<div class="tableModalBody clrfix">' +
            '<div name="crowdName" class="clrfix">' +
            '<div class="tableBar-30 fl">人群命名</div>' +
            '<div class="tableBar-70 fl">' +
            '<input type="text" placeholder="请输入人群名称" class="tableBarInput" tableBarSearch>' +
            '<div class="tableBarErrorTips crowdNameErrorTips" tableBarErrorTips></div> ' +
            '</div>' +
            '</div>' +
            '<div class="clrfix" name="date">' +
            '<div class="tableBar-30 fl">日期</div>' +
            '<div class="tableBar-70 fl" tableBarDate></div>' +
            '</div>' +
            '<div name="brand" class="clrfix">' +
            '<div class="tableBar-30 fl">品牌</div>' +
            '<div class="tableBar-70 fl" tableBarBrand></div>' +
            '</div>' +
            '<div class="clrfix" name="qudao">' +
            '<div class="tableBar-30 fl">渠道</div>' +
            '<div class="tableBar-70 fl" tableBarChannel></div>' +
            '</div>' +
            '<div name="" class="clrfix">' +
            '<div class="tableBar-30 fl">筛选</div>' +
            '<div class="tableBar-70 fl clrfix" tableBarCheckRadio>  ' +
            '<div class="w-30 fl">' +
            '<span class="tablefilterRF" value="filterR">R值</span>' +
            '</div> ' +
            '<div class="w-30 fl">并且</div>' +
            '<div class="w-30 fl">' +
            '<span class="tablefilterRF" value="filterF">F值</span>' +
            '</div>' +
            '<div class="tableBar-list-data fl clrfix" tableBarListData>' +
            '<ul></ul>' +
            '</div>' +
            '<div class="tableBarErrorTips fl filterErrorTips" tableBarErrorTips></div> ' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="tableModalFooter clrfix">' +
            '<button type="button" class="confirm fr tableBarConfirm">确认</button>' +
            '<button type="button" class="cancel fr tableBarCancel">取消</button>' +
            '</div>' +
            '</div> ' +
            '</div>';
        return html;
    };
    //发送请求
    TableComponent.prototype.postChange = function (postQuery) {
        var sendObj = Object.assign(_super.prototype.transformInput.call(this, 'scopeID', this.scopeID), _super.prototype.transformInput.call(this, 'result', postQuery));
        _super.prototype.onChange.call(this, this, sendObj);
    };
    //绑定事件
    TableComponent.prototype.eventBindHtml = function () {
        var _this = this;
        var that = this;
        $('#' + that.scopeID).find('.table-selectline').off('click');
        $('#' + that.scopeID).find('.table-selectline-list').off('click');
        $('.table_pageSize', '#' + that.scopeID).off('click');
        $('.table_sizeList', '#' + that.scopeID).off('click');
        $('.table_page', '#' + that.scopeID).off('click');
        $('.loadmoreBtn', '#' + that.scopeID).off('click');
        $('.sortable', '#' + that.scopeID).off('click');
        //显示select
        $('#' + that.scopeID).find('.table-selectline').click(function (event) {
            $('#' + that.scopeID).find('.table-selectline-list').show();
            $(document).find('.rfmFilter_list_layer').hide();
            event.stopPropagation();
        });
        //选择select
        $('#' + that.scopeID).find('.table-selectline-list').on('click', 'li', function (event) {
            var $target = $(event.target);
            $('#' + that.scopeID).find('.table-selectline-title').html($target.html());
            $('#' + that.scopeID).find('.table-selectline-list').hide();
            that.body['metrics'][0]['field'] = $target.attr('data-id');
            that.postChange(that.body);
            event.stopPropagation();
        });
        //显示、隐藏每页显示下拉框
        $('.table_pageSize', '#' + that.scopeID).on('click', function (e) {
            var $tableSizeList = $(this).siblings('.table_sizeList');
            if ($tableSizeList.hasClass('hide')) {
                $tableSizeList.removeClass('hide').addClass('open');
            }
            else if ($tableSizeList.hasClass('open')) {
                $tableSizeList.removeClass('open').addClass('hide');
            }
            e.stopPropagation();
        });
        $(document).click(function (e) {
            $('.table_sizeList').removeClass('open').addClass('hide');
            $('#' + this.scopeID).find('.table-selectline').hide();
        });
        //选择下拉列表
        $('.table_sizeList', '#' + that.scopeID).on('click', 'li', function (e) {
            var $target = $(e.target);
            var type = Number($target.attr('type'));
            if (that.tableData.options['pageSize'] == _this.tableData.options['pageCount'][type])
                return;
            that.tableData.options['pageSize'] = _this.tableData.options['pageCount'][type];
            that.tableData.options['pageNumber'] = 1;
            $target.parents('.table_pagePer').find('.table_pageSize_title').html(that.tableData.options['pageSize'] + '条');
            //重新buildbody,onchange
            that.body.limit[1] = _this.tableData.options['pageCount'][type];
            that.postChange(that.body);
        });
        //点击页码
        $('.table_page', '#' + that.scopeID).on('click', 'a', function (e) {
            var $target = $(e.target);
            //重新buildbody,onchange       
            if ($target.hasClass('table_first')) {
                that.body.limit[0] = 1;
            }
            else if ($target.hasClass('table_last')) {
                that.body.limit[0] = that.tableData.options.totalPage;
            }
            else {
                that.body.limit[0] = Number($target.html());
            }
            that.tableData.options['pageNumber'] = that.body.limit[0];
            that.postChange(that.body);
        });
        //点击加载更多
        $('.loadmoreBtn', '#' + that.scopeID).on('click', function (e) {
            //重新buildbody,onchange
            that.body.limit[1] += 10;
            if (that.body.limit[1] - that.tableData.options['totalNumber'] > 10) {
                $(_this).parents('.table_foot').html('没有更多');
                return;
            }
            that.postChange(that.body);
        });
        //排序
        $('.sortable', '#' + that.scopeID).on('click', function (e) {
            var field = $(e.target).parents('.sortable').attr('code');
            //重新buildbody,onchange
            if (that.body["orderBy"]) {
                that.body["orderBy"][0]['field'] = field;
                that.body["orderBy"][0]['function'] = that.body["orderBy"][0]['function'] == 'DESC' ? 'ASC' : 'DESC';
                that.postChange(that.body);
            }
        });
        var $componentBody = $(document.body);
        $componentBody.off('click.table');
        $('#' + that.scopeID).find('.saveCrowdBtn').off('click');
        //另存人群
        $('#' + that.scopeID).find('.saveCrowdBtn').click(function (event) {
            $('.modal-backdrop-report-form').remove();
            //渲染弹框
            var modal = that.renderModal('');
            $componentBody.append(modal);
            that.crowdName = null;
            that.tableBarfilter = { 'filterR': [], 'filterF': [] };
            $('.tableBarModal').show();
            //根据DATA返回的数据渲染list
            that.tableBarFilterRF = 'filterR';
            var listData = that.barTableListData ? that.barTableListData[that.tableBarFilterRF] : null;
            that.renderListHtml(listData);
            //取过滤器的值放入html里
            $componentBody.find('div[tablebardate]').html(that.tableBarDate);
            $componentBody.find('div[tablebarbrand]').html(that.tableBarbrand);
            $componentBody.find('div[tablebarchannel]').html(that.tableBarchannel);
            $(document.body).append("<div class='modal-backdrop modal-backdrop-report-form'></div>");
            event.stopPropagation();
        });
        //click radio
        $componentBody.on('click.table', '.tablefilterRF', function (event) {
            var $target = $(event.target);
            if ($target && $target.attr('value') !== null) {
                that.tableBarFilterRF = $target.attr('value');
            }
            if (that.barTableListData !== null) {
                that.renderListHtml(that.barTableListData[that.tableBarFilterRF]);
            }
            var tableBarfilter = that.tableBarfilter[that.tableBarFilterRF];
            var $liList = $(document).find('div[tablebarlistdata] li');
            if (tableBarfilter && tableBarfilter.length > 0)
                that.decidePieBarFilterArray($liList, tableBarfilter);
            event.stopPropagation();
        });
        //输入人群命名
        $componentBody.on('keyup.table', 'input[tableBarSearch]', function (event) {
            var keyUpText = $(event.target).val().trim();
            if (keyUpText.length <= 0) {
                $componentBody.find("input[tableBarSearch]").addClass("tableBarErrorBorder");
                $componentBody.find(".crowdNameErrorTips").text("人群名称不能为空");
            }
            else {
                $componentBody.find("input[tableBarSearch]").removeClass("tableBarErrorBorder");
                $componentBody.find(".crowdNameErrorTips").text("");
            }
            that.crowdName = keyUpText;
            event.stopPropagation();
        });
        //选择筛选条件
        $componentBody.on('click.table', 'div[tableBarListData]', function (event) {
            var $target = $(event.target);
            if (!$target.hasClass("tableBarChoose")) {
                $target.addClass("tableBarChoose");
                (that.tableBarfilter[that.tableBarFilterRF]).push($target.text());
                $componentBody.find(".filterErrorTips").text("");
            }
            else {
                $target.removeClass("tableBarChoose");
                //从数组里删除
                that.removePieBarFilterArray($target.text());
            }
            event.stopPropagation();
        });
        //确认
        $componentBody.on('click.table', '.tableBarConfirm', function (event) {
            that.getCrowdCount();
            if (!that.crowdName) {
                $componentBody.find("input[tableBarSearch]").addClass("tableBarErrorBorder");
                $componentBody.find(".crowdNameErrorTips").text("人群名称不能为空");
                return false;
            }
            else if (that.barTableListData == null) {
                $componentBody.find(".filterErrorTips").text("筛选值暂无数据，无法另存为人群");
                return false;
            }
            else if (that.crowdName && that.tableBarfilter['filterR'].length <= 0 && that.tableBarfilter['filterF'].length <= 0) {
                $componentBody.find(".filterErrorTips").text("请至少选择一个筛选值，否则无法另存为人群");
                return false;
            }
            else if (that.crowdCount <= 0) {
                $componentBody.find(".filterErrorTips").text("客户数量为0，无法另存为人群");
                return false;
            }
            else {
                var filterF = void 0, filterR = void 0, brand = void 0, channel = void 0;
                if (that.tableBarfilter['filterF'].length > 0)
                    filterF = { 'filterF': (that.getKeyByfilterRF(that.tableBarfilter['filterF'])).toString() };
                if (that.tableBarfilter['filterR'].length > 0)
                    filterR = { 'filterR': (that.getKeyByfilterRF(that.tableBarfilter['filterR'])).toString() };
                brand = that.tableBarbrand == '全部品牌' ? "ALL" : that.tableBarbrand;
                channel = that.tableBarchannel == '全部渠道' ? "ALL" : that.tableBarchannel;
                //发送请求
                var buildQueryObj = Object.assign(that.transformInput('crowdName', that.crowdName), //人群名称
                that.transformInput('yearMonth', that.tableBaryearMonth), //日期
                that.transformInput('brand', brand), //品牌
                that.transformInput('channel', channel), //渠道
                filterR, filterF);
                $.ajax({
                    //开发地址
                    url: path_1.PATHJSON.urlHostRFM + '/dmp-web/crowd/crowds/saveRFCrowd',
                    dataType: 'JSON',
                    contentType: 'application/json',
                    type: 'POST',
                    data: JSON.stringify(buildQueryObj),
                    success: function (data) {
                        $('.modal-backdrop-report-form').remove();
                        $('.tableBarModal').remove();
                    },
                    error: function (data) {
                        var msg = data.responseJSON.msg;
                        $componentBody.find("input[tableBarSearch]").addClass("tableBarErrorBorder");
                        $componentBody.find(".crowdNameErrorTips").text(msg);
                    }
                });
            }
            event.stopPropagation();
        });
        //取消
        $componentBody.on('click.table', '.tableBarCancel', function (event) {
            $('.modal-backdrop-report-form').remove();
            $('.tableBarModal').remove();
            event.stopPropagation();
        });
    };
    TableComponent.prototype.getKeyByfilterRF = function (filterArray) {
        var mapFR = {
            'F=1': 1,
            'F=2': 2,
            'F=3': 3,
            'F=4': 4,
            'F=5': 5,
            'R≤30': 5,
            '30<R≤90': 4,
            '90<R≤180': 3,
            '180<R≤360': 2,
            'R>360': 1
        };
        var keyArr = [];
        if (filterArray.length > 0) {
            for (var i = 0; i < filterArray.length; i++) {
                if (mapFR[filterArray[i]])
                    keyArr.push(mapFR[filterArray[i]]);
            }
        }
        return keyArr;
    };
    TableComponent.prototype.renderListHtml = function (data) {
        if (data && data.length > 0) {
            $(document.body).find("div[tableBarListData] ul").empty();
            var optionList = "";
            for (var i = 0; i < data.length; i++) {
                if (data[i])
                    optionList += '<li>' + (data[i] + '').replace(/\<\=/g, '≤').replace(/\</g, '&lt;') + '</li>';
            }
            $(document.body).find("div[tableBarListData] ul").html(optionList);
        }
    };
    //取过滤器的值
    TableComponent.prototype.getFilterData = function ($componentBody) {
        var chart = this.mergeFilterObj !== null ? this.mergeFilterObj['chart'] : null;
        for (var key in chart) {
            switch (key) {
                case "date":
                    this.tableBarDate = chart[key];
                    break;
                case "yearMonth":
                    //日期
                    this.tableBaryearMonth = chart[key];
                    break;
                case "brand":
                    //品牌
                    if (chart[key] == "all") {
                        this.tableBarbrand = "全部品牌";
                    }
                    else {
                        this.tableBarbrand = chart[key];
                    }
                    break;
                case "channel":
                    //渠道
                    if (chart[key] == "all") {
                        this.tableBarchannel = "全部渠道";
                    }
                    else {
                        this.tableBarchannel = chart[key];
                    }
                    break;
            }
        }
    };
    ;
    TableComponent.prototype.removePieBarFilterArray = function ($target) {
        if ((this.tableBarfilter[this.tableBarFilterRF]).length > 0) {
            var length_2 = (this.tableBarfilter[this.tableBarFilterRF]).length;
            for (var i = length_2 - 1; i >= 0; i--) {
                if ((this.tableBarfilter[this.tableBarFilterRF])[i] == $target) {
                    (this.tableBarfilter[this.tableBarFilterRF]).splice(i, 1);
                }
            }
        }
    };
    TableComponent.prototype.decidePieBarFilterArray = function ($list, checkedFilter) {
        if (checkedFilter.length > 0) {
            for (var i = ($list.length) - 1; i >= 0; i--) {
                if (checkedFilter.indexOf($($list[i]).text()) >= 0) {
                    $($list[i]).addClass('tableBarChoose');
                }
            }
        }
    };
    TableComponent.prototype.getCrowdCount = function () {
        this.crowdCount = 0;
        if (this.tableBarfilter['filterR'].length > 0 && this.tableBarfilter['filterF'].length > 0) {
            for (var i = 0; i < this.tableBarfilter['filterR'].length; i++) {
                for (var j = 0; j < this.tableBarfilter['filterF'].length; j++) {
                    for (var k = 0; k < this.tablebody.length; k++) {
                        if (this.tableBarfilter['filterR'][i] == this.tablebody[k]['R'].replace(/\<\=/g, '≤').replace(/\</g, '&lt;') && this.tableBarfilter['filterF'][i] == this.tablebody[k]['F'].replace(/\<\=/g, '≤').replace(/\</g, '&lt;')) {
                            this.crowdCount += (this.tablebody[k][this.body['metrics'][0]['field']] - 0);
                        }
                    }
                }
            }
        }
        else if (this.tableBarfilter['filterR'].length > 0 && this.tableBarfilter['filterF'].length <= 0) {
            for (var i = 0; i < this.tableBarfilter['filterR'].length; i++) {
                for (var k = 0; k < this.tablebody.length; k++) {
                    if (this.tableBarfilter['filterR'][i] == this.tablebody[k]['R'].replace(/\<\=/g, '≤').replace(/\</g, '&lt;') && this.tablebody[k]['R'] != 'total') {
                        this.crowdCount += (this.tablebody[k][this.body['metrics'][0]['field']] - 0);
                    }
                }
            }
        }
        else if (this.tableBarfilter['filterR'].length <= 0 && this.tableBarfilter['filterF'].length > 0) {
            for (var j = 0; j < this.tableBarfilter['filterF'].length; j++) {
                for (var k = 0; k < this.tablebody.length; k++) {
                    if (this.tablebody[k]['F'] != 'total' && this.tableBarfilter['filterF'][j] == this.tablebody[k]['F'].replace(/\<\=/g, '≤').replace(/\</g, '&lt;')) {
                        this.crowdCount += (this.tablebody[k][this.body['metrics'][0]['field']] - 0);
                    }
                }
            }
        }
    };
    return TableComponent;
}(base_component_1.BaseComponent));
exports.TableComponent = TableComponent;
//# sourceMappingURL=table.component.js.map