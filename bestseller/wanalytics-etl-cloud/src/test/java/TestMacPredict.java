import org.apache.commons.cli.ParseException;
import org.apache.log4j.Logger;
import td.enterprise.wanalytics.etl.constant.Constant;
import td.enterprise.wanalytics.etl.task.MacPredictTask;
import td.enterprise.wanalytics.etl.util.HttpUtil;

import java.util.HashMap;
import java.util.Map;
import java.util.TreeSet;

/**
 * Created by Administrator on 2017/6/13.
 */
public class TestMacPredict {

    private static final Logger logger = Logger.getLogger(MacPredictTask.class);

    public static void main(String[] args) throws ParseException {
//        long begin = System.currentTimeMillis();
//        String json= "{\n" +
//                "    \"starttime\":\"13.59\",\n" +
//                "    \"endtime\":\"15.05\",\n" +
//                "    \"station\":66,\n" +
//                "    \"strongsignal\":-42,\n" +
//                "    \"weaksignal\":-76,\n" +
//                "    \"times\":3,\n" +
//                "    \"diff\":34\n" +
//                "}";
//        String url = "http://172.23.5.109:9000/api";
//        try{
//            Map map = HttpUtil.postBody(url, json ,HashMap.class);
//            logger.info("map=" + map);
//        }catch (Exception e){
//            e.printStackTrace();
//        }
//
//        long end = System.currentTimeMillis();
//        logger.info("----MacPredictTask Task is over. Used Time :" + (end - begin) / 1000 + " seconds.");

        TreeSet<Integer> set = new TreeSet<>();
        String rssi = "-30;-50;-80;-60;-80;-50;-12";
        for(String t : rssi.split(Constant.SEMICOLON)){
            set.add(Integer.parseInt(t));
        }
        System.out.println("strong:" + set.last() + " weak:" + set.first());
        System.out.println("times="  + (set.size() - 1));
    }
}
