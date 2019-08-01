package com.talkingdata.wifianalytics.offline.compute.util;

/**
 * Created by loong on 4/26/16.
 */
public class Util {

    public static boolean isInt(String str) {
        try {
            Integer.parseInt(str);
        } catch (Exception e) {
            return false;
        }
        return true;
    }
}
