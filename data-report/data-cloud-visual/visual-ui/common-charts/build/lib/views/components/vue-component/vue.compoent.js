"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var base_component_1 = require("../base.component");
var vue_template_1 = require("./vue.template");
var VueComponent = (function (_super) {
    __extends(VueComponent, _super);
    // protected vue:Vue = null;
    function VueComponent() {
        var _this = _super.call(this) || this;
        var template = new vue_template_1.VueTemplate(_this.scopeID);
        //获得模板渲染后的节点
        _this.element = _this.render(template);
        return _this;
        // //绑定 vue 实例
        // this.vue = new Vue({
        //     el:this.element
        // });
    }
    VueComponent.prototype.afterShow = function () {
    };
    VueComponent.prototype.afterDestory = function () {
    };
    VueComponent.prototype.resize = function () {
    };
    VueComponent.prototype.dataChange = function (data) {
    };
    VueComponent.prototype.styleChange = function (style) {
    };
    VueComponent.prototype.loadData = function () {
    };
    Object.defineProperty(VueComponent.prototype, "data", {
        get: function () {
            return null;
        },
        enumerable: true,
        configurable: true
    });
    return VueComponent;
}(base_component_1.BaseComponent));
exports.VueComponent = VueComponent;
//# sourceMappingURL=vue.compoent.js.map