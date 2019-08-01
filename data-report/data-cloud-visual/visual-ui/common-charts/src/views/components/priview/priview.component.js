"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
//import { Utils } from '../../../../build/lib/public/scripts/utils';
/**
 * Created by zhaoxue on 2017-03-31.
 */
var base_component_1 = require("../base.component");
var priview_template_1 = require("./priview.template");
var priview_model_1 = require("./priview.model");
var utils_1 = require("../../../../public/scripts/utils");
var PriviewComponent = (function (_super) {
    __extends(PriviewComponent, _super);
    function PriviewComponent() {
        var _this = _super.call(this) || this;
        _this.priviewData = null;
        _this.overviewValue = null;
        _this.container = null;
        _this.container1 = null;
        _this.container2 = null;
        _this.peiviewData = null;
        var template = new priview_template_1.PriviewTemplate(_this.scopeID);
        //获得模板渲染后的节点
        _this.element = _this.render(template);
        _this.priviewData = new priview_model_1.PriviewModel();
        _this.overviewValue = _this.element.querySelector('div');
        _this.overviewValue.style.backgroundColor = _this.priviewData.backgroundColor;
        return _this;
    }
    PriviewComponent.prototype.beforeShow = function () {
    };
    PriviewComponent.prototype.afterShow = function () {
        this.init();
    };
    PriviewComponent.prototype.beforeDestory = function () {
    };
    PriviewComponent.prototype.afterDestory = function () {
    };
    PriviewComponent.prototype.resize = function () {
    };
    PriviewComponent.prototype.getconfiginformation = function (event, changeObj) {
    };
    PriviewComponent.prototype.dataChange = function (data) {
        console.log(data);
        data['priviewtype'] = "priviewtype";
        //  内容
        this.container = this.element.querySelector("h4[containerH4]");
        //  标题
        this.container1 = this.element.querySelector("h3[containerH3]");
        for (var i = 0; i < data.length; i++) {
            for (var key in data[i]) {
                this.container1.innerHTML = key;
                this.container.innerHTML = data[i][key];
            }
        }
    };
    PriviewComponent.prototype.styleChange = function (style) {
        //大容器  内容 标题     
        this.container2 = this.element.querySelector('div[container]');
        this.container = this.element.querySelector("h4[containerh4]");
        this.container1 = this.element.querySelector("h3[containerh3]");
        this.container2['style'].backgroundColor = style.backgroundColor;
        // 标题样式
        this.container1['style'].color = style.title_fontcolor;
        this.container1['style'].fontSize = style.title_fontSize;
        this.container1['style'].fontFamily = style.title_fontFamily;
        this.container1['style'].lineHeight = style.lineHeight;
        this.container1['style'].marginLeft = style.marginLeft;
        this.container1['style'].marginTop = style.marginTop;
        this.container1['style'].marginRight = style.marginRight;
        utils_1.Utils.changeTitleSite(style, this.container1['style']);
        //  概览样式 
        this.container['style'].color = style.value_fontcolor;
        this.container['style'].fontSize = style.value_fontSize;
        this.container['style'].fontFamily = style.value_fontFamily;
        this.container['style'].lineHeight = style.lineHeight;
        this.container['style'].marginLeft = style.marginLeft;
        this.container['style'].marginTop = style.marginTop;
        this.container['style'].marginRight = style.marginRight;
        utils_1.Utils.changeValueSite(style, this.container['style']);
    };
    PriviewComponent.prototype.loadData = function () {
    };
    Object.defineProperty(PriviewComponent.prototype, "data", {
        get: function () {
            return this.priviewData;
        },
        enumerable: true,
        configurable: true
    });
    PriviewComponent.prototype.init = function () {
    };
    return PriviewComponent;
}(base_component_1.BaseComponent));
exports.PriviewComponent = PriviewComponent;
//# sourceMappingURL=priview.component.js.map