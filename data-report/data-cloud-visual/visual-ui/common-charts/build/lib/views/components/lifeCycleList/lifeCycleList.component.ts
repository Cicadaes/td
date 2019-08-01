/**
 * Created by zhaoxue on 2017/3/28.
 */
import {BaseComponent} from "../base.component";
import {LifeCycleListTemplate} from "./lifeCycleList.template";
import {Utils} from '../../../../public/scripts/utils';
import {LifeCycleListModel} from './lifeCycleList.model';
import {BaseCharts} from '../../base/base.chart';
import * as $ from 'jquery';
import {DataSourceConfig} from "../../../dataSourceConfig";
import {PATHJSON} from '../../../../public/path/path';


export class LifeCycleListComponent extends BaseComponent {
    private myChart: any = null;
    private chartData: any = null;
    private lineData: LifeCycleListModel = null;
    private echartData: any = null;
    private getSoreceData: any = null;
    private styleObj: any = null;
    private changeObj: any = null;
    private body: any = {};
    private filterScopeIDObj:any = null;
    private renderTitleBoolean:boolean = false;
    private saveFilterObj:any = {
        brand : "ALL",
        channel : "ALL",
        start: DataSourceConfig.getValueFormatDate(30),
        end: DataSourceConfig.getValueFormatDate(1)
    };

    constructor() {
        super();
        let template = new LifeCycleListTemplate(this.scopeID);

        //获得模板渲染后的节点
        this.element = this.render(template);
        this.lineData = new LifeCycleListModel();

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
        this.body["requestTitle"] = "LifeCycleList";
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

    private saveFilterChange(data:any){
        if(data.filterDate){
            this.saveFilterObj.start = data.filterDate.start;
            this.saveFilterObj.end = data.filterDate.end
        }
        if(data.filter){
            for(let item of data.filter){
                if(item.field == "brand"){
                    this.saveFilterObj.brand = item.value;
                }
                if(item.field == "channel"){
                    this.saveFilterObj.channel = item.value;
                }
            }
        }
    }

    public filterChange(event: any, data: any): void {
        this.saveFilterChange(data);
        this.body = DataSourceConfig.mergeBodyByFilter(this.body, data);
        this.renderTitleBoolean = false;
        this.postChange(this.body);
    }

    public mergeFilterChange(event:any,target: any): void {
        super.onFilterChange(this,target);
    }

    public dataChange(data: any): void {
        if(!this.renderTitleBoolean){
            this.renderHtml(data)
        }
    }

    public styleChange(style: any): void {

    }

    public loadData(): void {

    }

    public get data(): any {
        return this.chartData;
    }

    protected init(): void {
        this.renderlist();
    }

    private renderlist(){
        let option = "<dl>\n                    <dt><h3>注册期</h3><p><span><em>0</em>%</span>起始时刻</p><h4>--</h4></dt>\n                    <dd>\n                        <ul>\n                            <li data-type=\"1\"><h4>停留注册期</h4><p><span><em>0</em>%</span><b>--</b></p></li>\n                            <li><h4>注册浅度访客</h4><p><span><em>0</em>%</span><b>--</b></p></li>\n                            <li><h4>注册深度访客</h4><p><span><em>0</em>%</span><b>--</b></p></li>\n                            <li data-type=\"2\" class=\"lifeCycleList_one\"><h4>新客户期</h4><p><span><em>0</em>%</span><b>--</b></p></li>\n                            <li data-type=\"5\" class=\"lifeCycleList_two\"><h4>休眠期</h4><p><span><em>0</em>%</span><b>--</b></p></li>\n                            <li data-type=\"6\" class=\"lifeCycleList_three\"><h4>流失期</h4><p><span><em>0</em>%</span><b>--</b></p></li>\n                        </ul>\n                    </dd>\n                </dl>\n                <dl>\n                    <dt><h3>新客户期</h3><p><span><em>0</em>%</span>起始时刻</p><h4>--</h4></dt>\n                    <dd>\n                        <ul>\n                            <li data-type=\"2\"><h4>停留新客户期</h4><p><span><em>0</em>%</span><b>--</b></p></li>\n                            <li data-type=\"3\" class=\"lifeCycleList_one\"><h4>成长期</h4><p><span><em>0</em>%</span><b>--</b></p></li>\n                            <li data-type=\"5\" class=\"lifeCycleList_two\"><h4>休眠期</h4><p><span><em>0</em>%</span><b>--</b></p></li>\n                            <li data-type=\"6\" class=\"lifeCycleList_three\"><h4>流失期</h4><p><span><em>0</em>%</span><b>--</b></p></li>\n                        </ul>\n                    </dd>\n                </dl>\n                <dl>\n                    <dt><h3>成长期</h3><p><span><em>0</em>%</span>起始时刻</p><h4>--</h4></dt>\n                    <dd>\n                        <ul>\n                            <li data-type=\"3\"><h4>停留成长期</h4><p><span><em>0</em>%</span><b>--</b></p></li>\n                            <li data-type=\"4\" class=\"lifeCycleList_one\"><h4>稳定期</h4><p><span><em>0</em>%</span><b>--</b></p></li>\n                            <li data-type=\"5\" class=\"lifeCycleList_two\"><h4>休眠期</h4><p><span><em>0</em>%</span><b>--</b></p></li>\n                            <li data-type=\"6\" class=\"lifeCycleList_three\"><h4>流失期</h4><p><span><em>0</em>%</span><b>--</b></p></li>\n                        </ul>\n                    </dd>\n                </dl>\n                <dl>\n                    <dt><h3>稳定期</h3><p><span><em>0</em>%</span>起始时刻</p><h4>--</h4></dt>\n                    <dd>\n                        <ul>\n                            <li data-type=\"4\"><h4>停留稳定期</h4><p><span><em>0</em>%</span><b>--</b></p></li>\n                            <li data-type=\"5\" class=\"lifeCycleList_two\"><h4>休眠期</h4><p><span><em>0</em>%</span><b>--</b></p></li>\n                            <li data-type=\"6\" class=\"lifeCycleList_three\"><h4>流失期</h4><p><span><em>0</em>%</span><b>--</b></p></li>\n                        </ul>\n                    </dd>\n                </dl>\n                <dl  class=\"lifeCycleList_xmq\">\n                    <dt><h3>休眠期</h3><p><span><em>0</em>%</span>起始时刻</p><h4>--</h4></dt>\n                    <dd>\n                        <ul>\n                            <li data-type=\"5\"><h4>停留休眠期</h4><p><span><em>0</em>%</span><b>--</b></p></li>\n                            <li><h4>休眠浅度访客</h4><p><span><em>0</em>%</span><b>--</b></p></li>\n                            <li><h4>休眠深度访客</h4><p><span><em>0</em>%</span><b>--</b></p></li>\n                            <li data-type=\"2\" class=\"lifeCycleList_one\"><h4>新客户期</h4><p><span><em>0</em>%</span><b>--</b></p></li>\n                            <li data-type=\"3\" class=\"lifeCycleList_two\"><h4>成长期</h4><p><span><em>0</em>%</span><b>--</b></p></li>\n                            <li data-type=\"4\" class=\"lifeCycleList_three\"><h4>稳定期</h4><p><span><em>0</em>%</span><b>--</b></p></li>\n                            <li data-type=\"6\" class=\"lifeCycleList_four\"><h4>流失期</h4><p><span><em>0</em>%</span><b>--</b></p></li>\n                            <li data-type=\"7\" class=\"lifeCycleList_five\"><h4>召回期</h4><p><span><em>0</em>%</span><b>--</b></p></li>\n                        </ul>\n                    </dd>\n                </dl>\n                <dl class=\"lifeCycleList_lsq\">\n                    <dt><h3>流失期</h3><p><span><em>0</em>%</span>起始时刻</p><h4>--</h4></dt>\n                    <dd>\n                        <ul>\n                            <li data-type=\"6\"><h4>停留流失期</h4><p><span><em>0</em>%</span><b>--</b></p></li>\n                            <li data-type=\"2\" class=\"lifeCycleList_one\"><h4>新客户期</h4><p><span><em>0</em>%</span><b>--</b></p></li>\n                            <li data-type=\"3\" class=\"lifeCycleList_two\"><h4>成长期</h4><p><span><em>0</em>%</span><b>--</b></p></li>\n                            <li data-type=\"4\" class=\"lifeCycleList_three\"><h4>稳定期</h4><p><span><em>0</em>%</span><b>--</b></p></li>\n                            <li data-type=\"7\" class=\"lifeCycleList_four\"><h4>召回期</h4><p><span><em>0</em>%</span><b>--</b></p></li>\n                        </ul>\n                    </dd>\n                </dl>\n                <dl>\n                    <dt><h3>召回期</h3><p><span><em>0</em>%</span>起始时刻</p><h4>--</h4></dt>\n                    <dd>\n                        <ul>\n                            <li data-type=\"7\"><h4>停留召回期</h4><p><span><em>0</em>%</span><b>--</b></p></li>\n                            <li data-type=\"3\" class=\"lifeCycleList_two\"><h4>成长期</h4><p><span><em>0</em>%</span><b>--</b></p></li>\n                            <li data-type=\"5\" class=\"lifeCycleList_three\"><h4>休眠期</h4><p><span><em>0</em>%</span><b>--</b></p></li>\n                        </ul>\n                    </dd>\n                </dl>";
        $('#' + this.scopeID).find("div[commonLifeCycleList]").html(option)
    }

    private renderHtml(data: any): void {
        let $dl = $('#' + this.scopeID).find("div[commonLifeCycleList] dl");
        if(data.length > 0){
            for(let i=0;i<$dl.length;i++){
                for(let item of data){
                    if((i + 1) == parseInt(item.name)){
                        $($dl[i]).find('dt h4').text(Utils.parseFormatNum(item.value,0));
                        $($dl[i]).find('dt span em').text(item.value_占比);
                        this.getListData(item.name,item.value)
                    }
                }
            }
            this.renderTitleBoolean = true;
        }else{
            this.renderlist();
            this.renderTitleBoolean = false;
        }
    }

    private getListData(cycle:any,value:any){
        let _self = this;
        //发送请求
        $.ajax({
            //开发地址
            url: PATHJSON.urlHostLifeCycleList +'/dmp-web/modeLifeCycle/portrait' + "?brand=" + _self.saveFilterObj.brand + "&channel=" + _self.saveFilterObj.channel + "&calculatedDateBegin=" + _self.saveFilterObj.start + "&calculatedDateEnd="  + _self.saveFilterObj.end + "&cycle=" + cycle,
            type: 'GET',
            success: function (data: any) {
                _self.renderListHtml(JSON.parse(data),cycle,value);
            },
            error: function (data: any) {
                // data = [{"cycle":"1","value":2000}];
                // console.log("22222",cycle,value)
            }
        })
    }

    private renderListHtml(data:any,cycle:any,value:any){
        let $dl = $('#' + this.scopeID).find("div[commonLifeCycleList] dl");
        for(let i=0;i<$dl.length;i++){
            if(data.length > 0){
                for(let item of data){
                    if((i + 1) == cycle){
                        let $li = $($dl[i]).find('ul li');
                        for(let k=0; k<$li.length;k++){
                            let $litype = $($li[k]).attr("data-type");
                            if(item.cycle == $litype){
                                $($li[k]).find('p b').text(Utils.parseFormatNum(item.value,0));
                                $($li[k]).find('p span em').text((parseInt(item.value)/parseInt(value) * 100).toFixed(2))
                            }
                        }
                    }
                }

            }else{
                if((i + 1) == cycle){
                    let $li = $($dl[i]).find('ul li');
                    for(let k=0; k<$li.length;k++){
                        $($li[k]).find('p b').text("--");
                        $($li[k]).find('p span em').text(0)
                    }
                }


            }
        }
    }

    private postChange(postQuery: any) {
        let sendObj: Object = Object.assign(
            super.transformInput('scopeID', this.scopeID),
            super.transformInput('result', postQuery)
        );
        super.onChange(this, sendObj);
    }
}