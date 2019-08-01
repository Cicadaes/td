/**
 * Created by wangshouyun on 2017/3/8.
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var template_abstract_1 = require("./template.abstract");
var BaseTemplate = (function (_super) {
    __extends(BaseTemplate, _super);
    function BaseTemplate(tpl) {
        var _this = _super.call(this) || this;
        _this.tpl = tpl;
        return _this;
    }
    return BaseTemplate;
}(template_abstract_1.ATemplate));
exports.BaseTemplate = BaseTemplate;
//# sourceMappingURL=template.base.js.map