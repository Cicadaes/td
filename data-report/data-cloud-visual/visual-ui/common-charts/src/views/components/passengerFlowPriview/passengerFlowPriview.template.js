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
var PassengerFlowPriviewTemplate = (function (_super) {
    __extends(PassengerFlowPriviewTemplate, _super);
    function PassengerFlowPriviewTemplate(scopeID) {
        return _super.call(this, "<div component id=" + scopeID + " style=\"width:100%;height:100%;overflow:hidden; background-color: #eef0f3\"> \n\n                 \n\n             </div>") || this;
    }
    return PassengerFlowPriviewTemplate;
}(template_base_1.BaseTemplate));
exports.PassengerFlowPriviewTemplate = PassengerFlowPriviewTemplate;
//# sourceMappingURL=passengerFlowPriview.template.js.map