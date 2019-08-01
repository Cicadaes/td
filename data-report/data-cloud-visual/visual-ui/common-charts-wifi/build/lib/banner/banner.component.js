"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by zhaoxue on 2017-03-31.
 */
var base_component_1 = require("../base.component");
var banner_template_1 = require("./banner.template");
var banner_model_1 = require("./banner.model");
var BannerComponent = (function (_super) {
    __extends(BannerComponent, _super);
    function BannerComponent() {
        var _this = _super.call(this) || this;
        _this.bannerData = null;
        _this.bannerBg = null;
        _this.container = null;
        var template = new banner_template_1.BannerTemplate(_this.scopeID);
        //获得模板渲染后的节点
        _this.element = _this.render(template);
        _this.bannerData = new banner_model_1.BannerModel();
        _this.bannerBg = _this.element.querySelector('div');
        _this.bannerBg.style.backgroundColor = _this.bannerData.backgroundColor;
        return _this;
    }
    BannerComponent.prototype.beforeShow = function () {
    };
    BannerComponent.prototype.afterShow = function () {
    };
    BannerComponent.prototype.beforeDestory = function () {
    };
    BannerComponent.prototype.afterDestory = function () {
    };
    BannerComponent.prototype.resize = function () {
    };
    BannerComponent.prototype.dataChange = function (data) {
    };
    BannerComponent.prototype.styleChange = function (style) {
        if (this.container == null) {
            this.container = this.element.querySelector("div[container]");
        }
        this.container['style'].backgroundColor = style.backgroundColor;
    };
    BannerComponent.prototype.loadData = function () {
        this.init();
    };
    Object.defineProperty(BannerComponent.prototype, "data", {
        get: function () {
            return this.bannerData;
        },
        enumerable: true,
        configurable: true
    });
    BannerComponent.prototype.init = function () {
    };
    return BannerComponent;
}(base_component_1.BaseComponent));
exports.BannerComponent = BannerComponent;
//# sourceMappingURL=banner.component.js.map