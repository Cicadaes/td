package td.enterprise.codemagic.factory;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.velocity.VelocityContext;

import td.enterprise.codemagic.factory.bean.ColumnData;
import td.enterprise.codemagic.factory.bean.LdapCreateBean;
import td.enterprise.codemagic.factory.def.CodeResourceUtil;
import td.enterprise.codemagic.factory.def.FtlDef;

public class LdapCodeGenerateFactory {

    private static final Log log = LogFactory.getLog(LdapCodeGenerateFactory.class);
    private static String url;
    private static String username;
    private static String passWord;
    private static String buss_package;
    private static String schemaCn;
    private static String projectPath = getProjectPath();

    public LdapCodeGenerateFactory() {
    }

    public static void codeGenerate(String tableName, String codeName, String entityPackage, String objectEntry) {
        codeGenerate(tableName, codeName, entityPackage, FtlDef.KEY_TYPE_02, objectEntry);
    }

    public static void codeGenerate(String tableName, String codeName, String entityPackage, String keyType, String objectEntry) {
        LdapCreateBean createBean = new LdapCreateBean();
        createBean.setLdapInfo(url, username, passWord, schemaCn);
        String className = createBean.formateClassName(tableName);
        String lowerName = (new StringBuilder(String.valueOf(className.substring(0, 1).toLowerCase()))).append(
                className.substring(1, className.length())).toString();
        String srcPath = (new StringBuilder(String.valueOf(projectPath))).append(CodeResourceUtil.source_root_package).append("\\").toString();
//        String testPath = (new StringBuilder(String.valueOf(projectPath))).append(CodeResourceUtil.test_root_package).append("\\").toString();
        String pckPath = (new StringBuilder(String.valueOf(srcPath))).append(CodeResourceUtil.bizPackageUrl).append("\\").toString();
//        String testPckPath = (new StringBuilder(String.valueOf(testPath))).append(CodeResourceUtil.bizPackageUrl).append("\\").toString();
//        String webPath = (new StringBuilder(String.valueOf(projectPath))).append(CodeResourceUtil.web_root_package).append("\\view\\")
//                .append(CodeResourceUtil.bizPackageUrl).append("\\").toString();
        String widgetPath = (new StringBuilder(String.valueOf(projectPath))).append(CodeResourceUtil.web_root_package).append("\\js\\app\\")
                .append(CodeResourceUtil.bizAppPackage).append("\\").toString();
        String modelPath = (new StringBuilder("page\\")).append(entityPackage).append("\\").append(className).append("Page.java").toString();
        String beanPath = (new StringBuilder("entity\\")).append(entityPackage).append("\\").append(className).append(".java").toString();
        String mapperPath = (new StringBuilder("dao\\")).append(entityPackage).append("\\").append(className).append("Dao.java").toString();
        String servicePath = (new StringBuilder("service\\")).append(entityPackage).append("\\").append(className).append("Service.java").toString();
//        String serviceJUnitPath = (new StringBuilder("service\\")).append(entityPackage).append("\\").append(className).append("ServiceTest.java")
//                .toString();
        String controllerPath = (new StringBuilder("controller\\")).append(entityPackage).append("\\").append(className).append("Controller.java")
                .toString();
        //        String sqlMapperPath = (new StringBuilder("mapper\\")).append(entityPackage).append("\\").append(className).append("Mapper.xml").toString();
//        webPath = (new StringBuilder(String.valueOf(webPath))).append(entityPackage).append("\\").toString();

        String listPath = widgetPath + entityPackage + "\\";
        String searchbarPath = listPath + "searchbar\\";
        String dialogPath = listPath + "dialog\\";
        String configPath = listPath + "config\\";

        String listWidgetName = lowerName + "List";
        String formWidgetName = lowerName + "Form";
        String searchbarWidgetName = lowerName + "SearchBar";
        String dialogWidgetName = lowerName + "Dialog";
        String serviceConfigName = lowerName + "Service";
        String formConfigName = lowerName + "Form";
        String searchbarAction = (searchbarWidgetName + "Action").toLowerCase();
        String upperPrimaryKey = "BaseName";//createBean.formateName(CodeResourceUtil.JKDCCG_GENERATE_TABLE_ID);
        String primaryKey = upperPrimaryKey.substring(0, 1).toLowerCase() + upperPrimaryKey.substring(1, upperPrimaryKey.length());

        VelocityContext context = new VelocityContext();
        context.put("className", className);
        context.put("lowerName", lowerName);
        context.put("codeName", codeName);
        context.put("tableName", tableName);
        context.put("bussPackage", buss_package);
        context.put("bizAppPackage", CodeResourceUtil.bizAppPackage);
        context.put("entityPackage", entityPackage);
        context.put("keyType", keyType);
        context.put("upperPrimaryKey", upperPrimaryKey);
        context.put("primaryKey", primaryKey);
        context.put("entityOpenType", CodeResourceUtil.ENTITY_OPEN_TYPE);
        context.put("entitySaveType", CodeResourceUtil.ENTITY_SAVE_TYPE);

        context.put("listWidgetName", listWidgetName);
        context.put("formWidgetName", formWidgetName);
        context.put("searchbarWidgetName", searchbarWidgetName);
        context.put("dialogWidgetName", dialogWidgetName);
        context.put("serviceConfigName", serviceConfigName);
        context.put("formConfigName", formConfigName);
        context.put("searchbarAction", searchbarAction);
        
        context.put("objectEntry", objectEntry);
        List<ColumnData> columnDatas = new ArrayList<ColumnData>();
        try {
            columnDatas = createBean.getColumnDatas(tableName);
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        context.put("entityImportClasses", createBean.getEntityImportClasses(columnDatas));

        try {
            context.put("columnDatas", createBean.getColumnDatas(tableName));
        }
        catch (Exception e) {
            e.printStackTrace();
            return;
        }

        CommonPageParser.writerPage(context, "java/LdapEntityTemplate.ftl", pckPath, beanPath);
        CommonPageParser.writerPage(context, "java/PageTemplate.ftl", pckPath, modelPath);

        if (!CodeResourceUtil.MAPPER_XML_ONLY.equals("true")) {
            CommonPageParser.writerPage(context, "java/LdapDaoTemplate.ftl", pckPath, mapperPath);
            CommonPageParser.writerPage(context, "java/LdapServiceTemplate.ftl", pckPath, servicePath);
            //            CommonPageParser.WriterPage(context, "junit/ServiceJunitTemplate.ftl", testPckPath, serviceJUnitPath);
            CommonPageParser.writerPage(context, "java/LdapControllerTemplate.ftl", pckPath, controllerPath);
        }

        if (!CodeResourceUtil.BACKEND_ONLY.equals("true")) {
            CommonPageParser.writerPage(context, "js/ldapList.js.ftl", listPath, listWidgetName + ".js");
            CommonPageParser.writerPage(context, "js/templates/ldapList.html.ftl", listPath + "templates\\", listWidgetName + ".html");
            CommonPageParser.writerPage(context, "js/searchbar/listSearchBar.js.ftl", searchbarPath, searchbarWidgetName + ".js");
            CommonPageParser.writerPage(context, "js/searchbar/templates/ldapListSearchBar.html.ftl", searchbarPath + "templates\\", searchbarWidgetName
                    + ".html");

            if (CodeResourceUtil.ENTITY_OPEN_TYPE.equals("form")) {
                CommonPageParser.writerPage(context, "js/form.js.ftl", listPath, formWidgetName + ".js");
                CommonPageParser.writerPage(context, "js/templates/form.html.ftl", listPath + "templates\\", formWidgetName + ".html");
            }
            else if (CodeResourceUtil.ENTITY_OPEN_TYPE.equals("dialog")) {
                CommonPageParser.writerPage(context, "js/dialog/listDialog.js.ftl", dialogPath, dialogWidgetName + ".js");
                CommonPageParser.writerPage(context, "js/dialog/templates/ldapListDialog.html.ftl", dialogPath + "templates\\", dialogWidgetName
                        + ".html");
            }

            CommonPageParser.writerPage(context, "js/config/service.json.ftl", configPath, serviceConfigName + ".json");
            CommonPageParser.writerPage(context, "js/config/searchBar.json.ftl", configPath, searchbarWidgetName + ".json");
            //            CommonPageParser.WriterPage(context, "js/config/form.json.ftl", configPath, formConfigName + ".json");
        }
        log.info("----------------------------代码生成完毕---------------------------");
    }

    public static String getProjectPath() {
        String path = (new StringBuilder(String.valueOf(System.getProperty("user.dir").replace("\\", "/")))).append("/").toString();
        return path;
    }

    static {
        url = CodeResourceUtil.LDAP_URL;
        username = CodeResourceUtil.LDAP_USERNAME;
        passWord = CodeResourceUtil.LDAP_PASSWORD;
        schemaCn =  CodeResourceUtil.LDAP_SCHEMA_CN;
        buss_package = CodeResourceUtil.bizPackage;
    }
}
