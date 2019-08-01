define(['app','angularAMD','app/directive/EChart'], function (app,angularAMD) {
    'use strict';
    angularAMD.directive('pluginLine',['$compile',
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
        			reportProperty = report.reportProperty,
        			type = reportProperty.type,
        			property = reportProperty.propertyMap,
        			smooth = property.smooth,
        			legendShow = property.legendShow,
        			bgColor = property.bgColor,
        			xAxisLine =  property.xAxisLine,
        			xAxisLabel = property.xAxisLabel,
        			yAxisLine = property.yAxisLine,
        			yAxisLabel = property.yAxisLabel,
        			plotLabel = property.plotLabel,
        			lineWidth = property.lineWidth,
        			colorGroup = property.colorGroup,color =colorGroup.split(','),
        			symbol = property.symbol,
        			location = property.location,
        			opacity = property.opacity,
        			xAxisColor = property.xAxisColor,
        			yAxisColor = property.yAxisColor,
        			legendColor = property.legendColor,
        			xAxisFontSize = property.xAxisFontSize,xAxisFontSize = parseInt(xAxisFontSize),
        			yAxisFontSize = property.yAxisFontSize,yAxisFontSize = parseInt(yAxisFontSize),
        			legendFontSize = property.legendFontSize,legendFontSize = parseInt(legendFontSize),
        			xAxisFontFamily = property.xAxisFontFamily,xAxisFontFamily = CUSTOM.getFontFamilyKey(xAxisFontFamily),
        			yAxisFontFamily = property.yAxisFontFamily,yAxisFontFamily = CUSTOM.getFontFamilyKey(yAxisFontFamily), 
        			legendFontFamily = property.legendFontFamily,legendFontFamily = CUSTOM.getFontFamilyKey(legendFontFamily),
        			fillColor = property.fillColor;
        			opacity = parseFloat(opacity)/100;
        			var areaStyle = {normal: {opacity : fillColor}};//透明程度
        			var xArray = datas.x.value;
        			var yList = datas.y,name,yValue,serises=[],legendData=[];
        			angular.forEach(yList, function(y){
        				name = y.name;
        				yValue = y.value;
        				var serise = {
        	        		name: name,
        	        		type:'line',
        	        		symbol: symbol,
        	        		symbolSize : 3 + parseInt(lineWidth),//
        	        		areaStyle: type == 'area' ? areaStyle : null, //是否显示为area
        					smooth : smooth == 'true' ? true : false,//曲线还是折线
        	        		lineStyle: {normal: {width : lineWidth}},//线条粗细
                			label: {  
                				normal: {
                					show: plotLabel, //是否显示值
                					position: 'top'
                				}
                			},
                			data:yValue
        	        	}
        				legendData.push(name);
        				serises.push(serise);
        			})
        			var xAxis = {
        				show : xAxisLabel,
        				splitLine : xAxisLine,
        				data : xArray,
        				color : xAxisColor,
        				fontSize : xAxisFontSize,
        				fontFamily : xAxisFontFamily,
        			};
        			var yAxis = {
        				show : yAxisLabel,
        				splitLine : yAxisLine,
        				color : yAxisColor,
        				fontSize : yAxisFontSize,
        				fontFamily : yAxisFontFamily
        			};
        			var legend = {
        				show : legendShow,
        				data : legendData,
        				location : location,
        				color : legendColor,
        				fontSize : legendFontSize,
        				fontFamily : legendFontFamily
        			}
        			var _chart = { 
        					bgColor : bgColor.colorRgba(opacity),
        					legend : legend,
        					color : color,
        					xAxis : xAxis,
        					yAxis : yAxis,
        					series: serises
        			};
        			scope.options = EchartsOptions.line(_chart);
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
