package td.enterprise.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import td.enterprise.dao.CityAppsPopularTopDao;
import td.enterprise.entity.CityAppsPopularTop;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * <br>
 * <b>功能：</b>App去流行表 CityAppsPopularTopService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-29 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("cityAppsPopularTopService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class CityAppsPopularTopService extends BaseService<CityAppsPopularTop> {
    public final static Logger logger = Logger.getLogger(CityAppsPopularTopService.class);

    @Autowired
    private CityAppsPopularTopDao dao;


    public static Map<CityAppsPopularTop, CityAppsPopularTop> cacheCityAppsPopularTop;

    public CityAppsPopularTopDao getDao() {
        return dao;
    }

    public String getCityAppProportion(String appHash, String platform, String activeHour, String cityName) {
        CityAppsPopularTop capp = new CityAppsPopularTop();
        capp.setAppHash(appHash);
        capp.setPlatform(platform);
        capp.setActiveHour(activeHour);

        if (null == cacheCityAppsPopularTop) {
            cacheCityAppsPopularTop = new HashMap<CityAppsPopularTop, CityAppsPopularTop>();
//			CityAppsPopularTopPage page = new CityAppsPopularTopPage();
//			page.setRows(20000);//设置缓存大小
//			page.setOrder(" id asc");//此条件非常有用，能够保证最新的app 覆盖前面的
//			List<CityAppsPopularTop>  list = dao.queryByList(page);
            CityAppsPopularTop top = new CityAppsPopularTop();
            top.setCity(cityName);
            List<CityAppsPopularTop> list = dao.getAllLatestCityAppProportion(top);
            for (CityAppsPopularTop t : list) {
                cacheCityAppsPopularTop.put(t, t);
            }
        }

//		List<Map<String,Object>> rtn = dao.getCityAppProportion(capp);
        String cityAppProportion = null;
//		if (rtn != null && rtn.size() > 0 ){
//             cityAppProportion = String.valueOf((BigDecimal)rtn.get(0).get("active_proportion"));
//        }
        //active_hour_number * 1000 / active_all_number
        CityAppsPopularTop value = cacheCityAppsPopularTop.get(capp);
        if (null != value) {
            cityAppProportion = ((value.getActiveHourNumber() * 1000) / value.getActiveAllNumber()) + "";
        }
        return cityAppProportion;
    }

    public List<CityAppsPopularTop> getAllLatestCityAppProportion(String cityName) {
        CityAppsPopularTop top = new CityAppsPopularTop();
        top.setCity(cityName);
        List<CityAppsPopularTop> list = dao.getAllLatestCityAppProportion(top);
        return list;
    }
}
