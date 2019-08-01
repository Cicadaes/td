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
var ChinaMapTemplate = (function (_super) {
    __extends(ChinaMapTemplate, _super);
    function ChinaMapTemplate(scopeID) {
        return _super.call(this, "<div component id=" + scopeID + " style=\"width:100%;height: 100%\">\n            <div class=\"component_title clrfix\">\n                <div class=\"left\" componentTitleFont></div>\n            </div>\n           <div containerLeft style=\"width:70%;height:calc(100% - 40px);padding:24px;float:left\">\n                <div class = \"containerLeftTit\"><span></span>\u5730\u57DF\u5206\u5E03</div>\n                <div containerChainMap style=\"width:100%;height:calc(100% - 10px);\"></div>\n            </div>\n            <div containerRight style=\"width:30%;height:calc(100% - 40px);float:left;padding:24px 0 10px 24px;\"></div>\n        </div>") || this;
    }
    return ChinaMapTemplate;
}(template_base_1.BaseTemplate));
exports.ChinaMapTemplate = ChinaMapTemplate;
//# sourceMappingURL=chinamap.template.js.map