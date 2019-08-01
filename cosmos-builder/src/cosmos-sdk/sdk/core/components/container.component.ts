import { Component, SdkComponent } from '../views/component';
import { ComponentEvent } from "./../communication/communication.type";
import { ComponentContainer } from "../views/component.container";
import { Utils } from "../utils/utils";
import { DataStore } from '../stores/data.store';
import { Container } from '../views/container';
import { EventEmitter } from '../events/emitter.event';
import { PreviewMode } from '../views/preview.mode';
import { EventType } from '../communication/communication.type';
import { loadingBg } from './loading.bg';
import { noDataBg } from './nodata.bg';
import { DomEvent } from '../events/dom.event';
import { LayoutComponent } from '../components/layout.component';
import { ViewType } from '../base/base.view';

@SdkComponent({
    template: `<div component-container class="component-layout cm-dragdrop-handle cm-dragdrop">
                    <div select-border>
                        <div tips>
                                <div tips-text>
                                </div>
                        </div>
                        <div container></div>
                    </div>
                </div>`,
    style: `
            .component-layout{
                position:relative;  
                width: 100%;
                height:auto;
            }
            .component-layout [container]
            {
                overflow:hidden;
            } 
            .component-layout [ select-border]
            {
                width:100%;
                height:100%;
                border-width: 2px;
                border-style: dashed;
                position:relative;
                background:#fff;
            } 
            .component-layout [tips]{
                color: #203158;
                font-size: 12px;
                display:none;
                overflow:hidden;
                height: 100%;
                width:100%;
                background: none;
                justify-content: center;
                align-items: center;
            }
            .component-layout [tips] [tips-text]{
                width: auto;
                height: auto;
                background-repeat: no-repeat;
                background-position: center;
                font-size: 14px;
                line-height:22px;
                font-family: PingFangSC-Regular;
                color: rgba(23,35,61,0.55);
            }
            .component-layout [container]{
                height: 100%;
                width:100%;
                position: relative;
                background: none;
                display:none;
            }
            .component-layout .no-data{
                display: block;
                width:64px;
                height:64px;
                background-repeat: no-repeat;
                background-position: center;
                background-image:url(data:image/svg+xml;base64,${noDataBg});
            }
            .component-layout [tips] [tips-text] span{
                display: block;
                width: 64px;
                text-align: center;
            }
            .component-layout [tips] .no-data-box{
                padding: 24px 0 20px 0;
            }
            `
})
export class ContainerComponent extends LayoutComponent {
    public static type: string = ViewType.component;
    private selectBorder: HTMLElement;
    private tips: HTMLElement;
    public isDrag:boolean = true;
    private clickHandleBind: EventListenerObject;
    private comFilterChangeBind: any;
    private noDataHtml:any = '<div class="no-data-box"><span class="no-data"></span><span>暂无数据</span> </div>';
    private toggleBind:any;

    constructor(ComponentClass: typeof Component, scope?: string, isDragInit?: boolean) {
        super(scope);

        // 组件类型
        this.type = ViewType.component;

        // 获取组件类型
        this.name = this.getComponenyType(ComponentClass);

        //阻止 click 默认和冒泡
        this.clickHandleBind = this.clickHandle.bind(this);
        this.el.addEventListener('click', this.clickHandleBind);

        // 选择边框
        this.selectBorder = this.el.querySelector('[select-border]') as HTMLElement;

        //错误面板
        this.tips = this.el.querySelector('[tips]') as HTMLElement;

        //过滤器组件改变 handle
        this.comFilterChangeBind = this.comFilterChange.bind(this);

        //监听组件内过滤器改变事件
        DomEvent.addEvent(this.el, ComponentEvent.COMFILTERCHANGE, this.comFilterChangeBind, false)

         //监听组件显示隐藏事件
         this.toggleBind = this.toggleHandleBind.bind(this);
         DomEvent.addEvent(this.el, ComponentEvent.TOGGLECOMPONENT, this.toggleBind, false);

        //容器内创建组件
        let com = new ComponentClass();
        this.styleAndData = com.styleAndData;
        this.container = new ComponentContainer(this.el.querySelector('[container]'), com);

        
    }

    public onCreate(): void {
        this.previewMode();
        if(this.isDrag) {
            this.container.el.style.display = 'flex';
            this.selectBorder.style.background = 'none';
        }
    }

    private toggleHandleBind(e:any){
        e.stopPropagation();
        if(e.data){
            if(e.data.show){
                this.el.style.display = "block";
            }else{
                this.el.style.display = "none";
            }
            
        }
    }
    
    private clickHandle(e: any) {
        e.stopPropagation();
        if (!PreviewMode.getPreviewMode()) {
            this.selectHandle(e);
        }

    }
    private comFilterChange(e: any) {
        e.stopPropagation();
        this.tempData = e.data.data;
        if (e.data.bubble) {
            if (e.data.componentIsChange) {
                EventEmitter.trigger(ComponentEvent.CHARTFILTERCHANGE, { scope: this.scope, unDatachange: e.data.download})
            } else {
                EventEmitter.trigger(ComponentEvent.FILTERCHANGE, { scope: this.scope, unDatachange: e.data.download })
            }

        }
    }

    /**
     * 设置预览和编辑模式
     */
    public previewMode() {
        this.selectStatus = false;
        this.enableSelect = !PreviewMode.getPreviewMode();
        if (PreviewMode.getPreviewMode()) {
            this.container.el.style.pointerEvents = 'auto';
            this.selectBorder.style.border = "none";
        } else {
            if (!this.enableEdit) {
                this.container.el.style.pointerEvents = 'none';
            }
            this.selectBorder.style.border = "2px dashed #ddd";
        }
    }

    public set enableSelect(enableSelect: boolean) {
        this._enableSelect = enableSelect;
        if (this._enableSelect) {
            this.el.addEventListener('click', this.clickHandleBind);
        } else {
            this.el.removeEventListener('click', this.clickHandleBind);
        }
    }

    /**
     * 选中组件
     */
    public selectHandle(e: any) {
        e.preventDefault();
        e.stopPropagation();
        this.selectStatus = !this.selectStatus;
    }

    public set selectStatus(selectStatus: boolean) {
        this.setSelectStatus(selectStatus);
    }

    public get selectStatus(): boolean {
        return this._selectStatus;
    }

    public setSelectStatus(selectStatus: boolean, isDragMove: boolean = false) {
        this._selectStatus = selectStatus;
        if (!isDragMove) {
            if (this._selectStatus) {
                this.setSelectStyle();
            } else {
                this.setDefaultStyle();
            }
        } else {
            if (this._selectStatus) {
                this.setSelectStyle();
            }
        }
        if (this._selectStatus) {
            EventEmitter.trigger(ComponentEvent.COMSELECT, {
                type: this.name, scope: this.scope
            });
        } else {
            EventEmitter.trigger(ComponentEvent.STAGECLICK);
        }
    }

    public setSelectStyle() {
        this.el.style.border = '2px dashed #2a6cF0';
    }

    public setDefaultStyle() {
        this.el.style.border = 'none';
    }

    public onDestroy(): void {
        let component = (this.container as ComponentContainer).component;
        component && component.onDestroy();
        
        this.el.removeEventListener('click', this.clickHandleBind);
        DomEvent.removeEvent(this.el, ComponentEvent.COMFILTERCHANGE, this.comFilterChangeBind, false)
    }

    /**
     * 数据面板改变时会触发
     * @param data 右侧面板设置的数据和后端返回的数据
     */
    public onDataChange(scope: string, data: any) {
        //清除loading
        (this.tips.querySelector('[tips-text]') as HTMLElement).style.background = 'none';

        if (PreviewMode.getPreviewMode()) {
            this.selectBorder.style.border = "none";
        }

        let component = (this.container as ComponentContainer).component;
        if (data.code == 200 && data.data) {
            if (data.data.length > 0) {
                //后台数据
                this.container.el.style.display = 'flex';
                this.tips.style.display = 'none';
                this.tips.style.backgroundColor = 'transparent';
            } else if (data.data.length == 0) {
                //默认数据
                this.container.el.style.display = 'none';
                this.tips.style.display = 'flex';
                this.tips.style.backgroundColor = 'rgba(255,255,255,1)';
                if(this.name == 'statistics'){
                    (this.tips.querySelector('[tips-text]') as HTMLElement).style.width = "auto";
                    this.tips.querySelector('[tips-text]').innerHTML = "暂无数据";
                }else if(this.name == 'table'){
                    (this.tips.querySelector('[tips-text]') as HTMLElement).style.width = "100%";
                    this.tips.querySelector('[tips-text]').innerHTML ='<span style="width:100%;height:140px;line-height:140px;">暂无数据</span>'
                }else{
                    (this.tips.querySelector('[tips-text]') as HTMLElement).style.width = "auto";
                    this.tips.querySelector('[tips-text]').innerHTML = this.noDataHtml;
                }
            }
            this.onSizeChange();
            component.onDataChange(scope, data.data);

        } else {
            this.container.el.style.display = 'none';
            this.tips.style.display = 'flex';
            this.tips.style.backgroundColor = 'rgba(255,255,255,1)';

            if (data.code == 300) {
                (this.tips.querySelector('[tips-text]') as HTMLElement).style.width = "100%";
                this.tips.querySelector('[tips-text]').innerHTML = '<span style="width:100%;">数据面板配置不完整</span>';
            }
            if (data.code == 500) {
                if(this.name == 'statistics'){
                    (this.tips.querySelector('[tips-text]') as HTMLElement).style.width = "auto";
                    this.tips.querySelector('[tips-text]').innerHTML = "暂无数据";
                }else if(this.name == 'table'){
                    (this.tips.querySelector('[tips-text]') as HTMLElement).style.width = "100%";
                    this.tips.querySelector('[tips-text]').innerHTML ='<span style="width:100%;height:140px;line-height:140px;">暂无数据</span>'
                }else{
                    (this.tips.querySelector('[tips-text]') as HTMLElement).style.width = "auto";
                    this.tips.querySelector('[tips-text]').innerHTML = this.noDataHtml;
                }
               
            }

            component.onDataChange(scope, []);
        }
    }


    /**
     * 缩放时会触发
     */
    public onSizeChange() {
        let component = (this.container as ComponentContainer).component;
        component.onSizeChange();
    }

    /**
     * 到达可视区会触发
     */
    public onVisualArea(scope: string, data?: any) {
        let component = (this.container as ComponentContainer).component;
        component.onVisualArea(scope, data);
    }

}