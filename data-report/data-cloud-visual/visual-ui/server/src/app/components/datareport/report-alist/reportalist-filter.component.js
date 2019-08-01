"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var reportpublishing_service_1 = require("../report-service/reportpublishing.service");
var ReportalistFilterComponent = (function () {
    function ReportalistFilterComponent(communication) {
        this.communication = communication;
        this.statusList = [
            { label: "", value: null },
            { label: "有效", value: "1" },
            { label: "无效", value: "0" }
        ];
        this.createTimePicker = {
            showIcon: true,
            placeholder: '选择时间',
            ranges: [
                { label: '今天', day: 1 },
                { label: '最近七天', day: 7 },
                { label: '最近一个月', day: 30 }
            ]
        };
        this.updateTimePicker = {
            showIcon: true,
            placeholder: '选择时间',
            ranges: [
                { label: '今天', day: 1 },
                { label: '最近七天', day: 7 },
                { label: '最近一个月', day: 30 }
            ]
        };
    }
    ReportalistFilterComponent.prototype.ngOnInit = function () { };
    ReportalistFilterComponent.prototype.search = function () {
        var _this = this;
        var queryObj = {};
        // 模糊查询的字段统一处理
        var likeParams = ["name"];
        likeParams.forEach(function (s) {
            if (_this[s]) {
                queryObj[s] = "%" + _this[s]["replace"](/([%\\_])/g, "\\$1") + "%";
                queryObj[s + 'Operator'] = "like";
            }
        });
        var timeUpdateParams = ["updateTime"];
        timeUpdateParams.forEach(function (s) {
            if (_this[s + 'Picker'].data) {
                if (_this[s + 'Picker'].data.start) {
                    queryObj[s + '1'] = _this.dateFormat(_this[s + 'Picker'].data.start) + " 00:00:00";
                }
                if (_this[s + 'Picker'].data.end) {
                    queryObj[s + '2'] = _this.dateFormat(_this[s + 'Picker'].data.end) + " 23:59:59";
                }
            }
        });
        this.communication.setQueryObj(queryObj);
        this.communication.changePage(1);
    };
    ReportalistFilterComponent.prototype.reset = function () {
        this.status = null;
        this.name = null;
        if (this.updateTimePicker.data) {
            this.updateTimePicker.data.start = this.updateTimePicker.data.end = null;
        }
    };
    ReportalistFilterComponent.prototype.dateFormat = function (date) {
        var year, month, day, endDay;
        year = date.getFullYear();
        year = year < 10 ? "0" + year : year;
        month = date.getMonth() + 1;
        month = month < 10 ? "0" + month : month;
        day = date.getDate();
        day = day < 10 ? "0" + day : day;
        endDay = date.getDate() + 1;
        endDay = endDay < 10 ? "0" + endDay : endDay;
        return year + "-" + month + "-" + day;
    };
    return ReportalistFilterComponent;
}());
ReportalistFilterComponent = __decorate([
    core_1.Component({
        selector: 'reportalist-filter',
        templateUrl: 'reportalist-filter.component.html',
        styles: ["\n        .filter{\n            padding: 20px 45px;\n            padding-right: 250px;\n            position: relative;\n            z-index: 3;\n            background: #fbfcfe;\n            border-bottom: 1px solid #dee6ed;\n            border-top: 1px solid #dee6ed;\n        }\n        .filter-left{\n            float: left;\n            width: 100%;\n        }\n        .filter-left  li{\n            width: calc(20% - 110px);\n            float: left;\n            margin: 6px 20px 6px 0;\n            padding-left: 90px;\n            height: 32px;\n        }\n        .filter-left .filterKey{\n            display: inline-block;\n            width: 74px;\n            margin-left: -90px;\n            height: 30px;\n            line-height: 30px;\n            float: left;\n            padding-right: 16px;\n            text-align: right;\n        }\n        .filter .drop-down{\n            position: relative;\n        }\n        .filter .selectwrap  .drop-down .fa-calendar{\n            position: absolute;\n            top:10px;\n            right:5px;\n            cursor: pointer;\n        }\n        .filter .selectwrap{\n            position: relative;\n        }\n        .filter  .filter-left .select{\n            width: 100%;\n            height: 32px;\n            border: 1px solid #dfe7f2;\n            border-radius: 3px;\n            padding-left: 10px;\n            cursor: pointer;\n            appearance:button;\n            -webkit-appearance:button;\n        }\n        .filter .selectwrap .fa-caret-down{\n            position: absolute;\n            right: 6px;\n            top: 8px;\n            cursor: pointer;\n        }\n        .filter-left  input{\n            width: calc(100% - 22px)!important;\n            padding: 0 10px;\n        }\n        .filter-left .time .showTime{\n            width: calc(100% - 22px);\n            padding: 0 10px;\n        }\n        .filter .filterBtnWrap{\n            margin-right: 20px;\n        }\n        \n        /*!*\u65F6\u95F4\u533A\u95F4*!*/\n        .dateRangeWrap {\n            position: relative;\n            z-index:1;\n            width: 415px;\n            border: 1px solid #ccc;\n            padding: 6px;\n            background: #eee;\n            border-radius: 3px;\n        }\n        .filter .time{\n            position: relative;\n        }\n        .filter .time  .dateRangeWrap{\n            position: absolute;\n            top: 42px;\n            left: 0;\n        }\n        .dateRangeWrap .dateButton{\n            width: 60px;\n            height: 25px;\n            background: #ccc;\n            border-radius: 2px;\n            color:#fff;\n            margin: 8px 8px 0 8px ;\n            float: right;\n        }\n        .dateRangeWrap .dateButton:hover{\n            background: #5697f1;\n        }\n        .time .timeBoxWrap{\n            height: 30px;\n            line-height: 30px;\n            margin: 5px;\n        }\n        .time .dateRangeWrap  .timeBox{\n            display: inline-block;\n            width: 200px;\n            height: 30px;\n            background: #fff;\n            border: 1px solid #ccc;\n            border-radius: 5px;\n            padding-left: 3px;\n            float: left;\n        }\n        .time .showTime{\n            display: inline-block;\n            width: 207px;\n            height: 29px;\n            border: 1px solid #dfe7f2;\n            border-radius: 3px;\n            float: left;\n            line-height: 29px;\n            padding-left: 3px;\n            background: #fff;\n        }\n        \n        .timeBoxWrap>a {\n            float: left;\n            margin-left: 5px;\n        }\n\n\n    "]
    }),
    __metadata("design:paramtypes", [reportpublishing_service_1.ReportPublishingCommunicationService])
], ReportalistFilterComponent);
exports.ReportalistFilterComponent = ReportalistFilterComponent;
//# sourceMappingURL=reportalist-filter.component.js.map