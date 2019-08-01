"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by wangshouyun on 2017/3/22.
 */
var base_container_1 = require("../../base/base.container");
var select_template_1 = require("./select.template");
var SelectContainer = (function (_super) {
    __extends(SelectContainer, _super);
    function SelectContainer() {
        var _this = _super.call(this) || this;
        var template = new select_template_1.SelectTemplate(_this.scopeID);
        //模板渲染后获得当前节点
        _this.element = _this.render(template);
        return _this;
    }
    return SelectContainer;
}(base_container_1.BaseContainer));
exports.SelectContainer = SelectContainer;
//# sourceMappingURL=select.container.js.map