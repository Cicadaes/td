package com.talkingdata.analytics.wifi.collector.util;

/**
 * Created by loong on 4/13/16.
 */
public class Codeconvert {
    public static String ByteToStr(byte[] bIn, int offset, int iLen) {
        if (bIn == null) {
            return null;
        } else {
            String sRet = "";
            String sTemp = "0123456789ABCDEF";
            boolean i = false;
            boolean iTemp = false;
            byte[] bTemp = sTemp.getBytes();
            byte[] bOut = new byte[2 * iLen];

            for (int var9 = 0; var9 < iLen; ++var9) {
                int var10 = (bIn[var9 + offset] & 240) >> 4;
                bOut[var9 * 2] = bTemp[var10];
                var10 = bIn[var9 + offset] & 15;
                bOut[var9 * 2 + 1] = bTemp[var10];
            }

            sRet = new String(bOut);
            return sRet;
        }
    }
}
