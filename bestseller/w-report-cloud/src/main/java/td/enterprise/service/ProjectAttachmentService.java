package td.enterprise.service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import td.enterprise.common.constant.ReportConstants;
import td.enterprise.common.exception.BusinessException;
import td.enterprise.common.util.DateUtil;
import td.enterprise.dao.ProjectAttachmentDao;
import td.enterprise.entity.ProjectAttachment;
import td.enterprise.page.ProjectAttachmentPage;
import td.enterprise.service.manager.ParamService;

/**
 * <br>
 * <b>功能：</b>附件 AttachmentService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-14 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co.,
 * Ltd.<br>
 */
@Service("projectAttachmentService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class ProjectAttachmentService extends BaseService<ProjectAttachment> {
    public final static Logger logger = Logger
            .getLogger(ProjectAttachmentService.class);

    @Autowired
    private ProjectAttachmentDao dao;

    @Autowired
    private ParamService paramService;

    public ProjectAttachmentDao getDao() {
        return dao;
    }

    public ProjectAttachment addProjectAttachment(String umid, String projectId, String tenantId, MultipartFile file, int type) throws BusinessException {
        try {
            ProjectAttachment t = new ProjectAttachment();

            String fileName = "";
            if (type == 0) {
                fileName = "黑名单导入_" + DateUtil.format(new Date(), "yyyyMMddHHmmssSSS");
            } else if (type == 3){//WIFI来来
                SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmssSSS");
                fileName = "WIFI来来导入EXCEL_" + file.getOriginalFilename() + "_" + formatter.format(new Date());
            } else if (type == 4) {//MAC数据上传
                SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmssSSS");
                fileName = "竞品数据上传导入EXCEL_" + file.getOriginalFilename() + "_" + formatter.format(new Date());
            } else if (type == 5) {//店员名单
            	fileName = "店员名单导入_" + file.getOriginalFilename() + "_" + DateUtil.format(new Date(), "yyyyMMddHHmmssSSS");
            }
            t.setType(type);

            //文件保存至本地
            uploadFile(file, fileName);

            t.setCreateBy(umid);
            t.setCreator(umid);
            t.setName(fileName);
            String attachmentPath = paramService.queryByParamKey("share.attachment.path").getParamValue();
            // attachmentPath = "/tmp/tmp";
            t.setAttr4(attachmentPath + "/" + fileName);
            t.setTenantId(String.valueOf(tenantId));
            t.setStatus(ReportConstants.ProjectAttachmentStatus.NO_CALC);  //未计算
            t.setAttr2(projectId);  //项目ID，Projectid
            dao.insert(t);
            return t;
        } catch (Exception e) {
            throw new BusinessException("创建ProjectAttachment记录失败", e);
        }
    }
    
    public List<ProjectAttachment> addMultiProjectAttachment(String umid, String projectId, String tenantId, MultipartFile file, int type) throws BusinessException {
        try {
        	List<ProjectAttachment> list = new ArrayList<>();
            String fileName = "";
            if (type == 0) {
                fileName = "黑名单导入_" + DateUtil.format(new Date(), "yyyyMMddHHmmssSSS") + "_" + file.getOriginalFilename();
//                fileName = file.getOriginalFilename();
            } else if (type == 3){//WIFI来来
                SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmssSSS");
                fileName = "WIFI来来导入EXCEL_" + file.getOriginalFilename() + "_" + formatter.format(new Date());
            } else if (type == 4) {//MAC数据上传
                SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmssSSS");
                fileName = "竞品数据上传导入EXCEL_" + file.getOriginalFilename() + "_" + formatter.format(new Date());
            } else if (type == 5) {//店员名单
            	fileName = "店员名单导入_" + DateUtil.format(new Date(), "yyyyMMddHHmmssSSS") + "_" + file.getOriginalFilename();
//            	fileName = file.getOriginalFilename();
            }
            
            //文件保存至本地
            uploadFile(file, fileName);
            String[] projectIds = projectId.split(",");
            if (projectIds != null && projectIds.length > 0) {
            	for (int i = 0; i < projectIds.length; i++) {
            		ProjectAttachment t = new ProjectAttachment();
                    t.setType(type);
                    t.setCreateBy(umid);
                    t.setCreator(umid);
                    t.setName(fileName);
                    String attachmentPath = paramService.queryByParamKey("share.attachment.path").getParamValue();
                    // attachmentPath = "/tmp/tmp";
                    t.setAttr4(attachmentPath + "/" + fileName);
                    t.setTenantId(String.valueOf(tenantId));
                    t.setStatus(ReportConstants.ProjectAttachmentStatus.NO_CALC);  //未计算
                    t.setAttr2(projectIds[i]);  //项目ID，Projectid
                    t.setAttr1(file.getOriginalFilename());
                    dao.insert(t);
                    list.add(t);
				}
            }
            return list;
        } catch (Exception e) {
            throw new BusinessException("创建ProjectAttachment记录失败", e);
        }
    }

    public ProjectAttachment getLastByProjectIdAndType(ProjectAttachmentPage page) {
        return dao.getLastByProjectIdAndType(page);
    }

    public void uploadFile(MultipartFile file, String fileName) throws Exception {
        // 参数列表
        Map<String, Object> map = new HashMap<>();
        map.put("file", file);
        savePic(file.getInputStream(), fileName);
    }

    private void savePic(InputStream inputStream, String fileName) {
        OutputStream os = null;
        try {
            byte[] bs = new byte[10240];
            int len;

            String attachmentPath = paramService.queryByParamKey("share.attachment.path").getParamValue();
            // attachmentPath = "/tmp/tmp";
            File tempFile = new File(attachmentPath);
            if (!tempFile.exists()) {
                tempFile.mkdirs();
            }
            os = new FileOutputStream(tempFile.getAbsolutePath() + "/" + fileName);
            while ((len = inputStream.read(bs)) != -1) {
                os.write(bs, 0, len);
            }
        } catch (IOException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                if (null != os)
                os.close();
                inputStream.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
