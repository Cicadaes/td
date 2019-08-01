/**
 * Created by zhaoxue on 2017/3/28.
 */
import {BaseComponent} from "../base.component";
import {CityFilterTemplate} from "./cityFilter.template";
import {Utils} from '../../../../public/scripts/utils';
import {CityFilterModel} from './cityFilter.model';
import {BaseCharts} from '../../base/base.chart';
import * as $ from 'jquery';

export class CityFilterComponent extends BaseComponent {
    private chartData: any = null;
    private cityFilterData: CityFilterModel = null;
    private filterScopeIDObj: any = null;
    private filterArray: Array<any> = [];
    private filterID: any = null;
    private filterSaveBrand: any = null;
    private brandlist: any = null;
    private filterListObj: any = null;
    private projectId: any = null;
    private hasSelectAll: any = true;
    private body: any = {
        'dimensions': null,
        'filters': null,
        "charUUID": this.scopeID,
        "requestTitle": "cityFilter"
    };
    private containerBaseDom: any = null;

    constructor() {
        super();
        let template = new CityFilterTemplate(this.scopeID);

        //获得模板渲染后的节点
        this.element = this.render(template);
        this.cityFilterData = new CityFilterModel();
    }

    public beforeShow(): void {

    }

    public afterShow(): void {
        this.containerBaseDom = $('#' + this.scopeID);
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
            this.hasSelectAll = changeObj.result.hasSelectAll;

            if (changeObj.result.scene && changeObj.result.scene == "scene_1") {
                this.containerBaseDom.find('.sameMall').show();
                this.containerBaseDom.find('.sameCounty').show();
            } else if (changeObj.result.scene && changeObj.result.scene == "scene_2") {
                this.containerBaseDom.find('.sameMall').hide();
                this.containerBaseDom.find('.sameCounty').hide();
            }

            this.commonChange();
        } else {
            return;
        }
    }

    public filterChange(event: any, data: any): void {
        this.mergeFilterObj = this.mergeDateObj = null;
        if (data['filter'] && data['filter'].length > 0) {
            this.projectId = data['filter'][0]['value'];
        }

        this.containerBaseDom.find('.defaultFilter').addClass('currentFilter').siblings().removeClass('currentFilter');
        this.resetCustomPanel();
    }

    public dataChange(data: any): void {
        this.filterListObj = data;
        if (data && this.filterID == "6") {
            //点击自定义时
            this.brandlist = data;
            let $div = this.containerBaseDom.find('.brandListBox');
            this.renderlistHtml($div, this.brandlist, false);
        } else if (data && this.filterID == "99") {
            //this.brandlist = data;
            let $div = this.containerBaseDom.find('.selectList');
            this.renderlistHtml($div, data, true);
            this.decideChedked($div, this.filterArray);
            this.decideAllChedked($div, this.filterArray);
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

    }

    //渲染中间选择list
    private renderlistHtml(container: any, data: any, option: any): void {
        container.empty();
        if (data.length > 0) {
            let optionList: string = "";
            //optionList += '<ul>';
            if (option) {
                optionList = '<ul><li class="allChecked" ><input type="checkbox"  id="全选" value="全选"/><label for="全选">全选</label></li>'
            } else {
                optionList = '<ul>';
            }
            for (let item of data) {
                optionList += '<li title="' + item.project_name + '">';
                if (option) {
                    optionList += '<input type="checkbox" id="' + this.scopeID + item.id + '" name="cityFilter" value="' + item.id + '"/><label for="' + this.scopeID + item.id + '">' + item.project_name + '</label>';
                } else {
                    optionList += '<span class="brandList" code="' + item.id + '">' + item.project_name + '</span><span class="listBtn"> &gt; </span>'
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

    private resetCustomPanel() {
        let _self = this;
        _self.filterArray = [];
        _self.containerBaseDom.find(".component_city").hide();
        _self.containerBaseDom.find(`.selectList ul`).empty();
        _self.containerBaseDom.find(`.brandListBox ul`).eq(0).find("li").css('background', '#fff');
    }

    private commonChange() {
        let _self = this,
            $chooseLength = this.containerBaseDom.find('.component_bottom_l span');

        //解绑事件
        _self.containerBaseDom.find('.custom').off('click');
        $('.component_city_list', '#' + _self.scopeID).off('click');
        $('.selectList', '#' + _self.scopeID).off('click');
        _self.containerBaseDom.find('div[componentCity]').off('click');

        //click custom
        _self.containerBaseDom.find('.custom').on('click', (event: any) => {
            if (!this.brandlist) {
                this.filterID = '6';
                //发送请求
                let body = {
                    "datasource_id": 27,
                    "dimensions": [{"field": "project_name"}, {"field": "id"}],
                    "filters": [
                        {"field": "project_type", "operator": "=", "value": "6"},
                        {"field": "status", "operator": "=", "value": "1"}
                    ],
                    "orderBy": [{"field": "project_name", "function": "asc"}]
                };
                this.getDataPostChange(body);
            }

            setTimeout(function () {
                _self.containerBaseDom.find(".component_city").show()
            }, 300);
            event.stopPropagation();
        });

        _self.containerBaseDom.find('.defaultFilter').on('click', (event: any) => {
            _self.containerBaseDom.find('.defaultFilter').addClass('currentFilter').siblings().removeClass('currentFilter');
            _self.resetCustomPanel();

            _self.sendMessage({
                "datasource_id": 38,
                "filter": [{"field": "project_id", "operator": "=", "value": this.projectId}],
            });
            event.stopPropagation();
        });

        _self.containerBaseDom.find('.sameMall').on('click', (event: any) => {
            _self.containerBaseDom.find('.sameMall').addClass('currentFilter').siblings().removeClass('currentFilter');
            _self.resetCustomPanel();

            _self.sendMessage({
                "datasource_id": 40,
                "filter": [{"field": "project_id", "operator": "=", "value": this.projectId}],
            });
            event.stopPropagation();
        });

        _self.containerBaseDom.find('.sameCounty').on('click', (event: any) => {
            _self.containerBaseDom.find('.sameCounty').addClass('currentFilter').siblings().removeClass('currentFilter');
            _self.resetCustomPanel();

            _self.sendMessage({
                "datasource_id": 39,
                "filter": [{"field": "project_id", "operator": "=", "value": this.projectId}],
            });
            event.stopPropagation();
        });

        $(document).ready(function () {
            let $componentCity = _self.containerBaseDom.find('div[componentCity]');

            //click get selectlist
            $('.brandListBox', '#' + _self.scopeID).on('click', 'li', function (event: any) {
                $('.brandListBox', '#' + _self.scopeID).find('li').css('background', '#fff');
                $(this).css('background', '#F4F7FB');
                let $brandEle = $(this).find('.brandList');
                _self.filterSaveBrand = $brandEle.text();

                _self.filterID = "99";
                _self.getDataPostChange({
                    "datasource_id": 43,
                    "dimensions": [
                        {
                            "field": "id"
                        },
                        {
                            "field": "project_name"
                        }
                    ],
                    "filters": [
                        {
                            "field": "project_type",
                            "operator": "=",
                            "value": "1"
                        },
                        {
                            "field": "project_id",
                            "operator": "in",
                            "value": _self.projectId
                        },
                        {
                            "field": "brand",
                            "operator": "=",
                            "value": _self.filterSaveBrand
                        },
                        {"field": "status", "operator": "=", "value": "1"}
                    ],
                    "limit": [
                        -1
                    ],
                    "dateGranularity": 0
                });

                event.stopPropagation();
            })

            //click checkbox
            $('.selectList', '#' + _self.scopeID).on('click', 'input,label', (event: any) => {
                let $target = event.target.previousSibling,
                    $listDiv = $('.selectList', '#' + _self.scopeID),
                    inputList = $('.selectList', '#' + _self.scopeID).find('input[name = "cityFilter"]');
                _self.buildChange($target, $listDiv);
                $chooseLength.text(_self.filterArray.length);
                event.stopPropagation();
            })

            //search
            $componentCity.on('keyup', '.city_right_search', (event: any) => {
                if (_self.filterSaveBrand) {
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
                    _self.renderlistHtml(_self.containerBaseDom.find('.selectList'), newList, true);
                    _self.decideChedked($('.selectList', '#' + _self.scopeID), _self.filterArray);
                    _self.decideAllChedked($('.selectList', '#' + _self.scopeID), _self.filterArray);
                }

                event.stopPropagation();
            });

            //click confirm
            $componentCity.on('click', 'a[componentCityConfirm]', (event: any) => {
                _self.confirmPostChange();

                if (_self.filterArray && _self.filterArray.length > 0) {
                    _self.containerBaseDom.find('.custom').addClass('currentFilter').siblings('.defaultFilter').removeClass('currentFilter');
                    _self.containerBaseDom.find('.sameCounty').removeClass('currentFilter');
                    _self.containerBaseDom.find('.sameMall').removeClass('currentFilter');
                }
                $componentCity.hide();
                event.stopPropagation();
            });

            //click cancel
            $componentCity.on('click', 'a[componentCityCancel]', (event: any) => {
                $componentCity.hide();
                event.stopPropagation();
            });

            $componentCity.on('click', function (event: any) {
                $componentCity.show();
                event.stopPropagation();
            })
        });

        //click document
        $(document).click(function (e) {
            $('.component_city', '#' + _self.scopeID).hide();
            e.stopPropagation();
        })

    }

    //渲染list
    private renderSelectListHtml($div: any, data: any): void {
        let optionList: string = "";

        optionList += '<ul>';
        for (let item of data) {
            optionList += '<li data-id=' + item.id + ' data-type=' + item.field + '>' + item.project_name + '</li>'
        }
        optionList += '</ul>';

        $div.html(optionList);
    }

    //全选
    private getSelectedFilter($inputList: any): void {
        this.filterArray = [];
        for (let i = 0; i < $inputList.length; i++) {
            if ($inputList[i].checked && $inputList[i].value != 'all') {
                this.filterArray.push($inputList[i].value);
            }
        }
    }

    private buildChange($input: any, $targetSiblings: any) {
        if ($input !== null) {
            if ($input.id != "全选") {
                if (!$input.checked) {
                    this.setFilterListArr($input, $targetSiblings);
                } else {
                    this.delFilterListArr($input, $targetSiblings);
                }
                this.decideAllChedked($input.parentNode.parentNode, this.filterArray);
            } else {
                if (!$input.checked) {
                    this.setChildFilterListArr($input, $targetSiblings);
                } else {
                    this.delChildFilterListArr($input, $targetSiblings);
                }
            }
        }
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

    private getDataPostChange(postQuery: any) {
        if (postQuery && !this.isEmptyObject(postQuery)) {
            postQuery["charUUID"] = this.scopeID;
            postQuery["requestTitle"] = "cityFilter";
            let sendObj: Object = Object.assign(
                super.transformInput('scopeID', this.scopeID),
                super.transformInput('result', postQuery)
            );

            super.onChange(this, sendObj);
        }
    }

    private confirmPostChange() {
        if (this.filterArray.length > 0) {
            let filter = [];
            filter = this.changeFilterArray();
            this.sendMessage({
                "datasource_id": 13,
                "filter": filter,
            });
        }
    }

    private changeFilterArray() {

        let changePostFilterArray: Array<any> = [{
            "field": 'project_id',
            "operator": "in",
            "value": '0'
        }];
        let value = ' ';

        for (let i = 0; i < this.filterArray.length; i++) {
            value += (',' + this.filterArray[i].id.replace(this.scopeID, "") );

        }
        changePostFilterArray[0]["value"] = value.trim().substr(1);
        return changePostFilterArray;
    }

    private sendMessage(result: any) {
        let sendObj: Object = Object.assign(
            super.transformInput('scopeID', this.scopeID),
            super.transformInput('filterObj', this.filterScopeIDObj),
            super.transformInput('result', result)
        );
        super.sendMessageBase(this, sendObj);
    }

}