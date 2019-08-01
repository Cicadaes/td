"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var template_menu_1 = require("./template.menu");
var base_container_1 = require("../../base/base.container");
var emitter_event_1 = require("../../../../events/emitter.event");
var type_event_1 = require("../../../../events/type.event");
var right_menu_style_1 = require("./right.menu.style");
/**
 * Created by wangshouyun on 12/05/2017.
 */
var ComponentRightMenu = (function (_super) {
    __extends(ComponentRightMenu, _super);
    function ComponentRightMenu() {
        var _this = _super.call(this) || this;
        _this.rightMenuListArr = null;
        _this.p_containerWidth = 0;
        _this.p_containerHeight = 0;
        var style = new right_menu_style_1.RightMenuStyle();
        var template = new template_menu_1.ComponentRightMenuTemplate();
        //获得模板渲染后的节点
        _this.element = _this.render(template);
        //存储模块默认顺序
        _this.rightMenuListArr = [];
        _this.container = _this.element.firstElementChild;
        var rightMenuList = _this.container.querySelectorAll('div[level="1"]');
        for (var i = 0; i < rightMenuList.length; i++) {
            _this.rightMenuListArr.push(rightMenuList[i]);
        }
        for (var _i = 0, _a = _this.rightMenuListArr; _i < _a.length; _i++) {
            var node = _a[_i];
            var menuContainer = node.querySelector('.rightMenu-list-li') ? node.querySelector('.rightMenu-list-li').firstElementChild : null;
            if (menuContainer) {
                var menuList = menuContainer.querySelectorAll('div[level="2"]');
                var menuArray = [];
                for (var i = 0; i < menuList.length; i++) {
                    menuArray.push(menuList[i]);
                }
            }
        }
        //添加鼠标移入移出事件
        _this.element.addEventListener("mouseleave", function (e) {
            _this.hide();
        });
        //给菜单添加事件
        _this.menuHandle();
        return _this;
    }
    ComponentRightMenu.getInstance = function () {
        if (!ComponentRightMenu._instance) {
            ComponentRightMenu._instance = new ComponentRightMenu();
        }
        return ComponentRightMenu._instance;
    };
    ComponentRightMenu.prototype.menuHandle = function () {
        var _this = this;
        var menus = this.element.querySelectorAll('div[menu]');
        for (var _i = 0, menus_1 = menus; _i < menus_1.length; _i++) {
            var menu = menus_1[_i];
            menu.addEventListener('click', function (e) {
                var el = e.currentTarget;
                var operator = el.getAttribute('menu');
                _this.hide();
                emitter_event_1.EventEmitter.trigger(type_event_1.EventType.COMRIGHTMENU, { menu: operator, scopeID: _this.scopeID });
            });
        }
    };
    ComponentRightMenu.prototype.show = function (scopeID, point) {
        this.scopeID = scopeID;
        this.addStyle("display", "block");
        this.p_containerWidth = this.parent.container['offsetWidth'];
        this.p_containerHeight = this.parent.container['offsetHeight'];
        if (point.x < this.p_containerWidth / 2 && point.y < this.p_containerHeight / 2) {
            this.x = point.x - 5;
            this.y = point.y - 5;
            this.directLayout("left-top");
        }
        if (point.x < this.p_containerWidth / 2 && point.y > this.p_containerHeight / 2) {
            this.x = point.x - 5;
            this.y = point.y - this.height + 5;
            this.directLayout("left-bottom");
        }
        if (point.x > this.p_containerWidth / 2 && point.y < this.p_containerHeight / 2) {
            this.x = point.x - this.width + 5;
            this.y = point.y - 5;
            this.directLayout("right-top");
        }
        if (point.x > this.p_containerWidth / 2 && point.y > this.p_containerHeight / 2) {
            this.x = point.x - this.width + 5;
            this.y = point.y - this.height + 5;
            this.directLayout("right-bottom");
        }
    };
    ComponentRightMenu.prototype.hide = function () {
        this.addStyle("display", "none");
    };
    ComponentRightMenu.prototype.directLayout = function (direct) {
        console.info("direct===", direct);
        switch (direct) {
            case "left-top":
                break;
            case "left-bottom":
                this.rightMenuListArr.reverse();
                break;
            case "right-top":
                break;
            case "right-bottom":
                break;
        }
        this.container.innerHTML = "";
        for (var _i = 0, _a = this.rightMenuListArr; _i < _a.length; _i++) {
            var item = _a[_i];
            this.container.appendChild(item);
        }
    };
    return ComponentRightMenu;
}(base_container_1.BaseContainer));
ComponentRightMenu._instance = null;
exports.ComponentRightMenu = ComponentRightMenu;
//# sourceMappingURL=right.menu.js.map