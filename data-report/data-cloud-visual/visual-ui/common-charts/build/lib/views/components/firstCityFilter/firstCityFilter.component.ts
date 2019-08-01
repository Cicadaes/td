/**
 * Created by nieyechen on 2017/11/15.
 */
import {BaseComponent} from "../base.component";
import {FirstCityFilterTemplate} from "./firstCityFilter.template";
import {Utils} from '../../../../public/scripts/utils';
import {FirstCityFilterModel} from './firstCityFilter.model';
import {BaseCharts} from '../../base/base.chart';
import * as $ from 'jquery';

export class FirstCityFilterComponent extends BaseComponent {
    private chartData: any = null;
    private firstcityFilterData: FirstCityFilterModel = null;
    private filterScopeIDObj: any = null;
    private filterArray: Array<any> = [];
    private defaultFilterBody: any = null;
    private filterType: any = null;
    private filterCityObj: any = null;
    private filterID: any = null;
    private filterSaveBrand: any = null;
    private timer: any = null;
    private provincelist: any = null;
    private citylist: any = null;
    private brandlist: any = null;
    private filterSaveProvince: any = null;
    private filterSaveCity: any = null;

    private filterInfo: any = null;
    private filterListObj: any = null;
    private listDiv: any = null;
    private filterName: any = null;
    private body: any = {
        "datasource_id": 27,
        'dimensions': null,
        'filters': null
    };

    constructor() {
        super();
        let template = new FirstCityFilterTemplate(this.scopeID);

        //获得模板渲染后的节点
        this.element = this.render(template);
        this.firstcityFilterData = new FirstCityFilterModel();
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
            this.defaultFilterBody = [{"field": "city_level", "operator": "=", "value": "1"}, {
                "field": "project_type",
                "operator": "=",
                "value": "3"
            }, {"field": "project_id", "operator": "in", "value": "%%"}];  // 默认一线城市

            //渲染头部
            $('#' + this.scopeID).find('.component_top_select_box').show()
            this.filterID = "3";
            this.filterName = "全部城市";
            this.filterCityObj = this.getFilterCityObjByName(this.filterName);
            this.listDiv = $('#' + this.scopeID).find('.provinceBox');

            $('#' + this.scopeID).find('.component_top_select_title').text(this.filterCityObj['project_name']).attr('data-id', this.filterCityObj['id']);
            this.renderSelectListHtml($('#' + this.scopeID).find('div[componentCityLeftList]'), this.firstcityFilterData.firstCityFilter);

            this.filterType = 'province';
            this.mergeFilterObj = this.mergeDateObj = null;

            //获取当前省份的信息
            let body = this.setBodyObj();
            this.getDataPostChange(body);

            this.commonChange();
        } else {
            return;
        }
    }

    public getFilterCityObjByName(name: any) {
        let length = this.firstcityFilterData.firstCityFilter.length;
        for (let i = 0; i < length; i++) {
            if (this.firstcityFilterData.firstCityFilter[i]['project_name'] == name) {
                return this.firstcityFilterData.firstCityFilter[i];
            }
        }

    }

    public filterChange(event: any, data: any): void {

    }

    public dataChange(data: any): void {
        this.filterListObj = data;

        if (data && this.filterType == "province" || this.filterType == 'first_city' || this.filterType == 'second_city') {

            this.provincelist = data;
            this.renderlistHtml(this.listDiv, this.provincelist, false);

        } else if (data && this.filterType == "city") {
            this.citylist = data;
            let isLast = this.filterID == "10" ? true : false;
            this.renderlistHtml(this.listDiv, this.citylist, isLast);

        } else if (data && this.filterType == "brand") {

            this.brandlist = data;
            this.renderlistHtml(this.listDiv, this.brandlist, true);
            this.decideChedked(this.listDiv, this.filterArray);

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
        this.defaultFilterBody = [{"field": "city_level", "operator": "=", "value": "1"}, {
            "field": "project_type",
            "operator": "=",
            "value": "3"
        }];  // 默认一线城市
    }

    //渲染中间选择list
    private renderlistHtml(container: any, data: any, option: any): void {
        container.empty();
        if (data.length > 0) {
            let optionList: string = "";
            optionList += '<ul>';
            for (let item of data) {
                optionList += '<li title="' + item.project_name + '">'
                if (option) {
                    optionList += '<input type="checkbox" id=' + item.id + ' name="filter" value="' + item.project_name + '"/><label for=' + item.id + '>' + item.project_name + '</label>';
                } else {
                    optionList += '<span class="brandList" id=' + item.id + '>' + item.project_name + '</span><span class="listBtn"> &gt; </span>'
                }

                optionList += '</li>';
            }
            optionList += '</ul>';

            container.append(optionList);
        } else {
            container.append('<div style="text-align:center;padding-top:42%;">暂无数据</div>');
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

        if (this.filterArray.length > 3) {
            $listDiv.find('input').prop('disabled', true);
            $listDiv.find('input[checked]').prop('disabled', false);
        } else {
            this.filterArray.push({
                id: $input.id,
                name: $($input).siblings('label').text()
            })
        }
    }

    private delFilterListArr($input: any, $listDiv: any) {
        if (this.filterArray.length > 0) {
            for (let i = 0; i < this.filterArray.length; i++) {
                if (this.filterArray[i].id == $input.id) {
                    this.filterArray.splice(i, 1);

                }
            }
            if (this.filterArray.length < 4) {
                $listDiv.prop("disabled", false)
            }
        }

    }

    //设置input
    private decideChedked(optionList: any, filterArray: any) {
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

    private commonChange() {
        let _self = this,
            $chooseLength = $('#' + this.scopeID).find('.component_bottom_l span');

        //解绑事件
        $('#' + _self.scopeID).find('.custom').off('click');
        $('.component_city_list', '#' + _self.scopeID).off('click');
        $('.selectList', '#' + _self.scopeID).off('click');
        $('#' + _self.scopeID).find('div[componentCity]').off('click');
        $('.provinceBox', '#' + _self.scopeID).off('click');
        $('.cityBox', '#' + _self.scopeID).off('click')
        $('.selectList', '#' + _self.scopeID).off('click')
        $('#' + _self.scopeID).find('.defaultFilter').off('click');

        //click custom
        $('#' + _self.scopeID).find('.custom').on('click', (event: any) => {
            $('#' + _self.scopeID).find(".component_city").show();

            event.stopPropagation();
        });

        $('#' + _self.scopeID).find('.defaultFilter').on('click', (event: any) => {
            $('#' + _self.scopeID).find(".component_city").hide();
            $('#' + _self.scopeID).find('.defaultFilter').addClass('currentFilter').siblings('.custom').removeClass('currentFilter');
            _self.parameterPostChange(_self.defaultFilterBody);
            event.stopPropagation();
        });

        $(document).ready(function () {
            let $componentCity = $('#' + _self.scopeID).find('div[componentCity]');

            //click get citylist
            $('.provinceBox', '#' + _self.scopeID).on('click', 'li', function (event: any) {
                $('.provinceBox', '#' + _self.scopeID).find('li').css('background', '#fff');
                $(this).css('background', '#F4F7FB');
                let $provinceEle = $(this).find('.brandList');

                if (_self.filterSaveProvince != $provinceEle.text()) {
                    $('.cityBox', '#' + _self.scopeID).empty();
                    $('.brandBox', '#' + _self.scopeID).empty();
                    $('.brandBox', '#' + _self.scopeID).append('<div style="text-align:center;padding-top:42%;">暂无数据</div>');

                    _self.filterSaveProvince = $provinceEle.text();
                    _self.filterType = 'city';
                    _self.filterID = _self.filterCityObj['id'];
                    _self.listDiv = $('.cityBox', '#' + _self.scopeID);
                    if (_self.filterID == '10') {
                        _self.listDiv.removeClass("brandListBox").addClass("selectList");
                    } else {
                        _self.listDiv.removeClass("selectList").addClass("brandListBox");
                    }

                    _self.getDataPostChange(_self.setBodyObj());
                }

            })

            //click get brandlist
            $('.cityBox', '#' + _self.scopeID).on('click', 'li', function (event: any) {
                if (_self.filterID != '10') {
                    $('.cityBox', '#' + _self.scopeID).find('li').css('background', '#fff');
                    $(this).css('background', '#F4F7FB');
                    let $cityEle = $(this).find('.brandList');

                    if (_self.filterSaveCity != $cityEle.text()) {
                        $('.brandBox', '#' + _self.scopeID).empty();
                        _self.filterSaveCity = $cityEle.text();
                        _self.filterType = 'brand';
                        _self.filterID = _self.filterCityObj['brandCityId'];
                        _self.listDiv = $('.brandBox', '#' + _self.scopeID);
                        _self.getDataPostChange(_self.setBodyObj());
                    }
                }

            })

            //click checkbox
            $componentCity.on('click', 'input,label', (event: any) => {
                let $input = event.target.previousSibling,
                    $listDiv = $(event.target).parents('.selectList');

                _self.buildChange($input, $listDiv);

                $chooseLength.text(_self.filterArray.length);
                event.stopPropagation();
            })

            //click get dropdown get list
            $componentCity.on('click', '.component_top_select_box', (event: any) => {
                let $selectList = $(event.target).siblings('.component_top_select_list');
                $('.component_top_select_list').show();

                event.stopPropagation();
            })

            //click choose list
            $componentCity.on('click', '.component_top_select_list', (event: any) => {
                let $target = $(event.currentTarget);
                let filterName = $(event.target).text();
                $target.siblings().text(filterName);
                $target.siblings().attr("data-id", $(event.target).attr("data-id"));

                //点击设置选择的类型
                let filterID = $(event.target).attr("data-id");
                if (_self.filterName != filterName) {
                    $('.provinceBox', '#' + _self.scopeID).empty();
                    $('.cityBox', '#' + _self.scopeID).empty();
                    $('.brandBox', '#' + _self.scopeID).empty();
                    $('.cityBox', '#' + _self.scopeID).append('<div style="text-align:center;padding-top:42%;">暂无数据</div>');
                    $('.brandBox', '#' + _self.scopeID).append('<div style="text-align:center;padding-top:42%;">暂无数据</div>');

                    _self.filterName = filterName
                    _self.filterSaveProvince = null;
                    _self.filterSaveCity = null;
                    _self.filterArray = [];
                    _self.filterType = 'province';
                    _self.filterID = '9';
                    _self.filterCityObj = _self.getFilterCityObjByName(_self.filterName);
                    _self.listDiv = $('.provinceBox', '#' + _self.scopeID);

                    if (filterName == "一线城市") {
                        _self.filterType = 'first_city';
                    } else if (filterName == "二线城市") {
                        _self.filterType = 'second_city';
                    }

                    $chooseLength.text(_self.filterArray.length);
                    _self.body = _self.setBodyObj();
                    _self.getDataPostChange(_self.body);
                }
                ;

                $('.component_top_select_list').hide();
                event.stopPropagation();
            });

            //click cancel  点击取消
            $componentCity.on('click', 'a[componentCityCancel]', (event: any) => {
                _self.filterArray = [];
                _self.confirmPostChange();
                $(".provinceBox", '#' + _self.scopeID).find("li").css('background', '#fff');
                $('#' + this.scopeID).find(".currentFilter").css({"background": "#43A3FB"});
                $('#' + this.scopeID).find(".currentFilter").css({"color": "#fff"});
                $('#' + this.scopeID).find(".custom").css({"background": "#fff"});
                $('#' + this.scopeID).find(".custom").css({"color": "#464C5B"});
                $componentCity.find('.cityBox').empty();
                $componentCity.find('.brandBox').empty();
                $chooseLength.text(_self.filterArray.length);
                //_self.filterID = this.firstcityFilterData.firstCityFilter[2]['id'];  // 获取当选选择的type
                //$('#' + this.scopeID).find('.component_top_select_title').show().text(this.firstcityFilterData.firstCityFilter[2]["project_name"]).attr('data-id', this.firstcityFilterData.firstCityFilter[2]['id']);  // 默认取单选下拉框第一个
                $componentCity.hide();
                event.stopPropagation();
            })

            // 点击city按钮
            //click currentFilter
            $('#' + _self.scopeID).find('.currentFilter').on('click', (event: any) => {
                _self.filterArray = [];
                $(".provinceBox ", '#' + _self.scopeID).find("li").css('background', '#fff');
                $componentCity.find('.cityBox').empty();
                $componentCity.find('.brandBox').empty();
                $chooseLength.text(_self.filterArray.length);
                //_self.filterID = _self.firstcityFilterData.firstCityFilter[2]['id'];  // 获取当选选择的type

                //let aaa = _self.firstcityFilterData.firstCityFilter[2]["project_name"];
                //let bbb = _self.firstcityFilterData.firstCityFilter[2]['id'];
                //$('#' + _self.scopeID).find('.component_top_select_title').show().text(aaa).attr('data-id', bbb);  // 默认取单选下拉框第一个

                _self.confirmPostChange();
                $componentCity.hide();
                event.stopPropagation();
            });

            //search
            $componentCity.on('keyup', '.city_right_search', (event: any) => {
                //if (_self.filterSaveBrand) {
                let searchText = $(event.target).val().trim();
                let newList = [];
                if (searchText.length <= 0) {
                    newList = _self.filterListObj;
                } else {
                    for (let i = 0; i < _self.filterListObj.length; i++) {
                        if (_self.filterListObj[i]['project_name'].toLowerCase().indexOf(searchText.toLowerCase()) != -1) {
                            newList.push(_self.filterListObj[i]);
                        }
                    }
                }

                _self.renderlistHtml($('#' + _self.scopeID).find('.selectList'), newList, true);
                _self.decideChedked($('.selectList', '#' + _self.scopeID), _self.filterArray);
                //}
                event.stopPropagation();
            })

            //click confirm
            $componentCity.on('click', 'a[componentCityConfirm]', (event: any) => {
                _self.confirmPostChange();
                //if(this.filterArray && this.filterArray.length > 0)$('#'+_self.scopeID).find('.custom').addClass('currentFilter').siblings('.defaultFilter').removeClass('currentFilter');
                $componentCity.hide();
                event.stopPropagation();
            })

            //click cancel
            $componentCity.on('click', 'a[componentCityCancel]', (event: any) => {
                $componentCity.hide();
                event.stopPropagation();
            })

            $componentCity.on('click', function (event) {
                $componentCity.show();
                $('.component_top_select_list').hide();
                event.stopPropagation();
            })
        });

        //click document
        $(document).click(function (e) {
            $('.component_top_select_list', '#' + _self.scopeID).hide();
            $('.component_city', '#' + _self.scopeID).hide();
            e.stopPropagation();
        })

    }

    //渲染list
    private renderSelectListHtml($div: any, data: any): void {
        let optionList: string = "";

        optionList += '<ul>';
        for (let i = 0; i < data.length; i++) {
            optionList += '<li data-id=' + data[i].id + ' data-type=' + data[i].field + '>' + data[i].project_name + '</li>'
        }
        optionList += '</ul>';

        $div.html(optionList);
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
        if (postQuery && !this.isEmptyObject(postQuery)) {
            postQuery["charUUID"] = this.scopeID;
            postQuery["requestTitle"] = "firstCityFilter";
            let sendObj: Object = Object.assign(
                super.transformInput('scopeID', this.scopeID),
                super.transformInput('result', postQuery)
            );

            super.onChange(this, sendObj);
        }
    }

    private confirmPostChange() {
        if (!this.isEmptyObject(this.filterScopeIDObj) && this.filterArray.length > 0) {
            this.parameterPostChange(this.changeFilterArray());
            $('#' + this.scopeID).find(".custom").css({"background": "#43A3FB"});
            $('#' + this.scopeID).find(".custom").css({"color": "#fff"});
            $('#' + this.scopeID).find(".defaultFilter").css({"background": "#fff"});
            $('#' + this.scopeID).find(".defaultFilter").css({"color": "#464C5B"});
        } else {
            this.parameterPostChange(this.defaultFilterBody);
            $('#' + this.scopeID).find(".custom").css({"background": "#fff"});
            $('#' + this.scopeID).find(".custom").css({"color": "#464C5B"});
            $('#' + this.scopeID).find(".defaultFilter").css({"background": "#43A3FB"});
            $('#' + this.scopeID).find(".defaultFilter").css({"color": "#fff"});
            return;
        }
    }

    private changeFilterArray() {
        let changePostFilterArray: Array<any> = [{
            "field": 'project_id',
            "operator": "in",
            "value": '0'
        }, {"field": "city_level", "operator": "=", "value": "%%"},
            {"field": "project_type", "operator": "=", "value": "%%"}
        ];
        let value = ' ';
        for (let i = 0; i < this.filterArray.length; i++) {
            value += (',' + this.filterArray[i].id );

        }
        changePostFilterArray[0]["value"] = value.trim().substr(1);
        return changePostFilterArray;
    }

    private parameterPostChange(filterArray: any) {
        let sendObj: Object = Object.assign(
            super.transformInput('scopeID', this.scopeID),
            super.transformInput('filterObj', this.filterScopeIDObj),
            super.transformInput('result', super.transformInput('filter', filterArray))
        );

        super.sendMessageBase(this, sendObj);
    }

    //设置请求body
    private setBodyObj() {
        this.body = {
            "datasource_id": 27,
            "dimensions": [{"field": "project_name"}, {"field": "id"}],
            "filters": [
                {"field": "project_type", "operator": "=", "value": "9"},
                {"field": "city_level", "operator": "=", "value": "%%"},
                {"field": "status", "operator": "=", "value": "1"}
            ],
            "orderBy": [{"field": "project_name", "function": "asc"}]
        };

        if (this.filterType == 'province') {

        } else if (this.filterType == 'first_city') {
            this.body = {
                "datasource_id": 27,
                "dimensions": [{"field": "province", "alias": "project_name"}, {"field": "province", "alias": "id"}],
                "filters": [
                    {"field": "project_type", "operator": "=", "value": "3"},
                    {"field": "city_level", "operator": "=", "value": "1"}
                ],
                "orderBy": [{"field": "province", "function": "asc"}],
                "distinct": true
            };
        } else if (this.filterType == 'second_city') {
            this.body = {
                "datasource_id": 27,
                "dimensions": [{"field": "province", "alias": "project_name"}, {"field": "province", "alias": "id"}],
                "filters": [
                    {"field": "project_type", "operator": "=", "value": "3"},
                    {"field": "city_level", "operator": "=", "value": "2"}
                ],
                "orderBy": [{"field": "province", "function": "asc"}],
                "distinct": true
            };
        } else if (this.filterType == 'city') {

            this.body ["filters"] = [
                {"field": "project_type", "operator": "=", "value": this.filterCityObj['id']},
                {"field": "province", "operator": "=", "value": this.filterSaveProvince},
                {"field": "city_level", "operator": "=", "value": this.filterCityObj['city_level']},
                {"field": "status", "operator": "=", "value": "1"}
            ];

            if (this.filterID == "10") {
                this.body['orderBy'] = [
                    {"field": "city_type", "function": "asc"},
                    {"field": "project_name", "function": "asc"}
                ];
            }

        } else if (this.filterType == 'brand') {
            this.body["filters"] = [
                {"field": "project_type", "operator": "=", "value": this.filterCityObj['brandCityId']},
                {"field": "city_level", "operator": "=", "value": this.filterCityObj['city_level']},
                {"field": "province", "operator": "=", "value": this.filterSaveProvince},
                {"field": "city", "operator": "=", "value": this.filterSaveCity},
                {"field": "status", "operator": "=", "value": "1"}
            ];
        }

        this.body["charUUID"] = this.scopeID;
        this.body["requestTitle"] = "firstCityFilter";

        return this.body;
    }

}