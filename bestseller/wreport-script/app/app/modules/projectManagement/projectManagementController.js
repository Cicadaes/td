'use strict';

angular.module('wreport.app').controller('projectManagementController', function ($scope, $state, $location, NgTableParams, CommonService) {


    $scope.onProjectClick = function () {

    };

    // 下载Table数据
    $scope.exportReport = function () {
         var queryObj = {
             status: 1,
             projectType: $scope.projectType
         };
         CommonService.request('GetProjectListExcel', queryObj).then(function (response) {
            document.location.href = "api/exports/getExportExcel/" + response.data.attachId;
         });
    };

    // Tab切换函数
    $scope.changTab = function (type) {
        $scope.tabType = type;
        $state.tabType = $scope.tabType;
        var tabType = 1;
        if($scope.tabType == "barnd"){
            tabType = 6;
        }else if($scope.tabType == "area"){
            tabType = 5;
        }else if($scope.tabType == "city"){
            tabType = 11;
        }else if($scope.tabType == "store"){
            tabType = 1;
        }else if($scope.tabType == "custom"){
            tabType = 2;
        }
        $scope.searchText = "";
        $scope.projectType = tabType;
        $scope.tableParamsSet.filter({
            "projectType": tabType,
             status: 1
        })
    };


    // 回车搜索
    $scope.myKeyUp = function (e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13) {
            $scope.tableParamsSet.filter({
                "projectType": $scope.projectType,
                status: 1,
                "q":encodeURI($scope.searchText)
            })
        }
        if ($scope.searchText == "") {
            $scope.tableParamsSet.filter({
                "projectType": $scope.projectType,
                 status: 1
            })
        }
    };

    // 添加项目
    $scope.addProject = function () {
        $state.customUpdateId = "";
        localStorage.removeItem("customUpdateOne");
        $state.go("projectNew");
    };

    // 查看某个项目
    $scope.seeOne = function (one, $event) {
        $event.stopPropagation();
        $state.projectManagementId = one.id;
        localStorage.setItem("projectManagementId", JSON.stringify($state.projectManagementId));
        $state.go("projectDetail")
    };

    // 编辑自定义项目
    $scope.updateOne = function (one, $event) {
        $event.stopPropagation();
        $state.customUpdateId = one;
        localStorage.setItem("customUpdateOne",JSON.stringify(one));
        $state.go("projectNew")
    };

    // 删除某个项目
    $scope.removeOne = function (one, $event) {
        $event.stopPropagation();
        if (one.route == 'api/projects/shopListByCondition') {
             delete one["route"];
             one.route = "/api/projects";
         }
         $.Pop.confirms($scope.constants.prompt_remove + ':' + one.projectName + '？', function () {
             CommonService.remove(one).then(function (response) {
                 $scope.tableParamsSet.reload();
             })
         });
    };


    $scope.init = function () {
        $scope.constants = $state.constants;
        $scope.searchText = "";
        var tabType = 6;
        if ($state.tabType == undefined || $state.tabType == "") {
            $scope.tabType = "barnd";  // tab切换标志
        } else {
            $scope.tabType = $state.tabType;  // tab切换标志
            if($scope.tabType == "barnd"){
                tabType = 6;
            }else if($scope.tabType == "area"){
                tabType = 5;
            }else if($scope.tabType == "city"){
                tabType = 11;
            }else if($scope.tabType == "store"){
                tabType = 1;
            }else if($scope.tabType == "custom"){
                tabType = 2;
            }

        }
        $scope.projectType = tabType;

        // 请求批量设置项目列表接口
        $scope.tableParamsSet = new NgTableParams(
            {
                page: 1,
                count: 10,
                sort: {
                    name: 'asc'
                },
                filter: {
                    status: 1,
                    projectType: tabType
                }
            }, {
                counts: [10, 20, 50],
                paginationMaxBlocks: 9,
                total: 0,
                getData: function ($defer, params) {
                    var queryobj = CommonService.buildQueryParams(params);
                    CommonService.request('GetProjectManagementList', queryobj).then(function (response) {
                        $scope.chooseAll = [];
                        var total = response.headers()['x-total-count'];
                        $scope.set_List = response.data;
                        params.total(total);
                        $defer.resolve(response.data);
                    })
                }
            }
        );
    };

    $scope.init();

    $scope.resize = function () {
        var window = appConfig.thisWindow;
        var winHg = $(window).height();
        var winWd = $(window).width();

        var table_width = (winWd - 180);
        $scope.table_width_1 = {'width': table_width / 6 + 'px'};
        $scope.table_width_2 = {'width': table_width / 6 + 'px'};
        $scope.table_width_3 = {'width': table_width / 6 + 'px'};
        $scope.table_width_4 = {'width': table_width / 6 + 'px'};
        $scope.table_width_5 = {'width': table_width / 6 + 'px'};
        $scope.table_width_6 = {'width': table_width / 6 + 'px'};

        $scope.table_max_height = {'max-height': winHg - 330 + "px"};
    };
    $scope.resize();
});