package com.talkingdata.marketing.core.util;

import com.talkingdata.marketing.core.constant.TriggerConstants;
import org.springframework.scheduling.support.CronSequenceGenerator;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

/**
 * The type Cron date utils.
 *
 * @author hongsheng
 */
public class CronDateUtils {
    private final static String MONTH = "month";
    private final static String WEEK = "week";
    private final static String DAY = "day";
    private final static int SUPPORT_CRON_LENTH = 6;
    private final static List<String> WEEKDAYS =
        new ArrayList(Arrays.asList("1", "2", "3", "4", "5", "6", "7", "SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"));

    /**
     * The entry point of application.
     *
     * @param args the input arguments
     */
    public static void main(String[] args) {
        //        {秒}  {分}  {时}  {日}  {月}  {周}
        //        String cron = "0 0 12 ? * WED";//表示每个星期三中午12点
        //        String cron = "0 0 12 * * ?"; //每天中午12点触发
        //        String cron = "0 15 10 15 * ?"; //每月15日上午10:15触发
        String week = buildCron(TriggerConstants.SubTriggerTypeConstants.WEEK, 14, 50, 1, null);
        String mon = buildCron(TriggerConstants.SubTriggerTypeConstants.MONTH, 14, 50, null, 20);
        System.out.println(getValByCron(week));
        System.out.println(getValByCron(mon));
    }

    /**
     * Gets type by cron.
     *
     * @param cron the cron
     * @return the type by cron
     */
    public static String getTypeByCron(String cron) {
        if (!isValidExpression(cron)) {
            return null;
        }
        String[] split = cron.split(" ");
        final int weekIndex = 5;
        final int monthIndex = 4;
        final String wildCards = "*";
        boolean anyDayFlag = "*".equals(split[3]) || "?".equals(split[3]);
        if (WEEKDAYS.contains(split[weekIndex])) {
            return WEEK;
        } else if (wildCards.equals(split[monthIndex]) && !anyDayFlag) {
            return MONTH;
        } else if (anyDayFlag) {
            return DAY;
        }
        return null;
    }

    /**
     * Gets next by cron.
     *
     * @param cron the cron
     * @param date the date
     * @return the next by cron
     */
    public static Date getNextByCron(String cron, Date date) {
        if (!isValidExpression(cron)) {
            return null;
        }
        CronSequenceGenerator cronSequenceGenerator = new CronSequenceGenerator(cron);
        Date next = cronSequenceGenerator.next(date);
        return next;
    }

    /**
     * Gets val by cron.
     *
     * @param cron the cron
     * @return the val by cron
     */
    public static Integer getValByCron(String cron) {
        if (!isValidExpression(cron)) {
            return null;
        }
        String typeByCron = getTypeByCron(cron);
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(getNextByCron(cron, new Date()));
        if (WEEK.equals(typeByCron)) {
            int week = calendar.get(Calendar.DAY_OF_WEEK);
            week = week - 1;
            if (week <= 0) {
                week = 7;
            }
            return week;
        } else if (MONTH.equals(typeByCron)) {
            return calendar.get(Calendar.DATE);
        }
        return null;
    }

    /**
     * Gets hour by cron.
     *
     * @param cron the cron
     * @return the hour by cron
     */
    public static Integer getHourByCron(String cron) {
        if (!isValidExpression(cron)) {
            return null;
        }

        Calendar cal = Calendar.getInstance();
        cal.setTime(getNextByCron(cron, new Date()));
        return cal.get(Calendar.HOUR_OF_DAY);
    }

    /**
     * Gets min by cron.
     *
     * @param cron the cron
     * @return the min by cron
     */
    public static Integer getMinByCron(String cron) {
        if (!isValidExpression(cron)) {
            return null;
        }
        Calendar cal = Calendar.getInstance();
        cal.setTime(getNextByCron(cron, new Date()));
        return cal.get(Calendar.MINUTE);
    }

    /**
     * Is valid expression boolean.
     *
     * @param expression the expression
     * @return the boolean
     */
    public static boolean isValidExpression(String expression) {
        String[] split = expression.split(" ");
        return split.length == SUPPORT_CRON_LENTH && CronSequenceGenerator.isValidExpression(expression);
    }

    /**
     * Build cron string.
     *
     * @param cycleType the cycle type
     * @param hour      the hour
     * @param min       the min
     * @param weekDay   the week day
     * @param mounthDay the mounth day
     * @return the string
     */
    public static String buildCron(Integer cycleType, Integer hour, Integer min, Integer weekDay, Integer mounthDay) {
        String cron = null;
        if (cycleType.equals(TriggerConstants.SubTriggerTypeConstants.DAY)) {
            cron = "0 " + min + " " + hour + " *" + " *" + " *";
        } else if (cycleType.equals(TriggerConstants.SubTriggerTypeConstants.WEEK)) {
            cron = "0 " + min + " " + hour + " *" + " *" + " " + weekDay;
        } else if (cycleType.equals(TriggerConstants.SubTriggerTypeConstants.MONTH)) {
            cron = "0 " + min + " " + hour + " " + mounthDay + " *" + " *";
        }
        return cron;
    }

}