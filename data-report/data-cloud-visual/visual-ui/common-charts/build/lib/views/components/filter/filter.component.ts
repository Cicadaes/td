
import { BaseComponent } from "../base.component";
import { FilterTemplate } from "./filter.template";
import { FilterModel } from './filter.model';
import * as $ from 'jquery';

import calandar = require('./calendar.js');
export class FilterComponent extends BaseComponent {

    private myPrimeui: any = null;
    private filterData: FilterModel = null;
    private filterScopeIDObj: any = null;
    dateType: any = 'day';
    constructor() {

        super();

        let template = new FilterTemplate(this.scopeID);

        //获得模板渲染后的节点
        this.element = this.render(template);
        this.filterData = new FilterModel();

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
        let text = $(this).attr('data-type');
        $('.date-calendar').text(this.getFormatDate(30) + '~' + this.getFormatDate(1));
        calandar.calendarDay("#calendar", function (data: any) {
            //发送请求
            $('.date-calendar').text(data.start + '~' + data.end);
            that.changePostChange(that.changeFilterArray(data.start, data.end), text);

        });


        //1.显示隐藏指标面板
        $('.filter-choice').click(function (e) {
            $('.filter-choice-list').fadeIn();
            e.stopPropagation();
        });
        $(document).click(function () {
            $('.filter-choice-list').fadeOut();
        });
        //2.选中某个指标
        $('.filter-choice-list li').click(function (e) {

            let text = $(this).attr('data-type');
            let showText = '';
            $('#calendar').html('');
            switch (text) {
                case 'day':
                    //默认7天
                    showText = '按天查看';
                    calandar.calendarDay("#calendar", function (data: any) {
                        console.log(data, 'ts里边拿到没---日日--？');
                        $('.date-calendar').text(data.start + '~' + data.end);
                        //发送请求
                        that.changePostChange(that.changeFilterArray(data.start, data.end), text);

                    });

                    break;
                case 'week':
                    //默认8周
                    showText = '按周查看';
                    $('.date-calendar').text(that.getFormatDate(28) + '~' + that.getFormatDate(1));
                    calandar.calendarWeek("#calendar", function (data: any) {
                        console.log(data, 'ts里边拿到没--周周---？');
                        data.start = data.start.replace(/\//g,"-");   
                        data.end = data.end.replace(/\//g,"-");
                        $('.date-calendar').text(data.start + '~' + data.end);
                        //发送请求
                        that.changePostChange(that.changeFilterArray(data.weekStart, data.weekEnd), text);

                    });
                    
                    break;
                case 'month':
                    //默认6个月
                    showText = '按月查看';
                    $('.date-calendar').text(that.getFormatDate(180) + '~' + that.getFormatDate(1));
                    calandar.calendarMonth('#calendar',function(data:any){
                        //debugger
                        console.log(data, 'ts里边拿到没---月月--？');
                        data.start = data.start.replace(/\//g,"-");   
                        data.end = data.end.replace(/\//g,"-");
                        $('.date-calendar').text(data.start + '~' + data.end);
                        //发送请求
                        that.changePostChange(that.changeFilterArray(data.monthStart, data.monthEnd), text);
                    });

                    break;
            }
            $('.show-date').text(showText);
            $('.filter-choice-list').fadeOut();
            e.stopPropagation();
        });

    }

    protected init(): void {
        let that = this;
        this.eventBindHtml();
    }
    private changePostChange(filterArray: any, dateType:any) {
        if (!this.isEmptyObject(this.filterScopeIDObj)) {

            let resultObj: any = super.transformInput('date',filterArray);
            resultObj["dateType"] = dateType;
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

    private changeFilterArray(start: any, end: any) {
        let changePostFilterObj: Array<any> = [
            { 'field': 'date', 'operator': '>=', 'value': start },
            { 'field': 'date', 'operator': '<=', 'value': end },
        ];

        return changePostFilterObj;
    }
    
}