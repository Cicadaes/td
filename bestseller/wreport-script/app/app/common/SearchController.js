//'use strict';

angular.module('wreport.app').controller('SearchController', function ($scope, $state, $location) {

    $scope.clearSearchValue = function () {
        $scope.searchValue = "";
        $scope.search();
    };

    $scope.keydownSearchValue = function (event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e && e.keyCode == 13) {
            $scope.search();
        }
    };

    $scope.focusSearchValue = function () {
        $scope.placeholder = "";
    };

    $scope.blurSearchValue = function () {
        $scope.placeholder = $scope.constants.label_input_key_word;
    };

    $scope.initSearch = function () {
        $scope.searchValue = "";
        $scope.placeholder = $scope.constants.label_input_key_word;
    };
    $scope.initSearch();

});

angular.module('wreport.app').directive('search', function () {
    return {
        restrict: 'A',
        controller: 'SearchController',
        templateUrl: 'app/common/search.html',
    };
});

