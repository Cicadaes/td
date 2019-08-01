/**
 * Created by wangshouyun on 2017/3/7.
 */

import {AView} from "./view.abstract";
import {BaseTemplate} from "./template.base";
import {Scope} from "../../public/scripts/scope";
import {BaseModel} from "./model.base";
import {BaseRender} from '../base/base.render';

export class BaseView extends AView {

    private _scopeID: string;
    private _element: Element;
    private _type: string;

    constructor() {
        super();
    }

    public get scopeID(): string {
        if (this._scopeID == null) {
            this._scopeID = Scope.getInstance().scopeID;
        }
        return this._scopeID;
    }

    public set scopeID(id: string) {
        Scope.getInstance().scopeID = this._scopeID = id;
    }

    public render(template: BaseTemplate, model?: BaseModel): Element {
        let element = document.createElement('div');
        element.innerHTML = template.tpl;
        return element.childNodes[0] as Element;
    }

    //将当前节点插入指定容器内
    public insertToElement(el: string): void {
        this.beforeShow();
        let target = document.querySelector(el);
        target.appendChild(this._element);
        this.afterShow();
    }

    public set element(el: Element) {
        this._element = el;
    }

    public get element(): Element {
        return this._element;
    }

    public addStyle(key: any, value: any): string {
        return this._element['style'][key] = value;
    }

    public addClass(): any {
        return this._element.className = "edge_distance";
    }

    public removeClass(): any {
        return this._element.className = "";
    }

    public removeStyle(key: any): void {
        this._element['style'][key] = null;
    }


    public set x(x: number) {
        this._element['style'].left = x + "px";
    }

    public get x(): number {
        return Number(this._element['style'].left.replace("px", ""));
    }

    public get maxX(): number {
        return this.x + this.width;
    }

    public set y(y: number) {
        this._element['style'].top = y + "px";
    }

    public get y(): number {
        return Number(this._element['style'].top.replace("px", ""));
    }

    public get maxY(): number {
        return this.y + this.height;
    }

    public set width(w: number) {
        this._element['style'].width = w + "px";
        this.resize();
    }

    public get width(): number {
        // return Number(this._element['style'].width.replace("px", ""));
        // debugger
        return this._element['offsetWidth'];
    }

    public get widthHand(): number{
        return document.documentElement.clientWidth;
    }

    public set height(h: number) {
        this._element['style'].height = h + "px";
        this.resize();
    }

    public get height(): number {
        // return Number(this._element['style'].height.replace("px", ""));
        return this._element['offsetHeight'];
    }

    public set layer(index: number) {
        this._element['style'].zIndex = index;
    }

    public get layer(): number {
        return Number(this._element['style'].zIndex);
    }

    public set type(t: string) {
        this._type = t;
    }

    public get type(): string {
        return this._type;
    }

    public set visible(visible: Boolean) {
        if (visible) {
            this._element['style'].visibility = "visible";
        } else {
            this._element['style'].visibility = "hidden";
        }
    }

}