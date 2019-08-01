var TD_Day_week_monthPicke = require('../calendar/day_week_month.js');
var $ = require('jquery');
function formatDate(str) {
    var arr = str.split('/');
    var s = arr[0] + '-' + arr[1] + '-' + arr[2];
    return s;
}

//获取前N天日期
function getBeforeDate(n) {
    var n = n;
    var d = new Date();
    var year = d.getFullYear();
    var mon = d.getMonth() + 1;
    var day = d.getDate();
    if (day <= n) {
        if (mon > 1) {
            mon = mon - 1;
        } else {
            year = year - 1;
            mon = 12;
        }
    }
    d.setDate(d.getDate() - n);
    year = d.getFullYear();
    mon = d.getMonth() + 1;
    day = d.getDate();
    var s = year + "/" + (mon < 10 ? ('0' + mon) : mon) + "/" + (day < 10 ? ('0' + day) : day);

    return s;
}
//日 默认显示7天
var calendarDay = function(id, cb) {
    calendarDay.cb = cb;
    new TD_Day_week_monthPicke($(id), {
        number: 2, //多日历
        intervals: true, //时段选择
        dayOperationStatus: false,
        type: 'day',
        language: 'zh_CN',
        dayCalendar: {
            language: 'zh_CN',
            date: { //当前选中日期
                start: getBeforeDate(30),
                end: getBeforeDate(1)
            },
            dayOperationStatus: true,
            format: 'yyyy/MM/dd',
            multiChooseType:'multi'
        },
        disable: {
            first: "",
            last: getBeforeDate(0)
        },
        fastSelectDays: '',
        fastDayEnd: -1,
        defaultIndex: 2
    }, true, function(data) {

        if (calendarDay.cb && data.start && data.end) {
            //debugger
            data.start = formatDate(data.start);
            data.end = formatDate(data.end);
            calendarDay.cb(data);
        }

    });

};
//周  默认显示--周---初始面板从上月开始
var calendarWeek = function(id, cb) {
    calendarWeek.cb = cb;
    new TD_Day_week_monthPicke($(id), {
        number: 2, //多日历
        intervals: true, //时段选择
        dayOperationStatus: true,
        type: 'week',
        language: 'zh_CN',
        weekCalendar: {
            week: 'week', //当前选中周,
            date: {
                start: getBeforeDate(7),
                end: getBeforeDate(0)
            },
            dayOperationStatus: true,
            number: 2, //多日历
            intervals: true, //时段选择

        },
        disable: {
            first: "2000/01/01",
            last: getBeforeDate(0)
        },
        fastSelectDays: '',
        fastDayEnd: 0,
        defaultIndex: 1
    }, true, function(data) {
        if (calendarWeek.cb && data.start && data.end) {
            data.start = data.start;
            data.end = data.end;
            calendarWeek.cb(data);
        }
    });
};
//月 默认6个月
var calendarMonth = function(id, cb) {
    calendarMonth.cb = cb;
    new TD_Day_week_monthPicke($(id), {
        number: 2, //多日历
        intervals: true, //时段选择
        dayOperationStatus: true,
        type: 'month',
        language: 'zh_CN',
        monthCalendar: {
            date: {
                start: getBeforeDate(180),
                end: getBeforeDate(0)
            }, //当前选中月
            dayOperationStatus: true,
            multiChooseType:'multi'
        },
        disable: {
            first: "",
            last: getBeforeDate(0)
        },
        fastSelectDays: '',
        fastDayEnd: 0,
        defaultIndex: 2
    }, true, function(data) {
        //debugger
        if (calendarMonth.cb && data.start && data.end) {
            data.start = data.start;
            data.end = data.end;
            calendarMonth.cb(data);
        }
    });
};

module.exports = {
    calendarDay: calendarDay,
    calendarWeek: calendarWeek,
    calendarMonth: calendarMonth
}