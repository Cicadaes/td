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
var rfmFilter_template_1 = require("./rfmFilter.template");
var rfmFilter_model_1 = require("./rfmFilter.model");
var $ = require("jquery");
var RFMFilterComponent = (function (_super) {
    __extends(RFMFilterComponent, _super);
    function RFMFilterComponent() {
        var _this = _super.call(this) || this;
        _this.myChart = null;
        _this.chartData = null;
        _this.rfmFilterData = null;
        _this.echartData = null;
        _this.getSoreceData = null;
        _this.styleObj = null;
        _this.changeObj = null;
        _this.body = {};
        _this.filterValue = null;
        _this.filterType = null;
        _this.filterScopeIDObj = null;
        _this.topLevelFilter = false;
        _this.changePostFilterArray = [
            { "field": 'year_month', "operator": "=", "value": "201710" },
            { "field": 'brand_name', "operator": "=", "value": "all" },
            { "field": 'channel_name', "operator": "=", "value": "all" }
        ];
        _this.filterDate = "";
        _this.filterBrand = "all";
        _this.filterChannel = "all";
        _this.filterYearMonth = "";
        _this.postDate = false;
        _this.postBrand = false;
        _this.postChannel = false;
        _this.rfmChart = false;
        var template = new rfmFilter_template_1.RFMFilterTemplate(_this.scopeID);
        //获得模板渲染后的节点
        _this.element = _this.render(template);
        _this.rfmFilterData = new rfmFilter_model_1.RFMFilterModel();
        return _this;
    }
    RFMFilterComponent.prototype.beforeShow = function () {
    };
    RFMFilterComponent.prototype.afterShow = function () {
    };
    RFMFilterComponent.prototype.beforeDestory = function () {
    };
    RFMFilterComponent.prototype.afterDestory = function () {
    };
    RFMFilterComponent.prototype.resize = function () {
    };
    RFMFilterComponent.prototype.getconfiginformation = function (event, changeObj) {
        if (!this.isEmptyObject(changeObj.result)) {
            if (changeObj.result && changeObj.result.readyBuildQuery) {
                this.filterScopeIDObj = changeObj.result;
                this.topLevelFilter = changeObj.result.topLevelFilter;
                this.postDate = false;
                this.postBrand = false;
                this.postChannel = false;
                this.postChange({ "datasource_id": 54 });
            }
        }
        else {
            return;
        }
    };
    RFMFilterComponent.prototype.filterChange = function (event, data) {
    };
    RFMFilterComponent.prototype.dataChange = function (data) {
        var $divDateHtml = $('#' + this.scopeID).find('div[data-type="date_title"]'), $divBrandHtml = $('#' + this.scopeID).find('div[data-type="brand_title"]');
        if (!this.postDate) {
            if (data.length > 0) {
                this.filterDate = data[0].value;
                this.filterYearMonth = data[0].key;
                $divDateHtml.html(data[0].value);
            }
            else {
                this.filterDate = "2017-11-01~2017-11-30";
                this.filterYearMonth = "201711";
            }
            var $div = $('#' + this.scopeID).find('ul[data-type="filter_date"]');
            this.postDate = true;
            this.postBrand = true;
            this.renderSelectListHtml($div, data);
            this.postChange({ "datasource_id": 55, "dimensions": [{ "field": "brand_name", "alias": "key" }, { "field": "brand_value", "alias": "value" }] });
            return;
        }
        if (this.postBrand && $divDateHtml.text() !== "请选择") {
            if (data.length > 0) {
                $divBrandHtml.html(data[0].value);
            }
            var $div = $('#' + this.scopeID).find('ul[data-type="filter_brand"]');
            this.renderSelectListHtml($div, data);
            this.postBrand = false;
            this.postChannel = true;
            this.postChange({ "datasource_id": 56, "dimensions": [{ "field": "channel_name", "alias": "key" }, { "field": "channel_value", "alias": "value" }] });
            return;
        }
        if (this.postDate && !this.postBrand && this.postChannel && $divBrandHtml.text() !== "请选择") {
            if (data.length > 0) {
                $('#' + this.scopeID).find('div[data-type="channel_title"]').html(data[0].value);
            }
            var $div = $('#' + this.scopeID).find('ul[data-type="filter_channel"]');
            this.renderSelectListHtml($div, data);
            this.postChannel = false;
            if (this.postDate && !this.postBrand && !this.postChannel) {
                this.changePostFilterArray[0].value = this.filterYearMonth;
                //发送请求
                this.parameterPostChange(this.changePostFilterArray);
            }
        }
    };
    //渲染第一个下拉框list
    RFMFilterComponent.prototype.renderSelectListHtml = function ($div, data) {
        var optionList = "";
        if (data.length > 0) {
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var item = data_1[_i];
                optionList += '<li data-id=' + item.key + '>' + item.value + '</li>';
            }
        }
        else {
            optionList += '<p>暂无数据</p>';
        }
        $div.html(optionList);
    };
    RFMFilterComponent.prototype.styleChange = function (style) {
    };
    RFMFilterComponent.prototype.loadData = function () {
        this.init();
    };
    Object.defineProperty(RFMFilterComponent.prototype, "data", {
        get: function () {
            return this.chartData;
        },
        enumerable: true,
        configurable: true
    });
    RFMFilterComponent.prototype.init = function () {
        this.renderRFMFilterHtml();
        this.commonChange();
    };
    RFMFilterComponent.prototype.commonChange = function () {
        var _self = this;
        // 点击blank
        $(document).click(function (event) {
            $('.rfmFilter_list_layer').hide();
        });
        $(document).ready(function () {
            var $rfmFilter = $('#' + _self.scopeID).find('div[rfmFilter]');
            //click get dropdown get list
            $rfmFilter.on('click', '.rfmFilter_list', function (event) {
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
                $tagget.siblings().text($(event.target).text());
                //点击设置已选择的value
                _self.filterValue = $(event.target).text();
                if (_self.filterValue == "全部品牌" || _self.filterValue == "全部渠道") {
                    _self.filterValue = "all";
                }
                //点击设置选择的类型
                _self.filterType = $tagget.parent().attr("data-type");
                if (_self.filterType == "year_month") {
                    _self.filterDate = _self.filterValue;
                    _self.filterValue = $(event.target).attr("data-id");
                    _self.filterYearMonth = _self.filterValue;
                }
                else if (_self.filterType == "brand_name") {
                    _self.filterBrand = _self.filterValue;
                }
                else if (_self.filterType == "channel_name") {
                    _self.filterChannel = _self.filterValue;
                }
                //发送请求
                _self.parameterPostChange(_self.changeFilterArray(_self.filterType, _self.filterValue));
            });
        });
    };
    //渲染html
    RFMFilterComponent.prototype.renderRFMFilterHtml = function () {
        var optionList = "";
        optionList += '<div class="rfmFilter_list" style="width: 200px" data-type="year_month">';
        optionList += '<div class="rfmFilter_list_title" data-type="date_title">请选择</div>';
        optionList += '<div class="rfmFilter_list_layer">';
        optionList += '<ul data-type="filter_date"></ul>';
        optionList += '</div>';
        optionList += '</div>';
        optionList += '<div class="rfmFilter_list" data-type="brand_name">';
        optionList += '<div class="rfmFilter_list_title" data-type="brand_title">请选择</div>';
        optionList += '<div class="rfmFilter_list_layer">';
        optionList += '<ul data-type="filter_brand"></ul>';
        optionList += '</div>';
        optionList += '</div>';
        optionList += '<div class="rfmFilter_list" data-type="channel_name">';
        optionList += '<div class="rfmFilter_list_title" data-type="channel_title">请选择</div>';
        optionList += '<div class="rfmFilter_list_layer">';
        optionList += '<ul data-type="filter_channel"></ul>';
        optionList += '</div>';
        optionList += '</div>';
        $('#' + this.scopeID).find(".rfmFilter").html(optionList);
    };
    RFMFilterComponent.prototype.parameterPostChange = function (filterArray) {
        this.rfmChart = true;
        var sendObj = Object.assign(_super.prototype.transformInput.call(this, 'scopeID', this.scopeID), _super.prototype.transformInput.call(this, 'filterObj', this.filterScopeIDObj), _super.prototype.transformInput.call(this, 'result', Object.assign(_super.prototype.transformInput.call(this, 'filter', filterArray), _super.prototype.transformInput.call(this, 'chart', {
            date: this.filterDate,
            yearMonth: this.filterYearMonth,
            brand: this.filterBrand,
            channel: this.filterChannel
        }))));
        _super.prototype.sendMessageBase.call(this, this, sendObj);
    };
    RFMFilterComponent.prototype.changeFilterArray = function (type, value) {
        for (var _i = 0, _a = this.changePostFilterArray; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item.field == type) {
                item.value = value;
            }
        }
        return this.changePostFilterArray;
    };
    RFMFilterComponent.prototype.postChange = function (postQuery) {
        var sendObj = Object.assign(_super.prototype.transformInput.call(this, 'scopeID', this.scopeID), _super.prototype.transformInput.call(this, 'result', postQuery));
        _super.prototype.onChange.call(this, this, sendObj);
    };
    return RFMFilterComponent;
}(base_component_1.BaseComponent));
exports.RFMFilterComponent = RFMFilterComponent;
//# sourceMappingURL=rfmFilter.component.js.map