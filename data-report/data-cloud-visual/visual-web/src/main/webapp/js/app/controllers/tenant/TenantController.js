define(['app','angularAMD','app/filters/common/CommonFilter'], function (app,angularAMD) {
    'use strict';
    return ['$scope', '$location', function ($scope, $location) { 
		$scope.iframe = {};
    	$scope.init = function(){
    		$scope.iframe.src = $location.search().url+"?timecc"+Math.random()+"&*";
    	};		
		$scope.init();
    }];
});
