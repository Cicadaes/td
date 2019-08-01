package td.enterprise.service;

import org.apache.ibatis.session.SqlSession;
import td.enterprise.dao.ReceiveConfigDao;
import td.enterprise.wanalytics.etl.bean.ReceiveConfig;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>接收配置表 ReceiveConfigService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-11-07 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class ReceiveConfigService{

    public static List<ReceiveConfig> queryByAllList(SqlSession sqlSession, ReceiveConfig page) {
        ReceiveConfigDao dao = sqlSession.getMapper(ReceiveConfigDao.class);
        return dao.queryByAllList(page);
    }

}
