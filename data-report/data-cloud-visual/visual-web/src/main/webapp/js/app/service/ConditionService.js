define(['app','angularAMD'], function (app,angularAMD) {
  'use strict';
  angularAMD.factory('ConditionService',['$rootScope','$http', function ($rootScope,$http) {
	var broadcast = function(type){
		if(appConfig.UserCondition){
			appConfig.UserCondition.broadcastType = type;
			$rootScope.$broadcast("ConditionService.onChange",appConfig.UserCondition);
		}
    }
    return {
    	setDateFilterData : function(data){
    		broadcast("DateFilter");
 	    },
		setSessionAttribute: function(k,v){
			var param = {
				key : k,
				value : v
			}
			$http({
				method:'post',
				url:'session/sessions',
				data: JSON.stringify(param),
				config:{
					'Content-Type' : 'application/json'
				}
			})
			.success(function(data) {
				return data;
		    })
		    .error(function(data) {
		    	console.error("存储session失败！！！")
		    });
		},
		getSessionAttribute : function(key, callback) {
			return $http({
				method:'GET',
				url:'session/sessions/'+key
			}).success(function(data) {
				angular.isFunction(callback) && callback(data);
		    });
		}
    };
  }]);
});
