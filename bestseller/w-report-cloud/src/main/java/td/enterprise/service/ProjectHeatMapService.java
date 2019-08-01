package td.enterprise.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import td.enterprise.dao.ProjectHeatMapDao;
import td.enterprise.entity.ProjectHeatMap;

/**
 * <br>
 * <b>功能：</b>人群热力图 ProjectHeatMapService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-10-11 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("projectHeatMapService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class ProjectHeatMapService extends BaseService<ProjectHeatMap> {
	public final static Logger logger = Logger.getLogger(ProjectHeatMapService.class);
	
	@Autowired
	private ProjectHeatMapDao dao;

	public ProjectHeatMapDao getDao() {
		return dao;
	}
}
