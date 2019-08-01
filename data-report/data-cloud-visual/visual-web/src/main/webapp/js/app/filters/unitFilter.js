define(['app','angularAMD'], function (app,angularAMD) {
    'use strict';
   //给目标值添加一个单位
    app.filter('unitFilter', [ function($rootScope,$http) {  
        return function(user){
        	
        	if(user == "1"){
				return "excellent";
			}else if(status != "1"){
				return "poor";
			}
        	
        };
	}]);
    

});