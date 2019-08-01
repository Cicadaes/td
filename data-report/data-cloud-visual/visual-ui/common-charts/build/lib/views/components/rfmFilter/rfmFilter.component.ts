/**
 * Created by zhaoxue on 2017/3/28.
 */
import { BaseComponent } from "../base.component";
import { RFMFilterTemplate } from "./rfmFilter.template";
import { Utils } from '../../../../public/scripts/utils';
import { RFMFilterModel } from './rfmFilter.model';
import { BaseCharts } from '../../base/base.chart';
import * as $ from 'jquery';


export class RFMFilterComponent extends BaseComponent {
    private myChart: any = null;
    private chartData: any = null;
    private rfmFilterData: RFMFilterModel = null;
    private echartData: any = null;
    private getSoreceData: any = null;
    private styleObj: any = null;
    private changeObj: any = null;
    private body: any = {};
    private filterValue:any = null;
    private filterType:any = null;
    private filterScopeIDObj:any = null;
    private topLevelFilter:boolean = false;
    private changePostFilterArray:Array<any> = [
        {"field": 'year_month',"operator": "=","value": "201710"},
        {"field": 'brand_name',"operator": "=","value": "all"},
        {"field": 'channel_name',"operator": "=","value": "all"}
    ];
    private filterDate:string = "";
    private filterBrand:string = "all";
    private filterChannel:string = "all";
    private filterYearMonth:string = "";
    private postDate:boolean = false;
    private postBrand:boolean = false;
    private postChannel:boolean = false;
    private rfmChart:boolean = false;

    constructor() {
        super();
        let template = new RFMFilterTemplate(this.scopeID);

        //获得模板渲染后的节点
        this.element = this.render(template);
        this.rfmFilterData = new RFMFilterModel();

    }

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


    public getconfiginformation(event: any, changeObj: any): void {
        if(!this.isEmptyObject(changeObj.result)){
            if(changeObj.result && changeObj.result.readyBuildQuery){
                this.filterScopeIDObj = changeObj.result;
                this.topLevelFilter = changeObj.result.topLevelFilter;
                this.postDate = false;
                this.postBrand = false;
                this.postChannel = false;
                this.postChange({"datasource_id":54});
            }
        }else{
            return;
        }

    }

    public filterChange(event:any,data: any): void {

    }


    public dataChange(data: any): void {
        let $divDateHtml = $('#'+this.scopeID).find('div[data-type="date_title"]'),
            $divBrandHtml = $('#'+this.scopeID).find('div[data-type="brand_title"]');
        if(!this.postDate){
            if(data.length > 0){
                this.filterDate = data[0].value;
                this.filterYearMonth = data[0].key;
                $divDateHtml.html(data[0].value)
            }else{
                this.filterDate = "2017-11-01~2017-11-30";
                this.filterYearMonth = "201711";
            }

            let $div = $('#'+this.scopeID).find('ul[data-type="filter_date"]')
            this.postDate = true;
            this.postBrand = true;
            this.renderSelectListHtml($div,data);
            this.postChange({"datasource_id":55,"dimensions":[{"field":"brand_name","alias":"key"},{"field":"brand_value","alias":"value"}]});
            return;
        }


        if(this.postBrand && $divDateHtml.text() !== "请选择"){
            if(data.length > 0){
                $divBrandHtml.html(data[0].value)
            }
            let $div = $('#'+this.scopeID).find('ul[data-type="filter_brand"]')
            this.renderSelectListHtml($div,data);
            this.postBrand = false;
            this.postChannel = true
            this.postChange({"datasource_id":56,"dimensions":[{"field":"channel_name","alias":"key"},{"field":"channel_value","alias":"value"}]})
            return;
        }

        if(this.postDate && !this.postBrand && this.postChannel && $divBrandHtml.text() !== "请选择"){
            if(data.length > 0){
                $('#'+this.scopeID).find('div[data-type="channel_title"]').html(data[0].value)
            }
            let $div = $('#'+this.scopeID).find('ul[data-type="filter_channel"]')
            this.renderSelectListHtml($div,data);
            this.postChannel = false;

            if(this.postDate && !this.postBrand && !this.postChannel){
                this.changePostFilterArray[0].value = this.filterYearMonth;
                //发送请求
                this.parameterPostChange(this.changePostFilterArray);
            }
        }
    }

    //渲染第一个下拉框list
    private renderSelectListHtml($div:any,data:any): void{
        let optionList:string = "";

        if(data.length > 0){
            for(let item of data){
                optionList += '<li data-id='+item.key+'>' + item.value + '</li>'
            }
        }else{
            optionList += '<p>暂无数据</p>'
        }

        $div.html(optionList);
    }

    public styleChange(style: any): void {

    }

    public loadData(): void {
        this.init();
    }

    public get data(): any {
        return this.chartData;
    }

    protected init(): void {
        this.renderRFMFilterHtml();
        this.commonChange();
    }

    private commonChange(){
        let _self = this;

        // 点击blank
        $(document).click(function(event){
            $('.rfmFilter_list_layer').hide();
        });

        $(document).ready(function(){
            let $rfmFilter = $('#'+_self.scopeID).find('div[rfmFilter]');

            //click get dropdown get list
            $rfmFilter.on('click','.rfmFilter_list', (event:any)=>{
                $(document.body).find('.table-selectline-list').hide();
                let $selectList = $(event.target).siblings('.rfmFilter_list_layer');
                $('.rfmFilter_list_layer').hide();
                $selectList.show();
                event.stopPropagation();
            })

            //click choose list
            $rfmFilter.on('click','.rfmFilter_list_layer', (event:any)=>{
                $(document.body).find('.table-selectline-list').hide();
                let $tagget = $(event.currentTarget);
                $tagget.siblings().text($(event.target).text());
                //点击设置已选择的value
                _self.filterValue = $(event.target).text();
                if(_self.filterValue == "全部品牌" || _self.filterValue == "全部渠道"){
                    _self.filterValue = "all"
                }
                //点击设置选择的类型
                _self.filterType = $tagget.parent().attr("data-type");
                if(_self.filterType == "year_month"){
                    _self.filterDate = _self.filterValue;
                    _self.filterValue = $(event.target).attr("data-id");
                    _self.filterYearMonth = _self.filterValue;
                }else if(_self.filterType == "brand_name"){
                    _self.filterBrand = _self.filterValue;
                }else if(_self.filterType == "channel_name"){
                    _self.filterChannel = _self.filterValue;
                }
                //发送请求
                _self.parameterPostChange(_self.changeFilterArray(_self.filterType,_self.filterValue));
            })
        })
    }

    //渲染html
    private renderRFMFilterHtml(){
        let optionList:string = "";
        optionList += '<div class="rfmFilter_list" style="width: 200px" data-type="year_month">'
        optionList += '<div class="rfmFilter_list_title" data-type="date_title">请选择</div>'
        optionList += '<div class="rfmFilter_list_layer">'
        optionList += '<ul data-type="filter_date"></ul>'
        optionList += '</div>'
        optionList += '</div>'
        optionList += '<div class="rfmFilter_list" data-type="brand_name">'
        optionList += '<div class="rfmFilter_list_title" data-type="brand_title">请选择</div>'
        optionList += '<div class="rfmFilter_list_layer">'
        optionList += '<ul data-type="filter_brand"></ul>'
        optionList += '</div>'
        optionList += '</div>'
        optionList += '<div class="rfmFilter_list" data-type="channel_name">'
        optionList += '<div class="rfmFilter_list_title" data-type="channel_title">请选择</div>'
        optionList += '<div class="rfmFilter_list_layer">'
        optionList += '<ul data-type="filter_channel"></ul>'
        optionList += '</div>'
        optionList += '</div>'
        $('#'+this.scopeID).find(".rfmFilter").html(optionList);
    }

    private parameterPostChange(filterArray:any){
        this.rfmChart = true;
        let sendObj:Object = Object.assign(
            super.transformInput('scopeID',this.scopeID),
            super.transformInput('filterObj',this.filterScopeIDObj),
            super.transformInput('result',
                Object.assign(
                    super.transformInput('filter',filterArray),
                    super.transformInput('chart',{
                        date:this.filterDate,
                        yearMonth:this.filterYearMonth,
                        brand:this.filterBrand,
                        channel:this.filterChannel
                    }))
            )
        );

        super.sendMessageBase(this,sendObj);
    }

    private changeFilterArray(type:any,value:any){
        for(let item of this.changePostFilterArray){
            if(item.field == type){
                item.value = value;
            }
        }
        return this.changePostFilterArray;
    }

    private postChange(postQuery:any){
        let sendObj:Object = Object.assign(
            super.transformInput('scopeID',this.scopeID),
            super.transformInput('result',postQuery)
        );
        super.onChange(this,sendObj);
    }
}