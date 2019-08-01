"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var style_base_1 = require("../../../base/style.base");
/**
 * Created by wangshouyun on 2017/3/28.
 */
var RightMenuStyle = (function (_super) {
    __extends(RightMenuStyle, _super);
    function RightMenuStyle() {
        var _this = _super.call(this) || this;
        var style = "\n      \n       .rightMenu{\n                position: absolute;\n                width: 100px;      \n                z-index: 9999;     \n                display:none;\n                background: #FFFFFF;\n                box-shadow: 0 1px 4px 0 rgba(0,0,0,0.15);\n                border-radius: 4px;\n            }\n        \n            .rightMenu-list{\n                text-indent:16px;\n                position:relative;\n                width: 100%;\n                height:32px;\n                line-height:32px;        \n                cursor: pointer;\n                font-family: PingFangSC-Regular;\n                font-size: 12px;\n                color: #657180;\n                letter-spacing: 0;\n               \n            }\n            \n            .rightMenu-list-li{\n                text-indent:16px;\n                position:absolute;\n                width: 100%;\n                cursor: pointer;\n                display:none;\n                left:100px;\n                top:0px;\n                background: #FFFFFF;\n                box-shadow: 0 1px 4px 0 rgba(0,0,0,0.15);\n                border-radius: 4px;\n            }\n            \n            .rightMenu-list:hover .rightMenu-list-li{\n                display:block;\n                \n            }\n             .rightMenu-list:hover{\n                background: rgba(28,36,56,0.03);\n             }\n\n        ";
        _this.instertToHead(style);
        return _this;
    }
    return RightMenuStyle;
}(style_base_1.BaseStyle));
exports.RightMenuStyle = RightMenuStyle;
//# sourceMappingURL=right.menu.style.js.map