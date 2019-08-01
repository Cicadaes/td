package td.enterprise.wanalytics.etl.util;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by Administrator on 2017/6/8.
 */
public class PatternUtils {
    /**
     * 正则匹配字段后全部数字
     */
    public static String regexNumber = "\"tsreceive\":(\\d*)";


    /**
     * 正则匹配 字符
     * @param str 输入字符
     * @param regex 输入正则表达式
     * @return
     */
    public static String getPattern(String str,String regex){
        Pattern p1 = Pattern.compile(regex);
        Matcher m1 = p1.matcher(str);
        String srt = "";
        while (
                m1.find()
                ){
            srt = m1.group(1);
        }
        return srt;
    }
}
