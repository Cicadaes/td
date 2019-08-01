/**
 * Created by wangshouyun on 2017/3/20.
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var view_base_1 = require("../../base/view.base");
var BaseContainer = (function (_super) {
    __extends(BaseContainer, _super);
    function BaseContainer() {
        var _this = _super.call(this) || this;
        _this.hasLoad = false;
        return _this;
    }
    Object.defineProperty(BaseContainer.prototype, "isSelect", {
        get: function () {
            return this._isSelect;
        },
        set: function (select) {
            this._isSelect = select;
            if (select) {
                this.element['style'].border = "2px solid #5F93E1";
                this.element.childNodes[1]['style'].display = "block ";
            }
            else {
                this.element['style'].border = "none";
                this.element.childNodes[1]['style'].display = "none";
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseContainer.prototype, "parent", {
        get: function () {
            return this._parent;
        },
        set: function (p) {
            this._parent = p;
        },
        enumerable: true,
        configurable: true
    });
    return BaseContainer;
}(view_base_1.BaseView));
exports.BaseContainer = BaseContainer;
//# sourceMappingURL=base.container.js.map