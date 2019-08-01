define(['app','angularAMD'], function (app,angularAMD) {
    'use strict';
    angularAMD.directive('fontColor',[
        function() {
    	return {
    		require: '?ngModel',
    		restrict : 'EA',
    		transclude : true,
            scope:{
            	tdChange: "&",
            	index : "=",
            	selectedFontColor : "="
    		},
            replace: false,
            template: '<div color-picker default-color="{{defaultColor}}" class="font-color" ng-style="{\'background-color\': selectedFontColor}"></div>',
            link: function(scope,ngModel) {
            	scope.defaultColor = '#FFF';
            	if (scope.selectedFontColor == null) {
            		scope.selectedFontColor = '#FFF';
				}
                scope.$on('colorPicked', function(event, color) {
                    scope.selectedFontColor = color;
                    if(angular.isFunction(scope.tdChange)){
	            		scope.tdChange()(color,scope.index);
	            	}
                });
            }
    	}
    }]);
});
