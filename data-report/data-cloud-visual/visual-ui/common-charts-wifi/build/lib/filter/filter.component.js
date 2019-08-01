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
// import * as pickerDateRange from './dateRange.js';
var FilterComponent = (function (_super) {
    __extends(FilterComponent, _super);
    function FilterComponent() {
        var _this = _super.call(this) || this;
        _this.myPrimeui = null;
        _this.filterData = null;
        var template = new filter_template_1.FilterTemplate(_this.scopeID);
        //获得模板渲染后的节点
        _this.element = _this.render(template);
        _this.filterData = new filter_model_1.FilterModel();
        return _this;
    }
    FilterComponent.prototype.beforeShow = function () {
    };
    FilterComponent.prototype.afterShow = function () {
    };
    FilterComponent.prototype.beforeDestory = function () {
    };
    FilterComponent.prototype.afterDestory = function () {
    };
    FilterComponent.prototype.resize = function () {
    };
    FilterComponent.prototype.dataChange = function (data) {
    };
    FilterComponent.prototype.styleChange = function (style) {
    };
    FilterComponent.prototype.loadData = function () {
        this.init();
    };
    FilterComponent.prototype.addScript = function () {
        var oScript = document.createElement('script');
        oScript.src = './dateRange.js';
        $('#' + this.scopeID).append(oScript);
    };
    //日历控件
    FilterComponent.prototype.renderDate = function (time, days, month) {
        function toDou(iNum) {
            return iNum < 10 ? '0' + iNum : '' + iNum;
        }
        function getDateTime(time, days, month) {
            var oDate = new Date(time - days * 24 * 3600 * 1000);
            //debugger
            return oDate.getFullYear() + '-' + toDou(oDate.getMonth() + 1 - month) + '-' + toDou(oDate.getDate());
        }
        // let dateRange: any = new pickerDateRange('date-calendar', {
        //     //aToday: 'aToday', //今天
        //     aYesterday: 'aYesterday', //昨天
        //     aRecent7Days: 'aRecent7Days', //最近7天
        //     //aRecent14Days: 'aRecent14Days', //最近14天
        //     aRecent30Days: 'aRecent30Days', //最近30天
        //     aRecent60Days: 'aRecent60Days', //最近60天
        //     //aRecent90Days: 'aRecent90Days', //最近90天
        //     isTodayValid: false, //今天是否可选
        //     defaultText: ' ~ ',
        //     inputTrigger: 'date-btn',
        //     theme: 'ta',
        //     startDate: getDateTime(time, days, month),
        //     endDate: getDateTime(time, 0, 0),
        //     success: function (obj: any) {
        //         //debugger
        //         console.log(obj, 'obj');
        //         console.log(obj.startDate, obj.endDate, '选取时间');
        //     }
        // }, $);
    };
    FilterComponent.prototype.eventBindHtml = function () {
        var that = this;
        var oDate = new Date().getTime();
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
            switch (text) {
                case 'day':
                    //默认7天
                    showText = '按天查看';
                    that.renderDate(oDate, 7, 0);
                    break;
                case 'week':
                    //默认8周
                    showText = '按周查看';
                    that.renderDate(oDate, 56, 0);
                    break;
                case 'month':
                    //默认6个月
                    showText = '按月查看';
                    that.renderDate(oDate, 0, 6);
                    break;
            }
            $('.show-date').text(showText);
            $('.filter-choice-list').fadeOut();
            e.stopPropagation();
        });
    };
    FilterComponent.prototype.init = function () {
        //this.addScript();
        var oDate = new Date().getTime();
        this.eventBindHtml();
        this.renderDate(oDate, 7, 0);
    };
    return FilterComponent;
}(base_component_1.BaseComponent));
exports.FilterComponent = FilterComponent;
//# sourceMappingURL=filter.component.js.map