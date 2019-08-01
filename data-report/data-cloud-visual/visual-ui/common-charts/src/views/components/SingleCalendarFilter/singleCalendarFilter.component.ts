
import { BaseComponent } from "../base.component";
import { SingleCalendarFilterTemplate } from "./singleCalendarFilter.template";
import { SingleCalendarFilterModel } from './singleCalendarFilter.model';
import * as $ from 'jquery';

import calandar = require('./calendar.js');
import {Utils} from '../../../../public/scripts/utils';
import {DataSourceConfig} from "../../../dataSourceConfig";


export class SingleCalendarFilterComponent extends BaseComponent {

    private myPrimeui: any = null;
    private filterData: SingleCalendarFilterModel = null;
    private filterScopeIDObj: any = null;
    dateType: any = 'day';
    constructor() {

        super();

        let template = new SingleCalendarFilterTemplate(this.scopeID);

        //获得模板渲染后的节点
        this.element = this.render(template);
        this.filterData = new SingleCalendarFilterModel();

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
        $('#' + that.scopeID).find(".date-calendar").text(that.getFormatDate(1));
        calandar.calendarDay("#singleCalendar", function (data: any) {
            console.log(data, 'ts里边拿到没---日日--？9999');
            //发送请求
            $('.date-calendar').text(data.end);
            data.start = DataSourceConfig.getLastMonthFormatDate(29,Utils.changeDate(data.end,"-","/"))
            data.end = Utils.changeDate(data.end,"-","")

            that.changePostChange(that.changeFilterArray(data.start, data.end));

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

    private changeFilterArray(start: any, end: any) {
        let changePostFilterObj: Array<any> = [
            {"field":"calculated_date","operator":">=","value":start},
            {"field":"calculated_date","operator":"<=","value":end}
        ];

        return changePostFilterObj;
    }
    
}