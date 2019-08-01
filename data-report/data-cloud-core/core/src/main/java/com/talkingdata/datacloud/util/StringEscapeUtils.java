package com.talkingdata.datacloud.util;

public class StringEscapeUtils {

    public static String escapeMysqlLike(String src) {
        return src.replace("'", "''").replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_");
    }

}
