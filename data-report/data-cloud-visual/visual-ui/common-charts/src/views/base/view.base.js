/**
 * Created by wangshouyun on 2017/3/7.
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var view_abstract_1 = require("./view.abstract");
var scope_1 = require("../../../public/scripts/scope");
var BaseView = (function (_super) {
    __extends(BaseView, _super);
    function BaseView() {
        return _super.call(this) || this;
    }
    Object.defineProperty(BaseView.prototype, "scopeID", {
        get: function () {
            if (this._scopeID == null) {
                this._scopeID = scope_1.Scope.getInstance().scopeID;
            }
            return this._scopeID;
        },
        set: function (id) {
            scope_1.Scope.getInstance().scopeID = this._scopeID = id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseView.prototype, "viewName", {
        get: function () {
            return this._viewName;
        },
        set: function (viewName) {
            this._viewName = viewName;
        },
        enumerable: true,
        configurable: true
    });
    BaseView.prototype.render = function (template, model) {
        var element = document.createElement('div');
        element.innerHTML = template.tpl;
        return element.childNodes[0];
    };
    //将当前节点插入指定容器内
    BaseView.prototype.insertToElement = function (el) {
        this.beforeShow();
        var target = document.querySelector(el);
        target.appendChild(this._element);
        this.afterShow();
    };
    Object.defineProperty(BaseView.prototype, "element", {
        get: function () {
            return this._element;
        },
        set: function (el) {
            this._element = el;
        },
        enumerable: true,
        configurable: true
    });
    BaseView.prototype.addStyle = function (key, value) {
        return this._element['style'][key] = value;
    };
    BaseView.prototype.addClass = function () {
        return this._element.className = "edge_distance";
    };
    BaseView.prototype.removeClass = function () {
        return this._element.className = "";
    };
    BaseView.prototype.removeStyle = function (key) {
        this._element['style'][key] = null;
    };
    Object.defineProperty(BaseView.prototype, "x", {
        get: function () {
            return Number(this._element['style'].left.replace("px", ""));
        },
        set: function (x) {
            this._element['style'].left = x + "px";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseView.prototype, "maxX", {
        get: function () {
            return this.x + this.width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseView.prototype, "y", {
        get: function () {
            return Number(this._element['style'].top.replace("px", ""));
        },
        set: function (y) {
            this._element['style'].top = y + "px";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseView.prototype, "maxY", {
        get: function () {
            return this.y + this.height;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseView.prototype, "width", {
        get: function () {
            // return Number(this._element['style'].width.replace("px", ""));
            // debugger
            return this._element['offsetWidth'];
        },
        set: function (w) {
            this._element['style'].width = w + "px";
            this.resize();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseView.prototype, "widthHand", {
        get: function () {
            return document.documentElement.clientWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseView.prototype, "height", {
        get: function () {
            // return Number(this._element['style'].height.replace("px", ""));
            return this._element['offsetHeight'];
        },
        set: function (h) {
            this._element['style'].height = h + "px";
            this.resize();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseView.prototype, "layer", {
        get: function () {
            return Number(this._element['style'].zIndex);
        },
        set: function (index) {
            this._element['style'].zIndex = index;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseView.prototype, "type", {
        get: function () {
            return this._type;
        },
        set: function (t) {
            this._type = t;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseView.prototype, "visible", {
        set: function (visible) {
            if (visible) {
                this._element['style'].visibility = "visible";
            }
            else {
                this._element['style'].visibility = "hidden";
            }
        },
        enumerable: true,
        configurable: true
    });
    //格式化日期
    BaseView.prototype.getFormatDate = function (n) {
        var n = n;
        var d = new Date();
        var year = d.getFullYear();
        var mon = d.getMonth() + 1;
        var day = d.getDate();
        if (day <= n) {
            if (mon > 1) {
                mon = mon - 1;
            }
            else {
                year = year - 1;
                mon = 12;
            }
        }
        d.setDate(d.getDate() - n);
        year = d.getFullYear();
        mon = d.getMonth() + 1;
        day = d.getDate();
        var s = year + "-" + (mon < 10 ? ('0' + mon) : mon) + "-" + (day < 10 ? ('0' + day) : day);
        return s;
    };
    return BaseView;
}(view_abstract_1.AView));
exports.BaseView = BaseView;
//# sourceMappingURL=view.base.js.map