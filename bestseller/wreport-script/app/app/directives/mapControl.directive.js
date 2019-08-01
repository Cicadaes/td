'use strict';
/**
 * 控制地图的放大缩小，重定位，用于职住来源，区域来源
 */
angular.module('wreport.app').directive('mapControl', function () {
    return {
        restrict: 'A',
        replace: true,
        controller: function ($scope, $state, $location, CommonService) {
            $scope.mapBigger = function () {
                var map_zoom = $scope.bmapTop.getZoom();
                if (map_zoom >= 18) {
                    return false;
                }
                $scope.bmapTop.setZoom(map_zoom + 1);
                if ($scope.bmapBottom) {
                    $scope.bmapBottom.setZoom(map_zoom + 1);
                }
            };
            $scope.mapSmaller = function () {
                var map_zoom = $scope.bmapTop.getZoom();
                if (map_zoom <= 8) {
                    return false;
                }
                $scope.bmapTop.setZoom(map_zoom - 1);
                if ($scope.bmapBottom) {
                    $scope.bmapBottom.setZoom(map_zoom - 1);
                }
            };
            $scope.mapLocation = function () {
                $scope.bmapTop.centerAndZoom(new BMap.Point($state.projectVM.longitude, $state.projectVM.latitude), 11);
                if ($scope.bmapBottom) {
                    $scope.bmapBottom.centerAndZoom(new BMap.Point($state.projectVM.longitude, $state.projectVM.latitude), 11);
                }
            };
        },
        templateUrl: 'app/directives/mapControl.html',
        link: function (scope, element, attrs) {
        }
    }
});