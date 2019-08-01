"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var template_base_1 = require("../../../base/template.base");
var StageRightMenuTemplate = (function (_super) {
    __extends(StageRightMenuTemplate, _super);
    function StageRightMenuTemplate() {
        return _super.call(this, "<div style=\"position: absolute;width: 100px;border: 1px solid #cc0033\">\n                    <div style=\"position: relative;width: 100%\">\n                        <div style=\"width: 100%;border-bottom: 1px solid gray;padding: 5px 0\">\u5220\u9664</div>\n                    </div>\n               </div>") || this;
    }
    return StageRightMenuTemplate;
}(template_base_1.BaseTemplate));
exports.StageRightMenuTemplate = StageRightMenuTemplate;
//# sourceMappingURL=template.menu.js.map