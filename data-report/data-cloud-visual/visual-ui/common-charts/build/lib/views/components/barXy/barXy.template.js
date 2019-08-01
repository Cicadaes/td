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
var BarXyTemplate = (function (_super) {
    __extends(BarXyTemplate, _super);
    function BarXyTemplate(scopeID) {
        return _super.call(this, "<div component=" + scopeID + " id=" + scopeID + " style=\"width:100%;height: 100%\">\n                <div class=\"component_title clrfix\">\n                    <div class=\"left\" componentTitleFont></div>\n                </div>\n            <div commonCharts  style=\"width:100%;height: calc(100% - 48px)\"></div>\n        </div>") || this;
    }
    return BarXyTemplate;
}(template_base_1.BaseTemplate));
exports.BarXyTemplate = BarXyTemplate;
//# sourceMappingURL=barXy.template.js.map