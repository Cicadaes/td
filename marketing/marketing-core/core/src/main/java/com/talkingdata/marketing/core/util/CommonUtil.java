package com.talkingdata.marketing.core.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.lang.reflect.Method;
import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.util.Calendar;
import java.util.List;

/**
 * The type Common util.
 * @author hongsheng
 */
public class CommonUtil {
    private static final Logger logger = LoggerFactory.getLogger(CommonUtil.class);
    /**
     * 小时
     */
    public static final int HOUR = 1;
    /**
     * 天
     */
    public static final int DAY = 2;

    /**
     * 依据时间粒度补全数据集
     *
     * @param datas 待补全数据集合
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @param timeFormat 时间格式 如：yyyy-MM-dd HH:mm:ss
     * @param timeFiled 时间字段名称
     * @param timeType 时间粒度类型 @see CommonUtil中变量HOUR, DAY等
     * @param timeOffset 时间粒度值
     * @throws Exception
     */
    public static <T> void completeDataByTimeCondition(final List<T> datas, final String startTime, final String endTime, String timeFormat,
            String timeFiled, int timeType, int timeOffset) throws Exception {
        if (datas == null || datas.isEmpty() || timeOffset == 0) { return; }

        String tmpTime = startTime;
        while (tmpTime.compareTo(endTime) <= 0) {
            boolean flag = false;
            for (T data :datas) {
                Class clazz = data.getClass();
                String currentTime = (String) clazz.getDeclaredMethod(pareGetName(timeFiled), null).invoke(data);
                if (tmpTime.compareTo(currentTime) == 0) { flag = true; }
            }
            if (!flag) {
                T t = (T)datas.get(0).getClass().newInstance();
                Method setMethod = t.getClass().getDeclaredMethod(pareSetName(timeFiled), String.class);
                setMethod.invoke(t, tmpTime);
                datas.add(t);
            }
            tmpTime = initTime(tmpTime, timeType, timeFormat, timeOffset);
        }
        doSort(datas, timeFiled);
    }

    /**
     * 按时间字符窜自然排序
     * @param datas 排序数据
     * @param timeFiled 比较字段名
     */
    private static <T> void doSort(List<T> datas, String timeFiled) {
        datas.sort((t1, t2) -> {
                    try {
                        return ((String) t1.getClass().getDeclaredMethod(pareGetName(timeFiled), null).invoke(t1)).compareTo(
                                (String) t2.getClass().getDeclaredMethod(pareGetName(timeFiled), null).invoke(t2));
                    } catch (Exception e) {
                        logger.error("依据时间粒度补全数据集排序失败", e);
                        return 0;
                    }
                }
        );
    }

    /**
     * 依据时间粒度更新时间
     *
     * @param time 开始时间
     * @param timeType 时间粒度类型
     * @param format 时间格式
     * @param timeOffset 时间粒度值
     * @return
     */
    private static String initTime(String time, int timeType, String format, int timeOffset) {
        Calendar calendar = DateUtil.getCalendar(time, format);
        if (HOUR == timeType) {
            calendar.add(Calendar.HOUR_OF_DAY, timeOffset);
        } else if (DAY == timeType) {
            calendar.add(Calendar.DAY_OF_MONTH, timeOffset);
        } else {
            throw new IllegalArgumentException("时间跨度类型非法");
        }
        return DateUtil.date2String(format, calendar.getTime());
    }

    /**
     * 拼接在某属性的 set方法
     *
     * @param fieldName
     * @return String
     */
    public static String pareSetName(String fieldName) {
        if (null == fieldName || "".equals(fieldName)) {
            return null;
        }
        return "set" + fieldName.substring(0, 1).toUpperCase()
                + fieldName.substring(1);
    }

    /**
     * 拼接在某属性的 get方法
     *
     * @param fieldName
     * @return String
     */
    public static String pareGetName(String fieldName) {
        if (null == fieldName || "".equals(fieldName)) {
            return null;
        }
        return "get" + fieldName.substring(0, 1).toUpperCase()
                + fieldName.substring(1);
    }


    /**
	 * Gets percent.
	 *
	 * @param number   the number
	 * @param dividend the dividend
	 * @return the percent
	 */
	public static BigDecimal getPercent(int number, int dividend) {
        double percent= (double)number/dividend * 100;
        DecimalFormat df = new DecimalFormat("0.00");
        return new BigDecimal(df.format(percent));
    }

	/**
	 * Gets percent.
	 *
	 * @param number   the number
	 * @param dividend the dividend
	 * @return the percent
	 */
	public static BigDecimal getPercent(long number, long dividend) {
        double percent= (double)number/dividend * 100;
        DecimalFormat df = new DecimalFormat("0.00");
        return new BigDecimal(df.format(percent));
    }

	/**
	 * Spot insert char string.
	 *
	 * @param str   the str
	 * @param gap   the gap
	 * @param param the param
	 * @return the string
	 */
	public static String spotInsertChar(String str, int gap, char param) {
        if (gap<=0) {
            return str;
        }
        char[] chars = str.toCharArray();
        if(chars.length<= gap) {
            return str;
        }
        int firstCutPoint;
        if (chars.length%gap == 0) {
            firstCutPoint = gap;
        } else {
            firstCutPoint = chars.length - (chars.length/gap)*gap;
        }
        StringBuilder stringBuilder = new StringBuilder();
        for (int i=0;i<chars.length-1;) {
            if (i == 0) {
                stringBuilder.append(str.substring(i, firstCutPoint));
                i = firstCutPoint;
            } else {
                stringBuilder.append(param);
                stringBuilder.append(str.substring(i, i+gap));
                i+= gap;
            }
        }
        return stringBuilder.toString();
    }

    //	/**
    //	 * The entry point of application.
    //	 *
    //	 * @param args the input arguments
    //	 */
    //	public static void main(String[] args) {
    //        System.out.println(getPercent(229,10000).setScale(1,ROUND_DOWN));//只保留小数点后一位，多余精度舍弃
    //    }

}
