'use strict';

angular.module('wreport.app').controller('MechanismRankingListController', function ($scope, $state, $location, CommonService, NgTableParams) {

    $scope.initMechanism = function () {
        $scope.filterCountFlage = false;  // 过滤框标志
        $scope.filterBrandFlage = false;  // 品牌过滤框标志
        $scope.filterLargeAreaFlage = false;  // 大区过滤框标志
        $scope.filterCityFlage = false;  // 城市过滤框标志
        $scope.dropDownWapCityFlag = true; // 城市下拉框
        $scope.dropDownWapLargeAreaFlage = true; // 大区下拉框
        $scope.dropDownWapBrandFlage = true; // 品牌下拉框
        $scope.collectType = false;// 显示收藏标志
        $scope.setAddIndexFlag = false;  // 控制添加指标下拉框显示标志
        $scope.filterCountText = "按店铺查看";
        $scope.filterCityText = "全部城市";
        $scope.filterLargeAreaText = "全部大区";
        $scope.filterBrandText = "全部品牌";
        $scope.searchTextMechanism = ""; // 搜索条件
        $state.weekMonthFlag = "day";
        $scope.sortType = "";
        $scope.sortSelect = "";
        $scope.indexListMap = {};
        $scope.favoriteFlag = 0;  // 显示收藏标志
        $scope.dateFlag = 0;  // 按天、月、周查看标志
        $scope.indexProjectType = 1; // 按照店铺查看

        // 过滤选择器列表
        $scope.filterList = [
            {"name": "按店铺查看", "type": "store"}
        ];

        $scope.groupSign = false;

        if ($state.group_sign != 'N') {
            $scope.groupSign = true;
            $scope.filterList = [
                {"name": "按店铺查看", "type": "store"},
                {"name": "按城市查看", "type": "city"},
                {"name": "按大区查看", "type": "largeArea"},
                {"name": "按品牌查看", "type": "brand"},
                {"name": "按自定义查看", "type": "custom"}
            ];


        }

        // 初始化日期控件的默认值
        var date = new Date();
        $scope.dateInTop = {
            tagDataTimeStart: date.getTime() - 86400000 * 30,
            tagDataTimeEnd: date.getTime() - 86400000
        };

        $scope.startStr = new Date($scope.dateInTop.tagDataTimeStart).Format('yyyy-MM-dd');
        $scope.endStr = new Date($scope.dateInTop.tagDataTimeEnd).Format('yyyy-MM-dd');

        // 初始化查询条件  ---  原始查询条件
        $scope.globalVariable = {
            projectType: $scope.indexProjectType,
            status: 1,
            startDate: $scope.startStr,
            endDate: $scope.endStr,
            joinFlag: $scope.favoriteFlag,
            rangeQueryFlag: $scope.dateFlag
        };
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

    // excel导出
    $scope.exportReport = function () {
        var queryObj = angular.copy($scope.globalVariable);
        queryObj["pageEnabled"] = false;
        if (queryObj.hasOwnProperty("status")) {
            delete queryObj["status"]
        }
        CommonService.request('GetProjectRankingListExcel', queryObj).then(function (response) {
            document.location.href = "api/exports/getExportExcel/" + response.data.attachId;
        });
    };

    // 获取品牌下拉列表数据
    $scope.getSpinnerLargeAreaList = function (obj) {
        var brandName = "";
        var queryobj = {
            pageEnabled: false,
            status: 1,
            projectType: 5
        };
        if (obj != undefined) {
            brandName = obj;
            queryobj.brand = brandName;
        }

        CommonService.request("GetSpinnerList", queryobj).then(function (response) {
            $scope.largeAreaFilterList = response.data;
        })
    };

    // 获取城市下拉列表数据
    $scope.getSpinnerCityList = function (type, obj) {
        var queryobj = {
            pageEnabled: false,
            status: 1,
            projectType: 11  // 逻辑城市
        };

        if (type == "lagerArea") {
            queryobj.region = obj;
            if ($scope.filterBrandText != "全部品牌") {
                queryobj.brand = $scope.filterBrandText;
            }
        } else if (type == "brand") {
            queryobj.brand = obj;
        }

        CommonService.request("GetSpinnerList", queryobj).then(function (response) {
            $scope.cityList = response.data;
        })
    };

    $scope.initMechanism();
    $scope.getSpinnerBrandList();
    $scope.getSpinnerLargeAreaList();
    $scope.getSpinnerCityList();

    // 跳转概览页面
    $scope.openProject = function (project, $event) {
        $state.topBarScope.setEnvByProjectVM(project);
        $event.stopPropagation();
        if (project.projectType == 1) {
            $state.go("operationOverview_store");
        } else if (project.projectType == 11) {
            $state.go("operationOverview_city");
        } else if (project.projectType == 5) {
            $state.go("operationOverview_region");
        } else if (project.projectType == 6) {
            $state.go("operationOverview_brand");
        }

    };

    // 筛选框过滤数据列表
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
        $scope.filterLargeAreaFlage = false;  // 大区过滤框标志
        $scope.filterCityFlage = false;  // 城市过滤框标志
        if (type == "city") {
            $scope.filterCityText = one.projectName;
            obj["logicalCity"] = one.projectName;
            if ($scope.filterBrandText != "全部品牌") {
                obj["brand"] = $scope.filterBrandText;
            }
            if ($scope.filterLargeAreaText != "全部大区") {
                obj["region"] = $scope.filterLargeAreaText;
            }
            $scope.tableParamsMechanishm.filter(obj);
        } else if (type == "brand") {
            $scope.filterBrandText = one.projectName;
            $scope.filterCityText = "全部城市";
            $scope.filterLargeAreaText = "全部大区";
            obj["brand"] = one.projectName;
            $scope.tableParamsMechanishm.filter(obj);
            if ($scope.indexProjectType == 1) {
                $scope.getSpinnerCityList("brand", one.projectName);
                $scope.getSpinnerLargeAreaList(one.projectName);
            } else if ($scope.indexProjectType == 11) {
                $scope.getSpinnerLargeAreaList(one.projectName);
            }

        } else if (type == "lagerArea") {
            $scope.filterLargeAreaText = one.projectName;
            $scope.filterCityText = "全部城市";
            obj["region"] = one.projectName;
            if ($scope.filterBrandText != "全部品牌") {
                obj["brand"] = $scope.filterBrandText;
            }
            $scope.tableParamsMechanishm.filter(obj);
            if ($scope.indexProjectType == 1) {
                $scope.getSpinnerCityList("lagerArea", one.projectName);
            }
        }

        $scope.globalVariable = angular.copy(obj);
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
            $scope.sortSelect = type + "Up";
            //$scope.sortSelect = type + "Down";
        } else {
            sortTypeUpDown = "asc";
            $scope.sortSelect = type + "Down";
            // $scope.sortSelect = type + "Up";
        }
        $scope.indexSort(type, sortTypeUpDown);
    };

    // 全部按钮过滤
    $scope.filterDataListAll = function (event, type) {
        event.stopPropagation();
        $scope.filterBrandFlage = false;  // 品牌过滤框标志
        $scope.filterLargeAreaFlage = false;  // 大区过滤框标志
        $scope.filterCityFlage = false;  // 城市过滤框标志
        var obj = {
            projectType: $scope.indexProjectType,
            status: 1,
            startDate: $scope.startStr,
            endDate: $scope.endStr,
            joinFlag: $scope.favoriteFlag,
            rangeQueryFlag: $scope.dateFlag
        };

        if (type == "brand") {
            $scope.filterBrandText = "全部品牌";
            if ($scope.indexProjectType == 1) {
                $scope.filterCityText = "全部城市";
                $scope.filterLargeAreaText = "全部大区";
                $scope.getSpinnerLargeAreaList();
                $scope.getSpinnerCityList();
            } else if ($scope.indexProjectType == 11) {
                $scope.filterLargeAreaText = "全部大区";
                $scope.getSpinnerLargeAreaList();
            }
        } else if (type == "lagerArea") {
            $scope.filterCityText = "全部城市";
            $scope.filterLargeAreaText = "全部大区";
            if ($scope.filterBrandText != "全部品牌") {
                obj["brand"] = $scope.filterBrandText;
                $scope.getSpinnerCityList("brand", $scope.filterBrandText);
            }
        } else if (type == "city") {
            $scope.filterCityText = "全部城市";
            if ($scope.filterBrandText != "全部品牌") {
                obj["brand"] = $scope.filterBrandText;
            }

            if ($scope.filterLargeAreaText != "全部大区") {
                obj["region"] = $scope.filterLargeAreaText;
                $scope.getSpinnerCityList("lagerArea", $scope.filterLargeAreaText);
            } else {
                if ($scope.filterBrandText != "全部品牌") {
                    obj["brand"] = $scope.filterBrandText;
                    $scope.getSpinnerCityList("brand", $scope.filterBrandText);
                }
            }
        }

        $scope.tableParamsMechanishm.filter(obj);
        $scope.globalVariable = angular.copy(obj);
    };

    // 改变数据
    $scope.changeTypeDate = function (data) {
        $scope.indexListMap = {};
        for (var i = 0; i < data.length; i++) {
            $scope.indexListMap[data[i]] = true;
        }
        if ($.isEmptyObject($scope.indexListMap)) {
            $(".tab_css_1").removeClass("tab_css_2");
        } else {
            $(".tab_css_1").addClass("tab_css_2");
        } // true 表示对象为空
        setTimeout(function () {
            var width = $(".table-projectRanking").innerWidth();
            $(".table-projectRanking").parent().find(".ng-isolate-scope").css({"width": width});
        }, 100);
        $scope.setAddIndexFlag = false;
    };

    // 添加指标弹框
    $scope.setAddIndexHide = function () {
        $scope.setAddIndexFlag = false;
    };

    // 控制添加指标组建是否显示
    $scope.setAddIndexShow = function () {
        $scope.setAddIndexFlag = !$scope.setAddIndexFlag;
    };

    // 回车搜索
    $scope.myKeyUpMechanism = function (e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13) {
            $scope.globalVariable["q"] = encodeURI($scope.searchTextMechanism);
            $scope.tableParamsMechanishm.filter($scope.globalVariable);
        }
        if ($scope.searchTextMechanism == "") {
            if ($scope.globalVariable.hasOwnProperty("q")) {
                delete $scope.globalVariable["q"];
            }
            $scope.tableParamsMechanishm.filter($scope.globalVariable);
        }
    };

    var hideFunc = function (e) {
        e.stopPropagation();
        $scope.filterCountFlage = false;  // 过滤框标志
        $scope.filterBrandFlage = false;  // 品牌过滤框标志
        $scope.filterLargeAreaFlage = false;  // 大区过滤框标志
        $scope.filterCityFlage = false;  // 城市过滤框标志
        // CommonService.refreshAngular($scope);
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
        var obj = angular.copy($scope.globalVariable);
        obj["joinFlag"] = $scope.favoriteFlag;
        $scope.globalVariable = angular.copy(obj);
        $scope.tableParamsMechanishm.filter(obj);
    };
    // 过滤框控制显示隐藏
    $scope.filterShow = function (event, type) {
        event.stopPropagation();
        if ($scope.groupSign == false && type == 'filterCount'){
            return;
        }

        if (type == 'filterCount') {
            $scope.filterCountFlage = !$scope.filterCountFlage;
        } else if (type == 'filterBrand') {
            $scope.filterBrandFlage = !$scope.filterBrandFlage;
        } else if (type == 'filterLargeArea') {
            $scope.filterLargeAreaFlage = !$scope.filterLargeAreaFlage;
        } else if (type == 'filterCity') {
            $scope.filterCityFlage = !$scope.filterCityFlage;
        }
    };

    $scope.changeFilterCount = function (event, type, one) {
        event.stopPropagation();
        $scope.filterCountText = one.name;
        $scope.filterCountFlage = false;  // 过滤框标志
        $scope.filterBrandFlage = false;  // 品牌过滤框标志
        $scope.filterLargeAreaFlage = false;  // 大区过滤框标志
        $scope.filterCityFlage = false;  // 城市过滤框标志
        $scope.filterCityText = "全部城市";
        $scope.filterLargeAreaText = "全部大区";
        $scope.filterBrandText = "全部品牌";
        $scope.changeFilterType = type;
        $scope.indexProjectType = 1;
        if ($scope.changeFilterType == "store" || $scope.changeFilterType == "all") {
            $scope.dropDownWapCityFlag = true; // 城市下拉框
            $scope.dropDownWapLargeAreaFlage = true; // 大区下拉框
            $scope.dropDownWapBrandFlage = true; // 品牌下拉框
        } else if ($scope.changeFilterType == "city") {
            $scope.dropDownWapCityFlag = false; // 城市下拉框
            $scope.dropDownWapLargeAreaFlage = true; // 大区下拉框
            $scope.dropDownWapBrandFlage = true; // 品牌下拉框
            $scope.indexProjectType = 11; // 取逻辑城市
        } else if ($scope.changeFilterType == "largeArea") {
            $scope.dropDownWapCityFlag = false; // 城市下拉框
            $scope.dropDownWapLargeAreaFlage = false; // 大区下拉框
            $scope.dropDownWapBrandFlage = true; // 品牌下拉框
            $scope.indexProjectType = 5;
        } else if ($scope.changeFilterType == "custom" || $scope.changeFilterType == "brand") {
            $scope.dropDownWapCityFlag = false; // 城市下拉框
            $scope.dropDownWapLargeAreaFlage = false; // 大区下拉框
            $scope.dropDownWapBrandFlage = false; // 品牌下拉框
        }

        if ($scope.changeFilterType == "store") {
            $scope.indexProjectType = 1;
        } else if ($scope.changeFilterType == "all") {
            $scope.indexProjectType = "";
        }
        if ($scope.changeFilterType == "custom") {
            $scope.indexProjectType = 2;
        } else if ($scope.changeFilterType == "brand") {
            $scope.indexProjectType = 6;
        }

        var obj = {
            projectType: $scope.indexProjectType,
            status: 1,
            startDate: $scope.startStr,
            endDate: $scope.endStr,
            joinFlag: $scope.favoriteFlag,
            rangeQueryFlag: $scope.dateFlag
        };

        $scope.globalVariable = angular.copy(obj);
        $scope.tableParamsMechanishm.filter(obj);

        $scope.getSpinnerBrandList();
        $scope.getSpinnerLargeAreaList();
        $scope.getSpinnerCityList();
    };

    // 排序功能模拟
    $scope.indexSort = function (name, type) {
        if (name == 'activeUsers') {
            $scope.paramsMechanishm.$params['sorting'] = {"activeUsers": type};
        } else if (name == 'activeUsersChainRate') {
            $scope.paramsMechanishm.$params['sorting'] = {"activeUsersChainRate": type};
        } else if (name == 'frontUsers') {
            $scope.paramsMechanishm.$params['sorting'] = {"frontUsers": type};
        } else if (name == 'frontUsersChainRate') {
            $scope.paramsMechanishm.$params['sorting'] = {"frontUsersChainRate": type};
        } else if (name == 'stayUsers') {
            $scope.paramsMechanishm.$params['sorting'] = {"stayUsers": type};
        } else if (name == 'stayUsersChainRate') {
            $scope.paramsMechanishm.$params['sorting'] = {"stayUsersChainRate": type};
        } else if (name == 'jumpUsers') {
            $scope.paramsMechanishm.$params['sorting'] = {"jumpUsers": type};
        } else if (name == 'jumpUsersChainRate') {
            $scope.paramsMechanishm.$params['sorting'] = {"jumpUsersChainRate": type};
        } else if (name == 'memberCount') {
            $scope.paramsMechanishm.$params['sorting'] = {"memberCount": type};
        } else if (name == 'memberCountChainRate') {
            $scope.paramsMechanishm.$params['sorting'] = {"memberCountChainRate": type};
        } else if (name == 'potentialCount') {
            $scope.paramsMechanishm.$params['sorting'] = {"potentialCount": type};
        } else if (name == 'potentialCountChainRate') {
            $scope.paramsMechanishm.$params['sorting'] = {"potentialCountChainRate": type};
        } else if (name == 'memberCount') {
            $scope.paramsMechanishm.$params['sorting'] = {"memberCount": type};
        } else if (name == 'memberCountChainRate') {
            $scope.paramsMechanishm.$params['sorting'] = {"memberCountChainRate": type};
        } else if (name == 'activeUserNewRate') {
            $scope.paramsMechanishm.$params['sorting'] = {"activeUserNewRate": type};
        } else if (name == 'activeUserNewRateChainRate') {
            $scope.paramsMechanishm.$params['sorting'] = {"activeUserNewRateChainRate": type};
        } else if (name == 'activeUserOldRate') {
            $scope.paramsMechanishm.$params['sorting'] = {"activeUserOldRate": type};
        } else if (name == 'activeUserOldRateChainRate') {
            $scope.paramsMechanishm.$params['sorting'] = {"activeUserOldRateChainRate": type};
        } else if (name == 'highRate') {
            $scope.paramsMechanishm.$params['sorting'] = {"highRate": type};
        } else if (name == 'highRateChainRate') {
            $scope.paramsMechanishm.$params['sorting'] = {"highRateChainRate": type};
        } else if (name == 'middleRate') {
            $scope.paramsMechanishm.$params['sorting'] = {"middleRate": type};
        } else if (name == 'middleRateChainRate') {
            $scope.params.$params['sorting'] = {"middleRateChainRate": type};
        } else if (name == 'lowRate') {
            $scope.paramsMechanishm.$params['sorting'] = {"lowRate": type};
        } else if (name == 'lowRateChainRate') {
            $scope.paramsMechanishm.$params['sorting'] = {"lowRateChainRate": type};
        } else if (name == 'sleepRate') {
            $scope.paramsMechanishm.$params['sorting'] = {"sleepRate": type};
        } else if (name == 'sleepRateChainRate') {
            $scope.paramsMechanishm.$params['sorting'] = {"sleepRateChainRate": type};
        } else if (name == 'stayDurationPerTime') {
            $scope.paramsMechanishm.$params['sorting'] = {"stayDurationPerTime": type};
        } else if (name == 'stayDurationPerTimeChainRate') {
            $scope.paramsMechanishm.$params['sorting'] = {"stayDurationPerTimeChainRate": type};
        } else if (name == 'enterRate') {
            $scope.paramsMechanishm.$params['sorting'] = {"enterRate": type};
        } else if (name == 'enterRateChainRate') {
            $scope.paramsMechanishm.$params['sorting'] = {"enterRateChainRate": type};
        } else if (name == 'stayRate') {
            $scope.paramsMechanishm.$params['sorting'] = {"stayRate": type};
        } else if (name == 'stayRateChainRate') {
            $scope.paramsMechanishm.$params['sorting'] = {"stayRateChainRate": type};
        } else if (name == 'jumpRate') {
            $scope.paramsMechanishm.$params['sorting'] = {"jumpRate": type};
        } else if (name == 'jumpRateChainRate') {
            $scope.paramsMechanishm.$params['sorting'] = {"jumpRateChainRate": type};
        } else if (name == 'salesAmount') {
            $scope.paramsMechanishm.$params['sorting'] = {"salesAmount": type};
        } else if (name == 'salesAmountChainRate') {
            $scope.paramsMechanishm.$params['sorting'] = {"salesAmountChainRate": type};
        } else if (name == 'orderCount') {
            $scope.paramsMechanishm.$params['sorting'] = {"orderCount": type};
        } else if (name == 'orderCountChainRate') {
            $scope.paramsMechanishm.$params['sorting'] = {"orderCountChainRate": type};
        } else if (name == 'orderAveragePrice') {
            $scope.paramsMechanishm.$params['sorting'] = {"orderAveragePrice": type};
        } else if (name == 'orderAveragePriceChainRate') {
            $scope.paramsMechanishm.$params['sorting'] = {"orderAveragePriceChainRate": type};
        } else if (name == 'singularPrice') {
            $scope.paramsMechanishm.$params['sorting'] = {"singularPrice": type};
        } else if (name == 'singularPriceChainRate') {
            $scope.paramsMechanishm.$params['sorting'] = {"singularPriceChainRate": type};
        }
    };

    // 获取列表数据
    // 查询项目详情table
    $scope.tableParamsMechanishm = new NgTableParams(
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
                $scope.paramsMechanishm = params;
                $scope.deferMechanishm = $defer;
                var queryobj = CommonService.buildQueryParams(params);
                CommonService.request("GetMechanismRankingList", queryobj).then(function (response) {
                    var total = response.headers()['x-total-count'];
                    $scope.detail_List = response.data;
                    params.total(total);
                    $defer.resolve(response.data);
                    setTimeout(function () {
                        var width = $(".table-projectRanking").innerWidth();
                        $(".table-projectRanking").parent().find(".ng-isolate-scope").css({"width": width});
                    }, 100);
                })
            }
        }
    );

    $state.filterMechanismList = function (start, end, rangeQuery) {
        var obj = angular.copy($scope.globalVariable);
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
        $scope.globalVariable = angular.copy(obj);
        $scope.tableParamsMechanishm.filter(obj);
        $scope.tableParamsMechanishm.reload();
    };

    $scope.resize = function () {
        var window = appConfig.thisWindow;
        var winHg = $(window).height();
        $scope.table_max_height = {'max-height': winHg - 330 + "px"};
    };
    $scope.resize();

});

angular.module('wreport.app').directive('mechanismRankingList', function () {
    return {
        restrict: 'A',
        controller: 'MechanismRankingListController',
        templateUrl: 'app/modules/projectRankingList/component/mechanismRankingList.html'
    };
});
