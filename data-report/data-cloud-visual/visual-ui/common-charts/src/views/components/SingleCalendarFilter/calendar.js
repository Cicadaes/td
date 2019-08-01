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
                start: getBeforeDate(100),
                end: getBeforeDate(1)
            },
            dayOperationStatus: true,
            format: 'yyyy/MM/dd',
            multiChooseType:'single'
        },
        disable: {
            first: "",
            last: getBeforeDate(0)
        },
        fastSelectDays: '',
        fastDayEnd: -2,
        defaultIndex: 0
    }, true, function(data) {

        if (calendarDay.cb && data.start && data.end) {
            //debugger
            data.start = formatDate(data.start);
            data.end = formatDate(data.end);
            calendarDay.cb(data);
        }

    });

};

module.exports = {
    calendarDay: calendarDay
}