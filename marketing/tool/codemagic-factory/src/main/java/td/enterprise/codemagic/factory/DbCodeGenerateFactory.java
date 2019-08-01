package td.enterprise.codemagic.factory;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.*;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.velocity.VelocityContext;

import td.enterprise.codemagic.factory.bean.ColumnData;
import td.enterprise.codemagic.factory.bean.DbCreateBean;
import static td.enterprise.codemagic.factory.def.CodeResourceUtil.*;

public class DbCodeGenerateFactory {

    private static final Log log = LogFactory.getLog(DbCodeGenerateFactory.class);
    private static String url;
    private static String username;
    private static String passWord;
    private static String buss_package;
    private static String client_buss_package;
    private static String projectPath = getProjectPath();
    private static String workspacePath = getWorkspacePath();

    public DbCodeGenerateFactory() {}

    public static void codeGenerate(String tableName, String entityPackage) {
        codeGenerate(tableName, tableName, entityPackage);
    }

    public static void codeGenerate(String tableName, String codeName, String entityPackage) {
        
        DbCreateBean createBean = new DbCreateBean();
        createBean.setMysqlInfo(url, username, passWord);

        List<ColumnData> columnDatas;
        try {
            columnDatas = createBean.getColumnDatas(tableName);
        } catch (Exception e) {
            e.printStackTrace();
            return;
        }
        List<ColumnData> pkColumnDatas = getPkColumns(columnDatas);
        List<ColumnData> notPkColumnDatas = getNotPkColumns(columnDatas);
        int pkColumnCount = pkColumnDatas.size();

        String formattedTableName = createBean.formateTableName(tableName);
        String className = createBean.formateClassName(tableName);
        String lowerName = (new StringBuilder(String.valueOf(className.substring(0, 1).toLowerCase()))).append(className.substring(1, className.length())).toString();

        String coreProjectPath = workspacePath + "/" + CORE_PROJECT;
        String restProjectPath = workspacePath + "/" + REST_PROJECT;
        String clientProjectPath = workspacePath + "/" + CLIENT_PROJECT;

        String coreProjectSrcPath = coreProjectPath + "/" + source_root_package + "/" + bizPackageUrl;
        String coreProjectResourcesPath = coreProjectPath + "/" + resources_root_package + "/" + bizPackageUrl;
        String restProjectResourcesPath = restProjectPath + "/" + resources_root_package + "/mybatis";
        String restProjectSrcPath = clientProjectPath + "/" + source_root_package + "/" + bizClientPackageUrl;
        // String coreProjectTestPath = coreProjectPath + "/" + test_root_package + "/" +
        // bizPackageUrl;

        String clientProjectWebappPath = clientProjectPath + "/" + web_root_package;

        // String clientProjectWebappJsPath = clientProjectWebappPath + "/js/app";
        // String clientProjectWebappHtmlPath = clientProjectWebappPath + "/html/" + entityPackage;
        String srcPath = (new StringBuilder(String.valueOf(projectPath))).append(source_root_package).append("\\").toString();
        String testPath = (new StringBuilder(String.valueOf(projectPath))).append(test_root_package).append("\\").toString();
        (new StringBuilder(String.valueOf(srcPath))).append(bizPackageUrl).append("\\").toString();
        (new StringBuilder(String.valueOf(testPath))).append(bizPackageUrl).append("\\").toString();
        // String webPath = (new
        // StringBuilder(String.valueOf(projectPath))).append(web_root_package).append("\\view\\").append(bizPackageUrl).append("\\").toString();

        String modelPath = "/page/" + entityPackage + "/" + className + "Page.java";
        String entityPath = "/entity/" + entityPackage + "/" + className + ".java";
        String entityKeyPath = "/entity/" + entityPackage + "/" + className + "Key.java";
        String mapperPath = "/dao/" + entityPackage + "/" + className + "Dao.java";
        String servicePath = "/service/" + entityPackage + "/" + className + "Service.java";
        // String serviceJUnitPath = "/service/" + entityPackage + "/" + className +
        // "ServiceTest.java";
        String controllerPath = "/controller/" + entityPackage + "/" + className + "Controller.java";
        String sqlMapperPath = "/mapper/" + entityPackage + "/" + className + "Mapper.xml";
        String sqlExtMapperPath = "/mapper/" + entityPackage + "/" + className + "ExtMapper.xml";


        // String listWidgetHtmlPath = "/list/" + className + "List.html";
        // String formWidgetHtmlPath = "/form/" + className + "Form.html";
        // String dialogWidgetHtmlPath = "/dialog/" + className + "Dialog.html";
        // String listControllerJsPath = "/controllers/" + entityPackage + "/" + className +
        // "ListController.js";
        // String formControllerJsPath = "/controllers/" + entityPackage + "/" + className +
        // "FormController.js";
        // String serviceJsPath = "/services/" + entityPackage + "/" + className + "Service.js";
        // String stateJsPath = "/states/" + entityPackage + "/" + className + "State.js";

        String modelJsPath = clientProjectWebappPath + "/models/" + entityPackage;
        String modelJsFileName = formattedTableName + ".model.ts";
        String serviceJsPath = clientProjectWebappPath + "/services/" + entityPackage;
        String serviceJsFileName = formattedTableName + ".resource.service.ts";

        // webPath = (new
        // StringBuilder(String.valueOf(webPath))).append(entityPackage).append("\\").toString();

        String listWidgetName = className + "List";
        String formWidgetName = className + "Form";
        String searchbarWidgetName = className + "SearchBar";
        String dialogWidgetName = className + "Dialog";

        String serviceConfigName = lowerName + "Service";
        String formConfigName = lowerName + "Form";
        String searchbarAction = (searchbarWidgetName + "Action").toLowerCase();
        String lowerNames = lowerName + "s";
        if (lowerName.endsWith("y")) {
            lowerNames = lowerName.substring(0, lowerName.length() - 1) + "ies";
        }

        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        String currentDate = format.format(Calendar.getInstance().getTime());

        VelocityContext context = new VelocityContext();
        context.put("className", className);
        context.put("lowerName", lowerName);
        context.put("codeName", codeName);
        context.put("tableName", tableName);
        context.put("bussPackage", buss_package);
        context.put("clientBussPackage", client_buss_package);
        context.put("bizAppPackage", bizAppPackage);
        context.put("entityPackage", entityPackage);
        context.put("entityOpenType", ENTITY_OPEN_TYPE);
        context.put("entitySaveType", ENTITY_SAVE_TYPE);

        context.put("listWidgetName", listWidgetName);
        context.put("formWidgetName", formWidgetName);
        context.put("searchbarWidgetName", searchbarWidgetName);
        context.put("dialogWidgetName", dialogWidgetName);

        context.put("serviceConfigName", serviceConfigName);
        context.put("formConfigName", formConfigName);
        context.put("searchbarAction", searchbarAction);

        context.put("baseClassPackage", BASE_CLASS_PACKAGE);
        context.put("lowerNames", lowerNames);
        context.put("currentDate", currentDate);

        context.put("dl", "$");

        context.put("columnDatas", columnDatas);
        context.put("pkColumnDatas", pkColumnDatas);
        context.put("pkColumnCount", pkColumnCount);
        context.put("notPkColumnDatas", notPkColumnDatas);
        context.put("entityImportClasses", createBean.getEntityImportClasses(columnDatas));

        if (pkColumnCount == 1) {
            context.put("pkColumn", pkColumnDatas.get(0));
        }

        try {
            Map<String, Object> sqlMap = createBean.getAutoCreateSql(tableName);
            context.put("SQL", sqlMap);
        } catch (Exception e) {
            e.printStackTrace();
            return;
        }

        final int flagMapperXml = 1;
        final int flagDao = 2;
        final int flagService = 3;
        final int flagRest = 4;
        final int flagJs = 5;
        // final int flagHtml = 6;

        BitSet flag = new BitSet();
        for (String genType : PAGE_GEN_TYPE.split(",")) {
            flag.set(Integer.parseInt(genType));
        }

        if (flag.get(flagMapperXml)) {
            CommonPageParser.writerPage(context, "java/MapperTemplate.ftl", restProjectResourcesPath, sqlMapperPath);
            CommonPageParser.writerPage(context, "java/MapperExtTemplate.ftl", restProjectResourcesPath, sqlExtMapperPath);
        }
        if (flag.get(flagDao)) {
            if (pkColumnCount > 1) {
                CommonPageParser.writerPage(context, "java/EntityKeyTemplate.ftl", coreProjectSrcPath, entityKeyPath);
                CommonPageParser.writerPage(context, "java/EntityWithKeyTemplate.ftl", coreProjectSrcPath, entityPath);
            } else {
                CommonPageParser.writerPage(context, "java/EntityTemplate.ftl", coreProjectSrcPath, entityPath);
            }
            CommonPageParser.writerPage(context, "java/PageTemplate.ftl", coreProjectSrcPath, modelPath);
            CommonPageParser.writerPage(context, "java/DaoTemplate.ftl", coreProjectSrcPath, mapperPath);
        }
        if (flag.get(flagService)) {
            CommonPageParser.writerPage(context, "java/ServiceTemplate.ftl", coreProjectSrcPath, servicePath);
            // CommonPageParser.writerPage(context, "junit/ServiceJunitTemplate.ftl",
            // coreProjectTestPath, serviceJUnitPath);
        }
        if (flag.get(flagRest)) {
            CommonPageParser.writerPage(context, "java/ControllerTemplate.ftl", restProjectSrcPath, controllerPath);
        }
        if (flag.get(flagJs)) {
            // CommonPageParser.WriterPage(context, "js/controller/ListController.js.ftl",
            // clientProjectWebappJsPath, listControllerJsPath);
            // CommonPageParser.WriterPage(context, "js/controller/FormController.js.ftl",
            // clientProjectWebappJsPath, formControllerJsPath);
            // CommonPageParser.WriterPage(context, "js/service/Service.js.ftl",
            // clientProjectWebappJsPath, serviceJsPath);
            // CommonPageParser.WriterPage(context, "js/state/State.js.ftl",
            // clientProjectWebappJsPath, stateJsPath);
            CommonPageParser.writerPage(context, "angularjs2/Model.ts.ftl", modelJsPath, modelJsFileName);
            CommonPageParser.writerPage(context, "angularjs2/Service.ts.ftl", serviceJsPath, serviceJsFileName);
        }
        // if (flag.get(flagHtml)) {
        // CommonPageParser.WriterPage(context, "html/dialog/Dialog.html.ftl",
        // clientProjectWebappHtmlPath, dialogWidgetHtmlPath);
        // CommonPageParser.WriterPage(context, "html/form/Form.html.ftl",
        // clientProjectWebappHtmlPath, formWidgetHtmlPath);
        // CommonPageParser.WriterPage(context, "html/list/List.html.ftl",
        // clientProjectWebappHtmlPath, listWidgetHtmlPath);
        // }
        log.info("----------------------------代码生成完毕---------------------------");
    }

    private static List<ColumnData> getPkColumns(List<ColumnData> columnDatas) {
        List<ColumnData> pks = new ArrayList<>();
        for (ColumnData columnData : columnDatas) {
            if ("PRI".equals(columnData.getColumnKey())) {
                pks.add(columnData);
            }
        }
        return pks;
    }

    private static List<ColumnData> getNotPkColumns(List<ColumnData> columnDatas) {
        List<ColumnData> pks = new ArrayList<>();
        for (ColumnData columnData : columnDatas) {
            if (!"PRI".equals(columnData.getColumnKey())) {
                pks.add(columnData);
            }
        }
        return pks;
    }

    public static String getProjectPath() {
        String path = (new StringBuilder(String.valueOf(System.getProperty("user.dir").replace("\\", "/")))).append("/").toString();
        return path;
    }

    public static String getWorkspacePath() {
        String projectPath = getProjectPath();
        File file = new File(projectPath);
        return file.getParent();
    }

    static {
        url = URL;
        username = USERNAME;
        passWord = PASSWORD;
        buss_package = bizPackage;
        client_buss_package = bizClientPackage;
    }

    public static void main(String[] args) {
/*        DbCodeGenerateFactory.codeGenerate("TD_DC_CHART", "report");
        DbCodeGenerateFactory.codeGenerate("TD_DC_REPORT", "report");*/
//        DbCodeGenerateFactory.codeGenerate("TD_MKT_CROWD", "campaign");
//        DbCodeGenerateFactory.codeGenerate("TD_MKT_DATA_DOWNLOAD", "campaign");
//        DbCodeGenerateFactory.codeGenerate("TD_MKT_SEGMENT_TASK_CALC_OBJECT_RECORD", "campaign");

        //DbCodeGenerateFactory.codeGenerate("TD_MKT_SEGMENT", "campaign");
        DbCodeGenerateFactory.codeGenerate("TD_MKT_SEGMENT_TASK_CALC_OBJECT_RECORD", "campaign");

    }
}
