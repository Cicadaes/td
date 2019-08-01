'use strict';
/**
 * 对比按钮
 */
angular.module('wreport.app').directive('compareButton', function () {
    return {
        restrict: 'A',
        replace: true,
        controller: function ($scope, $state, $location, CommonService) {

        },
        templateUrl: 'app/directives/compareButton.html',
        link: function (scope, element, attrs) {
            scope.title1 = attrs.title1;
        }
    }
});