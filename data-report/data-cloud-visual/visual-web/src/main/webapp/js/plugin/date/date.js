define(['app','angularAMD'], function (app,angularAMD) {
    'use strict';
    angularAMD.directive('pluginDate',['$compile',
        function($compile) {
    	return {
    		require: '?ngModel',
    		restrict : 'EA',
    		transclude : true,
            scope:{
            	pluginPageCallback: "&",
            	data : "=",
    		},
            replace: false,
            template: '<div td-date-condition date-range="dateRange" syndata="changeDate" style="min-width: 186px;min-height:47px;"></div>',
            link: function(scope,elem,ngModel) {
            	
            	scope.createReportLineChartData = function(report){
            		var id = report.id,
        				date = report.reportProperty.propertyMap.date;
            		scope.dateRange = date || "";
            	}
            	
            	scope.$watch('data', function(event, report) {
            		if (scope.data) {
            			scope.createReportLineChartData(scope.data);
            		}
            	});
            	
            	scope.changeDate = function(date){
            		var params = {id : scope.data.id, keyValues :[{key: 'date', value : date}]};
					scope.callback(params);
            	}
            	
            	scope.callback = function(params){
            		if(angular.isFunction(scope.pluginPageCallback)){
            			scope.optionloading = true;
	            		scope.pluginPageCallback()(params);
	            	}
            	}
            }
    	}
    }]);
});
