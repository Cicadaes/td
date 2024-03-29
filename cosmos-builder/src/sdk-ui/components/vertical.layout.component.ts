import { Component, SdkComponent, ViewType, ComponentEvent, EventEmitter, DataStore, PreviewMode, VerticalLayoutContainer, LayoutComponent, DomEvent } from 'cosmos-td-sdk';

@SdkComponent({
    template: `<div layoutContainer class="cm-dragdrop-handle cm-dragdrop">
                    <div header class="header">
                        <div class="header-box clrfix">
                            <span class="header-icon"><i class="icon iconfont icon-shuipingrongqi"></i></span>
                        </div> 
                    
                    </div>
                    <div container class="container">
                    </div>
                </div>`,
    style: `
            [layoutContainer]{
                height:auto;
                width:100%;
                border: 2px dashed #eee;
                height:auto;
                background-color:#ecf6fd;
                padding:0 20px 20px 20px;
            }
            [layoutContainer] > .container{
                width:100%;
                height:100%;
                position:relative;
                height: calc(100% - 20px);
                display:flex;
                flex-direction:column;
                flex-grow: 1;
                background-color:#fff;
                align-items:flex-start;
                overflow: auto;
                
            }
            [layoutContainer] .clrfix {
                zoom: 1;
            }
            [layoutContainer] .clrfix:after {
                content: "";
                display: block;
                height: 0;
                clear: both;
                visibility: hidden;
                overflow: hidden;
            }
            [layoutContainer] > .header{
                width:100%;
                height:20px;
                line-height:20px;
                position:relative;
            }
            [layoutContainer] > .header .header-box {
                overflow:hidden;
                width:40px;
                position: absolute;
                top: 0px;
                right: -20px;
            }
            [layoutContainer] > .header .header-icon{
                float:right;
                width:40px;
                height:20px;
                line-height:20px;
                text-align:center;
                font-size:14px;
            }
            [layoutContainer] > .header.hide{
                display:none;
            }
            `
})
export default class VerticalLayoutComponent extends LayoutComponent {
    public static type: string = 'layout';
    private clickHandleBind: EventListenerObject;
    private deleteBind: EventListenerObject;
    private deleteButton: HTMLElement;
    private header: HTMLElement;

    constructor(scope?: string) {
        super(scope);
        this.styleAndData = false;
        // 获取组件类型
        this.name = this.getComponenyType(VerticalLayoutComponent);

        // 设置容器
        this.container = new VerticalLayoutContainer(this.el.querySelector('.container'));

        // 改变this指针
        this.deleteBind = this.deleteHandle.bind(this);

        //阻止 click 默认和冒泡
        this.clickHandleBind = this.clickHandle.bind(this);
        this.el.addEventListener('click', this.clickHandleBind);

    }

    onCreate() {
        //删除组件
        this.deleteButton = this.el.querySelector('.header-icon') as HTMLElement;

        // 头部组件
        this.header = this.el.querySelector('[header]') as HTMLElement;

        this.previewMode();

    }

    private clickHandle(e: any) {
        e.stopPropagation();
        if (!PreviewMode.getPreviewMode()) {
            this.selectHandle(e);
        }

    }

    // 删除自身
    private deleteHandle(e: Event) {
        e.preventDefault();
        let parentLayout = this.container.getParent(this.el);
        if (parentLayout) {
            parentLayout.container.removeChild(this);
        }
    }

    /**
     * 设置预览和编辑模式
     */
    public previewMode() {
        (this.container as VerticalLayoutContainer).previewMode();
        this.enableSelect = !PreviewMode.getPreviewMode();
        // this.selectStatus = false;
        if (PreviewMode.getPreviewMode()) {
            // this.container.el.style.pointerEvents = 'auto';
            // this.selectBorder.style.borderColor = "transparent";
            this.el.style.backgroundColor = 'transparent';
            this.el.style.padding = '0';
            this.el.style.border = 'none';
            this.toggleHeader(false);
            this.container.el.style.height = '100%';

        } else {
            // if (!this.enableEdit) {
            //     this.container.el.style.pointerEvents = 'none';
            // }
            // this.selectBorder.style.borderColor = "#ddd";
            this.el.style.backgroundColor = '#ecf6fd';
            this.el.style.padding = '0 20px 20px 20px';
            this.el.style.border = '2px dashed #eee';
            this.toggleHeader(true);
            this.container.el.style.height = 'calc(100% - 20px)';
        }

        setTimeout(() => {
            this.resizeChildren();
        }, 500);
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


    /**
     * 隐藏头部handle
     */
    protected toggleHeader(show: boolean) {
        let classList = this.header && this.makeClassToArray(this.header.classList);
        if (show) {
            if (classList && classList.indexOf('hide') >= 0) {
                classList.splice(classList.indexOf('hide'), 1);
                this.header.className = classList.join(' ');
            }

        } else {
            if (classList && classList.indexOf('hide') < 0) {
                classList.push('hide');
                this.header.className = classList.join(' ');
            }

        }
    }

    onDestroy() {
        // 组件选中事件
        this.el.removeEventListener('click', this.clickHandleBind);

    }
}

