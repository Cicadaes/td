import {IView} from "./view.interface";
import {EventEmitter} from "../../events/emitter.event";
import {EventType} from "../../events/type.event";


/**
 * Created by wangshouyun on 2017/3/7.
 */

export abstract class AView implements IView {

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

    public settingChange(event:any,target:any,changeObj:Object): void{
        this.onChange(target,changeObj);
    }

    public dataChange(data: any): void {

    }

    public onChange(event:any,changeObj:any):void {
        EventEmitter.trigger(EventType.COMONCHANGE,event,changeObj)
    }

    public styleChange(style: any): void {

    }

    public loadData(): void {

    }

    public getData():any{
        return null;
    }

    public transformInput(key: string, val: any): any {
        let o = {};
        o[key] = val;
        return o
    }

    public getObject:boolean = false;
    public itemObj:any = {};
    public buildQuery(item:any,changeObj:Object): any {

        if(!this.getObject){
            this.itemObj = this.getParameters(item);
            if(item.datasourceId == 13){
                this.itemObj['filters'] = [{"field":"project_type","operator":"=","value":"3"},{"field":"date","operator":">=","value":"2017-08-19T03:38:45.000Z"},{"field":"date","operator":"<=","value":"2017-09-19T03:38:45.000Z"}];
            }

            this.getObject = true;
        }

        return this.compareChangeObj(this.itemObj,changeObj);
    }

    //取改变的value
    private changeArr(changeObj:Object){
        let changeArr:Array<any> = [];
        for(let key in changeObj){
            if(key !== 'oldValue'){
                for(let k of changeObj[key]){
                    for(let r in k){
                        changeArr.push(k[r]);
                    }
                }
            }
        }
        return changeArr;
    }

    //初始化设置body值
    private setChangeField(itemArr:any,setChangeArr:any){
        for(let it=0; it<itemArr.length;it++){
            for(let st=0; st<setChangeArr.length;st++){
                if(it == st){
                    itemArr[it].field = setChangeArr[st];
                }
            }
        }
        return itemArr;
    }

    private changeOldArr(itemArr:any,oldArr:any,setChangeArr:any){
        for(let arr=0; arr<oldArr.length;arr++){
            for(let s=0; s<itemArr.length;s++){
                if(oldArr[arr] == itemArr[s].field){
                    itemArr[s].field = setChangeArr[0]
                    break;
                }
            }
        }
        return itemArr;
    }


    //对比body与change的key改变body发送的值
    public compareChangeObj(itemObj:Object,changeObj:Object){
        let setChangeArr:Array<any> = this.changeArr(changeObj);
        for(let o in itemObj){
            for(let key in changeObj){
                if(changeObj['oldValue'].length == 0){
                    if(o.search((key).toLowerCase()) !== -1){
                        itemObj[o] = this.setChangeField(itemObj[o],setChangeArr);
                    }
                }else{
                    if(o.search((key).toLowerCase()) !== -1){
                        itemObj[o] = this.changeOldArr(itemObj[o],changeObj['oldValue'],setChangeArr)
                    }
                }
            }
        }


        return itemObj;

    }

    public getParameters(item:any){
        let tcDimensions: Array<any> = [],
            tcMetrics: Array<any> = [],
            tcFilters: Array<any> = [];

        this.itemObj['datasource_id'] = item.datasourceId;

        if(item.result[1]){
            for(let j of item.result[1].fields){
                for(let key in j){
                    if(key == "code" && j[key].search('dimension') !== -1){
                        let dimensionArr :Array<any> = [];
                        if(j.value !== null && j.value.length > 0){
                            dimensionArr = j.value;
                        }
                        for(let k of dimensionArr){
                            tcDimensions.push({
                                field: k.name + "",
                                alias: j.fieldAliasName
                            });
                        }
                    }

                    if(key == "code" && j[key].search('metric') !== -1){
                        if(j.value !== null){
                            let metricArr :Array<any> = [];
                            metricArr = j.value;
                            for(let k of metricArr){
                                tcMetrics.push({
                                    field: k.name + "",
                                    alias: j.fieldAliasName
                                })
                            }
                        }
                    }
                }
            }
        }

        if(item.result[2]){
            for(let j of item.result[2].fields){
                for(let key in j){
                    if(key == "code" && j[key].search('date') !== -1){
                        if (j.viewType === 22 && typeof j.value === 'object') {
                            tcFilters = [{
                                field: 'create_dt',
                                operator: '>=',
                                value: j.value.start
                            },{
                                field: 'create_dt',
                                operator: '<=',
                                value: j.value.end
                            }]
                        }
                    }
                }
            }
        }

        if(tcDimensions.length > 0){
            this.itemObj['dimensions'] = tcDimensions;
        }
        if(tcMetrics.length > 0){
            this.itemObj['metrics'] = tcMetrics;
        }
        if(tcFilters.length > 0){
            this.itemObj['filters'] = tcFilters;
        }

        return this.itemObj;
    }
}