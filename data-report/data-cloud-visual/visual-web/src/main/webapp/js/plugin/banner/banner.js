define(['app','angularAMD','app/directive/EChart'], function (app,angularAMD) {
    'use strict';
    angularAMD.directive('pluginBanner',['$compile',
        function($compile) {
    	return {
    		require: '?ngModel',
    		restrict : 'EA',
    		transclude : true,
            scope:{
            	tdChange: "&",
            	data : "=",
    		},
            replace: false,
            template: '<div class="banner"></div>',
            link: function(scope,elem,ngModel) {
            	
            	scope.createReportLineChartData = function(report, datas){
        			var id = report.id,
        				property = report.reportProperty.propertyMap,
        				bgColor = property.bgColor,
        				border = property.border,
        				opacity = property.opacity,
        				opacity = parseFloat(opacity)/100,
        				bannerHtml = $("#"+id).find('.banner');
        			
        			$(bannerHtml).css({
        				'background' : bgColor.colorRgba(opacity)
        			})
        			if (border) {
        				$(bannerHtml).css({
        					'border' : 'solid 1px #ccc'
        				})
        			}
            	}
            	
            	scope.callback = function(){
            		if(angular.isFunction(scope.tdChange)){
            			scope.optionloading = true;
	            		scope.tdChange()(scope.data,scope.createReportLineChartData);
	            	}
            	}
            	
    			scope.$watch('data', function(event, report) {
    				if (scope.data) {
    					scope.createReportLineChartData(scope.data);
//    					scope.callback();
					}
                });
            }
    	}
    }]);
});
