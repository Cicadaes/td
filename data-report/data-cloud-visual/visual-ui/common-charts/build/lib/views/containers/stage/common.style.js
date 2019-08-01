/**
 * Created by wangshouyun on 2017/3/28.
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var style_base_1 = require("../../base/style.base");
var CommonStyle = (function (_super) {
    __extends(CommonStyle, _super);
    function CommonStyle() {
        var _this = _super.call(this) || this;
        var style = ".spinner {\n                      width: 100%;\n                      height: 100%;\n                      position: relative;\n                    }\n                     \n                    .container1 > div, .container2 > div, .container3 > div {\n                      width: 10px;\n                      height: 10px;\n                      background-color: green;\n                     \n                      border-radius: 100%;\n                      position: absolute;\n                      -webkit-animation: bouncedelay 1.2s infinite ease-in-out;\n                      animation: bouncedelay 1.2s infinite ease-in-out;\n                      -webkit-animation-fill-mode: both;\n                      animation-fill-mode: both;\n                    }\n                     \n                    .spinner .spinner-container {\n                      position: absolute;\n                      width: 100%;\n                      height: 100%;\n                    }\n                     \n                    .container2 {\n                      -webkit-transform: rotateZ(45deg);\n                      transform: rotateZ(45deg);\n                    }\n                     \n                    .container3 {\n                      -webkit-transform: rotateZ(90deg);\n                      transform: rotateZ(90deg);\n                    }\n                     \n                    .circle1 { top: 0; left: 0; }\n                    .circle2 { top: 0; right: 0; }\n                    .circle3 { right: 0; bottom: 0; }\n                    .circle4 { left: 0; bottom: 0; }\n                     \n                    .container2 .circle1 {\n                      -webkit-animation-delay: -1.1s;\n                      animation-delay: -1.1s;\n                    }\n                     \n                    .container3 .circle1 {\n                      -webkit-animation-delay: -1.0s;\n                      animation-delay: -1.0s;\n                    }\n                     \n                    .container1 .circle2 {\n                      -webkit-animation-delay: -0.9s;\n                      animation-delay: -0.9s;\n                    }\n                     \n                    .container2 .circle2 {\n                      -webkit-animation-delay: -0.8s;\n                      animation-delay: -0.8s;\n                    }\n                     \n                    .container3 .circle2 {\n                      -webkit-animation-delay: -0.7s;\n                      animation-delay: -0.7s;\n                    }\n                     \n                    .container1 .circle3 {\n                      -webkit-animation-delay: -0.6s;\n                      animation-delay: -0.6s;\n                    }\n                     \n                    .container2 .circle3 {\n                      -webkit-animation-delay: -0.5s;\n                      animation-delay: -0.5s;\n                    }\n                     \n                    .container3 .circle3 {\n                      -webkit-animation-delay: -0.4s;\n                      animation-delay: -0.4s;\n                    }\n                     \n                    .container1 .circle4 {\n                      -webkit-animation-delay: -0.3s;\n                      animation-delay: -0.3s;\n                    }\n                     \n                    .container2 .circle4 {\n                      -webkit-animation-delay: -0.2s;\n                      animation-delay: -0.2s;\n                    }\n                     \n                    .container3 .circle4 {\n                      -webkit-animation-delay: -0.1s;\n                      animation-delay: -0.1s;\n                    }\n                     \n                    @-webkit-keyframes bouncedelay {\n                      0%, 80%, 100% { -webkit-transform: scale(0.0) }\n                      40% { -webkit-transform: scale(1.0) }\n                    }\n                     \n                    @keyframes bouncedelay {\n                      0%, 80%, 100% {\n                        transform: scale(0.0);\n                        -webkit-transform: scale(0.0);\n                      } 40% {\n                        transform: scale(1.0);\n                        -webkit-transform: scale(1.0);\n                      }\n                    }";
        _this.instertToHead(style);
        return _this;
    }
    return CommonStyle;
}(style_base_1.BaseStyle));
exports.CommonStyle = CommonStyle;
//# sourceMappingURL=common.style.js.map