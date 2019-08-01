var $ = require('jquery');
var util = require('./util');
var Calendar = require('./calendar_base')
var TD_MonthPicke = require('./month');
var TD_WeekPicke = require('./week');

function getFormatDate(str) {
    return str.getFullYear() + '/' + (parseInt(str.getMonth()) + 1) + '/' + str.getDate();
}
//判断当前日期为当年第几周
var getYearWeek = function(a, b, c) {
    //date1是当前日期
    //date2是当年第一天
    //d是当前日期是今年第多少天
    //用d + 当前年的第一天的周差距的和在除以7就是本年第几周
    var date1 = new Date(a, parseInt(b) - 1, c),
        date2 = new Date(a, 0, 1),
        d = Math.round((date1.valueOf() - date2.valueOf()) / 86400000);
        var e = Math.ceil((d + ((date2.getDay() + 1) - 1)) / 7) + 1;
        if(e < 10){
            e = "0" + e;
        }
    return e;
};
var defaults = {
        type: "day", //"day"/"week"/"month"
        dayCalendar: {
            dayOperationStatus: false
        },
        weekCalendar: {
            //            dayOperationStatus: false
            preNextMonthButton: {
                "1": {
                    next: false
                },
                "2": {
                    pre: false
                }
            }
        },
        monthCalendar: {
            preNextMonthButton: {
                "1": {
                    next: false
                },
                "2": {
                    pre: false
                }
            }
        },
        format: "yyyy/MM/dd",
        language: "zh_CN"
    },
    ReloadDom, Operation;
ReloadDom = {
    init: function(opt) {
            if (opt.type)
                var fastSelectDaysDefault;
            switch (opt.type) {
                case "week":
                    fastSelectDaysDefault = [{
                            key: '1',
                            label: '上周'
                        },
                        {
                            key: '4',
                            label: '近4周'
                        },
                        {
                            key: '8',
                            label: '近8周'
                        },
                        {
                            key: '16',
                            label: '近16周'
                        }
                    ];
                    break;
                case "month":
                    fastSelectDaysDefault = [{
                            key: '1',
                            label: '上月'
                        }, {
                            key: '3',
                            label: '近3个月'
                        },
                        {
                            key: '6',
                            label: '近6个月'
                        },
                        {
                            key: '12',
                            label: '近12个月'
                        }
                    ];
                    break;
                default:
                    fastSelectDaysDefault = [{
                            key: '0',
                            label: '昨日'
                        }, {
                            key: '6',
                            label: '近7天'
                        }, {
                            key: '29',
                            label: '近30日'
                        },
                        {
                            key: '89',
                            label: '近90日'
                        }
                    ];
                    break;
            }
            var fastSelectDays = [];
            if (opt.fastSelectDays && opt.fastSelectDays.length > 0) {
                fastSelectDays = opt.fastSelectDays;
            } else {
                fastSelectDays = fastSelectDaysDefault;
            }

            var fastDaysHtml = '';
            for (var i = 0; i < fastSelectDays.length; i++) {
                fastDaysHtml += '<a href="javascript:;" data-type="' + fastSelectDays[i].key + '" class="">' + fastSelectDays[i].label + '</a>';
            }

            var lan = opt.language;;
            var html = '<div class="DatePicke" style="display: none;">' +
                '<div class="DatePicke_tool">' +
                '<span class="DatePicke_tools_datetype">';

            if (opt.type == 'day') {
                html += '<a style="display:none;" href="javascript:void(0)" data-type="day" ' + (opt.type == 'day' ? 'class="choolse"' : '') + '>' + util.language(lan, "recent") + '</a>'
            }
            if (opt.type == 'week') {
                html += '<a style="display:none;" href="javascript:void(0)" data-type="week" ' + (opt.type == 'week' ? 'class="fl"' : '') + '> 时期 </a>'
            }
            if (opt.type == 'month') {
                html += '<a style="display:none;" href="javascript:void(0)" data-type="month" ' + (opt.type == 'month' ? 'class="fl"' : '') + '> 时期 </a></span>'
            }
            html += '</span>';
            html += '<span class="date-picke-label"';


            html += '>' +
                '<i class="glyphicon glyphicon-calendar"> </i>' +
                '<b class="display-time"></b>' +
                '</span>' +
                '<span class="DatePicke_tool_shortcut">' +
                fastDaysHtml +
                '</span></div>' +
                '<div class="DatePicke_content">' +
                '<div data-type="day_con"></div>' +
                '<div data-type="week_con"></div>' +
                '<div data-type="month_con"></div>' +
                '</div>' +
                '<div class="DatePicke_operation">' +
                '<a href="javascript:void(0)" data-type="confirm" class="TD_WeekPicke_Confirm">' + util.language(lan, "Confirm") + '</a>' +
                '<a href="javascript:void(0)" data-type="cancle" class="TD_WeekPicke_cancle">' + util.language(lan, "Cancel") + '</a>' +
                '</div><div>';
            return $(html);
        }
        /**
         * 设置日历位置
         * @param example
         */
        ,
    datePickePosition: function(example, isInner) {
        example.$html.css("position", "absolute");
        var $target = example.o.$target,
            $html = example.$html,
            top = $target.offset().top,
            left = $target.offset().left,
            wW = $(document).width(),
            wH = $(document).height(),
            tW = $target.innerWidth(),
            tH = $target.innerHeight(),
            oW = $html.innerWidth(),
            oH = $html.innerHeight(),
            oL, oT;
        if (wW - left >= oW) {
            oL = left;
        } else {
            oL = left + tW - oW;
        }
        if (wH - (top + tH) >= oH) {
            oT = top + tH;
        } else {
            oT = top - oH;
        }
        if (isInner) {
            if (wW - left >= oW) {
                $html.css({
                    left: "0px",
                    top: tH + "px"
                });
            } else {
                $html.css({
                    right: "0px",
                    top: tH + "px"
                });
            }

        } else {
            $html.css({
                right: "0px",
                top: oT + "px"
            });
        }
    }
};
Operation = {
    init: function(myThis, isInner) {
        var example = $.extend(false, {}, myThis);
        example.$html = ReloadDom.init(example.o);
        if (isInner) {
            var $target = example.o.$target;
            $target.append(example.$html);
        } else {
            $("body").append(example.$html);
        }

        this.reloadCalendar(example);
        this.eventBind(example, myThis, isInner);
        if (example.o.type == 'day') {
            $('.DatePicke_tool_shortcut a:eq('+example.o.defaultIndex+')').click();
        } else if (example.o.type == 'week') {
            $('.DatePicke_tool_shortcut a:eq('+example.o.defaultIndex+')').click();
        } else {
            $('.DatePicke_tool_shortcut a:eq('+example.o.defaultIndex+')').click();
        }

        $(example.$html).find(".DatePicke_operation a").click();
    },
    reloadCalendar: function(example) {

        var $conTarget = $(example.$html).find(".DatePicke_content"),
            $shortcut = $(example.$html).find(".DatePicke_tool_shortcut"),
            $target = $conTarget.find("[data-type='day_con']");
        $conTarget.children("div").hide();
        switch (example.o.type) {
            case "week":
                //                    $shortcut.hide();
                $target = $conTarget.find("[data-type='week_con']");
                this.reloadWeek(example, $target);
                if (example.o && example.o.weekCalendar && example.o.weekCalendar.date && example.o.weekCalendar.date.start && example.o.weekCalendar.date.end) {
                    var html = example.o.weekCalendar.date.start + "~" + example.o.weekCalendar.date.end;
                    $(example.$html).find(".display-time").html(html);
                }
                break;
            case "month":
                //                    $shortcut.hide();
                $target = $conTarget.find("[data-type='month_con']");
                this.reloadMonth(example, $target);
                if (example.o && example.o.monthCalendar && example.o.monthCalendar.date && example.o.monthCalendar.date.start && example.o.monthCalendar.date.end) {
                    var html = example.o.monthCalendar.date.start + "~" + example.o.monthCalendar.date.end;
                    $(example.$html).find(".display-time").html(html);
                }
                break;
            default:
                $shortcut.show();
                this.reloadDay(example, $target);
                // $(example).trigger("selectDay", [msg]);
                if (example.o && example.o.dayCalendar && example.o.dayCalendar.date && example.o.dayCalendar.date.start && example.o.dayCalendar.date.end) {
                    var html = this.formatDateLine(example.o.dayCalendar.date.start, '-') + "~" + this.formatDateLine(example.o.dayCalendar.date.end, '-');
                    $(example.$html).find(".display-time").html(html);
                }
                break;
        }
        $target.show();
    },
    formatDateLine: function(date, sign) {
        var fDate = date;
        if (date) {
            if (date.indexOf("/") != -1) {
                var attr = date.split("/");
                fDate = attr[0] + sign + attr[1] + sign + attr[2];
            }
        }
        return fDate;
    },
    reloadDay: function(example, target) {
        ////debugger
        if (!example.dayCalendar) {
            //console.dir([example.o.dayCalendar]);
            example.dayCalendar = new Calendar(target, example.o.dayCalendar);
        }
    },
    reloadWeek: function(example, target) {
        //debugger
        if (!example.weekCalendar) {
            example.weekCalendar = new TD_WeekPicke(target, example.o.weekCalendar);
            $(example.weekCalendar).on("selectWeek", function(e, msg) {
                example.o.weekCalendar.week = msg.week;
                example.o.weekCalendar.val = msg.val;

            });
        }


    }

    ,
    reloadMonth: function(example, target) {
        if (!example.monthCalendar) {
            example.monthCalendar = new TD_MonthPicke(target, example.o.monthCalendar);
            $(example.monthCalendar).on("selectMonth", function(e, msg) {
                example.o.monthCalendar.date = msg;
            })
        }
    },
    eventBind: function(example, myThis, isInner) {
        var _this = this;
        $(example.o.$target).on("click", function(e) {
            _this.reloadCalendar(example);
            $(example.$html).show();
            ReloadDom.datePickePosition(example, isInner);
            if (example.o.type == 'month') {
                $('.TD_MonthPicke_MonthList .chooes:eq(0)').addClass('special-choice');
                $('.TD_MonthPicke_MonthList .chooes:last').addClass('special-choice');
            }
            e.stopPropagation();
        });
        //快捷选取事件
        $(example.$html).on("click", ".DatePicke_tool_shortcut a", function(e) {
            var $target = $(e.target),
                type = $target.data("type");
            $target.addClass("choolse").siblings().removeClass("choolse");
            switch (example.o.type) {
                case "week":
                    //debugger
                    _this.setWeekDate(example, type);
                    example.weekCalendar.setWeek(example);
                    break;
                case "month":
                    _this.setMonthDate(example, type);
                    example.monthCalendar.renderMonthPicke(example);
                    example.monthCalendar.selectMonth(example);
                    break;
                default:
                    _this.setDayDate(example, type);
                    break;
            }

            //$(example.$html).find(".DatePicke_operation .TD_WeekPicke_Confirm").click();
            //$(example.$html).hide();
            $(example.$html).parent().siblings(".DatePicke_tool").addClass("hide");
            var msg = {
                    type: example.o.type,
                    date: example.date
                }
                //????????date没有赋值成功
                ////debugger
            $(example).trigger("shortCut", [msg]);
            e.stopPropagation();
        });
        //***********点击确定取消***********
        $(example.$html).on("click", ".DatePicke_operation a", function(e) {
            //debugger
            var $target = $(e.target),
                type = $target.data("type"),
                msg = {
                    type: example.o.type
                };
            if (type == "confirm") {
                switch (msg.type) {
                    case "week":
                        //debugger
                        if (example.weekCalendar.selectedWeek.length >= 2) {
                            var time1 = (new Date(example.weekCalendar.selectedWeek[0].val.split("-")[0])).getTime(),
                                time2 = (new Date(example.weekCalendar.selectedWeek[1].val.split("-")[1])).getTime();

                            var sIndex = time1 > time2 ? 1 : 0;

                            var sYear = example.weekCalendar.selectedWeek[sIndex].val.split("-")[0].split('/')[0];
                            var eYear = example.weekCalendar.selectedWeek[1 - sIndex].val.split("-")[1].split('/')[0];
                            var weekStart = example.weekCalendar.selectedWeek[sIndex].week.length > 2 ? example.weekCalendar.selectedWeek[sIndex].week : sYear + '-' + example.weekCalendar.selectedWeek[sIndex].week;
                            var weekEnd = example.weekCalendar.selectedWeek[1 - sIndex].week.length > 2 ? example.weekCalendar.selectedWeek[1 - sIndex].week : eYear + '-' + example.weekCalendar.selectedWeek[1 - sIndex].week;
                            msg.date = {
                                start: example.weekCalendar.selectedWeek[sIndex].val.split("-")[0],
                                end: example.weekCalendar.selectedWeek[1 - sIndex].val.split("-")[1],
                                weekStart: weekStart,
                                weekEnd: weekEnd
                            };

                            example.o.weekCalendar.date = msg.date;
                            msg.val = example.o.weekCalendar.val;
                            msg.week = example.o.weekCalendar.week;
                            if (TD_Day_week_monthPicke.cb) {
                                TD_Day_week_monthPicke.cb(msg.date);
                            }
                        } else if (example.weekCalendar.selectedWeek.length == 1) {
                            //debugger
                            var sYear = example.weekCalendar.selectedWeek[0].val.split("-")[0].split('/')[0];
                            var weekStart = example.weekCalendar.selectedWeek[0].week.length > 2 ? example.weekCalendar.selectedWeek[0].week : sYear + '-' + example.weekCalendar.selectedWeek[0].week;

                            msg.date = {
                                start: example.weekCalendar.selectedWeek[0].val.split("-")[0],
                                end: example.weekCalendar.selectedWeek[0].val.split("-")[1],
                                weekStart: weekStart,
                                weekEnd: weekStart
                            };

                            example.o.weekCalendar.date = msg.date;
                            msg.val = example.o.weekCalendar.val;
                            msg.week = example.o.weekCalendar.week;
                            if (TD_Day_week_monthPicke.cb) {
                                TD_Day_week_monthPicke.cb(msg.date);
                            }
                        } else {
                            $(example.$html).hide();
                        }

                        break;
                    case "month":
                        //debugger
                        if (example.monthCalendar.selectedMonth.length >= 2) {
                            var time1 = (new Date(example.monthCalendar.selectedMonth[0])).getTime(),
                                time2 = (new Date(example.monthCalendar.selectedMonth[1])).getTime();
                            var sIndex = time1 > time2 ? 1 : 0;
                            var dt = new Date(example.monthCalendar.selectedMonth[1 - sIndex]),
                                year = dt.getFullYear(),
                                month = dt.getMonth() - 0 + 1 < 10 ? '0' + (dt.getMonth() - 0 + 1) : dt.getMonth() - 0 + 1;
                            msg.date = {};

                            msg.date.start = example.monthCalendar.selectedMonth[sIndex];
                            msg.date.end = year + '/' + month + '/' + util.MonthHasDay(year, month);
                            example.o.monthCalendar.date = msg.date;
                            var monthArr = msg.date.start.split('/');
                            msg.date.monthStart = monthArr[0] + '-' + monthArr[1];
                            msg.date.monthEnd = year + '-' + month;
                        } else {
                            var dt = new Date(example.monthCalendar.selectedMonth[0]),
                                year = dt.getFullYear(),
                                month = dt.getMonth() - 0 + 1 < 10 ? '0' + (dt.getMonth() - 0 + 1) : dt.getMonth() - 0 + 1;
                            msg.date = {};

                            msg.date.start = example.monthCalendar.selectedMonth[0];
                            msg.date.end = year + '/' + month + '/' + util.MonthHasDay(year, month);
                            var monthArr = msg.date.start.split('/');
                            msg.date.monthStart = monthArr[0] + '-' + monthArr[1];

                            msg.date.monthEnd = year + '-' + month;

                        }
                        if (TD_Day_week_monthPicke.cb) {
                            TD_Day_week_monthPicke.cb(msg.date);
                        }
                        //msg.date = example.o.monthCalendar.date;
                        break;
                    default:
                        //debugger
                        msg.date = $.extend(true, {}, example.dayCalendar.o.date);
                        //console.log(formatDate(msg.date.start), formatDate(msg.date.end), '选中起止日期');
                        if (TD_Day_week_monthPicke.cb) {
                            TD_Day_week_monthPicke.cb(msg.date);
                        }

                        break;
                }

                myThis.o = $.extend(true, {}, example.o);
                $(myThis).trigger("confirm", [msg]);
                $(example.$html).hide();
                $(example.$html).parent().siblings(".calendar-tools").addClass("hide");

            } else {
                example.o = $.extend(true, {}, myThis.o);
                $(example.$html).hide();
                $(example.$html).parent().siblings(".calendar-tools").addClass("hide");
            }

            e.stopPropagation();
        });

    },
    setWeekDate: function(example, num) {
        //debugger
        var _this = this;
        var addDayCount = -((new Date()).getDay());
        var endDate = util.getDateStr(addDayCount),
            weekEnd = {
                val: util.getDateStr(addDayCount - 6) + '-' + endDate
            },
            weekStart = {
                val: util.getDateStr(addDayCount - (num * 7) + 1) + '-' + util.getDateStr(addDayCount - (num - 1) * 7)
            };
        example.selectedWeek = [weekStart, weekEnd];
        example.weekCalendar.selectedWeek = [weekStart, weekEnd];
        example.o.weekCalendar.date = {
            start: util.getDateStr(addDayCount - (num * 7) + 1),
            end: endDate
        };

        var startArr = example.o.weekCalendar.date.start.split('/');
        var endArr = example.o.weekCalendar.date.end.split('/');
        example.weekCalendar.selectedWeek[0].week = startArr[0] + '-' + getYearWeek(startArr[0], startArr[1], startArr[2]);
        example.weekCalendar.selectedWeek[1].week = endArr[0] + '-' + getYearWeek(endArr[0], endArr[1], endArr[2]);
        var html = _this.formatDateLine(util.getDateStr(addDayCount - (num * 7) + 1), '-') + "~" + _this.formatDateLine(endDate, '-');
        $(example.$html).find(".display-time").html(html);

    }

    ,
    setMonthDate: function(example, num) {
        //debugger
        var addDayCount = 0;
        var curMonth = -((new Date()).getMonth());
        var curYear = ((new Date()).getFullYear());
        for (var i = 0; i < num; i++) {
            curMonth--;
            if (curMonth >= 0) {
                addDayCount += util.MonthHasDay(curYear, curMonth + 1);
            } else {
                curMonth = 12;
                addDayCount += util.MonthHasDay(curYear - 1, curMonth);
            }
        }
        addDayCount += ((new Date()).getDate()) - 1;
        var endDate = util.getDateStr(-addDayCount),
            monthEnd = util.getDateStr(-((new Date()).getDate())),
            monthStart = util.getDateStr(-addDayCount);
        example.monthCalendar.selectedMonth = example.selectedMonth = [monthStart, monthEnd];
        //console.log(monthStart, 'monthStart----------');
        //console.log(monthEnd, 'monthStart----------');
        example.yearArr = [monthStart.split('/')[0], monthEnd.split('/')[0]];

        var dt = new Date(example.monthCalendar.selectedMonth[1]),
            year = dt.getFullYear(),
            month = dt.getMonth() - 0 + 1,
            date = {};

        date.start = example.monthCalendar.selectedMonth[0];
        date.end = year + '/' + month + '/' + util.MonthHasDay(year, month);
        example.o.date = example.o.monthCalendar.date = date;

        var html = this.formatDateLine(date.start, '-') + "~" + this.formatDateLine(date.end, '-');
        $(example.$html).find(".display-time").html(html);

    },
    setDayDate: function(example, num) {
        var _this = this;
        var addDayCount = 0;
        if (example.o && example.o.fastDayEnd != null && example.o.fastDayEnd != undefined) {
            addDayCount = example.o.fastDayEnd;
        }
        var endDate = util.getDateStr(addDayCount),
            date = {
                start: util.calculationTime(endDate, -num),
                end: endDate
            };
        date.start = getFormatDate(date.start);
        ////debugger
        /*var endDate = util.formatDate(new Date(), example.o.format)
            , date = {
            start: util.calculationTime(endDate, -num)
            , end: endDate
        };*/
        example.dayCalendar.setDate(date, function(e) {
            //debugger
            if (e.status == "success") {
                example.o.dayCalendar.date = $.extend(true, {}, e.date);
                var html = _this.formatDateLine(e.date.start, '-') + "~" + _this.formatDateLine(e.date.end, '-');
                $(example.$html).find(".display-time").html(html);
            }
        });

    }
};

var TD_Day_week_monthPicke = function(target, opt, isInner, cb) {
    TD_Day_week_monthPicke.cb = cb;
    this.o = $.extend(true, {
        $target: $(target)
    }, defaults, opt);

    var disable = $.extend(true, {}, this.o.disable);
    this.o.dayCalendar.disable = this.o.dayCalendar.disable || disable;
    this.o.weekCalendar.disable = this.o.weekCalendar.disable || disable;
    this.o.monthCalendar.disable = this.o.monthCalendar.disable || disable;

    Operation.init(this, isInner);
};

module.exports = TD_Day_week_monthPicke;