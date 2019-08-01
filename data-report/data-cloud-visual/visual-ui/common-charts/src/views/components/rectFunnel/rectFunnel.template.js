"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by zhaoxue on 2017/3/28.
 */
var template_base_1 = require("../../base/template.base");
var RectFunnelTemplate = (function (_super) {
    __extends(RectFunnelTemplate, _super);
    function RectFunnelTemplate(scopeID) {
        return _super.call(this, "<div component id=" + scopeID + " style=\"width:100%;height: 100%\" class=\"rectFunnelComponent\">\n            <div containerHead class=\"clrfix containerHead\">   \n                <span class=\"funnelTitle\">\u8F6C\u5316\u6307\u6807<span>           \n                <div class=\"compareBox clrfix fr\">\n                    <span class=\"fl\">\u4E0D\u540C\u5BA2\u7FA4\u6307\u6807\u5BF9\u6BD4</span>\n                    <div class=\"compareButton close fl\"><span></span></div>\n                    <span class=\"funnelHelp fl\"></span>\n                </div>\n            </div>\n            \n            <div containerRectFunnel class=\"clrfix\" style=\"width:100%;height:calc(100% - 40px);padding:0 150px 25px;position:relative;\">                       \n                <div style=\"width:100%;transform: translateX(50%);position:relative;z-index:1;padding:15px 0;\">\n                    <div class=\"selectBox clrfix\">\n                        <div class=\"chart-selectline fl\">\n                            <div class=\"chart-selectline-title\"></div>\n                            <div class=\"chart-selectline-list hide\" type=\"0\"><ul></ul></div>\n                        </div>\n                        <div class=\"fl\" style=\"line-height:42px;margin:0 24px;\">VS</div>\n                        <div class=\"chart-selectline fl\">\n                            <div class=\"chart-selectline-title\"></div>\n                            <div class=\"chart-selectline-list hide\" type=\"1\"><ul></ul></div>\n                        </div>\n                    </div>\n                </div>\n                <div style=\"position:relative;\">\n                    <div class=\"noData\">\u6682\u65E0\u6570\u636E</div>\n                    <div class=\"rectFunnelBox clrfix\"></div>\n                    <ul class=\"rectFunnelLegend\"></ul>\n                </div>                \n            </div>        \n        </div>") || this;
    }
    return RectFunnelTemplate;
}(template_base_1.BaseTemplate));
exports.RectFunnelTemplate = RectFunnelTemplate;
//# sourceMappingURL=rectFunnel.template.js.map