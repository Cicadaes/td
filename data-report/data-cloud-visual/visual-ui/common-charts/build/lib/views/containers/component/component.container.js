/**
 * Created by wangshouyun on 2017/3/17.
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var base_container_1 = require("../base/base.container");
var component_template_1 = require("./component.template");
var emitter_event_1 = require("../../../events/emitter.event");
var type_event_1 = require("../../../events/type.event");
var right_menu_1 = require("./menu/right.menu");
var utils_1 = require("../../../../public/scripts/utils");
var $ = require("jquery");
var ComponentContainer = (function (_super) {
    __extends(ComponentContainer, _super);
    function ComponentContainer(stage, component, scopeID) {
        var _this = _super.call(this) || this;
        _this.upFlag = false;
        _this.componentRightMenuHandle = null;
        _this.selectHandle = null;
        _this.startDragHandle = null;
        _this.dragHandle = null;
        _this.endDragHandle = null;
        _this.dragPosition = null;
        _this.componentTitle = null;
        _this.componentContainer = null;
        _this.componentHeightBoolean = false;
        _this.stage = null;
        _this.chartStyle = null;
        _this.getFilterMethod = null;
        _this.stage = stage;
        if (scopeID)
            component.scopeID = _this.scopeID = scopeID;
        var template = new component_template_1.ComponentTemplate(_this.scopeID);
        //获得模板渲染后的节点
        _this.element = _this.render(template);
        //数据错误
        _this.dataError = _this.element.querySelector('[data-error]');
        //缩放
        _this.leftTopResize = _this.element.querySelector('[direction="left-top"]');
        _this.leftCenterResize = _this.element.querySelector('[direction="left-center"]');
        _this.topCenterResize = _this.element.querySelector('[direction="top-center"]');
        _this.leftBottomResize = _this.element.querySelector('[direction="left-bottom"]');
        _this.rightTopResize = _this.element.querySelector('[direction="right-top"]');
        _this.rightCenterResize = _this.element.querySelector('[direction="right-center"]');
        _this.bottomCenterResize = _this.element.querySelector('[direction="bottom-center"]');
        _this.rightBottomResize = _this.element.querySelector('[direction="right-bottom"]');
        //title
        _this.componentTitle = _this.element.querySelector('[componentTitle]');
        //容器
        _this.container = _this.element.querySelector('[container]');
        _this.componentContainer = _this.element.querySelector('[componentContainer]');
        //组件
        if (_this.component) {
            _this.container.removeChild(_this.component.element);
        }
        //菜单事件
        _this.componentRightMenuHandle = _this.componentRightMenuElement.bind(_this);
        _this.component = component;
        _this.component.element.id = _this.component.scopeID;
        _this.container.appendChild(_this.component.element);
        _this.enableEdit = false;
        emitter_event_1.EventEmitter.register(type_event_1.EventType.OVERALLFILTERCHANGE, _this.overallFilterChange, _this);
        emitter_event_1.EventEmitter.register(type_event_1.EventType.FILTERCHANGE, _this.filterChange, _this);
        emitter_event_1.EventEmitter.register(type_event_1.EventType.MERGEFILTERCHANGE, _this.mergeFilterChange, _this);
        emitter_event_1.EventEmitter.register(type_event_1.EventType.CHANGE_HEIGHT, _this.changeHeight, _this);
        return _this;
    }
    Object.defineProperty(ComponentContainer.prototype, "enableEdit", {
        get: function () {
            return this._enableEdit;
        },
        set: function (edit) {
            this._enableEdit = edit;
            if (this._enableEdit) {
                this.container['style']['pointer-events'] = 'none';
                this.enableResize = true;
                this.enableDrag = true;
                this.enableSelect = true;
                this.enableDataChange = true;
                this.enableStyleChange = true;
                this.enableRightMenu = true;
            }
            else {
                this.container['style']['pointer-events'] = '';
                this.enableResize = false;
                this.enableDrag = false;
                this.enableSelect = false;
                this.enableDataChange = true;
                this.enableStyleChange = false;
                this.enableRightMenu = false;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ComponentContainer.prototype, "enableRightMenu", {
        set: function (menu) {
            if (menu) {
                this.element.addEventListener('contextmenu', this.componentRightMenuHandle, false);
            }
            else {
                this.element.removeEventListener('contextmenu', this.componentRightMenuHandle, false);
            }
        },
        enumerable: true,
        configurable: true
    });
    ComponentContainer.prototype.componentRightMenuElement = function (e) {
        e = e || window.event;
        e.preventDefault();
        e.stopPropagation();
        this.isSelect = true;
        var offsetPosition = utils_1.Utils.offsetPosition(this.element.parentElement);
        right_menu_1.ComponentRightMenu.getInstance().show(this.scopeID, {
            x: e.clientX - offsetPosition.left,
            y: e.clientY - offsetPosition.top
        });
    };
    ;
    ComponentContainer.prototype.beforeShow = function () {
        this.component.beforeShow();
    };
    ComponentContainer.prototype.afterShow = function () {
        this.component.afterShow();
    };
    ComponentContainer.prototype.beforeDestory = function () {
        this.component.beforeDestory();
    };
    ComponentContainer.prototype.afterDestory = function () {
        this.component.afterDestory();
    };
    ComponentContainer.prototype.resize = function () {
        this.component.resize();
    };
    ComponentContainer.prototype.loadData = function () {
        this.component.loadData();
        this.downloadConponentData();
    };
    ComponentContainer.prototype.getconfiginformation = function (event, changeObj) {
        if (changeObj.scopeID == this.scopeID) {
            this.component.getconfiginformation(event, changeObj);
        }
    };
    ComponentContainer.prototype.overallFilterChange = function (event, changeObj) {
        this.component.overallFilterChange(event, changeObj);
    };
    ComponentContainer.prototype.dataChange = function (data) {
        if (data.scopeID == this.scopeID) {
            this.dataError['style'].display = "none";
            this.component.dataChange(data.result);
        }
    };
    ComponentContainer.prototype.styleChange = function (style) {
        if (style.scopeID == this.scopeID) {
            this.dataError['style'].display = "none";
            this.componentTitleText(style.result);
            this.component.styleChange(style.result);
        }
    };
    ComponentContainer.prototype.filterChange = function (event, filter) {
        if (this.getFilterMethod == "old") {
            for (var _i = 0, _a = filter.chartScopeId; _i < _a.length; _i++) {
                var item = _a[_i];
                if (item == this.scopeID) {
                    this.mergeFilterDate(filter.result, this.component);
                    this.component.filterChange(event, filter.result);
                }
            }
        }
        else {
            if (filter.scopeID == this.scopeID) {
                if (filter.filterChange) {
                    this.component.filterChange(event, filter.result);
                }
                else {
                    this.mergeFilterDate(filter.result, this.component);
                    this.triggerMergeFilter(filter.stageFilter, this.component);
                }
            }
        }
    };
    ComponentContainer.prototype.triggerMergeFilter = function (stageFilter, component) {
        if (stageFilter.length > 0) {
            for (var _i = 0, stageFilter_1 = stageFilter; _i < stageFilter_1.length; _i++) {
                var item = stageFilter_1[_i];
                if (item.topLevelFilter) {
                    emitter_event_1.EventEmitter.trigger(type_event_1.EventType.MERGEFILTERCHANGE, this.component);
                }
            }
        }
    };
    ComponentContainer.prototype.downloadConponentData = function () {
        var $downloadHtml = this.container.querySelector('div[componentTitleDownload]'), _self = this;
        $($downloadHtml).click(function (event) {
            _self.component.downloadData();
        });
    };
    ComponentContainer.prototype.mergeFilterChange = function (event, target) {
        for (var _i = 0, _a = target.filterScopeIDObj.chartScopeID; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item == this.scopeID) {
                this.component.mergeFilterChange(event, target);
            }
        }
    };
    ComponentContainer.prototype.changeHeight = function (event, data) {
        var configStr = this.stage.stageData.backgroundImage;
        var configObj = JSON.parse(configStr);
        if (this.scopeID == data.scopeID) {
            if (data.result.op == "plus") {
                this.height += data.result.value;
            }
            else if (data.result.op == "minus") {
                this.height -= data.result.value;
            }
        }
        else if (configObj[this.scopeID] > configObj[data.scopeID]) {
            if (data.result.op == "plus") {
                this.y += data.result.value;
            }
            else if (data.result.op == "minus") {
                this.y -= data.result.value;
            }
        }
    };
    ComponentContainer.prototype.mergeFilterDate = function (data, component) {
        for (var key in data) {
            switch (key) {
                case 'date':
                    component.mergeDateObj = data;
                    break;
                case 'filter':
                    component.mergeFilterObj = data;
                    break;
            }
        }
    };
    ComponentContainer.prototype.componentTitleText = function (style) {
        for (var key in style) {
            switch (key) {
                case 'configure_style':
                    if (style[key] !== null && style[key] !== undefined) {
                        for (var _i = 0, _a = style[key]; _i < _a.length; _i++) {
                            var item = _a[_i];
                            if (item.name !== "") {
                                if (JSON.parse(item.name).componentTitleClass) {
                                    this.componentContainer.className = JSON.parse(item.name).componentTitleClass;
                                }
                            }
                        }
                    }
                    break;
                case 'backgroundColor':
                    this.componentContainer.style.backgroundColor = style[key];
                    break;
                case 'borderRadius':
                    this.componentContainer.style.borderRadius = parseInt(style[key]) + 'px';
                    break;
                case 'title_font':
                    if (style[key]) {
                        this.componentTitle.style.display = 'block';
                        if (!this.componentHeightBoolean) {
                            var $divHeight = this.container.querySelector('div[component]');
                            $divHeight['style'].height = 'calc(100% - 48px)';
                            this.componentHeightBoolean = true;
                        }
                    }
                    else {
                        this.componentTitle.style.display = 'none';
                        if (this.componentHeightBoolean) {
                            var $divHeight = this.container.querySelector('div[component]');
                            $divHeight['style'].height = '100%';
                            this.componentHeightBoolean = false;
                        }
                    }
                    break;
                case 'title_name_titleValue':
                    if (style[key]) {
                        this.componentTitle.querySelector('[componentTitleText]').style.display = 'block';
                    }
                    else {
                        this.componentTitle.querySelector('[componentTitleText]').style.display = 'none';
                    }
                    break;
                case 'title_name_textValue':
                    this.componentTitle.querySelector('[componentTitleText]').innerText = style[key];
                    break;
                case 'title_name':
                    if (style[key]['textValue'] !== null) {
                        this.componentTitle.querySelector('[componentTitleText]').innerText = style[key]['textValue'];
                    }
                    break;
                case 'chart_download':
                    if (style[key]) {
                        this.componentTitle.querySelector('[componentTitleDownload]').style.display = 'block';
                    }
                    else {
                        this.componentTitle.querySelector('[componentTitleDownload]').style.display = 'none';
                    }
                    break;
                case 'chart_help_titleValue':
                    if (style[key]) {
                        this.componentTitle.querySelector('[componentTitleHelp]').style.display = 'block';
                    }
                    else {
                        this.componentTitle.querySelector('[componentTitleHelp]').style.display = 'none';
                    }
                    break;
                case 'chart_help_textValue':
                    this.componentTitle.querySelector('[componentTitleHelpText]').innerText = style[key];
                    break;
                case 'component_width':
                    //if(this.enableEdit){
                    this.width = parseInt(style[key]);
                    //}
                    break;
                case 'component_height':
                    // if(this.enableEdit){
                    this.height = parseInt(style[key]);
                    // }
                    break;
                case 'component_x':
                    //if(this.enableEdit){
                    this.x = parseInt(style[key]);
                    //}
                    break;
                case 'component_y':
                    // if(this.enableEdit){
                    this.y = parseInt(style[key]);
                    // }
                    break;
            }
        }
        this.resize();
    };
    Object.defineProperty(ComponentContainer.prototype, "enableDrag", {
        set: function (drag) {
            this.drag(drag);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ComponentContainer.prototype, "enableResize", {
        set: function (resize) {
            if (resize) {
                this.leftTopResize['style'].display = "block";
                this.leftCenterResize['style'].display = "block";
                this.topCenterResize['style'].display = "block";
                this.leftBottomResize['style'].display = "block";
                this.rightTopResize['style'].display = "block";
                this.rightCenterResize['style'].display = "block";
                this.bottomCenterResize['style'].display = "block";
                this.rightBottomResize['style'].display = "block";
            }
            else {
                this.leftTopResize['style'].display = "none";
                this.leftCenterResize['style'].display = "none";
                this.topCenterResize['style'].display = "none";
                this.leftBottomResize['style'].display = "none";
                this.rightTopResize['style'].display = "none";
                this.rightCenterResize['style'].display = "none";
                this.bottomCenterResize['style'].display = "none";
                this.rightBottomResize['style'].display = "none";
            }
            this.dragResize(resize);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ComponentContainer.prototype, "enableSelect", {
        set: function (select) {
            this.isSelect = false;
            if (select) {
                this.selectHandle = this.selectElement.bind(this);
                this.element.addEventListener('click', this.selectHandle, false);
            }
            else {
                this.selectHandle = null;
                this.element.removeEventListener('click', this.selectHandle, false);
            }
        },
        enumerable: true,
        configurable: true
    });
    ComponentContainer.prototype.selectElement = function (e) {
        if (this.selectHandle !== null) {
            e = e || window.event;
            e.preventDefault();
            e.stopPropagation();
            if (this.upFlag) {
                this.upFlag = false;
            }
            else {
                //触发事件
                emitter_event_1.EventEmitter.trigger(type_event_1.EventType.COMSELEECT, {
                    scopeID: this.scopeID
                });
            }
        }
    };
    ;
    Object.defineProperty(ComponentContainer.prototype, "enableDataChange", {
        set: function (change) {
            if (change) {
                emitter_event_1.EventEmitter.register(type_event_1.EventType.DATACHANGE, this.dataChangeHandle, this);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ComponentContainer.prototype, "enableStyleChange", {
        set: function (change) {
            if (change) {
                emitter_event_1.EventEmitter.register(type_event_1.EventType.STYLECHANGE, this.styleChangeHandle, this);
            }
        },
        enumerable: true,
        configurable: true
    });
    ComponentContainer.prototype.dataChangeHandle = function (e, data) {
        this.dataChange(data);
    };
    ComponentContainer.prototype.styleChangeHandle = function (e, data) {
        this.styleChange(data);
    };
    ComponentContainer.prototype.drag = function (drag) {
        this.dragPosition = { x: 0, y: 0 };
        if (drag) {
            this.startDragHandle = this.startDragElement.bind(this);
            this.dragHandle = this.dragElement.bind(this);
            this.endDragHandle = this.endDragElement.bind(this);
            this.element.addEventListener('mousedown', this.startDragHandle, false);
            document.addEventListener('mouseup', this.endDragHandle, false);
        }
        else {
            this.element.removeEventListener('mousedown', this.startDragHandle, false);
            document.removeEventListener('mouseup', this.endDragHandle, false);
            this.startDragHandle = null;
            this.dragHandle = null;
            this.endDragHandle = null;
            this.dragPosition = null;
        }
    };
    ComponentContainer.prototype.startDragElement = function (e) {
        if (this.startDragHandle !== null) {
            if (e.which == 3) {
                return;
            }
            e = e || window.event;
            e.preventDefault();
            e.stopPropagation();
            this.dragPosition.x = e.clientX - this.x;
            this.dragPosition.y = e.clientY - this.y;
            document.addEventListener('mousemove', this.dragHandle);
        }
    };
    ;
    ComponentContainer.prototype.dragElement = function (e) {
        this.upFlag = true;
        e = e || window.event;
        e.preventDefault();
        e.stopPropagation();
        var l = e.clientX - this.dragPosition.x;
        var t = e.clientY - this.dragPosition.y;
        // if (l < 0) {
        //     l = 0;
        // }
        // if (l > this.parent.width - this.width) {
        //     l = this.parent.width - this.width;
        // }
        // if (t < 0) {
        //     t = 0;
        // }
        //移动差值
        var dis_x = l - this.x;
        var dis_y = t - this.y;
        this.x = l;
        this.y = t;
        //触发事件
        emitter_event_1.EventEmitter.trigger(type_event_1.EventType.DRAGSELEECT, {
            scopeID: this.scopeID,
            disX: dis_x,
            disY: dis_y
        });
    };
    ComponentContainer.prototype.endDragElement = function (e) {
        e.preventDefault();
        e.stopPropagation();
        document.removeEventListener('mousemove', this.dragHandle, false);
    };
    ComponentContainer.prototype.dragResize = function (resize) {
        var _this = this;
        var startResizeElement = "startResize_" + this.scopeID;
        var resizeElement = "resize_" + this.scopeID;
        var startX = 0, startY = 0, endX = 0, endY = 0, historyWidth = 0, historyHeight = 0;
        var direction = null;
        window[startResizeElement] = function (e) {
            e = e || window.event;
            e.preventDefault();
            e.stopPropagation();
            direction = e.currentTarget.getAttribute("direction");
            // startX = e.layerX || e.offsetX;
            // startY = e.layerY || e.offsetY;
            startX = e.clientX;
            startY = e.clientY;
            historyWidth = _this.width;
            historyHeight = _this.height;
            document.addEventListener('mousemove', window[resizeElement]);
        };
        window[resizeElement] = function (e) {
            _this.upFlag = true;
            e = e || window.event;
            e.preventDefault();
            e.stopPropagation();
            // endX = e.layerX || e.offsetX;
            // endY = e.layerY || e.offsetY;
            var offsetPosition = utils_1.Utils.offsetPosition(_this.element.parentElement);
            switch (direction) {
                case "left-top":
                    endX = e.clientX - offsetPosition.left;
                    endY = e.clientY - offsetPosition.top;
                    _this.x = endX;
                    _this.y = endY;
                    _this.width = startX - endX + historyWidth;
                    _this.height = startY - endY + historyHeight;
                    break;
                case "left-center":
                    endX = e.clientX - offsetPosition.left;
                    _this.x = endX;
                    _this.width = startX - endX + historyWidth;
                    break;
                case "top-center":
                    endY = e.clientY - offsetPosition.top;
                    _this.y = endY;
                    _this.height = startY - endY + historyHeight;
                    break;
                case "left-bottom":
                    endX = e.clientX - offsetPosition.left;
                    endY = e.clientY;
                    _this.x = endX;
                    _this.width = startX - endX + historyWidth;
                    _this.height = endY - startY + historyHeight;
                    break;
                case "right-top":
                    endX = e.clientX;
                    endY = e.clientY - offsetPosition.top;
                    _this.y = endY;
                    _this.width = endX - startX + historyWidth;
                    _this.height = startY - endY + historyHeight;
                    break;
                case "right-center":
                    endX = e.clientX;
                    _this.width = endX - startX + historyWidth;
                    break;
                case "bottom-center":
                    endY = e.clientY;
                    _this.height = endY - startY + historyHeight;
                    break;
                case "right-bottom":
                    endX = e.clientX;
                    endY = e.clientY;
                    _this.width = endX - startX + historyWidth;
                    _this.height = endY - startY + historyHeight;
                    break;
            }
        };
        document.addEventListener('mouseup', function (e) {
            e.preventDefault();
            e.stopPropagation();
            document.removeEventListener('mousemove', window[resizeElement]);
        });
        if (resize) {
            this.leftTopResize.addEventListener('mousedown', window[startResizeElement]);
            this.leftCenterResize.addEventListener('mousedown', window[startResizeElement]);
            this.topCenterResize.addEventListener('mousedown', window[startResizeElement]);
            this.leftBottomResize.addEventListener('mousedown', window[startResizeElement]);
            this.rightTopResize.addEventListener('mousedown', window[startResizeElement]);
            this.rightCenterResize.addEventListener('mousedown', window[startResizeElement]);
            this.bottomCenterResize.addEventListener('mousedown', window[startResizeElement]);
            this.rightBottomResize.addEventListener('mousedown', window[startResizeElement]);
        }
        else {
            this.leftTopResize.removeEventListener('mousedown', window[startResizeElement]);
            this.leftCenterResize.removeEventListener('mousedown', window[startResizeElement]);
            this.topCenterResize.removeEventListener('mousedown', window[startResizeElement]);
            this.leftBottomResize.removeEventListener('mousedown', window[startResizeElement]);
            this.rightTopResize.removeEventListener('mousedown', window[startResizeElement]);
            this.rightCenterResize.removeEventListener('mousedown', window[startResizeElement]);
            this.bottomCenterResize.removeEventListener('mousedown', window[startResizeElement]);
            this.rightBottomResize.removeEventListener('mousedown', window[startResizeElement]);
        }
    };
    return ComponentContainer;
}(base_container_1.BaseContainer));
exports.ComponentContainer = ComponentContainer;
//# sourceMappingURL=component.container.js.map