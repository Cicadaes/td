/**
 * Created by zhaoxue on 2017/3/28.
 */
import {BaseComponent} from "../base.component";
import {CellsFilterTemplate} from "./cellsFilter.template";
import {Utils} from '../../../../public/scripts/utils';
import {CellsFilterModel} from './cellsFilter.model';
import {BaseCharts} from '../../base/base.chart';
import * as $ from 'jquery';

export class CellsFilterComponent extends BaseComponent {
    private myChart: any = null;
    private chartData: any = null;
    private echartData: any = null;
    private CellsFilterData: CellsFilterModel = null;
    private body: any = {
        "datasource_id": 27,
        "dimensions": [{"field": "project_name"}, {"field": "id"}],
        "filters": [
            {"field": "project_type", "operator": "=", "value": "6"},
            {"field": "project_id", "operator": "in", "value": "%%"},
            {"field": "status", "operator": "=", "value": "1"}
        ],
        "orderBy": [{"field": "project_name", "function": "asc"}]
    };

    private brandData: any;
    public selectType: any = null;
    private saveSelectType: any = "filter-shop";
    private filterArray: Array<any> = [];
    private filterValue: any = "";
    private filterScopeIDObj: any = null;
    private selectID: any;
    private filterListObj: any = null;
    private brandBoolean: boolean = false;
    private filterSaveShop: any = null;
    private filterSaveRegion: any = null;
    private filterSaveCity: any = null;
    private scene: any = null;
    private projectId: any = null;
    private containerBaseDom: any = null;

    constructor() {
        super();
        let template = new CellsFilterTemplate(this.scopeID);

        //获得模板渲染后的节点
        this.element = this.render(template);
        this.CellsFilterData = new CellsFilterModel();

    }

    public beforeShow(): void {

    }

    public afterShow(): void {
        this.containerBaseDom = $('#' + this.scopeID);

        this.selectType = null;
        this.saveSelectType = "filter-shop";

        this.init();
        //给背景设置透明色
        this.containerBaseDom.parent().css("background", "transparent");
    }

    public beforeDestory(): void {

    }

    public afterDestory(): void {
        this.selectType = null;
        this.saveSelectType = "filter-shop";
    }

    public resize(): void {

    }

    public getconfiginformation(event: any, changeObj: any): void {
        this.scene = changeObj.result.scene;

        if (!this.isEmptyObject(changeObj.result)) {
            // select默认值设置
            this.filterScopeIDObj = changeObj.result;
            this.selectID = changeObj.result.selectID;
            let filterShopArray = this.CellsFilterData.cellsFilterShopArray;
            this.renderSelectListHtml(this.containerBaseDom.find('div[componentcellsleftlist]'), filterShopArray);
            this.decideSelectedID(changeObj.result);
            this.decideFilterType(this.selectID);
            this.commonChange();
        } else {
            return;
        }

    }

    //判断selectedID
    private decideSelectedID(result: any) {
        let currentFilterDIV: any = this.containerBaseDom.find(".currentFilter");
        currentFilterDIV.text(result.displayName);

        let componentTopSelectTitle = this.containerBaseDom.find(".component_top_select_title");
        switch (result.selectID) {
            case "1":
                componentTopSelectTitle.text("按店铺查看");
                break;
            case "11":
                componentTopSelectTitle.text("按城市查看");
                break;
            case "5":
                componentTopSelectTitle.text("按大区查看");
                break;
            case "6":
                componentTopSelectTitle.text("按品牌查看");
                break;
        }
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
                optionList += '<li title="' + item.project_name + '"><input type="checkbox" id=' + item.id + this.scopeID + ' name="filter" value=' + item.project_name + '/><label for=' + item.id + this.scopeID + '>' + item.project_name + '</label></li>';
            }
        } else {
            for (let item of data) {
                optionList += '<li title="' + item.project_name + '" class="lists" id=' + item.id + this.scopeID + '>' + item.project_name + '</li>';
            }
        }
        $div.html(optionList);
        if (this.selectType == 'filter-list' && this.scene != 'scene_2' && data.length > 0) {
            $div.prepend('<li class="allChecked" ><input type="checkbox"  id="全选" value="全选"/><label for="全选">全选</label></li>')
        }
    }

    // 判断选择的类型添加元素
    private decideFilterType(id: any) {
        let _self = this;
        let optionList: string = "";
        switch (id) {
            case "1"://按店铺查看
                _self.selectType = "filter-shop";
                optionList += '<ul data-type="filter-shop" data-id="5"></ul>';
                optionList += '<ul data-type="filter-region" data-id="11"></ul>';
                optionList += '<ul data-type="filter-city" data-id="1"></ul>';
                optionList += '<ul data-type="filter-list" ></ul>';
                break;
            case "11"://按城市查看
                _self.selectType = "filter-shop";
                optionList += '<ul data-type="filter-shop" data-id="5"></ul>';
                optionList += '<ul data-type="filter-region" data-id="11"></ul>';
                optionList += '<ul data-type="filter-list"></ul>';
                break;
            case "5"://按大区查看
                _self.selectType = "filter-shop";
                optionList += '<ul data-type="filter-shop" data-id="5"></ul>';
                optionList += '<ul data-type="filter-list"></ul>';
                break;
            case "6":
                _self.selectType = _self.saveSelectType = "filter-list";
                optionList = '<ul data-type="filter-list"></ul>'
        }
        _self.containerBaseDom.find(".component_cells_list").html(optionList);
    }

    public filterChange(event: any, data: any): void {
        if (data['filter'] && data['filter'].length > 0) {
            this.projectId = data['filter'][0]['value'];
        }

        this.resetCustomPanel();
        this.containerBaseDom.find('.regionFilter').addClass("currentFilter").siblings().removeClass("currentFilter");
    }

    public dataChange(data: any): void {
        if (this.selectType == this.saveSelectType) {
            this.saveBrandData(data);
            //this.filterListObj = data;
            this.filterListObj = [];
            $.extend(true, this.filterListObj, data);
            let $htmlDiv = this.containerBaseDom.find(`.component_cells_list ul[data-type="${this.selectType}"]`);
            this.renderlistHtml($htmlDiv, data);
            this.setChedked($htmlDiv, this.filterArray, true)
            this.decideAllChedked($htmlDiv, this.filterArray);
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
        //this.commonChange();
    }

    //存储初次请求数据
    private saveBrandData(data: any) {
        if (!this.brandBoolean) {
            this.brandData = data;
            this.brandBoolean = true;
        }
    }

    private resetCustomPanel() {
        let _self = this;
        _self.filterArray = [];
        _self.containerBaseDom.find('div[componentoverall]').hide();
        _self.containerBaseDom.find(`.component_cells_list ul[data-type!="filter-shop"]`).empty();
    }

    private commonChange() {
        let _self = this;
        if (this.scene == 'scene_2') {
            this.containerBaseDom.find('.component_bottom_l').html('已选择<span>0</span>个  最多可选择<strong>4</strong>个');
        } else {
            this.containerBaseDom.find('.component_bottom_l').html('已选择<span>0</span>个');
        }

        let $chooseLength = this.containerBaseDom.find('.component_bottom_l span');
        //click 大区/品牌
        _self.containerBaseDom.find('div[componentFilter]').find(".regionFilter").click((event: any) => {
            _self.containerBaseDom.find('.component_bottom_l span').text(0);

            let $htmlDiv = _self.containerBaseDom.find(`.component_cells_list ul[data-type="${_self.selectType}"]`);
            _self.setChedked($htmlDiv, _self.filterArray, false);
            _self.decideAllChedked($htmlDiv, _self.filterArray);

            _self.resetCustomPanel();

            _self.containerBaseDom.find(`.component_cells_list ul`).find("li").removeClass("checkedBg");
            $(event.target).addClass("currentFilter").siblings().removeClass("currentFilter");

            if (_self.scene == "scene_1") {
                _self.sendMessage({
                    "datasource_id": 13,
                    "filter": [
                        {"field": "project_type", "operator": "=", "value": "5"},
                        {"field": "projectType", "operator": "=", "value": "5"},
                        {"field": "project_id", "operator": "in", "value": "%%"}
                    ],
                });
            } else if (_self.scene == "scene_2") {
                _self.sendMessage({
                    "datasource_id": 13,
                    "filter": [
                        {"field": "project_type", "operator": "=", "value": "6"},
                        {"field": "projectType", "operator": "=", "value": "6"},
                        {"field": "project_id", "operator": "in", "value": "%%"}
                    ],
                });
            } else if (_self.scene == "scene_3") {
                _self.sendMessage({
                    "datasource_id": 41,
                    "filter": [
                        {"field": "project_type", "operator": "=", "value": "11"},
                        {"field": "projectType", "operator": "=", "value": "11"},
                        {"field": "project_id", "operator": "in", "value": _self.projectId}
                    ],
                });
            } else if (_self.scene == "scene_4") {
                _self.sendMessage({
                    "datasource_id": 42,
                    "filter": [
                        {"field": "project_type", "operator": "=", "value": "5"},
                        {"field": "projectType", "operator": "=", "value": "5"},
                        {"field": "project_id", "operator": "in", "value": _self.projectId}
                    ],
                });
            }
            event.stopPropagation();
        });

        //点击自定义
        _self.containerBaseDom.find('div[componentFilter]').find(".custom").click((event: any) => {
            _self.containerBaseDom.find('.cells_right_search').val("");
            _self.containerBaseDom.find("div[componentOverall]").toggle();

            //post body
            if (!_self.brandBoolean) {
                _self.getDataPostChange(_self.body);

                setTimeout(() => {
                    let $htmlDiv = this.containerBaseDom.find(`.component_cells_list ul[data-type="${this.selectType}"]`);
                    _self.renderlistHtml($htmlDiv, _self.brandData);
                }, 200);
            }
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
                if ($(event.target).attr("data-type")) {
                    return
                }

                $(event.target).addClass("checkedBg").siblings().removeClass("checkedBg");
                if ($clickType == "filter-shop") {
                    _self.containerBaseDom.find(`.component_cells_list ul[data-type!="filter-shop"]`).empty();
                } else if ($clickType == "filter-region" && _self.selectID == "1") {
                    _self.containerBaseDom.find(`.component_cells_list ul[data-type = "filter-list"]`).empty();
                }

                if ($clickType != "filter-list") {
                    //点击设置已选择的value
                    _self.filterValue = event.target.childNodes[0].data;

                    //获取要发送的value
                    $taggetID = $tagget.dataset.id;
                    //存储要放入的ul的type
                    _self.selectType = $tagget.nextSibling.dataset.type;
                    _self.saveSelectType = $tagget.nextSibling.dataset.type;
                    //存储品牌,大区,城市已选择value
                    _self.saveFilterValue($clickType, _self.filterValue);
                    //发送请求
                    _self.getDataPostChange(_self.setBodyObj($taggetID, $clickType));
                } else {
                    _self.buildChange($input, $targetSiblings);

                }
                let len = _self.filterArray.length;
                $chooseLength.text(len);
                event.stopPropagation();
            });

            //click confirm
            $componentOverall.on('click', 'a[componentOverallConfirm]', (event: any) => {
                _self.containerBaseDom.find('.component_cells').hide();
                _self.confirmPostChange();
            });

            //click cancel
            $componentOverall.on('click', 'a[componentOverallCancel]', (event: any) => {
                _self.containerBaseDom.find('.component_cells').hide();
            });

            // search
            $componentOverall.on('keyup', '.cells_right_search', (event: any) => {
                let searchText = $(event.target).val().trim();
                let flag = false;
                let newList = [];
                let borderDiv = _self.containerBaseDom.find(`.component_cells_list ul[data-type="filter-city"]`)[0];
                if(_self.selectID == 1){
                    borderDiv = _self.containerBaseDom.find(`.component_cells_list ul[data-type="filter-city"]`)[0];
                }else if(_self.selectID == 11){
                    borderDiv = _self.containerBaseDom.find(`.component_cells_list ul[data-type="filter-region"]`)[0];
                }else if(_self.selectID == 5){
                    borderDiv = _self.containerBaseDom.find(`.component_cells_list ul[data-type="filter-shop"]`)[0];
                }else if(_self.selectID == 6){
                    if (searchText.length <= 0) {
                        newList = _self.brandData;
                    } else {
                        for (let i = 0; i < _self.brandData.length; i++) {
                            if (_self.brandData[i]['project_name'].toLowerCase().indexOf(searchText.toLowerCase()) != -1) {
                                newList.push(_self.brandData[i]);
                            }
                        }
                    }
                    let $htmlDiv = _self.containerBaseDom.find(`.component_cells_list ul[data-type="filter-list"]`);
                    _self.renderlistHtml($htmlDiv, newList);
                    _self.setChedked($htmlDiv, _self.filterArray, true);
                    _self.decideAllChedked($htmlDiv, _self.filterArray);
                    event.stopPropagation();
                    return;
                }
                
                
                if(borderDiv.childNodes.length == 0){
                    return;
                }else{
                    for(let i = 0; i < borderDiv.childNodes.length; i++){
                        let obj = borderDiv.childNodes[i]
                        if(obj.className.indexOf("checkedB") != -1){
                            flag = true;
                        }
                    }
                }
                if(flag == true){
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
                    _self.setChedked($htmlDiv, _self.filterArray, true);
                    _self.decideAllChedked($htmlDiv, _self.filterArray);
                    event.stopPropagation();
                }else {
                    return;
                }
                
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
            case "filter-shop":
                this.filterSaveShop = targetValue;
                break;
            case "filter-region":
                this.filterSaveRegion = targetValue;
                break;
            case "filter-city":
                this.filterSaveCity = targetValue;
                break;
        }
    }

    // 发送请求
    private getDataPostChange(postQuery: any) {
        postQuery["charUUID"] = this.scopeID;
        postQuery["requestTitle"] = "cellsFilter";

        let sendObj: Object = Object.assign(
            super.transformInput('scopeID', this.scopeID),
            super.transformInput('result', postQuery)
        );
        super.onChange(this, sendObj);
    }

    private setBodyObj(id: any, type: any) {

        switch (type) {
            case 'filter-shop'://品牌
                this.decideFilterField(id, "brand", this.body);
                break;
            case 'filter-region'://大区
                this.decideFilterField(id, "region", this.body);
                break;
            case 'filter-city'://城市
                this.decideFilterField(id, "logical_city", this.body);
                break;
        }
        return this.body;
    }

    private decideFilterField(id: any, type: any, filters: any) {
        let decideFilterBody = filters;
        decideFilterBody['filters'] = [
            {"field": "status", "operator": "=", "value": "1"}
        ];
        //push projectType的值
        decideFilterBody['filters'].push({field: "project_type", operator: "=", value: id});
        switch (type) {
            case 'brand':
                decideFilterBody['filters'].push({field: 'brand', operator: "=", value: this.filterSaveShop});
                break;
            case 'region':
                decideFilterBody['filters'].push(
                    {field: 'brand', operator: "=", value: this.filterSaveShop},
                    {field: 'region', operator: "=", value: this.filterSaveRegion},
                );
                break;
            case 'logical_city':
                decideFilterBody['filters'].push(
                    {field: 'brand', operator: "=", value: this.filterSaveShop},
                    {field: 'region', operator: "=", value: this.filterSaveRegion},
                    {field: 'logical_city', operator: "=", value: this.filterSaveCity},
                );
                break;
        }
        return decideFilterBody;
    }

    // 遍历选择的值改变状态
    private setChedked(optionList: any, filterArray: any, bool: boolean) {
        let $li = $(optionList).find('li');
        if (filterArray && filterArray.length > 0) {
            for (let i = 0; i < $li.length; i++) {
                let $liInput = $($li[i]).find('input');
                for (let j = 0; j < filterArray.length; j++) {
                    if ($liInput.attr('id') == filterArray[j]['id']) {
                        $liInput.prop('checked', bool);
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
                if (this.scene != 'scene_2') {
                    this.decideAllChedked($input.parentNode.parentNode, this.filterArray);
                }
            } else {
                if (this.scene != 'scene_2') {
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

        if (this.scene == 'scene_2') {
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
            if (this.scene == 'scene_2') {
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
        if (this.filterArray.length > 0) {
            this.containerBaseDom.find(".regionFilter").removeClass("currentFilter");
            this.containerBaseDom.find(".custom").addClass("currentFilter");

            let filterValue: Array<any> = [];
            for (let item of this.filterArray) {
                let id = (item.id).replace(this.scopeID, "");
                filterValue.push(id);
            }

            let filter = [
                {
                    "field": 'project_id',
                    "operator": "in",
                    "value": filterValue.toString()
                }, {
                    "field": 'project_type',
                    "operator": "=",
                    "value": this.selectID
                }, {
                    "field": 'projectType',
                    "operator": "=",
                    "value": this.selectID
                }
            ];

            this.sendMessage({
                "datasource_id": 13,
                "filter": filter,
            });
        }
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