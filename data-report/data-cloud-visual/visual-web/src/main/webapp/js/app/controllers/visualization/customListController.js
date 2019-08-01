define([ 'app','angularAMD','app/service/CustomService','app/filters/common/CommonFilter',
         'app/directive/TdShare',
         'ng-pagination'],function(app, angularAMD) {
	'use strict';
	    return ['$scope', '$state', '$stateParams','$location', '$http','NgTableParams','CustomService','$compile',
	            function ($scope, $state, $stateParams, $location, $http,ngTableParams,CustomService,$compile) {
	    	$scope.radio = {
    			pageRadio : 2,
    			reportRadio : 1
	    	};
	    	$scope.currentPage = 1;
	    	$scope.pageCount = 10;
	    	$scope.initData = function() {
	    		var type = $scope.radio.reportRadio;
	    		var params = {page : $scope.currentPage, rows : 11};
				CustomService.getByParams(params).then(function(data) {
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
	    		if ('DT' === event.target.tagName || 'DT' === event.target.parentNode.tagName) {
					if (custom == undefined) {
						custom = {};
					}
					var type = $scope.radio.reportRadio;
					$state.go('custom',{id:custom.id,type:type});
				} else {
					return false;
				}
	    	}
	    	
	    	$scope.deleteCustom = function(custom){
	    		$.Pop.confirms('确认删除报表 \'' + custom.name + '\'?',function(){
					CustomService.deleteById(custom.id).then(function(data) {
						$scope.initData();
					});
				});
	    	}
    	    
    	    $scope.colors=['575fb9','6d77cf','5597f1','43b393','00cf95','8555b9','b151b7'];
    	    
    	    $scope.initCustom = function(){
    	    	$scope.custom = {name : '',bgColor : '575fb9'};
    	    }
    	    
    	    $scope.updateCustom = function(custom) {
    	    	$scope.custom = custom;
    	    }
    	    
    	    $scope.editCustom = function(callback){
    	    	var custom = angular.copy($scope.custom);
    			CustomService.editCustom(custom).then(function(data) {
    				callback.call();
    				$scope.initData();
    			});
    	    }
	    	
	    }];
	}
);
