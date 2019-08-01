define(['app','angularAMD'], function (app,angularAMD) {
    'use strict';
    angularAMD.directive('tdSelectEvent',['$rootScope','ConditionService','$state','$timeout', 
        function($rootScope,$state,$timeout) {
    	return {
    		 require: '?ngModel',
    		restrict : 'EA',
    		transclude : true,
    		scope :{
    			tdChange: "&",
        		syndata : "&",
        		callback : "&",
        		options : "="
    		},
    		templateUrl : "html/directive/td-select-event.html",
    		link : function($scope, element, attr, ngModel){
    			var select = $(element).find(".td-select");
    			var ul = $(element).find(".searchPane");
    			var flag=false;
    			ngModel.$render = function() {
    				var modelValue = angular.isObject(ngModel.$viewValue) ? ngModel.$viewValue.value : ngModel.$viewValue;
    				$scope.val = (modelValue || '');
    				var modelimg = angular.isObject(ngModel.$viewValue) ? ngModel.$viewValue.img : ngModel.$viewValue;
    				$scope.img = (modelimg || '');
	            };
	            $scope.showSearching = function(){
	            	if(select && select.width){
	            		ul.attr("style","min-width:"+select.width()+"px");
	            	}
//	            	$scope.searching=!$scope.searching;
	            	//$scope.issearching = true;
	            	if(!flag){
	            		$(select.find("ul")).show();
	            		$(select.find("div")).show();
	            		flag=true;
	            	}else{
	            		$(select.find("ul")).hide();
	            		$(select.find("div")).hide();
	            		flag=false;
	            	}
	            	
	    			$("body").unbind("mousedown", $scope.onBodyDown);
	            	$("body").bind("mousedown", $scope.onBodyDown);
	            }
	            $scope.onChange = function(val){
	            	if(!val){
	            		val="";
	            	}
	            	$scope.searching = false;
	            	if(angular.isFunction($scope.callback)){
	            		$scope.callback()(val);
	            	}
	            	if(angular.isFunction($scope.syndata)){
	            		$scope.syndata();
	            	}
	            };
	            $scope.onBlur =function(){
	            	setTimeout(function(){
	            		$scope.$apply(function(){
	            			$scope.searching = false;
	            			$scope.issearching = false;
	            		})
	            	},200)
	            };
	            $scope.seletedItem = function(key,value,obj){
	            	ngModel.$setViewValue(obj);
            		$scope.val = value;
            		$scope.img = obj.img;
            		obj.selected =true;
//	            	if(angular.isFunction($scope.tdChange)){
//	            		$scope.tdChange()(key,value,obj);
//	            	}
//	            	$scope.searching = false;
//	            	$scope.issearching = false;
            		$(select.find("ul")).hide();
            		$(select.find("div")).hide();
	            	flag=false;
	            };
	            
	            $scope.hideMenu = function() {
	            	$(select.find("ul")).hide();
	            	$(select.find("div")).hide();
            		flag=false;
	    			
	    		}
	    		$scope.onBodyDown = function(event) {
	    			var $target = $(event.target);
	    			if (!(select.find("div").find("input").attr("ng-model") == $target.attr("ng-model") 
	    					|| "{'pl-20':img==1}" == $target.attr("ng-class")
	    					|| "opt in options" == $target.attr("ng-repeat")
	    					|| ("showSearching();" == $target.attr("ng-click") && select.find("div").is(":hidden"))
	    					|| "p-rel" == $target.attr("class")
	    					|| "glyphicon glyphicon-chevron-down mr-10" == $target.attr("class")
	    					|| "readonly" == $target.attr("readonly")
	    					|| "searchPane mt-imp-34" == $target.attr("class")
	    					|| select.find("div").find("input").attr("ng-model") == $target.parent().find("input").attr("ng-model"))) {
    					$scope.hideMenu();
	    			}
	    		}
	            
    		}
    	}
    }]);
});
