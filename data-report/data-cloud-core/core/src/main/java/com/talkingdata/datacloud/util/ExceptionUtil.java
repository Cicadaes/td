package com.talkingdata.datacloud.util;

import java.io.ByteArrayOutputStream;
import java.io.PrintStream;

public class ExceptionUtil {
	/**
	 * @description 获取异常跟踪
	 */
	public static String getExceptionTrace(Throwable e) {
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		PrintStream ps = new PrintStream(baos);
		e.printStackTrace(ps);
		return baos.toString();
	}
}
