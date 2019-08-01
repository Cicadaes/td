'use strict';
/**
 * 对比按钮
 */
angular.module('wreport.app').directive('indicators', function () {
    return {
        restrict: 'A',
        replace: true,
        scope: {
            indicatorsUrl: "="
        },
        controller: function ($scope, $state, $location, CommonService) {

            $scope.indicators = $state.tipsObj[$scope.indicatorsUrl];
            $scope.constants =  $state.constants;
            $scope.$on("constantsCallback", function (event) {
                $scope.indicators = $state.tipsObj[$scope.indicatorsUrl];
                $scope.constants =  $state.constants;
            });

            $scope.indicator_show = false;
            $scope.showIndicator = function(e) {
                $scope.indicator_show = !$scope.indicator_show;
                e.stopPropagation();
            };

            var stopFunc = function (e) {
                e.stopPropagation();
            };
            var hideFunc = function (e) {
                $scope.indicator_show = false;
                CommonService.refreshAngular($scope);
            };
            
            setTimeout(function () {
                $('.indicator_panel').on('click', stopFunc);
                $('body').on('click', hideFunc);
            });

            $scope.$on("$destroy", function() {
                $('.indicator_panel').off('click', stopFunc);
                $('body').off('click', hideFunc);
            });
        },
        templateUrl: 'app/directives/indicators.html',
        link: function (scope, element, attrs) {
            scope.title1 = attrs.title1;
        }
    }
});