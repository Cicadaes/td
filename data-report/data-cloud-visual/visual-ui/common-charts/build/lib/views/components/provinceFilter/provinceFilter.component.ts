/**
 * Created by zhaoxue on 2017/3/28.
 */
import {BaseComponent} from "../base.component";
import {ProvinceFilterTemplate} from "./provinceFilter.template";
import {Utils} from '../../../../public/scripts/utils';
import {ProvinceFilterModel} from './provinceFilter.model';
import {BaseCharts} from '../../base/base.chart';
import * as $ from 'jquery';

export class ProvinceFilterComponent extends BaseComponent {
    private chartData: any = null;
    private provinceFilterData: ProvinceFilterModel = null;
    private filterScopeIDObj: any = null;
    private filterArray: Array<any> = [];
    private defaultFilterBody: any = null;
    private filterType: any = null;
    private filterProvinceType: any = null;
    private filterID: any = null;
    private filterSaveBrand: any = null;
    private timer: any = null;
    private provinceList: any = null;
    private filterInfo: any = null;
    private filterInfoType: any = false;
    private filterCityType: any = null;
    private filterIndex: any = 1;
    private filterIndexName: any = "";
    private filterListObj: any = null;
    private body: any = {
        "datasource_id": 27,
        'dimensions': null,
        'filters': null
    };

    constructor() {
        super();
        let template = new ProvinceFilterTemplate(this.scopeID);

        //获得模板渲染后的节点
        this.element = this.render(template);
        this.provinceFilterData = new ProvinceFilterModel();
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
        this.filterScopeIDObj = changeObj.result;
        let provinceFilterShopArray = this.provinceFilterData.provinceFilterShopArray;  // 单选下拉框
        $('#' + this.scopeID).find('.component_top_select_title').show().text(provinceFilterShopArray[0]['project_name']).attr('data-id', provinceFilterShopArray[0]['id']);  // 默认取单选下拉框第一个
        this.renderSelectListHtml($('#' + this.scopeID).find('div[componentCityLeftList]'), provinceFilterShopArray);
        this.filterCityType = provinceFilterShopArray[0]['field'];  // 获取当选选择的type
        this.filterID = provinceFilterShopArray[0]['id'];  // 获取当选选择的type

        let body = {
            "datasource_id": 27,
            "dimensions": [
                {"field": "project_name"}, {"field": "id"}
            ],
            "filters": [
                {"field": "project_type", "operator": "=", "value": "9"},
                {"field": "status", "operator": "=", "value": "1"}
            ],
            "orderBy": [
                {"field": "city_type", "function": "asc"},
                {"field": "project_name", "function": "asc"}
            ]
        };
        body["charUUID"] = this.scopeID;
        body["requestTitle"] = "provinceFilter";

        this.getDataPostChange(body);
        this.commonChange();
    }

    public dataChange(data: any): void {
        if (this.filterInfoType == false) {
            this.provinceList = data;
            this.filterInfo = data;
            let $div = $('#' + this.scopeID).find('.provinceList');
            this.renderlistHtml($div, this.provinceList, false);
        } else {
            if (this.filterCityType == 'province') {
                let datalist = data;
                this.filterListObj = [];
                $.extend(true, this.filterListObj, data);
                let $div = $('#' + this.scopeID).find('.cityList');
                this.renderlistHtml($div, datalist, true);
                this.decideChedked($div, this.filterArray);
                this.decideAllChedked($div, this.filterArray);
            } else {
                let datalist = data;
                $.extend(true, this.filterListObj, data);
                let $div = $('#' + this.scopeID).find('.cityList');
                if (this.filterIndex == 1) {
                    $div = $('#' + this.scopeID).find('.cityList')
                    this.renderlistHtml($div, datalist, false);
                    this.decideChedked($div, this.filterArray);
                    this.decideAllChedked($div, this.filterArray);
                } else {
                    $div = $('#' + this.scopeID).find('.storeList');
                    this.renderlistHtml($div, datalist, true);
                    this.decideChedked($div, this.filterArray);
                    this.decideAllChedked($div, this.filterArray);
                }
            }
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
        this.defaultFilterBody = [
            {
                "field": "project_type",
                "operator": "=",
                "value": "10"
            },
            {
                "field": "projectType",
                "operator": "=",
                "value": "10"
            },
            {
                "field": "project_id",
                "operator": "in",
                "value": "%%"
            }
        ];
    }

    //渲染中间选择list
    private renderlistHtml(container: any, data: any, option: any): void {
        container.empty();
        let optionList: string = "";
        if (data.length > 0) {
            if (option) {
                optionList += '<ul><li class="allChecked" ><input type="checkbox"  id="全选" value="全选"/><label for="全选">全选</label></li>';
            } else {
                optionList += '<ul>';
            }

            for (let item of data) {
                optionList += '<li title="' + item.project_name + '">'
                if (option) {
                    optionList += '<input type="checkbox" id=' + item.id + ' name="filter" value="' + item.project_name + '"/><label for=' + item.id + '>' + item.project_name + '</label>';
                } else {
                    optionList += '<span class="provinceOne" id=' + item.id + '>' + item.project_name + '</span><span class="listBtn"> &gt; </span>'
                }
                optionList += '</li>';
            }
            optionList += '</ul>';
            container.append(optionList);
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

        this.filterArray.push({
            id: $input.id,
            name: $input.labels[0].innerText
        })
    }

    private delFilterListArr($input: any, $listDiv: any) {
        if (this.filterArray.length > 0) {
            for (let i = 0; i < this.filterArray.length; i++) {
                if (this.filterArray[i].id == $input.id) {
                    this.filterArray.splice(i, 1);
                }
            }
            if (this.filterArray.length < 100) {
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
            $chooseLength = $('#' + this.scopeID).find('.component_bottom_l span');  // 已经选择了多少个
        let $componentCity = $('#' + _self.scopeID).find('div[componentCity]');

        //解绑事件
        $('#' + _self.scopeID).find('.custom').off('click');
        $('.component_city_list', '#' + _self.scopeID).off('click');
        $('.cityList', '#' + _self.scopeID).off('click');
        $('#' + _self.scopeID).find('div[componentCity]').off('click');

        // 点击自定义按钮
        //click custom
        $('#' + _self.scopeID).find('.custom').on('click', (event: any) => {
            setTimeout(function () {
                $('#' + _self.scopeID).find(".component_city").show()
            }, 300);
            event.stopPropagation();
        });

        //click checkbox  获取选择了几个项目
        $('.selectFilterIndex2', '#' + _self.scopeID).on('click', 'input,label', (event: any) => {
            let $input = event.target.previousSibling,
                $listDiv = $('.selectList', '#' + _self.scopeID);
            _self.buildChange($input, $listDiv);
            $chooseLength.text(_self.filterArray.length);
            event.stopPropagation();
        })

        $('.selectList', '#' + _self.scopeID).on('click', '.provinceOne,.listBtn', function (event: any) {
            _self.filterInfoType = true;
            let orderByType = "city_type";
            if ($(this).parent().parent().parent().hasClass('provinceList')) {
                _self.filterIndex = 1;
                _self.filterIndexName = $(this).parent().find('.provinceOne').text();
                if (_self.filterCityType == "city" || _self.filterCityType == "store") {
                    _self.filterID = 3;
                } else if (_self.filterCityType == "province") {
                    _self.filterID = 10;
                }
                $componentCity.find('.cityList').empty();
                $componentCity.find('.storeList').empty();
            } else if ($(this).parent().parent().parent().hasClass('cityList')) {
                _self.filterIndex = 2;
                $componentCity.find('.storeList').empty();
                if (_self.filterCityType == "city") {
                    _self.filterID = 4;
                } else if (_self.filterCityType == "store") {
                    _self.filterID = 1;
                }
            }

            (_self.filterCityType == "province") ? orderByType = "city_type" : orderByType = "project_name";
            $(this).parent().siblings().css('background', '#fff');
            $(this).parent().css('background', '#F4F7FB');
            _self.filterSaveBrand = $(this).parent().find('.provinceOne').text();
            _self.getDataPostChange(_self.setBodyObj(_self.filterSaveBrand, _self.filterCityType, orderByType));
            event.stopPropagation();
        })

        //click get dropdown get list   控制省份 城市 店铺下拉列表显示隐藏
        $componentCity.on('click', '.component_top_select_box', (event: any) => {
            let $cityList = $(event.target).siblings('.component_top_select_list');
            $('.component_top_select_list').show();
            event.stopPropagation();
        })

        //click choose list  
        $componentCity.on('click', '.component_top_select_list', (event: any) => {
            // 切换省份、城市、店铺
            let $tagget = $(event.currentTarget);
            $tagget.siblings().text($(event.target).text());
            $tagget.siblings().attr("data-id", $(event.target).attr("data-id"));
            //点击设置选择的类型

            $('#' + this.scopeID).find('.provinceList').find("li").css('background', '#fff');
            $componentCity.find('.cityList').empty();
            $componentCity.find('.storeList').empty();
            _self.filterIndexName = "";
            _self.filterIndex = 1;
            _self.filterArray = [];
            $chooseLength.text(_self.filterArray.length);
            _self.filterCityType = $(event.target).attr("data-type");
            _self.filterID = $(event.target).attr("data-id");
            $('.component_top_select_list').hide();
            event.stopPropagation();
        });

        //click document
        $(document).click(function (e) {
            $('.component_top_select_list').hide();
            e.stopPropagation();
        })

        //click confirm  点击确定
        $componentCity.on('click', 'a[componentCityConfirm]', (event: any) => {
            _self.confirmPostChange();
            $componentCity.hide();
            event.stopPropagation();
        })

        //click cancel  点击取消
        $componentCity.on('click', 'a[componentCityCancel]', (event: any) => {
            // let provinceFilterShopArray = _self.provinceFilterData.provinceFilterShopArray;  // 单选下拉框
            // _self.filterIndexName = "";
            // _self.filterIndex = 1;
            // _self.filterArray = [];
            // _self.confirmPostChange();
            // $(".provinceList", '#' + _self.scopeID).find("li").css('background', '#fff');
            // $('#' + this.scopeID).find(".currentFilter").css({"background": "#43A3FB"});
            // $('#' + this.scopeID).find(".currentFilter").css({"color": "#fff"});
            // $('#' + this.scopeID).find(".custom").css({"background": "#fff"});
            // $('#' + this.scopeID).find(".custom").css({"color": "#464C5B"});
            // $componentCity.find('.cityList').empty();
            // $componentCity.find('.storeList').empty();
            // $chooseLength.text(_self.filterArray.length);
            // _self.filterInfoType = false;
            // _self.filterCityType = provinceFilterShopArray[0]['field'];  // 获取当选选择的type
            // _self.filterID = provinceFilterShopArray[0]['id'];  // 获取当选选择的type
            // $('#' + this.scopeID).find('.component_top_select_title').show().text(provinceFilterShopArray[0]['project_name']).attr('data-id', provinceFilterShopArray[0]['id']);  // 默认取单选下拉框第一个
            $componentCity.hide();
            event.stopPropagation();
        })

        // 点击省份按钮
        //click currentFilter
        $('#' + _self.scopeID).find('.currentFilter').on('click', (event: any) => {
            let provinceFilterShopArray = _self.provinceFilterData.provinceFilterShopArray;  // 单选下拉框
            _self.filterIndexName = "";
            //_self.filterIndex = 1;
            _self.filterArray = [];
            _self.confirmPostChange();
            $(".provinceList", '#' + _self.scopeID).find("li").css('background', '#fff');
            $componentCity.find('.cityList').empty();
            $componentCity.find('.storeList').empty();
            $chooseLength.text(_self.filterArray.length);
            _self.filterInfoType = false;
            //_self.filterCityType = provinceFilterShopArray[0]['field'];  // 获取当选选择的type
            //_self.filterID = provinceFilterShopArray[0]['id'];  // 获取当选选择的type
            //$('#' + this.scopeID).find('.component_top_select_title').show().text(provinceFilterShopArray[0]['project_name']).attr('data-id', provinceFilterShopArray[0]['id']);  // 默认取单选下拉框第一个
            $componentCity.hide();
            event.stopPropagation();
        });

        //search
        $componentCity.on('keyup', '.city_right_search', (event: any) => {
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

            let div = '.cityList';
            if (_self.filterCityType == "province") {
                div = '.cityList';
            } else {
                div = '.storeList';
            }
            _self.renderlistHtml($('#' + this.scopeID).find(div), newList, true);
            _self.decideChedked($(div, '#' + _self.scopeID), _self.filterArray);
            _self.decideAllChedked($(div, '#' + _self.scopeID), _self.filterArray);

            event.stopPropagation();
        })

    }

    //渲染单选下拉列表
    private renderSelectListHtml($div: any, data: any): void {
        let optionList: string = "";
        optionList += '<ul>';
        for (let item of data) {
            optionList += '<li data-id=' + item.id + ' data-type=' + item.field + '>' + item.project_name + '</li>'
        }
        optionList += '</ul>';
        $div.html(optionList);
    }

    private setChildFilterListArr($input: any, $listDiv: any) {
        let parentLiList = $input.parentNode.parentNode.childNodes; //所有的li
        for (let i = 0; i < parentLiList.length; i++) {
            if (parentLiList[i].childNodes[0].id != "全选") {
                parentLiList[i].childNodes[0].checked = true;
                for (let a = 0; a < this.filterArray.length; a++) {
                    if (this.filterArray[a].id == parentLiList[i].childNodes[0].id) {
                        this.filterArray.splice(a, 1);
                    }
                }
                this.filterArray.push({
                    id: parentLiList[i].childNodes[0].id,
                    name: parentLiList[i].childNodes[0].labels[0].innerText
                })
            }
        }

    }

    private delChildFilterListArr($input: any, $listDiv: any) {
        let parentLiList = $input.parentNode.parentNode.childNodes; //所有的li
        for (let i = 0; i < parentLiList.length; i++) {
            if (parentLiList[i].childNodes[0].id != "全选") {
                parentLiList[i].childNodes[0].checked = false;
                for (let j = 0; j < this.filterArray.length; j++) {
                    if (this.filterArray[j].id == parentLiList[i].childNodes[0].id) {
                        this.filterArray.splice(j, 1);
                    }
                }
            }
        }
    }

    //设置全选 input
    private decideAllChedked(optionList: any, filterArray: any) {
        let $li = $(optionList).find('li');
        let childInputChecked = {};
        let childInputCheckedAll = {};
        if (filterArray && filterArray.length > 0) {
            for (let i = 0; i < $li.length; i++) {
                let $liInput = $($li[i]).find('input');
                if ($liInput.attr('id') != "全选") {
                    childInputChecked[$liInput.attr('id')] = $liInput.attr('name'); // ul 下边有的ID
                    for (let j = 0; j < filterArray.length; j++) {
                        if ($liInput.attr('id') == filterArray[j]['id']) {
                            childInputCheckedAll[filterArray[j]['id']] = filterArray[j]['name'];
                            break;
                        }
                    }
                } else {
                    $liInput.prop('checked', true);
                }
            }

            for (let key in childInputChecked) {
                if (childInputCheckedAll.hasOwnProperty(key)) {

                } else {
                    $($li[0]).find("input").prop('checked', false);
                    break;
                }
            }
        }
    }

    private buildChange($input: any, $targetSiblings: any) { // $input:input  $targetSiblings:selectList
        if ($input !== null) {
            if ($input.id != "全选") {
                if (!$input.checked) {
                    this.setFilterListArr($input, $targetSiblings);
                } else {
                    this.delFilterListArr($input, $targetSiblings);
                }
                this.decideAllChedked($input.parentNode.parentNode.parentNode, this.filterArray);
            } else {
                if (!$input.checked) {
                    this.setChildFilterListArr($input, $targetSiblings);
                } else {
                    this.delChildFilterListArr($input, $targetSiblings);
                }
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
        if (!this.isEmptyObject(this.filterScopeIDObj) && this.filterArray.length > 0) {
            this.parameterPostChange(this.changeFilterArray());
            $('#' + this.scopeID).find(".custom").css({"background": "#43A3FB"});
            $('#' + this.scopeID).find(".custom").css({"color": "#fff"});
            $('#' + this.scopeID).find(".currentFilter").css({"background": "#fff"});
            $('#' + this.scopeID).find(".currentFilter").css({"color": "#464C5B"});
        } else {
            $('#' + this.scopeID).find(".custom").css({"background": "#fff"});
            $('#' + this.scopeID).find(".custom").css({"color": "#464C5B"});
            $('#' + this.scopeID).find(".currentFilter").css({"background": "#43A3FB"});
            $('#' + this.scopeID).find(".currentFilter").css({"color": "#fff"});
            this.parameterPostChange(this.defaultFilterBody);
            return;
        }
    }

    private changeFilterArray() {
        let changePostFilterArray: Array<any> = [
            {
                "field": "project_id",
                "operator": "in",
                "value": "0"
            },
            {
                "field": "project_type",
                "operator": "=",
                "value": this.filterID
            },
            {
                "field": "projectType",
                "operator": "=",
                "value": this.filterID
            }
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
    private setBodyObj(filterName: any, filterType: any, orderByType: any) {
        this.body['dimensions'] = [
            {"field": "project_name"},
            {"field": "id"}
        ];
        this.body['filters'] = [
            {"field": "status", "operator": "=", "value": "1"},
            {"field": "project_type", "operator": "=", "value": this.filterID},
            {"field": "province", "operator": "=", "value": filterName}

        ];

        this.body['orderBy'] = [
            {"field": orderByType, "function": "asc"}
        ];

        if (orderByType == 'city_type') {
            this.body['orderBy'].push({"field": "project_name", "function": "asc"});
        }

        if (this.filterIndex == 2) {
            this.body['filters'].push({"field": "city", "operator": "=", "value": filterName});
            this.body['filters'][2]["value"] = this.filterIndexName;
        } else {
            if (this.body['filters'].length > 3) {
                this.body['filters'].pop();
            }
        }
        this.body["limit"]=[-1];
        this.body["charUUID"] = this.scopeID;
        this.body["requestTitle"] = "provinceFilter";
        //console.log("=======>this.body",this.body)
        return this.body;
    }

}