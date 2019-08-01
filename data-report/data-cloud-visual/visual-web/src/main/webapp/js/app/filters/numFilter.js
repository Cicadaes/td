define(['app','angularAMD'], function (app,angularAMD) {
    'use strict';
   
    app.filter('numFilter', [ function($rootScope,$http) {
    	var productData = undefined; 
    	
        return function(data){
        		if(!data && data!=0){
        			return ;
        		}
        		data+="";
        		var split=data.split(".");
        		if(split.length<2){
        			return data+".00";
        		}
        		if(split[1].length==1){
        			return  data+"0";
        		}else{
        			
        		return Number(data).toFixed(2)
        	//	return Math.round(data * 100) / 100
        		}
        		
        		
        };
	}]);

});
