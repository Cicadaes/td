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
var partnerFilter_template_1 = require("./partnerFilter.template");
var partnerFilter_model_1 = require("./partnerFilter.model");
var $ = require("jquery");
var PartnerFilterComponent = (function (_super) {
    __extends(PartnerFilterComponent, _super);
    function PartnerFilterComponent() {
        var _this = _super.call(this) || this;
        _this.myChart = null;
        _this.chartData = null;
        _this.echartData = null;
        _this.PartnerFilterData = null;
        _this.body = {
            "datasource_id": 27,
            "dimensions": [{ "field": "project_name" }, { "field": "id" }],
            "filters": [
                { "field": "project_type", "operator": "=", "value": "8" },
                { "field": "status", "operator": "=", "value": "1" }
            ],
            "orderBy": [{ "field": "project_name", "function": "asc" }]
        };
        _this.selectID = "8";
        _this.selectType = "filter-channel";
        _this.filterArray = [];
        _this.filterValue = "";
        _this.filterScopeIDObj = null;
        _this.filterListObj = null;
        _this.brandBoolean = false;
        _this.filterSaveChannel = null;
        _this.filterSaveMall = null;
        _this.scene = null;
        _this.containerBaseDom = null;
        var template = new partnerFilter_template_1.PartnerFilterTemplate(_this.scopeID);
        //获得模板渲染后的节点
        _this.element = _this.render(template);
        _this.PartnerFilterData = new partnerFilter_model_1.PartnerFilterModel();
        return _this;
    }
    PartnerFilterComponent.prototype.beforeShow = function () {
    };
    PartnerFilterComponent.prototype.afterShow = function () {
        this.containerBaseDom = $('#' + this.scopeID);
        this.init();
        //给背景设置透明色
        this.containerBaseDom.parent().css("background", "transparent");
        this.renderSelectListHtml(this.containerBaseDom.find('div[componentcellsleftlist]'), this.PartnerFilterData.partnerFilterChannelArray);
    };
    PartnerFilterComponent.prototype.beforeDestory = function () {
    };
    PartnerFilterComponent.prototype.afterDestory = function () {
    };
    PartnerFilterComponent.prototype.resize = function () {
    };
    PartnerFilterComponent.prototype.getconfiginformation = function (event, changeObj) {
        this.scene = changeObj.result.scene;
        if (!this.isEmptyObject(changeObj.result)) {
            this.filterScopeIDObj = changeObj.result;
            this.decideSelectedID();
            this.commonChange();
        }
    };
    //判断selectedID
    PartnerFilterComponent.prototype.decideSelectedID = function () {
        var name = "";
        if (this.scene == "scene_1") {
            name = "渠道";
        }
        else if (this.scene == "scene_2") {
            name = "Top4";
        }
        this.containerBaseDom.find(".currentFilter").text(name);
    };
    //下拉框
    PartnerFilterComponent.prototype.renderSelectListHtml = function ($div, data) {
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
    PartnerFilterComponent.prototype.renderlistHtml = function ($div, data) {
        var optionList = "";
        if (data.length <= 0) {
            optionList += "<p class='error'>暂无数据</p>";
        }
        if (this.selectType == 'filter-list') {
            for (var _i = 0, data_2 = data; _i < data_2.length; _i++) {
                var item = data_2[_i];
                optionList += '<li title="' + item.project_name + '"><input type="checkbox" id="' + this.scopeID + item.id + '" name="filter" value=' + item.project_name + '/><label for=' + this.scopeID + item.id + '>' + item.project_name + '</label></li>';
            }
        }
        else {
            for (var _a = 0, data_3 = data; _a < data_3.length; _a++) {
                var item = data_3[_a];
                optionList += '<li title="' + item.project_name + '" class="lists" id=' + item.id + '>' + item.project_name + '</li>';
            }
        }
        $div.html(optionList);
        if (this.selectType == 'filter-list' && this.scene == "scene_1" && data.length > 0) {
            $div.prepend('<li class="allChecked" ><input type="checkbox"  id="全选" value="全选"/><label for="全选">全选</label></li>');
        }
    };
    // 判断选择的类型添加元素
    PartnerFilterComponent.prototype.decideFilterType = function (id) {
        var _self = this;
        var optionList = "";
        switch (id) {
            case "8":
                _self.selectType = "filter-channel";
                optionList += '<ul data-type="filter-channel" data-id="12" class="partnerFilter_channel"></ul>';
                optionList += '<ul data-type="filter-list" class="partnerFilter_channel"></ul>';
                break;
            case "7":
                _self.selectType = "filter-channel";
                optionList += '<ul data-type="filter-channel" data-id="7" class="partnerFilter_channel"></ul>';
                optionList += '<ul data-type="filter-list" class="partnerFilter_channel"></ul>';
                break;
            case "1":
                _self.selectType = "filter-channel";
                optionList += '<ul data-type="filter-channel" data-id="7" class="partnerFilter_mall"></ul>';
                optionList += '<ul data-type="filter-mall" data-id="1" class="partnerFilter_mall"></ul>';
                optionList += '<ul data-type="filter-list" class="partnerFilter_mall"></ul>';
                break;
        }
        _self.containerBaseDom.find(".component_cells_list").html(optionList);
    };
    PartnerFilterComponent.prototype.dataChange = function (data) {
        this.saveBrandData(data);
        this.filterListObj = data;
        var $htmlDiv = this.containerBaseDom.find(".component_cells_list ul[data-type=\"" + this.selectType + "\"]");
        this.renderlistHtml($htmlDiv, data);
        this.setChedked($htmlDiv, this.filterArray);
        this.decideAllChedked($htmlDiv, this.filterArray);
    };
    PartnerFilterComponent.prototype.styleChange = function (style) {
    };
    PartnerFilterComponent.prototype.loadData = function () {
    };
    Object.defineProperty(PartnerFilterComponent.prototype, "data", {
        get: function () {
            return this.chartData;
        },
        enumerable: true,
        configurable: true
    });
    PartnerFilterComponent.prototype.init = function () {
        //this.commonChange();
    };
    //存储初次请求数据
    PartnerFilterComponent.prototype.saveBrandData = function (data) {
        if (!this.brandBoolean) {
            this.brandData = data;
            this.brandBoolean = true;
        }
    };
    PartnerFilterComponent.prototype.commonChange = function () {
        var _self = this;
        if (_self.scene == "scene_2") {
            _self.containerBaseDom.find('.component_bottom_l').html('已选择<span>0</span>个  最多可选择<strong>4</strong>个');
        }
        else {
            _self.containerBaseDom.find('.component_bottom_l').html('已选择<span>0</span>个');
        }
        var $chooseLength = this.containerBaseDom.find('.component_bottom_l span');
        //click filter
        _self.containerBaseDom.find('div[componentFilter]').find(".custom").click(function (event) {
            _self.containerBaseDom.find('.cells_right_search').val("");
            _self.containerBaseDom.find("div[componentOverall]").toggle();
            //post body
            if (!_self.brandBoolean) {
                _self.getDataPostChange(_self.body);
                _self.decideFilterType(_self.selectID);
            }
            event.stopPropagation();
        });
        _self.containerBaseDom.find('div[componentFilter]').find(".qudao").click(function (event) {
            _self.containerBaseDom.find('.qudao').addClass('currentFilter').siblings().removeClass('currentFilter');
            _self.containerBaseDom.find(".component_cells_list ul[data-type!=\"filter-channel\"]").empty();
            _self.containerBaseDom.find('.component_bottom_l span').text(0);
            _self.containerBaseDom.find('div[componentoverall]').hide();
            var $htmlDiv = _self.containerBaseDom.find(".component_cells_list ul[data-type=\"" + _self.selectType + "\"]");
            _self.setChedked($htmlDiv, _self.filterArray);
            _self.decideAllChedked($htmlDiv, _self.filterArray);
            _self.filterArray = [];
            _self.containerBaseDom.find(".component_cells_list ul").find("li").removeClass("checkedBg");
            _self.sendMessage({
                "datasource_id": 13,
                "filter": [
                    { "field": "project_id", "operator": "in", "value": "%%" },
                    { "field": "project_type", "operator": "=", "value": "8" },
                    { "field": "projectType", "operator": "=", "value": "8" }
                ],
            });
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
                if (event.target.nodeName == "LI") {
                    $(event.target).addClass("checkedBg").siblings().removeClass("checkedBg");
                }
                if ($clickType == "filter-channel") {
                    _self.containerBaseDom.find(".component_cells_list ul[data-type!=\"filter-channel\"]").empty();
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
                }
                else {
                    if (event.target.innerText !== "暂无数据") {
                        _self.buildChange($input, $targetSiblings);
                    }
                }
                var len = _self.filterArray.length;
                $chooseLength.text(len);
                event.stopPropagation();
            });
            //click confirm
            $componentOverall.on('click', 'a[componentOverallConfirm]', function (event) {
                _self.containerBaseDom.find('.component_cells').hide();
                if (_self.filterArray.length <= 0) {
                    return;
                }
                else {
                    _self.containerBaseDom.find('.custom').addClass('currentFilter').siblings().removeClass('currentFilter');
                }
                //
                _self.confirmPostChange();
                //_self.filterArray = [];
                //_self.containerBaseDom.find('.component_bottom_l span').text(0);
            });
            //click cancel
            $componentOverall.on('click', 'a[componentOverallCancel]', function (event) {
                _self.containerBaseDom.find('.component_cells').hide();
                //_self.containerBaseDom.find('.component_bottom_l span').text(0);
                //_self.filterArray = [];
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
                _self.setChedked($htmlDiv, _self.filterArray);
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
    PartnerFilterComponent.prototype.saveFilterValue = function ($clickType, targetValue) {
        switch ($clickType) {
            case "filter-channel":
                this.filterSaveChannel = targetValue;
                break;
            case "filter-mall":
                this.filterSaveMall = targetValue;
                break;
        }
    };
    // 发送请求
    PartnerFilterComponent.prototype.getDataPostChange = function (postQuery) {
        postQuery["charUUID"] = this.scopeID;
        postQuery["requestTitle"] = "partnerFilter";
        var sendObj = Object.assign(_super.prototype.transformInput.call(this, 'scopeID', this.scopeID), _super.prototype.transformInput.call(this, 'result', postQuery));
        _super.prototype.onChange.call(this, this, sendObj);
    };
    PartnerFilterComponent.prototype.setBodyObj = function (id, type) {
        switch (type) {
            case 'filter-channel':
                this.decideFilterField(id, "channel", this.body, this.filterScopeIDObj);
                break;
            case 'filter-mall':
                this.decideFilterField(id, "mall", this.body, this.filterScopeIDObj);
                break;
        }
        return this.body;
    };
    PartnerFilterComponent.prototype.decideFilterField = function (id, type, filters, result) {
        var decideFilterBody = filters;
        decideFilterBody['filters'] = [
            { "field": "status", "operator": "=", "value": "1" }
        ];
        //push projectType的值
        decideFilterBody['filters'].push({ field: "project_type", operator: "=", value: id });
        switch (type) {
            case 'channel':
                decideFilterBody['filters'].push({ field: 'channel', operator: "=", value: this.filterSaveChannel });
                break;
            case 'mall':
                decideFilterBody['filters'].push({ field: 'channel', operator: "=", value: this.filterSaveChannel }, { field: 'mall', operator: "=", value: this.filterSaveMall });
                break;
        }
        return decideFilterBody;
    };
    // 遍历选择的值改变状态
    PartnerFilterComponent.prototype.setChedked = function (optionList, filterArray) {
        var $li = $(optionList).find('li');
        if (filterArray && filterArray.length > 0) {
            for (var i = 0; i < $li.length; i++) {
                var $liInput = $($li[i]).find('input');
                for (var j = 0; j < filterArray.length; j++) {
                    if ($liInput.attr('id') == filterArray[j]['id']) {
                        $liInput.prop('checked', true);
                        break;
                    }
                }
            }
        }
    };
    // 存储选择的值
    PartnerFilterComponent.prototype.buildChange = function ($input, $targetSiblings) {
        if ($input !== null) {
            if ($input.id != "全选" && $input.id != "") {
                if (!$input.checked) {
                    this.setFilterListArr($input, $targetSiblings);
                }
                else {
                    this.delFilterListArr($input, $targetSiblings);
                }
                if (this.scene == "scene_1") {
                    this.decideAllChedked($input.parentNode.parentNode, this.filterArray);
                }
            }
            else {
                if (this.scene == "scene_1") {
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
    PartnerFilterComponent.prototype.setChildFilterListArr = function ($input, $listDiv) {
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
    PartnerFilterComponent.prototype.delChildFilterListArr = function ($input, $listDiv) {
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
    PartnerFilterComponent.prototype.decideAllChedked = function (optionList, filterArray) {
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
    PartnerFilterComponent.prototype.setFilterListArr = function ($input, $targetSiblings) {
        if (this.filterArray.length > 0) {
            for (var _i = 0, _a = this.filterArray; _i < _a.length; _i++) {
                var item = _a[_i];
                if (item.id == $input.id) {
                    break;
                }
            }
        }
        if (this.scene == "scene_2") {
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
    PartnerFilterComponent.prototype.delFilterListArr = function ($input, $targetSiblings) {
        if (this.filterArray.length > 0) {
            for (var i = 0; i < this.filterArray.length; i++) {
                if (this.filterArray[i].id == $input.id) {
                    this.filterArray.splice(i, 1);
                }
            }
        }
        else {
            if (this.scene == "scene_2") {
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
    PartnerFilterComponent.prototype.confirmPostChange = function () {
        if (!this.isEmptyObject(this.filterScopeIDObj)) {
            this.parameterPostChange(this.changeFilterArray());
        }
        else {
            return;
        }
    };
    PartnerFilterComponent.prototype.changeFilterArray = function () {
        var changePostFilterArray = [], filterValue = [];
        for (var _i = 0, _a = this.filterArray; _i < _a.length; _i++) {
            var item = _a[_i];
            filterValue.push((item.id).replace(this.scopeID, ""));
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
    };
    PartnerFilterComponent.prototype.parameterPostChange = function (filterArray) {
        var sendObj = Object.assign(_super.prototype.transformInput.call(this, 'scopeID', this.scopeID), _super.prototype.transformInput.call(this, 'filterObj', this.filterScopeIDObj), _super.prototype.transformInput.call(this, 'result', Object.assign(_super.prototype.transformInput.call(this, 'filter', filterArray))));
        _super.prototype.sendMessageBase.call(this, this, sendObj);
    };
    PartnerFilterComponent.prototype.sendMessage = function (result) {
        var sendObj = Object.assign(_super.prototype.transformInput.call(this, 'scopeID', this.scopeID), _super.prototype.transformInput.call(this, 'filterObj', this.filterScopeIDObj), _super.prototype.transformInput.call(this, 'result', result));
        _super.prototype.sendMessageBase.call(this, this, sendObj);
    };
    return PartnerFilterComponent;
}(base_component_1.BaseComponent));
exports.PartnerFilterComponent = PartnerFilterComponent;
//# sourceMappingURL=partnerFilter.component.js.map