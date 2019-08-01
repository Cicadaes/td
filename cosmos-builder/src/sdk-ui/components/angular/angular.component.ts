import { Component } from "cosmos-td-sdk";
import { Communication } from "cosmos-td-sdk";
import ComponentBootstrap from "./component.bootstrap";
import { ComponentRef } from "@angular/core";

export default class AngularSDKComponent extends Component {
    public static pattern: string = 'chart';
    public static isEdit: boolean = false;
    public static scale: string = null;

    public componentRef: Communication;

    constructor() {
        super();
    }

    /**
     * 
     * @param Component angular模块
     */
    public bootstrapAngular(ComponentClass:any): Communication {
        return ComponentBootstrap.bootstrap(this.el, ComponentClass).instance as Communication;
    }

    public onDataChange(scope: string, data: any) {
        if (this.componentRef) {
            this.componentRef.onDataChange(scope, data);
        }
    }

    public onStyleChange(scope: string, data: any) {
        if (this.componentRef) {
            this.componentRef.onStyleChange(scope, data);
        }
    }

    public onSizeChange() {
        if (this.componentRef) {
            this.componentRef.onSizeChange();
        }
    }

    public onVisualArea(scope: string, data?: any) {
        if (this.componentRef) {
            this.componentRef.onVisualArea(scope, data);
        }
    }

}