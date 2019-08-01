define(['app','angularAMD'], function (app,angularAMD) {
    'use strict';
    angularAMD.directive('tdPanel', function() {
    	return {
    		restrict : 'EA',
    		transclude : true,
    		scope:{
    			title:"@panelTitle",
    			titleHidden:"@panelTitleHidden",
    			titleHref:"@panelTitleHref",
    			inner : "@panelInner"
    		},
    		templateUrl : "html/directive/td-panel.html",
    		link: function(scope) {
    			scope.$watch('title', function(){
    				if(scope.title){
    					scope.subtitle = FormartUtils.dataStrSubstring(scope.title,10);
    				}
    			});
		    }
    	}
    });
});
