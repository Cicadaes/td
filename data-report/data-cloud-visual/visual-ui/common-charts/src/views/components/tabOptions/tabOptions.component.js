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
var tabOptions_template_1 = require("./tabOptions.template");
var tabOptions_model_1 = require("./tabOptions.model");
var $ = require("jquery");
var TabOptionsComponent = (function (_super) {
    __extends(TabOptionsComponent, _super);
    function TabOptionsComponent() {
        var _this = _super.call(this) || this;
        _this.myChart = null;
        _this.chartData = null;
        _this.tabOptionsData = null;
        _this.echartData = null;
        _this.getSoreceData = null;
        _this.eqType = null;
        _this.filterScopeIDObj = null;
        _this.filterListArray = [];
        _this.filterChooseObj = {};
        _this.tabReadyBuildQuery = false;
        var template = new tabOptions_template_1.TabOptionsTemplate(_this.scopeID);
        //获得模板渲染后的节点
        _this.element = _this.render(template);
        _this.tabOptionsData = new tabOptions_model_1.TabOptionsModel();
        return _this;
    }
    TabOptionsComponent.prototype.beforeShow = function () {
    };
    TabOptionsComponent.prototype.afterShow = function () {
    };
    TabOptionsComponent.prototype.beforeDestory = function () {
    };
    TabOptionsComponent.prototype.afterDestory = function () {
    };
    TabOptionsComponent.prototype.resize = function () {
    };
    TabOptionsComponent.prototype.getconfiginformation = function (event, changeObj) {
        if (!this.isEmptyObject(changeObj.result)) {
            this.decideTabOptions(changeObj.result);
        }
        else {
            return;
        }
    };
    // 判断是tab还是接收filter控制
    TabOptionsComponent.prototype.decideTabOptions = function (changeObj) {
        if (changeObj['tabOptions'] !== undefined) {
            //渲染html
            this.renderHtml(changeObj['tabOptions'], changeObj['selected']);
        }
    };
    TabOptionsComponent.prototype.filterChange = function (event, data) {
    };
    TabOptionsComponent.prototype.dataChange = function (data) {
    };
    TabOptionsComponent.prototype.styleChange = function (style) {
    };
    TabOptionsComponent.prototype.loadData = function () {
        this.init();
    };
    Object.defineProperty(TabOptionsComponent.prototype, "data", {
        get: function () {
            return this.chartData;
        },
        enumerable: true,
        configurable: true
    });
    TabOptionsComponent.prototype.init = function () {
        //commonchange
        this.commonChange();
    };
    TabOptionsComponent.prototype.renderHtml = function (data, selected) {
        var optionList = "";
        optionList += '<ul>';
        for (var i = 0; i < data.length; i++) {
            optionList += '<li data-type=' + data[i].type + '>' + data[i].project_name + '</li>';
        }
        optionList += '</ul>';
        $('#' + this.scopeID).find("div[conponentTabFilter]").html(optionList);
        //设置html选中的值
        $('#' + this.scopeID).find("li").eq(selected).addClass('tabFilter_choose');
    };
    TabOptionsComponent.prototype.commonChange = function () {
        var _this = this;
        var _self = this;
        $('#' + _self.scopeID).find('div[conponentTabFilter]').click(function (event) {
            $('#' + _self.scopeID).find("li").removeClass('tabFilter_choose');
            var $target = event.target;
            _self.eqType = parseInt($target.attributes[0].value);
            $('#' + _this.scopeID).find("li").eq(_self.eqType).addClass('tabFilter_choose');
            _super.prototype.onRender.call(_this, _this, _self.eqType);
        });
    };
    return TabOptionsComponent;
}(base_component_1.BaseComponent));
exports.TabOptionsComponent = TabOptionsComponent;
//# sourceMappingURL=tabOptions.component.js.map