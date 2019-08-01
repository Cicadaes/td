'use strict';

angular.module('wreport.app').controller('ExternPagesController', function ($scope, $state, $http, $location) {
    $scope.iframe = {};
    $scope.init = function () {
        $scope.iframe.src = $location.search().url;
    };
    $scope.init();

});

angular.module('wreport.app').directive('externPages', function () {
    return {
        restrict: 'EA',
        link: function (scope, element, attrs) {
            var iFrameHeight = function () {
                var winHg = $(window).height() - 60;
                var ifm = document.getElementById(attrs.id);
                ifm.height = winHg;

                var bHeight = ifm.contentWindow.document.body.clientHeight;
                var ifmHeight = bHeight;

                var subWeb = document.frames ? document.frames[attrs.name].document
                    : ifm.contentWindow.document;
                if (ifm != null && subWeb != null) {
                    if (winHg > ifmHeight) {
                        ifm.height = winHg;
                    } else {
                        ifm.height = ifmHeight;
                    }
                }
            };
            window.setTimeout(iFrameHeight, 200);

        }
    }
});
