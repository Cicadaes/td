package com.talkingdata.marketing.core.util;

import java.math.BigDecimal;

/**
 *
 * @author zmy
 * @date 8/5/2017
 */
public class MathUtil {

	/**
	 * 求百分比
	 *
	 * @param number   the number
	 * @param dividend the dividend
	 * @return percent percent
	 */
	public static String getPercent(int number, int dividend) {
        if (0 == dividend){
            return  "0.00%";
        }
        double percent= (double)number/dividend * 100;
        BigDecimal bigDecimal = new BigDecimal(percent);
        bigDecimal = bigDecimal.setScale(2,BigDecimal.ROUND_DOWN);
        return bigDecimal +"%";
    }

	/**
	 * The entry point of application.
	 *
	 * @param args the input arguments
	 */
	public static void main(String[] args) {
        String percent = getPercent(2, 3);
        System.out.println(percent);
    }

}
