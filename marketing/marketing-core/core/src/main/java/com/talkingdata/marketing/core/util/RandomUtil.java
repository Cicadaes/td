package com.talkingdata.marketing.core.util;

/**
 * The type Random util.
 * @author hongsheng
 */
public class RandomUtil {
	/**
	 * Gets random value.
	 *
	 * @param maximum the maximum
	 * @return zero to maximum, do not contain maximum value
	 */
	public static Integer getRandomValue(int maximum) {
        return (int)(Math.random() * maximum);
    }
}
