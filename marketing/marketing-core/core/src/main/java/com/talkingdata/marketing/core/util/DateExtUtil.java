package com.talkingdata.marketing.core.util;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;

/**
 * 日期与时间工具类
 *   此类使用java8中的新类
 * @author hongsheng
 * @create 2017-10-30-下午6:28
 * @since JDK 1.8
 */
public class DateExtUtil {

    /**
     * yyyy-MM-dd HH:mm:ss
     */
    public static DateTimeFormatter dtf_y4mmdd_hhmmss = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    /**
     * yyyy-MM-dd
     */
    public static DateTimeFormatter dtf_y4mmdd = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    /**
     * HH:mm:ss
     */
    public static DateTimeFormatter dtf_hhmmss = DateTimeFormatter.ofPattern("HH:mm:ss");

    /**
     * 将日期时间转换为字符串
     * @param dateTime 待转换时间
     * @param formatter 转换格式 查看当前类的定义静态变量
     * @return
     */
    public static String format(LocalDateTime dateTime, DateTimeFormatter formatter) {
        return dateTime.format(formatter);
    }

    /**
     * 将字符串转换为日期时间
     * @param dateTime 待转换时间
     * @param formatter 转换格式 查看当前类的定义静态变量
     * @return
     */
    public static LocalDateTime parseDateTime (String dateTime, DateTimeFormatter formatter) {
        return LocalDateTime.parse(dateTime, formatter);
    }

    /**
     * 日期时间增长
     * @param startDateTime 初始日期时间
     * @param unit 增加的部分，如天数等。具体查看@see ChronoUnit
     * @param offset
     * @return
     */
    public static LocalDateTime plus(LocalDateTime startDateTime, ChronoUnit unit, int offset) {
        return startDateTime.plus(offset, unit);
    }

}
