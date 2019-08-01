var $ = require('jquery');
var util = require('./util');

var defaults = { //日历默认参数
        number: 2, //多日历
        intervals: true, //时段选择
        dayOperationStatus: true,
        //format : "yyyy-MM-dd",//日期格式
        uiStyle: "TD_", //样式,
        language: "zh_CN", //语言
        preNextMonthButton: {
            pre: true,
            next: true
        }
    },
    meConfig = { //内部私有配置
        msg: {
            success: "success",
            disable: "disable"
        },
        format: "yyyy/MM/dd"
    },
    RenderDom, Operation;

//生成单个日历dom字符串
RenderDom = {
    /**
     * 集合日历DOM String
     * @param example  实例对象
     * @param options  当前日历配置
     * year 当前年
     * month 当前月
     * perNextButton  上下月按钮显示
     * @returns {string}
     */
    createCalendar: function(example, options) {
        var con = example.o,
            header = this.header(example, options),
            week = this.weeks(example),
            day = this.upDateDay(example, options),
            html = '<div class="' + con.uiStyle + 'Calendar">' + header + week + day + '</div>';
        return html;
    },
    /**
     *生成头部
     * @param example
     * @param options
     * @returns {string}
     */
    header: function(example, options) {
        var con = example.o,
            html = '<div class="' + con.uiStyle + 'Calendar_header">';
        if (!options.preNextBtn || options.preNextBtn.pre) { //是否需要显示上一月按钮
            html += '<i target-type="Calendar_pre" class="' + con.uiStyle + 'Calendar_pre">pre</i>';
        }
        html += '<b>' + options.year + util.language(con.language, "year") + ' ' + options.month + ' ' + util.language(con.language, "month") + '</b>';
        if (!options.preNextBtn || options.preNextBtn.next) { //是否需要显示下一月按钮
            html += '<i target-type="Calendar_next" class="' + con.uiStyle + 'Calendar_next">next</i>';
        }
        html += "</div>";
        return html;
    },
    /**
     * 生成当前月所有日期
     * @param example
     * @param year
     * @param month
     * @returns {string}
     */
    upDateDay: function(example, options) {
        var todayDate = new Date();
        var y = todayDate.getFullYear();
        var m = todayDate.getMonth() + 1;
        var d = todayDate.getDate();
        var todayStr = y + '/' + m + '/' + d + ' 00:00:00';

        var con = example.o,
            year = options.year,
            month = options.month,
            day = util.MonthHasDay(year, month) + 1,
            firstDay = year + "/" + month + "/01",
            lastDay = year + "/" + month + "/" + (day - 1),
            firstWeeks = util.isWeeks(firstDay), //1号是周几
            //lastWeeks = (7 - util.isWeeks(lastDay)),//最后一天是周几
            pre = util.getPreMonth(year + "/" + month), //上一月日期
            preYear = pre.getFullYear(),
            preMonth = util.addZero(pre.getMonth() + 1),
            next = util.getNextMonth(year + "/" + month), //下一月日期
            nextYear = next.getFullYear(),
            nextMonth = util.addZero(next.getMonth() + 1),
            html = '<div class="' + con.uiStyle + 'Calendar_day_list">',
            toDay = new Date(todayStr).getTime(),
            lastWeeks = day + firstWeeks;
        if (firstWeeks === 7) { //是周日就把本月顶头
            firstWeeks = 0;
            lastWeeks -= 7;
        }

        /*if(firstWeeks !== 1){
         for(var x = 0; x < firstWeeks - 1; x++){
         var pDay = util.calculationTime(-(firstWeeks - 1-x),firstDay).getDate();
         html += '<span class="' + con.uiStyle + 'Calendar_day_preM">'+pDay+'</span>';
         }
         }*/


        for (var i = 1; i < 43; i++) {
            var n = util.addZero(i - firstWeeks),
                dateDay = year + '/' + util.addZero(month) + '/' + n,
                className = options.disableStatus ? '' : this.dayStatusClass(example, dateDay),
                str = '<span target-type="Calendar_day" class="' + con.uiStyle + 'Calendar_day' + className + '" data-day="' + dateDay + '">' + n + '';

            if (firstWeeks > 0 && i <= firstWeeks) { //填充上月日期
                n = util.calculationTime(firstDay, -(firstWeeks - (i - 1))).getDate();
                dateDay = preYear + '/' + preMonth + '/' + n;
                str = '<span>';
                //str = '<span><i target-type="Calendar_day" class="' + con.uiStyle + 'Calendar_day_preM ' + con.uiStyle + 'Calendar_day'+ this.dayStatusClass(example,dateDay) +'" data-day="'+ dateDay + '">'+ n +'</i></span>';
            } else if (i >= lastWeeks) { //填充下月日期
                n = util.addZero(i - lastWeeks + 1);
                dateDay = nextYear + '/' + nextMonth + '/' + n;
                str = '<span>';
                //str = '<span><i target-type="Calendar_day" class="' + con.uiStyle + 'Calendar_day_nextM ' + con.uiStyle + 'Calendar_day'+ this.dayStatusClass(example,dateDay) +'" data-day="'+ dateDay + '">'+ n +'</i></span>';
            } else {
                if (toDay && toDay === new Date(dateDay).getTime()) {
                    str += "<em>toDay</em>";
                    toDay = false;
                }

            }
            str += "</span>";
            html += str;
        }

        /*//连接下月日期
         if(firstWeeks == 0){
         lasrWeeks --;
         }
         if(lasrWeeks < 7){
         for(var i = 1; i < lasrWeeks + 1; i++){
         html += '<span class="' + con.uiStyle + 'Calendar_day_nextM">'+util.addZero(i)+'</span>';
         }
         }*/
        html += '</div>';
        return html;
    },
    /**
     * 判断当前日期的状态，并返回状态值
     * @param example
     * @param date
     * @returns {string}
     */
    dayStatusClass: function(example, date) {
        var className = "",
            arr = example.o.dateArr;
        if (Operation.testdisable(example, date)) { //检测是否是禁用日期
            className += '_disable';
        } else if (util.testDate(date, arr)) { //检测是否当前选中
            className += '_choose';
            if (date === arr[0] || date === arr[arr.length - 1]) {
                className += ' start_end';
            }


        }
        return className;
    },
    /**
     * 生成周
     * @param example
     * @returns {string}
     */
    weeks: function(example) {
        var con = example.o,

            Sunday = util.language(con.language, "Sunday"),
            Monday = util.language(con.language, "Monday"),
            Tuesday = util.language(con.language, "Tuesday"),
            Wednesday = util.language(con.language, "Wednesday"),
            Thursday = util.language(con.language, "Thursday"),
            Friday = util.language(con.language, "Friday"),
            Saturday = util.language(con.language, "Saturday"),

            weeksArr = [Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday],
            html = '',
            i = 0;
        html += '<div class="' + con.uiStyle + 'Calendar_week">';
        for (; i < weeksArr.length; i++) {
            html += '<em>' + weeksArr[i] + '</em>';
        }
        html += '</div>';
        return html;
    }
};

//初始化日历，绑定事件
Operation = {
    init: function(myThis) {
        var example = myThis;
        example.calendarMonths = [];
        this.reloadCalendar(example); //载入
    },
    /**
     * 加载并创建集合日历DOM
     * @param example
     * @callback Callback 创建回调
     * msg 是否成功信息
     * @return
     */
    reloadCalendar: function(example, callback) {
        var con = example.o,
            startDate = (con.date) ? util.getPreMonth(con.date.start) : util.getPreMonth(new Date()), //取上一月
            len = example.o.number, //几个日历
            monthLen = example.calendarMonths.length, //月份
            html = '',
            status = false,
            msg = meConfig.msg.success; //状态
        if (con.date) {
            con.dateArr = util.getDateInterval(con.date.start, con.date.end); //设置当前选中日期
        } else {
            con.dateArr = [];
        }
        //判断设置的值是否有非法时间
        for (var i = 0, l = example.o.dateArr.length; i < l; i++) {
            if (this.testdisable(example, example.o.dateArr[i])) {
                status = true;
                break;
            }
        }
        //如果设置有非法时间则立即退出
        if (status) {
            msg = meConfig.msg.disable;
        }
        if (monthLen > 0) { //如果有指定月份，则循显示环指定月
            startDate = util.getPreMonth(example.calendarMonths[0]);
            len = monthLen;
        }
        for (var ii = 0; ii < len; ii++) { //循环拼接多日历
            var options = {};
            startDate = util.getNextMonth(startDate); //取下一个月
            options.year = new Date(startDate).getFullYear();
            options.month = new Date(startDate).getMonth() + 1;
            if (monthLen === 0) { //第一次缓存显示月
                example.calendarMonths.push(options.year + '/' + util.addZero(options.month) + "/01");
            }
            if (con.preNextMonthButton) { //上下月按钮设置
                if (con.preNextMonthButton.pre) {
                    options.preNextBtn = con.preNextMonthButton;
                } else {
                    var btn = con.preNextMonthButton[ii + 1];
                    if (btn) {
                        options.preNextBtn = $.extend({}, defaults.preNextMonthButton, btn);
                    } else {
                        options.preNextBtn = defaults.preNextMonthButton;
                    }
                }
            }
            options.disableStatus = status;
            html += RenderDom.createCalendar(example, options);
        }
        example.o.$html = $(html);
        example.o.target.append(example.o.$html); //重新渲染

        this.calendarEventBind(example); //绑定
        if (callback) {
            callback({ status: msg, date: example.o.date })
        }
        return true; //返回成功消息
    },
    /**
     * 事件绑定
     * @param example
     */
    calendarEventBind: function(example) {
        var _this = this,
            formatStr = example.o.format;
        example.o.$html.on("click", function(e) {
            var $target = $(e.target),
                type = $target.attr("target-type"),
                className = $target.attr("class"),
                date = $target.attr("data-day");
            switch (type) {
                case "Calendar_day": //点击日期

                    if (example.o.dayOperationStatus) {
                        var msg = {
                            date: [util.formatDate(date, formatStr)],
                            selected: util.formatDate(date, formatStr)
                        };
                        if (!className || className.indexOf("disable") < 0) {
                            msg = _this.cacheDate(example, date);
                            msg.date.start = util.formatDate(msg.date.start, formatStr);
                            msg.date.end = util.formatDate(msg.date.end, formatStr);
                            msg.selected = util.formatDate(date, formatStr);
                        } else if (className.indexOf("disable") >= 0) {
                            msg.status = meConfig.msg.disable;
                        }
                        //派发日期选择事件

                        $(example).trigger("selectDay", [msg]);
                    }
                    break;
                case "Calendar_pre": //上一月
                    _this.preMonth(example);
                    break;
                case "Calendar_next": //下一月
                    _this.nextMonth(example);
                    break;
                default:
                    break;
            }

        });
    },
    /**
     * 上一月
     * 维护当前实例的日历显示数组 calendarMonths
     * @param example
     */
    preMonth: function(example) {
        var l = example.calendarMonths.length,
            pMonth = util.getPreMonth(example.calendarMonths[0]);
        if (l > 1) {
            example.calendarMonths.splice(0, 1, pMonth);
            example.calendarMonths[l - 1] = util.getPreMonth(example.calendarMonths[l - 1]);
        } else {
            example.calendarMonths = [pMonth]
        }
        example.o.target.html("");
        this.reloadCalendar(example);
    },
    /**
     * 下一月
     * 维护当前实例的日历显示数组 calendarMonths
     * @param example
     */
    nextMonth: function(example) {
        var l = example.calendarMonths.length,
            nMonth = util.getNextMonth(example.calendarMonths[l - 1]);
        if (l > 1) {
            example.calendarMonths.splice(0, 1);
            example.calendarMonths.push(nMonth)
        } else {
            example.calendarMonths = [nMonth]
        }
        example.o.target.html("");
        this.reloadCalendar(example);
    },
    /**
     *设置并缓存当前选中日期
     * 维护当前实例时间对象 date.start,date.end
     * @param example
     * @param date
     * @returns {{}} 返回设置选中日期是否成功信息
     */
    cacheDate: function(example, date) {
        var con = example.o,
            msg = {},
            formatStr = meConfig.format,
            date = util.formatDate(date, formatStr); //new Date(date).Format("yyyy-MM-dd");
        if ((con.intervals && con.dateArr.length !== 1) || !con.intervals) { //单日期选择 和 时段日期开始日期选择
            example.o.status = 1;
            msg.status = meConfig.msg.success;
            example.o.date = {
                start: date,
                end: date
            };
        } else {
            if (example.o.status == 2) { //是否开始第二次选择
                example.o.status = 1;
                msg.status = meConfig.msg.success;
                example.o.date = {
                    start: date,
                    end: date
                };
            } else { //选择时段日期的结束日期
                example.o.status = 2;
                var status = true;
                var arr = util.getDateInterval(date, con.dateArr[0]),
                    len = arr.length;
                for (var i = 0; i < len; i++) {
                    if (this.testdisable(example, arr[i])) {
                        status = false;
                        example.status = false;
                        msg.status = meConfig.msg.disable;
                        break;
                    }
                }
                if (status) {
                    example.o.status = true;
                    msg.status = meConfig.msg.success;
                    example.o.date = {
                        start: util.formatDate(arr[0], formatStr), // new Date(arr[0]).Format("yyyy-MM-dd"),
                        end: util.formatDate(arr[arr.length - 1], formatStr) //new Date(arr[arr.length - 1]).Format("yyyy-MM-dd")
                    };
                }
            }

        }
        msg.date = example.o.date;
        if (msg.status === meConfig.msg.success) {
            example.o.target.html("");
            this.reloadCalendar(example);
        }
        return msg; //返回设置信息
    },
    /**
     * 检测日期是否被禁用
     * @param example
     * @param date
     * @returns {boolean}
     */
    testdisable: function(example, date) {
        var status = false,
            min = false,
            max = false,
            special = false;
        if (example.o.disable) {
            if (example.o.disable.last) {
                max = util.testMacthMax(date, example.o.disable.last);
            }
            if (example.o.disable.first) {
                min = util.testMacthMin(date, example.o.disable.first);
            }
            if (example.o.disable.special && example.o.disable.special.length > 0) {
                special = util.testDate(date, example.o.disable.special);
            }
            if (max || min || special) {
                status = true;
            }
        }
        return status;
    }
};

var Calendar = function(target, options) {
    ////debugger
    this.o = $.extend({}, defaults, options);
    this.o.target = $(target);
    //考虑多实例,把当期实例传给静态方法
    Operation.init(this);
};
Calendar.prototype = {
    setDate: function(options, callback) {
        var date = {
            start: util.formatDate(options.start, meConfig.format), //.Format(meConfig.format),
            end: util.formatDate(options.end, meConfig.format) //.Format(meConfig.format)
        };
        this.o.date = $.extend({}, date);
        this.calendarMonths = [];
        this.o.target.html("");
        Operation.reloadCalendar(this, callback);
    }
};

module.exports = Calendar;