"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var base_component_1 = require("../base.component");
var monthCalendarFilter_template_1 = require("./monthCalendarFilter.template");
var monthCalendarFilter_model_1 = require("./monthCalendarFilter.model");
var $ = require("jquery");
var calandar = require("./calendar.js");
var utils_1 = require("../../../../public/scripts/utils");
var dataSourceConfig_1 = require("../../../dataSourceConfig");
var MonthCalendarFilterComponent = (function (_super) {
    __extends(MonthCalendarFilterComponent, _super);
    function MonthCalendarFilterComponent() {
        var _this = _super.call(this) || this;
        _this.myPrimeui = null;
        _this.filterData = null;
        _this.filterScopeIDObj = null;
        _this.monthArray = [];
        _this.listMonthArr = [];
        var template = new monthCalendarFilter_template_1.MonthCalendarFilterTemplate(_this.scopeID);
        //获得模板渲染后的节点
        _this.element = _this.render(template);
        _this.filterData = new monthCalendarFilter_model_1.MonthCalendarFilterModel();
        return _this;
    }
    MonthCalendarFilterComponent.prototype.beforeShow = function () {
    };
    MonthCalendarFilterComponent.prototype.afterShow = function () {
        this.init();
    };
    MonthCalendarFilterComponent.prototype.beforeDestory = function () {
    };
    MonthCalendarFilterComponent.prototype.afterDestory = function () {
    };
    MonthCalendarFilterComponent.prototype.resize = function () {
    };
    MonthCalendarFilterComponent.prototype.getconfiginformation = function (event, changeObj) {
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
    MonthCalendarFilterComponent.prototype.dataChange = function (data) {
    };
    MonthCalendarFilterComponent.prototype.styleChange = function (style) {
    };
    MonthCalendarFilterComponent.prototype.loadData = function () {
    };
    //日历控件
    MonthCalendarFilterComponent.prototype.renderDate = function (time, days, month, dateType) {
    };
    MonthCalendarFilterComponent.prototype.fomatDate = function () {
    };
    MonthCalendarFilterComponent.prototype.eventBindHtml = function () {
        var that = this;
        var text = $(this).attr('data-type'), monthDate;
        if (dataSourceConfig_1.DataSourceConfig.getMonthFormatDate() == dataSourceConfig_1.DataSourceConfig.getTodayFormatDate()) {
            that.monthArray.push({
                month: dataSourceConfig_1.DataSourceConfig.getValueFormatDate(1)
            });
            monthDate = dataSourceConfig_1.DataSourceConfig.getValueFormatDate(1);
        }
        else {
            that.monthArray.push({
                month: utils_1.Utils.changeDate(dataSourceConfig_1.DataSourceConfig.getMonthFormatDate(), "-", "")
            });
            monthDate = dataSourceConfig_1.DataSourceConfig.getMonthFormatDate();
        }
        that.listMonthArr.push({
            month: dataSourceConfig_1.DataSourceConfig.getMonthShowFormatDate(),
            day: monthDate
        });
        that.renderMonthHtml(that.listMonthArr);
        calandar.calendarMonth("#calendar", function (data) {
            console.log(data, 'ts里边拿到没---日日--？', data.monthEnd);
            //发送请求
            $('.date-calendar').text(data.monthEnd);
            var date = utils_1.Utils.changeDate(data.end, "/", "");
            that.renderMonthHtml(that.decideMonth(data.monthEnd, that.listMonthArr, date));
            that.decideArr();
            // console.log(date,DataSourceConfig.getTodayFormatDate())
            if (date == dataSourceConfig_1.DataSourceConfig.getTodayFormatDate()) {
                date = dataSourceConfig_1.DataSourceConfig.getValueFormatDate(1);
            }
            that.changePostChange(that.changeFilterArray(that.decideMonth(date, that.monthArray, date)));
        });
        //1.显示隐藏指标面板
        $('.filter-choice').click(function (e) {
            $('.filter-choice-list').fadeIn();
            e.stopPropagation();
        });
        $(document).click(function () {
            $('.filter-choice-list').fadeOut();
        });
        $(document).ready(function () {
            var $componentBody = $(document.body);
            $componentBody.on('click', '.monthCalendar_list span', function (event) {
                var $target = $(event.target);
                that.renderMonthHtml(that.deleteListMonthArr($target.siblings('em').text(), that.listMonthArr));
                that.changePostChange(that.changeFilterArray(that.deleteListMonthArr(utils_1.Utils.changeDate($target.attr('data-day'), "-", ""), that.monthArray)));
                that.decideArr();
                event.stopPropagation();
            });
        });
    };
    //从数组中删除
    MonthCalendarFilterComponent.prototype.deleteListMonthArr = function (text, arr) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].month == text) {
                arr.splice(i, 1);
            }
        }
        return arr;
    };
    MonthCalendarFilterComponent.prototype.decideArr = function () {
        if (this.listMonthArr.length > 4) {
            $("#" + this.scopeID).find('.monthCalendar_button').addClass("monthCalendar_none");
            $("#" + this.scopeID).find('.monthCalendarFilter').addClass("poinent_none");
        }
        else {
            $("#" + this.scopeID).find('.monthCalendar_button').removeClass("monthCalendar_none");
            $("#" + this.scopeID).find('.monthCalendarFilter').removeClass("poinent_none");
        }
    };
    MonthCalendarFilterComponent.prototype.renderMonthHtml = function (arr) {
        var option = "";
        for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
            var item = arr_1[_i];
            option += '<li><span data-day=' + item.day + '></span><em>' + item.month + '</em></li>';
        }
        $("#" + this.scopeID).find('.monthCalendar_list').html(option);
    };
    MonthCalendarFilterComponent.prototype.decideMonth = function (monthEnd, arr, dayEnd) {
        var monthBool = false;
        for (var _i = 0, arr_2 = arr; _i < arr_2.length; _i++) {
            var item = arr_2[_i];
            if (item.month == monthEnd) {
                monthBool = true;
            }
        }
        if (!monthBool) {
            arr.push({ month: monthEnd, day: dayEnd });
        }
        return arr;
    };
    MonthCalendarFilterComponent.prototype.init = function () {
        var that = this;
        this.eventBindHtml();
    };
    MonthCalendarFilterComponent.prototype.changePostChange = function (filterArray) {
        if (!this.isEmptyObject(this.filterScopeIDObj)) {
            var resultObj = _super.prototype.transformInput.call(this, 'date', filterArray);
            var sendObj = Object.assign(_super.prototype.transformInput.call(this, 'scopeID', this.scopeID), _super.prototype.transformInput.call(this, 'filterObj', this.filterScopeIDObj), _super.prototype.transformInput.call(this, 'result', resultObj));
            _super.prototype.sendMessageBase.call(this, this, sendObj);
        }
        else {
            return;
        }
    };
    MonthCalendarFilterComponent.prototype.changeFilterArray = function (monthArray) {
        var valueArr = [];
        for (var _i = 0, monthArray_1 = monthArray; _i < monthArray_1.length; _i++) {
            var item = monthArray_1[_i];
            valueArr.push(item.month);
        }
        var changePostFilterObj = [
            { "field": "calculated_date", "operator": "in", "value": valueArr.toString() }
        ];
        return changePostFilterObj;
    };
    return MonthCalendarFilterComponent;
}(base_component_1.BaseComponent));
exports.MonthCalendarFilterComponent = MonthCalendarFilterComponent;
//# sourceMappingURL=monthCalendarFilter.component.js.map