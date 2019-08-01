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
var dateformat_template_1 = require("./dateformat.template");
var dateformat_model_1 = require("./dateformat.model");
var DateformatComponent = (function (_super) {
    __extends(DateformatComponent, _super);
    function DateformatComponent() {
        var _this = _super.call(this) || this;
        _this.myPrimeui = null;
        _this.chartData = null;
        _this.dateformatData = null;
        _this.echartData = null;
        var template = new dateformat_template_1.DateformatTemplate(_this.scopeID);
        //获得模板渲染后的节点
        _this.element = _this.render(template);
        _this.dateformatData = new dateformat_model_1.DateformatModel();
        return _this;
    }
    DateformatComponent.prototype.beforeShow = function () {
    };
    DateformatComponent.prototype.afterShow = function () {
    };
    DateformatComponent.prototype.beforeDestory = function () {
    };
    DateformatComponent.prototype.afterDestory = function () {
    };
    DateformatComponent.prototype.resize = function () {
    };
    DateformatComponent.prototype.dataChange = function (data) {
        console.log(data, 1111);
    };
    DateformatComponent.prototype.styleChange = function (style) {
    };
    DateformatComponent.prototype.loadData = function () {
        this.init();
        console.log(this.dateformatData, "uuuuuuuuuuuuuu");
    };
    Object.defineProperty(DateformatComponent.prototype, "data", {
        get: function () {
            return this.chartData;
        },
        enumerable: true,
        configurable: true
    });
    DateformatComponent.prototype.init = function () {
    };
    return DateformatComponent;
}(base_component_1.BaseComponent));
exports.DateformatComponent = DateformatComponent;
//# sourceMappingURL=dateformat.component.js.map