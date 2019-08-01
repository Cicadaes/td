package td.enterprise.service;

import com.tendcloud.enterprise.um.umic.entity.User;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import td.enterprise.common.constant.ReportConstants;
import td.enterprise.dao.ChangeLogDao;
import td.enterprise.entity.ChangeLog;
import td.enterprise.page.ChangeLogPage;
import td.enterprise.web.util.JsonUtils;
import td.enterprise.web.util.UserInfoUtil;

import java.io.IOException;
import java.util.List;

/**
 * <br>
 * <b>功能：</b>变更历史表 ChangeLogService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-06-13 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("changeLogService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class ChangeLogService extends BaseService<ChangeLog> {
	public final static Logger logger = Logger.getLogger(ChangeLogService.class);
	
	@Autowired
	private ChangeLogDao dao;

	public ChangeLogDao getDao() {
		return dao;
	}

	public void addLog(String tableName, String moduleId, Object oldObject, Object newObject) {
		try {
			ChangeLog changeLog = new ChangeLog();
			changeLog.setTableName(tableName);
			changeLog.setBeforeValue(JsonUtils.objectToJsonStr(oldObject));
			changeLog.setAfterValue(JsonUtils.objectToJsonStr(newObject));
			changeLog.setModuleId(moduleId);
			changeLog.setStatus(ReportConstants.DefaultStatus.AVALIABLE);
			User user = UserInfoUtil.getUser();
			changeLog.setCreator(user.getUmid());
			changeLog.setCreateBy(user.getUmid());
			dao.insert(changeLog);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public List<ChangeLog> queryByUpdateDescList(ChangeLogPage page) {
		int rows = dao.queryByCount(page);
		page.getPager().setRowCount(rows);
		return dao.queryByUpdateDescList(page);
	}

}
