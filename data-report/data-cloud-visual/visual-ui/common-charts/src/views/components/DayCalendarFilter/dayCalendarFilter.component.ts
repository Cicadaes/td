
import { BaseComponent } from "../base.component";
import { DayCalendarFilterTemplate } from "./dayCalendarFilter.template";
import { DayCalendarFilterModel } from './dayCalendarFilter.model';
import * as $ from 'jquery';

import calandar = require('./calendar.js');
import {Utils} from '../../../../public/scripts/utils';


export class DayCalendarFilterComponent extends BaseComponent {

    private myPrimeui: any = null;
    private filterData: DayCalendarFilterModel = null;
    private filterScopeIDObj: any = null;
    dateType: any = 'day';
    constructor() {

        super();

        let template = new DayCalendarFilterTemplate(this.scopeID);

        //获得模板渲染后的节点
        this.element = this.render(template);
        this.filterData = new DayCalendarFilterModel();

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
        $('.date-calendar').text(this.getFormatDate(30) + '~' + this.getFormatDate(1));
        calandar.calendarDay("#dayCalendar", function (data: any) {
            //发送请求
            $('.date-calendar').text(data.start + '~' + data.end);
            that.changePostChange(that.changeFilterArray(data.start, data.end),{start:Utils.changeDate(data.start,"-",""),end:Utils.changeDate(data.end,"-","")});

        });


        //1.显示隐藏指标面板
        $('.filter-choice').click(function (e) {
            $('.filter-choice-list').fadeIn();
            e.stopPropagation();
        });
        $(document).click(function () {
            $('.filter-choice-list').fadeOut();
        });

    }

    protected init(): void {
        let that = this;
        this.eventBindHtml();
    }
    private changePostChange(filterArray: any,filterObj: Object) {
        if (!this.isEmptyObject(this.filterScopeIDObj)) {

            let resultObj: any = Object.assign(super.transformInput('date',filterArray),super.transformInput('filterDate',filterObj))
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
            {"field":"calculated_date","operator":"=","value": Utils.changeDate(start,"-","")}
        ];

        return changePostFilterObj;
    }
    
}