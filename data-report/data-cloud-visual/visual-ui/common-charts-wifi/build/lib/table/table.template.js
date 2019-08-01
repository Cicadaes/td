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
var TableTemplate = (function (_super) {
    __extends(TableTemplate, _super);
    function TableTemplate(scopeID, TableComponent) {
        return _super.call(this, "<div component id=" + scopeID + " style=\"width:100%;height: 100%;overflow: hidden;\">\n                </div>") || this;
    }
    return TableTemplate;
}(template_base_1.BaseTemplate));
exports.TableTemplate = TableTemplate;
//# sourceMappingURL=table.template.js.map