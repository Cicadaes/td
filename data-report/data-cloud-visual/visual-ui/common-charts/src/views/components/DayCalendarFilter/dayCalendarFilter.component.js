"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var base_component_1 = require("../base.component");
var dayCalendarFilter_template_1 = require("./dayCalendarFilter.template");
var dayCalendarFilter_model_1 = require("./dayCalendarFilter.model");
var $ = require("jquery");
var calandar = require("./../calendar/calendar.js");
var utils_1 = require("../../../../public/scripts/utils");
var DayCalendarFilterComponent = (function (_super) {
    __extends(DayCalendarFilterComponent, _super);
    function DayCalendarFilterComponent() {
        var _this = _super.call(this) || this;
        _this.myPrimeui = null;
        _this.filterData = null;
        _this.filterScopeIDObj = null;
        _this.dateType = 'day';
        var template = new dayCalendarFilter_template_1.DayCalendarFilterTemplate(_this.scopeID);
        //获得模板渲染后的节点
        _this.element = _this.render(template);
        _this.filterData = new dayCalendarFilter_model_1.DayCalendarFilterModel();
        return _this;
    }
    DayCalendarFilterComponent.prototype.beforeShow = function () {
    };
    DayCalendarFilterComponent.prototype.afterShow = function () {
        this.init();
    };
    DayCalendarFilterComponent.prototype.beforeDestory = function () {
    };
    DayCalendarFilterComponent.prototype.afterDestory = function () {
    };
    DayCalendarFilterComponent.prototype.resize = function () {
    };
    DayCalendarFilterComponent.prototype.getconfiginformation = function (event, changeObj) {
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
        // if(changeObj.result && changeObj.result.readyBuildQuery){
        //     $('.date-calendar').text(this.getFormatDate(30) + '~' + this.getFormatDate(1));
        //     //发送请求
        //     this.changePostChange(this.changeFilterArray(this.getFormatDate(7), this.getFormatDate(0)));
        //
        // }
    };
    DayCalendarFilterComponent.prototype.dataChange = function (data) {
    };
    DayCalendarFilterComponent.prototype.styleChange = function (style) {
    };
    DayCalendarFilterComponent.prototype.loadData = function () {
    };
    //日历控件
    DayCalendarFilterComponent.prototype.renderDate = function (time, days, month, dateType) {
    };
    DayCalendarFilterComponent.prototype.fomatDate = function () {
    };
    DayCalendarFilterComponent.prototype.eventBindHtml = function () {
        var that = this;
        $('.date-calendar').text(this.getFormatDate(30) + '~' + this.getFormatDate(1));
        calandar.calendarDay("#dayCalendar", function (data) {
            //发送请求
            $('.date-calendar').text(data.start + '~' + data.end);
            that.changePostChange(that.changeFilterArray(data.start, data.end), { start: utils_1.Utils.changeDate(data.start, "-", ""), end: utils_1.Utils.changeDate(data.end, "-", "") });
        });
        //1.显示隐藏指标面板
        $('.filter-choice').click(function (e) {
            $('.filter-choice-list').fadeIn();
            e.stopPropagation();
        });
        $(document).click(function () {
            $('.filter-choice-list').fadeOut();
        });
    };
    DayCalendarFilterComponent.prototype.init = function () {
        var that = this;
        this.eventBindHtml();
    };
    DayCalendarFilterComponent.prototype.changePostChange = function (filterArray, filterObj) {
        if (!this.isEmptyObject(this.filterScopeIDObj)) {
            var resultObj = Object.assign(_super.prototype.transformInput.call(this, 'date', filterArray), _super.prototype.transformInput.call(this, 'filterDate', filterObj));
            var sendObj = Object.assign(_super.prototype.transformInput.call(this, 'scopeID', this.scopeID), _super.prototype.transformInput.call(this, 'filterObj', this.filterScopeIDObj), _super.prototype.transformInput.call(this, 'result', resultObj));
            _super.prototype.sendMessageBase.call(this, this, sendObj);
        }
        else {
            return;
        }
    };
    DayCalendarFilterComponent.prototype.changeFilterArray = function (start, end) {
        var changePostFilterObj = [
            { "field": "calculated_date", "operator": "=", "value": utils_1.Utils.changeDate(start, "-", "") }
        ];
        return changePostFilterObj;
    };
    return DayCalendarFilterComponent;
}(base_component_1.BaseComponent));
exports.DayCalendarFilterComponent = DayCalendarFilterComponent;
//# sourceMappingURL=dayCalendarFilter.component.js.map