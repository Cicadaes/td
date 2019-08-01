package td.enterprise.service;

import com.tendcloud.enterprise.um.umic.entity.User;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import td.enterprise.common.azkaban.AzkabanRestUtil;
import td.enterprise.common.constant.ReportConstants;
import td.enterprise.common.exception.BusinessException;
import td.enterprise.dao.CompeteSourceDao;
import td.enterprise.entity.CompeteAttribute;
import td.enterprise.entity.CompeteSource;
import td.enterprise.entity.ProjectAttachment;
import td.enterprise.page.CompeteAttributePage;
import td.enterprise.page.CompeteSourcePage;
import td.enterprise.web.util.UserInfoUtil;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * <br>
 * <b>功能：</b>竞品数据源表 CompeteSourceService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-07-20 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("competeSourceService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class CompeteSourceService extends BaseService <CompeteSource> {
    public final static Logger logger = Logger.getLogger(CompeteSourceService.class);

    @Autowired
    private CompeteSourceDao dao;

    @Autowired
    private ProjectAttachmentService attachmentService;

    @Autowired
    private CompeteSourceService competeSourceService;

    @Inject
    private AzkabanRestUtil azkabanRestUtil;

    @Autowired
    private CompeteAttributeService competeAttributeService;

    public CompeteSourceDao getDao() {
        return dao;
    }

    public CompeteSource create(CompeteSource competeSource) {
        User user = UserInfoUtil.getUser();
        competeSource.setTenantId(UserInfoUtil.getCurrentUserTenantId());
        competeSource.setCreateBy(user.getUmid());
        competeSource.setCreator(user.getName());
        dao.insert(competeSource);
        return competeSource;
    }

    public CompeteSource update(CompeteSource competeSource) {
        User user = UserInfoUtil.getUser();
        competeSource.setUpdater(user.getUmid());
        competeSource.setUpdateBy(user.getName());
        dao.updateByPrimaryKey(competeSource);
        return competeSource;
    }

    /**
     * 竞品数据源导入
     *
     * @param file
     * @param competeId
     * @param fileType
     * @return
     * @throws Exception
     */
    public List <String> batchImport(MultipartFile file, String competeId, int fileType) throws Exception {
        List <String> errorMsg = new ArrayList <String>();

        if (file != null) {
            logger.info("competeSource.batchImport.file=" + file.getOriginalFilename() + " ,size=" + file.getSize() + " ,fileType=" + fileType);

            try {
                // 保存文件
                User user = UserInfoUtil.getUser();
                ProjectAttachment attachment = attachmentService.addProjectAttachment(user.getUmid(), competeId, UserInfoUtil.getCurrentUserTenantId(), file, fileType);

                // 保存上传记录
                CompeteSource competeSource = new CompeteSource();
                if (fileType == 3) {
                    competeSource.setDataSource("wifi来来");
                } else if (fileType == 4) {
                    competeSource.setDataSource("数据上传");
                }
                competeSource.setTenantId(UserInfoUtil.getCurrentUserTenantId());
                competeSource.setProjectId(Integer.parseInt(competeId));
                competeSource.setStatus(ReportConstants.DefaultStatus.AVALIABLE);
                competeSource.setAttachmentId(attachment.getId()+"");
                competeSourceService.create(competeSource);

                //TODO 先查一次，有更新，没有新增
                CompeteAttributePage competeAttributePage = new CompeteAttributePage();
                competeAttributePage.setCompeteId(Integer.parseInt(competeId));
                competeAttributePage.setStatus(ReportConstants.DefaultStatus.AVALIABLE);
                CompeteAttribute competeAttribute = competeAttributeService.queryBySingle(competeAttributePage);
                if (null == competeAttribute){
                    CompeteAttribute competeAttribute1 = new CompeteAttribute();
                    competeAttribute1.setCompeteId(Integer.parseInt(competeId));
                    competeAttribute1.setStatus(ReportConstants.DefaultStatus.AVALIABLE);
                    competeAttribute1.setDataSources(competeSource.getDataSource());
                    competeAttributeService.create(competeAttribute1);
                }else {
                    if (null != competeAttribute.getDataSources()&& !competeAttribute.getDataSources().contains(competeSource.getDataSource())){
                        competeAttribute.setDataSources(competeAttribute.getDataSources()+ReportConstants.Punctuation.SEMICOLON+competeSource.getDataSource());
                        competeAttributeService.update(competeAttribute);
                    }
                }

                // 调用azkaban接口，启动任务
                if (attachment != null && attachment != null) {
                    logger.info("调用azkaban接口，启动任务");
                    Map <String, Object> paramMap = new HashMap <>();
                    paramMap.put("attachId", attachment.getId());
                    paramMap.put("projectId", competeId);
                    azkabanRestUtil.callAzkabanRestAPI(paramMap, "LoadProjectDataFromDB", "LoadProjectDataFromDB");
                } else {
                    throw new BusinessException("调用azkaban接口异常");
                }
            } catch (Exception e) {
                throw new BusinessException("竞品数据源导入异常", e);
            }
        } else {
            errorMsg.add("附件为空！");
        }
        return errorMsg;
    }

    public String queryDataSources(CompeteSourcePage sourcePage) {
        return dao.queryDataSources(sourcePage);
    }

    public int updateById(CompeteSource competeSource) {
       return dao.updateById(competeSource);
    }
}
