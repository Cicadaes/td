package com.talkingdata.marketing.web.controller.campaign;

import com.talkingdata.enterprise.base.web.BaseController;
import com.talkingdata.marketing.core.entity.campaign.Attachment;
import com.talkingdata.marketing.core.exception.MktException;
import com.talkingdata.marketing.core.middleware.ConfigApi;
import com.talkingdata.marketing.core.service.campaign.AttachmentService;
import com.talkingdata.marketing.core.util.AssignmentUtil;
import com.talkingdata.marketing.core.util.DateUtil;
import io.swagger.models.auth.In;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static com.talkingdata.marketing.core.constant.ParamConstants.MARKETING_ATTACHMENT_PATH;
import static com.talkingdata.marketing.core.constant.ParamConstants.SYSTEM_CODE;

/**
 * @author armeng
 * @date 2018/01/08
 */
@Controller
@RequestMapping("/file")
public class FileController extends BaseController {

    private static Logger logger = LoggerFactory.getLogger(FileController.class);
    private final String DAYDIRFORMAT = "yyyyMMdd";
    @Autowired
    ConfigApi configApi;
    @Autowired
    AttachmentService attachmentService;

    private static Map<String, Integer> attachmentTypeMap = new HashMap<>(4);

    static {
        attachmentTypeMap.put("accurate",1);
        attachmentTypeMap.put("equity",2);
        attachmentTypeMap.put("blacklist",3);
        attachmentTypeMap.put("segment",4);
    }

    @RequestMapping(value = "/upload", method = RequestMethod.POST)
    @ResponseBody
    public Object fileupload(HttpServletRequest request, @RequestParam MultipartFile uploadFiles, @RequestParam(required = false) String type)
            throws MktException {
        logger.info("文件上传,type={},uploadFiles.name={}", type, uploadFiles.getOriginalFilename());

        if (StringUtils.isBlank(type)) {
            //默认是segment的,其他可选值有 一方人群(accurate),权益表(equity),短信黑名单(blacklist);
            type = "segment";
        }
        //获取配置文件,得到临时文件保存目录.
        String tempDir = "../attachments";
        String configPath = configApi.getParam(MARKETING_ATTACHMENT_PATH, SYSTEM_CODE);
        if (StringUtils.isNotBlank(configPath)) {
            tempDir = configPath;
        }
        //保存文件,路径是日期/类型/uuid/文件
        String uuid = UUID.randomUUID().toString().replaceAll("-", "");
        String targetPath =
                tempDir + File.separator + DateUtil.formatDateTime(new Date(), DAYDIRFORMAT) + File.separator + type + File.separator + uuid;

        try {
            targetPath = targetPath + "." + StringUtils.substringAfterLast(uploadFiles.getOriginalFilename(), ".");
            logger.info("文件上传保存路径为{}", targetPath);
            File localFile = new File(targetPath);
            if (!localFile.getParentFile().exists()) {
                localFile.getParentFile().mkdirs();
            }
            try (InputStream in = uploadFiles.getInputStream(); OutputStream out = new FileOutputStream(localFile)) {
                IOUtils.copy(in, out);
            }

            Attachment attachment = new Attachment();
            attachment.setName(uploadFiles.getOriginalFilename());
            attachment.setType(getFileType(type));
            attachment.setPath(targetPath);
            AssignmentUtil.setInfo(attachment, request);
            attachmentService.insert(attachment);

            Map<String, Object> result = new HashMap<>(1);
            result.put("uploadUUID", attachment.getId());
            logger.info("文件上传成功,uploadUUID={}", attachment.getId());
            return result;
        } catch (Exception e) {
            logger.error("文件上传出错", e);
            throw new MktException("文件上传出错");
        }

    }

    /**
     * '1 人群使用 2 权益使用 3 黑名单  4 投放使用',
     *
     * @param type
     * @return
     */
    private Integer getFileType(String type) {
        Integer attachmentType = attachmentTypeMap.get(type);
        if(null == attachmentType){
            attachmentType = 4;
        }
        return attachmentType;
    }

}
