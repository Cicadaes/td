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
var circle_template_1 = require("./circle.template");
var circle_model_1 = require("./circle.model");
var CircleComponent = (function (_super) {
    __extends(CircleComponent, _super);
    function CircleComponent() {
        var _this = _super.call(this) || this;
        _this.circleData = null;
        _this.circleBg = null;
        _this.container = null;
        var template = new circle_template_1.CircleTemplate(_this.scopeID);
        //获得模板渲染后的节点
        _this.element = _this.render(template);
        _this.circleData = new circle_model_1.CircleModel();
        _this.circleBg = _this.element.querySelector('div');
        _this.circleBg.style.backgroundColor = _this.circleData.backgroundColor;
        return _this;
    }
    CircleComponent.prototype.beforeShow = function () {
    };
    CircleComponent.prototype.afterShow = function () {
        this.init();
    };
    CircleComponent.prototype.beforeDestory = function () {
    };
    CircleComponent.prototype.afterDestory = function () {
    };
    CircleComponent.prototype.resize = function () {
    };
    CircleComponent.prototype.getconfiginformation = function (event, changeObj) {
    };
    CircleComponent.prototype.dataChange = function (data) {
    };
    CircleComponent.prototype.styleChange = function (style) {
        if (this.container == null) {
            this.container = this.element.querySelector("div[container]");
        }
        this.container['style'].backgroundColor = style.backgroundColor;
    };
    CircleComponent.prototype.loadData = function () {
    };
    Object.defineProperty(CircleComponent.prototype, "data", {
        get: function () {
            return this.circleData;
        },
        enumerable: true,
        configurable: true
    });
    CircleComponent.prototype.init = function () {
    };
    return CircleComponent;
}(base_component_1.BaseComponent));
exports.CircleComponent = CircleComponent;
//# sourceMappingURL=circle.component.js.map