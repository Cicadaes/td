package td.enterprise.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import td.enterprise.dao.CityAppIntrestCountDao;
import td.enterprise.entity.CityAppIntrestCount;
import td.enterprise.page.CityAppIntrestCountPage;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>应用偏好提升度 CityAppIntrestCountService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-10-13 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("cityAppIntrestCountService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class CityAppIntrestCountService extends BaseService<CityAppIntrestCount> {
    public final static Logger logger = Logger.getLogger(CityAppIntrestCountService.class);

    @Autowired
    private CityAppIntrestCountDao dao;

    public CityAppIntrestCountDao getDao() {
        return dao;
    }

    public List<CityAppIntrestCount> queryListByPage(CityAppIntrestCountPage page) {
        List<CityAppIntrestCount> list = dao.queryByList(page);
        if (list.size() == 0) {
            //倒推到有数据的记录，重新设置run_date值
            CityAppIntrestCount cityAppIntrestCount = dao.queryLatestRow(page);
            if (cityAppIntrestCount != null) {
                page.setRunDate(cityAppIntrestCount.getRunDate());
                list = dao.queryByList(page);
            }
        }
        return list;
    }

}
