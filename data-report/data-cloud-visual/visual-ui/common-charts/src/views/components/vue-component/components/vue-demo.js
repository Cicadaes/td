"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var vue_compoent_1 = require("../vue.compoent");
var VueComponentDemo = (function (_super) {
    __extends(VueComponentDemo, _super);
    function VueComponentDemo() {
        return _super.call(this) || this;
    }
    VueComponentDemo.prototype.afterShow = function () {
    };
    VueComponentDemo.prototype.afterDestory = function () {
    };
    VueComponentDemo.prototype.resize = function () {
    };
    VueComponentDemo.prototype.dataChange = function (data) {
    };
    VueComponentDemo.prototype.styleChange = function (style) {
    };
    VueComponentDemo.prototype.loadData = function () {
    };
    Object.defineProperty(VueComponentDemo.prototype, "data", {
        get: function () {
            return null;
        },
        enumerable: true,
        configurable: true
    });
    return VueComponentDemo;
}(vue_compoent_1.VueComponent));
exports.VueComponentDemo = VueComponentDemo;
//# sourceMappingURL=vue-demo.js.map