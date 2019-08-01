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
var DateformatTemplate = (function (_super) {
    __extends(DateformatTemplate, _super);
    function DateformatTemplate(scopeID) {
        return _super.call(this, "<div component id=" + scopeID + " style=\"width:100%;height: 100%\uFF1Bdisplay:table\">\n                    <div style=\"display: table-cell;vertical-align: middle;padding: 0 13px;font-family: '\u5FAE\u8F6F\u96C5\u9ED1'\">\n                        <p-datepicker dateFormat=\"yy-mm-dd\"></p-datepicker>\n                     </div>\n                </div>") || this;
    }
    return DateformatTemplate;
}(template_base_1.BaseTemplate));
exports.DateformatTemplate = DateformatTemplate;
//# sourceMappingURL=dateformat.template.js.map