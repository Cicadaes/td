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
var SelectLineTemplate = (function (_super) {
    __extends(SelectLineTemplate, _super);
    function SelectLineTemplate(scopeID) {
        return _super.call(this, "<div component id=" + scopeID + " style=\"width:100%;height: 100%\">\n            <div class=\"component_title clrfix\">\n                <div class=\"left\" componentTitle>\u4E1C\u76F4\u95E8\u94F6\u5EA7VM</div>\n                <div class=\"chart-selectline left\">\n                    <div class=\"chart-selectline-title\" commonChange>\u8BF7\u9009\u62E9</div>\n                    <div commonSelectList class=\"chart-selectline-list\"></div>\n                </div>\n            </div>\n            <div commonCharts  style=\"width:100%;height: calc(100% - 42px)\"></div>\n        </div>") || this;
    }
    return SelectLineTemplate;
}(template_base_1.BaseTemplate));
exports.SelectLineTemplate = SelectLineTemplate;
//# sourceMappingURL=selectLine.template.js.map