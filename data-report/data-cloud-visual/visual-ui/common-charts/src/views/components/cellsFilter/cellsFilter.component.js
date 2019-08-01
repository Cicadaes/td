"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by zhaoxue on 2017/3/28.
 */
var base_component_1 = require("../base.component");
var cellsFilter_template_1 = require("./cellsFilter.template");
var cellsFilter_model_1 = require("./cellsFilter.model");
var $ = require("jquery");
var CellsFilterComponent = (function (_super) {
    __extends(CellsFilterComponent, _super);
    function CellsFilterComponent() {
        var _this = _super.call(this) || this;
        _this.myChart = null;
        _this.chartData = null;
        _this.echartData = null;
        _this.CellsFilterData = null;
        _this.body = {
            "datasource_id": 27,
            "dimensions": [{ "field": "project_name" }, { "field": "id" }],
            "filters": [
                { "field": "project_type", "operator": "=", "value": "6" },
                { "field": "project_id", "operator": "in", "value": "%%" },
                { "field": "status", "operator": "=", "value": "1" }
            ],
            "orderBy": [{ "field": "project_name", "function": "asc" }]
        };
        _this.selectType = null;
        _this.saveSelectType = "filter-shop";
        _this.filterArray = [];
        _this.filterValue = "";
        _this.filterScopeIDObj = null;
        _this.filterListObj = null;
        _this.brandBoolean = false;
        _this.filterSaveShop = null;
        _this.filterSaveRegion = null;
        _this.filterSaveCity = null;
        _this.scene = null;
        _this.projectId = null;
        _this.containerBaseDom = null;
        var template = new cellsFilter_template_1.CellsFilterTemplate(_this.scopeID);
        //获得模板渲染后的节点
        _this.element = _this.render(template);
        _this.CellsFilterData = new cellsFilter_model_1.CellsFilterModel();
        return _this;
    }
    CellsFilterComponent.prototype.beforeShow = function () {
    };
    CellsFilterComponent.prototype.afterShow = function () {
        this.containerBaseDom = $('#' + this.scopeID);
        this.selectType = null;
        this.saveSelectType = "filter-shop";
        this.init();
        //给背景设置透明色
        this.containerBaseDom.parent().css("background", "transparent");
    };
    CellsFilterComponent.prototype.beforeDestory = function () {
    };
    CellsFilterComponent.prototype.afterDestory = function () {
        this.selectType = null;
        this.saveSelectType = "filter-shop";
    };
    CellsFilterComponent.prototype.resize = function () {
    };
    CellsFilterComponent.prototype.getconfiginformation = function (event, changeObj) {
        this.scene = changeObj.result.scene;
        if (!this.isEmptyObject(changeObj.result)) {
            // select默认值设置
            this.filterScopeIDObj = changeObj.result;
            this.selectID = changeObj.result.selectID;
            var filterShopArray = this.CellsFilterData.cellsFilterShopArray;
            this.renderSelectListHtml(this.containerBaseDom.find('div[componentcellsleftlist]'), filterShopArray);
            this.decideSelectedID(changeObj.result);
            this.decideFilterType(this.selectID);
            this.commonChange();
        }
        else {
            return;
        }
    };
    //判断selectedID
    CellsFilterComponent.prototype.decideSelectedID = function (result) {
        var currentFilterDIV = this.containerBaseDom.find(".currentFilter");
        currentFilterDIV.text(result.displayName);
        var componentTopSelectTitle = this.containerBaseDom.find(".component_top_select_title");
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
    };
    //下拉框
    CellsFilterComponent.prototype.renderSelectListHtml = function ($div, data) {
        var optionList = "";
        optionList += '<ul>';
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var item = data_1[_i];
            optionList += '<li data-id=' + item.id + ' data-type=' + item.type + '>' + item.project_name + '</li>';
        }
        optionList += '</ul>';
        $div.html(optionList);
    };
    //  品牌list
    CellsFilterComponent.prototype.renderlistHtml = function ($div, data) {
        var optionList = "";
        if (data.length <= 0) {
            optionList += "<p class='error'>暂无数据</p>";
        }
        if (this.selectType == 'filter-list') {
            for (var _i = 0, data_2 = data; _i < data_2.length; _i++) {
                var item = data_2[_i];
                optionList += '<li title="' + item.project_name + '"><input type="checkbox" id=' + item.id + this.scopeID + ' name="filter" value=' + item.project_name + '/><label for=' + item.id + this.scopeID + '>' + item.project_name + '</label></li>';
            }
        }
        else {
            for (var _a = 0, data_3 = data; _a < data_3.length; _a++) {
                var item = data_3[_a];
                optionList += '<li title="' + item.project_name + '" class="lists" id=' + item.id + this.scopeID + '>' + item.project_name + '</li>';
            }
        }
        $div.html(optionList);
        if (this.selectType == 'filter-list' && this.scene != 'scene_2' && data.length > 0) {
            $div.prepend('<li class="allChecked" ><input type="checkbox"  id="全选" value="全选"/><label for="全选">全选</label></li>');
        }
    };
    // 判断选择的类型添加元素
    CellsFilterComponent.prototype.decideFilterType = function (id) {
        var _self = this;
        var optionList = "";
        switch (id) {
            case "1":
                _self.selectType = "filter-shop";
                optionList += '<ul data-type="filter-shop" data-id="5"></ul>';
                optionList += '<ul data-type="filter-region" data-id="11"></ul>';
                optionList += '<ul data-type="filter-city" data-id="1"></ul>';
                optionList += '<ul data-type="filter-list" ></ul>';
                break;
            case "11":
                _self.selectType = "filter-shop";
                optionList += '<ul data-type="filter-shop" data-id="5"></ul>';
                optionList += '<ul data-type="filter-region" data-id="11"></ul>';
                optionList += '<ul data-type="filter-list"></ul>';
                break;
            case "5":
                _self.selectType = "filter-shop";
                optionList += '<ul data-type="filter-shop" data-id="5"></ul>';
                optionList += '<ul data-type="filter-list"></ul>';
                break;
            case "6":
                _self.selectType = _self.saveSelectType = "filter-list";
                optionList = '<ul data-type="filter-list"></ul>';
        }
        _self.containerBaseDom.find(".component_cells_list").html(optionList);
    };
    CellsFilterComponent.prototype.filterChange = function (event, data) {
        if (data['filter'] && data['filter'].length > 0) {
            this.projectId = data['filter'][0]['value'];
        }
        this.resetCustomPanel();
        this.containerBaseDom.find('.regionFilter').addClass("currentFilter").siblings().removeClass("currentFilter");
    };
    CellsFilterComponent.prototype.dataChange = function (data) {
        if (this.selectType == this.saveSelectType) {
            this.saveBrandData(data);
            //this.filterListObj = data;
            this.filterListObj = [];
            $.extend(true, this.filterListObj, data);
            var $htmlDiv = this.containerBaseDom.find(".component_cells_list ul[data-type=\"" + this.selectType + "\"]");
            this.renderlistHtml($htmlDiv, data);
            this.setChedked($htmlDiv, this.filterArray, true);
            this.decideAllChedked($htmlDiv, this.filterArray);
        }
    };
    CellsFilterComponent.prototype.styleChange = function (style) {
    };
    CellsFilterComponent.prototype.loadData = function () {
    };
    Object.defineProperty(CellsFilterComponent.prototype, "data", {
        get: function () {
            return this.chartData;
        },
        enumerable: true,
        configurable: true
    });
    CellsFilterComponent.prototype.init = function () {
        //this.commonChange();
    };
    //存储初次请求数据
    CellsFilterComponent.prototype.saveBrandData = function (data) {
        if (!this.brandBoolean) {
            this.brandData = data;
            this.brandBoolean = true;
        }
    };
    CellsFilterComponent.prototype.resetCustomPanel = function () {
        var _self = this;
        _self.filterArray = [];
        _self.containerBaseDom.find('div[componentoverall]').hide();
        _self.containerBaseDom.find(".component_cells_list ul[data-type!=\"filter-shop\"]").empty();
    };
    CellsFilterComponent.prototype.commonChange = function () {
        var _this = this;
        var _self = this;
        if (this.scene == 'scene_2') {
            this.containerBaseDom.find('.component_bottom_l').html('已选择<span>0</span>个  最多可选择<strong>4</strong>个');
        }
        else {
            this.containerBaseDom.find('.component_bottom_l').html('已选择<span>0</span>个');
        }
        var $chooseLength = this.containerBaseDom.find('.component_bottom_l span');
        //click 大区/品牌
        _self.containerBaseDom.find('div[componentFilter]').find(".regionFilter").click(function (event) {
            _self.containerBaseDom.find('.component_bottom_l span').text(0);
            var $htmlDiv = _self.containerBaseDom.find(".component_cells_list ul[data-type=\"" + _self.selectType + "\"]");
            _self.setChedked($htmlDiv, _self.filterArray, false);
            _self.decideAllChedked($htmlDiv, _self.filterArray);
            _self.resetCustomPanel();
            _self.containerBaseDom.find(".component_cells_list ul").find("li").removeClass("checkedBg");
            $(event.target).addClass("currentFilter").siblings().removeClass("currentFilter");
            if (_self.scene == "scene_1") {
                _self.sendMessage({
                    "datasource_id": 13,
                    "filter": [
                        { "field": "project_type", "operator": "=", "value": "5" },
                        { "field": "projectType", "operator": "=", "value": "5" },
                        { "field": "project_id", "operator": "in", "value": "%%" }
                    ],
                });
            }
            else if (_self.scene == "scene_2") {
                _self.sendMessage({
                    "datasource_id": 13,
                    "filter": [
                        { "field": "project_type", "operator": "=", "value": "6" },
                        { "field": "projectType", "operator": "=", "value": "6" },
                        { "field": "project_id", "operator": "in", "value": "%%" }
                    ],
                });
            }
            else if (_self.scene == "scene_3") {
                _self.sendMessage({
                    "datasource_id": 41,
                    "filter": [
                        { "field": "project_type", "operator": "=", "value": "11" },
                        { "field": "projectType", "operator": "=", "value": "11" },
                        { "field": "project_id", "operator": "in", "value": _self.projectId }
                    ],
                });
            }
            else if (_self.scene == "scene_4") {
                _self.sendMessage({
                    "datasource_id": 42,
                    "filter": [
                        { "field": "project_type", "operator": "=", "value": "5" },
                        { "field": "projectType", "operator": "=", "value": "5" },
                        { "field": "project_id", "operator": "in", "value": _self.projectId }
                    ],
                });
            }
            event.stopPropagation();
        });
        //点击自定义
        _self.containerBaseDom.find('div[componentFilter]').find(".custom").click(function (event) {
            _self.containerBaseDom.find('.cells_right_search').val("");
            _self.containerBaseDom.find("div[componentOverall]").toggle();
            //post body
            if (!_self.brandBoolean) {
                _self.getDataPostChange(_self.body);
                setTimeout(function () {
                    var $htmlDiv = _this.containerBaseDom.find(".component_cells_list ul[data-type=\"" + _this.selectType + "\"]");
                    _self.renderlistHtml($htmlDiv, _self.brandData);
                }, 200);
            }
            event.stopPropagation();
        });
        // 点击blank
        $(document).click(function (event) {
            var _con = $('div[componentOverall]');
            if (!_con.is(event.target) && _con.has(event.target).length === 0) {
                $('div[componentOverall]').hide();
            }
        });
        $(document).ready(function () {
            var $componentOverall = _self.containerBaseDom.find('div[componentOverall]');
            _self.containerBaseDom.find('div[componentOverall]').on('click', '.component_top', function (event) {
                $(event.target).siblings('.component_top_select_list').toggle();
                event.stopPropagation();
            });
            //click dropdown list
            $componentOverall.on('click', '.component_top_select_list', function (event) {
                var $tagget = $(event.currentTarget);
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
                var $htmlDiv = _self.containerBaseDom.find('.component_cells_list ul').first().attr("data-type", _self.selectType);
                _self.renderlistHtml($htmlDiv, _self.brandData);
                $(".component_top_select_list").hide();
            });
            //click choose list
            $componentOverall.on('click', '.component_cells_list ul', function (event) {
                var $tagget = event.currentTarget, $clickType, $taggetID, $input = event.target.previousSibling, $targetSiblings = $(event.target).siblings();
                //点击设置选择的类型
                $clickType = $tagget.dataset.type;
                if ($(event.target).attr("data-type")) {
                    return;
                }
                $(event.target).addClass("checkedBg").siblings().removeClass("checkedBg");
                if ($clickType == "filter-shop") {
                    _self.containerBaseDom.find(".component_cells_list ul[data-type!=\"filter-shop\"]").empty();
                }
                else if ($clickType == "filter-region" && _self.selectID == "1") {
                    _self.containerBaseDom.find(".component_cells_list ul[data-type = \"filter-list\"]").empty();
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
                }
                else {
                    _self.buildChange($input, $targetSiblings);
                }
                var len = _self.filterArray.length;
                $chooseLength.text(len);
                event.stopPropagation();
            });
            //click confirm
            $componentOverall.on('click', 'a[componentOverallConfirm]', function (event) {
                _self.containerBaseDom.find('.component_cells').hide();
                _self.confirmPostChange();
            });
            //click cancel
            $componentOverall.on('click', 'a[componentOverallCancel]', function (event) {
                _self.containerBaseDom.find('.component_cells').hide();
            });
            // search
            $componentOverall.on('keyup', '.cells_right_search', function (event) {
                var searchText = $(event.target).val().trim();
                var newList = [];
                if (searchText.length <= 0) {
                    newList = _self.filterListObj;
                }
                else {
                    for (var i = 0; i < _self.filterListObj.length; i++) {
                        if (_self.filterListObj[i]['project_name'].toLowerCase().indexOf(searchText.toLowerCase()) != -1) {
                            newList.push(_self.filterListObj[i]);
                        }
                    }
                }
                var $htmlDiv = _self.containerBaseDom.find(".component_cells_list ul[data-type=\"filter-list\"]");
                _self.renderlistHtml($htmlDiv, newList);
                _self.setChedked($htmlDiv, _self.filterArray, true);
                _self.decideAllChedked($htmlDiv, _self.filterArray);
                event.stopPropagation();
            });
            // click blank
            $(document).click(function (event) {
                var _con = $('div[componentOverall]');
                if (!_con.is(event.target) && _con.has(event.target).length === 0) {
                    $('div[componentOverall]').hide();
                }
            });
        });
    };
    //存储已选择value
    CellsFilterComponent.prototype.saveFilterValue = function ($clickType, targetValue) {
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
    };
    // 发送请求
    CellsFilterComponent.prototype.getDataPostChange = function (postQuery) {
        postQuery["charUUID"] = this.scopeID;
        postQuery["requestTitle"] = "cellsFilter";
        var sendObj = Object.assign(_super.prototype.transformInput.call(this, 'scopeID', this.scopeID), _super.prototype.transformInput.call(this, 'result', postQuery));
        _super.prototype.onChange.call(this, this, sendObj);
    };
    CellsFilterComponent.prototype.setBodyObj = function (id, type) {
        switch (type) {
            case 'filter-shop':
                this.decideFilterField(id, "brand", this.body);
                break;
            case 'filter-region':
                this.decideFilterField(id, "region", this.body);
                break;
            case 'filter-city':
                this.decideFilterField(id, "logical_city", this.body);
                break;
        }
        return this.body;
    };
    CellsFilterComponent.prototype.decideFilterField = function (id, type, filters) {
        var decideFilterBody = filters;
        decideFilterBody['filters'] = [
            { "field": "status", "operator": "=", "value": "1" }
        ];
        //push projectType的值
        decideFilterBody['filters'].push({ field: "project_type", operator: "=", value: id });
        switch (type) {
            case 'brand':
                decideFilterBody['filters'].push({ field: 'brand', operator: "=", value: this.filterSaveShop });
                break;
            case 'region':
                decideFilterBody['filters'].push({ field: 'brand', operator: "=", value: this.filterSaveShop }, { field: 'region', operator: "=", value: this.filterSaveRegion });
                break;
            case 'logical_city':
                decideFilterBody['filters'].push({ field: 'brand', operator: "=", value: this.filterSaveShop }, { field: 'region', operator: "=", value: this.filterSaveRegion }, { field: 'logical_city', operator: "=", value: this.filterSaveCity });
                break;
        }
        return decideFilterBody;
    };
    // 遍历选择的值改变状态
    CellsFilterComponent.prototype.setChedked = function (optionList, filterArray, bool) {
        var $li = $(optionList).find('li');
        if (filterArray && filterArray.length > 0) {
            for (var i = 0; i < $li.length; i++) {
                var $liInput = $($li[i]).find('input');
                for (var j = 0; j < filterArray.length; j++) {
                    if ($liInput.attr('id') == filterArray[j]['id']) {
                        $liInput.prop('checked', bool);
                        break;
                    }
                }
            }
        }
    };
    // 存储选择的值
    CellsFilterComponent.prototype.buildChange = function ($input, $targetSiblings) {
        if ($input !== null) {
            if ($input.id != "全选" && $input.id != "") {
                if (!$input.checked) {
                    this.setFilterListArr($input, $targetSiblings);
                }
                else {
                    this.delFilterListArr($input, $targetSiblings);
                }
                if (this.scene != 'scene_2') {
                    this.decideAllChedked($input.parentNode.parentNode, this.filterArray);
                }
            }
            else {
                if (this.scene != 'scene_2') {
                    if (!$input.checked) {
                        this.setChildFilterListArr($input, $targetSiblings);
                    }
                    else {
                        this.delChildFilterListArr($input, $targetSiblings);
                    }
                }
            }
        }
    };
    CellsFilterComponent.prototype.setChildFilterListArr = function ($input, $listDiv) {
        var parentLiList = $input.parentNode.parentNode.childNodes; //所有的li
        for (var i = 0; i < parentLiList.length; i++) {
            if (parentLiList[i].childNodes[0].id != "全选") {
                parentLiList[i].childNodes[0].checked = true;
                for (var a = 0; a < this.filterArray.length; a++) {
                    if (this.filterArray[a].id == parentLiList[i].childNodes[0].id) {
                        this.filterArray.splice(a, 1);
                    }
                }
                this.filterArray.push({
                    id: parentLiList[i].childNodes[0].id,
                    name: parentLiList[i].childNodes[0].labels[0].innerText
                });
            }
        }
    };
    CellsFilterComponent.prototype.delChildFilterListArr = function ($input, $listDiv) {
        var parentLiList = $input.parentNode.parentNode.childNodes; //所有的li
        for (var i = 0; i < parentLiList.length; i++) {
            if (parentLiList[i].childNodes[0].id != "全选") {
                parentLiList[i].childNodes[0].checked = false;
                for (var j = 0; j < this.filterArray.length; j++) {
                    if (this.filterArray[j].id == parentLiList[i].childNodes[0].id) {
                        this.filterArray.splice(j, 1);
                    }
                }
            }
        }
    };
    //设置全选 input
    CellsFilterComponent.prototype.decideAllChedked = function (optionList, filterArray) {
        var $li = $(optionList).find('li');
        var childInputChecked = {};
        var childInputCheckedAll = {};
        if (filterArray && filterArray.length > 0) {
            for (var i = 0; i < $li.length; i++) {
                var $liInput = $($li[i]).find('input');
                if ($liInput.attr('id') != "全选") {
                    childInputChecked[$liInput.attr('id')] = $liInput.attr('name'); // ul 下边有的ID
                    for (var j = 0; j < filterArray.length; j++) {
                        if ($liInput.attr('id') == filterArray[j]['id']) {
                            childInputCheckedAll[filterArray[j]['id']] = filterArray[j]['name'];
                            break;
                        }
                    }
                }
                else {
                    $liInput.prop('checked', true);
                }
            }
            for (var key in childInputChecked) {
                if (childInputCheckedAll.hasOwnProperty(key)) {
                }
                else {
                    $($li[0]).find("input").prop('checked', false);
                    break;
                }
            }
        }
    };
    CellsFilterComponent.prototype.setFilterListArr = function ($input, $targetSiblings) {
        if (this.filterArray.length > 0) {
            for (var _i = 0, _a = this.filterArray; _i < _a.length; _i++) {
                var item = _a[_i];
                if (item.id == $input.id) {
                    break;
                }
            }
        }
        if (this.scene == 'scene_2') {
            if (this.filterArray.length > 3) {
                $targetSiblings.attr("disabled", "disabled");
            }
            else {
                this.filterArray.push({
                    id: $input.id,
                    name: $input.value
                });
                $targetSiblings.attr("disabled", false);
            }
        }
        else {
            this.filterArray.push({
                id: $input.id,
                name: $input.value
            });
        }
    };
    CellsFilterComponent.prototype.delFilterListArr = function ($input, $targetSiblings) {
        if (this.filterArray.length > 0) {
            for (var i = 0; i < this.filterArray.length; i++) {
                if (this.filterArray[i].id == $input.id) {
                    this.filterArray.splice(i, 1);
                }
            }
        }
        else {
            if (this.scene == 'scene_2') {
                if (this.filterArray.length < 99) {
                    $targetSiblings.prop("disabled", false);
                }
            }
            else {
                if (this.filterArray.length < 5) {
                    $targetSiblings.prop("disabled", false);
                }
            }
        }
    };
    // 确定
    CellsFilterComponent.prototype.confirmPostChange = function () {
        if (this.filterArray.length > 0) {
            this.containerBaseDom.find(".regionFilter").removeClass("currentFilter");
            this.containerBaseDom.find(".custom").addClass("currentFilter");
            var filterValue = [];
            for (var _i = 0, _a = this.filterArray; _i < _a.length; _i++) {
                var item = _a[_i];
                var id = (item.id).replace(this.scopeID, "");
                filterValue.push(id);
            }
            var filter = [
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
    };
    CellsFilterComponent.prototype.sendMessage = function (result) {
        var sendObj = Object.assign(_super.prototype.transformInput.call(this, 'scopeID', this.scopeID), _super.prototype.transformInput.call(this, 'filterObj', this.filterScopeIDObj), _super.prototype.transformInput.call(this, 'result', result));
        _super.prototype.sendMessageBase.call(this, this, sendObj);
    };
    return CellsFilterComponent;
}(base_component_1.BaseComponent));
exports.CellsFilterComponent = CellsFilterComponent;
//# sourceMappingURL=cellsFilter.component.js.map