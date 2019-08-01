define(['app','angularAMD','app/filters/common/CommonFilter','app/service/PageService'], function (app,angularAMD) {
    'use strict';
    angularAMD.directive('tdSelect',['$rootScope','$state','$timeout', 'PageService',
        function($rootScope,$state,$timeout,PageService) {
    	return {
    		require: '?ngModel',
    		restrict : 'EA',
    		transclude : true,
    		scope :{
    			tdChange: "&",
    			params : "=",
    			condition : "=",
        		name : "="
    		},
    		templateUrl : "html/directive/td-select.html",
    		link : function(scope, element, attr, ngModel){
    			scope.searchName = "请输入";
    			if(scope.name){
    				scope.searchName += scope.name;
    			}
    			var select = $(element).find(".td-select");
    			var ul = $(element).find(".searchPane");
    			var flag = false;
    			ngModel.$render = function() {
    				var modelValue = angular.isObject(ngModel.$viewValue) ? ngModel.$viewValue.value : ngModel.$viewValue;
    				scope.val = (modelValue || '未选择');
	            };
	            scope.showSearching = function(){
	            	if(select && select.width){
	            		ul.attr("style","min-width:"+select.width()+"px");
	            	}
	            	if(!flag){
	            		if (!scope.options) {
	            			scope.initOptions();
						}
	            		$(select.find("ul")).show();
	            		$(select.find("div")).show();
	            		flag=true;
	            	}else{
	            		$(select.find("ul")).hide();
	            		$(select.find("div")).hide();
	            		flag=false;
	            	}
	            	
	    			$("body").unbind("mousedown", scope.onBodyDown);
	            	$("body").bind("mousedown", scope.onBodyDown);
	            }
	            scope.onChange = function(val){
	            	scope.searching = false;
	            	if(angular.isFunction(scope.syndata)){
	            		scope.syndata()(val);
	            	}
	            };
	            scope.seletedItem = function(obj){
	            	scope.val = obj.value;
	            	if(angular.isFunction(scope.tdChange)){
	            		if (obj.key == '') {
	            			obj = {};
						}
	            		scope.tdChange()(scope.condition,obj);
	            	}
	            	$(select.find("ul")).hide();
	            	$(select.find("div")).hide();
	            	flag=false;
	            };
	            scope.hideMenu = function() {
	            	$(select.find("ul")).hide();
	            	$(select.find("div")).hide();
            		flag=false;
	    			
	    		}
	    		scope.onBodyDown = function(event) {
	    			var $target = $(event.target);
	    			if (!(select.find("div").find("input").attr("ng-model") == $target.attr("ng-model") 
	    					|| "opt in options" == $target.attr("ng-repeat")
	    					|| "showSearching();" == $target.attr("ng-click")
	    					|| "td-search p-abs" == $target.attr("class")
	    					|| "lyphicon glyphicon-search p-abs" == $target.attr("class")
	    					|| "searchPane" == $target.attr("class")
	    					|| select.find("div").find("input").attr("ng-model") == $target.parent().find("input").attr("ng-model"))) {
    					scope.hideMenu();
	    			}
	    		}
	    		
	    		scope.queryOptions = function(params){
	    			PageService.getSearchSelectData(params).then(function(data) {
	    				scope.options = data.result;
    					scope.options.splice(0,0,{value: "未选择", key: ''});
	    			});
	    		}
	    		scope.initOptions = function(searchName){
	    			var params = angular.copy(scope.params);
	    			if (params[scope.condition] && typeof params[scope.condition] === 'object') {
	    				params[scope.condition] = params[scope.condition].key;
					}
	    			params.searchName = searchName;
	    			scope.queryOptions(params);
	    		}
	    		
    		}
    	}
    }]);
});
