/**
 * Created by zhaoxue on 2017/3/28.
 */
import {BaseComponent} from "../base.component";
import {OverallFilterTemplate} from "./overallFilter.template";
import {Utils} from '../../../../public/scripts/utils';
import {OverallFilterModel} from './overallFilter.model';
import {BaseCharts} from '../../base/base.chart';
import * as $ from 'jquery';

export class OverallFilterComponent extends BaseComponent {
    private myChart: any = null;
    private chartData: any = null;
    private overallFilterData: OverallFilterModel = null;
    private echartData: any = null;
    private getSoreceData: any = null;
    private filterScopeIDObj: any = null;
    private filterArray: Array<any> = [];
    private saveFilterData: Array<any> = [];
    private filterType: any = 'filter-classify';
    private filterAllType: any = null;
    private filterID: any = "1";
    private filterValue: any = "";
    private filterSaveBrand: any = "全部品牌";
    private filterSaveRegion: any = "全部大区";
    private filterSaveCity: any = "全部城市";
    private changeBrandTitleBool: boolean = false;
    private changeRegionTitleBool: boolean = false;
    private changeCityTitleBool: boolean = false;
    private filterBrandTitleBool: boolean = false;
    private filterRegionTitleBool: boolean = false;
    private filterCityTitleBool: boolean = false;
    private timer: any = null;
    private filterLength: any = null;
    private filterListObj: any = null;
    private saveProject: any = null;
    private body: any = {
        "datasource_id": 27,
        'dimensions': null,
        'filters': null
    };
    private saveInputBoolean: boolean = false;
    private saveCheckedBoolean: boolean = false;
    private parameter: any = {};

    constructor() {
        super();
        let template = new OverallFilterTemplate(this.scopeID);

        //获得模板渲染后的节点
        this.element = this.render(template);
        this.overallFilterData = new OverallFilterModel();
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

    public overallFilterChange(event: any, changeObj: any): void {

        if (changeObj.result) {
            this.parameter = changeObj.result;
        }

        //拿到外界的参数
        this.filterID = parseInt(changeObj.result.projectType);
        this.projectType(parseInt(changeObj.result.projectType));
        //根据id渲染html
        this.decideFilterType(JSON.stringify(this.filterID));
        //存储外界的参数
        this.saveProject = changeObj.result;
        this.saveInputBoolean = true;
        this.saveCheckedBoolean = true;
        this.getDataPostChange(this.setBodyObj(this.filterType));
        setTimeout(() => {
            this.setInputChedked(this.saveFilterData, changeObj.result);
        }, 500)
    }

    private projectType(result: any) {
        switch (result) {
            case 1:
                $('#' + this.scopeID).find('div[componentTitleSelected]').html("按店铺查看");
                break;
            case 11:
                $('#' + this.scopeID).find('div[componentTitleSelected]').html("按城市查看");
                break;
            case 5:
                $('#' + this.scopeID).find('div[componentTitleSelected]').html("按大区查看");
                break;
            case 6:
                $('#' + this.scopeID).find('div[componentTitleSelected]').html("按品牌查看");
                break;
        }
    }

    public getconfiginformation(event: any, changeObj: any): void {
        if (!this.isEmptyObject(changeObj.result)) {
            $('#' + this.scopeID).find('p[componentDatasourceHelpText]').html(JSON.stringify(changeObj.result))

            this.filterLength = changeObj.result.filterLength || 4;
            $('.component_bottom_l', '#' + this.scopeID).find('strong').html(this.filterLength);

            let filterShopArray;
            if (changeObj.parameter && changeObj.parameter.group_sign != 'N') {
                filterShopArray = this.overallFilterData.overallFilterShopArray;
            } else {
                filterShopArray = this.overallFilterData.liteArray;
            }
            this.renderSelectListHtml($('#' + this.scopeID).find('div[componentOverallLeftList]'), filterShopArray);

            this.filterScopeIDObj = changeObj.result;
            this.parameter = changeObj.parameter;

        } else {
            return;
        }
    }

    //设置input checked 判断是否选中
    private setInputChedked(datasourceData: any, parameter: any) {
        this.saveInputBoolean = false;
        //发送请求
        this.parameterPostChange([{
            "field": 'project_id',
            "operator": "in",
            "value": (parameter.projectId).toString()
        }, {
            "field": 'projectName',
            "operator": "=",
            "value": (parameter.projectName).toString()
        }, {
            "field": 'typeInOverall',
            "operator": "=",
            "value": (parameter.projectType).toString()
        }]);

        //设置已选择的值
        $('#' + this.scopeID).find('.component_bottom_l span').text(1);
        //设置已选择的name
        this.renderOverallSelected($('.overallSelected', '#' + this.scopeID), [{
            id: parameter.projectId,
            project_name: parameter.projectName
        }])
    }

    public dataChange(data: any): void {
        if (this.filterType == "filter-all-title") {
            // this.setFilterData(this.filterAllType, data);
            let $div = $('#' + this.scopeID).find('div[data-id=' + this.filterAllType + '][data-type=' + this.filterType + ']').siblings('.component_top_select_list')
            this.decideFilterAllType(this.filterAllType, data);
            this.renderSelectListHtml($div, data);
        } else {
            this.filterListObj = data;
            this.decideDataArrayLength(data);
        }

        this.saveFilterData = data;

    }

    private decideFilterAllType(type: any, data: any) {
        switch (type) {
            case '6':
                data.unshift({id: -1, project_name: "全部品牌"})
                break;
            case '5':
                data.unshift({id: -1, project_name: "全部大区"})
                break;
            case '11':
                data.unshift({id: -1, project_name: "全部城市"})
                break;
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
        //commonchange
        setTimeout(() => {
            this.commonChange();
        }, 300)
    }

    //判断data是否为空时
    private decideDataArrayLength(data: any) {
        let $overallNode = $('#' + this.scopeID).find(".component_overall_none"),
            $overallList = $('#' + this.scopeID).find(".component_overall_list ul");

        if (data.length == 0) {
            $overallNode.html("暂无数据");
            $overallList.html("");
        } else {
            $overallNode.html("");
            //判断从外界拿到的值是否在数据里存在
            if (this.saveInputBoolean) {
                this.decideProjectData(data);
            } else {
                this.renderlistHtml(data);
            }
        }
    }

    private decideProjectData(data: any) {
        let filterProjectArray: Array<any> = [{
                id: this.saveProject.projectId,
                project_name: this.saveProject.projectName
            }],
            filterProjectBool: boolean = false,
            filterProjectData: Array<any> = data;
        this.filterArray = [];
        this.filterArray = filterProjectArray;
        for (let item of data) {
            if (parseInt(item.id) == parseInt(this.saveProject.projectId)) {
                filterProjectBool = true;
            }
        }
        if (!filterProjectBool) {
            filterProjectData.unshift({
                id: this.saveProject.projectId,
                project_name: this.saveProject.projectName
            })
        }
        ;
        this.saveInputBoolean = false;
        this.renderlistHtml(data);
        if (this.saveCheckedBoolean) {
            this.setChedked($('.component_overall_list', '#' + this.scopeID), filterProjectArray);
        }
    }

    //渲染中间选择list
    private renderlistHtml(data: any): void {
        let optionList: string = "";

        for (let item of data) {
            optionList += '<li title="' + item.project_name + '"><input type="checkbox" id=' + item.id + ' name="filter" value=' + item.project_name + '/><label for=' + item.id + '>' + item.project_name + '</label></li>';
        }

        $('#' + this.scopeID).find(".component_overall_list ul").html(optionList);

    }

    //设置input
    private setChedked(optionList: any, filterArray: any) {
        let $li = $(optionList).find('li');
        if (filterArray && filterArray.length > 0) {
            for (let i = 0; i < $li.length; i++) {
                let $liInput = $($li[i]).find('input');
                for (let j = 0; j < filterArray.length; j++) {

                    if ($liInput.attr('id') == filterArray[j]['id']) {
                        $liInput.prop('checked', true);
                        break;
                    }

                }
            }
        }

    }

    private setFilterListArr($input: any, $listDiv: any) {
        if (this.filterArray.length > 0) {
            for (let item of this.filterArray) {
                if (item.id == $input.id) {
                    break;
                }
            }
        }

        if (this.filterArray.length > this.filterLength - 1) {
            $listDiv.find('input').prop('disabled', true);
            $listDiv.find('input[checked]').prop('disabled', false);
        } else {
            this.filterArray.push({
                id: $input.id,
                project_name: $input.labels[0].innerText
            })
        }
    }

    private delFilterListArr($input: any, $listDiv: any) {
        if (this.filterArray.length > 0) {
            for (let i = 0; i < this.filterArray.length; i++) {
                if (this.filterArray[i].id == $input.id) {
                    this.filterArray.splice(i, 1)
                }
            }
            if (this.filterArray.length < this.filterLength) {
                $listDiv.find('input').prop("disabled", false)
            }
        }
    }

    private renderOverallSelected($div: any, data: any) {
        $div.empty();
        let html = '';
        for (let i = 0; i < data.length; i++) {
            html += '<span>' + data[i]['project_name'] + '</span>';
        }
        $div.append(html);
    }

    private commonChange() {
        let _self = this,
            $chooseLength = $('#' + this.scopeID).find('.component_bottom_l span');

        //click filter
        $('#' + _self.scopeID).find('div[componentFilter]').click((event: any) => {
            $('#' + _self.scopeID).find("div[componentOverall]").show();
            event.stopPropagation();
        });

        $(document).ready(function () {
            let $componentOverall = $('#' + _self.scopeID).find('div[componentOverall]');

            //click checkbox
            $('#' + _self.scopeID).find('.component_overall_list').click((event: any) => {
                let $input = event.target.previousSibling,
                    $listDiv = $('#' + _self.scopeID).find('.component_overall_list');
                _self.buildChange($input, $listDiv);
                if (_self.filterArray.length > 0) {
                    $('#' + _self.scopeID).find('.component_bottom_l em').text("");
                }
                $chooseLength.text(_self.filterArray.length);
                event.stopPropagation();
            })

            //search
            $componentOverall.on('keyup', '.overall_right_search', (event: any) => {
                let searchText = $(event.target).val().trim();
                let newList = [];
                if (searchText.length <= 0) {
                    newList = _self.filterListObj;
                } else {
                    for (let i = 0; i < _self.filterListObj.length; i++) {
                        if (_self.filterListObj[i]['project_name'].indexOf(searchText) > 0) {
                            newList.push(_self.filterListObj[i]);
                        }
                    }
                }
                _self.renderlistHtml(newList);
                _self.setChedked($('.component_overall_list', '#' + _self.scopeID), _self.filterArray);
                event.stopPropagation();
            })

            // $componentOverall.on('blur','.overall_right_search',(event:any)=>{
            //     if()
            //     $componentOverall.find('.overall_right_search').val('');
            //     _self.renderlistHtml(_self.filterListObj);
            //     _self.setChedked($('.component_overall_list','#'+this.scopeID),this.filterArray);
            // })

            //click get dropdown get list
            $componentOverall.on('click', '.component_top', (event: any) => {
                let $selectList = $(event.target).siblings('.component_top_select_list');
                $('.component_top_select_list').hide();
                //点击设置选择的类型
                let dataType = $(event.target).attr("data-type"),
                    allType = $(event.target).attr("data-id");

                if (dataType !== undefined) {
                    _self.filterType = dataType;
                    _self.filterAllType = allType;
                }

                //判断是否发送请求
                _self.getDataPostChange(_self.setBodyObj(_self.filterType));

                setTimeout(() => {
                    $selectList.show();
                }, 200);
                event.stopPropagation();
            })

            //click choose list
            $componentOverall.on('click', '.component_top_select_list', (event: any) => {
                let $tagget = $(event.currentTarget);
                $tagget.siblings().text($(event.target).text());

                if (_self.filterType == "filter-classify") {
                    let dataID: any = $(event.target).attr("data-id");
                    $tagget.siblings().attr("data-id", dataID);
                    //点击根据id渲染html
                    _self.decideFilterType(dataID);
                    //切换查看重置信息
                    _self.changeInformation();
                    //判断切换的id是否与外界拿到的一致
                    if (parseInt(dataID) == parseInt(_self.saveProject.projectType)) {
                        _self.saveInputBoolean = true;
                        _self.saveCheckedBoolean = false;
                    }
                }

                //点击设置已选择的value
                _self.filterValue = $(event.target).text();
                //点击设置选择的类型
                _self.filterType = $tagget.parent().attr("data-type");
                //存储全部品牌,全部大区,全部城市已选择value
                _self.saveFilterValue(_self.filterType, _self.filterValue);
                //设置全部品牌,全部大区,全部城市的boolean
                _self.saveFilterTitleBool(_self.filterType);

                //发送请求
                _self.getDataPostChange(_self.setBodyObj(_self.filterType));
                //先清空数组，再设置已选择的length
                _self.filterArray = [];
                $chooseLength.text(_self.filterArray.length);

                $('.component_top_select_list').hide();
                event.stopPropagation();
            });

            //click confirm
            $componentOverall.on('click', 'a[componentOverallConfirm]', (event: any) => {
                if (_self.filterArray.length <= 0) {
                    $('#' + _self.scopeID).find('.component_bottom_l em').text("请至少选择一个");
                } else {
                    $('#' + _self.scopeID).find('.component_bottom_l em').text("");
                    _self.renderOverallSelected($('.overallSelected', '#' + _self.scopeID), _self.filterArray)
                    _self.confirmPostChange();
                    $('.component_overall').hide();
                }
                event.stopPropagation();
            })

            //click cancel
            $componentOverall.on('click', 'a[componentOverallCancel]', (event: any) => {
                $('.component_overall').hide();
                event.stopPropagation();
            })

        });

        //click document
        $(document).click(function (e) {
            $('.component_top_select_list').hide();
            e.stopPropagation();
        })

    }

    //切换查看重置信息
    private changeInformation() {
        this.body = {
            "datasource_id": 27,
        };
        this.changeBrandTitleBool = false;
        this.changeRegionTitleBool = false;
        this.changeCityTitleBool = false;
        this.filterBrandTitleBool = false;
        this.filterRegionTitleBool = false;
        this.filterCityTitleBool = false;
    }

    //根据类型设置select list 初始值
    private setFilterData(filterAllType: any, data: any) {
        switch (filterAllType) {
            case "6":
                if (!this.filterBrandTitleBool) {
                    data.unshift({
                        project_name: '全部品牌',
                        id: -1
                    });
                    this.filterBrandTitleBool = true
                }
                break;
            case "5":
                if (!this.filterRegionTitleBool) {
                    data.unshift({
                        project_name: '全部大区',
                        id: -1
                    });
                    this.filterRegionTitleBool = true
                }
                break;
            case "11":
                if (!this.filterCityTitleBool) {
                    data.unshift({
                        project_name: '全部城市',
                        id: -1
                    });
                    this.filterCityTitleBool = true
                }
                break;
        }
    }

    private saveFilterTitleBool(filterType: any) {
        switch (filterType) {
            case "filter-brand":
                this.changeBrandTitleBool = true;
                break;
            case "filter-region":
                this.changeRegionTitleBool = true;
                break;
            case "filter-city":
                this.changeCityTitleBool = true;
                break;
        }
    }

    private saveFilterValue(filterType: any, targetValue: any) {
        switch (filterType) {
            case "filter-brand":
                this.filterSaveBrand = targetValue;
                break;
            case "filter-region":
                this.filterSaveRegion = targetValue;
                break;
            case "filter-city":
                this.filterSaveCity = targetValue;
                break;
        }
    }

    //渲染第一个下拉框list
    private renderSelectListHtml($div: any, data: any): void {
        let optionList: string = "";

        optionList += '<ul>';
        for (let item of data) {
            optionList += '<li data-id=' + item.id + ' title="' + item.project_name + '">' + item.project_name + '</li>'
        }
        optionList += '</ul>';

        $div.html(optionList);
    }

    //判断选择的类型
    private decideFilterType(id: any) {
        let optionList: string = "";
        switch (id) {
            case "1"://按店铺查看
                optionList += '<div class="component_top_select" data-type="filter-brand">'
                optionList += '<div class="component_top_select_title" data-id="6" data-type="filter-all-title">全部品牌</div>'
                optionList += '<div class="component_top_select_list">'
                optionList += '</div>';
                optionList += '</div>';
                if (this.parameter.group_sign != 'N') {
                    optionList += '<div class="component_top_select" data-type="filter-region">'
                    optionList += '<div class="component_top_select_title" data-id="5" data-type="filter-all-title">全部大区</div>'
                    optionList += '<div class="component_top_select_list">'
                    optionList += '</div>';
                    optionList += '</div>';

                    optionList += '<div class="component_top_select" data-type="filter-city">'
                    optionList += '<div class="component_top_select_title" data-id="11" data-type="filter-all-title">全部城市</div>'
                    optionList += '<div class="component_top_select_list">'
                    optionList += '</div>';
                    optionList += '</div>';
                }

                //点击设置选择的类型id
                this.filterID = id;
                break;
            case "11"://按城市查看
                optionList += '<div class="component_top_select" data-type="filter-brand">'
                optionList += '<div class="component_top_select_title" data-id="6" data-type="filter-all-title">全部品牌</div>'
                optionList += '<div class="component_top_select_list">'
                optionList += '</div>';
                optionList += '</div>';
                optionList += '<div class="component_top_select" data-type="filter-region">'
                optionList += '<div class="component_top_select_title" data-id="5" data-type="filter-all-title">全部大区</div>'
                optionList += '<div class="component_top_select_list">'
                optionList += '</div>';
                optionList += '</div>';
                //点击设置选择的类型id
                this.filterID = id;
                break;
            case "5"://按大区查看
                optionList += '<div class="component_top_select" data-type="filter-brand">'
                optionList += '<div class="component_top_select_title" data-id="6" data-type="filter-all-title">全部品牌</div>'
                optionList += '<div class="component_top_select_list">'
                optionList += '</div>';
                optionList += '</div>';
                //点击设置选择的类型id
                this.filterID = id;
                break;
            case "6"://按品牌查看
                //点击设置选择的类型id
                this.filterID = id;
                break;
        }
        $('#' + this.scopeID).find(".overall_child").html(optionList);
    }

    private buildChange($input: any, $targetSiblings: any) {
        if ($input !== null) {
            if (!$input.checked) {
                this.setFilterListArr($input, $targetSiblings);
            } else {
                this.delFilterListArr($input, $targetSiblings);
            }
        }
    }

    private getDataPostChange(postQuery: any) {
        let sendObj: Object = Object.assign(
            super.transformInput('scopeID', this.scopeID),
            super.transformInput('result', postQuery)
        );

        super.onChange(this, sendObj);
    }

    private confirmPostChange() {
        if (!this.isEmptyObject(this.filterScopeIDObj)) {
            this.parameterPostChange(this.changeFilterArray());
        } else {
            return;
        }
    }

    private changeFilterArray() {
        let changePostFilterArray: Array<any> = [],
            filterValue: Array<any> = [],
            nameValue: Array<any> = [];
        for (let item of this.filterArray) {
            filterValue.push(item.id);
            nameValue.push(item.project_name);
        }
        changePostFilterArray.push({
            "field": 'project_id',
            "operator": "in",
            "value": filterValue.toString()
        });
        changePostFilterArray.push({
            "field": 'projectName',
            "operator": "=",
            "value": nameValue.toString()
        });
        changePostFilterArray.push({
            "field": 'typeInOverall',
            "operator": "=",
            "value": this.filterID
        });
        return changePostFilterArray;
    }

    private parameterPostChange(filterArray: any) {
        let sendObj: Object = Object.assign(
            super.transformInput('scopeID', this.scopeID),
            super.transformInput('filterObj', this.filterScopeIDObj),
            super.transformInput('result', Object.assign(super.transformInput('filter', filterArray), super.transformInput('chart', this.filterArray)))
        );

        super.sendMessageBase(this, sendObj);
    }

    private setBodyObj(type: any) {
        switch (type) {
            case 'filter-classify'://第一列类型
                this.body = {
                    "datasource_id": 27,
                };
                this.body['dimensions'] = [
                    {"field": "project_name"},
                    {"field": "id"}
                ],
                    this.body['filters'] = [
                        {"field": "project_type", "operator": "=", "value": this.filterID},
                        {"field": "status", "operator": "=", "value": "1"}
                    ]
                this.body['limit'] = [-1]
                break;
            case 'filter-all-title'://根据类型获取全部品牌,全部大区,全部城市
                this.body['dimensions'] = [
                    {"field": "project_name"}
                ];
                this.filterChangeBody(this.filterAllType, type, this.body);
                break;
            case 'filter-brand'://全部品牌
                this.listFilterChangeBody(this.filterID, type, this.filterListChangeBody());
                break;
            case 'filter-region'://全部大区
                this.listFilterChangeBody(this.filterID, type, this.filterListChangeBody());
                break;
            case 'filter-city'://全部城市
                this.listFilterChangeBody(this.filterID, type, this.filterListChangeBody());
                break;
        }
        this.body["charUUID"] = this.scopeID;
        this.body["requestTitle"] = "overallFilter";
        return this.body;
    }

    private filterFieldFilters(field: any, type: any, value: any) {
        for (let i = 0; i < field.length; i++) {
            if (field[i].field == type) {
                field[i].value = value;
            } else {
                break;
            }
        }
    }

    private filterFieldValue(field: any, value: any, filterSaveValue: any, filter: any) {
        for (let i = 0; i < field.length; i++) {
            if (field[i].field == value) {
                field.splice(i, 1);
                break;
            }
        }
        this.decideFilterField(field, value, filterSaveValue, filter);
    }

    private deleteFilterValue(value: any) {
        for (let i = 0; i < this.body['filters'].length; i++) {
            if (this.body['filters'][i].field == value) {
                this.body['filters'].splice(i, 1);
            }
        }
    }

    private decideFilterField(field: any, value: any, filterSaveValue: any, filter: any) {
        this.filterFieldFilters(field, 'project_type', filter)

        if (value == "brand" && this.filterSaveBrand !== "全部品牌") {
            if (this.filterSaveRegion !== "全部大区") {
                this.deleteFilterValue("region");
                $("#" + this.scopeID).find('div[data-id="5"][data-type="filter-all-title"]').html("全部大区");
            }
            if (this.filterSaveCity !== "全部城市") {
                this.deleteFilterValue("logical_city");
                $("#" + this.scopeID).find('div[data-id="11"][data-type="filter-all-title"]').html("全部城市");

            }
            this.body['filters'].push({
                "field": value,
                "operator": "=",
                "value": filterSaveValue
            });
        }

        if (value == "region" && this.filterSaveRegion !== "全部大区") {
            if (this.filterSaveCity !== "全部城市") {
                this.deleteFilterValue("logical_city");
                $("#" + this.scopeID).find('div[data-id="11"][data-type="filter-all-title"]').html("全部城市");

            }
            this.body['filters'].push({
                "field": value,
                "operator": "=",
                "value": filterSaveValue
            });
        }

        if (value == "logical_city" && this.filterSaveCity !== "全部城市") {
            this.body['filters'].push({
                "field": value,
                "operator": "=",
                "value": filterSaveValue
            });
        }
    }

    private filterListChangeBody() {
        this.body['dimensions'] = [
            {"field": "project_name"},
            {"field": "id"}
        ];
        this.body['limit'] = [-1];

        return this.body;
    }

    private filterChangeBody(filter: any, type: any, dimensionsLimit: any) {
        this.body = dimensionsLimit;

        switch (filter) {
            case "6":
                this.body['dimensions'].push({"field": "id"})
                this.body['filters'] = [
                    {"field": "project_type", "operator": "=", "value": filter},
                    {"field": "status", "operator": "=", "value": "1"}
                ];
                break;
            case "5":
                this.body['dimensions'].push({"field": "id"})
                this.body['filters'] = [
                    {"field": "project_type", "operator": "=", "value": filter},
                    {"field": "status", "operator": "=", "value": "1"}
                ];
                if (this.filterSaveBrand !== "全部品牌") {
                    this.body['filters'].push({"field": "brand", "operator": "=", "value": this.filterSaveBrand})
                }
                break;
            case "11":
                this.body['dimensions'].push({"field": "id"})
                this.body['filters'] = [
                    {"field": 'project_type', "operator": "=", "value": filter},
                    {"field": "status", "operator": "=", "value": "1"}
                ];
                if (this.filterSaveBrand !== "全部品牌") {
                    this.body['filters'].push({"field": "brand", "operator": "=", "value": this.filterSaveBrand})
                }
                if (this.filterSaveRegion !== "全部大区") {
                    this.body['filters'].push({"field": "region", "operator": "=", "value": this.filterSaveRegion})
                }
                break;
        }

        return this.body;
    }

    private listFilterChangeBody(filter: any, type: any, dimensionsLimit: any) {
        this.body = dimensionsLimit;

        switch (type) {
            case "filter-brand":
                this.filterFieldValue(this.body['filters'], 'brand', this.filterSaveBrand, filter)
                break;
            case "filter-region":
                this.filterFieldValue(this.body['filters'], 'region', this.filterSaveRegion, filter)
                break;
            case "filter-city":
                this.filterFieldValue(this.body['filters'], 'logical_city', this.filterSaveCity, filter)
                break;
        }

        return this.body;
    }

}