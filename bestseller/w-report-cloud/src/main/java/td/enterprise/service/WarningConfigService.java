package td.enterprise.service;

import com.tendcloud.enterprise.um.umic.entity.User;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import td.enterprise.dao.WarningConfigDao;
import td.enterprise.entity.WarningConfig;
import td.enterprise.web.util.UserInfoUtil;

/**
 * <br>
 * <b>功能：</b>预警通知接收设置表 WarningConfigService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-07-07 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("warningConfigService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class WarningConfigService extends BaseService<WarningConfig> {
	public final static Logger logger = Logger.getLogger(WarningConfigService.class);
	
	@Autowired
	private WarningConfigDao dao;

	public WarningConfigDao getDao() {
		return dao;
	}

	public WarningConfig create(WarningConfig warningConfig) {
		User user = UserInfoUtil.getUser();
		warningConfig.setTenantId(UserInfoUtil.getCurrentUserTenantId());
		warningConfig.setCreateBy(user.getUmid());
		warningConfig.setCreator(user.getName());
		dao.insert(warningConfig);
		return warningConfig;
	}

	public WarningConfig update(WarningConfig warningConfig) {
		User user = UserInfoUtil.getUser();
		warningConfig.setUpdater(user.getUmid());
		warningConfig.setUpdateBy(user.getName());
		dao.updateByPrimaryKey(warningConfig);
		return warningConfig;
	}
}
