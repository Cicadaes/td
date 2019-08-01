package td.enterprise.service;

import org.apache.ibatis.session.SqlSession;
import td.enterprise.dao.WarningConfigDao;
import td.enterprise.entity.WarningConfig;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>预警通知接收设置表 WarningConfigService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-07-07 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class WarningConfigService {

	public static WarningConfig queryBySingle(SqlSession sqlSession, WarningConfig warningConfig) {
		WarningConfigDao dao = sqlSession.getMapper(WarningConfigDao.class);
		List <WarningConfig> warningConfigs = dao.queryByList(warningConfig);
		return null == warningConfigs || warningConfigs.size() == 0 ? null : warningConfigs.get(0);
	}
}
