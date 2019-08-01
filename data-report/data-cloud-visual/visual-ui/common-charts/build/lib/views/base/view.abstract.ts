import {IView} from "./view.interface";
import {EventEmitter} from "../../events/emitter.event";
import {EventType} from "../../events/type.event";
import * as $ from 'jquery';

/**
 * Created by wangshouyun on 2017/3/7.
 */

export abstract class AView implements IView {
    public getObject: boolean = false;
    public datasource_id: any = null
    public itemObj: any = null;
    public postQuery: any = null;
    public mergeFilterObj: any = null;
    public mergeDateObj: any = null;
    public downloadBoolean: boolean = false

    constructor() {

    }

    abstract insertToElement(ele: string): void;

    public beforeShow(): void {

    }

    public afterShow(): void {

    }

    public beforeDestory(): void {

    }

    public afterDestory(): void {

    }

    public resize(): void {

    }

    public getconfiginformation(event: any, changeObj: Object): void {

    }

    public dataChange(data: any): void {

    }

    public onChange(event: any, changeObj: any): void {
        EventEmitter.trigger(EventType.COMONCHANGE, event, changeObj);
    }

    public changeHeightBase(event: any, msgObj: any): void {
        EventEmitter.trigger(EventType.CHANGE_HEIGHT, msgObj);
    }

    public sendMessageBase(event: any, msgObj: any): void {
        EventEmitter.trigger(EventType.SEND_MESSAGE, msgObj);
    }

    public onRender(event: any, type: any): void {
        EventEmitter.trigger(EventType.COMONRENDER, event, type);
    }

    public onFilterChange(event: any, target: any): void {
        EventEmitter.trigger(EventType.COMONFILTERCHANGE, event, target);
    }

    public styleChange(style: any): void {

    }

    public loadData(): void {

    }

    public getData(): any {
        return null;
    }

    public transformInput(key: string, val: any): any {
        let o = {};
        o[key] = val;
        return o
    }

    public isEmptyObject(obj: any): any {
        for (var key in obj) {
            return false;
        }
        return true;
    }

    public filterChange(event: any, data: any): any {

    }

    public mergeFilterChange(event: any, data: any): any {

    }

    public overallFilterChange(event: any, data: any): any {

    }

    public downloadData(): any {

    }

}