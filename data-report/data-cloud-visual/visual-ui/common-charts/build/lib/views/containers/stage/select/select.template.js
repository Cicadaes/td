"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var template_base_1 = require("../../../base/template.base");
/**
 * Created by wangshouyun on 2017/3/20.
 */
var SelectTemplate = (function (_super) {
    __extends(SelectTemplate, _super);
    function SelectTemplate(scopeID) {
        return _super.call(this, "<div select-container=" + scopeID + " style=\"position: absolute;\n                    width: 1px;height: 1px;border: 1px solid #5697f1;z-index: 5\">\n               </div>") || this;
    }
    return SelectTemplate;
}(template_base_1.BaseTemplate));
exports.SelectTemplate = SelectTemplate;
//# sourceMappingURL=select.template.js.map