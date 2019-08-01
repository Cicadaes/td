package td.enterprise.wanalytics.etl.util;

import java.io.*;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by Administrator on 2017/6/7.
 */
public class ReaderLogUtils {
    public static List<String> getLogBySort(List<String> pathList) throws IOException {
        List<String> stringList = new ArrayList<>();
//        if (pathList.size() > 1) {
            for(String path : pathList){
                FileInputStream in = new FileInputStream(new File(path));
                InputStreamReader isr = new InputStreamReader(in, "UTF-8");
                BufferedReader reader = new BufferedReader(isr);
                try{
                    String tempString = null;
                    while ((tempString = reader.readLine()) != null) {
                        stringList.add(tempString);
                    }

                }catch (IOException e){
                    e.printStackTrace();
                }finally {
                    reader.close();
                }
            }
            Collections.sort(stringList, new Comparator<String>() {
                @Override
                public int compare(String o1, String o2) {
                    long s1 = Long.parseLong(PatternUtils.getPattern(o1,PatternUtils.regexNumber));
                    long s2 = Long.parseLong(PatternUtils.getPattern(o2,PatternUtils.regexNumber));
                    if (s1 > s2){
                        return 1;
                    }else if (s1 < s2){
                        return -1;
                    }else {
                        return 0;
                    }

                }
            });
        return stringList;
    }
}
