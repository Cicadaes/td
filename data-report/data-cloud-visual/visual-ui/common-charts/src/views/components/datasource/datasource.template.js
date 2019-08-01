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
var DatasourceTemplate = (function (_super) {
    __extends(DatasourceTemplate, _super);
    function DatasourceTemplate(scopeID) {
        return _super.call(this, "<div component id=" + scopeID + " style=\"width:100%;height: 100%\">\n            <div class=\"component_title clrfix\">\n                <div class=\"left\" componentTitle>\u5DF2\u9009\u6570\u636E\u6E90</div>\n                <div class=\"chart-selectline left\">\n                    <div class=\"chart-selectline-title none\" commonChange></div>\n                </div>\n            </div>\n            <div class=\"chart-textarea-style\"><textarea commonConfigBody></textarea></div>\n            <div commonConfigButton class=\"chart-post-button\">\u5E94\u7528</div>\n            <div class=\"chart-textarea-style\"><textarea commonConfigData></textarea></div>\n        </div>") || this;
    }
    return DatasourceTemplate;
}(template_base_1.BaseTemplate));
exports.DatasourceTemplate = DatasourceTemplate;
//# sourceMappingURL=datasource.template.js.map