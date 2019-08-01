define(['app','angularAMD'], function (app,angularAMD) {
    'use strict';
    angularAMD.directive('tdIndicators',['$timeout','$http', function($timeout,$http) {
    	return {
    		restrict : 'EA',
    		scope:{
				indicatorsUrl:"=",
				index:"="
    		},
    		templateUrl : "html/directive/td-indicators.html",
    		link: function(scope) {
//    			scope.indicators = scope.indicators;
    			if(scope.index==null){
    				scope.index =0;
    			}
    			var indicators = $http.get(scope.indicatorsUrl);
    			indicators.then(function(data){
    				scope.indicators = data.data[scope.index];
    			});
		    }
    	}
    }]);
});
