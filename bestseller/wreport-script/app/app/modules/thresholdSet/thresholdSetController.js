'use strict';

angular.module('wreport.app').controller('thresholdSetController', function ($scope, $state, $location, NgTableParams, CommonService) {


    $scope.onProjectClick = function () {

    };

    //  查看
    $scope.seeDetail = function(one){
        $state.thresholdSetOne = one;
        localStorage.setItem("thresholdSetOne",JSON.stringify($state.thresholdSetOne));
        $state.go("StoreThresholdSetDetail")
    };

    // 还原
    $scope.reductionDetail = function(project){
        if (project.route) {
            delete project["route"];
            project.route = "api/thresholds";
        }
        var aaa = {};
        aaa.remove = project.remove;
        aaa.route = project.route;
        aaa.projectId = project.id;
        $.Pop.confirms('确定还原？', function () {

            CommonService.remove(aaa).then(function (response) {
                $scope.tableParams.reload();

            }, function (response) {

            })
        });
    };

    // 回车搜素
    $scope.myKeyup = function (e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13) {
            $scope.tableParams.filter({"projectName": encodeURI($scope.searchText),"projectType":1});
        }
        if ($scope.searchText == "") {
            $scope.tableParams.filter({"projectName": encodeURI($scope.searchText),"projectType":1});
        }
    };

    // 跳转设置详情页
    $scope.goSetting = function () {
        if ($scope.chooseId.length == 0 || $scope.chooseId.length == undefined) {
            $.Pop.alerts($scope.constants.prompt_set_noSelect);

        } else {
            $state.thresholdSetIds = $scope.chooseId.join(",");
            localStorage.setItem("thresholdSetIds", JSON.stringify($state.thresholdSetIds));
            localStorage.setItem("thresholdSetProjectList", JSON.stringify($scope.chooseProjectList));
            $state.go('StoreThresholdSetting');
        }
    };

    // 多选框 -- project
    $scope.check_one = function (project, $event) {
        $scope.flagAL = false;
        // 清除选中有取消的
        for (var i = 0; i < $scope.chooseId.length; i++) {
            if (project.id == $scope.chooseId[i]) {
                $scope.chooseId.splice(i, 1);
                $scope.chooseProjectList.splice(i, 1);
            }
        }
        if ($($event.target).hasClass("check_set")) {
            $($event.target).removeClass("check_set");
            $(".check_all").removeClass("check_set");
        } else {
            $($event.target).addClass("check_set");
            $scope.chooseId.push(project.id);
            $scope.chooseProjectList.push(project);
        }
    };

    // 全选按钮
    $scope.check_all = function ($event) {
        $scope.flagAL = true;
        $scope.chooseId = [];
        $scope.chooseProjectList = [];
        if ($($event.target).hasClass("check_set")) {
            $(".check_one").removeClass("check_set");
            $($event.target).removeClass("check_set");
        } else {
            $(".check_one").addClass("check_set");
            $($event.target).addClass("check_set");
            for (var i = 0; i < $scope.chooseAll.length; i++) {
                $scope.chooseId.push($scope.chooseAll[i].id)
                $scope.chooseProjectList.push($scope.chooseAll[i])
            }
        }
    };

    // 阈值设置列表接口
    $scope.tableParams = new NgTableParams({
        page: 1,
        count: 10,
        filter: {
            projectType:1
        }
    }, {
        counts: [10, 20, 50],
        paginationMaxBlocks: 9,
        total: 0,
        getData: function ($defer, params) {

            // 查询客户围群table列表
            var queryObj = CommonService.buildQueryParams($scope.tableParams);
            CommonService.request('GetThresholdSetList', queryObj).then(function (response) {
                $scope.chooseId = [];
                $scope.chooseProjectList = [];
                $scope.chooseAll = [];
                if ($(".check_all").hasClass("check_set")) {
                    $(".check_one").removeClass("check_set");
                    $(".check_all").removeClass("check_set");
                }
                var total = response.headers()['x-total-count'];
                $scope.set_List = response.data;
                for (var i = 0; i < response.data.length; i++) {
                    $scope.chooseAll.push(response.data[i]);
                }

                params.total(total);
                $defer.resolve(response.data);
            });

        }
    });

    $scope.init = function () {
        $scope.constants = $state.constants;
        // $scope.currentProjectId = $state.projectVM.projectId;
        $scope.chooseId = [];
        $scope.chooseProjectList = [];
    };

    $scope.init();

    $scope.resize = function () {
        var window = appConfig.thisWindow;
        var winHg = $(window).height();
        var winWd = $(window).width();

        var table_width = (winWd - 180 - 55);
        $scope.table_width_1 = {'width': table_width / 9 + 'px'};
        $scope.table_width_2 = {'width': table_width / 9 + 'px'};
        $scope.table_width_3 = {'width': table_width / 9 + 'px'};
        $scope.table_width_4 = {'width': table_width / 9 + 'px'};
        $scope.table_width_5 = {'width': table_width / 9 + 'px'};
        $scope.table_width_6 = {'width': table_width / 9 + 'px'};
        $scope.table_width_7 = {'width': table_width / 9 + 'px'};
        $scope.table_width_8 = {'width': table_width / 9 + 'px'};
        $scope.table_width_9 = {'width': table_width / 9 + 'px'};

        $scope.table_max_height = {'max-height': winHg - 330 + "px"};
    };
    $scope.resize();

});