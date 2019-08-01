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

    public static void writerPage(VelocityContext context, String templateName, String fileDirPath,
            String targetFile) {
        try {
            File dir = new File(fileDirPath);
            File file = new File(dir, targetFile);
            FileUtils.forceMkdir(file.getParentFile());
            if (file.exists()) {
                log.info("替换文件:" + file.getAbsolutePath());
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
