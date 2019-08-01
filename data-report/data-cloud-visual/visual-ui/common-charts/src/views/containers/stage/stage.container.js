"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by wangshouyun on 2017/3/7.
 */
var base_container_1 = require("../base/base.container");
var stage_template_1 = require("./stage.template");
var select_container_1 = require("./select/select.container");
var emitter_event_1 = require("../../../events/emitter.event");
var timer_1 = require("../../../../public/scripts/timer");
var type_event_1 = require("../../../events/type.event");
var common_style_1 = require("./common.style");
var component_container_1 = require("../component/component.container");
var right_menu_1 = require("../component/menu/right.menu");
var base_list_1 = require("../../components/base.list");
var utils_1 = require("../../../../public/scripts/utils");
var StageContainer = (function (_super) {
    __extends(StageContainer, _super);
    function StageContainer(el) {
        var _this = _super.call(this) || this;
        _this.children = [];
        _this.isRelativeStage = false;
        _this.isControlDown = false;
        _this.selectChart = [];
        StageContainer.that = _this;
        var style = new common_style_1.CommonStyle();
        var template = new stage_template_1.StageTemplate(_this.scopeID);
        //模板渲染后获得当前节点
        _this.element = _this.render(template);
        //获得相对定位的容器
        _this.container = _this.element.querySelector('[containerSide]');
        //插入父级容器
        _this.insertToElement(el);
        _this.historyWidth = _this.width;
        _this.historyHeight = _this.height;
        //添加组件右键菜单
        emitter_event_1.EventEmitter.register(type_event_1.EventType.COMRIGHTMENU, _this.componentRightMenu, _this);
        _this.addChild(right_menu_1.ComponentRightMenu.getInstance());
        _this.element.addEventListener('contextmenu', function (e) {
            e = e || window.event;
            e.preventDefault();
            e.stopPropagation();
        });
        //组件选择事件
        emitter_event_1.EventEmitter.register(type_event_1.EventType.COMSELEECT, _this.componentSelect, _this);
        emitter_event_1.EventEmitter.register(type_event_1.EventType.DRAGSELEECT, _this.dragSelectChart, _this);
        emitter_event_1.EventEmitter.register(type_event_1.EventType.STAGECHANGE, _this.stagechange, _this);
        emitter_event_1.EventEmitter.register(type_event_1.EventType.ALIGN.action, _this.actionAlignHandle, _this);
        _this.container.addEventListener('click', function (e) {
            _this.componentSelect(e, {
                scopeID: ""
            });
        });
        //监听shift键
        if (_this.controlKeyDownBind) {
            document.removeEventListener("keydown", _this.controlKeyDownBind);
        }
        if (_this.controlKeyDownBind) {
            document.removeEventListener("keyup", _this.controlKeyUpBind);
        }
        _this.controlKeyDownBind = _this.controlKeyDown.bind(_this);
        _this.controlKeyUpBind = _this.controlKeyUp.bind(_this);
        document.addEventListener("keydown", _this.controlKeyDownBind);
        document.addEventListener("keyup", _this.controlKeyUpBind);
        //默认属性设置
        _this.enableResize = true;
        _this.enableScroll = true;
        _this.enableDragCreateChart = true;
        return _this;
    }
    StageContainer.prototype.rebindevent = function () {
        emitter_event_1.EventEmitter.register(type_event_1.EventType.COMRIGHTMENU, this.componentRightMenu, this);
        emitter_event_1.EventEmitter.register(type_event_1.EventType.COMSELEECT, this.componentSelect, this);
        emitter_event_1.EventEmitter.register(type_event_1.EventType.DRAGSELEECT, this.dragSelectChart, this);
        emitter_event_1.EventEmitter.register(type_event_1.EventType.STAGECHANGE, this.stagechange, this);
        emitter_event_1.EventEmitter.register(type_event_1.EventType.ALIGN.action, this.actionAlignHandle, this);
    };
    StageContainer.prototype.messageHandler = function (eventName, message) {
        if (this.messenger) {
            this.messenger(message);
        }
    };
    Object.defineProperty(StageContainer.prototype, "preViewModel", {
        //预览编辑模式切换
        set: function (bool) {
            for (var _i = 0, _a = this.allChildren; _i < _a.length; _i++) {
                var item = _a[_i];
                item.enableEdit = !bool;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StageContainer.prototype, "historySize", {
        set: function (size) {
            this.historyWidth = size.width;
            this.historyHeight = size.height;
        },
        enumerable: true,
        configurable: true
    });
    StageContainer.prototype.componentRightMenu = function (e, data) {
        switch (data.menu) {
            case "delete":
                var deleteArr = [];
                for (var _i = 0, _a = this.getSelectChild(); _i < _a.length; _i++) {
                    var item = _a[_i];
                    deleteArr.push(item.scopeID);
                    this.removeChild(item);
                }
                emitter_event_1.EventEmitter.trigger(type_event_1.EventType.COMDELETE, deleteArr);
                break;
            case "up_layer":
                for (var _b = 0, _c = this.getSelectChild(); _b < _c.length; _b++) {
                    var item = _c[_b];
                    if (item.scopeID == data.scopeID && item.layer < 999) {
                        item.layer += 1;
                    }
                }
                break;
            case "down_layer":
                for (var _d = 0, _e = this.getSelectChild(); _d < _e.length; _d++) {
                    var item = _e[_d];
                    if (item.scopeID == data.scopeID && item.layer > 0) {
                        item.layer -= 1;
                    }
                }
                break;
            case "top_layer":
                for (var _f = 0, _g = this.getSelectChild(); _f < _g.length; _f++) {
                    var item = _g[_f];
                    if (item.scopeID == data.scopeID) {
                        item.layer = 999;
                    }
                }
                break;
            case "bottom_layer":
                for (var _h = 0, _j = this.getSelectChild(); _h < _j.length; _h++) {
                    var item = _j[_h];
                    if (item.scopeID == data.scopeID) {
                        item.layer = 0;
                    }
                }
                break;
            case "align_left":
                emitter_event_1.EventEmitter.trigger(type_event_1.EventType.ALIGN.action, type_event_1.EventType.ALIGN.left);
                break;
            case "align_right":
                emitter_event_1.EventEmitter.trigger(type_event_1.EventType.ALIGN.action, type_event_1.EventType.ALIGN.right);
                break;
            case "align_top":
                emitter_event_1.EventEmitter.trigger(type_event_1.EventType.ALIGN.action, type_event_1.EventType.ALIGN.top);
                break;
            case "align_bottom":
                emitter_event_1.EventEmitter.trigger(type_event_1.EventType.ALIGN.action, type_event_1.EventType.ALIGN.bottom);
                break;
            case "align_center":
                emitter_event_1.EventEmitter.trigger(type_event_1.EventType.ALIGN.action, type_event_1.EventType.ALIGN.horiz_center);
                break;
            case "align_vertical":
                emitter_event_1.EventEmitter.trigger(type_event_1.EventType.ALIGN.action, type_event_1.EventType.ALIGN.vertical_center);
                break;
        }
    };
    StageContainer.prototype.componentSelect = function (e, data) {
        if (this.isControlDown) {
            var item = this.getContainerByScopeID(data.scopeID);
            if (item.isSelect) {
                item.isSelect = false;
            }
            else {
                item.isSelect = true;
            }
        }
        else {
            for (var _i = 0, _a = this.allChildren; _i < _a.length; _i++) {
                var item = _a[_i];
                if (item.scopeID == data.scopeID) {
                    item.isSelect = true;
                }
                else {
                    item.isSelect = false;
                }
            }
        }
        //触发事件
        var emitData = [];
        for (var _b = 0, _c = this.getSelectChild(); _b < _c.length; _b++) {
            var selectChild = _c[_b];
            emitData.push({
                type: selectChild.type,
                scopeID: selectChild.scopeID,
                viewName: selectChild.component.viewName
            });
        }
        emitter_event_1.EventEmitter.trigger(type_event_1.EventType.SELECTCHART, emitData);
    };
    StageContainer.prototype.controlKeyDown = function (e) {
        if (e.keyCode == 17) {
            this.isControlDown = true;
        }
    };
    StageContainer.prototype.controlKeyUp = function (e) {
        if (e.keyCode == 17) {
            this.isControlDown = false;
        }
    };
    Object.defineProperty(StageContainer.prototype, "enableDragCreateChart", {
        set: function (create) {
            var _this = this;
            var dropElement = "drop_" + this.scopeID;
            var dragoverElement = "dragover_" + this.scopeID;
            window[dragoverElement] = function (e) {
                e.preventDefault();
                for (var _i = 0, _a = _this.children; _i < _a.length; _i++) {
                    var item = _a[_i];
                    item.addStyle('pointer-events', "none");
                }
            };
            window[dropElement] = function (e) {
                e.preventDefault();
                for (var _i = 0, _a = _this.children; _i < _a.length; _i++) {
                    var item = _a[_i];
                    item.addStyle('pointer-events', "auto");
                }
                _this.dragCreateHandle(e);
            };
            if (create) {
                this.element.addEventListener('dragover', window[dragoverElement]);
                this.element.addEventListener('drop', window[dropElement]);
            }
            else {
                this.element.removeEventListener('dragover', window[dragoverElement]);
                this.element.removeEventListener('drop', window[dropElement]);
            }
        },
        enumerable: true,
        configurable: true
    });
    StageContainer.prototype.dragCreateHandle = function (e) {
        var x = e.layerX || e.offsetX;
        var y = e.layerY || e.offsetY;
        y += this.container.scrollTop;
        var chartType = e.dataTransfer.getData("chartType");
        if (chartType) {
            var component = base_list_1.BaseComponentList.getComponentByType(chartType);
            if (component) {
                var componentContainer = new component_container_1.ComponentContainer(this, component, component.scopeID);
                componentContainer.enableEdit = true;
                componentContainer.x = x;
                componentContainer.y = y;
                componentContainer.width = 300;
                componentContainer.height = 300;
                componentContainer.type = chartType;
                componentContainer.isSelect = true;
                this.addChild(componentContainer);
                this.refresh();
                //触发事件
                emitter_event_1.EventEmitter.trigger(type_event_1.EventType.COMSELEECT, { scopeID: componentContainer.scopeID });
            }
        }
    };
    Object.defineProperty(StageContainer.prototype, "enableScroll", {
        set: function (scroll) {
            var _this = this;
            this.timer = new timer_1.Timer();
            var scrollHandle = function (e) {
                _this.timer.startTimeOut(0.5, _this.scrollHandle, _this);
            };
            if (scroll) {
                this.container.addEventListener('scroll', scrollHandle);
            }
            else {
                this.timer = null;
                this.container.removeEventListener('scroll', scrollHandle);
            }
        },
        enumerable: true,
        configurable: true
    });
    StageContainer.prototype.scrollHandle = function () {
        if (this.timer)
            this.timer.stopTimeOut();
        for (var _i = 0, _a = this.allChildren; _i < _a.length; _i++) {
            var child = _a[_i];
            if (!child.hasLoad) {
                child.hasLoad = true;
                child.loadData();
            }
        }
    };
    Object.defineProperty(StageContainer.prototype, "enableResize", {
        //舞台缩放
        set: function (resize) {
            var _this = this;
            var resizeElement = "resize_" + this.scopeID;
            window[resizeElement] = function (e) {
                _this.timer.startTimeOut(0.5, _this.resizeHandle, _this);
            };
            if (resize) {
                window.addEventListener('resize', window[resizeElement], false);
            }
            else {
                this.timer = null;
                window.removeEventListener('resize', window[resizeElement], false);
            }
        },
        enumerable: true,
        configurable: true
    });
    StageContainer.prototype.actionAlignHandle = function (e, direction) {
        var selectChild = this.getSelectChild();
        if (selectChild.length == 1) {
            this.isRelativeStage = true;
        }
        else {
            this.isRelativeStage = false;
        }
        switch (direction) {
            case type_event_1.EventType.ALIGN.left:
                if (this.isRelativeStage) {
                    for (var _i = 0, selectChild_1 = selectChild; _i < selectChild_1.length; _i++) {
                        var child = selectChild_1[_i];
                        child.x = 0;
                    }
                }
                else {
                    var container = this.getPointContainer(selectChild, 'min_x');
                    for (var _a = 0, selectChild_2 = selectChild; _a < selectChild_2.length; _a++) {
                        var child = selectChild_2[_a];
                        if (child !== container) {
                            child.x = container.x;
                        }
                    }
                }
                break;
            case type_event_1.EventType.ALIGN.right:
                if (this.isRelativeStage) {
                    for (var _b = 0, selectChild_3 = selectChild; _b < selectChild_3.length; _b++) {
                        var child = selectChild_3[_b];
                        child.x = this.width - child.width;
                    }
                }
                else {
                    var container = this.getPointContainer(selectChild, 'max_x');
                    for (var _c = 0, selectChild_4 = selectChild; _c < selectChild_4.length; _c++) {
                        var child = selectChild_4[_c];
                        if (child !== container) {
                            child.x = container.x + container.width - child.width;
                        }
                    }
                }
                break;
            case type_event_1.EventType.ALIGN.top:
                if (this.isRelativeStage) {
                    for (var _d = 0, selectChild_5 = selectChild; _d < selectChild_5.length; _d++) {
                        var child = selectChild_5[_d];
                        child.y = 0;
                    }
                }
                else {
                    var container = this.getPointContainer(selectChild, 'min_y');
                    for (var _e = 0, selectChild_6 = selectChild; _e < selectChild_6.length; _e++) {
                        var child = selectChild_6[_e];
                        if (child !== container) {
                            child.y = container.y;
                        }
                    }
                }
                break;
            case type_event_1.EventType.ALIGN.bottom:
                if (this.isRelativeStage) {
                    for (var _f = 0, selectChild_7 = selectChild; _f < selectChild_7.length; _f++) {
                        var child = selectChild_7[_f];
                        child.y = this.height - child.height;
                    }
                }
                else {
                    var container = this.getPointContainer(selectChild, 'max_y');
                    for (var _g = 0, selectChild_8 = selectChild; _g < selectChild_8.length; _g++) {
                        var child = selectChild_8[_g];
                        if (child !== container) {
                            child.y = container.y + container.height - child.height;
                        }
                    }
                }
                break;
            case type_event_1.EventType.ALIGN.vertical_center:
                if (this.isRelativeStage) {
                    for (var _h = 0, selectChild_9 = selectChild; _h < selectChild_9.length; _h++) {
                        var child = selectChild_9[_h];
                        child.y = (this.height - child.height) / 2;
                    }
                }
                else {
                    var container = this.getPointContainer(selectChild, 'min_y');
                    for (var _j = 0, selectChild_10 = selectChild; _j < selectChild_10.length; _j++) {
                        var child = selectChild_10[_j];
                        if (child !== container) {
                            child.y = container.y + (container.height - child.height) / 2;
                        }
                    }
                }
                break;
            case type_event_1.EventType.ALIGN.horiz_center:
                if (this.isRelativeStage) {
                    for (var _k = 0, selectChild_11 = selectChild; _k < selectChild_11.length; _k++) {
                        var child = selectChild_11[_k];
                        child.x = (this.width - child.width) / 2;
                    }
                }
                else {
                    var container = this.getPointContainer(selectChild, 'min_x');
                    for (var _l = 0, selectChild_12 = selectChild; _l < selectChild_12.length; _l++) {
                        var child = selectChild_12[_l];
                        if (child !== container) {
                            child.x = container.x + (container.width - child.width) / 2;
                        }
                    }
                }
                break;
            case type_event_1.EventType.ALIGN.vertical_gap:
                if (this.isRelativeStage) {
                    for (var _m = 0, selectChild_13 = selectChild; _m < selectChild_13.length; _m++) {
                        var child = selectChild_13[_m];
                        child.y = this.height - child.height;
                    }
                }
                else {
                }
                break;
            case type_event_1.EventType.ALIGN.horiz_gap:
                var sortSelectChild = this.getSortSelectChild(selectChild, "y");
                if (this.isRelativeStage) {
                    for (var _o = 0, sortSelectChild_1 = sortSelectChild; _o < sortSelectChild_1.length; _o++) {
                        var child = sortSelectChild_1[_o];
                        child.y = this.height - child.height;
                    }
                }
                else {
                    if (sortSelectChild.length > 2) {
                        var first = sortSelectChild[0];
                        var last = sortSelectChild[sortSelectChild.length - 1];
                        var dis = last.x - first.maxX;
                        var countWidth = 0;
                        for (var i = 1; i < sortSelectChild.length - 1; i++) {
                            countWidth += sortSelectChild[i].width;
                        }
                        if (dis < countWidth) {
                            for (var m = 1; m < sortSelectChild.length - 1; m++) {
                                sortSelectChild[m].x = first.maxX + dis / 2 - sortSelectChild[m].width / 2;
                            }
                        }
                        else {
                        }
                    }
                }
                break;
        }
    };
    //重置舞台
    StageContainer.prototype.resizeHandle = function () {
        var scaleValue = (this.width / this.historyWidth).toFixed(2);
        for (var _i = 0, _a = this.stageData.components; _i < _a.length; _i++) {
            var component = _a[_i];
            var chartStyle = component.chart.style;
            if (chartStyle.data && chartStyle.data["component_width"]) {
                chartStyle.data["component_width"] = parseInt(chartStyle.data["component_width"]) * scaleValue;
            }
            if (chartStyle.data && chartStyle.data["component_x"]) {
                chartStyle.data["component_x"] = parseInt(chartStyle.data["component_x"]) * scaleValue;
            }
        }
        this.historyWidth = this.width;
        var all = this.children;
        var _loop_1 = function (i) {
            var child = all[i];
            setTimeout(function () {
                emitter_event_1.EventEmitter.trigger(type_event_1.EventType.STYLECHANGE, {
                    scopeID: child.component._scopeID,
                    result: child.chartStyle.data
                });
            }, 200);
        };
        for (var i = 0; i < all.length; i++) {
            _loop_1(i);
        }
    };
    StageContainer.prototype.getSortSelectChild = function (childlist, sortKey) {
        ct: for (var index = 0; index < childlist.length - 1; index++) {
            var first = childlist[index];
            var second = childlist[index + 1];
            if (sortKey == "x") {
                if (second.x < first.x) {
                    childlist[index + 1] = first;
                    childlist[index] = second;
                    continue ct;
                }
            }
            if (sortKey == "y") {
                if (second.y < first.y) {
                    childlist[index + 1] = first;
                    childlist[index] = second;
                    continue ct;
                }
            }
        }
        return childlist;
    };
    StageContainer.prototype.getPointContainer = function (containerlist, type) {
        var container = containerlist[0];
        for (var _i = 0, containerlist_1 = containerlist; _i < containerlist_1.length; _i++) {
            var item = containerlist_1[_i];
            switch (type) {
                case "min_x":
                    if (container.x > item.x) {
                        container = item;
                    }
                    break;
                case "min_y":
                    if (container.y > item.y) {
                        container = item;
                    }
                    break;
                case "max_x":
                    if (container.x + container.width < item.x + item.width) {
                        container = item;
                    }
                    break;
                case "max_y":
                    if (container.y + container.height < item.y + item.height) {
                        container = item;
                    }
                    break;
            }
        }
        return container;
    };
    StageContainer.prototype.select = function (select) {
        var _this = this;
        var selectStart = "selectStart_" + this.scopeID;
        var selecting = "selecting_" + this.scopeID;
        var selectEnd = "selectEnd_" + this.scopeID;
        if (select) {
            var selectContainer_1 = null;
            var startX_1 = 0, startY_1 = 0;
            window[selectStart] = function (e) {
                e = e || window.event;
                // e.preventDefault();
                e.stopPropagation();
                if (e.target.getAttribute("container") != _this.scopeID) {
                    return;
                }
                var offsetPosition = utils_1.Utils.offsetPosition(_this.element);
                startX_1 = e.clientX - offsetPosition.left;
                startY_1 = e.clientY - offsetPosition.top;
                selectContainer_1 = new select_container_1.SelectContainer();
                _this.addChild(selectContainer_1);
                selectContainer_1.x = startX_1;
                selectContainer_1.y = startY_1;
                document.addEventListener("mouseup", window[selectEnd]);
                document.addEventListener("mousemove", window[selecting]);
            };
            window[selecting] = function (e) {
                e = e || window.event;
                // e.preventDefault();
                e.stopPropagation();
                var offsetPosition = utils_1.Utils.offsetPosition(_this.element);
                var endX = e.clientX - offsetPosition.left;
                var endY = e.clientY - offsetPosition.top;
                var disX = endX - startX_1;
                var disY = endY - startY_1;
                if (disX > 5 && disY > 5) {
                    return;
                }
                //左上
                if (disX > 0 && disY > 0) {
                    selectContainer_1.x = startX_1;
                    selectContainer_1.y = startY_1;
                    selectContainer_1.width = endX - startX_1;
                    selectContainer_1.height = endY - startY_1;
                }
                //左下
                if (disX > 0 && disY < 0) {
                    selectContainer_1.x = startX_1;
                    selectContainer_1.y = endY;
                    selectContainer_1.width = endX - startX_1;
                    selectContainer_1.height = startY_1 - endY;
                }
                //右下
                if (disX < 0 && disY < 0) {
                    selectContainer_1.x = endX;
                    selectContainer_1.y = endY;
                    selectContainer_1.width = startX_1 - endX;
                    selectContainer_1.height = startY_1 - endY;
                }
                //右上
                if (disX < 0 && disY > 0) {
                    selectContainer_1.x = endX;
                    selectContainer_1.y = startY_1;
                    selectContainer_1.width = startX_1 - endX;
                    selectContainer_1.height = endY - startY_1;
                }
                _this.selectChild(selectContainer_1);
            };
            window[selectEnd] = function (e) {
                e = e || window.event;
                // e.preventDefault();
                e.stopPropagation();
                if (selectContainer_1) {
                    _this.removeChild(selectContainer_1);
                }
                document.removeEventListener("mouseup", window[selectEnd]);
                document.removeEventListener("mousemove", window[selecting]);
            };
            this.element.addEventListener("mousedown", window[selectStart]);
        }
        else {
            this.element.removeEventListener("mousedown", window[selectStart]);
            document.removeEventListener("mouseup", window[selectEnd]);
            document.removeEventListener("mousemove", window[selecting]);
        }
    };
    StageContainer.prototype.selectChild = function (selectContainer) {
        var selectContainerRange = {
            minPoint: { x: selectContainer.x, y: selectContainer.y },
            maxPoint: { x: selectContainer.x + selectContainer.width, y: selectContainer.y + selectContainer.height }
        };
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var container = _a[_i];
            var leftTopPoint = {
                x: container.x,
                y: container.y
            };
            var leftBottomPoint = {
                x: container.x,
                y: container.y + container.height
            };
            var rightTopPoint = {
                x: container.x + container.width,
                y: container.y
            };
            var rightBottomPoint = {
                x: container.x + container.width,
                y: container.y + container.height
            };
            if (this.isInRange(selectContainerRange, leftTopPoint)
                || this.isInRange(selectContainerRange, leftBottomPoint)
                || this.isInRange(selectContainerRange, rightTopPoint)
                || this.isInRange(selectContainerRange, rightBottomPoint)) {
                container.isSelect = true;
            }
            else {
                container.isSelect = false;
            }
        }
        //触发事件
        var emitData = [];
        for (var _b = 0, _c = this.getSelectChild(); _b < _c.length; _b++) {
            var selectChild = _c[_b];
            emitData.push({
                type: selectChild.type,
                scopeID: selectChild.scopeID
            });
        }
        emitter_event_1.EventEmitter.trigger(type_event_1.EventType.SELECTCHART, emitData);
    };
    StageContainer.prototype.isInRange = function (range, point) {
        if ((point.x > range.minPoint.x && point.y > range.minPoint.y)
            && (point.x < range.maxPoint.x && point.y < range.maxPoint.y)) {
            return true;
        }
        return false;
    };
    StageContainer.prototype.getSelectChild = function () {
        var selectArr = [];
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var container = _a[_i];
            if (container.isSelect) {
                selectArr.push(container);
            }
        }
        this.selectChart = selectArr;
        return selectArr;
    };
    StageContainer.prototype.addChild = function (container) {
        container.beforeShow();
        this.container.appendChild(container.element);
        if (!(container instanceof select_container_1.SelectContainer) && !(container instanceof right_menu_1.ComponentRightMenu)) {
            this.children.push(container);
        }
        container.parent = this;
        container.afterShow();
    };
    Object.defineProperty(StageContainer.prototype, "allChildren", {
        get: function () {
            return this.children;
        },
        enumerable: true,
        configurable: true
    });
    StageContainer.prototype.removeChild = function (container) {
        container.beforeDestory();
        this.container.removeChild(container.element);
        for (var index = 0; index < this.children.length; index++) {
            if (this.children[index].scopeID == container.scopeID) {
                this.children.splice(index--, 1);
                break;
            }
        }
        container.afterDestory();
    };
    StageContainer.prototype.removeAllChild = function () {
        while (this.children.length > 0) {
            this.removeChild(this.children[0]);
        }
    };
    StageContainer.prototype.getContainerByScopeID = function (id) {
        for (var _i = 0, _a = this.allChildren; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item.scopeID == id) {
                return item;
            }
        }
        return null;
    };
    StageContainer.prototype.refresh = function () {
        //this.resizeHandle();
        this.scrollHandle();
    };
    StageContainer.prototype.dragSelectChart = function (e, data) {
        for (var _i = 0, _a = this.getSelectChild(); _i < _a.length; _i++) {
            var item = _a[_i];
            if (item.scopeID != data.scopeID) {
                item.x += data.disX;
                item.y += data.disY;
            }
        }
    };
    StageContainer.prototype.stagechange = function (e, data) {
        // this.sizeFormat = data.size;
        // this.addStyle('margin','20px auto');
        // this.addStyle('width',data['width'] + 'px');
        // this.addStyle('height',data['height'] + 'px');
    };
    return StageContainer;
}(base_container_1.BaseContainer));
exports.StageContainer = StageContainer;
//# sourceMappingURL=stage.container.js.map