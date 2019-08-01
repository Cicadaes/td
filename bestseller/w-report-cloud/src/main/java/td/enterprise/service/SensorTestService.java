package td.enterprise.service;

import com.tendcloud.enterprise.um.umic.entity.User;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import td.enterprise.dao.SensorTestDao;
import td.enterprise.entity.SensorTest;
import td.enterprise.web.util.UserInfoUtil;

/**
 * <br>
 * <b>功能：</b>探针信号强度测试表 SensorTestService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-07-19 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("sensorTestService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class SensorTestService extends BaseService<SensorTest> {
	public final static Logger logger = Logger.getLogger(SensorTestService.class);
	
	@Autowired
	private SensorTestDao dao;

	public SensorTestDao getDao() {
		return dao;
	}

    public SensorTest create(SensorTest sensorTest) {
		User user = UserInfoUtil.getUser();
		String tenantId = UserInfoUtil.getCurrentUserTenantId();
		String umid = user.getUmid();
		sensorTest.setTenantId(tenantId);
		sensorTest.setCreateBy(umid);
		sensorTest.setCreator(user.getName());
		sensorTest.setUpdater(umid);
		sensorTest.setUpdateBy(user.getName());
		dao.insert(sensorTest);
		return sensorTest;
    }

	public SensorTest update(SensorTest sensorTest) {
		User user = UserInfoUtil.getUser();
		String tenantId = UserInfoUtil.getCurrentUserTenantId();
		String umid = user.getUmid();
		sensorTest.setTenantId(tenantId);
//		sensorTest.setCreateBy(umid);
//		sensorTest.setCreator(user.getName());
		sensorTest.setUpdater(umid);
		sensorTest.setUpdateBy(user.getName());
		dao.updateByPrimaryKeySelective(sensorTest);
		return sensorTest;
	}
}
