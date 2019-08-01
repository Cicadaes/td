package td.enterprise.common.util;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class PassengerDateUtil {

    private static final ThreadLocal<DateFormat> DATE_FORMAT = new ThreadLocal<DateFormat>() {
        @Override
        protected DateFormat initialValue() {
            return new SimpleDateFormat("yyyy-MM-dd");
        }
    };

    public static long getDiffDays(Date fromDate, Date toDate) {
        return (toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24);
    }

    public static long getDiffDaysStr(String fromDate, String toDate) {
        long length = 0;

        if (fromDate == null || fromDate.equals("") || fromDate.equals("null")) {
            return 0;
        }
        if (toDate == null || toDate.equals("") || toDate.equals("null")) {
            return 0;
        }

        try {
            length = (DATE_FORMAT.get().parse(toDate).getTime() - DATE_FORMAT.get().parse(fromDate).getTime()) / (1000 * 60 * 60 * 24) + 1;
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return length;
    }

    public static int getDiffDaysStrInt(String fromDate, String toDate) {
        return (int) getDiffDaysStr(fromDate, toDate);
    }

    public static long getDateBeforeBak(String date, Long dateLength) {
        long dateBefore = 0;
        if (date == null || date.equals("") || date.equals("null")) {
            return 0;
        }

        try {
            dateBefore = DATE_FORMAT.get().parse(date).getTime() - dateLength * (1000 * 60 * 60 * 24);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return dateBefore;
    }

    public static String getDateBefore(String date, Long dateLength) {
        long dateBefore = 0;
        if (date == null || date.equals("") || date.equals("null")) {
            return date;
        }

        try {
            dateBefore = DATE_FORMAT.get().parse(date).getTime() - dateLength * (1000 * 60 * 60 * 24);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return DATE_FORMAT.get().format(new Date(dateBefore));
    }


}
