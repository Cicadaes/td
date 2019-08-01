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
var ScatterTemplate = (function (_super) {
    __extends(ScatterTemplate, _super);
    function ScatterTemplate(scopeID) {
        return _super.call(this, "<div component=" + scopeID + " id=" + scopeID + " class='scatterComponent' style=\"width:100%;height: 100%;background:#fff;border-radius:5px;padding-right:20px;\">\n            \n            <div containerLeft style=\"width:65%;height:calc(100% - 30px);padding:24px;float:left;position:relative;\">\n                <div containerXY class='containerXY clrfix' style=\"width:100%;height:30px;margin-bottom:20px;\">\n                    <span class='fl'>X\u8F74</span><div class='indicator'><div class='indicatorBox fl'><span></span><i class='triangle_icon'></i></div><div class='indicatorItems' name='indicatorX'></div></div>\n                    <span class='fl'>Y\u8F74</span><div class='indicator'><div class='indicatorBox fl'><span></span><i class='triangle_icon'></i></div><div class='indicatorItems' name='indicatorY'></div></div>\n                </div>\n                    <b ScatterQuadrantA class=\"quadrantRegion\" style=\"position: absolute; right: 36px;top: 112px;z-index: 1;font-weight: bold;\">A\u533A</b>\n                    <b ScatterQuadrantB class=\"quadrantRegion\" style=\"position:absolute;left:calc(3% + 56px);top:112px;z-index: 1;font-weight: bold;\">B\u533A</b>\n                    <b ScatterQuadrantC class=\"quadrantRegion\" style=\"position:absolute;left:calc(3% + 56px);bottom:8%;z-index: 1;font-weight: bold;\">C\u533A</b>\n                    <b ScatterQuadrantD class=\"quadrantRegion\" style=\"position:absolute;right:36px;bottom:8%;z-index: 1;\">D\u533A</b>\n                </b>\n                <div containerScatter style=\"width:100%;height:calc(100% - 30px);display:none;\">\n                    \n                </div>    \n                <div containerNodata style=\"width:100%;height:calc(100% - 30px);\"><div style=\"width:100%;padding-top:10%;text-align:center\">\u6682\u65E0\u6570\u636E</div></div>\n                \n            </div>\n            <div containerRight style=\"width:35%;height:calc(100% - 30px);float:left;padding:24px 0 10px 24px;\"></div>\n        </div>") || this;
    }
    return ScatterTemplate;
}(template_base_1.BaseTemplate));
exports.ScatterTemplate = ScatterTemplate;
//# sourceMappingURL=scatter.template.js.map