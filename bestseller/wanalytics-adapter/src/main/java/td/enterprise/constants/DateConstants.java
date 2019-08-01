package td.enterprise.constants;

import java.time.format.DateTimeFormatter;

/**
 * 日期常量
 * @description 
 * @author sxk
 * @date 2017年10月16日
 */
public class DateConstants {
    /**
     * FTP文件夹日期格式
     */
    public static final DateTimeFormatter FTP_PATTERN      = DateTimeFormatter.ofPattern("yyyyMMdd");
    /**
     * FTP文件夹日期小时格式
     */
    public static final DateTimeFormatter FTP_PATTERN_HOUR = DateTimeFormatter.ofPattern("yyyyMMddHH");

}
