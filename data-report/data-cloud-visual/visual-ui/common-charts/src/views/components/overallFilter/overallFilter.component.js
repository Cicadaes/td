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
var overallFilter_template_1 = require("./overallFilter.template");
var overallFilter_model_1 = require("./overallFilter.model");
var $ = require("jquery");
var OverallFilterComponent = (function (_super) {
    __extends(OverallFilterComponent, _super);
    function OverallFilterComponent() {
        var _this = _super.call(this) || this;
        _this.myChart = null;
        _this.chartData = null;
        _this.overallFilterData = null;
        _this.echartData = null;
        _this.getSoreceData = null;
        _this.filterScopeIDObj = null;
        _this.filterArray = [];
        _this.saveFilterData = [];
        _this.filterType = 'filter-classify';
        _this.filterAllType = null;
        _this.filterID = "1";
        _this.filterValue = "";
        _this.filterSaveBrand = "全部品牌";
        _this.filterSaveRegion = "全部大区";
        _this.filterSaveCity = "全部城市";
        _this.changeBrandTitleBool = false;
        _this.changeRegionTitleBool = false;
        _this.changeCityTitleBool = false;
        _this.filterBrandTitleBool = false;
        _this.filterRegionTitleBool = false;
        _this.filterCityTitleBool = false;
        _this.timer = null;
        _this.filterLength = null;
        _this.filterListObj = null;
        _this.saveProject = null;
        _this.body = {
            "datasource_id": 27,
            'dimensions': null,
            'filters': null
        };
        _this.saveInputBoolean = false;
        _this.saveCheckedBoolean = false;
        var template = new overallFilter_template_1.OverallFilterTemplate(_this.scopeID);
        //获得模板渲染后的节点
        _this.element = _this.render(template);
        _this.overallFilterData = new overallFilter_model_1.OverallFilterModel();
        return _this;
    }
    OverallFilterComponent.prototype.beforeShow = function () {
    };
    OverallFilterComponent.prototype.afterShow = function () {
        this.init();
    };
    OverallFilterComponent.prototype.beforeDestory = function () {
    };
    OverallFilterComponent.prototype.afterDestory = function () {
    };
    OverallFilterComponent.prototype.resize = function () {
    };
    OverallFilterComponent.prototype.overallFilterChange = function (event, changeObj) {
        var _this = this;
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
        setTimeout(function () {
            _this.setInputChedked(_this.saveFilterData, changeObj.result);
        }, 500);
    };
    OverallFilterComponent.prototype.projectType = function (result) {
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
    };
    OverallFilterComponent.prototype.getconfiginformation = function (event, changeObj) {
        if (!this.isEmptyObject(changeObj.result)) {
            $('#' + this.scopeID).find('p[componentDatasourceHelpText]').html(JSON.stringify(changeObj.result));
            this.filterLength = changeObj.result.filterLength || 4;
            $('.component_bottom_l', '#' + this.scopeID).find('strong').html(this.filterLength);
            var filterShopArray = void 0;
            if (changeObj.parameter && changeObj.parameter.group_sign == 'Y') {
                filterShopArray = this.overallFilterData.overallFilterShopArray;
            }
            else {
                filterShopArray = this.overallFilterData.liteArray;
            }
            this.renderSelectListHtml($('#' + this.scopeID).find('div[componentOverallLeftList]'), filterShopArray);
            this.filterScopeIDObj = changeObj.result;
        }
        else {
            return;
        }
    };
    //设置input checked 判断是否选中
    OverallFilterComponent.prototype.setInputChedked = function (datasourceData, parameter) {
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
            }]);
    };
    OverallFilterComponent.prototype.dataChange = function (data) {
        if (this.filterType == "filter-all-title") {
            // this.setFilterData(this.filterAllType, data);
            var $div = $('#' + this.scopeID).find('div[data-id=' + this.filterAllType + '][data-type=' + this.filterType + ']').siblings('.component_top_select_list');
            this.decideFilterAllType(this.filterAllType, data);
            this.renderSelectListHtml($div, data);
        }
        else {
            this.filterListObj = data;
            this.decideDataArrayLength(data);
        }
        this.saveFilterData = data;
    };
    OverallFilterComponent.prototype.decideFilterAllType = function (type, data) {
        switch (type) {
            case '6':
                data.unshift({ id: -1, project_name: "全部品牌" });
                break;
            case '5':
                data.unshift({ id: -1, project_name: "全部大区" });
                break;
            case '11':
                data.unshift({ id: -1, project_name: "全部城市" });
                break;
        }
    };
    OverallFilterComponent.prototype.styleChange = function (style) {
    };
    OverallFilterComponent.prototype.loadData = function () {
    };
    Object.defineProperty(OverallFilterComponent.prototype, "data", {
        get: function () {
            return this.chartData;
        },
        enumerable: true,
        configurable: true
    });
    OverallFilterComponent.prototype.init = function () {
        var _this = this;
        //commonchange
        setTimeout(function () {
            _this.commonChange();
        }, 300);
    };
    //判断data是否为空时
    OverallFilterComponent.prototype.decideDataArrayLength = function (data) {
        var $overallNode = $('#' + this.scopeID).find(".component_overall_none"), $overallList = $('#' + this.scopeID).find(".component_overall_list ul");
        if (data.length == 0) {
            $overallNode.html("暂无数据");
            $overallList.html("");
        }
        else {
            $overallNode.html("");
            //判断从外界拿到的值是否在数据里存在
            if (this.saveInputBoolean) {
                this.decideProjectData(data);
            }
            else {
                this.renderlistHtml(data);
            }
        }
    };
    OverallFilterComponent.prototype.decideProjectData = function (data) {
        var filterProjectArray = [{
                id: this.saveProject.projectId,
                project_name: this.saveProject.projectName
            }], filterProjectBool = false, filterProjectData = data;
        this.filterArray = [];
        this.filterArray = filterProjectArray;
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var item = data_1[_i];
            if (parseInt(item.id) == parseInt(this.saveProject.projectId)) {
                filterProjectBool = true;
            }
        }
        if (!filterProjectBool) {
            filterProjectData.unshift({
                id: this.saveProject.projectId,
                project_name: this.saveProject.projectName
            });
        }
        ;
        this.saveInputBoolean = false;
        this.renderlistHtml(data);
        if (this.saveCheckedBoolean) {
            this.setChedked($('.component_overall_list', '#' + this.scopeID), filterProjectArray);
        }
    };
    //渲染中间选择list
    OverallFilterComponent.prototype.renderlistHtml = function (data) {
        var optionList = "";
        for (var _i = 0, data_2 = data; _i < data_2.length; _i++) {
            var item = data_2[_i];
            optionList += '<li title="' + item.project_name + '"><input type="checkbox" id=' + item.id + ' name="filter" value=' + item.project_name + '/><label for=' + item.id + '>' + item.project_name + '</label></li>';
        }
        $('#' + this.scopeID).find(".component_overall_list ul").html(optionList);
    };
    //设置input
    OverallFilterComponent.prototype.setChedked = function (optionList, filterArray) {
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
    OverallFilterComponent.prototype.setFilterListArr = function ($input, $listDiv) {
        if (this.filterArray.length > 0) {
            for (var _i = 0, _a = this.filterArray; _i < _a.length; _i++) {
                var item = _a[_i];
                if (item.id == $input.id) {
                    break;
                }
            }
        }
        if (this.filterArray.length > this.filterLength - 1) {
            $listDiv.find('input').prop('disabled', true);
            $listDiv.find('input[checked]').prop('disabled', false);
        }
        else {
            this.filterArray.push({
                id: $input.id,
                project_name: $input.labels[0].innerText
            });
        }
    };
    OverallFilterComponent.prototype.delFilterListArr = function ($input, $listDiv) {
        if (this.filterArray.length > 0) {
            for (var i = 0; i < this.filterArray.length; i++) {
                if (this.filterArray[i].id == $input.id) {
                    this.filterArray.splice(i, 1);
                }
            }
            if (this.filterArray.length < this.filterLength) {
                $listDiv.find('input').prop("disabled", false);
            }
        }
    };
    OverallFilterComponent.prototype.renderOverallSelected = function ($div, data) {
        $div.empty();
        var html = '';
        for (var i = 0; i < data.length; i++) {
            html += '<span>' + data[i]['project_name'] + '</span>';
        }
        $div.append(html);
    };
    OverallFilterComponent.prototype.commonChange = function () {
        var _self = this, $chooseLength = $('#' + this.scopeID).find('.component_bottom_l span');
        //click filter
        $('#' + _self.scopeID).find('div[componentFilter]').click(function (event) {
            $('#' + _self.scopeID).find("div[componentOverall]").show();
            event.stopPropagation();
        });
        $(document).ready(function () {
            var $componentOverall = $('#' + _self.scopeID).find('div[componentOverall]');
            //click checkbox
            $('#' + _self.scopeID).find('.component_overall_list').click(function (event) {
                var $input = event.target.previousSibling, $listDiv = $('#' + _self.scopeID).find('.component_overall_list');
                _self.buildChange($input, $listDiv);
                if (_self.filterArray.length > 0) {
                    $('#' + _self.scopeID).find('.component_bottom_l em').text("");
                }
                $chooseLength.text(_self.filterArray.length);
                event.stopPropagation();
            });
            //search
            $componentOverall.on('keyup', '.overall_right_search', function (event) {
                var searchText = $(event.target).val().trim();
                var newList = [];
                if (searchText.length <= 0) {
                    newList = _self.filterListObj;
                }
                else {
                    for (var i = 0; i < _self.filterListObj.length; i++) {
                        if (_self.filterListObj[i]['project_name'].indexOf(searchText) > 0) {
                            newList.push(_self.filterListObj[i]);
                        }
                    }
                }
                _self.renderlistHtml(newList);
                _self.setChedked($('.component_overall_list', '#' + _self.scopeID), _self.filterArray);
                event.stopPropagation();
            });
            // $componentOverall.on('blur','.overall_right_search',(event:any)=>{
            //     if()
            //     $componentOverall.find('.overall_right_search').val('');
            //     _self.renderlistHtml(_self.filterListObj);
            //     _self.setChedked($('.component_overall_list','#'+this.scopeID),this.filterArray);
            // })
            //click get dropdown get list
            $componentOverall.on('click', '.component_top', function (event) {
                var $selectList = $(event.target).siblings('.component_top_select_list');
                $('.component_top_select_list').hide();
                //点击设置选择的类型
                var dataType = $(event.target).attr("data-type"), allType = $(event.target).attr("data-id");
                if (dataType !== undefined) {
                    _self.filterType = dataType;
                    _self.filterAllType = allType;
                }
                //判断是否发送请求
                _self.getDataPostChange(_self.setBodyObj(_self.filterType));
                setTimeout(function () {
                    $selectList.show();
                }, 200);
                event.stopPropagation();
            });
            //click choose list
            $componentOverall.on('click', '.component_top_select_list', function (event) {
                var $tagget = $(event.currentTarget);
                $tagget.siblings().text($(event.target).text());
                if (_self.filterType == "filter-classify") {
                    var dataID = $(event.target).attr("data-id");
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
            $componentOverall.on('click', 'a[componentOverallConfirm]', function (event) {
                if (_self.filterArray.length <= 0) {
                    $('#' + _self.scopeID).find('.component_bottom_l em').text("请至少选择一个");
                }
                else {
                    $('#' + _self.scopeID).find('.component_bottom_l em').text("");
                    _self.renderOverallSelected($('.overallSelected', '#' + _self.scopeID), _self.filterArray);
                    _self.confirmPostChange();
                    $('.component_overall').hide();
                }
                event.stopPropagation();
            });
            //click cancel
            $componentOverall.on('click', 'a[componentOverallCancel]', function (event) {
                $('.component_overall').hide();
                event.stopPropagation();
            });
        });
        //click document
        $(document).click(function (e) {
            $('.component_top_select_list').hide();
            e.stopPropagation();
        });
    };
    //切换查看重置信息
    OverallFilterComponent.prototype.changeInformation = function () {
        this.body = {
            "datasource_id": 27,
        };
        this.changeBrandTitleBool = false;
        this.changeRegionTitleBool = false;
        this.changeCityTitleBool = false;
        this.filterBrandTitleBool = false;
        this.filterRegionTitleBool = false;
        this.filterCityTitleBool = false;
    };
    //根据类型设置select list 初始值
    OverallFilterComponent.prototype.setFilterData = function (filterAllType, data) {
        switch (filterAllType) {
            case "6":
                if (!this.filterBrandTitleBool) {
                    data.unshift({
                        project_name: '全部品牌',
                        id: -1
                    });
                    this.filterBrandTitleBool = true;
                }
                break;
            case "5":
                if (!this.filterRegionTitleBool) {
                    data.unshift({
                        project_name: '全部大区',
                        id: -1
                    });
                    this.filterRegionTitleBool = true;
                }
                break;
            case "11":
                if (!this.filterCityTitleBool) {
                    data.unshift({
                        project_name: '全部城市',
                        id: -1
                    });
                    this.filterCityTitleBool = true;
                }
                break;
        }
    };
    OverallFilterComponent.prototype.saveFilterTitleBool = function (filterType) {
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
    };
    OverallFilterComponent.prototype.saveFilterValue = function (filterType, targetValue) {
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
    };
    //渲染第一个下拉框list
    OverallFilterComponent.prototype.renderSelectListHtml = function ($div, data) {
        var optionList = "";
        optionList += '<ul>';
        for (var _i = 0, data_3 = data; _i < data_3.length; _i++) {
            var item = data_3[_i];
            optionList += '<li data-id=' + item.id + ' title="' + item.project_name + '">' + item.project_name + '</li>';
        }
        optionList += '</ul>';
        $div.html(optionList);
    };
    //判断选择的类型
    OverallFilterComponent.prototype.decideFilterType = function (id) {
        var optionList = "";
        switch (id) {
            case "1":
                optionList += '<div class="component_top_select" data-type="filter-brand">';
                optionList += '<div class="component_top_select_title" data-id="6" data-type="filter-all-title">全部品牌</div>';
                optionList += '<div class="component_top_select_list">';
                optionList += '</div>';
                optionList += '</div>';
                optionList += '<div class="component_top_select" data-type="filter-region">';
                optionList += '<div class="component_top_select_title" data-id="5" data-type="filter-all-title">全部大区</div>';
                optionList += '<div class="component_top_select_list">';
                optionList += '</div>';
                optionList += '</div>';
                optionList += '<div class="component_top_select" data-type="filter-city">';
                optionList += '<div class="component_top_select_title" data-id="11" data-type="filter-all-title">全部城市</div>';
                optionList += '<div class="component_top_select_list">';
                optionList += '</div>';
                optionList += '</div>';
                //点击设置选择的类型id
                this.filterID = id;
                break;
            case "11":
                optionList += '<div class="component_top_select" data-type="filter-brand">';
                optionList += '<div class="component_top_select_title" data-id="6" data-type="filter-all-title">全部品牌</div>';
                optionList += '<div class="component_top_select_list">';
                optionList += '</div>';
                optionList += '</div>';
                optionList += '<div class="component_top_select" data-type="filter-region">';
                optionList += '<div class="component_top_select_title" data-id="5" data-type="filter-all-title">全部大区</div>';
                optionList += '<div class="component_top_select_list">';
                optionList += '</div>';
                optionList += '</div>';
                //点击设置选择的类型id
                this.filterID = id;
                break;
            case "5":
                optionList += '<div class="component_top_select" data-type="filter-brand">';
                optionList += '<div class="component_top_select_title" data-id="6" data-type="filter-all-title">全部品牌</div>';
                optionList += '<div class="component_top_select_list">';
                optionList += '</div>';
                optionList += '</div>';
                //点击设置选择的类型id
                this.filterID = id;
                break;
            case "6":
                //点击设置选择的类型id
                this.filterID = id;
                break;
        }
        $('#' + this.scopeID).find(".overall_child").html(optionList);
    };
    OverallFilterComponent.prototype.buildChange = function ($input, $targetSiblings) {
        if ($input !== null) {
            if (!$input.checked) {
                this.setFilterListArr($input, $targetSiblings);
            }
            else {
                this.delFilterListArr($input, $targetSiblings);
            }
        }
    };
    OverallFilterComponent.prototype.getDataPostChange = function (postQuery) {
        var sendObj = Object.assign(_super.prototype.transformInput.call(this, 'scopeID', this.scopeID), _super.prototype.transformInput.call(this, 'result', postQuery));
        _super.prototype.onChange.call(this, this, sendObj);
    };
    OverallFilterComponent.prototype.confirmPostChange = function () {
        if (!this.isEmptyObject(this.filterScopeIDObj)) {
            this.parameterPostChange(this.changeFilterArray());
        }
        else {
            return;
        }
    };
    OverallFilterComponent.prototype.changeFilterArray = function () {
        var changePostFilterArray = [], filterValue = [], nameValue = [];
        for (var _i = 0, _a = this.filterArray; _i < _a.length; _i++) {
            var item = _a[_i];
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
    };
    OverallFilterComponent.prototype.parameterPostChange = function (filterArray) {
        var sendObj = Object.assign(_super.prototype.transformInput.call(this, 'scopeID', this.scopeID), _super.prototype.transformInput.call(this, 'filterObj', this.filterScopeIDObj), _super.prototype.transformInput.call(this, 'result', Object.assign(_super.prototype.transformInput.call(this, 'filter', filterArray), _super.prototype.transformInput.call(this, 'chart', this.filterArray))));
        _super.prototype.sendMessageBase.call(this, this, sendObj);
    };
    OverallFilterComponent.prototype.setBodyObj = function (type) {
        switch (type) {
            case 'filter-classify':
                this.body = {
                    "datasource_id": 27,
                };
                this.body['dimensions'] = [
                    { "field": "project_name" },
                    { "field": "id" }
                ],
                    this.body['filters'] = [
                        { "field": "project_type", "operator": "=", "value": this.filterID },
                        { "field": "status", "operator": "=", "value": "1" }
                    ];
                this.body['limit'] = [-1];
                break;
            case 'filter-all-title':
                this.body['dimensions'] = [
                    { "field": "project_name" }
                ];
                this.filterChangeBody(this.filterAllType, type, this.body);
                break;
            case 'filter-brand':
                this.listFilterChangeBody(this.filterID, type, this.filterListChangeBody());
                break;
            case 'filter-region':
                this.listFilterChangeBody(this.filterID, type, this.filterListChangeBody());
                break;
            case 'filter-city':
                this.listFilterChangeBody(this.filterID, type, this.filterListChangeBody());
                break;
        }
        this.body["charUUID"] = this.scopeID;
        this.body["requestTitle"] = "overallFilter";
        return this.body;
    };
    OverallFilterComponent.prototype.filterFieldFilters = function (field, type, value) {
        for (var i = 0; i < field.length; i++) {
            if (field[i].field == type) {
                field[i].value = value;
            }
            else {
                break;
            }
        }
    };
    OverallFilterComponent.prototype.filterFieldValue = function (field, value, filterSaveValue, filter) {
        for (var i = 0; i < field.length; i++) {
            if (field[i].field == value) {
                field.splice(i, 1);
                break;
            }
        }
        this.decideFilterField(field, value, filterSaveValue, filter);
    };
    OverallFilterComponent.prototype.deleteFilterValue = function (value) {
        for (var i = 0; i < this.body['filters'].length; i++) {
            if (this.body['filters'][i].field == value) {
                this.body['filters'].splice(i, 1);
            }
        }
    };
    OverallFilterComponent.prototype.decideFilterField = function (field, value, filterSaveValue, filter) {
        this.filterFieldFilters(field, 'project_type', filter);
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
    };
    OverallFilterComponent.prototype.filterListChangeBody = function () {
        this.body['dimensions'] = [
            { "field": "project_name" },
            { "field": "id" }
        ];
        this.body['limit'] = [1, 100];
        return this.body;
    };
    OverallFilterComponent.prototype.filterChangeBody = function (filter, type, dimensionsLimit) {
        this.body = dimensionsLimit;
        switch (filter) {
            case "6":
                this.body['dimensions'].push({ "field": "id" });
                this.body['filters'] = [
                    { "field": "project_type", "operator": "=", "value": filter },
                    { "field": "status", "operator": "=", "value": "1" }
                ];
                break;
            case "5":
                this.body['dimensions'].push({ "field": "id" });
                this.body['filters'] = [
                    { "field": "project_type", "operator": "=", "value": filter },
                    { "field": "status", "operator": "=", "value": "1" }
                ];
                if (this.filterSaveBrand !== "全部品牌") {
                    this.body['filters'].push({ "field": "brand", "operator": "=", "value": this.filterSaveBrand });
                }
                break;
            case "11":
                this.body['dimensions'].push({ "field": "id" });
                this.body['filters'] = [
                    { "field": 'project_type', "operator": "=", "value": filter },
                    { "field": "status", "operator": "=", "value": "1" }
                ];
                if (this.filterSaveBrand !== "全部品牌") {
                    this.body['filters'].push({ "field": "brand", "operator": "=", "value": this.filterSaveBrand });
                }
                if (this.filterSaveRegion !== "全部大区") {
                    this.body['filters'].push({ "field": "region", "operator": "=", "value": this.filterSaveRegion });
                }
                break;
        }
        return this.body;
    };
    OverallFilterComponent.prototype.listFilterChangeBody = function (filter, type, dimensionsLimit) {
        this.body = dimensionsLimit;
        switch (type) {
            case "filter-brand":
                this.filterFieldValue(this.body['filters'], 'brand', this.filterSaveBrand, filter);
                break;
            case "filter-region":
                this.filterFieldValue(this.body['filters'], 'region', this.filterSaveRegion, filter);
                break;
            case "filter-city":
                this.filterFieldValue(this.body['filters'], 'logical_city', this.filterSaveCity, filter);
                break;
        }
        return this.body;
    };
    return OverallFilterComponent;
}(base_component_1.BaseComponent));
exports.OverallFilterComponent = OverallFilterComponent;
//# sourceMappingURL=overallFilter.component.js.map