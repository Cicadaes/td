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
var provinceFilter_template_1 = require("./provinceFilter.template");
var provinceFilter_model_1 = require("./provinceFilter.model");
var $ = require("jquery");
var ProvinceFilterComponent = (function (_super) {
    __extends(ProvinceFilterComponent, _super);
    function ProvinceFilterComponent() {
        var _this = _super.call(this) || this;
        _this.chartData = null;
        _this.provinceFilterData = null;
        _this.filterScopeIDObj = null;
        _this.filterArray = [];
        _this.defaultFilterBody = null;
        _this.filterType = null;
        _this.filterProvinceType = null;
        _this.filterID = null;
        _this.filterSaveBrand = null;
        _this.timer = null;
        _this.provinceList = null;
        _this.filterInfo = null;
        _this.filterInfoType = false;
        _this.filterCityType = null;
        _this.filterIndex = 1;
        _this.filterIndexName = "";
        _this.filterListObj = null;
        _this.body = {
            "datasource_id": 27,
            'dimensions': null,
            'filters': null
        };
        var template = new provinceFilter_template_1.ProvinceFilterTemplate(_this.scopeID);
        //获得模板渲染后的节点
        _this.element = _this.render(template);
        _this.provinceFilterData = new provinceFilter_model_1.ProvinceFilterModel();
        return _this;
    }
    ProvinceFilterComponent.prototype.beforeShow = function () {
    };
    ProvinceFilterComponent.prototype.afterShow = function () {
        this.init();
    };
    ProvinceFilterComponent.prototype.beforeDestory = function () {
    };
    ProvinceFilterComponent.prototype.afterDestory = function () {
    };
    ProvinceFilterComponent.prototype.resize = function () {
    };
    ProvinceFilterComponent.prototype.getconfiginformation = function (event, changeObj) {
        this.filterScopeIDObj = changeObj.result;
        var provinceFilterShopArray = this.provinceFilterData.provinceFilterShopArray; // 单选下拉框
        $('#' + this.scopeID).find('.component_top_select_title').show().text(provinceFilterShopArray[0]['project_name']).attr('data-id', provinceFilterShopArray[0]['id']); // 默认取单选下拉框第一个
        this.renderSelectListHtml($('#' + this.scopeID).find('div[componentCityLeftList]'), provinceFilterShopArray);
        this.filterCityType = provinceFilterShopArray[0]['field']; // 获取当选选择的type
        this.filterID = provinceFilterShopArray[0]['id']; // 获取当选选择的type
        var body = {
            "datasource_id": 27,
            "dimensions": [
                { "field": "project_name" }, { "field": "id" }
            ],
            "filters": [
                { "field": "project_type", "operator": "=", "value": "9" },
                { "field": "status", "operator": "=", "value": "1" }
            ],
            "orderBy": [
                { "field": "city_type", "function": "asc" },
                { "field": "project_name", "function": "asc" }
            ]
        };
        body["charUUID"] = this.scopeID;
        body["requestTitle"] = "provinceFilter";
        this.getDataPostChange(body);
        this.commonChange();
    };
    ProvinceFilterComponent.prototype.dataChange = function (data) {
        if (this.filterInfoType == false) {
            this.provinceList = data;
            this.filterInfo = data;
            var $div = $('#' + this.scopeID).find('.provinceList');
            this.renderlistHtml($div, this.provinceList, false);
        }
        else {
            if (this.filterCityType == 'province') {
                var datalist = data;
                this.filterListObj = [];
                $.extend(true, this.filterListObj, data);
                var $div = $('#' + this.scopeID).find('.cityList');
                this.renderlistHtml($div, datalist, true);
                this.decideChedked($div, this.filterArray);
                this.decideAllChedked($div, this.filterArray);
            }
            else {
                var datalist = data;
                $.extend(true, this.filterListObj, data);
                var $div = $('#' + this.scopeID).find('.cityList');
                if (this.filterIndex == 1) {
                    $div = $('#' + this.scopeID).find('.cityList');
                    this.renderlistHtml($div, datalist, false);
                    this.decideChedked($div, this.filterArray);
                    this.decideAllChedked($div, this.filterArray);
                }
                else {
                    $div = $('#' + this.scopeID).find('.storeList');
                    this.renderlistHtml($div, datalist, true);
                    this.decideChedked($div, this.filterArray);
                    this.decideAllChedked($div, this.filterArray);
                }
            }
        }
    };
    ProvinceFilterComponent.prototype.styleChange = function (style) {
    };
    ProvinceFilterComponent.prototype.loadData = function () {
    };
    Object.defineProperty(ProvinceFilterComponent.prototype, "data", {
        get: function () {
            return this.chartData;
        },
        enumerable: true,
        configurable: true
    });
    ProvinceFilterComponent.prototype.init = function () {
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
    };
    //渲染中间选择list
    ProvinceFilterComponent.prototype.renderlistHtml = function (container, data, option) {
        container.empty();
        var optionList = "";
        if (data.length > 0) {
            if (option) {
                optionList += '<ul><li class="allChecked" ><input type="checkbox"  id="全选" value="全选"/><label for="全选">全选</label></li>';
            }
            else {
                optionList += '<ul>';
            }
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var item = data_1[_i];
                optionList += '<li title="' + item.project_name + '">';
                if (option) {
                    optionList += '<input type="checkbox" id=' + item.id + ' name="filter" value="' + item.project_name + '"/><label for=' + item.id + '>' + item.project_name + '</label>';
                }
                else {
                    optionList += '<span class="provinceOne" id=' + item.id + '>' + item.project_name + '</span><span class="listBtn"> &gt; </span>';
                }
                optionList += '</li>';
            }
            optionList += '</ul>';
            container.append(optionList);
        }
    };
    ProvinceFilterComponent.prototype.setFilterListArr = function ($input, $listDiv) {
        if (this.filterArray.length > 0) {
            for (var _i = 0, _a = this.filterArray; _i < _a.length; _i++) {
                var item = _a[_i];
                if (item.id == $input.id) {
                    break;
                }
            }
        }
        this.filterArray.push({
            id: $input.id,
            name: $input.labels[0].innerText
        });
    };
    ProvinceFilterComponent.prototype.delFilterListArr = function ($input, $listDiv) {
        if (this.filterArray.length > 0) {
            for (var i = 0; i < this.filterArray.length; i++) {
                if (this.filterArray[i].id == $input.id) {
                    this.filterArray.splice(i, 1);
                }
            }
            if (this.filterArray.length < 100) {
                $listDiv.prop("disabled", false);
            }
        }
    };
    //设置input
    ProvinceFilterComponent.prototype.decideChedked = function (optionList, filterArray) {
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
    ProvinceFilterComponent.prototype.commonChange = function () {
        var _this = this;
        var _self = this, $chooseLength = $('#' + this.scopeID).find('.component_bottom_l span'); // 已经选择了多少个
        var $componentCity = $('#' + _self.scopeID).find('div[componentCity]');
        //解绑事件
        $('#' + _self.scopeID).find('.custom').off('click');
        $('.component_city_list', '#' + _self.scopeID).off('click');
        $('.cityList', '#' + _self.scopeID).off('click');
        $('#' + _self.scopeID).find('div[componentCity]').off('click');
        // 点击自定义按钮
        //click custom
        $('#' + _self.scopeID).find('.custom').on('click', function (event) {
            setTimeout(function () {
                $('#' + _self.scopeID).find(".component_city").show();
            }, 300);
            event.stopPropagation();
        });
        //click checkbox  获取选择了几个项目
        $('.selectFilterIndex2', '#' + _self.scopeID).on('click', 'input,label', function (event) {
            var $input = event.target.previousSibling, $listDiv = $('.selectList', '#' + _self.scopeID);
            _self.buildChange($input, $listDiv);
            $chooseLength.text(_self.filterArray.length);
            event.stopPropagation();
        });
        $('.selectList', '#' + _self.scopeID).on('click', '.provinceOne,.listBtn', function (event) {
            _self.filterInfoType = true;
            var orderByType = "city_type";
            if ($(this).parent().parent().parent().hasClass('provinceList')) {
                _self.filterIndex = 1;
                _self.filterIndexName = $(this).parent().find('.provinceOne').text();
                if (_self.filterCityType == "city" || _self.filterCityType == "store") {
                    _self.filterID = 3;
                }
                else if (_self.filterCityType == "province") {
                    _self.filterID = 10;
                }
                $componentCity.find('.cityList').empty();
                $componentCity.find('.storeList').empty();
            }
            else if ($(this).parent().parent().parent().hasClass('cityList')) {
                _self.filterIndex = 2;
                $componentCity.find('.storeList').empty();
                if (_self.filterCityType == "city") {
                    _self.filterID = 4;
                }
                else if (_self.filterCityType == "store") {
                    _self.filterID = 1;
                }
            }
            (_self.filterCityType == "province") ? orderByType = "city_type" : orderByType = "project_name";
            $(this).parent().siblings().css('background', '#fff');
            $(this).parent().css('background', '#F4F7FB');
            _self.filterSaveBrand = $(this).parent().find('.provinceOne').text();
            _self.getDataPostChange(_self.setBodyObj(_self.filterSaveBrand, _self.filterCityType, orderByType));
            event.stopPropagation();
        });
        //click get dropdown get list   控制省份 城市 店铺下拉列表显示隐藏
        $componentCity.on('click', '.component_top_select_box', function (event) {
            var $cityList = $(event.target).siblings('.component_top_select_list');
            $('.component_top_select_list').show();
            event.stopPropagation();
        });
        //click choose list  
        $componentCity.on('click', '.component_top_select_list', function (event) {
            // 切换省份、城市、店铺
            var $tagget = $(event.currentTarget);
            $tagget.siblings().text($(event.target).text());
            $tagget.siblings().attr("data-id", $(event.target).attr("data-id"));
            //点击设置选择的类型
            $('#' + _this.scopeID).find('.provinceList').find("li").css('background', '#fff');
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
        });
        //click confirm  点击确定
        $componentCity.on('click', 'a[componentCityConfirm]', function (event) {
            _self.confirmPostChange();
            $componentCity.hide();
            event.stopPropagation();
        });
        //click cancel  点击取消
        $componentCity.on('click', 'a[componentCityCancel]', function (event) {
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
        });
        // 点击省份按钮
        //click currentFilter
        $('#' + _self.scopeID).find('.currentFilter').on('click', function (event) {
            var provinceFilterShopArray = _self.provinceFilterData.provinceFilterShopArray; // 单选下拉框
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
        $componentCity.on('keyup', '.city_right_search', function (event) {
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
            var div = '.cityList';
            if (_self.filterCityType == "province") {
                div = '.cityList';
            }
            else {
                div = '.storeList';
            }
            _self.renderlistHtml($('#' + _this.scopeID).find(div), newList, true);
            _self.decideChedked($(div, '#' + _self.scopeID), _self.filterArray);
            _self.decideAllChedked($(div, '#' + _self.scopeID), _self.filterArray);
            event.stopPropagation();
        });
    };
    //渲染单选下拉列表
    ProvinceFilterComponent.prototype.renderSelectListHtml = function ($div, data) {
        var optionList = "";
        optionList += '<ul>';
        for (var _i = 0, data_2 = data; _i < data_2.length; _i++) {
            var item = data_2[_i];
            optionList += '<li data-id=' + item.id + ' data-type=' + item.field + '>' + item.project_name + '</li>';
        }
        optionList += '</ul>';
        $div.html(optionList);
    };
    ProvinceFilterComponent.prototype.setChildFilterListArr = function ($input, $listDiv) {
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
    ProvinceFilterComponent.prototype.delChildFilterListArr = function ($input, $listDiv) {
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
    ProvinceFilterComponent.prototype.decideAllChedked = function (optionList, filterArray) {
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
    ProvinceFilterComponent.prototype.buildChange = function ($input, $targetSiblings) {
        if ($input !== null) {
            if ($input.id != "全选") {
                if (!$input.checked) {
                    this.setFilterListArr($input, $targetSiblings);
                }
                else {
                    this.delFilterListArr($input, $targetSiblings);
                }
                this.decideAllChedked($input.parentNode.parentNode.parentNode, this.filterArray);
            }
            else {
                if (!$input.checked) {
                    this.setChildFilterListArr($input, $targetSiblings);
                }
                else {
                    this.delChildFilterListArr($input, $targetSiblings);
                }
            }
        }
    };
    ProvinceFilterComponent.prototype.getDataPostChange = function (postQuery) {
        var sendObj = Object.assign(_super.prototype.transformInput.call(this, 'scopeID', this.scopeID), _super.prototype.transformInput.call(this, 'result', postQuery));
        _super.prototype.onChange.call(this, this, sendObj);
    };
    ProvinceFilterComponent.prototype.confirmPostChange = function () {
        if (!this.isEmptyObject(this.filterScopeIDObj) && this.filterArray.length > 0) {
            this.parameterPostChange(this.changeFilterArray());
            $('#' + this.scopeID).find(".custom").css({ "background": "#43A3FB" });
            $('#' + this.scopeID).find(".custom").css({ "color": "#fff" });
            $('#' + this.scopeID).find(".currentFilter").css({ "background": "#fff" });
            $('#' + this.scopeID).find(".currentFilter").css({ "color": "#464C5B" });
        }
        else {
            $('#' + this.scopeID).find(".custom").css({ "background": "#fff" });
            $('#' + this.scopeID).find(".custom").css({ "color": "#464C5B" });
            $('#' + this.scopeID).find(".currentFilter").css({ "background": "#43A3FB" });
            $('#' + this.scopeID).find(".currentFilter").css({ "color": "#fff" });
            this.parameterPostChange(this.defaultFilterBody);
            return;
        }
    };
    ProvinceFilterComponent.prototype.changeFilterArray = function () {
        var changePostFilterArray = [
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
        var value = ' ';
        for (var i = 0; i < this.filterArray.length; i++) {
            value += (',' + this.filterArray[i].id);
        }
        changePostFilterArray[0]["value"] = value.trim().substr(1);
        return changePostFilterArray;
    };
    ProvinceFilterComponent.prototype.parameterPostChange = function (filterArray) {
        var sendObj = Object.assign(_super.prototype.transformInput.call(this, 'scopeID', this.scopeID), _super.prototype.transformInput.call(this, 'filterObj', this.filterScopeIDObj), _super.prototype.transformInput.call(this, 'result', _super.prototype.transformInput.call(this, 'filter', filterArray)));
        _super.prototype.sendMessageBase.call(this, this, sendObj);
    };
    //设置请求body
    ProvinceFilterComponent.prototype.setBodyObj = function (filterName, filterType, orderByType) {
        this.body['dimensions'] = [
            { "field": "project_name" },
            { "field": "id" }
        ];
        this.body['filters'] = [
            { "field": "status", "operator": "=", "value": "1" },
            { "field": "project_type", "operator": "=", "value": this.filterID },
            { "field": "province", "operator": "=", "value": filterName }
        ];
        this.body['orderBy'] = [
            { "field": orderByType, "function": "asc" }
        ];
        if (orderByType == 'city_type') {
            this.body['orderBy'].push({ "field": "project_name", "function": "asc" });
        }
        if (this.filterIndex == 2) {
            this.body['filters'].push({ "field": "city", "operator": "=", "value": filterName });
            this.body['filters'][2]["value"] = this.filterIndexName;
        }
        else {
            if (this.body['filters'].length > 3) {
                this.body['filters'].pop();
            }
        }
        this.body["charUUID"] = this.scopeID;
        this.body["requestTitle"] = "provinceFilter";
        //console.log("=======>this.body",this.body)
        return this.body;
    };
    return ProvinceFilterComponent;
}(base_component_1.BaseComponent));
exports.ProvinceFilterComponent = ProvinceFilterComponent;
//# sourceMappingURL=provinceFilter.component.js.map