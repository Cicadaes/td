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
var LineTemplate = (function (_super) {
    __extends(LineTemplate, _super);
    function LineTemplate(scopeID) {
        return _super.call(this, "<div id='drf2jh2j5tskbbda' style=\"width:100%;height: 100%\">\n            <!--<div commonChange style=\"margin-bottom:15px;border: 1px solid #3c3f41; border-radius: 5px; background: #fff; padding: 5px 10px; cursor: pointer;\">\u8BF7\u9009\u62E9</div>-->\n            <!--<div commonSelectList style=\"position: absolute; left: 0; top: 32px; z-index: 2; display: none; width: 100%; border: 1px solid #3c3f41; border-radius: 5px; background: #fff; padding: 10px; cursor: pointer;\"></div>-->\n            <div commonCharts  style=\"width:100%;height: 100%\"></div>\n        </div>") || this;
    }
    return LineTemplate;
}(template_base_1.BaseTemplate));
exports.LineTemplate = LineTemplate;
//# sourceMappingURL=line.template.js.map