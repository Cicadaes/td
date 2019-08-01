/**
 * 
 * @author davy
 * 日期:		2013-3-28 17:16:21
 * 
 * The default character set is UTF-8.
 */
package td.enterprise.wanalytics.idmapping.utils;

import td.enterprise.framework.commons.util.StringUtils;
import td.enterprise.framework.commons.util.Utils;

/**
 * 
 * @author davy 日期: 2013-3-22 下午3:36:19
 */
public class BeanUtils extends Utils {

	public static final String OFFSET_TIME_SPLITER = "&";
	public static final String TABLE_SPLITER = "_";



	/**
	 * @param id
	 * @param time
	 * @return
	 */
	public static String makeOffsetAndTime(long id, long time) {
		return StringUtils.arrayToString(id, OFFSET_TIME_SPLITER, time);
	}

	public static long[] getOffsetAndTime(String offsetAndTime) {
		long[] offsetAndTimes = new long[2];
		if (isNotEmpty(offsetAndTime)) {
			String[] idTimes = offsetAndTime.split(OFFSET_TIME_SPLITER);
			if (idTimes.length > 2)
				offsetAndTimes = new long[idTimes.length];
			for (int i = 0; i < idTimes.length; i++) {
				offsetAndTimes[i] = StringUtils.stringToLong(idTimes[i]);
			}
		}
		return offsetAndTimes;
	}

	public static long getOffset(String offsetAndTime) {
		return getOffsetAndTime(offsetAndTime)[0];
	}

	public static long getTime(String offsetAndTime) {
		return getOffsetAndTime(offsetAndTime)[1];
	}
}
