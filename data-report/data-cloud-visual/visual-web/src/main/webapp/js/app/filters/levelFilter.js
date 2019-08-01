define(['app','angularAMD'], function (app,angularAMD) {
    'use strict';
   
    app.filter('levelFilter', [ function($rootScope,$http) {
        return function(status){
        	
        	if(status == "1"){
				return "excellent";
			}else if(status != "1"){
				return "poor";
			}
        	
        };
	}]);
    

});