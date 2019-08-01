/**
 * Created by zhaoxue on 2017/3/28.
 */
import {BaseComponent} from "../base.component";
import {TabAreaTemplate} from "./tabArea.template";
import {Utils} from '../../../../public/scripts/utils';
import {TabAreaModel} from './tabArea.model';
import {BaseCharts} from '../../base/base.chart';
import * as $ from 'jquery';
import {DataSourceConfig} from "../../../dataSourceConfig";

export class TabAreaComponent extends BaseComponent {
    private myChart: any = null;
    private chartData: any = null;
    private lineData: TabAreaModel = null;
    private echartData: any = null;
    private getSoreceData: any = null;
    private styleObj: any = null;
    private changeObj: any = null;
    private body: any = {};
    private filterScopeIDObj:any = null;
    private targetType:string = "1";

    constructor() {
        super();
        let template = new TabAreaTemplate(this.scopeID);

        //获得模板渲染后的节点
        this.element = this.render(template);
        this.lineData = new TabAreaModel();

    }

    public beforeShow(): void {

    }

    public afterShow(): void {
        this.init();
    }

    public beforeDestory(): void {

    }

    public afterDestory(): void {

    }

    public resize(): void {

    }

    public setBodyObj(result: any) {
        this.body = DataSourceConfig.getConfigByKey(result.dscKey);

        this.body["charUUID"] = this.scopeID;
        this.body["requestTitle"] = "tabArea";
        return this.body;
    }

    public getconfiginformation(event: any, changeObj: any): void {
        if (!this.isEmptyObject(changeObj.result)) {
            this.filterScopeIDObj = changeObj.result;
            this.setBodyObj(changeObj.result);
        } else {
            return;
        }

        if (changeObj.result && changeObj.result.readyBuildQuery) {
            this.postChange(this.body);
        }
    }

    public filterChange(event: any, data: any): void {
        this.body = DataSourceConfig.mergeBodyByFilter(this.body, data);
        this.body['dateFilters'][0]['value'] = data['date'][1]['value'];
        this.postChange(this.body)
    }

    public mergeFilterChange(event:any,target: any): void {
        super.onFilterChange(this,target);
    }

    public dataChange(data: any): void {
        this.renderHtml(data)
    }

    public styleChange(style: any): void {

    }

    public loadData(): void {

    }

    public get data(): any {
        return this.chartData;
    }

    protected init(): void {
        //commonchange
        this.commonChange();

    }

    private renderHtml(datasourceData: any): void {
        if(datasourceData.length > 0){
            let optionList: string = "";
            for(let key in Utils.lifeCycleMap){
                for (let item of datasourceData) {
                    if(Utils.lifeCycleMap[key] == item.cycle){
                        optionList += '<dl data-type='+ item.cycle +'>';
                        optionList += '<dt>' + key + '</dt>';
                        optionList += '<dd>' + Utils.parseFormatNum(item.value,0) + '</dd>';
                        optionList += '</dl>';
                    }
                }
            }
            //把第i项放入已选择框里
            $('#' + this.scopeID).find("div[commonTabAreaList]").html(optionList);
            $('#' + this.scopeID).find(".component_tabArea_title dl").css("width","calc(100%/`${data.length}`)")
            $('#' + this.scopeID).find("div[commonTabAreaList] dl").eq(parseInt(this.targetType) - 1).addClass("tabArea_title_choose")

        }else{
            let optionData:Array<any> = [{"cycle":1,"value":"--"},{"cycle":2,"value":"--"},{"cycle":3,"value":"--"},{"cycle":4,"value":"--"},{"cycle":5,"value":"--"},{"cycle":6,"value":"--"},{"cycle":7,"value":"--"}];
            let optionList: string = "";
            for(let key in Utils.lifeCycleMap){
                for (let item of optionData) {
                    if(Utils.lifeCycleMap[key] == item.cycle){
                        optionList += '<dl data-type='+ item.cycle +'>';
                        optionList += '<dt>' + key + '</dt>';
                        optionList += '<dd>' + item.value + '</dd>';
                        optionList += '</dl>';
                    }
                }
            }
            $('#' + this.scopeID).find("div[commonTabAreaList]").html(optionList);
            $('#' + this.scopeID).find("div[commonTabAreaList] dl").eq(0).addClass("tabArea_title_choose")
        }
    }

    private commonChange() {
        let _self = this;

        $('#' + this.scopeID).find('div[commonTabAreaList]').click((event: any) => {
            $('#' + this.scopeID).find("div[commonTabAreaList] dl").removeClass("tabArea_title_choose")

            if(event.target.nodeName == "DD" || event.target.nodeName == "DT"){
                _self.targetType = event.target.parentNode.dataset.type
            }else{
                _self.targetType = event.target.dataset.type
            }

            // console.log(_self.targetType,"???????")

            $('#' + this.scopeID).find("div[commonTabAreaList] dl").eq(parseInt(_self.targetType) - 1).addClass("tabArea_title_choose")
            _self.parameterPostChange(_self.changeFilterArray(_self.targetType));
        })

    }

    private changeFilterArray(type:any){
        let changePostFilterObj:Array<any> = [];

        changePostFilterObj.push({
            "field": 'cycle',
            "operator": "=",
            "value": type
        })

        return changePostFilterObj;
    }

    private parameterPostChange(filterArray:any){
        let sendObj:Object = Object.assign(
            super.transformInput('scopeID',this.scopeID),
            super.transformInput('filterObj',this.filterScopeIDObj),
            super.transformInput('result', Object.assign(super.transformInput('filter',filterArray)))
        );

        super.sendMessageBase(this,sendObj);
    }

    private postChange(postQuery: any) {
        let sendObj: Object = Object.assign(
            super.transformInput('scopeID', this.scopeID),
            super.transformInput('result', postQuery)
        );
        super.onChange(this, sendObj);
    }
}