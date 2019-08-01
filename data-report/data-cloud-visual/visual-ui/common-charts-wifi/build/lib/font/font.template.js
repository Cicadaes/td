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
var FontTemplate = (function (_super) {
    __extends(FontTemplate, _super);
    function FontTemplate(scopeID) {
        return _super.call(this, "<div component=" + scopeID + " style=\"width:100%;height: 100%;background-color: white\">\n                 <input container type=\"text\" placeholder=\"\u8BF7\u8F93\u5165\u6587\u5B57\" style=\"width: 100%;height: 100%;outline: none\">\n                </div>") || this;
    }
    return FontTemplate;
}(template_base_1.BaseTemplate));
exports.FontTemplate = FontTemplate;
//# sourceMappingURL=font.template.js.map