angular.module('wreport.app').directive('tdWeekMonthPicke', function () {
    return {
        restrict: 'EA',
        scope: {
            fastSelectDays: "=",
            fastDayEnd: "=",
            formatDateNumber: "=",
            startDate: "=",
            endDate: "=",
            dateType: "=",
            tdChange1: "&",
        },
        templateUrl: "libs/calender/TdCalendar/template/td-week_month-picke.html",
        link: function (scope, elem, attrs) {

            scope.$watch('dateType', function () {
                scope.dateType
                scope.init();
            }, true);
            scope.newDate = function (str) {
                if (str) {
                    if (str.indexOf("/") != -1) {
                        str = str.split('/');
                    } else if (str.indexOf("-") != -1) {
                        str = str.split('-');
                    }
                }
                var date = new Date();
                date.setUTCFullYear(str[0], str[1] - 1, str[2]);
                date.setUTCHours(0, 0, 0, 0);
                return date;
            }

            scope.datetime_to_unix = function (datetime) {
                var timestamp = Date.parse(scope.newDate(datetime));
                return timestamp;
            }

            scope.datetime_to_number = function (datetime) {
                var dateNum = '';
                if (datetime) {
                    var dateAttr = datetime.split("/");
                    if (dateAttr[0] && dateAttr[1] && dateAttr[2]) {
                        dateNum = dateAttr[0].toString() + dateAttr[1].toString() + dateAttr[2].toString();
                    }
                }
                return dateNum;
            }

            scope.showCalendar = function () {
                if (window.parent && window.parent.iFrameScrollHeight) {
                    window.setTimeout(window.parent.iFrameScrollHeight, 200);
                }
            }

            scope.getTodayDate = function () {
                var today = '';
                var myDate = new Date();
                var fullYear = myDate.getFullYear();
                var month = myDate.getMonth() + 1;
                var date = myDate.getDate();
                if (month < 10) {
                    month = '0' + month;
                }
                if (date < 10) {
                    date = '0' + date;
                }
                today = fullYear + '/' + month + '/' + date;
                return today;
            }

            scope.changeDateValues = function (msg) {
                var response = {
                    start: '',
                    end: '',
                    type: ''
                };
                if (msg && msg.type && msg.date) {
                    if (msg.type == 'day') {
                        response = {
                            start: msg.date.start,
                            end: msg.date.end,
                            type: 'day'
                        };
                    } else if (msg.type == 'month') {//date
                        var date = "";
                        var day = "";
                        var attr;
                        if (msg.date) {
//                            if (msg.date.indexOf("/") != -1) {
//                                attr = msg.date.split("/");
//                                if (attr[2]) {
//                                    day = attr[2];
//                                } else {
//                                    day = "01";
//                                }
//                                date = attr[0] + "/" + attr[1] + "/" + day;
//
//                                var dateEndLong = Date.parse(date, 'yyyy/MM/dd');
//                                dateEndLong += 86400000 * 29;
//
//                                var month = attr[1];
//                                if (month == '01' || month == '03' || month == '05' || month == '07' || month == '08' || month == '10' || month == '12') {
//                                    dateEndLong += 86400000;
//                                } else if (month == '02') {
//
//                                    if (parseInt(attr[0]) % 4 == 0) {
//                                        dateEndLong -= 86400000 * 1;
//                                    } else {
//                                        dateEndLong -= 86400000 * 2;
//                                    }
//                                }
//
//                                var dateEnd = new Date(dateEndLong).Format('yyyy/MM/dd');

                            response = {
                                start: msg.date.start,
                                end: msg.date.end,
                                type: 'month'
                            };
//                            }
                        }

                    } else if (msg.type == "week") {
                        if (msg.date) {
                            response = {
                                start: msg.date.start,
                                end: msg.date.end,
                                type: 'week'
                            };

                        }

                    }
                }
                return response;
            }

            scope.getMonth = function (today) {
                var month = "";
                var attr;
                if (today) {
                    if (today.indexOf("/") != -1) {
                        attr = today.split("/");
                    } else if (today.indexOf("-") != -1) {
                        attr = today.split("-");
                    }
                    month = attr[0] + '/' + attr[1];
                }
                return month;
            }
            scope.LeapPingnian = function (year) {//判断是不是平年闰年 true=>代表闰年 false=>平年
                if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0) {
                    return true;
                } else {
                    return false;
                }
            }
            scope.getWeek = function (today) {
                var dt = new Date(today);
                var week = dt.getDay();
                var year = dt.getFullYear();
                var num = scope.LeapPingnian(year) ? 366 : 365;
                if (week === 0) week = 7;
                return Math.ceil((num - week) / 7.0);
            }

            scope.formatDateStr = function (d) {
                var formatStr = "";
                if (d) {
                    var sign = '/';
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
                return formatStr;
            }

            scope.formatDate = function (date) {
                var formatDate = "";
                if (date) {
                    date = date.toString();
                    if (date.indexOf("/") != -1) {
                        formatDate = date;
                    } else if (date.indexOf("-") != -1) {
                        var attr = date.split("-");
                        formatDate = attr[0] + "/" + attr[1] + "/" + attr[2];
                    } else {
                        formatDate = scope.formatDateStr(date);
                    }
                }
                return formatDate;
            };

            scope.initCalendarValues = function () {
                if (scope.startDate && scope.endDate) {
                    if(scope.dateType == "month"){
                        var start = scope.formatDate(scope.startDate);
                        var end = scope.formatDate(scope.endDate);
                        var start1 = new Date(scope.startDate).Format('yyyy-MM');
                        var end1 = new Date(scope.endDate).Format('yyyy-MM');
                        scope.responeDate = {
                            start: start,
                            end: end,
                            displayValue: scope.formatDateLine(start1, '-') + "~" + scope.formatDateLine(end1, '-')
                        };
                    }else {
                        var start = scope.formatDate(scope.startDate);
                        var end = scope.formatDate(scope.endDate);
                        scope.responeDate = {
                            start: start,
                            end: end,
                            displayValue: scope.formatDateLine(start, '-') + "~" + scope.formatDateLine(end, '-')
                        };
                    }

                }
            };

            scope.formatDateLine = function (date, sign) {
                var fDate = date;
                if (date) {
                    if (date.indexOf("/") != -1) {
                        var attr = date.split("/");
                        fDate = attr[0] + sign + attr[1] + sign + attr[2];
                    }
                }
                return fDate;
            }

            var hideFunc = function (e) {
                $('.DatePicke').hide();
            };

            setTimeout(function () {
                $('body').on('click', hideFunc);
            });

            scope.$on("$destroy", function () {
                $('body').off('click', hideFunc);
            });

            scope.initDateWeekMonthPicke = function () {
                scope.initCalendarValues();
                var $elem = $(elem);
                $elem.find(".DatePicke").remove();

                var today = scope.getTodayDate();
                var week = scope.getWeek(scope.responeDate.start);
                //debugger
                var month = scope.responeDate.start.substr(0, 7);
                if (attrs.disableCurMonth) {
                    var date = new Date();
                    today = date.getFullYear() + '/' + date.getMonth() + '/01';
                }
                // var dateType = 'day';
                // if (attrs.dateType) {
                //     dateType = attrs.dateType;
                // }
                var dateType = 'day';
                dateType = scope.dateType;

                var mapper = {
                    'english': 'en_US',
                    'chinese': 'zh_CN'
                }
                var lan = mapper[appConfig.language];

                var calendar = new TD.ui.TD_Day_week_monthPicke($elem, {
                    number: 2,//多日历
                    intervals: true,//时段选择
                    dayOperationStatus: false,
                    type: dateType,
                    language: lan

                    , dayCalendar: {
                        language: lan,
                        date: {//当前选中日期
                            start: scope.responeDate.start
                            , end: scope.responeDate.end
                        },
                        dayOperationStatus: false
                    }
                    , weekCalendar: {
                        week: week,//当前选中周,
                        date: {
                            start: scope.responeDate.start
                            , end: scope.responeDate.end
                        },
                        number: 2,//多日历
                        intervals: true,//时段选择
                    }
                    , monthCalendar: {
                        date: {
                            start: scope.responeDate.start
                            , end: scope.responeDate.end
                        }//当前选中月
                    }
                    , disable: {
                        first: "2015/01/01",
                        last: today
                    },
                    fastSelectDays: scope.fastSelectDays,
                    fastDayEnd: scope.fastDayEnd || 0
                }, true);

                $(calendar).on("confirm shortCut", function (e, msg) {
                    var response = scope.changeDateValues(msg);
                    if (response && response.start && response.end) {
                        scope.$apply(function () {

                            scope.responeDate = {
                                start: response.start,
                                end: response.end,
                                displayValue: scope.formatDateLine(response.start, '-') + "~" + scope.formatDateLine(response.end, '-')
                            };
                            if (angular.isFunction(scope.tdChange1)) {
                                var start = response.start;
                                var end = response.end;
                                if (scope.formatDateNumber) {
                                    start = scope.datetime_to_number(response.start);
                                    end = scope.datetime_to_number(response.end);
                                } else {
                                    start = scope.datetime_to_unix(response.start);
                                    end = scope.datetime_to_unix(response.end);
                                }
                                scope.tdChange1()(start, end, msg.type);
                            }
                        });
                    }
                })
            }

            scope.$watch('startDate', function () {
                scope.initDateWeekMonthPicke();
            });

            scope.init = function () {
                scope.responeDate = {
                    start: "",
                    end: "",
                    displayValue: ""
                };
                scope.initDateWeekMonthPicke();
            }


        }
    };
});
