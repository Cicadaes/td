package com.talkingdata.wifianalytics.offline.compute.util;

import org.apache.commons.lang3.StringUtils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

/**
 * Created by loong on 4/26/16.
 */
public class TimeUtil {

    public static String dateBef(int days, String format) {
        if (format == null || "".equals(format))
            format = "yyyy-MM-dd";
        Calendar now = Calendar.getInstance();
        SimpleDateFormat formatter = new SimpleDateFormat(format);
        now.add(Calendar.DAY_OF_YEAR, -days);
        return formatter.format(now.getTime());
    }


    public static String today(String format) {
        if (format == null || "".equals(format))
            format = "yyyy-MM-dd";
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat(format);
        return simpleDateFormat.format(new Date());
    }

    public static String dateAdd(String dateStr, int adds, String format) {
        SimpleDateFormat formatter = new SimpleDateFormat(format);
        String result = "";
        try {
            Date date = formatter.parse(dateStr);
            Calendar cal = Calendar.getInstance();
            cal.setTime(date);
            cal.add(Calendar.DAY_OF_YEAR, adds);
            result = formatter.format(cal.getTime());
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return result;
    }

    public static void main(String[] args) {
        for (int i = 0; i < 32; i++) {
            System.out.println(dateAdd("20160424", -i, "yyyy-MM-dd"));
        }

    }

    public static List<String> getTimeRange(String starttime, String endtime,
                                            String format) {
        List<String> result = new ArrayList<String>();
        if (StringUtils.isBlank(starttime) || StringUtils.isBlank(endtime)) {
            return result;
        }
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
                cal.add(Calendar.DAY_OF_MONTH, 1);
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

}