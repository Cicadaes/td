package td.enterprise.codemagic.factory;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStreamWriter;
import java.util.Properties;

import org.apache.commons.io.FileUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.velocity.Template;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.VelocityEngine;

public class CommonPageParser {

    private static VelocityEngine ve;
    private static final Log log;
    /**
     * 生成文件的模板名
     *   MAPPER_EXT_TEMPLATE_NAME: mapper扩展文件
     *   DAO_TEMPLATE_NAM: dao
     *   SERVICE_TEMPLATE_NAME: service
     *   CONTROLLER_TEMPLATE_NAME: controller
     */
    private static final String MAPPER_EXT_TEMPLATE_NAME = "MapperExtTemplate.ftl";
    private static final String DAO_TEMPLATE_NAM = "DaoTemplate.ftl";
    private static final String SERVICE_TEMPLATE_NAME = "ServiceTemplate.ftl";
    private static final String CONTROLLER_TEMPLATE_NAME = "ControllerTemplate.ftl";

    public static void writerPage(VelocityContext context, String templateName, String fileDirPath,
            String targetFile) {
        try {
            File dir = new File(fileDirPath);
            File file = new File(dir, targetFile);
            FileUtils.forceMkdir(file.getParentFile());
            if (file.exists()) {
                if (isReplace(templateName)) {
                    log.info("替换文件:" + file.getAbsolutePath());
                } else {
                    return;
                }
            }
            Template template = ve.getTemplate(templateName, "UTF-8");
            try (FileOutputStream fos = new FileOutputStream(file);
                    BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(fos, "UTF-8"))) {
                template.merge(context, writer);
                log.info("生成文件：" + file.getAbsolutePath());
            }
        } catch (Exception e) {
            log.error(e);
        }
    }

    /**
     * 判断生成的类型文件是否需要替换
     * @param templateName
     * @return
     */
    private static boolean isReplace(String templateName) {
        if (templateName.contains(MAPPER_EXT_TEMPLATE_NAME) || templateName.contains(DAO_TEMPLATE_NAM)
            || templateName.contains(SERVICE_TEMPLATE_NAME) || templateName.contains(CONTROLLER_TEMPLATE_NAME)) {
            return false;
        }
        return true;
    }

    static {
        log = LogFactory.getLog(CommonPageParser.class);
        String templateBasePath = DbCodeGenerateFactory.getProjectPath() + "src/main/resources/templates";
        Properties properties = new Properties();
        properties.setProperty("resource.loader", "file");
        properties.setProperty("file.resource.loader.description", "Velocity File Resource Loader");
        properties.setProperty("file.resource.loader.path", templateBasePath);
        properties.setProperty("file.resource.loader.cache", "true");
        properties.setProperty("file.resource.loader.modificationCheckInterval", "30");
        properties.setProperty("runtime.log.logsystem.class", "org.apache.velocity.runtime.log.Log4JLogChute");
        properties.setProperty("runtime.log.logsystem.log4j.logger", "org.apache.velocity");
        properties.setProperty("directive.set.null.allowed", "true");
        VelocityEngine velocityEngine = new VelocityEngine();
        velocityEngine.init(properties);
        ve = velocityEngine;
    }
}
