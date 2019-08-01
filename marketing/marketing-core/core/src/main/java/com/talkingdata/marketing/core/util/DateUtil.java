package com.talkingdata.marketing.core.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

/**
 * The type Date util.
 *
 * @author hongsheng
 * @date 2018-02-07
 */
public class DateUtil {

    /**
     * 时间格式化模式
     * yyyyMMddHHmm
     */
    public final static String CREATE_TIME_PATTERN = "yyyyMMddHHmm";

    /**
     * 标准日期格式
     */
    public final static String STANDARD_DATE_TIME_PATTERN = "yyyy-MM-dd HH:mm:ss";

    /**
     * 日期格式化模式
     * yyyyMMdd
     */
    public final static String TIMEAXIS_PATTERN = "yyyyMMdd";

    /**
     * Gets current week.
     *
     * @return the current week
     */
    public static int getCurrentWeek() {
        return Calendar.getInstance().get(Calendar.DAY_OF_WEEK);
    }

    /**
     * Gets specific date.
     *
     * @param date        the date
     * @param granularity the granularity
     * @return the specific date
     */
    public static int getSpecificDate(Date date, int granularity) {
        Calendar c = Calendar.getInstance();
        c.setTime(date);
        return c.get(granularity);
    }

    /**
     * Gets current date.
     *
     * @return the current date
     */
    public static int getCurrentDate() {
        return Calendar.getInstance().get(Calendar.DATE);
    }

    /**
     * Gets current hour.
     *
     * @return the current hour
     */
    public static int getCurrentHour() {
        return Calendar.getInstance().get(Calendar.HOUR_OF_DAY);
    }

    /**
     * Gets current minute.
     *
     * @return the current minute
     */
    public static int getCurrentMinute() {
        return Calendar.getInstance().get(Calendar.MINUTE);
    }

    /**
     * Gets specific date format.
     *
     * @param date the date
     * @return the specific date format
     */
    public static Long getSpecificDateFormat(Date... date) {
        if (date.length == 0) {
            date = new Date[1];
            date[0] = new Date();
        }
        SimpleDateFormat df = new SimpleDateFormat(CREATE_TIME_PATTERN);
        return Long.parseLong(df.format(date[0]));
    }

    /**
     * Date 2 string string.
     *
     * @param format the format
     * @param date   the date
     * @return the string
     */
    public static String date2String(String format, Date... date) {
        if (date.length == 0) {
            date = new Date[1];
            date[0] = new Date();
        }
        SimpleDateFormat formatter = new SimpleDateFormat(format);
        String dateString = formatter.format(date[0]);
        return dateString;
    }

    /**
     * String 2 date date.
     *
     * @param format     the format
     * @param dateString the date string
     * @return the date
     * @throws ParseException the parse exception
     */
    public static Date string2Date(String format, String dateString) throws ParseException {
        SimpleDateFormat formatter = new SimpleDateFormat(format);
        return formatter.parse(dateString);
    }

    /**
     * Gets hours after.
     *
     * @param hour the hour
     * @return the hours after
     */
    public static Date getHoursAfter(int hour) {
        Date date = new Date(System.currentTimeMillis() + hour * 60 * 60 * 1000);
        return date;
    }

    /**
     * Gets hours before.
     *
     * @param date the date
     * @param hour the hour
     * @return the hours before
     */
    public static Date getHoursBefore(Date date, int hour) {
        return new Date(date.getTime() - hour * 60 * 60 * 1000);
    }

    // /**
    // * Gets hours after.
    // *
    // * @param date the date
    // * @param hour the hour
    // * @return the hours after
    // */
    // public static Long getHoursAfter(Date date, int hour) {
    // Date dt = new Date(date.getTime() + hour * 60 * 60 * 1000);
    // return string2Long(date2String(Constant.CREATE_TIME_PATTERN, dt));
    // }

    /**
     * String 2 long long.
     *
     * @param str the str
     * @return the long
     */
    public static Long string2Long(String str) {
        long l = Long.parseLong(str);
        return l;
    }

    /**
     * Gets string.
     *
     * @param yymmddhhmm the yymmddhhmm
     * @return the string
     */
    public static String getyymmddString(String yymmddhhmm) {
        String substring = yymmddhhmm.substring(0, 8);
        return substring;
    }

    /**
     * //获取当天的开始时
     *
     * @return begin of tomorrow
     */
    public static Long getBeginOfTomorrow() {
        Calendar cal = new GregorianCalendar();
        cal.add(Calendar.DAY_OF_MONTH, 1);
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MILLISECOND, 0);
        return cal.getTimeInMillis();
    }

    /**
     * Days between int.
     *
     * @param date1 the date 1
     * @param date2 the date 2
     * @return the int
     * @throws ParseException the parse exception
     */
    public static int daysBetween(Date date1, Date date2) throws ParseException {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        date1 = sdf.parse(sdf.format(date1));
        date2 = sdf.parse(sdf.format(date2));
        Calendar cal = Calendar.getInstance();
        cal.setTime(date1);
        long time1 = cal.getTimeInMillis();
        cal.setTime(date2);
        long time2 = cal.getTimeInMillis();
        long betweenDays = (time2 - time1) / (1000 * 3600 * 24);
        return Integer.parseInt(String.valueOf(betweenDays));
    }

    /**
     * Is today boolean.
     *
     * @param date the date
     * @return the boolean
     */
    public static Boolean isToday(Date date) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        String dateStr = sdf.format(date);
        String todayStr = sdf.format(new Date());
        return dateStr.equals(todayStr);
    }

    /**
     * Transfer date format string.
     *
     * @param dateStr the date str
     * @return the string
     * @throws ParseException the parse exception
     */
    public static String transferDateFormat(String dateStr) throws ParseException {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHH");
        SimpleDateFormat sdf2 = new SimpleDateFormat("yyyy/MM/dd HH:mm");
        Date date = sdf.parse(dateStr);
        return sdf2.format(date);
    }

    /**
     * Gets begin of today.
     *
     * @return the begin of today
     */
    public static Date getBeginOfToday() {
        Calendar c = Calendar.getInstance();
        c.setTime(new Date());
        c.set(Calendar.HOUR_OF_DAY, 0);
        c.set(Calendar.MINUTE, 0);
        c.set(Calendar.SECOND, 0);
        c.set(Calendar.MILLISECOND, 0);
        return c.getTime();
    }

    /**
     * Gets start date in year.
     *
     * @return the start date in year
     */
    public static Date getStartDateInYear() {
        Calendar calendar = Calendar.getInstance();
        int value = calendar.get(Calendar.YEAR);
        calendar.clear();
        calendar.set(Calendar.YEAR, value);
        return calendar.getTime();

    }

    /**
     * Gets end date in year.
     *
     * @return the end date in year
     */
    public static Date getEndDateInYear() {
        Calendar calendar = Calendar.getInstance();
        int value = calendar.get(Calendar.YEAR);
        calendar.clear();
        calendar.set(Calendar.YEAR, value);
        calendar.roll(Calendar.DAY_OF_YEAR, -1);
        return calendar.getTime();
    }

    /**
     * Get last time in day date.
     *
     * @param date the date
     * @return the date
     */
    public static Date getLastTimeInDay(Date date) {
        Calendar c = Calendar.getInstance();
        c.setTime(date);
        c.set(Calendar.HOUR_OF_DAY, 23);
        c.set(Calendar.MINUTE, 59);
        c.set(Calendar.SECOND, 59);
        c.set(Calendar.MILLISECOND, 999);
        return c.getTime();
    }

    /**
     * Gets start time in day.
     *
     * @param date the date
     * @return the start time in day
     */
    public static Date getStartTimeInDay(Date date) {
        Calendar c = Calendar.getInstance();
        c.setTime(date);
        c.set(Calendar.HOUR_OF_DAY, 0);
        c.set(Calendar.MINUTE, 0);
        c.set(Calendar.SECOND, 0);
        c.set(Calendar.MILLISECOND, 0);
        return c.getTime();
    }

    /**
     * Gets format date str.
     *
     * @param day         the day
     * @param hour        the hour
     * @param granularity the granularity
     * @return the format date str
     * @throws ParseException the parse exception
     */
    public static String getFormatDateStr(String day, Integer hour, String granularity) throws ParseException {
        SimpleDateFormat sd = new SimpleDateFormat("yyyyMMdd");
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        SimpleDateFormat sdh = new SimpleDateFormat("yyyyMMddHH");
        SimpleDateFormat sdfh = new SimpleDateFormat("yyyy-MM-dd kk:mm");

        Date date = sd.parse(day);
        // 默认为天
        String dateStr = sdf.format(date);
        final String hourTag = "H";
        final int twoChar = 2;
        final int militaryTime = 24;
        if (null != hour && null != granularity && hourTag.equalsIgnoreCase(granularity)) {
            if (1 == (hour + "").length()) {
                day = day + "0" + hour;
            } else if (twoChar == (hour + "").length()) {
                day = day + hour;
            }
            Date dateh = sdh.parse(day);
            // 24小时制，24点时日期会往后一天，需要向前推一天
            if (hour == militaryTime) {
                dateh = getHoursBefore(dateh, 24);
            }
            dateStr = sdfh.format(dateh);
        }
        return dateStr;
    }

    /**
     * 转换日期类型为字符串 可以自定义格式yyyyMMddHHmmss
     *
     * @param dt     Date对象
     * @param format the format
     * @return 字符串 string
     */
    public static String formatDateTime(Date dt, String format) {
        SimpleDateFormat sdf = new SimpleDateFormat(format);
        if (dt == null) {
            return "";
        }
        return sdf.format(dt);
    }

    /**
     * Format string.
     *
     * @param dt the dt
     * @return the string
     */
    public static String format(Date dt) {
        return formatDateTime(dt, "yyyy-MM-dd HH:mm:ss");
    }

    /**
     * 两个日期的月份差
     *
     * @param fromDate 起始日期
     * @param toDate   结束日期
     * @return 两日期的月分差，例1998-4-21~1998-6-21 相差两个月 返回2
     * @since 0.1
     */
    public static int getDiffMonth(Date fromDate, Date toDate) {
        Calendar c = Calendar.getInstance();
        c.setTime(fromDate);
        int fromYear = c.get(Calendar.YEAR);
        int fromMonth = c.get(Calendar.MONTH) + 1;
        c.setTime(toDate);
        int toYear = c.get(Calendar.YEAR);
        int toMonth = c.get(Calendar.MONTH) + 1;
        int monthCount = 0;

        if (toYear == fromYear) {
            monthCount = toMonth - fromMonth;
        } else if (toYear - fromYear == 1) {
            monthCount = 12 - fromMonth + toMonth;
        } else {
            monthCount = 12 - fromMonth + 12 * (toYear - fromYear - 1) + toMonth;
        }
        return monthCount;
    }

    /**
     * 两个日期的天数差
     *
     * @param fromDate 起始日期
     *                 ，结束日期
     * @return toDate 两日期的月分差，例1998-4-21~1998-4-25 相差两个月 返回4
     * @since 0.1
     */
    public static int getDiffDays(Date fromDate, Date toDate) {
        return (int)((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24));
    }

    /**
     * 两个日期之间的小时数
     * 注意此方法返回的两个日期之间的小时数，计算得出得小数部分将直接舍去
     *
     * @param startDate 起始日期
     * @param endDate   结束日期
     * @return toDate 两日期的月分差，例1998-4-21~1998-4-25 相差两个月 返回4
     * @since 0.1
     */
    public static int getDiffHours(Date startDate, Date endDate) {
        return (int)((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60));
    }

    public static String formatDate2StandradString(Date date) {
        return formatDateTime(date, STANDARD_DATE_TIME_PATTERN);
    }

    /**
     * 当前日期加减天数
     *
     * @param date
     * @return
     */
    public static Date getCalculateDay(Date date, int num) {

        Calendar calendar = new GregorianCalendar();
        calendar.setTime(date);
        calendar.add(Calendar.DATE, num);
        date = calendar.getTime();

        return date;
    }

    /**
     * The entry point of application.
     *
     * @param args the input arguments
     * @throws ParseException the parse exception
     */
    public static void main(String[] args) throws ParseException {
        System.out.println(DateUtil.getDiffHours(DateUtil.string2Date("yyyy-MM-dd HH:mm:ss", "2018-02-28 13:15:00"), new Date()));
    }

    public static Calendar getCalendar(String dateStr, String pattern) {
        // 声明一个Date类型的对象
        Date date = null;
        // 声明格式化日期的对象
        SimpleDateFormat format = null;
        Calendar calendar = null;
        if (dateStr != null) {
            // 创建日期的格式化类型
            format = new SimpleDateFormat(pattern);
            // 创建一个Calendar类型的对象
            calendar = Calendar.getInstance();
            // forma.parse()方法会抛出异常
            try {
                //解析日期字符串，生成Date对象
                date = format.parse(dateStr);
                // 使用Date对象设置此Calendar对象的时间
                calendar.setTime(date);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return calendar;
    }
}
