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
var UploadTemplate = (function (_super) {
    __extends(UploadTemplate, _super);
    function UploadTemplate(scopeID) {
        return _super.call(this, "<div component id=" + scopeID + " style=\"width:100%;height: 100%;display:table\">\n                    <div style=\"display: table-cell;vertical-align: middle;padding: 0 13px;font-family: '\u5FAE\u8F6F\u96C5\u9ED1'\" id=\"upload\">\n                        \u4E0A\u4F20\u56FE\u7247\n                     </div>\n                     <div class=\"upload_layer\" id=\"upload_layer\">\n                         <p><input type=\"file\" id=\"upfile\"></p>\n                         <p><input type=\"button\" id=\"upJQuery\" value=\"\u4E0A\u4F20\"></p>\n                     </div>\n                </div>") || this;
    }
    return UploadTemplate;
}(template_base_1.BaseTemplate));
exports.UploadTemplate = UploadTemplate;
//# sourceMappingURL=upload.template.js.map