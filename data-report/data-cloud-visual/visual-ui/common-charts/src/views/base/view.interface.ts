/**
 * Created by wangshouyun on 2017/3/7.
 */

export interface IView {

    beforeShow(): void;
    afterShow(): void;
    beforeDestory(): void;
    afterDestory(): void;
    resize(): void;
    transformInput(key: string, val: any):Object;
    getconfiginformation(event:any,changeObj:Object):void;
    dataChange(data: any): void;
    styleChange(style: any): void;
    filterChange(event:any,data: any): void;
    overallFilterChange(event:any,data: any): void;
    downloadData():void;
    loadData(): void;
    getData(): any;

}
