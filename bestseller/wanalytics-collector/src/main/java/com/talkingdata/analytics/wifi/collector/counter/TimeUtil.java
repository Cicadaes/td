package com.talkingdata.analytics.wifi.collector.counter;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

public class TimeUtil {

	private static final ThreadLocal<DateFormat> simpleDateFormatDate = getThreadLocal("yyyy-MM-dd");
	private static final ThreadLocal<DateFormat> simpleDateFormatSecond = getThreadLocal("yyyy-MM-dd  HH:mm:ss");
	private static final ThreadLocal<DateFormat> simpleDateFormatHour = getThreadLocal("HH");
	
	private static ThreadLocal<DateFormat> getThreadLocal (final String dateFormatStr){
		return new ThreadLocal<DateFormat>() {
			@Override
			protected DateFormat initialValue() {
				return new SimpleDateFormat(dateFormatStr);
			}
		};
	}
	
	public static String gettime() {
		Date date = new Date();
		String format = simpleDateFormatDate.get().format(date);
		return format;
	}

	public static String gettime(Date date) {
		String format = simpleDateFormatDate.get().format(date);
		return format;
	}

	public static String getalltime() {
		Date date = new Date();
		String format = simpleDateFormatSecond.get().format(date);
		return format;
	}

	public static String getalltime(Date date) {
		String format = simpleDateFormatSecond.get().format(date);
		return format;
	}
	
	public static String gethour() {
		Date date = new Date();
		String format = simpleDateFormatHour.get().format(date);
		return format;
	}
	
	public static String gethour(Date date) {
		String format = simpleDateFormatHour.get().format(date);
		return format;
	}

}
