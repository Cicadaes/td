package td.enterprise.wanalytics.processor.utils;

import net.sf.ehcache.Cache;
import net.sf.ehcache.Element;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import td.enterprise.framework.commons.plugin.line.Line;
import td.enterprise.framework.commons.util.Utils;
import td.enterprise.framework.plugin.changer.atomic.impl.SpringDaoChanger;
import td.enterprise.wanalytics.common.Constants;
import td.enterprise.wanalytics.processor.bean.Project;
import td.enterprise.wanalytics.processor.cache.CacheFactory;

import java.util.ArrayList;
import java.util.List;

/**
 * 店组计算逻辑，把需要计算的店组进行实时计算
 */
public class ProjectGroupCubeDataUtils {

    public static final Logger logger = LoggerFactory.getLogger(ProjectGroupCubeDataUtils.class);

    /**
     * 需要计算店组缓存
     */
    private static Cache projectGroupComputeCache = CacheFactory.getProjectGroupComputeCache();

    /**
     * 项目
     */
    private static Cache projectCahce = CacheFactory.getProjectCache();

    /**
     * 返回配置店组信息，要进行实时计算
     * @param line
     * @return
     */
    public static List<Line> getGroupDataList(Line line){
        List<Line> list = new ArrayList<Line>();
        list.add(line);//第一条信息
        int projectId = line.getIntValue(LineKeyConstants.projectid);
        List<Integer> groupList= getGroupList(projectId);
        if(null != groupList && ! groupList.isEmpty()){
           for(Integer groupId : groupList){
               Line groupLine = new Line ();
               Long groupIdLong = Long.parseLong(groupId + "");
               groupLine.put(LineKeyConstants.projectid, groupIdLong);//

               Element projectElement = projectCahce.get(groupIdLong);
               //设置店组配置信息
               Project project = null;
               if (Utils.isNotEmpty(projectElement)) {
                   project = (Project) projectElement.getObjectValue();
               } else {
                   projectElement = CacheFactory.createProjectCache(SpringDaoChanger.dao, projectCahce, groupIdLong);
                   if (Utils.isNotEmpty(projectElement)){
                       project = (Project) projectElement.getObjectValue();
                   }
               }

               if (project == null) {
                   logger.error("项目ID" + projectId + " 店组Id:" + groupId + " 店组没找到！");
                   continue;
               }

               if(project.getStatus() == null  || Constants.VALID != project.getStatus()){
                   logger.error("项目ID" + projectId + " 店组Id:" + groupId + " 店组不是正常状态！");
                   continue;
               }

               //开始设置店组属性
               groupLine.put(LineKeyConstants.projecttype, project.getProjectType());
               groupLine.put(LineKeyConstants.openingtime, project.getOpeningTime());
               groupLine.put(LineKeyConstants.closingtime, project.getClosingTime());
               groupLine.put(LineKeyConstants.projectname, project.getProjectName());
               //logger.info("----------------项目有效时间是：" + project.getVisitMinutes() + " projectId=" + project.getId());
               //logger.info("----------------项目停留时间是：" + project.getStayMinutes() + " projectId=" +  project.getId());
               groupLine.put(LineKeyConstants.maxDuration, project.getMaxDuration());
               groupLine.put(LineKeyConstants.visitMinutes, project.getVisitMinutes());
               groupLine.put(LineKeyConstants.stayMinutes, project.getStayMinutes());
               groupLine.put(LineKeyConstants.filterOpeningtime, project.getFilterOpeningTime());
               groupLine.put(LineKeyConstants.filterClosingtime, project.getFilterClosingTime());
               groupLine.put(LineKeyConstants.sessionTimeoutSeconds,project.getSessionTimeoutSeconds());
               groupLine.put(LineKeyConstants.tsreceive, line.get(LineKeyConstants.tsreceive));
               groupLine.put(LineKeyConstants.tenantid, line.get(LineKeyConstants.tenantid));
               groupLine.put(LineKeyConstants.apmac, line.get(LineKeyConstants.apmac));
               groupLine.put(LineKeyConstants.num, line.get(LineKeyConstants.num));
               groupLine.put(LineKeyConstants.tssend, line.get(LineKeyConstants.tssend));
               groupLine.put(LineKeyConstants.rssi, line.get(LineKeyConstants.rssi));
               groupLine.put(LineKeyConstants.mac,line.get(LineKeyConstants.mac));
               groupLine.put(LineKeyConstants.projectplaceid, line.get(LineKeyConstants.projectplaceid));
               groupLine.put(LineKeyConstants.sensorid, line.get(LineKeyConstants.sensorid));
               list.add(groupLine);
           }
        }
        return list;
    }

    /**
     * 需要计算的店组列表
     * @param projectId
     * @return
     */
    public static synchronized List<Integer> getGroupList(int projectId){
        Element groupListElement = projectGroupComputeCache.get(projectId + "");
        List<Integer> groupList = new ArrayList<>();
        if (Utils.isNotEmpty(groupListElement)) {
            groupList = (List<Integer>) groupListElement.getObjectValue();
        }else {
            groupListElement = CacheFactory.createProjectGroupComputeCache(SpringDaoChanger.dao, projectGroupComputeCache, projectId);
            if (Utils.isNotEmpty(groupListElement)){
                groupList = (List<Integer>) groupListElement.getObjectValue();
            }
        }
        return groupList;
    }

}
