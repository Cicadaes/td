package td.enterprise.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import td.enterprise.dao.CityRegionDao;
import td.enterprise.entity.CityRegion;
import td.enterprise.page.CityRegionPage;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>城市区域地理位置范围 CityRegionService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-05-19 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("cityRegionService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class CityRegionService extends BaseService<CityRegion> {
    public final static Logger logger = Logger.getLogger(CityRegionService.class);

    @Autowired
    private CityRegionDao dao;

    public CityRegionDao getDao() {
        return dao;
    }

    /**
     * 导入城市区域地理范围
     */
    public void importCityRegion(List<String> longitudeList, List<String> latitudeList, String cityName, String regionName, String regionType) {
        if (null == longitudeList || null == latitudeList || longitudeList.size() != latitudeList.size()) {
            logger.error("------------导入数据有错误-----------");
            return;
        }
        int size = longitudeList.size();
        for (int i = 0; i < size; i++) {
            CityRegion cr = new CityRegion();
            cr.setLongitudeBd(longitudeList.get(i));
            cr.setLatitudeBd(latitudeList.get(i));
            cr.setCityName(cityName);
            cr.setRegionName(regionName);
            cr.setRegionType(regionType);
            cr.setOrderNo(i + 1);

//			CityRegionPage page = new CityRegionPage();
//
//			page.setLongitudeBd(longitudeList.get(i));
//			page.setLatitudeBd(latitudeList.get(i));
//			page.setCityName(cityName);
//			page.setRegionName(regionName);
//			page.setRegionType(regionType);
//
//			int count = dao.queryByCount(page);
//			if(count == 0){
            dao.insert(cr);
//			}
        }

    }

    public List<CityRegion> queryRegionNameByType(String regionType, String cityName) {
        CityRegion cr = new CityRegion();
        cr.setRegionType(regionType);
        cr.setCityName(cityName);
        return dao.queryRegionNameByType(cr);
    }

    public List<CityRegion> queryRegionList(String regionName, String cityName) {
        CityRegion cr = new CityRegion();
        cr.setRegionName(regionName);
        cr.setCityName(cityName);
        return dao.queryRegionList(cr);
    }

    public List querySumByList(CityRegionPage page)
            throws Exception {
        List list = getDao().querySumByList(page);
        return list;
    }
}
