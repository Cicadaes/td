"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var base_component_1 = require("../base.component");
var filter_template_1 = require("./filter.template");
var filter_model_1 = require("./filter.model");
var $ = require("jquery");
//import * as Calendar from './calendar_base';
//import * as TD_Day_week_monthPicke from './day_week_month';
//import * as calendarDay from './calendarDay';
var calandar = require("./calendar.js");
// import * as calandar from './calandar.js'
var FilterComponent = (function (_super) {
    __extends(FilterComponent, _super);
    function FilterComponent() {
        var _this = _super.call(this) || this;
        _this.myPrimeui = null;
        _this.filterData = null;
        _this.filterScopeIDObj = null;
        _this.dateType = 'day';
        var template = new filter_template_1.FilterTemplate(_this.scopeID);
        //获得模板渲染后的节点
        _this.element = _this.render(template);
        _this.filterData = new filter_model_1.FilterModel();
        return _this;
    }
    FilterComponent.prototype.beforeShow = function () {
    };
    FilterComponent.prototype.afterShow = function () {
        this.init();
    };
    FilterComponent.prototype.beforeDestory = function () {
    };
    FilterComponent.prototype.afterDestory = function () {
    };
    FilterComponent.prototype.resize = function () {
    };
    FilterComponent.prototype.getconfiginformation = function (event, changeObj) {
        if (!this.isEmptyObject(changeObj.result)) {
            if (changeObj.filter !== undefined && changeObj.filter == "filter") {
                return;
            }
            else {
                this.filterScopeIDObj = changeObj.result;
            }
        }
        else {
            return;
        }
    };
    FilterComponent.prototype.dataChange = function (data) {
    };
    FilterComponent.prototype.styleChange = function (style) {
    };
    FilterComponent.prototype.loadData = function () {
    };
    //日历控件
    FilterComponent.prototype.renderDate = function (time, days, month, dateType) {
    };
    FilterComponent.prototype.fomatDate = function () {
    };
    FilterComponent.prototype.eventBindHtml = function () {
        var that = this;
        var text = $(this).attr('data-type');
        $('.date-calendar').text(this.getFormatDate(30) + '~' + this.getFormatDate(1));
        calandar.calendarDay("#calendar", function (data) {
            console.log(data, 'ts里边拿到没---日日--？');
            $('.date-calendar').text(data.start + '~' + data.end);
            //发送请求
            that.changePostChange(that.changeFilterArray(data.start, data.end), text);
        });
        //发送请求
        //that.changePostChange(that.changeFilterArray(this.getFormatDate(30), this.getFormatDate(30)), text);
        //1.显示隐藏指标面板
        $('.filter-choice').click(function (e) {
            $('.filter-choice-list').fadeIn();
            e.stopPropagation();
        });
        $(document).click(function () {
            $('.filter-choice-list').fadeOut();
        });
        //2.选中某个指标
        $('.filter-choice-list li').click(function (e) {
            var text = $(this).attr('data-type');
            var showText = '';
            $('#calendar').html('');
            switch (text) {
                case 'day':
                    //默认7天
                    showText = '按天查看';
                    calandar.calendarDay("#calendar", function (data) {
                        console.log(data, 'ts里边拿到没---日日--？');
                        $('.date-calendar').text(data.start + '~' + data.end);
                        //发送请求
                        that.changePostChange(that.changeFilterArray(data.start, data.end), text);
                    });
                    break;
                case 'week':
                    //默认8周
                    showText = '按周查看';
                    $('.date-calendar').text(that.getFormatDate(56) + '~' + that.getFormatDate(1));
                    calandar.calendarWeek("#calendar", function (data) {
                        console.log(data, 'ts里边拿到没--周周---？');
                        $('.date-calendar').text(data.start + '~' + data.end);
                        //发送请求
                        that.changePostChange(that.changeFilterArray(data.weekStart, data.weekEnd), text);
                    });
                    break;
                case 'month':
                    //默认6个月
                    showText = '按月查看';
                    $('.date-calendar').text(that.getFormatDate(180) + '~' + that.getFormatDate(1));
                    calandar.calendarMonth('#calendar', function (data) {
                        //debugger
                        console.log(data, 'ts里边拿到没---月月--？');
                        $('.date-calendar').text(data.start + '~' + data.end);
                        //发送请求
                        that.changePostChange(that.changeFilterArray(data.monthStart, data.monthEnd), text);
                    });
                    break;
            }
            $('.show-date').text(showText);
            $('.filter-choice-list').fadeOut();
            e.stopPropagation();
        });
    };
    FilterComponent.prototype.init = function () {
        var that = this;
        this.eventBindHtml();
    };
    FilterComponent.prototype.changePostChange = function (filterArray, dateType) {
        if (!this.isEmptyObject(this.filterScopeIDObj)) {
            var resultObj = _super.prototype.transformInput.call(this, 'date', filterArray);
            resultObj["dateType"] = dateType;
            var sendObj = Object.assign(_super.prototype.transformInput.call(this, 'scopeID', this.scopeID), _super.prototype.transformInput.call(this, 'filterObj', this.filterScopeIDObj), _super.prototype.transformInput.call(this, 'result', resultObj));
            _super.prototype.sendMessageBase.call(this, this, sendObj);
        }
        else {
            return;
        }
    };
    FilterComponent.prototype.changeFilterArray = function (start, end) {
        var changePostFilterObj = [
            { 'field': 'date', 'operator': '>=', 'value': start },
            { 'field': 'date', 'operator': '<=', 'value': end },
        ];
        return changePostFilterObj;
    };
    return FilterComponent;
}(base_component_1.BaseComponent));
exports.FilterComponent = FilterComponent;
//# sourceMappingURL=filter.component.js.map