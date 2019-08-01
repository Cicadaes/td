/**
 * Created by zhaoxue on 2017/3/28.
 */
import {BaseComponent} from "../base.component";
import {TabFilterTemplate} from "./tabFilter.template";
import {Utils} from '../../../../public/scripts/utils';
import {TabFilterModel} from './tabFilter.model';
import {BaseCharts} from '../../base/base.chart';
import * as $ from 'jquery';

export class TabFilterComponent extends BaseComponent {
    private myChart: any = null;
    private chartData: any = null;
    private tabFilterData: TabFilterModel = null;
    private echartData: any = null;
    private getSoreceData: any = null;
    private eqType: number = null;
    private filterScopeIDObj: any = null;
    private filterListArray: any = [];
    private filterChooseObj: any = {};
    private tabField: any = "project_id";
    private tabOp: any = "in";

    constructor() {
        super();
        let template = new TabFilterTemplate(this.scopeID);

        //获得模板渲染后的节点
        this.element = this.render(template);
        this.tabFilterData = new TabFilterModel();
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

    public getconfiginformation(event: any, changeObj: any): void {
        if (!this.isEmptyObject(changeObj.result)) {
            this.filterScopeIDObj = changeObj.result;
            this.decideTabOptions(changeObj.result);
        } else {
            return;
        }
    }

    // 判断是tab还是接收filter控制
    private decideTabOptions(changeObj: any) {
        if (changeObj['tabOptions'] !== undefined) {
            //渲染html
            this.renderHtml(changeObj['tabOptions'],false);
            // this.changePostChange('tabchange',{"type": changeObj['tabOptions'][0].type, "value": changeObj['tabOptions'][0].project_name});
        }

        if (changeObj['tabField']) {
            this.tabField = changeObj['tabField'];
        }
        if (changeObj['tabOp']) {
            this.tabOp = changeObj['tabOp'];
        }
    }

    public filterChange(event: any, data: any): void {
        //存储list
        //this.filterListArray = data['chart'];

        //project格式转成标准格式
        let list = [];
        if (data['filter'] && data['filter'].length) {
            let obj = {};
            for (let i = 0; i < data['filter'].length; i++) {
                let tmpObj = data['filter'][i];
                if (tmpObj.field == "project_id") {
                    obj["value"] = tmpObj.value;
                } else if (tmpObj.field == "projectName") {
                    obj["name"] = tmpObj.value;
                }
            }
            list.push(obj)
        }

        //渲染html
        this.renderHtml(list,true);
        if (list.length == 1) {
            //发送请求
            //this.changePostChange('filter', this.changeFilterArray((this.filterChooseObj).toString()));
        }
    }

    public dataChange(data: any): void {

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

    private renderHtml(data: any,flag:any): void {
        let optionList: string = "";
        if(flag == true){
            let ids = data[0].value.split(",");
            let names = data[0].name.split(",");
            let obj = {};
            obj["name"] =  data[0].name.split(",")[0];
            obj["value"] =  data[0].value.split(",")[0];
            let list = [];
            list.push(obj);
             optionList += '<ul>';
            for (let i = 0; i <ids.length; i++) {
                optionList += '<li index=' + i + ' data-name=' + names[i] + ' data-value=' + ids[i] + '>' + names[i] + '</li>';
            }
            optionList += '</ul>';
            this.setChooseObj(data[0])
        }else{
             optionList += '<ul>';
            for (let i = 0; i < data.length; i++) {
                optionList += '<li index=' + i + ' data-name=' + data[i].name + ' data-value=' + data[i].value + '>' + data[i].name + '</li>';
            }
            optionList += '</ul>';
            this.setChooseObj(data[0])
        }
       

        $('#' + this.scopeID).find("div[conponentTabFilter]").html(optionList);
        //设置html选中的值
        $('#' + this.scopeID).find("li").eq(0).addClass('tabFilter_choose');
        $('#' + this.scopeID).find("li").eq(0).click();
        //设置选中的值
       
    }

    //设置已经选中的id name
    private setChooseObj(data: any) {
        this.filterChooseObj = data;
    }

    private commonChange() {
        let _self = this;

        $('#' + this.scopeID).find('div[conponentTabFilter]').click((event: any) => {
            // $('#' + this.scopeID).find("li").removeClass('tabFilter_choose');

            // let $target = event.target,
            //     tabType = parseInt($target.attributes[0].value)
            // $('#' + this.scopeID).find("li").eq(tabType).addClass('tabFilter_choose');

            // if (_self.tabField == "body_change") {
            //     _self.changePostChange('body_change', $target.dataset.value);
            // }else{
            //     //发送请求
            //     _self.changePostChange('filter', _self.changeFilterArray($target.dataset));
            // }

             let $target = event.target,
                tabType = parseInt($target.attributes[0].value);
           
            if($target.attributes[0].value){
                $('#' + _self.scopeID).find("li").removeClass('tabFilter_choose');
                 $('#' + _self.scopeID).find("li").eq(tabType).addClass('tabFilter_choose');
                 

                 if (_self.tabField == "body_change") {
                    _self.changePostChange('body_change', $target.dataset.value);
                }else{
                    //发送请求
                    _self.changePostChange('filter', _self.changeFilterArray($target.dataset));
                }
            }
        });

    }

    private changePostChange(key: any, filterArray: any) {
        if (!this.isEmptyObject(this.filterScopeIDObj)) {
            let sendObj: Object = Object.assign(
                super.transformInput('scopeID', this.scopeID),
                super.transformInput('filterObj', this.filterScopeIDObj),
                super.transformInput('result', super.transformInput(key, filterArray))
            );
            super.sendMessageBase(this, sendObj);

        } else {
            return;
        }
    }

    private changeFilterArray(obj: any) {
        let changePostFilterObj: Array<any> = [];

        let tmpObj = {
            "field": 'project_id',
            "operator": "in",
            "value": obj.value
        };
        if (this.tabField) {
            tmpObj["field"] = this.tabField;
        }
        if (this.tabOp) {
            tmpObj["operator"] = this.tabOp;
        }

        changePostFilterObj.push(tmpObj)

        return changePostFilterObj;
    }

}