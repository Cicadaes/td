"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by zhaoxue on 2017/3/28.
 */
var template_base_1 = require("datwill-sdk/lib/views/base/template.base");
var ScatterTemplate = (function (_super) {
    __extends(ScatterTemplate, _super);
    function ScatterTemplate(scopeID) {
        return _super.call(this, "<div component=" + scopeID + " id=" + scopeID + " class='scatterComponent' style=\"width:100%;height: 100%;background:#fff;\">\n            <div containerHead class=\"clrfix containerHead\" style=\"height:40px;line-height:40px;\">\n                <span class=\"fl\" style=\"font-size:14px;font-weight:bold;font-family: PingFangSC-Medium;\">\u56DB\u8C61\u9650\u5206\u5E03\u56FE</span>              \n                <span class=\"fr filterButton custom\">\u81EA\u5B9A\u4E49</span>\n                <span class=\"fr filterButton region currentFilter\">Region</span>\n            </div>\n            <div containerLeft style=\"width:65%;height:calc(100% - 40px);padding:24px;float:left\">\n                <div containerXY class='containerXY clrfix' style=\"width:100%;height:30px;margin-bottom:20px;\">\n                    <span class='fl'>X\u8F74</span><div class='indicator'><div class='indicatorBox fl'><span></span><i class='triangle_icon'></i></div><div class='indicatorItems' name='indicatorX'></div></div>\n                    <span class='fl'>Y\u8F74</span><div class='indicator'><div class='indicatorBox fl'><span></span><i class='triangle_icon'></i></div><div class='indicatorItems' name='indicatorY'></div></div>\n                </div>\n                <div containerScatter style=\"width:100%;height:calc(100% - 30px);\"></div>\n            </div>\n            <div containerRight style=\"width:35%;height:calc(100% - 40px);float:left;padding:24px 0 10px 24px;\"></div>\n        </div>") || this;
    }
    return ScatterTemplate;
}(template_base_1.BaseTemplate));
exports.ScatterTemplate = ScatterTemplate;
//# sourceMappingURL=scatter.template.js.map