"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var base_component_1 = require("../base.component");
var singleCalendarFilter_template_1 = require("./singleCalendarFilter.template");
var singleCalendarFilter_model_1 = require("./singleCalendarFilter.model");
var $ = require("jquery");
var calandar = require("./calendar.js");
var utils_1 = require("../../../../public/scripts/utils");
var dataSourceConfig_1 = require("../../../dataSourceConfig");
var SingleCalendarFilterComponent = (function (_super) {
    __extends(SingleCalendarFilterComponent, _super);
    function SingleCalendarFilterComponent() {
        var _this = _super.call(this) || this;
        _this.myPrimeui = null;
        _this.filterData = null;
        _this.filterScopeIDObj = null;
        _this.dateType = 'day';
        var template = new singleCalendarFilter_template_1.SingleCalendarFilterTemplate(_this.scopeID);
        //获得模板渲染后的节点
        _this.element = _this.render(template);
        _this.filterData = new singleCalendarFilter_model_1.SingleCalendarFilterModel();
        return _this;
    }
    SingleCalendarFilterComponent.prototype.beforeShow = function () {
    };
    SingleCalendarFilterComponent.prototype.afterShow = function () {
        this.init();
    };
    SingleCalendarFilterComponent.prototype.beforeDestory = function () {
    };
    SingleCalendarFilterComponent.prototype.afterDestory = function () {
    };
    SingleCalendarFilterComponent.prototype.resize = function () {
    };
    SingleCalendarFilterComponent.prototype.getconfiginformation = function (event, changeObj) {
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
    SingleCalendarFilterComponent.prototype.dataChange = function (data) {
    };
    SingleCalendarFilterComponent.prototype.styleChange = function (style) {
    };
    SingleCalendarFilterComponent.prototype.loadData = function () {
    };
    //日历控件
    SingleCalendarFilterComponent.prototype.renderDate = function (time, days, month, dateType) {
    };
    SingleCalendarFilterComponent.prototype.fomatDate = function () {
    };
    SingleCalendarFilterComponent.prototype.eventBindHtml = function () {
        var that = this;
        $('#' + that.scopeID).find(".date-calendar").text(that.getFormatDate(1));
        calandar.calendarDay("#singleCalendar", function (data) {
            console.log(data, 'ts里边拿到没---日日--？9999');
            //发送请求
            $('.date-calendar').text(data.end);
            data.start = dataSourceConfig_1.DataSourceConfig.getLastMonthFormatDate(29, utils_1.Utils.changeDate(data.end, "-", "/"));
            data.end = utils_1.Utils.changeDate(data.end, "-", "");
            that.changePostChange(that.changeFilterArray(data.start, data.end));
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
    SingleCalendarFilterComponent.prototype.init = function () {
        this.eventBindHtml();
    };
    SingleCalendarFilterComponent.prototype.changePostChange = function (filterArray) {
        if (!this.isEmptyObject(this.filterScopeIDObj)) {
            var resultObj = _super.prototype.transformInput.call(this, 'date', filterArray);
            var sendObj = Object.assign(_super.prototype.transformInput.call(this, 'scopeID', this.scopeID), _super.prototype.transformInput.call(this, 'filterObj', this.filterScopeIDObj), _super.prototype.transformInput.call(this, 'result', resultObj));
            _super.prototype.sendMessageBase.call(this, this, sendObj);
        }
        else {
            return;
        }
    };
    SingleCalendarFilterComponent.prototype.changeFilterArray = function (start, end) {
        var changePostFilterObj = [
            { "field": "calculated_date", "operator": ">=", "value": start },
            { "field": "calculated_date", "operator": "<=", "value": end }
        ];
        return changePostFilterObj;
    };
    return SingleCalendarFilterComponent;
}(base_component_1.BaseComponent));
exports.SingleCalendarFilterComponent = SingleCalendarFilterComponent;
//# sourceMappingURL=singleCalendarFilter.component.js.map