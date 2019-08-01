'use strict';

angular.module('wreport.app').controller('storeThresholdSetDetailController', function ($scope, $state, $location, NgTableParams, CommonService) {
    $scope.constants = $state.constants;
    $scope.goThresholdSet = function () {
        $state.go('thresholdSet');
    };
    if ($state.thresholdSetOne == undefined) {
        $state.thresholdSetOne = JSON.parse(localStorage.getItem('thresholdSetOne'));
    }
    var queryObj = {
        projectId: $state.thresholdSetOne.id
    };
    CommonService.request('GetOneThresholdSet', queryObj).then(function (response) {
        var data = response.data;
        $scope.data = data[0];
    });

    // 下载上传的黑名单文件
    $scope.downLoadBlackText = function(path){
        var queryObj = {
            attachmentPath:path
        };
        CommonService.request('DownLoadBlackText', queryObj).then(function (response) {
           document.location.href = response.config.url + "?attachmentPath=" + path;
        });
    };
});