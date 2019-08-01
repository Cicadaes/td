package td.enterprise.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import td.enterprise.common.constant.ReportConstants;
import td.enterprise.entity.Project;
import td.enterprise.page.ProjectPage;

import java.util.List;

@Service("projectExtendService")
public class ProjectExtendService {

    @Autowired
    private ProjectService projectService;

    public String getDirectChildProjectIds(String projectId) {
        ProjectPage page = new ProjectPage();
        page.setId(Integer.parseInt(projectId));
        page.setStatus(ReportConstants.ProjectStatus.AVALIABLE);
        List<Project> childrenProjectByParam = projectService.getDirectChildrenByParam(page);
        String ids = getIds(childrenProjectByParam);
        return ids;
    }

    public String getIds(List<Project> list) {
        StringBuffer buffer = new StringBuffer();
        if (null != list) {
            for (Project pr : list) {
                buffer.append(pr.getId()).append(",");
            }
            if (buffer.length() > 0) {
                buffer.deleteCharAt(buffer.length() - 1);
            }
        }
        return buffer.toString();
    }

}
