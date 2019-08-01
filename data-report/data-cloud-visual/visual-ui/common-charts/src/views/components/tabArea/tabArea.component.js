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
var tabArea_template_1 = require("./tabArea.template");
var utils_1 = require("../../../../public/scripts/utils");
var tabArea_model_1 = require("./tabArea.model");
var $ = require("jquery");
var dataSourceConfig_1 = require("../../../dataSourceConfig");
var TabAreaComponent = (function (_super) {
    __extends(TabAreaComponent, _super);
    function TabAreaComponent() {
        var _this = _super.call(this) || this;
        _this.myChart = null;
        _this.chartData = null;
        _this.lineData = null;
        _this.echartData = null;
        _this.getSoreceData = null;
        _this.styleObj = null;
        _this.changeObj = null;
        _this.body = {};
        _this.filterScopeIDObj = null;
        _this.targetType = "1";
        var template = new tabArea_template_1.TabAreaTemplate(_this.scopeID);
        //获得模板渲染后的节点
        _this.element = _this.render(template);
        _this.lineData = new tabArea_model_1.TabAreaModel();
        return _this;
    }
    TabAreaComponent.prototype.beforeShow = function () {
    };
    TabAreaComponent.prototype.afterShow = function () {
        this.init();
    };
    TabAreaComponent.prototype.beforeDestory = function () {
    };
    TabAreaComponent.prototype.afterDestory = function () {
    };
    TabAreaComponent.prototype.resize = function () {
    };
    TabAreaComponent.prototype.setBodyObj = function (result) {
        this.body = dataSourceConfig_1.DataSourceConfig.getConfigByKey(result.dscKey);
        this.body["charUUID"] = this.scopeID;
        this.body["requestTitle"] = "tabArea";
        return this.body;
    };
    TabAreaComponent.prototype.getconfiginformation = function (event, changeObj) {
        if (!this.isEmptyObject(changeObj.result)) {
            this.filterScopeIDObj = changeObj.result;
            this.setBodyObj(changeObj.result);
        }
        else {
            return;
        }
        if (changeObj.result && changeObj.result.readyBuildQuery) {
            this.postChange(this.body);
        }
    };
    TabAreaComponent.prototype.filterChange = function (event, data) {
        this.body = dataSourceConfig_1.DataSourceConfig.mergeBodyByFilter(this.body, data);
        this.body['dateFilters'][0]['value'] = data['date'][1]['value'];
        this.postChange(this.body);
    };
    TabAreaComponent.prototype.mergeFilterChange = function (event, target) {
        _super.prototype.onFilterChange.call(this, this, target);
    };
    TabAreaComponent.prototype.dataChange = function (data) {
        this.renderHtml(data);
    };
    TabAreaComponent.prototype.styleChange = function (style) {
    };
    TabAreaComponent.prototype.loadData = function () {
    };
    Object.defineProperty(TabAreaComponent.prototype, "data", {
        get: function () {
            return this.chartData;
        },
        enumerable: true,
        configurable: true
    });
    TabAreaComponent.prototype.init = function () {
        //commonchange
        this.commonChange();
    };
    TabAreaComponent.prototype.renderHtml = function (datasourceData) {
        if (datasourceData.length > 0) {
            var optionList = "";
            for (var key in utils_1.Utils.lifeCycleMap) {
                for (var _i = 0, datasourceData_1 = datasourceData; _i < datasourceData_1.length; _i++) {
                    var item = datasourceData_1[_i];
                    if (utils_1.Utils.lifeCycleMap[key] == item.cycle) {
                        optionList += '<dl data-type=' + item.cycle + '>';
                        optionList += '<dt>' + key + '</dt>';
                        optionList += '<dd>' + utils_1.Utils.parseFormatNum(item.value, 0) + '</dd>';
                        optionList += '</dl>';
                    }
                }
            }
            //把第i项放入已选择框里
            $('#' + this.scopeID).find("div[commonTabAreaList]").html(optionList);
            $('#' + this.scopeID).find(".component_tabArea_title dl").css("width", "calc(100%/`${data.length}`)");
            $('#' + this.scopeID).find("div[commonTabAreaList] dl").eq(parseInt(this.targetType) - 1).addClass("tabArea_title_choose");
        }
        else {
            var optionData = [{ "cycle": 1, "value": "--" }, { "cycle": 2, "value": "--" }, { "cycle": 3, "value": "--" }, { "cycle": 4, "value": "--" }, { "cycle": 5, "value": "--" }, { "cycle": 6, "value": "--" }, { "cycle": 7, "value": "--" }];
            var optionList = "";
            for (var key in utils_1.Utils.lifeCycleMap) {
                for (var _a = 0, optionData_1 = optionData; _a < optionData_1.length; _a++) {
                    var item = optionData_1[_a];
                    if (utils_1.Utils.lifeCycleMap[key] == item.cycle) {
                        optionList += '<dl data-type=' + item.cycle + '>';
                        optionList += '<dt>' + key + '</dt>';
                        optionList += '<dd>' + item.value + '</dd>';
                        optionList += '</dl>';
                    }
                }
            }
            $('#' + this.scopeID).find("div[commonTabAreaList]").html(optionList);
            $('#' + this.scopeID).find("div[commonTabAreaList] dl").eq(0).addClass("tabArea_title_choose");
        }
    };
    TabAreaComponent.prototype.commonChange = function () {
        var _this = this;
        var _self = this;
        $('#' + this.scopeID).find('div[commonTabAreaList]').click(function (event) {
            $('#' + _this.scopeID).find("div[commonTabAreaList] dl").removeClass("tabArea_title_choose");
            if (event.target.nodeName == "DD" || event.target.nodeName == "DT") {
                _self.targetType = event.target.parentNode.dataset.type;
            }
            else {
                _self.targetType = event.target.dataset.type;
            }
            // console.log(_self.targetType,"???????")
            $('#' + _this.scopeID).find("div[commonTabAreaList] dl").eq(parseInt(_self.targetType) - 1).addClass("tabArea_title_choose");
            _self.parameterPostChange(_self.changeFilterArray(_self.targetType));
        });
    };
    TabAreaComponent.prototype.changeFilterArray = function (type) {
        var changePostFilterObj = [];
        changePostFilterObj.push({
            "field": 'cycle',
            "operator": "=",
            "value": type
        });
        return changePostFilterObj;
    };
    TabAreaComponent.prototype.parameterPostChange = function (filterArray) {
        var sendObj = Object.assign(_super.prototype.transformInput.call(this, 'scopeID', this.scopeID), _super.prototype.transformInput.call(this, 'filterObj', this.filterScopeIDObj), _super.prototype.transformInput.call(this, 'result', Object.assign(_super.prototype.transformInput.call(this, 'filter', filterArray))));
        _super.prototype.sendMessageBase.call(this, this, sendObj);
    };
    TabAreaComponent.prototype.postChange = function (postQuery) {
        var sendObj = Object.assign(_super.prototype.transformInput.call(this, 'scopeID', this.scopeID), _super.prototype.transformInput.call(this, 'result', postQuery));
        _super.prototype.onChange.call(this, this, sendObj);
    };
    return TabAreaComponent;
}(base_component_1.BaseComponent));
exports.TabAreaComponent = TabAreaComponent;
//# sourceMappingURL=tabArea.component.js.map