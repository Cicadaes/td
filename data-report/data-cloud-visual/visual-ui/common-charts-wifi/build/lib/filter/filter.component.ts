
import { BaseComponent } from "../base.component";
import { FilterTemplate } from "./filter.template";
import { FilterModel } from './filter.model';
import * as $ from 'jquery';
// import * as pickerDateRange from './dateRange.js';



export class FilterComponent extends BaseComponent {

    private myPrimeui: any = null;
    private filterData: FilterModel = null;
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

    }

    public beforeDestory(): void {

    }

    public afterDestory(): void {

    }

    public resize(): void {

    }

    public dataChange(data: any): void {

    }

    public styleChange(style: any): void {

    }
    public loadData(): void {
        this.init();
    }
    public addScript() {
        let oScript = document.createElement('script');
        oScript.src = './dateRange.js';
        $('#' + this.scopeID).append(oScript);
    }
    //日历控件
    public renderDate(time: any, days: any, month: any): void {
        function toDou(iNum: any) {
            return iNum < 10 ? '0' + iNum : '' + iNum;
        }
        function getDateTime(time: any, days: any, month: any) {
            var oDate = new Date(time - days * 24 * 3600 * 1000);
            //debugger
            return oDate.getFullYear() + '-' + toDou(oDate.getMonth() + 1 - month) + '-' + toDou(oDate.getDate());
        }
        // let dateRange: any = new pickerDateRange('date-calendar', {
        //     //aToday: 'aToday', //今天
        //     aYesterday: 'aYesterday', //昨天
        //     aRecent7Days: 'aRecent7Days', //最近7天
        //     //aRecent14Days: 'aRecent14Days', //最近14天
        //     aRecent30Days: 'aRecent30Days', //最近30天
        //     aRecent60Days: 'aRecent60Days', //最近60天
        //     //aRecent90Days: 'aRecent90Days', //最近90天
        //     isTodayValid: false, //今天是否可选
        //     defaultText: ' ~ ',
        //     inputTrigger: 'date-btn',
        //     theme: 'ta',
        //     startDate: getDateTime(time, days, month),
        //     endDate: getDateTime(time, 0, 0),
        //     success: function (obj: any) {
        //         //debugger
        //         console.log(obj, 'obj');
        //         console.log(obj.startDate, obj.endDate, '选取时间');
        //     }
        // }, $);
    }
    public eventBindHtml() {
        let that = this;
        let oDate: any = new Date().getTime();
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
            switch (text) {
                case 'day':
                    //默认7天
                    showText = '按天查看';
                    that.renderDate(oDate, 7, 0);
                    break;
                case 'week':
                    //默认8周
                    showText = '按周查看';
                    that.renderDate(oDate, 56, 0);
                    break;
                case 'month':
                    //默认6个月
                    showText = '按月查看';
                    that.renderDate(oDate, 0, 6);
                    break;
            }
            $('.show-date').text(showText);
            $('.filter-choice-list').fadeOut();
            e.stopPropagation();
        });

    }

    protected init(): void {
        //this.addScript();
        let oDate: any = new Date().getTime();
        this.eventBindHtml();
        this.renderDate(oDate, 7, 0);
    }


}