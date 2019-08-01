var $ = require('jquery');
var util = require('./util');

var defaults = {
        endPreWeek: false,
        tirgger: "click",
        language: "zh_CN",
        number: 2,
        intervals: true,
        preNextMonthButton: {
            pre: true,
            next: true
        }
    },
    meConfig = {
        format: "yyyy/MM/dd"
    };
var RenderDom = {
    createFrame: function(example,options) {
        //debugger
        var html = '<div class="TD_WeekPicke">';
        html += this.header(example,options);
        //                '<div class="TD_WeekPicke_header"><i class="TD_WeekPicke_pre" target-type="pre">pre</i><span target-type="TD_WeekPicke_week"></span></div>' +
        html = html + '<ul class="TD_WeekPicke_content" target-type="table"></ul>' +
            // '<div class="TD_WeekPicke_operation"><a href="javascript:void(0)" target-type="confirm" class="TD_WeekPicke_Confirm">'+util.language(language,"Confirm")+'</a><a href="javascript:void(0)" target-type="cancle" class="TD_WeekPicke_cancle">'+util.language(language,"Cancel")+'</a></div>' +
            '</div>';
        return html;
    },
    header: function(example,options) {
        var html = '<div class="TD_WeekPicke_header">';
        if (!example.preNextBtn || example.preNextBtn.pre) { //是否需要显示上一月按钮
            html += '<i target-type="pre" class="TD_WeekPicke_pre">pre</i>';
        }

        html += '<span>' + options.year + util.language(example.o.language, "year") + ' ' + options.month + ' ' + util.language(example.o.language, "month") + '</span>'
        if (!example.preNextBtn || example.preNextBtn.next) { //是否需要显示上一月按钮
            html += '<i target-type="next" class="TD_WeekPicke_next">next</i>';
        }
        return html + '</div>';
    },
    renderCon: function(example,options) {
        var year = options.year,
            month = options.month;
            if(month <10){
                month = "0" + month;
            }
        month = month.toString();
        year = year.toString();
        //            example.$html.find("[target-type='TD_WeekPicke_week']").html(example.o.date);
        example.$html.find("[target-type='table']").html(Operation.renderYear(example, year, month));
    },

    //判断默认选中最近一周
    isNowWeek: function(endTime, nowTime) {

        /*
         * 如果结束时间不存在返回 false
         * nowTime 当前循环的时间段
         * endTime 结束的时间点
         * 后端只返回当前上一周的数据
         * hasTime 储存对比时间
         */
        if (!endTime) return false;

        var hasTime = '';
        var targetDate = new Date(endTime);
        var nowDate = targetDate.getDate();
        var nowYear = targetDate.getFullYear();
        var nowMonth = targetDate.getMonth() + 1;
        var monthHasDay = util.MonthHasDay(nowYear, nowMonth);

        //初始化变量设置
        var weekYear, weekMonth, weekDay
            /*
             * 1: 减法可能跨月
             * 2: 减法可能跨年
             */
        if (nowDate - 7 > 0) {
            weekYear = nowYear;
            weekMonth = nowMonth;
            weekDay = nowDate - 6;
        } else {

            //判断是否跨年
            if (nowMonth == 1) {
                weekYear = nowYear - 1;
                weekMonth = 12;
            } else {
                weekYear = nowYear;
                weekMonth = nowMonth - 1;
            }
            weekDay = util.MonthHasDay(weekYear, weekMonth) - (nowDate - 6);
        }

        //月日补零操作
        nowMonth = nowMonth < 10 ? ("0" + nowMonth) : nowMonth;
        nowDate = nowDate < 10 ? ("0" + nowDate) : nowDate;
        weekMonth = weekMonth < 10 ? ("0" + weekMonth) : weekMonth;
        weekDay = weekDay < 10 ? ("0" + weekDay) : weekDay;

        hasTime = weekYear + '/' + weekMonth + '/' + weekDay + '-' + nowYear + '/' + nowMonth + '/' + nowDate;
        if (hasTime === nowTime) {
            return true;
        } else {
            return false;
        }
    },
    renderWeek: function(example, year, end, i, first, last) {
        //debugger
        var week = util.addZero(i + 1),
            s = util.calculationTime(end, 1),
            obj = {
                s: util.formatDate(s, meConfig.format),
                e: util.formatDate(util.calculationTime(s, 6), meConfig.format)
            },
            val = util.formatDate(obj.s, "yyyy/MM/dd") + '-' + util.formatDate(obj.e, "yyyy/MM/dd"),
            classNanme = '',
            // str = year + '-' + week; //+Language.init("week"),//周
            str = week; //+Language.init("week"),//周
        strS = util.formatDate(obj.s, "MM-dd"),
            strE = util.formatDate(obj.e, "MM-dd"),
            timeS = new Date(obj.s).getTime()
        timeE = new Date(obj.e).getTime();
        /*
         * 初始化的时候对比默认选中的日期
         * 点击之后对比已经有值的日期
         */
        if ((this.isNowWeek(example.o.disable.last, val) && !example.o.val) ||
            example.o.val == val) {
            classNanme = 'choose';
        }
        if (timeS >= first && timeE <= last) {
            obj.html = '<li data-week="' + str + '" target-type= "week" val="' + val + '" class="' + classNanme + '"><span>' + str + '</span><em>' + strS + '~' + strE + '</em></li>';
        } else {
            obj.html = '<li val="' + val + '" class="disable"><span>' + str + '</span><em>' + strS + '~' + strE + '</em></li>';

        }
        return obj;
    }

};
var Operation = {
    init: function(myThis) {
        //debugger
        myThis.monthArr = [];
        myThis.selectedWeek = [];
        myThis.calendarMonths = [];
        this.reloadHTML(myThis);
        this.eventBuid(myThis);
        //初始化选中最近一周
        $(".TD_WeekPicke li.disable").eq(0).prev("li").addClass("choose");
        var initWeek = $(".TD_WeekPicke li.disable").eq(0).prev("li").data('week');
        var initDate = $(".TD_WeekPicke li.disable").eq(0).prev("li").attr('val');
        myThis.selectedWeek.push({
            val: initDate,
            week: initWeek
        });

    },
    reloadHTML: function(myThis) {


        // var dateStr = myThis.o.date.start;
        // var startYear = dateStr ? new Date(dateStr).getFullYear() : new Date().getFullYear(), // ie兼容性在这该  example.o.disable['last']
        //     startMonth = (dateStr ? new Date(dateStr).getMonth() : new Date().getMonth()) + 1;
        // var number = myThis.o.number,
        //     arrLen = myThis.monthArr.length;

        // if (arrLen > 0) {
        //     number = arrLen;
        //     startMonth = myThis.monthArr[0].substring(5, 7) - 0;
        // }

        // for (var i = 0; i < number; i++) {

        //     startMonth = startMonth - 0 + i;
        //     if (startMonth > 12) {
        //         startYear++;
        //         startMonth = 1;
        //     }
        //     startMonth = startMonth < 10 ? "0" + startMonth : startMonth;
        //     var month = startYear + '/' + startMonth;
        //     if (arrLen == 0) {
        //         myThis.monthArr.push(month);
        //     }
        //     myThis.o.month = month;
        //     if (!myThis.o.preNextMonthButton) {
        //         myThis.preNextBtn = $.extend(true, defaults.preNextMonthButton);
        //     } else {
        //         var btn = myThis.o.preNextMonthButton[i + 1];
        //         if (btn) {
        //             myThis.preNextBtn = $.extend(true, {}, defaults.preNextMonthButton, btn);
        //         } else {
        //             myThis.preNextBtn = $.extend(true, {}, example.o.preNextMonthButton);
        //         }
        //     }
        // }



        //debugger
        var dateStr = myThis.o.date.start;
        var startDate = (myThis.o.date) ? util.getPreMonth(myThis.o.date.start) : util.getPreMonth(new Date()); //取上一月
        var number = myThis.o.number,
            arrLen = myThis.monthArr.length,
            monthLen = myThis.calendarMonths.length; //月份

        if (monthLen > 0) {
            startDate = util.getPreMonth(myThis.calendarMonths[0]);
            number = monthLen;
        }

        for (var i = 0; i < number; i++) {
            myThis.o.year = new Date(startDate).getFullYear();
            myThis.o.month = new Date(startDate).getMonth() + 1;

            var options = {};
            startDate = util.getNextMonth(startDate); //取下一个月
            options.year = new Date(startDate).getFullYear();
            options.month = new Date(startDate).getMonth() + 1;
            myThis.monthArr = [];
            if (arrLen === 0) {
                myThis.monthArr.push(options.year + '/' + util.addZero(options.month) + "/01")
            }
            if(monthLen === 0){ //第一次缓存显示月
                myThis.calendarMonths.push(options.year + '/' + util.addZero(options.month) + "/01");
            }



            if (!myThis.o.preNextMonthButton) {
                myThis.preNextBtn = $.extend(true, defaults.preNextMonthButton);
            } else {
                var btn = myThis.o.preNextMonthButton[i + 1];
                if (btn) {
                    myThis.preNextBtn = $.extend(true, {}, defaults.preNextMonthButton, btn);
                } else {
                    myThis.preNextBtn = $.extend(true, {}, example.o.preNextMonthButton);
                }
            }
            myThis.$html = $(RenderDom.createFrame(myThis,options));
            RenderDom.renderCon(myThis,options);
            $(myThis.$target).append(myThis.$html);
        }

        var h1 = $(".TD_WeekPicke_content").eq(0).height(),
            h2 = $(".TD_WeekPicke_content").eq(1).height();
        if (h1 > h2) {
            $(".TD_WeekPicke_content").eq(1).append("<div class='disable'></div>")
        } else if (h1 < h2) {
            $(".TD_WeekPicke_content").eq(0).append("<div class='disable'></div>")
        }


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
    eventBuid: function(myThis) {
        var _this = this;
        //debugger
        // RenderDom.renderCon(example);
        //点击事件
        /*$(example.$target).on(example.o.tirgger,function(e){
         e.stopPropagation();
         example.o.date = myThis.o.date;
         example.o.val = myThis.o.val;
         // RenderDom.setPosition(example);
         //e.stopPropagation();
         });*/
        $(".TD_WeekPicke").on("click", "li,i,a", function(e) {
            //debugger
            var $target = $(this),
                type = $target.attr("target-type");
            switch (type) {
                case "week":
                    //                        if ($target.hasClass("choose")) {
                    //                            return;
                    //                        }
                    $('.DatePicke_tool_shortcut a').removeClass('choolse');
                    //debugger
                    myThis.o.val = $target.attr("val");
                    myThis.o.week = $target.attr("data-week");
                    //问题出在点击一个其他全去掉了 应该存起来*******
                    //把第一次点击的和第二次点击的存起来  取起始时间对比  中间的全部加choose
                    //可以根据data-week 例如：开始2017-40-2017-50结束 范围内的都加choose
                    //$('[target-type= "week"].choose').removeClass("choose");

                    var msg = {
                        week: myThis.o.week,
                        val: myThis.o.val,
                        date: {}
                    }

                    if (myThis.selectedWeek.length >= 2) {
                        myThis.selectedWeek = [];
                        $('[target-type= "week"].choose').removeClass("choose");
                    } else {
                        //myThis.selectedWeek.push(msg);
                    }
                    $target.addClass("choose");
                    myThis.selectedWeek.push(msg);
                    //console.log(new Date(myThis.selectedWeek[1].split("-")), 'new Date(myThis.selectedWeek');
                    if (myThis.selectedWeek.length >= 2) {
                        var time1 = (new Date(myThis.selectedWeek[0].val.split("-")[0])).getTime(),
                            time2 = (new Date(myThis.selectedWeek[1].val.split("-")[1])).getTime();
                        var sIndex = time1 > time2 ? 1 : 0;
                        //debugger
                        _this.selectWeek(myThis);
                        msg.date = {
                            start: myThis.selectedWeek[sIndex].val.split("-")[0],
                            end: myThis.selectedWeek[1 - sIndex].val.split("-")[1],
                        }
                    } else {
                        msg.date = {
                            start: myThis.selectedWeek[0].val.split("-")[0],
                            end: myThis.selectedWeek[0].val.split("-")[1],
                        }
                    }

                    //$(myThis).trigger("selectWeek", [msg]);
                    break;
                case "pre":
                    _this.preMonth(myThis, 'pre');
                    break;
                case "next":
                    _this.nextMonth(myThis, 'next');
                    break;
                    /*case "confirm":
                     if( example.o.val ){
                     myThis.o.val = example.o.val;
                     var isStoreTime = example.o.val.split('-')[1];
                     myThis.o.date = isStoreTime.substring(0,7);
                     myThis.o.week = example.o.week;
                     $(myThis).trigger("confirm",myThis.o);
                     $(example.$html).hide();
                     }
                     break;
                     case "cancle":
                     $(example.$html).hide();
                     break;*/
                default:
                    break;
            }
        });
        /*$("body").on("click",function(e){
         var target = $(e.target);
         var parent = target.parent();
         if( !target.hasClass("calen_con_week") && !parent.hasClass("calen_con_week") ){
         $(".TD_WeekPicke").hide();
         }
         })*/
    },
    selectWeek: function(example) {
        //debugger
        var preLi = $('.TD_WeekPicke_content li');
        preLi.removeClass('choose');
        if (example.selectedWeek.length && example.selectedWeek[0].val) {
            //console.log(new Date(example.selectedWeek[0].val.split("-")[0]), '-----0000000');
            var time1 = (new Date(example.selectedWeek[0].val.split("-")[0])).getTime(),
                time2 = (new Date(example.selectedWeek[1].val.split("-")[1])).getTime();
            var sIndex = time1 > time2 ? 1 : 0;
            preLi.each(function(index) {
                //debugger
                //console.log(new Date($(preLi[0]).attr("val").split("-"), 'new Date($(preLi[index]).attr("val")'));
                var curStartTime = (new Date($(preLi[index]).attr("val").split("-")[0])).getTime();
                var curEndTime = (new Date($(preLi[index]).attr("val").split("-")[1])).getTime();
                //console.log(new Date(example.selectedWeek[sIndex], 'new Date(example.selectedWeek[sIndex]'));
                var startTime = (new Date(example.selectedWeek[sIndex].val.split("-")[0])).getTime();
                var endTime = (new Date(example.selectedWeek[1 - sIndex].val.split("-")[1])).getTime();
                if (curStartTime >= startTime && curStartTime <= endTime) {
                    start = index;
                    $(preLi[index]).addClass("choose");
                }

                if (curEndTime > endTime) {
                    return false;
                }
            })

        }

    },
    renderYear: function(example, year, month) {
        //debugger

        var dayMap = {
            "7":year + "/01/02",
            "6":year + "/01/03",
            "5":year + "/01/04",
            "4":year - 1 + "/12/29",
            "3":year - 1 + "/12/30",
            "2":year - 1 + "/12/31",
            "1":year + "/01/01"
        }
        var weekNum = this.getNumOfWeeks(year),
        yearStartDay = new Date(year +"/01/01"),
        firstWeek = util.isWeeks(yearStartDay),
        firstWeek = firstWeek == 0 ? 7 : firstWeek;
        if(firstWeek == "1"){
            yearStartDay = new Date(dayMap["1"])
        }else if(firstWeek == "2"){
            yearStartDay = new Date(dayMap["2"])
        }
        else if(firstWeek == "3"){
            yearStartDay = new Date(dayMap["3"])
        }
        else if(firstWeek == "4"){
            yearStartDay = new Date(dayMap["4"])
        }
        else if(firstWeek == "5"){
            yearStartDay = new Date(dayMap["5"])
        }
        else if(firstWeek == "6"){
            yearStartDay = new Date(dayMap["6"])
        }
        else if(firstWeek == "7"){
            yearStartDay = new Date(dayMap["7"])
        }

         var    startDay = util.calculationTime(yearStartDay, (7)),
                start = util.formatDate(util.calculationTime(startDay, -14), meConfig.format), //初始从上周日期开始
                end = util.formatDate(util.calculationTime(startDay, -8), meConfig.format),
                html = '',
                disable = example.o.disable,
                first, last;

        if (disable) {
            first = new Date(disable.first).getTime();
            last = new Date(disable.last).getTime();
        }
        for (var i = 0; i < weekNum; i++) {
            var obj = RenderDom.renderWeek(example, year, end, i, first, last);
            start = obj.s;
            end = obj.e;
            if (end.indexOf(year + "/" + month) >= 0) {
                html += obj.html;
            } else if (start.indexOf(year + "/" + month) >= 0 && (i == 51 || i == 52)) {
                var date = new Date(end).getDate();
                if(date < 4){
                    html += obj.html;
                }
            }
        }
        return html;
    },
    getNumOfWeeks: function(year) {
        var num = util.LeapPingnian(year) ? 366 : 365,
            week = new Date(year).CNgetDay();
            if(week == 7){
                num = num - 1;
            }else if(week == 1){
                num  = num
            }else if(week == 2){
                num  = num + 1
            }else if(week == 3){
                num  = num + 2
            }else if(week == 4){
                num  = num + 3
            }else if(week == 5){
                num  = num - 3
            }else if(week == 6){
                num  = num + 2
            }
        return Math.ceil(num / 7.0);
    },
    preMonth: function(example) {
        //debugger
        // var l = example.monthArr.length,
        //     month = example.monthArr[0].substring(5, 7) - 0,
        //     year = example.monthArr[0].substring(0, 4) - 0;
        // if (month == "1") {
        //     year--;
        //     month = 12;
        // } else {
        //     month--;
        // }
        // example.o.month = year + "/" + month;
        // example.o.date.start = year + "/" + month + "/01";

        // if (l > 1) {
        //     example.monthArr[l - 1] = example.monthArr[0];
        //     example.monthArr[0] = example.o.month;
        // } else {
        //     example.monthArr = [example.o.month]
        // }

        var l = example.calendarMonths.length,
            pMonth = util.getPreMonth(example.calendarMonths[0]);
        if (l > 1) {
            example.calendarMonths.splice(0, 1, pMonth);
            example.calendarMonths[l - 1] = util.getPreMonth(example.calendarMonths[l - 1]);
        } else {
            example.calendarMonths = [pMonth]
        }

        example.$target.html("");
        //             this.renderYear(example, year, month)
        this.reloadHTML(example);

        this.eventBuid(example);
        this.selectWeek(example);

    },
    nextMonth: function(example) {
        var l = example.calendarMonths.length,
        nMonth = util.getNextMonth(example.calendarMonths[l - 1]);
    if (l > 1) {
        example.calendarMonths.splice(0, 1);
        example.calendarMonths.push(nMonth)
    } else {
        example.calendarMonths = [nMonth]
    }
            // var l = example.monthArr.length,
            //     month = example.monthArr[l - 1].substring(5, 7) - 0,
            //     year = example.monthArr[l - 1].substring(0, 4) - 0;
            // if (month == 12) {
            //     year++;
            //     month = 1;
            // } else {
            //     month++;
            // }
            // example.o.month = year + "/" + month;

            // if (l > 1) {
            //     example.monthArr[0] = example.monthArr[l - 1];
            //     example.monthArr[l - 1] = example.o.month;
            // } else {
            //     example.monthArr = [example.o.month]
            // }
            example.$target.html("");
            this.reloadHTML(example);
            this.eventBuid(example);
            this.selectWeek(example)
        }
        //        preNextYear: function (example, type) {
        //
        //            var date = new Date(example.o.month);
        //            if (type === 'pre') {
        //                date = util.formatDate(util.getPreMonth(date), "yyyy/MM");
        //            } else {
        //                date = util.formatDate(util.getNextMonth(date), "yyyy/MM");
        //            }
        //            example.o.month = date;
        //            RenderDom.header(example);
        //            RenderDom.renderCon(example);
        //        }

};
var TD_WeekPicke = function(target, options) {
    this.calendarMonths = [];
    //this.o.target.html("");
    this.o = $.extend(true, defaults, options);
    this.$target = $(target);
    Operation.init(this);
};
TD_WeekPicke.prototype = {
    setWeek: Operation.selectWeek
};
module.exports = TD_WeekPicke;