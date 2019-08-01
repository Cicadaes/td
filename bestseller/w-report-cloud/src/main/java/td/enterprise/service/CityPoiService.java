package td.enterprise.service;


import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import td.enterprise.dao.CityPoiDao;
import td.enterprise.entity.CityPoi;
import td.enterprise.page.CityPoiPage;

/**
 * <br>
 * <b>功能：</b>城市区域地理位置范围 CityPoiService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-05-19 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("cityPoiService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class CityPoiService extends BaseService<CityPoi> {
    public final static Logger logger = Logger.getLogger(CityPoiService.class);

    @Autowired
    private CityPoiDao dao;

    public CityPoiDao getDao() {
        return dao;
    }

    /**
     * 导入城市区域地理范围
     */
    public void importCityPOI(String longitude, String latitude, String cityName, String name, String type) {
        CityPoi cr = new CityPoi();
        cr.setLongitudeBd(longitude);
        cr.setLatitudeBd(latitude);
        cr.setCityName(cityName);
        cr.setName(name);
        cr.setType(type);

        CityPoiPage page = new CityPoiPage();

        page.setLongitudeBd(longitude);
        page.setLatitudeBd(latitude);
        page.setCityName(cityName);
        page.setName(name);
        page.setType(type);

        int count = dao.queryByCount(page);
        if (count == 0) {
            dao.insert(cr);
        }

    }
}
