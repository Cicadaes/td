import { Component, SdkComponent } from '../views/component';
import { ComponentEvent } from "../communication/communication.type";
import { Container } from "./../views/container";
import { Scope } from "./../utils/scope";
import { Timer } from './../utils/timer';
import { ViewType } from '../base/base.view';
import { View } from '../views/view';
import { ContainerComponent } from './container.component';
import { DataStore } from '../stores/data.store';
import { EventType, AlignType } from '../communication/communication.type';
import { EventEmitter } from '../events/emitter.event';
import { Utils } from '../utils/utils';
import { bg } from './stage.bg';
import { PreviewMode } from '../views/preview.mode';
import { StageLayoutContainer } from '../layouts/stage.layout.container';
// import { loadingBg } from './loading.bg';

@SdkComponent({
    template: `<div stageContainer>
                <div container class="container">
                </div>
                <div class="loading">
                    <div class="ant-spin ant-spin-spinning">
                        <span class="ant-spin-dot"><i></i><i></i><i></i><i></i></span>
                        <div class="ant-spin-text"></div>
                    </div>
                </div>
            </div>`,
    style: `
            [stageContainer]{
                width:100%;
                height:100%;
                position:relative;
            }

            [stageContainer] > .loading{
                width:20px;
                height:25px;
                left:50%;
                top:50%;
                display:none;
                transform:translate(-50%,-50%);
                position:absolute;
                background:transparent;
            }
            
            [stageContainer] > .loading .ant-spin {
                color: #108ee9;
                vertical-align: middle;
                text-align: center;
                opacity: 0;
                position: absolute;
                transition: -webkit-transform .3s cubic-bezier(.78,.14,.15,.86);
                transition: transform .3s cubic-bezier(.78,.14,.15,.86);
                transition: transform .3s cubic-bezier(.78,.14,.15,.86),-webkit-transform .3s cubic-bezier(.78,.14,.15,.86);
                font-size: 12px;
                display: none;
            }
            [stageContainer] > .loading .ant-spin-spinning {
                opacity: 1;
                position: static;
                display: inline-block;
            }
            [stageContainer] > .loading .ant-spin-dot {
                position: relative;
                display: inline-block;
                width: 20px;
                height: 20px;
                transform: rotate(45deg);
                animation: antRotate 1.2s infinite linear;
            }
            [stageContainer] > .loading .ant-spin-dot i {
                width: 9px;
                height: 9px;
                border-radius: 100%;
                background-color: #108ee9;
                transforms: scale(.75);
                display: block;
                position: absolute;
                opacity: .3;
                animation: antSpinMove 1s infinite linear alternate;
                transform-origin: 50% 50%;
            }
            [stageContainer] > .loading .ant-spin-dot i:first-child {
                left: 0;
                top: 0;
            }
            [stageContainer] > .loading .ant-spin-dot i:nth-child(2) {
                right: 0;
                top: 0;
                animation-delay: .4s;
            }
            [stageContainer] > .loading .ant-spin-dot i:nth-child(3) {
                right: 0;
                bottom: 0;
                animation-delay: .8s;
            }
            [stageContainer] > .loading .ant-spin-dot i:nth-child(4) {
                left: 0;
                bottom: 0;
                animation-delay: 1.2s;
            }

            [stageContainer] > .container{
                width:100%;
                height:100%;
                position:relative;
                background-color:#f0f2f5;
                overflow-x:auto;
                overflow-y:auto;
                background-size: 10px 10px;
                background-position: 1px 1px;
                display:flex;
                flex-direction:column;
                align-items:flex-start;
                flex-grow: 1;
            }
           
            `
})
export class StageComponent extends Component {
    private _timer: Timer = null;
    private stopRightClickEventBind: any = null;

    private clickBind: EventListenerObject;

    private comResizeBind: any;

    private loadingElement: HTMLElement;

    private loadingCount = 0;

    constructor() {
        super();

        // 改变 this 指针
        this.stopRightClickEventBind = this.stopRightClickEvent.bind(this);
        this.clickBind = this.clickHandle.bind(this);
        this.comResizeBind = this.comResizeHandle.bind(this);

        // 设置容器
        this.container = new StageLayoutContainer(this.el.querySelector('.container'));

    }

    onCreate(): void {

        // loading
        this.loadingElement = this.el.querySelector('.loading') as HTMLElement;

        // 监听数据和样式改变
        EventEmitter.register(EventType.DATACHANGE, this.dataChange, this);
        EventEmitter.register(EventType.STYLECHANGE, this.styleChange, this);

        //监听点击舞台
        this.el.addEventListener('click', this.clickBind);

        //监听组件选中事件
        EventEmitter.register(ComponentEvent.COMSELECT, this.componentSelectHandle, this);

        // 监听页面重新渲染
        EventEmitter.register(EventType.REFRESHSTAGE, this.refreshStage, this);

        //监听过滤器改变事件
        EventEmitter.register(ComponentEvent.FILTERCHANGE, this.filterChange, this);

        //监听图表内部过滤器改变事件
        EventEmitter.register(ComponentEvent.CHARTFILTERCHANGE, this.chartFilterChange, this);

        //监听resize事件
        EventEmitter.register(ComponentEvent.COMRESIZE, this.comResizeBind, this);
    }

    /**
   * 点击舞台
   * @param e 
   */
    clickHandle(e: any) {
        e.preventDefault();
        e.stopPropagation();
        EventEmitter.trigger(ComponentEvent.STAGECLICK);
        this.componentSelectHandle(e, null);
    }

    //组件选中
    private componentSelectHandle(e: any, data: any) {
        if (data) {
            let childComponents = this.container.allChildren;
            for (let i = 0; i < childComponents.length; i++) {
                let childComponent = childComponents[i];
                if (childComponent['scope'] !== data.scope) {
                    childComponent['selectStatus'] = false;
                }
            }
        } else {
            let childComponents = this.container.allChildren;
            for (let i = 0; i < childComponents.length; i++) {
                let childComponent = childComponents[i];
                childComponent['selectStatus'] = false;
            }
        }
    }

    /**
     * 重置舞台
     */
    comResizeHandle() {
        let childComponents = this.container.allChildren;
        for (let i = 0; i < childComponents.length; i++) {
            let component: ContainerComponent = childComponents[i] as ContainerComponent;
            component.onSizeChange();
        }
    }

    /**
     * 设置舞台预览和编辑模式
     */
    public previewMode() {
        let childComponents = this.container.allChildren;
        for (let i = 0; i < childComponents.length; i++) {
            let component: ContainerComponent = childComponents[i] as ContainerComponent;
            component.previewMode();
            setTimeout(() => {
                component.onSizeChange();
            }, 200);

        }
        (this.container as StageLayoutContainer).previewMode();

        if (!PreviewMode.getPreviewMode()) {
            this.stageAddListenerEvent();
            this.componentISChange = false;
            this.unDatachange = false;

        } else {
            this.stageRemoveListenerEvent();
            this.container.el.style.backgroundImage = 'none';
            EventEmitter.trigger(ComponentEvent.STAGECLICK);
        }

        //切换预览模式时刷新舞台组件
        if (this.container.children.length > 0) {
            this.allFilterDataChange();
        }
    }

    private componentISChange: boolean = false;//是否组件内部触发
    private unDatachange: boolean = false;//是否需要出发datachange
    /**
     * 过滤器改变事件
     * @param message 
     */
    private filterChange(e: any, message: { scope: string, unDatachange: boolean }) {
        this.componentISChange = false;
        this.unDatachange = message.unDatachange;
        this.targetScope = null;
        this.updateComponent(message);
    }

    private targetScope: any = null;//触发的组件scope
    /**
     * 图表内部触发过滤器事件
     * @param e 
     * @param message 
     */
    chartFilterChange(e: any, message: { scope: string }) {
        this.componentISChange = true;
        this.unDatachange = false;
        this.targetScope = message.scope;
        this.updateComponent(message);
    }

    /**
     * 更新组件数据
     * @param message 
     */
    updateComponent(message: { scope: string }) {
        if (PreviewMode.getPreviewMode() && message) {

            //容器内过滤器
            let targetContainer = (this.container as StageLayoutContainer).getTargetContainer(message.scope);

            console.log('targetContainer', targetContainer)
            //获取全局过滤器
            let filterData:any = [];
            if (!(targetContainer instanceof StageComponent)) {
                filterData = this.getFilterData({ scope: (targetContainer && targetContainer.scope) });
            }

            if (targetContainer) {
                this.groupComponentDataChange(targetContainer.container, filterData);
            }
        }

    }
    getFilterData(message: { scope: string }) {
        let component = DataStore.getComponentInstance(message.scope);
        let filterData: any = [];
        if (component && component instanceof StageComponent) {
            filterData = (this.container as StageLayoutContainer).getTopFilterData();
        } else {
            let parentLayout = component && component.container.getParent(component.el);
            filterData = parentLayout ? (this.container as StageLayoutContainer).getTopFilterData() : [];
            while (parentLayout && !(parentLayout instanceof StageComponent)) {
                let currentFilterData = (this.container as StageLayoutContainer).getTopFilterData(parentLayout.container);
                filterData = filterData.concat(currentFilterData);
                parentLayout = (this.container as StageLayoutContainer).getParent(parentLayout.el);
            }
        }
        return filterData
    }

    /**
     * 全局过滤器改变
    */
    allFilterDataChange() {
        this.targetScope = null;
        //获取全局过滤器数据
        let stageManager = (this.container as StageLayoutContainer).getGroupManagerByPage();
        let data = (this.container as StageLayoutContainer).getTopFilterData();
        for (let child of stageManager) {
            let component = DataStore.getComponentInstance(child.cuuid);
            if (component && component['pattern'] !== 'chart') {

                this.groupComponentDataChange(component.container, data);

            } else {
                if (component['pattern'] == 'chart') {
                    this.postFilterData(data, component);
                }
            }
        }
    }

    /**
     * 组件驱动数据面板请求
     * @param filterData 过滤器数据
     * @param component 组件
     */
    postFilterData(filterData: any, component: any, type?: any) {
        if (component.tempData) {
            filterData = filterData.concat([component.tempData]);
        }
        if (PreviewMode.getPreviewMode() && !this.componentISChange) {
            EventEmitter.trigger(EventType.VISUALAREAINIT, {
                scope: component.scope,
                componentFilter: filterData,
            })
            console.log(component.scope, filterData)
        } else if (PreviewMode.getPreviewMode() && this.componentISChange) {
            if (this.targetScope && this.targetScope == component.scope) {
                EventEmitter.trigger(EventType.CHARTUPDATE, {
                    scope: component.scope,
                    componentFilter: filterData,
                })
                console.log(component.scope, filterData)
            }

        } else {
            EventEmitter.trigger(EventType.VISUALAREAINIT, {
                scope: component.scope
            })
            console.log(component.scope, filterData)
        }
    }

    /**容器内组件响应过滤器改变
     * @param container 容器
     * @param filterData 过滤器数据
     * @param isGroup 是否组合
     */
    private groupComponentDataChange(container: any, filterData: any) {
        let data: any[] = [];

        //获取当前容器内的顶级过滤器数据
        let currentFilterData = (this.container as StageLayoutContainer).getTopFilterData(container);

        //合并过滤器数据
        data = (data.concat(filterData)).concat(currentFilterData);

        if (container && container.children) {
            for (let component of container.children) {
                if (component && component.pattern == 'chart') {
                    this.postFilterData(data, component);
                } else {
                    this.groupComponentDataChange(component.container, data);
                }
            }
        }
    }

    public changePage(page: number) {
        this.unDatachange = false;
        (this.container as StageLayoutContainer).changePage(page);
    }

    public removePage(removePage: number, changePage?: number) {
        this.unDatachange = false;
        (this.container as StageLayoutContainer).removePage(removePage, changePage);
    }

    public changePageName(page: any) {
        (this.container as StageLayoutContainer).changePageName(page);
    }

    /**
     * 添加舞台事件
     */
    private stageAddListenerEvent() {
        // 阻止舞台右键
        this.container.el.addEventListener('contextmenu', this.stopRightClickEventBind, false);
    }

    /**
     * 移除舞台事件
     */
    private stageRemoveListenerEvent() {
        // 阻止舞台右键
        this.container.el.removeEventListener('contextmenu', this.stopRightClickEventBind, false);
    }

    //阻止舞台右键事件
    private stopRightClickEvent(e: any) {
        e.preventDefault();
        e.stopPropagation();
    }

    /**
     * 
     * @param e 事件名称
     * @param message 传入的数据对象，包括一个scope和一个data
     */
    private dataChange(e: any, message: { scope: string, data: any }) {
        // 如果全部加载完成，隐藏loading图标
        this.loadingCount--;
        if (this.loadingCount <= 0) {
            this.loadingElement.style.display = '';
        }
        let component: ContainerComponent = DataStore.getComponentInstance(message.scope) as ContainerComponent;
        if (component && !this.unDatachange) {
            component.onDataChange(message.scope, message.data);
        }
    }

    /**
     * 
     * @param e 事件名称
     * @param message 传入的数据对象，包括一个scope和一个data
     */
    private styleChange(e: any, message: { scope: string, data: any }) {
        let component: ContainerComponent = DataStore.getComponentInstance(message.scope) as ContainerComponent;
        if (component) {
            component.onStyleChange(message.scope, message.data);
        }
    }

    /**
     * 刷新舞台
     */
    public refreshStage() {
        if (!this._timer) {
            this._timer = new Timer();
        }
        this._timer.startTimeOut(0.3, this.visualAreaHandle, this);
    }

    // 组件到达可视区执行懒加载
    private visualAreaHandle(): void {
        this.loadingCount == 0;
        if (this._timer) this._timer.stopTimeOut();
        for (let child of this.container.allChildren) {
            let component: Component = child as Component;
            if (component.type === ViewType.component && !component.isLoad) {
                // 统计要loading的数据
                if (component.styleAndData) this.loadingCount++;
                if (this.loadingElement.style.display === '' && PreviewMode.getPreviewMode()) {
                    this.loadingElement.style.display = 'block';
                }

                //当前容器
                let targetContainer = (this.container as StageLayoutContainer).getTargetContainer(component.scope);

                //获取当前容器外的过滤器
                let filterData: any = this.getFilterData({ scope: targetContainer.scope });

                //获取当前容器内过滤器
                let currentFilterData: any = [];
                if (!(targetContainer instanceof StageComponent)) {
                    currentFilterData = (this.container as StageLayoutContainer).getTopFilterData(targetContainer.container);
                }

                let componentFilter = filterData.concat(currentFilterData);
                if(PreviewMode.getPreviewMode()){
                    component.onVisualArea(component.scope, componentFilter);
                }else{
                    component.onVisualArea(component.scope);
                }
                

            }

        }
    }


    onDestroy(): void {
        this.container.onDestroy();
        EventEmitter.unRegister(EventType.DATACHANGE, this.dataChange, this);
        EventEmitter.unRegister(EventType.STYLECHANGE, this.styleChange, this);
        EventEmitter.unRegister(EventType.REFRESHSTAGE, this.refreshStage, this);
        EventEmitter.unRegister(ComponentEvent.FILTERCHANGE, this.filterChange, this);
        EventEmitter.unRegister(ComponentEvent.CHARTFILTERCHANGE, this.chartFilterChange, this);
        EventEmitter.unRegister(ComponentEvent.COMRESIZE, this.comResizeBind, this);
    }
}