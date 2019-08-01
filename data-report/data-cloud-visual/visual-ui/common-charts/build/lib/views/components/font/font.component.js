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
var font_template_1 = require("./font.template");
var font_model_1 = require("./font.model");
var FontComponent = (function (_super) {
    __extends(FontComponent, _super);
    function FontComponent() {
        var _this = _super.call(this) || this;
        _this.fontData = null;
        _this.fontStyle = null;
        _this.container = null;
        var template = new font_template_1.FontTemplate(_this.scopeID);
        //获得模板渲染后的节点
        _this.element = _this.render(template);
        _this.fontData = new font_model_1.FontModel();
        //获得文本框
        _this.fontStyle = _this.element.querySelector('input');
        _this.fontStyle.style.fontSize = _this.fontData.font_fontSize;
        _this.fontStyle.style.color = _this.fontData.font_fontColor;
        _this.fontStyle.style.fontFamily = _this.fontData.font_fontFamily;
        _this.fontStyle.style.backgroundColor = _this.fontData.backgroundColor;
        return _this;
    }
    FontComponent.prototype.beforeShow = function () {
    };
    FontComponent.prototype.afterShow = function () {
        this.init();
    };
    FontComponent.prototype.beforeDestory = function () {
    };
    FontComponent.prototype.afterDestory = function () {
    };
    FontComponent.prototype.resize = function () {
    };
    FontComponent.prototype.getconfiginformation = function (event, changeObj) {
    };
    FontComponent.prototype.dataChange = function (data) {
        console.log(data);
        if (this.container == null) {
            this.container = this.element.querySelector("input[container]");
        }
        if (data.font_value == undefined) {
            data.font_value = "请输入文字";
        }
        this.container.value = data.font_value;
    };
    FontComponent.prototype.styleChange = function (style) {
        console.log(style);
        if (this.container == null) {
            this.container = this.element.querySelector("input[container]");
        }
        this.container['style'].fontSize = style.font_fontSize;
        this.container['style'].color = style.font_fontColor;
        this.container['style'].fontFamily = style.font_fontFamily;
        this.container['style'].backgroundColor = style.backgroundColor;
    };
    FontComponent.prototype.loadData = function () {
    };
    FontComponent.prototype.init = function () {
    };
    return FontComponent;
}(base_component_1.BaseComponent));
exports.FontComponent = FontComponent;
//# sourceMappingURL=font.component.js.map