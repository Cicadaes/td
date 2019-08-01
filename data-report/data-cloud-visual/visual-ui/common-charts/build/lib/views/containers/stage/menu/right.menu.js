"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var template_menu_1 = require("./template.menu");
var base_container_1 = require("../../base/base.container");
/**
 * Created by wangshouyun on 12/05/2017.
 */
var StageRightMenu = (function (_super) {
    __extends(StageRightMenu, _super);
    function StageRightMenu() {
        var _this = _super.call(this) || this;
        var template = new template_menu_1.StageRightMenuTemplate();
        //获得模板渲染后的节点
        _this.element = _this.render(template);
        return _this;
    }
    StageRightMenu.getInstance = function () {
        if (!StageRightMenu._instance) {
            StageRightMenu._instance = new StageRightMenu();
        }
        return StageRightMenu._instance;
    };
    StageRightMenu.prototype.init = function (context) {
        var _this = this;
        this.context = context;
        context.element.addEventListener('contextmenu', function (e) {
            e = e || window.event;
            e.preventDefault();
            e.stopPropagation();
            _this.x = e.clintX;
            _this.y = e.clientY;
        });
    };
    return StageRightMenu;
}(base_container_1.BaseContainer));
StageRightMenu._instance = null;
exports.StageRightMenu = StageRightMenu;
//# sourceMappingURL=right.menu.js.map