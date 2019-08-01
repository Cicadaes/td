define(['app','angularAMD'], function (app,angularAMD) {
    'use strict';
   
    app.filter('platformFilter', [ function($rootScope,$http) {
        return function(platform){
        	
        	if(platform == "0"){
				return "Mobile App";
			}else if(platform == "1"){
				return "PC";
			}else if(platform == "2"){
				return "Web";
			}
        	
        };
	}]);
    

});