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
var CircleTemplate = (function (_super) {
    __extends(CircleTemplate, _super);
    function CircleTemplate(scopeID) {
        return _super.call(this, "<div component scopeID=" + scopeID + " style=\"width:100%;height: 100%;\">\n                 <div container style=\"width:100%;height: 100%;position:absolute;border-radius:50%;\"></div>\n                </div>") || this;
    }
    return CircleTemplate;
}(template_base_1.BaseTemplate));
exports.CircleTemplate = CircleTemplate;
//# sourceMappingURL=circle.template.js.map