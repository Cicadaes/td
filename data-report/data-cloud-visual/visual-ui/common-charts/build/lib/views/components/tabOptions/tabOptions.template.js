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
var TabOptionsTemplate = (function (_super) {
    __extends(TabOptionsTemplate, _super);
    function TabOptionsTemplate(scopeID) {
        return _super.call(this, "<div component id=" + scopeID + " style=\"width:100%;height: 100%\">\n            <div class=\"component_tabfilter clrfix component_tabOptions\" conponentTabFilter>\n                \n            </div>\n        </div>") || this;
    }
    return TabOptionsTemplate;
}(template_base_1.BaseTemplate));
exports.TabOptionsTemplate = TabOptionsTemplate;
//# sourceMappingURL=tabOptions.template.js.map