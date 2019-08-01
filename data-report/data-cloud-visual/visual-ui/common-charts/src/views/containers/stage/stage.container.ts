/**
 * Created by wangshouyun on 2017/3/7.
 */
import {BaseContainer} from "../base/base.container";
import {StageTemplate} from "./stage.template";
import {SelectContainer} from "./select/select.container";
import {EventEmitter} from "../../../events/emitter.event";
import {Timer} from "../../../../public/scripts/timer";
import {EventType} from "../../../events/type.event";
import {CommonStyle} from "./common.style";
import {ComponentContainer} from "../component/component.container";
import {ComponentRightMenu} from "../component/menu/right.menu";
import {BaseComponentList} from "../../components/base.list";
import {Utils} from "../../../../public/scripts/utils";
import * as $ from 'jquery';

export class StageContainer extends BaseContainer {
    public static that: StageContainer;
    private children: BaseContainer[] = [];
    private isRelativeStage: Boolean = false;
    private timer: Timer;
    public historyWidth: number;
    private historyHeight: number;
    private controlKeyDownBind: any;
    private controlKeyUpBind: any;
    private isControlDown: Boolean = false;
    public messenger: any;
    public stageData: any;

    constructor(el: string) {
        super();

        StageContainer.that = this;

        let style = new CommonStyle();

        let template = new StageTemplate(this.scopeID);

        //模板渲染后获得当前节点
        this.element = this.render(template);

        //获得相对定位的容器
        this.container = this.element.querySelector('[containerSide]') as Element;

        //插入父级容器
        this.insertToElement(el);

        this.historyWidth = this.width;
        this.historyHeight = this.height;

        //添加组件右键菜单
        EventEmitter.register(EventType.COMRIGHTMENU, this.componentRightMenu, this);
        this.addChild(ComponentRightMenu.getInstance());
        this.element.addEventListener('contextmenu', (e: any) => {
            e = e || window.event;
            e.preventDefault();
            e.stopPropagation();
        });

        //组件选择事件
        EventEmitter.register(EventType.COMSELEECT, this.componentSelect, this);
        EventEmitter.register(EventType.DRAGSELEECT, this.dragSelectChart, this);
        EventEmitter.register(EventType.STAGECHANGE, this.stagechange, this);
        EventEmitter.register(EventType.ALIGN.action, this.actionAlignHandle, this);

        this.container.addEventListener('click', (e: any) => {
            this.componentSelect(e, {
                scopeID: ""
            });

        });

        //监听shift键
        if (this.controlKeyDownBind) {
            document.removeEventListener("keydown", this.controlKeyDownBind);
        }
        if (this.controlKeyDownBind) {
            document.removeEventListener("keyup", this.controlKeyUpBind);
        }
        this.controlKeyDownBind = this.controlKeyDown.bind(this);
        this.controlKeyUpBind = this.controlKeyUp.bind(this);

        document.addEventListener("keydown", this.controlKeyDownBind);
        document.addEventListener("keyup", this.controlKeyUpBind);

        //默认属性设置
        this.enableResize = true;
        this.enableScroll = true;
        this.enableDragCreateChart = true;

    }

    public rebindevent() {
        EventEmitter.register(EventType.COMRIGHTMENU, this.componentRightMenu, this);
        EventEmitter.register(EventType.COMSELEECT, this.componentSelect, this);
        EventEmitter.register(EventType.DRAGSELEECT, this.dragSelectChart, this);
        EventEmitter.register(EventType.STAGECHANGE, this.stagechange, this);
        EventEmitter.register(EventType.ALIGN.action, this.actionAlignHandle, this);
    }

    public messageHandler(eventName: any, message: any) {
        if (this.messenger) {
            this.messenger(message);
        }
    }

    //预览编辑模式切换
    public set preViewModel(bool: Boolean) {
        for (let item of this.allChildren) {
            item.enableEdit = !bool;
        }
    }

    public set historySize(size: any) {
        this.historyWidth = size.width;
        this.historyHeight = size.height;
    }

    private componentRightMenu(e: any, data: any): void {
        switch (data.menu) {
            case "delete":
                let deleteArr: Array<any> = [];
                for (let item of this.getSelectChild()) {
                    deleteArr.push(item.scopeID);
                    this.removeChild(item);
                }
                EventEmitter.trigger(EventType.COMDELETE, deleteArr);
                break;
            case "up_layer":
                for (let item of this.getSelectChild()) {
                    if (item.scopeID == data.scopeID && item.layer < 999) {
                        item.layer += 1;
                    }
                }
                break;
            case "down_layer":
                for (let item of this.getSelectChild()) {
                    if (item.scopeID == data.scopeID && item.layer > 0) {
                        item.layer -= 1;
                    }
                }
                break;
            case "top_layer":
                for (let item of this.getSelectChild()) {
                    if (item.scopeID == data.scopeID) {
                        item.layer = 999;
                    }
                }
                break;
            case "bottom_layer":
                for (let item of this.getSelectChild()) {
                    if (item.scopeID == data.scopeID) {
                        item.layer = 0;
                    }
                }
                break;
            case "align_left":
                EventEmitter.trigger(EventType.ALIGN.action, EventType.ALIGN.left);
                break;
            case "align_right":
                EventEmitter.trigger(EventType.ALIGN.action, EventType.ALIGN.right);
                break;
            case "align_top":
                EventEmitter.trigger(EventType.ALIGN.action, EventType.ALIGN.top);
                break;
            case "align_bottom":
                EventEmitter.trigger(EventType.ALIGN.action, EventType.ALIGN.bottom);
                break;
            case "align_center":
                EventEmitter.trigger(EventType.ALIGN.action, EventType.ALIGN.horiz_center);
                break;
            case "align_vertical":
                EventEmitter.trigger(EventType.ALIGN.action, EventType.ALIGN.vertical_center);
                break;
        }
    }

    private componentSelect(e: any, data: any): void {
        if (this.isControlDown) {
            let item = this.getContainerByScopeID(data.scopeID);
            if (item.isSelect) {
                item.isSelect = false;
            } else {
                item.isSelect = true;
            }
        } else {
            for (let item of this.allChildren) {
                if (item.scopeID == data.scopeID) {
                    item.isSelect = true;
                } else {
                    item.isSelect = false;
                }
            }
        }
        //触发事件
        let emitData: any[] = [];
        for (let selectChild of this.getSelectChild()) {
            emitData.push({
                type: selectChild.type,
                scopeID: selectChild.scopeID,
                viewName: selectChild.component.viewName
            })
        }

        EventEmitter.trigger(EventType.SELECTCHART, emitData);
    }

    private controlKeyDown(e: any): void {
        if (e.keyCode == 17) {
            this.isControlDown = true;
        }
    }

    private controlKeyUp(e: any): void {
        if (e.keyCode == 17) {
            this.isControlDown = false;
        }
    }

    public set enableDragCreateChart(create: Boolean) {
        let dropElement = `drop_${this.scopeID}`;
        let dragoverElement = `dragover_${this.scopeID}`;
        window[dragoverElement] = (e: any) => {
            e.preventDefault();
            for (let item of this.children) {
                item.addStyle('pointer-events', "none");
            }
        };
        window[dropElement] = (e: any) => {
            e.preventDefault();
            for (let item of this.children) {
                item.addStyle('pointer-events', "auto");
            }
            this.dragCreateHandle(e);
        };
        if (create) {
            this.element.addEventListener('dragover', window[dragoverElement]);
            this.element.addEventListener('drop', window[dropElement]);
        } else {
            this.element.removeEventListener('dragover', window[dragoverElement]);
            this.element.removeEventListener('drop', window[dropElement]);
        }
    }

    private dragCreateHandle(e: any): void {
        let x = e.layerX || e.offsetX;
        let y = e.layerY || e.offsetY;
        y += this.container.scrollTop;
        let chartType = e.dataTransfer.getData("chartType");
        if (chartType) {
            let component: any = BaseComponentList.getComponentByType(chartType);
            if (component) {
                let componentContainer: ComponentContainer = new ComponentContainer(this, component, component.scopeID);
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
                EventEmitter.trigger(EventType.COMSELEECT, {scopeID: componentContainer.scopeID});
            }
        }
    }

    public set enableScroll(scroll: Boolean) {

        this.timer = new Timer();
        let scrollHandle = (e: any) => {
            this.timer.startTimeOut(0.5, this.scrollHandle, this);
        };
        if (scroll) {
            this.container.addEventListener('scroll', scrollHandle)
        } else {
            this.timer = null;
            this.container.removeEventListener('scroll', scrollHandle);
        }
    }

    private scrollHandle(): void {
        if (this.timer) this.timer.stopTimeOut();
        for (let child of this.allChildren) {
            if (!child.hasLoad) {
                child.hasLoad = true;
                child.loadData();
            }

            // if (!child.hasLoad && child.y < this.height + this.container.scrollTop) {
            //
            // }
        }
    }

    //舞台缩放
    public set enableResize(resize: Boolean) {
        let resizeElement = `resize_${this.scopeID}`;
        window[resizeElement] = (e: any) => {
            this.timer.startTimeOut(0.5, this.resizeHandle, this);
        };
        if (resize) {
            window.addEventListener('resize', window[resizeElement], false)
        } else {
            this.timer = null;
            window.removeEventListener('resize', window[resizeElement], false);
        }
    }

    private actionAlignHandle(e: any, direction: any) {
        let selectChild = this.getSelectChild();
        if (selectChild.length == 1) {
            this.isRelativeStage = true;
        } else {
            this.isRelativeStage = false;
        }
        switch (direction) {
            case EventType.ALIGN.left:
                if (this.isRelativeStage) {
                    for (let child of selectChild) {
                        child.x = 0;
                    }
                } else {
                    let container = this.getPointContainer(selectChild, 'min_x');
                    for (let child of selectChild) {
                        if (child !== container) {
                            child.x = container.x;
                        }
                    }
                }
                break;
            case EventType.ALIGN.right:
                if (this.isRelativeStage) {
                    for (let child of selectChild) {
                        child.x = this.width - child.width;
                    }
                } else {
                    let container = this.getPointContainer(selectChild, 'max_x');
                    for (let child of selectChild) {
                        if (child !== container) {
                            child.x = container.x + container.width - child.width;
                        }
                    }
                }
                break;
            case EventType.ALIGN.top:
                if (this.isRelativeStage) {
                    for (let child of selectChild) {
                        child.y = 0;
                    }
                } else {
                    let container = this.getPointContainer(selectChild, 'min_y');
                    for (let child of selectChild) {
                        if (child !== container) {
                            child.y = container.y;
                        }
                    }
                }
                break;
            case EventType.ALIGN.bottom:
                if (this.isRelativeStage) {
                    for (let child of selectChild) {
                        child.y = this.height - child.height;
                    }
                } else {
                    let container = this.getPointContainer(selectChild, 'max_y');
                    for (let child of selectChild) {
                        if (child !== container) {
                            child.y = container.y + container.height - child.height;
                        }
                    }
                }
                break;
            case EventType.ALIGN.vertical_center:
                if (this.isRelativeStage) {
                    for (let child of selectChild) {
                        child.y = (this.height - child.height) / 2;
                    }
                } else {
                    let container = this.getPointContainer(selectChild, 'min_y');
                    for (let child of selectChild) {
                        if (child !== container) {
                            child.y = container.y + (container.height - child.height) / 2;
                        }
                    }
                }
                break;
            case EventType.ALIGN.horiz_center:
                if (this.isRelativeStage) {
                    for (let child of selectChild) {
                        child.x = (this.width - child.width) / 2;
                    }
                } else {
                    let container = this.getPointContainer(selectChild, 'min_x');
                    for (let child of selectChild) {
                        if (child !== container) {
                            child.x = container.x + (container.width - child.width) / 2;
                        }
                    }
                }
                break;
            case EventType.ALIGN.vertical_gap:
                if (this.isRelativeStage) {
                    for (let child of selectChild) {
                        child.y = this.height - child.height;
                    }
                } else {

                }
                break;
            case EventType.ALIGN.horiz_gap:
                let sortSelectChild = this.getSortSelectChild(selectChild, "y");
                if (this.isRelativeStage) {
                    for (let child of sortSelectChild) {
                        child.y = this.height - child.height;
                    }
                } else {
                    if (sortSelectChild.length > 2) {
                        let first: BaseContainer = sortSelectChild[0];
                        let last: BaseContainer = sortSelectChild[sortSelectChild.length - 1];
                        let dis = last.x - first.maxX;
                        let countWidth = 0;
                        for (let i = 1; i < sortSelectChild.length - 1; i++) {
                            countWidth += sortSelectChild[i].width;
                        }
                        if (dis < countWidth) {
                            for (let m = 1; m < sortSelectChild.length - 1; m++) {
                                sortSelectChild[m].x = first.maxX + dis / 2 - sortSelectChild[m].width / 2;
                            }
                        } else {

                        }
                    }

                }
                break;
        }
    }

    //重置舞台
    private resizeHandle(): void {

        let scaleValue: any = (this.width / this.historyWidth).toFixed(2);

        for (let component of this.stageData.components) {
            let chartStyle: any = component.chart.style;

            if (chartStyle.data && chartStyle.data["component_width"]) {
                chartStyle.data["component_width"] = parseInt(chartStyle.data["component_width"]) * scaleValue;
            }
            if (chartStyle.data && chartStyle.data["component_x"]) {
                chartStyle.data["component_x"] = parseInt(chartStyle.data["component_x"]) * scaleValue;
            }
        }
        this.historyWidth = this.width;

        let all = this.children as any;
        for (let i = 0; i < all.length; i++) {
            let child = all[i];
            setTimeout(() => {
                EventEmitter.trigger(EventType.STYLECHANGE,
                    {
                        scopeID: child.component._scopeID,
                        result: child.chartStyle.data
                    });
            }, 200);
        }
    }

    private getSortSelectChild(childlist: BaseContainer[], sortKey: String): BaseContainer[] {
        ct:for (let index = 0; index < childlist.length - 1; index++) {
            let first = childlist[index];
            let second = childlist[index + 1];
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
    }

    private getPointContainer(containerlist: BaseContainer[], type: String): BaseContainer {
        let container = containerlist[0];
        for (let item of containerlist) {
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
    }

    private select(select: Boolean) {
        let selectStart = `selectStart_${this.scopeID}`;
        let selecting = `selecting_${this.scopeID}`;
        let selectEnd = `selectEnd_${this.scopeID}`;
        if (select) {
            let selectContainer: SelectContainer = null;
            let startX = 0, startY = 0;
            window[selectStart] = (e: any) => {
                e = e || window.event;
                // e.preventDefault();
                e.stopPropagation();
                if (e.target.getAttribute("container") != this.scopeID) {
                    return;
                }
                let offsetPosition: any = Utils.offsetPosition(this.element);
                startX = e.clientX - offsetPosition.left;
                startY = e.clientY - offsetPosition.top;
                selectContainer = new SelectContainer();
                this.addChild(selectContainer);
                selectContainer.x = startX;
                selectContainer.y = startY;
                document.addEventListener("mouseup", window[selectEnd]);
                document.addEventListener("mousemove", window[selecting]);
            };
            window[selecting] = (e: any) => {
                e = e || window.event;
                // e.preventDefault();
                e.stopPropagation();
                let offsetPosition: any = Utils.offsetPosition(this.element);
                let endX = e.clientX - offsetPosition.left;
                let endY = e.clientY - offsetPosition.top;
                let disX = endX - startX;
                let disY = endY - startY;
                if (disX > 5 && disY > 5) {
                    return;
                }

                //左上
                if (disX > 0 && disY > 0) {
                    selectContainer.x = startX;
                    selectContainer.y = startY;
                    selectContainer.width = endX - startX;
                    selectContainer.height = endY - startY;
                }
                //左下
                if (disX > 0 && disY < 0) {
                    selectContainer.x = startX;
                    selectContainer.y = endY;
                    selectContainer.width = endX - startX;
                    selectContainer.height = startY - endY;
                }
                //右下
                if (disX < 0 && disY < 0) {
                    selectContainer.x = endX;
                    selectContainer.y = endY;
                    selectContainer.width = startX - endX;
                    selectContainer.height = startY - endY;
                }
                //右上
                if (disX < 0 && disY > 0) {
                    selectContainer.x = endX;
                    selectContainer.y = startY;
                    selectContainer.width = startX - endX;
                    selectContainer.height = endY - startY;
                }

                this.selectChild(selectContainer);
            };
            window[selectEnd] = (e: any) => {
                e = e || window.event;
                // e.preventDefault();
                e.stopPropagation();
                if (selectContainer) {
                    this.removeChild(selectContainer);
                }
                document.removeEventListener("mouseup", window[selectEnd]);
                document.removeEventListener("mousemove", window[selecting]);
            };
            this.element.addEventListener("mousedown", window[selectStart]);
        } else {
            this.element.removeEventListener("mousedown", window[selectStart]);
            document.removeEventListener("mouseup", window[selectEnd]);
            document.removeEventListener("mousemove", window[selecting]);
        }
    }

    private selectChild(selectContainer: SelectContainer): void {
        let selectContainerRange = {
            minPoint: {x: selectContainer.x, y: selectContainer.y},
            maxPoint: {x: selectContainer.x + selectContainer.width, y: selectContainer.y + selectContainer.height}
        };
        for (let container of this.children) {
            let leftTopPoint = {
                x: container.x,
                y: container.y
            };
            let leftBottomPoint = {
                x: container.x,
                y: container.y + container.height
            };
            let rightTopPoint = {
                x: container.x + container.width,
                y: container.y
            };
            let rightBottomPoint = {
                x: container.x + container.width,
                y: container.y + container.height
            };
            if (this.isInRange(selectContainerRange, leftTopPoint)
                || this.isInRange(selectContainerRange, leftBottomPoint)
                || this.isInRange(selectContainerRange, rightTopPoint)
                || this.isInRange(selectContainerRange, rightBottomPoint)) {
                container.isSelect = true;
            } else {
                container.isSelect = false;
            }
        }
        //触发事件
        let emitData: any[] = [];
        for (let selectChild of this.getSelectChild()) {
            emitData.push({
                type: selectChild.type,
                scopeID: selectChild.scopeID
            })
        }
        EventEmitter.trigger(EventType.SELECTCHART, emitData);
    }

    private isInRange(range: any, point: any): Boolean {
        if ((point.x > range.minPoint.x && point.y > range.minPoint.y)
            && (point.x < range.maxPoint.x && point.y < range.maxPoint.y)) {
            return true;
        }
        return false;
    }

    public selectChart: Array<any> = [];

    public getSelectChild(): BaseContainer[] {
        let selectArr: any[] = [];
        for (let container of this.children) {
            if (container.isSelect) {
                selectArr.push(container);
            }
        }
        this.selectChart = selectArr;
        return selectArr;
    }

    public addChild(container: BaseContainer): void {
        container.beforeShow();
        this.container.appendChild(container.element);
        if (!(container instanceof SelectContainer) && !(container instanceof ComponentRightMenu)) {
            this.children.push(container);
        }
        container.parent = this;
        container.afterShow();
    }

    public get allChildren(): any {
        return this.children;
    }

    public removeChild(container: BaseContainer): void {
        container.beforeDestory();
        this.container.removeChild(container.element);
        for (let index = 0; index < this.children.length; index++) {
            if (this.children[index].scopeID == container.scopeID) {
                this.children.splice(index--, 1);
                break;
            }
        }
        container.afterDestory();
    }

    public removeAllChild(): void {
        while (this.children.length > 0) {
            this.removeChild(this.children[0]);
        }
    }

    public getContainerByScopeID(id: string) {
        for (let item of this.allChildren) {
            if (item.scopeID == id) {
                return item;
            }
        }
        return null;
    }

    public refresh(): void {
        //this.resizeHandle();
        this.scrollHandle();
    }

    public dragSelectChart(e: any, data: any): void {
        for (let item of this.getSelectChild()) {
            if (item.scopeID != data.scopeID) {
                item.x += data.disX;
                item.y += data.disY;
            }
        }
    }

    private sizeFormat: any;

    public stagechange(e: any, data: any): void {
        // this.sizeFormat = data.size;
        // this.addStyle('margin','20px auto');
        // this.addStyle('width',data['width'] + 'px');
        // this.addStyle('height',data['height'] + 'px');
    }

}