/**
 * Created by zhaoxue on 2017/3/28.
 */
import {BaseComponent} from "../base.component";
import {SelectFilterTemplate} from "./selectFilter.template";
import {Utils} from '../../../../public/scripts/utils';
import {SelectFilterModel} from './selectFilter.model';
import {BaseCharts} from '../../base/base.chart';
import * as $ from 'jquery';

export class SelectFilterComponent extends BaseComponent {
    private myChart: any = null;
    private chartData: any = null;
    private selectFilterData: SelectFilterModel = null;
    private echartData: any = null;
    private getSoreceData: any = null;
    private styleObj: any = null;
    private changeObj: any = null;
    private body: any = {};
    private filterValue: any = null;//选中的值
    private filterName: any = null;//选中的名称
    private filterType: any = null;
    private filterScopeIDObj: any = null;
    private topLevelFilter: boolean = false;
    private changePostFilterArray: Array<any> = [];
    private selectName: string = "";
    private postFilterField: string = "";

    private indicateMap = {
        "active_new_users": "入店新客",
        "active_old_users": "入店老客",
        "high_active_users": "入店高活跃客流",
        "middle_active_users": "入店中活跃客流",
        "low_active_users": "入店低活跃客流",
        "sleep_active_users": "入店睡眠客流",
        "high_stay_users": "停留高活跃客流",
        "middle_stay_users": "停留中活跃客流",
        "low_stay_users": "停留低活跃客流",
        "sleep_stay_users": "停留睡眠客流",

        "stay_new_users": "停留新客",
        "stay_old_users": "停留老客",

        "front_users": "周边客流",
        "jump_users": "跳出客流",
        "stay_users": "停留客流",
        //"member_count": "会员到访",
        "potential_count": "微信认证数",
        "member_count": "手机认证数",

        "ROUND(sum(active_users)/sum(front_users)*100,2)": "入店率",
        "ROUND(sum(stay_users)/sum(active_users)*100,2)": "停留率"

    };

    constructor() {
        super();
        let template = new SelectFilterTemplate(this.scopeID);

        //获得模板渲染后的节点
        this.element = this.render(template);
        this.selectFilterData = new SelectFilterModel();

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
            if (changeObj.result.topLevelFilter) {
                this.topLevelFilter = changeObj.result.topLevelFilter;
            }
            this.decideFilterType(changeObj.result)

        } else {
            return;
        }

    }

    private decideFilterType(result: any) {
        this.selectName = result.selectName;
        switch (result.selectName) {
            case "select_1":
                this.postFilterField = result.selectType;
                this.postChange(this.body, result.selectType)
                break;
            case "select_2":
                let $divHtml = $('#' + this.scopeID).find('div[data-type="date_title"] em');
                $divHtml.html(result.selectTitleName);

                let $div = $('#' + this.scopeID).find('ul[data-type="filter_select"]');
                this.renderSelectListHtml($div, result.selectContentList);
                break;
            case "select_3":

                let date = new Date();
                let prefix = "";
                if ((date.getMonth() + 1) < 10) {
                    prefix = "0";
                }
                let title = date.getFullYear() + "-" + prefix + (date.getMonth() + 1);

                let titleDom = $('#' + this.scopeID).find('div[data-type="date_title"] em');
                titleDom.html(title);

                let list = [];

                for (let i = 0, j = date.getMonth(), k = date.getFullYear(); i < 12; i++, j--) {
                    if (j < 0) {
                        j = 11;
                        k = k - 1;
                    }

                    let month = new String(j + 1);
                    if ((j + 1) < 10) {
                        month = "0" + month;
                    }

                    list.push({
                        "key": k + "-" + month,
                        "value": k + "-" + month
                    });
                }

                let listDom = $('#' + this.scopeID).find('ul[data-type="filter_select"]');
                this.renderSelectListHtml(listDom, list);
                break;
        }
    }

    public filterChange(event: any, data: any): void {

    }

    public dataChange(data: any): void {
        if (this.selectName == "select_1") {
            let $divHtml = $('#' + this.scopeID).find('div[data-type="date_title"] em');
            if (data.length > 0) {
                $divHtml.html(data[0].value)
            }

            let $div = $('#' + this.scopeID).find('ul[data-type="filter_select"]')
            this.renderSelectListHtml($div, data);
        }
    }

    //渲染第一个下拉框list
    private renderSelectListHtml($div: any, data: any): void {
        let optionList: string = "";

        if (data.length > 0) {
            for (let item of data) {
                optionList += '<li data-id=' + JSON.stringify(item.key) + '>' + item.value + '</li>'
            }
        } else {
            optionList += '<p>暂无数据</p>'
        }

        $div.html(optionList);
    }

    public styleChange(style: any): void {

    }

    public loadData(): void {

    }

    public get data(): any {
        return this.chartData;
    }

    protected init(): void {
        this.renderRFMFilterHtml();
        this.commonChange();
    }

    private commonChange() {
        let _self = this;

        // 点击blank
        $(document).click(function (event) {
            $('.rfmFilter_list_layer').hide();
        });

        $(document).ready(function () {
            let $rfmFilter = $('#' + _self.scopeID).find('div[rfmFilter]');

            //click get dropdown get list
            $rfmFilter.on('click', '.lifecycle_top_list', (event: any) => {
                $(document.body).find('.table-selectline-list').hide();
                let $selectList = $(event.target).siblings('.rfmFilter_list_layer');
                $('.rfmFilter_list_layer').hide();
                $selectList.show();
                event.stopPropagation();
            })

            //click choose list
            $rfmFilter.on('click', '.rfmFilter_list_layer', (event: any) => {
                $(document.body).find('.table-selectline-list').hide();
                let $tagget = $(event.currentTarget);
                $tagget.siblings().find("em").text($(event.target).text());
                //点击设置已选择的value
                _self.filterValue = $(event.target).attr("data-id");
                _self.filterName = $(event.target)[0].innerHTML;
                //发送请求
                _self.decidePostChange(_self.filterValue);
            })
        })
    }

    private decidePostChange(value: any) {
        switch (this.filterScopeIDObj.selectName) {
            case "select_1":
                this.parameterPostChange(this.changeFilterArray(this.postFilterField, this.filterValue));
                break;
            case "select_2":
                this.metricChange(this.changeMetricArray(this.filterValue));
                break;
            case "select_3":
                this.dateFilterPostChange(this.changeFilterArray("end_date", this.filterValue));
                break;
        }
    }

    private parameterPostChange(filterArray: any) {
        let sendObj: Object = Object.assign(
            super.transformInput('scopeID', this.scopeID),
            super.transformInput('filterObj', this.filterScopeIDObj),
            super.transformInput('result', Object.assign(super.transformInput('filter', filterArray)))
        );

        super.sendMessageBase(this, sendObj);
    }

    private dateFilterPostChange(filterArray: any) {
        let sendObj: Object = Object.assign(
            super.transformInput('scopeID', this.scopeID),
            super.transformInput('filterObj', this.filterScopeIDObj),
            super.transformInput('result', Object.assign(super.transformInput('date', filterArray)))
        );

        super.sendMessageBase(this, sendObj);
    }

    private metricChange(filterArray: any) {
        let sendObj: Object = Object.assign(
            super.transformInput('scopeID', this.scopeID),
            super.transformInput('filterObj', this.filterScopeIDObj),
            super.transformInput('result', Object.assign(super.transformInput('metrics', filterArray)))
        );

        super.sendMessageBase(this, sendObj);
    }

    //渲染html
    private renderRFMFilterHtml() {
        let optionList: string = "";
        optionList += '<div class="lifecycle_top_list">'
        optionList += '<div class="lifecycle_top_list_title" data-type="date_title"><span></span><em>请选择</em></div>'
        optionList += '<div class="rfmFilter_list_layer lifecycle_top_list_layer">'
        optionList += '<ul data-type="filter_select"></ul>'
        optionList += '</div>'
        optionList += '</div>'
        $('#' + this.scopeID).find(".selectFilter").html(optionList);
    }

    private changeFilterArray(type: any, value: any) {
        if (this.changePostFilterArray.length > 0) {
            for (let item of this.changePostFilterArray) {
                if (item.field == type) {
                    item.value = value;
                }
            }
        } else {
            this.changePostFilterArray = [{
                field: type,
                operator: "=",
                value: value
            }]
        }

        return this.changePostFilterArray;
    }

    private changeMetricArray(value: any) {
        let metricArray = [];
        let metricArr = value.split("|"), obj = {};
        for (let i = 0; i < metricArr.length; i++) {
            obj = {'field': metricArr[i], 'alias': this.indicateMap[metricArr[i]]};
            metricArray.push(obj)
        }
        return metricArray;
    }

    private postChange(postQuery: any, type: any) {
        switch (type) {
            case "brand":
                postQuery = {
                    "datasource_id": 55,
                    "dimensions": [{"field": "brand_name", "alias": "key"}, {"field": "brand_value", "alias": "value"}]
                };
                break;
            case "channel":
                postQuery = {
                    "datasource_id": 59,
                    "dimensions": [{"field": "channel_name", "alias": "key"}, {
                        "field": "channel_value",
                        "alias": "value"
                    }]
                };
                break;
        }
        let sendObj: Object = Object.assign(
            super.transformInput('scopeID', this.scopeID),
            super.transformInput('result', postQuery)
        );
        super.onChange(this, sendObj);
    }
}