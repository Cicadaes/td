angular.module('wreport.app').directive('tdDateCondition', function (CommonService) {
    return {
        restrict: 'EA',
        scope: {
            limitFirstDate: "=",
            formatDateNumber: "=",
            initDateRangeValue: "=",
            dayOperationStatus: "=",
            fastSelectDays: "=",
            startDate: "=",
            endDate: "=",
            dateRange: "=",
            tdChange: "&",
            conditionType: "="  // 此参数决定页面是否根据时间控件初始化页面，如果值为“main”则代表根据时间控件初始化页面，否则不是
        },
        templateUrl: "libs/calender/TdCalendar/template/td-date-condition.html",
        controller: function ($scope, $state) {
            $scope.util = TD.base.util;
            var mapper = {
                'english': 'en_US',
                'chinese': 'zh_CN'
            }
            $scope.lan = mapper[appConfig.language];

            var hideFunc = function (e) {
                $scope.panel_show = false;
                CommonService.refreshAngular($scope);
            };

            setTimeout(function () {
                $('body').on('click', hideFunc);
            });

            $scope.$on("$destroy", function () {
                $('body').off('click', hideFunc);
            });

            $scope.day_pick_click = function (e) {
                e.stopPropagation();
            }
        },
        link: function (scope, elem, attrs) {
            var sign = "~";
            //工具
            scope.getDataStr = function (day, month, year) {
                var dd = new Date();
                dd.setDate(dd.getDate() + (day ? day : 0));
                dd.setMonth(dd.getMonth() + (month ? month : 0));
                dd.setFullYear(dd.getFullYear() + (year ? year : 0));
                return scope.simpleFormat(dd);
            };
            scope.simpleFormat = function (date) {
                var y = date.getFullYear();
                var m = date.getMonth() + 1;
                if ((m + "").length == 1) {
                    m = "0" + m;
                }
                var d = date.getDate();
                if ((d + "").length == 1) {
                    d = "0" + d;
                }
                return y + "-" + m + "-" + d;
            };
            if (appConfig.ProductOption && appConfig.ProductOption.registertime) {
                var d = new Date(appConfig.ProductOption.registertime);
                d.setDate(d.getDate() - 1);
                scope.minDate = scope.simpleFormat(d);
                scope.maxDate = scope.getDataStr();
            }
            scope.changeDate = function (day, month, year) {
                scope.panel_show = false;
                if (day) {
                    if (parseInt(day) >= -1) {
                        day = parseInt(day);
                    } else {
                        day = parseInt(day) + 1;
                    }
                }
                if (month) {
                    month = parseInt(month);
                }
                if (year) {
                    year = parseInt(year);
                }
                var startData = scope.getDataStr(day-1, month, year);
                if (day >= -1 && !month && !year) {
                    scope.setDateRange(startData);
                } else {
                    var endData = scope.getDataStr(-1, 0, 0);
                    scope.setDateRange(startData, endData);
                }
            }
            scope.getTodayDate = function () {
                var today = '';
                var myDate = new Date();
                var fullYear = myDate.getFullYear();
                var month = myDate.getMonth() + 1;
                var date = myDate.getDate();
                today = fullYear + '-' + month + '-' + date;
                return today;
            },

                scope.panel_show = false;
            scope.showCalendar = function (e) {
                e.stopPropagation();
                scope.panel_show = !scope.panel_show;

                setTimeout(function () {
                    var today = scope.getTodayDate();
                    var firstDisable = "";
                    if (scope.limitFirstDate) {
                        firstDisable = scope.getDataStr(scope.limitFirstDate);
                    }
                    var lastDisable = today;
                    if (attrs.noLastDate) {
                        lastDisable = "";
                    }

                    var mapper = {
                        'english': 'en_US',
                        'chinese': 'zh_CN'
                    }
                    var lan = mapper[appConfig.language];

                    scope.calendar = new TD.ui.Calendar("#calendar", {
                        number: 2,//多日历
                        intervals: true,//时段选择
                        date: {start: scope.start, end: scope.end},
                        disable: {
                            first: firstDisable,
                            last: lastDisable,
                        },
                        dayOperationStatus: scope.dayOperationStatus,
                        format: "yyyy-MM-dd",//日期格式
                        uiStyle: "TD_",//样式,
                        language: lan,//语言
                        preNextMonthButton: {
                            pre: true,
                            next: true
                        }
                    });
                    $(scope.calendar).on("selectDay", function (e, msg) {
                        if (msg && msg.status == 'disable') {
                            return false;
                        }
                        scope.start = msg.date.start;
                        scope.end = msg.date.end;
                        $(".displayTime").val(scope.start + sign + scope.end);
                    });
                }, 100);

                if (window.parent && window.parent.iFrameScrollHeight) {
                    window.setTimeout(window.parent.iFrameScrollHeight, 200);
                }
            }
            scope.changeDateRange = function () {
                scope.panel_show = false;
                var s = angular.copy(scope.start);
                var e = angular.copy(scope.end);
                if (s && e) {
                    //var sd = scope.simpleFormat(new Date(s));
                    //var ed = scope.simpleFormat(new Date(e));
                    scope.setDateRange(s, e);
                }
            }
            scope.cancelPanel = function () {
                scope.panel_show = false;
            }
            scope.getFirstAndLastMonthDay = function (year, month) {
                var firstdate = year + '-' + month + '-01';
                var day = new Date(year, month, 0);
                var lastdate = year + '-' + month + '-' + day.getDate();//获取当月最后一天日期

                return firstdate + "~" + lastdate;
            };
            scope.monthChange = function (month) {
                var monthStr = "01";
                var year = month.addition;
                if ((month.key + "").length == 1) {
                    monthStr = "0" + month.key;
                } else {
                    monthStr = month.key + "";
                }
                var range = scope.getFirstAndLastMonthDay(year, monthStr);
                var dates = range.split("~");
                scope.setDateRange(dates[0], dates[1]);
            };
            //获取两个日期的月份差
            scope.getMonthInterval = function (d1, d2) {
                var dateStr1 = scope.simpleFormat(d1);
                var dateStr2 = scope.simpleFormat(d2);
                dateStr1 = dateStr1.split('-');
                dateStr1 = parseInt(dateStr1[0]) * 12 + parseInt(dateStr1[1]);
                dateStr2 = dateStr2.split('-');
                dateStr2 = parseInt(dateStr2[0]) * 12 + parseInt(dateStr2[1]);
                return Math.abs(dateStr1 - dateStr2);
            };
            //月份下来框
            scope.setMonthSelect = function () {
                var d = new Date();
                var y = d.getFullYear();
                var m = d.getMonth() + 1;
                if (appConfig.ProductOption && appConfig.ProductOption.registertime) {
                    var rd = new Date(appConfig.ProductOption.registertime);
                    var rty = rd.getFullYear();
                    var monthInterval = scope.getMonthInterval(d, rd);
                    if (monthInterval > 11) {
                        monthInterval = 11;
                    }
                    var selectV = [{key: "month", value: "月份"}];
                    for (var i = 0; i <= monthInterval; i++) {
                        if (m == 0) {
                            y--;
                            m = 12;
                            selectV.push({
                                key: m,
                                addition: y,
                                value: y + "年" + m + '月'
                            });
                            m--;
                        } else {
                            selectV.push({
                                key: m,
                                addition: y,
                                value: y + "年" + m + '月'
                            });
                            m--;
                        }
                        if (rty > y) {
                            break;
                        }
                    }
                    scope.selectMonthData = selectV;
                    scope.currentMonth = selectV[0];
                }
            }
            //约束时间必须小于等于产品注册时间
            scope.dateLimit = function (dateRange) {
                var dates = dateRange.split("~");
                var sd = dates[0];
                var ed = dates[1];
                var td = new Date();
                td = scope.simpleFormat(td);
                if (appConfig.ProductOption && appConfig.ProductOption.registertime) {
                    var rd = new Date(appConfig.ProductOption.registertime);
                    rd = scope.simpleFormat(rd);
                    if (td < rd) {   //防止系统时间不正确
                        td = rd;
                    }
                    if (sd < rd) {
                        sd = rd;
                    }
                    if (ed > td) {
                        ed = td;
                    }
                    if (sd > ed) {
                        ed = sd;
                    }
                    return sd + "~" + ed;
                } else {
                    return dateRange;
                }
            }

            scope.newDate = function (str) {
                str = str.split('-');
                var date = new Date();
                date.setUTCFullYear(str[0], str[1] - 1, str[2]);
                date.setUTCHours(0, 0, 0, 0);
                return date;
            }

            scope.datetime_to_unix = function (datetime) {
                //datetime = datetime + ' 00:00:00';
                //alert(scope.newDate(datetime));
                var timestamp = Date.parse(scope.newDate(datetime));//Date.parse(new Date(datetime));
                //timestamp = timestamp / 1000;
                //console.log(datetime + "的时间戳为：" + timestamp);
                return timestamp;
            }

            scope.datetime_to_number = function (datetime) {
                var dateNum = '';
                if (datetime) {
                    var dateAttr = datetime.split("-");
                    if (dateAttr[0] && dateAttr[1] && dateAttr[2]) {
                        dateNum = dateAttr[0].toString() + dateAttr[1].toString() + dateAttr[2].toString();
                    }
                }
                return dateNum
            }

            scope.setDateRange = function (a, b, noBroadcast) {
                var displayValue = "";
                if (a && b) {
                    displayValue = a + "~" + b;
                } else if (a) {
                    displayValue = a + "~" + a;
                } else {
                    var startData = scope.getDataStr(0, -1);
                    var endData = scope.getDataStr();
                    displayValue = startData + "~" + endData;
                }
                scope.displayValue = scope.dateLimit(displayValue);
                scope.start = scope.displayValue.split("~")[0];
                scope.end = scope.displayValue.split("~")[1];
                scope.start_end = scope.start + sign + scope.end;
                //DataRangeService.setDateRange(scope.displayValue,noBroadcast);
                if (angular.isFunction(scope.tdChange)) {
                    var start = '';
                    var end = '';
                    if (scope.formatDateNumber) {
                        start = scope.datetime_to_number(scope.start);
                        end = scope.datetime_to_number(scope.end);
                    } else {
                        start = scope.datetime_to_unix(scope.start);
                        end = scope.datetime_to_unix(scope.end);
                    }
                    scope.tdChange()(start, end);
                }

            }

            scope.initDateRange = function () {
                scope.displayValue = '';
                scope.start = '';
                scope.end = '';
                scope.start_end = '';

                scope.setMonthSelect();
                var range = '';//DataRangeService.getDateRange();
                var noBroadcast = true;
                if (scope.conditionType == "main") {
                    noBroadcast = false;
                }

                if (scope.initDateRangeValue) {
                    scope.changeDate(scope.initDateRangeValue);
                }

                /*if(range){
                 var dates = range.split("~");
                 if(dates[0] == dates[1]){
                 scope.setDateRange(dates[0],undefined,noBroadcast);
                 }else{
                 scope.setDateRange(dates[0],dates[1],noBroadcast);
                 }
                 }else{
                 scope.setDateRange(undefined,undefined,noBroadcast);
                 }*/
            }

            scope.changeStart = function (start) {
                scope.start = start;
            }
            scope.changeEnd = function (end) {
                scope.end = end;
            }

            scope.$watch('startDate', function () {
                if (!scope.startDate && !scope.endDate) {
                    scope.initDateRange();
                } else if (!scope.start && !scope.end) {
                    scope.start = scope.formatDate(scope.startDate);
                    scope.end = scope.formatDate(scope.endDate);
                    scope.displayValue = scope.start + '~' + scope.end;
                    scope.start_end = scope.start + sign + scope.end;
                } else if (scope.startDate && scope.endDate) {
                    scope.start = scope.formatDate(scope.startDate);
                    scope.end = scope.formatDate(scope.endDate);
                    scope.displayValue = scope.start + '~' + scope.end;
                    scope.start_end = scope.start + sign + scope.end;
                }
            });
            /*scope.$watch('endDate', function(){
             if(!scope.startDate && !scope.endDate){
             scope.initDateRange();
             }
             });*/

            scope.formatDate = function (d) {
                var formatStr = "";
                if (d) {
                    var sign = '-';
                    if (d.length == 8) {
                        var year = d.substr(0, 4);
                        var month = d.substr(4, 2);
                        var day = d.substr(6, 2);
                        formatStr = year + sign + month + sign + day;
                    } else {
                        var myDate = new Date(parseFloat(d));
                        var fullYear = myDate.getFullYear();
                        var month = myDate.getMonth() + 1;
                        var date = myDate.getDate();
                        var hours = myDate.getHours();       //获取当前小时数(0-23)
                        var minutes = myDate.getMinutes();     //获取当前分钟数(0-59)
                        var seconds = myDate.getSeconds();     //获取当前秒数(0-59)
                        //myDate.getMilliseconds();    //获取当前毫秒数(0-999)
                        if (sign == undefined) {
                            sign = '';
                        }
                        if (month < 10) {
                            month = '0' + month;
                        }
                        if (date < 10) {
                            date = '0' + date;
                        }
                        if (hours < 10) {
                            hours = '0' + hours;
                        }
                        if (minutes < 10) {
                            minutes = '0' + minutes;
                        }
                        if (seconds < 10) {
                            seconds = '0' + seconds;
                        }
                        formatStr = fullYear + sign + month + sign + date;
                        //formatStr = formatStr + ' ' + hours + ':' + minutes + ':' + seconds;
                    }
                }
                return formatStr;
            }

            //初始化入口
            scope.initDateRange();
        }
    };
})
