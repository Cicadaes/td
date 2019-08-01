package td.enterprise.wanalytics.etl.task.download;

import java.io.*;
import java.text.DecimalFormat;
import java.util.*;
import java.util.Map.Entry;
import java.util.stream.Stream;

import lombok.extern.slf4j.Slf4j;
import org.apache.log4j.Logger;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import td.enterprise.entity.CityAppIntrestCount;
import td.enterprise.entity.Project;
import td.enterprise.wanalytics.etl.bean.DownLoadExcelBean;
import td.enterprise.wanalytics.etl.util.HttpUtil;

import td.enterprise.wanalytics.etl.util.QueryUtils;
import td.olap.query.runscript.bean.QueryEngineResult;
import td.olap.query.utils.QueryEngineResultUtil;
import td.olap.query.utils.QueryServiceUtils;
@Slf4j
public class DownloadTaskCalculation {

    public static String queryUrl = HttpUtil.getParamFromConfigServer("query.engine.url") + "/api/query";

    public static Logger logger = Logger.getLogger(DownloadTaskCalculation.class);

    public static DownLoadExcelBean calculate(Project project, String startDate, String endDate, int duration) throws IOException, InvalidFormatException {

        DownLoadExcelBean downLoadExcelBean = new DownLoadExcelBean();

        //TODO 店铺明细
        downLoadExcelBean.setShopIntroduction(project.getProjectName());
        downLoadExcelBean.setCity(project.getCity());
        String projectNum = project.getProjectNum();
        downLoadExcelBean.setCisCode(projectNum);

        //TODO 客流指标
//			String attendsql ="r30223=select * from enterprise.offline_active_user_day_counter where project_id="+projectId+" and date between "+startDate +" and "+endDate+";";
//			QueryEngineResult invoke = QueryServiceUtils.invoke("post", queryUrl, attendsql);
//			long value = QueryEngineResultUtil.getDefaultValue(invoke).longValue();
//			downLoadExcelBean.setTotalPassengerFlow(value+"");
//			downLoadExcelBean.setDailyPassengerFlow((value/duration)+"");;

        String newsql = "r30223=select * from enterprise.offline_new_user_day_counter where project_id=" + project.getId() + " and date between " + startDate + " and " + endDate + ";";
        QueryEngineResult newsqlf = QueryServiceUtils.invoke("post", queryUrl, newsql);
        long newsqlvalue = QueryEngineResultUtil.getDefaultValue(newsqlf).longValue();
        downLoadExcelBean.setNewPassengerFlow(newsqlvalue + "");
        downLoadExcelBean.setDailyNewCustomer((newsqlvalue / duration) + "");

        String oldsql = "r30223=select * from enterprise.offline_old_user_day_counter where project_id=" + project.getId() + " and date between " + startDate + " and " + endDate + ";";
        QueryEngineResult oldsqlf = QueryServiceUtils.invoke("post", queryUrl, oldsql);
        long oldsqlvalue = QueryEngineResultUtil.getDefaultValue(oldsqlf).longValue();
        downLoadExcelBean.setOldPassengerFlow(oldsqlvalue + "");
        downLoadExcelBean.setDailyOldCustomer(oldsqlvalue / duration + "");

        long value = newsqlvalue + oldsqlvalue;
        downLoadExcelBean.setTotalPassengerFlow(value + "");
        downLoadExcelBean.setDailyPassengerFlow((value / duration) + "");


        if (value != 0) {
            downLoadExcelBean.setNewPassengerRate(((newsqlvalue * 100) / value) + "%");
        } else {
            downLoadExcelBean.setNewPassengerRate("0%");
        }

        long hourCounter9 = hourCounter(project.getId(), startDate, endDate, 9);
        long hourCounter10 = hourCounter(project.getId(), startDate, endDate, 10);
        long hourCounter11 = hourCounter(project.getId(), startDate, endDate, 11);
        long hourCounter12 = hourCounter(project.getId(), startDate, endDate, 12);
        long hourCounter13 = hourCounter(project.getId(), startDate, endDate, 13);
        long hourCounter14 = hourCounter(project.getId(), startDate, endDate, 14);
        long hourCounter15 = hourCounter(project.getId(), startDate, endDate, 15);
        long hourCounter16 = hourCounter(project.getId(), startDate, endDate, 16);
        long hourCounter17 = hourCounter(project.getId(), startDate, endDate, 17);
        long hourCounter18 = hourCounter(project.getId(), startDate, endDate, 18);
        long hourCounter19 = hourCounter(project.getId(), startDate, endDate, 19);
        long hourCounter20 = hourCounter(project.getId(), startDate, endDate, 20);
        long hourCounter21 = hourCounter(project.getId(), startDate, endDate, 21);
        long hourCounter22 = hourCounter(project.getId(), startDate, endDate, 22);
        long hourCounter23 = hourCounter(project.getId(), startDate, endDate, 23);
        downLoadExcelBean.setPassengerFlow9(hourCounter9 + "");
        downLoadExcelBean.setPassengerFlow10(hourCounter10 + "");
        downLoadExcelBean.setPassengerFlow11(hourCounter11 + "");
        downLoadExcelBean.setPassengerFlow12(hourCounter12 + "");
        downLoadExcelBean.setPassengerFlow13(hourCounter13 + "");
        downLoadExcelBean.setPassengerFlow14(hourCounter14 + "");
        downLoadExcelBean.setPassengerFlow15(hourCounter15 + "");
        downLoadExcelBean.setPassengerFlow16(hourCounter16 + "");
        downLoadExcelBean.setPassengerFlow17(hourCounter17 + "");
        downLoadExcelBean.setPassengerFlow18(hourCounter18 + "");
        downLoadExcelBean.setPassengerFlow19(hourCounter19 + "");
        downLoadExcelBean.setPassengerFlow20(hourCounter20 + "");
        downLoadExcelBean.setPassengerFlow21(hourCounter21 + "");
        downLoadExcelBean.setPassengerFlow22(hourCounter22 + "");
        downLoadExcelBean.setPassengerFlow23(hourCounter23 + "");

        HashMap<String, Long> hashMap = new HashMap<String, Long>();
        hashMap.put("9-10点", hourCounter9);
        hashMap.put("10-11点", hourCounter10);
        hashMap.put("11-12点", hourCounter11);
        hashMap.put("12-13点", hourCounter12);
        hashMap.put("13-14点", hourCounter13);
        hashMap.put("14-15点", hourCounter14);
        hashMap.put("15-16点", hourCounter15);
        hashMap.put("16-17点", hourCounter16);
        hashMap.put("17-18点", hourCounter17);
        hashMap.put("18-19点", hourCounter18);
        hashMap.put("19-20点", hourCounter19);
        hashMap.put("20-21点", hourCounter20);
        hashMap.put("21-22点", hourCounter21);
        hashMap.put("22-23点", hourCounter22);
        hashMap.put("23-24点", hourCounter23);
        Iterator<Entry<String, Long>> iterator = hashMap.entrySet().iterator();
        long bigger = 0l;
        String biggerTime = "NA";
        while (iterator.hasNext()) {
            Entry<String, Long> next = iterator.next();
            if (next.getValue() > bigger) {
                bigger = next.getValue();
                biggerTime = next.getKey();
            }
        }
        downLoadExcelBean.setPeakPeriod(biggerTime);

        String staynumb = "r30223=select * from enterprise.offline_stay_user_day_counter where project_id=" + project.getId() + " and date between " + startDate + " and " + endDate + ";";
        QueryEngineResult staynumbs = QueryServiceUtils.invoke("post", queryUrl, staynumb);
        long bnumbs = QueryEngineResultUtil.getDefaultValue(staynumbs).longValue();

        String staytimelong = "r30223=select * from enterprise.offline_stay_user_duration_day_counter where project_id=" + project.getId() + " and date between " + startDate + " and " + endDate + ";";
        QueryEngineResult staytimelongs = QueryServiceUtils.invoke("post", queryUrl, staytimelong);
        long btimes = QueryEngineResultUtil.getDefaultValue(staytimelongs).longValue();

        if (bnumbs != 0) {
            double cijuntingliushichang = ((double) btimes) / ((double) bnumbs);//2017-03-07修改为 总时间/人次  = 人均停留
            DecimalFormat decimalFormat = new DecimalFormat("#.##");
            downLoadExcelBean.setMeanResidenceTime(decimalFormat.format(cijuntingliushichang));
        }

        //TODO 人口属性
        //家有宝宝 080302 育儿阶段 08030201 家有大宝宝 08030202 家有小宝宝 08030203 孕婴童 080303 人生阶段 0302 19-25岁 030207 26-35岁 030208 36-45岁 030209 46-55岁 030210 55岁以上 030211 19岁以下 030212 婚育情况 0304 未婚 030401 已婚 030402 车辆情况 0305 有车 030501 无车 030502
        int counter = 0;
        //indexList.put("0301", "030101"); //男
        counter = queryOffsetList(project.getTenantId(), project.getId(), startDate, endDate, "0301", "030101");
        downLoadExcelBean.setGenderMale(counter + "");

        //indexList.put("0301", "030102"); //女
        counter = queryOffsetList(project.getTenantId(), project.getId(), startDate, endDate, "0301", "030102");
        downLoadExcelBean.setGenderFemale(counter + "");

//            indexList.put("0302", "030212"); //19以下
        counter = queryOffsetList(project.getTenantId(), project.getId(), startDate, endDate, "0302", "030212");
        downLoadExcelBean.setYears19(counter + "");

//            indexList.put("0302", "030207"); //19-25岁
        counter = queryOffsetList(project.getTenantId(), project.getId(), startDate, endDate, "0302", "030207");
        downLoadExcelBean.setYears25(counter + "");

//            indexList.put("0302", "030208"); //26-35岁
        counter = queryOffsetList(project.getTenantId(), project.getId(), startDate, endDate, "0302", "030208");
        downLoadExcelBean.setYears35(counter + "");

//            indexList.put("0302", "030209"); //36-45岁
        counter = queryOffsetList(project.getTenantId(), project.getId(), startDate, endDate, "0302", "030209");
        downLoadExcelBean.setYears45(counter + "");

//            indexList.put("0302", "0302010"); //46-55岁
        counter = queryOffsetList(project.getTenantId(), project.getId(), startDate, endDate, "0302", "030210");
        downLoadExcelBean.setYears55(counter + "");

//            indexList.put("0302", "0302011"); //55岁以上
        counter = queryOffsetList(project.getTenantId(), project.getId(), startDate, endDate, "0302", "030211");
        downLoadExcelBean.setYears100(counter + "");

//            indexList.put("0304", "030402"); //已婚
        counter = queryOffsetList(project.getTenantId(), project.getId(), startDate, endDate, "0304", "030402");
        downLoadExcelBean.setMarried(counter + "");

//            indexList.put("0803", "080302"); //育儿
        counter = queryOffsetList(project.getTenantId(), project.getId(), startDate, endDate, "0304", "080302");
        downLoadExcelBean.setChild(counter + "");

        //            indexList.put("0803", "080302"); //有车
        counter = queryOffsetList(project.getTenantId(), project.getId(), startDate, endDate, "0305", "030501");
        downLoadExcelBean.setHaveCar(counter + "");

//            indexList.put("price", "1～499"); //1-499
        counter = queryOffsetList(project.getTenantId(), project.getId(), startDate, endDate, "price", "1～499");
        downLoadExcelBean.setPrice499(counter + "");

//            indexList.put("price", "500～999"); //1-499
        counter = queryOffsetList(project.getTenantId(), project.getId(), startDate, endDate, "price", "500～999");
        downLoadExcelBean.setPrice999(counter + "");

//            indexList.put("price", "1000~1999"); //1-499
        counter = queryOffsetList(project.getTenantId(), project.getId(), startDate, endDate, "price", "1000~1999");
        downLoadExcelBean.setPrice1999(counter + "");

//            indexList.put("price", "2000~3999"); //1-499
        counter = queryOffsetList(project.getTenantId(), project.getId(), startDate, endDate, "price", "2000~3999");
        downLoadExcelBean.setPrice3999(counter + "");

//            indexList.put("price", "4000及以上"); //1-499
        counter = queryOffsetList(project.getTenantId(), project.getId(), startDate, endDate, "price", "4000及以上");
        downLoadExcelBean.setPrice4000(counter + "");

//            indexList.put("020101", "1"); //
        counter = queryOffsetList(project.getTenantId(), project.getId(), startDate, endDate, "020101", "1");
        downLoadExcelBean.setWork(counter + "");

//            indexList.put("020102", "1"); //
        counter = queryOffsetList(project.getTenantId(), project.getId(), startDate, endDate, "020102", "1");
        downLoadExcelBean.setVideo(counter + "");

//            indexList.put("020103", "1"); //
        counter = queryOffsetList(project.getTenantId(), project.getId(), startDate, endDate, "020103", "1");
        downLoadExcelBean.setFood(counter + "");

//            indexList.put("020104", "1"); //
        counter = queryOffsetList(project.getTenantId(), project.getId(), startDate, endDate, "020104", "1");
        downLoadExcelBean.setBusinessTravel(counter + "");

//            indexList.put("020105", "1"); //
        counter = queryOffsetList(project.getTenantId(), project.getId(), startDate, endDate, "020105", "1");
        downLoadExcelBean.setFinance(counter + "");

//            indexList.put("020106", "1"); //
        counter = queryOffsetList(project.getTenantId(), project.getId(), startDate, endDate, "020106", "1");
        downLoadExcelBean.setCosmetology(counter + "");

//            indexList.put("020107", "1"); //
        counter = queryOffsetList(project.getTenantId(), project.getId(), startDate, endDate, "020107", "1");
        downLoadExcelBean.setSocialContact(counter + "");

//            indexList.put("020108", "1"); //
        counter = queryOffsetList(project.getTenantId(), project.getId(), startDate, endDate, "020108", "1");
        downLoadExcelBean.setRead(counter + "");

//            indexList.put("020109", "1"); //
        counter = queryOffsetList(project.getTenantId(), project.getId(), startDate, endDate, "020109", "1");
        downLoadExcelBean.setHealthy(counter + "");

//            indexList.put("0201010", "1"); //
        counter = queryOffsetList(project.getTenantId(), project.getId(), startDate, endDate, "020110", "1");
        downLoadExcelBean.setLife(counter + "");

//            indexList.put("0201011", "1"); //
        counter = queryOffsetList(project.getTenantId(), project.getId(), startDate, endDate, "020111", "1");
        downLoadExcelBean.setEntertainment(counter + "");

//            indexList.put("0201012", "1"); //
        counter = queryOffsetList(project.getTenantId(), project.getId(), startDate, endDate, "020112", "1");
        downLoadExcelBean.setHomeFurnishing(counter + "");

//            indexList.put("0201013", "1"); //
        counter = queryOffsetList(project.getTenantId(), project.getId(), startDate, endDate, "020113", "1");
        downLoadExcelBean.setCar(counter + "");

//            indexList.put("0201014", "1");
        counter = queryOffsetList(project.getTenantId(), project.getId(), startDate, endDate, "020114", "1");
        downLoadExcelBean.setHouseProperty(counter + "");

//            indexList.put("0201015", "1");
        counter = queryOffsetList(project.getTenantId(), project.getId(), startDate, endDate, "020115", "1");
        downLoadExcelBean.setBaby(counter + "");

//            indexList.put("0201016", "1");
        counter = queryOffsetList(project.getTenantId(), project.getId(), startDate, endDate, "020116", "1");
        downLoadExcelBean.setOnlineShopping(counter + "");

//            indexList.put("0201017", "1");
        counter = queryOffsetList(project.getTenantId(), project.getId(), startDate, endDate, "020117", "1");
        downLoadExcelBean.setInformation(counter + "");

//            indexList.put("0201018", "1");
        counter = queryOffsetList(project.getTenantId(), project.getId(), startDate, endDate, "020118", "1");
        downLoadExcelBean.setCommunityRanking(counter + "");

        //品牌

        String sql = "select tag_value from atomic_cube where tag_code = 'standardBrand'";
        List<Map<String, Object>> standardBrandList = QueryUtils.query(sql, QueryUtils.BITMPA_DB);
        Map<String, Integer> brands = new HashMap<>();
        for (Map<String, Object> standardBrand : standardBrandList) {
            String brand = (String) standardBrand.get("tag_value");
            counter = queryOffsetList(project.getTenantId(), project.getId(), startDate, endDate, "standardBrand", brand);
            brands.put(brand, counter);
        }
        Map<String, Integer> sortedMap = sortByValue(brands);

        StringBuilder top10Brand = new StringBuilder();
        int i = 0;
        for (String b : sortedMap.keySet()) {
            if (i > 9)
                break;

            top10Brand.append(b).append(",");
            i++;
        }
        downLoadExcelBean.setPhoneBrand(top10Brand.toString());


        //设置top10 小区
        //获取项目到访人群 最近top10 小区
        String top10AreaNames = getTopAreaName(project.getId(),endDate);

        downLoadExcelBean.setCommunityRanking(top10AreaNames);


        return downLoadExcelBean;
    }

    /**
     * 获取项目到访人群，最近top10 小区排名
     * @return
     */
    private static String getTopAreaName(int projectId , String runDate){
        //查询到访人群ID
        String crowdSql = "select id from TD_CROWD where type='AU' and attr1=" + projectId ;
        Map<String,Object> map = QueryUtils.querySingle(crowdSql,QueryUtils.WIFIANALYTICS_DB);
        if(null == map || map.isEmpty()){
            logger.error("查询项目Id=" + projectId + " 到访人群id为空！");
            return "";
        }

        int crowdId =  Integer.parseInt(map.get("id") + "" );
        String   topAreaList = "select area_name , metric_value, run_date from TD_TENANT_TOP_AREA_COUNT where project_id= " + projectId + " and crowd_id = " + crowdId  + " and run_date = (select run_date from TD_TENANT_TOP_AREA_COUNT where run_date <='" + runDate + "' and project_id= " + projectId+  " and crowd_id = " + crowdId +" order by run_date desc limit 1 ) order by metric_value desc limit 10 ";
        List<Map<String,Object>>  topList = QueryUtils.query(topAreaList,QueryUtils.WIFIANALYTICS_DB);
        StringBuffer buffer = new StringBuffer("");
        if(null != topAreaList ){
            int i = 1;
           for(Map<String,Object> areaMap : topList){
               String  areaName = areaMap.get("area_name") + "";
               buffer.append(i).append(":").append(areaName).append(" ");
               i ++;
           }
        }
        logger.info("项目ID=" + projectId  + " top10小区是：" + buffer.toString());
        return buffer.toString();
    }

    private static long hourCounter(Integer projectId, String startDay, String endDay, int hour) {
        String k1 = "r30223=select * from enterprise.offline_active_user_hour_counter where project_id=" + projectId + " and date between " + startDay + " and " + endDay + " and hour=" + hour + ";";
        QueryEngineResult k1f = QueryServiceUtils.invoke("post", queryUrl, k1);
        long k1v = QueryEngineResultUtil.getDefaultValue(k1f).longValue();
        return k1v;
    }

    private static Integer queryOffsetList(String tenantId, int projectId, String startDate, String endDate, String tagCode, String tagValue) {

        String crowdCubeName = "active_user_day_cube";

        String script = "r030102=select * from bitmap." + crowdCubeName + " where tenant_id=" + tenantId + " and project_id=" + projectId + " and date between '" + startDate + "' and '" + endDate + "';" +
                "r0721=select * from bitmap.atomic_cube where tenant_id=" + tenantId + " and tag_value=" + tagValue + " and tag_code=" + tagCode + ";" +
                "t30157=unite(r030102,r0721);" +
                "t30157.subkey(0);";

        QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, script);
        Integer result = QueryEngineResultUtil.getDefaultValue(qer);
        return result;
    }

    public static <K, V extends Comparable<? super V>> Map<K, V> sortByValue(Map<K, V> map) {
        Map<K, V> result = new LinkedHashMap<>();
        Stream<Entry<K, V>> st = map.entrySet().stream();

        st.sorted(Comparator.comparing(e -> e.getValue())).forEach(e -> result.put(e.getKey(), e.getValue()));

        return result;
    }

    public static void main(String [] arg) {
        int projectId = 7;
        String runDate = "2017-05-27";
        String areaName = getTopAreaName(projectId,runDate);
        log.info(areaName);
    }

}
