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
var Radar2Template = (function (_super) {
    __extends(Radar2Template, _super);
    function Radar2Template(scopeID) {
        return _super.call(this, "<div component=" + scopeID + " id=" + scopeID + " style=\"width:100%;height: 100%\" class='radar2Component'>\n\n            <div containerHead class=\"clrfix containerHead\">   \n                <span class=\"funnelTitle\">\u9500\u552E\u96F7\u8FBE<span>                               \n                <span class=\"funnelHelp fr\"></span>\n            </div>\n        \n            <div class='radarBox'>\n                <div radarContainer style=\"width: 800px;height: 300px;margin:40px auto;position:relative;\">\n                    <div radarChart style=\"width:100%;height: 100%\"></div>\n                </div>\n            </div>\n            \n        \n        </div>") || this;
    }
    return Radar2Template;
}(template_base_1.BaseTemplate));
exports.Radar2Template = Radar2Template;
//# sourceMappingURL=radar2.template.js.map