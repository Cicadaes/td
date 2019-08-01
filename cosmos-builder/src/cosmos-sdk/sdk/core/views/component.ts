import { Render } from "../render/render";
import { BaseComponent } from "../base/base.component";

export class Component extends BaseComponent {

    private template: string;
    private style: string;
    private _pattern:string;
    private _tempData:any;
    private _isEdit:boolean = false;
    private _styleAndData:boolean = true;
    private _name:string;

    constructor(scope?: string) {
        super();
        if (scope) {
            this.scope = scope;
        }
        this.el = Render.style(this.style).template(this.template).render(this.scope);
    }

    public get pattern(): string {
        return this._pattern;
    }
    
    public set pattern(pattern: string) {
        this._pattern = pattern;
    }

    public get tempData(): any {
        return this._tempData;
    }
    
    public set tempData(tempData: any) {
        this._tempData = tempData;
    }

    public get isEdit(): boolean {
        return this._isEdit;
    }
    
    public set isEdit(isEdit: boolean) {
        this._isEdit = isEdit;
    }

    public get styleAndData(): boolean {
        return this._styleAndData;
    }
    
    public set styleAndData(styleAndData: boolean) {
        this._styleAndData = styleAndData;
    }

    public get name(): string {
        return this._name;
    }
    
    public set name(name: string) {
        this._name = name;
    }

}

export function SdkComponent(args: IComponentDecorator) {
    return function (constructor: Function) {
        if (args.template) {
            constructor.prototype.template = args.template;
        }
        if (args.style) {
            constructor.prototype.style = args.style;
        }
    }
}

export interface IComponentDecorator {
    template: string;
    style: string;
}