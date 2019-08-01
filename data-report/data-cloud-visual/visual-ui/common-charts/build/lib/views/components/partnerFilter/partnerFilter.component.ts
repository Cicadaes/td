/**
 * Created by zhaoxue on 2017/3/28.
 */
import {BaseComponent} from "../base.component";
import {PartnerFilterTemplate} from "./partnerFilter.template";
import {Utils} from '../../../../public/scripts/utils';
import {PartnerFilterModel} from './partnerFilter.model';
import {BaseCharts} from '../../base/base.chart';
import * as $ from 'jquery';

export class PartnerFilterComponent extends BaseComponent {
    private myChart: any = null;
    private chartData: any = null;
    private echartData: any = null;
    private PartnerFilterData: PartnerFilterModel = null;
    private body: any = {
        "datasource_id": 27,
        "dimensions": [{"field": "project_name"}, {"field": "id"}],
        "filters": [
            {"field": "project_type", "operator": "=", "value": "8"},
            {"field": "status", "operator": "=", "value": "1"}
        ],
        "orderBy": [{"field": "project_name", "function": "asc"}]
    };

    private brandData: any;
    private selectID: any = "8";
    public selectType: any = "filter-channel";
    private filterArray: Array<any> = [];
    private filterValue: any = "";
    private filterScopeIDObj: any = null;
    private filterListObj: any = null;
    private brandBoolean: boolean = false;
    private filterSaveChannel: any = null;
    private filterSaveMall: any = null;
    private scene: any = null;
    private containerBaseDom: any = null;

    constructor() {
        super();
        let template = new PartnerFilterTemplate(this.scopeID);

        //获得模板渲染后的节点
        this.element = this.render(template);
        this.PartnerFilterData = new PartnerFilterModel();

    }

    public beforeShow(): void {

    }

    public afterShow(): void {
        this.containerBaseDom = $('#' + this.scopeID);

        this.init();

        //给背景设置透明色
        this.containerBaseDom.parent().css("background", "transparent");

        this.renderSelectListHtml(this.containerBaseDom.find('div[componentcellsleftlist]'), this.PartnerFilterData.partnerFilterChannelArray);
    }

    public beforeDestory(): void {

    }

    public afterDestory(): void {

    }

    public resize(): void {

    }

    public getconfiginformation(event: any, changeObj: any): void {
        this.scene = changeObj.result.scene;

        if (!this.isEmptyObject(changeObj.result)) {
            this.filterScopeIDObj = changeObj.result;
            this.decideSelectedID();
            this.commonChange();
        }
    }

    //判断selectedID
    private decideSelectedID() {
        let name = "";
        if (this.scene == "scene_1") {
            name = "渠道";
        } else if (this.scene == "scene_2") {
            name = "Top4";
        }
        this.containerBaseDom.find(".currentFilter").text(name);
    }

    //下拉框
    private renderSelectListHtml($div: any, data: any): void {
        let optionList: string = "";
        optionList += '<ul>';
        for (let item of data) {
            optionList += '<li data-id=' + item.id + ' data-type=' + item.type + '>' + item.project_name + '</li>'
        }
        optionList += '</ul>';

        $div.html(optionList);
    }

    //  品牌list
    private renderlistHtml($div: any, data: any): void {
        let optionList: string = "";
        if (data.length <= 0) {
            optionList += "<p class='error'>暂无数据</p>"
        }
        if (this.selectType == 'filter-list') {
            for (let item of data) {
                optionList += '<li title="' + item.project_name + '"><input type="checkbox" id="' + this.scopeID + item.id + '" name="filter" value=' + item.project_name + '/><label for=' + this.scopeID + item.id + '>' + item.project_name + '</label></li>';
            }
        } else {
            for (let item of data) {
                optionList += '<li title="' + item.project_name + '" class="lists" id=' + item.id + '>' + item.project_name + '</li>';
            }
        }
        $div.html(optionList);
        if (this.selectType == 'filter-list' && this.scene == "scene_1" && data.length > 0) {
            $div.prepend('<li class="allChecked" ><input type="checkbox"  id="全选" value="全选"/><label for="全选">全选</label></li>')
        }
    }

    // 判断选择的类型添加元素
    private decideFilterType(id: any) {
        let _self = this;
        let optionList: string = "";

        switch (id) {
            case "8"://渠道
                _self.selectType = "filter-channel";
                optionList += '<ul data-type="filter-channel" data-id="12" class="partnerFilter_channel"></ul>';
                optionList += '<ul data-type="filter-list" class="partnerFilter_channel"></ul>';
                break;
            case "7"://商城
                _self.selectType = "filter-channel";
                optionList += '<ul data-type="filter-channel" data-id="7" class="partnerFilter_channel"></ul>';
                optionList += '<ul data-type="filter-list" class="partnerFilter_channel"></ul>';
                break;
            case "1"://店铺
                _self.selectType = "filter-channel";
                optionList += '<ul data-type="filter-channel" data-id="7" class="partnerFilter_mall"></ul>';
                optionList += '<ul data-type="filter-mall" data-id="1" class="partnerFilter_mall"></ul>';
                optionList += '<ul data-type="filter-list" class="partnerFilter_mall"></ul>';
                break;
        }

        _self.containerBaseDom.find(".component_cells_list").html(optionList);
    }

    public dataChange(data: any): void {
        this.saveBrandData(data);
        this.filterListObj = data;
        let $htmlDiv = this.containerBaseDom.find(`.component_cells_list ul[data-type="${this.selectType}"]`);
        this.renderlistHtml($htmlDiv, data);
        this.setChedked($htmlDiv, this.filterArray);
        this.decideAllChedked($htmlDiv, this.filterArray);

    }

    public styleChange(style: any): void {

    }

    public loadData(): void {

    }

    public get data(): any {
        return this.chartData;
    }

    protected init(): void {
        //this.commonChange();
    }

    //存储初次请求数据
    private saveBrandData(data: any) {
        if (!this.brandBoolean) {
            this.brandData = data;
            this.brandBoolean = true;
        }
    }

    private commonChange() {
        let _self = this;

        if (_self.scene == "scene_2") {
            _self.containerBaseDom.find('.component_bottom_l').html('已选择<span>0</span>个  最多可选择<strong>4</strong>个');
        } else {
            _self.containerBaseDom.find('.component_bottom_l').html('已选择<span>0</span>个');
        }
        let $chooseLength = this.containerBaseDom.find('.component_bottom_l span');

        //click filter
        _self.containerBaseDom.find('div[componentFilter]').find(".custom").click((event: any) => {
            _self.containerBaseDom.find('.cells_right_search').val("");
            _self.containerBaseDom.find("div[componentOverall]").toggle();
            //post body
            if (!_self.brandBoolean) {
                _self.getDataPostChange(_self.body);
                _self.decideFilterType(_self.selectID);
            }
            event.stopPropagation();
        });

        _self.containerBaseDom.find('div[componentFilter]').find(".qudao").click((event: any) => {
            _self.containerBaseDom.find('.qudao').addClass('currentFilter').siblings().removeClass('currentFilter');
            _self.containerBaseDom.find(`.component_cells_list ul[data-type!="filter-channel"]`).empty();
            _self.containerBaseDom.find('.component_bottom_l span').text(0);
            _self.containerBaseDom.find('div[componentoverall]').hide();
            let $htmlDiv = _self.containerBaseDom.find(`.component_cells_list ul[data-type="${_self.selectType}"]`);
            _self.setChedked($htmlDiv, _self.filterArray);
            _self.decideAllChedked($htmlDiv, _self.filterArray);
            _self.filterArray = [];
            _self.containerBaseDom.find(`.component_cells_list ul`).find("li").removeClass("checkedBg");
            _self.sendMessage({
                "datasource_id": 13,
                "filter": [
                    {"field": "project_id", "operator": "in", "value": "%%"},
                    {"field": "project_type", "operator": "=", "value": "8"},
                    {"field": "projectType", "operator": "=", "value": "8"}
                ],
            });
            event.stopPropagation();
        });

        // 点击blank
        $(document).click(function (event) {
            let _con = $('div[componentOverall]');
            if (!_con.is(event.target) && _con.has(event.target).length === 0) {
                $('div[componentOverall]').hide();
            }
        });

        $(document).ready(function () {

            let $componentOverall = _self.containerBaseDom.find('div[componentOverall]');
            _self.containerBaseDom.find('div[componentOverall]').on('click', '.component_top', (event: any) => {
                $(event.target).siblings('.component_top_select_list').toggle();
                event.stopPropagation();
            });
            //click dropdown list   
            $componentOverall.on('click', '.component_top_select_list', (event: any) => {
                let $tagget = $(event.currentTarget);
                //把选中的值放入框中
                $tagget.siblings().text($(event.target).text());
                //设置点击的id
                _self.selectID = $(event.target).attr("data-id");
                //清空已选择的个数
                _self.containerBaseDom.find('.component_bottom_l span').text(0);
                //清空传送的数组
                _self.filterArray = [];
                //判断选择的类型添加元素
                _self.decideFilterType(_self.selectID);
                //添加好元素后放入已存储的数据
                let $htmlDiv = _self.containerBaseDom.find('.component_cells_list ul').first().attr("data-type", _self.selectType);

                _self.renderlistHtml($htmlDiv, _self.brandData);
                $(".component_top_select_list").hide();
            });

            //click choose list     
            $componentOverall.on('click', '.component_cells_list ul', (event: any) => {
                let $tagget = event.currentTarget,
                    $clickType,
                    $taggetID,
                    $input = event.target.previousSibling,
                    $targetSiblings = $(event.target).siblings();

                //点击设置选择的类型
                $clickType = $tagget.dataset.type;
                if (event.target.nodeName == "LI") {
                    $(event.target).addClass("checkedBg").siblings().removeClass("checkedBg")
                }
                if ($clickType == "filter-channel") {
                    _self.containerBaseDom.find(`.component_cells_list ul[data-type!="filter-channel"]`).empty();
                }

                if ($clickType != "filter-list") {
                    //点击设置已选择的value
                    _self.filterValue = event.target.childNodes[0].data;

                    //获取要发送的value
                    $taggetID = $tagget.dataset.id;
                    //存储要放入的ul的type
                    _self.selectType = $tagget.nextSibling.dataset.type;
                    //存储品牌,大区,城市已选择value
                    _self.saveFilterValue($clickType, _self.filterValue);
                    //发送请求
                    _self.getDataPostChange(_self.setBodyObj($taggetID, $clickType));
                } else {
                    if (event.target.innerText !== "暂无数据") {
                        _self.buildChange($input, $targetSiblings);
                    }
                }
                let len = _self.filterArray.length;
                $chooseLength.text(len);
                event.stopPropagation();
            });

            //click confirm
            $componentOverall.on('click', 'a[componentOverallConfirm]', (event: any) => {
                _self.containerBaseDom.find('.component_cells').hide();
                if (_self.filterArray.length <= 0) {
                    return;
                } else {
                    _self.containerBaseDom.find('.custom').addClass('currentFilter').siblings().removeClass('currentFilter');
                }
                //

                _self.confirmPostChange();

                //_self.filterArray = [];
                //_self.containerBaseDom.find('.component_bottom_l span').text(0);
            });

            //click cancel
            $componentOverall.on('click', 'a[componentOverallCancel]', (event: any) => {
                _self.containerBaseDom.find('.component_cells').hide();
                //_self.containerBaseDom.find('.component_bottom_l span').text(0);
                //_self.filterArray = [];
            });
            // search
            $componentOverall.on('keyup', '.cells_right_search', (event: any) => {
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
                let $htmlDiv = _self.containerBaseDom.find(`.component_cells_list ul[data-type="filter-list"]`);
                _self.renderlistHtml($htmlDiv, newList);
                _self.setChedked($htmlDiv, _self.filterArray);
                _self.decideAllChedked($htmlDiv, _self.filterArray);
                event.stopPropagation();
            });

            // click blank 
            $(document).click(function (event) {
                let _con = $('div[componentOverall]');
                if (!_con.is(event.target) && _con.has(event.target).length === 0) {
                    $('div[componentOverall]').hide();
                }
            });

        })

    }

    //存储已选择value
    private saveFilterValue($clickType: any, targetValue: any) {
        switch ($clickType) {
            case "filter-channel":
                this.filterSaveChannel = targetValue;
                break;
            case "filter-mall":
                this.filterSaveMall = targetValue;
                break;
        }
    }

    // 发送请求
    private getDataPostChange(postQuery: any) {
        postQuery["charUUID"] = this.scopeID;
        postQuery["requestTitle"] = "partnerFilter";
        let sendObj: Object = Object.assign(
            super.transformInput('scopeID', this.scopeID),
            super.transformInput('result', postQuery)
        );
        super.onChange(this, sendObj);
    }

    private setBodyObj(id: any, type: any) {
        switch (type) {
            case 'filter-channel':
                this.decideFilterField(id, "channel", this.body, this.filterScopeIDObj);
                break;
            case 'filter-mall':
                this.decideFilterField(id, "mall", this.body, this.filterScopeIDObj);
                break;
        }
        return this.body;
    }

    private decideFilterField(id: any, type: any, filters: any, result: any) {
        let decideFilterBody = filters;
        decideFilterBody['filters'] = [
            {"field": "status", "operator": "=", "value": "1"}
        ];
        //push projectType的值
        decideFilterBody['filters'].push({field: "project_type", operator: "=", value: id});

        switch (type) {
            case 'channel':
                decideFilterBody['filters'].push({field: 'channel', operator: "=", value: this.filterSaveChannel});
                break;
            case 'mall':
                decideFilterBody['filters'].push(
                    {field: 'channel', operator: "=", value: this.filterSaveChannel},
                    {field: 'mall', operator: "=", value: this.filterSaveMall},
                );
                break;
        }
        return decideFilterBody;
    }

    // 遍历选择的值改变状态
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

    // 存储选择的值
    private buildChange($input: any, $targetSiblings: any) {
        if ($input !== null) {
            if ($input.id != "全选" && $input.id != "") {
                if (!$input.checked) {
                    this.setFilterListArr($input, $targetSiblings);
                } else {
                    this.delFilterListArr($input, $targetSiblings);
                }
                if (this.scene == "scene_1") {
                    this.decideAllChedked($input.parentNode.parentNode, this.filterArray);
                }

            } else {
                if (this.scene == "scene_1") {
                    if (!$input.checked) {
                        this.setChildFilterListArr($input, $targetSiblings);
                    } else {
                        this.delChildFilterListArr($input, $targetSiblings);
                    }
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

    private setFilterListArr($input: any, $targetSiblings: any) {

        if (this.filterArray.length > 0) {
            for (let item of this.filterArray) {
                if (item.id == $input.id) {
                    break;
                }
            }
        }

        if (this.scene == "scene_2") {
            if (this.filterArray.length > 3) {
                $targetSiblings.attr("disabled", "disabled")
            } else {
                this.filterArray.push({
                    id: $input.id,
                    name: $input.value
                });
                $targetSiblings.attr("disabled", false)
            }
        } else {
            this.filterArray.push({
                id: $input.id,
                name: $input.value
            })
        }
    }

    private delFilterListArr($input: any, $targetSiblings: any) {
        if (this.filterArray.length > 0) {
            for (let i = 0; i < this.filterArray.length; i++) {
                if (this.filterArray[i].id == $input.id) {
                    this.filterArray.splice(i, 1)
                }
            }
        } else {
            if (this.scene == "scene_2") {
                if (this.filterArray.length < 99) {
                    $targetSiblings.prop("disabled", false)
                }
            } else {
                if (this.filterArray.length < 5) {
                    $targetSiblings.prop("disabled", false)
                }
            }
        }

    }

    // 确定
    private confirmPostChange() {
        if (!this.isEmptyObject(this.filterScopeIDObj)) {
            this.parameterPostChange(this.changeFilterArray());
        } else {
            return;
        }
    }

    private changeFilterArray() {
        let changePostFilterArray: Array<any> = [],
            filterValue: Array<any> = [];

        for (let item of this.filterArray) {
            filterValue.push((item.id).replace(this.scopeID, ""))
        }

        changePostFilterArray.push({
            "field": 'project_id',
            "operator": "in",
            "value": filterValue.toString()
        }, {
            "field": 'project_type',
            "operator": "=",
            "value": "%%"
        }, {
            "field": 'projectType',
            "operator": "=",
            "value": this.selectID
        });

        return changePostFilterArray;
    }

    private parameterPostChange(filterArray: any) {
        let sendObj: Object = Object.assign(
            super.transformInput('scopeID', this.scopeID),
            super.transformInput('filterObj', this.filterScopeIDObj),
            super.transformInput('result', Object.assign(super.transformInput('filter', filterArray)))
        );
        super.sendMessageBase(this, sendObj);
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