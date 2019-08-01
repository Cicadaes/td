define(['app','angularAMD'], function (app,angularAMD) {
    'use strict';
    angularAMD.directive('tdDateCondition',['$timeout','$state', function($timeout,$state) {
    	return {
    		restrict : 'EA',
    		scope:{
    			dateRange : "=",
    			syndata : "&"
    		},
    		templateUrl : "html/directive/td-date-condition.html",
    		link: function(scope, elem, attrs) {
    			var sign = "到",elem = angular.element(elem);
    			//工具
    			scope.getDataStr = function(day,month,year) {
    				var dd = new Date(); 
    				dd.setDate(dd.getDate()+(day?day:0));
    				dd.setMonth(dd.getMonth()+(month?month:0));
    				dd.setFullYear(dd.getFullYear()+(year?year:0));
    				return scope.simpleFormat(dd); 
    			};
    			scope.simpleFormat = function(date){
    				var y = date.getFullYear(); 
    				var m = date.getMonth()+1;
    				if((m+"").length == 1){
    					m  = "0" + m;
    				}
    				var d = date.getDate(); 
    				if((d+"").length == 1){
    					d = "0" + d;
    				}
    				return y+"-"+m+"-"+d;
    			};
    			scope.initMinMaxDate = function () {
					var d = new Date();
					scope.maxDate = scope.simpleFormat(d);
    			}
    			scope.initMinMaxDate();
    			scope.changeDate = function(day,month,year){
    				var startData=scope.getDataStr(day,month,year);
    				var endData=scope.getDataStr(0,0,0);
    				if(startData == endData || day == -1){
    					scope.setDateRange(startData);
    				}else{
    					scope.setDateRange(startData,endData);
    				}
    			}
    			scope.showCalendar =function(){
    				scope.initMinMaxDate();
    				setTimeout(function() {
    					scope.calendar = new TD.ui.Calendar("#calendar",{
        					number:2,//多日历
        					intervals:true,//时段选择
        					date:{start : scope.start,end : scope.end},
        					disable : {
        			            first : scope.minDate,
        			            last : scope.maxDate,
        			        },
        					dayOperationStatus : true,
        					format : "yyyy-MM-dd",//日期格式
        					uiStyle:"TD_",//样式,
        					language : "zh_CN",//语言
        					preNextMonthButton : {
        						pre : true,
        						next : true
        					}
        				})
    					$(scope.calendar).on("selectDay",function(e,msg){
    						if(msg.date.start && msg.date.end){
    							scope.start = msg.date.start;
    							scope.end = msg.date.end;
    							$(".displayTime").val(scope.start + sign + scope.end);
    						}
        				})
    				}, 100);
    			}
    			scope.changeDateRange = function(){
    				var s = angular.copy(scope.start);
    				var e = angular.copy(scope.end);
    				if(s && e){
	    				var sd = scope.simpleFormat(new Date(s));
	    				var ed = scope.simpleFormat(new Date(e));
    					scope.setDateRange(sd,ed);
    				}
    			}
    			scope.getFirstAndLastMonthDay = function(year,month){
    				if (month == 0) {
						month = 12;
						year = year -1;
					}
    				var   firstdate = year + '-' + month + '-01';
    				var  day = new Date(year,month,0); 
    				var lastdate = year + '-' + month + '-' + day.getDate();//获取当月最后一天日期  
	               
    				return firstdate+"~"+lastdate;
	            };
    			scope.monthChange = function(month){
    				var monthStr = "01";
    				var year  = month.addition;
    				if((month.key+"").length == 1){
    					monthStr = "0" + month.key;
    				}else{
    					monthStr = month.key+"";
    				}
    				var range = scope.getFirstAndLastMonthDay(year, monthStr);
    				var dates = range.split("~");
    				scope.setDateRange(dates[0],dates[1]);
    			};
    			//获取两个日期的月份差
    			scope.getMonthInterval = function(d1,d2){
    				var dateStr1 = scope.simpleFormat(d1);
    				var dateStr2 = scope.simpleFormat(d2);
    				dateStr1 = dateStr1.split('-');
    				dateStr1 = parseInt(dateStr1[0]) * 12 + parseInt(dateStr1[1]);
    				dateStr2 = dateStr2.split('-');
    				dateStr2 = parseInt(dateStr2[0]) * 12 + parseInt(dateStr2[1]);
    				return Math.abs(dateStr1 - dateStr2);
    			};
    			//月份下来框
    			scope.setMonthSelect = function(){
    				var d = new Date();
    				var y = d.getFullYear();
    				var m = d.getMonth()+1;
					var rd = new Date(y + "/01/01");
					var rty = rd.getFullYear();
					var monthInterval = scope.getMonthInterval(d,rd);
					if(monthInterval>11){
						monthInterval = 11;
					}
					var selectV = [{key:"month",value:"月份"}];
					for(var i=0; i<=monthInterval; i++){
						if(m==0){
							y--;
							m=12;
							selectV.push({
								key : m,
								addition : y,
								value : y+"年"+m+'月'
							});
							m--;
						}else{
							selectV.push({
								key : m,
								addition : y,
								value : y+"年"+m+'月'
							});
							m--;
						}
						if(rty > y){
							break;
						}
					}
					scope.selectMonthData = selectV;
					scope.currentMonth  = selectV[0];
    			}
    			
    			scope.setDateRange = function(a,b,callback){
    				var displayValue = "";
    				if(a && b){
            			displayValue =a+"~"+b;
    				}else if(a){
    					displayValue =a+"~"+a;
    				}else{
    					//显示上个月整月的日期
    					var date = new Date();
    					var year = date.getFullYear()
    					var month = date.getMonth();
    					displayValue = scope.getFirstAndLastMonthDay(year, month);
    				}
    				scope.displayValue = displayValue;
    				scope.start = scope.displayValue.split("~")[0];
    				scope.end = scope.displayValue.split("~")[1];
    				scope.start_end = scope.start + sign + scope.end;
    				if (!callback) {
		            	if(angular.isFunction(scope.syndata)){
		            		scope.syndata()(scope.displayValue);
		            	}
					}
    			}
    			//初始化入口
    			scope.setMonthSelect();
    			
    			scope.$watch('dateRange', function(event, report) {
    				if(scope.dateRange){
        				var dates = scope.dateRange.split("~");
        				if(dates[0] == dates[1]){
        					scope.setDateRange(dates[0],undefined,true);
        				}else{
        					scope.setDateRange(dates[0],dates[1],true);
        				}
        			}else{
        				scope.setDateRange(undefined,undefined,true);
        			}
                });
    			
    			scope.changeStart=function(start){
    				scope.start = start;
    			}
    			scope.changeEnd=function(end){
    				scope.end = end;
    			}
		    }
    	}
    }]);
});
