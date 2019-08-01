define(['app','angularAMD','app/directive/EChart'], function (app,angularAMD) {
    'use strict';
    angularAMD.directive('pluginOverview',['$compile',
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
            template: '<div class="overview"><div><div><span>{{overviewTitle}}</span></div><div><strong>{{overviewValue}}</strong></div></div></div>',
            link: function(scope,elem,ngModel) {
            	
            	scope.createReportLineChartData = function(report, datas){
            		scope.overviewTitle = "Mobile App";
            		scope.overviewValue = "12345";

        			var id = report.id,
        				property = report.reportProperty.propertyMap,
        				tfz = property.titleFontSize,
        				tfc = property.titleFontColor,
        				vfz = property.valueFontSize,
        				vfc = property.valueFontColor,
        				o = $('#'+id);
        			var strong = o.find('strong');
        			var span = o.find('span');
        			$(span).removeClass();
        			$(span).css({'font-size': tfz, 'color' : tfc});
        			$(strong).removeClass();
        			$(strong).css({'font-size': vfz, 'color' : vfc});
            	}
            	
            	scope.callback = function(){
            		if(angular.isFunction(scope.tdChange)){
            			scope.optionloading = true;
	            		scope.tdChange()(scope.data,scope.createReportLineChartData);
	            	}
            	}
            	
    			scope.$watch('data', function(event, report) {
    				if (scope.data) {
    					scope.callback();
					}
                });
            }
    	}
    }]);
});
