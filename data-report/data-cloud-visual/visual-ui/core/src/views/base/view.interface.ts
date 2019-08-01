/**
 * Created by wangshouyun on 2017/3/7.
 */

export interface IView {

    beforeShow(): void;
    afterShow(): void;
    beforeDestory(): void;
    afterDestory(): void;
    resize(): void;
    buildQuery(item:any,changeObj:Object):Object;
    transformInput(key: string, val: any):Object;
    settingChange(event:any,target:any,changeObj:Object):void;
    dataChange(data: any): void;
    styleChange(style: any): void;
    loadData(): void;
    getData(): any;

}
