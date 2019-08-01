import { Component } from "../views/component";
import { ViewType } from '../base/base.view';
import { DataStore } from '../stores/data.store';
import { EventEmitter } from '../events/emitter.event';
import { ComponentEvent } from '../communication/communication.type';
import { ComponentContainer } from "../views/component.container";

export class LayoutComponent extends Component {
    public _selectStatus: boolean = false;
    public _enableEdit: boolean = false;
    public _enableSelect: boolean;
    constructor(scope?: string) {
        super(scope);

        // 是否有样式面板和数据面板
        this.styleAndData = true;

        // 组件类型
        this.type = ViewType.layout;
    }

    public set enableEdit(isEdit: boolean) {
        if (isEdit) {
            this.container.el.style.pointerEvents = 'auto';
        } else {
            this.container.el.style.pointerEvents = 'none';
        }
        this._enableEdit = isEdit;
    }

    public get enableEdit() {
        return this._enableEdit;
    }

    // 通过类获取组件传入的类型
    protected getComponenyType(componentClass: typeof Component): string {
        let componentList = DataStore.getRegisterComponents();
        if (componentList) {
            for (let item of componentList) {
                if (item.component == componentClass) {
                    return item.type;
                }
            }
        }
        return null;
    }

    /**
    * 将伪数组转化成数组
    * @param classList : 元素类名列表
    */
    protected makeClassToArray(classList: any) {
        let len = classList.length;
        let arr: any[] = [];
        if (len > 0) {
            for (let i = 0; i < len; i++) {
                arr[i] = classList[i];
            }
        }
        return arr;
    }

    /**
     * 
     * @param scope 唯一ID
     * @param data 传送的数据
     */
    public onDataChange(scope: string, data: any) {

    }

    /**
     * 
     * @param scope 唯一ID
     * @param data 传送的样式
     */
    public onStyleChange(scope: string, data: any) {
        data && data.layout && data.layout.widthAndHeight && this.setWidthAndHeight(data.layout.widthAndHeight);
        data && data.layout && data.layout.bgAndBorder && this.setBgAndBorder(data.layout.bgAndBorder);
        data && data.layout && data.layout.paddingAndMargin && this.setMarginAndPadding(data.layout.paddingAndMargin);
        data && data.layout && data.layout.align && this.setAlign(data.layout.align);
        let component = (this.container as ComponentContainer).component;
        if (component) component.onStyleChange(scope, data);
        this.onSizeChange();
        this.resizeChildren();
    }

    /**
     * 设置背景边框
     * @param bgAndBorder 背景边框
     */
    protected setBgAndBorder(bgAndBorder: any) {
        if (bgAndBorder) {
            for (let key in bgAndBorder) {
                if (!(key.indexOf('border') >= 0 && !bgAndBorder[key])) {
                    this.container.el.style[key] = bgAndBorder[key];
                    if (this.el.querySelector('[tips]')) {
                        (this.el.querySelector('[tips]') as HTMLElement).style[key] = bgAndBorder[key];
                    }
                }
            }
        }
    }

    /**
     * 设置宽高
     * @param widthAndHeight 宽高
     */
    protected setWidthAndHeight(widthAndHeight: any) {
        if (widthAndHeight) {
            this.setWidth(widthAndHeight);
            this.setHeight(widthAndHeight);
        }
    }

    /**
     * 
     * @param settingData 设置的宽度
     */
    protected setWidth(settingData: any) {
        if (settingData) {
            if (/^[0-9]{1,5}px|%$/.test(settingData.width)) {
                this.el.style.width = settingData.width;
                this.el.style.flex = 'none';
                this.el.style.flexShrink = '1';
                this.width = settingData.width;
            } else if (/^[0-9]{1,5}/.test(settingData.width)) {
                this.el.style.width = 'auto';
                this.el.style.flexGrow = settingData.width;
                this.el.style.flexShrink = '1';

            } else {
                this.el.style.width = 'auto';
                this.el.style.flex = 'none';
            }
        }
    }

    /**
     * 
     * @param settingData 设置的高度
     */
    protected setHeight(settingData: any) {
        if (settingData) {
            if (/(^[0-9]{0,5}px|%$)|(auto)/.test(settingData.height)) {
                this.height = settingData.height;
                this.el.style.height = settingData.height;
            }
        }
    }

    /**
     * 
     * @param marginAndPadding 设置的外边距
     */
    protected setMarginAndPadding(marginAndPadding: any) {
        if (marginAndPadding) {
            for (let key in marginAndPadding) {
                if (key.indexOf('padding') >= 0) {
                    this.container.el.style[key] = marginAndPadding[key];
                    if (this.el.querySelector('[tips]')) {
                        (this.el.querySelector('[tips]') as HTMLElement).style[key] = marginAndPadding[key];
                    }
                } else {
                    this.el.style[key] = marginAndPadding[key];
                }
            }
        }
    }

    /**
     * 
     * @param align 设置的高度
     */
    protected setAlign(align: any) {
        if (align) {

            if (align.dirc == 'level') {
                if (align.positionLevel == 'leftFloat') {
                    this.container.el.style.justifyContent = 'flex-start';
                    if (this.el.querySelector('[tips]')) {
                        (this.el.querySelector('[tips]') as HTMLElement).style.justifyContent = 'flex-start';
                    }
                }
                if (align.positionVertical == 'topFloat') {
                    this.container.el.style.alignItems = 'flex-start';
                    if (this.el.querySelector('[tips]')) {
                        (this.el.querySelector('[tips]') as HTMLElement).style.alignItems = 'flex-start';
                    }
                }
                if (align.positionLevel == 'rightFloat') {
                    this.container.el.style.justifyContent = 'flex-end';
                    if (this.el.querySelector('[tips]')) {
                        (this.el.querySelector('[tips]') as HTMLElement).style.justifyContent = 'flex-end';
                    }
                }
                if (align.positionVertical == 'bottomFloat') {
                    this.container.el.style.alignItems = 'flex-end';
                    if (this.el.querySelector('[tips]')) {
                        (this.el.querySelector('[tips]') as HTMLElement).style.alignItems = 'flex-end';
                    }
                }

                if (align.positionLevel == "centerFloat") {
                    this.container.el.style.justifyContent = 'center';
                    if (this.el.querySelector('[tips]')) {
                        (this.el.querySelector('[tips]') as HTMLElement).style.justifyContent = 'center';
                    }
                }
                if (align.positionVertical == 'middleFloat') {
                    this.container.el.style.alignItems = 'center';
                    if (this.el.querySelector('[tips]')) {
                        (this.el.querySelector('[tips]') as HTMLElement).style.alignItems = 'center';
                    }
                }
            }

            if (align.dirc == 'vertical') {
                if (align.positionLevel == 'leftFloat') {
                    this.container.el.style.alignItems = 'flex-start';
                    if (this.el.querySelector('[tips]')) {
                        (this.el.querySelector('[tips]') as HTMLElement).style.alignItems = 'flex-start';
                    }
                }
                if (align.positionVertical == 'topFloat') {
                    this.container.el.style.justifyContent = 'flex-start';
                    if (this.el.querySelector('[tips]')) {
                        (this.el.querySelector('[tips]') as HTMLElement).style.justifyContent = 'flex-start';
                    }
                }
                if (align.positionLevel == 'rightFloat') {
                    this.container.el.style.alignItems = 'flex-end';
                    if (this.el.querySelector('[tips]')) {
                        (this.el.querySelector('[tips]') as HTMLElement).style.alignItems = 'flex-end';
                    }
                }
                if (align.positionVertical == 'bottomFloat') {
                    this.container.el.style.justifyContent = 'flex-end';
                    if (this.el.querySelector('[tips]')) {
                        (this.el.querySelector('[tips]') as HTMLElement).style.justifyContent = 'flex-end';
                    }
                }

                if (align.positionLevel == "centerFloat") {
                    this.container.el.style.alignItems = 'center';
                    if (this.el.querySelector('[tips]')) {
                        (this.el.querySelector('[tips]') as HTMLElement).style.alignItems = 'center';
                    }
                }
                if (align.positionVertical == 'middleFloat') {
                    this.container.el.style.justifyContent = 'center';
                    if (this.el.querySelector('[tips]')) {
                        (this.el.querySelector('[tips]') as HTMLElement).style.justifyContent = 'center';
                    }
                }
            }

        }
    }

    public resizeChildren() {
        setTimeout(() => {
            let childrens = this.container.allChildren;
            if (childrens) {
                for (let child of childrens) {
                    child.onSizeChange();
                }
            }
        }, 100);
    }

    public onVisualArea(scope: string, data?: any) {

    }

    public onSizeChange() {
    }
}