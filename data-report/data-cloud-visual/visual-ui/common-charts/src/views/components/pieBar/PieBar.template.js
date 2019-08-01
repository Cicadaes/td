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
var PieBarTemplate = (function (_super) {
    __extends(PieBarTemplate, _super);
    function PieBarTemplate(scopeID) {
        return _super.call(this, "<div component id=" + scopeID + " style=\"width:100%;height: 100%;position: relative;\">\n            <div class=\"pieBar_saveCrowdBtn r\">\u53E6\u5B58\u4EBA\u7FA4</div>\n            <div class=\"pieBar_list\">\n                <div class=\"pieBar\"><b></b>\u4EF7\u503C\u5206\u7C7B</div>\n                <div class=\"pieBar_con\">\n                    <div class=\"pieBar_all\"><h3></h3><h4>\u603B\u8BA1</h4></div>\n                    <div commonPieCharts  style=\"width:100%;height:100%;\"></div>\n                </div>\n                <div style=\"margin-left: -5%;\" class=\"pieBar_con\">\n                    <div class=\"pieBar_pie_list\"></div>\n                </div>\n            </div>\n            <div  class=\"pieBar_list\">\n                <div class=\"pieBar\"><b></b>\u4EF7\u503C\u7EC6\u5206\u7C7B</div>\n                <div commonBarCharts  style=\"width:100%;height:calc(100% - 56px);\"></div>\n            </div>\n        </div>") || this;
    }
    return PieBarTemplate;
}(template_base_1.BaseTemplate));
exports.PieBarTemplate = PieBarTemplate;
//# sourceMappingURL=PieBar.template.js.map