define(['app','angularAMD'], function (app,angularAMD) {
    'use strict';
    angularAMD.directive('tdSelectSimple',['$rootScope','$state','$timeout', 
        function($rootScope,$state,$timeout) {
    	return {
    		 require: '?ngModel',
    		restrict : 'EA',
    		transclude : true,
    		scope :{
    			tdChange: "&",
        		options : "="
    		},
    		templateUrl : "html/directive/td-select-simple.html",
    		link : function($scope, element, attr, ngModel){
    			var select =  $(element).find(".td-select-simple");
    			var ul =  $(element).find(".searchPane");
    			var flag = false;
    			ngModel.$render = function() {
    				var modelValue = angular.isObject(ngModel.$viewValue) ? ngModel.$viewValue.value : ngModel.$viewValue;
    				$scope.val = (modelValue || '');
	            };
	            $scope.showSearching = function($event){
	            	if(!$event){
	            		return ;
	            	}
            		if(select && select.width){
            			ul.attr("style","min-width:"+select.width()+"px");
            		}
            		if(!flag){
	            		select.find("ul").show();
	            		flag=true;
	            	}else{
	            		select.find("ul").hide();
	            		flag=false;
	            	}
	            	
	    			$("body").unbind("mousedown", $scope.onBodyDown);
	            	$("body").bind("mousedown", $scope.onBodyDown);
	            }
	            $scope.seletedItem = function(key,value,obj){
	            	ngModel.$setViewValue(key);
            		$scope.val = value;
	            	if(angular.isFunction($scope.tdChange)){
	            		$scope.tdChange()(obj);
	            	}
	            };
	            $scope.hideMenu = function() {
	            	select.find("ul").hide();
            		flag=false;
	    		}
	    		$scope.onBodyDown = function(event) {
	    			var $target = $(event.target);
	    			if (!("glyphicon glyphicon-chevron-down mr-5 mt--5" == $target.attr("class")
	    					||"td-select-simple input-search ng-pristine ng-untouched ng-valid" == $target.attr("class")
	    					||"searchPane" == $target.parent().attr("class")
	    					||"td-select-simple" == $target.parent().attr("class")
	    					)) {
    					$scope.hideMenu();
	    			}
	    		}
    		}
    	}
    }]);
});
