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
var ManyFilterBarTemplate = (function (_super) {
    __extends(ManyFilterBarTemplate, _super);
    function ManyFilterBarTemplate(scopeID) {
        return _super.call(this, "<div component id=" + scopeID + " style=\"width:100%;height: 100%\">\n            <div class=\"component_title clrfix\">\n                <span class=\"fr namyFilterBarButton defaultFilter\">\u9009\u62E9\u65F6\u95F4</span>\n                <span class=\"fr namyFilterBarButton namyCurrentFilter\">\u9ED8\u8BA4</span>\n            </div>\n            <div commonCharts  style=\"width:100%;height: calc(100% - 48px)\"></div>\n        </div>") || this;
    }
    return ManyFilterBarTemplate;
}(template_base_1.BaseTemplate));
exports.ManyFilterBarTemplate = ManyFilterBarTemplate;
//# sourceMappingURL=manyFilterBar.template.js.map