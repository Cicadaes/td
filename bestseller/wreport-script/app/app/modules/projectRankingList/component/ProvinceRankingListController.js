'use strict';

angular.module('wreport.app').controller('ProvinceRankingListController', function ($scope, $state, $location, CommonService, NgTableParams) {

    $scope.initProvince = function () {
        $scope.filterCountFlage = false;  // 过滤框标志
        $scope.filterBrandFlage = false;  // 品牌过滤框标志
        $scope.filterProvinceFlage = false;  // 省份过滤框标志
        $scope.filterCityFlage = false;  // 城市过滤框标志
        $scope.filterCityLevelFlage = false;  // 城市等级过滤框标志
        $scope.dropDownWapCityFlag = false; // 城市下拉框
        $scope.dropDownWapProvinceFlage = false; // 省份下拉框
        $scope.dropDownWapBrandFlage = true; // 品牌下拉框
        $scope.dropDownWapCityLevelFlag = false;  // 城市等级下拉框
        $scope.collectType = false;// 显示收藏标志
        $scope.setAddIndexFlag = false;  // 控制添加指标下拉框显示标志
        $scope.filterCountText = "按省份查看";
        $scope.filterCityText = "全部城市";
        $scope.filterProvinceText = "全部省份";
        $scope.filterBrandText = "全部品牌";
        $scope.filterCityLevelText = "全部等级";
        $scope.indexProjectType = 9;  //物理省份 9
        $state.weekMonthFlag = "day";
        $scope.searchTextProvince = ""; // 搜索条件
        $scope.sortType = "";
        $scope.sortSelect = "";
        $scope.indexListMap = {};

        $scope.favoriteFlag = 0;  // 显示收藏标志
        $scope.dateFlag = 0;  // 按天、月、周查看标志


        // 初始化日期控件的默认值
        var date = new Date();
        $scope.dateInTop = {
            tagDataTimeStart: date.getTime() - 86400000 * 30,
            tagDataTimeEnd: date.getTime() - 86400000
        };

        $scope.startStr = new Date($scope.dateInTop.tagDataTimeStart).Format('yyyy-MM-dd');
        $scope.endStr = new Date($scope.dateInTop.tagDataTimeEnd).Format('yyyy-MM-dd');

        // 过滤选择器列表
        $scope.filterListProvince = [
            {"name": "按省份查看", "type": "province"},
            {"name": "按城市查看", "type": "city"},
            {"name": "按店铺查看", "type": "store"}
        ];

        // 省份过滤器列表
        $scope.provinceList = [
            {"name": "辽宁省", "type": "1"},
            {"name": "河北省", "type": "2"},
            {"name": "河南省", "type": "3"},
            {"name": "黑龙江省", "type": "4"}
        ];

        $scope.cityLevelListInfo = [
            {"levelName": "一线城市", "type": "1"},
            {"levelName": "二线城市", "type": "2"},
            {"levelName": "三线城市", "type": "3"},
            {"levelName": "四线城市", "type": "4"},
            {"levelName": "其他", "type": "-1"}
        ];

        $scope.cityLevelList = angular.copy($scope.cityLevelListInfo);

        // 初始化查询条件  ---  原始查询条件
        $scope.globalVariableProvince = {
            projectType: $scope.indexProjectType,
            status: 1,
            startDate: $scope.startStr,
            endDate: $scope.endStr,
            joinFlag: $scope.favoriteFlag,
            rangeQueryFlag: $scope.dateFlag
        };
    };

    // excel导出
    $scope.exportReport = function(){
        var queryObj = angular.copy($scope.globalVariableProvince);
        queryObj["pageEnabled"] = false;
        if(queryObj.hasOwnProperty("status")){
            delete queryObj["status"]
        }
        CommonService.request('GetProjectRankingListExcel', queryObj).then(function (response) {
            document.location.href = "api/exports/getExportExcel/" + response.data.attachId;
        });
    };

    // 获取品牌下拉列表数据
    $scope.getSpinnerBrandList = function () {
        var queryobj = {
            pageEnabled: false,
            status: 1,
            projectType: 6
        };
        CommonService.request("GetSpinnerList", queryobj).then(function (response) {
            $scope.brandFilterList = response.data;
        })
    };

    // 获取城市下拉列表数据
    $scope.getSpinnerCityList = function (obj) {
        var queryobj = {
            pageEnabled: false,
            status: 1,
            projectType: 3
        };

        if (obj != undefined) {
            queryobj.province = obj;
        }

        CommonService.request("GetSpinnerList", queryobj).then(function (response) {
            $scope.cityList = response.data;
        })
    };

    // 获取省份下拉列表数据
    $scope.getSpinnerProviceList = function (obj) {
        var queryobj = {
            pageEnabled: false,
            status: 1,
            projectType: 9
        };
        if (obj != undefined) {
            queryobj.brand = obj;
        }
        CommonService.request("GetSpinnerList", queryobj).then(function (response) {
            $scope.provinceList = response.data;
        })
    };

    $scope.initProvince();
    $scope.getSpinnerBrandList();
    $scope.getSpinnerCityList();
    $scope.getSpinnerProviceList();

     // 跳转概览页面
     $scope.openProject2 = function (project, $event) {
        $event.stopPropagation();
        if (project.projectType == 1) {
            $state.go("operationOverview_store");
            $state.topBarScope.setEnvByProjectVM(project);
        }
    };

    // 过滤数据列表
    $scope.filterDataList = function (event, filter, type, one) {
        event.stopPropagation();
        var obj = {
            projectType: $scope.indexProjectType,
            status: 1,
            startDate: $scope.startStr,
            endDate: $scope.endStr,
            joinFlag: $scope.favoriteFlag,
            rangeQueryFlag: $scope.dateFlag
        };
        $scope.filterBrandFlage = false;  // 品牌过滤框标志
        $scope.filterProvinceFlage = false;  // 省份过滤框标志
        $scope.filterCityFlage = false;  // 城市过滤框标志
        $scope.filterCityLevelFlage = false;  // 城市等级过滤框标志
        if (type == "city") {
            $scope.filterCityText = one.projectName;
            obj["city"] = one.projectName;
            if ($scope.filterBrandText != "全部品牌") {
                obj["brand"] = $scope.filterBrandText;
            }
            if ($scope.filterProvinceText != "全部省份") {
                obj["province"] = $scope.filterProvinceText;
            }
            $scope.tableParamsProvince.filter(obj);
        } else if (type == "brand") {
            $scope.filterBrandText = one.projectName;
            $scope.filterCityText = "全部城市";
            $scope.filterProvinceText = "全部省份";
            $scope.filterCityLevelText = "全部等级";
            if ($scope.indexProjectType == 9) {
                obj["projectType"] = 10;  // 加了品牌还筛选之后显示品还省份
                $scope.indexProjectType = 10;
            } else if ($scope.indexProjectType == 3) {
                obj["projectType"] = 4;  // 加了品牌还筛选之后显示品牌城市
                $scope.indexProjectType = 4;
            }
            obj["brand"] = one.projectName;
            $scope.tableParamsProvince.filter(obj);
        } else if (type == "province") {
            $scope.filterProvinceText = one.projectName;
            $scope.filterCityText = "全部城市";
            $scope.filterCityLevelText = "全部等级";
            obj["province"] = one.projectName;
            if ($scope.filterBrandText != "全部品牌") {
                obj["brand"] = $scope.filterBrandText;
            }
            if ($scope.indexProjectType == 1) {
                $scope.getSpinnerCityList(one.projectName);
            } else {
                var queryobj = {
                    "province": one.projectName
                };
                CommonService.request("GetProvinceCityLevel", queryobj).then(function (response) {
                    $scope.cityLevelList = angular.copy(response.data);
                })
            }
            $scope.tableParamsProvince.filter(obj);
        } else if (type == "cityLevel") {
            if ($scope.filterBrandText != "全部品牌") {
                obj["brand"] = $scope.filterBrandText;
            }
            if ($scope.filterProvinceText != "全部省份") {
                obj["province"] = $scope.filterProvinceText;
            }

            $scope.filterCityLevelText = one.levelName;
            obj["cityLevel"] = one.type;
            $scope.tableParamsProvince.filter(obj);
        }
        $scope.globalVariableProvince = angular.copy(obj);
    };

    // 回车搜索
    $scope.myKeyUpProvince = function (e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13) {
            $scope.globalVariableProvince["q"] = encodeURI($scope.searchTextProvince);
            $scope.tableParamsProvince.filter($scope.globalVariableProvince);
        }
        if ($scope.searchTextProvince == "") {
            if ($scope.globalVariableProvince.hasOwnProperty("q")) {
                delete $scope.globalVariableProvince["q"];
            }
            $scope.tableParamsProvince.filter(obj);
        }
    };

    // 改变数据
    $scope.changeTypeDate = function (data) {
        $scope.indexListMap = {};
        for (var i = 0; i < data.length; i++) {
            $scope.indexListMap[data[i]] = true;
        }
        if($.isEmptyObject($scope.indexListMap)){
            $(".tab_css_1").removeClass("tab_css_2");
        }else{
            $(".tab_css_1").addClass("tab_css_2");
        } // true 表示对象为空
        setTimeout(function () {
            var width = $(".getWidth > thead").innerWidth();
            $(".getWidth ").parent().find(".ng-isolate-scope").css({"width": width});
        }, 100);
        $scope.setAddIndexFlag = false;
    };

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
        $scope.filterBrandFlage = false;  // 品牌过滤框标志
        $scope.filterProvinceFlage = false;  // 省份过滤框标志
        $scope.filterCityFlage = false;  // 城市过滤框标志
        $scope.filterCityLevelFlage = false;  // 城市等级过滤框标志
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
        if ($scope.collectType == true) {
            $scope.favoriteFlag = 1;
        } else {
            $scope.favoriteFlag = 0;
        }

        var obj = angular.copy($scope.globalVariableProvince);
        obj["joinFlag"] = $scope.favoriteFlag;
        $scope.globalVariableProvince = angular.copy(obj);
        $scope.tableParamsProvince.filter(obj);

    };

    // 过滤框控制显示隐藏
    $scope.filterShow = function (event, type) {
        event.stopPropagation();
        if (type == 'filterCount') {
            $scope.filterCountFlage = !$scope.filterCountFlage;
        } else if (type == 'filterBrand') {
            $scope.filterBrandFlage = !$scope.filterBrandFlage;
        } else if (type == 'filterProvince') {
            $scope.filterProvinceFlage = !$scope.filterProvinceFlage;
        } else if (type == 'filterCityLeve') {
            $scope.filterCityLevelFlage = !$scope.filterCityLevelFlage;
        } else if (type == 'filterCity') {
            $scope.filterCityFlage = !$scope.filterCityFlage;
        }
    };

    //  页置顶功能
    $scope.makeTop = function (project, $event) {
        $event.stopPropagation();
        // 请求置顶接口
        var queryobj = {
            projectId: project.projectId,
            type: 2,
            status: 1
        };
        CommonService.create('MakeTop', queryobj).then(function () {
            $scope.tableParamsProvince.reload();
        });
    };

    // 模拟排序
    $scope.sort_index = function (type) {
        if (type != $scope.sortType) {
            $scope.flag = false;
            $scope.sortType = type;
        }
        $scope.flag = !$scope.flag;
        var sortTypeUpDown = "desc";
        if ($scope.flag == true) {
            sortTypeUpDown = "desc";
            //$scope.sortSelect = type + "Down";
            $scope.sortSelect = type + "Up";
        } else {
            sortTypeUpDown = "asc";
            $scope.sortSelect = type + "Down";
            //$scope.sortSelect = type + "Up";
        }
        $scope.indexSort(type, sortTypeUpDown);
    };

    // 全部按钮过滤
    $scope.filterDataListAll = function (event, type) {
        event.stopPropagation();
        $scope.filterBrandFlage = false;  // 品牌过滤框标志
        $scope.filterLargeAreaFlage = false;  // 大区过滤框标志
        $scope.filterCityFlage = false;  // 城市过滤框标志
        $scope.filterProvinceFlage = false; // 省份过滤框标志
        $scope.filterCityLevelFlage = false;  // 城市等级过滤框标志
        var obj = {
            projectType: $scope.indexProjectType,
            status: 1,
            startDate: $scope.startStr,
            endDate: $scope.endStr,
            joinFlag: $scope.favoriteFlag,
            rangeQueryFlag: $scope.dateFlag
        };

        if (type == "brand") {
            $scope.filterCityText = "全部城市";
            $scope.filterProvinceText = "全部省份";
            $scope.filterBrandText = "全部品牌";
            $scope.filterCityLevelText = "全部等级";
            if ($scope.indexProjectType == 9 || $scope.indexProjectType == 10) {
                $scope.indexProjectType = 9;
                obj["projectType"] = 9;
            } else if ($scope.indexProjectType == 3 || $scope.indexProjectType == 4) {
                $scope.indexProjectType = 3;
                obj["projectType"] = 3;
            } else if ($scope.indexProjectType == 1) {
                $scope.indexProjectType = 1;
                obj["projectType"] = 1;
            }
            $scope.cityLevelList = angular.copy($scope.cityLevelListInfo);
        } else if (type == "province") {
            $scope.filterCityLevelText = "全部等级";
            $scope.filterProvinceText = "全部省份";
            $scope.filterCityText = "全部城市";
            if ($scope.filterBrandText != "全部品牌") {
                obj["brand"] = $scope.filterBrandText;
            }
            if ($scope.indexProjectType == 1) {
                $scope.getSpinnerCityList();
            }
            $scope.cityLevelList = angular.copy($scope.cityLevelListInfo);
        } else if (type == "city") {
            $scope.filterCityText = "全部城市";
            if ($scope.filterProvinceText != "全部省份") {
                obj["province"] = $scope.filterProvinceText;
            }
            if ($scope.filterBrandText != "全部品牌") {
                obj["brand"] = $scope.filterBrandText;
            }
        } else if (type == "cityLevel") {
            $scope.filterCityLevelText = "全部等级";
            if ($scope.filterProvinceText != "全部省份") {
                obj["province"] = $scope.filterProvinceText;
            }
            if ($scope.filterBrandText != "全部品牌") {
                obj["brand"] = $scope.filterBrandText;
            }
            $scope.cityLevelList = angular.copy($scope.cityLevelListInfo);
        }
        $scope.globalVariableProvince = angular.copy(obj);
        $scope.tableParamsProvince.filter(obj);

    };

    $scope.changeFilterCount = function (event, type, one) {
        event.stopPropagation();
        $scope.filterCountText = one.name;
        $scope.filterCountFlage = false;  // 过滤框标志
        $scope.filterBrandFlage = false;  // 品牌过滤框标志
        $scope.filterProvinceFlage = false;  // 省份过滤框标志
        $scope.filterCityFlage = false;  // 城市过滤框标志
        $scope.filterCityLevelFlage = false;  // 城市等级过滤框标志
        $scope.filterCityText = "全部城市";
        $scope.filterProvinceText = "全部省份";
        $scope.filterBrandText = "全部品牌";
        $scope.filterCityLevelText = "全部等级";
        $scope.changeFilterType = type;
        $scope.indexProjectType = 10;
        if ($scope.changeFilterType == "province") {
            $scope.dropDownWapCityFlag = false; // 城市下拉框
            $scope.dropDownWapProvinceFlage = false; // 省份下拉框
            $scope.dropDownWapBrandFlage = true; // 品牌下拉框
            $scope.dropDownWapCityLevelFlag = false; // 城市等级下拉框
            $scope.indexProjectType = 9; //物理省份 9
        } else if ($scope.changeFilterType == "city") {
            $scope.dropDownWapCityFlag = false; // 城市下拉框
            $scope.dropDownWapProvinceFlage = true; // 省份下拉框
            $scope.dropDownWapBrandFlage = true; // 品牌下拉框
            $scope.dropDownWapCityLevelFlag = true; // 城市等级下拉框
            $scope.indexProjectType = 3;   //没有加品牌的显示物理城市type=3
        } else if ($scope.changeFilterType == "store") {
            $scope.dropDownWapCityFlag = true; // 城市下拉框
            $scope.dropDownWapProvinceFlage = true; // 省份下拉框
            $scope.dropDownWapBrandFlage = true; // 品牌下拉框
            $scope.dropDownWapCityLevelFlag = false; // 城市等级下拉框
            $scope.indexProjectType = 1;
        }
        $scope.cityLevelList = angular.copy($scope.cityLevelListInfo);
        var obj = {
            projectType: $scope.indexProjectType,
            status: 1,
            startDate: $scope.startStr,
            endDate: $scope.endStr,
            joinFlag: $scope.favoriteFlag,
            rangeQueryFlag: $scope.dateFlag
        };
        $scope.globalVariableProvince = angular.copy(obj);
        $scope.tableParamsProvince.filter(obj);

        $scope.getSpinnerBrandList();
        $scope.getSpinnerCityList();
        $scope.getSpinnerProviceList();
    };

    $scope.indexSort = function (name, type) {
        if (name == 'activeUsers') {
            $scope.paramsProvince.$params['sorting'] = {"activeUsers": type};
        } else if (name == 'activeUsersChainRate') {
            $scope.paramsProvince.$params['sorting'] = {"activeUsersChainRate": type};
        } else if (name == 'frontUsers') {
            $scope.paramsProvince.$params['sorting'] = {"frontUsers": type};
        } else if (name == 'frontUsersChainRate') {
            $scope.paramsProvince.$params['sorting'] = {"frontUsersChainRate": type};
        } else if (name == 'stayUsers') {
            $scope.paramsProvince.$params['sorting'] = {"stayUsers": type};
        } else if (name == 'stayUsersChainRate') {
            $scope.paramsProvince.$params['sorting'] = {"stayUsersChainRate": type};
        } else if (name == 'jumpUsers') {
            $scope.paramsProvince.$params['sorting'] = {"jumpUsers": type};
        } else if (name == 'jumpUsersChainRate') {
            $scope.paramsProvince.$params['sorting'] = {"jumpUsersChainRate": type};
        } else if (name == 'incomingMember') {
            $scope.paramsProvince.$params['sorting'] = {"incomingMember": type};
        } else if (name == 'incomingMemberChainRate') {
            $scope.paramsProvince.$params['sorting'] = {"incomingMemberChainRate": type};
        } else if (name == 'potentialCount') {
            $scope.paramsProvince.$params['sorting'] = {"potentialCount": type};
        } else if (name == 'potentialCountChainRate') {
            $scope.paramsProvince.$params['sorting'] = {"potentialCountChainRate": type};
        } else if (name == 'memberCount') {
            $scope.paramsProvince.$params['sorting'] = {"memberCount": type};
        } else if (name == 'memberCountChainRate') {
            $scope.paramsProvince.$params['sorting'] = {"memberCountChainRate": type};
        } else if (name == 'activeUserNewRate') {
            $scope.paramsProvince.$params['sorting'] = {"activeUserNewRate": type};
        } else if (name == 'activeUserNewRateChainRate') {
            $scope.paramsProvince.$params['sorting'] = {"activeUserNewRateChainRate": type};
        } else if (name == 'activeUserOldRate') {
            $scope.paramsProvince.$params['sorting'] = {"activeUserOldRate": type};
        } else if (name == 'activeUserOldRateChainRate') {
            $scope.paramsProvince.$params['sorting'] = {"activeUserOldRateChainRate": type};
        } else if (name == 'highRate') {
            $scope.paramsProvince.$params['sorting'] = {"highRate": type};
        } else if (name == 'highRateChainRate') {
            $scope.paramsProvince.$params['sorting'] = {"highRateChainRate": type};
        } else if (name == 'middleRate') {
            $scope.paramsProvince.$params['sorting'] = {"middleRate": type};
        } else if (name == 'middleRateChainRate') {
            $scope.paramsProvince.$params['sorting'] = {"middleRateChainRate": type};
        } else if (name == 'lowRate') {
            $scope.paramsProvince.$params['sorting'] = {"lowRate": type};
        } else if (name == 'lowRateChainRate') {
            $scope.paramsProvince.$params['sorting'] = {"lowRateChainRate": type};
        } else if (name == 'sleepRate') {
            $scope.paramsProvince.$params['sorting'] = {"sleepRate": type};
        } else if (name == 'sleepRateChainRate') {
            $scope.paramsProvince.$params['sorting'] = {"sleepRateChainRate": type};
        } else if (name == 'stayTime') {
            $scope.paramsProvince.$params['sorting'] = {"stayTime": type};
        } else if (name == 'stayTimeChainRate') {
            $scope.paramsProvince.$params['sorting'] = {"stayTimeChainRate": type};
        } else if (name == 'enterRate') {
            $scope.paramsProvince.$params['sorting'] = {"enterRate": type};
        } else if (name == 'enterRateChainRate') {
            $scope.paramsProvince.$params['sorting'] = {"enterRateChainRate": type};
        } else if (name == 'stayRate') {
            $scope.paramsProvince.$params['sorting'] = {"stayRate": type};
        } else if (name == 'stayRateChainRate') {
            $scope.paramsProvince.$params['sorting'] = {"stayRateChainRate": type};
        } else if (name == 'jumpRate') {
            $scope.paramsProvince.$params['sorting'] = {"jumpRate": type};
        } else if (name == 'jumpRateChainRate') {
            $scope.paramsProvince.$params['sorting'] = {"jumpRateChainRate": type};
        } else if (name == 'salesAmount') {
            $scope.paramsProvince.$params['sorting'] = {"salesAmount": type};
        } else if (name == 'salesAmountChainRate') {
            $scope.paramsProvince.$params['sorting'] = {"salesAmountChainRate": type};
        } else if (name == 'orderCount') {
            $scope.paramsProvince.$params['sorting'] = {"orderCount": type};
        } else if (name == 'orderCountChainRate') {
            $scope.paramsProvince.$params['sorting'] = {"orderCountChainRate": type};
        } else if (name == 'orderAveragePrice') {
            $scope.paramsProvince.$params['sorting'] = {"orderAveragePrice": type};
        } else if (name == 'orderAveragePriceChainRate') {
            $scope.paramsProvince.$params['sorting'] = {"orderAveragePriceChainRate": type};
        } else if (name == 'singularPrice') {
            $scope.paramsProvince.$params['sorting'] = {"singularPrice": type};
        } else if (name == 'singularPriceChainRate') {
            $scope.paramsProvince.$params['sorting'] = {"singularPriceChainRate": type};
        }
    };

    // 获取列表数据
    // 查询项目详情table
    $scope.tableParamsProvince = new NgTableParams(
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
                joinFlag: $scope.favoriteFlag,
                rangeQueryFlag: $scope.dateFlag
            }
        }, {
            counts: [10, 20, 50],
            paginationMaxBlocks: 9,
            total: 0,
            getData: function ($defer, params) {
                //debugger
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
                $scope.paramsProvince = params;
                $scope.deferProvince = $defer;
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

    $state.filterProvinceList = function (start, end, rangeQuery) {
        var obj = angular.copy($scope.globalVariableProvince);
        $scope.startStr = start;
        $scope.endStr = end;
        if ($state.weekMonthFlag == "day") {
            obj['startDate'] = start;
            obj['endDate'] = end;
        } else {
            obj['startDate'] = start;
            obj['endDate'] = end;
        }
        obj["rangeQueryFlag"] = rangeQuery;
        $scope.dateFlag = rangeQuery;
        $scope.globalVariableProvince = angular.copy(obj);
        $scope.tableParamsProvince.filter(obj);
        $scope.tableParamsProvince.reload();
    };

});

angular.module('wreport.app').directive('provinceRankingList', function () {
    return {
        restrict: 'A',
        controller: 'ProvinceRankingListController',
        templateUrl: 'app/modules/projectRankingList/component/provinceRankingList.html'
    };
});