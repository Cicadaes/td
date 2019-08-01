package com.talkingdata.datacloud.util;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.time.DateFormatUtils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class DateUtil {

	public static final String PATTERN = "yyyy-MM-dd HH:mm:ss";

	public static final String PATTERN_DATE = "yyyy-MM-dd";

	public static final String FACT_DATE1 = "yyyyMMdd";

	public static final String FACT_DATE2 = "yyyyMMdd  HH:mm:ss";

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
	 * @param 日期1
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
	 * @param minuteAmount
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
	 * @param 待格式的日期
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
	 * @param 待格式的日期
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
	 * 此方法将给出的和日期格式化成本地日期形式的字符串。(含有年月日时分)
	 *
	 * @param 待格式的日期
	 * @return 本地日期形式的字符串。例：1983-12-29 08:05
	 * @since 0.1
	 */
	public static String formatDateTime2NN(Date date) {
		StringBuffer dateBuffer = new StringBuffer("");
		if (date != null) {
			Calendar calendar = Calendar.getInstance();
			calendar.setTime(date);
			dateBuffer.append(calendar.get(Calendar.YEAR) + "-");
			dateBuffer.append((calendar.get(Calendar.MONTH) + 1) + "-");
			dateBuffer.append(calendar.get(Calendar.DAY_OF_MONTH) + " ");
			dateBuffer.append(StringUtil.formatNumber(calendar.get(Calendar.HOUR_OF_DAY), 2, '0') + ":");
			dateBuffer.append(StringUtil.formatNumber(calendar.get(Calendar.MINUTE), 2, '0'));
		}
		return dateBuffer.toString();
	}

	/**
	 * 此方法将给出的和日期格式化成本地日期形式的字符串。 （含有年月日时分秒)
	 *
	 * @param 待格式的日期
	 * @return 本地日期形式的字符串。例：1983-12-29 08:05:12
	 * @since 0.1
	 */
	public static String formatFullDateTime2NN(Date date) {
		StringBuffer dateBuffer = new StringBuffer("");
		if (date != null) {
			Calendar calendar = Calendar.getInstance();
			calendar.setTime(date);
			dateBuffer.append(calendar.get(Calendar.YEAR) + "-");
			dateBuffer.append((calendar.get(Calendar.MONTH) + 1) + "-");
			dateBuffer.append(calendar.get(Calendar.DAY_OF_MONTH) + " ");
			dateBuffer.append(StringUtil.formatNumber(calendar.get(Calendar.HOUR_OF_DAY), 2, '0') + ":");
			dateBuffer.append(StringUtil.formatNumber(calendar.get(Calendar.MINUTE), 2, '0') + ":");
			dateBuffer.append(StringUtil.formatNumber(calendar.get(Calendar.SECOND), 2, '0'));
		}
		return dateBuffer.toString();
	}

	/**
	 * 此方法将给出的和日期格式化成本地日期形式的字符串。（只含有年月日
	 *
	 * @param 待格式的日期
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
	 * 此方法将给出的和日期格式化成本地日期形式的字符串。 （只含有年月日
	 *
	 * @param 待格式的日期
	 * @return 本地日期形式的字符串。例：1983年12月29日12时30分
	 * @since 0.1
	 */
	public static String formatDateTime2NC(Date date) {
		StringBuffer dateBuffer = new StringBuffer("");
		if (date != null) {
			Calendar calendar = Calendar.getInstance();
			calendar.setTime(date);
			dateBuffer.append(calendar.get(Calendar.YEAR) + "年");
			dateBuffer.append((calendar.get(Calendar.MONTH) + 1) + "月");
			dateBuffer.append(calendar.get(Calendar.DAY_OF_MONTH) + "日 ");
			dateBuffer.append(StringUtil.formatNumber(calendar.get(Calendar.HOUR_OF_DAY), 2, '0') + "时");
			dateBuffer.append(StringUtil.formatNumber(calendar.get(Calendar.MINUTE), 2, '0') + "分");
		}
		return dateBuffer.toString();
	}

	/**
	 * 此方法将给出的和日期格式化成本地日期形式的字符串。 （只含有年月日
	 *
	 * @param 待格式的日期
	 * @return 本地日期形式的字符串。例：1983年12月29日12时30分28秒
	 * @since 0.1
	 */
	public static String formatFullDateTime2NC(Date date) {
		StringBuffer dateBuffer = new StringBuffer("");
		if (date != null) {
			Calendar calendar = Calendar.getInstance();
			calendar.setTime(date);
			dateBuffer.append(calendar.get(Calendar.YEAR) + "年");
			dateBuffer.append((calendar.get(Calendar.MONTH) + 1) + "月");
			dateBuffer.append(calendar.get(Calendar.DAY_OF_MONTH) + "日 ");
			dateBuffer.append(StringUtil.formatNumber(calendar.get(Calendar.HOUR_OF_DAY), 2, '0') + "时");
			dateBuffer.append(StringUtil.formatNumber(calendar.get(Calendar.MINUTE), 2, '0') + "分");
			dateBuffer.append(StringUtil.formatNumber(calendar.get(Calendar.SECOND), 2, '0') + "秒");
		}
		return dateBuffer.toString();
	}

	/**
	 * 将字符串解析成日期类型，如果字符串含有/则按/分割,否则以-分
	 *
	 * @param 待解析的字符串
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
			System.out.println(e.getMessage());
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
			System.out.println(e.getMessage());
		}
		return date;
	}

	/**
	 * 将字符串解析成日期类型，如果字符串含有/则按/分割,否则以-分
	 *
	 * @param 待解析的字符串
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
			System.out.println(e.getMessage());
		}
		return date;
	}

	/**
	 * 取得传入日期的年
	 *
	 * @param 待解析的日期
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
	 * @param 待解析的日期
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
	 * @param 起始日期
	 *            ，结束日期
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
	 * 两个日期的周差
	 *
	 * @param 起始日期
	 *            ，结束日期
	 * @return 两日期的月分差，例1998-4-21~1998-6-21 相差两个月 返回2
	 * @since 0.1
	 */
	public static int getDiffWeek(Date fromDate, Date toDate) {
		Calendar c = Calendar.getInstance();
		c.setTime(fromDate);
		int fromYear = c.get(Calendar.YEAR);
		int fromWeek = c.get(Calendar.WEEK_OF_YEAR) + 1;
		c.setTime(toDate);
		int toYear = c.get(Calendar.YEAR);
		int toWeek = c.get(Calendar.WEEK_OF_YEAR) + 1;
		int monthCount = 0;

		if (toYear == fromYear) {
			monthCount = toWeek - fromWeek;
		} else if (toYear - fromYear == 1) {
			monthCount = 52 - fromWeek + toWeek;
		} else {
			monthCount = 52 - fromWeek + 52 * (toYear - fromYear - 1) + toWeek;
		}
		return monthCount;
	}

	/**
	 * 两个日期的天数差
	 *
	 * @param 起始日期
	 *            ，结束日期
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
	 * 当前日期加减周
	 *
	 * @param date
	 * @return
	 */
	public static Date getCalculateWeek(Date date, int num) {
		Calendar calendar = new GregorianCalendar();
		calendar.setTime(date);
		calendar.add(Calendar.WEEK_OF_YEAR, num);
		date = calendar.getTime();

		return date;
	}

	/**
	 * 当前日期加减月
	 *
	 * @param date
	 * @return
	 */
	public static Date getCalculateMonth(Date date, int num) {
		Calendar calendar = new GregorianCalendar();
		calendar.setTime(date);
		calendar.add(Calendar.MONTH, num);
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
	
	public static void main(String[] args) throws Exception {
		String yestodayStr = getYestoday();
		
		String ss = formatString("2015-12-22 12:22:21","yyyyMMdd");

		System.out.println(ss);
		Date date = new Date();
		
		System.out.println(addDay2Date(365, date));
		
		System.out.println(isDate("2015-12-22"));

	}
}
