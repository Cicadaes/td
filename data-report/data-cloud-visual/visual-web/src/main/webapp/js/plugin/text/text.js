define(['app','angularAMD','app/directive/EChart','app/service/PluginService'], function (app,angularAMD) {
    'use strict';
    angularAMD.directive('pluginText',['$compile','PluginService',
        function($compile, PluginService) {
    	return {
    		require: '?ngModel',
    		restrict : 'EA',
    		transclude : true,
            scope:{
            	tdChange: "&",
            	pluginReportCallback : "&",
            	data : "=",
            	showflag : "="
    		},
            replace: false,
            template: '<div class="text hg-p-100"><a ng-show="!showflag"><font>{{textValue}}</font></a><input ng-show="showflag" type="text" placeholder="请输入文字" ng-model="textValue" ng-change="changeTextValue(textValue);"></div>',
            link: function(scope,elem,ngModel) {
            	scope.createReportLineChartData = function(report, datas){
        			var id = report.id,
        				property = report.reportProperty.propertyMap,
        				tv = property.textValue,
        				fz = property.textFontSize,
        				fc = property.textFontColor,
        				ff = property.textFontFamily,
        				hyperlink = property.hyperlink,
        				href = property.href,
        				$text = $($("#"+id).find('.text')),
        				a = $text.find('a'),
        				font = $text.find('font'),
        				input = $text.find('input'),
        				$input = $(input),
        				$font = $(font),
        				$a = $(a);
        			scope[$input.attr('ng-model')] = tv;
        			$input.css({'font-size' : fz, 'color': fc,'font-family' : CUSTOM.getFontFamilyKey(ff)});
        			$font.css({'font-size' : fz, 'color': fc,'font-family' : CUSTOM.getFontFamilyKey(ff)});
        			if(!scope.showflag){
        				if (hyperlink) {
        					$a.attr('href', 'http://' + href);
        				}else{
        					$a.css('cursor', 'default');
        				}
        			}
            	}
            	
            	scope.$watch('data', function(event, report) {
            		if (scope.data) {
            			scope.createReportLineChartData(scope.data);
            		}
            	});
            	
        		scope.changeTextValue = function(textValue){
        			var params = {id : scope.data.id,keyValues :[{key: 'textValue', value : textValue}]};
        			PluginService.changeProperty(params).then(function(data) {
        				if(data.success){
							scope.callback(data.data);
						}
    				});
        		}
            	
            	scope.callback = function(report){
            		if(angular.isFunction(scope.pluginReportCallback)){
            			scope.optionloading = true;
	            		scope.pluginReportCallback()(report);
	            	}
            	}
            }
    	}
    }]);
});
