define(['app','angularAMD','app/directive/FontColor'], function (app,angularAMD) {
    'use strict';
    angularAMD.directive('colorGroup',[
        function() {
    	return {
    		require: '?ngModel',
    		restrict : 'EA',
    		transclude : true,
            scope:{
            	tdChange: "&",
            	selectColor : "="
    		},
            templateUrl: 'html/directive/color-group.html',
            link: function(scope,ngModel) {
            	scope.selectColor;
            	if (scope.selectColor == null) {
            		scope.selectColor = "#8ec8fd,#61a0a8,#d48265,#91c7ae,#749f83,#ca8622,#bda29a,#6e7074,#546570,#3fb1e3,#6be6c1,#a0a7e6,#26C0C0,#c4ebad,#96dee8,#C1232B,#B5C334,#FCCE10";
				}
            	scope.initColor = function(){
            		var colors = scope.selectColor.split(',');
            		scope.colorgroup =[];
            		for (var i = 0,len = colors.length; i < len; i++) {
            			var col = {key : i, value: colors[i]};
            			scope.colorgroup.push(col);
            		}
            	}
            	scope.colorChange = function(color,index){
            		if (color) {
            			scope.colorgroup[index] = {key : index, value: color};
            			var colors = scope.getColors();
            			if(angular.isFunction(scope.tdChange)){
    	            		scope.tdChange()(colors);
    	            	}
					}
            	}
            	
            	scope.initColor();
            	
    			scope.$watch('selectColor', function(event, report) {
    				if (scope.selectColor) {
    					scope.initColor();
					}
                });
            	
            	scope.getColors = function(){
            		var colorgroup = scope.colorgroup, colors = [];
            		for (var i = 0, len = colorgroup.length; i < len; i++) {
            			colors[i] = colorgroup[i].value;
					}
            		return colors.toString();
            	}
            }
    	}
    }]);
});
