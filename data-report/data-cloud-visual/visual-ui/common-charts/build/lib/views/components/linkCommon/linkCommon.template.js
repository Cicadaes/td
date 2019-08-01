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
var LinkCommonTemplate = (function (_super) {
    __extends(LinkCommonTemplate, _super);
    function LinkCommonTemplate(scopeID) {
        return _super.call(this, "<div component id=" + scopeID + " style=\"width:100%;height: 100%\">\n            <a href=\"\" class=\"component_linkCommon clrfix\" conponentLinkCommon>\n                \n            </a>\n        </div>") || this;
    }
    return LinkCommonTemplate;
}(template_base_1.BaseTemplate));
exports.LinkCommonTemplate = LinkCommonTemplate;
//# sourceMappingURL=linkCommon.template.js.map