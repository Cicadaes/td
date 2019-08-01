var $ = require('jquery');

Date.prototype.CNgetDay = function() {
    var week = this.getDay();
    if (week === 0) week = 7;
    return week;
};
Date.prototype.Format = function(format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds() //millisecond
    }

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};
var util = {
    language: function(lang, str) {
        var defaults = {
            "Monday": {
                "zh_CN": "一",
                "en_US": "MON"
            },
            "Tuesday": {
                "zh_CN": "二",
                "en_US": "TUE"
            },
            "Wednesday": {
                "zh_CN": "三",
                "en_US": "WED"
            },
            "Thursday": {
                "zh_CN": "四",
                "en_US": "THU"
            },
            "Friday": {
                "zh_CN": "五",
                "en_US": "FRI"
            },
            "Saturday": {
                "zh_CN": "六",
                "en_US": "SAT"
            },
            "Sunday": {
                "zh_CN": "日",
                "en_US": "SUN"
            },
            "time": {
                "zh_CN": "时期",
                "en_US": "Period"
            },
            "recent": {
                "zh_CN": "",
                "en_US": "Recent"
            },
            "monthly": {
                "zh_CN": "月度",
                "en_US": "Monthly"
            },


            "date": {
                "zh_CN": "日期",
                "en_US": "Date"
            },
            "all": {
                "zh_CN": "全时期",
                "en_US": "All"
            },
            "day": {
                "zh_CN": "天",
                "en_US": "Day"
            },
            "month": {
                "zh_CN": "月",
                "en_US": "Month"
            },
            "week": {
                "zh_CN": "周",
                "en_US": "Week"
            },
            "year": {
                "zh_CN": "年",
                "en_US": "Year"
            },
            "ContrastDate": {
                "zh_CN": "对比期",
                "en_US": "Contrast Date"
            },
            "custom": {
                "zh_CN": "自定义",
                "en_US": "Custom"
            },
            "preMonth": {
                "zh_CN": "上月",
                "en_US": "Last Month"
            },
            "preWeek": {
                "zh_CN": "上周",
                "en_US": "Last Week"
            },
            "preYear": {
                "zh_CN": "上年",
                "en_US": "Last Year"
            },
            "Confirm": {
                "zh_CN": "确认",
                "en_US": "Confirm"
            },
            "Cancel": {
                "zh_CN": "取消",
                "en_US": "Cancel"
            }
        };
        return defaults[str][lang];
    },
    LeapPingnian: function(year) { //判断是不是平年闰年 true=>代表闰年 false=>平年
        if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0) {
            return true;
        } else {
            return false;
        }
    },
    MonthHasDay: function(year, month) { //判断每个月有多少天
        var arr = [1, 3, 5, 7, 8, 10, 12],
            month = parseInt(month),
            day = 30;
        isLeap = this.LeapPingnian(year);
        if (month == 2) { //2月特殊处理-------闰年29天/平年28天
            if (isLeap) {
                day = 29;
            } else {
                day = 28;
            }
        } else if ($.inArray(month, arr) > -1) { //代表是31天
            day = 31;
        }
        return day;
    },
    isWeeks: function(time) { //判断是周几，如果不传值判断当前时间是周几
        var day;
        if (typeof(time) === undefined) {
            day = new Date().getDay();
        } else {
            day = new Date(time).getDay();
        }
        return day;
    },
    /**
     * 一为补0
     * @param month
     * @returns {*}
     */
    addZero: function(num) {
        var num = parseInt(num);
        if (num < 10) {
            num = "0" + num;
        }
        return num;
    },
    /**
     **计算日期加减日
     *@param num 需要加减多少日 +1 -1
     *@param time 起始日
     *@return {Date}
     */
    calculationTime: function(time, num) {
        var time = time,
            s = (num * 24 * 60 * 60 * 1000);
        if (!time) {
            time = new Date().valueOf();
        } else {
            time = new Date(time).valueOf();
        }
        time = new Date(time + s);

        return time;
    },
    /**
     * 获取上一月
     * @param date
     * @returns {Date}
     */
    getPreMonth: function(date) {
        date = this.formatDateStr(date);
        var time = date ? new Date(date) : new Date(),
            m = time.getMonth() + 1,
            y = time.getFullYear(),
            m2 = m - 1;
        if (m2 === 0) {
            y = y - 1;
            m2 = 12;
        }
        return new Date(y + "/" + m2 + "/" + "01");
    },
    /**
     * 获取下一月
     * @param date
     * @returns {Date}
     */
    getNextMonth: function(date) {
        date = this.formatDateStr(date);
        var time = date ? new Date(date) : new Date(),
            m = time.getMonth() + 1,
            y = time.getFullYear(),
            m2 = m + 1;
        if (m2 === 13) {
            y = y + 1;
            m2 = 1;
        }
        return new Date(y + "/" + m2 + "/" + "01");
    },
    calculationYear: function(date, num) {
        var oldTime = new Date(date).getTime(),
            newTime = oldTime + (365 * 24 * 60 * 60 * 1000),
            newDate = new Date(newTime);
        return newDate;
    },
    /**
     * 检测此时间是否在莫时段内
     * @param passiveDate
     * @param date
     * @returns {boolean}
     */
    testDate: function(passiveDate, date) {
        var time = passiveDate ? new Date(passiveDate).getTime() : new Date().getTime(),
            status = false;
        if (date instanceof Array) {
            for (var i = 0, l = date.length; i < l; i++) {
                var nTime = new Date(date[i]).getTime();
                if (time === nTime) {
                    status = true;
                    break;
                }
            }
        } else {
            if (time === new Date(date).getTime()) {
                status = true;
            }
        }
        return status;
    },
    /**
     *
     * @param passivDate
     * @param date
     * @returns {boolean}
     */
    testMacthMax: function(passivDate, date) {
        passivDate = this.formatDateStr(passivDate);
        date = this.formatDateStr(date);
        var pDate = new Date(passivDate).getTime(),
            date = new Date(date).getTime(),
            status = false;
        if (pDate > date) {
            status = true;
        }
        return status;
    },
    /**
     *
     * @param passivDate
     * @param date
     * @returns {boolean}
     */
    testMacthMin: function(passivDate, date) {
        passivDate = this.formatDateStr(passivDate);
        date = this.formatDateStr(date);
        var pDate = new Date(passivDate).getTime(),
            date = new Date(date).getTime(),
            status = false;
        if (pDate < date) {
            status = true;
        }
        return status;
    },
    /**
     * 获取俩时间段，中间的日期List
     * @param date1
     * @param date2
     * @returns {Array}
     */
    getDateInterval: function(date1, date2) {
        date1 = this.formatDateStr(date1);
        date2 = this.formatDateStr(date2);
        var date1Time = new Date(date1).getTime(),
            date2Time = new Date(date2).getTime(),
            s = 24 * 60 * 60 * 1000,
            timeDiff = date1Time - date2Time,
            dateArr = [];
        //判断两时间是否是一天，有可能格式不同，所以毫秒不能全等判断,判断差值是否大于一天
        if (timeDiff < s && timeDiff > (-s)) {
            var date = new Date(date1Time),
                y = date.getFullYear(),
                m = this.addZero(date.getMonth() + 1),
                d = this.addZero(date.getDate());
            dateArr.push(y + "/" + m + "/" + d);
        } else if (date1Time < date2Time) {
            for (var i = date1Time, max = (date2Time + s); i < max;) {
                var date = new Date(i),
                    y = date.getFullYear(),
                    m = this.addZero(date.getMonth() + 1),
                    d = this.addZero(date.getDate());
                dateArr.push(y + "/" + m + "/" + d);
                i = i + s;
            }
        } else {
            for (var i = date2Time, max = (date1Time + s); i < max;) {
                var date = new Date(i),
                    y = date.getFullYear(),
                    m = this.addZero(date.getMonth() + 1),
                    d = this.addZero(date.getDate());
                dateArr.push(y + "/" + m + "/" + d);
                i = i + s;
            }
        }
        return dateArr
    },
    formatDateStr: function(str) {
        var date = str;
        //_.isString(str)
        if (str && typeof str == 'string') {
            if (str.indexOf("-") != -1) {
                str = str.split('-');
                date = str[0] + '/' + str[1] + '/' + str[2];
            }
        }

        return date;
    },
    formatDate: function(date, fmt) {
        return new Date(date).Format(fmt);
    },
    getDateStr: function(addDayCount) {
        if (addDayCount) {
            addDayCount = parseInt(addDayCount);
        }
        var dd = new Date();
        dd.setDate(dd.getDate() + addDayCount); //获取addDayCount天后的日期 
        var y = dd.getFullYear();
        var m = dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1; //获取当前月份的日期 
        var d = dd.getDate();
        return y + "/" + m + "/" + d;
    }
};

module.exports = util;