define(['app','angularAMD','app/directive/EChart'], function (app,angularAMD) {
    'use strict';
    angularAMD.directive('pluginPie',['$compile',
        function($compile) {
    	return {
    		require: '?ngModel',
    		restrict : 'EA',
    		transclude : true,
            scope:{
            	tdChange: "&",
            	data : "=",
    		},
            replace: false,
            template: '<div e-chart e-data="options" loading="loading" class="hg-p-100"></div>',
            link: function(scope,elem,ngModel) {
            	
            	scope.createReportLineChartData = function(report, datas){

        			var id = report.id,
        				property = report.reportProperty.propertyMap,
        				legendShow = property.legendShow,
        				location = property.location,
        				plotLabel = property.plotLabel,
        				bgColor = property.bgColor,
        				colorGroup = property.colorGroup,
        				opacity = property.opacity,
        				radius = property.radius,
        				opacity = parseFloat(opacity)/100;
        			
        			var xArray = datas.x.value;
        			var yList = datas.y,name,yValue,serises=[],legendData=[],dataList=[];
        			
        			angular.forEach(yList, function(y){
        				name = y.name;
        				yValue = y.value;
        				angular.forEach(yValue, function(data,index,array){
        					dataList[index] = {value:data, name:xArray[index]};
                		});
        				var serise ={
        				    name: name,
        				    type: 'pie',
        				    itemStyle:{ 
        				    	normal:{ 
        		                	label:{ 
        		                		show: true, 
        		                		formatter: plotLabel ? '{b} : {c} ({d}%)' : '{b}' 
        		                	}, 
        		                	labelLine :{show:true} 
        		                } 
        		            },
        				    data:dataList
        				}
        				if (radius && 'true' === radius) {
        					serise.radius = ['50%', '80%'];
        				} else {
        					serise.radius = [0, '80%'];
        				}
        				legendData.push(name);
        				serises.push(serise);
        			})
        				
        			var _chart = {
        				bgColor : bgColor.colorRgba(opacity),
        				color : colorGroup.split(','),
        				legend : {
        					show : legendShow,
        					location : location,
        					data : xArray
        				},
        				series: serises
        			};
        			scope.options = EchartsOptions.pie(_chart);
        			scope.optionloading = false;
        		}
            	
            	scope.callback = function(){
            		if(angular.isFunction(scope.tdChange)){
            			scope.optionloading = true;
	            		scope.tdChange()(scope.data,scope.createReportLineChartData);
	            	}
            	}
            	
    			scope.$watch('data', function(event, report) {
    				if (scope.data) {
    					scope.callback();
					}
                });
            }
    	}
    }]);
});
