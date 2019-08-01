package com.talkingdata.datacloud.visual.util.custom;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.joda.time.LocalDate;
import org.joda.time.LocalDateTime;
import org.joda.time.Weeks;
import org.joda.time.format.DateTimeFormat;

/**
 * Created by yangruobin on 2017/10/30.
 */
public class DateUtil {


  /**
   * JAVA获取某段时间内的所有日粒度日期
   */
  public static List<Date> findDates(Date dBegin, Date dEnd) {
    return findDates(dBegin, dEnd, Calendar.DAY_OF_MONTH);
  }

  /**
   * JAVA获取某段时间内的所有月粒度日期
   */
  public static List<Date> findMonths(Date dBegin, Date dEnd) {
    return findDates(dBegin, dEnd, Calendar.MONTH);
  }

  /**
   * 两个日期之间所有的周 yyyy-ww
   */
  public static List<String> findWeeks(LocalDate start, LocalDate end) {
    List<String> weeks = Stream.iterate(start, localDate -> localDate.plusWeeks(1))
        .limit(Weeks.weeksBetween(start, end).getWeeks() + 1)
        .map(date -> date.toString("yyyy-ww"))
        .collect(Collectors.toList());

    return weeks;
  }

  public static List<Date> findDates(Date dBegin, Date dEnd, int dateGranularity) {
    List lDate = new ArrayList();
    lDate.add(dBegin);
    Calendar calBegin = Calendar.getInstance();
    // 使用给定的 Date 设置此 Calendar 的时间
    calBegin.setTime(dBegin);
    if (dateGranularity == Calendar.WEEK_OF_YEAR) {
      calBegin.add(Calendar.DAY_OF_WEEK, 6);
    }
    Calendar calEnd = Calendar.getInstance();
    // 使用给定的 Date 设置此 Calendar 的时间
    calEnd.setTime(dEnd);
    // 测试此日期是否在指定日期之后
    while (dEnd.after(calBegin.getTime())) {
      // 根据日历的规则，为给定的日历字段添加或减去指定的时间量
      calBegin.add(dateGranularity, 1);
      lDate.add(calBegin.getTime());
    }
    return lDate;
  }


  /**
   * 两个日期的月份差
   *
   * @param fromDate 起始日期 ，toDate 结束日期
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
   * @param fromDate 起始日期，toDate 结束日期
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
   * @param fromDate 起始日期 ，toDate 结束日期
   * @return 两日期的月分差，例1998-4-21~1998-4-25 相差两个月 返回4
   * @since 0.1
   */
  public static int getDiffDays(Date fromDate, Date toDate) {
    return (int) ((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24));
  }

  /**
   * 当前日期加减天数
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
   */
  public static Date getCalculateMonth(Date date, int num) {
    Calendar calendar = new GregorianCalendar();
    calendar.setTime(date);
    calendar.add(Calendar.MONTH, num);
    date = calendar.getTime();

    return date;
  }
}
