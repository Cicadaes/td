define(['app','angularAMD','app/directive/EChart'], function (app,angularAMD) {
    'use strict';
    angularAMD.directive('pluginColumn',['$compile',
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
        			property = reportProperty.propertyMap,
        			type = reportProperty.type,
        			legendShow = property.legendShow,
        			bgColor = property.bgColor,
        			xAxisLine =  property.xAxisLine,
        			xAxisLabel = property.xAxisLabel,
        			yAxisLine = property.yAxisLine,
        			yAxisLabel = property.yAxisLabel,
        			plotLabel = property.plotLabel,
        			location = property.location,
        			colorGroup = property.colorGroup,color =colorGroup.split(','),
        			xAxisColor = property.xAxisColor,
        			yAxisColor = property.yAxisColor,
        			legendColor = property.legendColor,
        			xAxisFontSize = property.xAxisFontSize,xAxisFontSize = parseInt(xAxisFontSize),
        			yAxisFontSize = property.yAxisFontSize,yAxisFontSize = parseInt(yAxisFontSize),
        			legendFontSize = property.legendFontSize,legendFontSize = parseInt(legendFontSize),
        			xAxisFontFamily = property.xAxisFontFamily,xAxisFontFamily = CUSTOM.getFontFamilyKey(xAxisFontFamily),
        			yAxisFontFamily = property.yAxisFontFamily,yAxisFontFamily = CUSTOM.getFontFamilyKey(yAxisFontFamily), 
        			legendFontFamily = property.legendFontFamily,legendFontFamily = CUSTOM.getFontFamilyKey(legendFontFamily),
        			opacity = property.opacity,
        			fillColor = property.fillColor;
        			opacity = parseFloat(opacity)/100;
        			
        			var xArray = datas.x.value;
        			var yList = datas.y,name,yValue,serises=[],legendData=[];
        			angular.forEach(yList, function(y){
        				name = y.name;
        				yValue = y.value;
        				var serise = {
        	            	  name:name,
        	            	  type:'bar',
        	            	  itemStyle : {
        	            		  normal: {
        	            			  label: {
        	            				  show: plotLabel, //是否显示值
        	            				  position: 'right'
        	            			  }
        	            		  }
        	            	  },
        					  data:yValue
        	              }
        				legendData.push(name);
        				if (yList.length == 1) {
        					serise.itemStyle.normal.color = function(params) {
        						var colorList = color;
        						return colorList[params.dataIndex]
        					};
        				}
        				serises.push(serise);
        			})
        			
        			var xAxis = [
        				{
        					type : 'category',
        					show : xAxisLabel,
        					splitLine : {
        			        	show: xAxisLine
        					},
        			        axisTick :{
        			            show : false
        			        },
        			        axisLine :{
        			            show : false,
        			        },
        			        axisLabel:{
        			        	textStyle:{
        			            	fontFamily : xAxisFontFamily,
        			            	fontSize : xAxisFontSize,
        	            			color: xAxisColor
        			            }
        		            },
        					data : xArray
        				} 
        	        ];
        			var yAxis = [
        		        {
        		            type : 'value',
        		            show : yAxisLabel,
        		            splitLine : {
        			        	show: yAxisLine
                			},
                	        axisTick :{
                	            show : false
                	        },
                	        axisLine :{
                	            show : false,
                	            lineStyle:{
        			                color: yAxisColor != undefined ? yAxisColor : '#333',  
        			                width:2  
        			            }
                	        },
                	        axisLabel:{
        			        	textStyle:{
        			            	fontFamily : yAxisFontFamily,
        			            	fontSize : yAxisFontSize,
        	            			color: yAxisColor
        			            }
        		            }
        		        }
        		    ];
        			var legend = {
        				show : legendShow,
        				data : legendData,
        				location : location,
        				fontFamily : legendFontFamily,
                    	fontSize : legendFontSize,
            			color: legendColor
        			}
        			if ('bar' == type) {
        				var temp = xAxis,
        					xAxis = yAxis,
        					yAxis = temp;
        			}
        			var _chart = {
        					bgColor : bgColor.colorRgba(opacity),
        					legend : legend,
        					color : color,
        					xAxis : xAxis,
        					yAxis : yAxis,
        					series: serises
        			};
        			scope.options = EchartsOptions.bar(_chart);
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
