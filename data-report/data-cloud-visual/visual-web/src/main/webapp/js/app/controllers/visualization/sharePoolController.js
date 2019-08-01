define([ 'app','angularAMD','app/service/CustomService','app/filters/common/CommonFilter',
         'app/directive/TdShare',
         'ng-pagination'],function(app, angularAMD) {
	'use strict';
	    return ['$scope', '$state', '$stateParams','$location', '$http','NgTableParams','CustomShareService','$compile',
	            function ($scope, $state, $stateParams, $location, $http,ngTableParams,CustomShareService,$compile) {
	    	$scope.radio = {
    			pageRadio : 2,
    			reportRadio : 2
	    	};
	    	$scope.currentPage = 1;
	    	$scope.pageCount = 10;
	    	
	    	$scope.initData = function() {
	    		var params = {page : $scope.currentPage, rows : 12};
	    		CustomShareService.getSharePoolList(params).then(function(data) {
					$scope.customs = data.list;
					$scope.pageCount = (data.total-1)/10+1;
				});
			}
	    	
	    	$scope.initData();
	    	
	    	$scope.onPageChange = function(currentPage) {
    	      $scope.currentPage = currentPage;
    	      console.log(currentPage);
    	      $scope.initData();
    	    };

	    	$scope.goToCustom = function(custom,event){
					$state.go('custom',{id:custom.id,type:2});
	    	}
	    	
	    }];
	}
);
