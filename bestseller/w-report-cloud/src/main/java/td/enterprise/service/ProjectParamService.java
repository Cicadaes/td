package td.enterprise.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import td.enterprise.dao.ProjectParamDao;
import td.enterprise.entity.ProjectParam;
import td.enterprise.page.ProjectParamPage;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * <br>
 * <b>功能：</b>项目参数 ProjectParamService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-08-25 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("projectParamService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class ProjectParamService extends BaseService<ProjectParam> {
    public final static Logger logger = Logger.getLogger(ProjectParamService.class);

    @Autowired
    private ProjectParamDao dao;

    public ProjectParamDao getDao() {
        return dao;
    }

    public Map<Integer, String> getAllProjectParamsTheme() throws Exception {
        Map<Integer, String> themeMap = new HashMap<>();

        ProjectParamPage page = new ProjectParamPage();
        page.setPageEnabled(false);
        page.setKey("PROJECT.THEME");

        List<ProjectParam> projectParamsTheme = getDao().queryByList(page);
        for (int i = 0; i <projectParamsTheme.size(); i++) {
            ProjectParam param = projectParamsTheme.get(i);
            themeMap.put(param.getProjectId(), param.getValue());
        }
        return themeMap;
    }

    public Map<Integer, String> getAllProjectParamsUnit() throws Exception {
        Map<Integer, String> unitMap = new HashMap<>();

        ProjectParamPage page = new ProjectParamPage();
        page.setPageEnabled(false);
        page.setKey("PROJECT.THRESHOLDTIME.UNIT");

        List <ProjectParam> projectParamsUnit = getDao().queryByList(page);
        for (int i = 0; i <projectParamsUnit.size(); i++) {
            ProjectParam param = projectParamsUnit.get(i);
            unitMap.put(param.getProjectId(), param.getValue());
        }
        return unitMap;
    }
}
