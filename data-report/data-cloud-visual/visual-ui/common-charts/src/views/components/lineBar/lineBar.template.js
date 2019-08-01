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
var LineBarTemplate = (function (_super) {
    __extends(LineBarTemplate, _super);
    function LineBarTemplate(scopeID) {
        return _super.call(this, "<div component id=" + scopeID + " style=\"width:100%;height: 100%;position: relative;\">\n            <!--<div commonTotal style=\"position: absolute; left: 30px; top: 10px; color: #80848f\">\u603B\u8BA1 <span style=\"color: #1c2438;font-size: 18px\"></span></div>-->\n            <div commonCharts  style=\"width:100%;height:100%;\"></div>\n        </div>") || this;
    }
    return LineBarTemplate;
}(template_base_1.BaseTemplate));
exports.LineBarTemplate = LineBarTemplate;
//# sourceMappingURL=lineBar.template.js.map