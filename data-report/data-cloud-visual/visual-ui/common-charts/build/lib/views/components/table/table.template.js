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
var TableTemplate = (function (_super) {
    __extends(TableTemplate, _super);
    function TableTemplate(scopeID, TableComponent) {
        return _super.call(this, "<div component id=" + scopeID + " class=\"tableComponent\" style=\"width:100%;height: 100%;\">\n                    <div tableSelect style=\"width:100%;height:45px;display:none;padding:0 24px;\">\n                        <div class=\"table-selectline fl\">                        \n                            <div class=\"table-selectline-title\" commonChange>\u8BF7\u9009\u62E9</div>\n                            <div class=\"table-selectline-list\"></div>                        \n                        </div>\n                        <div class=\"saveCrowdBtn fr\">\u53E6\u5B58\u4EBA\u7FA4</div>\n                    </div>                                      \n                    <div tableContainer style=\"width:100%;\"></div>                   \n\n                    \n                </div>") || this;
    }
    return TableTemplate;
}(template_base_1.BaseTemplate));
exports.TableTemplate = TableTemplate;
//# sourceMappingURL=table.template.js.map