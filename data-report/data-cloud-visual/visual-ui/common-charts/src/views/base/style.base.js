"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by wangshouyun on 2017/3/9.
 */
var style_abstract_1 = require("./style.abstract");
var BaseStyle = (function (_super) {
    __extends(BaseStyle, _super);
    function BaseStyle() {
        return _super.call(this) || this;
    }
    BaseStyle.prototype.instertToHead = function (style) {
        var el = document.createElement("style");
        el.setAttribute("rel", "styleSheet");
        el.innerHTML = style;
        document.head.appendChild(el);
    };
    return BaseStyle;
}(style_abstract_1.AStyle));
exports.BaseStyle = BaseStyle;
//# sourceMappingURL=style.base.js.map