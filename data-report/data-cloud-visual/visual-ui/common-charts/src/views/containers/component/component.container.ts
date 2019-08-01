/**
 * Created by wangshouyun on 2017/3/17.
 */

import {BaseContainer} from "../base/base.container";
import {BaseComponent} from "../../components/base.component";
import {ComponentTemplate} from "./component.template";
import {EventEmitter} from "../../../events/emitter.event";
import {EventType} from "../../../events/type.event";
import {ComponentRightMenu} from "./menu/right.menu";
import {Utils} from "../../../../public/scripts/utils";
import * as $ from 'jquery';

export class ComponentContainer extends BaseContainer {
    private dataError: Element;
    private leftTopResize: Element;
    private leftCenterResize: Element;
    private topCenterResize: Element;
    private leftBottomResize: Element;
    private rightTopResize: Element;
    private rightCenterResize: Element;
    private bottomCenterResize: Element;
    private rightBottomResize: Element;
    private _enableEdit: Boolean;
    private upFlag: Boolean = false;
    private componentRightMenuHandle: any = null;
    private selectHandle: any = null;
    private startDragHandle: any = null;
    private dragHandle: any = null;
    private endDragHandle: any = null;
    private dragPosition: any = null;
    private componentTitle: any = null;
    private componentContainer: any = null;
    private componentHeightBoolean: any = false;
    private stage: any = null;
    public chartStyle: any = null;
    public getFilterMethod: any = null;

    constructor(stage: any, component: BaseComponent, scopeID?: string) {
        super();

        this.stage = stage;

        if (scopeID) component.scopeID = this.scopeID = scopeID;

        let template = new ComponentTemplate(this.scopeID);

        //获得模板渲染后的节点
        this.element = this.render(template);

        //数据错误
        this.dataError = this.element.querySelector('[data-error]') as Element;
        //缩放
        this.leftTopResize = this.element.querySelector('[direction="left-top"]') as Element;
        this.leftCenterResize = this.element.querySelector('[direction="left-center"]') as Element;
        this.topCenterResize = this.element.querySelector('[direction="top-center"]') as Element;
        this.leftBottomResize = this.element.querySelector('[direction="left-bottom"]') as Element;
        this.rightTopResize = this.element.querySelector('[direction="right-top"]') as Element;
        this.rightCenterResize = this.element.querySelector('[direction="right-center"]') as Element;
        this.bottomCenterResize = this.element.querySelector('[direction="bottom-center"]') as Element;
        this.rightBottomResize = this.element.querySelector('[direction="right-bottom"]') as Element;

        //title
        this.componentTitle = this.element.querySelector('[componentTitle]') as Element;

        //容器
        this.container = this.element.querySelector('[container]') as Element;
        this.componentContainer = this.element.querySelector('[componentContainer]') as Element;

        //组件
        if (this.component) {
            this.container.removeChild(this.component.element);
        }
        //菜单事件
        this.componentRightMenuHandle = this.componentRightMenuElement.bind(this);

        this.component = component;
        this.component.element.id = this.component.scopeID;
        this.container.appendChild(this.component.element);

        this.enableEdit = false;

        EventEmitter.register(EventType.OVERALLFILTERCHANGE, this.overallFilterChange, this);
        EventEmitter.register(EventType.FILTERCHANGE, this.filterChange, this);
        EventEmitter.register(EventType.MERGEFILTERCHANGE, this.mergeFilterChange, this);
        EventEmitter.register(EventType.CHANGE_HEIGHT, this.changeHeight, this);
    }

    public set enableEdit(edit: Boolean) {
        this._enableEdit = edit;
        if (this._enableEdit) {
            this.container['style']['pointer-events'] = 'none';
            this.enableResize = true;
            this.enableDrag = true;
            this.enableSelect = true;
            this.enableDataChange = true;
            this.enableStyleChange = true;
            this.enableRightMenu = true;
        } else {
            this.container['style']['pointer-events'] = '';
            this.enableResize = false;
            this.enableDrag = false;
            this.enableSelect = false;
            this.enableDataChange = true;
            this.enableStyleChange = false;
            this.enableRightMenu = false;
        }
    }

    public get enableEdit(): Boolean {
        return this._enableEdit;
    }

    public set enableRightMenu(menu: Boolean) {
        if (menu) {
            this.element.addEventListener('contextmenu', this.componentRightMenuHandle, false);
        } else {
            this.element.removeEventListener('contextmenu', this.componentRightMenuHandle, false);
        }
    }

    private componentRightMenuElement(e: any) {
        e = e || window.event;
        e.preventDefault();
        e.stopPropagation();
        this.isSelect = true;
        let offsetPosition: any = Utils.offsetPosition(this.element.parentElement);

        ComponentRightMenu.getInstance().show(
            this.scopeID,
            {
                x: e.clientX - offsetPosition.left,
                y: e.clientY - offsetPosition.top
            });
    };

    public beforeShow(): void {
        this.component.beforeShow();
    }

    public afterShow(): void {
        this.component.afterShow();
    }

    public beforeDestory(): void {
        this.component.beforeDestory();
    }

    public afterDestory(): void {
        this.component.afterDestory();
    }

    public resize(): void {
        this.component.resize();
    }

    public loadData(): void {
        this.component.loadData();
        this.downloadConponentData();
    }

    public getconfiginformation(event: any, changeObj: any): void {
        if (changeObj.scopeID == this.scopeID) {
            this.component.getconfiginformation(event, changeObj);
        }
    }

    public overallFilterChange(event: any, changeObj: any): void {
        this.component.overallFilterChange(event, changeObj);
    }

    public dataChange(data: any): void {
        if (data.scopeID == this.scopeID) {
            this.dataError['style'].display = "none";
            this.component.dataChange(data.result);
        }
    }

    public styleChange(style: any): void {
        if (style.scopeID == this.scopeID) {
            this.dataError['style'].display = "none";
            this.componentTitleText(style.result);
            this.component.styleChange(style.result);
        }
    }

    public filterChange(event: any, filter: any): void {
        if (this.getFilterMethod == "old") {
            for (let item of filter.chartScopeId) {
                if (item == this.scopeID) {
                    this.mergeFilterDate(filter.result, this.component);
                    this.component.filterChange(event, filter.result)
                }
            }
        } else {
            if (filter.scopeID == this.scopeID) {
                if (filter.filterChange) {
                    this.component.filterChange(event, filter.result)
                } else {
                    this.mergeFilterDate(filter.result, this.component);
                    this.triggerMergeFilter(filter.stageFilter, this.component)
                }
            }
        }

    }

    private triggerMergeFilter(stageFilter: any, component: any) {
        if (stageFilter.length > 0) {
            for (let item of stageFilter) {
                if (item.topLevelFilter) {
                    EventEmitter.trigger(EventType.MERGEFILTERCHANGE, this.component);
                }
            }
        }
    }

    private downloadConponentData() {
        let $downloadHtml = this.container.querySelector('div[componentTitleDownload]'),
            _self = this;
        $($downloadHtml).click((event: any) => {
            _self.component.downloadData();
        })
    }

    public mergeFilterChange(event: any, target: any): void {
        for (let item of target.filterScopeIDObj.chartScopeID) {
            if (item == this.scopeID) {
                this.component.mergeFilterChange(event, target)
            }
        }
    }

    public changeHeight(event: any, data: any): void {

        let configStr = this.stage.stageData.backgroundImage;
        let configObj = JSON.parse(configStr);

        if (this.scopeID == data.scopeID) {
            if (data.result.op == "plus") {
                this.height += data.result.value;
            } else if (data.result.op == "minus") {
                this.height -= data.result.value;
            }
        } else if (configObj[this.scopeID] > configObj[data.scopeID]) {
            if (data.result.op == "plus") {
                this.y += data.result.value;
            } else if (data.result.op == "minus") {
                this.y -= data.result.value;
            }
        }
    }

    private mergeFilterDate(data: any, component: any) {
        for (let key in data) {
            switch (key) {
                case 'date':
                    component.mergeDateObj = data
                    break;
                case 'filter':
                    component.mergeFilterObj = data
                    break;
            }
        }
    }

    public componentTitleText(style: any) {
        for (let key in style) {
            switch (key) {
                case 'configure_style':
                    if (style[key] !== null && style[key] !== undefined) {
                        for (let item of style[key]) {
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
                            let $divHeight: any = this.container.querySelector('div[component]');
                            $divHeight['style'].height = 'calc(100% - 48px)';
                            this.componentHeightBoolean = true;
                        }
                    } else {
                        this.componentTitle.style.display = 'none';
                        if (this.componentHeightBoolean) {
                            let $divHeight: any = this.container.querySelector('div[component]');
                            $divHeight['style'].height = '100%';
                            this.componentHeightBoolean = false;
                        }
                    }
                    break;
                case 'title_name_titleValue':
                    if (style[key]) {
                        this.componentTitle.querySelector('[componentTitleText]').style.display = 'block';
                    } else {
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
                    } else {
                        this.componentTitle.querySelector('[componentTitleDownload]').style.display = 'none';
                    }
                    break;
                case 'chart_help_titleValue':
                    if (style[key]) {
                        this.componentTitle.querySelector('[componentTitleHelp]').style.display = 'block';
                    } else {
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
                    this.x = parseInt(style[key])
                    //}
                    break;
                case 'component_y':
                    // if(this.enableEdit){
                    this.y = parseInt(style[key])
                    // }
                    break;
            }
        }
        this.resize();
    }

    public set enableDrag(drag: Boolean) {
        this.drag(drag);
    }

    public set enableResize(resize: Boolean) {
        if (resize) {
            this.leftTopResize['style'].display = "block";
            this.leftCenterResize['style'].display = "block";
            this.topCenterResize['style'].display = "block";
            this.leftBottomResize['style'].display = "block";
            this.rightTopResize['style'].display = "block";
            this.rightCenterResize['style'].display = "block";
            this.bottomCenterResize['style'].display = "block";
            this.rightBottomResize['style'].display = "block";
        } else {
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
    }

    public set enableSelect(select: Boolean) {
        this.isSelect = false;
        if (select) {
            this.selectHandle = this.selectElement.bind(this);
            this.element.addEventListener('click', this.selectHandle, false);
        } else {
            this.selectHandle = null;
            this.element.removeEventListener('click', this.selectHandle, false);
        }
    }

    private selectElement(e: any) {
        if (this.selectHandle !== null) {
            e = e || window.event;
            e.preventDefault();
            e.stopPropagation();

            if (this.upFlag) {
                this.upFlag = false;
            } else {
                //触发事件
                EventEmitter.trigger(EventType.COMSELEECT, {
                    scopeID: this.scopeID
                });
            }
        }
    };

    public set enableDataChange(change: Boolean) {
        if (change) {
            EventEmitter.register(EventType.DATACHANGE, this.dataChangeHandle, this);
        }
    }

    public set enableStyleChange(change: Boolean) {
        if (change) {
            EventEmitter.register(EventType.STYLECHANGE, this.styleChangeHandle, this);
        }
    }

    private dataChangeHandle(e: any, data: any) {
        this.dataChange(data);
    }

    private styleChangeHandle(e: any, data: any) {
        this.styleChange(data);
    }

    public drag(drag: Boolean): void {
        this.dragPosition = {x: 0, y: 0};
        if (drag) {
            this.startDragHandle = this.startDragElement.bind(this);
            this.dragHandle = this.dragElement.bind(this);
            this.endDragHandle = this.endDragElement.bind(this);
            this.element.addEventListener('mousedown', this.startDragHandle, false);
            document.addEventListener('mouseup', this.endDragHandle, false);
        } else {
            this.element.removeEventListener('mousedown', this.startDragHandle, false);
            document.removeEventListener('mouseup', this.endDragHandle, false);
            this.startDragHandle = null;
            this.dragHandle = null;
            this.endDragHandle = null;
            this.dragPosition = null;
        }
    }

    private startDragElement(e: any) {
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

    private dragElement(e: any) {
        this.upFlag = true;
        e = e || window.event;
        e.preventDefault();
        e.stopPropagation();

        let l = e.clientX - this.dragPosition.x;
        let t = e.clientY - this.dragPosition.y;

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
        let dis_x = l - this.x;
        let dis_y = t - this.y;

        this.x = l;
        this.y = t;

        //触发事件
        EventEmitter.trigger(EventType.DRAGSELEECT, {
            scopeID: this.scopeID,
            disX: dis_x,
            disY: dis_y
        });

    }

    private endDragElement(e: any) {
        e.preventDefault();
        e.stopPropagation();
        document.removeEventListener('mousemove', this.dragHandle, false);
    }

    private dragResize(resize: Boolean): void {
        let startResizeElement = `startResize_${this.scopeID}`;
        let resizeElement = `resize_${this.scopeID}`;
        let startX = 0, startY = 0, endX = 0, endY = 0, historyWidth = 0, historyHeight = 0;
        let direction: String = null;
        window[startResizeElement] = (e: any) => {
            e = e || window.event;
            e.preventDefault();
            e.stopPropagation();
            direction = e.currentTarget.getAttribute("direction");
            // startX = e.layerX || e.offsetX;
            // startY = e.layerY || e.offsetY;
            startX = e.clientX;
            startY = e.clientY;
            historyWidth = this.width;
            historyHeight = this.height;
            document.addEventListener('mousemove', window[resizeElement]);
        };
        window[resizeElement] = (e: any) => {
            this.upFlag = true;
            e = e || window.event;
            e.preventDefault();
            e.stopPropagation();
            // endX = e.layerX || e.offsetX;
            // endY = e.layerY || e.offsetY;
            let offsetPosition: any = Utils.offsetPosition(this.element.parentElement);
            switch (direction) {

                case "left-top":
                    endX = e.clientX - offsetPosition.left;
                    endY = e.clientY - offsetPosition.top;
                    this.x = endX;
                    this.y = endY;
                    this.width = startX - endX + historyWidth;
                    this.height = startY - endY + historyHeight;
                    break;
                case "left-center":
                    endX = e.clientX - offsetPosition.left;
                    this.x = endX;
                    this.width = startX - endX + historyWidth;
                    break;
                case "top-center":
                    endY = e.clientY - offsetPosition.top;
                    this.y = endY;
                    this.height = startY - endY + historyHeight;
                    break;
                case "left-bottom":
                    endX = e.clientX - offsetPosition.left;
                    endY = e.clientY;
                    this.x = endX;
                    this.width = startX - endX + historyWidth;
                    this.height = endY - startY + historyHeight;
                    break;
                case "right-top":
                    endX = e.clientX;
                    endY = e.clientY - offsetPosition.top;
                    this.y = endY;
                    this.width = endX - startX + historyWidth;
                    this.height = startY - endY + historyHeight;
                    break;
                case "right-center":
                    endX = e.clientX;
                    this.width = endX - startX + historyWidth;
                    break;
                case "bottom-center":
                    endY = e.clientY;
                    this.height = endY - startY + historyHeight;
                    break;
                case "right-bottom":
                    endX = e.clientX;
                    endY = e.clientY;
                    this.width = endX - startX + historyWidth;
                    this.height = endY - startY + historyHeight;
                    break;
            }
        };
        document.addEventListener('mouseup', e => {
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
        } else {
            this.leftTopResize.removeEventListener('mousedown', window[startResizeElement]);
            this.leftCenterResize.removeEventListener('mousedown', window[startResizeElement]);
            this.topCenterResize.removeEventListener('mousedown', window[startResizeElement]);
            this.leftBottomResize.removeEventListener('mousedown', window[startResizeElement]);
            this.rightTopResize.removeEventListener('mousedown', window[startResizeElement]);
            this.rightCenterResize.removeEventListener('mousedown', window[startResizeElement]);
            this.bottomCenterResize.removeEventListener('mousedown', window[startResizeElement]);
            this.rightBottomResize.removeEventListener('mousedown', window[startResizeElement]);
        }
    }

}