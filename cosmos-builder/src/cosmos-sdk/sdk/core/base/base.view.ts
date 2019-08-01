import { Scope } from '../utils/scope';
import { AbstractView } from "../views/view.abstract";
import { Container } from '../views/container';

export const ViewType = {
    layout: "layout",
    component: "component"
};

export const DomSign = {
    scope: "cm-scope"
};

export class BaseView extends AbstractView {

    private _scope: string;
    private _type: string;
    private _el: HTMLElement;
    private _container: Container;
    private _autoHeight: boolean = false;
    private _autoWidth: boolean = false;
    constructor() {
        super();
        // 默认为组件类型
        this.type = ViewType.component;
    }

    public set container(container: Container) {
        this._container = container;
    }

    public get container(): Container {
        return this._container;
    }

    public get scope(): string {
        if (!this._scope) {
            // 生成 scope
            this.scope = Scope.getInstance().scope;
        }
        return this._scope;
    }

    public set scope(scope: string) {
        this._scope = scope;
    }

    public get type(): string {
        return this._type;
    }

    public set type(type: string) {
        this._type = type;
    }

    public get el(): HTMLElement {
        return this._el;
    }

    public set el(el: HTMLElement) {
        // 设置当前节点的 scope
        this._el = el;
        // 设置dom元素特定属性
        this._el.setAttribute(DomSign.scope, this.scope);
    }
    public get height(): number {
        return this.el['offsetHeight'];
    }

    public set height(height: number) {
        this.el['style'].height = height + "px";
    }

    public get autoHeight(): boolean {
        return this._autoHeight;
    }

    public set autoHeight(height: boolean) {
        this._autoHeight = height;
    }

    public get autoWidth(): boolean {
        return this._autoWidth;
    }

    public set autoWidth(width: boolean) {
        this._autoWidth = width;
    }

    public get width(): number {
        return this.el['offsetWidth'];
    }

    public set width(width: number) {
        this.el['style'].width = width + "px";
    }

    public get x(): number {
        return Number(this.el['style'].left.replace("px", ""));
    }

    public set x(x: number) {
        this.el['style'].left = x + "px";
    }

    public get y(): number {
        return Number(this.el['style'].top.replace("px", ""));
    }

    public set y(y: number) {
        this.el['style'].top = y + "px";
    }

    public get maxHeight(): number {
        return this.y + this.height;
    }
    public get maxWidth(): number {
        return this.x + this.width;
    }

    public set layer(index: number) {
        this.el['style'].zIndex = index + '';
    }

    public get layer(): number {
        return Number(this.el['style'].zIndex);
    }
}