package td.enterprise.wanalytics.etl.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.time.DateFormatUtils;

/**
 * Created by Yan on 2017/3/6.
 */

import lombok.extern.slf4j.Slf4j;
@Slf4j
public class DateUtil {

    public static final String PATTERN = "yyyy-MM-dd HH:mm:ss";

    public static final String PATTERN_DATE = "yyyy-MM-dd";

    public static final String FACT_DATE1 = "yyyyMMdd";

    public static final String FACT_DATE2 = "yyyyMMdd  HH:mm:ss";

    private final static String DATE_STR = "yyyy-MM-dd";
    private final static String MONTH_STR = "yyyy-MM";



    /**
     * 取得当前时间
     *
     * @return 当前时间
     */
    public static Date newNow() {
        return Calendar.getInstance().getTime();
    }

    /**
     * 求两个日期中较小的日期
     *
     * @param
     * @return 返回小日期
     * @since 0.1
     */
    public static Date getSmallDate(Date date1, Date date2) {
        return date1.compareTo(date2) < 0 ? date1 : date2;
    }

    /**
     * 求两个日期中较大的日期
     *
     * @param date1
     *            ，日期2
     * @return 返回大日期
     * @since 0.1
     */
    public static Date getBigDate(Date date1, Date date2) {
        return date1.compareTo(date2) > 0 ? date1 : date2;
    }

    /**
     * 在给定日期上增减一段时间
     *
     * @param monthAmount
     *            月数
     * @param date
     *            给定日期
     * @return 增减后的日期
     */
    public static Date addMonth2Date(int monthAmount, Date date) {
        Date newDate = null;
        if (date != null) {
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(date);
            calendar.add(Calendar.MONTH, monthAmount);
            newDate = calendar.getTime();
        }
        return newDate;
    }

    /**
     * 在给定日期上增减一段时间
     *
     * @param minuteAmount
     *            分钟数
     * @param date
     *            给定日期
     * @return 增减后的日期
     */
    public static Date addMinute2Date(int minuteAmount, Date date) {
        Date newDate = null;
        if (date != null) {
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(date);
            calendar.add(Calendar.MINUTE, minuteAmount);
            newDate = calendar.getTime();
        }
        return newDate;
    }

    /**
     * 在给定日期上增减一段时间
     *
     * @param days
     *            分钟数
     * @param date
     *            给定日期
     * @return 增减后的日期
     */
    public static Date addDay2Date(int days, Date date) {
        Date newDate = null;
        if (date != null) {
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(date);
            calendar.add(Calendar.DATE, days);
            newDate = calendar.getTime();
        }
        return newDate;
    }

    /**
     * 此方法将给出的和日期格式化成本地日期形式的字符串。(只含有年月日)
     *
     * @param date 待格式的日期
     * @return 本地日期形式的字符串。例：1983-12-29
     * @since 0.1
     */
    public static String formatDate2NN(Date date) {
        StringBuffer dateBuffer = new StringBuffer("");
        if (date != null) {
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(date);
            dateBuffer.append(calendar.get(Calendar.YEAR) + "-");
            dateBuffer.append((calendar.get(Calendar.MONTH) + 1) + "-");
            dateBuffer.append(calendar.get(Calendar.DAY_OF_MONTH));
        }
        return dateBuffer.toString();
    }

    /**
     * 此方法将给出的和日期格式化成本地日期形式的字符串。(只含有年月日)
     * 月，日小于10补0
     *
     * @param date 待格式的日期
     * @return 本地日期形式的字符串。例：1983-12-29
     * @since 0.1
     */
    public static String formatDate2NNEnhance(Date date) {
        StringBuffer dateBuffer = new StringBuffer("");
        if (date != null) {
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(date);
            dateBuffer.append(calendar.get(Calendar.YEAR) + "-");

            int month = calendar.get(Calendar.MONTH) + 1;
            int day = calendar.get(Calendar.DAY_OF_MONTH);
            String monthStr = formatNum(month) + "-";
            String dayStr = formatNum(day);
            dateBuffer.append(monthStr);
            dateBuffer.append(dayStr);
        }
        return dateBuffer.toString();
    }



    /**
     * 此方法将给出的和日期格式化成本地日期形式的字符串。（只含有年月日
     *
     * @param date 待格式的日期
     * @return 本地日期形式的字符串。例：1983年12月29日
     * @since 0.1
     */
    public static String formatDate2NC(Date date) {
        StringBuffer dateBuffer = new StringBuffer("");
        if (date != null) {
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(date);
            dateBuffer.append(calendar.get(Calendar.YEAR) + "年");
            dateBuffer.append((calendar.get(Calendar.MONTH) + 1) + "月");
            dateBuffer.append(calendar.get(Calendar.DAY_OF_MONTH) + "日");
        }
        return dateBuffer.toString();
    }


    /**
     * 将字符串解析成日期类型，如果字符串含有/则按/分割,否则以-分
     *
     * @param dateStr 待解析的字符串
     * @return 解析后的日期
     * @since 0.1
     */
    public static Date getDate(String dateStr) {
        Date date = null;
        try {
            if (dateStr != null) {
                String separator = dateStr.indexOf('/') > 0 ? "/" : "-";
                SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy" + separator + "MM" + separator + "dd");
                date = simpleDateFormat.parse(dateStr);
            }
        } catch (Exception e) {
            log.info(e.getMessage());
        }
        return date;
    }

    /**
     * 将字符串解析成日期时间类型，如果字符串含有/则按/分割,否则以-分
     *
     * @param dateTimeStr
     *            待解析的字符串
     * @return 解析后的日期
     */
    public static Date getDateTime(String dateTimeStr) {
        Date date = null;
        try {
            String separator = dateTimeStr.indexOf('/') > 0 ? "/" : "-";
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy" + separator + "MM" + separator);
            date = simpleDateFormat.parse(dateTimeStr);
        } catch (Exception e) {
            log.info(e.getMessage());
        }
        return date;
    }

    /**
     * 将字符串解析成日期类型，如果字符串含有/则按/分割,否则以-分
     *
     * @param dateStr 待解析的字符串
     * @return 解析后的日期
     * @since 0.1
     */
    public static Date getDateFull(String dateStr) {
        Date date = null;
        try {
            if (dateStr != null) {
                String separator = dateStr.indexOf('/') > 0 ? "/" : "-";
                SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy" + separator + "MM" + separator + "dd " + "HH:mm:ss");
                date = simpleDateFormat.parse(dateStr);
            }
        } catch (Exception e) {
            log.info(e.getMessage());
        }
        return date;
    }

    /**
     * 取得传入日期的年
     *
     * @param date 待解析的日期
     * @return 该日期的年份
     * @since 0.1
     */
    public static int getYear(Date date) {
        Calendar c = Calendar.getInstance();
        c.setTime(date);
        return c.get(Calendar.YEAR);
    }

    /**
     * 取得传入日期的月
     *
     * @param date 待解析的日期
     * @return 该日期的月份
     * @since 0.1
     */
    public static int getMonth(Date date) {
        Calendar c = Calendar.getInstance();
        c.setTime(date);
        return c.get(Calendar.MONTH) + 1;
    }

    /**
     * 两个日期的月份差
     *
     * @param fromDate 起始日期
     * @param toDate 结束日期
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
     * @param toDate 结束日期
     * @return 两日期的月分差，例1998-4-21~1998-4-25 相差两个月 返回4
     * @since 0.1
     */
    public static int getDiffDays(Date fromDate, Date toDate) {
        return (int) ((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24));
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
     * 月份进行加减
     *
     * @param date
     * @return
     */
    public static Date getCalculateMonthDay(Date date, int num) {

        Calendar calendar = new GregorianCalendar();
        calendar.setTime(date);
        calendar.add(Calendar.MONTH, num);
        date = calendar.getTime();

        return date;
    }


    /**
     * 年份进行加减
     *
     * @param date
     * @return
     */
    public static Date getCalculateYearDay(Date date, int num) {

        Calendar calendar = new GregorianCalendar();
        calendar.setTime(date);
        calendar.add(Calendar.YEAR, num);
        date = calendar.getTime();

        return date;
    }

    /**
     * 将Date类型转换为字符串
     *
     * @param date
     *            日期类型
     * @param pattern
     *            字符串格式
     * @return 日期字符串
     */
    public static String format(Date date, String pattern) {
        if (date == null) {
            return "null";
        }
        if (pattern == null || pattern.equals("") || pattern.equals("null")) {
            pattern = PATTERN;
        }
        return new SimpleDateFormat(pattern).format(date);
    }

    /**
     * 将字符串类型时间转换成需要的字符串格式
     * @param dateStr
     * @param pattern
     * @return
     * @throws Exception
     */
    public static String formatString(String dateStr, String pattern) throws Exception{
        if(StringUtils.isEmpty(dateStr)){
            return null;
        }

        if(StringUtils.isEmpty(pattern)){
            pattern = "yyyy-MM-dd HH:mm:ss";
        }

        //yyyy-MM-dd HH:mm:ss

        String separator = "";
        if(dateStr.contains("/") || dateStr.contains("-")){
            separator = dateStr.indexOf('/') > 0 ? "/" : "-";
        }
        boolean timeSep = dateStr.contains(":");
        String datePattern = "";
        if("/".equals(separator) && timeSep){
            datePattern = "yyyy/MM/dd HH:mm:ss";
        }else if("/".equals(separator) && !timeSep){
            datePattern = "yyyy/MM/dd";
        }else if("-".equals(separator) && timeSep){
            datePattern = "yyyy-MM-dd HH:mm:ss";
        }else if("-".equals(separator) && !timeSep){
            datePattern = "yyyy-MM-dd";
        }else if("".equals(separator) && timeSep){
            datePattern = "yyyyMMdd HH:mm:ss";
        }else if("".equals(separator) && !timeSep){
            datePattern = "yyyyMMdd";
        }

        Date tempDate = new SimpleDateFormat(datePattern).parse(dateStr);
        String resultDate = new SimpleDateFormat(pattern).format(tempDate);

        return resultDate;
    }

    /**
     * 将字符串转换为Date类型
     *
     * @param date
     *            字符串类型
     * @return 日期类型
     */
    public static Date format(String date) {
        return format(date, null);
    }

    /**
     * 将字符串转换为Date类型
     *
     * @param date
     *            字符串类型
     * @param pattern
     *            格式
     * @return 日期类型
     */
    public static Date format(String date, String pattern) {
        if (pattern == null || pattern.equals("") || pattern.equals("null")) {
            pattern = PATTERN;
        }
        if (date == null || date.equals("") || date.equals("null")) {
            return new Date();
        }
        Date d = null;
        try {
            d = new SimpleDateFormat(pattern).parse(date);
        } catch (ParseException pe) {
        }
        return d;
    }

    /**
     * 获取昨天起始
     *
     * @return
     */
    public static String getYestodayStart() {
        Date yestoday = getCalculateDay(newNow(), -1);
        String yestodayStr = format(yestoday, PATTERN_DATE);
        return yestodayStr + " 00:00:00";
    }

    public static String getTodayStart() {
        String todayStart = format(newNow(), PATTERN_DATE);
        return todayStart + " 00:00:00";
    }

    public static String getNow() {
        String now = format(newNow(), PATTERN);
        return now;
    }

    public static String getYestoday() {
        Date yestoday = getCalculateDay(newNow(), -1);
        String yestodayStr = format(yestoday, FACT_DATE1);
        return yestodayStr;
    }

    /**
     *
     * @param starttime
     * @param endtime
     * @param order
     *            大于0是正序，小于0是倒序
     * @return
     */
    public static List<String> getTimeRange(String starttime, String endtime, int order) {

        List<String> result = new ArrayList<String>();
        SimpleDateFormat sdf = new SimpleDateFormat(FACT_DATE1);
        result.add(starttime);

        if (starttime.equals(endtime)) {
            return result;
        }

        try {
            Date begin = sdf.parse(starttime);
            Date end = null;

            if (StringUtils.isBlank(endtime)) {
                end = new Date();

            } else {
                end = sdf.parse(endtime);
            }
            Calendar cal = Calendar.getInstance();
            // 使用给定的 Date 设置此 Calendar 的时间
            cal.setTime(begin);
            boolean bContinue = true;
            while (bContinue) {
                // 根据日历的规则，为给定的日历字段添加或减去指定的时间量
                cal.add(Calendar.DAY_OF_MONTH, 1);
                // 测试此日期是否在指定日期之后
                if (end.after(cal.getTime())) {
                    if (order < 0) {
                        result.add(0, sdf.format(cal.getTime()));

                    } else {
                        result.add(sdf.format(cal.getTime()));
                    }
                } else {
                    break;
                }
            }

            if (order < 0) {
                result.add(0, sdf.format(end));

            } else {
                result.add(sdf.format(end));
            }

        } catch (ParseException e) {
            e.printStackTrace();
        }
        return result;
    }

    public static boolean isDate(String date)
    {
        /**
         * 判断日期格式和范围
         */
        String rexp = "^((\\d{2}(([02468][048])|([13579][26]))[\\-\\/\\s]?((((0?[13578])|(1[02]))[\\-\\/\\s]?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[\\-\\/\\s]?((0?[1-9])|([1-2][0-9])|(30)))|(0?2[\\-\\/\\s]?((0?[1-9])|([1-2][0-9])))))|(\\d{2}(([02468][1235679])|([13579][01345789]))[\\-\\/\\s]?((((0?[13578])|(1[02]))[\\-\\/\\s]?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[\\-\\/\\s]?((0?[1-9])|([1-2][0-9])|(30)))|(0?2[\\-\\/\\s]?((0?[1-9])|(1[0-9])|(2[0-8]))))))";

        Pattern pat = Pattern.compile(rexp);

        Matcher mat = pat.matcher(date);

        boolean dateType = mat.matches();

        return dateType;
    }

    /**
     * 假装使用UTC时间，实际时间为本地时间，只是中间加了一个T
     * @return
     */
    public static String simulateUTCTime(Date date) {
        Date localTime = date;
        if(date == null) {
            localTime = new Date();
        }
        String uctFormate = "yyyy-MM-dd'T'HH:mm:ss";

        return DateFormatUtils.format(localTime, uctFormate);
    }
    /**
     * @param temp
     * @return java.lang.String
     * @roseuid 44D6EB7800CF
     */
    private static String formatNum(int temp) {
        String reStr;
        if (temp < 10) {
            reStr = "0" + temp;
        } else {
            reStr = "" + temp;
        }
        return reStr;
    }

    /**
     * 获取指定日期前的，日期字符串，比如20160427，30天就是20160327，60天就是20160227
     * @param date  格式是yyyyMMdd或者yyyy-MM-dd
     * @param days
     * @return  返回yyyy-MM-dd格式
     */
    public static String getDateString(String date, int days){
        if(StringUtils.isNotEmpty(date)){
            SimpleDateFormat dateFormater = null ;
            SimpleDateFormat resultFormater = new SimpleDateFormat("yyyy-MM-dd") ;
            GregorianCalendar gc = new GregorianCalendar();
            if(date.indexOf("-") != -1){
                dateFormater = new SimpleDateFormat("yyyy-MM-dd");
            }else{
                dateFormater = new SimpleDateFormat("yyyyMMdd");
            }
            try {
                Date tempDate = dateFormater.parse(date);
                gc.setTime(tempDate);
                gc.add(5,days);
                return resultFormater.format(gc.getTime());
            } catch (ParseException e) {
                e.printStackTrace();
            }
        }
        return null;
    }

    /**
     * 获取月的第一天
     * @param date
     * @return
     */
    public static String getFirstdDayOfMonth(String date){
        if(StringUtils.isNotEmpty(date)){
            SimpleDateFormat resultFormater = new SimpleDateFormat("yyyy-MM-dd") ;
            Calendar  gc = Calendar.getInstance();
            try {
                Date tempDate = resultFormater.parse(date);
                gc.setTime(tempDate);
                gc.set(Calendar.DAY_OF_MONTH, 1);
                return resultFormater.format(gc.getTime());
            } catch (ParseException e) {
                e.printStackTrace();
            }
        }
        return null;
    }

    /**
     * 获取月的最后一天
     * @param date
     * @return
     */
    public static String getLastdDayOfMonth(String date){
        if(StringUtils.isNotEmpty(date)){
            SimpleDateFormat resultFormater = new SimpleDateFormat("yyyy-MM-dd") ;
            Calendar  gc = Calendar.getInstance();
            try {
                Date tempDate = resultFormater.parse(date);
                gc.setTime(tempDate);
                gc.set(Calendar.DAY_OF_MONTH, gc.getActualMaximum(Calendar.DAY_OF_MONTH));
                return resultFormater.format(gc.getTime());
            } catch (ParseException e) {
                e.printStackTrace();
            }
        }
        return null;
    }

    /**
     * 获取月的第一天
     * @param date
     * @return
     */
    public static String getFirstDay(String date){
        if(StringUtils.isNotEmpty(date)){
            SimpleDateFormat resultFormater = new SimpleDateFormat("yyyy-MM") ;
            Calendar  gc = Calendar.getInstance();
            try {
                Date tempDate = resultFormater.parse(date);
                gc.setTime(tempDate);
                gc.set(Calendar.DAY_OF_MONTH,1);
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                return sdf.format(gc.getTime());
            } catch (ParseException e) {
                e.printStackTrace();
            }
        }
        return null;
    }

    /**
     * 获取月的最后一天
     * @param date
     * @return
     */
    public static String getLastDay(String date){
        if(StringUtils.isNotEmpty(date)){
            SimpleDateFormat resultFormater = new SimpleDateFormat("yyyy-MM") ;
            Calendar  gc = Calendar.getInstance();
            try {
                Date tempDate = resultFormater.parse(date);
                gc.setTime(tempDate);
                gc.set(Calendar.DAY_OF_MONTH, gc.getActualMaximum(Calendar.DAY_OF_MONTH));
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                return sdf.format(gc.getTime());
            } catch (ParseException e) {
                e.printStackTrace();
            }
        }
        return null;
    }

    public static String getStartDate(String runDate){
        return getLastMonthOneday (runDate);
    }
    public static String getStartDateBynum(String runDate,int cycle_statistics){
        return getDateString (runDate,0 - cycle_statistics);
    }

    /**
     * 获取上个月第一天
     * @param runDate
     * @return
     */
    public static String getLastMonthOneday(String runDate) {
        Calendar ca = Calendar.getInstance();
        Date date =format(runDate, PATTERN_DATE);
        ca.setTime(date); //传入今天的日期  yyyy-MM-dd
        ca.add(Calendar.MONTH, -1);   // 设为“下一个月”
        ca.set(Calendar.DATE, 1);   // 设为“第一天”
        return format(ca.getTime(), PATTERN_DATE);
    }

    /**
     * 获取上个月最后一天
     * @param runDate
     * @return
     */
    public static String getLastMonthLastDay(String runDate) {
        Calendar ca = Calendar.getInstance();
        Date date =format(runDate, PATTERN_DATE);
        ca.setTime(date); //传入今天的日期  yyyy-MM-dd
        ca.add(Calendar.MONTH, 0);   // 设为“上一个月”
        ca.set(Calendar.DATE, 0);   // 设为“最后一天”
        return format(ca.getTime(), PATTERN_DATE);
    }

    public static String getEndDate(String runDate){
        return getLastMonthLastDay (runDate);
    }
    public static String getEndDateBynum(String runDate){
        return getDateString (runDate, - 1);

    }

    /**
     * 获取当前日期
     * @param date
     * @return
     */
    public static String getCurrentDate(String date){
        SimpleDateFormat sdf= new SimpleDateFormat(DATE_STR);
        try {
            date = sdf.format(date);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return date;
    }

    /**
     * 获取当前日期
     * @return
     */
    public static String getCurrentDate(){
        SimpleDateFormat sdf=new SimpleDateFormat(DATE_STR);
        String date = null;
        try {
             date = sdf.format(new Date());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return date;
    }

    /**
     * 获取当前日期
     * @return
     */
    public static Long getTime(String date){
        SimpleDateFormat sdf=new SimpleDateFormat(DATE_STR);
        try {
            Date dateValue  = sdf.parse(date);
            return dateValue.getTime();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 获取月的天数
     * @param date
     * @return
     */
    public static int getNumofMonth(String date){
        int year = Integer.parseInt(date.split("-")[0]);
        int month = Integer.parseInt(date.split("-")[1]);
        Calendar time=Calendar.getInstance();
        time.clear();
        //year年
        time.set(Calendar.YEAR,year);
        //Calendar对象默认一月为0,month月
        time.set(Calendar.MONTH,month-1);
        int day=time.getActualMaximum(Calendar.DAY_OF_MONTH);//本月份的天数
        return day;
    }

    /**
     * 获取日期间隔
     * @param start
     * @param end
     * @return
     */
    public static int getDateLength(String start, String end){
        int days = 0;
        try {
            //时间转换类
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            Date date1 = sdf.parse(start);
            Date date2 = sdf.parse(end);
            //将转换的两个时间对象转换成Calendard对象
            Calendar can1 = Calendar.getInstance();
            can1.setTime(date1);
            Calendar can2 = Calendar.getInstance();
            can2.setTime(date2);
            //拿出两个年份
            int year1 = can1.get(Calendar.YEAR);
            int year2 = can2.get(Calendar.YEAR);
            Calendar can = null;
            //如果can1 < can2
            //减去小的时间在这一年已经过了的天数
            //加上大的时间已过的天数
            if(can1.before(can2)){
                days -= can1.get(Calendar.DAY_OF_YEAR);
                days += can2.get(Calendar.DAY_OF_YEAR);
                can = can1;
            }else{
                days -= can2.get(Calendar.DAY_OF_YEAR);
                days += can1.get(Calendar.DAY_OF_YEAR);
                can = can2;
            }
            for (int i = 0; i < Math.abs(year2-year1); i++) {
                //获取小的时间当前年的总天数
                days += can.getActualMaximum(Calendar.DAY_OF_YEAR);
                //再计算下一年。
                can.add(Calendar.YEAR, 1);
            }
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return days+1;
    }


    public static String getYDate(){
        SimpleDateFormat sdf=new SimpleDateFormat(MONTH_STR);
        String date = "";
        try {
            date = sdf.format(new Date());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return date;
    }

    /**
     * 获取月的第一天
     * @param month
     * @return
     */
    public static String getMonthStartDay(String month){
        SimpleDateFormat sdf = new SimpleDateFormat(MONTH_STR);
        Date date = null;
        try {
            date = sdf.parse(month);
        } catch (ParseException e) {
            e.printStackTrace();
        }

        SimpleDateFormat format = new SimpleDateFormat(DATE_STR);
        Calendar c = Calendar.getInstance();
        c.setTime(date);
        c.add(Calendar.MONTH, 0);
        c.set(Calendar.DAY_OF_MONTH, 1);// 设置为1号,当前日期既为本月第一天
        String first = format.format(c.getTime());
        return first;
    }

    /**
     * 获取月的最后一天
     * @param month
     * @return
     */
    public static String getMonthEndDay(String month){
        SimpleDateFormat sdf = new SimpleDateFormat(MONTH_STR);
        Date date = null;
        try {
            date = sdf.parse(month);
        } catch (ParseException e) {
            e.printStackTrace();
        }

        SimpleDateFormat format = new SimpleDateFormat(DATE_STR);
        Calendar ca = Calendar.getInstance();
        ca.setTime(date);
        ca.set(Calendar.DAY_OF_MONTH, ca.getActualMaximum(Calendar.DAY_OF_MONTH));
        String last = format.format(ca.getTime());
        return last;
    }

    /**
     * 字符串转换成毫秒
     * @param date
     * @return
     */
    public static Long getTimeStamp(String date, String pattern){
        Calendar c = Calendar.getInstance();
        try {
            c.setTime(new SimpleDateFormat(pattern).parse(date));
            return c.getTimeInMillis();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 获取两个时间间隔的月份
     * @param starttime
     * @param endtime
     * @param format
     * @return
     */
    public static List<String> getDateRange(String starttime, String endtime,
                                                 String format) {
        List<String> result = new ArrayList<String>();
        SimpleDateFormat sdf = new SimpleDateFormat(format);
        if (starttime.equals(endtime)) {
            result.add(starttime);
            return result;
        }
        try {
            Date begin = sdf.parse(starttime);
            Date end = sdf.parse(endtime);
            result.add(starttime);
            Calendar cal = Calendar.getInstance();
            // 使用给定的 Date 设置此 Calendar 的时间
            cal.setTime(begin);
            boolean bContinue = true;
            while (bContinue) {
                // 根据日历的规则，为给定的日历字段添加或减去指定的时间量
//                cal.add(Calendar.MONTH, 1); //月
                cal.add(Calendar.DAY_OF_MONTH, 1); //天
                // 测试此日期是否在指定日期之后
                if (end.after(cal.getTime())) {
                    result.add(sdf.format(cal.getTime()));
                } else {
                    break;
                }
            }
            result.add(endtime);// 把结束时间加入集合
        } catch (ParseException e) {
            e.printStackTrace();
        }

        return result;
    }



    public static String getCurrentDate(long time){
        Date date = new Date(time);
        SimpleDateFormat f = new SimpleDateFormat("yyyy-MM-dd") ;
        return f.format(date);
    }

    /**
     * 根据运行日期，获取上个月份
     * @param runDate
     * @return
     * @throws ParseException
     */
    public static String getPreviousMonth(String runDate) throws ParseException{
        SimpleDateFormat f = new SimpleDateFormat("yyyy-MM-dd") ;
        Date date = f.parse(runDate);
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.add(Calendar.MONTH, - 1 );
//	     int month = cal.get(Calendar.MONTH);
        SimpleDateFormat f2 = new SimpleDateFormat("yyyyMM") ;//结果格式化
        return f2.format(cal.getTime());
    }
    
	public static boolean isToday(Date date) {
		String nowDate = getCurrentDate();
		String dateStr = format(date, PATTERN_DATE);
		if (nowDate.equals(dateStr)) {
			return true;
		} else {
			return false;			
		}
	}
	
	public static boolean isYesterday(Date date) {
		Calendar cal = Calendar.getInstance();
		cal.add(Calendar.DATE, -1);
		String yesterday = format(cal.getTime(), PATTERN_DATE);
		String dateStr = format(date, PATTERN_DATE);
		if (yesterday.equals(dateStr)) {
			return true;
		} else {
			return false;			
		}
	}
	
	public static boolean isCurrentWeek(Date date) {
		int nowWeek = getWeekOfYear(new Date());
		int week = getWeekOfYear(date);
		if (week == nowWeek) {
			return true;
		} else {
			return false;
		}
	}

	public static boolean isCurrentMonth(Date date) {
		String nowMonth = format(new Date(), "yyyy-MM");
		String month = format(date, "yyyy-MM");

		if (nowMonth.equals(month)) {
			return true;
		} else {
			return false;
		}
	}
	
	/**
	 * 每年第一周从第一个整周（7天）开始算。 每周是周一到周日。
	 * @param date
	 */
	public static int getWeekOfYear(Date date) {
		Calendar c = Calendar.getInstance();
		c.setFirstDayOfWeek(Calendar.MONDAY);
		c.setTime(date);
		c.setMinimalDaysInFirstWeek(7);
		return c.get(Calendar.WEEK_OF_YEAR);
	}
	
	// 获得当前 周一的日期, 返回格式 yyyy-MM-dd
	public static String getMonday(Date date) {
		int mondayPlus = getMondayPlus(date);
		GregorianCalendar c = new GregorianCalendar();
		c.setTime(date);
		c.add(GregorianCalendar.DATE, mondayPlus);
		Date monday = c.getTime();
		return format(monday, PATTERN_DATE);
	}
	
	// 获得当前 周日的日期, 返回格式 yyyy-MM-dd
	public static String getSunday(Date date) {
		int mondayPlus = getMondayPlus(date);
		GregorianCalendar c = new GregorianCalendar();
		c.setTime(date);
		c.add(GregorianCalendar.DATE, 6 + mondayPlus);
		Date monday = c.getTime();
		return format(monday, PATTERN_DATE);
	}
	
	// 获得本周一与当前日期相差的天数
	private static int getMondayPlus(Date date) {
		Calendar c = Calendar.getInstance();
		c.setTime(date);
		int dayOfWeek = c.get(Calendar.DAY_OF_WEEK);
		if (dayOfWeek == 1) {
			return -6;
		} else {
			return 2 - dayOfWeek;
		}
	}	
	
	 /** 
     * 获取某年第一天日期 
     * @param year 年份 
     * @return Date 
     */  
    public static Date getYearFirst(int year){  
        Calendar calendar = Calendar.getInstance();  
        calendar.clear();  
        calendar.set(Calendar.YEAR, year);  
        Date currYearFirst = calendar.getTime();  
        return currYearFirst;  
    }  
      
    /** 
     * 获取某年最后一天日期 
     * @param year 年份 
     * @return Date 
     */  
    public static Date getYearLast(int year){  
        Calendar calendar = Calendar.getInstance();  
        calendar.clear();  
        calendar.set(Calendar.YEAR, year);  
        calendar.roll(Calendar.DAY_OF_YEAR, -1);  
        Date currYearLast = calendar.getTime();  
          
        return currYearLast;  
    }  

    public static void main(String args []){
		
		String dateStr = "2017-12-23 00:00:00";
		try {
			String targDateStr = DateUtil.formatString(dateStr, DateUtil.PATTERN_DATE);
			System.out.println(targDateStr);
		} catch (Exception e) {
		}
		
		Date d = DateUtil.format("2018-01-23", DateUtil.PATTERN_DATE);
		System.out.println(DateUtil.isYesterday(d));
		System.out.println(DateUtil.getMonday(d));
		System.out.println(DateUtil.getSunday(d));
		System.out.println(DateUtil.getMonday(new Date()));
		System.out.println(DateUtil.getSunday(new Date()));
		System.out.println(DateUtil.isCurrentMonth(new Date()));
		System.out.println(DateUtil.isToday(new Date()));
		System.out.println(DateUtil.isCurrentWeek(new Date()));
		System.out.println(DateUtil.getMonthStartDay("2018-01-25"));
		System.out.println(DateUtil.getMonthEndDay("2018-02-25"));
    	
        String date = null;
        String firstDay = null;
        String lastDay  = null;
        date = "2016-01-06";
        firstDay = getFirstdDayOfMonth(date);
        lastDay = getLastdDayOfMonth(date);
        log.info("date=" + date + " firstDay=" + firstDay + " lastDay=" + lastDay);

        date = "2016-02-06";
        firstDay = getFirstdDayOfMonth(date);
        lastDay = getLastdDayOfMonth(date);
        log.info("date=" + date + " firstDay=" + firstDay + " lastDay=" + lastDay);


        date = "2016-03-06";
        firstDay = getFirstdDayOfMonth(date);
        lastDay = getLastdDayOfMonth(date);
        log.info("date=" + date + " firstDay=" + firstDay + " lastDay=" + lastDay);


        date = "2016-04-06";
        firstDay = getFirstdDayOfMonth(date);
        lastDay = getLastdDayOfMonth(date);
        log.info("date=" + date + " firstDay=" + firstDay + " lastDay=" + lastDay);

        date = "2016-05-06";
        firstDay = getFirstdDayOfMonth(date);
        lastDay = getLastdDayOfMonth(date);
        log.info("date=" + date + " firstDay=" + firstDay + " lastDay=" + lastDay);

        date = "2016-06-06";
        firstDay = getFirstdDayOfMonth(date);
        lastDay = getLastdDayOfMonth(date);
        log.info("date=" + date + " firstDay=" + firstDay + " lastDay=" + lastDay);


        date = "2016-07-06";
        firstDay = getFirstdDayOfMonth(date);
        lastDay = getLastdDayOfMonth(date);
        log.info("date=" + date + " firstDay=" + firstDay + " lastDay=" + lastDay);

        date = "2016-08-06";
        firstDay = getFirstdDayOfMonth(date);
        lastDay = getLastdDayOfMonth(date);
        log.info("date=" + date + " firstDay=" + firstDay + " lastDay=" + lastDay);


        date = "2016-09-06";
        firstDay = getFirstdDayOfMonth(date);
        lastDay = getLastdDayOfMonth(date);
        log.info("date=" + date + " firstDay=" + firstDay + " lastDay=" + lastDay);

        date = "2016-10-06";
        firstDay = getFirstdDayOfMonth(date);
        lastDay = getLastdDayOfMonth(date);
        log.info("date=" + date + " firstDay=" + firstDay + " lastDay=" + lastDay);


        date = "2016-11-06";
        firstDay = getFirstdDayOfMonth(date);
        lastDay = getLastdDayOfMonth(date);
        log.info("date=" + date + " firstDay=" + firstDay + " lastDay=" + lastDay);

        date = "2016-12-06";
        firstDay = getFirstdDayOfMonth(date);
        lastDay = getLastdDayOfMonth(date);
        log.info("date=" + date + " firstDay=" + firstDay + " lastDay=" + lastDay);
    }
}

