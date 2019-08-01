define(['app','angularAMD'], function (app,angularAMD) {
    'use strict';
    angularAMD.directive('tdHighchar', function() {
    	return {
    		restrict : 'EA',
    		scope:{
    			struct : "=",
    			chartLineAction : "=",
    			loading : "=",
    			callback : "&"
    			
    		},
    		link: function(scope, elem, attrs) {
    			var chr = "";
    			scope.$watch('struct',function() {
    				var hdata= angular.copy(scope.struct);
    				if(hdata){
    					$(elem).highcharts(hdata);
    					scope.highcharts = $(elem).highcharts();
    					scope.removeLoading();
    					scope.bindStepBtnEvent();
    					
    				}
    			},true);
    			
    			
    			scope.bindStepBtnEvent = function(){
    				var stepdom = $(elem).find(".stepBtnClass_");
					if(stepdom && stepdom.length>0){
						stepdom.click(function(e){
	    	                scope.$apply(function() {
	    	                    scope.callback()(e.target.getAttribute("data"));
	    	                });
						})
					}
    			};
    			scope.$watch('chartLineAction',function() {
    				if(scope.chartLineAction){
    					var attrObj = scope.highcharts.series[scope.chartLineAction.index];
    					if(attrObj){
    						attrObj[scope.chartLineAction.action]();
    					}
    				}
    			},true);
    			
    			scope.$watch('loading',function() {
    				if(scope.loading){
    					$(elem).find(".highcharts-container").hide();
    					$(elem).addClass("empty-box");
    				}else{
    					scope.removeLoading();
    				}
    			},true);
    			scope.removeLoading = function(){
    				$(elem).removeClass("empty-box");
    				$(elem).find(".highcharts-container").show();
    			};
		    }
    	}
    });
});
