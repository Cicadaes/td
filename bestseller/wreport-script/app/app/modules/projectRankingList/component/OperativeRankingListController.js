'use strict';

angular.module('wreport.app').controller('OperativeRankingListController', function ($scope, $state, $location, CommonService, NgTableParams) {

    $scope.initOperative = function () {
        $scope.filterCountFlage = false;  // 过滤框标志
        $scope.filterCityFlage = false;  // 城市过滤框标志
        $scope.filterChannelFlage = false;  // 渠道过滤框标志
        $scope.dropDownWapCityFlag = true; // 城市下拉框
        $scope.dropDownWapChannelFlage = true; // 渠道下拉框
        $scope.collectType = false;// 显示收藏标志
        $scope.setAddIndexFlag = false;  // 控制添加指标下拉框显示标志
        $scope.filterCountText = "按商场查看";
        $scope.filterCityText = "全部城市";
        $scope.filterChannelText = "全部渠道";
        $scope.indexProjectType = 7;
        $state.weekMonthFlag == "day"
        $scope.searchTextOperative = ""; // 搜索条件
        $scope.sortType = "";
        $scope.sortSelect = "";
        $scope.indexListMap = {};

        $scope.favoriteFlag = 0;  // 显示收藏标志
        $scope.dateFlag = 0;  // 按天、月、周查看标志

        // 初始化日期控件的默认值
        var date = new Date();
        $scope.dateInTop = {
            tagDataTimeStart: date.getTime() - 86400000 * 30,
            tagDataTimeEnd: date.getTime()- 86400000
        };

        $scope.startStr = new Date($scope.dateInTop.tagDataTimeStart).Format('yyyy-MM-dd');
        $scope.endStr = new Date($scope.dateInTop.tagDataTimeEnd).Format('yyyy-MM-dd');

        // 过滤选择器列表
        $scope.filterList = [
            {"name": "按商场查看", "type": "shop"},
            {"name": "按渠道查看", "type": "channel"}
        ];


        // 初始化查询条件  ---  原始查询条件
        $scope.globalVariableOperative = {
            projectType: $scope.indexProjectType,
            status: 1,
            startDate: $scope.startStr,
            endDate: $scope.endStr,
            joinFlag:$scope.favoriteFlag,
            rangeQueryFlag:$scope.dateFlag
        };
    };


    // excel导出
    $scope.exportReport = function(){
        var queryObj = angular.copy($scope.globalVariableOperative);
        queryObj["pageEnabled"] = false;
        if(queryObj.hasOwnProperty("status")){
            delete queryObj["status"]
        }
        CommonService.request('GetProjectRankingListExcel', queryObj).then(function (response) {
            document.location.href = "api/exports/getExportExcel/" + response.data.attachId;
        });
    };

    // 获取渠道下拉数据
    $scope.getSpinnerChannelList = function (obj) {
        var name = "";
        var queryobj = {
            pageEnabled: false,
            status: 1,
            projectType: 8,
        };
        if (obj != undefined) {
            name = obj;
            queryobj.channe = name;
        }

        CommonService.request("GetSpinnerList", queryobj).then(function (response) {
            $scope.channelFilterList = response.data;
        })
    };
    // 获取城市下拉列表数据
    $scope.getSpinnerCityList = function (chanelname) {
        var queryobj = {
            pageEnabled: false,
            status: 1,
            projectType: 3
        };


        if (chanelname != undefined) {
            queryobj.channel = chanelname;
        }
        CommonService.request("GetSpinnerList", queryobj).then(function (response) {
            $scope.cityList = response.data;
        })
    };

    $scope.initOperative();
    $scope.getSpinnerChannelList();
    $scope.getSpinnerCityList();
    // 回车搜索
    $scope.myKeyUpOperative = function (e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13) {
            $scope.globalVariableOperative["q"] = encodeURI($scope.searchTextOperative);
            $scope.tableParamsOperative.filter($scope.globalVariableOperative);
        }
        if ($scope.searchTextOperative == "") {
            if($scope.globalVariableOperative.hasOwnProperty("q")){
                delete $scope.globalVariableOperative["q"]
            }
            $scope.tableParamsOperative.filter($scope.globalVariableOperative);
        }
    };




    // 全部按钮过滤
    $scope.filterDataListAll = function(event,type){
        event.stopPropagation();
        $scope.filterCityFlage = false;  // 城市过滤框标志
        $scope.filterChannelFlage = false;  // 渠道过滤框标志
        //$scope.filterCityText = "全部城市";
        //$scope.filterChannelText = "全部渠道";

        var obj = {
            projectType: $scope.indexProjectType,
            status: 1,
            startDate: $scope.startStr,
            endDate: $scope.endStr,
            joinFlag:$scope.favoriteFlag,
            rangeQueryFlag:$scope.dateFlag
        };

        if(type == "city"){
            if($scope.filterChannelText != "全部渠道"){
                obj["channel"] = $scope.filterChannelText;
            }
            $scope.filterCityText = "全部城市";
        }else if(type == "channel"){
            $scope.filterChannelText = "全部渠道";
        }

        $scope.globalVariableOperative = angular.copy(obj);
        $scope.tableParamsOperative.filter(obj);

    };

    // 过滤数据列表
    $scope.filterDataList = function (event, filter, type,one) {
        event.stopPropagation();
        //$scope.filterCityText = "全部城市";
        //$scope.filterChannelText = "全部渠道";
        $scope.filterCityFlage = false;  // 城市过滤框标志
        $scope.filterChannelFlage = false;  // 渠道过滤框标志
        var obj = {
            projectType: $scope.indexProjectType,
            status: 1,
            startDate: $scope.startStr,
            endDate: $scope.endStr,
            joinFlag:$scope.favoriteFlag,
            rangeQueryFlag:$scope.dateFlag
        };
        if(type == "city"){
            $scope.filterCityText = one.city;
            if($scope.filterChannelText != "全部渠道"){

            }
            obj["city"] = one.city;
            $scope.tableParamsOperative.filter(obj);
        }else if(type == "channel"){
            $scope.filterChannelText = one.projectName;
            obj["channel"] = one.projectName;
            $scope.tableParamsOperative.filter(obj);
            $scope.getSpinnerCityList(one.projectName);
        }
        $scope.globalVariableOperative = angular.copy(obj);
    };
    // 改变数据
    $scope.changeTypeDate = function (data) {
        $scope.indexListMap = {};
        for(var i = 0; i < data.length; i++){
            $scope.indexListMap[data[i]] = true;
        }
        if($.isEmptyObject($scope.indexListMap)){
            $(".tab_css_1").removeClass("tab_css_2");
        }else{
            $(".tab_css_1").addClass("tab_css_2");
        } // true 表示对象为空
        setTimeout(function(){
            var width = $(".getWidth > thead").innerWidth();
            $(".getWidth ").parent().find(".ng-isolate-scope").css({"width":width});
        },100);
        $scope.setAddIndexFlag = false;
    };
    // 设置下拉框隐藏
    $scope.setAddIndexHide = function () {
        $scope.setAddIndexFlag = false;
    };
    // 控制添加指标组建是否显示
    $scope.setAddIndexShow = function () {
        $scope.setAddIndexFlag = !$scope.setAddIndexFlag;
    };
    var hideFunc = function (e) {
        e.stopPropagation();
        $scope.filterCountFlage = false;  // 过滤框标志
        $scope.filterCityFlage = false;  // 城市过滤框标志
        $scope.filterChannelFlage = false;  // 渠道过滤框标志
        CommonService.refreshAngular($scope);
    };
    setTimeout(function () {
        $('body').on('click', hideFunc);
    });
    $scope.$on("$destroy", function () {
        $('body').off('click', hideFunc);
    });
    // 收藏tab
    $scope.changeCollectionType = function (event) {
        event.stopPropagation();
        $scope.collectType = !$scope.collectType;
        if($scope.collectType == true){
            $scope.favoriteFlag = 1;
        }else {
            $scope.favoriteFlag = 0;
        }
        var obj = angular.copy($scope.globalVariableOperative);
        obj["joinFlag"] = $scope.favoriteFlag;
        $scope.globalVariableOperative = angular.copy(obj);
        $scope.tableParamsOperative.filter(obj);
    };
    // 过滤框控制显示隐藏
    $scope.filterShow = function (event, type) {
        event.stopPropagation();
        if (type == 'filterCount') {
            $scope.filterCountFlage = !$scope.filterCountFlage;
        } else if (type == 'filterChannel') {
            $scope.filterChannelFlage = !$scope.filterChannelFlage;
        } else if (type == 'filterCity') {
            $scope.filterCityFlage = !$scope.filterCityFlage;
        }
    };
    $scope.changeFilterCount = function (event, type,one) {
        event.stopPropagation();
        $scope.filterCountText = one.name;
        $scope.filterCountFlage = false;  // 过滤框标志
        $scope.filterCityFlage = false;  // 城市过滤框标志
        $scope.filterChannelFlage = false;  // 渠道过滤框标志
        $scope.filterCityText = "全部城市";
        $scope.filterChannelText = "全部渠道";
        $scope.changeFilterType = type;
        if ($scope.changeFilterType == "shop") {
            $scope.dropDownWapCityFlag = true; // 城市下拉框
            $scope.dropDownWapChannelFlage = true; // 渠道下拉框
            $scope.indexProjectType = 7;
        } else if ($scope.changeFilterType == "channel") {
            $scope.dropDownWapCityFlag = false; // 城市下拉框
            $scope.dropDownWapChannelFlage = false; // 渠道下拉框
            $scope.indexProjectType = 8;
        }

        var obj = {
            projectType: $scope.indexProjectType,
            status: 1,
            startDate: $scope.startStr,
            endDate: $scope.endStr,
            joinFlag:$scope.favoriteFlag,
            rangeQueryFlag:$scope.dateFlag
        };
        $scope.globalVariableOperative = angular.copy(obj);
        $scope.tableParamsOperative.filter(obj);
        $scope.getSpinnerChannelList();
        $scope.getSpinnerCityList();
    };

    // 模拟排序
    $scope.sort_index = function(type){
        if(type != $scope.sortType){
            $scope.flag = false;
            $scope.sortType = type;
        }
        $scope.flag = !$scope.flag;
        var sortTypeUpDown = "desc";
        if($scope.flag == true)
        {
            sortTypeUpDown = "desc";
            $scope.sortSelect = type + "Up";
            //$scope.sortSelect = type + "Down";
        }else {
            sortTypeUpDown = "asc";
            $scope.sortSelect = type + "Down";
            //$scope.sortSelect = type + "Up";
        }
        $scope.indexSort(type,sortTypeUpDown);
    };

    //  详情页置顶功能
    $scope.makeTop = function (project, $event) {
        $event.stopPropagation();
        // 请求置顶接口
        var queryobj = {
            projectId: project.projectId,
            type: 2,
            status: 1
        };
        CommonService.create('MakeTop', queryobj).then(function () {
            $scope.tableParamsOperative.reload();
        });
    };

    $scope.indexSort = function (name, type) {
        if (name == 'activeUsers') {
            $scope.paramsOperative.$params['sorting'] = {"activeUsers": type};
        } else if (name == 'activeUsersChainRate') {
            $scope.paramsOperative.$params['sorting'] = {"activeUsersChainRate": type};
        } else if (name == 'frontUsers') {
            $scope.paramsOperative.$params['sorting'] = {"frontUsers": type};
        } else if (name == 'frontUsersChainRate') {
            $scope.paramsOperative.$params['sorting'] = {"frontUsersChainRate": type};
        } else if (name == 'stayUsers') {
            $scope.paramsOperative.$params['sorting'] = {"stayUsers": type};
        } else if (name == 'stayUsersChainRate') {
            $scope.paramsOperative.$params['sorting'] = {"stayUsersChainRate": type};
        } else if (name == 'jumpUsers') {
            $scope.paramsOperative.$params['sorting'] = {"jumpUsers": type};
        } else if (name == 'jumpUsersChainRate') {
            $scope.paramsOperative.$params['sorting'] = {"jumpUsersChainRate": type};
        } else if (name == 'incomingMember') {
            $scope.paramsOperative.$params['sorting'] = {"incomingMember": type};
        } else if (name == 'incomingMemberChainRate') {
            $scope.paramsOperative.$params['sorting'] = {"incomingMemberChainRate": type};
        } else if (name == 'potentialCount') {
            $scope.paramsOperative.$params['sorting'] = {"potentialCount": type};
        } else if (name == 'potentialCountChainRate') {
            $scope.paramsOperative.$params['sorting'] = {"potentialCountChainRate": type};
        } else if (name == 'memberCount') {
            $scope.paramsOperative.$params['sorting'] = {"memberCount": type};
        } else if (name == 'memberCountChainRate') {
            $scope.paramsOperative.$params['sorting'] = {"memberCountChainRate": type};
        } else if (name == 'activeUserNewRate') {
            $scope.paramsOperative.$params['sorting'] = {"activeUserNewRate": type};
        } else if (name == 'activeUserNewRateChainRate') {
            $scope.paramsOperative.$params['sorting'] = {"activeUserNewRateChainRate": type};
        } else if (name == 'activeUserOldRate') {
            $scope.paramsOperative.$params['sorting'] = {"activeUserOldRate": type};
        } else if (name == 'activeUserOldRateChainRate') {
            $scope.paramsOperative.$params['sorting'] = {"activeUserOldRateChainRate": type};
        } else if (name == 'highRate') {
            $scope.paramsOperative.$params['sorting'] = {"highRate": type};
        } else if (name == 'highRateChainRate') {
            $scope.paramsOperative.$params['sorting'] = {"highRateChainRate": type};
        } else if (name == 'middleRate') {
            $scope.paramsOperative.$params['sorting'] = {"middleRate": type};
        } else if (name == 'middleRateChainRate') {
            $scope.paramsOperative.$params['sorting'] = {"middleRateChainRate": type};
        } else if (name == 'lowRate') {
            $scope.paramsOperative.$params['sorting'] = {"lowRate": type};
        } else if (name == 'lowRateChainRate') {
            $scope.paramsOperative.$params['sorting'] = {"lowRateChainRate": type};
        } else if (name == 'sleepRate') {
            $scope.paramsOperative.$params['sorting'] = {"sleepRate": type};
        } else if (name == 'sleepRateChainRate') {
            $scope.paramsOperative.$params['sorting'] = {"sleepRateChainRate": type};
        } else if (name == 'stayTime') {
            $scope.paramsOperative.$params['sorting'] = {"stayTime": type};
        } else if (name == 'stayTimeChainRate') {
            $scope.paramsOperative.$params['sorting'] = {"stayTimeChainRate": type};
        } else if (name == 'enterRate') {
            $scope.paramsOperative.$params['sorting'] = {"enterRate": type};
        } else if (name == 'enterRateChainRate') {
            $scope.paramsOperative.$params['sorting'] = {"enterRateChainRate": type};
        } else if (name == 'stayRate') {
            $scope.paramsOperative.$params['sorting'] = {"stayRate": type};
        } else if (name == 'stayRateChainRate') {
            $scope.paramsOperative.$params['sorting'] = {"stayRateChainRate": type};
        } else if (name == 'jumpRate') {
            $scope.paramsOperative.$params['sorting'] = {"jumpRate": type};
        } else if (name == 'jumpRateChainRate') {
            $scope.paramsOperative.$params['sorting'] = {"jumpRateChainRate": type};
        } else if (name == 'salesAmount') {
            $scope.paramsOperative.$params['sorting'] = {"salesAmount": type};
        } else if (name == 'salesAmountChainRate') {
            $scope.paramsOperative.$params['sorting'] = {"salesAmountChainRate": type};
        } else if (name == 'orderCount') {
            $scope.paramsOperative.$params['sorting'] = {"orderCount": type};
        } else if (name == 'orderCountChainRate') {
            $scope.paramsOperative.$params['sorting'] = {"orderCountChainRate": type};
        } else if (name == 'orderAveragePrice') {
            $scope.paramsOperative.$params['sorting'] = {"orderAveragePrice": type};
        } else if (name == 'orderAveragePriceChainRate') {
            $scope.paramsOperative.$params['sorting'] = {"orderAveragePriceChainRate": type};
        } else if (name == 'singularPrice') {
            $scope.paramsOperative.$params['sorting'] = {"singularPrice": type};
        } else if (name == 'singularPriceChainRate') {
            $scope.paramsOperative.$params['sorting'] = {"singularPriceChainRate": type};
        }
    };


    // 获取列表数据
    // 查询项目详情table
    $scope.tableParamsOperative = new NgTableParams(
        {
            page: 1,
            count: 10,
            sort: {
                name: 'asc'
            },
            filter: {
                projectType: $scope.indexProjectType,
                status: 1,
                startDate: $scope.startStr,
                endDate: $scope.endStr,
                joinFlag:$scope.favoriteFlag,
                rangeQueryFlag:$scope.dateFlag
            }
        }, {
            counts: [10, 20, 50],
            paginationMaxBlocks: 9,
            total: 0,
            getData: function ($defer, params) {
                // 排序功能前端代码
                var sort = params.sorting();
                var page = params.url();
                params.paging = {offset: (page.page - 1) * page.count, limit: page.count};
                for (var p in sort) {
                    if (!sort.hasOwnProperty(p)) {
                        continue;
                    }
                    params.sort = {sort: p, order: sort[p]};
                }
                $scope.paramsOperative = params;
                $scope.deferOperative = $defer;
                var queryobj = CommonService.buildQueryParams(params);
                CommonService.request("GetMechanismRankingList", queryobj).then(function (response) {
                    var total = response.headers()['x-total-count'];
                    $scope.detail_List = response.data;
                    params.total(total);
                    $scope.projectsCount = total;
                    $defer.resolve(response.data);
                })
            }
        }
    );

    $state.filterOperativeList = function (start,end,rangeQuery) {
        var obj = angular.copy($scope.globalVariableOperative);
        $scope.startStr = start;
        $scope.endStr = end;
        if($state.weekMonthFlag == "day"){
            obj['startDate'] = start;
            obj['endDate'] = end;
        }else {
            obj['startDate'] = start;
            obj['endDate'] = end;
        }
        obj["rangeQueryFlag"] = rangeQuery;
        $scope.dateFlag = rangeQuery;
        $scope.globalVariableOperative = angular.copy(obj);
        $scope.tableParamsOperative.filter(obj);
        $scope.tableParamsOperative.reload();
    };


});

angular.module('wreport.app').directive('operativeRankingList', function () {
    return {
        restrict: 'A',
        controller: 'OperativeRankingListController',
        templateUrl: 'app/modules/projectRankingList/component/operativeRankingList.html'
    };
});