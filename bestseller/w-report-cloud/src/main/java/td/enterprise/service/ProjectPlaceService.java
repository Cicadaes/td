package td.enterprise.service;

import com.tendcloud.enterprise.um.umic.entity.User;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.multipart.MultipartFile;
import td.enterprise.common.constant.ReportConstants;
import td.enterprise.common.exception.BusinessException;
import td.enterprise.dao.ProjectPlaceDao;
import td.enterprise.entity.ProjectPlace;
import td.enterprise.page.ProjectPlacePage;
import td.enterprise.page.mapper.ProjectPlaceMapper;
import td.enterprise.web.util.UserInfoUtil;

import javax.inject.Inject;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * <br>
 * <b>功能：</b>项目区域 ProjectPlaceService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-14 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("projectPlaceService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class ProjectPlaceService extends BaseService<ProjectPlace> {
    public final static Logger logger = Logger.getLogger(ProjectPlaceService.class);

    @Autowired
    private ProjectPlaceDao dao;
    //	@Autowired
//	private ProjectDiagramDao projectDiagramDao;
//	@Autowired
//	private ProjectDiagramService diagramService;
//     @Autowired
//     private installInfoService infoService;

    @Inject
    private ProjectPlaceMapper projectPlaceMapper;

    public ProjectPlaceDao getDao() {
        return dao;
    }

    /**
     * 判断场地名称是否存在
     *
     * @param placeName
     * @param projectId
     * @return
     */
    public int isExistByPlaceName(String placeName, String projectId) {
        ProjectPlacePage page = new ProjectPlacePage();
        page.setPlaceName(placeName);
        page.setProjectId(Integer.valueOf(projectId));
        List<ProjectPlace> list = dao.queryByList(page);
        if (list.isEmpty()) {
            return 0;
        } else {
            return list.get(0).getId();
        }
//		int num = dao.queryByCount(page);
//		if(num!=0){
//			return true;
//		}else{
//			return false;
//		}
    }

    /**
     * 支持模糊查询
     *
     * @param page
     * @return
     */
    public List<ProjectPlace> quickSearchByList(ProjectPlacePage page) {
        int rowCount = dao.quickSearchGetCount(page);
        page.getPager().setRowCount(rowCount);
        List<ProjectPlace> list = dao.quickSearchByList(page);
        return list;
    }

    public List<ProjectPlace> selectByProjectId(ProjectPlace projectPlace) {
        List<ProjectPlace> list = dao.selectByProjectId(projectPlace);
        return list;
    }

    /**
     * 更新项目场地
     *
     * @param place
     * @param file
     * @return
     */
    public ProjectPlace updateProjectPlace(ProjectPlace place, MultipartFile file) throws BusinessException {
        try {
            if (file != null) {
//				ProjectDiagram record = null;
//				//没有图纸，新增图纸
//
//				boolean haveDiagram = false;
//				if(place.getDiagramId()!=null && place.getDiagramId()!=0){
//					record = projectDiagramDao.selectByPrimaryKey(place.getDiagramId());
//					if(record!=null){
//						haveDiagram = true;
//					}
//				}
//
//				if(haveDiagram){
//					record.setData(file.getBytes());
//					record.setName(file.getOriginalFilename());
//					projectDiagramDao.updateByPrimaryKeySelective(record);
//					diagramService.updateProjectPlaceDiagram(record);
//					place.setDiagramName(record.getName());
//				}else{
//					record = new ProjectDiagram();
//					record.setCreator(place.getCreator());
//					record.setData(file.getBytes());
//					record.setPlaceId(place.getId());
//					record.setProjectId(place.getProjectId());
//					record.setName(file.getOriginalFilename());
//					record.setStatus(ReportConstants.ProjectDiagramStatus.AVALIABLE);
//					record.setType(ReportConstants.ProjectDiagramType.PROJECT_PLACE);
//					projectDiagramDao.insert(record);
//
//					place.setDiagramId(record.getId());
//					place.setDiagramName(record.getName());
//				}

                //更新redis缓存
                //TODO 删除
//				String mark = "-"+RedisCacheConstants.PRE_FIX+"-"+RedisCacheConstants.PROJECT_DIAGRAM+"-"+place.getId();
//				String mappingKey = String.valueOf(place.getDiagramId());
//				String value = Base64.encodeBase64String(file.getBytes());
//				redisTemplate.set(mappingKey, mark, value);

            }
            //更新探针安装信息中场地信息以及场地上房间数据中场地信息
            // InstallInfoPage page = new InstallInfoPage();
            // page.setProjectId(place.getProjectId());
            // page.setProjectPlaceId(place.getId());
            // page.setStatus(ReportConstants.DefaultStatus.AVALIABLE);
            // page.setPageEnabled(false);
            // List<InstallInfo> infoList = infoService.queryByList(page);
            // for (InstallInfo info : infoList) {
            //     //更新安装信息中场地名称
            //     info.setProjectPlaceName(place.getPlaceName());
            //     infoService.updateByPrimaryKeySelective(info);
            // }

            dao.updateByPrimaryKeySelective(place);
        } catch (Exception e) {
            throw new BusinessException("更新场地信息异常", e);
        }
        return place;
    }

    /**
     * 创建场地，不带图片
     *
     * @param projectPlace
     * @param umid
     */
    public ProjectPlace createProjectPlaceWithoutFile(ProjectPlace projectPlace, String umid, String tenantId) throws BusinessException {
        ProjectPlacePage ppg = new ProjectPlacePage();
        ppg.setPlaceName(projectPlace.getPlaceName());
        ppg.setProjectId(projectPlace.getProjectId());
        ppg.setStatus(ReportConstants.ProjectPlaceStatus.AVALIABLE);
        List<ProjectPlace> list = dao.queryByList(ppg);
        if (!list.isEmpty()) {
            return null;
        } else {
            try {
                projectPlace.setCreateBy(umid);
                projectPlace.setCreator(umid);
                projectPlace.setTenantId(tenantId);
                projectPlace.setStatus(ReportConstants.ProjectPlaceStatus.AVALIABLE);
                dao.insert(projectPlace);

                //更新 排序字段
                projectPlace.setOrderNumber(projectPlace.getId());
                dao.updateByPrimaryKeySelective(projectPlace);
                return projectPlace;
            } catch (Exception e) {
                throw new BusinessException("添加场地操作异常", e);
            }
        }
    }

    /**
     * 更新排序序号
     *
     * @param ids
     * @return
     */
    public Map<String, Object> updateOrderNumber(@RequestBody String[] ids) {
        ProjectPlace place = null;
        String id = "";
        String orderNumber = "";
        String value = "";
        Map<String, Object> map = new HashMap<>();
        for (int i = 0; i < ids.length; i++) {
            value = ids[i];
            id = value.split(",")[0];
            orderNumber = value.split(",")[1];
            try {
                place = dao.selectByPrimaryKey(id);
                if (place != null && null != orderNumber) {
                    place.setOrderNumber(Integer.valueOf(orderNumber));
                    int result = dao.updateByPrimaryKeySelective(place);
                    map.put(id, "success");
                }
            } catch (Exception e) {
                e.printStackTrace();
                map.put(id, "fail");

            }
        }
        return map;
    }

    /**
     * 创建项目场地
     *
     * @param page
     * @return
     * @throws Exception
     */
    public ProjectPlace create(ProjectPlacePage page) throws Exception {
        ProjectPlacePage ppg = new ProjectPlacePage();
        ppg.setPlaceName(page.getPlaceName());
        ppg.setProjectId(page.getProjectId());
        List<ProjectPlace> list = dao.queryByList(ppg);
        if (list.isEmpty()) {
            return null;
        } else {
            User user = UserInfoUtil.getUser();
            page.setTenantId(UserInfoUtil.getCurrentUserTenantId());
            page.setStatus(ReportConstants.ProjectPlaceStatus.AVALIABLE);
            ProjectPlace projectPlace = projectPlaceMapper.projectPlacePageToProjectPlace(page);
            projectPlace.setCreateBy(user.getUmid());
            projectPlace.setCreator(user.getUmid());
            createProjectPlace(projectPlace, page.getFile());
            return projectPlace;
        }
    }

    /**
     *
     */

    /**
     * 创建项目场地
     *
     * @param projectPlace
     * @param file
     */
    private void createProjectPlace(ProjectPlace projectPlace, MultipartFile file) throws BusinessException {
        try {
            dao.insert(projectPlace);
//			ProjectDiagram projectDiagram = new ProjectDiagram();
//			if(file!=null){
//				projectDiagram.setTenantId(projectPlace.getTenantId());
//				projectDiagram.setCreator(projectPlace.getCreator());
//				projectDiagram.setData(file.getBytes());
//				projectDiagram.setProjectId(projectPlace.getProjectId());
//				projectDiagram.setPlaceId(projectPlace.getId());
//				projectDiagram.setName(file.getOriginalFilename());
//				projectDiagram.setType(ReportConstants.ProjectDiagramType.PROJECT_PLACE);
//				projectDiagram.setStatus(ReportConstants.ProjectDiagramStatus.AVALIABLE);
//				projectDiagramDao.insert(projectDiagram);
//			}
//			projectPlace.setDiagramId(projectDiagram.getId());
//			projectPlace.setDiagramName(projectDiagram.getName());
            //set排序字段
            projectPlace.setOrderNumber(projectPlace.getId());
            dao.updateByPrimaryKeySelective(projectPlace);
        } catch (Exception e) {
            e.printStackTrace();
            throw new BusinessException(e);
        }
    }

    /**
     * 更新项目场地
     *
     * @param page
     * @return
     * @throws Exception
     */
    public ProjectPlace update(ProjectPlacePage page) throws Exception {
        ProjectPlace projectPlace = dao.selectByPrimaryKey(page.getProjectPalceId());
        projectPlace.setPlaceName(page.getPlaceName());
        projectPlace.setDescription(page.getDescription());
        updateProjectPlace(projectPlace, page.getFile());
        return projectPlace;
    }

    /**
     * @param projectPlaceId
     * @return
     * @throws Exception
     */
    public void delete(String projectPlaceId) throws Exception {
        ProjectPlace place = dao.selectByPrimaryKey(projectPlaceId);
//    	if(place!=null){
//    		place.setStatus(ReportConstants.ProjectPlaceStatus.NO_AVALIABLE);
//
//    		//更新探针安装信息
//        	SensorInstallInfoPage page = new SensorInstallInfoPage();
////        	page.setRoomId(place.getId());
//        	page.setProjectId(place.getProjectId());
//        	List<SensorInstallInfo> list = sensorInstallInfoService.queryByList(page);
//        	for(SensorInstallInfo t:list){
//        		t.setStatus(ReportConstants.SensorInstallInfoStatus.DELETE);
//        		sensorInstallInfoService.updateByPrimaryKeySelective(t);
//        	}
//
//        	//更新场地图纸状态
//        	ProjectDiagramPage diagramPage = new ProjectDiagramPage();
//        	diagramPage.setPlaceId(place.getId());
//        	diagramPage.setProjectId(place.getProjectId());
//        	diagramPage.setStatus(ReportConstants.ProjectDiagramStatus.AVALIABLE);
//        	List<ProjectDiagram> diagramList = projectDiagramService.queryByList(diagramPage);
//        	for(ProjectDiagram diagram : diagramList){
//        		diagram.setStatus(ReportConstants.ProjectDiagramStatus.NO_AVALIABLE);
//        		projectDiagramService.updateByPrimaryKeySelective(diagram);
//        	}
//    	}
        if (place != null) {
            place.setStatus(ReportConstants.ProjectPlaceStatus.NO_AVALIABLE);
            dao.updateByPrimaryKeySelective(place);
        }
//        projectPlaceService.deleteByPrimaryKey(projectPlaceId);
    }
}
