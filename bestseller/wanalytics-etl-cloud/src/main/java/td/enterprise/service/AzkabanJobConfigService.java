package td.enterprise.service;

import org.apache.ibatis.session.SqlSession;
import td.enterprise.dao.AzkabanJobConfigDao;
import td.enterprise.entity.AzkabanJobConfig;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>Azkaban任务配置表 AzkabanJobConfigService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-01-19 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class AzkabanJobConfigService {

    public static List<AzkabanJobConfig> queryByValidList(SqlSession sqlSession, AzkabanJobConfig azkabanJobConfig) {
        AzkabanJobConfigDao dao = sqlSession.getMapper(AzkabanJobConfigDao.class);
        return dao.queryByValidList(azkabanJobConfig);
    }

}
