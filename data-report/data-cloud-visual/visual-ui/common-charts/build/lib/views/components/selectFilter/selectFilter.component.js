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
var selectFilter_template_1 = require("./selectFilter.template");
var selectFilter_model_1 = require("./selectFilter.model");
var $ = require("jquery");
var SelectFilterComponent = (function (_super) {
    __extends(SelectFilterComponent, _super);
    function SelectFilterComponent() {
        var _this = _super.call(this) || this;
        _this.myChart = null;
        _this.chartData = null;
        _this.selectFilterData = null;
        _this.echartData = null;
        _this.getSoreceData = null;
        _this.styleObj = null;
        _this.changeObj = null;
        _this.body = {};
        _this.filterValue = null; //选中的值
        _this.filterName = null; //选中的名称
        _this.filterType = null;
        _this.filterScopeIDObj = null;
        _this.topLevelFilter = false;
        _this.changePostFilterArray = [];
        _this.selectName = "";
        _this.postFilterField = "";
        _this.indicateMap = {
            "active_new_users": "入店新客",
            "active_old_users": "入店老客",
            "high_active_users": "入店高活跃客流",
            "middle_active_users": "入店中活跃客流",
            "low_active_users": "入店低活跃客流",
            "sleep_active_users": "入店睡眠客流",
            "high_stay_users": "停留高活跃客流",
            "middle_stay_users": "停留中活跃客流",
            "low_stay_users": "停留低活跃客流",
            "sleep_stay_users": "停留睡眠客流",
            "stay_new_users": "停留新客",
            "stay_old_users": "停留老客",
            "front_users": "周边客流",
            "jump_users": "跳出客流",
            "stay_users": "停留客流",
            //"member_count": "会员到访",
            "potential_count": "微信认证数",
            "member_count": "短信认证数",
            "ROUND(sum(active_users)/sum(front_users)*100,2)": "入店率",
            "ROUND(sum(stay_users)/sum(active_users)*100,2)": "停留率"
        };
        var template = new selectFilter_template_1.SelectFilterTemplate(_this.scopeID);
        //获得模板渲染后的节点
        _this.element = _this.render(template);
        _this.selectFilterData = new selectFilter_model_1.SelectFilterModel();
        return _this;
    }
    SelectFilterComponent.prototype.beforeShow = function () {
    };
    SelectFilterComponent.prototype.afterShow = function () {
        this.init();
    };
    SelectFilterComponent.prototype.beforeDestory = function () {
    };
    SelectFilterComponent.prototype.afterDestory = function () {
    };
    SelectFilterComponent.prototype.resize = function () {
    };
    SelectFilterComponent.prototype.getconfiginformation = function (event, changeObj) {
        if (!this.isEmptyObject(changeObj.result)) {
            this.filterScopeIDObj = changeObj.result;
            if (changeObj.result.topLevelFilter) {
                this.topLevelFilter = changeObj.result.topLevelFilter;
            }
            this.decideFilterType(changeObj.result);
        }
        else {
            return;
        }
    };
    SelectFilterComponent.prototype.decideFilterType = function (result) {
        this.selectName = result.selectName;
        switch (result.selectName) {
            case "select_1":
                this.postFilterField = result.selectType;
                this.postChange(this.body, result.selectType);
                break;
            case "select_2":
                var $divHtml = $('#' + this.scopeID).find('div[data-type="date_title"] em');
                $divHtml.html(result.selectTitleName);
                var $div = $('#' + this.scopeID).find('ul[data-type="filter_select"]');
                this.renderSelectListHtml($div, result.selectContentList);
                break;
            case "select_3":
                var date = new Date();
                var prefix = "";
                if ((date.getMonth() + 1) < 10) {
                    prefix = "0";
                }
                var title = date.getFullYear() + "-" + prefix + (date.getMonth() + 1);
                var titleDom = $('#' + this.scopeID).find('div[data-type="date_title"] em');
                titleDom.html(title);
                var list = [];
                for (var i = 0, j = date.getMonth(), k = date.getFullYear(); i < 12; i++, j--) {
                    if (j < 0) {
                        j = 11;
                        k = k - 1;
                    }
                    var month = new String(j + 1);
                    if ((j + 1) < 10) {
                        month = "0" + month;
                    }
                    list.push({
                        "key": k + "-" + month,
                        "value": k + "-" + month
                    });
                }
                var listDom = $('#' + this.scopeID).find('ul[data-type="filter_select"]');
                this.renderSelectListHtml(listDom, list);
                break;
        }
    };
    SelectFilterComponent.prototype.filterChange = function (event, data) {
    };
    SelectFilterComponent.prototype.dataChange = function (data) {
        if (this.selectName == "select_1") {
            var $divHtml = $('#' + this.scopeID).find('div[data-type="date_title"] em');
            if (data.length > 0) {
                $divHtml.html(data[0].value);
            }
            var $div = $('#' + this.scopeID).find('ul[data-type="filter_select"]');
            this.renderSelectListHtml($div, data);
        }
    };
    //渲染第一个下拉框list
    SelectFilterComponent.prototype.renderSelectListHtml = function ($div, data) {
        var optionList = "";
        if (data.length > 0) {
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var item = data_1[_i];
                optionList += '<li data-id=' + JSON.stringify(item.key) + '>' + item.value + '</li>';
            }
        }
        else {
            optionList += '<p>暂无数据</p>';
        }
        $div.html(optionList);
    };
    SelectFilterComponent.prototype.styleChange = function (style) {
    };
    SelectFilterComponent.prototype.loadData = function () {
    };
    Object.defineProperty(SelectFilterComponent.prototype, "data", {
        get: function () {
            return this.chartData;
        },
        enumerable: true,
        configurable: true
    });
    SelectFilterComponent.prototype.init = function () {
        this.renderRFMFilterHtml();
        this.commonChange();
    };
    SelectFilterComponent.prototype.commonChange = function () {
        var _self = this;
        // 点击blank
        $(document).click(function (event) {
            $('.rfmFilter_list_layer').hide();
        });
        $(document).ready(function () {
            var $rfmFilter = $('#' + _self.scopeID).find('div[rfmFilter]');
            //click get dropdown get list
            $rfmFilter.on('click', '.lifecycle_top_list', function (event) {
                $(document.body).find('.table-selectline-list').hide();
                var $selectList = $(event.target).siblings('.rfmFilter_list_layer');
                $('.rfmFilter_list_layer').hide();
                $selectList.show();
                event.stopPropagation();
            });
            //click choose list
            $rfmFilter.on('click', '.rfmFilter_list_layer', function (event) {
                $(document.body).find('.table-selectline-list').hide();
                var $tagget = $(event.currentTarget);
                $tagget.siblings().find("em").text($(event.target).text());
                //点击设置已选择的value
                _self.filterValue = $(event.target).attr("data-id");
                _self.filterName = $(event.target)[0].innerHTML;
                //发送请求
                _self.decidePostChange(_self.filterValue);
            });
        });
    };
    SelectFilterComponent.prototype.decidePostChange = function (value) {
        switch (this.filterScopeIDObj.selectName) {
            case "select_1":
                this.parameterPostChange(this.changeFilterArray(this.postFilterField, this.filterValue));
                break;
            case "select_2":
                this.metricChange(this.changeMetricArray(this.filterValue));
                break;
            case "select_3":
                this.dateFilterPostChange(this.changeFilterArray("end_date", this.filterValue));
                break;
        }
    };
    SelectFilterComponent.prototype.parameterPostChange = function (filterArray) {
        var sendObj = Object.assign(_super.prototype.transformInput.call(this, 'scopeID', this.scopeID), _super.prototype.transformInput.call(this, 'filterObj', this.filterScopeIDObj), _super.prototype.transformInput.call(this, 'result', Object.assign(_super.prototype.transformInput.call(this, 'filter', filterArray))));
        _super.prototype.sendMessageBase.call(this, this, sendObj);
    };
    SelectFilterComponent.prototype.dateFilterPostChange = function (filterArray) {
        var sendObj = Object.assign(_super.prototype.transformInput.call(this, 'scopeID', this.scopeID), _super.prototype.transformInput.call(this, 'filterObj', this.filterScopeIDObj), _super.prototype.transformInput.call(this, 'result', Object.assign(_super.prototype.transformInput.call(this, 'date', filterArray))));
        _super.prototype.sendMessageBase.call(this, this, sendObj);
    };
    SelectFilterComponent.prototype.metricChange = function (filterArray) {
        var sendObj = Object.assign(_super.prototype.transformInput.call(this, 'scopeID', this.scopeID), _super.prototype.transformInput.call(this, 'filterObj', this.filterScopeIDObj), _super.prototype.transformInput.call(this, 'result', Object.assign(_super.prototype.transformInput.call(this, 'metrics', filterArray))));
        _super.prototype.sendMessageBase.call(this, this, sendObj);
    };
    //渲染html
    SelectFilterComponent.prototype.renderRFMFilterHtml = function () {
        var optionList = "";
        optionList += '<div class="lifecycle_top_list">';
        optionList += '<div class="lifecycle_top_list_title" data-type="date_title"><span></span><em>请选择</em></div>';
        optionList += '<div class="rfmFilter_list_layer lifecycle_top_list_layer">';
        optionList += '<ul data-type="filter_select"></ul>';
        optionList += '</div>';
        optionList += '</div>';
        $('#' + this.scopeID).find(".selectFilter").html(optionList);
    };
    SelectFilterComponent.prototype.changeFilterArray = function (type, value) {
        if (this.changePostFilterArray.length > 0) {
            for (var _i = 0, _a = this.changePostFilterArray; _i < _a.length; _i++) {
                var item = _a[_i];
                if (item.field == type) {
                    item.value = value;
                }
            }
        }
        else {
            this.changePostFilterArray = [{
                    field: type,
                    operator: "=",
                    value: value
                }];
        }
        return this.changePostFilterArray;
    };
    SelectFilterComponent.prototype.changeMetricArray = function (value) {
        var metricArray = [];
        var metricArr = value.split("|"), obj = {};
        for (var i = 0; i < metricArr.length; i++) {
            obj = { 'field': metricArr[i], 'alias': this.indicateMap[metricArr[i]] };
            metricArray.push(obj);
        }
        return metricArray;
    };
    SelectFilterComponent.prototype.postChange = function (postQuery, type) {
        switch (type) {
            case "brand":
                postQuery = {
                    "datasource_id": 55,
                    "dimensions": [{ "field": "brand_name", "alias": "key" }, { "field": "brand_value", "alias": "value" }]
                };
                break;
            case "channel":
                postQuery = {
                    "datasource_id": 59,
                    "dimensions": [{ "field": "channel_name", "alias": "key" }, {
                            "field": "channel_value",
                            "alias": "value"
                        }]
                };
                break;
        }
        var sendObj = Object.assign(_super.prototype.transformInput.call(this, 'scopeID', this.scopeID), _super.prototype.transformInput.call(this, 'result', postQuery));
        _super.prototype.onChange.call(this, this, sendObj);
    };
    return SelectFilterComponent;
}(base_component_1.BaseComponent));
exports.SelectFilterComponent = SelectFilterComponent;
//# sourceMappingURL=selectFilter.component.js.map