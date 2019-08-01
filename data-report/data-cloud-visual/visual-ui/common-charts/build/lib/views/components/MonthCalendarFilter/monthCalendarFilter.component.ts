
import { BaseComponent } from "../base.component";
import { MonthCalendarFilterTemplate } from "./monthCalendarFilter.template";
import { MonthCalendarFilterModel } from './monthCalendarFilter.model';
import * as $ from 'jquery';
import calandar = require('./calendar.js');
import {Utils} from '../../../../public/scripts/utils';
import {DataSourceConfig} from "../../../dataSourceConfig";


export class MonthCalendarFilterComponent extends BaseComponent {

    private myPrimeui: any = null;
    private filterData: MonthCalendarFilterModel = null;
    private filterScopeIDObj: any = null;
    private monthArray: Array<any> = [];
    private listMonthArr: Array<any> = [];

    constructor() {

        super();

        let template = new MonthCalendarFilterTemplate(this.scopeID);

        //获得模板渲染后的节点
        this.element = this.render(template);
        this.filterData = new MonthCalendarFilterModel();

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
            if (changeObj.filter !== undefined && changeObj.filter == "filter") {
                return;
            } else {
                this.filterScopeIDObj = changeObj.result;
            }
        } else {
            return;
        }

    }

    public dataChange(data: any): void {

    }

    public styleChange(style: any): void {

    }
    public loadData(): void {


    }

    //日历控件
    public renderDate(time: any, days: any, month: any, dateType: any): void {


    }
    public fomatDate(): void {


    }

    public eventBindHtml() {
        let that = this;
        let text = $(this).attr('data-type'),
            monthDate:any;

        if(DataSourceConfig.getMonthFormatDate() == DataSourceConfig.getTodayFormatDate()){
            that.monthArray.push({
                month: DataSourceConfig.getValueFormatDate(1)
            })
            monthDate = DataSourceConfig.getValueFormatDate(1);
        }else{
            that.monthArray.push({
                month: Utils.changeDate(DataSourceConfig.getMonthFormatDate(),"-","")
            })
            monthDate = DataSourceConfig.getMonthFormatDate();
        }


        that.listMonthArr.push({
            month: DataSourceConfig.getMonthShowFormatDate(),
            day: monthDate
        });
        that.renderMonthHtml(that.listMonthArr);

        calandar.calendarMonth("#calendar", function (data: any) {
            console.log(data, 'ts里边拿到没---日日--？',data.monthEnd);
            //发送请求
            $('.date-calendar').text(data.monthEnd);
            let date = Utils.changeDate(data.end,"/","");
            that.renderMonthHtml(that.decideMonth(data.monthEnd,that.listMonthArr,date));
            that.decideArr();
            // console.log(date,DataSourceConfig.getTodayFormatDate())
            if(date == DataSourceConfig.getTodayFormatDate()){
                date = DataSourceConfig.getValueFormatDate(1)
            }
            that.changePostChange(that.changeFilterArray(that.decideMonth(date,that.monthArray,date)));

        });

        //1.显示隐藏指标面板
        $('.filter-choice').click(function (e) {
            $('.filter-choice-list').fadeIn();
            e.stopPropagation();
        });
        $(document).click(function () {
            $('.filter-choice-list').fadeOut();
        });

        $(document).ready(function() {
            let $componentBody = $(document.body);
            $componentBody.on('click','.monthCalendar_list span',(event:any)=>{
                let $target = $(event.target);
                that.renderMonthHtml(that.deleteListMonthArr($target.siblings('em').text(), that.listMonthArr));
                that.changePostChange(that.changeFilterArray(that.deleteListMonthArr(Utils.changeDate($target.attr('data-day'), "-", ""), that.monthArray)))
                that.decideArr();
                event.stopPropagation();
            })
        })

    }

    //从数组中删除
    private deleteListMonthArr(text:any,arr:any){
        for(let i=0; i<arr.length; i++){
            if(arr[i].month == text){
                arr.splice(i,1)
            }
        }
        return arr;
    }

    private decideArr(){
        if(this.listMonthArr.length > 4){
            $("#" + this.scopeID).find('.monthCalendar_button').addClass("monthCalendar_none");
            $("#" + this.scopeID).find('.monthCalendarFilter').addClass("poinent_none");
        }else{
            $("#" + this.scopeID).find('.monthCalendar_button').removeClass("monthCalendar_none")
            $("#" + this.scopeID).find('.monthCalendarFilter').removeClass("poinent_none");

        }
    }

    private renderMonthHtml(arr:any){
        let option = "";
        for(let item of arr){
            option += '<li><span data-day='+item.day+'></span><em>' + item.month+ '</em></li>'
        }
        $("#"+this.scopeID).find('.monthCalendar_list').html(option)
    }

    private decideMonth(monthEnd:any,arr:any,dayEnd:any){
        let monthBool = false;
        for(let item of arr){
            if (item.month == monthEnd){
                monthBool = true;
            }
        }
        if(!monthBool){
            arr.push({month:monthEnd,day:dayEnd})
        }
        return arr
    }

    protected init(): void {
        let that = this;
        this.eventBindHtml();
    }
    private changePostChange(filterArray: any) {
        if (!this.isEmptyObject(this.filterScopeIDObj)) {

            let resultObj: any = super.transformInput('date',filterArray);
            let sendObj: Object = Object.assign(
                super.transformInput('scopeID', this.scopeID),
                super.transformInput('filterObj', this.filterScopeIDObj),
                super.transformInput('result', resultObj)
            );
            super.sendMessageBase(this, sendObj);

        } else {
            return;
        }
    }

    private changeFilterArray(monthArray: any) {
        let valueArr:Array<any> = [];
        for(let item of monthArray){
            valueArr.push(item.month)
        }
        let changePostFilterObj: Array<any> = [
            {"field":"calculated_date","operator":"in","value":valueArr.toString()}
        ];

        return changePostFilterObj;
    }

}