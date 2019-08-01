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
var StackedBarTemplate = (function (_super) {
    __extends(StackedBarTemplate, _super);
    function StackedBarTemplate(scopeID) {
        return _super.call(this, "<div component id=" + scopeID + " style=\"width:100%;height: 100%\">\n            <div commonCharts  style=\"width:100%;height: calc(100%)\"></div>\n        </div>") || this;
    }
    return StackedBarTemplate;
}(template_base_1.BaseTemplate));
exports.StackedBarTemplate = StackedBarTemplate;
// <div class="chart-selectline left">
//     <div class="chart-selectline-title" commonChange>请选择</div>
//     <div commonSelectList class="chart-selectline-list"></div>
// </div> 
//# sourceMappingURL=stackedBar.template.js.map