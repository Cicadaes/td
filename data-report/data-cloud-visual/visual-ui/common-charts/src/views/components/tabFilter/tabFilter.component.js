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
var tabFilter_template_1 = require("./tabFilter.template");
var tabFilter_model_1 = require("./tabFilter.model");
var $ = require("jquery");
var TabFilterComponent = (function (_super) {
    __extends(TabFilterComponent, _super);
    function TabFilterComponent() {
        var _this = _super.call(this) || this;
        _this.myChart = null;
        _this.chartData = null;
        _this.tabFilterData = null;
        _this.echartData = null;
        _this.getSoreceData = null;
        _this.eqType = null;
        _this.filterScopeIDObj = null;
        _this.filterListArray = [];
        _this.filterChooseObj = {};
        _this.tabField = "project_id";
        _this.tabOp = "in";
        var template = new tabFilter_template_1.TabFilterTemplate(_this.scopeID);
        //获得模板渲染后的节点
        _this.element = _this.render(template);
        _this.tabFilterData = new tabFilter_model_1.TabFilterModel();
        return _this;
    }
    TabFilterComponent.prototype.beforeShow = function () {
    };
    TabFilterComponent.prototype.afterShow = function () {
        this.init();
    };
    TabFilterComponent.prototype.beforeDestory = function () {
    };
    TabFilterComponent.prototype.afterDestory = function () {
    };
    TabFilterComponent.prototype.resize = function () {
    };
    TabFilterComponent.prototype.getconfiginformation = function (event, changeObj) {
        if (!this.isEmptyObject(changeObj.result)) {
            this.filterScopeIDObj = changeObj.result;
            this.decideTabOptions(changeObj.result);
        }
        else {
            return;
        }
    };
    // 判断是tab还是接收filter控制
    TabFilterComponent.prototype.decideTabOptions = function (changeObj) {
        if (changeObj['tabOptions'] !== undefined) {
            //渲染html
            this.renderHtml(changeObj['tabOptions'], false);
        }
        if (changeObj['tabField']) {
            this.tabField = changeObj['tabField'];
        }
        if (changeObj['tabOp']) {
            this.tabOp = changeObj['tabOp'];
        }
    };
    TabFilterComponent.prototype.filterChange = function (event, data) {
        //存储list
        //this.filterListArray = data['chart'];
        //project格式转成标准格式
        var list = [];
        if (data['filter'] && data['filter'].length) {
            var obj = {};
            for (var i = 0; i < data['filter'].length; i++) {
                var tmpObj = data['filter'][i];
                if (tmpObj.field == "project_id") {
                    obj["value"] = tmpObj.value;
                }
                else if (tmpObj.field == "projectName") {
                    obj["name"] = tmpObj.value;
                }
            }
            list.push(obj);
        }
        //渲染html
        this.renderHtml(list, true);
        if (list.length == 1) {
        }
    };
    TabFilterComponent.prototype.dataChange = function (data) {
    };
    TabFilterComponent.prototype.styleChange = function (style) {
    };
    TabFilterComponent.prototype.loadData = function () {
    };
    Object.defineProperty(TabFilterComponent.prototype, "data", {
        get: function () {
            return this.chartData;
        },
        enumerable: true,
        configurable: true
    });
    TabFilterComponent.prototype.init = function () {
        //commonchange
        this.commonChange();
    };
    TabFilterComponent.prototype.renderHtml = function (data, flag) {
        var optionList = "";
        if (flag == true) {
            var ids = data[0].value.split(",");
            var names = data[0].name.split(",");
            var obj = {};
            obj["name"] = data[0].name.split(",")[0];
            obj["value"] = data[0].value.split(",")[0];
            var list = [];
            list.push(obj);
            optionList += '<ul>';
            for (var i = 0; i < ids.length; i++) {
                optionList += '<li index=' + i + ' data-name=' + names[i] + ' data-value=' + ids[i] + '>' + names[i] + '</li>';
            }
            optionList += '</ul>';
            this.setChooseObj(data[0]);
        }
        else {
            optionList += '<ul>';
            for (var i = 0; i < data.length; i++) {
                optionList += '<li index=' + i + ' data-name=' + data[i].name + ' data-value=' + data[i].value + '>' + data[i].name + '</li>';
            }
            optionList += '</ul>';
            this.setChooseObj(data[0]);
        }
        $('#' + this.scopeID).find("div[conponentTabFilter]").html(optionList);
        //设置html选中的值
        $('#' + this.scopeID).find("li").eq(0).addClass('tabFilter_choose');
        $('#' + this.scopeID).find("li").eq(0).click();
        //设置选中的值
    };
    //设置已经选中的id name
    TabFilterComponent.prototype.setChooseObj = function (data) {
        this.filterChooseObj = data;
    };
    TabFilterComponent.prototype.commonChange = function () {
        var _self = this;
        $('#' + this.scopeID).find('div[conponentTabFilter]').click(function (event) {
            // $('#' + this.scopeID).find("li").removeClass('tabFilter_choose');
            // let $target = event.target,
            //     tabType = parseInt($target.attributes[0].value)
            // $('#' + this.scopeID).find("li").eq(tabType).addClass('tabFilter_choose');
            // if (_self.tabField == "body_change") {
            //     _self.changePostChange('body_change', $target.dataset.value);
            // }else{
            //     //发送请求
            //     _self.changePostChange('filter', _self.changeFilterArray($target.dataset));
            // }
            var $target = event.target, tabType = parseInt($target.attributes[0].value);
            if ($target.attributes[0].value) {
                $('#' + _self.scopeID).find("li").removeClass('tabFilter_choose');
                $('#' + _self.scopeID).find("li").eq(tabType).addClass('tabFilter_choose');
                if (_self.tabField == "body_change") {
                    _self.changePostChange('body_change', $target.dataset.value);
                }
                else {
                    //发送请求
                    _self.changePostChange('filter', _self.changeFilterArray($target.dataset));
                }
            }
        });
    };
    TabFilterComponent.prototype.changePostChange = function (key, filterArray) {
        if (!this.isEmptyObject(this.filterScopeIDObj)) {
            var sendObj = Object.assign(_super.prototype.transformInput.call(this, 'scopeID', this.scopeID), _super.prototype.transformInput.call(this, 'filterObj', this.filterScopeIDObj), _super.prototype.transformInput.call(this, 'result', _super.prototype.transformInput.call(this, key, filterArray)));
            _super.prototype.sendMessageBase.call(this, this, sendObj);
        }
        else {
            return;
        }
    };
    TabFilterComponent.prototype.changeFilterArray = function (obj) {
        var changePostFilterObj = [];
        var tmpObj = {
            "field": 'project_id',
            "operator": "in",
            "value": obj.value
        };
        if (this.tabField) {
            tmpObj["field"] = this.tabField;
        }
        if (this.tabOp) {
            tmpObj["operator"] = this.tabOp;
        }
        changePostFilterObj.push(tmpObj);
        return changePostFilterObj;
    };
    return TabFilterComponent;
}(base_component_1.BaseComponent));
exports.TabFilterComponent = TabFilterComponent;
//# sourceMappingURL=tabFilter.component.js.map