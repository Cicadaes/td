package td.enterprise.service;

import com.tendcloud.enterprise.um.umic.entity.User;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import td.enterprise.common.constant.ReportConstants;
import td.enterprise.dao.ProjectAttributeDao;
import td.enterprise.entity.ProjectAttribute;

/**
 * <br>
 * <b>功能：</b>项目属性表 ProjectAttributeService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-06-12 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("projectAttributeService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class ProjectAttributeService extends BaseService<ProjectAttribute> {
	public final static Logger logger = Logger.getLogger(ProjectAttributeService.class);
	
	@Autowired
	private ProjectAttributeDao dao;

	public ProjectAttributeDao getDao() {
		return dao;
	}

}
