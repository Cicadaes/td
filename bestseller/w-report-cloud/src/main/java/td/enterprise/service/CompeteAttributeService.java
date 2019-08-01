package td.enterprise.service;

import com.tendcloud.enterprise.um.umic.entity.User;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import td.enterprise.common.azkaban.AzkabanRestUtil;
import td.enterprise.common.exception.BusinessException;
import td.enterprise.dao.CompeteAttributeDao;
import td.enterprise.entity.CompeteAttribute;
import td.enterprise.web.util.UserInfoUtil;

import javax.inject.Inject;
import java.util.HashMap;
import java.util.Map;

/**
 * <br>
 * <b>功能：</b>竞品项目属性 CompeteAttributeService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-08-01 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("competeAttributeService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class CompeteAttributeService extends BaseService<CompeteAttribute> {
	public final static Logger logger = Logger.getLogger(CompeteAttributeService.class);
	
	@Autowired
	private CompeteAttributeDao dao;

	@Inject
	private AzkabanRestUtil azkabanRestUtil;

	public CompeteAttributeDao getDao() {
		return dao;
	}

	public CompeteAttribute create(CompeteAttribute competeAttribute) {
		User user = UserInfoUtil.getUser();
		competeAttribute.setTenantId(UserInfoUtil.getCurrentUserTenantId());
		competeAttribute.setCreateBy(user.getUmid());
		competeAttribute.setCreator(user.getName());
		dao.insert(competeAttribute);
		return competeAttribute;
	}

	public CompeteAttribute update(CompeteAttribute competeAttribute) {
		User user = UserInfoUtil.getUser();
		competeAttribute.setUpdater(user.getUmid());
		competeAttribute.setUpdateBy(user.getName());
		dao.updateByPrimaryKey(competeAttribute);
		return competeAttribute;
	}

	public CompeteAttribute updateDispose(CompeteAttribute competeAttribute) throws BusinessException {
		User user = UserInfoUtil.getUser();
		competeAttribute.setUpdater(user.getUmid());
		competeAttribute.setUpdateBy(user.getName());
		dao.updateById(competeAttribute);

		logger.info("调用azkaban接口，启动任务");
		Map<String, Object> paramMap = new HashMap<>();
		paramMap.put("projectIds", competeAttribute.getCompeteId());
		paramMap.put("startDate", competeAttribute.getStartDate());
		paramMap.put("endDate", competeAttribute.getEndDate());
		azkabanRestUtil.callAzkabanRestAPI(paramMap, "WifiAnalyticsTagTask", "WifiAnalyticsTagTask");
		azkabanRestUtil.callAzkabanRestAPI(paramMap, "PositionTask", "PositionTask");
		return competeAttribute;
	}

	public int deleteByCompeteId(String competeId) {
		return dao.deleteByCompeteId(competeId);
	}

    public int updateById(CompeteAttribute competeAttribute) {
		return dao.updateById(competeAttribute);
    }
}
