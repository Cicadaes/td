'use strict';

angular.module('wreport.app').controller('projectDetailController', function ($scope, $state, $location, NgTableParams, CommonService) {


    // 跳转回项目管理页面
    $scope.goProjectManagement = function () {
        $state.go("projectManagement")
    };


    $scope.init = function () {
        $scope.constants = $state.constants;
        if ($state.projectManagementId == undefined) {
            $scope.oneId = JSON.parse(localStorage.getItem("projectManagementId"));
        } else {
            $scope.oneId = $state.projectManagementId;
        }
        // 获取数据
        var queryobj = {
            projectId: $scope.oneId
        };
        CommonService.request('GetOneCustomProject', queryobj).then(function (response) {
            var data = response.data;
            $scope.projectOneData = data;
            if(response.data.projectChildrenNames != null){
                $scope.childList = response.data.projectChildrenNames.split(",");
            }
        });

    };

    $scope.init();
});