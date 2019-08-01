package com.talkingdata.datacloud.util;

public class StringUtils {

    public static String trim(String src, char c) {
        if (src == null) return null;
        int start = 0;
        int end = src.length() - 1;
        for (; start <= end && src.charAt(start) == c; start++);
        for (; start <= end && src.charAt(end) == c; end--);
        return src.substring(start, end + 1);
    }

    public static boolean isEmpty(String src) {
        return src == null || src.length() == 0 || src.equals("null");
    }

    public static String getStrings(String[] strs) {
        StringBuffer sb = new StringBuffer();
        for (String str : strs) {
            sb.append(str);
        }
        return sb.toString();
    }

}
