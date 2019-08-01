import { ViewType } from "./base.view";
import { ComponentInterface } from "../views/component.interface";
import { View } from "../views/view";

export class BaseComponent extends View implements ComponentInterface {

    public static type: string = ViewType.component;

    private _isLoad: boolean = false;

    constructor() {
        super();

        // 设置默认类型
        this.type = ViewType.component;
    }

    public get isLoad(): boolean {
        return this._isLoad;
    }

    public set isLoad(isLoad: boolean) {
        this._isLoad = isLoad;
    }

    // 实现接口
    public onVisualArea(scope: string, data?: any): void {

    }
}