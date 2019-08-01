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
var cityFilter_template_1 = require("./cityFilter.template");
var cityFilter_model_1 = require("./cityFilter.model");
var $ = require("jquery");
var CityFilterComponent = (function (_super) {
    __extends(CityFilterComponent, _super);
    function CityFilterComponent() {
        var _this = _super.call(this) || this;
        _this.chartData = null;
        _this.cityFilterData = null;
        _this.filterScopeIDObj = null;
        _this.filterArray = [];
        _this.filterID = null;
        _this.filterSaveBrand = null;
        _this.brandlist = null;
        _this.filterListObj = null;
        _this.projectId = null;
        _this.hasSelectAll = true;
        _this.body = {
            'dimensions': null,
            'filters': null,
            "charUUID": _this.scopeID,
            "requestTitle": "cityFilter"
        };
        _this.containerBaseDom = null;
        var template = new cityFilter_template_1.CityFilterTemplate(_this.scopeID);
        //获得模板渲染后的节点
        _this.element = _this.render(template);
        _this.cityFilterData = new cityFilter_model_1.CityFilterModel();
        return _this;
    }
    CityFilterComponent.prototype.beforeShow = function () {
    };
    CityFilterComponent.prototype.afterShow = function () {
        this.containerBaseDom = $('#' + this.scopeID);
        this.init();
    };
    CityFilterComponent.prototype.beforeDestory = function () {
    };
    CityFilterComponent.prototype.afterDestory = function () {
    };
    CityFilterComponent.prototype.resize = function () {
    };
    CityFilterComponent.prototype.getconfiginformation = function (event, changeObj) {
        if (!this.isEmptyObject(changeObj.result)) {
            this.filterScopeIDObj = changeObj.result;
            this.hasSelectAll = changeObj.result.hasSelectAll;
            if (changeObj.result.scene && changeObj.result.scene == "scene_1") {
                this.containerBaseDom.find('.sameMall').show();
                this.containerBaseDom.find('.sameCounty').show();
            }
            else if (changeObj.result.scene && changeObj.result.scene == "scene_2") {
                this.containerBaseDom.find('.sameMall').hide();
                this.containerBaseDom.find('.sameCounty').hide();
            }
            this.commonChange();
        }
        else {
            return;
        }
    };
    CityFilterComponent.prototype.filterChange = function (event, data) {
        this.mergeFilterObj = this.mergeDateObj = null;
        if (data['filter'] && data['filter'].length > 0) {
            this.projectId = data['filter'][0]['value'];
        }
        this.containerBaseDom.find('.defaultFilter').addClass('currentFilter').siblings().removeClass('currentFilter');
        this.resetCustomPanel();
    };
    CityFilterComponent.prototype.dataChange = function (data) {
        this.filterListObj = data;
        if (data && this.filterID == "6") {
            //点击自定义时
            this.brandlist = data;
            var $div = this.containerBaseDom.find('.brandListBox');
            this.renderlistHtml($div, this.brandlist, false);
        }
        else if (data && this.filterID == "99") {
            //this.brandlist = data;
            var $div = this.containerBaseDom.find('.selectList');
            this.renderlistHtml($div, data, true);
            this.decideChedked($div, this.filterArray);
            this.decideAllChedked($div, this.filterArray);
        }
    };
    CityFilterComponent.prototype.styleChange = function (style) {
    };
    CityFilterComponent.prototype.loadData = function () {
    };
    Object.defineProperty(CityFilterComponent.prototype, "data", {
        get: function () {
            return this.chartData;
        },
        enumerable: true,
        configurable: true
    });
    CityFilterComponent.prototype.init = function () {
    };
    //渲染中间选择list
    CityFilterComponent.prototype.renderlistHtml = function (container, data, option) {
        container.empty();
        if (data.length > 0) {
            var optionList = "";
            //optionList += '<ul>';
            if (option) {
                optionList = '<ul><li class="allChecked" ><input type="checkbox"  id="全选" value="全选"/><label for="全选">全选</label></li>';
            }
            else {
                optionList = '<ul>';
            }
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var item = data_1[_i];
                optionList += '<li title="' + item.project_name + '">';
                if (option) {
                    optionList += '<input type="checkbox" id="' + this.scopeID + item.id + '" name="cityFilter" value="' + item.id + '"/><label for="' + this.scopeID + item.id + '">' + item.project_name + '</label>';
                }
                else {
                    optionList += '<span class="brandList" code="' + item.id + '">' + item.project_name + '</span><span class="listBtn"> &gt; </span>';
                }
                optionList += '</li>';
            }
            optionList += '</ul>';
            container.append(optionList);
        }
        else {
            container.append('<div style="text-align:center;padding-top:42%;">暂无数据</div>');
        }
    };
    CityFilterComponent.prototype.setFilterListArr = function ($input, $listDiv) {
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
    CityFilterComponent.prototype.delFilterListArr = function ($input, $listDiv) {
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
    CityFilterComponent.prototype.decideChedked = function (optionList, filterArray) {
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
    CityFilterComponent.prototype.resetCustomPanel = function () {
        var _self = this;
        _self.filterArray = [];
        _self.containerBaseDom.find(".component_city").hide();
        _self.containerBaseDom.find(".selectList ul").empty();
        _self.containerBaseDom.find(".brandListBox ul").eq(0).find("li").css('background', '#fff');
    };
    CityFilterComponent.prototype.commonChange = function () {
        var _this = this;
        var _self = this, $chooseLength = this.containerBaseDom.find('.component_bottom_l span');
        //解绑事件
        _self.containerBaseDom.find('.custom').off('click');
        $('.component_city_list', '#' + _self.scopeID).off('click');
        $('.selectList', '#' + _self.scopeID).off('click');
        _self.containerBaseDom.find('div[componentCity]').off('click');
        //click custom
        _self.containerBaseDom.find('.custom').on('click', function (event) {
            if (!_this.brandlist) {
                _this.filterID = '6';
                //发送请求
                var body = {
                    "datasource_id": 27,
                    "dimensions": [{ "field": "project_name" }, { "field": "id" }],
                    "filters": [
                        { "field": "project_type", "operator": "=", "value": "6" },
                        { "field": "status", "operator": "=", "value": "1" }
                    ],
                    "orderBy": [{ "field": "project_name", "function": "asc" }]
                };
                _this.getDataPostChange(body);
            }
            setTimeout(function () {
                _self.containerBaseDom.find(".component_city").show();
            }, 300);
            event.stopPropagation();
        });
        _self.containerBaseDom.find('.defaultFilter').on('click', function (event) {
            _self.containerBaseDom.find('.defaultFilter').addClass('currentFilter').siblings().removeClass('currentFilter');
            _self.resetCustomPanel();
            _self.sendMessage({
                "datasource_id": 38,
                "filter": [{ "field": "project_id", "operator": "=", "value": _this.projectId }],
            });
            event.stopPropagation();
        });
        _self.containerBaseDom.find('.sameMall').on('click', function (event) {
            _self.containerBaseDom.find('.sameMall').addClass('currentFilter').siblings().removeClass('currentFilter');
            _self.resetCustomPanel();
            _self.sendMessage({
                "datasource_id": 40,
                "filter": [{ "field": "project_id", "operator": "=", "value": _this.projectId }],
            });
            event.stopPropagation();
        });
        _self.containerBaseDom.find('.sameCounty').on('click', function (event) {
            _self.containerBaseDom.find('.sameCounty').addClass('currentFilter').siblings().removeClass('currentFilter');
            _self.resetCustomPanel();
            _self.sendMessage({
                "datasource_id": 39,
                "filter": [{ "field": "project_id", "operator": "=", "value": _this.projectId }],
            });
            event.stopPropagation();
        });
        $(document).ready(function () {
            var $componentCity = _self.containerBaseDom.find('div[componentCity]');
            //click get selectlist
            $('.brandListBox', '#' + _self.scopeID).on('click', 'li', function (event) {
                $('.brandListBox', '#' + _self.scopeID).find('li').css('background', '#fff');
                $(this).css('background', '#F4F7FB');
                var $brandEle = $(this).find('.brandList');
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
                        { "field": "status", "operator": "=", "value": "1" }
                    ],
                    "limit": [
                        -1
                    ],
                    "dateGranularity": 0
                });
                event.stopPropagation();
            });
            //click checkbox
            $('.selectList', '#' + _self.scopeID).on('click', 'input,label', function (event) {
                var $target = event.target.previousSibling, $listDiv = $('.selectList', '#' + _self.scopeID), inputList = $('.selectList', '#' + _self.scopeID).find('input[name = "cityFilter"]');
                _self.buildChange($target, $listDiv);
                $chooseLength.text(_self.filterArray.length);
                event.stopPropagation();
            });
            //search
            $componentCity.on('keyup', '.city_right_search', function (event) {
                if (_self.filterSaveBrand) {
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
                    _self.renderlistHtml(_self.containerBaseDom.find('.selectList'), newList, true);
                    _self.decideChedked($('.selectList', '#' + _self.scopeID), _self.filterArray);
                    _self.decideAllChedked($('.selectList', '#' + _self.scopeID), _self.filterArray);
                }
                event.stopPropagation();
            });
            //click confirm
            $componentCity.on('click', 'a[componentCityConfirm]', function (event) {
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
            $componentCity.on('click', 'a[componentCityCancel]', function (event) {
                $componentCity.hide();
                event.stopPropagation();
            });
            $componentCity.on('click', function (event) {
                $componentCity.show();
                event.stopPropagation();
            });
        });
        //click document
        $(document).click(function (e) {
            $('.component_city', '#' + _self.scopeID).hide();
            e.stopPropagation();
        });
    };
    //渲染list
    CityFilterComponent.prototype.renderSelectListHtml = function ($div, data) {
        var optionList = "";
        optionList += '<ul>';
        for (var _i = 0, data_2 = data; _i < data_2.length; _i++) {
            var item = data_2[_i];
            optionList += '<li data-id=' + item.id + ' data-type=' + item.field + '>' + item.project_name + '</li>';
        }
        optionList += '</ul>';
        $div.html(optionList);
    };
    //全选
    CityFilterComponent.prototype.getSelectedFilter = function ($inputList) {
        this.filterArray = [];
        for (var i = 0; i < $inputList.length; i++) {
            if ($inputList[i].checked && $inputList[i].value != 'all') {
                this.filterArray.push($inputList[i].value);
            }
        }
    };
    CityFilterComponent.prototype.buildChange = function ($input, $targetSiblings) {
        if ($input !== null) {
            if ($input.id != "全选") {
                if (!$input.checked) {
                    this.setFilterListArr($input, $targetSiblings);
                }
                else {
                    this.delFilterListArr($input, $targetSiblings);
                }
                this.decideAllChedked($input.parentNode.parentNode, this.filterArray);
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
    CityFilterComponent.prototype.setChildFilterListArr = function ($input, $listDiv) {
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
    CityFilterComponent.prototype.delChildFilterListArr = function ($input, $listDiv) {
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
    CityFilterComponent.prototype.decideAllChedked = function (optionList, filterArray) {
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
    CityFilterComponent.prototype.getDataPostChange = function (postQuery) {
        if (postQuery && !this.isEmptyObject(postQuery)) {
            postQuery["charUUID"] = this.scopeID;
            postQuery["requestTitle"] = "cityFilter";
            var sendObj = Object.assign(_super.prototype.transformInput.call(this, 'scopeID', this.scopeID), _super.prototype.transformInput.call(this, 'result', postQuery));
            _super.prototype.onChange.call(this, this, sendObj);
        }
    };
    CityFilterComponent.prototype.confirmPostChange = function () {
        if (this.filterArray.length > 0) {
            var filter = [];
            filter = this.changeFilterArray();
            this.sendMessage({
                "datasource_id": 13,
                "filter": filter,
            });
        }
    };
    CityFilterComponent.prototype.changeFilterArray = function () {
        var changePostFilterArray = [{
                "field": 'project_id',
                "operator": "in",
                "value": '0'
            }];
        var value = ' ';
        for (var i = 0; i < this.filterArray.length; i++) {
            value += (',' + this.filterArray[i].id.replace(this.scopeID, ""));
        }
        changePostFilterArray[0]["value"] = value.trim().substr(1);
        return changePostFilterArray;
    };
    CityFilterComponent.prototype.sendMessage = function (result) {
        var sendObj = Object.assign(_super.prototype.transformInput.call(this, 'scopeID', this.scopeID), _super.prototype.transformInput.call(this, 'filterObj', this.filterScopeIDObj), _super.prototype.transformInput.call(this, 'result', result));
        _super.prototype.sendMessageBase.call(this, this, sendObj);
    };
    return CityFilterComponent;
}(base_component_1.BaseComponent));
exports.CityFilterComponent = CityFilterComponent;
//# sourceMappingURL=cityFilter.component.js.map