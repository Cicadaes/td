package td.enterprise.wanalytics.processor.utils;

/**
 * @（#）:DateTimeUtil.java
 * @description: 时间日期工具
 * @version: Version 1.
 * @modify:
 * @Copyright: 
 */

import org.apache.commons.lang.time.DateFormatUtils;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.ParsePosition;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.TimeZone;

/**
 * 日期工具 修改历史: V:0.2 U:wang M:把sdf声明为不可变静态常量
 */
public class DateTimeUtil {
	
	private static final String FormatDate = "yyyy-MM-dd";
	private static final String FormatDateTime = "yyyyMMddHHmmss";
	private static final String FormatTimestamp = "yyyy-MM-dd HH:mm:ss";
	private static final String FormatTimestampHour = "HH:mm:ss";

	private static final String SpecificFormat = "yyyyMMdd";
	private static final String SPECIFIC_FORMAT = "yyMMdd";
	private static final String FormatTimestampMil = "yyyy-MM-dd HH:mm:ss.S";
	private static final String FormatTimestampMillion = "yyyy-MM-dd HH:mm:ss.SSSSS";
	private static final String FormatTimestampMillion1 = "yyyy-MM-dd HH:mm:ss.SSS";

    private static final String FormatDateHour = "yyyy-MM-dd-HH";
	private static final String FormatMonth = "yyyy-MM";
	
	private static final String FormatWeek = "yyyy_w";
	
	private static final String FormatDateYmd = "yyyy_MM_dd";

//	private static final SimpleDateFormat sdf = new SimpleDateFormat(FormatTimestamp);
//	private static SimpleDateFormat sdfm = new SimpleDateFormat(FormatTimestampMil);
//	private static SimpleDateFormat dffd = new SimpleDateFormat(FormatTimestamp);
//	private static SimpleDateFormat dffdL = new SimpleDateFormat(FormatDate);
//	private static SimpleDateFormat format = new SimpleDateFormat("HH:mm:ss");
//	private static SimpleDateFormat formatDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
//	private static SimpleDateFormat formatDateMillion = new SimpleDateFormat(FormatTimestampMillion);
//	private static SimpleDateFormat formatDateMillion1 = new SimpleDateFormat(FormatTimestampMillion1);
//	private static SimpleDateFormat formatSpecific = new SimpleDateFormat(SpecificFormat);

	private static final ThreadLocal<DateFormat> sdf = getThreadLocal(FormatTimestamp);
	private static final ThreadLocal<DateFormat> sdfm = getThreadLocal(FormatTimestampMil);
	private static final ThreadLocal<DateFormat> dffdL = getThreadLocal(FormatDate);
	private static final ThreadLocal<DateFormat> format = getThreadLocal(FormatTimestampHour);
	private static final ThreadLocal<DateFormat> sfmt = getThreadLocal(SpecificFormat);
	private static final ThreadLocal<DateFormat> ssfmt = getThreadLocal(SPECIFIC_FORMAT);
	private static final ThreadLocal<DateFormat> fmtl = getThreadLocal(FormatDateTime);

    private static final ThreadLocal<DateFormat> fdh = getThreadLocal(FormatDateHour);
	private static final ThreadLocal<DateFormat> fdm = getThreadLocal(FormatMonth);
	
	private static final ThreadLocal<DateFormat> fw = getThreadLocal(FormatWeek);
	private static final ThreadLocal<DateFormat> fymd = getThreadLocal(FormatDateYmd);

	private static ThreadLocal<DateFormat> getThreadLocal (final String dateFormatStr){
		return new ThreadLocal<DateFormat>() {
			@Override
			protected DateFormat initialValue() {
				return new SimpleDateFormat(dateFormatStr);
			}
		};
	}
	
	/**
	 * 月的起始日期
	 */
	public static final String CALCULATE_MONTH_BEGIN = "begin";
	/***
	 * 下一个月的第一天
	 */
	public static final String CALCULATE_MONTH_END = "end";
	/***
	 * 下一个周
	 */
	public static final String CALCULATE_WEEK_NEXT = "next";
	/***
	 * 上一个周
	 */
	public static final String CALCULATE_WEEK_PREVIOUS = "previous";

	static {
		sdf.get().setTimeZone(new GregorianCalendar().getTimeZone());
		sdf.get().setLenient(false);
		dffdL.get().setTimeZone(new GregorianCalendar().getTimeZone());
		dffdL.get().setLenient(false);
	}

	/**
	 * 根据传入日期增加i天
	 * 
	 * @param date
	 *            要增加的日期
	 * @param i
	 * @param date
	 * @return 格式为"yyyy-MM-dd"的字符串
	 * @throws Exception
	 * @throws IllegalArgumentException
	 * @roseuid 44D6EB790190
	 */
	public static String AddDate(String date, int i) throws IllegalArgumentException {
		Date d = null;

		d = DateTimeUtil.dateFormat(date);
		if (null == d)
		return null;
		long ldate = d.getTime();
		ldate += i * 24 * 60 * 60 * 1000;
		return dffdL.get().format(new Date(ldate));
	}
	
	/**
	 * 根据传入日期增加i天
	 * 
	 * @param date
	 *            要增加的日期
	 * @param i
	 * @param date
	 * @throws Exception
	 * @throws IllegalArgumentException
	 * @roseuid 44D6EB790190
	 */
	public static String AddDate(String date, int i, String pattern) throws IllegalArgumentException {
		Date d = null;

		d = DateTimeUtil.format(date, pattern);
		if (null == d)
			return null;
		long ldate = d.getTime();
		ldate += i * 24 * 60 * 60 * 1000;
		return dffdL.get().format(new Date(ldate));
	}

	/**
	 * 
	 * @param datetime
	 * @param i
	 * @return java.lang.String 格式为"yyyy-MM-dd HH:mm:ss"的字符串
	 * @throws IllegalArgumentException
	 * @roseuid 44D6EB79026C
	 */
	public static String AddMinute(String datetime, int i) throws IllegalArgumentException {
		String date = datetime.substring(0, 10);
		String time = datetime.substring(11);
		Date d = DateTimeUtil.dateFormat(date, time);
		if (null == d)
			return null;
		long ldate = d.getTime();
		ldate += i * 60 * 1000;
		return sdf.get().format(new Date(ldate));
	}

	/**
	 * 
	 * @param datetime
	 * @param i
	 * @return java.lang.String 格式为"yyyy-MM-dd HH:mm:ss"的字符串
	 * @throws IllegalArgumentException
	 * @roseuid 44D6EB79026C
	 */
	public static String AddSecond(String datetime, int i) throws IllegalArgumentException {
		String date = datetime.substring(0, 10);
		String time = datetime.substring(11);
		Date d = DateTimeUtil.dateFormat(date, time);
		if (null == d)
			return null;
		long ldate = d.getTime();
		ldate += i * 1000;
		return sdf.get().format(new Date(ldate));
	}

//	/***
//	 * 传入日期和 （加减）月
//	 * 
//	 * @param date
//	 *            日期 yyyy-MM-dd
//	 * @param l
//	 *            月
//	 * @return date 加减月过后的时间
//	 */
//	public static String calculateMonthDate(String date, int l) {
//		Calendar calendar = Calendar.getInstance();
//		calendar.setTime(dateFormat(date));
//		calendar.set(Calendar.MONTH, calendar.get(Calendar.MONTH) + l);
//		return DateUtil.format(calendar.getTime(), "yyyy-MM-dd");
//	}
	
	public static Date addHour(Date date,int h){
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.add(Calendar.HOUR, h);	
		return calendar.getTime();
	}
	


	/***
	 * 传入日期和 （加减）月
	 * 
	 * @param date
	 * @param l
	 *            月
	 * @return date 加减月过后的时间
	 */
	public static Date calculateMonthDate(Date date, int l) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.set(Calendar.MONTH, calendar.get(Calendar.MONTH) + l);
		return calendar.getTime();
	}

	/***
	 * 当前月 是否满足 本月第一天的条件 或 当前月 是否满足 加一月的条件
	 * 
	 * @param date
	 * @param type
	 *            (type)类型常量 ：(CALCULATE_MONTH_BEGIN 、CALCULATE_MONTH_END)
	 * @return
	 */
	public static Date calculateBeginOrEndMonth(Date date, String type) {
		Calendar d = Calendar.getInstance();
		d.setTime(date);
		if (d.get(Calendar.DATE) != 1) {
			if (CALCULATE_MONTH_BEGIN.equals(type)) {
				d.set(Calendar.DATE, d.getActualMinimum(Calendar.DATE));
			} else if (CALCULATE_MONTH_END.equals(type)) {
				d.set(Calendar.DATE, d.getActualMaximum(Calendar.DATE));
			}
		}
		return d.getTime();
	}

	public static long offsetOfMonthLastDay() {
		Calendar cal = Calendar.getInstance();
		cal.set(Calendar.DATE, 1);
		cal.roll(Calendar.DATE, -1);
		Date endTime = cal.getTime();
		Date date = new Date();
		long daysBetween = (endTime.getTime() - date.getTime() + 1000000) / (3600 * 24 * 1000);
		return daysBetween;
	}

	public static Date firstDayOfMonth() {
		Calendar cal = Calendar.getInstance();
		cal.set(Calendar.DATE, cal.getActualMinimum(Calendar.DATE));
		return cal.getTime();
	}

	public static Date lastDayOfMonth() {
		Calendar cal = Calendar.getInstance();
		cal.set(Calendar.DATE, cal.getActualMaximum(Calendar.DATE));
		return cal.getTime();
	}

	/***
	 * 加一个月和最后一天的日期 计算偏移
	 * 
	 * @param date
	 * @return
	 */
	public static long offsetOfMonthLastDay(Date date) {
		Calendar cal = Calendar.getInstance();
		cal.set(Calendar.DATE, 1);
		cal.roll(Calendar.DATE, -1);
		Date endTime = cal.getTime();
		long daysBetween = (endTime.getTime() - date.getTime() + 1000000) / (3600 * 24 * 1000);
		return daysBetween;
	}

	/**
	 * 加三个月和最后一天的日期 计算偏移
	 * 
	 * @param date
	 * @return
	 */
	public static long offsetOfQuearterLastDay(Date date) {
		Calendar cal = Calendar.getInstance();
		cal.setTime(nextQuarterCFirstDate(new Date()));
		cal.set(Calendar.DATE, 1);
		cal.roll(Calendar.DATE, -1);
		Date endTime = cal.getTime();
		long daysBetween = (endTime.getTime() - date.getTime() + 1000000) / (3600 * 24 * 1000);
		return daysBetween;
	}

	/**
	 * 加六个月和最后一天的日期 计算偏移
	 * 
	 * @param date
	 * @return
	 */
	public static long offsetOfSixMonthLastDay(Date date) {
		Calendar cal = Calendar.getInstance();
		cal.setTime(nextSixMonthCFirstDate(new Date()));
		cal.set(Calendar.DATE, 1);
		cal.roll(Calendar.DATE, -1);
		Date endTime = cal.getTime();
		long daysBetween = (endTime.getTime() - date.getTime() + 1000000) / (3600 * 24 * 1000);
		return daysBetween;
	}

	/**
	 * 加一年和最后一天的日期 计算偏移
	 * 
	 * @param date
	 * @return
	 */
	public static long offsetOfYearLastDay(Date date) {
		Calendar cal = Calendar.getInstance();
		cal.setTime(nextYearCFirstDate(new Date()));
		cal.set(Calendar.DATE, 1);
		cal.roll(Calendar.DATE, -1);
		Date endTime = cal.getTime();
		long daysBetween = (endTime.getTime() - date.getTime() + 1000000) / (3600 * 24 * 1000);
		return daysBetween;
	}



	/***
	 * 当前周 是否满足 返回上一周第一天的条件 或 当前周 是否满足 返回下一周第一天的条件


	 *            (type)类型：next、previous
	 * @return
	 */
	public static Date calculateNextOfPreviousWeek(Date date, String type) {
		Calendar d = Calendar.getInstance();
		d.setTime(date);
		if (d.get(Calendar.DAY_OF_WEEK) != 1) {
			if (CALCULATE_WEEK_NEXT.equals(type)) {
				int dayofWeek = Calendar.DAY_OF_WEEK-d.get(Calendar.DAY_OF_WEEK);
				int day = d.get(Calendar.DATE);
				
				d.set(Calendar.DATE, day + (dayofWeek + 1));
			} else if (CALCULATE_WEEK_PREVIOUS.equals(type)) {
				int dayofWeek = d.get(Calendar.DAY_OF_WEEK);
				int day = d.get(Calendar.DATE);

				d.set(Calendar.DATE, day - (dayofWeek - 1));
			}
		}
		return d.getTime();
	}

	/***
	 * 当前周 是否满足 返回上一周第一天的条件
	 * 
	 * @param date
	 * @return
	 */
	public static Date calculateNextWeek(Date date) {
		Calendar d = Calendar.getInstance();
		d.setTime(date);
		if (d.get(Calendar.DAY_OF_WEEK) != 1) {
			int dayofWeek = d.get(Calendar.DAY_OF_WEEK);
			int day = d.get(Calendar.DATE);

			d.set(Calendar.DATE, day + (dayofWeek + 1));
		}
		return d.getTime();
	}

	/***
	 * 返回当前时间的下一个月 1号 月
	 * 
	 * @param date
	 * @return
	 */
	public static Date nextMonthCFirstDate(Date date) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.set(Calendar.DATE, 1);
		calendar.set(Calendar.MONTH, calendar.get(Calendar.MONTH) + 1);
		return calendar.getTime();
	}

	/***
	 * 返回当前时间的下一个季度 1号 季度
	 * 
	 * @param date
	 * @return
	 */
	public static Date nextQuarterCFirstDate(Date date) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.set(Calendar.DATE, 1);
		calendar.set(Calendar.MONTH, calendar.get(Calendar.MONTH) + 3);
		return calendar.getTime();
	}

	/***
	 * 返回当前时间的下一个半年 1号 半年
	 * 
	 * @param date
	 * @return
	 */
	public static Date nextSixMonthCFirstDate(Date date) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.set(Calendar.DATE, 1);
		calendar.set(Calendar.MONTH, calendar.get(Calendar.MONTH) + 6);
		return calendar.getTime();
	}

	/***
	 * 返回当前时间的下一个年 1号 年
	 * 
	 * @param date
	 * @return
	 */
	public static Date nextYearCFirstDate(Date date) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.set(Calendar.DATE, 1);
		calendar.set(Calendar.YEAR, calendar.get(Calendar.YEAR) + 1);
		return calendar.getTime();
	}

	/***
	 * 返回一个时间月份的最后一天
	 * 
	 * @param d
	 * @return
	 */
	public static Date getMonthLastDay(Date d) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(d);
		calendar.set(Calendar.DATE, calendar.getActualMaximum(Calendar.DATE));
		return calendar.getTime();
	}

	/***
	 * 返回一个时间月份的最后一天
	 * 
	 * @param d
	 * @return
	 */
	public static Date getQuarterLastDay(Date d) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(nextQuarterCFirstDate(d));
		calendar.set(Calendar.MONTH, calendar.get(Calendar.MONTH) - 1);
		calendar.set(Calendar.DATE, calendar.getActualMaximum(Calendar.DATE));
		return calendar.getTime();
	}

	/***
	 * 返回一个时间月份的最后一天
	 * 
	 * @param d
	 * @return
	 */
	public static Date getSixMonthLastDay(Date d) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(nextSixMonthCFirstDate(d));
		calendar.set(Calendar.MONTH, calendar.get(Calendar.MONTH) - 1);
		calendar.set(Calendar.DATE, calendar.getActualMaximum(Calendar.DATE));
		return calendar.getTime();
	}

	/***
	 * 返回一个时间月份的最后一天
	 * 
	 * @param d
	 * @return
	 */
	public static Date getYearLastDay(Date d) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(nextYearCFirstDate(d));
		calendar.set(Calendar.MONTH, calendar.get(Calendar.MONTH) - 1);
		calendar.set(Calendar.DATE, calendar.getActualMaximum(Calendar.DATE));
		return calendar.getTime();
	}

	/***
	 * 得到当前时间减去 多少天
	 * 
	 * @param date
	 * @param l
	 * @return 返回时间
	 */
	public static Date calculateDayDate(Date date, int l) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.set(Calendar.DATE, calendar.get(Calendar.DATE) + l);
		return calendar.getTime();
	}

	/***
	 * 返回当前时间的上个月 1号
	 * 
	 * @param date
	 * @return
	 */
	public static Date previousMonthDate(Date date) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.set(Calendar.DATE, 1);
		calendar.set(Calendar.MONTH, calendar.get(Calendar.MONTH) - 1);
		return calendar.getTime();
	}

	/***
	 * 传入日期和 （加减）年
	 * 
	 * @param date
	 * @param l
	 *            年
	 * @return date 加减月过后的时间
	 */
	public static Date calculateYearDate(Date date, int l) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.set(Calendar.YEAR, calendar.get(Calendar.YEAR) + l);
		return calendar.getTime();
	}

//	/***
//	 * 遗漏日期计算
//	 * 
//	 * @param dateType
//	 *            日期计算方式（DAY、WEEK、MONTH）
//	 * @param startDate
//	 *            起始时间
//	 * @param endTime
//	 *            结束时间
//	 * @return Map集合的时间对象
//	 */
//	public static List<Map<String, Object>> omissionDate(String dateType, Date startDate, Date endDate) {
//		startDate = DateUtil.parseDate(DateUtil.format(startDate, "yyyy-MM-dd"), "yyyy-MM-dd");
//		endDate = DateUtil.parseDate(DateUtil.format(endDate, "yyyy-MM-dd"), "yyyy-MM-dd");
//
//		List<Map<String, Object>> result = new ArrayList<Map<String, Object>>();
//		Map<String, Object> dateMap = null;
//		Calendar startCalendar = Calendar.getInstance();
//		startCalendar.setTime(startDate);
//
//		Calendar endCalendar = Calendar.getInstance();
//		endCalendar.setTime(endDate);
//
//		if ("DAY".equals(dateType)) {
//			endCalendar.add(Calendar.DATE, -1);
//
//			while (startCalendar.compareTo(endCalendar) < 0) {
//				dateMap = new HashMap<String, Object>();
//				endCalendar.set(Calendar.DATE, endCalendar.get(Calendar.DATE) - 1);
//				dateMap.put("DAY", DateUtil.format(endCalendar.getTime(), "yyyy-MM-dd"));
//				result.add(dateMap);
//			}
//		} else if ("WEEK".equals(dateType)) {
//			endCalendar.setTime(DateUtil.format(AddDate(DateUtil.format(endDate, "yyyy-MM-dd"), -7), "yyyy-MM-dd"));
//			while (startCalendar.compareTo(endCalendar) < 0) {
//				dateMap = new HashMap<String, Object>();
//				endCalendar.set(Calendar.DATE, endCalendar.get(Calendar.DATE) - 7);
//				if (startCalendar.compareTo(endCalendar) <= 0) {
//					dateMap.put("WEEK", DateUtil.format(endCalendar.getTime(), "yyyy-MM-dd"));
//					result.add(dateMap);
//				}
//			}
//
//		} else if ("MONTH".equals(dateType)) {
//			endCalendar.setTime(DateUtil.format(calculateMonthDate(DateUtil.format(endDate, "yyyy-MM-dd"), -1), "yyyy-MM-dd"));
//
//			while (startCalendar.compareTo(endCalendar) < 0) {
//				dateMap = new HashMap<String, Object>();
//				endCalendar.set(Calendar.MONTH, endCalendar.get(Calendar.MONTH) - 1);
//				if (startCalendar.compareTo(endCalendar) <= 0) {
//					dateMap.put("MONTH", DateUtil.format(endCalendar.getTime(), "yyyy-MM-dd"));
//					result.add(dateMap);
//				}
//			}
//		}
//
//		return result;
//	}

	/**
	 * 根据传入日期增加i天
	 * 
	 * @param date
	 *            要增加的日期
	 * @param i
	 * @param date
	 * @return 增加后的日期
	 * @roseuid 44D6EB790257
	 */
	public static Date dateAdd(Date date, long i) {
		long ldate = date.getTime();
		ldate += i * 24 * 60 * 60 * 1000;
		return new Date(ldate);
	}

	/**
	 * 根据传入参数两个时间差单位:天 减数放前 被减数放后
	 * 
	 * @param EndDate
	 * @param BegDate
	 * @return int
	 * @throws IllegalArgumentException
	 * @throws Exception
	 * @roseuid 44D6EB780197
	 */
	public static int dateDiff(String EndDate, String BegDate) throws IllegalArgumentException {
		Date firDate = dateFormat(BegDate);
		Date secDate = dateFormat(EndDate);
		if (secDate ==null || firDate == null)
			return 0;
		long r = secDate.getTime() - firDate.getTime();
		return (int) (r / 60000 / 60 / 24);
	}

	/**
	 * 根据传入参数两个时间差单位:分钟 减数放前 被减数放后
	 * 
	 * @param EndDate
	 * @param EndTime
	 * @param BegDate
	 * @param BegTime
	 * @return int
	 * @throws IllegalArgumentException
	 * @roseuid 44D6EB7800D9
	 */
	public static int dateDiff(String EndDate, String EndTime, String BegDate, String BegTime) throws IllegalArgumentException {
		Date firDate = dateFormat(BegDate, BegTime);
		Date secDate = dateFormat(EndDate, EndTime);
		if (secDate ==null || firDate == null)
			return 0;
		long r = secDate.getTime() - firDate.getTime();
		return (int) (r / 60000);
	}

	/**
	 * 根据传入参数两个时间差单位:分钟 减数放前 被减数放后
	 * 
	 * @param EndDate
	 * @param EndTime
	 * @param BegDate
	 * @param BegTime
	 * @return int
	 * @throws IllegalArgumentException
	 * @roseuid 44D6EB7800D9
	 */
	public static int dateDiff(Date startTime, Date endTime) throws IllegalArgumentException {
		long r = endTime.getTime() - startTime.getTime();
		return (int) (r / 60000);
	}

	/**
	 * 格式化日期
	 * 
	 * @param date
	 *            输入的日期String
	 * @return java.util.Date 返回日期yyyy-MM-dd
	 * @throws cn.com.sseeai.oc.OCException
	 * @roseuid 44D6EB7903A1
	 */
	public static Date dateFormat(String date) {
		try {
			return fromDateString(date, FormatDate);
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	/**
	 * 格式化日期
	 * 
	 * @param date
	 *            输入的日期String
	 * @param lt
	 *            是否长日期
	 * @return java.util.Date lt为true返回日期yyyy-MM-dd hh:mm:ss，否则返回yyyy-MM-dd
	 * @throws cn.com.sseeai.oc.OCException
	 * @roseuid 44D6EB7903A1
	 */
	public static Date dateFormat(String date, boolean lt) {
		try {
			return lt ? fromDateStringFixed(date) : fromDateStringFixedL(date);
			// return lt ? fromDateString(date, FormatTimestamp) :
			// fromDateString(
			// date, FormatDate);
		} catch (Exception e) {
		}
		return null;
	}

	/**
	 * 根据传入日期和时间返回Date对象
	 * 
	 * @param date
	 * @param time
	 * @return java.util.Date 返回时间，格式为yyyy-MM-dd hh:mm:ss
	 * @throws IllegalArgumentException
	 * @roseuid 44D6EB790333
	 */
	public static Date dateFormat(String date, String time) {
		try {
			return fromDateString(date + " " + time, FormatTimestamp);
		} catch (Exception e) {

		}
		return null;
	}

	/**
	 * 转换日期类型为字符串YYYY-MM-DD格式
	 * 
	 * @param dt
	 *            要转换的时间
	 * @return 转换后的字符串
	 * @roseuid 44D6EB7A00E6
	 */
	public static String formatDate(Date dt) {
		if (dt == null) {
			return "";
		}
		return dffdL.get().format(dt);
	}

	/**
	 * 转换日期类型为字符串yyyy-MM-dd hh:MM:ss格式
	 * 
	 * @param dt
	 *            要转换的时间
	 * @return 转换后的字符串
	 * @roseuid 44D6EB7A00E6
	 */
	public static String formatLongDate(Date dt) {
		if (dt == null) {
			return null;
		}
		String dateStr = null;
		synchronized (sdf) {
			dateStr = sdf.get().format(dt);
		}
		return dateStr;
	}

	/**
	 * 根据dateStr获得年月日格式的Date。
	 * 
	 * @author liuxinghua
	 * 
	 * @param dateStr
	 *            yyyy-MM-dd年月日的字符格式
	 * @return
	 * @since 1.0_2012-10-24
	 */
	public static Date toDate(String dateStr) {
		ParsePosition pos = new ParsePosition(0);
		return sdf.get().parse(dateStr, pos);
	}

	public static Date toDate(String dateStr, DateFormat dateFormat) {
		ParsePosition pos = new ParsePosition(0);
		return dateFormat.parse(dateStr, pos);
	}

	/**
	 * 转换日期类型为字符串yyyy-MM-dd hh:MM:ss.S格式
	 * 
	 * @param dt
	 *            要转换的时间
	 * @return 转换后的字符串
	 * @roseuid 44D6EB7A00E6
	 */
	public static String formatLongDateMil(Date dt) {
		if (dt == null) {
			return null;
		}
		String dateStr = null;
		synchronized (sdfm) {
			dateStr = sdfm.get().format(dt);
		}
		return dateStr;
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
	 * @param dateString
	 * @param fromFormat
	 * @return java.util.Date
	 * @roseuid 44D6EB7A0027
	 */
	public static Date fromDateString(String dateString, String fromFormat) {
		GregorianCalendar gc = new GregorianCalendar();
		SimpleDateFormat df = new SimpleDateFormat(fromFormat);
		df.setTimeZone(gc.getTimeZone());
		df.setLenient(false);
		Date date = df.parse(dateString, new ParsePosition(0));
		return date;
	}

	/**
	 * @param dateString
	 * @param fromFormat
	 * @return java.util.Date
	 * @roseuid 44D6EB7A0027
	 */
	public static Date fromDateStringFixed(String dateString) throws ParseException {
		Date date = null;
		synchronized (sdf) {
			date = sdf.get().parse(dateString);
		}
		return date;
	}

	public static Date dateStringToDateTime(String date, String time) throws ParseException {
		String dateTime = date + " " + time;
		return sdf.get().parse(dateTime);

	}

	/**
	 * @param Date
	 *            date类型数据
	 * @param fromFormat
	 * @return String 返回"yyyy-MM-dd HH:mm:ss"格式日期
	 * @roseuid 44D6EB7A0027
	 */
	public static String fromDateStringFixed(Date dateString) {
		if (dateString == null) {
			return null;
		}
		String date = null;
		synchronized (sdf) {
			date = sdf.get().format(dateString);
		}
		return date;
	}

	/**
	 * @param dateString
	 * @param fromFormat
	 * @return java.util.Date
	 * @roseuid 44D6EB7A0027
	 */
	public static Date fromDateStringFixedL(String dateString) throws ParseException {
		Date date = null;
		synchronized (dffdL) {
			date = dffdL.get().parse(dateString);
		}
		return date;
	}

	/**
	 * @param Date
	 *            传入Date类型日期
	 * @param fromFormat
	 * @return String 返回"yyyy-MM-dd"格式日期
	 * @roseuid 44D6EB7A0027
	 */
	public static String fromDateStringFixedL(Date date) {
		String dateString = null;
		synchronized (dffdL) {
			dateString = dffdL.get().format(date);
		}
		return dateString;
	}

	/**
	 * 取日期的小时,24小时模式
	 * 
	 * @param dt
	 * @return
	 */
	public static int getHours(Date dt) {
		Calendar cal = Calendar.getInstance();
		cal.setTime(dt);
//		int hour = cal.get(Calendar.HOUR_OF_DAY);
		return cal.get(Calendar.HOUR_OF_DAY);
	}

	/**
	 * 取日期的分钟
	 * 
	 * @param dt
	 * @return
	 */
	public static int getMinutes(Date dt) {
		Calendar cal = Calendar.getInstance();
		cal.setTime(dt);

		return cal.get(Calendar.MINUTE);
	}

	/**
	 * 返回当月最大时间
	 * 
	 * @param dtime
	 * @return java.lang.String
	 * @throws IllegalArgumentException
	 * @roseuid 44D6EB780008
	 */
	public static String getMonthMaxDay(String dtime) throws IllegalArgumentException {
		Calendar date = Calendar.getInstance();
		String month = "";
		String day = "";
		date.setTime(DateTimeUtil.dateFormat(dtime));
		month = DateTimeUtil.formatNum(date.get(Calendar.MONTH) + 1);
		day = DateTimeUtil.formatNum(date.getActualMaximum(Calendar.DAY_OF_MONTH));
		return date.get(Calendar.YEAR) + "-" + month + "-" + day;
	}

	/**
	 * 取日期的秒
	 * 
	 * @param dt
	 * @return
	 */
	public static int getSeconds(Date dt) {
		Calendar cal = Calendar.getInstance();
		cal.setTime(dt);

		return cal.get(Calendar.SECOND);
	}

	/**
	 * 
	 * @param strDate
	 * @param strTime
	 * @param strComBDate
	 * @param strComBTime
	 * @param strComEDate
	 * @param strComETime
	 * @return true,在范围之内；否则， false，不在范围之内
	 * @throws IllegalArgumentException
	 */
	public static boolean inBound(String strDate, String strTime, String strComBDate, String strComBTime, String strComEDate, String strComETime)
			throws IllegalArgumentException {
		boolean flag = false;
		Date date = dateFormat(strDate, strTime);

		Date comBDate = dateFormat(strComBDate, strComBTime);
		Date comEDate = dateFormat(strComEDate, strComETime);

		if (null != date && date.after(comBDate) && date.before(comEDate)) {
			flag = true;
		}
		return flag;
	}

	/**
	 * 
	 * @param strBDate
	 * @param strBTime
	 * @param strEDate
	 * @param strETime
	 * @param strComBDate
	 * @param strComBTime
	 * @param strComEDate
	 * @param strComETime
	 * @return boolean true -- 在范围之内 false -- 不在范围之内
	 * @throws IllegalArgumentException
	 * @roseuid 44D6EB780315
	 */
	public static boolean inBound(String strBDate, String strBTime, String strEDate, String strETime, String strComBDate, String strComBTime,
			String strComEDate, String strComETime) throws IllegalArgumentException {
		boolean flag = true;
		Date bDate = dateFormat(strBDate, strBTime);
		Date eDate = dateFormat(strEDate, strETime);

		Date comBDate = dateFormat(strComBDate, strComBTime);
		Date comEDate = dateFormat(strComEDate, strComETime);

		if (inBoundBeg(bDate, eDate, comBDate)) {
			// 判断结束时间
			if (!inBoundEnd(bDate, eDate, comEDate)) {
				flag = false;
			}
		} else {
			flag = false;
		}
		return flag;
	}

	/**
	 * @param bDate
	 * @param eDate
	 * @param comBDate
	 * @return boolean true -- 在范围之内 false -- 不在范围之内
	 * @roseuid 44D6EB7803E9
	 */
	private static boolean inBoundBeg(Date bDate, Date eDate, Date comBDate) {
		boolean flag = true;
		if ((bDate.before(comBDate) || bDate.equals(comBDate)) && eDate.after(comBDate)) {
			flag = false;
		}
		return flag;
	}

	/**
	 * @param bDate
	 * @param eDate
	 * @param comEDate
	 * @return boolean true -- 在范围之内 false -- 不在范围之内
	 * @roseuid 44D6EB7900C7
	 */
	private static boolean inBoundEnd(Date bDate, Date eDate, Date comEDate) {
		boolean flag = true;
		if (bDate.before(comEDate) && (eDate.after(comEDate) || eDate.equals(comEDate))) {
			flag = false;
		}
		return flag;
	}

	/**
	 * 取大时间
	 * 
	 * @param date1
	 *            时间1
	 * @param date2
	 *            时间2
	 * @return 返回大的时间
	 * @throws IllegalArgumentException
	 */
	public static String maxDate(String date1, String date2) throws IllegalArgumentException {
		Date d1 = DateTimeUtil.dateFormat(date1, false);
		if ( null != d1 && d1.after(DateTimeUtil.dateFormat(date2, false))) {
			return date1;
		} else {
			return date2;
		}
	}

	/**
	 * 转换日期类型为字符串YYYYMMDD格式
	 * 
	 * @param dt
	 *            要转换的时间
	 * @return 转换后的字符串
	 * @roseuid 44D6EB7A00E6
	 */
	public static String specificFormatDate(Date dt) {
		if (dt == null) {
			return "";
		}
		return sfmt.get().format(dt);
	}

	/**
	 * 转换日期类型为int YYYYMMDD格式
	 * 
	 * @param dt
	 *            要转换的时间
	 * @return 转换后的字符串
	 * @roseuid 44D6EB7A00E6
	 */
	public static int getCurrDate() {
		return Integer.parseInt(sfmt.get().format(new Date()));
	}
	
	/**
	 * 转换日期类型为int YYYYMMDD格式
	 * 
	 * @param dt
	 *            要转换的时间
	 * @return 转换后的字符串
	 * @roseuid 44D6EB7A00E6
	 */
	public static int getDateForYYYYMMDD(Date date) {
		return Integer.parseInt(sfmt.get().format(date));
	}

	/**
	 * 转换日期类型为字符串YYMMDD格式
	 * 
	 * @param dt
	 *            要转换的时间
	 * @return 转换后的字符串
	 * @roseuid 44D6EB7A00E6
	 */
	public static String specificFormatDateYYMMDD(Date dt) {
		if (dt == null) {
			return "";
		}
		return ssfmt.get().format(dt);
	}

	/**
	 * 转换日期类型为字符串yyyyMMddHHmmss
	 * 
	 * @param dt
	 *            Date对象
	 * @return 字符串
	 */
	public static String formatDateTime(Date dt) {
		if (dt == null) {
			return "";
		}
		return fmtl.get().format(dt);
	}

	/**
	 * 转换日期类型为字符串 可以自定义格式yyyyMMddHHmmss
	 * 
	 * @param dt
	 *            Date对象
	 * @return 字符串
	 */
	public static String formatDateTime(Date dt, String format) {
		SimpleDateFormat sdf = new SimpleDateFormat(format);
		if (dt == null) {
			return "";
		}
		return sdf.format(dt);
	}

	/**
	 * @since 1.0
	 * @roseuid 44C5A3840067
	 */
	public DateTimeUtil() {

	}

	/**
	 * 时间表示格式
	 */
//	public static final String DEFAULT_FORMAT = "yyyy-MM-dd HH:mm:ss";

	/**
	 * Get the current date string representation.
	 * 
	 * @param dateFormat
	 *            the input dateFormat. See the
	 *            <code>java.text.SimpleDateFormat</code> API for date format
	 *            string examples 示例： String currDateStr =
	 *            DateUtil.getCurrentDateString("yyyy-MM-dd HH:mm:ss");
	 */
	public static String getCurrentDateString(String dateFormat) {
		Calendar cal = Calendar.getInstance(TimeZone.getDefault());
		SimpleDateFormat sdf = new SimpleDateFormat(dateFormat);
		sdf.setTimeZone(TimeZone.getDefault());

		return sdf.format(cal.getTime());
	}

	/**
	 * 得到系统当前时间。格式："yyyy-MM-dd HH:mm:ss"
	 * 
	 * @return 系统当前时间。格式："yyyy-MM-dd HH:mm:ss"
	 */
	public static String getCurrentDateString() {
		return getCurrentDateString(FormatTimestamp);
	}

	/**
	 * 得到当前系统时间的毫秒数
	 * 
	 * @return long 毫秒数
	 */
	public static long getCurrentDateLong() {

		Calendar cal = Calendar.getInstance();

		return cal.getTime().getTime();
	}

	/**
	 * 得到当前系统时间
	 * 
	 * @return long 毫秒数
	 */
	public static Date getCurrentDate() {

		Date currDate = new Date();

		return currDate;
	}

	/**
	 * 比较系统当前时间是否在传入的开始与结束时间范围内
	 * 
	 * @param startDate
	 *            String yyyy-MM-dd HH:mm:ss 开始时间
	 * @param endDate
	 *            String yyyy-MM-dd HH:mm:ss 结束时间
	 * @param compareTs
	 * @return true在范围内,false不在范围内
	 */
	public static boolean compare(String startDate, String endDate, long compareTs) {
		Calendar cal = Calendar.getInstance();
		try {
			cal.setTime(fromDateStringFixed(startDate));
			long startMi = cal.getTimeInMillis();
			cal.setTime(fromDateStringFixed(endDate));
			long endMi = cal.getTimeInMillis();
			if (compareTs >= startMi && compareTs < endMi) {
				return true;
			}
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return false;
	}

	/**
	 * addMonths 将月份进行增加，如果是减去，将value赋值为负数即可
	 * 
	 * @param value
	 *            int
	 * @return Date
	 */
	public static Date addMonths(int value) {
		Calendar cal = Calendar.getInstance();
		cal.add(Calendar.MONTH, value);

		return cal.getTime();
	}

	/**
	 * addDays 将天数进行增加，如果是减去，将value赋值为负数即可
	 * 
	 * @param date
	 *            Dat 需要增加的日期
	 * @param i
	 *            int 天数
	 * @return Date
	 */
	public static Date addDays(Date date, int i) {
		return dateAdd(date, i);
	}

	/**
	 * 
	 * 获得上个月时间返回（yyyy-MM-dd）
	 * 
	 * @param date
	 */
	public static String getPreMonth(Date date) {

		GregorianCalendar calender = new GregorianCalendar();

		calender.setTime(date);

		calender.add(Calendar.MONTH, -1);

		return DateFormatUtils.format(calender.getTimeInMillis(), "yyyy-MM-dd");
	}

	/**
	 * 得到指定日期当天开始的最早的时间。
	 * 
	 * @author jiafangyao
	 * @param date
	 *            传入日期
	 * @return
	 * @since 0.1_2012-8-2
	 */
	public static Date getDateFirstTime(Date date) {
		Calendar c = Calendar.getInstance();
		c.setFirstDayOfWeek(Calendar.MONDAY);
		c.setTime(date);
		c.set(Calendar.HOUR_OF_DAY, 0);
		c.set(Calendar.MINUTE, 0);
		c.set(Calendar.SECOND, 0);
		c.set(Calendar.MILLISECOND, 0);
		return c.getTime();
	}

	/**
	 * 得到指定日期当天开始的最晚的时间。
	 * 
	 * @author jiafangyao
	 * @param date
	 *            传入日期
	 * @return
	 * @since 0.1_2012-8-2
	 */
	public static Date getDateLastTime(Date date) {
		Calendar c = Calendar.getInstance();
		c.setFirstDayOfWeek(Calendar.MONDAY);
		c.setTime(date);
		c.set(Calendar.HOUR_OF_DAY, 23);
		c.set(Calendar.MINUTE, 59);
		c.set(Calendar.SECOND, 59);
		c.set(Calendar.MILLISECOND, 999);
		return c.getTime();
	}

	/**
	 * 获取指定日期的上周第一天。
	 * 
	 * @author jiafangyao
	 * @param date
	 *            　传入日期
	 * @return
	 * @since 0.1_2012-7-3
	 */
	public static Date getPreMonday(Date date) {

		Calendar c = Calendar.getInstance();
		c.setFirstDayOfWeek(Calendar.MONDAY);
		c.setTime(date);
		c.add(Calendar.DATE, -7);
		c.set(Calendar.HOUR_OF_DAY, 0);
		c.set(Calendar.MINUTE, 0);
		c.set(Calendar.SECOND, 0);
		c.set(Calendar.MILLISECOND, 0);
		c.set(Calendar.DAY_OF_WEEK, c.getFirstDayOfWeek()); // Monday
		return c.getTime();
	}

	/**
	 * 获取指定日期的上周最后一天。
	 * 
	 * @author jiafangyao
	 * @param date
	 *            　传入日期
	 * @return
	 * @since 0.1_2012-7-3
	 */
	public static Date getPreSunday(Date date) {

		Calendar c = Calendar.getInstance();
		c.setFirstDayOfWeek(Calendar.MONDAY);
		c.setTime(date);
		c.add(Calendar.DATE, -7);
		c.set(Calendar.HOUR_OF_DAY, 23);
		c.set(Calendar.MINUTE, 59);
		c.set(Calendar.SECOND, 59);
		c.set(Calendar.MILLISECOND, 999);
		c.set(Calendar.DAY_OF_WEEK, c.getFirstDayOfWeek() + 6); // Monday
		return c.getTime();
	}

	/**
	 * 取得指定日期所在周的第一天 。
	 * 
	 * @author jiafangyao
	 * @param date
	 *            传入日期
	 * @return
	 * @since 0.1_2012-6-20
	 */
	public static Date getFirstDayOfWeek(Date date) {
		Calendar c = Calendar.getInstance();
		c.setFirstDayOfWeek(Calendar.MONDAY);
		c.setTime(date);
		c.set(Calendar.HOUR_OF_DAY, 0);
		c.set(Calendar.MINUTE, 0);
		c.set(Calendar.SECOND, 0);
		c.set(Calendar.MILLISECOND, 0);
		c.set(Calendar.DAY_OF_WEEK, c.getFirstDayOfWeek()); // Monday
		return c.getTime();
	}

	/**
	 * 取得指定日期所在周的最后一天 。
	 * 
	 * @author jiafangyao
	 * @param date
	 *            传入日期
	 * @return
	 * @since 0.1_2012-6-20
	 */
	public static Date getLastDayOfWeek(Date date) {
		Calendar c = Calendar.getInstance();
		c.setFirstDayOfWeek(Calendar.MONDAY);
		c.setTime(date);
		c.set(Calendar.HOUR_OF_DAY, 23);
		c.set(Calendar.MINUTE, 59);
		c.set(Calendar.SECOND, 59);
		c.set(Calendar.MILLISECOND, 999);
		c.set(Calendar.DAY_OF_WEEK, c.getFirstDayOfWeek() + 6); // Sunday
		return c.getTime();
	}

	/**
	 * 获取指定日期的下周第一天。
	 * 
	 * @author jiafangyao
	 * @param date
	 *            　传入日期
	 * @return
	 * @since 0.1_2012-7-3
	 */
	public static Date getNextMonday(Date date) {

		Calendar c = Calendar.getInstance();
		c.setFirstDayOfWeek(Calendar.MONDAY);
		c.setTime(date);
		c.add(Calendar.DATE, 7);
		c.set(Calendar.HOUR_OF_DAY, 0);
		c.set(Calendar.MINUTE, 0);
		c.set(Calendar.SECOND, 0);
		c.set(Calendar.MILLISECOND, 0);
		c.set(Calendar.DAY_OF_WEEK, c.getFirstDayOfWeek()); // Monday
		return c.getTime();
	}

	/**
	 * 获取指定日期的下周最后一天。
	 * 
	 * @author jiafangyao
	 * @param date
	 *            　传入日期
	 * @return
	 * @since 0.1_2012-7-3
	 */
	public static Date getNextSunday(Date date) {

		Calendar c = Calendar.getInstance();
		c.setFirstDayOfWeek(Calendar.MONDAY);
		c.setTime(date);
		c.add(Calendar.DATE, 7);
		c.set(Calendar.HOUR_OF_DAY, 23);
		c.set(Calendar.MINUTE, 59);
		c.set(Calendar.SECOND, 59);
		c.set(Calendar.MILLISECOND, 999);
		c.set(Calendar.DAY_OF_WEEK, c.getFirstDayOfWeek() + 6); // Monday
		return c.getTime();
	}

	/**
	 * 将当天从0时0分0秒开始的秒数转换为HH:mm:ss。
	 * 
	 * @author jiafangyao
	 * @param seconds
	 *            秒数
	 * @return
	 * @since 0.1_2013-4-19
	 */
	public static String getTimeStrBySeconds(int seconds) {
		Calendar curCalendar = Calendar.getInstance();
		curCalendar.setTime(new Date());
		Calendar calendar = Calendar.getInstance();
		calendar.set(Calendar.YEAR, curCalendar.get(Calendar.YEAR));
		calendar.set(Calendar.MONTH, curCalendar.get(Calendar.MONTH));
		calendar.set(Calendar.DATE, curCalendar.get(Calendar.DATE));
		calendar.set(Calendar.HOUR_OF_DAY, seconds / 3600);
		calendar.set(Calendar.MINUTE, seconds % 3600 / 60);
		calendar.set(Calendar.SECOND, seconds % 3600 % 60 % 60);
		return format.get().format(calendar.getTime());
	}

	/**
	 * 得到当天从0时0分0秒开始的秒数。
	 * 
	 * @author jiafangyao
	 * @param TimeStr
	 *            如：12:10:10
	 * @return
	 * @since 0.1_2013-4-19
	 */
	public static int getSecondsByTimeStr(String TimeStr) {
		ParsePosition pos = new ParsePosition(0);
		Date date = format.get().parse(TimeStr, pos);
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		int seconds = calendar.get(Calendar.HOUR_OF_DAY) * 3600 + calendar.get(Calendar.MINUTE) * 60 + calendar.get(Calendar.SECOND);
		return seconds;
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
	
	public static int dateInterval(String startDate, String endDate){
		return dateInterval(format(startDate, "yyyyMMdd"), format(endDate, "yyyyMMdd"));
	}
	
	public static int dateInterval(Date startDate, Date endDate){
		Calendar calendar = Calendar.getInstance();  
        calendar.setTime(startDate);  
        long startTime = calendar.getTimeInMillis();               
        calendar.setTime(endDate);
        long endTime = calendar.getTimeInMillis();       
        long interval=(endTime-startTime)/(1000*3600*24);
        
       return Integer.parseInt(String.valueOf(interval));
	}
	
	public static Calendar toCalendar(String timeInMillis) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTimeInMillis(Long.valueOf(timeInMillis));
		return calendar;
	}
	
	public static boolean isCurrentDate(long time, long tsreceive){
		Date begin = new Date(tsreceive);
		begin.setHours(0);
		begin.setMinutes(0);
		begin.setSeconds(0);
		Date end = new Date(tsreceive);
		end.setHours(23);
		end.setMinutes(59);
		end.setSeconds(59);
		if(begin.getTime() <= time && time <= end.getTime()){
			return true;
		}else{
			return false;
		}
	}
	
	 /**
     * 小时加减
     * @param hour
     * @param minutes
     * @param minus
     * @return
     */
    public static   String  getHourTime(int hour,int minutes,int minus){
        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.HOUR_OF_DAY, hour);
        cal.set(Calendar.MINUTE, minutes);
        cal.add(Calendar.HOUR_OF_DAY,minus);
        String hourTime = DateTimeUtil.formatDateTime(cal.getTime(), "HH:mm");
        return hourTime;
    }

    /**
     * 根据long类型日期，返回yyyy-MM-dd-HH
     * @param tsrecive
     * @return
     */
    public static String getDateHour(long tsrecive){
    	Date date = new Date(tsrecive);
    	String dateHour = fdh.get().format(date);
        return dateHour;
    }
    
    /**
     * 根据long类型日期，返回yyyy_w
     * @param tsrecive
     * @return
     */
    public static String getDateYearWeek(long tsrecive){
    	Date date = new Date(tsrecive);
    	String dateWeek = fw.get().format(date);
        return dateWeek;
    }
    
    /**
     * 根据long类型日期，返回yyyy_MM_dd
     * @param tsrecive
     * @return
     */
    public static String getDateYmd(long tsrecive){
    	Date date = new Date(tsrecive);
    	String dateWeek = fymd.get().format(date);
        return dateWeek;
    }
	
}