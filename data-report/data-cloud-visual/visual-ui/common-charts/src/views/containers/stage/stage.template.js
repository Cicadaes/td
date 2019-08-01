"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by wangshouyun on 2017/3/20.
 */
var template_base_1 = require("../../base/template.base");
var StageTemplate = (function (_super) {
    __extends(StageTemplate, _super);
    function StageTemplate(scopeID) {
        return _super.call(this, "<div stage-container=" + scopeID + " style=\"position: absolute; z-index:2;box-sizing: border-box;\n                    left: 0;top: 0;right: 0;bottom: 0;will-change: transform;\">\n                    <div containerSide=" + scopeID + " style=\"width: 100%;height: 100%;position:\n                     relative;background: #eef0f3;background-size: 10px 10px;\n    background-position: 1px 1px;\"></div>\n               </div>") || this;
    }
    return StageTemplate;
}(template_base_1.BaseTemplate));
exports.StageTemplate = StageTemplate;
//# sourceMappingURL=stage.template.js.map