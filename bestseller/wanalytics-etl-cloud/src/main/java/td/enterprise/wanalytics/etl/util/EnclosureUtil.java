package td.enterprise.wanalytics.etl.util;

import lombok.extern.slf4j.Slf4j;
import td.enterprise.wanalytics.etl.bean.CityRegion;
import td.enterprise.wanalytics.etl.task.position.Enclosure;

import java.util.*;

/**
 * Created by tendcloud on 2016/2/24.
 */
@Slf4j
public class EnclosureUtil {
    private static Map<Enclosure.EnclosureType, List<Enclosure>> enclosureMap = new HashMap();

    public static String latAndLng2Enclousure(Float lat, Float lng, Enclosure.EnclosureType enclosureType,String cityName) {

        if (enclosureMap.get(enclosureType) == null) {
            init(enclosureType,cityName);
        }

        for (Enclosure e : enclosureMap.get(enclosureType)) {
            if (isPolyContainsPt(e.getLats(), e.getLngs(), lat, lng)) {
                return e.getName();
            }
        }
        return null;
    }
    /**
     * 加载行政区域或者商业区域，读取数据库配置
     * @param enclosureType
     */
    private static void init(Enclosure.EnclosureType enclosureType,String cityName) {
    	  String regionType = enclosureType.getType() + "";
          List<Enclosure> enclosures = new ArrayList<>();
          List<CityRegion> list = queryRegionNameByType(regionType, cityName);
          for (CityRegion c : list) {
              Enclosure enclosure = new Enclosure();
              enclosure.setName(c.getRegionName());
              List<Float> lats = new ArrayList<>();
              List<Float> lngs = new ArrayList<>();
              List<CityRegion> detailList = queryRegionList(c.getRegionName(),cityName);
              for (CityRegion detail : detailList) {
                  lats.add(Float.parseFloat( detail.getLatitudeBd()));
                  lngs.add(Float.parseFloat(detail.getLongitudeBd()));
              }
              enclosure.setLats(lats.toArray(new Float[lats.size()]));
              enclosure.setLngs(lngs.toArray(new Float[lngs.size()]));
              enclosures.add(enclosure);
          }
          enclosureMap.put(enclosureType, enclosures);
  }

    public static boolean isPolyContainsPt(Float[] lats, Float[] lngs, float pointLat, float pointLng) {
        boolean ret = false;
        float latMin = 90.0f;
        float latMax = -90.0f;
        float lngMin = 180.0f;
        float lngMax = -180.0f;
        for (int i = 0; i < lats.length; i++) {
            if (lats[i] > latMax) latMax = lats[i];
            if (lats[i] < latMin) latMin = lats[i];
            if (lngs[i] > lngMax) lngMax = lngs[i];
            if (lngs[i] < lngMin) lngMin = lngs[i];
        }
        if (!(pointLat < latMin || pointLat > latMax || pointLng < lngMin || pointLng > lngMax)) {

            for (int i = 0; i < lats.length; i++) {
                int j = (i + 1) % lats.length;
                if ((lats[i] < pointLat) != (lats[j] < pointLat) && (pointLng < (lngs[j] - lngs[i]) * (pointLat - lats[i]) / (lats[j] - lats[i]) + lngs[i])) {
                    ret = !ret;
                }
            }
        }
        return ret;
    }


    public static   List<CityRegion> queryRegionNameByType (String regionType ,String cityName){
        String sql = " select distinct region_name         from TD_CITY_REGION          where region_type=" + regionType + " and city_name='" + cityName + "'";
        List<Map<String,Object>>  list  = QueryUtils.query(sql,QueryUtils.WIFIANALYTICS_DB);
        List<CityRegion> resultList = new ArrayList<>( );
        for(Map<String,Object> map : list){
            CityRegion cr = new CityRegion();
            cr.setRegionName(map.get("region_name") + "");
            resultList.add(cr);
        }
        return  resultList;
    }

    public static   List<CityRegion> queryRegionList (String regionName ,String cityName){
        String sql = " select id,city_name,region_name,region_type,longitude_bd,latitude_bd,order_no,creator,create_by,create_time,updater,update_by,update_time from TD_CITY_REGION          where region_name='" + regionName + "' and city_name='" + cityName + "'";
        List<Map<String,Object>>  list  = QueryUtils.query(sql,QueryUtils.WIFIANALYTICS_DB);
        List<CityRegion> resultList = new ArrayList<>( );
        for(Map<String,Object> map : list){
            CityRegion cr = new CityRegion();
            cr.setRegionName(map.get("region_name") + "");
            cr.setLatitudeBd(map.get("latitude_bd") + "" );
            cr.setLongitudeBd(map.get("longitude_bd") + "");
            resultList.add(cr);
        }
        return  resultList;
    }

    public static void main(String []args) {
//    	String cityName = "青岛市";
//    	String regionName = "市南区";
//    	CityRegionService service = ApplicationContextManager.getBean(CityRegionService.class);
//    	 List<Float> lats = new ArrayList<>();
//         List<Float> lngs = new ArrayList<>();
//         List<CityRegion> detailList = service.queryRegionList(regionName,cityName);
//         for (CityRegion detail : detailList) {
//             lats.add(Float.parseFloat( detail.getLatitudeBd()));
//             lngs.add(Float.parseFloat(detail.getLongitudeBd()));
//         }
//         Float[] latsArray = (Float[]) lats.toArray(new Float[lats.size()]);
//         Float[] lngsArray =  (Float[]) lngs.toArray(new Float[lngs.size()]);
//         log.info("latsArray=" + Arrays.toString(latsArray));
//         log.info("lngsArray=" + Arrays.toString(lngsArray));
////         float  pointLat = 36.06416319219194f;
////         float  pointLng = 120.30419329298242f;
//          float  pointLat = 36.05782f;
//          float  pointLng = 120.29274f;
//
//         boolean b = isPolyContainsPt (latsArray,lngsArray,pointLat,pointLng);
//
//          String regionNameY =  latAndLng2Enclousure(pointLat,pointLng, EnclosureType.DISTRICT ,cityName);
//
//          log.info(regionNameY);

    }


}

