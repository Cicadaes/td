"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by zhaoxue on 2017-03-31.
 */
var template_base_1 = require("datwill-sdk/lib/views/base/template.base");
var PriviewTemplate = (function (_super) {
    __extends(PriviewTemplate, _super);
    function PriviewTemplate(scopeID) {
        return _super.call(this, "<div component scopeID=" + scopeID + " style=\"width:100%;height: 100%;display: table;\">\n                 <div container style=\"display: table-cell;vertical-align: middle;padding: 0 13px;font-family: '\u5FAE\u8F6F\u96C5\u9ED1'\">\n                    <h3 containerh3 style=\"color:#ccc;font-size:16px;\"></h3>   \n                     <h4 containerh4 style=\"color:#666;font-size:26px;\"></h4>\n                 </div>                   \n\n                </div>") || this;
    }
    return PriviewTemplate;
}(template_base_1.BaseTemplate));
exports.PriviewTemplate = PriviewTemplate;
//# sourceMappingURL=priview.template.js.map