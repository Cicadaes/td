"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by wangshouyun on 2017/3/20.
 */
var template_base_1 = require("datwill-sdk/lib/views/base/template.base");
var TestTemplate = (function (_super) {
    __extends(TestTemplate, _super);
    function TestTemplate(scopeID) {
        return _super.call(this, "<div component id=" + scopeID + " style=\"width:100%;height: 100%\"></div>") || this;
    }
    return TestTemplate;
}(template_base_1.BaseTemplate));
exports.TestTemplate = TestTemplate;
//# sourceMappingURL=test.template.js.map